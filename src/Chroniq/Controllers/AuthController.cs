using Chroniq.DTOs.Auth;
using Chroniq.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController(AuthService authService) : Controller
{
    [Route("login")]
    [HttpPost]
    public async Task Login(AuthLoginPayload dto)
    {
        var tokens = await authService.Login(dto);
        Response.Cookies.Append("access_token", tokens.AccessToken, new CookieOptions() { Secure = false, SameSite = SameSiteMode.None, HttpOnly = false, Path = "/", Domain = "127.0.0.1" });
    }

    [Route("register")]
    [HttpPost]
    public async Task Register(AuthLoginPayload dto)
    {
        var tokens = await authService.Register(dto);
        Response.Cookies.Append("access_token", tokens.AccessToken);
    }

    [Route("refresh")]
    [HttpPost]
    public async Task RefreshTokens([FromBody] string refreshToken)
    {
        var tokens = await authService.RefreshTokens(refreshToken);
        Response.Cookies.Append("access_token", tokens.AccessToken);
    }

    [Route("logout")]
    [HttpGet]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token");
        return Ok();
    }
}