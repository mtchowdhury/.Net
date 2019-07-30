using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Epipen
{
    public class OrderMap
    {
        public string SchoolState { get; set; }
        public string TotalSelectedState { get; set; }
        public int TotalUnits { get; set; }
        public string OrderDateBeg { get; set; }
        public string OrderDateEnd { get; set; }
        public int R1LLimit { get; set; }
        public int R2LLimit { get; set; }
        public int R3LLimit { get; set; }
        public int R4LLimit { get; set; }
        public int R5LLimit { get; set; }
        public int R6LLimit { get; set; }
        public int R1ULimit { get; set; }
        public int R2ULimit { get; set; }
        public int R3ULimit { get; set; }
        public int R4ULimit { get; set; }
        public int R5ULimit { get; set; }
        public int R6ULimit { get; set; }
        public string State { get; set; }
        public string Color { get; set; }
        public string DateString { get; set; }
        public string DdlBegDate { get; set; }
        public string DdlEndDate { get; set; }
    }
}