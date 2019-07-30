using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class TwoHoursCallKpi
    {
        public string AspnRxId { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Kpi { get; set; }
        public string Window { get; set; }
    }
}