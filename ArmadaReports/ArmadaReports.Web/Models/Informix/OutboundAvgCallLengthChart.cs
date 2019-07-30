using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Informix
{
    public class OutboundAvgCallLengthChart
    {
        public string Date { get; set; }
        public double AvgCallLength { get; set; }
        public double AcAvgCallLength { get; set; }
        public double McAvgCallLength { get; set; }
    }
}