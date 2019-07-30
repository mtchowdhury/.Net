using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Principal;
using System.Web;
using ArmadaReports.Logger.Service;
using ArmadaReports.Web.Models;
using ArmadaReports.Web.Repository;

namespace ArmadaReports.Web.Extension
{
    public static class Helper
    {
        public static string GetPropertyValue(Details details, string propName)
        {
            var type = details.GetType();
            var props = type.GetProperties();
            var selectedProps = props.Where(p => p.Name.Contains(propName));
            var value = String.Empty;
            foreach (var prop in selectedProps)
            {
                value += prop == null ? "" : prop.GetValue(details) == null ? "" : prop.GetValue(details).ToString() + " ";
            }
            return value;
        }

        public static bool HasRoleAccess(DetailsField field, string role)
        {
            if (!role.Equals("DISTRICTMGR") && !role.Equals("SALES REP") && !role.Equals("SALESREP")) return true;
            if (!field.HiddenForPrograms.Contains(field.ProgramId)) return true;
            return field.ForDistrctMgr;
        }

        public static void LogPageAccess(string connestionString, HttpRequestBase request, AnalyticUser user)
        {
            var host = request.UserHostAddress;
            var url = request.Url.ToString();
            var userId = user.UserId;

            new ConfigRepository(connestionString).LogPageAccess(host, url, userId);
        }

        public static void LogError(Exception ex)
        {
            var url = HttpContext.Current.Request.Url.AbsoluteUri;
            var message = String.Format("Error found in page: {0}\n\n{1}\n\n{2}", url, ex.Message, ex.StackTrace);
            EventLog.WriteEntry("Application", message, EventLogEntryType.Warning);
            new LoggerService().LogError($"Error found in page: {url} >> {ex.Message}", ex);
        }

        public static string ReplaceValue(this string str, string from, string to)
        {
            return str.Replace("{#" + from + "}", to);
        }
    }
}