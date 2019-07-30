using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ConsignmentDetails
    {
        public int AspnrxID { get; set; }
        public string AssignedPharmacy { get; set; }
        public string ProgramStatus { get; set; }
        public string FillType { get; set; }
        public string ReferralType { get; set; }
        public string FillNo { get; set; }
        public string NeedsByDatePassed { get; set; }
        public string BinNumber { get; set; }
        public string PcnNumber { get; set; }
    }
}