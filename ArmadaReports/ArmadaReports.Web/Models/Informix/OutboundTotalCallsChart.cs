using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Informix
{
    public class OutboundTotalCallsChart
    {
        public string Date { get; set; }
        public long AcTotalCalls { get; set; }
        public long McTotalCalls { get; set; }
    }
}