using Microsoft.Extensions.Configuration;
using Telegram.Bot;
using Telegram.Bot.Types;

namespace Chroniq.Services.Notifications;

public class TelegramNotificationService
{
    private readonly TelegramBotClient _bot;

    public TelegramNotificationService(IConfiguration configuration)
    {
        _bot = new(configuration.GetTelegramBotApiKeyOrThrow());
        _bot.OnMessage += async (msg, type) =>
        {
            if (msg.Text is null) return;
            Console.WriteLine($"Received {type} '{msg.Text}' in {msg.Chat}");
        
            if (msg.Text == "/start")
                await _bot.SendMessage(msg.Chat, $"Chat ID: {msg.Chat.Id}");
        };
    }

    public async Task Send(string message, long chatId)
    {
        try
        {
            await _bot.SendMessage(new ChatId(chatId), message);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }
}