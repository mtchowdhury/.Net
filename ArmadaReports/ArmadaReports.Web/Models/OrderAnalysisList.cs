using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class OrderAnalysisList
    {
        public List<OrderAnalysis> Current { get; set; }
        public List<OrderAnalysis> Previous { get; set; }
        public string BegDate { get; set; }
        public string EndDate { get; set; }
    }
}