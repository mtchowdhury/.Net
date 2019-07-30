using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ArmadaReports.Web.Models;

namespace ArmadaReports.Web.Repository
{
    public static class FakeRepository
    {
        public static ColumnChartModel GetTopLeftColumnChart()
        {
            return new ColumnChartModel
            {
                Title = "Avg Program Days To Fill: 2.7 days",
                XTitle = "# of Days To Fill (Last 30 Days)",
                YTitle = "# of Rx Filled",
                DataPlots = new List<ColumnChartDataPlot>
                {
                    new ColumnChartDataPlot { Label = "2", Y = 120},
                    new ColumnChartDataPlot { Label = "4", Y = 220},
                    new ColumnChartDataPlot { Label = "6", Y = 320},
                    new ColumnChartDataPlot { Label = "8", Y = 140},
                    new ColumnChartDataPlot { Label = "10", Y = 210},
                    new ColumnChartDataPlot { Label = "12", Y = 160},
                    new ColumnChartDataPlot { Label = "14", Y = 120},
                    new ColumnChartDataPlot { Label = "15", Y = 120},
                }
            };
        }
    }
}