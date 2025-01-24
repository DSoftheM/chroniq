using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Chroniq.Models;

namespace Chroniq.Storage;

public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
{
    public void Configure(EntityTypeBuilder<Lesson> builder)
    {
        builder.HasOne(x => x.Student).WithMany(x => x.Lessons);
    }
}