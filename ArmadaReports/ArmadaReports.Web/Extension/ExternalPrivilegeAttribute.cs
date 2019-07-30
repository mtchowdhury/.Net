using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.Routing;
using ArmadaReports.Logger.Service;
using ArmadaReports.Web.Repository;
using ArmadaReports.Web.Helper;

namespace ArmadaReports.Web.Extension
{
    public class ExternalPrivilegeAttribute: ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var user = UserInfoCookie.GetUserInfo();
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var rep = new UserRepository(connectionString);
            var hasPrivilege = rep.GetUserPrivilege(user.UserId);
            if (filterContext.HttpContext.Request.IsAuthenticated
                && hasPrivilege.Contains("external member"))
            {
                new LoggerService().LogInfo("User not authorized to see EPIPEN page with External privilege, logging out, userid = " + user.UserId);
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