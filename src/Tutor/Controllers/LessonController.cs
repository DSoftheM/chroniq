using Microsoft.AspNetCore.Mvc;
using Tutor.Models;
using Tutor.Services;

namespace Tutor.Controllers;

[Route("api/lesson")]
[ApiController]
public class LessonController(LessonService lessonService)
{
    public async Task<List<Lesson>> GetAllLessons() => await lessonService.GetAll();
    
    [Route("create")]
    public async Task CreateLesson(LessonSiteDto dto) => await lessonService.Create(dto);
}