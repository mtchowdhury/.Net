ammsAng.controller('adjustLoanController', ['$scope', '$rootScope', '$timeout', 'adjustloanservice', 'commonService', 'DTOptionsBuilder',
    function ($scope, $rootScope, $timeout, adjustloanservice, commonService, DTOptionsBuilder) {


        $scope.branchWorkingDate = moment($rootScope.workingdate).format('YYYY-MM-DD');
       // $scope.date = $scope.branchWorkingDate;
        $scope.validityBool = false;
        $scope.validationText = '';
        $scope.prevVlaue = 0;
        var tootoot = $rootScope.user.Role;



        $scope.MemberId = angular.copy($scope.selectedMenu.Id);



        $scope.getServerDateTime = function ($date) {
            commonService.getServerDateTime().then(function (response) {
                $scope.serverDateTimeToday = response.data;
            });
        }

        //$scope.beforeDateRender = function ($dates) {
        //    //console.log($scope.selectedMenu.Id);
        //   if ($dates.length > 27) {
        //       var maxDate = new Date(moment());
        //        maxDate.setDate(maxDate.getDate() + 1);
        //        maxDate = new Date(maxDate).setHours(0, 0, 0, 0);
        //        for (d in $dates) {
        //            if ($dates.hasOwnProperty(d)) {
        //                if ($dates[d].utcDateValue > maxDate) {
        //                    $dates[d].selectable = false;
        //                }
        //            }
        //        }
        //    }
        //}


        $scope.getMemberAccountDetails = function (memberId, date) {
            $("#loadingImage").css("display", "block");
            adjustloanservice.getMemberAccounts(memberId, moment(date).format('YYYY-MM-DD')).then(function (response) {
                $scope.memberAccountDetails = response.data;
                $scope.memberAccountDetails.SavingsAccounts = response.data.SavingsAccounts.filter(s=>s.Category!==4);


                $scope.sortOn($scope.memberAccountDetails.SavingsAccounts, "Name");
                $scope.sortOn($scope.memberAccountDetails.LoanAccounts, "Name");




                console.log($scope.memberAccountDetails);
                $scope.loanAccountId = $scope.memberAccountDetails.LoanAccounts[0] ? $scope.memberAccountDetails.LoanAccounts[0].Id : 0;
                $scope.savingsAccountId = $scope.memberAccountDetails.SavingsAccounts[0] ? $scope.memberAccountDetails.SavingsAccounts[0].Id : 0;
                if ($scope.memberAccountDetails.LoanAccounts.length > 0) $scope.getLoanAccountInfo();
                if ($scope.memberAccountDetails.SavingsAccounts.length > 0) $scope.getSavingsAccountInfo();
                $("#loadingImage").css("display", "none");
            });
        }

        $scope.getLoanAccountInfo = function () {
            $scope.adjustAmount = 0;
            $scope.disburseAmount = $scope.memberAccountDetails.LoanAccounts.filter(x => x.Id === $scope.loanAccountId)[0].DisburseAmount;
            $scope.loanOutstandingAmount = Math.round($scope.memberAccountDetails.LoanAccounts.filter(x => x.Id === $scope.loanAccountId)[0].OutstandingAmount);
        }

        $scope.getSavingsAccountInfo = function () {
            $scope.adjustAmount = 0;
            $scope.savingBalance = $scope.memberAccountDetails.SavingsAccounts.filter(x => x.Id === $scope.savingsAccountId)[0].SavingsBalance;
            $scope.totalSavingBalance = $scope.memberAccountDetails.SavingsAccounts.filter(x => x.Id === $scope.savingsAccountId)[0].TotalSavingsBalance;

            $scope.getSavingAccountAdjustedAmount($scope.savingsAccountId, $scope.loanAccountId, moment($scope.date).format());
        }

        $scope.getSavingAccountAdjustedAmount = function (savingAccountId, loanAccountId, date) {
            adjustloanservice.getSavingAccountAdjustedAmount(savingAccountId, loanAccountId, date).then(function (response) {
                $scope.adjustAmount = response.data;
                $scope.prevVlaue = angular.copy($scope.adjustAmount);
            });
        }

        $scope.adjustAmountchange = function () {
            $scope.savingBalance = $scope.memberAccountDetails.SavingsAccounts.filter(x => x.Id === $scope.savingsAccountId)[0].SavingsBalance;
            $scope.totalSavingBalance = $scope.memberAccountDetails.SavingsAccounts.filter(x => x.Id === $scope.savingsAccountId)[0].TotalSavingsBalance;
            $scope.loanOutstandingAmount = Math.round($scope.memberAccountDetails.LoanAccounts.filter(x => x.Id === $scope.loanAccountId)[0].OutstandingAmount);


            //$scope.availableBalance = ($scope.savingBalance > $scope.totalSavingBalance) ? $scope.totalSavingBalance : $scope.savingBalance;
            if ($scope.adjustAmount > $scope.savingBalance && moment($scope.branchWorkingDate).format() === moment($scope.date).format()) {
                $scope.validationText = 'Adjust amount can not be greater than available savings balance!';
                $scope.validityBool = true;
                $scope.getLoanAccountInfo();
                $scope.getSavingsAccountInfo();
                return;
            } else if ($scope.adjustAmount > $scope.totalSavingBalance && moment($scope.branchWorkingDate).format() !== moment($scope.date).format()) {
                $scope.validationText = 'Adjust amount can not be greater than total savings balance!';
                $scope.validityBool = true;
                $scope.getLoanAccountInfo();
                $scope.getSavingsAccountInfo();
                return;
            }

            else if ($scope.adjustAmount > $scope.loanOutstandingAmount) {
                $scope.validationText = 'Adjust amount can not be greater than loan outStanding Amount!';
                $scope.validityBool = true;
                // swal("Adjust amount can not be greater than loan outStanding Amount! ", 'WARNING', 'warning');
                $scope.getLoanAccountInfo();
                $scope.getSavingsAccountInfo();
                return;
            }
                //else if ($scope.adjustAmount === 0) {
                //    $scope.validationText = 'insert a valid adjust amount';
                //    $scope.validityBool = true;
                //}
            else {
                $scope.validationText = '';
                $scope.validityBool = false;
                $scope.savingBalance = $scope.savingBalance - $scope.adjustAmount;
                $scope.totalSavingBalance = $scope.totalSavingBalance - $scope.adjustAmount > 0 ? $scope.totalSavingBalance - $scope.adjustAmount : 0;
                $scope.loanOutstandingAmount = $scope.loanOutstandingAmount - $scope.adjustAmount + $scope.prevVlaue;


            }
        }

        $scope.saveAccountDetails = function () {

            if ($scope.memberAccountDetails.SavingsAccounts.length < 1) {
                swal("Sorry!Selected member doesn't have any saving account to adjust balance from !");
                return;
            }
            if ($scope.memberAccountDetails.LoanAccounts.length < 1) {
                swal("Sorry!Selected member doesn't have any loan account to adjust outstanding balance!");
                return;
            }
            var accountDetails = {};
            accountDetails.ProgramOfficerId = $rootScope.user.EmployeeId;
            accountDetails.AdjustDate = moment($scope.date).format('YYYY-MM-DD');
            accountDetails.WorkingDate = moment($scope.branchWorkingDate).format();
            accountDetails.AdjustAmount = $scope.adjustAmount;
            accountDetails.SavingsAccounts = [];
            accountDetails.LoanAccounts = [];

            var idx = {};
            idx.Id = $scope.savingsAccountId;
            idx.SavingsBalance = $scope.savingBalance;
            idx.TotalSavingsBalance = $scope.totalSavingBalance;
            accountDetails.SavingsAccounts.push(idx);

            var idxL = {};
            idxL.Id = $scope.loanAccountId;
            idxL.OutstandingAmount = $scope.loanOutstandingAmount;
            accountDetails.LoanAccounts.push(idxL);

            if (accountDetails.AdjustAmount < 0) {
                swal("Please input valid adjustment amount for saving ! ", 'WARNING', 'warning');
                return;
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
                    if (isConfirmed) {
                        adjustloanservice.save(accountDetails).then(function (res) {
                            if (res.data.Success) {
                                $rootScope.$broadcast('transaction-saved');
                                $scope.getMemberAccountDetails($scope.MemberId, $scope.date);
                                $("#dailyTransactionLoadingImage").css("display", "none");
                                swal({
                                    title: "Transaction Saved",
                                    type: "success",
                                    confirmButtonColor: "#008000",
                                    confirmButtonText: "Close",
                                    closeOnConfirm: true,
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            $scope.getMemberAccountDetails($scope.MemberId, $scope.date);
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    }
                                });
                            } else {
                                $("#dailyTransactionLoadingImage").css("display", "none");
                                swal("Error", "Error While Saving Transaction", "error");
                            }
                            console.log(res.data);
                        });
                    } else {
                        $("#dailyTransactionLoadingImage").css("display", "none");
                    }


                });
        }


        $scope.sortOn = function (arr, prop) {
            arr.sort(
                function (a, b) {
                    if (a[prop] < b[prop]) {
                        return -1;
                    } else if (a[prop] > b[prop]) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            );
        }


        $scope.init = function () {
            $scope.getMemberAccountDetails($scope.MemberId, $scope.date);

        }


         //new date picker 
        $scope.today = function () {
            $scope.date= new Date($rootScope.workingdate);
           };
        $scope.today();

       

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($rootScope.workingdate),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2040, 5, 22),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };

        //function disabled(data) {
        //    var date = data.date,
        //      mode = data.mode;
        //  return (mode === 'day' && (date.getDay() === 5))
        //        || (moment(date) > moment(new Date($rootScope.workingdate)));
        //}

        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5))
                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.RM
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate)).add(-29, 'days')))
                || (moment(date) > moment(new Date($rootScope.workingdate)))
                )

                || ($rootScope.selectedBranchId > 0 && ($rootScope.user.Role == $rootScope.UserRole.BM || $rootScope.user.Role == $rootScope.UserRole.ABM || $rootScope.user.Role == $rootScope.UserRole.LO)
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate))))
                || (moment(date) > moment(new Date($rootScope.workingdate)))
               // || moment(date) < moment($scope.AdmissionDate)
                )

                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.DM
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate)).add(-89, 'days')))
                || (moment(date) > moment(new Date($rootScope.workingdate)))
               // || moment(date) < moment($scope.AdmissionDate)
                )

                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.Admin
                && (moment(date) > moment(new Date($rootScope.workingdate)))
                //|| moment(date) < moment($scope.AdmissionDate)
                )
            ;
        }

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate.getDate() + 1);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.openpop = function () {
            $scope.openingPop.opened = true;
        };

       

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.openingPop = {
            opened: false
        };

        function getDayClass(data) {
            var date = data.date,
              mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
        $scope.WdValidator = function () {

            if ($scope.date === undefined || $scope.date === null) {
                swal("This field is required and can not be cleared!");
                $scope.date = $rootScope.workingdate;
                return;
            }

            //var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            //var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            //if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM) {
            //    maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //    minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //}
            
            //if (($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5) &&
            //    (moment($scope.eaccount.OpeningDate).valueOf() > maxDate || moment($scope.eaccount.OpeningDate).valueOf() < minDate)) {
            //    swal("please select valid date!");
            //    $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
            //    return;
            //}

        }



        $scope.init();
    }]);