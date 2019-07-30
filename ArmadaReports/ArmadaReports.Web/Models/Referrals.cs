using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class Referrals
    {
        public int TotalCount { get; set; }
        public int ProgramId { get; set; }
        public int PharmacyId { get; set; }
        public string PharmacyName { get; set; }
        public string Referral { get; set; }
        public double TotalCountPercent { get; set; }
    }
}