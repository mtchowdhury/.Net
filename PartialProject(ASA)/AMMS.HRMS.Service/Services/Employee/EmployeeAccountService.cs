using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMMS.Common;
using AMMS.Common.Model;
using AMMS.HRMS.Service.Interfaces.Employee;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Model.DfEntities;
using AMMS.Programs.Service.Helper;
using AMMS.Repository.Interfaces.HRMS;
using AMMS.Repository.Repositories.HRMS;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;
using AMMS.Service.Services;
using AMMS.Service.Services.Utility;
using AutoMapper.Execution;

namespace AMMS.HRMS.Service.Services.Employee
{
   public class EmployeeAccountService :GenericCrudService, IEmployeeAccountService
    {
        private readonly IEmployeeRepository _employeeRepository;
        public EmployeeAccountService(string connectionString) : base(connectionString)
       {
            _employeeRepository = new EmployeeRepository(connectionString);
        }
        public Dictionary<string, List<AmmsIntFilter>> GetListPageFilterData()
        {
            return new Dictionary<string, List<AmmsIntFilter>>
            {
                {"OfficeTypes",GetAll<OfficeType>().Select(ot=>new AmmsIntFilter {Name = ot.Name,Value = ot.OfficeTypeId}).ToList() },
                {"Status",GetByProperty<EmployeeConfig>(ec=>ec.Type=="EmployeeAccountStatus").Select(s=>new AmmsIntFilter {Name = s.Name,Value =int.Parse(s.Value)}).ToList()},
                {"AccountTypes",GetAll<EmployeeAccountType>().Select(at=>new AmmsIntFilter {Name = at.AccountTypeName,Value = at.Id}).ToList() }
               // {"AccountTypes",GetByProperty<EmployeeAccountType>(eac=>eac.RecurringInPayroll==false && eac.RecurringInSalaryStructure==false).Select(at=>new AmmsIntFilter {Name = at.AccountTypeName,Value = at.Id}).ToList() }
            };
        }

        public Dictionary<string, List<AmmsIntFilter>> GetAddPageFilterData(int employeeId,int roleId,int branchId,bool isEdit)
        {

            var employeeBranchId = GetByProperty<Model.DfEntities.Employee>(e => e.Id == employeeId).FirstOrDefault()?.CurrentBranchId;
            return new Dictionary<string, List<AmmsIntFilter>>
            {
                {"OfficeTypes",GetAll<OfficeType>().Select(ot=>new AmmsIntFilter {Name = ot.Name,Value = ot.OfficeTypeId}).ToList() },
                {"AccountTypes",isEdit? GetAll<EmployeeAccountType>()
                .Select(at=>new AmmsIntFilter {Name = at.AccountTypeName,Value = at.Id}).ToList() : _employeeRepository.GetAcountTypes(roleId,branchId).Where(eac=>eac.RecurringInPayroll==false && eac.RecurringInSalaryStructure==false && eac.Status==1)
                .Select(at=>new AmmsIntFilter {Name = at.AccountTypeName,Value = at.Id}).ToList() },
                {"Status",GetByProperty<EmployeeConfig>(ec=>ec.Type=="EmployeeAccountStatus").Select(s=>new AmmsIntFilter {Name = s.Name,Value =int.Parse(s.Value)}).ToList()},
                {"AccountOpeningTypes",GetByProperty<EmployeeConfig>(ec=>ec.Type=="AccountOpeningType").Select(ot=>new AmmsIntFilter {Name = ot.Name,Value =int.Parse(ot.Value)}).ToList() },
                {"InstallmentTypes",GetByProperty<EmployeeConfig>(ec=>ec.Type=="AccountInstallmentType").Select(ot=>new AmmsIntFilter {Name = ot.Name,Value =int.Parse(ot.Value)}).ToList() },
                {"LifeCycles",GetByProperty<EmployeeConfig>(ec=>ec.Type=="AccountLifeCycle").Select(ot=>new AmmsIntFilter {Name = ot.Name,Value =int.Parse(ot.Value)}).ToList() },
                {"BankAccounts",GetByProperty<BankAccountDetail>(ba=>ba.BranchId==branchId && ba.Status==1).Select(ba=>new AmmsIntFilter {Name = ba.AccountNumber+"("+ba.BankName+")",Value =ba.Id}).ToList() },
                {"Duration",GetByProperty<EmployeeConfig>(ec=>ec.Type=="EmployeeAccountDuration").Select(d=>new AmmsIntFilter {Name = d.Name,Value =int.Parse(d.Value)}).ToList() },
                {"Districts",GetAll<AdministrativeDistrict>().Select(d=>new AmmsIntFilter {Name = d.Name,Value = d.Id}).ToList() },
                {"Branches",GetAll<Branch>().Select(d=>new AmmsIntFilter {Name = d.Name,Value = d.Id}).ToList() }
            };
        }
        public List<AmmsIntFilter> GetBranchListByOfficeTypeId(int officeTypeId)
        {
            return
                GetByProperty<Branch>(b => b.OfficeTypeId == officeTypeId)
                    .Select(br => new AmmsIntFilter {Name = br.Name, Value = br.Id})
                    .OrderBy(b=>b.Name).ToList();
        }
        public List<AmmsRelationalFilter> GetEmployeeListByBranchId(int branchId)
        {
            return
                GetByProperty<Model.DfEntities.Employee>(e => e.CurrentBranchId == branchId)
                    .Select(em => new AmmsRelationalFilter { Name = em.Status==1? em.Name+"("+em.EmployeeId+")"+"*": em.Name + "(" + em.EmployeeId + ")"
                    , Value = em.Id , RelationalValue = em.Status}).OrderBy(e => e.RelationalValue).ThenBy(e=>e.Name)
                    .ToList();
        }

       public List<AmmsEmployeeAccount> GetAccountList(int branchId,int employeeId, int accountTypeId, int statusId)
       {
           
         //  var employee =employeeId!=-1000? GetByProperty<Model.DfEntities.Employee>(e => e.Id == employeeId).FirstOrDefault():null;
           var filteredAllAccounts = employeeId != -1000
               ? GetByProperty<EmployeeAccount>(
                   eac => eac.EmployeeId == employeeId && eac.Status != Common.Globals.EmployeeConfig.EmployeeAccountStatus.Deleted)
               : GetByProperty<EmployeeAccount>(
                   eac => eac.CurrentOfficeCode==branchId && eac.Status != Common.Globals.EmployeeConfig.EmployeeAccountStatus.Deleted);

           var inactive = filteredAllAccounts.Where(f => f.Status == Common.Globals.EmployeeConfig.EmployeeAccountStatus.Inactive);
            var allemployeeaccounts =
                //GetByProperty<EmployeeAccount>(
                //   eac => eac.EmployeeId == employeeId && eac.Status!=3)
                filteredAllAccounts
                   .Select(ac => new AmmsEmployeeAccount
                   {
                       Id = ac.Id,
                       //Duration = ac.Duration,
                        EmployeeName = GetByProperty<Model.DfEntities.Employee>(e=>e.Id==ac.EmployeeId).FirstOrDefault()?.Name+"("+ GetByProperty<Model.DfEntities.Employee>(e => e.Id == ac.EmployeeId).FirstOrDefault()?.Code.ToString()+")",
                      // EmployeeName = employee?.Name+"("+employee?.Code+ ")",
                       //TotalInstallment = ac.TotalInstallment,
                       PrincipalAmount = ac.PrincipalAmount,
                       OutstandingAmount = ac.OutstandingAmount!=null?(float) ac.OutstandingAmount:0,
                       ReceiveAmount = ac.ReceiveAmount,
                       DisburseDate = ac.DisburseDate != null ? DateUtility.IntToDate((long)ac.DisburseDate) : (DateTime?)null,
                       OpeningDate = ac.OpeningDate != null ? DateUtility.IntToDate((long)ac.OpeningDate) : (DateTime?)null,
                       ReceiveDate = ac.ReceiveDate != null ? DateUtility.IntToDate((long)ac.ReceiveDate) : (DateTime?)null,
                       ClosingDate = ac.ClosingDate != null ? DateUtility.IntToDate((long)ac.ClosingDate) : (DateTime?)null,
                       AccountOpeningType = ac.AccountOpeningType,
                      // InstallmentType = ac.InstallmentFrequency,
                     //  LifeCycle = ac.LifeCycle,
                      // Cycle = ac.Cycle,
                       Status = ac.Status,
                       AccountTypeId =ac.AccountTypeId, 
                       AccountTypeName = GetByProperty<EmployeeAccountType>(eat=>eat.Id==ac.AccountTypeId).FirstOrDefault()?.AccountTypeName
                   }).ToList();

            if (accountTypeId != -1 && statusId != -1)
            {
              return  allemployeeaccounts.Where(eac => eac.AccountTypeId == accountTypeId && eac.Status == statusId).ToList();
            }
            if (accountTypeId == -1 && statusId != -1)
            {
                return allemployeeaccounts.Where(eac =>eac.Status == statusId).ToList();
            }
            if (accountTypeId != -1 && statusId == -1)
            {
                return allemployeeaccounts.Where(eac => eac.AccountTypeId == accountTypeId).ToList();
            }

           return allemployeeaccounts;


       }

