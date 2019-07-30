using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class IncomingReferralByHour
    {
        public int ReferralCount { get; set; }
        public int TotalReferralCount { get; set; }
        public double ReferralCountPercent { get; set; }
        public string Date { get; set; }
        public int Hour { get; set; }
        public string HourStr { get; set; }
        public string Prescriber { get; set; }
        public string DateString { get; set; }
    }
}