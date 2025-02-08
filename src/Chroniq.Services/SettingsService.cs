using System.Security.Claims;
using Chroniq.DTOs;
using Chroniq.Models;
using Chroniq.Services.Extensions;
using Chroniq.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Chroniq.Services;

public class SettingsService(AppDbContext context)
{
    public async Task<Settings?> Get(HttpContext httpContext)
    {
        var userId = httpContext.GetUserId();
        return await context.Settings.FirstOrDefaultAsync(x => x.User.Id == userId);
    }
    
    public async Task<Settings?> Save(SettingsDto dto, HttpContext httpContext)
    {
        var userId = httpContext.GetUserId();
        
        var settings = await context.Settings.FirstOrDefaultAsync(x => x.User.Id == userId);
        if (settings == null) 
            return null;

        settings.EnableNotifications = dto.EnableNotifications;
        settings.NotifyBefore = dto.NotifyIn;
        settings.TelegramChatId = dto.TelegramChatId;
        
        await context.SaveChangesAsync();
        return settings;
    }
}