       public CrudResult DeleteEmployeeAccountById(int employeeAccountId,DateTime workingDate,int roleId,string user)
       {
            //more latest implementation
           var employeeAccount = Get<EmployeeAccount>(employeeAccountId);
                //GetByProperty<EmployeeAccount>(eac => eac.Id == employeeAccountId).FirstOrDefault();
            if(employeeAccount?.SalaryStructureId!=null)return new CrudResult(false,"Sorry!Salary structure account can not be deleted manually!");
            var myStringemployeeacountId = employeeAccountId.ToString();
           var selectedEmployeeAccontTransactions = GetTableDataByConditions<HRMTransaction>("[hrm].[HRMTransaction]",
               "EmployeeAccountId='" + myStringemployeeacountId + "'");
                //GetByProperty<HRMTransaction>(ht => ht.EmployeeAccountId == myStringemployeeacountId).ToList();
           if (
               selectedEmployeeAccontTransactions.All(
                   t => t.CreatedBranchWorkingDate == DateUtility.DateToInt(workingDate)))
           {
               if (selectedEmployeeAccontTransactions.All(t => t.TransactionTypeId == 8 || t.TransactionTypeId == 9))
               {
                   var transactiondelteresult = DeleteAll(selectedEmployeeAccontTransactions);
                    if (!transactiondelteresult.Success)
                        return new CrudResult(false,
                            "Employee account couldnot be deleted as transaction delete operation failed!");
                    var employeeaccountdeleteresult =
                        Delete<EmployeeAccount>(employeeAccountId);
                    if (!employeeaccountdeleteresult.Success) return new CrudResult(false, employeeaccountdeleteresult.Message);
                    return new CrudResult(true, "Employee Account deleted successfully");
                    // employeeAccount.Status = Common.Globals.EmployeeConfig.EmployeeAccountStatus.Deleted;
                    //var employeeAccountDeleteResult = Edit(employeeAccount);
                    // if(!employeeAccountDeleteResult.Success)return new CrudResult(false, employeeAccountDeleteResult.Message);
                    // return new CrudResult(true,"Employee Account deleted successfully");
                }
                else
               {
                   return new CrudResult(false,
                       "There are existing transactions for this account.please nullify them first before deleting this account!");
               }
           }
           else
           {
                if (roleId == 3) return new CrudResult(false, "User don't have privilege to delete transactions which is not on current working date!");
                var maxTransactionDate = selectedEmployeeAccontTransactions.Max(tr => tr.TransactionDate);
                TimeSpan span = workingDate.Subtract(DateUtility.IntToDate(maxTransactionDate));
                if (roleId == 5 && span.Days > 90) return new CrudResult(false, "User dont have privilege to delete transactions which is older than 90 days!");
                if (selectedEmployeeAccontTransactions.All(t => t.TransactionTypeId == 8 || t.TransactionTypeId == 9))
               {
                    foreach (var transaction in selectedEmployeeAccontTransactions)
                   {
                       transaction.ReferenceTransactionid = transaction.Id;
                       transaction.Id = 0;
                       transaction.IsReversed = true;
                       transaction.Credit = transaction.Credit*-1;
                       transaction.Debit = transaction.Debit*-1;
                       IdHelper.GenerateTransactionId((transaction.EmployeeAccountId),
                           transaction.TransactionTypeId, transaction.Credit != null, true);
                       transaction.CreatedSystemDate = DateUtility.DateToInt(DateTime.Now);
                       transaction.ModifiedSystemDate = DateUtility.DateToInt(DateTime.Now);
                       transaction.CreatedBranchWorkingDate = DateUtility.DateToInt(workingDate);
                       transaction.ModifiedBranchWorkingDate = DateUtility.DateToInt(workingDate);
                       transaction.CreatedBy = Int32.Parse(user);
                       transaction.ModifiedBy = Int32.Parse(user);
                       transaction.TransactionDate = DateUtility.DateToInt(workingDate);
                       var addresult = Add(transaction);
                       if (!addresult.Success)
                           return new CrudResult(false,
                               "unable to reverse existing transactions.Employee Account not deleted!");
                   }
                    //  return DeleteByPorperty<EmployeeAccount>(eac => eac.Id == employeeAccountId);
                    employeeAccount.Status = Common.Globals.EmployeeConfig.EmployeeAccountStatus.Deleted;
                    var employeeAccountDeleteResult = Edit(employeeAccount);
                    if (!employeeAccountDeleteResult.Success) return new CrudResult(false, employeeAccountDeleteResult.Message);
                    return new CrudResult(true, "Employee Account deleted successfully");
                }
               else
               {
                    var sameDayTransaction =
                      selectedEmployeeAccontTransactions.Where(
                          tr => tr.TransactionDate == DateUtility.DateToInt(workingDate)).ToList();
                    var notsameDayTransaction =
                        selectedEmployeeAccontTransactions.Where(
                            tr => tr.TransactionDate != DateUtility.DateToInt(workingDate)).ToList();
                    var notDisburseTypeTransaction =
                        selectedEmployeeAccontTransactions.Where(tr => tr.TransactionTypeId != 8 && tr.TransactionTypeId != 9)
                            .ToList();
                   var notDisburseTypeTransactionSum = notDisburseTypeTransaction.Sum(tr => tr.Debit) +
                                                       notDisburseTypeTransaction.Sum(tr => tr.Credit);
                    if (notDisburseTypeTransactionSum > 0)
                        return new CrudResult(false,
                            "Non disburse type transaction exist for this employee account.please delete or nullify them from HRM Transaction first before deleting Employee Account!");
                    //if (roleId == 3) return new CrudResult(false, "User dont have privilege to delete transactions which is not on current working date!");

                    //var maxTransactionDate = selectedEmployeeAccontTransactions.Max(tr => tr.TransactionDate);
                    //TimeSpan span = workingDate.Subtract(DateUtility.IntToDate(maxTransactionDate));
                    //if (roleId == 5 && span.Days > 90) return new CrudResult(false, "User dont have privilege to delete transactions which is older than 90 days!");
                    foreach (var transaction in sameDayTransaction)
                    {
                        var deleteresult = DeleteByPorperty<HRMTransaction>(tr => tr.Id == transaction.Id);
                        if (!deleteresult.Success) return new CrudResult(false, "unable to delete transactions.Employee account not deleted!");
                    }
                    foreach (var transaction in notsameDayTransaction)
                    {
                        transaction.ReferenceTransactionid = transaction.Id;
                        transaction.Id = 0;
                        transaction.IsReversed = true;
                        transaction.Credit = transaction.Credit * -1;
                        transaction.Debit = transaction.Debit * -1;
                        IdHelper.GenerateTransactionId((transaction.EmployeeAccountId),
                        transaction.TransactionTypeId, transaction.Credit != null, true);
                        transaction.CreatedSystemDate = DateUtility.DateToInt(DateTime.Now);
                        transaction.ModifiedSystemDate = DateUtility.DateToInt(DateTime.Now);
                        transaction.CreatedBranchWorkingDate = DateUtility.DateToInt(workingDate);
                        transaction.ModifiedBranchWorkingDate = DateUtility.DateToInt(workingDate);
                        transaction.CreatedBy = Int32.Parse(user);
                        transaction.ModifiedBy = Int32.Parse(user);
                        transaction.TransactionDate = DateUtility.DateToInt(workingDate);
                        var addresult = Add(transaction);
                        if (!addresult.Success) return new CrudResult(false, "unable to reverse existing transactions.Employee Account not deleted!");
                    }
                    //return DeleteByPorperty<EmployeeAccount>(eac => eac.Id == employeeAccountId);
                    employeeAccount.Status = Common.Globals.EmployeeConfig.EmployeeAccountStatus.Deleted;
                    var employeeAccountDeleteResult = Edit(employeeAccount);
                    if (!employeeAccountDeleteResult.Success) return new CrudResult(false, employeeAccountDeleteResult.Message);
                    return new CrudResult(true, "Employee Account deleted successfully");

                }
            }
            //latest implementation
            //var  myStringemployeeacountId = employeeAccountId.ToString();
            //  var selectedEmployeeAccontTransactions =
            //      GetByProperty<HRMTransaction>(ht => ht.EmployeeAccountId == myStringemployeeacountId).ToList();
            //  if (selectedEmployeeAccontTransactions.All(t => t.CreatedBranchWorkingDate == DateUtility.DateToInt(workingDate)))
            //  {
            //      var transactiondelteresult = DeleteAll(selectedEmployeeAccontTransactions);
            //      if (!transactiondelteresult.Success)
            //          return new CrudResult(false,
            //              "employee account couldnot be deleted as transaction delete operation failed!");
            //      var employeeaccountdeleteresult = DeleteByPorperty<EmployeeAccount>(eac => eac.Id == employeeAccountId);
            //      return employeeaccountdeleteresult;
            //  }
            //  else
            //  {
            //      var sameDayTransaction =
            //          selectedEmployeeAccontTransactions.Where(
            //              tr => tr.TransactionDate == DateUtility.DateToInt(workingDate)).ToList();
            //      var notsameDayTransaction =
            //          selectedEmployeeAccontTransactions.Where(
            //              tr => tr.TransactionDate != DateUtility.DateToInt(workingDate)).ToList();
            //      var notDisburseTypeTransaction =
            //          selectedEmployeeAccontTransactions.Where(tr => tr.TransactionTypeId != 8 && tr.TransactionTypeId != 9)
            //              .ToList();
            //      if (notDisburseTypeTransaction.Count > 0)
            //          return new CrudResult(false,
            //              "Non disburse type transaction exist for this employee account.please delete them from HRM Transaction firts before deleting Employee Account!");
            //      if(roleId==3)return new CrudResult(false,"User dont have privilege to delete transactions which is not on current working date!");

                //      var maxTransactionDate = selectedEmployeeAccontTransactions.Max(tr => tr.TransactionDate);
                //      TimeSpan span = workingDate.Subtract(DateUtility.IntToDate(maxTransactionDate));
                //      if(roleId==5 && span.Days>90) return new CrudResult(false,"User dont have privilege to delete transactions which is older than 90 days!");

                //      foreach (var transaction in sameDayTransaction)
                //      {
                //          var deleteresult = DeleteByPorperty<HRMTransaction>(tr => tr.Id == transaction.Id);
                //           if(!deleteresult.Success)return new CrudResult(false,"unable to delete transactions.Employee account not deleted!");
                //      }
                //      foreach (var transaction in notsameDayTransaction)
                //      {
                //           transaction.ReferenceTransactionid = transaction.Id;
                //           transaction.Id = 0;
                //           transaction.IsReversed = true;
                //           transaction.Credit = transaction.Credit * -1;
                //           transaction.Debit = transaction.Debit * -1;
                //           IdHelper.GenerateTransactionId((transaction.EmployeeAccountId),
                //           transaction.TransactionTypeId, transaction.Credit != null, true);
                //           transaction.CreatedSystemDate = DateUtility.DateToInt(DateTime.Now);
                //           transaction.ModifiedSystemDate = DateUtility.DateToInt(DateTime.Now);
                //           transaction.CreatedBranchWorkingDate = DateUtility.DateToInt(workingDate);
                //           transaction.ModifiedBranchWorkingDate = DateUtility.DateToInt(workingDate);
                //           transaction.CreatedBy = Int32.Parse(user);
                //           transaction.ModifiedBy = Int32.Parse(user);
                //          transaction.TransactionDate = DateUtility.DateToInt(workingDate); 
                //          var addresult=Add(transaction);
                //          if(!addresult.Success)return  new CrudResult(false,"unable to reverse existing transactions.Employee Account not deleted!");
                //      }
                //      return DeleteByPorperty<EmployeeAccount>(eac => eac.Id == employeeAccountId);

                //delete blocker implementation pending if transaction exists
                // var longworkingdate = DateUtility.DateToInt(workingDate);
                //var accountIdString = employeeAccountId.ToString();
                //if (
                //    GetByProperty<HRMTransaction>(
                //        ht => ht.EmployeeAccountId == accountIdString && ht.TransactionDate != longworkingdate)
                //        .Any())
                //{
                //    return new CrudResult(false,"Employee Account can not be deleted with existing transaction on back date!");
                //}

                //var eacdeleteresult= DeleteByPorperty<EmployeeAccount>(eac => eac.Id == employeeAccountId);
                //if (eacdeleteresult.Success) DeleteByPorperty<HRMTransaction>(ht => ht.EmployeeAccountId == accountIdString);
                //return eacdeleteresult;

        }

