using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class UniquePatientList
    {
        public List<UniquePatient> Current { get; set; }
        public List<UniquePatient> Previous { get; set; }
        public string BegDate { get; set; }
        public string EndDate { get; set; }
    }
}