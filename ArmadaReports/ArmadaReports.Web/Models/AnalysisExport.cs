using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class AnalysisExport
    {
        public string Region { get; set; }
        public string District_Manager { get; set; }
        public string Sales_Rep { get; set; }
        public string Area { get; set; }
        public string Referrals { get; set; }
        public string Avg_Per_Rep { get; set; }
        public string Percent_District { get; set; }
        public string Percent_Total { get; set; }
    }
}