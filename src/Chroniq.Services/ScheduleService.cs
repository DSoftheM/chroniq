using Chroniq.Models;
using Chroniq.Storage;

namespace Chroniq.Services;

public class ScheduleService(AppDbContext context, StudentService studentService, LessonService lessonService)
{
    public async Task<Schedule> GetAll()
    {
        var schedule = new Schedule();

        var allStudents = await studentService.GetAll();
        foreach (var student in allStudents)
        {
            var lessons = await lessonService.GetByStudentId(student.Id);
            schedule.Items.Add(new ScheduleItemSiteDto()
                { Student = student.ToSiteDto(), Lessons = lessons.Select(x => x.ToSiteDto()).ToList() });
        }

        return schedule;
    }
}