    public int GetEmployeeAccountCycleCount(int employeeId, int accountTypeId)
       {
           return
               GetByProperty<EmployeeAccount>(
                   eac => eac.EmployeeId == employeeId && eac.AccountTypeId == accountTypeId && eac.Status == Common.Globals.EmployeeConfig.EmployeeAccountStatus.Active).Count+1;
       }
        public CrudResult AddEmployeeAccount(AmmsEmployeeAccount eaccount)
        {
            var previousSameTypeEmployeeAccounts =
                GetByProperty<EmployeeAccount>(
                   // eac => eac.EmployeeId == eaccount.EmployeeId && eac.AccountTypeId == eaccount.AccountTypeId && eac.OutstandingAmount>0);
                    eac => eac.EmployeeId == eaccount.EmployeeId && eac.AccountTypeId == eaccount.AccountTypeId && eac.Status== Common.Globals.EmployeeConfig.EmployeeAccountStatus.Active);

            if (previousSameTypeEmployeeAccounts.Select(previousSameTypeEmployeeAccount => GetByProperty<EmployeeAccountType>(eat => eat.Id == previousSameTypeEmployeeAccount.AccountTypeId)
                .FirstOrDefault()).Any(accounttype => !accounttype.IsMultiple))
            {
                return new CrudResult(false,"Employee already has the same type account active with outstanding!");
            }

            if (eaccount.PrincipalAmount>0 && eaccount.ChequeAmount> eaccount.PrincipalAmount)
            {
                return  new CrudResult (false,"Cheque amount can not be greater than principal amount!");
            }

            var employee = GetByProperty<Model.DfEntities.Employee>(e => e.Id == eaccount.EmployeeId).FirstOrDefault();
            var whatisthedate = eaccount.DisburseDate ?? eaccount.OpeningDate;
            if(employee.CurrentBranchJoiningDate> DateUtility.DateToInt((DateTime)whatisthedate))return new CrudResult(false,"employee account creation date can not be less than employee joining date!");
            var employeeb = GetByProperty<Model.DfEntities.EmployeeBranch>(e => e.EmployeeId == eaccount.EmployeeId && e.EndDate==null).FirstOrDefault();
            var employeeBranch = GetByProperty<Model.DfEntities.Branch>(e => e.Id == employeeb.BranchId).FirstOrDefault();
            eaccount.CurrentOfficeType = employeeBranch.OfficeTypeId;
                eaccount.CurrentOfficeCode = employeeBranch.Id;
            var accountaddresult= Add(new EmployeeAccount
            {
                AccountOpeningType = eaccount.AccountOpeningType,
                AccountTypeId = eaccount.AccountTypeId,
                AccountNumber = eaccount.AccountNumber,
                BankAccount = eaccount.BankAccount,
                ChequeAmount = eaccount.ChequeAmount,
                ChequeNo = eaccount.ChequeNo,
                Cycle = eaccount.Cycle,
                Type = eaccount.Type,
                Duration = eaccount.Duration,
                EmployeeId = eaccount.EmployeeId,
                InstallmentAmount = eaccount.InstallmentAmount,
                InstallmentFrequency = eaccount.InstallmentType,
                LifeCycle = eaccount.LifeCycle,
                TotalInstallment = eaccount.TotalInstallment,
                PrincipalAmount = eaccount.PrincipalAmount,
                RepeatInPayroll = eaccount.RepeatInPayroll,
                ExemptionAdjust = eaccount.ExemptionAdjust,
                ServiceCharge = eaccount.ServiceCharge,
                ServiceChargeRate = eaccount.ServiceChargeRate,
                Status = eaccount.Status,
                ReceiveAmount = eaccount.ReceiveAmount,
                SubsidyAmount = eaccount.SubsidyAmount,
                OutstandingAdjust = eaccount.OutstandingAdjust,
                DisburseDate = (eaccount.DisburseDate!=null?DateUtility.DateToInt((DateTime)eaccount.DisburseDate):(long?) null),
                ClosingDate = (eaccount.ClosingDate != null?DateUtility.DateToInt((DateTime)eaccount.ClosingDate) :(long?) null),
                OpeningDate = (eaccount.OpeningDate != null?DateUtility.DateToInt((DateTime)eaccount.OpeningDate) :(long?) null),
                CreatedOn = eaccount.CreatedOn,
                UpdatedOn = DateTime.Now,
                CurrentOfficeCode = employeeBranch.Id,
                //CurrentOfficeType = employeeBranch.OfficeTypeId,
                OriginatingOfficeCode = employeeBranch.Id,
                //OriginatirngOfficeType = employeeBranch.OfficeTypeId,
                UpdatedBy = eaccount.CreatedBy,
                CreatedBy = eaccount.CreatedBy,
              //  OutstandingAmount = eaccount.PrincipalAmount+eaccount.ServiceCharge-eaccount.SubsidyAmount
                OutstandingAmount = eaccount.PrincipalAmount+eaccount.ServiceCharge
                

            });
            if (!accountaddresult.Success) return accountaddresult;
            var accountType =
                GetByProperty<EmployeeAccountType>(eat => eat.Id == eaccount.AccountTypeId).FirstOrDefault();
            if (accountType?.Category == 1)
            {
                if ( eaccount.ChequeAmount==null|| eaccount.ChequeAmount <= 0 )
                {

                   
                    var transactionAddResult = Add(new HRMTransaction
                    {
                        TransactionId = IdHelper.GenerateTransactionId((((EmployeeAccount)accountaddresult.Entity).Id).ToString(), 8, false, false),
                        EmployeeId = eaccount.EmployeeId,
                       // Grade = GetByProperty<EmployeeGrade>(eg => eg.EmployeeId == eaccount.EmployeeId).LastOrDefault().GradeId,
                        //Designation = GetByProperty<EmployeeDesignation>(eg => eg.EmployeeId == eaccount.EmployeeId).LastOrDefault().DesignationId,
                        //OfficeType = eaccount.CurrentOfficeType,
                        OfficeCode = eaccount.CurrentOfficeCode,
                        EmployeeAccountId = (((EmployeeAccount)accountaddresult.Entity).Id).ToString(),
                        EmployeeAccountTypeId = eaccount.AccountTypeId,
                       // EmployeeAccountName = "",
                        Debit = (decimal?)eaccount.PrincipalAmount,
                        Credit = 0,
                        TransactionTypeId = 8,
                       // TransactionTypeName = "",
                        TransactionProcess = 1,
                        TransactionDate = DateUtility.DateToInt((DateTime)eaccount.DisburseDate),
                        SalaryYear =null,
                        SalaryMonth = null,
                        ChequeNo = null,
                        BankAccount = eaccount.BankAccount,
                        EmployerBankAccount = null,
                        IsAutoTransaction = false,
                        Location = 1,
                        TransactionCreatedFrom = 66,
                        CreatedBy = Int32.Parse(eaccount.CreatedBy),
                        ModifiedBy = Int32.Parse(eaccount.CreatedBy),
                        CreatedBranchWorkingDate = DateUtility.DateToInt((DateTime)eaccount.CreatedOn),
                        CreatedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ModifiedBranchWorkingDate = DateUtility.DateToInt((DateTime)eaccount.CreatedOn),
                        ModifiedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ReferenceTransactionid = null,
                        IsReversed = false,
                        ReversalDate = null,
                        ReverseBranchWorkingDate = null,
                        ReferenceAccountId = null,
                        ReferenceOfficeCode = null

                    });
                    if (!transactionAddResult.Success)
                    {
                        Delete<EmployeeAccount>(accountaddresult.Entity);
                        return transactionAddResult;
                    }
                }
                else
                {
                    var chequetransactionAddResult = Add(new HRMTransaction
                    {
                        TransactionId = IdHelper.GenerateTransactionId((((EmployeeAccount)accountaddresult.Entity).Id).ToString(), 8, false, false),
                        EmployeeId = eaccount.EmployeeId,
                       // Grade = GetByProperty<EmployeeGrade>(eg => eg.EmployeeId == eaccount.EmployeeId).LastOrDefault().GradeId,
                        //Designation = GetByProperty<EmployeeDesignation>(eg => eg.EmployeeId == eaccount.EmployeeId).LastOrDefault().DesignationId,
                        //OfficeType = eaccount.CurrentOfficeType,
                        OfficeCode = eaccount.CurrentOfficeCode,
                        EmployeeAccountId = (((EmployeeAccount)accountaddresult.Entity).Id).ToString(),
                        EmployeeAccountTypeId = eaccount.AccountTypeId,
                        //EmployeeAccountName = "",
                        Debit =(decimal) eaccount.ChequeAmount,
                        Credit = 0,
                        TransactionTypeId = 8,
                      //  TransactionTypeName = "",
                        TransactionProcess = 2,
                        TransactionDate = DateUtility.DateToInt((DateTime)eaccount.DisburseDate),
                        SalaryYear = null,
                        SalaryMonth = null,
                        ChequeNo = eaccount.ChequeNo,
                        BankAccount = eaccount.BankAccount,
                        EmployerBankAccount = null,
                        IsAutoTransaction = false,
                        Location = 1,
                        TransactionCreatedFrom = 66,
                        CreatedBy = Int32.Parse(eaccount.CreatedBy),
                        ModifiedBy = Int32.Parse(eaccount.CreatedBy),
                        CreatedBranchWorkingDate = DateUtility.DateToInt((DateTime)eaccount.CreatedOn),
                        CreatedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ModifiedBranchWorkingDate = DateUtility.DateToInt((DateTime)eaccount.CreatedOn),
                        ModifiedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ReferenceTransactionid = null,
                        IsReversed = false,
                        ReversalDate = null,
                        ReverseBranchWorkingDate = null,
                        ReferenceAccountId = null,
                        ReferenceOfficeCode = null

                    });
                    if (!chequetransactionAddResult.Success)
                    {
                        Delete<EmployeeAccount>(accountaddresult.Entity);
                        return chequetransactionAddResult;
                    }
                    var cashTransactionAddResult = Add(new HRMTransaction
                    {
                        TransactionId = IdHelper.GenerateTransactionId((((EmployeeAccount)accountaddresult.Entity).Id).ToString(), 8, false, false),
                        EmployeeId = eaccount.EmployeeId,
                        //Grade = GetByProperty<EmployeeGrade>(eg => eg.EmployeeId == eaccount.EmployeeId).LastOrDefault().GradeId,
                       // Designation = GetByProperty<EmployeeDesignation>(eg => eg.EmployeeId == eaccount.EmployeeId).LastOrDefault().DesignationId,
                        //OfficeType = eaccount.CurrentOfficeType,
                        OfficeCode = eaccount.CurrentOfficeCode,
                        EmployeeAccountId = (((EmployeeAccount)accountaddresult.Entity).Id).ToString(),
                        EmployeeAccountTypeId = eaccount.AccountTypeId,
                       // EmployeeAccountName = "",
                        Debit = (decimal?)(eaccount.PrincipalAmount-eaccount.ChequeAmount),
                        Credit = 0,
                        TransactionTypeId = 8,
                       // TransactionTypeName = "",
                        TransactionProcess = 1,
                        TransactionDate = DateUtility.DateToInt((DateTime)eaccount.DisburseDate),
                        SalaryYear = null,
                        SalaryMonth = null,
                        ChequeNo = null,
                        BankAccount = eaccount.BankAccount,
                        EmployerBankAccount = null,
                        IsAutoTransaction = false,
                        Location = 1,
                        TransactionCreatedFrom = 66,
                        CreatedBy = Int32.Parse(eaccount.CreatedBy),
                        ModifiedBy = Int32.Parse(eaccount.CreatedBy),
                        CreatedBranchWorkingDate = DateUtility.DateToInt((DateTime)eaccount.CreatedOn),
                        CreatedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ModifiedBranchWorkingDate = DateUtility.DateToInt((DateTime)eaccount.CreatedOn),
                        ModifiedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ReferenceTransactionid = null,
                        IsReversed = false,
                        ReversalDate = null,
                        ReverseBranchWorkingDate = null,
                        ReferenceAccountId = null,
                        ReferenceOfficeCode = null

                    });
                    if (!cashTransactionAddResult.Success)
                    {
                        Delete<EmployeeAccount>(accountaddresult.Entity);
                        Delete<HRMTransaction>(chequetransactionAddResult.Entity);
                        return cashTransactionAddResult;
                    }
                }
                var interestTransactionAddResult = Add(new HRMTransaction
                {
                    TransactionId = IdHelper.GenerateTransactionId((((EmployeeAccount)accountaddresult.Entity).Id).ToString(), 9, false, false),
                    EmployeeId = eaccount.EmployeeId,
                    //Grade = GetByProperty<EmployeeGrade>(eg => eg.EmployeeId == eaccount.EmployeeId).LastOrDefault().GradeId,
                    //Designation = GetByProperty<EmployeeDesignation>(eg => eg.EmployeeId == eaccount.EmployeeId).LastOrDefault().DesignationId,
                   // OfficeType = eaccount.CurrentOfficeType,
                    OfficeCode = eaccount.CurrentOfficeCode,
                    EmployeeAccountId = (((EmployeeAccount)accountaddresult.Entity).Id).ToString(),
                    EmployeeAccountTypeId = eaccount.AccountTypeId,
                    //EmployeeAccountName = "",
                    Debit = (decimal?)eaccount.ServiceCharge,
                    Credit = 0,
                    TransactionTypeId = 9,
                   // TransactionTypeName = "",
                    TransactionProcess = 1,
                    TransactionDate = DateUtility.DateToInt((DateTime)eaccount.DisburseDate),
                    SalaryYear = null,
                    SalaryMonth = null,
                    ChequeNo = null,
                    BankAccount = eaccount.BankAccount,
                    EmployerBankAccount = null,
                    IsAutoTransaction = false,
                    Location = 1,
                    TransactionCreatedFrom = 66,
                    CreatedBy = Int32.Parse(eaccount.CreatedBy),
                    ModifiedBy = Int32.Parse(eaccount.CreatedBy),
                    CreatedBranchWorkingDate = DateUtility.DateToInt((DateTime)eaccount.CreatedOn),
                    CreatedSystemDate = DateUtility.DateToInt(DateTime.Now),
                    ModifiedBranchWorkingDate = DateUtility.DateToInt((DateTime)eaccount.CreatedOn),
                    ModifiedSystemDate = DateUtility.DateToInt(DateTime.Now),
                    ReferenceTransactionid = null,
                    IsReversed = false,
                    ReversalDate = null,
                    ReverseBranchWorkingDate = null,
                    ReferenceAccountId = null,
                    ReferenceOfficeCode = null
                });

                //if (!interestTransactionAddResult.Success &&
                //    (eaccount.ChequeAmount == null || eaccount.ChequeAmount <= 0))
                //{
                //    Delete<EmployeeAccount>(accountaddresult.Entity);
                //    Delete<HRMTransaction>(transactionAddResult.Entity);
                    
                //}
                //else
                //{
                    
                //}
            }
            
            return accountaddresult;
        }

