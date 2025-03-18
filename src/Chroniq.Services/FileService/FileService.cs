using Chroniq.Models;
using Chroniq.Services.FileCleanup;
using Chroniq.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Chroniq.Services.FileService;

public class FileService(
    AppDbContext dbContext,
    IConfiguration configuration,
    ILogger<FileService> logger,
    UserService userService)
{
    private readonly string _uploadPath = configuration.GetFileStoragePath();
    private readonly Guid _userId = userService.UserId;

    public async Task<FileUploadResponse> UploadFile(IFormFile file)
    {
        if (file.Length == 0)
            throw new ArgumentException("Пустой файл");

        if (!file.ContentType.StartsWith("image/"))
            throw new Exception("Только изображения");

        if (file.Length > 5 * 1024 * 1024)
            throw new Exception("Максимум 5 MB");

        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == _userId);

        if (user == null)
            throw new InvalidOperationException();

        if (!Directory.Exists(_uploadPath))
            Directory.CreateDirectory(_uploadPath);

        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(_uploadPath, fileName);

        if (File.Exists(filePath))
            throw new InvalidOperationException("Файл с таким именем уже существует");

        logger.LogInformation($"Начало загрузки файла для пользователя {_userId}");

        try
        {
            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            dbContext.Files.Add(new UserFile() { FileName = fileName, User = user });
            await dbContext.SaveChangesAsync();

            logger.LogInformation("Файл {FileName} успешно загружен", fileName);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при загрузке файла");
            throw;
        }

        return new FileUploadResponse() { FileName = fileName, Message = "Файл загружен успешно" };
    }

    public async Task<byte[]> DownloadFile(string fileName)
    {
        var userFile = dbContext.Files.FirstOrDefault(f => f.FileName == fileName && f.User.Id == _userId);

        if (userFile == null)
            throw new FileNotFoundException();

        var filePath = Path.Combine(_uploadPath, userFile.FileName);

        if (!File.Exists(filePath))
            throw new FileNotFoundException($"Файл {userFile.FileName} не найден");

        var fileBytes = await File.ReadAllBytesAsync(filePath);

        return fileBytes;
    }
}