using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class NewRxByPhysicianData
    {
        public List<string> Columns { get; set; }
        public List<NewRxByPhysician> Rows { get; set; }
    }
}