using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ReferralStatus
    {
        public int ReferralCount { get; set; }
        public int TotalReferralCount { get; set; }
        public string ProgramSubstatus { get; set; }
    }
}