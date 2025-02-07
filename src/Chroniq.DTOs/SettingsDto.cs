namespace Chroniq.DTOs;

public class SettingsDto
{
    public Guid UserId { get; set; }
    public bool EnableNotifications { get; set; }
    public TimeSpan NotifyBefore { get; set; }
    public long TelegramChatId { get; set; }
}