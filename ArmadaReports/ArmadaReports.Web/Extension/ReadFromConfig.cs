using System;
using System.Configuration;

namespace ArmadaReports.Web.Models
{
    public class ReadFromConfig
    {
        public static AppSettingsReader asr = new AppSettingsReader();
        public static bool IgnoreSecurityCheck
        {
            get
            {
                return Convert.ToBoolean(ConfigurationManager.AppSettings["IgnoreSecurityCheck"] ?? "false");
            }
        }       
        public static string UnauthorizedRedirectUrl
        {
            get
            {
                if (IgnoreSecurityCheck)
                {
                    return "/Account/UnAuthorized";
                }
                return ConfigurationManager.AppSettings["redirectUrl"]?.ToString() ?? " /Account/UnAuthorized";
            }
        }

        public static string DefaultUserId => ConfigurationManager.AppSettings["DefaultUserId"];
        //public static string DefaultUserName => ConfigurationManager.AppSettings["DefaultUserName"];
        //public static string DefaultUserType => ConfigurationManager.AppSettings["DefaultUserType"];
    }
}