using System.Security.Claims;
using Chroniq.DTOs;
using Chroniq.Models;
using Chroniq.Services.Extensions;
using Chroniq.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Chroniq.Services;

public class SettingsService(AppDbContext context, UserService userService)
{
    private readonly Guid _userId = userService.UserId;

    public async Task<Settings?> Get()
    {
        return await context.Settings.FirstOrDefaultAsync(x => x.User.Id == _userId);
    }

    public async Task<Settings?> Save(SettingsDto dto)
    {
        var settings = await context.Settings.FirstOrDefaultAsync(x => x.User.Id == _userId);
        if (settings == null)
            return null;

        settings.EnableNotifications = dto.EnableNotifications;
        settings.NotifyBefore = dto.NotifyIn;
        settings.TelegramChatId = dto.TelegramChatId;

        await context.SaveChangesAsync();
        return settings;
    }
}