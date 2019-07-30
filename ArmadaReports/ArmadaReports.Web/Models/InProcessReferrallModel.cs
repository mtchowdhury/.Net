using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class InProcessReferrallModel
    {
        public double ReferralCount { get; set; }
        public double ReferralCountPercent { get; set; }
        public string PAProgramStatus { get; set; }
        public string Status { get; set; }
        public string ProgramStatus { get; set; }
        public string ProgramSubStatus { get; set; }
        public bool PARequired { get; set; }
    }
}