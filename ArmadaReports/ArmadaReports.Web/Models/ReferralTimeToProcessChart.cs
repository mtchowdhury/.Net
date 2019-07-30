using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ReferralTimeToProcessChart
    {
        public int ReferralCount { get; set; }
        public double DaysToProcess { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthString { get; set; }
    }
}