       public AmmsEmployeeAccount GetEmployeeAccountById(int eaccountId)
       {
           var account = GetByProperty<Model.DfEntities.EmployeeAccount>(e => e.Id == eaccountId).FirstOrDefault();
           var emp = GetByProperty<Model.DfEntities.Employee>(e => e.Id == account.EmployeeId).FirstOrDefault();
           //var currentempbranch=GetByProperty<Branch>(b=>b.Id==emp.CurrentBranchId)

           var x =
               GetByProperty<EmployeeAccount>(eac => eac.Id == eaccountId)
                   .Select(eac => new AmmsEmployeeAccount
                   {
                       Type = eac.Type,
                       ReceiveDate = eac.ReceiveDate != null? DateUtility.IntToDate(eac.ReceiveDate.GetValueOrDefault()): (DateTime?)null,
                       AccountNumber = eac.AccountNumber,
                       AccountTypeId = eac.AccountTypeId,
                       AccountOpeningType = eac.AccountOpeningType,
                       BankAccount = eac.BankAccount,
                       ChequeAmount = eac.ChequeAmount,
                       CurrentOfficeCode = eac.CurrentOfficeCode,
                       CurrentOfficeType = GetByProperty<Branch>(b=>b.Id==eac.CurrentOfficeCode).FirstOrDefault().OfficeTypeId,
                       ChequeNo = eac.ChequeNo,
                       Cycle = eac.Cycle,
                       Duration = eac.Duration,
                       InstallmentAmount = eac.InstallmentAmount,
                       EmployeeId = GetByProperty<Model.DfEntities.Employee>(e=>e.Id== eac.EmployeeId).FirstOrDefault()?.Id!=null? GetByProperty<Model.DfEntities.Employee>(e => e.Id == eac.EmployeeId).FirstOrDefault().Id:0 ,
                       InstallmentType = eac.InstallmentFrequency,
                       ExemptionAdjust = eac.ExemptionAdjust,
                       Id = eac.Id,
                       LifeCycle = eac.LifeCycle,
                       OriginatingOfficeCode = eac.OriginatingOfficeCode,
                       OriginatirngOfficeType = GetByProperty<Branch>(b => b.Id == eac.OriginatingOfficeCode).FirstOrDefault().OfficeTypeId,
                       OutstandingAdjust = eac.OutstandingAdjust,
                       PrincipalAmount = eac.PrincipalAmount,
                       ReceiveAmount = eac.ReceiveAmount,
                       RepeatInPayroll = eac.RepeatInPayroll,
                       ServiceCharge = eac.ServiceCharge ?? 0,
                       ServiceChargeRate = eac.ServiceChargeRate,
                       TotalInstallment = eac.TotalInstallment,
                       SubsidyAmount = eac.SubsidyAmount,
                       Status = eac.Status,
                       CreatedBy = eac.CreatedBy,
                       UpdatedBy = eac.UpdatedBy,
                       CreatedOn = eac.CreatedOn,
                       UpdatedOn = eac.UpdatedOn,
                       DisburseDate = eac.DisburseDate!=null?DateUtility.IntToDate((long)eac.DisburseDate):(DateTime?)null,
                       ClosingDate = eac.ClosingDate != null ? DateUtility.IntToDate((long)eac.ClosingDate) : (DateTime?)null,
                       OpeningDate = eac.OpeningDate != null ? DateUtility.IntToDate((long)eac.OpeningDate) : (DateTime?)null,
                       EmployeeName = emp?.Name+"("+ emp?.Code+")",
                       ReceiveBranch = eac.ReceiveBranch,
                       ReceiveDistrict = eac.ReceiveDistrict,
                     //  ReceiveDate = eac.ReceiveDate!=null?DateUtility.IntToDate((long)eac.ReceiveDate):(DateTime?)null,
                       SalaryStructureId =  eac.SalaryStructureId, 
                       OutstandingAmount = eac.OutstandingAmount!=null? (float) eac.OutstandingAmount:eac.OutstandingAmount
                   })
                   .FirstOrDefault();          
           return x;
       }

