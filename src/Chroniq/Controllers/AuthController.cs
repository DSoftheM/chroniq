using Chroniq.DTOs.Auth;
using Chroniq.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController(AuthService authService) : Controller
{
    private static readonly CookieOptions CookiesOptions = new() {   };

    [Route("login")]
    [HttpPost]
    public async Task Login(AuthLoginPayload dto)
    {
        var tokens = await authService.Login(dto);
        Response.Cookies.Append("access_token", tokens.AccessToken, CookiesOptions);
    }

    [Route("register")]
    [HttpPost]
    public async Task Register(AuthLoginPayload dto)
    {
        var tokens = await authService.Register(dto);
        Response.Cookies.Append("access_token", tokens.AccessToken, CookiesOptions);
    }

    [Route("refresh")]
    [HttpPost]
    public async Task RefreshTokens([FromBody] string refreshToken)
    {
        var tokens = await authService.RefreshTokens(refreshToken);
        Response.Cookies.Append("access_token", tokens.AccessToken, CookiesOptions);
    }

    [Route("logout")]
    [HttpGet]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token");
        return Ok();
    }
}