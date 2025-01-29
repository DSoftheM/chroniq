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

    public async Task ApplyMockData()
    {
        context.Students.Add(new Student()  
        {
            Name = "John Doe", avatarUrl = "https://picsum.photos/200/300", DefaultPrice = 100,
            Description = "Описание", Id = Guid.NewGuid(), Lessons = []
        });
        await context.SaveChangesAsync();
    }
}