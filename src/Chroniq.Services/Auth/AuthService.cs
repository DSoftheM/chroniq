using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Chroniq.DTOs.Auth;
using Chroniq.Models;
using Chroniq.Services.Exceptions;
using Chroniq.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Chroniq.Services.Auth;

public class AuthService(AppDbContext context, IConfiguration configuration)
{
    private readonly string _secret = configuration.GetJwtSecretOrThrow();
    private static DateTime RefreshTokenExpiryTime => DateTime.UtcNow.AddDays(7);
    private static TimeSpan AccessTokenExpiryDuration => TimeSpan.FromSeconds(600);

    public async Task<AuthTokens> Login(AuthLoginPayload payload)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Login == payload.Login);

        if (user == null)
            throw new ValidationException("Неправильный логин или пароль");
        if (CreateHash(payload.Password, user.PasswordSalt) != user.PasswordHash)
            throw new ValidationException("Неправильный логин или пароль");

        var accessToken = GenerateAccessToken(user);
        var refreshToken = Guid.NewGuid().ToString();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = RefreshTokenExpiryTime;

        await context.SaveChangesAsync();

        return new AuthTokens
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    public async Task<AuthTokens> Register(AuthLoginPayload payload)
    {
        var existingUser = await context.Users.FirstOrDefaultAsync(x => x.Login == payload.Login);
        if (existingUser != null) throw new ValidationException("Пользователь с таким логином уже существует");

        var salt = Guid.NewGuid().ToString();

        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(salt));

        var user = new User()
        {
            Id = Guid.NewGuid(),
            Login = payload.Login,
            PasswordHash = CreateHash(payload.Password, salt),
            RefreshToken = Guid.NewGuid().ToString(),
            RefreshTokenExpiryTime = RefreshTokenExpiryTime,
            PasswordSalt = salt
        };
        
        var settings = new Settings
        {
            Id = Guid.NewGuid(), UserId = user.Id, EnableNotifications = true,
            NotifyBefore = TimeSpan.FromMinutes(15), TelegramChatId = null
        };

        context.Users.Add(user);
        context.Settings.Add(settings);
        await context.SaveChangesAsync();

        return new AuthTokens
        {
            AccessToken = GenerateAccessToken(user),
            RefreshToken = user.RefreshToken
        };
    }

    private string GenerateAccessToken(User user)
    {
        var jwt = new JwtSecurityToken(
            issuer: AuthOptions.Issuer,
            audience: AuthOptions.Audience,
            claims:
            [
                new Claim(ClaimTypes.Name, user.Login),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            ],
            expires: DateTime.UtcNow.Add(AccessTokenExpiryDuration),
            signingCredentials: new SigningCredentials(
                AuthOptions.GetSymmetricSecurityKey(_secret),
                SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }

    private string CreateHash(string input, string salt)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(salt));
        var bytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }

    public async Task<AuthTokens> RefreshTokens(string refreshToken)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken);

        if (user == null) throw new ValidationException("Токен обновления недействителен");
        if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            throw new ValidationException("Токен обновления недействителен");

        user.RefreshToken = Guid.NewGuid().ToString();
        user.RefreshTokenExpiryTime = RefreshTokenExpiryTime;

        await context.SaveChangesAsync();

        return new AuthTokens
        {
            AccessToken = GenerateAccessToken(user),
            RefreshToken = user.RefreshToken
        };
    }
}