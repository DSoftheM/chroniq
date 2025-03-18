using Microsoft.AspNetCore.Mvc;
using Chroniq.Storage;
using Chroniq.Models;
using Chroniq.Services;

namespace Chroniq.Controllers;

[Route("api/student")]
[ApiController]
public class StudentController(StudentService studentService) : ControllerBase
{
    [Route("")]
    [HttpPost]
    public Task CreateStudent(StudentSiteDto student)
    {
        return studentService.Create(student);
    }

    [Route("update")]
    [HttpPost]
    public Task UpdateStudent(StudentSiteDto student)
    {
        return studentService.Update(student);
    }
}