using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.Common.Models
{
    public class SalesAnalysis
    {
        public int TotalCount { get; set; }
        public int Referrals { get; set; }
        public double AvgPerRep { get; set; }
        public double PercentageDistrict { get; set; }
        public double PercentageTotal { get; set; }
        public int ProgramId { get; set; }
        public string DistrictManagerId { get; set; }
        public string SalesRepId { get; set; }
        public string DistrictManagerName { get; set; }
        public string SalesRepName { get; set; }
        public string RegionName { get; set; }
        public string SalesRepAreaName { get; set; }
    }
}
