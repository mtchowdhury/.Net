using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMMS.HRMS.Service.Interfaces.Employee;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Model.DfEntities;
using AMMS.Repository.Interfaces.HRMS;
using AMMS.Repository.Repositories.HRMS;
using AMMS.Server.Validation;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;
using AMMS.Service.Services;
using AMMS.Service.Services.Utility;
using EmployeeConfig = AMMS.Common.Globals.EmployeeConfig;

namespace AMMS.HRMS.Service.Services.Employee
{
    public class EmployeeBankAccountService : GenericCrudService, IEmployeeBankAccountService
    {
        private readonly IEmployeeBankAccountRepository _employeeBankAccountRepositoy;
        public EmployeeBankAccountService(string connectionString) : base(connectionString)
        {
            _employeeBankAccountRepositoy = new EmployeeBankAccountRepository(connectionString);
        }

        public List<AmmsEmployeeBankAccount> GetAllEmployeeBankAccountsByOfficeCode(int? officeCode)
        {
            var employeeBankAccounts = _employeeBankAccountRepositoy.GetAllEmployeeBankAccountByOfficeCode(officeCode).Where(b=>b.Status!=EmployeeConfig.EmployeeBankAccountStatus.Deleted).ToList();
            var allBanks = _employeeBankAccountRepositoy.GetAllBankNames();
            var ammsBankAccountList = new List<AmmsEmployeeBankAccount>();
            foreach (var employeeBankAccount in employeeBankAccounts)
            {
                var bank = allBanks.FirstOrDefault(x=>x.Id.ToString() == employeeBankAccount.BankName);
                if (bank != null)
                {
                    var account = new AmmsEmployeeBankAccount
                    {
                        Id = employeeBankAccount.Id,
                        EmpId = employeeBankAccount.EmployeeId,
                        EmployeeId = employeeBankAccount.Employee.EmployeeId,
                        EmployeeName = employeeBankAccount.Employee.Name,
                        BankName =bank.BankName ,//_employeeBankAccountRepositoy.GetBankName(employeeBankAccount.BankName),
                        BankId = Convert.ToInt32(employeeBankAccount.BankName),
                        BankBranch = employeeBankAccount.BankBranch,
                        AccountNumber = employeeBankAccount.AccountNumber,
                        Status = employeeBankAccount.Status,
                        StartDate = DateUtility.IntToDate(employeeBankAccount.StartDate),
                        EndDate = (employeeBankAccount.EndDate != null) ? DateUtility.IntToDate((long)employeeBankAccount.EndDate) : new DateTime(),
                        OfficeCode = employeeBankAccount.OfficeCode,
                        OfficeType = Convert.ToInt32(employeeBankAccount.OfficeType)
                    };
                    ammsBankAccountList.Add(account);
                }
                else
                {
                    var account = new AmmsEmployeeBankAccount
                    {
                        Id = employeeBankAccount.Id,
                        EmpId = employeeBankAccount.EmployeeId,
                        EmployeeId = employeeBankAccount.Employee.EmployeeId,
                        EmployeeName = employeeBankAccount.Employee.Name,
                        BankName = "",
                        BankId = Convert.ToInt32(employeeBankAccount.BankName),
                        BankBranch = employeeBankAccount.BankBranch,
                        AccountNumber = employeeBankAccount.AccountNumber,
                        Status = employeeBankAccount.Status,
                        StartDate = DateUtility.IntToDate(employeeBankAccount.StartDate),
                        EndDate = (employeeBankAccount.EndDate != null) ? DateUtility.IntToDate((long)employeeBankAccount.EndDate) : new DateTime(),
                        OfficeCode = employeeBankAccount.OfficeCode,
                        OfficeType = Convert.ToInt32(employeeBankAccount.OfficeType)
                    };
                    ammsBankAccountList.Add(account);
                }
            }
            return ammsBankAccountList.OrderByDescending(x=>x.Status).ToList();
        }

        public AmmsEmployeeBankAccount GetAllEmployeeBankAccountById(int id)
        {
            var employeeBankAccount = _employeeBankAccountRepositoy.GetEmployeeBankAccountById(id);
            AmmsEmployeeBankAccount singleAccount = new AmmsEmployeeBankAccount();
            singleAccount.EmployeeId = employeeBankAccount.EmployeeId;
            singleAccount.AccountNumber = employeeBankAccount.AccountNumber;
            singleAccount.BankName = employeeBankAccount.BankName;
            singleAccount.BankBranch = employeeBankAccount.BankBranch;
            singleAccount.CreatedBy = employeeBankAccount.CreatedBy;
            singleAccount.CreatedOn = employeeBankAccount.CreatedOn;
            singleAccount.CreatedBranchDate = employeeBankAccount.CreatedBranchDate.GetValueOrDefault();
            singleAccount.StartDate = DateUtility.IntToDate(employeeBankAccount.StartDate);
            singleAccount.ModifiedBy = employeeBankAccount.ModifiedBy;
            singleAccount.ModifiedOn = employeeBankAccount.ModifiedOn;
            singleAccount.Status = employeeBankAccount.Status;
            singleAccount.Id = employeeBankAccount.Id;
            singleAccount.OfficeCode = employeeBankAccount.OfficeCode;
            singleAccount.OfficeType = Convert.ToInt32(employeeBankAccount.OfficeType);
            return singleAccount;

        }

