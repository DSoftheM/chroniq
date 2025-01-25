using Microsoft.EntityFrameworkCore;
using Chroniq.Models;
using Chroniq.Services.Exceptions;
using Chroniq.Storage;

namespace Chroniq.Services;

public class StudentService(AppDbContext context)
{
    public async Task<StudentSiteDto> Create(StudentSiteDto student)
    {
        context.Students.Add(ToModel(student));
        await context.SaveChangesAsync();
        return student;
    }

    public async Task<Student> Update(StudentSiteDto dto)
    {
        var student = await context.Students
            .AsNoTracking()
            .Include(student => student.Lessons)
            .FirstOrDefaultAsync(x => x.Id == dto.Id);
        
        if (student == null) throw new NotFoundException();

        var newStudent = new Student()
        {
            Id = dto.Id, Name = dto.Name, avatarUrl = dto.avatarUrl, Description = dto.Description,
            Lessons = student.Lessons,
            DefaultPrice = dto.DefaultPrice
        };

        context.Entry(newStudent).State = EntityState.Modified;

        await context.SaveChangesAsync();
        return student;
    }

    public async Task<List<Student>> GetAll()
    {
        return await context.Students.AsNoTracking().ToListAsync();
    }

    public async Task<Student?> GetById(Guid id)
    {
        return await context.Students.FirstOrDefaultAsync(x => x.Id == id);
    }

    private static Student ToModel(StudentSiteDto dto)
    {
        return new Student()
        {
            Id = dto.Id, Name = dto.Name, avatarUrl = dto.avatarUrl, Description = dto.Description, Lessons = [],
            DefaultPrice = dto.DefaultPrice
        };
    }
}