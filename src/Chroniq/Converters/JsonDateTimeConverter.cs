using System.Text.Json;
using System.Text.Json.Serialization;

namespace Chroniq.Converters;

public class JsonDateTimeConverter : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        // var x = reader.GetInt32().ToString();
        var ms = reader.GetInt64();
        // DateTime date = DateTimeOffset.FromUnixTimeMilliseconds(Convert.ToInt64(ms)).DateTime;
        // Console.WriteLine(date.Kind);
        return UnixTimeStampToDateTime(ms);
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        writer.WriteNumberValue(((DateTimeOffset)value).ToUnixTimeMilliseconds());
    }

    public DateTime UnixTimeStampToDateTime(double unixTimeStamp)
    {
        // Unix timestamp is seconds past epoch
        var dateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
        dateTime = dateTime.AddMilliseconds(unixTimeStamp);
        return dateTime;
    }
}