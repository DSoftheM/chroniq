namespace Chroniq.Models;

public class Student
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required string? Description { get; set; }
    public required string? avatarUrl { get; set; }
    public required int DefaultPrice { get; set; }
    public required List<Lesson> Lessons { get; set; } = [];
}


public class StudentSiteDto
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required string? Description { get; set; }
    public required string? avatarUrl { get; set; }
    public required int DefaultPrice { get; set; }
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