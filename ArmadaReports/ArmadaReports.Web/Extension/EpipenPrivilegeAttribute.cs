using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.Routing;
using ArmadaReports.Logger.Service;
using ArmadaReports.Web.Helper;
using ArmadaReports.Web.Repository;
using Org.BouncyCastle.Bcpg;

namespace ArmadaReports.Web.Extension
{
    public class EpipenPrivilegeAttribute: ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var user = UserInfoCookie.GetUserInfo();
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var rep = new UserRepository(connectionString);
            var hasPrivilege = rep.GetUserPrivilege(user.UserId);
            if (filterContext.HttpContext.Request.IsAuthenticated
                && hasPrivilege.Contains("VUMP EpiPen"))
            {
                new LoggerService().LogInfo("User not authorized to see HOME page with Epipen privilege, logging out, userid = " + user.UserId);
                filterContext.Result = new RedirectToRouteResult(
                        new RouteValueDictionary {
                        { "Controller", "Account" },
                        { "Action", "UnAuthorized" }
                    });
            }
            base.OnActionExecuting(filterContext);
        }
    }
}