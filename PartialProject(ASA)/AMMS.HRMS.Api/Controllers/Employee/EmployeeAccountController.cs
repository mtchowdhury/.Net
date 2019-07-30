using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AMMS.Common.Model;
using AMMS.HRMS.Api.Common;
using AMMS.HRMS.Service.Interfaces.Employee;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Model.DfEntities;
using AMMS.Service.Interfaces.Filter;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;

namespace AMMS.HRMS.Api.Controllers.Employee
{
    [RoutePrefix("hrms/employeeAccount")]
    public class EmployeeAccountController : ApiController
    {
        private readonly IEmployeeAccountService _employeeAccountService;
        private readonly IFilterService _filterService;

        public EmployeeAccountController(IEmployeeAccountService employeeAccountService, IFilterService filterService)
        {
            _employeeAccountService = employeeAccountService;
            _filterService = filterService;

        }
        [Route("getlistpagefilterdata")]
        [HttpGet]
        public Dictionary<string, List<AmmsIntFilter>> GetListPageFilterData()
        {
            return _employeeAccountService.GetListPageFilterData();
        }
        [Route("getBranchelist")]
        [HttpGet]
        public IEnumerable<AmmsRelationalFilter> GetBranchListByOfficeTypeId(int officeTypeId,int roleId,int branchId)
        {
          //  return _employeeAccountService.GetBranchListByOfficeTypeId(officeTypeId);
            return _filterService.GetBranchesByEmployeeAndRole(branchId, roleId, officeTypeId);
        }
        [Route("getEmployeelist")]
        [HttpGet]
        public  List<AmmsRelationalFilter>GetEmployeeListByBranchId(int branchId)
        {
            return _employeeAccountService.GetEmployeeListByBranchId(branchId);
        }
        [Route("getAccountList")]
        [HttpGet]
        public List<AmmsEmployeeAccount> GetAccountList(int branchId, int employeeId,int accountTypeId,int statusId)
        {
            return _employeeAccountService.GetAccountList(branchId, employeeId, accountTypeId, statusId);
        }

        [Route("getAccountListExport")]
        [HttpPost]
        public AmmsTable GetAccountList(AmmsEmployeeAccountSearchparams filterparams)
        {
            return _employeeAccountService.GetAccountListExport(filterparams);
        }
        [Route("delete")]
        [HttpPost]
        public CrudResult DeleteEmployeeAccountById(int employeeAccountId,DateTime workingDate,int roleId)
        {
            var user = Helper.GetUser(Request.Headers);
            return _employeeAccountService.DeleteEmployeeAccountById(employeeAccountId,workingDate,roleId,user);

        }
        [Route("getFilterData")]
        [HttpGet]
        public Dictionary<string, List<AmmsIntFilter>> GetAddPageFilterData(int employeeId,int roleId,int branchId,bool isEdit=false)
        {
            return _employeeAccountService.GetAddPageFilterData(employeeId, roleId,branchId,isEdit);
        }

        [Route("getAccountCycleCount")]
        [HttpGet]
        public int GetEmployeeAccountCycleCount(int employeeId,int accountTypeId)
        {
            return _employeeAccountService.GetEmployeeAccountCycleCount(employeeId,accountTypeId);
        }
        [Route("addEmployeeAccount")]
        [HttpPost]
        public CrudResult AddEmployeeAccount(AmmsEmployeeAccount eaccount)
        {
            eaccount.CreatedBy = Helper.GetUser(Request.Headers);
            return _employeeAccountService.AddEmployeeAccount(eaccount);
        }
        [Route("getEmployeeAccountById")]
        [HttpGet]
        public AmmsEmployeeAccount GetEmployeeAccountById(int eaccountId)
        {
            return _employeeAccountService.GetEmployeeAccountById(eaccountId);
        }
        [Route("editEmployeeAccount")]
        [HttpPost]
        public CrudResult EditEmployeeAccount(AmmsEmployeeAccount eaccount)
        {
            eaccount.UpdatedBy = Helper.GetUser(Request.Headers);
            return _employeeAccountService.EditEmployeeAccount(eaccount);
        }
        [Route("getEmployeeIdByEmployeeId")]
        [HttpGet]
        public int? GetEmployeeIdByEmployeeId(int employeeId)
        {
            return _employeeAccountService.GetEmployeeIdFromEmployeeId(employeeId);
        }
        [Route("getEmployeeBankAccounts")]
        [HttpGet]
        public List<AmmsIntFilter>GetEmployeeBankAccounts(int employeeId,int fromEdit=-1)
        {
            return _employeeAccountService.GetEmployeeBankAccounts(employeeId,fromEdit);
        }

        [Route("getSelectedOfficeTypeIdByBranchId")]
        [HttpGet]
        public int GetSelectedOfficeTypeIdByBranchId(int branchId)
        {
            return _employeeAccountService.GetSelectedOfficeTypeIdByBranchId(branchId);
        }
    }
}
