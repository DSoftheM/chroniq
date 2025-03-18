using Chroniq.DTOs.Auth;
using Chroniq.Services.Auth;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController(AuthService authService) : Controller
{
    private static CookieOptions AccessTokenCookiesOptions => new()
    {
        HttpOnly = true,
        Expires = DateTime.UtcNow.Add(AuthOptions.AccessTokenExpiryDuration),
        SameSite = SameSiteMode.None,
        Secure = true
    };

    private static CookieOptions RefreshTokenCookiesOptions =>
        new() { Path = "api/auth/refresh", HttpOnly = true, Expires = AuthOptions.RefreshTokenExpiryTime };

    [Route("login")]
    [HttpPost]
    [AllowAnonymous]
    public async Task Login(AuthLoginPayload dto)
    {
        var tokens = await authService.Login(dto);
        Response.Cookies.Append("access_token", tokens.AccessToken, AccessTokenCookiesOptions);
        Response.Cookies.Append("refresh_token", tokens.RefreshToken, RefreshTokenCookiesOptions);
    }

    [Route("register")]
    [HttpPost]
    [AllowAnonymous]
    public async Task Register(AuthLoginPayload dto)
    {
        var tokens = await authService.Register(dto);
        Response.Cookies.Append("access_token", tokens.AccessToken, AccessTokenCookiesOptions);
        Response.Cookies.Append("refresh_token", tokens.RefreshToken, RefreshTokenCookiesOptions);
    }

    [Route("refresh")]
    [AllowAnonymous]
    public async Task RefreshTokens()
    {
        var refreshToken = Request.Cookies["refresh_token"]!;
        var tokens = await authService.RefreshTokens(refreshToken);
        Response.Cookies.Append("access_token", tokens.AccessToken, AccessTokenCookiesOptions);
        Response.Cookies.Append("refresh_token", tokens.RefreshToken, RefreshTokenCookiesOptions);
    }

    [Route("test")]
    [AllowAnonymous]
    [HttpPost]
    public ClubMember Test(ClubMember data)
    {
        Console.WriteLine(ModelState.IsValid);
        return data;
    }

    [Route("logout")]
    [HttpGet]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("refresh_token");
        Response.Cookies.Delete("access_token");
        return Ok();
    }
}

public class ClubMember
{
    public string Role { get; set; }
    public required int Number { get; set; }
    public Data Data { get; set; }
}

public class Data
{
    public required int Value { get; set; }
}

public class ClubMemberValidator : AbstractValidator<ClubMember>
{
    public ClubMemberValidator()
    {
        RuleFor(x => x.Role).Length(3, 25);
        RuleFor(x => x.Number).InclusiveBetween(1, 100);
        RuleFor(x => x.Data).SetValidator(new DataValidator());
    }
}

public class DataValidator : AbstractValidator<Data>
{
    public DataValidator()
    {
        RuleFor(x => x.Value).NotNull().InclusiveBetween(20, 30);
    }
}