using Chroniq.DTOs;
using Chroniq.Models;
using Chroniq.Services.Exceptions;
using Chroniq.Storage;
using Microsoft.EntityFrameworkCore;

namespace Chroniq.Services;

public class ScheduleService(
    AppDbContext context,
    LessonService lessonService,
    UserService userService)
{
    private readonly Guid _userId = userService.UserId;

    public async Task<Schedule> GetAll(Period period, bool archived)
    {
        var schedule = new Schedule();

        var allStudents = await context.Students
            .Where(x => x.User.Id == _userId && x.IsArchived == archived)
            .Include(x => x.User)
            .ToListAsync();

        var studentOrders = await context.Orders
            .Where(o => allStudents.Select(s => s.Id).Contains(o.Id))
            .ToDictionaryAsync(o => o.Id);

        foreach (var student in allStudents)
        {
            if (!studentOrders.TryGetValue(student.Id, out var studentOrder))
                throw new NotFoundException($"Order not found for student {student.Id}");

            var lessons = await context.Lessons
                .Where(x => x.Student.Id == student.Id && x.Date >= period.Start && x.Date <= period.End)
                .ToListAsync();

            schedule.Items.Add(new ScheduleItemSiteDto
            {
                Student = student.ToSiteDto(), Lessons = lessons.Select(x => x.ToSiteDto()).ToList(),
                Order = studentOrder.Order
            });
        }

        schedule.Items = schedule.Items.OrderBy(x => x.Order).ToList();

        return schedule;
    }

    public async Task ChangeOrder(ChangeOrderDto dto)
    {
        foreach (var item in dto.items)
        {
            var studentOrder = await context.Orders.AsNoTracking().FirstOrDefaultAsync(x => x.Id == item.StudentId);
            if (studentOrder == null)
                throw new NotFoundException("Order not found" + item.StudentId + " with order " + studentOrder);

            studentOrder.Order = item.Order;
            context.Orders.Update(studentOrder);
        }

        await context.SaveChangesAsync();
    }
}