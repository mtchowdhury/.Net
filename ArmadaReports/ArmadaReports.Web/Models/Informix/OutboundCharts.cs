using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Informix
{
    public class OutboundCharts
    {
        public List<OutboundTotalCallsChart> TotalCallsChart { get; set; }
        public List<OutboundAvgCallLengthChart> AvgCallLengthChart { get; set; }
    }
}