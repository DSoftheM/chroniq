using Microsoft.Extensions.Configuration;

namespace Chroniq.Services.FileCleanup;

public static class FileCleanupExtensions
{
    public static string GetFileStoragePath(this IConfiguration self)
    {
        return self.GetSection("FileStorage:Path").Value ?? throw new Exception("FileStorage:Path not found");
    }
}