namespace Chroniq.Services.FileCleanup;

public class FileCleanupResult
{
    public long InitialSize { get; set; }
    public long FinalSize { get; set; }
    public TimeSpan TimePassed { get; set; }
    public long SpaceSaved { get; set; }
    public int FilesDeleted { get; set; }
}