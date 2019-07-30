ammsAng.controller('cashBankRecPayAddController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'generalJournalService',
    function($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, generalJournalService) {

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

        $scope.init = function() {

            $scope.getCashBankFilterData();

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

        $scope.addHrmTransaction = function() {
            $scope.voucher.GlTransactions.push({
                Credit: 0,
                Debit: 0,
                AccountHeadValue: '',
                AccountHeadName: '',
                GlAccountId: '',
                GlAccount: {}
            });
        }
        $scope.removeTransaction = function(index) {
            if ($scope.voucher.GlTransactions.length < 3) {
                swal("at least two transactions required!");
                return;
            }
            $scope.voucher.GlTransactions.splice(index, 1);
        }

        $scope.sumDebit = function() {
            $scope.debitSum = 0;
            $scope.voucher.GlTransactions.forEach(function(tr) {

                $scope.debitSum += tr.Debit;
            });
        }
        $scope.sumCredit = function() {
            $scope.creditSum = 0;
            $scope.voucher.GlTransactions.forEach(function(tr) {
                $scope.creditSum += tr.Credit;
            });

        }

        $scope.setActualBankObjectToModelAndGetGlAccount=function(bankAccountId) {
            $scope.voucher.Bank = $scope.filters.BankAccounts.filter(ba => ba.Value === bankAccountId)[0];
            $scope.getBankAccountGlHeadOnBankChange($scope.voucher.Bank.AnyAdditionalValue2);
        }


        $scope.debitCreditNonZeroMaker = function(index) {
            if ($scope.voucher.GlTransactions[index].Debit === null) $scope.voucher.GlTransactions[index].Debit = 0;
            if ($scope.voucher.GlTransactions[index].Credit === null) $scope.voucher.GlTransactions[index].Credit = 0;
        }
        $scope.getCashBankFilterData = function() {
            generalJournalService.getCashBankFilterData($scope.selectedBranchId).then(function(response) {
                $scope.filters = response.data;

               // $scope.filtersBackup = angular.copy(response.data);

                generalJournalService.getGlAccountById($scope.filters.CashInHand[0].Value, $scope.selectedBranchId).then(function (response) {
                    $scope.filters.CashInHand[0].GlAccount = response.data;
                });
                $scope.filters.BankAccounts.forEach(function(ba) {
                    var accountType = ba.AnyAdditionalValue === 1 ? 'CA' : 'SND';
                    ba.Name = accountType + '-' + ba.AnyAdditionalString + '(' + ba.Name + ')';
                });
                $scope.filtersBackup = angular.copy($scope.filters);
                $scope.setDefaults();
            });
        }
        $scope.setDefaults = function() {
            $scope.voucher.TransactionType = 1;
            $scope.voucher.Type = 1;
            $scope.getPreLoadedAccountHeads();

        }
        $scope.setDefaultAndGetGlDetails=function() {
            if ($scope.voucher.TransactionType === 1)return;
            $scope.voucher.Bank =$scope.filters.BankAccounts.length>0? $scope.filters.BankAccounts[0]:null;
            $scope.getBankAccountGlHeadOnBankChange($scope.voucher.Bank.AnyAdditionalValue2);
        }
        $scope.getBankAccountGlHeadOnBankChange=function(accountId) {
            generalJournalService.getGlAccountById(accountId,$scope.selectedBranchId).then(function(response) {
                $scope.voucher.Bank.GlAccount = response.data;
                $scope.bank = $scope.voucher.Bank.Value;

            });
        }

        $scope.getPreLoadedAccountHeads =function() {
            generalJournalService.getPreLoadedAccountHeads($scope.voucher.Type, $rootScope.selectedBranchId).then(function (response) {
                $scope.preloadedglaccounts = response.data;
                $scope.voucher.GlTransactions = [];
                $scope.preloadedglaccounts.forEach(function(gla) {
                    $scope.voucher.GlTransactions.push({
                        Credit: 0,
                        Debit: 0,
                        AccountHeadValue: gla.Id,
                        AccountHeadName: gla.Name,
                        GlAccountId: gla.Id,
                        AccountHeadCode:gla.Code,
                        GlAccount: gla,
                        actionRemoved:1
                    });
                });
            });
        }
        $scope.addCashBankTransaction=function() {
            if ($scope.voucher.Bank === undefined) {
                $scope.voucher.GlTransactions.push({
                    Credit: $scope.debitSum,
                    Debit: $scope.creditSum,
                    AccountHeadValue: $scope.filters.CashInHand[0].GlAccount.Id,
                    AccountHeadName: $scope.filters.CashInHand[0].GlAccount.Name,
                    GlAccountId: $scope.filters.CashInHand[0].GlAccount.Id,
                    AccountHeadCode: $scope.filters.CashInHand[0].GlAccount.Code,
                    GlAccount: $scope.filters.CashInHand[0].GlAccount
                });
            } else {
                $scope.voucher.GlTransactions.push({
                    Credit: $scope.debitSum,
                    Debit: $scope.creditSum,
                    AccountHeadValue: $scope.voucher.Bank.GlAccount.Id,
                    AccountHeadName: $scope.voucher.Bank.GlAccount.Name,
                    GlAccountId: $scope.voucher.Bank.GlAccount.Id,
                    AccountHeadCode: $scope.voucher.Bank.GlAccount.Code,
                    GlAccount: $scope.voucher.Bank.GlAccount
                });
            }
        }

        $scope.loadDistrictwiseBranches=function(districtId,index) {
            generalJournalService.loadDistrictwiseBranches(districtId).then(function(response) {
                $scope.voucher.GlTransactions[index].Branches = response.data;
            });
        }



        $scope.$on('coa-node-label-double-clicked', function () {
            $scope.viewOptionModifier(true);
            $('#myModalHorizontalCBRP').modal('hide');
        });


        $scope.viewOptionModifier = function (bool, index) {
            if (index === undefined || index === null) index = $scope.savedIndex;
            $scope.savedIndex=index;
            $rootScope.listViewShown = bool;
            // $rootScope.onlyChildSelectable = !bool;


            $rootScope.onlyChildSelectable = !bool;
            $rootScope.forAdd = !bool;
            $rootScope.officeType = !bool?1: - 1;

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

        //$scope.setVoucherType=function() {
        //   // var dcVouchers = $scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.VoucherType === 5);

        //    var dcVc = $scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.AccountSubType === 1);

        //    if (dcVc.length > 0) {
        //        $scope.voucher.VoucherType = dcVc.filter(gtr => gtr.Credit > 0).length > 0 ? 1 : 2;
        //        return;
        //    }
        //    $scope.voucher.VoucherType = 3;
        //}
        $scope.setVoucherType = function () {
            // var dcVouchers = $scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.VoucherType === 5);

            var dcVc = $scope.voucher.GlTransactions.filter(gtr =>(gtr.GlAccount.VoucherType === 1 || gtr.GlAccount.VoucherType === 2 || gtr.GlAccount.VoucherType === 5) && (gtr.GlAccount.AccountSubType === 1 || gtr.GlAccount.AccountSubType === 2));

            if (dcVc.length === 1) {
                $scope.voucher.VoucherType = dcVc.filter(gtr => gtr.Credit > 0).length > 0 ? 1 : 2;
                return;
            }
            if (dcVc.length > 1) {
                $scope.voucher.VoucherType = dcVc.filter(gtr =>gtr.AccountSubType === 1 && gtr.Credit > 0).length > 0 ? 1 : 2;
                return;
            }
            $scope.voucher.VoucherType = 3;
        }

        $scope.saveVoucher = function() {
            var roleWiseRestrictedTr = null;



          //  var ss = $scope.creditSum === NaN;
            if (isNaN($scope.creditSum) 
                 ||isNaN($scope.debitSum)) {
                swal("please input proper values in amount field!");
                return;
            }

            if ($scope.voucher.GlTransactions.filter(gtr => gtr.Debit + gtr.Credit !== 0).length < 1) {
                swal("please put at least one amount value for an account head to create a voucher!");
                return;
            }

          //  $rootScope.user.Role = "3";
            $scope.voucher.GlTransactions.forEach(function(gtr) {
                if (gtr.GlAccount.ManualEntryRole.split(',').filter(g => g === $rootScope.user.Role).length < 1 && gtr.Credit+gtr.Debit>0) {
                    roleWiseRestrictedTr = gtr;
                }
            });
            if (roleWiseRestrictedTr !== null) {
                swal("The following transaction head (" + roleWiseRestrictedTr.GlAccount.Code + ") is not allowed for current user! please remove this transaction before submitting voucher!");
                return;
            }

            $scope.voucher.GlTransactions.forEach(function(gtr,i) {
                if (gtr.AccountHeadCode === undefined || gtr.AccountHeadCode === null) {
                    swal("please select Account Head at  transaction No# " + (i + 1) + " before submitting !");
                    return;
                }
                //if (gtr.Debit === 0 && gtr.Credit === 0) {
                //    swal("Debit and Credit both values are unset at transaction No# " + (i + 1) );
                //    return;
                //}
                //if ($scope.debitSum !== $scope.creditSum) {
                //    swal("Debit and Credit Sum is not Same!");
                //    return;
                //}
                //if (($scope.voucher.GlTransactions.filter(gtr => gtr.Credit > 0).length > 1) && ($scope.voucher.GlTransactions.filter(gtr => gtr.Debit > 0).length > 1)) {
                //    swal("Many to many debit and credit head transaction is not allowed!");
                //    return;
                //}
                if ($scope.voucher.GlTransactions.filter(gtr => parseInt(gtr.GlAccountId) === $scope.filters.CashInHand[0].GlAccount.Id && gtr.Debit + gtr.Credit !== 0).length > 0) {
                    swal("You cannot set cash account type head for receive/payment transaction!");
                    return;
                }

                if ($scope.voucher.TransactionType === 2 && $scope.filters.BankAccounts.length < 1) {
                    swal("no bank account(s) is configured for this branch! ");
                    return;
                }
                var bankTrBool = false;
                if ($scope.filters.BankHeadGlAccounts.filter(ba => ba.Value !== undefined).length > 0) {
                    $scope.filters.BankHeadGlAccounts.forEach(function (ba) {
                        var bankAccountTransactions = $scope.voucher.GlTransactions.filter(gtr => parseInt(gtr.GlAccountId) === ba.Value);
                        if (bankAccountTransactions.length > 0) {
                            if (bankAccountTransactions[0].Debit + bankAccountTransactions[0].Credit) {
                                bankTrBool = true;
                                return;
                            }
                        }
                    });
                   
                    if (bankTrBool) {
                        swal("You cannot set bank account type head for receive/payment transaction!");
                        return;
                    }

                }

                if ($rootScope.user.Role === $rootScope.rootLevel.BM.toString()) {
                    var bmRestrictionBool = false;
                    if ($scope.filters.RestrictedAccounts.filter(ba => ba.Value !== undefined).length > 0) {
                        $scope.filters.RestrictedAccounts.forEach(function (ra) {
                            var restrictedTransactions = $scope.voucher.GlTransactions.filter(gtr => parseInt(gtr.GlAccountId) === ra.Value);
                            if (restrictedTransactions.length > 0) {
                                if (restrictedTransactions[0].Debit + restrictedTransactions[0].Credit>0) {
                                    bmRestrictionBool = true;
                                    return;
                                }
                            }
                        });
                        if (bmRestrictionBool) {
                            swal("One or more manually selected account(s) is restricted for BM!");
                            return;
                        }
                }
                   

                    //if ($scope.voucher.GlTransactions.filter(gtr => parseInt(gtr.GlAccountId) === $scope.filters.BankAccounts.filter(ba => ba.GlAccount !== undefined)[0].GlAccount.Id && gtr.Debit + gtr.Credit !== 0).length > 0) {
                    //    swal("You cannot set bank account type head for receive/payment transaction!");
                    //    return;
                    //}
                } 
                //if ($scope.voucher.GlTransactions.filter(gtr =>  $scope.filters.BankAccounts.findIndex(ba=>ba.GlAccountId===gtr.GlAccountId)) && gtr.Debit + gtr.Credit !== 0) {
                   
                //}
                //if ($scope.voucher.GlTransactions.filter(gtr => gtr.GlAccountId === $scope.filters.CashInHand[0].GlAccount.Id.toString()) && gtr.Debit + gtr.Credit !== 0) {
                //    swal("You cannot set cash account type head for receive/payment transaction!");
                //    return;
                //}
                if ($scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.InterbranchHead && ((gtr.District === undefined || gtr.District === null) || (gtr.DistrictBranch === undefined || gtr.DistrictBranch === null))).length>0) {
                    swal("please select District and Branch on Interbranch Account Head!");
                    return;
                }
                var allpreloadedTrs = angular.copy($scope.voucher.GlTransactions);
                $scope.addCashBankTransaction();
                $scope.voucher.GlTransactions = angular.copy($scope.voucher.GlTransactions.filter(gtr => gtr.Credit + gtr.Debit !== 0));

                $scope.voucher.GlTransactions.forEach(function(gtr) {
                    gtr.GlAccountId = parseInt(gtr.GlAccountId);
                });

                if ($scope.voucher.GlTransactions.map(function(item) {
                    return item.GlAccountId;
                }).filter((v, i, a) => a.indexOf(v) === i).length !== $scope.voucher.GlTransactions.map(function(item) {
                    return item.GlAccountId;
                }).length) {
                    swal("repeating same account head in multiple transactions is not allowed!");
                    $scope.voucher.GlTransactions = allpreloadedTrs;
                    return;
                }
                $scope.voucher.GlTransactions = allpreloadedTrs;
              
                swal({
                    title: 'voucher will be added with amount: ' + ($scope.debitSum+$scope.creditSum) + '! Are you sure?',
                    //title: "confirm?",
                    //text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.GeneralJournal),
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
                        $scope.voucher.GlTransactions = angular.copy($scope.voucher.GlTransactions.filter(gtr => gtr.Debit + gtr.Credit !== 0));
                        $scope.addCashBankTransaction();
                        $scope.setVoucherType();
                        $scope.voucher.VoucherGroup = $scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.VoucherGroup === 1).length > 0 ? 1:
                        2;

                        generalJournalService.addGeneralJournal($scope.voucher).then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('voucher-add-finished');
                                swal({
                                    title: response.data.Message + ($scope.debitSum+$scope.creditSum),
                                    //title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.GeneralJournal),
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

            });
        }

        //$scope.getGlAccountsDetails=function(accountId, index) {
        //    generalJournalService.getGlAccountById(accountId,$rootScope.selectedBranchId).then(function(response) {
        //        $scope.voucher.GlTransactions[index].GlAccount = response.data;
        //        $scope.voucher.GlTransactions[index].District = null;
        //        $scope.voucher.GlTransactions[index].DistrictBranch = null;
        //        if (response.data.InterbranchHead ) {
        //            $scope.getAdministrativeDistrictIdByBranchId(index);
        //        }
        //    });
        //}
        $scope.getGlAccountsDetails = function (accountId, index) {
            generalJournalService.getGlAccountById(accountId, $rootScope.selectedBranchId).then(function (response) {
                $scope.voucher.GlTransactions[index].GlAccount = response.data;
                $scope.voucher.GlTransactions[index].District = null;
                $scope.voucher.GlTransactions[index].DistrictBranch = null;
                $scope.voucher.GlTransactions[index].BankAccount = null;
                $scope.voucher.GlTransactions[index].BankAccountName = null;
                $scope.voucher.GlTransactions[index].ChequeNumber = null;



                if (response.data.InterbranchHead) {
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
            $scope.filters = $scope.filtersBackup;
            $scope.debitSum = 0;
            $scope.creditSum = 0;
            $scope.voucher.Paytochecked = 'NO';
            $scope.voucher.TransactionDate = moment($rootScope.workingdate).format('DD-MM-YYYY');
            $scope.getCashBankFilterData();
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