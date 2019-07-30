using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Extension
{
    public static class ExtensionMethods
    {
        public static bool HasColumn(this IDataRecord r, string columnName)
        {
            try
            {
                return r.GetOrdinal(columnName) >= 0;
            }
            catch (IndexOutOfRangeException)
            {
                return false;
            }
        }

        public static DateTime DateFromWeekNumber(int year, int weekOfYear)
        {
            DateTime jan1 = new DateTime(year, 1, 1);

            int daysOffset = (int)CultureInfo.CurrentCulture.DateTimeFormat.FirstDayOfWeek - (int)jan1.DayOfWeek;

            DateTime firstMonday = jan1.AddDays(daysOffset);

            int firstWeek = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(jan1,
                CultureInfo.CurrentCulture.DateTimeFormat.CalendarWeekRule,
                CultureInfo.CurrentCulture.DateTimeFormat.FirstDayOfWeek);

            if (firstWeek <= 1)
            {
                weekOfYear -= 1;
            }

            return firstMonday.AddDays((weekOfYear + 1) * 7);
        }

        public static int GetInt(this SqlDataReader reader, string name)
        {
            int i;
            if (reader[name] == null)
                return 0;
            return !int.TryParse(reader[name].ToString(), out i)
                    ? 0
                    : int.Parse(reader[name].ToString());
        }

        public static long GetLong(this SqlDataReader reader, string name)
        {
            long i;
            if (reader[name] == null)
                return 0;
            return !long.TryParse(reader[name].ToString(), out i)
                    ? 0
                    : long.Parse(reader[name].ToString());
        }

        public static bool GetBool(this SqlDataReader reader, string name)
        {
            bool i;
            if (reader[name] == null)
                return false;
            return bool.TryParse(reader[name].ToString(), out i) && bool.Parse(reader[name].ToString());
        }

        public static double GetDouble(this SqlDataReader reader, string name)
        {
            double d;
            if (reader[name] == null)
                return 0;
            return !double.TryParse(reader[name].ToString(), out d)
                    ? 0
                    : double.Parse(reader[name].ToString());
        }

        public static DateTime GetDate(this SqlDataReader reader, string name)
        {
            DateTime d;
            if (reader[name] == null)
                return new DateTime(1901, 1, 1);
            return !DateTime.TryParse(reader[name].ToString(), out d)
                    ? new DateTime(1901, 1, 1)
                    : DateTime.Parse(reader[name].ToString());
        }

        public static string GetFormattedDateString(this SqlDataReader reader, string name, string format = "yyyy-MM-dd")
        {
            DateTime d;
            if (reader[name] == null)
                return new DateTime(1901, 1, 1).ToString(format);
            return !DateTime.TryParse(reader[name].ToString(), out d)
                    ? new DateTime(1901, 1, 1).ToString(format)
                    : DateTime.Parse(reader[name].ToString()).ToString(format);
        }

        public static string GetFormattedDate(this SqlDataReader reader, string name, string format = "yyyy-MM-dd")
        {
            DateTime d;
            if (reader[name] == null)
                return string.Empty;
            return !DateTime.TryParse(reader[name].ToString(), out d)
                    ? string.Empty
                    : DateTime.Parse(reader[name].ToString()).ToString(format);
        }

        public static string GetString(this SqlDataReader reader, string name)
        {
            return reader[name] == null ? string.Empty : reader[name].ToString();
        }
    }
}