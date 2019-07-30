ammsAng.controller('BadDebtDailyTransactionController', [
   '$scope', '$rootScope', '$timeout', 'filterService', 'memberDailyTransactionService', 'workingDayService', 'badDebtTransactionService',
   function ($scope, $rootScope, $timeout, filterService, memberDailyTransactionService, workingDayService, badDebtTransactionService) {

       

       $scope.roleId = $rootScope.user.Role;
       $scope.employeeId = $scope.officer[0].EmployeeId;
       $scope.branchId = $scope.selectedBranchId;
       $scope.memberId = $scope.selectedMenu.Id;
       $scope.transaction = {};
       $scope.transaction.transactionDate = $rootScope.workingdate;

       $scope.previousTransaction = {};
       $scope.currentTransaction = {};
       //$scope.currentTransaction.TransactionDate = $rootScope.workingdate;
       $scope.grandTotal = 0;

       console.log($scope.currentTransaction.TransactionDate);
       $scope.warningMessageLoan = "";
       $scope.errorMessageLoan = "";

       
       $scope.postDailyTransaction = [];

       $scope.bankAccounts = [];
       $scope.branchHolidayAndOffDay = [];
       $scope.branchWorkingDays = [];
       $scope.transactionProcessList = [];

       $scope.loanProgram = [];
       $scope.singleTransactionLoan = [];
      
       $scope.transactionTypes = {};
       $scope.DisbursedPrincipal = null;

       $scope.currentTransaction = {};
       $scope.transactionDate = new Date(moment($rootScope.workingdate).format('YYYY-MM-DD'));
       $scope.currentTransaction.BranchWorkingDate = new Date(moment($rootScope.workingdate).format('YYYY-MM-DD'));
       $scope.btnSave = false;
      // $scope.currentTransaction.Process = null;

       $scope.getTransactionProcess = function () {
           filterService.getTransactionProcess('DailyTransactionProcess').then(function (response) {
               $scope.transactionProcessList = response.data;
               console.log(response.data);
               $scope.getMemberDailyTransaction($scope.memberId, $rootScope.workingdate);
           });
           
       }
       $scope.getMemberDailyTransaction = function (memberId, date) {
           $("#loadingImage").css("display", "block");
           badDebtTransactionService.getMemberDailyTransaction(memberId, moment($scope.transactionDate).format('YYYY-MM-DD'), $rootScope.selectedBranchId).then(function (response) {
               $("#loadingImage").css("display", "none");
               $scope.previousTransaction = angular.copy(response.data);
               $scope.currentTransaction = response.data;
               $scope.btnSave = $scope.currentTransaction.BadDebtTransactions != null;
               $scope.currentTransaction.PaymentMethodId = $scope.currentTransaction.PaymentMethodId.toString();
               $scope.currentTransaction.BranchWorkingDate = new Date(moment($rootScope.workingdate).format('YYYY-MM-DD'));
              // $scope.currentTransaction.TransactionDate = new Date(moment($scope.currentTransaction.TransactionDate).format('YYYY-MM-DD'));
               
               $scope.ProductList = response.data.ProductList;
               $scope.branchHolidayAndOffDay = response.data.Holidays;
               
               console.log($scope.currentTransaction);
               $scope.grandTotal = 0;
               $scope.setTransaction();
               //$scope.currentTransaction.Transactions.forEach(function(e) {
               //    e.ProductName = $scope.ProductList.filter(p => p.Value == e.ProductId)[0].Name;
               //    $scope.grandTotal += e.TotalAmount;
               //    e.DefaultTotalAmount = e.TotalAmount;
               //    $scope.currentTransaction.TotalCollection = angular.copy($scope.grandTotal);
               //});
           });
       }
       

       $scope.setTransaction = function () {
           $scope.grandTotal = 0;
           $scope.currentTransaction.BadDebtTransactions.forEach(function (e) {
               $scope.grandTotal += e.TodaysCollectableAmount;
           });
       }

       
       $scope.beforeDateRender = function ($dates) {
           var maxDate = new Date($scope.branchWorkingDay);
           maxDate.setDate(maxDate.getDate() + 1);
           maxDate = new Date(maxDate).setHours(0, 0, 0, 0);
           if ($dates.length > 27) {
               for (d in $dates) {
                   if ($dates.hasOwnProperty(d)) {
                       if ($dates[d].utcDateValue > maxDate) {
                           $dates[d].selectable = false;
                       }
                   }
               }
           }
       }
       $scope.isHolidayOrOffDay = function (date) {
           if ($scope.branchHolidayAndOffDay) {
               $scope.branchHolidayAndOffDay.forEach(function(h) {
                   if (moment(h).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
                       swal('Selected date is holiday or Offday');
                       $scope.transactionDate = new Date(moment($rootScope.workingdate).format('YYYY-MM-DD'));
                       return;
                   }
               });
           }
           $scope.IsAbleToSaveTransaction();

       }
       $scope.getBankAccount = function (branchId) {
           memberDailyTransactionService.getBankAccount(branchId).then(function (response) {
               $scope.bankAccounts = response.data;
           });
       }
       $scope.popup = {
           opened: false
       };
       $scope.open = function () {
           $scope.popup.opened = true;
       };
       $scope.dateOptions = {
           //dateDisabled: disabled,
           formatYear: 'yyyy',
           maxDate: new Date(moment($rootScope.workingdate).format('YYYY-MM-DD')),
           startingDay: 1
       };

       $scope.TransactionValidator = function (transaction) {
           var validatorObj = {};
           if (transaction.TodaysCollectableAmount <= transaction.OutstandingAmount + transaction.TodaysCollectedAmount) {
               return true;
           }
           swal("Amount larger than outstanding amount!!");
           transaction.TodaysCollectableAmount = transaction.OutstandingAmount + transaction.TodaysCollectedAmount;
           $scope.setTransaction();
           validatorObj.message = "$please";
           return validatorObj;
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
           $scope.dateOptions.minDate = new Date($scope.minDate);
           $scope.dateOptions.maxDate = new Date($scope.maxDate);
           if (!$scope.transactionDate || moment($scope.transactionDate).format("YYYY-MM-DD") < $scope.minDate || moment($scope.transactionDate).format("YYYY-MM-DD") > $scope.maxDate)
               $scope.btnSave = false;
           else $scope.btnSave = true;
           $scope.getMemberDailyTransaction($scope.memberId, moment($scope.transactionDate).format("YYYY-MM-DD"));
       }
       //$scope.paymentMehtodChange=function() {
       //    if ($scope.currentTransaction.PaymentMethodId == $rootScope.PaymentMethodId.Cash) {
       //        $scope.currentTransaction.BankAccountId = null;
       //        $scope.currentTransaction.ChequeNo = null;
       //        $scope.currentTransaction.IsAccountPayable = false;
       //    }
       //}
       $scope.saveDailyTransaction = function () {
           if (!$rootScope.isDayOpenOrNot()) return;
           if (!$scope.currentTransaction.PaymentMethodId) {
               swal("Please Select Transaction Process");
               return;
           } else {
               if ($scope.currentTransaction.PaymentMethodId === '2') {
                   if (!$scope.currentTransaction.BankAccountId || !$scope.currentTransaction.ChequeNo) {
                       swal("Please Select Bank account and cheque number");
                       return;
                   }
               }
           }
           //if ($scope.currentTransaction.BadDebtTransactions.length == $scope.currentTransaction.BadDebtTransactions.filter(t => t.TodaysCollectableAmount == 0).length) {
           //    swal("All input fields are 0. Nothing to save");
           //    return;
           //}
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
                  if ($scope.currentTransaction.PaymentMethodId == $rootScope.TransactionProcess.Cash) {
                      $scope.currentTransaction.BankAccountId = null;
                      $scope.currentTransaction.ChequeNo = null;
                      $scope.currentTransaction.IsAccountPayable = false;
                  }
                  $scope.currentTransaction.BranchId = $rootScope.selectedBranchId;
                  //finalMemberDailyTransaction.AmmsMemberTransaction = $scope.currentTransaction;
                  //finalMemberDailyTransaction.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                  //finalMemberDailyTransaction.TransactionDate = moment($rootScope.transactionDate).format("YYYY-MM-DD");
                  //finalMemberDailyTransaction.PostedBy = $rootScope.user.UserId;
                  $scope.currentTransaction.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                  $scope.currentTransaction.TransactionDate = moment($scope.transactionDate).format("YYYY-MM-DD");
                  badDebtTransactionService.saveBadDebtDailyTransaction($scope.currentTransaction)
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
                                          $scope.clearModelData();
                                      } else {
                                          $scope.clearAndCloseTab();
                                      }
                                  }
                              });
                              $scope.postDailyTransaction = [];
                              $scope.getMemberDailyTransaction($scope.selectedMenu.Id, $scope.currentTransaction.TransactionDate);

                          } else {
                              $("#dailyTransactionLoadingImage").css("display", "none");
                              swal("Error","Error While Saving Transaction", "error");
                          }
                      });
              } else {
                  $("#dailyTransactionLoadingImage").css("display", "none");
              }
          });
       }

       $scope.init = function () {
           $scope.getTransactionProcess();
           $scope.getBankAccount($scope.branchId);
         //  $scope.getHolidays($scope.branchId);
       }
       $scope.init();
   }
]);