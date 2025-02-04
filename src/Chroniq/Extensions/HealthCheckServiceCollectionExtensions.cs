using System.Diagnostics;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Chroniq.Extensions;

public static class HealthCheckServiceCollectionExtensions
{
    public static void AddAppHealthChecks(this IServiceCollection self, string connectionString, string workCalendarUrl)
    {
        self.AddHealthChecks()
            .AddCheck("self", () => HealthCheckResult.Healthy())
            .AddNpgSql(connectionString)
            .AddCheck("work calendar api", () => GetWorkCalendarApiHealthResult(workCalendarUrl))
            .AddCheck("resources usage",
                () => HealthCheckResult.Healthy(null,
                    new Dictionary<string, object>
                    {
                        { "cpu usage", $"{GetCpuUsagePercentage():F2}%" },
                        { "memory usage", $"{GetMemoryUsagePercentage():F2}%" }
                    }));
    }

    private static HealthCheckResult GetWorkCalendarApiHealthResult(string workCalendarUrl)
    {
        var uri = new Uri(workCalendarUrl);
        var baseUrl = uri.Scheme + "://" + uri.Host;

        var client = new HttpClient();
        var response = client.GetAsync(baseUrl).Result;
        return response.IsSuccessStatusCode
            ? HealthCheckResult.Healthy(baseUrl)
            : HealthCheckResult.Unhealthy(baseUrl);
    }

    private static double GetCpuUsagePercentage()
    {
        var startTime = DateTime.UtcNow;
        var startCpuUsage = Process.GetCurrentProcess().TotalProcessorTime;
        var stopWatch = new Stopwatch();
        stopWatch.Start();

        Thread.Sleep(1000);

        stopWatch.Stop();
        var endTime = DateTime.UtcNow;
        var endCpuUsage = Process.GetCurrentProcess().TotalProcessorTime;

        var cpuUsedMs = (endCpuUsage - startCpuUsage).TotalMilliseconds;
        var totalMsPassed = (endTime - startTime).TotalMilliseconds;
        var cpuUsageTotal = cpuUsedMs / (Environment.ProcessorCount * totalMsPassed);

        return cpuUsageTotal * 100;
    }

    private static double GetMemoryUsagePercentage()
    {
        var process = Process.GetCurrentProcess();
        var workingSet = process.WorkingSet64;
        var totalMemory = process.VirtualMemorySize64;
        var memoryUsagePercentage = workingSet / (double)totalMemory * 100;
        return memoryUsagePercentage;
    }
}