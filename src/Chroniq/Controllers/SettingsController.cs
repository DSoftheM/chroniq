using Chroniq.DTOs;
using Chroniq.Services;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[Route("api/settings")]
[ApiController]
public class SettingsController(SettingsService settingsService) : ControllerBase
{
    [Route("")]
    public object GetSettings()
    {
        return settingsService.Get(HttpContext);
    }
    
    [Route("save")]
    public object SaveSettings(SettingsDto dto)
    {
        return settingsService.Save(dto, HttpContext);
    }
}