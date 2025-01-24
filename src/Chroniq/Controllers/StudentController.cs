using Microsoft.AspNetCore.Mvc;
using Chroniq.Storage;
using Chroniq.Models;
using Chroniq.Services;

namespace Chroniq.Controllers;

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