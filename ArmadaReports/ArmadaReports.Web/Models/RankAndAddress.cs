using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class RankAndAddress
    {
        public int PrescriptionCount { get; set; }
        public int PatientCount { get; set; }
        public string Practitioner { get; set; }
        public string DoctorId { get; set; }
        public string Address1 { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string City { get; set; }
        public string Dea { get; set; }
        public string LicenseNumber { get; set; }
        public string ProductName { get; set; }
        public string Ndc { get; set; }
        public string ShipDate { get; set; }
    }
}