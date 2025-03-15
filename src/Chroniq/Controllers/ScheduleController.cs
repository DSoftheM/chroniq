using Chroniq.DTOs;
using Microsoft.AspNetCore.Mvc;
using Chroniq.Models;
using Chroniq.Services;

namespace Chroniq.Controllers;

[Route("api/schedule")]
[ApiController]
public class ScheduleController(ScheduleService scheduleService) : ControllerBase
{
    [Route("")]
    public async Task<Schedule> GetSchedule(Period period, bool archived) =>
        await scheduleService.GetAll(period, archived, HttpContext);
    
    [Route("change-order")]
    [HttpPost]
    public async Task ChangeOrder(ChangeOrderDto dto) =>
        await scheduleService.ChangeOrder(dto);
}

