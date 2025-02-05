using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Chroniq;

public static class AuthOptions
{
    public const string Issuer = "ChroniqAuthServer";
    public const string Audience = "ChroniqAuthClient";
    
    public static SymmetricSecurityKey GetSymmetricSecurityKey(string key) => new (Encoding.UTF8.GetBytes(key));
}