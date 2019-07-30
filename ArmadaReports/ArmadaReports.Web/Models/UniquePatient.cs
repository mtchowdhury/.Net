using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class UniquePatient
    {
        public string ChartDate { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public int ChartEndDate { get; set; }
        public string MonthName { get; set; }
        public int PatientCount { get; set; }
        public string EndDate { get; set; }
    }
}