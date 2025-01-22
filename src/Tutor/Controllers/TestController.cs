using Microsoft.AspNetCore.Mvc;
using Tutor.Storage;

namespace Tutor.Controllers;

[Route("api/test")]
[ApiController]
public class TestController(AppDbContext context)
{
    [Route("test")]
    public object Test()
    {
        return context.Lessons;
    }
}