namespace Chroniq.Services.Exceptions;

public sealed class NotFoundException : Exception
{
    public NotFoundException()
    {
    }

    public NotFoundException(string message = "Not found") : base(message)
    {
    }
}