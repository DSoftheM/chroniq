using Chroniq.DTOs;
using Chroniq.Models;
using Chroniq.Services;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[Route("api/schedule")]
[ApiController]
public class ScheduleController(ScheduleService scheduleService) : ControllerBase
{
    [Route("")]
    public async Task<Schedule> GetSchedule(Period period, bool archived)
    {
        return await scheduleService.GetAll(period, archived);
    }

    [Route("change-order")]
    [HttpPost]
    public async Task ChangeOrder(ChangeOrderDto dto)
    {
        await scheduleService.ChangeOrder(dto);
    }
}