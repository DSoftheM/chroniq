using Chroniq.Services;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[Route("work-calendar")]
[ApiController]
public class WorkCalendarController(WorkCalendarService workCalendarService)
{
    public async Task GetWorkCalendar() => await workCalendarService.GetWorkCalendar();
}