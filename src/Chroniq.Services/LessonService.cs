using Microsoft.EntityFrameworkCore;
using Chroniq.Models;
using Chroniq.Services.Exceptions;
using Chroniq.Storage;

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

    public async Task<Lesson> Create(CreateLessonSiteDto dto)
    {
        var student = await studentService.GetById(dto.Student.Id);
        if (student == null) throw new NotFoundException();
        var lesson = new Lesson()
        {
            Id = dto.Id, Date = dto.Date, Duration = dto.Duration, Description = dto.Description, Student = student,
            Paid = dto.Paid,
        };
        context.Lessons.Add(lesson);
        await context.SaveChangesAsync();
        return lesson;
    }

    public async Task<Lesson> Update(LessonSiteDto dto)
    {
        var foundLesson = await context.Lessons
            .Include(lesson => lesson.Student)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == dto.Id);
        
        if (foundLesson == null) throw new NotFoundException();

        var lesson = new Lesson() 
        {
            Id = dto.Id, Date = dto.Date, Duration = dto.Duration, Description = dto.Description,
            Student = foundLesson.Student,
            Paid = dto.Paid,
        };

        context.Entry(lesson).State = EntityState.Modified;

        await context.SaveChangesAsync();
        return lesson;
    }
}