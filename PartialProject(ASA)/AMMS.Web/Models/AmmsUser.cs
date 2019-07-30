using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AMMS.Web.Models
{
    public class AmmsUser
    {
        public string LoginId { get; set; }
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string RoleId { get; set; }
        public string EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string SecretKey { get; set; }
        public string ApiKey { get; set; }
        public string ApiIv { get; set; }
        public bool IsLoggedInFirstTime { get; set; }
        public Nullable<System.DateTime> LastPasswordChangeDate { get; set; }
    }
    public class AmmsPassWordHistory
    {
        public long Id { get; set; }
        public int UserId { get; set; }
        public string Password { get; set; }
        public System.DateTime PasswordChangeDate { get; set; }
      
    }
}