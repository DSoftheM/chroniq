using Chroniq.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Chroniq.Services;

public class FileService(AppDbContext dbContext)
{
    private const string UploadPath = "uploads";

    public async Task<object> UploadFile(IFormFile file)
    {
        if (file.Length == 0)
            throw new Exception("Пустой файл");

        if (!file.ContentType.StartsWith("image/"))
            throw new Exception("Только изображения");

        if (file.Length > 5_000_000)
            throw new Exception("Максимум 5 MB");

        if (!Directory.Exists(UploadPath))
            Directory.CreateDirectory(UploadPath);

        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(UploadPath, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return new { FileName = fileName, Message = "Файл загружен успешно" };
    }

    public byte[] DownloadFile(string fileName, Guid userId)
    {
        var userFile = dbContext.Files.FirstOrDefault(f => f.FileName == fileName && f.User.Id == userId);

        if (userFile == null)
            throw new Exception();

        var filePath = Path.Combine("uploads", userFile.FileName);

        if (!File.Exists(filePath))
            throw new Exception();

        var fileBytes = File.ReadAllBytes(filePath);

        return fileBytes;
    }
}