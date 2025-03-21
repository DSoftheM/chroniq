using System.Linq.Expressions;
using System.Text.Json;
using Chroniq.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Chroniq.Services.FileCleanup;

public class FileCleanupService(
    ILogger<FileCleanupService> logger,
    IConfiguration configuration,
    IServiceProvider serviceProvider)
    : BackgroundService
{
    private readonly TimeSpan _taskDelay = TimeSpan.FromHours(24);
    private readonly string _uploadPath = configuration.GetFileStoragePath();

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("File Cleanup Service is starting.");

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                CleanupUnusedFiles();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while cleaning up files.");
            }

            await Task.Delay(_taskDelay, cancellationToken);
        }

        logger.LogInformation("File Cleanup Service is stopping.");
    }

    private void CleanupUnusedFiles()
    {
        var start = DateTime.UtcNow;
        var directoryInfo = new DirectoryInfo(_uploadPath);
        FileCleanupResult result = new()
        {
            InitialTotalSizeBytes = directoryInfo.EnumerateFiles().Sum(file => file.Length)
        };

        if (!directoryInfo.Exists)
        {
            logger.LogWarning($"Directory {_uploadPath} does not exist.");
            return;
        }

        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var usedFiles = dbContext.Students.Select(x => x.AvatarUrl)
            .Where(IsRelative())
            .AsEnumerable()
            .Select(Path.GetFileName).ToList();
        var allFiles = dbContext.Files.Select(x => x.FileName);

        var toDelete = allFiles.Except(usedFiles).ToList();

        foreach (var path in toDelete)
        {
            var filePath = Path.Combine(_uploadPath, path);
            if (File.Exists(filePath))
            {
                result.DeletedFilesCount++;
                result.SpaceFreedBytes += new FileInfo(filePath).Length;
                File.Delete(filePath);
                logger.LogInformation($"{filePath} deleted.");
            }
        }

        result.FinalTotalSizeBytes = directoryInfo.EnumerateFiles().Sum(file => file.Length);
        result.ElapsedTime = DateTime.UtcNow - start;

        logger.LogInformation(JsonSerializer.Serialize(result));
    }

    private static Expression<Func<string?, bool>> IsRelative()
    {
        return url => url != null && (url.StartsWith("/") || !url.Contains("://"));
    }
}