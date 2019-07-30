ammsAng.controller('generalJournalAddController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'generalJournalService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, generalJournalService) {

        $scope.voucher = {};
        $scope.voucher.GlTransactions = [];
        $scope.filters = {};
        $scope.debitSum = 0;
        $scope.creditSum = 0;
        $scope.voucher.Paytochecked = 'NO';
        $scope.voucher.TransactionDate = moment($rootScope.workingdate).format('DD-MM-YYYY');
        ///$rootScope.onlyChildSelectable = false;
        // $rootScope.$broadcast('coa-popup-opened');
        $scope.previouslySelectedHead = "";

        $scope.$on('coa-node-label-double-clicked', function () {
            $scope.viewOptionModifier(true);
            $('#myModalHorizontal').modal('hide');
        });

        $scope.init=function() {

            $scope.getFilterData();
            $scope.addHrmTransaction();
            $scope.addHrmTransaction();
            console.log($scope.voucher);
        }


        $scope.clearPayeeData = function () {

            if ($scope.voucher.Paytochecked === 'NO') {
                $scope.voucher.PayeeName = '';

                $scope.voucher.PayeeAddresss = '';
            }
        }

        $scope.addHrmTransaction=function() {
            $scope.voucher.GlTransactions.push({
                Credit: 0,
                Debit: 0,
                AccountHeadValue: '',
                AccountHeadName: '',
                GlAccountId: '',
                GlAccount: {},
                ChequeNumber:''
            });
        }
        $scope.removeTransaction = function (index) {
            if ($scope.voucher.GlTransactions.length < 3) {
                swal("at least two transactions required!");
                return;
            }
            $scope.voucher.GlTransactions.splice(index, 1);
        }

        $scope.sumDebit = function () {
            $scope.debitSum = 0;
            $scope.voucher.GlTransactions.forEach(function (tr) {
               
                $scope.debitSum += tr.Debit;
            });
        }
        $scope.sumCredit = function () {
            $scope.creditSum = 0;
            $scope.voucher.GlTransactions.forEach(function (tr) {
                $scope.creditSum += tr.Credit;
            });
            
        }
        $scope.debitCreditNonZeroMaker = function (index) {
            if ($scope.voucher.GlTransactions[index].Debit === null) $scope.voucher.GlTransactions[index].Debit = 0;
            if ($scope.voucher.GlTransactions[index].Credit === null) $scope.voucher.GlTransactions[index].Credit = 0;
        }
        $scope.getFilterData=function() {
            generalJournalService.getAddPageFilterData().then(function(response) {
                $scope.filters.AdministrativeDistricts = response.data;
            });
        }
        $scope.loadDistrictwiseBranches=function(districtId,index) {
            generalJournalService.loadDistrictwiseBranches(districtId).then(function(response) {
                $scope.voucher.GlTransactions[index].Branches = response.data;
            });
        }
        $scope.viewOptionModifier = function (bool, index) {
            if (index === undefined || index === null) index = $scope.savedIndex;
            $scope.savedIndex=index;
            $rootScope.listViewShown = bool;
            // $rootScope.onlyChildSelectable = !bool;


            $rootScope.onlyChildSelectable = !bool;
            $rootScope.forAdd = !bool;
            $rootScope.officeType = !bool?3: - 1;
            $rootScope.coAModule = !bool?1: - 1;

            bool ? $rootScope.$broadcast('coa-popup-closed') :
            $rootScope.$broadcast('coa-popup-opened');
             
            if ($scope.previouslySelectedHead !== document.getElementById("myid").value) {
                $scope.voucher.GlTransactions[index].AccountHeadValue = document.getElementById("myid").value;
                $scope.voucher.GlTransactions[index].GlAccountId = document.getElementById("myid").value;
                $scope.voucher.GlTransactions[index].AccountHeadName = document.getElementById("myid").name;
                $scope.voucher.GlTransactions[index].AccountHeadCode = document.getElementById("myid").title;
                $scope.getGlAccountsDetails($scope.voucher.GlTransactions[index].GlAccountId, index);
            } else if (bool && $scope.previouslySelectedHead === document.getElementById("myid").value) {
                swal("nothing is selected!");
            }

            $scope.previouslySelectedHead = angular.copy(document.getElementById("myid").value);

        }

        $scope.setVoucherType=function() {
           // var dcVouchers = $scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.VoucherType === 5);

            var dcVc = $scope.voucher.GlTransactions.filter(gtr =>(gtr.GlAccount.VoucherType === 1 || gtr.GlAccount.VoucherType === 2 || gtr.GlAccount.VoucherType === 5) && (gtr.GlAccount.AccountSubType === 1 || gtr.GlAccount.AccountSubType === 2));

            if (dcVc.length === 1) {
                $scope.voucher.VoucherType = dcVc.filter(gtr => gtr.Credit > 0).length > 0 ? 1 : 2;
                return;
            }
            if (dcVc.length> 1) {
                $scope.voucher.VoucherType = dcVc.filter(gtr =>gtr.AccountSubType===1 && gtr.Credit > 0).length > 0 ? 1 : 2;
                return;
            }
            $scope.voucher.VoucherType = 3;
        }

        $scope.saveVoucher = function () {
            var somethingiswrongmrwong = false;
            var roleWiseRestrictedTr = null;
            $scope.voucher.GlTransactions.forEach(function(gtr,i) {
                if (gtr.AccountHeadCode === undefined || gtr.AccountHeadCode === null) {
                    swal("please select Account Head at  transaction No# " + (i + 1) + " before submitting !");
                    somethingiswrongmrwong = true;
                    return;
                }
                if (gtr.Debit === 0 && gtr.Credit === 0) {
                    swal("Debit and Credit both values are unset at transaction No# " + (i + 1));
                    somethingiswrongmrwong = true;
                    return;
                }
                if ($scope.debitSum !== $scope.creditSum) {
                    swal("Debit and Credit Sum is not Same!");
                    somethingiswrongmrwong = true;
                    return;
                }
                if (($scope.voucher.GlTransactions.filter(gtr => gtr.Credit > 0).length > 1) && ($scope.voucher.GlTransactions.filter(gtr => gtr.Debit > 0).length > 1)) {
                    swal("Multiple Credit GL heads with multiple Debit GL heads transation is not allowed!");
                    somethingiswrongmrwong = true;
                    return;
                }
                if ($scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.InterbranchHead && ((gtr.District === undefined || gtr.District === null) || (gtr.DistrictBranch === undefined || gtr.DistrictBranch === null))).length>0) {
                    swal("please select District and Branch on Interbranch Account Head!");
                    somethingiswrongmrwong = true;
                    return;
                }
                if ($scope.voucher.GlTransactions.map(function(item) {
                    return item.GlAccountId;
                }).filter((v, i, a) => a.indexOf(v) === i).length !== $scope.voucher.GlTransactions.map(function(item) {
                    return item.GlAccountId;
                }).length) {
                    swal("repeating same account head in multiple transactions is not allowed!");
                    somethingiswrongmrwong = true;
                    return;
                }

                
                //var ss = gtr.GlAccount.ManualEntryRole.includes(role);
               
                if (gtr.GlAccount.ManualEntryRole.split(',').filter(g => g === $rootScope.user.Role).length < 1) {
                    roleWiseRestrictedTr = gtr;
                }
                

            });

            if (roleWiseRestrictedTr !== null) {
                swal("The following transaction head (" + roleWiseRestrictedTr.GlAccount.Code + ") is not allowed for current user! please remove this transaction before submitting voucher!");
                return;
            }

            if (somethingiswrongmrwong)return;
                swal({
                    title: 'voucher will be added with amount: ' + $scope.debitSum + '! Are you sure?',
                    //text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.GeneralJournal),
                    //text: 'voucher will be added with amount: ' + $scope.debitSum+'! Are you sure?',
                    showCancelButton: true,
                    confirmButtonText: "yes,Create it!",
                    cancelButtonText: "No,Cancel!",
                    type: 'info',
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                }, function (isConfirmed) {
                    if (isConfirmed) {
                        $scope.voucher.TransactionDate = moment($rootScope.workingdate).format();
                        $scope.voucher.BranchCode = $rootScope.selectedBranchId;
                        $scope.voucher.PostedBranchCode = $rootScope.selectedBranchId;
                        $scope.voucher.BranchWorkingDate = moment($rootScope.workingdate).format();
                        $scope.setVoucherType();
                        $scope.voucher.VoucherGroup = $scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.VoucherGroup === 1).length > 0 ? 1:
                        2;

                        $scope.voucher.GlTransactions.forEach(function(gtr) {
                            gtr.BankAccountId = gtr.BankAccount;
                            gtr.BankAccount = gtr.BankAccountName;
                        });

                        generalJournalService.addGeneralJournal($scope.voucher).then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('voucher-add-finished');
                                swal({
                                    //title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.GeneralJournal),
                                    title: response.data.Message+$scope.debitSum,
                                    text: "What do you want to do next?",
                                    type: "success",
                                    showCancelButton: true,
                                    confirmButtonColor: "#008000",
                                    confirmButtonText: "Add New",
                                    cancelButtonText: "Close and Exit",
                                    closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                    function (isConfirmed) {
                                        if (isConfirmed) {
                                            $timeout(function () { $scope.clearModelData(); }, 300);
                                        } else {
                                            $timeout(function () { $scope.clearAndCloseTab(); }, 300);
                                        }
                                    });
                            } else {
                                
                                swal($rootScope.showMessage($rootScope.addError, $rootScope.GeneralJournal), response.data.Message, "error");
                            }
                        });
                    }
                });

           
        }

        $scope.getGlAccountsDetails=function(accountId, index) {
            generalJournalService.getGlAccountById(accountId, $rootScope.selectedBranchId).then(function (response) {
                $scope.voucher.GlTransactions[index].GlAccount = response.data;
                $scope.voucher.GlTransactions[index].District = null;
                $scope.voucher.GlTransactions[index].DistrictBranch = null;
                if (response.data.InterbranchHead ) {
                    $scope.getAdministrativeDistrictIdByBranchId(index);
                }
                if (response.data.BankAccountId !== null) {
                    $scope.voucher.GlTransactions[index].BankAccount = response.data.BankAccountId;
                    $scope.voucher.GlTransactions[index].BankAccountName = response.data.BankAccountName;
                    

                }
              
            });
        }
        $scope.getAdministrativeDistrictIdByBranchId=function(index) {
            generalJournalService.getAdministrativeDistrictIdByBranchId($rootScope.selectedBranchId).then(function(response) {
                $scope.voucher.GlTransactions[index].District = response.data;
                if (response.data !== null) $scope.loadDistrictwiseBranches(response.data, index);
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

        $scope.init();

    }]);