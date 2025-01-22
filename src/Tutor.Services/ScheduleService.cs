using Tutor.Models;
using Tutor.Storage;

namespace Tutor.Services;

public class ScheduleService(AppDbContext context, StudentService studentService, LessonService lessonService)
{
    public async Task<Schedule> GetAll()
    {
        var schedule = new Schedule();

        var allStudents = await studentService.GetAll();
        foreach (var student in allStudents)
        {
            var lessons = await lessonService.GetByStudentId(student.Id);
            schedule.Items.Add(new ScheduleItem() { Student = student, Lessons = lessons });
        }
        
        return schedule;
    }
}