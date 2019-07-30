using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class TwoHoursCallKpiVolumeChart
    {
        public string DateStr { get; set; }
        public int Successful { get; set; }
        public int Unsuccessful { get; set; }
    }
}