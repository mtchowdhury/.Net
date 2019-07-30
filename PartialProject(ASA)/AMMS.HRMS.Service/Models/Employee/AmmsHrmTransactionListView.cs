using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMMS.HRMS.Service.Models.Employee
{
    public class AmmsHrmTransactionListView
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string AccountType { get; set; }
        public string AccountNumber { get; set; }
        public Nullable<decimal> Debit { get; set; }
        public Nullable<decimal> Credit { get; set; }
        public long Id { get; set; }
        public Nullable<int> TransactionCreatedFrom { get; set; }
        public string TransactionType { get; set; }
        public string Process { get; set; }
        public string Date { get; set; }
        public string WorkingDate { get; set; }
        public string SalaryYear { get; set; }
        public string SalaryMonth { get; set; }
        public string ChequeNo { get; set; }
        public Nullable<bool> IsReversed { get; set; }
        public bool IsEditable { get; set; }
        public decimal? ReferenceTransactionId { get; set; }
    }
}
