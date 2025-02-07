using Chroniq.DTOs;
using Chroniq.Models;
using Chroniq.Storage;
using Microsoft.EntityFrameworkCore;

namespace Chroniq.Services;

public class SettingsService(AppDbContext context)
{
    public async Task<Settings?> Get(Guid userId)
    {
        return await context.Settings.FirstOrDefaultAsync(x => x.User.Id == userId);
    }
    
    public async Task<Settings?> Update(SettingsDto dto)
    {
        var settings = await context.Settings.FirstOrDefaultAsync(x => x.User.Id == dto.UserId);
        if (settings == null) return null;

        settings.EnableNotifications = dto.EnableNotifications;
        settings.NotifyBefore = dto.NotifyBefore;
        settings.TelegramChatId = dto.TelegramChatId;
        
        await context.SaveChangesAsync();
        return settings;
    }
}