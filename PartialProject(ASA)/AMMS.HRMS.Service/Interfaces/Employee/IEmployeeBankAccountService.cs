using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;

namespace AMMS.HRMS.Service.Interfaces.Employee
{
    public interface IEmployeeBankAccountService
    {
        AmmsEmployeeBankAccount GetAllEmployeeOfficeTypeAndCode(int employeeId);
        Dictionary<string, List<AmmsRelationalFilter>> GetEmployeeBankAccountFilters(int roleId, int branchId);
        List<AmmsEmployeeBankAccount> GetAllEmployeeBankAccounts();
        List<AmmsEmployeeBankAccount> GetAllEmployeeBankAccountsByOfficeCode(int? officeCode);
        AmmsEmployeeBankAccount GetAllEmployeeBankAccountById(int id);
        List<AmmsEmployeeBankAccount> GetEmployeeBankAccounts(AmmsEmployeeBankAccount employeeBankAccount);
        CrudResult AddEmployeeBankAccount(AmmsEmployeeBankAccount employeeBankAccount);
        CrudResult EditEmployeeBankAccount(AmmsEmployeeBankAccount employeeBankAccount);
        CrudResult DeleteEmployeeBankAccount(int employeeBankAccountId);
    }
}
