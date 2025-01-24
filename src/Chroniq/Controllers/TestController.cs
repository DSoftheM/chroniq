using Microsoft.AspNetCore.Mvc;
using Chroniq.Storage;

namespace Chroniq.Controllers;

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