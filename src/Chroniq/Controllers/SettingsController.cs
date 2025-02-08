using Chroniq.DTOs;
using Chroniq.DTOs.Extensions;
using Chroniq.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[Route("api/settings")]
[ApiController]
public class SettingsController(SettingsService settingsService) : ControllerBase
{
    [Route("")]
    public async Task<SettingsDto?> GetSettings()
    {
        return (await settingsService.Get(HttpContext))?.ToSiteDto() ?? null;
    }
    
    [Route("save")]
    public async Task SaveSettings(SettingsDto dto)
    {
        await settingsService.Save(dto, HttpContext);
    }
}