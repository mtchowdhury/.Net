using ArmadaReports.Web.Extension;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Helper;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class TableController : Controller
    {
        [HttpGet]
        public JsonResult GetPatientWorkflows(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetWorkflow("[analytics].[GetPatientIntakeWorkflow]", programId, user.UserId, user.UserType, isArmadaEmployee),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetPhysicianWorkflows(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetWorkflow("[analytics].[GetPhysiciantakeWorkflow]", programId, user.UserId, user.UserType, isArmadaEmployee),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReferralSummaryByWeek(int programId, string inpTreatment,int insuranceType=-1)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var includeAllStatuses = ConfigurationManager.AppSettings["IncludeAllStatuses"] == "true";
            return Json(new Repository.Repository(connectionString).GetReferralSummaryByWeek(programId, user.UserId, user.UserType, inpTreatment, isArmadaEmployee, includeAllStatuses, insuranceType),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRankAndAddresss(int programId, string dateType)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetRandAndAddress(programId, user.UserId, user.UserType, dateType, isArmadaEmployee),
                JsonRequestBehavior.AllowGet);
        }
    }
}