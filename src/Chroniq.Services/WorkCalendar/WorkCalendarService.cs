using System.Text.Json;
using Chroniq.DTOs;
using Microsoft.Extensions.Configuration;

namespace Chroniq.Services.WorkCalendar;

public class WorkCalendarService(
    HttpClient httpClient,
    IConfiguration configuration)
{
    private const string FileName = "work-calendar.json";
    private static readonly JsonSerializerOptions Options = new() { PropertyNameCaseInsensitive = true };

    public async Task<WorkCalendarSiteDto?> GetWorkCalendar()
    {
        var file = new FileInfo(FileName);

        if (!file.Exists)
            return await SaveFile();

        var json = await File.ReadAllTextAsync(FileName);
        return JsonSerializer.Deserialize<WorkCalendarSiteDto?>(json, Options);
    }

    private async Task<WorkCalendarSiteDto> GetWorkCalendarFromApi()
    {
        var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10)).Token;

        try
        {
            var response = await httpClient.GetAsync(configuration.GetWorkCalendarUrlOrThrow(), cts);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<WorkCalendarSiteDto?>(json, Options) ?? throw new Exception("");
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            throw;
        }
    }

    private async Task<WorkCalendarSiteDto> SaveFile()
    {
        var workCalendar = await GetWorkCalendarFromApi();
        await File.WriteAllTextAsync(FileName, JsonSerializer.Serialize(workCalendar, Options));
        return workCalendar;
    }
}