        public AmmsEmployeeBankAccount GetAllEmployeeOfficeTypeAndCode(int employeeId)
        {
            var officeCodeAndType = _employeeBankAccountRepositoy.GetEmployeeOfficeCodeAndType(employeeId);
            var officeType = GetOfficeTypeAndCode(officeCodeAndType);
            return officeType;
        }

        public Dictionary<string, List<AmmsRelationalFilter>> GetEmployeeBankAccountFilters(int roleId, int branchId)
        {
            var filters = new Dictionary<string, List<AmmsRelationalFilter>>();

            var emps = _employeeBankAccountRepositoy.GetEmployeeList(roleId, branchId);
            var employees = emps.Select(e => new AmmsRelationalFilter { Name = e.Name + "(" + e.EmployeeId.ToString() + ")", Value = e.Id }).ToList();
            var banks = _employeeBankAccountRepositoy.GetAllBankNames();
            var banknames = banks.Select(e => new AmmsRelationalFilter { Name=e.BankName, Value = e.Id }).ToList();
            var statuses = _employeeBankAccountRepositoy.GetEmployeeBankAccountConfigs().Where(e => e.Type == "EmployeeBankAccountStatus").Select(c => new AmmsRelationalFilter { Name = c.Name, Value = Int32.Parse(c.Value) }).ToList();

            filters.Add("employees", employees);
            filters.Add("banks", banknames);
            filters.Add("statuses", statuses);
            
            return filters;
        }

        public List<AmmsEmployeeBankAccount> GetAllEmployeeBankAccounts()
        {
            var employeeBankAccounts = _employeeBankAccountRepositoy.GetAllEmployeeBankAccounts();
            var ammsBankAccountList = new List<AmmsEmployeeBankAccount>();
            foreach (var employeeBankAccount in employeeBankAccounts)
            {
                var account = new AmmsEmployeeBankAccount
                {
                    EmployeeId = employeeBankAccount.EmployeeId,
                    EmployeeName = employeeBankAccount.Employee.Name,
                    BankName = employeeBankAccount.BankName,
                    BankBranch = employeeBankAccount.BankBranch,
                    AccountNumber = employeeBankAccount.AccountNumber,
                    Status = employeeBankAccount.Status,
                    StartDate = DateUtility.IntToDate(employeeBankAccount.StartDate),
                    EndDate = (employeeBankAccount.EndDate != null) ? DateUtility.IntToDate((long)employeeBankAccount.EndDate) : new DateTime(),
                    OfficeCode = employeeBankAccount.OfficeCode
                };
                ammsBankAccountList.Add(account);

            }
            return ammsBankAccountList;

        }

        public List<AmmsEmployeeBankAccount> GetEmployeeBankAccounts(AmmsEmployeeBankAccount employeeBankAccount)
        {
            var employeeBankAccounts = _employeeBankAccountRepositoy.GetAllEmployeeBankAccountByOfficeCode(employeeBankAccount.OfficeCode);
            if (employeeBankAccount.EmployeeId != 0)
                employeeBankAccounts =
                    employeeBankAccounts.Where(e => e.EmployeeId == employeeBankAccount.EmployeeId).ToList();
            return employeeBankAccounts.Select(bankAccount => new AmmsEmployeeBankAccount
            {
                EmployeeId = bankAccount.EmployeeId,
                EmployeeName = bankAccount.Employee.Name,
                BankName = bankAccount.BankName,
                BankBranch = bankAccount.BankBranch,
                AccountNumber = bankAccount.AccountNumber,
                Status = bankAccount.Status,
                StartDate = DateUtility.IntToDate(bankAccount.StartDate),
                EndDate = (bankAccount.EndDate != null) ? DateUtility.IntToDate((long)bankAccount.EndDate) : new DateTime(),
                Id = bankAccount.Employee.EmployeeId
            }).ToList();
        }

        public CrudResult AddEmployeeBankAccount(AmmsEmployeeBankAccount ammsEmployeeBankAccount)
        {
            
            var employeeBankAccount = GetEmployeeBankAccount(ammsEmployeeBankAccount);
            if (_employeeBankAccountRepositoy.AccountNumberExists(employeeBankAccount.EmployeeId,employeeBankAccount.AccountNumber))
            {
                return new CrudResult(false,"Account Number Already Exists in Employee Bank Account");
            }
            var employeeBankAccountAddResult = Add(employeeBankAccount);
            return employeeBankAccountAddResult;
        }

