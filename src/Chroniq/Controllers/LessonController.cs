using Chroniq.Models;
using Chroniq.Services;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[Route("api/lesson")]
[ApiController]
public class LessonController(LessonService lessonService) : ControllerBase
{
    public async Task<List<Lesson>> GetAllLessons()
    {
        return await lessonService.GetAll();
    }

    [Route("")]
    [HttpPost]
    public async Task CreateLesson(CreateLessonSiteDto dto)
    {
        await lessonService.Create(dto);
    }

    [Route("update")]
    [HttpPost]
    public async Task UpdateLesson(LessonSiteDto dto)
    {
        await lessonService.Update(dto);
    }

    [Route("delete/{lessonId:guid}")]
    [HttpGet]
    public async Task DeleteLesson(Guid lessonId)
    {
        await lessonService.Delete(lessonId);
    }
}