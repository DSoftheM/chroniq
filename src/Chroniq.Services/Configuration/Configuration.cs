namespace Chroniq.Services.Configuration;

public class Configuration
{
    public required LoggingConfiguration Logging { get; set; }
    public required ConnectionStringsConfiguration ConnectionStrings { get; set; }
    public required AuthenticationConfiguration Authentication { get; set; }
    public required WorkCalendarConfiguration WorkCalendarSettings { get; set; }
}

public class LoggingConfiguration
{
    public required string LogLevel { get; set; }
}

public class LogLevelConfiguration
{
    public required string Default { get; set; }
    public required string MicrosoftAspNetCore { get; set; }
}


public class ConnectionStringsConfiguration
{
    public required string DefaultConnection { get; set; }
}

public class AuthenticationConfiguration
{
    public required JwtConfiguration Jwt { get; set; }
}

public class JwtConfiguration
{
    public required string Secret { get; set; }
}

public class WorkCalendarConfiguration
{
    public required string Url { get; set; }
}