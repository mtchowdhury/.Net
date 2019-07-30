using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Model.DfEntities;
using AMMS.Repository.Model;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;

namespace AMMS.HRMS.Service.Interfaces.Employee
{
    public interface ISalaryStructureService
    {
        Dictionary<string, List<AmmsRelationalFilter>> GetEmployeeSalaryStructureFilters(int roleId,int employeeId);
        //List<AmmsEmployeeSalaryStructureViewModel> GetEmployeeSalaryStructuresByofficeCode(int? officeCode);
        List<GetSalaryStructuresByBranchId_Result> GetEmployeeSalaryStructuresByBranchId(int? officeCode);
        AmmsEmployeeSalaryStructure GetEmployeeSalaryStructureById(int salaryStructureId);
        List<AmmsEmployee> GetEmployeesByOfficeCode(int? officeCode);
        List<EmployeeConfig> GetSalaryStructureSetupReason();
        List<EmployeeAccountType> GetAllowanceTypes();
        List<EmployeeAccountType> GetDeductionTypes();
        List<Branch> GetAllpermittedBranches(int roleId, int employeeId); 
        CrudResult AddSalaryStructure(EmployeSalaryStructureExtendedModel salaryStructure);
        CrudResult EditSalaryStructure(EmployeeSalaryStructureExtendedViewModelForEdit salaryStructure);
        CrudResult DeleteSalaryStructure(AmmsEmployeeSalaryStructure salaryStructure);

        Dictionary<string, List<AmmsRelationalFilter>> GetEmployeeByBranchFilter(int branchId);

        List<AmmsEmployeeAccountType> GetEmployeeAccountTypes(long branchWorkingDate);
        List<EmployeeAccountType> GetEmployeeDeductionAccountTypes(long branchWorkingDate);
        AmmsEmployee GetEmployeeDeytailsByEmployeeId(int employeeId);
        List<AmmsEmployeeAccount> GetEmployeeAccounts(int salaryStructureId);
        int GetActiveSalaryStructureId(int employeeId);
        long GetAsaJoiningDate(int employeeId);
        bool HasActiveSalaryStructure(int employeeId, long today);
        long GetJoiningDate(int employeeId);
    }
}