        public CrudResult EditEmployeeBankAccount(AmmsEmployeeBankAccount ammsEmployeeBankAccount)
        {
            
            
            var employeeBankAccount = GetEmployeeBankAccountForEdit(ammsEmployeeBankAccount);

            //if (_employeeBankAccountRepositoy.AccountNumberExists(employeeBankAccount.EmployeeId, employeeBankAccount.AccountNumber))
            //{
            //    return new CrudResult(false, "Account Number Already Exists in Employee Bank Account");
            //}
            var employeeBankAccountEditResult = Edit(employeeBankAccount);
            return employeeBankAccountEditResult;
        }

        public CrudResult DeleteEmployeeBankAccount(int employeeBankAccountId)
        {
            var accountInTransaction =
                _employeeBankAccountRepositoy.IsBankAccountUsedInHrmTransaction(employeeBankAccountId);
            if (accountInTransaction)
            {
                var employeeBankAccount = Get<EmployeeBankAccount>(employeeBankAccountId);
                employeeBankAccount.Status = EmployeeConfig.EmployeeBankAccountStatus.Deleted;
                var employeeBankAccountDeleteResult = Edit(employeeBankAccount);
                if(!employeeBankAccountDeleteResult.Success)return new CrudResult(false, employeeBankAccountDeleteResult.Message);
                return new CrudResult(true,"Employee Bank Account deleted successfully");
                //var res = Delete<Model.DfEntities.EmployeeBankAccount>(employeeBankAccountId);// Post Condition(User cannot delete a bank account if that bank account used in Pay Salary.)
                //return res;
            }
            return new CrudResult(false,"Cannot Delete Bank Account because it's been used in pay salary.");
        }

        public EmployeeBankAccount GetEmployeeBankAccount(AmmsEmployeeBankAccount empBankAccount)
        {
            var employeeBankAccount = new EmployeeBankAccount
            {
                EmployeeId = empBankAccount.EmployeeId,
                BankName = empBankAccount.BankId.ToString(),
                BankBranch = empBankAccount.BankBranch,
                AccountNumber = empBankAccount.AccountNumber,
                StartDate = DateUtility.DateToInt(empBankAccount.StartDate),
                EndDate = null,
                CreatedBy = empBankAccount.CreatedBy,
                ModifiedBy = empBankAccount.ModifiedBy,
                OfficeType = empBankAccount.OfficeType.ToString(),
                OfficeCode = empBankAccount.OfficeCode,
                CreatedOn = DateTime.Now,
                ModifiedOn = DateTime.Now,
                Status = empBankAccount.Status,
                CreatedBranchDate = empBankAccount.CreatedBranchDate,
                ModifiedBranchDate = empBankAccount.ModifiedBranchDate

            };
            //if (empBankAccount.EndDate != null) employeeBankAccount.EndDate = DateUtility.DateToInt((DateTime)empBankAccount.EndDate);
            return employeeBankAccount;
        }


        public EmployeeBankAccount GetEmployeeBankAccountForEdit(AmmsEmployeeBankAccount empBankAccount)
        {
            var employee = _employeeBankAccountRepositoy.GetEmployeeBankAccountByEmployeeId(empBankAccount.EmpId);
            var employeeBankAccount = new EmployeeBankAccount
            {
                
                BankName = empBankAccount.BankId.ToString(),
                BankBranch = empBankAccount.BankBranch,
                AccountNumber = empBankAccount.AccountNumber,
                StartDate = DateUtility.DateToInt(empBankAccount.StartDate),
                EndDate = DateUtility.DateToInt(empBankAccount.EndDate),
                CreatedBy = employee.CreatedBy,
                ModifiedBy = empBankAccount.ModifiedBy,
                OfficeType = empBankAccount.OfficeType.ToString(),
                OfficeCode = empBankAccount.OfficeCode,
                CreatedOn = employee.CreatedOn,
                ModifiedOn = DateTime.Now,
                Status = empBankAccount.Status,
                CreatedBranchDate = employee.CreatedBranchDate,
                ModifiedBranchDate = empBankAccount.ModifiedBranchDate,
                Id = empBankAccount.Id,
                EmployeeId = empBankAccount.EmpId //_employeeBankAccountRepositoy.GetEmployeeBankAccountById(empBankAccount.EmpId).EmployeeId

            };
            //if (empBankAccount.EndDate != null) employeeBankAccount.EndDate = DateUtility.DateToInt((DateTime)empBankAccount.EndDate);
            return employeeBankAccount;
        }

        public AmmsEmployeeBankAccount GetOfficeTypeAndCode(Model.DfEntities.Employee employee)
        {
            return new AmmsEmployeeBankAccount
            {
                OfficeCode = employee.CurrentBranchId,
                OfficeType = employee.CurrentOfficeType
            };
        }
    }
}
