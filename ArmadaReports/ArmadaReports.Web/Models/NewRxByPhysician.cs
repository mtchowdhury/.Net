using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class NewRxByPhysician
    {
        public string PhysicianFirstName { get; set; }
        public string PhysicianLastName { get; set; }
        public string PhysicianNPI { get; set; }
        public string DrugName { get; set; }
        public string Strength { get; set; }
        public string Date { get; set; }
        public int ScriptsCount { get; set; }
        public List<int> DatesCount { get; set; }
    }
}