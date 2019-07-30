using System.Collections.Generic;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;
using AmmsEmployeeDetailsReport = AMMS.HRMS.Service.Models.Employee.AmmsEmployeeDetailsReport;

namespace AMMS.HRMS.Service.Interfaces.Employee
{
    public interface IEmployeeReleaseService
    {
        List<AmmsEmployee> GetReleasableEmployees(int? officeCode);
        CrudResult ReleaseEmployee(AmmsReleasedEmployee rleasedEmployee);
        AmmsEmployee GetEmployeeDetailById(int employeeId);
        Dictionary<string, List<AmmsRelationalFilter>> GetEmployeeReleaseFilters(int branchId);
        string GetBranchNameByBranchId(int branchId);
        int ReleaseEmployeeFromService(AmmsReleasedEmployee releasedEmployee);
        bool GetEmployeeReleaseDetailsById(int employeeId);

        int CancelReleaseEmployeeById(int releaseId,int employeeId,int cancelledBy);
        int GetEmployeeReleaseIdByEmployeeId(int employeeId);
        List<long> GetEmployeeReleaseDateByEmployeeId(int employeeId);
        IEnumerable<AmmsEmployeeDetailsReport> GetEmployeeDetailsReport(int empId, int currentBranchId, int branchId, long currentWorkingDate);
    }
}
