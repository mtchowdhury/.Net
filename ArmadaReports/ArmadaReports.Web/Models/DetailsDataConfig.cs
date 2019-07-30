using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class DetailsDataConfig
    {
        public List<Details> Data { get; set; }
        public List<DetailsField> Config { get; set; }
    }
}