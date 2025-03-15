using Chroniq.Models;
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
            .OrderBy(x => x.Name)
            .ToList();

        foreach (var student in allStudents)
        {
            var lessons = (await lessonService.GetByStudentId(student.Id))
                .Where(x => x.Date >= period.Start && x.Date <= period.End);
            schedule.Items.Add(new ScheduleItemSiteDto()
                { Student = student.ToSiteDto(), Lessons = lessons.Select(x => x.ToSiteDto()).ToList() });
        }

        return schedule;
    }
}