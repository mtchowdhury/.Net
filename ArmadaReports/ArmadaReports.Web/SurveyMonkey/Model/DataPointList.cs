using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.SurveyMonkey.Model
{
    public class DataPointList
    {
        public string Title { get; set; }
        public List<DataPoint> Points { get; set; }
    }
}