using Microsoft.Extensions.Configuration;

namespace Chroniq.Services.Notifications;

public static class NotificationsConfigurationExtensions
{
    public static string GetTelegramBotApiKeyOrThrow(this IConfiguration self)
    {
        return self.GetSection("TelegramBotApiKey").Value ?? throw new Exception("Telegram bot api key not found");
    }
}