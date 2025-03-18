using System.Security.Claims;
using Chroniq.Services.Extensions;
using Microsoft.AspNetCore.Http;

namespace Chroniq.Services;

public class UserService(IHttpContextAccessor httpContextAccessor)
{
    public Guid UserId => httpContextAccessor.HttpContext!.GetUserId();
}