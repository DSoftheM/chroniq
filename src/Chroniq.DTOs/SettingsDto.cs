namespace Chroniq.DTOs;

public class SettingsDto
{
    public bool EnableNotifications { get; set; }
    public TimeSpan NotifyIn { get; set; }
    public long TelegramChatId { get; set; }
}