using Microsoft.Extensions.Configuration;

namespace Chroniq.Services.WorkCalendar;

public static class WorkCalendarConfigurationExtensions
{
    public static string GetWorkCalendarUrlOrThrow(this IConfiguration configuration) =>
        configuration.GetSection("WorkCalendarSettings:Url").Value ?? throw new Exception("WorkCalendarSettings:Url not found");
}