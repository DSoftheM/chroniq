using Chroniq.DTOs;
using Chroniq.Models;
using Chroniq.Services.Exceptions;
using Chroniq.Services.Extensions;
using Chroniq.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Chroniq.Services;

public class ScheduleService(AppDbContext context, StudentService studentService, LessonService lessonService)
{
    public async Task<Schedule> GetAll(Period period, bool archived, HttpContext httpContext)
    {
        var schedule = new Schedule();
        var userId = httpContext.GetUserId();

        var allStudents = await context.Students.Include(x => x.User).ToListAsync();
        allStudents = allStudents
            .Where(x => x.User.Id == userId && x.IsArchived == archived)
            .ToList();

        foreach (var student in allStudents)
        {
            var studentOrder = await context.Orders.FirstOrDefaultAsync(x => x.Id == student.Id);

            if (studentOrder == null)
                throw new NotFoundException("Order not found" + student.Id + " with order " + studentOrder);

            var lessons = (await lessonService.GetByStudentId(student.Id))
                .Where(x => x.Date >= period.Start && x.Date <= period.End);

            schedule.Items.Add(new ScheduleItemSiteDto()
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
        // foreach (var item in dto.items)
        // {
        //     var studentOrder = await context.Orders.AsNoTracking().FirstOrDefaultAsync(x => x.Id == item.StudentId);
        //     if (studentOrder == null)
        //         throw new NotFoundException("Order not found" + item.StudentId + " with order " + studentOrder);
        //
        //     studentOrder.Order = item.Order;
        //     context.Orders.Update(studentOrder);
        // }
        //
        // await context.SaveChangesAsync();
        
        if (dto.items.Count != 2)
        {
            throw new InvalidOperationException("You must provide exactly two items to swap their orders.");
        }

        var item1 = dto.items[0];
        var item2 = dto.items[1];

        // Получаем текущие студенческие заказы по их Id
        var studentOrder1 = await context.Orders.FirstOrDefaultAsync(x => x.Id == item1.StudentId);
        var studentOrder2 = await context.Orders.FirstOrDefaultAsync(x => x.Id == item2.StudentId);

        if (studentOrder1 == null || studentOrder2 == null)
        {
            throw new NotFoundException("One or both students not found.");
        }

        // Получаем текущие порядковые номера
        var order1 = studentOrder1.Order;
        var order2 = studentOrder2.Order;

        // Проверяем, не заняты ли эти порядковые номера уже другими студентами
        if (order1 == order2)
        {
            throw new InvalidOperationException("Both students already have the same order.");
        }

        // Включаем транзакцию, чтобы все изменения выполнялись атомарно
        using (var transaction = await context.Database.BeginTransactionAsync())
        {
            try
            {
                // Меняем местами их порядковые номера
                studentOrder1.Order = order2;
                studentOrder2.Order = order1;

                // Обновляем записи
                context.Orders.Update(studentOrder1);
                context.Orders.Update(studentOrder2);

                // Сохраняем изменения в базе данных
                await context.SaveChangesAsync();

                // Подтверждаем транзакцию
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                // Откатываем транзакцию в случае ошибки
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}