ammsAng.controller('badDebtTransferController', [
    '$scope', '$rootScope', '$timeout', 'loanaccountService', 'branchService', 'filterService', 'loanGroupService', 'productService', 'workingDayService', 'commonService',
    'savingsAccountService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'documentService', 'feeService', 'badDebtService', 'transferService',
    function ($scope, $rootScope, $timeout, loanaccountService, branchService, filterService, loanGroupService, productService, workingDayService, commonService,
        savingsAccountService, DTOptionsBuilder, DTColumnDefBuilder, documentService, feeService, badDebtService, transferService) {
        var declareVariable = function () {
            $scope.transfer = {};
            $scope.transfer.MemberId = $scope.selectedMenu.Id;
            $scope.transfer.BranchWorkingDate = $rootScope.workingdate;
            $scope.transfer.TransferDate = $scope.transfer.BranchWorkingDate;
            $scope.transfer.MemberTransferDate = moment($rootScope.workingdate).format();
            $scope.groupId = $scope.selectedMenu.GroupId;
            $scope.transfer.BranchId = $scope.selectedBranchId;
            $scope.Transferabledates = [];
            $scope.HolidayArr = [];

        }

        declareVariable();
        $scope.changeCssStyle = function(istranferable) {
            return istranferable ? { 'background-color': '#c9e2a5' } : { 'background-color': '#e2bda5' };
        }

        $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0)
                    .withOption("color", "black"),
                DTColumnDefBuilder.newColumnDef(1)
                    .withOption('autoWidth', false)
        ];

        $scope.beforeStartDateRender = function ($dates) {
            for (d in $dates) {
                if ($dates[d].utcDateValue >= moment($rootScope.workingdate).add(1, 'days').valueOf()) {
                    $dates[d].selectable = false;
                }
            }
        }

        $scope.clearAndCloseTab = function () {
            $scope.transfer = {};
            $scope.removeTab($scope.tab);
        };

        $scope.$on('loanGroup-add-finished', function () {
            $scope.getBadDebtGroup();
        });

        $scope.getBadDebtData = function () {
            console.log($scope.transfer.BranchId);
            $scope.transfer.BranchWorkingDate = moment($scope.transfer.BranchWorkingDate).format();
            badDebtService.getBadDebtData($scope.transfer.MemberId, $scope.transfer.BranchWorkingDate, $scope.transfer.BranchId).then(function (response) {
                console.log(response.data);
                $scope.transfer = response.data;
                if ($scope.groupList.length > 0) $scope.transfer.GroupId = $scope.groupList[0].Value;
                $scope.transfer.MemberTransferDate = moment($rootScope.workingdate).format();
                $scope.transfer.LoanAccounts.forEach(function (l) {
                    l.DisburseDate = moment(l.DisburseDate).format('DD-MM-YYYY');
                    l.OutstandingAmount = Math.round(l.OutstandingAmount);
                    if (l.IsTransferable)
                        $scope.transfer.TransferAmount += l.OutstandingAmount;
                });
                var currentYear = moment($scope.transfer.MemberTransferDate).format('YYYY');
                console.log(currentYear);
                var yearLastdate = new Date("12/31/" + currentYear);
                console.log(yearLastdate);
                var lastJuneDate = new Date("06/30/" + currentYear);
                

                $scope.transfer.Holidays.forEach(function (h) {
                    h = moment(h).format('DD-MM-YYYY');
                    $scope.HolidayArr.push(h);
                });
                console.log($scope.HolidayArr);


                while ($scope.HolidayArr.indexOf(moment(yearLastdate).format('DD-MM-YYYY')) !== -1) {
                    yearLastdate = moment(yearLastdate).add(-1, 'days');
                }
                while ($scope.HolidayArr.indexOf(moment(lastJuneDate).format('DD-MM-YYYY')) !== -1) {
                    lastJuneDate = moment(lastJuneDate).add(-1, 'days');
                }
                $scope.Transferabledates.push(moment(yearLastdate).format('DD-MM-YYYY'));
                $scope.Transferabledates.push(moment(lastJuneDate).format('DD-MM-YYYY'));

            });
            $("#loadingImage").css("display", "none");
        }
        $scope.getBadDebtGroup = function () {
            console.log($scope.programOfficerId);
            badDebtService.getBadDebtGroup($scope.programOfficerId).then(function (response) {
                console.log(response.data);
                $scope.groupList = response.data;
                if ($scope.groupList.length > 0) $scope.transfer.GroupId = $scope.groupList[0].Value;
            });
        }

        $scope.getGroupDetails = function () {
            loanGroupService.getloanGroup($scope.groupId).then(function (response) {
                console.log(response.data);
                $scope.programOfficerId = response.data.ProgramOfficerId;
                $scope.getBadDebtGroup();
            }, AMMS.handleServiceError);
        }

        $scope.init = function () {
            $("#loadingImage").css("display", "block");
            $scope.getGroupDetails();
            $scope.getBadDebtData();

        }

        $scope.init();

        $scope.transferBadDebt = function () {
            var warningMessage = [];
            var Istransferable = true;

            if ($scope.HolidayArr.indexOf(moment($scope.transfer.MemberTransferDate).format('DD-MM-YYYY')) !== -1) {
                warningMessage.push("Selected Date is holiday");
                Istransferable = false;
            }
            //if ($scope.Transferabledates.indexOf(moment($scope.transfer.MemberTransferDate).format('DD-MM-YYYY')) === -1) {
            //    warningMessage.push("Date Must Be Last Working Day of June Or December");
            //    Istransferable = false;
            //}
            for (var i = 0; i < $scope.transfer.LoanAccounts.length; i++) {
                if (!$scope.transfer.LoanAccounts[i].IsTransferable) {
                    warningMessage.push("Loan Account Not Transferable");
                    Istransferable = false;
                    break;
                }
            }
            //if (!$scope.transfer.IsMembersSavingAccountClosed) {
            //    warningMessage.push("Savings/ Security account not closed");
            //    Istransferable = false;
            //}

            if (!$scope.transfer.IsCBSandLTSAccountClosed) {
                warningMessage.push("LTS/ CBS account not closed");
                Istransferable = false;
            }
            if (!$scope.transfer.IsGeneralAccountsBalanceZero) {
                warningMessage.push("Savings account Balance not zero");
                Istransferable = false;
            }
            if (!Istransferable) {
                var message = "";
                warningMessage.forEach(function (w, i) {
                    message += (i + 1) + ") " + w + "\n";
                });
                swal(message);
                return;
            }
            $scope.transfer.BranchWorkingDate = moment($rootScope.workingdate).format();
            $scope.transfer.TransferDate = moment($scope.transfer.MemberTransferDate).format();
            transferService.IsMemberInTransferTransitState($scope.selectedMenu.Id, $rootScope.selectedBranchId).then(function (response) {
                if (response.data) {
                    swal("The Member is in Transfer Transit State");
                    return;
                }
                swal({
                        title: $rootScope.showMessage($rootScope.transferConfirmation, 'Member'),
                        showCancelButton: true,
                        confirmButtonText: "Yes, Transfer it!",
                        cancelButtonText: "No, cancel !",
                        type: "info",
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true
                    },
                    function(isConfirmed) {
                        if (isConfirmed) {
                            badDebtService.transferMember($scope.transfer).then(function(response) {
                                if (response.data.Success) {
                                    $rootScope.$broadcast('baddebt-transfer-finished');
                                    swal($rootScope.showMessage($rootScope.transferSuccess, 'member'), "Successful!", "success");
                                    $scope.clearAndCloseTab();
                                    $scope.getMenus();
                                } else {
                                    swal($rootScope.showMessage($rootScope.transferError, 'member'), "", "error");
                                }
                            }, AMMS.handleServiceError);
                        } else {
                            swal("Cancelled", "something is wrong", "error");
                        }
                    });
            });
        }
    }
]);