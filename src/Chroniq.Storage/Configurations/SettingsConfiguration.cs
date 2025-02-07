using Chroniq.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chroniq.Storage.Configurations;

public class SettingsConfiguration : IEntityTypeConfiguration<Settings>
{
    public void Configure(EntityTypeBuilder<Settings> builder)
    {
        builder.HasOne(x => x.User).WithOne(x => x.Settings).HasForeignKey<Settings>(x => x.UserId);
    }
}