using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ProgramStatus
    {
        public List<Status> Statuses { get; set; }
        public List<StatusStat> StatusStats { get; set; }
        public double TotalCount { get; set; }
        public double RxCount { get; set; }
        public double RefillCount { get; set; }
        public string DateString { get; set; }
    }
}