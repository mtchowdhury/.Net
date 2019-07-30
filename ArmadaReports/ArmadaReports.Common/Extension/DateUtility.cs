using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.Common.Extension
{
    public static class DateUtility
    {
        public static List<string> GetDates(string dateType)
        {
            var range = new DateRange();
            switch (dateType.ToLower())
            {
                case "yesterday":
                    return new List<string> { DateTime.Today.AddDays(-1).ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.AddDays(-1).ToString("yyyy-MM-dd") + " 23:59:59" };
                case "thisweek":
                    range = ThisWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "lastweek":
                    range = LastWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "twoweek":
                    range = TwoWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "threeweek":
                    range = ThreeWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "fourweek":
                    range = FourWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "fourormoreweek":
                    range = FourOrMoreWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "currentmonth":
                    range = ThisMonth(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "lastmonth":
                    range = LastMonth(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "allorders":
                    return new List<string> { new DateTime(1990, 1, 1).ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "ytd":
                    range = Ytd(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd":
                    range = Qtd(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd1":
                    range = Qtd1(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd2":
                    range = Qtd2(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd3":
                    range = Qtd3(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd4":
                    range = Qtd4(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd5":
                    range = Qtd5(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "lastthirtyday":
                    range = LastThirtyDay(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "allreferrals":
                    return new List<string> { new DateTime(1901, 1, 1).ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.ToString("yyyy-MM-dd") + " 23:59:59" };
                default:
                    return new List<string> { DateTime.Today.ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.ToString("yyyy-MM-dd") + " 23:59:59" };
            }
        }

        public static List<string> GetDates(string dateType, int programId, string connString)
        {
            var range = new DateRange();
            switch (dateType.ToLower())
            {
                case "yesterday":
                    return new List<string> { DateTime.Today.AddDays(-1).ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.AddDays(-1).ToString("yyyy-MM-dd") + " 23:59:59" };
                case "thisweek":
                    range = ThisWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "lastweek":
                    range = LastWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "twoweek":
                    range = TwoWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "threeweek":
                    range = ThreeWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "fourweek":
                    range = FourWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "fourormoreweek":
                    range = FourOrMoreWeek(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "currentmonth":
                    range = ThisMonth(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "lastmonth":
                    range = LastMonth(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "allreferrals":
                    //var repo = new Repository(connString);
                    //return new List<string> { repo.GetProgramStartDate(programId).ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.ToString("yyyy-MM-dd") + " 23:59:59" };
                    return new List<string> { new DateTime(1901, 1, 1).ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "ytd":
                    range = Ytd(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd":
                    range = Qtd(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd1":
                    range = Qtd1(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd2":
                    range = Qtd2(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd3":
                    range = Qtd3(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd4":
                    range = Qtd4(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "qtd5":
                    range = Qtd5(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "daily":
                    return new List<string> { DateTime.Today.AddDays(-19).ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "weekly":
                    return new List<string> { DateTime.Today.AddDays(-50).ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "monthly":
                    return new List<string> { DateTime.Today.AddDays(-180).ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "quarterly":
                    return new List<string> { DateTime.Today.AddDays(-720).ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.ToString("yyyy-MM-dd") + " 23:59:59" };
                case "lastthirtyday":
                    range = LastThirtyDay(DateTime.Today);
                    return new List<string> { range.Start.ToString("yyyy-MM-dd") + " 00:00:00", range.End.ToString("yyyy-MM-dd") + " 23:59:59" };
                default:
                    return new List<string> { DateTime.Today.ToString("yyyy-MM-dd") + " 00:00:00", DateTime.Today.ToString("yyyy-MM-dd") + " 23:59:59" };
            }
        }

        public static string GetDateString(string dateType)
        {
            switch (dateType.ToLower())
            {
                case "thisweek":
                case "lastweek":
                case "twoweek":
                case "threeweek":
                case "fourweek":
                case "allreferrals":
                    return string.Empty;
                case "ytd":
                    return "" + DateTime.Today.Year + "";
                case "qtd1":
                    return Qtd1(DateTime.Today).Start.Year.ToString();
                case "qtd2":
                    return Qtd2(DateTime.Today).Start.Year.ToString();
                case "qtd3":
                    return Qtd3(DateTime.Today).Start.Year.ToString();
                case "qtd4":
                    return Qtd4(DateTime.Today).Start.Year.ToString();
                case "qtd5":
                    return Qtd5(DateTime.Today).Start.Year.ToString();
                case "currentmonth":
                    return "(" + GetMonthName(ThisMonth(DateTime.Today).Start) + ")";
                case "lastmonth":
                    return "(" + GetMonthName(LastMonth(DateTime.Today).Start) + ")";
                case "yesterday":
                    return "(" + GetDayName(DateTime.Today.AddDays(-1)) + ")";
                default:
                    return "(" + GetDayName(DateTime.Today) + ")";
            }
        }

        public static DateRange ThisYear(DateTime date)
        {
            DateRange range = new DateRange();

            range.Start = new DateTime(date.Year, 1, 1);
            range.End = range.Start.AddYears(1).AddSeconds(-1);

            return range;
        }

        public static DateRange LastYear(DateTime date)
        {
            DateRange range = new DateRange();

            range.Start = new DateTime(date.Year - 1, 1, 1);
            range.End = range.Start.AddYears(1).AddSeconds(-1);

            return range;
        }

        public static DateRange ThisMonth(DateTime date)
        {
            DateRange range = new DateRange();

            range.Start = new DateTime(date.Year, date.Month, 1);
            range.End = range.Start.AddMonths(1).AddSeconds(-1);

            return range;
        }

        public static DateRange LastThirtyDay(DateTime date)
        {
            DateRange range = new DateRange();

            range.Start = date.AddDays(-30);
            range.End = date;

            return range;
        }

        public static DateRange LastMonth(DateTime date)
        {
            DateRange range = new DateRange();

            range.Start = (new DateTime(date.Year, date.Month, 1)).AddMonths(-1);
            range.End = range.Start.AddMonths(1).AddSeconds(-1);

            return range;
        }

        public static DateRange ThisWeek(DateTime date)
        {
            DateRange range = new DateRange();

            range.Start = date.Date.AddDays(-(int)date.DayOfWeek);
            range.End = range.Start.AddDays(7).AddSeconds(-1);

            return range;
        }

        public static DateRange LastWeek(DateTime date)
        {
            DateRange range = ThisWeek(date);

            range.Start = range.Start.AddDays(-7);
            range.End = range.End.AddDays(-7);

            return range;
        }

        public static DateRange TwoWeek(DateTime date)
        {
            DateRange range = ThisWeek(date);

            range.Start = range.Start.AddDays(-14);
            range.End = range.End.AddDays(-14);

            return range;
        }

        public static DateRange ThreeWeek(DateTime date)
        {
            DateRange range = ThisWeek(date);

            range.Start = range.Start.AddDays(-21);
            range.End = range.End.AddDays(-21);

            return range;
        }

        public static DateRange FourWeek(DateTime date)
        {
            DateRange range = ThisWeek(date);

            range.Start = range.Start.AddDays(-28);
            range.End = range.End.AddDays(-28);

            return range;
        }

        public static DateRange FourOrMoreWeek(DateTime date)
        {
            DateRange range = ThisWeek(date);

            range.Start = new DateTime(1901, 1, 1);
            range.End = range.End.AddDays(-28);

            return range;
        }

        public static DateRange Ytd(DateTime date)
        {
            DateRange range = new DateRange();

            range.Start = (new DateTime(date.Year, 1, 1));
            range.End = (new DateTime(date.Year, date.Month, date.Day)).AddHours(23).AddMinutes(59).AddSeconds(59);

            return range;
        }

        public static DateRange Qtd(DateTime date)
        {
            DateRange range = new DateRange();

            if (date.Month >= 1 && date.Month <= 3)
                range.Start = new DateTime(date.Year, 1, 1);
            else if (date.Month >= 4 && date.Month <= 6)
                range.Start = new DateTime(date.Year, 4, 1);
            else if (date.Month >= 7 && date.Month <= 9)
                range.Start = new DateTime(date.Year, 7, 1);
            else
                range.Start = new DateTime(date.Year, 10, 1);
            range.End = date;
            return range;
        }

        private static DateRange ChangeYearIfNeeded(DateRange dateRange)
        {
            if (dateRange.Start > DateTime.Today)
            {
                dateRange.Start = dateRange.Start.AddYears(-1);
                dateRange.End = dateRange.End.AddYears(-1);
            }

            return dateRange;
        }

        public static DateRange Qtd1(DateTime date)
        {
            return ChangeYearIfNeeded(new DateRange
            {
                Start = new DateTime(date.Year, 1, 1),
                End = new DateTime(date.Year, 4, 1).AddSeconds(-1)
            });
        }

        public static DateRange Qtd2(DateTime date)
        {
            return ChangeYearIfNeeded(new DateRange
            {
                Start = new DateTime(date.Year, 4, 1),
                End = new DateTime(date.Year, 7, 1).AddSeconds(-1)
            });
        }

        public static DateRange Qtd3(DateTime date)
        {
            return ChangeYearIfNeeded(new DateRange
            {
                Start = new DateTime(date.Year, 7, 1),
                End = new DateTime(date.Year, 10, 1).AddSeconds(-1)
            });
        }

        public static DateRange Qtd4(DateTime date)
        {
            return ChangeYearIfNeeded(new DateRange
            {
                Start = new DateTime(date.Year, 10, 1),
                End = new DateTime(date.Year + 1, 1, 1).AddSeconds(-1)
            });
        }

        public static DateRange Qtd5(DateTime date)
        {
            var qtr = (date.Month - 1) / 3 + 1;
            var startDate = new DateTime(DateTime.Today.Year - 1, (qtr - 1) * 3 + 1, 1);
            return new DateRange
            {
                Start = startDate,
                End = startDate.AddMonths(3).AddSeconds(-1)
            };
        }
        public static string GetQtrForQTD5()
        {
            var qtr = (DateTime.Today.Month - 1) / 3 + 1;
            return String.Format("QTD{0} ", qtr);
        }

        public static string GetDayName(DateTime date)
        {
            return date.ToString("dddd");
        }

        public static string GetMonthName(DateTime date)
        {
            return date.ToString("MMMM");
        }

        public static string FormatDate(string date, string format)
        {
            if (string.IsNullOrEmpty(date)) return string.Empty;
            DateTime d;
            return DateTime.TryParse(date, out d) ? d.ToString(format) : date;
        }

        public static string GetFirstDate(int month, int year)
        {
            return new DateTime(year, month, 1).ToString("yyyy-MM-dd");
        }

        public static List<DateTime> GetDaysBetweenRange(DateTime minDate, DateTime maxDate, bool excludeNonWorkingDays)
        {
            var dates = new List<DateTime>();
            while (minDate <= maxDate)
            {
                if (excludeNonWorkingDays && (minDate.DayOfWeek == DayOfWeek.Saturday || minDate.DayOfWeek == DayOfWeek.Sunday))
                {
                    minDate = minDate.Date.AddDays(1);
                    continue;
                }
                dates.Add(minDate.Date);
                minDate = minDate.Date.AddDays(1);
            }
            return dates;
        }

        public static List<DateTime> GetWeeksBetweenRange(DateTime minDate, DateTime maxDate)
        {
            var dates = new List<DateTime>();
            while (minDate <= maxDate)
            {
                if (minDate.DayOfWeek == DayOfWeek.Monday)
                    dates.Add(minDate);
                minDate = minDate.AddDays(1);
            }
            return dates;
        }

        public static List<DateTime> GetMonthsBetweenRange(DateTime minDate, DateTime maxDate)
        {
            var dates = new List<DateTime>();
            while (minDate < maxDate.AddMonths(1))
            {
                dates.Add(new DateTime(minDate.Date.Year, minDate.Date.Month, 1));
                minDate = new DateTime(minDate.Date.Year, minDate.Date.Month, 1).AddMonths(1);
            }
            return dates;
        }

        public static List<DateTime> GetQuartersBetweenRange(DateTime minDate, DateTime maxDate)
        {
            var dates = new List<DateTime>();
            while (minDate.Year <= maxDate.Year)
            {
                dates.Add(new DateTime(minDate.Year, 1, 1));
                dates.Add(new DateTime(minDate.Year, 4, 1));
                dates.Add(new DateTime(minDate.Year, 7, 1));
                dates.Add(new DateTime(minDate.Year, 10, 1));
                minDate = minDate.Date.AddYears(1);
            }
            return dates;
        }

        public static string GetDateStringFromType(DateTime date, string type)
        {
            switch (type)
            {
                case "daily":
                    return date.ToString("MMM dd");
                case "weekly":
                    return date.ToString("MMM dd");
                case "monthly":
                    return date.ToString("MMM’yy ");
                case "quarterly":
                default:
                    return "Q" + ((date.Month + 2) / 3) + "" + date.ToString("’yy ");
            }
        }
    }
    public class DateRange
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}
