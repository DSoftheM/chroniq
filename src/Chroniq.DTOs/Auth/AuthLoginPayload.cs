namespace Chroniq.DTOs.Auth;

public class AuthLoginPayload
{
    public required string Login { get; set; }
    public required string Password { get; set; }
}