using Microsoft.EntityFrameworkCore;
using Chroniq.Models;
using Chroniq.Services.Exceptions;
using Chroniq.Storage;
using Hangfire;

namespace Chroniq.Services;

public class LessonService(AppDbContext context, StudentService studentService)
{
    public async Task<List<Lesson>> GetAll()
    {
        return await context.Lessons.AsNoTracking().ToListAsync();
    }

    public async Task<List<Lesson>> GetByStudentId(Guid id)
    {
        return await context.Lessons.Where(x => x.Student.Id == id).ToListAsync();
    }

    public async Task<Lesson> Create(CreateLessonSiteDto dto, Guid userId)
    {
        var student = await context.Students
            .Include(student => student.User)
            .Where(s => s.User.Id == userId)
            .FirstOrDefaultAsync(x => x.Id == dto.Student.Id);

        if (student == null)
            throw new NotFoundException("Student not found");

        var lesson = new Lesson()
        {
            Id = dto.Id, Date = dto.Date, Duration = dto.Duration, Description = dto.Description, Student = student,
            Paid = dto.Paid,
        };

        context.Lessons.Add(lesson);

        var settings = await context.Settings.FirstOrDefaultAsync(x => x.User.Id == userId);
        if (settings == null)
            throw new NotFoundException("Settings not found");  

        if (settings.TelegramChatId != null)
        {
            BackgroundJob.Schedule<TelegramNotificationService>(
                (service) => service.Send($"{student.Name} {lesson.Date:HH:mm} - {lesson.Date.Add(lesson.Duration):HH:mm}", settings.TelegramChatId.Value),
                dto.Date.Add(settings.NotifyBefore * -1));
        }

        await context.SaveChangesAsync();

        return lesson;
    }

    public async Task<Lesson> Update(LessonSiteDto dto)
    {
        var foundLesson = await context.Lessons
            .Include(lesson => lesson.Student)
            .FirstOrDefaultAsync(x => x.Id == dto.Id);

        if (foundLesson == null) throw new NotFoundException();

        foundLesson.Description = dto.Description;
        foundLesson.Paid = dto.Paid;
        foundLesson.Date = dto.Date;
        foundLesson.Duration = dto.Duration;

        await context.SaveChangesAsync();
        return foundLesson;
    }

    public async Task Delete(Guid id)
    {
        var lesson = await context.Lessons.FirstOrDefaultAsync(x => x.Id == id);
        if (lesson == null) throw new NotFoundException();
        context.Lessons.Remove(lesson);
        await context.SaveChangesAsync();
    }
}