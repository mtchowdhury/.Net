using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMMS.Common.Model;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Model.DfEntities;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;

namespace AMMS.HRMS.Service.Interfaces.Employee
{
   public interface IEmployeeAccountService
   {
       Dictionary<string, List<AmmsIntFilter>> GetListPageFilterData();
       List<AmmsIntFilter> GetBranchListByOfficeTypeId(int officeTypeId);
       List<AmmsRelationalFilter> GetEmployeeListByBranchId(int branchId);
       List<AmmsEmployeeAccount> GetAccountList(int branchId, int employeeId, int accountTypeId, int statusId);
       CrudResult DeleteEmployeeAccountById(int employeeAccountId,DateTime workingDate,int roleId,string user);
       Dictionary<string, List<AmmsIntFilter>> GetAddPageFilterData(int employeeId,int roleId,int branchId,bool isEdit);
       int GetEmployeeAccountCycleCount(int employeeId, int accountTypeId);
       CrudResult AddEmployeeAccount(AmmsEmployeeAccount eaccount);
       AmmsEmployeeAccount GetEmployeeAccountById(int eaccountId);
       CrudResult EditEmployeeAccount(AmmsEmployeeAccount eac);
       int? GetEmployeeIdFromEmployeeId(int employeeId);
       List<AmmsIntFilter> GetEmployeeBankAccounts(int employeeId , int fromEdit);
       int GetSelectedOfficeTypeIdByBranchId(int branchId);
       AmmsTable GetAccountListExport(AmmsEmployeeAccountSearchparams filterparams);
    }
}
