using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMMS.Model.DfEntities;

namespace AMMS.HRMS.Service.Models
{
    public class AmmsHrmTransaction
    {
        public int Id { get; set; }
        public decimal TransactionNumber { get; set; }
        public int EmployeeId { get; set; }
        public int EmpId { get; set; }
        public string EmployeeName { get; set; }
        public int Grade { get; set; }
        public int Designation { get; set; }
        public int? OfficeType { get; set; }
        public string OfficeName { get; set; }
        public int OfficeCode { get; set; }
        public string EmployeeAccountId { get; set; }
        public int EmpAccountId { get; set; }
        public int AccountTypeId { get; set; }
        public string AccountType { get; set; }
        public string EmployeeAccountName{ get; set; }
        public decimal ServiceCharge { get; set; } 
        public decimal Amount { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public int TransactionTypeId { get; set; } 
        public string TransactionTypeName { get; set; }
        public int TransactionProcess { get; set; }
        public DateTime TransactionDate { get; set; }
        public int SalaryYear { get; set; }
        public int SalaryMonth { get; set; }
        public int SalaryDate { get; set; }
        public string ChequeNo { get; set; }
        public int? BankAccount { get; set; }
        public string Description { get; set; }
        public bool IsAutoTransaction { get; set; }
        public int Location { get; set; }
        public int? TransactionCreatedFrom { get; set; }
        public int CreatedBy { get; set; } 
        public long CreatedBranchWorkingDate { get; set; }
        public DateTime CreatedSystemDate { get; set; }
        public int ModifiedBy { get; set; }
        public long ModifiedBranchWorkingDate { get; set; }
        public long CurrentBranchWorkingDate { get; set; } 
        public DateTime ModifiedSystemDate { get; set; }
        public decimal ReferenceTransactionid { get; set; }
        public bool IsReversed { get; set; }
        public DateTime RevarsalDate { get; set; }
        public long ReverseBranchWorkingDate { get; set; }
        public long ReferenceAccountId { get; set; }
        public int ReferenceBranchId { get; set; }
        public int EmployeeAccountTypeId { get; set; }

        public string TransactionProcessName { get; set; }
        public string AccountWithTypeName { get; set; }
        public int? EmployerBankAccount { get; set; }
        public string AccountNumber { get; set; }
        public int? BankName { get; set; }
        public string BankAccountNumber { get; set; }

        public List<EmployeeAccount> AllowanceAccounts { get; set; }
        public List<EmployeeAccount> DeductionAccounts { get; set; }

        public Nullable<decimal> PrincipalPortionAmount { get; set; }
        public Nullable<decimal> InterestPortionAmount { get; set; }
    }

    public class AmmsHrmTransactionForExport
    {

        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string AccountType { get; set; }
        public string AccountNumber { get; set; }
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public string TransactionType { get; set; }
        public string Process { get; set; }
        public string Date { get; set; }
        public string SalaryYear { get; set; }
        public string SalaryMonth { get; set; }
        public string ChequeNo { get; set; }
        public bool? IsReversed { get; set; }




    }
    public class AmmsHrmTransactionSearch
    {
        public int brachId { get; set; }
        public int? employeeId { get; set; }
        public int? employeeAccountId { get; set; }
        public int accountTypeId { get; set; }
        public int transactionTypeId { get; set; }
        public long? fromDate { get; set; }
        public long? toDate { get; set; }       
    }
}
