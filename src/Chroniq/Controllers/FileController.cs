using Chroniq.Services.FileService;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Controllers;

[ApiController]
[Route("api/files")]
public class FileController(FileService fileService) : ControllerBase
{
    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        return Ok(await fileService.UploadFile(file));
    }

    [HttpGet("download/{fileName}")]
    public async Task<FileResult> DownloadFile(string fileName)
    {
        var bytes = await fileService.DownloadFile(fileName);
        return File(bytes, "application/octet-stream", fileName);
    }
}