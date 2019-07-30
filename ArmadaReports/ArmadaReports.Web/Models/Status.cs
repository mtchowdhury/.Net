using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class Status
    {
        public double TotalCount { get; set; }
        public double TotalCountPercent { get; set; }
        public double NewRxCount { get; set; }
        public double RefillCount { get; set; }
        public string ProgramId { get; set; }
        public string ProgramStatus { get; set; }
    }
}