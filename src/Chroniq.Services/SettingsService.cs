using System.Security.Claims;
using Chroniq.DTOs;
using Chroniq.Models;
using Chroniq.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Chroniq.Services;

public class SettingsService(AppDbContext context)
{
    public async Task<Settings?> Get(HttpContext httpContext)
    {
        var userId = httpContext.User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
        
        return await context.Settings.FirstOrDefaultAsync(x => x.User.Id == Guid.Parse(userId));
    }
    
    public async Task<Settings?> Save(SettingsDto dto, HttpContext httpContext)
    {
        var userId = httpContext.User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
        
        var settings = await context.Settings.FirstOrDefaultAsync(x => x.User.Id == Guid.Parse(userId));
        if (settings == null) return null;

        settings.EnableNotifications = dto.EnableNotifications;
        settings.NotifyBefore = dto.NotifyIn;
        settings.TelegramChatId = dto.TelegramChatId;
        
        await context.SaveChangesAsync();
        return settings;
    }
}