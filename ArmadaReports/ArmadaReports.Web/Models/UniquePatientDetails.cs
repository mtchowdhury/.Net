using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class UniquePatientDetails
    {
        public string ProgramId { get; set; }
        public string ProgramName { get; set; }
        public string Ndc { get; set; }
        public string PatientId { get; set; }
        public string ProgramStatus { get; set; }
        public string FillingPharmacyId { get; set; }
        public string MemberName { get; set; }
        public string FillingPharmacyName { get; set; }
        public string HasNoMemberName { get; set; }
        public string PhysicianFirstName { get; set; }
        public string PhysicianLastName { get; set; }
        public string PatientFirstName { get; set; }
        public string PatientLastName { get; set; }
        public string DoctorId { get; set; }
        public string Address1 { get; set; }
        public string PrescriberZip { get; set; }
        public string Npi { get; set; }
        public string State { get; set; }
        public string ApplicationApprovalDate { get; set; }
        public string ApplicationExpirationDate { get; set; }
        public string ApprovalDateFom { get; set; }
        public string ExpirationDateFom { get; set; }
    }
}