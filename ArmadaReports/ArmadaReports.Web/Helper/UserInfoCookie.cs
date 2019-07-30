using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using ArmadaReports.Web.Models;


namespace ArmadaReports.Web.Helper
{
    public class UserInfoCookie
    {
        private static String CookiesPrefix = "AsembiaAnalyticsMF_";
        public static void SetUserInfo(AnalyticUser user)
        {
            String userData = user.UserId + '|' + user.FullName + '|'
                + user.UserType + '|' + user.HasPrivilege + '|' + user.Report + '|' + user.IsKaleo + '|' + user.KaleoUserType;

            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, user.FullName,
                DateTime.Now, DateTime.Now.Add((FormsAuthentication.Timeout != null) ? FormsAuthentication.Timeout : new TimeSpan(0, 30, 0)),
                false, userData, FormsAuthentication.FormsCookiePath);
            string enTicket = FormsAuthentication.Encrypt(ticket);
            HttpCookie userCookie = new HttpCookie(CookiesPrefix, enTicket);
            HttpContext.Current.Response.Cookies.Add(userCookie);
        }

        public static AnalyticUser GetUserInfo()
        {
            AnalyticUser user = new AnalyticUser();
            HttpCookie userCookie = HttpContext.Current.Request.Cookies[CookiesPrefix];
            FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(userCookie.Value);
            string[] info = ticket.UserData.Split('|');
            if (info != null)
            {
                user.UserId = ticket.UserData.Split('|')[0];
                user.FullName = ticket.UserData.Split('|')[1];
                user.UserType = ticket.UserData.Split('|')[2];
                user.HasPrivilege = ticket.UserData.Split('|')[3];
                user.Report = ticket.UserData.Split('|')[4];
                user.IsKaleo = int.Parse(ticket.UserData.Split('|')[5]);
                user.KaleoUserType = int.Parse(ticket.UserData.Split('|')[6]);
            }
            return user;
        }

        public static bool IsArmadaEmployee(AnalyticUser user)
        {
            return user.HasPrivilege.CompareTo("Armada employee") == 0;
        }
    }
}