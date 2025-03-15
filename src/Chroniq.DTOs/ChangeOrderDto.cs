namespace Chroniq.DTOs;

public class ChangeOrderDto
{
    public List<Item> items { get; set; } = [];

    public class Item
    {
        public Guid StudentId { get; set; }
        public int Order { get; set; }
    }
}