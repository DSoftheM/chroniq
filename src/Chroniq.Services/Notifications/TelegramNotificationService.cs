using System.Text.Json;
using Chroniq.Services.Notifications;
using ChroniqBot;
using Microsoft.Extensions.Configuration;

namespace Chroniq.Services;

public class TelegramNotificationService(IConfiguration configuration)
{
    public async Task Send(string message, long chatId)
    {
        var client = new HttpClient();
        var telegramPort = configuration.GetTelegramPortOrThrow();
        var msg = new TelegramMessage() { ChatId = chatId, Text = message };

        await client.PostAsync($"http://localhost:{telegramPort}/send",
            new StringContent(JsonSerializer.Serialize(msg)));
    }
}