using Chroniq.Services;
using Chroniq.Services.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[ApiController]
[Route("api/files")]
public class FileController(FileService fileService) : ControllerBase
{
    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        return Ok(await fileService.UploadFile(file, HttpContext.GetUserId()));
    }

    [HttpGet("download/{fileName}")]
    public IActionResult DownloadFile(string fileName)
    {
        var bytes = fileService.DownloadFile(fileName, HttpContext.GetUserId());
        return File(bytes, "application/octet-stream", fileName);
    }
}