using System.Collections.Generic;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Model.DfEntities;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;

namespace AMMS.HRMS.Service.Interfaces.Employee
{
    public interface IEmployeeDesignationService
    {
        List<AmmsEmployeeDesignation> GetEmployeeDesignations(AmmsEmployeeDesignation employeeDesignation);
        AmmsEmployeeDesignation GetEmployeeDesignation(int designationId);
        CrudResult AddEmployeeDesignation(AmmsEmployeeDesignation  employeeDesignation);
        CrudResult EditEmployeeDesignation(AmmsEmployeeDesignation employeeDesignation);
        CrudResult DeleteEmployeeDesignation(int designationdId);

        Dictionary<string, List<AmmsRelationalFilter>> GetEmployeeDesignationFilters(int roleId, int branchId);


    }
}
