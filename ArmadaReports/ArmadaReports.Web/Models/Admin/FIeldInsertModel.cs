using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Admin
{
    public class FieldInsertModel
    {
        public int ProgramId { get; set; }
        public int FieldId { get; set; }
        public int Order { get; set; }
        public string CustomName { get; set; }
        public bool AllowDmgr { get; set; }
        public bool AllowPmgr { get; set; }
        public bool AllowSrep { get; set; }
    }
}