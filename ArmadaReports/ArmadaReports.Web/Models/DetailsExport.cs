using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class DetailsExport
    {
        public string Program { get; set; }
        public string Type { get; set; }
        public string ASPN_ID { get; set; }
        public string Created_On { get; set; }
        public string Status { get; set; }
        public string Program_Status { get; set; }
        public string Substatus { get; set; }
        public string Order_Qty { get; set; }
        public string Refills_Prescribed { get; set; }
        public string Fill_Qty { get; set; }
        public string Fill_Date { get; set; }
        public string Ship_Date { get; set; }
        public string Days_To_Fill { get; set; }
        public string Filling_Pharmacy { get; set; }
        public string Physician_First_Name { get; set; }
        public string Physician_Last_Name { get; set; }
        public string Physcian_NPI { get; set; }
        public string Prescriber_Address { get; set; }
        public string Prescriber_City { get; set; }
        public string Prescriber_Zip { get; set; }
        public string Prescriber_State { get; set; }
        public string Hub_Patient_ID { get; set; }
        public string BIN_Number { get; set; }
        public string Tubes { get; set; }
        public string Copay { get; set; }
        public string Payer { get; set; }
    }
}