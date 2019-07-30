using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class Workflow
    {
        public int Value { get; set; }
        public string Caption { get; set; }
        public string Report { get; set; }
        public int Measure { get; set; }
    }
}