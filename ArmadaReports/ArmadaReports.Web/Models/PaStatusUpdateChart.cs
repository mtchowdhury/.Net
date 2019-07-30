using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class PaStatusUpdateChart
    {
        public int TotalCount { get; set; }
        public int InProcessCount { get; set; }
        public int DeniedCount { get; set; }
        public int ApprovedPasCount { get; set; }
        public double InProcessCountPercent { get; set; }
        public double DeniedCountPercent { get; set; }
        public double ApprovedPasCountPercent { get; set; }
    }
}