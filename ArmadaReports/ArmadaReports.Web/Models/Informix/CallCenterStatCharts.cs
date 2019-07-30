using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Informix
{
    public class CallCenterStatCharts
    {
        public List<CallCenterStatChart> AvgSpeedAnswer { get; set; }
        public List<CallCenterStatChart> AvgHandleTime { get; set; }
        public List<CallCenterStatChart> CallsHandled { get; set; }
        public List<CallCenterStatChart> AbandonmentRate { get; set; }
    }
}