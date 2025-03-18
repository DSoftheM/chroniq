using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Chroniq.Models;
using Chroniq.Services.Exceptions;
using Chroniq.Services.Extensions;
using Chroniq.Storage;
using Microsoft.AspNetCore.Http;

namespace Chroniq.Services;

public class StudentService(AppDbContext context, UserService userService)
{
    private readonly Guid _userId = userService.UserId;

    public async Task<StudentSiteDto> Create(StudentSiteDto dto)
    {
        var user = await context.Users.FirstAsync(x => x.Id == _userId);

        var student = ToModel(dto, user);

        context.Students.Add(student);

        var maxOrder = context.Orders.Any() ? context.Orders.Max(x => x.Order) : 0;
        context.Orders.Add(new StudentOrder() { Student = student, Order = maxOrder + 1 });

        await context.SaveChangesAsync();

        return student.ToSiteDto();
    }

    public async Task<Student> Update(StudentSiteDto dto)
    {
        var student = await context.Students
            .FirstOrDefaultAsync(x => x.Id == dto.Id);

        if (student == null) throw new NotFoundException();

        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == _userId);

        if (user == null)
            throw new NotFoundException();

        student.Name = dto.Name;
        student.AvatarUrl = dto.AvatarUrl;
        student.Description = dto.Description;
        student.DefaultPrice = dto.DefaultPrice;
        student.IsArchived = dto.IsArchived;
        student.User = user;

        await context.SaveChangesAsync();
        return student;
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