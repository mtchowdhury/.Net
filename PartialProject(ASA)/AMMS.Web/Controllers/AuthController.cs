using System.Web.Mvc;
using System.Web.Security;
using AMMS.Logger.Interfaces;
using AMMS.Web.Models;
using Newtonsoft.Json;

namespace AMMS.Web.Controllers
{
    [Authorize]
    public class AuthController : BaseController
    {
        public AuthController(ILoggerService loggerService) : base(loggerService)
        {
        }

        [HttpPost]
        public JsonResult Get()
        {
            var user = GetAmmsUser();
            return Json(new {User.Identity.Name, user.UserId, Role = user.RoleId, user.EmployeeId, user.SecretKey, user.ApiKey, user.ApiIv, user.LoginId,user.IsLoggedInFirstTime });
        }

        public AmmsUser GetAmmsUser()
        {
            var cookie = Request.Cookies[FormsAuthentication.FormsCookieName];
            if(cookie == null) return null;
            var decyrptedCookie = FormsAuthentication.Decrypt(cookie.Value);
            if (decyrptedCookie == null) return null;
            var user = JsonConvert.DeserializeObject<AmmsUser>(decyrptedCookie.UserData);
            return user;
        }
    }
}