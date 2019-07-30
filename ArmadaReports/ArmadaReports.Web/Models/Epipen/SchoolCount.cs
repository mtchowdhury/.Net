using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Epipen
{
    public class SchoolCount
    {
        public int DistinctSchoolCount { get; set; }
        public int TotalSchoolCount { get; set; }
        public int SchoolDiff { get; set; }
        public string SchoolState { get; set; }
        public string DdlBegDate { get; set; }
        public string DdlEndDate { get; set; }
    }
}