using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class MailConfig
    {
        public int ProgramId { get; set; }
        public bool Enabled { get; set; }
        public string To { get; set; }
        public string Cc { get; set; }
        public string Subject { get; set; }
    }
}