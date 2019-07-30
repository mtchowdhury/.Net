using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class UpDetailsExport
    {
        public string Program { get; set; }
        public string Application_Approval_Date { get; set; }
        public string Application_Expiration_Date { get; set; }
        public string NDC { get; set; }
        //public string Patient_ID { get; set; }
        public string Program_Status { get; set; }
        public string Filling_Pharmacy { get; set; }
        public string Address { get; set; }
        public string Prescriber_Zip { get; set; }
        public string State { get; set; }
        public string NPI { get; set; }
        public string Physician { get; set; }
    }
}