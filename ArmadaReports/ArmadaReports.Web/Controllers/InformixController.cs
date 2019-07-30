using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Models.Informix;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class InformixController : Controller
    {
        [HttpGet]
        public JsonResult GetCallCenterStatictics(int programId, string programName, string dateFrequency, bool isWorkingDays, string callType)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var stats = new Repository.Repository(connectionString).GetCallCenterStatictics(programId, programName, dateFrequency, isWorkingDays, callType);
            return Json(stats, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetInformixData(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var tsvData = new List<CsqActivityModel>();
            try
            {
                tsvData = GetDataFromTsvFile();
            }
            catch (Exception exception)
            {
                var dc = new InformixDataConfigModel()
                {
                    Success = false,
                    Message = exception.Message
                };
                return Json(dc, JsonRequestBehavior.AllowGet);
            }
            var i = 0;
            var idField = new Repository.Repository(connectionString).GetInformixIdByProgramId(programId);
            tsvData = tsvData.Where(t => int.TryParse(t.IdField, out i) && int.Parse(t.IdField) == idField).ToList();
            var config = new Repository.Repository(connectionString).GetInformixConfig();
            foreach (var data in tsvData)
            {
                foreach (var con in config)
                {
                    PropertyInfo propertyInfo = data.GetType().GetProperty(con.Name);
                    propertyInfo.SetValue(data, GetPropertyValue(data, con.Name, con.Visibility));
                }
            }
            config = config.Where(c => c.Visibility == true).ToList();
            foreach (var c in config)
            {
                c.Name = Regex.Replace(c.Name, @"(\B[A-Z]+?(?=[A-Z][^A-Z])|\B[A-Z]+?(?=[^A-Z]))", " $1");
            }
            var dataConfig = new InformixDataConfigModel()
            {
                Success = true,
                Message = string.Empty,
                Data = tsvData,
                Config = config
            };

            return Json(dataConfig, JsonRequestBehavior.AllowGet);
        }

        public string GetPropertyValue(CsqActivityModel model, string propName, bool visibility)
        {
            var type = model.GetType();
            var props = type.GetProperties();
            var selectedProps = props.Where(p => p.Name == propName);
            var value = string.Empty;
            foreach (var prop in selectedProps)
            {
                value = visibility == false ? "-9999999" : prop.GetValue(model).ToString();
            }
            return value;
        }
        public List<CsqActivityModel> GetDataFromTsvFile()
        {
            var path = ConfigurationManager.AppSettings["InformixPath"];
            //if(!System.IO.File.Exists(path))
            //    return new List<CsqActivityModel>();
            var contents = System.IO.File.ReadAllText(path).Split('\n');
            var csv = from line in contents
                      select line.Split('\t').ToArray();

            var data = new List<CsqActivityModel>();

            int headerRows = 1;
            csv = csv.Skip(headerRows).ToList();
            foreach (var row in csv)
            {
                if (row.Length > 1)
                {
                    var i = 0;
                    data.Add(new CsqActivityModel
                    {
                        IdField = row[i++],
                        CsqName = row[i++],
                        CallSkills = row[i++],
                        CallsPresented = row[i++],
                        AvgQueueTime = ConvertToTime(row[i++]),
                        MaxQueueTime = ConvertToTime(row[i++]),
                        CallsHandled = row[i++],
                        AvgSpeedAnswer = ConvertToTime(row[i++]),
                        AvgHandleTime = ConvertToTime(row[i++]),
                        MaxHandleTime = ConvertToTime(row[i++]),
                        CallsAbandoned = row[i++],
                        AvgTimeAbandon = ConvertToTime(row[i++]),
                        MaxTimeAbandon = ConvertToTime(row[i++]),
                        AvgCallsAbondoned = row[i++],
                        MaxCallsAbondoned = row[i++],
                        CallDequeued = row[i++],
                        AvgTimeDequeue = ConvertToTime(row[i++]),
                        MaxTimeDequeue = ConvertToTime(row[i++]),
                        CallsHandledByOthers = row[i++],
                        LatestSyncTime = ConvertToTime(row[i++]),
                        AbandonmentRate = GetAbandonmentRate(row[10], row[3])
                    });
                }
            }

            return data;
        }

        private string GetAbandonmentRate(string abandoned, string presented)
        {
            var i = 0;
            var abandonedInt = int.TryParse(abandoned, out i) ? i : 0;
            var presentedInt = int.TryParse(presented, out i) ? i : 0;
            return presentedInt == 0 ? "0.00%" : Math.Round((double) abandonedInt/(double) presentedInt, 2) + "%";
        }

        private string ConvertToTime(string timeStr)
        {
            var i = 0.0;
            var time = double.TryParse(timeStr, out i) ? i : 0;
            if ((int)time == 0) return "00:00:00";
            var hour = (int)time/3600;
            var minute = (int)(time%3600)/60;
            var second = (int)(time%3600)%60;
            return (hour < 10 ? "0" + hour : hour + "") + ":" + (minute < 10 ? "0" + minute : minute + "") + ":" +
                   (second < 10 ? "0" + second : second + "");
        }

        [HttpGet]
        public JsonResult GetHubStatisticsOutboundCalls(int programId, string dateType, bool excludeNonWorkingDays, string callType)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return Json(new Repository.Repository(connectionString).GetHubStatisticsOutboundCallStatistics(programId, dateType, excludeNonWorkingDays, callType),
                    JsonRequestBehavior.AllowGet);
        }
    }
}