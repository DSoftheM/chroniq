using Microsoft.EntityFrameworkCore;
using Tutor.Models;
using Tutor.Services.Exceptions;
using Tutor.Storage;

namespace Tutor.Services;

public class StudentService(AppDbContext context)
{
    public async Task<Student> Create(Student student)
    {
        context.Students.Add(student);
        await context.SaveChangesAsync();
        return student;
    }
    
    public async Task<Student> Update(Student dto)
    {
        var student = await context.Students.FirstOrDefaultAsync(x => x.Id == dto.Id);
        if (student == null) throw new NotFoundException();
        
        student.Name = dto.Name;
        student.avatarUrl = dto.avatarUrl;
        student.Description = dto.Description;
        
        await context.SaveChangesAsync();

        return student;
    }
    
    public async Task<List<Student>> GetAll()
    {
        return await context.Students.AsNoTracking().ToListAsync();
    }
}