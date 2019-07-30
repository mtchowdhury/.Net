using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Admin
{
    public class AdminPanel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public bool AllowProgramMgr { get; set; }
        public bool AllowDistirctMgr { get; set; }
        public bool AllowSalesRep { get; set; }
    }
}