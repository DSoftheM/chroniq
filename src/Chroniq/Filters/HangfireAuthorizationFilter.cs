using Hangfire.Dashboard;

namespace Chroniq.Filters;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        return httpContext.User.Identity is { IsAuthenticated: true, Name: "a" };
    }
}