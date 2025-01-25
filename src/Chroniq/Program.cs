using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Chroniq.Converters;
using Chroniq.Services;
using Chroniq.Storage;

// var builder = WebApplication.CreateBuilder(new WebApplicationOptions() { WebRootPath = "Chroniq.Web/wwwroot" });
var builder = WebApplication.CreateBuilder();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    x.JsonSerializerOptions.Converters.Add(new JsonDateTimeConverter());
});
builder.Services.AddScoped<ScheduleService>();
builder.Services.AddScoped<LessonService>();
builder.Services.AddScoped<StudentService>();


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
}

app.MapControllers();
app.UseStaticFiles();
app.UseCors(policyBuilder => { policyBuilder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin(); });

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Run();