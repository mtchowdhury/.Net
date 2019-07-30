using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ProgramDistricts
    {
        public List<ProgramDistrict> Districts { get; set; }
        public List<ProgramDistrict> Managers { get; set; }
        public double TotalCount { get; set; }
        public string DateString { get; set; }
        public string ReportsTo { get; set; }
        public bool IsDrilldown { get; set; }
    }
}