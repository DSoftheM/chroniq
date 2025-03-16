using Chroniq.Models;
using Chroniq.Services.FileCleanup;
using Chroniq.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Chroniq.Services;

public class FileService(AppDbContext dbContext, IConfiguration configuration)
{
    private readonly string _uploadPath = configuration.GetFileStoragePath();

    public async Task<object> UploadFile(IFormFile file, Guid userId)
    {
        if (file.Length == 0)
            throw new Exception("Пустой файл");

        if (!file.ContentType.StartsWith("image/"))
            throw new Exception("Только изображения");

        if (file.Length > 5 * 1024 * 1024)
            throw new Exception("Максимум 5 MB");

        if (!Directory.Exists(_uploadPath))
            Directory.CreateDirectory(_uploadPath);

        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(_uploadPath, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);
        
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId);
        
        if (user == null)
            throw new Exception();
        
        dbContext.Files.Add(new UserFile() { FileName = fileName, User = user });
        await dbContext.SaveChangesAsync();

        return new { FileName = fileName, Message = "Файл загружен успешно" };
    }

    public byte[] DownloadFile(string fileName, Guid userId)
    {
        var userFile = dbContext.Files.FirstOrDefault(f => f.FileName == fileName && f.User.Id == userId);

        if (userFile == null)
            throw new Exception();

        var filePath = Path.Combine(_uploadPath, userFile.FileName);

        if (!File.Exists(filePath))
            throw new Exception();

        var fileBytes = File.ReadAllBytes(filePath);

        return fileBytes;
    }
}