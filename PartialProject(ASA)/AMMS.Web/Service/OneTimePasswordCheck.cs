using System;
using System.Linq;
using System.Text.RegularExpressions;
using AMMS.Service.Services.Utility;
using AMMS.Web.Models;
using Microsoft.ApplicationInsights.Web;

namespace AMMS.Web.Service
{
    public class OneTimePasswordCheck
    {

        public bool CheckOTP(string userId, string password)
        {
            var encryption = new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY,
                AMMS.Common.Globals.SecurityConfig.IV);

            var otppassword = encryption.EncodeToBase64String(userId + (DateUtility.DateToInt(DateTime.Today)/1000000) + password.Substring(password.Length - 4));
            //add time window of 5 minutes 
            bool digitsOnly = password.Substring(password.Length - 4).All(char.IsDigit);
            if (!digitsOnly) return false;
            if (DateUtility.DateToInt(DateTime.Now, true)  - Convert.ToInt64((DateUtility.DateToInt(DateTime.Today) / 1000000) +
                                password.Substring(password.Length - 4) + "00") >500 )
                return false;
            otppassword = Regex.Replace(otppassword, "[^a-km-np-zA-KM-NP-Z1-9]+", "", RegexOptions.Compiled);
            otppassword = otppassword.Substring(otppassword.Length - 8);
            return (otppassword + password.Substring(password.Length-4) == password);
        }
        
    }
}