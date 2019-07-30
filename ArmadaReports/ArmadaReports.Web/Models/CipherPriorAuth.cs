using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class CipherPriorAuth
    {
        public int CtCategory { get; set; }
        public string Category { get; set; }
        public string ProgramStatus { get; set; }
        public string ProgramSubStatus { get; set; }
        public string AuthorizationCode { get; set; }
        public string PriorAuthRequired { get; set; }
        public string EndDate { get; set; }
        public string BegDate { get; set; }
    }
}