using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Informix
{
    public class NetworkCapacityData
    {
        public int AssignedCapacity { get; set; }
        public int TotalCapacity { get; set; }
        public int RemainingCapacity { get; set; }
        public DateTime Createdon { get; set; }
        public DateTime EffectiveDate { get; set; }

    }
}