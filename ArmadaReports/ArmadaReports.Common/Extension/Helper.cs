using ArmadaReports.Common.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ArmadaReports.Common.Extension
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

        public static string SetColumnName(DetailsField field)
        {
            return string.IsNullOrEmpty(field.CustomName) ? field.Name.Replace("_btn_", "") : field.CustomName;
        }

        public static string GetPropertyValueForText(Details details, string propName,System.Reflection.PropertyInfo[] properties)
        {
            return properties.Where(p => p.Name.Contains(propName)).Aggregate(string.Empty, (current, prop) => current + (prop.GetValue(details) == null ? "" : prop.GetValue(details)));
            //var type = details.GetType();
            //var props = details.GetType().GetProperties();
            //var selectedProps = details.GetType().GetProperties().Where(p => p.Name.Contains(propName));
            //return selectedProps.Aggregate(string.Empty, (current, prop) => current + (prop.GetValue(details) == null ? "" : prop.GetValue(details) + "|"));
        }

        public static bool HasRoleAccess(DetailsField field, string role)
        {
            if (!role.Equals("DISTRICTMGR") && !role.Equals("SALES REP") && !role.Equals("SALESREP")) return true;
            if (!field.HiddenForPrograms.Contains(field.ProgramId)) return true;
            return field.ForDistrctMgr;
        }

        //public static void LogPageAccess(string connestionString, HttpRequestBase request, AnalyticUser user)
        //{
        //    var host = request.UserHostAddress;
        //    var url = request.Url.ToString();
        //    var userId = user.UserId;

            //new ConfigRepository(connestionString).LogPageAccess(host, url, userId);
        //}

        public static void LogError(Exception ex)
        {
            var url = HttpContext.Current.Request.Url.AbsoluteUri;
            var message = String.Format("Error found in page: {0}\n\n{1}\n\n{2}", url, ex.Message, ex.StackTrace);
           // EventLog.WriteEntry("Application", message, EventLogEntryType.Warning);
        }

        public static string ReplaceValue(this string str, string from, string to)
        {
            return str.Replace("{#" + from + "}", to);
        }
        public static Dictionary<string, string> GetReportsTo(List<Details> details)
        {
            var data = details.Select(d => new { Name = d.ReportsToName_59_, Value = d.ReportToId }).Distinct();
            return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        }

        public static Dictionary<string, string> GetSalesReferral(List<Details> details)
        {
            var data = details.Select(d => new { Name = d.ReferrerName_60_, Value = d.SalesReferralId }).Distinct();
            return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        }

        public static Dictionary<string, string> GetProgramStatus(List<Details> details)
        {
            var data = details.Select(d => new { Name = d.ProgramStatus_53_, Value = d.ProgramStatus_53_ }).Distinct();
            return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        }

        public static Dictionary<string, string> GetProgramSubStatus(List<Details> details)
        {
            var data = details.Select(d => new { Name = d.ProgramSubStatus_65_, Value = d.ProgramSubStatus_65_ }).Distinct();
            return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        }

        public static Dictionary<string, string> GetInsuranceTypes(List<Details> details)
        {
            var data = details.Select(d => new { Name = d.InsuranceType_31_, Value = d.InsuranceTypeId }).Distinct();
            return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        }

        public static Dictionary<string, string> GetRegistryPatiens(List<Details> details)
        {
            var data = details.Select(d => new { Name = d.RegistryPatient_85_, Value = d.RegistryPatient_85_ }).Distinct();
            return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        }

        public static Dictionary<string, string> GetOnLabels(List<Details> details)
        {
            var data = details.Select(d => new { Name = d.OnLabel_86_, Value = d.OnLabel_86_ }).Distinct();
            return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        }

        public static Dictionary<string, string> GetSources(List<Details> details)
        {
            var data = details.Select(d => new { Name = d.Source_75_, Value = d.Source_75_ }).Distinct();
            return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        }

        public static Dictionary<string, string> GetReferralTypes(List<Details> details)
        {
            var data = details.Select(d => new { Name = d.ReferralType_69_, Value = d.ReferralType_69_ }).Distinct();
            return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        }
    }
}
