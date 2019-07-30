using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.ReportRequestHandler.Models
{
    public class RequestParamSet
    {
        public int ProgramId { get; set; }
        public string AspnRxId { get; set; }
        public int? FillingPharmacyId { get; set; }
        public int? TubeQty { get; set; }
        public int? FillingCompanyId { get; set; }
        public string ProgramStatus { get; set; }
        public string ProgramSubstatus { get; set; }
        public string State { get; set; }
        public string DateRangeType { get; set; }
        public string PatientLastNameSrcQry { get; set; }
        public string PhysicianLastNameSrcQry { get; set; }
        public string DateToUse { get; set; }
        public string ReportsTo { get; set; }
        public bool? PriorAuth { get; set; }
        public bool? ExcludeNonWorkDays { get; set; }
        public int? DaysToFill { get; set; }
        public int? MeasureId { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public bool? IsArmadaEmployee { get; set; }
        public string ReferralCode { get; set; }
        public string SummarySubStatus { get; set; }
        public string PatientLastName { get; set; }
        public string PatientState { get; set; }
        public string PhysicianLastName { get; set; }
        public string InpTreatment { get; set; }
        public string UserId { get; set; }
        public string AvgDays { get; set; }
        public int? InsType { get; set; }
        public string StatProc { get; set; }
        public string AuthCode { get; set; }
        public string Category { get; set; }
        public string SalesReferralUser { get; set; }
        public string InsuranceType { get; set; }
        public string PharmacyReferral { get; set; }
        public string Registry { get; set; }
        public string OnLabel { get; set; }
        public string Source { get; set; }
        public string TimeToProcess { get; set; }
        public string Location { get; set; }
        public string DateType { get; set; }
        public string DistrictManager { get; set; }
        public string RefInProcess { get; set; }
        public string Strength { get; set; }
        public string ReportName { get; set; }
        public string UserType { get; set; }
        public int Offset { get; set; }
        public bool? IsExport { get; set; }
        public int? RegranexTubeQty { get; set; }
        public string Consignment { get; set; }
        public string Ndc { get; set; }
        public string ReferralType { get; set; }
        public bool IsService { get; set; }
        public string PrescriberFirstName { get; set; }
        public string PrescriberLastName { get; set; }
        public string DrugName { get; set; }
        public string Reason { get; set; }
    }
}
