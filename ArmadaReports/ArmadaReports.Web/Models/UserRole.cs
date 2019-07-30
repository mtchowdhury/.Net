using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class UserRole
    {
        public string UserType { get; set; }
        public string ReportsTo { get; set; }
    }
}