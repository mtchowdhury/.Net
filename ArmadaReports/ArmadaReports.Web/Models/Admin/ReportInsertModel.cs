using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Admin
{
    public class ReportInsertModel
    {
        public string UserId { get; set; }
        public int ReportId { get; set; }
        public int ProgramId { get; set; }
        public int ReportOrder { get; set; }
        public bool AllowDmgr { get; set; }
        public bool AllowPmgr { get; set; }
        public bool AllowSrep { get; set; }
    }
}