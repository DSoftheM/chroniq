using Microsoft.EntityFrameworkCore;
using Tutor.Models;
using Tutor.Storage;

namespace Tutor.Services;

public class LessonService(AppDbContext context)
{
    public async Task<List<Lesson>> GetAll()
    {
        return await context.Lessons.AsNoTracking().ToListAsync();
    }
    
    public async Task<List<Lesson>> GetByStudentId(Guid id)
    {
        return await context.Lessons.AsNoTracking().Where(x => x.Student.Id == id).ToListAsync();
    }
    
    public async Task<Lesson> Create(LessonSiteDto dto)
    {
        var lesson = new Lesson() { Id = dto.Id, Date = dto.Date, Duration = dto.Duration, Description = dto.Description, Student = dto.Student, Paid = dto.Paid };
        context.Lessons.Add(lesson);
        await context.SaveChangesAsync();
        return lesson;
    }
}