using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Chroniq.Models;

namespace Chroniq.Storage.Configurations;

public class UserFileConfiguration : IEntityTypeConfiguration<UserFile>
{
    public void Configure(EntityTypeBuilder<UserFile> builder)
    {
        builder.HasKey(x => x.FileName);

        builder
            .HasOne(x => x.User)
            .WithMany();
    }
}