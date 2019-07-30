using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class DetailsField
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public bool ForDistrctMgr { get; set; }
        public string HiddenForPrograms { get; set; }
        public string ProgramId { get; set; }
    }
}