           public CrudResult EditEmployeeAccount(AmmsEmployeeAccount eac)
           {

               //var comparedDate = eac.DisburseDate ?? eac.OpeningDate;
               //TimeSpan span = ((DateTime)eac.UpdatedOn).Subtract((DateTime)comparedDate);
             


               //if ((eac.CreatedBy == "3" && span.Days > 0) || (eac.CreatedBy == "5" && span.Days > 90) )
               //return new CrudResult(false, "User do not have privilege to edit this account at this moment!");

               //validation for subsidy && principal amount
               var requiredTransactions =
                   GetByProperty<HRMTransaction>(
                       ht =>
                           ht.EmployeeAccountId == eac.Id.ToString() &&
                           (ht.TransactionTypeId == 2 ))
                           //|| ht.TransactionTypeId == 7 || ht.TransactionTypeId == 15))
                       .ToList();
            
            // if(eac.OutstandingAmount-eac.SubsidyAmount <(double) requiredTransactions.Sum(rt=>rt.Debit) + (double)requiredTransactions.Sum(rt => rt.Credit)) return  new CrudResult(false,"invalid principal amount!");
            //if ( (eac.PrincipalAmount + eac.ServiceCharge - ((double)requiredTransactions.Sum(rt => rt.Debit) + (double)requiredTransactions.Sum(rt => rt.Credit)))-eac.SubsidyAmount<
            //      ((double)requiredTransactions.Sum(rt => rt.Debit) + (double)requiredTransactions.Sum(rt => rt.Credit)) ) return new CrudResult(false,"invalid principal amount!");
            if(eac.PrincipalAmount>0)//for loan and punishment type accounts validation where principal amounts exists
               {
                if ((eac.PrincipalAmount + eac.ServiceCharge - eac.SubsidyAmount <
             ((double)requiredTransactions.Sum(rt => rt.Debit) + (double)requiredTransactions.Sum(rt => rt.Credit)))) return new CrudResult(false, "invalid principal amount!");
                if (eac.SubsidyAmount > eac.PrincipalAmount + eac.ServiceCharge - ((double)requiredTransactions.Sum(rt => rt.Debit) + (double)requiredTransactions.Sum(rt => rt.Credit)))
                    return new CrudResult(false, "invalid subsidy amount!");
                if (eac.Status == Common.Globals.EmployeeConfig.EmployeeAccountStatus.Inactive && eac.OutstandingAmount > 0 && eac.AccountTypeId == 16) return new CrudResult(false, "Balance is not Zero(0). Fund can not be closed with balance amount.");
                if (eac.Status == Common.Globals.EmployeeConfig.EmployeeAccountStatus.Inactive && eac.OutstandingAmount > 0) return new CrudResult(false, "Loan is not full-paid. Loan can not be closed with outstanding amount.");
            }
               var employee = GetByProperty<Model.DfEntities.Employee>(emp => emp.Id == eac.EmployeeId).FirstOrDefault();
               if (employee?.Status == 0 && eac.Status == 1)
               {
                   return new CrudResult(false,"Inactive employee can not have active employee account!");
               }
            
               if (eac.DisburseDate!=null && DateUtility.DateToInt((DateTime) eac.DisburseDate) < employee?.JoiningDate)
               {
                   return  new CrudResult(false,"Disburse date can not be less then employee current branch joining date!");
               }
            if (eac.OpeningDate != null && DateUtility.DateToInt((DateTime)eac.OpeningDate) < employee?.JoiningDate)
            {
                return new CrudResult(false, "Opening date can not be less then employee current branch joining date!");
            }

            var strAccountId = eac.Id.ToString();
               var alldeductiveTransactions =
                   GetByProperty<HRMTransaction>(
                       ht =>
                           ht.EmployeeAccountId == strAccountId &&
                           (ht.TransactionTypeId == 2 || ht.TransactionTypeId == 7 || ht.TransactionTypeId == 15))
                       .ToList();
       
            var editResult=    Edit(new EmployeeAccount
               {
                   Type = eac.Type,
                   AccountNumber = eac.AccountNumber,
                   AccountTypeId = eac.AccountTypeId,
                   AccountOpeningType = eac.AccountOpeningType,
                   BankAccount = eac.BankAccount,
                   ChequeAmount = eac.ChequeAmount,
                   CurrentOfficeCode = eac.CurrentOfficeCode,
                  // CurrentOfficeType = GetByProperty<Branch>(b => b.Code == eac.CurrentOfficeCode).FirstOrDefault().OfficeTypeId,
                   ChequeNo = eac.ChequeNo,
                   Cycle = eac.Cycle,
                   Duration = eac.Duration,
                   InstallmentAmount = eac.InstallmentAmount,
                   EmployeeId = eac.EmployeeId,
                   InstallmentFrequency = eac.InstallmentType,
                   ExemptionAdjust = eac.ExemptionAdjust,
                   Id = eac.Id,
                   LifeCycle = eac.LifeCycle,
                   OriginatingOfficeCode = eac.OriginatingOfficeCode,
                   //OriginatirngOfficeType = eac.OriginatirngOfficeType,
                   OutstandingAdjust = eac.OutstandingAdjust,
                   PrincipalAmount = eac.PrincipalAmount,
                   ReceiveAmount = eac.ReceiveAmount,
                   RepeatInPayroll = eac.RepeatInPayroll,
                   ServiceCharge = eac.ServiceCharge,
                   ServiceChargeRate = eac.ServiceChargeRate,
                   TotalInstallment = eac.TotalInstallment,
                   SubsidyAmount = eac.SubsidyAmount,
                   Status = eac.Status,
                  // CreatedBy = eac.CreatedBy,
                   UpdatedBy = eac.UpdatedBy,
                   CreatedOn = eac.CreatedOn,
                   UpdatedOn = DateTime.Now,
                   DisburseDate = (eac.DisburseDate != null ? DateUtility.DateToInt((DateTime)eac.DisburseDate) : (long?)null),
                   ClosingDate = (eac.ClosingDate != null ? DateUtility.DateToInt((DateTime)eac.ClosingDate) : (long?)null),
                   OpeningDate = (eac.OpeningDate != null ? DateUtility.DateToInt((DateTime)eac.OpeningDate) : (long?)null),
                   SalaryStructureId = eac.SalaryStructureId,
                   OutstandingAmount =eac.AccountOpeningType!=3?
                   (double)((decimal)(eac.PrincipalAmount+eac.ServiceCharge)-(alldeductiveTransactions.Sum(tr=>tr.Debit)+alldeductiveTransactions.Sum(tr=>tr.Credit))):
                   (double)((decimal)(eac.ReceiveAmount) - (alldeductiveTransactions.Sum(tr => tr.Debit) + alldeductiveTransactions.Sum(tr => tr.Credit)))


            });
               var accountType = GetByProperty<EmployeeAccountType>(eat => eat.Id == eac.AccountTypeId).FirstOrDefault();

               if (accountType?.Category == 1)
               {
                   var cashTrans = GetByProperty<HRMTransaction>(
                       ht =>
                           ht.EmployeeAccountId == eac.Id.ToString() && ht.TransactionTypeId == 8 &&
                           ht.TransactionProcess == 1).OrderByDescending(t => t.Id).FirstOrDefault();
                

                var transferTrans = GetByProperty<HRMTransaction>(
                       ht =>
                           ht.EmployeeAccountId == eac.Id.ToString() && ht.TransactionTypeId == 8 &&
                           ht.TransactionProcess == 3).OrderByDescending(t => t.Id).FirstOrDefault();


                
                //not going through all those troubles if there is no change in amount
               
                   var chequeTrans = (HRMTransaction)null;
                   if (cashTrans != null)
                       chequeTrans = GetByProperty<HRMTransaction>(
                           ht =>
                               ht.EmployeeAccountId == eac.Id.ToString() && ht.TransactionTypeId == 8 &&
                               ht.TransactionProcess == 2 && ht.TransactionDate == cashTrans.TransactionDate)
                           .OrderByDescending(t => t.Id)
                           .FirstOrDefault();

                   var existingServiceChargeTransaction =
                       GetByProperty<HRMTransaction>(
                           ht => ht.EmployeeAccountId == eac.Id.ToString() && ht.TransactionTypeId == 9)
                           .FirstOrDefault();
                //i guess this was an incomplete logic so i went for a mod 28-jan-2k19
                //if (cashTrans?.Debit == (decimal)eac.PrincipalAmount && chequeTrans?.Debit == (decimal)eac.PrincipalAmount && existingServiceChargeTransaction?.Debit == (decimal)eac.PrincipalAmount) return editResult;
                   if (cashTrans != null && cashTrans?.Debit + chequeTrans?.Debit == (decimal) eac.PrincipalAmount &&
                       existingServiceChargeTransaction?.Debit == (decimal) eac.ServiceCharge)
                   {//to update the cheque no of htr when updated from e account
                       if (chequeTrans != null && chequeTrans?.ChequeNo != eac.ChequeNo)
                       {
                           chequeTrans.ChequeNo = eac.ChequeNo;
                           //chequeTrans.Id = 0;
                           var ss=Edit(chequeTrans);
                       }
                       return editResult;
                   }
                //this is for tranferred account with just status changee
                if ( cashTrans==null && transferTrans?.Debit  == (decimal)eac.ReceiveAmount ) return editResult;
              

                if (cashTrans?.CreatedBranchWorkingDate == DateUtility.DateToInt((DateTime) eac.UpdatedOn))
                   {
                      var cashTransdeleteresult= DeleteByPorperty<HRMTransaction>(cs=>cs.Id==cashTrans.Id);
                       if (chequeTrans != null)
                       {
                           var chequeTransdeleteresult = DeleteByPorperty<HRMTransaction>(cs => cs.Id == chequeTrans.Id);
                       }
                       var  servicechargedeleteresult = DeleteByPorperty<HRMTransaction>(cs => cs.Id == existingServiceChargeTransaction.Id);
                }
                   else
                   {
                       cashTrans.Id = 0;
                       cashTrans.Debit = cashTrans.Debit*-1;
                       cashTrans.ReferenceTransactionid = cashTrans.TransactionId;
                       cashTrans.IsReversed = true;
                       cashTrans.TransactionId =
                           IdHelper.GenerateTransactionId(cashTrans.EmployeeAccountId, 8,
                               false, true);
                       cashTrans.TransactionDate = DateUtility.DateToInt((DateTime)eac.DisburseDate);
                       cashTrans.CreatedBranchWorkingDate = DateUtility.DateToInt((DateTime) eac.UpdatedOn);
                       Add(cashTrans);
                       existingServiceChargeTransaction.Id = 0;
                       existingServiceChargeTransaction.Debit = existingServiceChargeTransaction.Debit*-1;
                       existingServiceChargeTransaction.ReferenceTransactionid =
                           existingServiceChargeTransaction.TransactionId;
                       existingServiceChargeTransaction.IsReversed = true;
                       existingServiceChargeTransaction.TransactionId =
                           IdHelper.GenerateTransactionId(existingServiceChargeTransaction.EmployeeAccountId, 8,
                               false, true);
                   // existingServiceChargeTransaction.TransactionDate= DateUtility.DateToInt((DateTime)eac.UpdatedOn);
                    existingServiceChargeTransaction.TransactionDate= DateUtility.DateToInt((DateTime)eac.DisburseDate);
                    existingServiceChargeTransaction.CreatedBranchWorkingDate= DateUtility.DateToInt((DateTime)eac.UpdatedOn);
                    Add(existingServiceChargeTransaction);
                       if (chequeTrans != null)
                       {
                           chequeTrans.Id = 0;
                           chequeTrans.Debit = chequeTrans.Debit*-1;
                           chequeTrans.ReferenceTransactionid = chequeTrans.TransactionDate;
                           chequeTrans.IsReversed = true;
                           chequeTrans.TransactionId = IdHelper.GenerateTransactionId(chequeTrans.EmployeeAccountId, 8,
                               false, true);
                        chequeTrans.TransactionDate= DateUtility.DateToInt((DateTime)eac.DisburseDate);
                        chequeTrans.CreatedBranchWorkingDate= DateUtility.DateToInt((DateTime)eac.UpdatedOn);
                        Add(chequeTrans);
                       }
                   }

                   if (eac.ChequeAmount == null || eac.ChequeAmount <= 0)
                   {
                    var transactionAddResult = Add(new HRMTransaction
                    {
                        TransactionId = IdHelper.GenerateTransactionId((eac.Id).ToString(), 8, false, true),
                        EmployeeId = eac.EmployeeId,
                        //Grade = GetByProperty<EmployeeGrade>(eg => eg.EmployeeId == eac.EmployeeId).LastOrDefault().GradeId,
                        //Designation = GetByProperty<EmployeeDesignation>(eg => eg.EmployeeId == eac.EmployeeId).LastOrDefault().DesignationId,
                        //OfficeType = eac.CurrentOfficeType,
                        OfficeCode = eac.CurrentOfficeCode,
                        EmployeeAccountId = eac.Id.ToString(),
                        EmployeeAccountTypeId = eac.AccountTypeId,
                       // EmployeeAccountName = "",
                        Debit = (decimal?)eac.PrincipalAmount,
                        Credit = 0,
                        TransactionTypeId = 8,
                       // TransactionTypeName = "",
                        TransactionProcess = 1,
                        TransactionDate = DateUtility.DateToInt((DateTime)eac.DisburseDate),
                        SalaryYear = null,
                        SalaryMonth = null,
                        ChequeNo = null,
                        BankAccount = eac.BankAccount,
                        EmployerBankAccount = null,
                        IsAutoTransaction = false,
                        Location = 1,
                        TransactionCreatedFrom = 66,
                        CreatedBy = Int32.Parse(eac.CreatedBy),
                        ModifiedBy = Int32.Parse(eac.CreatedBy),
                        CreatedBranchWorkingDate = DateUtility.DateToInt((DateTime)eac.UpdatedOn),
                        CreatedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ModifiedBranchWorkingDate = DateUtility.DateToInt((DateTime)eac.CreatedOn),
                        ModifiedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ReferenceTransactionid = null,
                        IsReversed = true,//according to process journal rule
                        ReversalDate = null,
                        ReverseBranchWorkingDate = null,
                        ReferenceAccountId = null,
                        ReferenceOfficeCode = null

                    });
                }
                   else
                   {
                    var chequetransactionAddResult = Add(new HRMTransaction
                    {
                        TransactionId = IdHelper.GenerateTransactionId(eac.Id.ToString(), 8, false, true),
                        EmployeeId = eac.EmployeeId,
                        //Grade = GetByProperty<EmployeeGrade>(eg => eg.EmployeeId == eac.EmployeeId).LastOrDefault().GradeId,
                       // Designation = GetByProperty<EmployeeDesignation>(eg => eg.EmployeeId == eac.EmployeeId).LastOrDefault().DesignationId,
                       // OfficeType = eac.CurrentOfficeType,
                        OfficeCode = eac.CurrentOfficeCode,
                        EmployeeAccountId = eac.Id.ToString(),
                        EmployeeAccountTypeId = eac.AccountTypeId,
                      //  EmployeeAccountName = "",
                        Debit = (decimal)eac.ChequeAmount,
                        Credit = 0,
                        TransactionTypeId = 8,
                      //  TransactionTypeName = "",
                        TransactionProcess = 2,
                        TransactionDate = DateUtility.DateToInt((DateTime)eac.DisburseDate),
                        SalaryYear = null,
                        SalaryMonth = null,
                        ChequeNo = eac.ChequeNo,
                        BankAccount = eac.BankAccount,
                        EmployerBankAccount = null,
                        IsAutoTransaction = false,
                        Location = 1,
                        TransactionCreatedFrom = 66,
                        CreatedBy = Int32.Parse(eac.CreatedBy),
                        ModifiedBy = Int32.Parse(eac.CreatedBy),
                        CreatedBranchWorkingDate = DateUtility.DateToInt((DateTime)eac.UpdatedOn),
                        CreatedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ModifiedBranchWorkingDate = DateUtility.DateToInt((DateTime)eac.CreatedOn),
                        ModifiedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ReferenceTransactionid = null,
                        IsReversed = true,//according to process journal rule
                        ReversalDate = null,
                        ReverseBranchWorkingDate = null,
                        ReferenceAccountId = null,
                        ReferenceOfficeCode = null

                    });
                   
                    var cashTransactionAddResult = Add(new HRMTransaction
                    {
                        TransactionId = IdHelper.GenerateTransactionId(eac.Id.ToString(), 8, false, true),
                        EmployeeId = eac.EmployeeId,
                        //Grade = GetByProperty<EmployeeGrade>(eg => eg.EmployeeId == eac.EmployeeId).LastOrDefault().GradeId,
                       // Designation = GetByProperty<EmployeeDesignation>(eg => eg.EmployeeId == eac.EmployeeId).LastOrDefault().DesignationId,
                       // OfficeType = eac.CurrentOfficeType,
                        OfficeCode = eac.CurrentOfficeCode,
                        EmployeeAccountId = (eac.Id).ToString(),
                        EmployeeAccountTypeId = eac.AccountTypeId,
                        //EmployeeAccountName = "",
                        Debit = (decimal?)(eac.PrincipalAmount - eac.ChequeAmount),
                        Credit = 0,
                        TransactionTypeId = 8,
                       // TransactionTypeName = "",
                        TransactionProcess = 1,
                        TransactionDate = DateUtility.DateToInt((DateTime)eac.DisburseDate),
                        SalaryYear = null,
                        SalaryMonth = null,
                        ChequeNo = null,
                        BankAccount = eac.BankAccount,
                        EmployerBankAccount = null,
                        IsAutoTransaction = false,
                        Location = 1,
                        TransactionCreatedFrom = 66,
                        CreatedBy = Int32.Parse(eac.CreatedBy),
                        ModifiedBy = Int32.Parse(eac.CreatedBy),
                        CreatedBranchWorkingDate = DateUtility.DateToInt((DateTime)eac.UpdatedOn),
                        CreatedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ModifiedBranchWorkingDate = DateUtility.DateToInt((DateTime)eac.CreatedOn),
                        ModifiedSystemDate = DateUtility.DateToInt(DateTime.Now),
                        ReferenceTransactionid = null,
                        IsReversed = true,//according to process journal rule
                        ReversalDate = null,
                        ReverseBranchWorkingDate = null,
                        ReferenceAccountId = null,
                        ReferenceOfficeCode = null

                    });
                }

                var interestTransactionAddResult = Add(new HRMTransaction
                {
                    TransactionId = IdHelper.GenerateTransactionId(eac.Id.ToString(), 9, false, true),
                    EmployeeId = eac.EmployeeId,
                   // Grade = GetByProperty<EmployeeGrade>(eg => eg.EmployeeId == eac.EmployeeId).LastOrDefault().GradeId,
                   // Designation = GetByProperty<EmployeeDesignation>(eg => eg.EmployeeId == eac.EmployeeId).LastOrDefault().DesignationId,
                   // OfficeType = eac.CurrentOfficeType,
                    OfficeCode = eac.CurrentOfficeCode,
                    EmployeeAccountId = (eac.Id).ToString(),
                    EmployeeAccountTypeId = eac.AccountTypeId,
                   // EmployeeAccountName = "",
                    Debit = (decimal?)eac.ServiceCharge,
                    Credit = 0,
                    TransactionTypeId = 9,
                  //  TransactionTypeName = "",
                    TransactionProcess = 1,
                    TransactionDate = DateUtility.DateToInt((DateTime)eac.DisburseDate),
                    SalaryYear = null,
                    SalaryMonth = null,
                    ChequeNo = null,
                    BankAccount = eac.BankAccount,
                    EmployerBankAccount = null,
                    IsAutoTransaction = false,
                    Location = 1,
                    TransactionCreatedFrom = 66,
                    CreatedBy = Int32.Parse(eac.CreatedBy),
                    ModifiedBy = Int32.Parse(eac.CreatedBy),
                    CreatedBranchWorkingDate = DateUtility.DateToInt((DateTime)eac.UpdatedOn),
                    CreatedSystemDate = DateUtility.DateToInt(DateTime.Now),
                    ModifiedBranchWorkingDate = DateUtility.DateToInt((DateTime)eac.CreatedOn),
                    ModifiedSystemDate = DateUtility.DateToInt(DateTime.Now),
                    ReferenceTransactionid = null,
                    IsReversed = true,//according to process journal rule
                    ReversalDate = null,
                    ReverseBranchWorkingDate = null,
                    ReferenceAccountId = null,
                    ReferenceOfficeCode = null
                });


            }
              

               return editResult;
           }

