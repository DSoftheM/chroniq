using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Chroniq.Services.Auth;

public static class AuthOptions
{
    public const string Issuer = "ChroniqAuthServer";
    public const string Audience = "ChroniqAuthClient";

    public static DateTime RefreshTokenExpiryTime => DateTime.UtcNow.AddDays(7);
    public static TimeSpan AccessTokenExpiryDuration => TimeSpan.FromMinutes(60);

    public static SymmetricSecurityKey GetSymmetricSecurityKey(string key)
    {
        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    }
}