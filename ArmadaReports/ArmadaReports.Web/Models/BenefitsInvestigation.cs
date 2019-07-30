using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class BenefitsInvestigation
    {
        public int PrescriptionCount { get; set; }
        public int BiStartCount { get; set; }
        public int BIStartYearMonth { get; set; }
        public int BICompleteYearMonth { get; set; }
        public int BiCompleteCount { get; set; }
        public string BIStartDate { get; set; }
        public string BICompleteDate { get; set; }
        public string Date { get; set; }
        public int YearMonth { get; set; }
    }
}