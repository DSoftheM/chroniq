using Microsoft.AspNetCore.Mvc;
using Tutor.Storage;
using Tutor.Models;
using Tutor.Services;

namespace Tutor.Controllers;

[Route("api/student")]
[ApiController]
public class StudentController(StudentService studentService)
{
    [Route("")]
    [HttpPost]
    public Task CreateStudent(Student student)
    {
        return studentService.Create(student);
    }
}