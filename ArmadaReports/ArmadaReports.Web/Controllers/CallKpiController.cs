using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Extension;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class CallKpiController : Controller
    {
        public JsonResult Get2HoursCallKpi(int programId, string dateType, bool fullDay, bool excludeNonWorkingDays)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return Json(new Repository.Repository(connectionString).Get2HoursCallKpi(programId, dateType, fullDay, excludeNonWorkingDays),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult Get2HoursCallVolume(int programId, string dateType, bool excludeNonWorkingDays)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return Json(new Repository.Repository(connectionString).Get2HoursCallVolume(programId, dateType, excludeNonWorkingDays),
                JsonRequestBehavior.AllowGet);
        }
    }
}