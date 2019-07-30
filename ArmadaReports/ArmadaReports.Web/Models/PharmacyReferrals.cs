using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class PharmacyReferrals
    {
        public List<Referrals> Referrals { get; set; }
        public int TotalCount { get; set; }
        public string DateString { get; set; }
    }
}