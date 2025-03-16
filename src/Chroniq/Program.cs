using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Chroniq.Converters;
using Chroniq.Extensions;
using Chroniq.Filters;
using Chroniq.Services;
using Chroniq.Services.Auth;
using Chroniq.Services.FileCleanup;
using Chroniq.Services.FileService;
using Chroniq.Services.Notifications;
using Chroniq.Services.WorkCalendar;
using Chroniq.Startup;
using Chroniq.Storage;
using Hangfire;
using Serilog;

var builder = WebApplication.CreateBuilder();

var jwtSecret = builder.Configuration.GetJwtSecretOrThrow();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
var workCalendarUrl = builder.Configuration.GetWorkCalendarUrlOrThrow();

builder.Services.AddControllers().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    x.JsonSerializerOptions.Converters.Add(new JsonDateTimeConverter());
});

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/app.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Services.AddSingleton<TelegramNotificationService>();
builder.Services.AddScoped<ScheduleService>();
builder.Services.AddScoped<LessonService>();
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<WorkCalendarService>();
builder.Services.AddScoped<HttpClient>();
builder.Services.AddScoped<SettingsService>();
builder.Services.AddScoped<FileService>();
builder.Services.AddHostedService<FileCleanupService>();

builder.Services.AddAppHealthChecks(connectionString, workCalendarUrl);
builder.Services.AddAppAuthentication(jwtSecret);
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddHangfire(configuration =>
{
    configuration.UseStorage(new Hangfire.PostgreSql.PostgreSqlStorage(connectionString));
});
builder.Services.AddHangfireServer();

builder.Host.UseSerilog(); 

var app = builder.Build();

await DbStartup.Run(app);

if (app.Environment.IsDevelopment())
{
    app.UseCors(policyBuilder =>
    {
        policyBuilder.AllowAnyHeader().AllowAnyMethod().WithOrigins(["http://localhost:5173"]).AllowCredentials();
    });
}

app.UseAuthentication();
app.UseAuthorization();
app.UseHangfireDashboard("/hangfire", new DashboardOptions()
{
    Authorization = [new HangfireAuthorizationFilter()]
});
app.MapControllers().RequireAuthorization();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();

app.Run();