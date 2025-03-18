using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Chroniq.Services.Extensions;

public static class HttpContextExtensions
{
    public static Guid GetUserId(this HttpContext httpContext)
    {
        var userIdClaim = httpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            throw new UnauthorizedAccessException("User ID is missing in the token");

        return Guid.Parse(userIdClaim.Value);
    }
}