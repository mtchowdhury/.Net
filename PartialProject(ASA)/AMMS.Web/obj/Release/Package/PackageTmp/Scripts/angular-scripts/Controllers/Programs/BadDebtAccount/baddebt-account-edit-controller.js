ammsAng.controller('baddebtaccountEditController', [
    '$scope', '$rootScope', 'loanaccountService', 'filterService', 'baddebtaccountService', 'workingDayService', 'commonService',
    function ($scope, $rootScope, loanaccountService, filterService, baddebtaccountService, workingDayService, commonService) {
        $scope.badDebtAccount = null;

        $scope.InstallmentFrequencyList = [];
        $scope.StatusList = [];
        $scope.ReasonList = [];
        $scope.workingDay = null;
        $scope.transactionList = null;
        $scope.workingDayInt = 20170103000000;
        $scope.originalTransferAmount = 0;
        $scope.totalPaid = 0;


        $scope.init = function () {
            $scope.getWorkingDate();
            $scope.badDebtAccount = angular.copy($rootScope.editbadDebtAccountId);
            //$scope.badDebtAccount = $rootScope.editbadDebtAccountId;
            $scope.badDebtAccount.Status = $scope.badDebtAccount.Status==null?null:$scope.badDebtAccount.Status.toString();
            $scope.badDebtAccount.Reason = $scope.badDebtAccount.Reason==null?null:$scope.badDebtAccount.Reason.toString();
            $scope.badDebtAccount.DisburseDate = moment($scope.badDebtAccount.DisburseDate).format("DD-MM-YYYY");
            $scope.badDebtAccount.BadDebtTransferDate = moment($scope.badDebtAccount.BadDebtTransferDate).format("DD-MM-YYYY");
            $scope.badDebtAccount.ClosingDate = $scope.badDebtAccount.ClosingDate? new Date($scope.badDebtAccount.ClosingDate):null;
            $scope.badDebtAccount.InstallmentFrequencyId = $scope.badDebtAccount.InstallmentFrequencyId.toString();
            console.log($rootScope.editbadDebtAccountId);
            $scope.getStatusOptions();
            $scope.getReasonOptions();
            $scope.getFrequencyOptions();
            $scope.getTransactionList();
            $scope.dateOptionsCD.minDate = new Date(moment($scope.badDebtAccount.DisburseDate).format("YYYY-MM-DD"));
        }
        $scope.dateOptions = {
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            startingDay: 1
        };
        $scope.popup = {
            opened: false
        };
        $scope.open = function () {
            $scope.popup.opened = true;
        };
        $scope.dateOptionsTD = {
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            startingDay: 1
        };
        $scope.popupTD = {
            openedTD: false
        };
        $scope.openTD = function () {
            $scope.popupTD.opened = true;
        };
        $scope.dateOptionsCD = {
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),            
            startingDay: 1
        };
        $scope.popupCD = {
            openedCD: false            
        };
        $scope.openCD = function () {
            $scope.popupCD.opened = true;
            $scope.dateOptionsCD.minDate = new Date($scope.badDebtAccount.BadDebtTransferDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
        };
        $scope.getTransactionList = function () {
            baddebtaccountService.getTransactions($scope.badDebtAccount.Id).then(function (response) {
                $scope.originalTransferAmount = $scope.badDebtAccount.TransferAmount;
                $scope.totalPaid = 0;
                response.data.forEach(function (h) {
                    h.TransactionDate = moment(h.TransactionDate).format('DD-MM-YYYY');
                    h.OutstandingAmount = $scope.originalTransferAmount - h.Credit;
                    $scope.originalTransferAmount = $scope.originalTransferAmount - h.Credit;
                    $scope.originalTransferAmount = $scope.originalTransferAmount + h.Debit;
                    $scope.totalPaid += h.Credit;
                });
                $scope.transactionList = response.data;

                console.log(response.data, $scope.transactionList);
            }, AMMS.handleServiceError);
        }

        $scope.getWorkingDate = function () {
            workingDayService.getDateOfBranch($scope.selectedBranchId).then(function (response) {
                $scope.workingDay = commonService.intToDate(response.data.date);
               // if ($scope.badDebtAccount.ClosingDate == null) $scope.badDebtAccount.ClosingDate = moment(commonService.intToDate(response.data.date), "DD.MM.YYYY").format('YYYY-MM-DD');
                $scope.workingDayInt = response.data.date;
            }, AMMS.handleServiceError);
        }

        $scope.beforeStartDateRender = function ($dates) {
            for (d in $dates) {
                if ($dates.hasOwnProperty(d)) {
                    if ($dates[d].utcDateValue != moment($scope.badDebtAccount.DisburseDate).valueOf()) {
                        $dates[d].selectable = false;
                    }
                }
            }
        }

        $scope.beforeStartDateRenderT = function ($dates) {
            for (d in $dates) {
                if ($dates.hasOwnProperty(d)) {
                    if ($dates[d].utcDateValue != moment($scope.badDebtAccount.BadDebtTransferDate).valueOf()) {
                        $dates[d].selectable = false;
                    }
                }
            }
        }
        $scope.statusChange=function() {
            if ($scope.badDebtAccount.Status == $rootScope.LoanConfig.BadDebtAccountStatus.Closed) {
                $scope.badDebtAccount.ClosingDate = new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
                $scope.badDebtAccount.Reason = "3";
            } else {
                $scope.badDebtAccount.ClosingDate = null;
                $scope.badDebtAccount.Reason = "1";
            }

        }

        $scope.beforeStartDateRenderC = function ($dates) {
            $scope.workingDay = moment($scope.workingDayInt.toString().slice(0, 8)).toDate();
            console.log($rootScope.user);
            switch ($rootScope.user.Role) {
                case '1':
                    for (d in $dates) {
                        if ($dates.hasOwnProperty(d)) {
                            if ($dates[d].utcDateValue < moment($scope.workingDay).add(1, 'days').valueOf() && $dates[d].utcDateValue > moment($scope.workingDay).subtract(30, 'days').valueOf()) {
                                $dates[d].selectable = true;
                            } else $dates[d].selectable = false;
                        }
                    }
                    break;
                case '2':
                    for (d in $dates) {
                        if ($dates.hasOwnProperty(d)) {
                            if ($dates[d].utcDateValue == moment($scope.workingDay).add(1, 'days').valueOf()) {
                                $dates[d].selectable = true;
                            } else $dates[d].selectable = false;
                        }
                    }
                    break;
                case '3':
                    for (d in $dates) {
                        if ($dates.hasOwnProperty(d)) {
                            if ($dates[d].utcDateValue == moment($scope.workingDay).add(1, 'days').valueOf()) {
                                $dates[d].selectable = true;
                            } else $dates[d].selectable = false;
                        }
                    }
                    break;
                case '4':
                    for (d in $dates) {
                        if ($dates.hasOwnProperty(d)) {
                            if ($dates[d].utcDateValue == moment($scope.workingDay).add(1, 'days').valueOf()) {
                                $dates[d].selectable = true;
                            } else $dates[d].selectable = false;
                        }
                    }
                    break;
            }
        }

        $scope.reasonFilter = function () {
            return function (item) {
                switch (item.Value) {
                    case $rootScope.badDebtAccountReason.New:
                        if ($scope.badDebtAccount.Status === $rootScope.badDebtAccountStatus.Disbursed) return true;
                        else return false;
                    case $rootScope.badDebtAccountReason.Recieve:
                        if ($scope.badDebtAccount.Status === $rootScope.badDebtAccountStatus.Disbursed) return true;
                        else return false;
                    case $rootScope.badDebtAccountReason.Resloved:
                        if ($scope.badDebtAccount.Status === $rootScope.badDebtAccountStatus.Closed) return true;
                        else return false;
                    case $rootScope.badDebtAccountReason.FullPaid:
                        if ($scope.badDebtAccount.Status === $rootScope.badDebtAccountStatus.Closed) return true;
                        else return false;
                }
                return false;
            };
        }

        $scope.getStatusOptions = function () {
            filterService.getProgramFilterDataByType('BadDebtAccountStatus').then(function (response) {
                $scope.StatusList = response.data;
            }, AMMS.handleServiceError);
        }

        $scope.getReasonOptions = function () {
            filterService.getProgramFilterDataByType('BadDebtAccountReason').then(function (response) {
                $scope.ReasonList = response.data;
            }, AMMS.handleServiceError);
        }

        $scope.getFrequencyOptions = function () {
            baddebtaccountService.getFrequency($scope.badDebtAccount.ReferenceProgramId).then(function (response) {
                $scope.InstallmentFrequencyList = response.data;
            }, AMMS.handleServiceError);
        }

        $scope.clearAndCloseTab = function () {
            $scope.badDebtAccount = {};
            $scope.execRemoveTab($scope.tab);
        };

        $scope.onSubmitBadDebtForm = function () {
            if ($scope.badDebtAccount.Status == $rootScope.LoanConfig.BadDebtAccountStatus.Closed) {
                var dateDifference = moment(moment($rootScope.workingdate).format("YYYY-MM-DD")).diff(moment(moment($scope.badDebtAccount.ClosingDate).format("YYYY-MM-DD")), 'days');
                if ($rootScope.user.Role == $rootScope.UserRole.LO) {
                    if (dateDifference != 0) {
                        swal("LO is allowed to set closing date any back date of current branch working date");
                        return;
                    }
                }
                else if ($rootScope.user.Role == $rootScope.UserRole.RM) {
                    if (dateDifference >30) {
                        swal("RM is not allowed to set closing date before 30 days back date of current branch working date");
                        return;
                    }
                }
                else if ($rootScope.user.Role == $rootScope.UserRole.DM) {
                    if (dateDifference > 90) {
                        swal("DM is not allowed to set closing date before 90 days back date of current branch working date");
                        return;
                    }
                }
            }
            if ($scope.transactionList!=null && $scope.transactionList.length > 0)
                $scope.badDebtAccount.Outstanding = $scope.transactionList[$scope.transactionList.length - 1].OutstandingAmount;
            $scope.badDebtAccount.PaidTotalAmount = $scope.totalPaid;
            if ($scope.badDebtAccount.Status == 2 && $scope.badDebtAccount.Reason == 4 && $scope.badDebtAccount.Outstanding > 0) {
                $scope.badDebtAccount.Status = 1;
                swal("Not Permitted", "User have outstanding amount", "error");
                return;
            }

            if ($scope.badDebtAccount.Status == 2 && $scope.badDebtAccount.Reason == 3 && $scope.badDebtAccount.Outstanding <= 0) {
                //$scope.badDebtAccount.Status = 1;
                swal("Not Permitted", "Outstanding must be greater than zero", "error");
                return;
            }
            //console.log("submitted");
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.editConfirmation, "bad debt account"),
                showCancelButton: true,
                confirmButtonText: "Yes, Edit it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.badDebtAccount.UpdatedBranchWorkingDate = moment($rootScope.workingdate).format('YYYY-MM-DD');
                    $scope.badDebtAccount.DisburseDate =new Date(moment($scope.badDebtAccount.DisburseDate).format('YYYY-MM-DD'));
                    $scope.badDebtAccount.BadDebtTransferDate = new Date(moment($scope.badDebtAccount.BadDebtTransferDate).format('YYYY-MM-DD'));
                    $scope.badDebtAccount.ReceiveDate = $scope.badDebtAccount.ReceiveDate == null ? null : new Date(moment($scope.badDebtAccount.ReceiveDate).format('YYYY-MM-DD'));
                    $scope.badDebtAccount.ClosingDate = $scope.badDebtAccount.Status == $rootScope.LoanConfig.BadDebtAccountStatus.Closed ? new Date(moment($scope.badDebtAccount.ClosingDate).format('YYYY-MM-DD')):null;
                    baddebtaccountService.editAccount($scope.badDebtAccount).
                        then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('baddebtaccount-edit-finished');
                                    swal(
                                        {
                                            title: $rootScope.showMessage($rootScope.editSuccess, $rootScope.badDebtAccount),
                                            text: "Close?",
                                            type: "success",
                                            confirmButtonColor: "#008000",
                                            confirmButtonText: "Ok",
                                            closeOnConfirm: true
                                        },
                                        function (isConfirm) {
                                            if (isConfirm) {
                                                $scope.clearAndCloseTab();
                                            } else {
                                                $scope.clearAndCloseTab();
                                            }
                                        });
                            } else {
                                swal($rootScope.showMessage($rootScope.editError, "Bad Debt Account"), response.data.Message, "error");
                            }
                        });
                } else {
                    swal("Cancelled", "something is wrong", "error");
                }

            });

        }

        $scope.init();
    }
]);