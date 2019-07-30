using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ProgramDaysToFill
    {
        public double PrescriptionCount { get; set; }
        public double Fill { get; set; }
        public double WeightedFill { get; set; }
        public string Program { get; set; }
        public bool IsAllPharmacy { get; set; }
    }
}