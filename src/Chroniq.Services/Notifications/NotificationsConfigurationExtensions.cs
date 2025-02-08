using Microsoft.Extensions.Configuration;

namespace Chroniq.Services.Notifications;

public static class NotificationsConfigurationExtensions
{
    public static string GetTelegramPortOrThrow(this IConfiguration configuration) =>
        configuration.GetSection("TelegramBotPort").Value ?? throw new Exception("Telegram bot port not found");
}