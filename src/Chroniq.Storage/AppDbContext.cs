using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Chroniq.Models;

namespace Chroniq.Storage;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Student> Students { get; set; }
    public DbSet<Lesson> Lessons { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}