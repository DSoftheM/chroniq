using Chroniq.Models;
using Chroniq.Storage;
using Microsoft.EntityFrameworkCore;

namespace Chroniq.Startup;

public static class DbStartup
{
    public static async Task Run(WebApplication app)
    {
        await Migrate(app);
        await InitializeOrders(app);
    }

    private static async Task Migrate(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await context.Database.MigrateAsync();
    }

    private static async Task InitializeOrders(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var students = await context.Students.OrderBy(s => s.Name).ToListAsync();

        var initialOrder = context.Orders.Any() ? context.Orders.Max(o => o.Order) + 1 : 1;

        foreach (var student in students)
        {
            var order = await context.Orders.FirstOrDefaultAsync(x => x.Id == student.Id);
            if (order != null) continue;
            
            var studentOrder = new StudentOrder()
            {
                Id = student.Id,
                Student = student,
                Order = initialOrder++
            };

            await context.Orders.AddAsync(studentOrder);
        }

        await context.SaveChangesAsync();
    }
}