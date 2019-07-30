using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Models.Admin;
using ArmadaReports.Web.Repository.Admin;
using ArmadaReports.Web.Helper;
using ArmadaReports.Web.Repository;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class AdminController : Controller
    {
        // GET: Admin
        public ActionResult Index()
        {
            var user = UserInfoCookie.GetUserInfo();
            var reportLink = ScorecardRepository.GetReportLinkByUserId(user.UserId);
            ViewData["ReportName"] = reportLink == null ? string.Empty : reportLink.ReportName;
            return View();
        }

        [HttpGet]
        public JsonResult GetPrograms()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new AdminRepository(connectionString);
            return Json(repo.GetPrograms(), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetPanelInfo(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new AdminRepository(connectionString);
            return Json(repo.GetPanelInfo(programId), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetReportInfo(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new AdminRepository(connectionString);
            var user = UserInfoCookie.GetUserInfo();

            return Json(repo.GetReportInfo(programId, user.UserId), JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetDetailsFieldInfo(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new AdminRepository(connectionString);
            return Json(repo.GetDetailsFieldInfo(programId), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SavePanels(List<PanelInsertModel> panels)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            if (user != null && user.UserId != null)
            {
                panels.ForEach(p =>
                {
                    p.UserId = user.UserId;
                    p.ReportId = 1;
                });
            }
            var repo = new AdminRepository(connectionString);
            return Json(repo.SavePanels(panels));
        }

        [HttpPost]
        public JsonResult SaveReports(List<ReportInsertModel> reports)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            if (user != null && user.UserId != null)
            {
                reports.ForEach(p =>
                {
                    p.UserId = user.UserId;
                    //p.ReportId = 1;
                });
            }
            var repo = new AdminRepository(connectionString);
            return Json(repo.SaveReports(reports, user.UserType));
        }

        [HttpPost]
        public JsonResult SaveFields(List<FieldInsertModel> fields)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new AdminRepository(connectionString);
            return Json(repo.SaveFields(fields));
        }

        [HttpGet]
        public JsonResult RefreshPrograms()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var repo = new AdminRepository(connectionString);
            return Json(repo.RefreshPrograms(user.UserId), JsonRequestBehavior.AllowGet);
        }
    }
}