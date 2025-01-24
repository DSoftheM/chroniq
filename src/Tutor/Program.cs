using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Tutor.Services;
using Tutor.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddScoped<ScheduleService>();
builder.Services.AddScoped<LessonService>();
builder.Services.AddScoped<StudentService>();


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

var app = builder.Build();

var dbContext = app.Services.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>();
dbContext.Database.Migrate();

app.MapControllers();

app.UseCors(policyBuilder => { policyBuilder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin(); });

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Run();