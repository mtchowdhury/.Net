using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMMS.HRMS.Service.Models.Employee
{
   public class AmmsEmployeeTransfer
    {
        public int Id { get; set; }
        public int EmployeeIdAsa { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int FromBranchId { get; set; }
        public int FromDistrictId { get; set; }
        public DateTime TransferDate { get; set; }
        public DateTime BranchWorkingDate { get; set; }
        public string ToOfficeType { get; set; }
        public int ToBranchId { get; set; }
        public string ToBranchName { get; set; }
        public int ToDistrictId { get; set; }
        public int Status { get; set; }
        public string ToDistrictName { get; set; }
        public string LetterNo { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public List<AmmsEmployeeAccount> Accounts { get; set; }
        public DateTime JoiningDate { get; set; }
        public int TransferredByEmployeeId { get; set; }

    }
}
