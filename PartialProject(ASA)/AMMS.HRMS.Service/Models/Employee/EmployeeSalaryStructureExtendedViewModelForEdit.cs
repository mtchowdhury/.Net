using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMMS.HRMS.Service.Models.Employee
{
    public class EmployeeSalaryStructureExtendedViewModelForEdit
    {
        //EmployeeSalaryStructure Part
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public System.DateTime OpeningDate { get; set; }
        public Nullable<System.DateTime> ClosingDate { get; set; }
        public string Description { get; set; }
        public int ReasonId { get; set; }
        public Nullable<System.DateTime> UpdatedOn { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public Nullable<int> EmployeeGrade { get; set; }
        public Nullable<int> EmployeeDesignation { get; set; }
        public Nullable<int> OfficeCode { get; set; }
        public Nullable<int> OfficeType { get; set; }
        public string OfficeName { get; set; }
        public int Status { get; set; }
        public string PayrollId { get; set; }
        public int OriginatingOfficeCode { get; set; }
        public int OriginatingOfficeType { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public long Amount { get; set; }
        public int SalaryStructureId { get; set; }

        public DateTime CheckDay { get; set; }
        // EmployeeAccount Part
        public List<AmmsEmployeeAccount> AllowanceAccounts { get; set; }
        public List<AmmsEmployeeAccount> DeductionAccounts { get; set; }
    }
}
