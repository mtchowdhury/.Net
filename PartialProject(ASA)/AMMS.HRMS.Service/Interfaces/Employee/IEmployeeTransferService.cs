using System.Collections.Generic;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Model.DfEntities;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;

namespace AMMS.HRMS.Service.Interfaces.Employee
{
    public interface IEmployeeTransferService
    {

        List<AmmsRelationalFilter> GetAllBranches();
        List<AmmsIntFilter> GetAllDistrict();
        List<AmmsEmployeeTransfer> GetAllTransferEmployee(int branchId);
        List<AmmsEmployeeTransfer> GetAllReceiveEmployee(int branchId);
        AmmsEmployeeTransfer GetTransferEmployeeInfo(int id);
        Dictionary<string, dynamic> GetAllFilters();
        CrudResult AddEmployeeTransfer(AmmsEmployeeTransfer employeeTransfer);
        CrudResult EditEmployeeTransfer(AmmsEmployeeTransfer employeeTransfer);
        CrudResult ReceiveEmployee(int id, string user, string loggedEmployee, int branchId);
        CrudResult RejectEmployee(int id, string user, string loggedEmployee);
        CrudResult DeleteEmployeeTransfer(int  transferId, string user, string loggedEmployee);
        bool GetEmployeeTransferStatus(int employeeId);

    }
}
