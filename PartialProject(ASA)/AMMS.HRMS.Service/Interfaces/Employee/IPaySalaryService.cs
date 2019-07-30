using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Model.DfEntities;
using AMMS.Service.Models.Filter;

namespace AMMS.HRMS.Service.Interfaces.Employee
{
    public interface IPaySalaryService
    {
        Dictionary<string, List<AmmsRelationalFilter>> GetEmployeeDataFilter();
        Dictionary<string, List<AmmsRelationalFilter>> GetEmployeeBankAccountFilter(int employeeId);
        Dictionary<string, List<AmmsRelationalFilter>> GetEmployerBankAccountFilter(int officeCode);
        List<AmmsEmployeeAccount> GetEmployeeSalaryStructureInformation(long transactionDate, int employeeId, int year, int month, int day);
        AmmsEmployeeBankAccount GetEmployeeBankAccountNumber(int id);

        List<EmployeeAccount> GetEmployeeSalaryDetails(long transactionDate, int employeeId, int year, int month,
            int day);

        long GetEmployeeFirstSalaryStructureStartDate(int employeeId);
    }
}
