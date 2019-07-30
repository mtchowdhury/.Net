using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMMS.Common.Model;
using AMMS.HRMS.Service.Models;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Model.DfEntities;
using AMMS.Programs.Service.Models.Configuration;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;
using AmmsIntFilter = AMMS.Repository.Model.AmmsIntFilter;

namespace AMMS.HRMS.Service.Interfaces.Employee
{
    public interface IHrmTransactionService
    {
        Dictionary<string, List<AmmsRelationalFilter>> GetHrmTransactionFilters(int branchId);
        List<AmmsBankAccount> GetAllEmployeeBankAccounts(int employeeId);
        AmmsEmployee GetEmployeeDetailsById(int employeeId);
        Dictionary<string, List<AmmsRelationalFilter>> GetEmployeeAccountById(int employeeId);
        string GetCurrentBranchnameByBranchId(int branchId);
        CrudResult Transact(AmmsHrmTransaction transaction, bool isAdd, bool isEdit, int roleId=-1000);
        CrudResult BulkTransaction(AmmsHrmTransaction transaction, bool isAdd, bool isEdit);
        CrudResult DeleteHrmTransaction(long id,DateTime workingdate,int roleId,string user);
        List<AmmsHrmTransaction> GetAllHrmTransactions(int branchId);
        AmmsHrmTransaction GetHrmTransactionByTransactionId(int transactionId);
        int GetTransactionCreatedFrom();
        Dictionary<string, List<AmmsRelationalFilter>> GetOfficeType();
        Dictionary<string, List<AmmsRelationalFilter>> GetOffices(int branchId, int roleId);
        Dictionary<string, List<AmmsRelationalFilter>> GetEmployeesByBranch(int branchId);
        Dictionary<string, List<AmmsRelationalFilter>> GetEmployAccount(int employeeId);

        List<AmmsHrmTransactionListView> GetHrmsTransactionByFilters(int branchId, int? employeeId,
            int? employeeAccountId, int accountTypeId,
            int transactionTypeId, long? fromDate, long? toDate);

        List<AmmsHrmTransactionListView> GetHrmsTransactionsForDefaultView(int branchId,long from, long to);
        IEnumerable<AmmsRelationalFilter> GetBranchesByEmployeeAndRole(int branchId, int roleId);

        int GetOfficeTypeFromBranchId(int branchId);
        AmmsEmployeeAccount GetEmployeeAccountDetails(int accountId);

        Dictionary<string, List<AmmsIntFilter>> GetTransactionTypeAndAccountByAccountType(int accountTypeId,
            int employeeId);

        List<AmmsIntFilter> GetTransactionTypesByAccountId(int accountId);
        AmmsTable GetHrmsTransactionByFiltersExport(int brachId, int? employeeId, int? employeeAccountId, int accountTypeId, int transactionTypeId, long? fromDate, long? toDate);
        CrudResult BulkTransactionForRelease(AmmsHrmTransaction transaction, bool isRelease, bool isCancelRelease);


        bool GetAccountStatus(long accountId);
        bool IsEmployeeAtive(int employeeId);
        bool IsEmployeeInTransferReceiveState(int employeeId,int branchId);
        CrudResult CheckEmployeeTransferReceiveValidation(int employeeId, int branchId,DateTime transactionDate);
        
    }
}
