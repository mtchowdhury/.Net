using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ReferralTimeToProcess
    {
        public int ReferralCount { get; set; }
        public double AvgDays { get; set; }
        public string MonthYear { get; set; }
        public int YearMonth { get; set; }
        public double DaysToProcess { get; set; }
        public string PriorAuthRequired { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
    }
}