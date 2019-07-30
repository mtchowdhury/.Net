using System;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using ArmadaReports.Web.Models;
using ArmadaReports.Web.Helper;

namespace ArmadaReports.Web.Controllers
{
    public class BaseController : Controller
    {
        // GET: Base
        protected string RenderPartialViewToString(string viewName, object model)
        {
            if (string.IsNullOrEmpty(viewName))
                viewName = ControllerContext.RouteData.GetRequiredString("action");

            ViewData.Model = model;

            using (StringWriter sw = new StringWriter())
            {
                ViewEngineResult viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
                ViewContext viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);
                return sw.GetStringBuilder().ToString();
            }
        }

        public string GetUserId
        {
            get
            {
                var User = UserInfoCookie.GetUserInfo();
                if (User != null)
                    return User.UserId;
                return string.Empty;
            }
        }

        protected void LogOff()
        {
            FormsAuthentication.SignOut();
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetExpires(DateTime.Now.AddSeconds(-1));
            Response.Cache.SetNoStore();
            Session?.Abandon();
        }
    }
}