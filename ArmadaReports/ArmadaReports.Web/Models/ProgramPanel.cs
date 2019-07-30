using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ProgramPanel
    {
        public int PanelId { get; set; }
        public string PanelName { get; set; }
        public int PanelOrder { get; set; }
        public int PanelSpace { get; set; }
        public bool IsKaleo { get; set; }
        public bool IsApproved { get; set; }
    }
}