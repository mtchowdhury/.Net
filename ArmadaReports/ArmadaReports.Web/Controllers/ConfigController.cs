using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.MailHelper;
using ArmadaReports.Web.Models;
using ArmadaReports.Web.Repository;
using ArmadaReports.Web.Helper;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class ConfigController : Controller
    {
        [HttpGet]
        public JsonResult GetPanels(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var reportId = int.Parse(ConfigurationManager.AppSettings["ReportId"]);
            return Json(new ConfigRepository(connectionString).GetPanels(reportId, programId, user.UserId, user.UserType), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetReportMenuLinks(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            return Json(new ConfigRepository(connectionString)
                .GetReportMenuLinks(user.UserId, user.UserType, programId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveProgramPreference(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var applicationId = ConfigurationManager.AppSettings["ApplicationId"];
            var user = UserInfoCookie.GetUserInfo();
            return Json(new ConfigRepository(connectionString).SaveProgramPreference(applicationId, user.UserId, programId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult CopyProgramPreference(int sourceProgramId, int targetProgramId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return Json(new ConfigRepository(connectionString).CopyProgramPreference(sourceProgramId, targetProgramId), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetMailConfig(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return Json(new ConfigRepository(connectionString).GetMailConfig(programId), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SendEmail(MailTemplateModel mailTemplate)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var smtpHost = ConfigurationManager.AppSettings["SmtpHost"];
            var smtpPort = int.Parse(ConfigurationManager.AppSettings["SmtpPort"]);
            var fromAddress = ConfigurationManager.AppSettings["FromAddress"];
            var replySubject = ConfigurationManager.AppSettings["ReplySubject"];
            var replyBody = ConfigurationManager.AppSettings["ReplyBody"];
            //var templatePath = Server.MapPath("~/Template") + "\\" + ConfigurationManager.AppSettings["mailTemplate"];
            if(!System.IO.File.Exists(ConfigurationManager.AppSettings["mailTemplate"]))
                return Json(new MessageResult(false, "mail template does not exists!"));
            var template = System.IO.File.ReadAllText(ConfigurationManager.AppSettings["mailTemplate"]);
            var mailConfig = new ConfigRepository(connectionString).GetMailConfig(mailTemplate.ProgramId);
            return Json(new MailManager(smtpHost, smtpPort, fromAddress, template, replySubject, replyBody).Send(mailConfig, mailTemplate));
        }

        [HttpGet]
        public JsonResult IsExportDenied(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return Json(new ConfigRepository(connectionString).IsExportDenied(programId), 
                JsonRequestBehavior.AllowGet);
        }
    }
}