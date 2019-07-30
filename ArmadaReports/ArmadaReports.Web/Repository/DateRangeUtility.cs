using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Repository
{
    public class DateRangeUtility
    {
        public static List<DateRangeString> GetDateRange(string type)
        {
            switch (type)
            {
                case "Week":
                    return GetWeekList();
                case "Month":
                    return GetMonthList();
                default:
                    return GetDayList();
            }
        }

        public static List<DateRangeString> GetDayList()
        {
            var days = new List<DateRangeString>();
            for (var i = 1; i < 10; i++)
            {
                days.Add(GetDay(i));
            }
            return days;
        }

        public static List<DateRangeString> GetWeekList()
        {
            var weeks = new List<DateRangeString>();
            for (var i = 0; i < 7; i++)
            {
                weeks.Add(GetWeek(i));
            }
            return weeks;
        }

        public static List<DateRangeString> GetMonthList()
        {
            var months = new List<DateRangeString>();
            for (var i = 0; i < 7; i++)
            {
                months.Add(GetMonth(i));
            }
            return months;
        }

        public static DateRangeString GetDay(int back)
        {
            return new DateRangeString
            {
                StartFormatted = DateTime.Today.AddDays(-back).ToString("ddd, MMM d"),
                StartFormattedForChart = DateTime.Today.AddDays(-back).ToString("MMM dd"),
                Start = DateTime.Today.AddDays(-back).ToString("yyyy-MM-dd") + " 00:00:00",
                End = DateTime.Today.AddDays(-back).ToString("yyyy-MM-dd") + " 23:59:59",
                StartDate = DateTime.Today.AddDays(-back),
                EndDate = DateTime.Today.AddDays(-back)
            };
        }

        public static DateRangeString GetWeek(int back)
        {
            var range = ThisWeek(DateTime.Today);
            return new DateRangeString
            {
                StartFormatted = range.End.AddDays(-back * 7).ToString("ddd, MMM d"),
                StartFormattedForChart = range.End.AddDays(-back * 7).ToString("MMM dd"),
                Start = range.Start.AddDays(-back * 7).ToString("yyyy-MM-dd") + " 00:00:00",
                End = range.End.AddDays(-back * 7).ToString("yyyy-MM-dd") + " 23:59:59",
                StartDate = range.Start.AddDays(-back * 7),
                EndDate = range.End.AddDays(-back * 7)
            };
        }

        public static DateRangeString GetMonth(int back)
        {
            var range = new DateRange();
            range.Start = (new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1)).AddMonths(-back);
            range.End = range.Start.AddMonths(1).AddSeconds(-1);
            return new DateRangeString
            {
                StartFormatted = range.Start.ToString("MMM, yyyy"),
                StartFormattedForChart = range.Start.ToString("MMM’yy "),
                Start = range.Start.ToString("yyyy-MM-dd") + " 00:00:00",
                End = range.End.ToString("yyyy-MM-dd") + " 23:59:59",
                StartDate = range.Start,
                EndDate = range.End
            };
        }

        private static DateRange ThisWeek(DateTime date)
        {
            DateRange range = new DateRange();

            range.Start = date.Date.AddDays(-(int)date.DayOfWeek);
            range.End = range.Start.AddDays(7).AddSeconds(-1);

            return range;
        }

        public class DateRangeString
        {
            public string StartFormatted { get; set; }
            public string StartFormattedForChart { get; set; }
            public string Start { get; set; }
            public string End { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
        }
    }
}