using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMMS.HRMS.Service.Models.Employee
{
    public class AmmsEmployeeAccountType
    {
        public int Id { get; set; }
        public int AccountTypeId { get; set; }
        public string AccountTypeName { get; set; }
        public int Type { get; set; }
        public int Category { get; set; }
        public double? InterestRate { get; set; }
        public string DurationInMonth { get; set; }
        public int SortOrder { get; set; }
        public string PermittedOfficeLevel { get; set; }
        public bool RecurringInPayroll { get; set; }
        public bool RecurringInSalaryStructure { get; set; }
        public bool CreateBlankAccount { get; set; }
        public bool IsBallanceCarryforward { get; set; }
        public bool IsMultiple { get; set; }
        public DateTime EffectiveDateFrom { get; set; }
        public long Amount { get; set; }
        public DateTime? EffectiveDateTo { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdaedOn { get; set; }
        public int User { get; set; }
        public int Status { get; set; }
    }
}
