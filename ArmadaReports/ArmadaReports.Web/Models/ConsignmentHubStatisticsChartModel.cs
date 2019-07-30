using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ConsignmentHubStatisticsChartModel
    {
        public string DateStr { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int Consignment { get; set; }
        public int NoConsignment { get; set; }
    }
}