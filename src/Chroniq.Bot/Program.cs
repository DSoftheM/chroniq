using System.Net;
using System.Text.Json;
using ChroniqBot;
using Microsoft.Extensions.Configuration;
using Telegram.Bot;
using Telegram.Bot.Types;

var builder = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false);

var configurationRoot = builder.Build();
var config = configurationRoot.Get<Configuration>()!;

var server = new HttpListener();
server.Prefixes.Add($"http://localhost:{config.TelegramBotPort}/");
server.Start();

var bot = new TelegramBotClient(config.TelegramBotApiKey);

bot.OnMessage += async (msg, type) =>
{
    if (msg.Text is null) return;
    Console.WriteLine($"Received {type} '{msg.Text}' in {msg.Chat}");

    if (msg.Text == "/start")
        await bot.SendMessage(msg.Chat, $"Chat ID: {msg.Chat.Id}");
};

Console.WriteLine($"Bot started on {config.TelegramBotPort}");

while (true)
{
    var context = await server.GetContextAsync();
    context.Response.StatusCode = (int)HttpStatusCode.OK;

    if (context.Request.Url.LocalPath == "/send")
    {
        HandleSend();
    }

    context.Response.Close();

    async void HandleSend()
    {
        var message = await new StreamReader(context.Request.InputStream).ReadToEndAsync();
        var sendMessageDto = JsonSerializer.Deserialize<TelegramMessage>(message);

        if (sendMessageDto == null)
            throw new Exception("Invalid message");

        var chatId = new ChatId(sendMessageDto.ChatId);
        Console.WriteLine($"Received message: \"{sendMessageDto.Text}\" in {chatId}");

        try
        {
            await bot.SendMessage(sendMessageDto.ChatId, sendMessageDto.Text);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }
}