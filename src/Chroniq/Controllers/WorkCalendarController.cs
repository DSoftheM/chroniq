using Chroniq.DTOs;
using Chroniq.Services.WorkCalendar;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[Route("api/work-calendar")]
[ApiController]
public class WorkCalendarController(WorkCalendarService workCalendarService)
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<WorkCalendarSiteDto?> GetWorkCalendar()
    {
        return await workCalendarService.GetWorkCalendar();
    }
}