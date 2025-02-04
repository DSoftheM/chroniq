using Microsoft.Extensions.DependencyInjection;

namespace Chroniq.Services.Configuration;

public static class ServiceCollectionExtensions
{
    public static void AddConfigurations(this IServiceCollection self)
    {
        // self.AddConfigurations<LoggingConfiguration>();
    }
}