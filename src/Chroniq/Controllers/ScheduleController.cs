using Microsoft.AspNetCore.Mvc;
using Chroniq.Models;
using Chroniq.Services;
using Microsoft.AspNetCore.Authorization;

namespace Chroniq.Controllers;

[Route("api/schedule")]
[ApiController]
public class ScheduleController(ScheduleService scheduleService) : ControllerBase
{
    [Route("")]
    public async Task<Schedule> GetSchedule(Period period, bool archived) =>
        await scheduleService.GetAll(period, archived, HttpContext);
}