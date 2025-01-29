using Chroniq.Services;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[Route("api/admin")]
[ApiController]
public class AdminController(AdminService adminService)
{
    [Route("delete-all-lessons")]
    public Task DeleteAllLessons() => adminService.DeleteAllLessons();
}