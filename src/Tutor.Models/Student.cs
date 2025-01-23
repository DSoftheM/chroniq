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


public class StudentSiteDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string? avatarUrl { get; set; }
    public int DefaultPrice { get; set; }
}

public static class StudentExtensions
{
    public static StudentSiteDto ToSiteDto(this Student student)
    {
        return new StudentSiteDto
        {
            Id = student.Id,
            Name = student.Name,
            Description = student.Description,
            avatarUrl = student.avatarUrl,
            DefaultPrice = student.DefaultPrice,
        };
    }
}