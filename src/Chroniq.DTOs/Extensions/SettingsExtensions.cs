using Chroniq.Models;

namespace Chroniq.DTOs.Extensions;

public static class SettingsExtensions
{
    public static SettingsDto ToSiteDto(this Settings settings)
    {
        return new SettingsDto()
        {
            EnableNotifications = settings.EnableNotifications,
            NotifyIn = settings.NotifyBefore,
            TelegramChatId = settings.TelegramChatId
        };
    }
}