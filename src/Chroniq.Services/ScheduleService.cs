using Chroniq.Models;
using Chroniq.Storage;

namespace Chroniq.Services;

public class ScheduleService(AppDbContext context, StudentService studentService, LessonService lessonService)
{
    public async Task<Schedule> GetAll(Period period, bool archived)
    {
        var schedule = new Schedule();

        var allStudents = await studentService.GetAll();
        allStudents = allStudents.Where(x => x.IsArchived == archived).ToList();
        
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