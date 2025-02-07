namespace Chroniq.Models;

public class Settings
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public bool EnableNotifications { get; set; }
    public TimeSpan NotifyBefore { get; set; }
    public long? TelegramChatId { get; set; }
}