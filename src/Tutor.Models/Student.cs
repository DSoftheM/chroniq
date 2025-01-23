namespace Tutor.Models;

public class Student
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string? avatarUrl { get; set; }
    public int DefaultPrice { get; set; }
    public List<Lesson> Lessons { get; set; } = [];
}
