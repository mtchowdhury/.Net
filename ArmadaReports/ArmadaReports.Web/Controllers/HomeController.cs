using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.Security;
using ArmadaReports.Logger.Service;
using ArmadaReports.Web.Helper;
using ArmadaReports.Web.Models;


namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    public class HomeController : BaseController
    {
        private LoggerService _loggerService;
        public HomeController()
        {
            _loggerService = new LoggerService();
        }

        [AllowAnonymous]
        public ActionResult Auth(string userId)
        {

            if (string.IsNullOrEmpty(userId) && ReadFromConfig.IgnoreSecurityCheck)
            {
                userId = DebugAuthorizeAttribute.DebugUserId;
                _loggerService.LogInfo("IgnoreSecurityCheck = true, empty userid, default userid = " + userId + " set");
            }

            if (string.IsNullOrEmpty(userId))
            {
                _loggerService.LogInfo("IgnoreSecurityCheck = false, empty userid, login failed");
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            if (!ReadFromConfig.IgnoreSecurityCheck && !HttpContext.Request.IsAuthenticated)
            {
                _loggerService.LogInfo("IgnoreSecurityCheck = false, userid = " + userId + " not authorized with main connect app, login failed");
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var rep = new UserRepository(connectionString);
            var user = rep.GetUserById(userId);

            if (user == null)
            {
                _loggerService.LogInfo("Unauthorized user (user = null) with id = " + userId +", login failed");
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            if (!ReadFromConfig.IgnoreSecurityCheck && string.Compare(user.FullName, HttpContext.User.Identity.Name, true) != 0)
            {
                _loggerService.LogInfo("User not authorized with main connect app, user name mismatched, userid = " + userId);
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            user.HasPrivilege = rep.GetUserPrivilege(userId);
            var repLink = ScorecardRepository.GetReportLinkByUserId(userId);
            user.Report = (repLink != null) ? repLink.ReportName : "";
            var kaleoUser = new ConfigRepository(connectionString).CheckKaleo(user.UserId);
            user.IsKaleo = kaleoUser.IsKaleo ? 1 : 0;
            user.KaleoUserType = kaleoUser.UserType;
            UserInfoCookie.SetUserInfo(user);
            FormsAuthentication.SetAuthCookie(user.FullName, true);

            _loggerService.LogInfo("User successfully authorized. Redirecting to " + 
                (user.HasPrivilege.Equals("VUMP EpiPen") ? "EPIPEN" : "HOME") +" page with Cookie" +
                " [userid: " + user.UserId +
                "] [Previlege: " + user.HasPrivilege +
                "] [Report Link: " + user.Report +
                "] [IsKaleo: " + user.IsKaleo +
                "] [KaleoUserType: " + user.KaleoUserType + "]");
            if (user.HasPrivilege.Equals("VUMP EpiPen"))
                return Redirect("Home/Epipen");
            return RedirectToAction("Index", "Home");
        }

        [FormTimeout]
        [EpipenPrivilege]
        public ActionResult Index()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            AnalyticUser user = UserInfoCookie.GetUserInfo();

            if (user.HasPrivilege.Equals("VUMP EpiPen"))
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            Extension.Helper.LogPageAccess(connectionString, Request, user);
            if (user != null && user.UserId != null)
            {
                var role = new UserRepository(connectionString).GetRoleByUser(user.UserId);
                var cipher = new UserRepository(connectionString).IsCipherUser(user.UserId);
                var kaleoUser = new ConfigRepository(connectionString).CheckKaleo(user.UserId);
                ViewData["iskaleo"] = kaleoUser.IsKaleo ? "1" : "0";
                ViewData["kaleousertype"] = kaleoUser.UserType;
                ViewData["usertype"] = role.UserType;
                ViewData["userid"] = user.UserId;
                ViewData["cipher"] = cipher;
                ViewData["userrolename"] = user.HasPrivilege;
                ViewData["isauviq"] = ConfigurationManager.AppSettings["Auviq"].Split('|')
                        .Any(u => u.ToLower().Equals(user.UserId.ToLower())) ? "1" : "0";
                return View();
            }
            else
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }
        }

        [FormTimeout]
        [ExternalPrivilege]
        public ActionResult Epipen()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            AnalyticUser user = UserInfoCookie.GetUserInfo();

            if (!user.HasPrivilege.Equals("VUMP EpiPen") && !user.HasPrivilege.Equals("Armada employee"))
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            Extension.Helper.LogPageAccess(connectionString, Request, user);

            if (user != null && user.UserId != null)
            {
                var userId = user.UserId;
                var role = new UserRepository(connectionString).GetRoleByUser(userId);
                var cipher = new UserRepository(connectionString).IsCipherUser(userId);
                ViewData["usertype"] = role.UserType;
                ViewData["userid"] = userId;
                ViewData["cipher"] = cipher;
                ViewData["userrolename"] = user.HasPrivilege;
                ViewData["isauviq"] = ConfigurationManager.AppSettings["Auviq"].Split('|')
                        .Any(u => u.ToLower().Equals(user.UserId.ToLower())) ? "1" : "0";
                return View();
            }
            else
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }
        }

        [FormTimeout]
        [AdminPrivilege]
        public ActionResult Admin()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();

            if (!ConfigurationManager.AppSettings["admins"].Split('|')
                    .Any(u => u.ToLower().Equals(user.UserId.ToLower())))
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            if (user != null && user.UserId != null)
            {
                var role = new UserRepository(connectionString).GetRoleByUser(user.UserId);
                var cipher = new UserRepository(connectionString).IsCipherUser(user.UserId);
                ViewData["usertype"] = role.UserType;
                ViewData["userid"] = user.UserId;
                ViewData["cipher"] = cipher;
                ViewData["userrolename"] = user.HasPrivilege;
                ViewData["isauviq"] = ConfigurationManager.AppSettings["Auviq"].Split('|')
                        .Any(u => u.ToLower().Equals(user.UserId.ToLower())) ? "1" : "0";
                return View();
            }
            else
            {
                LogOff();
                return Redirect(ConfigurationManager.AppSettings["redirectUrl"]);
            }
        }

        [FormTimeout]
        [AdminPrivilege]
        public ActionResult Impersonation()
        {
            return View();
        }

        [FormTimeout]
        [AdminPrivilege]
        [HttpPost]
        public ActionResult Impersonation(ImpersonateModel model)
        {
            if (string.IsNullOrEmpty(model?.UserName))
            {
                ModelState.AddModelError("", "Please enter user name!");
                return View();
            }
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var rep = new UserRepository(connectionString);
            var user = rep.GetUserByName(model.UserName);

            if (user?.UserId == null)
            {
                ModelState.AddModelError("", "No User found with the user name: " + model.UserName);
                return View();
            }

            user.HasPrivilege = rep.GetUserPrivilege(user.UserId);
            var repLink = ScorecardRepository.GetReportLinkByUserId(user.UserId);
            user.Report = (repLink != null) ? repLink.ReportName : "";
            var kaleoUser = new ConfigRepository(connectionString).CheckKaleo(user.UserId);
            user.IsKaleo = kaleoUser.IsKaleo ? 1 : 0;
            user.KaleoUserType = kaleoUser.UserType;
            UserInfoCookie.SetUserInfo(user);
            FormsAuthentication.SetAuthCookie(user.FullName, true);

            _loggerService.LogInfo("Impersonate User successfully authorized. Redirecting to " +
                (user.HasPrivilege.Equals("VUMP EpiPen") ? "EPIPEN" : "HOME") + " page with Cookie" +
                " [userid: " + user.UserId +
                "] [Previlege: " + user.HasPrivilege +
                "] [Report Link: " + user.Report +
                "] [IsKaleo: " + user.IsKaleo +
                "] [KaleoUserType: " + user.KaleoUserType + "]");
            if (user.HasPrivilege.Equals("VUMP EpiPen"))
                return Redirect("Home/Epipen");
            return RedirectToAction("Index", "Home");
        }

        private string LogNewLine()
        {
            return Environment.NewLine;
        }
    }
}