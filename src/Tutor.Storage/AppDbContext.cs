using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Tutor.Models;

namespace Tutor.Storage;

public class AppDbContext : DbContext
{
    public DbSet<Student> Students { get; set; }
    public DbSet<Lesson> Lessons { get; set; }

    public AppDbContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}