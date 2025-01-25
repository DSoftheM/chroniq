using Microsoft.AspNetCore.Mvc;
using Chroniq.Models;
using Chroniq.Services;

namespace Chroniq.Controllers;

[Route("api/schedule")]
[ApiController]
public class ScheduleController(ScheduleService scheduleService)
{
    [Route("")]
    public async Task<Schedule> GetSchedule(Period period) => await scheduleService.GetAll(period);
}