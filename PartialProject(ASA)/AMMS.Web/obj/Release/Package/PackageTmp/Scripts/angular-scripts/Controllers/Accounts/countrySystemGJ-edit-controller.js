ammsAng.controller('countrySystemGJEditController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'countrySystemGJService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, countrySystemGJService) {
        $scope.voucher = [];

        // $scope.voucher.GlTransactions = [];
        $scope.filters = {};
        $scope.debitSum = 0;
        $scope.creditSum = 0;
        // $scope.voucher.TransactionDate = moment($rootScope.branchWorkingDay).format('DD-MM-YYYY');
        $scope.deletedVoucher = {};
        // $scope.deletedVoucher.GlTransactions = [];

        $scope.getFilterData = function () {
            countrySystemGJService.getAddPageFilterData().then(function (response) {
                $scope.filters.AdministrativeDistricts = response.data;
            });
        }
        $scope.init = function () {

            $scope.getFilterData();
            $scope.getVoucherInfo();
            // $scope.addHrmTransaction();
            console.log($scope.voucher);

        }
        $scope.$on('coa-node-label-double-clicked', function () {
            $scope.viewOptionModifier(true);
            $('#myModalHorizontal').modal('hide');
        });

        $scope.getVoucherInfo = function () {
            countrySystemGJService.getVoucherById($rootScope.selectedJournalObject.Id).then(function (response) {
                $scope.voucher = response.data;
                $scope.voucher[0].Paytochecked = ($scope.voucher[0].PayeeName === null && $scope.voucher[0].PayeeAddresss === null) ? 'NO' : 'YES';
                $scope.voucherNo = $scope.voucher[0].GlTransactions.length > 0 ? $scope.voucher[0].GlTransactions[0].VoucherNumber : 0;
                $scope.voucher[0].GlTransactions.forEach(function (tr, i) {
                    $scope.loadDistrictwiseBranches(tr.District, i);
                    tr.VoucherNo = $scope.voucher[0].VoucherNo;
                    tr.AccountHeadCode = tr.GlAccountCode;
                    tr.AccountHeadName = tr.GlAccountName;

                    $scope.debitSum += tr.Debit;
                    $scope.creditSum += tr.Credit;
                });
                $scope.voucher.push({
                    GlTransactions: []
                });
                $scope.originalTransactionDate = angular.copy($scope.voucher[0].TransactionDate);
                $scope.voucher[0].TransactionDate = moment($scope.voucher[0].TransactionDate).format('DD-MM-YYYY');
            });
        }


        $scope.sumDebit = function () {
            $scope.debitSum = 0;
            $scope.voucher[0].GlTransactions.forEach(function (tr) {

                $scope.debitSum += tr.RectifiedDebit;
            });
        }
        $scope.sumCredit = function () {
            $scope.creditSum = 0;
            $scope.voucher[0].GlTransactions.forEach(function (tr) {
                $scope.creditSum += tr.RectifiedCredit;
            });

        }
        $scope.debitCreditNonZeroMaker = function (index) {
            if ($scope.voucher[0].GlTransactions[index].RectifiedCredit === null) $scope.voucher[0].GlTransactions[index].RectifiedCredit = 0;
            if ($scope.voucher[0].GlTransactions[index].RectifiedDebit === null) $scope.voucher[0].GlTransactions[index].RectifiedDebit = 0;
        }
        $scope.addHrmTransaction = function () {
            $scope.voucher[0].GlTransactions.push({
                Credit: 0,
                Debit: 0,
                RectifiedCredit: 0,
                RectifiedDebit: 0,
                AccountHeadValue: '',
                AccountHeadName: '',
                GlAccountId: '',
                VoucherNo: $scope.voucher[0].VoucherNo,
                Id: -10000
            });
        }
        $scope.removeTransaction = function (index) {
            if ($scope.voucher[0].GlTransactions.length < 3
                ) {
                swal("at least two transactions required!");
                return;
            }
            if ($scope.voucher[0].GlTransactions[index].Id !== -10000) {
                $scope.voucher[0].GlTransactions[index].RectifiedCredit = 0;
                $scope.voucher[0].GlTransactions[index].RectifiedDebit = 0;
                $scope.voucher[2].GlTransactions.push($scope.voucher[0].GlTransactions[index]);
            }

            $scope.voucher[0].GlTransactions.splice(index, 1);
        }
        $scope.loadDistrictwiseBranches = function (districtId, index) {
            if (districtId === undefined || districtId === null)return;
            countrySystemGJService.loadDistrictwiseBranches(districtId).then(function (response) {
                $scope.voucher[0].GlTransactions[index].Branches = response.data;
            });
        }



        $scope.editVoucher = function () {
            $scope.voucher[0].GlTransactions.forEach(function (gtr, i) {
                if (gtr.AccountHeadCode === undefined || gtr.AccountHeadCode === null) {
                    swal("please select Account Head at  transaction No# " + (i + 1) + " before submitting !");
                    return;
                }
                if (gtr.RectifiedDebit === 0 && gtr.RectifiedCredit === 0) {
                    swal("Debit and Credit both values are unset at transaction No# " + (i + 1));
                    return;
                }
                if ($scope.debitSum !== $scope.creditSum) {
                    swal("Debit and Credit Sum is not Same!");
                    return;
                }
                if (($scope.voucher[0].GlTransactions.filter(gtr => gtr.RectifiedCredit > 0).length > 1) && ($scope.voucher[0].GlTransactions.filter(gtr => gtr.RectifiedDebit > 0).length > 1)) {
                    swal("Multiple Credit GL heads with multiple Debit GL heads transation is not allowed!");
                    return;
                }
                if ($scope.voucher[0].GlTransactions.filter(gtr => gtr.GlAccount.InterbranchHead && ((gtr.District === undefined || gtr.District === null) || (gtr.DistrictBranch === undefined || gtr.DistrictBranch === null))).length > 0) {
                    swal("please select District and Branch on Interbranch Account Head!");
                    return;
                }
                if ($scope.voucher[0].GlTransactions.map(function (item) {
                    return item.GlAccountId;
                }).filter((v, i, a) => a.indexOf(v) === i).length !== $scope.voucher[0].GlTransactions.map(function (item) {
                    return item.GlAccountId;
                }).length) {
                    swal("repeating same account head in multiple transactions is not allowed!");
                    return;
                }
                swal({
                    title: 'voucher will be edited with amount: ' + $scope.debitSum + '! Are you sure?',
                   // text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.GeneralJournal),
                    showCancelButton: true,
                    confirmButtonText: "yes,Update it!",
                    cancelButtonText: "No,Cancel!",
                    type: 'info',
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                }, function (isConfirmed) {
                    if (isConfirmed) {
                        $scope.voucher[0].CreatedOn = moment($rootScope.workingdate).format();
                        var ss = new Date($scope.voucher[0].TransactionDate);
                        $scope.voucher[0].TransactionDate = moment($scope.originalTransactionDate).format();
                        $scope.voucher[0].PostedBranchCode = $rootScope.selectedBranchId;
                        $scope.voucher.splice(1, 1);

                        countrySystemGJService.editGeneralJournal($scope.voucher).then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('voucher-edit-finished');
                                //swal({
                                //    title: $rootScope.showMessage($rootScope.editSuccess, $rootScope.GeneralJournal),
                                //    text: "What do you want to do next?",
                                //    type: "success",
                                //    showCancelButton: true,
                                //    confirmButtonColor: "#008000",
                                //    cancelButtonText: "Close and Exit",
                                //    closeOnConfirm: true,
                                //    closeOnCancel: true
                                //},
                                //    function (isConfirmed) {
                                //        if (isConfirmed) {
                                //            $timeout(function () { $scope.clearModelData(); }, 300);
                                //        } else {
                                //            $timeout(function () { $scope.clearAndCloseTab(); }, 300);
                                //        }
                                //    });
                               // swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.GeneralJournal), "Successful!", "success");
                               swal("Vocher is edited with code:  " + $scope.voucher[0].VoucherNo + " and with Amount: " + $scope.debitSum);
                                $timeout(function () { $scope.clearModelData(); }, 300);
                                $scope.clearAndCloseTab();
                            } else {

                                swal($rootScope.showMessage($rootScope.editError, $rootScope.GeneralJournal), response.data.Message, "error");
                            }
                        });
                    }
                });

            });
        }

        $scope.clearModelData = function () {
            $scope.voucher = {};
            $scope.voucher.GlTransactions = [];
            $scope.filters = {};
            $scope.debitSum = 0;
            $scope.creditSum = 0;
            $scope.voucher.Paytochecked = 'NO';
            $scope.voucher.TransactionDate = moment($rootScope.workingdate).format('DD-MM-YYYY');
            $scope.addHrmTransaction();
        }
        $scope.clearAndCloseTab = function () {
            $scope.voucher = {};

            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

        $scope.viewOptionModifier = function (bool, index) {
            if (index === undefined || index === null) index = $scope.savedIndex;
            $scope.savedIndex = index;
            $rootScope.listViewShown = bool;


            $rootScope.onlyChildSelectable = !bool;
            $rootScope.forAdd = !bool;
            $rootScope.officeType = !bool ? 2 : -1;
            $rootScope.coAModule = !bool ? 1 : -1;

            bool ? $rootScope.$broadcast('coa-popup-closed') :
             $rootScope.$broadcast('coa-popup-opened');
            //$scope.voucher[0].GlTransactions[index].AccountHeadValue = document.getElementById("myid").value;
            //$scope.voucher[0].GlTransactions[index].GlAccountId = document.getElementById("myid").value;
            //$scope.voucher[0].GlTransactions[index].AccountHeadName = document.getElementById("myid").name;
            //$scope.voucher[0].GlTransactions[index].AccountHeadCode = document.getElementById("myid").title;
            if ($scope.previouslySelectedHead !== document.getElementById("myid").value) {
                $scope.voucher[0].GlTransactions[index].AccountHeadValue = document.getElementById("myid").value;
                $scope.voucher[0].GlTransactions[index].GlAccountId = document.getElementById("myid").value;
                $scope.voucher[0].GlTransactions[index].AccountHeadName = document.getElementById("myid").name;
                $scope.voucher[0].GlTransactions[index].AccountHeadCode = document.getElementById("myid").title;
                $scope.getGlAccountsDetails($scope.voucher[0].GlTransactions[index].GlAccountId, index);
            } else if (bool && $scope.previouslySelectedHead === document.getElementById("myid").value) {
                swal("nothing is selected!");
            }

            $scope.previouslySelectedHead = angular.copy(document.getElementById("myid").value);

        }
        $scope.getGlAccountsDetails = function (accountId, index) {
            countrySystemGJService.getGlAccountById(accountId, $rootScope.selectedBranchId).then(function (response) {
                $scope.voucher[0].GlTransactions[index].GlAccount = response.data;
                $scope.voucher.GlTransactions[index].District = null;
                $scope.voucher.GlTransactions[index].DistrictBranch = null;
                if (response.data.InterbranchHead) {
                    $scope.getAdministrativeDistrictIdByBranchId(index);
                }
                if (response.data.BankAccountId !== null) {
                    $scope.voucher[0].GlTransactions[index].BankAccount = response.data.BankAccountId;
                    $scope.voucher[0].GlTransactions[index].BankAccountName = response.data.BankAccountName;
                }
            });
        }
        //$scope.setVoucherType = function () {
        //    var dcVouchers = $scope.voucher[0].GlTransactions.filter(gtr => gtr.GlAccount.VoucherType === 5);
        //    if (dcVouchers.length > 0) {
        //        $scope.voucher[0].VoucherType = dcVouchers.filter(gtr => gtr.Credit > 0).length > 0 ? 1 : 2;
        //        return;
        //    }
        //    $scope.voucher[0].VoucherType = 3;
        //}


        $scope.init();

    }]);