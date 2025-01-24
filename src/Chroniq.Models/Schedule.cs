namespace Chroniq.Models;

public class Schedule
{
    public List<ScheduleItemSiteDto> Items { get; set; } = [];
}

public class ScheduleItemSiteDto
{
    public StudentSiteDto Student { get; set; }
    public List<LessonSiteDto> Lessons { get; set; }
}