using System.Configuration;
using ArmadaReports.Web.Helper;
using ArmadaReports.Web.Models;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Repository;

namespace ArmadaReports.Web.Extension
{
    public class DebugAuthorizeAttribute : AuthorizeAttribute
    {
        public static string DebugUserId = ReadFromConfig.DefaultUserId;

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var rep = new UserRepository(connectionString);
            var user = rep.GetUserById(DebugUserId);
            httpContext.User = new GenericPrincipal(new GenericIdentity(user.FullName), new string[] { });

            UserInfoCookie.SetUserInfo(new AnalyticUser {
                UserId = DebugUserId,
                FullName = user.FullName,
                UserType = user.UserType
            });
            return true;
        }
    }
}