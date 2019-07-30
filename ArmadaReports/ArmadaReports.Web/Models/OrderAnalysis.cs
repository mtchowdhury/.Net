using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class OrderAnalysis
    {
        public string BegDate { get; set; }
        public string EnrollmentDate { get; set; }
        public string CreatedOnDate { get; set; }
        public string ShipEndDate { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public int ChartEndDate { get; set; }
        public string MonthName { get; set; }
        public int PrescriptionCount { get; set; }
    }
}