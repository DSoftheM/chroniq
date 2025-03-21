using Chroniq.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chroniq.Storage.Configurations;

public class StudentOrderConfiguration : IEntityTypeConfiguration<StudentOrder>
{
    public void Configure(EntityTypeBuilder<StudentOrder> builder)
    {
        builder
            .HasOne(x => x.Student)
            .WithOne()
            .HasForeignKey<StudentOrder>(x => x.Id)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}