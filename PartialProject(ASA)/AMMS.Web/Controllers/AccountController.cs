using System;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using AMMS.Logger;
using AMMS.Logger.Interfaces;
using AMMS.Service.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using AMMS.Web.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Web.Http.Controllers;
using System.Web.Routing;
using System.Web.Services.Protocols;
using AMMS.Common.Globals;
using AMMS.Mail.Service.Services;
using AMMS.Web.Service;

namespace AMMS.Web.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly NotificationMail _notificationMail;
        //asd
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private ILoggerService _loggerService;
        private OneTimePasswordCheck _OTP;
        public AccountController()
        {

        }

        public AccountController(ILoggerService loggerService)
        {
            _loggerService = loggerService;
            //_notificationMail = new NotificationMail();
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
            //_notificationMail = new NotificationMail();
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
                //HttpContext.Request.UserHostAddress
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = "/Home/Index";
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        public ActionResult Login(UserModel model, string returnUrl)
        {
            var currentDate = DateTime.Today;

            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var developerList = new List<int> { 0, 50325, 50800, 50327, 50428, 51223, 50326, 52990 };
            using (HttpClient httpClient = new HttpClient())
            {
                var encryption = new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY, AMMS.Common.Globals.SecurityConfig.IV);
                var request = new HttpRequestMessage
                {
                    RequestUri = new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] + "authorization/user/get?userName=" + encryption.EncodeToBase64String(model.UserId) + "&password=" + encryption.EncodeToBase64String(model.Password)),
                    Method = HttpMethod.Get
                };
                //request.Headers.Add(ConfigurationManager.AppSettings["ApiKey"], ConfigurationManager.AppSettings["ApiKeyValue"]);
                request.Headers.Add("User", "AllowAnonymous-" + model.UserId);
                var response = httpClient.SendAsync(request).GetAwaiter().GetResult();
                var result = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                var user = JsonConvert.DeserializeObject<AmmsUser>(result);
                _OTP = new OneTimePasswordCheck();
                if (user == null  || user.Name == null)
                {
                    // call to match the OTP
                    //var otpCheck = _OTP.CheckOTP(model.UserId, model.Password);
                    //if (otpCheck) return RedirectToAction("ResetNewPassword", "Account", new { code = "reset", employee = model.UserId });
                    var otpCheck = _OTP.CheckOTP(model.UserId, model.Password);
                    if (otpCheck) return RedirectToAction("ResetNewPassword", "Account", new { code = "reset", employee = model.UserId });
                    ModelState.AddModelError("", "Invalid user id or password!");
                    return View(model);
                }

                if (user.LastPasswordChangeDate == null)
                {
                    user.LastPasswordChangeDate = DateTime.Today;
                }
                TimeSpan time = currentDate.Date - user.LastPasswordChangeDate.GetValueOrDefault();
                int days = time.Days;


                
                // for checking
                //var otpChecktemp = _OTP.CheckOTP(model.UserId, model.Password);
                //if (otpChecktemp) return RedirectToAction("ResetNewPassword", "Account", new { code = "reset", employee = model.UserId });
                //if (user == null || user.Name == null)
                //{
                //    // call to match the OTP
                //    var otpCheck = _OTP.CheckOTP(model.UserId, model.Password);
                //    if (otpCheck) return RedirectToAction("ResetNewPassword", "Account", new { code = "reset", employee = model.UserId });
                //    ModelState.AddModelError("", "Invalid user id or password!");
                //    return View(model);
                //}
                if (user.IsLoggedInFirstTime && !developerList.Contains(Convert.ToInt32(user.EmployeeCode)) || days >= 30)
                {
                    return RedirectToAction("ResetPassword", "Account", new { code = "reset", employee = model.UserId });
                }
                //FormsAuthentication.SetAuthCookie(user.Name, model.RememberMe, JsonConvert.SerializeObject(user));
                FormsAuthentication.SetAuthCookie(user.Name + " (" + user.EmployeeCode + ")", model.RememberMe);
                user.LoginId = model.UserId;
                SetAuthCookie(user, model.RememberMe);
                _loggerService.LogInfo($"Logged In user: {user.Name} ({user.EmployeeCode})");
                return RedirectToLocal(returnUrl);
            }
        }

        [AllowAnonymous]
        public ActionResult KeyExpired()
        {
            var user = User.Identity.Name;
            FormsAuthentication.SignOut();
            Session.Abandon();
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetExpires(DateTime.Now.AddSeconds(-1));
            Response.Cache.SetNoStore();

            // clear authentication cookie
            HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, "");
            cookie.Expires = DateTime.Now.AddYears(-1);
            Response.Cookies.Add(cookie);

            _loggerService.LogInfo($"API Key Expired, Forced logged Out User: {user}");

            return RedirectToAction("UnAuthorized", "Account");
        }

        [AllowAnonymous]
        public ActionResult UnAuthorized()
        {
            return View();
        }

        private void SetAuthCookie(AmmsUser user, bool createPersistentCookie)
        {
            HttpCookie cookie = FormsAuthentication.GetAuthCookie(user.Name + " (" + user.EmployeeCode + ")", createPersistentCookie);
            //cookie.Name = "authCookie";
            FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(cookie.Value);
            FormsAuthenticationTicket newTicket = new FormsAuthenticationTicket(
                 ticket.Version, ticket.Name, ticket.IssueDate, ticket.Expiration
                , ticket.IsPersistent, JsonConvert.SerializeObject(user), ticket.CookiePath
            );

            var encTicket = FormsAuthentication.Encrypt(newTicket);
            cookie.Value = encTicket;
            System.Web.HttpContext.Current.Response.Cookies.Add(cookie);
        }

        //
        // GET: /Account/VerifyCode
        [AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            // Require that the user has already logged in via username/password or external login
            if (!await SignInManager.HasBeenVerifiedAsync())
            {
                return View("Error");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/VerifyCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes. 
            // If a user enters incorrect codes for a specified amount of time then the user account 
            // will be locked out for a specified amount of time. 
            // You can configure the account lockout settings in IdentityConfig
            var result = await SignInManager.TwoFactorSignInAsync(model.Provider, model.Code, isPersistent: model.RememberMe, rememberBrowser: model.RememberBrowser);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(model.ReturnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid code.");
                    return View(model);
            }
        }

        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);

                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    // await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                    return RedirectToAction("Index", "Home");
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ConfirmEmail
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return View("Error");
            }
            var result = await UserManager.ConfirmEmailAsync(userId, code);
            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }

        //
        // GET: /Account/ForgotPassword
        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            int originalEmployeeId;
            if (TempData.ContainsKey("EmployeeUserId"))
            {
                originalEmployeeId = Convert.ToInt32(TempData["EmployeeUserId"].ToString());
                TempData["UserId"] = originalEmployeeId;
            }
            int originalEmail;
            if (TempData.ContainsKey("EmployeeEmail"))
            {
                string employeeEmail = TempData["EmployeeEmail"].ToString();
                TempData["OriginalEmail"] = employeeEmail;
            }
            return View();
        }

        //
        // POST: /Account/ForgotPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            int originalEmployeeId;
            if (TempData.ContainsKey("UserId") || TempData.ContainsKey("EmployeeUserId"))
            {
                originalEmployeeId = Convert.ToInt32(TempData["UserId"].ToString());
                if (originalEmployeeId == 0)
                {
                    originalEmployeeId = Convert.ToInt32(TempData["EmployeeUserId"].ToString());
                }
                if (model.EmployeeId != originalEmployeeId)
                {
                    model.EmployeeId = originalEmployeeId;
                    return View("ForgotPasswordError", model);
                }
            }
            if (ModelState.IsValid)
            {
                var hashInfo = new UserHashInfo();
                hashInfo.LinkHash = Guid.NewGuid();
                hashInfo.EmployeeId = model.EmployeeId;
                var receiver = new List<string>();
                receiver.Add(model.Email);
                var baseUrl = System.Web.HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority);
                if (!baseUrl.Contains("localhost"))
                {
                    baseUrl = baseUrl + "/amms-web";
                }
                var mail = new AmmsMail
                {
                    MailSubject = (ConfigurationManager.AppSettings["ResetPasswordMailSubject"]),
                    MailBody = FormatBody(baseUrl + "/Account/PasswordResetWhenForgot?hash=" + hashInfo.LinkHash+"-"+model.EmployeeId),
                    ReceiverList = receiver,
                };
                if (receiver.Any())
                {
                    var notificationMail = new NotificationMail();
                    notificationMail.SendNotificationMail(mail);
                }

                using (HttpClient httpClient = new HttpClient())
                {
                    var encryption = new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY,
                        AMMS.Common.Globals.SecurityConfig.IV);
                    var request = new HttpRequestMessage
                    {
                        RequestUri =
                            new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                                    "authorization/user/saveHashInfoForPasswordReset?hash=" + encryption.EncodeToBase64String(hashInfo.LinkHash.ToString()) +
                                "&employeeId=" + encryption.EncodeToBase64String(hashInfo.EmployeeId.ToString())),
                        Method = HttpMethod.Get
                    };
                    //request.Headers.Add(ConfigurationManager.AppSettings["ApiKey"], ConfigurationManager.AppSettings["ApiKeyValue"]);
                    request.Headers.Add("User", "AllowAnonymous-" + hashInfo.EmployeeId);
                    var response = httpClient.SendAsync(request).GetAwaiter().GetResult();
                    var requestresult = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    var requestuser = JsonConvert.DeserializeObject<CrudResult>(requestresult);
                    if (requestuser.Success)
                    {
                        return View("Login");
                    }
                    else
                    {
                        return View("Error");
                    }

                }

                //var user = await UserManager.FindByNameAsync(model.Email);
                //if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                //{ 
                //    // Don't reveal that the user does not exist or is not confirmed
                //    return View("ForgotPasswordConfirmation");
                //}

                // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                // string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                // var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);		
                // await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");
                // return RedirectToAction("ForgotPasswordConfirmation", "Account");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ForgotPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        //
        // GET: /Account/ResetPassword
        [AllowAnonymous]
        public ActionResult ResetPassword(string code, int employee)
        {
            TempData["EmployeeId"] = employee;
            return code == null ? View("Error") : View();
        }
        //[AllowAnonymous]
        //public ActionResult ResetPasswordError(string code, int employee)
        //{
        //    TempData["EmployeeId"] = employee;
        //    return code == null ? View("Error") : View();
        //}

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            int originalEmployeeId;
            if (TempData.ContainsKey("EmployeeId"))
            {
                originalEmployeeId = Convert.ToInt32(TempData["EmployeeId"].ToString());
                if (model.EmployeeId != originalEmployeeId)
                {
                    model.EmployeeId = originalEmployeeId;
                    return View("ResetPasswordError", model);
                }
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            using (HttpClient httpClient = new HttpClient())
            {
                var encryption = new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY,
                    AMMS.Common.Globals.SecurityConfig.IV);
                var request = new HttpRequestMessage
                {
                    RequestUri =
                        new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                                "authorization/user/get?userName=" + encryption.EncodeToBase64String(model.EmployeeId.ToString()) +
                                "&password=" + encryption.EncodeToBase64String(model.PreviousPassword)),
                    Method = HttpMethod.Get
                };
                //request.Headers.Add(ConfigurationManager.AppSettings["ApiKey"], ConfigurationManager.AppSettings["ApiKeyValue"]);
                request.Headers.Add("User", "AllowAnonymous-" + model.EmployeeId);
                var response = httpClient.SendAsync(request).GetAwaiter().GetResult();
                var requestresult = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                var requestuser = JsonConvert.DeserializeObject<AmmsUser>(requestresult);
                if (requestuser == null || model.PreviousPassword == model.Password)
                {
                    return View("PreviousPasswordError", model);
                }



                var requestForPreviousPassword = new HttpRequestMessage
                {
                    RequestUri =
                        new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                                "authorization/user/getPasswordHistory?userName=" + encryption.EncodeToBase64String(model.EmployeeId.ToString()) +
                                "&password=" + encryption.EncodeToBase64String(model.PreviousPassword)),
                    Method = HttpMethod.Get
                };
                //request.Headers.Add(ConfigurationManager.AppSettings["ApiKey"], ConfigurationManager.AppSettings["ApiKeyValue"]);
                requestForPreviousPassword.Headers.Add("User", "AllowAnonymous-" + model.EmployeeId);
                var responseForPreviousPassword = httpClient.SendAsync(requestForPreviousPassword).GetAwaiter().GetResult();
                var requestresultForPreviousPassword = responseForPreviousPassword.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                var requestuserForPreviousPassword = JsonConvert.DeserializeObject<List<AmmsPassWordHistory>>(requestresultForPreviousPassword);
                foreach (var previousPassword in requestuserForPreviousPassword)
                {
                    if (model.Password == previousPassword.Password)
                    {
                        return View("PreviousPasswordError", model);
                    }
                }



                var resetPasswordRequest = new HttpRequestMessage
                {
                    RequestUri =
                        new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                                "authorization/user/resetPassword?userName=" + encryption.EncodeToBase64String(requestuser.EmployeeCode) +
                                "&password=" + encryption.EncodeToBase64String(model.Password)),
                    Method = HttpMethod.Post
                };
                resetPasswordRequest.Headers.Add("User", requestuser.UserId);
                resetPasswordRequest.Headers.Add("ApiKey", requestuser.SecretKey);
                var responseForReset = httpClient.SendAsync(resetPasswordRequest).GetAwaiter().GetResult();
                var responseForResetResult = responseForReset.Content.ReadAsStringAsync().GetAwaiter().GetResult();

                var finalResult = JsonConvert.DeserializeObject<AmmsUser>(responseForResetResult);
                //if (finalResult.Success)
                if (!finalResult.IsLoggedInFirstTime)
                {
                    var logoutRequest = new HttpRequestMessage
                    {
                        RequestUri =
                        new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                                "authorization/user/logout?userName=" + encryption.EncodeToBase64String(model.EmployeeId.ToString()) +
                                "&password=" + encryption.EncodeToBase64String(requestuser.SecretKey)),
                        Method = HttpMethod.Get
                    };
                    logoutRequest.Headers.Add("User", requestuser.UserId);
                    logoutRequest.Headers.Add("ApiKey", requestuser.SecretKey);
                    var responseLogOut = httpClient.SendAsync(logoutRequest).GetAwaiter().GetResult();
                    var responseForLogOutResult = responseLogOut.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    var finalLogoutResult = JsonConvert.DeserializeObject<AmmsUser>(responseForLogOutResult);
                    if (finalLogoutResult.SecretKey != null)
                    {
                        return View("Error");
                    }
                    else
                    {
                        return View("PassWordResetSuccess");
                    }
                    //return RedirectToAction("ResetPassword", "Account", new {code = "reset"});
                }
                //{
                //    return RedirectToAction("Login", "Account");
                //}
                //else
                //{
                //    return RedirectToAction("ResetPassword", "Account", new {code = "reset"});
                //}
            }
            //var user = await UserManager.FindByNameAsync(model.Email);
            //if (user == null)
            //{
            //    // Don't reveal that the user does not exist
            //    return RedirectToAction("ResetPasswordConfirmation", "Account");
            //}
            //var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            //if (result.Succeeded)
            //{
            //    return RedirectToAction("ResetPasswordConfirmation", "Account");
            //}
            //AddErrors(result);
            //return View();
            return RedirectToAction("Login", "Account");
        }

        // GET: /Account/ResetPassword
        [AllowAnonymous]
        public ActionResult ResetNewPassword(string code, int employee)
        {

            return code == null ? View("Error") : View();
        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetNewPassword(ResetOTPViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            using (HttpClient httpClient = new HttpClient())
            {
                var encryption = new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY,
                    AMMS.Common.Globals.SecurityConfig.IV);
                //var request = new HttpRequestMessage
                //{
                //    RequestUri =
                //        new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                //                "authorization/user/get?userName=" + encryption.EncodeToBase64String(model.EmployeeId.ToString()) +
                //                "&password=" + encryption.EncodeToBase64String(model.PreviousPassword)),
                //    Method = HttpMethod.Get
                //};
                ////request.Headers.Add(ConfigurationManager.AppSettings["ApiKey"], ConfigurationManager.AppSettings["ApiKeyValue"]);
                //request.Headers.Add("User", "AllowAnonymous-" + model.EmployeeId);
                //var response = httpClient.SendAsync(request).GetAwaiter().GetResult();
                //var requestresult = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                //var requestuser = JsonConvert.DeserializeObject<AmmsUser>(requestresult);
                //if (requestuser == null || model.PreviousPassword == model.Password)
                //{
                //    return View("PreviousPasswordError", model);
                //}
                var resetPasswordRequest = new HttpRequestMessage
                {
                    RequestUri =
                        new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                                "authorization/user/resetPassword?userName=" + encryption.EncodeToBase64String(model.EmployeeId.ToString()) +
                                "&password=" + encryption.EncodeToBase64String(model.Password)),
                    Method = HttpMethod.Post
                };
                //resetPasswordRequest.Headers.Add("User", model.EmployeeId.ToString());
                //resetPasswordRequest.Headers.Add("ApiKey", model.EmployeeId.ToString());
                resetPasswordRequest.Headers.Add("User", "AllowAnonymous-" + model.EmployeeId);
                var responseForReset = httpClient.SendAsync(resetPasswordRequest).GetAwaiter().GetResult();
                var responseForResetResult = responseForReset.Content.ReadAsStringAsync().GetAwaiter().GetResult();

                var finalResult = JsonConvert.DeserializeObject<AmmsUser>(responseForResetResult);
                //if (finalResult.Success)
                //if (!finalResult.IsLoggedInFirstTime)
                //{
                //    var logoutRequest = new HttpRequestMessage
                //    {
                //        RequestUri =
                //        new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                //                "authorization/user/logout?userName=" + encryption.EncodeToBase64String(model.EmployeeId.ToString()) +
                //                "&password=" + encryption.EncodeToBase64String(finalResult.SecretKey)),
                //        Method = HttpMethod.Get
                //    };
                //    logoutRequest.Headers.Add("User", finalResult.UserId);
                //    logoutRequest.Headers.Add("ApiKey", finalResult.SecretKey);
                //    var responseLogOut = httpClient.SendAsync(logoutRequest).GetAwaiter().GetResult();
                //    var responseForLogOutResult = responseLogOut.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                //    var finalLogoutResult = JsonConvert.DeserializeObject<AmmsUser>(responseForLogOutResult);
                //    if (finalLogoutResult.SecretKey != null)
                //    {
                //        return View("Error");
                //    }

                //}
            }
            return RedirectToAction("Login", "Account");
        }



        //
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/SendCode
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            var userId = await SignInManager.GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return View("Error");
            }
            var userFactors = await UserManager.GetValidTwoFactorProvidersAsync(userId);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/SendCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            // Generate the token and send it
            if (!await SignInManager.SendTwoFactorCodeAsync(model.SelectedProvider))
            {
                return View("Error");
            }
            return RedirectToAction("VerifyCode", new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var result = await SignInManager.ExternalSignInAsync(loginInfo, isPersistent: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = false });
                case SignInStatus.Failure:
                default:
                    // If the user does not have an account, then prompt the user to create an account
                    ViewBag.ReturnUrl = returnUrl;
                    ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = loginInfo.Email });
            }
        }

        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Manage");
            }

            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            var user = User.Identity.Name;

            var cookie = Request.Cookies[FormsAuthentication.FormsCookieName];
            if (cookie == null) return null;
            var decyrptedCookie = FormsAuthentication.Decrypt(cookie.Value);
            if (decyrptedCookie == null) return null;
            var existingUser = JsonConvert.DeserializeObject<AmmsUser>(decyrptedCookie.UserData);
            using (HttpClient httpClient = new HttpClient())
            {
                var encryption = new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY, AMMS.Common.Globals.SecurityConfig.IV);
                var request = new HttpRequestMessage
                {
                    RequestUri = new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] + "authorization/user/logout?userId=" + encryption.EncodeToBase64String(existingUser.UserId) + "&secretKey=" + encryption.EncodeToBase64String(existingUser.SecretKey)),
                    Method = HttpMethod.Get
                };
                //request.Headers.Add(ConfigurationManager.AppSettings["ApiKey"], ConfigurationManager.AppSettings["ApiKeyValue"]);
                request.Headers.Add("User", "AllowAnonymous-" + existingUser.EmployeeId);
                var response = httpClient.SendAsync(request).GetAwaiter().GetResult();
            }

            FormsAuthentication.SignOut();
            Session.Abandon();
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetExpires(DateTime.Now.AddSeconds(-1));
            Response.Cache.SetNoStore();
            _loggerService.LogInfo($"Logged Out User: {user}");
            return RedirectToAction("Login", "Account");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            //if (Url.IsLocalUrl(returnUrl))
            //{
            //    return Redirect(returnUrl);
            //}
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion

        public ActionResult UserInfo()
        {
            throw new NotImplementedException();
        }
        [AllowAnonymous]
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        [AllowAnonymous]
        public ActionResult ForgotPasswordCheckForEmail()
        {
            HttpRequestContext context = new HttpRequestContext();
            string url = context.VirtualPathRoot;
            return View();
        }
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPasswordCheckForEmail(ForgotPasswordViewModel model)
        {

            TempData["EmployeeUserId"] = model.EmployeeId;
            if (ModelState.IsValid)
            {
                using (HttpClient httpClient = new HttpClient())
                {
                    var encryption = new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY, AMMS.Common.Globals.SecurityConfig.IV);
                    var request = new HttpRequestMessage
                    {
                        RequestUri = new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] + "authorization/user/getEmailInfo?employeeId=" + encryption.EncodeToBase64String(model.EmployeeId.ToString())),
                        Method = HttpMethod.Get
                    };
                    //request.Headers.Add(ConfigurationManager.AppSettings["ApiKey"], ConfigurationManager.AppSettings["ApiKeyValue"]);
                    request.Headers.Add("User", "AllowAnonymous-" + model.EmployeeId);
                    var response = httpClient.SendAsync(request).GetAwaiter().GetResult();
                    var result = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    var user = JsonConvert.DeserializeObject<AmmsUser>(result);
                    if (user.EmployeeId == "0")
                    {
                        // call to match the OTP
                        //var otpCheck = _OTP.CheckOTP(model.UserId, model.Password);
                        //if (otpCheck) return RedirectToAction("ResetNewPassword", "Account", new { code = "reset", employee = model.UserId });
                        ModelState.AddModelError("", "Invalid user id");
                        return View(model);
                    }
                    else
                    {
                        if (user.Email != null && user.Email != "")
                        {
                            TempData["EmployeeEmail"] = user.Email;
                            return RedirectToAction("ForgotPassword");
                        }
                        else
                        {
                            //return RedirectToAction("ResetNewPassword", "Account", new { code = "reset", employee = Convert.ToInt32(user.EmployeeId) });
                            return View("OfflinePasswordReset");
                        }
                    }
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult PasswordResetWhenForgot(string hash)
        {
            int index = hash.LastIndexOf('-');
            string empId = hash.Substring(index+1);
            int employeeId = Convert.ToInt32(empId);
            using (HttpClient httpClient = new HttpClient())
            {
                var encryption = new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY,
                    AMMS.Common.Globals.SecurityConfig.IV);
                var request = new HttpRequestMessage
                {
                    RequestUri =
                        new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                                "authorization/user/getHashInfoForPasswordReset?employeeId=" +
                                encryption.EncodeToBase64String(employeeId.ToString())
                            ),
                    Method = HttpMethod.Get
                };
                //request.Headers.Add(ConfigurationManager.AppSettings["ApiKey"], ConfigurationManager.AppSettings["ApiKeyValue"]);
                request.Headers.Add("User", "AllowAnonymous-" + employeeId);
                var response = httpClient.SendAsync(request).GetAwaiter().GetResult();
                var requestresult = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                var requestuser = JsonConvert.DeserializeObject<UserHashInfo>(requestresult);
                var date = DateTime.Now;
                TimeSpan span = date.Subtract(requestuser.CreatedOn);

                if (
                    span.TotalSeconds > int.Parse(ConfigurationManager.AppSettings["ResetpasswordExpireTime"]) ||
                    requestuser.IsUsed == true)
                {
                    return View("LinkExpired");
                }
            }
            TempData["hash"] = hash;
            return View();
            
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult PasswordResetWhenForgot(ResetPasswordViewModelWhenForgot model)
        {
            string hashFromLink = "";
            if (TempData.ContainsKey("hash"))
            {
                hashFromLink = TempData["hash"].ToString();
            }
            using (HttpClient httpClient = new HttpClient())
            {
                var encryption = new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY,
                    AMMS.Common.Globals.SecurityConfig.IV);
                var request = new HttpRequestMessage
                {
                    RequestUri =
                        new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                                "authorization/user/getHashInfoForPasswordReset?employeeId=" + encryption.EncodeToBase64String(model.EmployeeId.ToString())
                            ),
                    Method = HttpMethod.Get
                };
                //request.Headers.Add(ConfigurationManager.AppSettings["ApiKey"], ConfigurationManager.AppSettings["ApiKeyValue"]);
                request.Headers.Add("User", "AllowAnonymous-" + model.EmployeeId);
                var response = httpClient.SendAsync(request).GetAwaiter().GetResult();
                var requestresult = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                var requestuser = JsonConvert.DeserializeObject<UserHashInfo>(requestresult);
                var date = DateTime.Now;
                TimeSpan span = date.Subtract(requestuser.CreatedOn);

                if (requestuser.LinkHash.ToString()+"-"+model.EmployeeId.ToString() != hashFromLink || span.TotalSeconds > int.Parse(ConfigurationManager.AppSettings["ResetpasswordExpireTime"]) || requestuser.IsUsed == true)
                {
                    return View("HashError");
                }
                else
                {
                    var requestForPreviousPassword = new HttpRequestMessage
                    {
                        RequestUri =
                        new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                                "authorization/user/getPasswordHistory?userName=" + encryption.EncodeToBase64String(model.EmployeeId.ToString()) +
                                "&password=" + encryption.EncodeToBase64String(model.Password)),
                        Method = HttpMethod.Get
                    };
                    //request.Headers.Add(ConfigurationManager.AppSettings["ApiKey"], ConfigurationManager.AppSettings["ApiKeyValue"]);
                    requestForPreviousPassword.Headers.Add("User", "AllowAnonymous-" + model.EmployeeId);
                    var responseForPreviousPassword = httpClient.SendAsync(requestForPreviousPassword).GetAwaiter().GetResult();
                    var requestresultForPreviousPassword = responseForPreviousPassword.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    var requestuserForPreviousPassword = JsonConvert.DeserializeObject<List<AmmsPassWordHistory>>(requestresultForPreviousPassword);
                    foreach (var previousPassword in requestuserForPreviousPassword)
                    {
                        if (model.Password == previousPassword.Password)
                        {
                            return View("PreviousPasswordErrorWhenForget", new PreviousPasswordErrorWhenForget { Hash = hashFromLink});
                        }
                    }



                    var resetPasswordRequest = new HttpRequestMessage
                    {
                        RequestUri =
                            new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                                    "authorization/user/resetPassword?userName=" + encryption.EncodeToBase64String(model.EmployeeId.ToString()) +
                                    "&password=" + encryption.EncodeToBase64String(model.Password)),
                        Method = HttpMethod.Post
                    };
                    //resetPasswordRequest.Headers.Add("User", requestuser.UserId);
                    //resetPasswordRequest.Headers.Add("ApiKey", requestuser.SecretKey);
                    var responseForReset = httpClient.SendAsync(resetPasswordRequest).GetAwaiter().GetResult();
                    var responseForResetResult = responseForReset.Content.ReadAsStringAsync().GetAwaiter().GetResult();

                    var finalResult = JsonConvert.DeserializeObject<AmmsUser>(responseForResetResult);















                    var requestForeditHash = new HttpRequestMessage
                    {
                        RequestUri =
                         new Uri(ConfigurationManager.AppSettings["MasterDataApiRoot"] +
                                 "authorization/user/editHashInfoForPasswordReset?employeeId=" + encryption.EncodeToBase64String(model.EmployeeId.ToString())
                             ),
                        Method = HttpMethod.Get
                    };
                    //request.Headers.Add(ConfigurationManager.AppSettings["ApiKey"], ConfigurationManager.AppSettings["ApiKeyValue"]);
                    requestForeditHash.Headers.Add("User", "AllowAnonymous-" + model.EmployeeId);
                    var responseForedit = httpClient.SendAsync(requestForeditHash).GetAwaiter().GetResult();
                    var requestresultEdit = responseForedit.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    var result = JsonConvert.DeserializeObject<CrudResult>(requestresultEdit);
                    if (result.Success)
                    {
                        return RedirectToAction("Login");
                    }
                    else
                    {
                        return View("HashEditError");
                    }
                }

            }
            return View();
        }

        private string FormatBody(string url)
        {
            return ConfigurationManager.AppSettings["ResetPasswordMailBody"]
                .Replace("###", "\"" + url + "\"")
                .Replace("&gt;", ">")
                .Replace("&lt;", "<");
        }

        //private  RouteData GetRouteData(HttpContextBase httpContext)
        //{
        //    var url = httpContext.Request.Headers["HOST"];

        //    var index = url.IndexOf(".", StringComparison.Ordinal);
        //    if (index < 0) return null;

        //    var firstDomain = url.Split('.')[0];
        //    if ((firstDomain.Equals("www") || firstDomain.Equals("localhost"))
        //        && !firstDomain.Equals(_subDomain))
        //        return null;

        //    var handler = new MvcRouteHandler();
        //    var result = new RouteData { RouteHandler = handler };
        //    foreach (var route in _routeData)
        //    {
        //        result.Values.Add(route.Key, route.Value);
        //    }

        //    return result;
        //}
    }
}