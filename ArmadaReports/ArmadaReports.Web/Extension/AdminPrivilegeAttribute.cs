using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using ArmadaReports.Web.Helper;

namespace ArmadaReports.Web.Extension
{
    public class AdminPrivilegeAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {

            var user = UserInfoCookie.GetUserInfo();  
            if (filterContext.HttpContext.Request.IsAuthenticated
                && !ConfigurationManager.AppSettings["admins"].Split('|').Any(u=>u.ToLower().Equals(user.UserId.ToLower())))
            {
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