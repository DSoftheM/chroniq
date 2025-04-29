using Chroniq.Models;
using Chroniq.Storage;
using Microsoft.EntityFrameworkCore;

namespace Chroniq.Startup;

public static class DbStartup
{
    public static async Task Run(WebApplication app)
    {
        await Migrate(app);
    }

    private static async Task Migrate(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await context.Database.MigrateAsync();
    }
}