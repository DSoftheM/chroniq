namespace Tutor.Models;

public class Schedule
{
    public List<ScheduleItem> Items { get; set; }
}

public class ScheduleItem
{
    public Student Student { get; set; }
    public List<Lesson> Lessons { get; set; }
}