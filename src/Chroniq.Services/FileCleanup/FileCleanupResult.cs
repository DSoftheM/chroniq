namespace Chroniq.Services.FileCleanup;

public class FileCleanupResult
{
    public long InitialTotalSizeBytes { get; set; }
    public long FinalTotalSizeBytes { get; set; }
    public TimeSpan ElapsedTime { get; set; }
    public long SpaceFreedBytes { get; set; }
    public int DeletedFilesCount { get; set; }
}