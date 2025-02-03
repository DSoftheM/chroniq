namespace Chroniq.DTOs;

public class WorkCalendarSiteDto
{
    public int Year { get; set; }
    public List<MonthItem> Months { get; set; }
    public List<Transition> Transitions { get; set; }
    public Statistic Statistic { get; set; }
}

public class MonthItem
{
    public int Month { get; set; }
    public string Days { get; set; }
}

public class Transition
{
    public string From { get; set; }
    public string To { get; set; }
}

public class Statistic
{
    public int Workdays { get; set; }
    public int Holidays { get; set; }
    public int Hours40 { get; set; }
    public int Hours36 { get; set; }
    public int Hours24 { get; set; }
}

