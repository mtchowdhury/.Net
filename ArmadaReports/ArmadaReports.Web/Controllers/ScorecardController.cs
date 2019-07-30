using System.Web.Mvc;
using ArmadaReports.Web.Helper;
using ArmadaReports.Web.Models;
using System.Configuration;
using System.Collections.Generic;
using ArmadaReports.Web.Repository;
using ArmadaReports.Web.Extension;
using System.Linq;

namespace ArmadaReports.Web.Controllers
{
   [Authorize]
    
    public class ScoreCardController : BaseController
    {
        AnalyticUser user = UserInfoCookie.GetUserInfo();
        public ScoreCardController()
        {
        }
       
        public ActionResult Index()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;

            Extension.Helper.LogPageAccess(connectionString, Request, user);
            var model = new HomeIndexViewModel()
            {
                GetPrograms = ScorecardRepository.GetPrograms(user.UserId.ToString(), null)
            };
            return View(model);
            //if (UserInfoCookie.GetUserInfo().UserType.Contains("PROGRAMMGR")
            //    && UserInfoCookie.GetUserInfo().Report != null
            //    && UserInfoCookie.GetUserInfo().Report.Contains("ScoreCard"))
            //{
            //    var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;

            //    Extension.Helper.LogPageAccess(connectionString, Request, user);
            //    var model = new HomeIndexViewModel()
            //    {
            //        GetPrograms = ScorecardRepository.GetPrograms(user.UserId.ToString(), null)
            //    };
            //    return View(model);
            //}
            //else
            //{
            //    LogOff();
            //    return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            //}
        }
       
        public ActionResult AjaxGetPharmacies()
        {
            var data = ScorecardRepository.GetPharmacies(GetUserId);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AjaxGetPrograms(int? PharmacyId)
        {
            var data = ScorecardRepository.GetPrograms(GetUserId, PharmacyId);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetReferralsVsTimeToFillAnalysis(ReferralsVsTimeToFillViewModel model)
        {
            model.UserId = user.UserId;
            model = ScorecardRepository.GetReferralsVsTimeToFill(model);
            return Json(model, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AjaxGetPharmacyScorecardReport(ScorecardViewModel model)
        {
            model.UserId = user.UserId; 
            var data = ScorecardRepository.GetScoreCardReport(model);
            var view = this.RenderPartialViewToString("_partialScoreCardReport", data);
            return Json(view, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AjaxGetPharmacyScorecardReportPeriod(ScorecardViewModel model)
        {
            model.UserId = user.UserId; 
            var data = ScorecardRepository.GetASPNHUBScoreCardReportPeriod(model);
            var data1 = ScorecardRepository.GetASPNHUBScoreCardReportPeriodLabels(model);
            var view = this.RenderPartialViewToString("_partialScoreCardReportPeriod", data);
            return Json(view, JsonRequestBehavior.AllowGet);
        }
    }
}