using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AMMS.HRMS.Service.Interfaces.Employee;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;

namespace AMMS.HRMS.Api.Controllers.Employee
{
    [RoutePrefix("hrms/employeeBankAccount")]
    public class EmployeeBankAccountController : ApiController
    {
        private readonly IEmployeeBankAccountService _employeeBankAccountService;

        public EmployeeBankAccountController(IEmployeeBankAccountService bankAccountService)
        {
            _employeeBankAccountService = bankAccountService;
        }

        [Route("")]
        [HttpGet]
        public List<AmmsEmployeeBankAccount> GetAllEmployeeBankAccounts(int? officeCode)
        {

            return _employeeBankAccountService.GetAllEmployeeBankAccountsByOfficeCode(officeCode);

        }


        [Route("employeeOfficeCodeAndType")]
        [HttpGet]
        public AmmsEmployeeBankAccount GetAllEmployeeOfficeTypeAndCode(int employeeId)  
        {

            return _employeeBankAccountService.GetAllEmployeeOfficeTypeAndCode(employeeId);

        }

        [Route("accountById")]
        [HttpGet]
        public AmmsEmployeeBankAccount GetEmployeeBankAccountById(int id)
        {

            return _employeeBankAccountService.GetAllEmployeeBankAccountById(id);

        }

        [Route("filters")]
        [HttpGet]
        public Dictionary<string,List<AmmsRelationalFilter>> GetAllFilters(int roleId, int branchId)
        {

            return _employeeBankAccountService.GetEmployeeBankAccountFilters(roleId,branchId);

        }

        [Route("add")]
        [HttpPost]
        public CrudResult AddEmployeeBankAccount(AmmsEmployeeBankAccount employeeBankAccount)
        {
            return _employeeBankAccountService.AddEmployeeBankAccount(employeeBankAccount);
        }
        [Route("edit")]
        [HttpPost]
        public CrudResult EditEmployeeBankAccount(AmmsEmployeeBankAccount employeeBankAccount)
        {
            return _employeeBankAccountService.EditEmployeeBankAccount(employeeBankAccount);
        }

        [Route("delete")]
        [HttpDelete]
        public CrudResult DeleteEmployeeBankAccount(int employeeBankAccount)
        {
            return _employeeBankAccountService.DeleteEmployeeBankAccount(employeeBankAccount);
        }

    }
}
