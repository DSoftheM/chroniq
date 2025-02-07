using Chroniq.DTOs;
using Chroniq.Services;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[Route("api/settings")]
[ApiController]
public class SettingsController(SettingsService settingsService)
{
    [Route("{userId:guid}")]
    public object GetSettings(Guid userId)
    {
        return settingsService.Get(userId);
    }
    
    [Route("update")]
    public object UpdateSettings(SettingsDto dto)
    {
        return settingsService.Update(dto);
    }
}