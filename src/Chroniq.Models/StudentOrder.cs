namespace Chroniq.Models;

public class StudentOrder
{
    public Guid Id { get; set; }
    public required Student Student { get; set; }
    public required int Order { get; set; }
}