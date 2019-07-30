using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ReferralSubSummary
    {
        public string ProgramStatus { get; set; }
        public int ProgramID { get; set; }
        public string ProgramName { get; set; }
        public int GrandTotalCount { get; set; }
        public int ThisWeekCount { get; set; }
        public int YtdCount { get; set; }
        public int QtdCount { get; set; }
        public int LastWeekCount { get; set; }
        public int TwoWeekCount { get; set; }
        public int ThreeWeekCount { get; set; }
        public int FourWeekCount { get; set; }
        public double ThisWeekCountPercent { get; set; }
        public double YtdCountPercent { get; set; }
        public double QtdCountPercent { get; set; }
        public double LastWeekCountPercent { get; set; }
        public double TwoWeekCountPercent { get; set; }
        public double ThreeWeekCountPercent { get; set; }
        public double FourWeekCountPercent { get; set; }
        public double GrandTotalCountPercent { get; set; }
        public string ProductBridge { get; set; }
    }
}