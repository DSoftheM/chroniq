using Microsoft.AspNetCore.Mvc;
using Tutor.Models;
using Tutor.Services;

namespace Tutor.Controllers;

[Route("api/schedule")]
[ApiController]
public class ScheduleController(ScheduleService scheduleService)
{
    [Route("")]
    public async Task<Schedule> GetSchedule() => await scheduleService.GetAll();
}