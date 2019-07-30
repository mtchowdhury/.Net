using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ProgramDistrict
    {
        public double TotalCount { get; set; }
        public int ProgramId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public double TotalCountPercent { get; set; }
        public string ReferralCode { get; set; }
    }
}