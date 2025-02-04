using System.Collections.ObjectModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Chroniq.Controllers;

[Route("health")]
[ApiController]
[AllowAnonymous]
public class HealthController(HealthCheckService healthCheckService)
{
    [HttpGet]
    public async Task<HealthCheckResult> Get()
    {
        var report = await healthCheckService.CheckHealthAsync();

        return report.Status == HealthStatus.Healthy
            ? HealthCheckResult.Healthy(null, report.Entries.ToDictionary(x => x.Key, x => x.Value as object))
            : HealthCheckResult.Unhealthy();
    }
}