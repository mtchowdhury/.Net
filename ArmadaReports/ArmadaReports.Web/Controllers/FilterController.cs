using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Repository;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Helper;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class FilterController : Controller
    {
        [HttpGet]
        public JsonResult GetPrograms()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var applicationId = ConfigurationManager.AppSettings["ApplicationId"];
            var user = UserInfoCookie.GetUserInfo();
            var prefProgram = new ConfigRepository(connectionString).GetProgramPreference(applicationId, user.UserId);
            var programs = new Repository.Repository(connectionString).GetPrograms(user.UserId, applicationId);
            return Json(new { programs = programs, prefProgram = prefProgram }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetPharmacies(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var repo = new Repository.Repository(connectionString);
            return Json(repo.GetPharmacies(programId, user.UserId), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetFilterValues(string sp)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Repository(connectionString);
            return Json(repo.GetFilterValues(sp), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetFilterValuesWithoutOrdering(string sp, string spId = null)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Repository(connectionString);
            return Json(repo.GetFilterValuesWithoutOrdering(sp, spId), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetFilterValuesById(string sp, int spid)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Repository(connectionString);
            return Json(repo.GetFilterValuesById(sp, spid), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetFilterValuesByStrId(string sp, string spid)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Repository(connectionString);
            return Json(repo.GetFilterValuesByStrId(sp, spid), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetFilterValuesByParam(string sp, string param)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Repository(connectionString);
            return Json(repo.GetFilterValuesByParam(sp, param), JsonRequestBehavior.AllowGet);
        }
    }
}