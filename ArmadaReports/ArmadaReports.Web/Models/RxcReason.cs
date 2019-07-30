using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class RxcReason
    {
        public string Reason { get; set; }
        public int RxcReasonCount { get; set; }
        public int TotalCount { get; set; }
        public double RxcReasonCountPercent { get; set; }
    }
}