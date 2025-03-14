namespace Chroniq.Services.Extensions;

public static class DateTimeExtensions
{
    public static bool IsPassed(this DateTime date) => date < DateTime.Now;   
}