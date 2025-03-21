namespace Chroniq.Services.Extensions;

public static class DateTimeExtensions
{
    public static bool IsPassed(this DateTime date)
    {
        return date < DateTime.Now;
    }
}