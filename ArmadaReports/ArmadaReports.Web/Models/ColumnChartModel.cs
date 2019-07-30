using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ColumnChartModel
    {
        public string Title { get; set; }
        public string XTitle { get; set; }
        public string YTitle { get; set; }
        public List<ColumnChartDataPlot> DataPlots { get; set; }
    }
}