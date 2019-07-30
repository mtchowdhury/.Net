using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.SurveyMonkey.Model
{
    public class DataPoint
    {
        public int x { get; set; }
        public double y { get; set; }
        public string label { get; set; }
        public string legendText { get; set; }
    }
}