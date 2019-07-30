using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.Common.Models
{
    public class OrderDetailsExport
    {
        public string Program { get; set; }
        public string Created_On { get; set; }
        public string Application_Approval_Date { get; set; }
        public string Application_Expiration_Date { get; set; }
        public string NDC { get; set; }
        public string Type { get; set; }
        public string ASPN_ID { get; set; }
        //public string Patient_ID { get; set; }
        public string Program_Status { get; set; }
        public string Ship_Date { get; set; }
        public string Assigned_On { get; set; }
        public string Filling_Pharmacy { get; set; }
        public string Physician { get; set; }
        public string Address { get; set; }
        public string Prescriber_Zip { get; set; }
        public string State { get; set; }
        public string NPI { get; set; }
    }
}
