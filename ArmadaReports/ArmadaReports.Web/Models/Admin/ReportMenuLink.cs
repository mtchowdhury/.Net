using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Admin
{
    public class ReportMenuLink
    {
        public int LinkId { get; set; }
        public string LinkName { get; set; }
        public int ParentId { get; set; }
    }
}