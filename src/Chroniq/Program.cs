using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Chroniq.Converters;
using Chroniq.Extensions;
using Chroniq.Filters;
using Chroniq.Services;
using Chroniq.Services.Auth;
using Chroniq.Services.Notifications;
using Chroniq.Services.WorkCalendar;
using Chroniq.Storage;
using Hangfire;

var builder = WebApplication.CreateBuilder();

var jwtSecret = builder.Configuration.GetJwtSecretOrThrow();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
var workCalendarUrl = builder.Configuration.GetWorkCalendarUrlOrThrow();

builder.Services.AddControllers().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    x.JsonSerializerOptions.Converters.Add(new JsonDateTimeConverter());
});

builder.Services.AddSingleton<TelegramNotificationService>();
builder.Services.AddScoped<ScheduleService>();
builder.Services.AddScoped<LessonService>();
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<WorkCalendarService>();
builder.Services.AddScoped<HttpClient>();
builder.Services.AddScoped<SettingsService>();
builder.Services.AddScoped<FileService>();

builder.Services.AddAppHealthChecks(connectionString, workCalendarUrl);
builder.Services.AddAppAuthentication(jwtSecret);
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddHangfire(configuration =>
{
    configuration.UseStorage(new Hangfire.PostgreSql.PostgreSqlStorage(connectionString));
});
builder.Services.AddHangfireServer();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
}

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
app.UseHttpsRedirection();

app.Run();