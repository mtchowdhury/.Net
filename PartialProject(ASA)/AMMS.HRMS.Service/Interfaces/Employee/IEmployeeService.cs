using System.Collections.Generic;
using AMMS.Common.Model;
using AMMS.HRMS.Service.Models;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Model.DfEntities;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;

namespace AMMS.HRMS.Service.Interfaces.Employee
{
    public interface IEmployeeService
    {
        CrudResult Add(AmmsEmployee entity);
        CrudResult Delete(int employeeId);
        List<GetEmployees_Result> GetAll();
        CrudResult Edit(AmmsEmployee entity);
        Model.DfEntities.Employee Get(int employeeId);
        AmmsEmployee GetWithDetails(int employeeId);
        string GetWithDetailsShort(int employeeId);
        //  List<GetEmployees_Result> GetByBranchId(int branchId);
        List<GetEmployeesByBranchId_Result> GetByBranchId(int branchId);
        List<AmmsEmployeeAccountType> GetAcountTypes(int roleId, int branchId);
        Dictionary<string, IEnumerable<AmmsIntFilter>> GetAcountTypeFilters();
        CrudResult AddAcountType(AmmsEmployeeAccountType accountType);
        AmmsEmployeeAccountType GetAcountTypeById(int accountTypeId);
        CrudResult EditAcountType(AmmsEmployeeAccountType accountType);
        CrudResult DeleteAccountTypeById(int accounTypeId);

        List<AmmsEmployeeShort> GetEmployeeListByAdvanceSearch(string filterColumn1, string filterComparator1, string filterValue1, string filterColumn2, string filterComparator2,
            string filterValue2, string filterColumn3, string filterComparator3, string filterValue3, string andOr1, string andOr2, int fromInit);
        AmmsTable GetEmployeeListByAdvanceSearchExport(string filterColumn1, string filterComparator1, string filterValue1, string filterColumn2, string filterComparator2, string filterValue2, string filterColumn3, string filterComparator3, string filterValue3, string andOr1, string andOr2, int fromInit);
        AmmsEmployee GetEmployeeEmailInfo(int employeeId);
    }
}
