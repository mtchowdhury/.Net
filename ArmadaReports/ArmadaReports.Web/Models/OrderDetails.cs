using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class OrderDetails
    {
        public string ProgramId { get; set; }
        public string ProgramName { get; set; }
        public string CreatedOn { get; set; }
        public string Ndc { get; set; }
        public string AssignedOn { get; set; }
        public string ReferralType { get; set; }
        public string AspnrxId { get; set; }
        public string PatientId { get; set; }
        public string ProgramStatus { get; set; }
        public string ShipDate { get; set; }
        public string FillingPharmacyId { get; set; }
        public string MemberName { get; set; }
        public string FillingPharmacyName { get; set; }
        public string HasNoMemberName { get; set; }
        public string PhysicianFirstName { get; set; }
        public string PhysicianLastName { get; set; }
        public string DoctorId { get; set; }
        public string Address1 { get; set; }
        public string PrescriberZip { get; set; }
        public string Npi { get; set; }
        public string State { get; set; }
        public string CompanyName { get; set; }
        public string CpShipDate { get; set; }
        public string ApplicationApprovalDate { get; set; }
        public string ApplicationExpirationDate { get; set; }
    }
}