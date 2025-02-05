using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Chroniq.Models;
using Chroniq.Services.Exceptions;
using Chroniq.Storage;
using Microsoft.AspNetCore.Http;

namespace Chroniq.Services;

public class StudentService(AppDbContext context)
{
    public async Task<StudentSiteDto> Create(StudentSiteDto student, HttpContext httpContext)
    {
        var userId = httpContext.User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
        var user = await context.Users.FirstAsync(x => x.Id == Guid.Parse(userId));

        context.Students.Add(ToModel(student, user));
        await context.SaveChangesAsync();
        return student;
    }

    public async Task<Student> Update(StudentSiteDto dto, HttpContext httpContext)
    {
        var student = await context.Students
            .AsNoTracking()
            .Include(student => student.Lessons)
            .FirstOrDefaultAsync(x => x.Id == dto.Id);

        if (student == null) throw new NotFoundException();

        var userId = httpContext.User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
        var user = await context.Users.FirstAsync(x => x.Id == Guid.Parse(userId));

        var newStudent = new Student()
        {
            Id = dto.Id, Name = dto.Name, AvatarUrl = dto.AvatarUrl, Description = dto.Description,
            Lessons = student.Lessons,
            User = user,
            DefaultPrice = dto.DefaultPrice, IsArchived = dto.IsArchived,
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

    private static Student ToModel(StudentSiteDto dto, User user)
    {
        return new Student()
        {
            Id = dto.Id, Name = dto.Name, AvatarUrl = dto.AvatarUrl, Description = dto.Description, Lessons = [],
            DefaultPrice = dto.DefaultPrice, IsArchived = false, User = user
        };
    }
}