       public int? GetEmployeeIdFromEmployeeId(int employeeId)
       {
          return GetByProperty<Model.DfEntities.Employee>(e => e.EmployeeId == employeeId).FirstOrDefault()?.Id;
       }



        public List<AmmsIntFilter> GetEmployeeBankAccounts(int employeeId,int fromEdit)
        {
            if (fromEdit != -1)
            {
                var employeebranchid =
                    GetByProperty<EmployeeBranch>(eb => eb.EmployeeId == employeeId && eb.EndDate == null)
                        .FirstOrDefault()?.BranchId;
                return GetByProperty<BankAccount>(eba => eba.BranchId == employeebranchid && eba.Status == Common.Globals.EmployeeConfig.EmployeeBankAccountStatus.Active)
                    .Select(eb => new AmmsIntFilter
                    {
                        Value = eb.Id,
                        //EmployeeId=eb.,
                        Name = eb.AccountNo,

                    }).ToList();
            }
            return
                GetByProperty<BankAccount>(eba => eba.BranchId == employeeId && eba.Status== Common.Globals.EmployeeConfig.EmployeeBankAccountStatus.Active)
                    .Select(eb => new AmmsIntFilter
                    {
                        Value= eb.Id,
                        //EmployeeId=eb.,
                        Name = eb.AccountNo,
                        
                    }).ToList();
        }

       public int GetSelectedOfficeTypeIdByBranchId(int branchId)
       {
           return GetByProperty<Branch>(br => br.Id == branchId).FirstOrDefault().OfficeTypeId;
       }

       public AmmsTable GetAccountListExport(AmmsEmployeeAccountSearchparams filterparams)
       {
           var results = GetAccountList(-1000,filterparams.EmployeeId, filterparams.AccountTypeId, filterparams.StatusId);
              
            var resultList = results.Select(r => new AmmsEmployeeAccountExport
            {
                Name = r.EmployeeName,
                AccountType = r.AccountTypeName,
                DisburseAmount = r.PrincipalAmount,
                ReceivedAmount = r.ReceiveAmount,
                OutstandingAmount = r.OutstandingAmount,
                DisburseDate = r.DisburseDate,
                OpeningDate = r.OpeningDate,
                ReceiveDate = r.ReceiveDate,
                ClosingDate = r.ClosingDate,
                Status = r.Status == 1 ? "Active" : "Inactive",
            }).ToList();

            return CommonHelper.ToTable<AmmsEmployeeAccountExport>(resultList);
        }
    }
}
