namespace Chroniq.Models;

public class UserFile
{
    public required Guid Id { get; set; }
    public required User User { get; set; }
    public required string FileName { get; set; }
}