using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.NetworkCapacity
{
    public class NetworkCapacityChart
    {
        public int AssignedCapacity { get; set; }
        public int TotalCapacity { get; set; }
        public int RemainingCapacity { get; set; }
        public string Date { get; set; }
    }
}