ammsAng.controller('dailyTransactionController', [
   '$scope', '$rootScope', '$timeout', 'commonService', 'filterService', 'memberDailyTransactionService', 'workingDayService',
   function ($scope, $rootScope, $timeout, commonService, filterService, memberDailyTransactionService, workingDayService) {
       $scope.commandList = [];
       $scope.memberId = $scope.selectedMenu.Id;

       $scope.roleId = $rootScope.user.Role;
       $scope.employeeId = $scope.officer[0].EmployeeId;
       $scope.branchId = $scope.selectedBranchId;

       $scope.previousTransaction = {};
       $scope.currentTransaction = {};
       $scope.savedTransactionDate = null;

       $scope.postDailyTransaction = [];

       $scope.bankAccounts = [];
       $scope.branchHolidayAndOffDay = [];
       $scope.transactionProcessList = [];

       $scope.loanProgram = [];
       $scope.savingsSecurityProgram = [];

       $scope.singleTransactionLoan = [];

       $scope.transactionTypes = {};
       $scope.hasNominee = true;

       $scope.minDepostBalanceOfDay = [];
       $scope.DisbursedPrincipal = null;

       $scope.todaySavingsDepositableAmounts = [];
       $scope.transactionProcess = null;

       $scope.isCommited = false;
       $scope.maxDate = null;
       $scope.minDate = null;
       $scope.selectedDate = null;
       $scope.btnSave = true;
       $scope.popup = {
           opened: false
       };
       $scope.open = function () {
           $scope.popup.opened = true;
       };
       $scope.dateOptions = {
           //dateDisabled: disabled,
           formatYear: 'yyyy',
           maxDate: $rootScope.workingdate,
           startingDay: 1
       };

       $scope.getTransactionProcess = function () {
           filterService.getTransactionProcess('DailyTransactionProcess').then(function (response) {
               $scope.transactionProcessList = response.data;
               console.log($scope.transactionProcessList);
               $scope.transactionProcess = $scope.transactionProcessList[0].Value;
               $scope.currentTransaction.Process = $scope.transactionProcess;
               $scope.currentTransaction.TransactionDate = $rootScope.workingdate;
               $scope.getMemberDailyTransaction(moment($rootScope.workingdate).format('YYYY-MM-DD'));
           });

       }

       $scope.calculateGrandTotal = function () {
           $scope.currentTransaction.NetTotal = 0;
           if ($scope.currentTransaction.LoanTransactions !== null) {
               $scope.currentTransaction.LoanTransactions.forEach(function (loanTransactions) {
                   loanTransactions.SingleLoanTransactions.forEach(function (singleTransaction) {
                       if (Number(singleTransaction.TransactionTypeId) === Number($scope.singleTransactionType.LoanExemption)) {
                           $scope.currentTransaction.NetTotal -= singleTransaction.Amount;
                       } else {
                           $scope.currentTransaction.NetTotal += singleTransaction.Amount;
                       }
                   });
               });
           }
           if ($scope.currentTransaction.SavingsTransactions !== null) {
               $scope.currentTransaction.SavingsTransactions.forEach(function (loanTransactions) {
                   loanTransactions.SingleSavingsTransaction.forEach(function (singleTransaction) {
                       if (Number(singleTransaction.TransactionTypeId) === Number($scope.singleTransactionType.SavingsWithdraw)
                           || Number(singleTransaction.TransactionTypeId) === Number($scope.singleTransactionType.CBSWithDraw)) {
                           $scope.currentTransaction.NetTotal -= singleTransaction.Amount;
                       } else {
                           if (Number(singleTransaction.TransactionTypeId) === Number($scope.singleTransactionType.SavingsInterest))
                               $scope.currentTransaction.NetTotal = $scope.currentTransaction.NetTotal;
                           else if (Number(singleTransaction.TransactionTypeId) === Number($scope.singleTransactionType.CBSInterest))
                               $scope.currentTransaction.NetTotal = $scope.currentTransaction.NetTotal;
                           else if (Number(singleTransaction.TransactionTypeId) === Number($scope.singleTransactionType.LTSInterest))
                               $scope.currentTransaction.NetTotal = $scope.currentTransaction.NetTotal;
                           else
                               $scope.currentTransaction.NetTotal += singleTransaction.Amount;
                       }
                   });
               });
           }
           $scope.currentTransaction.NetTotal = Math.round($scope.currentTransaction.NetTotal);
       }

       $scope.getMemberDailyTransaction = function (transactionDate) {
           $("#loadingImage").css("display", "block");
           //$scope.previousTransaction = {};
           //$scope.currentTransaction = {};
           $scope.transactionProcess = $scope.currentTransaction.Process;
           $scope.savedTransactionDate =$scope.currentTransaction.TransactionDate;
           memberDailyTransactionService.getMemberDailyTransaction($scope.memberId, moment(transactionDate).format("YYYY-MM-DD")).then(function (response) {
               $scope.previousTransaction = angular.copy(response.data);
               $scope.previousTransaction.BranchId = $scope.branchId;
               $scope.previousTransaction.BrnachWorkingDate = moment($rootScope.workingdate).format('YYYY-MM-DD');
               console.log($scope.previousTransaction);
               $scope.currentTransaction = angular.copy(response.data);
               $scope.currentTransaction.BranchId = $scope.branchId;
               $scope.currentTransaction.BrnachWorkingDate = moment($rootScope.workingdate).format('YYYY-MM-DD');
               $scope.currentTransaction.TransactionDate =$scope.savedTransactionDate;
               $("#loadingImage").css("display", "none");
               var i;
               if ($scope.currentTransaction.SavingsTransactions !== null) {
                   for (i = 0; i < $scope.currentTransaction.SavingsTransactions.length; i++) {
                       if ($scope.currentTransaction.SavingsTransactions[i].HasNominee === false) {
                           $scope.hasNominee = false;
                           break;
                       }
                   }
               }
               $scope.minDepostBalanceOfDay = [];
               $scope.todaySavingsDepositableAmounts = [];
               if ($scope.currentTransaction.SavingsTransactions !== null) {
                   $scope.currentTransaction.SavingsTransactions.forEach(function (st) {
                       st.SingleSavingsTransaction.forEach(function (singleSaving, index) {
                           if (index === 0) {
                               $scope.minDepostBalanceOfDay.push(singleSaving.Amount);
                           }
                           if (singleSaving.TransactionTypeId === $rootScope.singleTransactionType.CBSDeposit || singleSaving.TransactionTypeId === $rootScope.singleTransactionType.SavingsDeposit) {
                               $scope.todaySavingsDepositableAmounts.push((singleSaving.Amount));
                           }
                       });

                   });

               }
               if ($scope.currentTransaction.LoanTransactions !== null) {
                   for (i = 0; i < $scope.currentTransaction.LoanTransactions.length; i++) {
                       $scope.currentTransaction.LoanTransactions[i].OutstandingAmount = Math.round($scope.currentTransaction.LoanTransactions[i].OutstandingAmount);
                       if ($scope.currentTransaction.LoanTransactions[i].DisbursedPrincipalAmount) {
                           $scope.DisbursedPrincipal = $scope.currentTransaction.LoanTransactions[i].DisbursedPrincipalAmount;
                           break;
                       }
                   }
               }
               if ($scope.currentTransaction.LoanTransactions !== null) {
                   for (i = 0; i < $scope.currentTransaction.LoanTransactions.length; i++) {
                       $scope.currentTransaction.LoanTransactions[i].OutstandingAmount = Math.round($scope.currentTransaction.LoanTransactions[i].OutstandingAmount);
                       $scope.currentTransaction.LoanTransactions[i].ExemptableAmount = Math.round($scope.currentTransaction.LoanTransactions[i].ExemptableAmount);
                       $scope.currentTransaction.LoanTransactions[i].Overdue = Math.round($scope.currentTransaction.LoanTransactions[i].Overdue);
                       $scope.currentTransaction.LoanTransactions[i].OutstandingAmountTillSelectedDate = Math.round($scope.currentTransaction.LoanTransactions[i].OutstandingAmountTillSelectedDate);
                       //if ($scope.previousTransaction.LoanTransactions[i].IsScheduleDate && $scope.previousTransaction.LoanTransactions[i].IsLoanCollectedToday) {
                       //    if ($scope.previousTransaction.LoanTransactions[i].Overdue > 0) {
                       //        $scope.currentTransaction.LoanTransactions[i].Overdue = $scope.currentTransaction.LoanTransactions[i].Overdue + $scope.currentTransaction.LoanTransactions[i].Realisable;
                       //        $scope.previousTransaction.LoanTransactions[i].Overdue = $scope.currentTransaction.LoanTransactions[i].Overdue + $scope.currentTransaction.LoanTransactions[i].Realisable;
                       //    }
                       //    $scope.currentTransaction.LoanTransactions[i].OutstandingAmount = $scope.currentTransaction.LoanTransactions[i].OutstandingAmount + $scope.currentTransaction.LoanTransactions[i].Realisable;
                       //    $scope.previousTransaction.LoanTransactions[i].OutstandingAmount = $scope.currentTransaction.LoanTransactions[i].OutstandingAmount + $scope.currentTransaction.LoanTransactions[i].Realisable;
                       //}
                   }
               }
               $scope.isCommited = false;
               if ($scope.currentTransaction.LoanTransactions !== null) {
                   for (i = 0; i < $scope.currentTransaction.LoanTransactions.length; i++) {
                       for (var j = 0; j < $scope.currentTransaction.LoanTransactions[i].SingleLoanTransactions.length; j++) {
                           if (Number($scope.currentTransaction.LoanTransactions[i].SingleLoanTransactions[j].TransactionId) !== -1) {
                               $scope.isCommited = true;
                               break;
                           }

                       }
                   }
               }
               if ($scope.currentTransaction.SavingsTransactions !== null) {
                   for (i = 0; i < $scope.currentTransaction.SavingsTransactions.length; i++) {
                       if ($scope.currentTransaction.SavingsTransactions[i].isLTSAmountPaidCurrentMonth && $scope.currentTransaction.SavingsTransactions[i].ProductType == $rootScope.SavingsConfig.SavingsProductType.LTS) {
                           var depositAmount = $scope.currentTransaction.SavingsTransactions[i].SingleSavingsTransaction.find(x => x.TransactionTypeId === $rootScope.singleTransactionType.SavingsDeposit);
                           if (depositAmount) {
                               depositAmount.Amount = 0;
                               break;
                           }
                       }
                   }
               }
               if ($scope.currentTransaction.SavingsTransactions !== null) {
                   $scope.currentTransaction.SavingsTransactions.forEach(function (savingTransaction) {
                       savingTransaction.errorMessage = "";
                       savingTransaction.warningMessage = "";
                       savingTransaction.rowStyleS =savingTransaction.SavingsAccountStatus!=$rootScope.SavingsConfig.SavingsAccountStatus.Active? { "color": "red"}:{};
                       savingTransaction.SingleSavingsTransaction.forEach(function (singleSavingsTransaction) {
                           singleSavingsTransaction.errorMessage = '';
                           singleSavingsTransaction.warningMessage = '';
                           if (singleSavingsTransaction.TransactionId != -1) {
                               if (singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.SavingsDeposit || singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.LTSDeposit
                                   || singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.CBSDeposit)
                                   savingTransaction.cellStyleDeposit = { "background-color": "#63d363" };
                               else if(singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.SavingsWithdraw || singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.CBSWithDraw)
                                   savingTransaction.cellStyleWithdraw = { "background-color": "#63d363" };
                               else if(singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.SavingLateFee || singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.LTSLateFee
                                   || singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.CBSLateFee)
                                   savingTransaction.cellStyleLateFee = { "background-color": "#63d363" };
                               else if(singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.SavingPeriodicFee || singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.LTSPeriodicFee
                                   || singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.CBSPeriodicFee)
                                   savingTransaction.cellStylePeriodicFee = { "background-color": "#63d363" };
                               else if(singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.SavingsInterest || singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.LTSInterest
                                   || singleSavingsTransaction.TransactionTypeId == $rootScope.singleTransactionType.CBSInterest)
                                   savingTransaction.cellStyleInterest = { "background-color": "#63d363" };
                           }
                       });
                   });
               }
               if ($scope.currentTransaction.LoanTransactions !== null) {
                   $scope.currentTransaction.LoanTransactions.forEach(function (loanTransaction) {
                       loanTransaction.errorMessage = "";
                       loanTransaction.warningMessage = "";
                       loanTransaction.rowStyleL = loanTransaction.LoanAccountStatus != $rootScope.LoanConfig.LoanAccountStatus.Active ? { "color": "red" } : {};
                       loanTransaction.SingleLoanTransactions.forEach(function (singleLoanTransaction) {
                           singleLoanTransaction.errorMessage = '';
                           singleLoanTransaction.warningMessage = '';
                           if (singleLoanTransaction.TransactionId != -1) {
                               if (singleLoanTransaction.TransactionTypeId == $rootScope.singleTransactionType.LoanCollection) {
                                   loanTransaction.cellStyleLoanCollection = { "background-color": "#63d363" };
                               }
                               else if (singleLoanTransaction.TransactionTypeId == $rootScope.singleTransactionType.LoanLateFee) {
                                   loanTransaction.cellStyleLateFee = { "background-color": "#63d363" };
                               } else if (singleLoanTransaction.TransactionTypeId == $rootScope.singleTransactionType.LoanExemption) {
                                   loanTransaction.cellStyleExemption = { "background-color": "#63d363" };
                               }

                           }
                       });
                   });
               }


               $scope.currentTransaction.Process = $scope.currentTransaction.BankAccount == "" ? $scope.transactionProcess : $rootScope.TransactionProcess.Cheque.toString();
               $scope.currentTransaction.BankAccount = $scope.currentTransaction.BankAccount == "" ? "" : $scope.currentTransaction.BankAccount;

               $scope.disableChequeNo = $scope.currentTransaction.ChequeNo == "" ? false : true;

               //$scope.currentTransaction.TransactionDate = $scope.savedTransactionDate;

               $scope.warningMessageLoan = "";
               $scope.errorMessageLoan = "";

               $scope.warningMessageSavings = "";
               $scope.errorMessageSavings = "";
               console.log($scope.currentTransaction);
               $scope.currentTransaction.PassBook = null;
               $scope.calculateGrandTotal();
               $scope.calculateTodaysCollection();
               $scope.IsAbleToSaveTransaction();
               $scope.btnSave = true;

           });
       }

       $scope.calculateTodaysCollection = function () {
           $scope.currentTransaction.TodayCollection = 0;
           if ($scope.previousTransaction.LoanTransactions) {
               $scope.previousTransaction.LoanTransactions.forEach(function(lt) {
                   lt.SingleLoanTransactions.forEach(function(slt) {
                       if (slt.TransactionId != -1)
                           $scope.currentTransaction.TodayCollection += slt.Amount;
                   });
               });
           }
           if ($scope.previousTransaction.SavingsTransactions) {
               $scope.previousTransaction.SavingsTransactions
                   .forEach(function(st) {
                       st.SingleSavingsTransaction
                           .forEach(function(sst) {
                               if (sst.TransactionId != -1) {
                                   if (sst.TransactionTypeId == $rootScope.singleTransactionType.SavingsWithdraw || sst.TransactionTypeId == $rootScope.singleTransactionType.CBSWithDraw)
                                       $scope.currentTransaction.TodayCollection -= sst.Amount;
                                   else
                                       $scope.currentTransaction.TodayCollection += sst.Amount;
                               }
                           });
                   });
           }
           $scope.currentTransaction.TodayCollection = Math.round($scope.currentTransaction.TodayCollection);
       }
       $scope.getSingleTransaction = function (singleTransaction, typeId) {
           var st = singleTransaction.find(t => t.TransactionTypeId === typeId);
           st.Amount = typeId == $rootScope.singleTransactionType.SavingsInterest ? 0 : Math.round(st.Amount);
           return st;
       }
       $scope.transactionProcessChange = function () {
           if ($scope.currentTransaction.Process == $rootScope.TransactionProcess.Cash) {
               $scope.currentTransaction.BankAccount = "";
               $scope.currentTransaction.ChequeNo = "";
               $scope.currentTransaction.IsAccountPayable = false;
           }
       }
       $scope.IsAbleToSaveTransaction = function () {
           $scope.maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
           $scope.minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");

           if ($scope.roleId == $rootScope.rootLevel.RM) {
               $scope.minDate = moment($rootScope.workingdate).add(-1, 'months');
           }
           else if ($scope.roleId == $rootScope.rootLevel.DM) {
               $scope.minDate = moment($rootScope.workingdate).add(-3, 'months');
           } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
               $scope.minDate = moment($rootScope.workingdate).add(-50, 'years');
           } else {
               $scope.minDate = moment($rootScope.workingdate).add(-50, 'years');
               $scope.maxDate = moment($rootScope.workingdate).add(-50, 'years');
           }
           if ($scope.roleId == $rootScope.rootLevel.LO) {
               $scope.maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
               $scope.minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
           }
           if ($scope.roleId == $rootScope.rootLevel.ABM) {
               $scope.maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
               $scope.minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
           }

           $scope.maxDate = moment($scope.maxDate).format("YYYY-MM-DD");
           $scope.minDate = moment($scope.minDate).format("YYYY-MM-DD");
           $scope.selectedDate = moment($scope.currentTransaction.TransactionDate).format("YYYY-MM-DD");
       }
       $scope.isHolidayOrOffDay = function (date) {
           $scope.btnSave = false;
           $scope.selectedDatet = moment(date).format("YYYY-MM-DD");
           var isNotHoliday = true;
           for (var i = 0; i < $scope.branchHolidayAndOffDay.length; i++) {
               if (moment($scope.branchHolidayAndOffDay[i]).format('YYYY-MM-DD') === $scope.selectedDatet) {
                   swal('Selected date is holiday or Offday');
                   $scope.currentTransaction.TransactionDate = $rootScope.workingdate;
                   isNotHoliday = false;
                   break;
               }
           }
           if (isNotHoliday)
               $scope.getMemberDailyTransaction($scope.selectedDatet);
           else {
               $scope.getMemberDailyTransaction($scope.currentTransaction.TransactionDate);
           }

       }
       $scope.getBankAccount = function (branchId) {
           filterService.GetActiveBankAccountListByBranch(branchId).then(function (response) {
               $scope.bankAccounts = response.data;
               console.log($scope.bankAccounts);
           });
       }
       $scope.getHolidays = function (branchId) {
           memberDailyTransactionService.getBranchOffDayAndHolidays(branchId).then(function (response) {
               $scope.branchHolidayAndOffDay = response.data;
           });
       }

       $scope.singleTransactionLoan = function (index, loanTransaction) {
           if (loanTransaction.TransactionTypeId === $rootScope.singleTransactionType.LoanCollection) {
               $scope.collectInstallment(index, loanTransaction);
           } else if (loanTransaction.TransactionTypeId === $rootScope.singleTransactionType.LoanLateFee) {
               $scope.collectLateFee(index, loanTransaction);
           } else if (loanTransaction.TransactionTypeId === $rootScope.singleTransactionType.LoanExemption) {
               $scope.collectExemption(index, loanTransaction);
           }
       }
       $scope.collectInstallment = function (index, loanTransaction) {
           if (!$scope.previousTransaction.LoanTransactions[index].IsScheduleDate) {
               $scope.nonScheduleDateCollection(index, loanTransaction);
               return;
           }
           if ($scope.previousTransaction.LoanTransactions[index].IsScheduleDate) {
               $scope.scheduleDateCollection(index, loanTransaction);
               return;
           }
       }
       $scope.nonScheduleDateCollection = function (index, loanTransaction) {
           loanTransaction.errorMessage = "";
           loanTransaction.warningMessage = "";
           var installmentFrequency = 2;
           var installmentAmount = Math.round($scope.previousTransaction.LoanTransactions[index].InstallmentAmount);
           var originalOverdueAmount = $scope.previousTransaction.LoanTransactions[index].IsLoanCollectedToday ? Math.round($scope.currentTransaction.LoanTransactions[index].Realisable + $scope.previousTransaction.LoanTransactions[index].Overdue) : Math.round($scope.previousTransaction.LoanTransactions[index].Overdue);
           var oneAdvanceAmount = Math.round(installmentAmount + originalOverdueAmount);
           
           var outstandingAmount = $scope.previousTransaction.LoanTransactions[index].IsLoanCollectedToday ? Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount
               + $scope.currentTransaction.LoanTransactions[index].Realisable) : Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount);
           var installmentLeft = $scope.currentTransaction.LoanTransactions[index].TotalInstallmentToPay - $scope.currentTransaction.LoanTransactions[index].TotalInstallmentCollected;
           oneAdvanceAmount = oneAdvanceAmount > outstandingAmount ? outstandingAmount : oneAdvanceAmount;
           if (Number($scope.roleId) !== $rootScope.rootLevel.Admin) {
               if (loanTransaction.Amount > 0) {
                   if (loanTransaction.Amount == outstandingAmount) {
                       loanTransaction.warningMessage = installmentLeft > 1 ? "Advance Full Paid {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}" : "Full Paid {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}";
                       loanTransaction.errorMessage = "";
                       $scope.currentTransaction.LoanTransactions[index].ExemptableAmount = $scope.currentTransaction.LoanTransactions[index].Exemption == 0 ? Math.round($scope.previousTransaction.LoanTransactions[index].ExemptableAmount) : $scope.currentTransaction.LoanTransactions[index].Exemption;
                       $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = 0;
                       $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = $scope.currentTransaction.LoanTransactions[index].ExemptableAmount;
                       $scope.greenColor(index);
                       return;
                   } else {
                       loanTransaction.errorMessage = "";
                       loanTransaction.warningMessage = "";
                       $scope.blackColor(index);
                       $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount);
                       $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = 0;
                   } if (loanTransaction.Amount > outstandingAmount) {
                       loanTransaction.errorMessage = "Amount is greater than outstanding amount {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}";
                       loanTransaction.warningMessage = "";
                       $scope.redColor(index);
                       return;
                   } else if (loanTransaction.Amount == oneAdvanceAmount) {
                       loanTransaction.warningMessage = loanTransaction.Amount > originalOverdueAmount ? "Advance " + (installmentFrequency - 1) + " Installment received {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}" : "";
                       $scope.greenColor(index);
                       return;
                   } else if (loanTransaction.Amount < outstandingAmount && loanTransaction.Amount > oneAdvanceAmount) {
                       loanTransaction.errorMessage = "Sorry! Transaction can not be saved. Amount Typed in 'Realizable' column of loan program: " + $scope.currentTransaction.LoanTransactions[index].ProductName
                           + " exceeds 1 advance installment allowed {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}";
                       $scope.redColor(index);
                       return;
                   } else if (loanTransaction.Amount < oneAdvanceAmount && loanTransaction.Amount > installmentAmount) {
                       loanTransaction.warningMessage = loanTransaction.Amount > originalOverdueAmount ? "Advance received (" + (loanTransaction.Amount - originalOverdueAmount) + ") {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}" : "";
                       $scope.greenColor(index);
                       return;
                   } else if (loanTransaction.Amount <= (installmentAmount + originalOverdueAmount)) {
                       loanTransaction.warningMessage = originalOverdueAmount < loanTransaction.Amount ? "Advance received (" + loanTransaction.Amount + ") {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}" : "";
                       $scope.blackColor(index);
                       return;
                   }
               } else {
                   loanTransaction.errorMessage = "";
                   loanTransaction.warningMessage = "";
                   $scope.blackColor(index);
                   $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount);
                   $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = 0;
                   return;
               }
           } else {
               if (loanTransaction.Amount > 0) {
                   if (loanTransaction.Amount == outstandingAmount) {
                       loanTransaction.warningMessage = installmentLeft > 1 ? "Advance Full Paid {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}" : "Full Paid {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}";
                       loanTransaction.errorMessage = "";
                       $scope.currentTransaction.LoanTransactions[index].ExemptableAmount = $scope.currentTransaction.LoanTransactions[index].Exemption == 0 ? Math.round($scope.previousTransaction.LoanTransactions[index].ExemptableAmount) : $scope.currentTransaction.LoanTransactions[index].Exemption;
                       $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = 0;
                       $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = $scope.currentTransaction.LoanTransactions[index].ExemptableAmount;
                       $scope.greenColor(index);
                       return;
                   } else {
                       loanTransaction.errorMessage = "";
                       loanTransaction.warningMessage = "";
                       $scope.blackColor(index);
                       $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount);
                       $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = 0;
                   }
                   if (loanTransaction.Amount <= outstandingAmount) {
                       loanTransaction.warningMessage = (installmentAmount + originalOverdueAmount) < loanTransaction.Amount ? "Advance received (" + (loanTransaction.Amount - (installmentAmount + originalOverdueAmount)) + ") {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}" : "";
                       $scope.blackColor(index);
                   } else {
                       loanTransaction.errorMessage = "Amount is greater than outstanding amount {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}";
                       loanTransaction.warningMessage = "";
                       $scope.redColor(index);
                       return;
                   }

               } else {
                   loanTransaction.errorMessage = "";
                   loanTransaction.warningMessage = "";
                   $scope.blackColor(index);
                   $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount);
                   $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = 0;
                   return;
               }
           }

       }
       $scope.scheduleDateCollection = function (index, loanTransaction) {
           loanTransaction.errorMessage = "";
           loanTransaction.warningMessage = "";
           var installmentFrequency = 2;
           var installmentAmount = $scope.previousTransaction.LoanTransactions[index].InstallmentAmount;
           var originalOverdueAmount = $scope.previousTransaction.LoanTransactions[index].IsLoanCollectedToday ? Math.round($scope.previousTransaction.LoanTransactions[index].Overdue - $scope.currentTransaction.LoanTransactions[index].InstallmentAmount + $scope.currentTransaction.LoanTransactions[index].Realisable) : Math.round($scope.previousTransaction.LoanTransactions[index].Overdue - $scope.currentTransaction.LoanTransactions[index].InstallmentAmount);
           var oneAdvanceAmount = Math.round((installmentAmount * 2) + originalOverdueAmount);
           var outstandingAmount = $scope.previousTransaction.LoanTransactions[index].IsLoanCollectedToday ? Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount
               + $scope.currentTransaction.LoanTransactions[index].Realisable) : Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount);
           var installmentLeft = $scope.currentTransaction.LoanTransactions[index].TotalInstallmentToPay - $scope.currentTransaction.LoanTransactions[index].TotalInstallmentCollected;
           oneAdvanceAmount = oneAdvanceAmount > outstandingAmount ? outstandingAmount : oneAdvanceAmount;
           if (Number($scope.roleId) !== $rootScope.rootLevel.Admin) {
               if (loanTransaction.Amount > 0) {
                   if (loanTransaction.Amount == outstandingAmount) {
                       loanTransaction.warningMessage = installmentLeft > 1 ? "Advance Full Paid {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}" : "Full Paid {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}";
                       loanTransaction.errorMessage = "";
                       $scope.currentTransaction.LoanTransactions[index].ExemptableAmount = $scope.currentTransaction.LoanTransactions[index].Exemption == 0 ? Math.round($scope.previousTransaction.LoanTransactions[index].ExemptableAmount) : $scope.currentTransaction.LoanTransactions[index].Exemption;
                       $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = 0;
                       $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = $scope.currentTransaction.LoanTransactions[index].ExemptableAmount;
                       $scope.greenColor(index);
                       return;
                   } else {
                       loanTransaction.errorMessage = "";
                       loanTransaction.warningMessage = "";
                       $scope.blackColor(index);
                       $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount);
                       $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = 0;
                   }
                   if (loanTransaction.Amount > outstandingAmount) {
                       loanTransaction.errorMessage = "Amount is greater than outstanding amount {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}";
                       loanTransaction.warningMessage = "";
                       $scope.redColor(index);
                       return;
                   } else if (loanTransaction.Amount == oneAdvanceAmount) {
                       loanTransaction.warningMessage = loanTransaction.Amount>originalOverdueAmount?"Advance " + (installmentFrequency - 1) + " Installment received {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}":"";
                       $scope.greenColor(index);
                       return;
                   } else if (loanTransaction.Amount < outstandingAmount && loanTransaction.Amount > oneAdvanceAmount) {
                       loanTransaction.errorMessage = "Sorry! Transaction can not be saved. Amount Typed in 'Realizable' column of loan program: " + $scope.currentTransaction.LoanTransactions[index].ProductName
                           + " exceeds 1 advance installment allowed {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}";
                       $scope.redColor(index);
                       return;
                   } else if (loanTransaction.Amount < oneAdvanceAmount && loanTransaction.Amount > (installmentAmount + originalOverdueAmount)) {
                       loanTransaction.warningMessage = loanTransaction.Amount>originalOverdueAmount?
                           "Advance received (" + (loanTransaction.Amount - (installmentAmount + originalOverdueAmount)) + ") {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}"
                           :"";
                       $scope.greenColor(index);
                       return;
                   } else if (loanTransaction.Amount <= (installmentAmount + originalOverdueAmount)) {
                       loanTransaction.warningMessage = (installmentAmount + originalOverdueAmount) < loanTransaction.Amount ? "Advance received (" + loanTransaction.Amount - (installmentAmount + originalOverdueAmount) + ") {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}" : "";
                       $scope.blackColor(index);
                       return;
                   }
               } else {
                   loanTransaction.errorMessage = "";
                   loanTransaction.warningMessage = "";
                   $scope.blackColor(index);
                   $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount);
                   $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = 0;
                   return;
               }
           } else {
               if (loanTransaction.Amount > 0) {
                   if (loanTransaction.Amount == outstandingAmount) {
                       loanTransaction.warningMessage = installmentLeft > 1 ? "Advance Full Paid {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}" : "Full Paid {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}";
                       loanTransaction.errorMessage = "";
                       $scope.currentTransaction.LoanTransactions[index].ExemptableAmount = $scope.currentTransaction.LoanTransactions[index].Exemption == 0 ? Math.round($scope.previousTransaction.LoanTransactions[index].ExemptableAmount) : $scope.currentTransaction.LoanTransactions[index].Exemption;
                       $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = 0;
                       $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = $scope.currentTransaction.LoanTransactions[index].ExemptableAmount;
                       $scope.greenColor(index);
                       return;
                   } else {
                       loanTransaction.errorMessage = "";
                       loanTransaction.warningMessage = "";
                       $scope.blackColor(index);
                       $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount);
                       $scope.currentTransaction.LoanTransactions[index].ExemptableAmount = 0;
                       $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = 0;
                   }
                   if (loanTransaction.Amount <= outstandingAmount) {
                       loanTransaction.warningMessage = (installmentAmount + originalOverdueAmount) < loanTransaction.Amount ? "Advance received (" + (loanTransaction.Amount - (installmentAmount + originalOverdueAmount)) + ") {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}" : "";
                       $scope.blackColor(index);
                   } else {
                       loanTransaction.errorMessage = "Amount is greater than outstanding amount {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}";
                       loanTransaction.warningMessage = "";
                       $scope.redColor(index);
                       return;
                   }

               } else {
                   loanTransaction.errorMessage = "";
                   loanTransaction.warningMessage = "";
                   $scope.blackColor(index);
                   $scope.currentTransaction.LoanTransactions[index].OutstandingAmount = Math.round($scope.previousTransaction.LoanTransactions[index].OutstandingAmount);
                   $scope.getSingleTransaction($scope.currentTransaction.LoanTransactions[index].SingleLoanTransactions, $rootScope.singleTransactionType.LoanExemption).Amount = 0;
                   return;
               }
           }

       }
       $scope.greenColor = function (index) {
           $("#collected" + index).css("border", "2px solid green");
           $("#collected1" + index).css("border", "2px solid green");
           $("#realisable" + index).css("border", "2px solid green");
       }
       $scope.blackColor = function (index) {
           $("#collected" + index).css({ "color": "black", "border": "" });
           $("#collected1" + index).css({ "color": "black", "border": "" });
           $("#realisable" + index).css({ "color": "black", "border": "" });
       }
       $scope.redColor = function (index) {
           $("#collected" + index).css("border", "2px solid red");
           $("#collected1" + index).css("border", "2px solid red");
           $("#realisable" + index).css("border", "2px solid red");
       }
       $scope.collectLateFee = function (index, loanTransaction) {
           //$scope.currentTransaction.LoanTransactions[index].LateFee = loanTransaction.Amount;
       }
       $scope.collectExemption = function (index, loanTransaction) {
           loanTransaction.errorMessage = "";
           if ($scope.roleId != $rootScope.UserRole.Admin && $scope.roleId != $rootScope.UserRole.RM) {
               if (loanTransaction.Amount !== $scope.currentTransaction.LoanTransactions[index].ExemptableAmount) {
                   loanTransaction.errorMessage = "Exemption amount must be equal to Exemptable amount {" + $scope.previousTransaction.LoanTransactions[index].ProductName + "}";
               } else {
                   loanTransaction.errorMessage = "";
               }
           }
       }

       $scope.singleTransactionSavings = function (index, savingsTransaction, type) {
           if (savingsTransaction.TransactionTypeId === $rootScope.singleTransactionType.SavingsDeposit || savingsTransaction.TransactionTypeId === $rootScope.singleTransactionType.CBSDeposit || savingsTransaction.TransactionTypeId === $rootScope.singleTransactionType.LTSDeposit) {
               $scope.depositSavingsAccount(index, savingsTransaction, type);
           } else if (savingsTransaction.TransactionTypeId === $rootScope.singleTransactionType.SavingsWithdraw || savingsTransaction.TransactionTypeId === $rootScope.singleTransactionType.CBSWithDraw) {
               $scope.withdrawlSavingsAccount(index, savingsTransaction, type);
           } else if (savingsTransaction.TransactionTypeId === $rootScope.singleTransactionType.SavingsInterest || savingsTransaction.TransactionTypeId === $rootScope.singleTransactionType.CBSInterest || savingsTransaction.TransactionTypeId === $rootScope.singleTransactionType.LTSInterest) {
               $scope.gettingInterest(index, savingsTransaction, type);
           } else if (savingsTransaction.TransactionTypeId === $rootScope.singleTransactionType.SavingPeriodicFee || savingsTransaction.TransactionTypeId === $rootScope.singleTransactionType.CBSPeriodicFee || savingsTransaction.TransactionTypeId === $rootScope.singleTransactionType.LTSPeriodicFee) {
               $scope.getSavingPeriodicFee(index, savingsTransaction, type);
           }
       }

       $scope.depositSavingsAccount = function (index, savingsTransaction, accounType) {
           if (accounType === $rootScope.SavingsConfig.SavingsProductType.CBS) {
               //if ($scope.previousTransaction.SavingsTransactions[index].TotalNumberOfInstallmentPaid >= $scope.previousTransaction.SavingsTransactions[index].TotalNumberOfInstallment) {
               //    swal("No of installment paid reached maximum number of installment. No more transaction can be done");
               //    return;
               //}
               if ($scope.previousTransaction.SavingsTransactions[index].MaxDepositInADay !== null) {
                   if ((savingsTransaction.Amount > $scope.previousTransaction.SavingsTransactions[index].MaxDepositInADay) && (savingsTransaction.Amount < ($scope.previousTransaction.SavingsTransactions[index].MaxCbsAmount - $scope.previousTransaction.SavingsTransactions[index].Balance))) {
                       savingsTransaction.errorMessage = "CBS amount can't be greater than Maximum CBS deposit amount in a day (" + $scope.previousTransaction.SavingsTransactions[index].MaxDepositInADay + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                       return;
                   } else {
                       savingsTransaction.errorMessage = "";
                   }
               }
               if ($scope.previousTransaction.SavingsTransactions[index].MaxCbsAmount !== null) {
                   if (savingsTransaction.Amount + $scope.previousTransaction.SavingsTransactions[index].Balance > $scope.previousTransaction.SavingsTransactions[index].MaxCbsAmount) {
                       savingsTransaction.errorMessage = "CBS amount can't be greater than Maximum CBS amount (" + $scope.previousTransaction.SavingsTransactions[index].MaxCbsAmount + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                       return;
                   } else {
                       savingsTransaction.errorMessage = "";
                   }
               }
               if ($scope.roleId == $rootScope.UserRole.LO || $scope.roleId == $rootScope.UserRole.ABM || $scope.roleId == $rootScope.UserRole.RM || $scope.roleId == $rootScope.UserRole.DM) {
                   if ($scope.previousTransaction.SavingsTransactions[index].MaxCbsAmount != null) {
                       if ($scope.previousTransaction.SavingsTransactions[index].MaxCbsAmount - $scope.previousTransaction.SavingsTransactions[index].Balance > $scope.previousTransaction.SavingsTransactions[index].PremiumAmount) {
                           if ($scope.roleId == $rootScope.UserRole.LO || $scope.roleId == $rootScope.UserRole.ABM) {
                               if (savingsTransaction.Amount != $scope.previousTransaction.SavingsTransactions[index].PremiumAmount && savingsTransaction.Amount != 0) {
                                   savingsTransaction.errorMessage = "Amount is not equal premium amount (" + $scope.previousTransaction.SavingsTransactions[index].PremiumAmount + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                                   return;
                               } else {
                                   savingsTransaction.errorMessage = "";
                               }
                           }
                           else if ($scope.roleId == $rootScope.UserRole.RM || $scope.roleId == $rootScope.UserRole.DM) {
                               if (savingsTransaction.Amount % $scope.previousTransaction.SavingsTransactions[index].PremiumAmount != 0 && savingsTransaction.Amount != 0) {
                                   savingsTransaction.errorMessage = "Amount is not equal or multiple of premium amount (" + $scope.previousTransaction.SavingsTransactions[index].PremiumAmount + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                                   return;
                               } else {
                                   savingsTransaction.errorMessage = "";
                               }
                           }
                       }
                   }
               }
               else if ($scope.roleId != $rootScope.UserRole.Admin) {
                   savingsTransaction.Amount = 0;
                   swal("You are not allowed to deposit CBS account");
                   return;
               }
               $scope.calculateTotalCBS(index);
           }
           else if (accounType === $rootScope.SavingsConfig.SavingsProductType.LTS) {
               if (savingsTransaction.Amount == 0) {
                   savingsTransaction.errorMessage = "";
                   return;
               }
               if (savingsTransaction.Amount < $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount) {
                   savingsTransaction.errorMessage = "Amount is Less than Premium amount which is (" + $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                   return;
               } else
                   savingsTransaction.errorMessage = "";
               if (Number($scope.roleId) === Number($rootScope.rootLevel.LO)) {
                   if (savingsTransaction.Amount > $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount) {
                       savingsTransaction.errorMessage = "Deposit LTS amount can't be greater than premium amount which is (" + $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                       return;
                   } else {
                       savingsTransaction.errorMessage = "";
                   }
               }
               else if (Number($scope.roleId) === Number($rootScope.rootLevel.ABM)) {
                   if (savingsTransaction.Amount > $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount) {
                       savingsTransaction.errorMessage = "Deposit LTS amount can't be greater than premium amount which is (" + $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                       return;
                   } else {
                       savingsTransaction.errorMessage = "";
                   }
               }
               else if ($scope.roleId == $rootScope.UserRole.RM || $scope.roleId == $rootScope.UserRole.Admin) {
                   if ($scope.previousTransaction.SavingsTransactions[index].OverdueInstallmentCount >= 1) {
                       if (savingsTransaction.Amount > $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount * $scope.previousTransaction.SavingsTransactions[index].OverdueInstallmentCount) {
                           savingsTransaction.errorMessage = "Amount can't be greater than  (" + $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount * $scope.previousTransaction.SavingsTransactions[index].OverdueInstallmentCount + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                           return;
                       }
                       if (savingsTransaction.Amount % $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount != 0 && savingsTransaction.Amount != 0) {
                           savingsTransaction.errorMessage = "Amount is not equal or multiple of premium amount (" + $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                           return;
                       } else {
                           savingsTransaction.errorMessage = "";
                       }
                   } else {
                       if (savingsTransaction.Amount % $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount && savingsTransaction.Amount != 0) {
                           savingsTransaction.errorMessage = "Amount is not equal premium amount (" + $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                           return;
                       } else {
                           savingsTransaction.errorMessage = "";
                       }
                   }
               } else {
                   savingsTransaction.Amount = 0;
                   swal("You are not allowed to deposit LTS account");
                   return;
               }

           } else if (accounType === $rootScope.SavingsConfig.SavingsProductType.General) {
               if ($scope.previousTransaction.SavingsTransactions[index].MaxDepositInADay !== null) {
                   if ((savingsTransaction.Amount > $scope.previousTransaction.SavingsTransactions[index].MaxDepositInADay)) {
                       savingsTransaction.errorMessage = "Amount can't be greater than Maximum deposit amount in a day (" + $scope.previousTransaction.SavingsTransactions[index].MaxDepositInADay + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                       return;
                   } else {
                       savingsTransaction.errorMessage = "";
                   }
               }
               $scope.calculateTotalGeneralSavings(index);
           }
           $scope.currentTransaction.SavingsTransactions[index].TodayOverdueAmount = $scope.todaySavingsDepositableAmounts[index] - savingsTransaction.Amount;
           $scope.calculateGrandTotal();
       }

       $scope.withdrawlSavingsAccount = function (index, savingsTransaction, accounType) {
           // ReSharper disable once AssignedValueIsNeverUsed
           var currentBalance = $scope.previousTransaction.SavingsTransactions[index].Balance;
           if ($scope.currentTransaction.SavingsTransactions[index].IsEnforcedMinBalance) {
               var minLoanBalance = $scope.DisbursedPrincipal * ($scope.previousTransaction.SavingsTransactions[index].MinBalancePercentageOfPLoan / 100);
               currentBalance = minLoanBalance > $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount ? minLoanBalance : $scope.previousTransaction.SavingsTransactions[index].MinBalanceAmount;
           }
           if (accounType === $rootScope.SavingsConfig.SavingsProductType.LTS) {
               if (Number($scope.roleId) !== Number($rootScope.rootLevel.Admin)) {
                   savingsTransaction.errorMessage = "You are not allowed to withdrawn from LTS account" + "{" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                   return;
               } else {
                   savingsTransaction.errorMessage = "";
               }
           }
           else if (accounType === $rootScope.SavingsConfig.SavingsProductType.General) {
               if ($scope.previousTransaction.SavingsTransactions[index].MaxWithdrawInADay !== null) {
                   if (savingsTransaction.Amount > $scope.previousTransaction.SavingsTransactions[index].MaxWithdrawInADay) {
                       savingsTransaction.errorMessage = "Amount can't be greater than Maximum withdraw amount in a day (" + $scope.previousTransaction.SavingsTransactions[index].MaxWithdrawInADay + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                       return;
                   } else {
                       savingsTransaction.errorMessage = "";
                   }
               }
               $scope.calculateTotalGeneralSavings(index);
           }
           else if (accounType === $rootScope.SavingsConfig.SavingsProductType.CBS) {
               if ($scope.previousTransaction.SavingsTransactions[index].MaxWithdrawInADay !== null) {
                   if (savingsTransaction.Amount > $scope.previousTransaction.SavingsTransactions[index].MaxWithdrawInADay) {
                       savingsTransaction.errorMessage = "Amount can't be greater than Maximum withdraw amount in a day (" + $scope.previousTransaction.SavingsTransactions[index].MaxWithdrawInADay + ") {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
                       return;
                   } else {
                       savingsTransaction.errorMessage = "";
                   }
               }
               $scope.calculateTotalCBS(index);
           }

       }

       $scope.gettingInterest = function (index, savingsTransaction, accountType) {
           if (accountType === $rootScope.SavingsConfig.SavingsProductType.LTS || accountType === $rootScope.SavingsConfig.SavingsProductType.General) {
               if (Number($scope.roleId) !== Number($rootScope.rootLevel.Admin)) {
                   savingsTransaction.errorMessage = "You are not allowed to give intereset {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
               }
           }
       }
       $scope.calculateTotalGeneralSavings = function (index) {
           var totalBalance = $scope.previousTransaction.SavingsTransactions[index].Balance + $scope.previousTransaction.SavingsTransactions[index].TodaysWithdrawalAmount - $scope.currentTransaction.SavingsTransactions[index].Deposit
               + $scope.getSingleTransaction($scope.currentTransaction.SavingsTransactions[index].SingleSavingsTransaction, $rootScope.singleTransactionType.SavingsDeposit).Amount +
               $scope.getSingleTransaction($scope.currentTransaction.SavingsTransactions[index].SingleSavingsTransaction, $rootScope.singleTransactionType.SavingsInterest).Amount -
               $scope.getSingleTransaction($scope.currentTransaction.SavingsTransactions[index].SingleSavingsTransaction, $rootScope.singleTransactionType.SavingsWithdraw).Amount -
               $scope.getSingleTransaction($scope.currentTransaction.SavingsTransactions[index].SingleSavingsTransaction, $rootScope.singleTransactionType.SavingLateFee).Amount -
               $scope.getSingleTransaction($scope.currentTransaction.SavingsTransactions[index].SingleSavingsTransaction, $rootScope.singleTransactionType.SavingPeriodicFee).Amount;
           if (totalBalance < 0) {
               $scope.currentTransaction.SavingsTransactions[index].errorMessage = "Total balance is less than (0) {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
               return;
           } else
               $scope.currentTransaction.SavingsTransactions[index].errorMessage = "";
       }
       $scope.calculateTotalCBS = function (index) {
           var totalBalance = $scope.previousTransaction.SavingsTransactions[index].Balance + $scope.previousTransaction.SavingsTransactions[index].TodaysWithdrawalAmount - $scope.currentTransaction.SavingsTransactions[index].Deposit
               + $scope.getSingleTransaction($scope.currentTransaction.SavingsTransactions[index].SingleSavingsTransaction, $rootScope.singleTransactionType.CBSDeposit).Amount +
               $scope.getSingleTransaction($scope.currentTransaction.SavingsTransactions[index].SingleSavingsTransaction, $rootScope.singleTransactionType.CBSInterest).Amount -
               $scope.getSingleTransaction($scope.currentTransaction.SavingsTransactions[index].SingleSavingsTransaction, $rootScope.singleTransactionType.CBSWithDraw).Amount;
           if (totalBalance < 0) {
               $scope.currentTransaction.SavingsTransactions[index].errorMessage = "Total balance is less than(0) {" + $scope.previousTransaction.SavingsTransactions[index].ProductName + "}";
               return;
           } else
               $scope.currentTransaction.SavingsTransactions[index].errorMessage = "";
       }

       $scope.getSavingPeriodicFee = function (index, savingsTransaction, accountType) {
       }

       $scope.clearModelData = function () {
           $scope.roleId = $rootScope.user.Role;
           $scope.employeeId = $scope.officer[0].EmployeeId;
           $scope.branchId = $scope.selectedBranchId;
           $scope.previousTransaction = {};
           $scope.currentTransaction = {};


           $scope.warningMessageLoan = "";
           $scope.errorMessageLoan = "";

           $scope.warningMessageSavings = "";
           $scope.errorMessageSavings = "";

           $scope.postDailyTransaction = [];

           $scope.bankAccounts = [];
           $scope.branchHolidayAndOffDay = [];

           $scope.loanProgram = [];
           $scope.savingsSecurityProgram = [];

           $scope.singleTransactionLoan = [];

           $scope.transactionTypes = {};
           $scope.hasNominee = true;

           $scope.minDepostBalanceOfDay = [];
           $scope.DisbursedPrincipal = null;

           $scope.todaySavingsDepositableAmounts = [];

           $scope.isCommited = false;
       }

       $scope.saveDailyTransaction = function () {
           if (!$rootScope.isDayOpenOrNot()) return;
           if ($scope.selectedDate > $scope.maxDate || $scope.selectedDate < $scope.minDate) {
               swal("You are not allowed to save transaction on this day");
               return;
           }
           var i;
           if ($scope.currentTransaction.LoanTransactions !== null) {
               if ($scope.currentTransaction.LoanTransactions.length > 0) {
                   for (i = 0; i < $scope.currentTransaction.LoanTransactions.length; i++) {
                       if (moment($scope.currentTransaction.TransactionDate).format('YYYY-MM-DD') < moment($scope.currentTransaction.LoanTransactions[i].AccountOpeningDate).format('YYYY-MM-DD')) {
                           swal("Transaction can't be proceed. Transaction date is less than " + $scope.currentTransaction.LoanTransactions[i].ProductName + "'s Opening Date");
                           return;
                       }
                   }
               }
           }
           if ($scope.currentTransaction.SavingsTransactions !== null) {
               if ($scope.currentTransaction.SavingsTransactions.length > 0) {
                   for (i = 0; i < $scope.currentTransaction.SavingsTransactions.length; i++) {
                       if (moment($scope.currentTransaction.TransactionDate).format('YYYY-MM-DD') < moment($scope.currentTransaction.SavingsTransactions[i].AccountOpeningDate).format('YYYY-MM-DD')) {
                           swal("Transaction can't be proceed. Transaction date is less than " + $scope.currentTransaction.SavingsTransactions[i].ProductName + "'s Opening Date");
                           return;
                       }
                   }
               }
           }
           if (!$scope.currentTransaction.Process) {
               swal("Please Select Transaction Process");
               return;
           } else {
               if ($scope.currentTransaction.Process == $rootScope.TransactionProcess.Cheque) {
                   if (!$scope.currentTransaction.BankAccount || !$scope.currentTransaction.ChequeNo) {
                       swal("Please Select Bank account and cheque number");
                       return;
                   }
               }
           }
           if ($scope.currentTransaction.SavingsTransactions !== null) {
               if ($scope.currentTransaction.SavingsTransactions.length > 0) {
                   for (i = 0; i < $scope.currentTransaction.SavingsTransactions.length; i++) {
                       if (moment($scope.currentTransaction.TransactionDate).format('YYYY-MM-DD') < moment($scope.currentTransaction.SavingsTransactions[i].AccountOpeningDate).format('YYYY-MM-DD')) {
                           swal("Transaction can't be proceed. Transaction date is less than " + $scope.currentTransaction.SavingsTransactions[i].ProductName + "'s Opening Date");
                           return;
                       }
                   }
               }
           }
           var j;
           if ($scope.currentTransaction.LoanTransactions !== null) {
               if ($scope.currentTransaction.LoanTransactions.length > 0) {
                   for (i = 0; i < $scope.currentTransaction.LoanTransactions.length; i++) {
                       if ($scope.currentTransaction.LoanTransactions[i].errorMessage.length > 0) {
                           swal($scope.currentTransaction.LoanTransactions[i].errorMessage);
                           return;
                       }
                       for (j = 0; j < $scope.currentTransaction.LoanTransactions[i].SingleLoanTransactions.length; j++) {
                           if ($scope.currentTransaction.LoanTransactions[i].SingleLoanTransactions[j].errorMessage.length > 0) {
                               swal($scope.currentTransaction.LoanTransactions[i].SingleLoanTransactions[j].errorMessage);
                               return;
                           }
                       }
                   }
               }
           }
           if ($scope.currentTransaction.SavingsTransactions !== null) {
               if ($scope.currentTransaction.SavingsTransactions.length > 0) {
                   for (i = 0; i < $scope.currentTransaction.SavingsTransactions.length; i++) {
                       if ($scope.currentTransaction.SavingsTransactions[i].errorMessage.length > 0) {
                           swal($scope.currentTransaction.SavingsTransactions[i].errorMessage);
                           return;
                       }
                       for (j = 0; j < $scope.currentTransaction.SavingsTransactions[i].SingleSavingsTransaction.length; j++) {
                           if ($scope.currentTransaction.SavingsTransactions[i].SingleSavingsTransaction[j].errorMessage.length > 0) {
                               swal($scope.currentTransaction.SavingsTransactions[i].SingleSavingsTransaction[j].errorMessage);
                               return;
                           }
                       }
                   }
               }
           }
           swal({
               title: "Confirm?",
               text: "Transaction will be saved",
               showCancelButton: true,
               confirmButtonText: "Yes, Save it!",
               cancelButtonText: "No, cancel!",
               type: "info",
               closeOnConfirm: false,
               showLoaderOnConfirm: true
           },
          function (isConfirmed) {
              $("#dailyTransactionLoadingImage").css("display", "block");
              if (isConfirmed) {
                  $scope.savedTransactionDate = $scope.currentTransaction.TransactionDate;
                  $scope.currentTransaction.TransactionDate = new Date(moment($scope.currentTransaction.TransactionDate).format("YYYY-MM-DD"));
                  delete $scope.previousTransaction.$id;
                  if ($scope.previousTransaction.LoanTransactions !== null) {
                      if ($scope.previousTransaction.LoanTransactions.length > 0) {
                          $scope.previousTransaction.LoanTransactions.forEach(function (t) {
                              delete t.$id;
                              t.SingleLoanTransactions.forEach(function (l) {
                                  delete l.$id;
                              });

                          });
                      }
                  }
                  if ($scope.previousTransaction.SavingsTransactions !== null) {
                      if ($scope.previousTransaction.SavingsTransactions.length > 0) {
                          $scope.previousTransaction.SavingsTransactions.forEach(function (t) {
                              delete t.$id;
                              t.SingleSavingsTransaction.forEach(function (l) {
                                  delete l.$id;
                              });

                          });
                      }
                  }
                  $scope.postDailyTransaction.push($scope.previousTransaction);
                  $scope.postDailyTransaction.push($scope.currentTransaction);

                  memberDailyTransactionService.saveDailyTransaction($scope.postDailyTransaction)
                      .then(function (response) {
                          if (response.data.Success) {
                              $rootScope.$broadcast('transaction-saved');
                              $("#dailyTransactionLoadingImage").css("display", "none");
                              swal({
                                  title: "Transaction Saved",
                                  type: "success",
                                  confirmButtonColor: "#008000",
                                  confirmButtonText: "Close",
                                  closeOnConfirm: true,
                                  function (isConfirm) {
                                      if (isConfirm) {
                                          $scope.dailyTransaction.reset();
                                          //$scope.clearModelData();
                                      } else {
                                          $scope.clearAndCloseTab();
                                      }
                                  }
                              });
                              //$scope.clearModelData();
                              $scope.currentTransaction = {};
                              $scope.previousTransaction = {};
                              $scope.postDailyTransaction = [];
                              $scope.currentTransaction.TransactionDate =$scope.savedTransactionDate;
                              $scope.currentTransaction.Process = $scope.transactionProcess;
                              $scope.getMemberDailyTransaction($scope.currentTransaction.TransactionDate);

                          } else {
                              $("#dailyTransactionLoadingImage").css("display", "none");
                              swal("Error", "Error While Saving Transaction:"+response.data.Message, "error");
                              $scope.dailyTransaction.reset();
                              $scope.currentTransaction = {};
                              $scope.previousTransaction = {};
                              $scope.postDailyTransaction = [];
                              $scope.currentTransaction.TransactionDate =$scope.savedTransactionDate;
                              $scope.currentTransaction.Process = $scope.transactionProcess;
                              $scope.getMemberDailyTransaction($scope.currentTransaction.TransactionDate);
                          }
                      });
              } else {
                  $("#dailyTransactionLoadingImage").css("display", "none");
              }
          });
       }

       $scope.init = function () {
           commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
               $scope.commandList = responseCommand.data;

               $scope.customCommandList = [];

               $scope.customCommandList.push($scope.commandList[1]);

               if ($scope.commandList.find(c => !c.IsGeneral))
                   $scope.hasNonGeneralCommands = true;
           });
           $scope.getTransactionProcess();
           $scope.getBankAccount($scope.branchId);
           $scope.getHolidays($scope.branchId);
       }
       $scope.init();
   }
]);