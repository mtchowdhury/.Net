using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Informix
{
    public class CallCenterStatChart
    {
        public string X { get; set; }
        public double Y { get; set; }
        public double AdY { get; set; }
        public double AdPresented { get; set; }
        public double AdAbandoned { get; set; }
        public double AdHandled { get; set; }
        public double HlY { get; set; }
        public double HlPresented { get; set; }
        public double HlAbandoned { get; set; }
        public double HlHandled { get; set; }
    }
}