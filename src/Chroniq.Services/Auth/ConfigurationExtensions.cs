using Microsoft.Extensions.Configuration;

namespace Chroniq.Services.Auth;

public static class AuthConfigurationExtensions
{
    public static string GetJwtSecretOrThrow(this IConfiguration configuration) =>
        configuration.GetSection("Authentication:Jwt:Secret").Value ?? throw new Exception("Secret not found");
}