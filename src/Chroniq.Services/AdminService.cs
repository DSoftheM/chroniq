using Chroniq.Models;
using Chroniq.Storage;

namespace Chroniq.Services;

public class AdminService(AppDbContext context)
{
    public async Task DeleteAllLessons()
    {
        context.Lessons.RemoveRange(context.Lessons);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAllStudents()
    {
        context.Students.RemoveRange(context.Students);
        await context.SaveChangesAsync();
    }
}