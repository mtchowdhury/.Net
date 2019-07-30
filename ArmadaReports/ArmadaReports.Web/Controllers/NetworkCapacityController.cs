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
    public class NetworkCapacityController : Controller
    {
        public JsonResult GetNetworkCapacity(int programId, string dateFrequency)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var stats = new Repository.Repository(connectionString).GetNetworkCapacity(programId, dateFrequency);
            return Json(stats, JsonRequestBehavior.AllowGet);
        }
    }
}