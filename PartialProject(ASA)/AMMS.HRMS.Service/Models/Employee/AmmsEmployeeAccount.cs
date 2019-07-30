using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMMS.HRMS.Service.Models.Employee
{
    public class AmmsEmployeeAccount
    {
        public long Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int AccountTypeId { get; set; }
        public int Type { get; set; }
        public string AccountTypeName { get; set; }
        public int OriginatirngOfficeType { get; set; }
        public string OriginatirngOfficeName { get; set; }
        public int OriginatingOfficeCode { get; set; }
        public int CurrentOfficeType { get; set; }
        public string CurrentOfficeName { get; set; }
        public int CurrentOfficeCode { get; set; }
        public double PrincipalAmount { get; set; }
        public double? ReceiveAmount { get; set; }
        public double? ServiceChargeRate { get; set; }
        public double? ServiceCharge { get; set; }
        public double? SubsidyAmount { get; set; }
        public int? Duration { get; set; }
        public int? InstallmentType { get; set; }
        public double? InstallmentAmount { get; set; }
        public int? TotalInstallment { get; set; }
        public bool RepeatInPayroll { get; set; }
        public int? LifeCycle { get; set; }
        public int? Cycle { get; set; }
        public int Status { get; set; }
        public DateTime? OpeningDate { get; set; }
        public DateTime? ClosingDate { get; set; }
        public DateTime? DisburseDate { get; set; }
        public int AccountOpeningType { get; set; }
        public double? ChequeAmount { get; set; }
        public string ChequeNo { get; set; }
        public int? BankAccount { get; set; }
        public double? OutstandingAdjust { get; set; }
        public double? ExemptionAdjust { get; set; }
        public DateTime CreateWorkingDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public string AccountNumber { get; set; }
        public DateTime?ReceiveDate { get; set; }
        public int? ReceiveBranch { get; set; }
        public int? ReceiveDistrict { get; set; }
        public int? SalaryStructureId { get; set; }
        public double? OutstandingAmount { get; set; }
        public string PaymentTypeName { get; set; }
        public int SortOrder { get; set; }
        public bool IsBallanceCarryforward { get; set; }

    }
    public class AmmsEmployeeAccountExport
    {
        public string Name { get; set; }
        public string AccountType { get; set; }
        public double DisburseAmount { get; set; }
        public double? ReceivedAmount { get; set; }
        public DateTime? OpeningDate { get; set; }
        public DateTime? DisburseDate { get; set; }
        public DateTime? ReceiveDate { get; set; }
        public DateTime? ClosingDate { get; set; }
        public double? OutstandingAmount { get; set; }
        public string Status { get; set; }
    }

    public class AmmsEmployeeAccountSearchparams
    {
        public int AccountTypeId { get; set; }
        public int EmployeeId { get; set; }
        public int StatusId { get; set; }
    }
}
