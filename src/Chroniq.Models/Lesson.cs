namespace Chroniq.Models;

public class Lesson
{
    public required Guid Id { get; set; }
    public required TimeSpan Duration { get; set; }
    public required DateTime Date { get; set; }
    public required string Description { get; set; } = string.Empty;
    public required Student Student { get; set; }
    public required bool Paid { get; set; }
}

public class LessonSiteDto
{
    public required Guid Id { get; set; }
    public required TimeSpan Duration { get; set; }
    public required DateTime Date { get; set; }
    public required string Description { get; set; } = string.Empty;
    public required bool Paid { get; set; }
}

public class CreateLessonSiteDto
{
    public required Guid Id { get; set; }
    public required TimeSpan Duration { get; set; }
    public required DateTime Date { get; set; }
    public required string Description { get; set; } = string.Empty;
    public required StudentSiteDto Student { get; set; }
    public required bool Paid { get; set; }
}

public static class LessonExtensions
{
    public static LessonSiteDto ToSiteDto(this Lesson lesson)
    {
        return new LessonSiteDto
        {
            Id = lesson.Id,
            Duration = lesson.Duration,
            Date = lesson.Date,
            Description = lesson.Description,
            Paid = lesson.Paid
        };
    }
}