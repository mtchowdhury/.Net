ammsAng.controller('savingsAccountEditController', ['$rootScope',
    '$scope', 'savingsProductService', 'savingsAccountService', 'transferService', 'filterService', 'documentService', 'loanaccountService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'workingDayService', 'feeService', 'memberDailyTransactionService',
    function ($rootScope, $scope, savingsProductService, savingsAccountService, transferService, filterService, documentService, loanaccountService, DTOptionsBuilder, DTColumnDefBuilder, workingDayService, feeService, memberDailyTransactionService) {
        $scope.editAccount = {};
        $scope.ProductList = [];
        $scope.transactionSummary = [];
        $scope.InstallmentFrequencyList = [];
        $scope.StatusList = [];
        $scope.MeetingDateList = [];
        $scope.InstallmentFrequencyListTemp = [];
        $scope.files = [];
        $scope.MandatorySavingsAmount = [];
        $scope.productDetails = null;
        var prodChange = false;
        $scope.LTSMinDeposits = [];
        $scope.amountfreqList = [];
        $scope.isDurationDisabled = false;
        $scope.isFrequencyDisabled = false;
        $scope.changeFrequency = false;
        $scope.CbsMinDepositWeekly = [];
        $scope.CbsMinDepositMonthly = [];
        $scope.DisbaleMinDeposit = false;
        $scope.nomineePercentage = 0;
        $scope.uploadedFiles = [];
        $scope.roleId = $rootScope.user.Role;
        $scope.paymentmethodList = null;
        $scope.amountLebel = "Total Return Amount";
        $scope.closingDateLabel = "Return Date";
        $scope.SavingsAccountPreviousStatus = null;
        $scope.previousClosingDate = null;
        $scope.savedSavingsAccountDetails = null;
        $scope.currentAccountId = angular.copy($rootScope.editSavingsAccountId);
        $scope.currentType = angular.copy($rootScope.currentType);

        $scope.editAccount.MemberId = $scope.selectedMenu.Id;

        $scope.branchWorkingDay = moment($rootScope.workingdate).format('YYYY-MM-DD');
        if ($scope.tab.id.includes("1034")) $scope.rootType = 1;
        else $scope.rootType = 2;


        $scope.onInstallmentTypeChange=function() {
            if ($scope.editAccount.InstallmentFrequencyId == $rootScope.SavingsConfig.InstallmentFrequencyId.Weekly) {
                $scope.editAccount.IsSyncWithMeetingDay = true;
             }
        }

        $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0)
                    .withOption("color", "black"),
                DTColumnDefBuilder.newColumnDef(1)
                    .withOption('width', '40%')
        ];
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [[2, 'asc']]);
        for (var i = 1; i <= 31; i++) $scope.MeetingDateList.push({ Name: i, Value: i + "" });



        $scope.$watch('files', function () {
            $scope.docSizeBoolChecker();
        });
        $scope.$watch('uploadedFiles', function () {
            $scope.docSizeBoolChecker();
        });

        $scope.docSizeBoolChecker = function () {
            $scope.fileSize = 0;
            $scope.uploadedFiles.forEach(function (file) {
                $scope.fileSize += file.Size;
                if ($scope.fileSize > (1024 * 1024) * ($rootScope.documentSize)) {
                    $scope.docError = true;
                    return;
                }
            });
            $scope.files.forEach(function (file) {
                $scope.fileSize += file.size;
                if ($scope.fileSize > (1024 * 1024) * ($rootScope.documentSize)) {
                    $scope.docError = true;
                    return;

                } else {
                    $scope.docError = false;
                }

            });
        }



        $scope.beforeStartDateRender = function ($dates) {
            var maxDate = moment($scope.branchWorkingDay).format("YYYY-MM-DD");
            //var minDate = new Date($scope.branchWorkingDay);
            //$scope.minDate = new Date($scope.minDate).setHours(0, 0, 0, 0);
            //if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.BM) {
            //    minDate.setDate(minDate.getDate() + 1);
            //    minDate = new Date(minDate).setHours(0, 0, 0, 0);
            //} else if ($scope.roleId == $rootScope.rootLevel.RM) {
            //    minDate.setDate(minDate.getDate() - 30);
            //    minDate = new Date(minDate).setHours(0, 0, 0, 0);
            //} else if ($scope.roleId == $rootScope.rootLevel.DM) {
            //    minDate.setDate(minDate.getDate() - 90);
            //    minDate = new Date(minDate).setHours(0, 0, 0, 0);
            //} else if ($scope.roleId == $rootScope.rootLevel.Admin) {
            //    //minDate.setDate(minDate.getDate() - 90);
            //    minDate = new Date('1990-1-1').setHours(0, 0, 0, 0);
            //}
            //if ($scope.editAccount.HasTransaction) {
            //    minDate = new Date($scope.branchWorkingDay);
            //    minDate.setDate(minDate.getDate() - 90);
            //    minDate = new Date(minDate).setHours(0, 0, 0, 0);
            //}
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        //if ($dates[d].utcDateValue < minDate || $dates[d].utcDateValue > maxDate || $dates[d].utcDateValue < $scope.minDate) {
                        //    $dates[d].selectable = false;
                        //}
                        if (moment($dates[d].utcDateValue).format("YYYY-MM-DD") > maxDate) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }
        };

        $scope.beforeClosingDateRender = function ($dates) {
            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        if ($dates[d].utcDateValue < minDate.valueOf() || $dates[d].utcDateValue > maxDate.valueOf()) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }
        }
        $scope.statusChange = function () {
            if ($scope.editAccount.Status === $rootScope.SavingsConfig.SavingsAccountStatus.Active) {
                $scope.InterestAmountToShow = 0;
                $scope.editAccount.TotalReturnAmount = 0;
                $scope.editAccount.ClosingDate = null;
                $scope.ReasonList = $scope.ReasonListMain.filter(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Open ||
                    r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Normal || r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.EarlySettlement ||
                    r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.ReOpen);
                $scope.editAccount.Flag = $scope.ReasonList.find(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Open).Value;
            }
            if ($scope.editAccount.Status === $rootScope.SavingsConfig.SavingsAccountStatus.Closed) {
                if ($scope.interestAmount) {
                    $scope.InterestAmountToShow = Math.round($scope.interestAmount);
                    $scope.editAccount.TotalReturnAmount = $scope.savedSavingsAccountDetails.TotalReturnAmount + $scope.interestAmount;
                    $scope.editAccount.TotalReturnAmount = Math.round($scope.editAccount.TotalReturnAmount);
                } else {
                    $("#loadingImage").css("display", "block");
                    $scope.interestAmount = null;
                    savingsAccountService.getInterestAmountByClosingDate($scope.currentAccountId, moment($rootScope.workingdate).format("YYYY-MM-DD")).then(function (response) {
                        $scope.editAccount.TotalInterestEarned = response.data;
                        $scope.InterestAmountToShow = Math.round($scope.editAccount.TotalInterestEarned);
                        $scope.interestAmount = angular.copy(response.data);
                        $scope.editAccount.TotalReturnAmount = $scope.savedSavingsAccountDetails.TotalReturnAmount + $scope.interestAmount;
                        $scope.balanceAndInterestCalculation();
                        $("#loadingImage").css("display", "none");
                    });
                }

                // $scope.editAccount.ClosingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                $scope.editAccount.ClosingDate = new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
                $scope.ReasonList = $scope.ReasonListMain.filter(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Lapsed || r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Return);
                if ($scope.editAccount.CategoryId == $rootScope.SavingsConfig.SavingsProductType.CBS) {
                    $scope.ReasonList = $scope.ReasonListMain.filter(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Lapsed || r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Return || r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Resolve);
                }
                $scope.editAccount.Flag = $scope.ReasonList.find(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Return).Value;
                $scope.editAccount.PaymentMethodId = $rootScope.LoanPaymentMethod.Cash;
            }
            if ($scope.editAccount.Status === $rootScope.SavingsConfig.SavingsAccountStatus.Active && $scope.SavingsAccountPreviousStatus === $rootScope.SavingsConfig.SavingsAccountStatus.Closed) {
                $scope.ReasonList = $scope.ReasonListMain.filter(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.ReOpen);
                $scope.editAccount.Flag = $scope.ReasonList.find(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.ReOpen).Value;
                $scope.editAccount.PaymentMethodId = $rootScope.LoanPaymentMethod.Cash;
            }
            $scope.paymentMethodChange();
            $scope.flagChange();
        }
        $scope.filterFlag = function () {
            //$scope.editAccount.Flag && $scope.editAccount.PaymentMethodId manipulation commd out upon authors confirmation
            if ($scope.editAccount.Status === $rootScope.SavingsConfig.SavingsAccountStatus.Active) {
                $scope.InterestAmountToShow = 0;
                $scope.editAccount.ClosingDate = null;
                $scope.ReasonList = $scope.ReasonListMain.filter(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Open ||
                    r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Normal || r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.EarlySettlement ||
                    r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.ReOpen);
                // $scope.editAccount.Flag = $scope.ReasonList.find(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Open).Value;
            } else {
                $scope.InterestAmountToShow = Math.round($scope.editAccount.TotalInterestEarned);
            }
            if ($scope.editAccount.Status === $rootScope.SavingsConfig.SavingsAccountStatus.Closed) {
                $scope.ReasonList = $scope.ReasonListMain.filter(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Lapsed || r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Return);
                if ($scope.editAccount.CategoryId == $rootScope.SavingsConfig.SavingsProductType.CBS) {
                    $scope.ReasonList = $scope.ReasonListMain.filter(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Lapsed || r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Return || r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Resolve);
                }
                // $scope.editAccount.Flag = $scope.ReasonList.find(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.Return).Value;
                //$scope.editAccount.PaymentMethodId = $rootScope.LoanPaymentMethod.Cash;
            }
            if ($scope.editAccount.Status === $rootScope.SavingsConfig.SavingsAccountStatus.Active && $scope.SavingsAccountPreviousStatus === $rootScope.SavingsConfig.SavingsAccountStatus.Closed) {
                $scope.ReasonList = $scope.ReasonListMain.filter(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.ReOpen);
                // $scope.editAccount.Flag = $scope.ReasonList.find(r => r.Value === $rootScope.SavingsConfig.SavingsAccountFlag.ReOpen).Value;
                // $scope.editAccount.PaymentMethodId = $rootScope.LoanPaymentMethod.Cash;
            }
        }
        $scope.flagChange = function () {
            if ($scope.editAccount.Flag) {
                if ($scope.editAccount.Flag == $rootScope.SavingsConfig.SavingsAccountFlag.Lapsed) {
                    if ($scope.roleId != $rootScope.rootLevel.RM && $scope.roleId != $rootScope.rootLevel.DM && $scope.roleId != $rootScope.rootLevel.Admin) {
                        swal("You are not allowed to close account with Lapsed");
                        $scope.editAccount.Flag = $rootScope.SavingsConfig.SavingsAccountFlag.Return;
                        return;
                    }
                    $scope.editAccount.ClosingDate =new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
                    $scope.editAccount.PaymentMethodId = null;
                    $scope.editAccount.BankAccountId = null;
                    $scope.editAccount.ChequeNo = null;
                    $scope.editAccount.IsAccountPayable = null;
                    $scope.amountLebel = "Total Lapsed Amount";
                    $scope.closingDateLabel = "Lapsed Date";


                } else {
                    $scope.amountLebel = "Total Return Amount";
                    $scope.closingDateLabel = "Return Date";
                    $scope.editAccount.ClosingDate = new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
                }
                if ($scope.editAccount.Flag == $rootScope.SavingsConfig.SavingsAccountFlag.Resolve)
                    $scope.balanceAndInterestCalculation();
            }
        }
        $scope.paymentMethodChange = function () {
            if ($scope.editAccount.PaymentMethodId == $rootScope.LoanPaymentMethod.Cash) {
                $scope.editAccount.BankAccountId = null;
                $scope.editAccount.ChequeNo = null;
                $scope.CashOrCheck = false;
            } else {
                $scope.CashOrCheck = true;
            }
        }
        $scope.getPaymentMethods = function () {
            $("#loadingImage").css("display", "block");
            filterService.getTransactionProcess('DailyTransactionProcess').then(function (response) {
                $scope.paymentmethodList = response.data;
            });
        }
        $scope.adjustDateValiatorRender = function ($dates) {
            for (d in $dates) {
                if ($dates.hasOwnProperty(d)) {
                    if ($dates[d].utcDateValue < $scope.editAccount.OpeningDate) {
                        $dates[d].selectable = false;
                    }
                }
            }
        }

        $scope.PercentageValidator = function (percentange) {
            var validatorObj = { message: null };
            validatorObj.message = "percentage can not be greater than 100%";
            if (percentange <= 100) return true;
            else return validatorObj;
        }

        $scope.getAccountDetails = function () {

            $scope.editID = angular.copy($scope.currentAccountId);
            savingsAccountService.getAccountDetails($scope.currentAccountId).then(function (response) {
                $scope.editAccount = response.data;
                console.log($scope.editAccount);
                $scope.savedSavingsAccountDetails = angular.copy(response.data);
                $scope.SavingsAccountPreviousStatus = response.data.Status;
                $scope.originalFrequency = angular.copy(response.data.InstallmentFrequencyId);
                $scope.originalMinDeposit = angular.copy(response.data.MinimumDepositAmount);
                $scope.previousClosingDate = $scope.editAccount.ClosingDate;
                $scope.editAccount.PaymentMethodId = $scope.editAccount.PaymentMethodId.toString();
                if ($scope.editAccount.Status == $rootScope.SavingsConfig.SavingsAccountStatus.Active) {
                    $scope.editAccount.TotalReturnAmount = 0;
                }
                if ($scope.savedSavingsAccountDetails.CategoryId == $rootScope.AccountType.CBS
                   && $scope.savedSavingsAccountDetails.Status == $rootScope.SavingsConfig.SavingsAccountStatus.Closed
                   && $scope.savedSavingsAccountDetails.Flag == $rootScope.SavingsConfig.SavingsAccountFlag.Resolve) {
                    $scope.editAccount.TotalReturnAmount = $scope.editAccount.TotalReturnAmount * 2;
                }
                $scope.editAccount.OpeningDate = new Date($scope.editAccount.OpeningDate);
                $scope.editAccount.ClosingDate = $scope.editAccount.ClosingDate === null ? null : new Date(moment($scope.editAccount.ClosingDate).format("YYYY-MM-DD"));

                console.log($scope.editAccount);
                feeService.getFeeConfig("FeeType").then(function (response) {
                    $scope.editAccount.AccountFeeInfo.forEach(function (fee) {
                        fee.Type = response.data.filter(e => e.value == fee.TypeId)[0].text;
                    });
                });
                if ($scope.editAccount.Nominee.length > 0) $scope.otherInfo = true;
                $scope.setProgramDetails();
                $scope.getBankAccounts();
                $scope.getAllPrograms();
                documentService.getFilesbyEntity(response.data.Id, $rootScope.FileUploadEntities.SavingsAccount).then(function (res) {
                    console.log(res);
                    $scope.uploadedFiles = res.data;
                    $rootScope.SavingsAccountFileHash = res.data && res.data.length > 0 ? res.data[0].Hash : '';
                }, AMMS.handleServiceError);
                $scope.filterFlag();
                $scope.paymentMethodChange();
                $scope.getLoanAccountDetails();
               
            }, AMMS.handleServiceError);

            savingsProductService.getAll().then(function (response) {
                $scope.savingsProdsMain = response.data;
                $scope.savingsProdsMain.forEach(function (p) {
                    if (p.Id === $scope.editAccount.ProductId)
                        $scope.sProdId = p.ProductId;
                });
                $scope.savingsProdsMain = $scope.savingsProdsMain.filter(p => p.ProductId === $scope.sProdId);

                $scope.minDate = moment();
                $scope.savingsProdsMain.forEach(function (s) {
                    if (moment(s.StartDate) < $scope.minDate) $scope.minDate = moment(s.StartDate);
                });
            });


        }

        $scope.getTransactionSummary = function () {
            savingsAccountService.getTransactionSummary($scope.currentAccountId)
                .then(function (response) {
                    $scope.transactionSummary = response.data;
                    console.log($scope.transactionSummary);
                    $scope.savingsBalance = $scope.transactionSummary!=null && $scope.transactionSummary.length>0 ? $scope.transactionSummary[$scope.transactionSummary.length - 1].Balance : 0;
                    $scope.balanceAndInterestCalculation();
                    console.log('Savings Balance '+$scope.savingsBalance);
                    $("#loadingImage").css("display", "none");
                });

        }

        $scope.ChangeOpeningDate = function () {
            if (!$scope.isHolidayOrOffDay()) {
                swal('Selected date is holiday or Offday');
                $scope.editAccount.OpeningDate = $scope.savedSavingsAccountDetails.OpeningDate;
                return;
            }
            $scope.savingsProds = $scope.savingsProdsMain.filter(a => $scope.editAccount.OpeningDate >= moment(a.StartDate) && ($scope.editAccount.OpeningDate <= moment(a.EndDate) || a.EndDate == null));
            var max = 0;
            $scope.savingsProds.forEach(function (s) {
                if (s.VersionId > max) {
                    max = s.VersionId;
                    $scope.editAccount.ProductId = s.Id;
                }
            });
            prodChange = true;
            $scope.setProgramDetails();
        }
        $scope.isHolidayOrOffDay = function () {
            var returnValue = true;
            $scope.branchHolidayAndOffDay.forEach(function(h) {
                if (returnValue) {
                    if (moment(h).format('YYYY-MM-DD') === moment($scope.editAccount.OpeningDate).format('YYYY-MM-DD')) {
                        console.log(moment(h).format('YYYY-MM-DD'));
                        returnValue = false;
                    }
                }
            });
            return returnValue;
        }
        $scope.getInterestAmountByClosingDate = function () {
            $("#loadingImage").css("display", "block");
            $scope.interestAmount = null;

            savingsAccountService.getInterestAmountByClosingDate($scope.currentAccountId, moment($scope.editAccount.ClosingDate).format("YYYY-MM-DD")).then(function (response) {
                $scope.editAccount.TotalInterestEarned = response.data;
                $scope.InterestAmountToShow = Math.round($scope.editAccount.TotalInterestEarned);
                $scope.interestAmount = angular.copy(response.data);
                $scope.balanceAndInterestCalculation();
                $("#loadingImage").css("display", "none");
            });
        }
        $scope.balanceAndInterestCalculation = function () {
            if ($scope.editAccount.Status == $scope.savedSavingsAccountDetails.Status && $scope.editAccount.Flag == $scope.savedSavingsAccountDetails.Flag) {
                $scope.editAccount.TotalReturnAmount = $scope.editAccount.CategoryId == $rootScope.AccountType.CBS &&  $scope.editAccount.Flag==$rootScope.SavingsConfig.SavingsAccountFlag.Resolve? $scope.savedSavingsAccountDetails.TotalReturnAmount * 2 : $scope.savedSavingsAccountDetails.TotalReturnAmount;
                if ($scope.editAccount.CategoryId == $rootScope.AccountType.GeneralSavings) {
                    if ($scope.transactionSummary != null && $scope.transactionSummary.length > 0) {
                        var allInerestTransaction = $scope.transactionSummary.filter(t => t.TransactionType == "Savings Interest");
                        if (allInerestTransaction.length > 0) {
                            $scope.InterestAmountToShow = $scope.editAccount.Status==$rootScope.SavingsConfig.SavingsAccountStatus.Active?0: allInerestTransaction[allInerestTransaction.length - 1].Amount;
                        }
                    }
                }else
                    $scope.InterestAmountToShow = $scope.editAccount.Status == $rootScope.SavingsConfig.SavingsAccountStatus.Active ? 0 : $scope.savedSavingsAccountDetails.TotalInterestEarned;
                return;
            }
            if ($scope.editAccount.CategoryId == $rootScope.SavingsConfig.SavingsProductType.General) {
                $scope.editAccount.TotalReturnAmount = $scope.savingsBalance + $scope.editAccount.TotalInterestEarned;
            }
            if ($scope.editAccount.CategoryId == $rootScope.SavingsConfig.SavingsProductType.CBS) {
                if ($scope.editAccount.Status == $rootScope.SavingsConfig.SavingsAccountStatus.Closed && $scope.editAccount.Flag == $rootScope.SavingsConfig.SavingsAccountFlag.Resolve) {
                    $scope.editAccount.TotalReturnAmount = $scope.savingsBalance*2;
                    $scope.InterestAmountToShow = $scope.savingsBalance;
                } else {
                    $scope.editAccount.TotalReturnAmount = $scope.savingsBalance + $scope.editAccount.TotalInterestEarned;
                    $scope.InterestAmountToShow = $scope.editAccount.TotalInterestEarned;
                }
            }
            if ($scope.editAccount.CategoryId == $rootScope.SavingsConfig.SavingsProductType.LTS) {
                if ($scope.editAccount.TotalFee > 0) {
                    if ($scope.editAccount.TotalInterestEarned > $scope.editAccount.TotalFee) {
                        $scope.editAccount.TotalInterestEarned = $scope.editAccount.TotalInterestEarned - $scope.editAccount.TotalFee;
                        $scope.InterestAmountToShow = Math.round($scope.editAccount.TotalInterestEarned);
                        $scope.editAccount.TotalReturnAmount = $scope.savingsBalance + $scope.editAccount.TotalInterestEarned;
                    } else {
                        $scope.editAccount.TotalReturnAmount = $scope.savingsBalance + $scope.editAccount.TotalFee;
                        $scope.editAccount.TotalInterestEarned = 0;
                    }
                }
            }
            $scope.editAccount.TotalReturnAmount = Math.round($scope.editAccount.TotalReturnAmount);
            
        }
        $scope.setProgramDetails = function () {
            savingsAccountService.getProductInfo($scope.editAccount.ProductId).then(function (response) {
                $scope.InstallmentFrequencyList = angular.copy($scope.InstallmentFrequencyListTemp);
                if ($scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.LTS) {
                    $scope.InstallmentFrequencyList = $scope.InstallmentFrequencyList.filter(i => i.Value === 2);
                }
                $scope.productDetails = response.data;
                $scope.filterFreqOptions = [];

                angular.forEach(response.data.AmmsSavingProductAmountFrequencies, function (item) {
                    if ($scope.filterFreqOptions.indexOf(item.InstallmentFrequencyId) === -1) {
                        $scope.filterFreqOptions.push(item.InstallmentFrequencyId);
                    }
                });

                if ($scope.filterFreqOptions.indexOf(response.data.DefaultInstallmentFrequency) === -1 && response.data.DefaultInstallmentFrequency != null) {
                    $scope.filterFreqOptions.push(response.data.DefaultInstallmentFrequency);
                }

                //$scope.InstallmentFrequencyList = $scope.InstallmentFrequencyList.filter(function (item) {
                //    return $scope.filterFreqOptions.indexOf(item.Value) !== -1;
                //});

                if ($scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.LTS) {
                    $scope.DurationList = [];
                    for (var i = 0; i < response.data.AmmsSavingProductAmountFrequencies.length; i++)
                        $scope.DurationList.push({ Name: response.data.AmmsSavingProductAmountFrequencies[i].Duration, Value: response.data.AmmsSavingProductAmountFrequencies[i].Duration });

                    var flags = {};
                    $scope.DurationList = $scope.DurationList.filter(function (entry) {
                        if (flags[entry.Value]) {
                            return false;
                        }
                        flags[entry.Value] = true;
                        return true;
                    });

                    //$scope.editAccount.Duration = $scope.DurationList[0].Value;
                }

                if (prodChange) {
                    if ($scope.InstallmentFrequencyList)
                        $scope.InstallmentFrequencyId = $scope.InstallmentFrequencyList[0].Value;
                    if ($scope.DurationList)
                        $scope.editAccount.Duration = $scope.DurationList[0].Value;
                }

                if ($scope.editAccount.CategoryId !== $rootScope.SavingsConfig.SavingsType.LTS)
                    $scope.mandatorySavingsAmount = response.data.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                        return obj.InstallmentFrequencyId === $scope.editAccount.InstallmentFrequencyId;
                    });

                else $scope.mandatorySavingsAmount = response.data.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                    return obj.InstallmentFrequencyId === $scope.editAccount.InstallmentFrequencyId && obj.Duration === $scope.editAccount.Duration;
                });

                //if ($scope.mandatorySavingsAmount.length <= 0 && $scope.editAccount.CategoryId === 1) $scope.editAccount.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmount;
                //else $scope.editAccount.MinimumDepositAmount = $scope.mandatorySavingsAmount[0].MandatorySavingsAmount;

                $scope.productDetails.AmmsSavingProductAmountFrequencies.forEach(function (f) {
                    if ($scope.loanPrincipalAmount && $scope.loanPrincipalAmount >= f.MinAmount && $scope.loanPrincipalAmount <= f.MaxAmount) {
                        $scope.LoanAccountOverriddenmandetoryAmount = f.MandatorySavingsAmount;
                    }
                });

                console.log($scope.selectedMenu, $rootScope.user.Role);
                // if the account is 'LTS' Or 'CBS' , It cannot be Reopened after closing 
                //if ($scope.editAccount.Status === 3 && ($scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.LTS || $scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.CBS)) {
                //    $scope.StatusList = $scope.StatusList.filter(function (obj) {
                //        return obj.Value !== 2;
                //    });
                //    $scope.ReasonList = $scope.ReasonList.filter(function (obj) {
                //        return obj.Value !== 6;
                //    });
                //    $scope.ReasonList = $scope.ReasonList.filter(function (obj) {
                //        return obj.Value !== 1;
                //    });
                //}
                $scope.amountfreqList = angular.copy($scope.productDetails.AmmsSavingProductAmountFrequencies);
                $scope.CbsMinDepositWeekly = [];
                $scope.CbsMinDepositMonthly = [];
                $scope.amountfreqList.forEach(function (a) {
                    if (a.InstallmentFrequencyId === 1)
                        $scope.CbsMinDepositWeekly.push({ Name: a.MandatorySavingsAmount, Value: a.MandatorySavingsAmount });
                    if (a.InstallmentFrequencyId === 2)
                        $scope.CbsMinDepositMonthly.push({ Name: a.MandatorySavingsAmount, Value: a.MandatorySavingsAmount });

                });
                if ($scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.CBS) {
                    $scope.DisbaleMinDeposit = true;
                    if ($scope.editAccount.InstallmentFrequencyId === 1) $scope.CBSMinDeposits = $scope.CbsMinDepositWeekly;
                    if ($scope.editAccount.InstallmentFrequencyId === 2) $scope.CBSMinDeposits = $scope.CbsMinDepositMonthly;
                    if ($scope.CBSMinDeposits.length > 1) $scope.DisbaleMinDeposit = false;
                }
                if ($scope.DisbaleMinDeposit) {
                    if ($scope.editAccount.InstallmentFrequencyId === 1)
                        $scope.editAccount.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmount;
                    else if ($scope.editAccount.InstallmentFrequencyId === 2)
                        $scope.editAccount.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmountMonthly;
                }

                if ($scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.LTS) {
                    $scope.LTSMinDeposits = [];
                    $scope.productDetails.AmmsSavingProductAmountFrequencies.forEach(function (f) {
                        if ($scope.editAccount.Duration === f.Duration) {
                            $scope.LTSMinDeposits.push({ Name: f.MandatorySavingsAmount, Value: f.MandatorySavingsAmount });
                        }
                    });
                    var aflags = {};
                    $scope.LTSMinDeposits = $scope.LTSMinDeposits.filter(function (entry) {
                        if (aflags[entry.Value]) {
                            return false;
                        }
                        aflags[entry.Value] = true;
                        return true;
                    });
                    //if ($scope.LTSMinDeposits.length > 0) $scope.account.MinimumDepositAmount = $scope.LTSMinDeposits[0].Value;
                }


            }, AMMS.handleServiceError);

        };

        $scope.getBankAccounts = function () {
            loanaccountService.getBankAccounts($scope.editAccount.BranchId).then(function (response) {
                $scope.bankaccountList = response.data;
            }, AMMS.handleServiceError);
        }

        $scope.getWorkingDate = function () {
            workingDayService.getDateOfBranch($scope.selectedBranchId).then(function (response) {
                $scope.workingDay = moment(response.data.date.toString().slice(0, 8)).toDate();
            }, AMMS.handleServiceError);
        }

        $scope.BankAccountValidator = function (account) {
            if (!account) return "Bank Account Number is required";
            return true;
        };

        $scope.ChequeValidator = function (cheque) {
            if (!cheque) return "Bank Account Number is required";
            return true;
        };

        $scope.removeFromList = function (nmn) {
            $scope.nomineePercentage -= nmn.Percentage;
            $scope.editAccount.Nominee.splice($scope.editAccount.Nominee.indexOf(nmn), 1);
        }

        $scope.getAllPrograms = function () {
            savingsAccountService.getAllPrograms($scope.editAccount.CategoryId).then(function (response) {
                $scope.ProductList = response.data;
            }, AMMS.handleServiceError);
        }

        $scope.totalNomineePercentage = function () {
            $scope.nomineePercentage = 0;
            angular.forEach($scope.editAccount.Nominee, function (item) {
                $scope.nomineePercentage += item.Percentage;
            });
        }

        $scope.addNominee = function () {
            if ($scope.nomineePercentage >= 100) alert("Nominee percentage already reached 100%");
            else {
                $scope.editAccount.Nominee.push({
                    Name: null,
                    Relation: null,
                    Percentage: null
                });
            }
        }

        $scope.getFilters = function () {
            savingsAccountService.getFilters($scope.editAccount.MemberId).then(function (response) {
                $scope.InstallmentFrequencyList = $scope.InstallmentFrequencyListTemp = response.data.savingInstallmentFrequencies;
                if ($scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.LTS) {
                    $scope.InstallmentFrequencyList = $scope.InstallmentFrequencyList.filter(i => i.Value === 2);
                }
                $scope.StatusList = response.data.Statuses;
                console.log(response.data);
                $scope.ReasonList = response.data.Flags;
                $scope.ReasonListMain = response.data.Flags;
                $scope.getAccountDetails();
            }, AMMS.handleServiceError);

        }

        $scope.removefile = function (file, files, propertyName) {
            var value = file.name;
            var i = AMMS.findWithAttr(files, propertyName, value);
            files.splice(i, 1);
            $scope.docSizeBoolChecker();

        }

        $scope.removefileDB = function (file) {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
                function () {
                    documentService.deleteDocument(file.Id).then(function (response) {
                        if (response.data.Success) {
                            $scope.removefile(file, $scope.uploadedFiles, 'Name');
                        }
                    }, AMMS.handleServiceError);

                    swal("Deleted!", "file has been deleted.", "success");
                });
        }

        $scope.removeLocalFile = function (hash) {
            if (hash) {
                documentService.deleteLocalDocument(hash);
                $scope.docSizeBoolChecker();
            }
        }

        $scope.getLoanAccountDetails = function () {
            console.log($scope.selecetedMenu);
            loanaccountService.getPrimaryLoanAccountFromSavingsAccount($scope.currentAccountId).then(function (response) {
                if (response.data !== null) $scope.loanPrincipalAmount = response.data.PrincipalAmount;
                $scope.getTransactionSummary();
            });

        }
        $scope.getHolidays = function () {
            memberDailyTransactionService.getBranchOffDayAndHolidays($scope.selectedBranchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
                console.log($scope.branchHolidayAndOffDay);
            });
        }

        $scope.init = function () {
            $scope.getPaymentMethods();
            $scope.getWorkingDate();
            $scope.getFilters();
            $scope.getHolidays();
            //$scope.getAccountDetails();

            //$scope.getFilters();


        }

        $scope.init();

        $scope.clearAndCloseTab = function () {
            $scope.editAccount = {};
            $scope.execRemoveTab($scope.tab);
        };

        $scope.changeSync = function () {
            //if ($scope.editAccount.InstallmentFrequencyId === 2) $scope.editAccount.IsSyncWithMeetingDay = true;
            $scope.onInstallmentTypeChange();
            if ($scope.editAccount.CategoryId !== $rootScope.SavingsConfig.SavingsType.LTS)
                $scope.mandatorySavingsAmount = $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                    return obj.InstallmentFrequencyId === $scope.editAccount.InstallmentFrequencyId;
                });
            else $scope.mandatorySavingsAmount = $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                return obj.InstallmentFrequencyId === $scope.editAccount.InstallmentFrequencyId && obj.Duration === $scope.editAccount.Duration;
            });
            //if ($scope.mandatorySavingsAmount.length <= 0 && $scope.editAccount.CategoryId === 1) $scope.editAccount.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmount;
            //else $scope.editAccount.MinimumDepositAmount = $scope.mandatorySavingsAmount[0].MandatorySavingsAmount;
            if ($scope.editAccount.InstallmentFrequencyId === 1)
                $scope.editAccount.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmount;
            else if ($scope.editAccount.InstallmentFrequencyId === 2)
                $scope.editAccount.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmountMonthly;

            if ($scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.LTS) {
                $scope.productDetails.AmmsSavingProductAmountFrequencies.forEach(function (f) {
                    if ($scope.editAccount.Duration === f.Duration) {
                        $scope.LTSMinDeposits.push({ Name: f.MandatorySavingsAmount, Value: f.MandatorySavingsAmount });
                    }
                });
                var aflags = {};
                $scope.LTSMinDeposits = $scope.LTSMinDeposits.filter(function (entry) {
                    if (aflags[entry.Value]) {
                        return false;
                    }
                    aflags[entry.Value] = true;
                    return true;
                });

                // TODO if the account is 'LTS' and has transaction, the frequency cannot be changed
                // TODO Suppose user select duration from 10 years to 5 years and the user's number of posted installment is 61 or greater then system would not allow to change. 



            }
            if ($scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.CBS) {
                $scope.DisbaleMinDeposit = true;
                if ($scope.editAccount.InstallmentFrequencyId === 1) $scope.CBSMinDeposits = $scope.CbsMinDepositWeekly;
                if ($scope.editAccount.InstallmentFrequencyId === 2) $scope.CBSMinDeposits = $scope.CbsMinDepositMonthly;
                if ($scope.CBSMinDeposits.length > 1) $scope.DisbaleMinDeposit = false;
            }

            if ($scope.DisbaleMinDeposit) {
                if ($scope.editAccount.InstallmentFrequencyId === 1)
                    $scope.editAccount.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmount;
                else if ($scope.editAccount.InstallmentFrequencyId === 2)
                    $scope.editAccount.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmountMonthly;
            }
        }

        $scope.changeDuration = function () {
            if ($scope.editAccount.TotalNoOfIntallmetPaid > 60) {
                if ($scope.editAccount.Duration === 5) {
                    swal("You cannot Change duraion to 5 since no of installmet is more than 60");
                    $scope.editAccount.Duration = 10;
                    $scope.isDurationDisabled = true;
                    return;
                }
            }
        }
        //$scope.changeFrequency = function() {
        //    $scope.editAccount.InstallmentFrequencyId = $scope.originalFrequency;
        //    $scope.editAccount.MinimumDepositAmount = $scope.originalMinDeposit;
        //    swal("You cannot Change frequency since this account already has transaction");
        //    return;
        //}

        $scope.$on('tab-switched', function () {
            

            if ($scope.currentType === 'Savings Account' && $scope.currentType == $rootScope.currentType && $scope.currentAccountId !== $rootScope.editSavingsAccountId) {
                   $scope.currentAccountId = $rootScope.editSavingsAccountId;
                   $scope.init();
            } else if ($scope.currentType != 'Savings Account' && $rootScope.currentType !== 'Savings Account' && $scope.currentAccountId !== $rootScope.editSavingsAccountId) {
                $scope.currentAccountId = $rootScope.editSavingsAccountId;
                $scope.init();
            }
           


            //console.log($scope.currentType);
            //if ($scope.currentType!==$rootScope.currentType  && $scope.currentAccountId !== $rootScope.editSavingsAccountId ) {
            //    $scope.currentAccountId = $rootScope.editSavingsAccountId;
            //    $scope.init();

            //} else if ($scope.currentAccountId !== $rootScope.editSavingsAccountId) {
            //    $scope.currentAccountId = $rootScope.editSavingsAccountId;
            //    $scope.init();
            //}


            //if ($scope.currentType === 'Savings Account' && $scope.currentAccountId !== $rootScope.editSavingsAccountId) {
            //    $scope.currentAccountId = $rootScope.editSavingsAccountId;
            //    $scope.init();
            //}
            //else if ($scope.editID !== $scope.currentAccountId) {
            //    $scope.init();
            //}
        });
        $scope.accountClosingValidation = function () {
            if (moment($scope.editAccount.ClosingDate).format('YYYY-MM-DD') > moment($rootScope.workingdate).format('YYYY-MM-DD'))
                return false;
            if ($scope.roleId == $rootScope.UserRole.LO || $scope.roleId == $rootScope.UserRole.ABM || $scope.roleId == $rootScope.UserRole.BM) {
                if (moment($scope.editAccount.ClosingDate).format('YYYY-MM-DD') != moment($rootScope.workingdate).format('YYYY-MM-DD'))
                    return false;
            }
            else if ($scope.roleId == $rootScope.UserRole.RM) {
                if (moment($scope.editAccount.ClosingDate).format('YYYY-MM-DD') < moment($rootScope.workingdate).add(-30, 'days').format('YYYY-MM-DD'))
                    return false;
            }
            else if ($scope.roleId == $rootScope.UserRole.DM) {
                if (moment($scope.editAccount.ClosingDate).format('YYYY-MM-DD') < moment($rootScope.workingdate).add(-90, 'days').format('YYYY-MM-DD'))
                    return false;
            }
            return true;
        }
        $scope.accountReOpenValidation = function () {
            if ($scope.roleId == $rootScope.UserRole.LO || $scope.roleId == $rootScope.UserRole.ABM || $scope.roleId == $rootScope.UserRole.BM) {
                if (moment($scope.savedSavingsAccountDetails.ClosingDate).format('YYYY-MM-DD') != moment($rootScope.workingdate).format('YYYY-MM-DD'))
                    return false;
            }
            else if ($scope.roleId == $rootScope.UserRole.RM) {
                if (moment($scope.savedSavingsAccountDetails.ClosingDate).format('YYYY-MM-DD') < moment($rootScope.workingdate).add(-30, 'days').format('YYYY-MM-DD'))
                    return false;
            }
            else if ($scope.roleId == $rootScope.UserRole.DM) {
                if (moment($scope.savedSavingsAccountDetails.ClosingDate).format('YYYY-MM-DD') < moment($rootScope.workingdate).add(-90, 'days').format('YYYY-MM-DD'))
                    return false;
            }
            return true;
        }
        $scope.updateOpeningDateValidation = function () {
            if ($scope.roleId == $rootScope.UserRole.RM || $scope.roleId == $rootScope.UserRole.DM || $scope.roleId == $rootScope.UserRole.Admin)
                return true;
            return false;
        }
        $scope.editSavingsAccount = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            
            if (moment($scope.editAccount.OpeningDate).format('YYYY-MM-DD') != moment($scope.savedSavingsAccountDetails.OpeningDate).format('YYYY-MM-DD')) {
                if (!$scope.updateOpeningDateValidation()) {
                    swal("You are not allowed update opening date on " + moment($scope.editAccount.ClosingDate).format('YYYY-MM-DD'));
                    return;
                }
            }
            if ($scope.editAccount.Status == $rootScope.SavingsConfig.SavingsAccountStatus.Closed && $scope.savedSavingsAccountDetails.Status != $rootScope.SavingsConfig.SavingsAccountStatus.Closed) {
                if (!$scope.editAccount.HasTransaction) {
                    swal("Account doesn't have any transaction. Account can't be closed");
                    return;
                }
                if (!$scope.accountClosingValidation()) {
                    swal("You are not allowed to close account on " + moment($scope.editAccount.ClosingDate).format('YYYY-MM-DD'));
                    return;
                }
            }
            if ($scope.savedSavingsAccountDetails.Status == $rootScope.SavingsConfig.SavingsAccountStatus.Closed && $scope.editAccount.Status == $rootScope.SavingsConfig.SavingsAccountStatus.Active && $scope.editAccount.Flag == $rootScope.SavingsConfig.SavingsAccountFlag.ReOpen) {
                if (!$scope.accountReOpenValidation()) {
                    swal("You are not allowed to re open account on " + moment($rootScope.workingdate).format('YYYY-MM-DD'));
                    return;
                }
            }

            if ($scope.editAccount.MinimumDepositAmount % $scope.productDetails.MultiplesOf > 0) {
                swal('Installment amount needs to be multiple of ' + $scope.productDetails.MultiplesOf);
                return;
            }

            if ($scope.editAccount.Nominee.length > 0) {
                $scope.nomineePercentage = 0;
                angular.forEach($scope.editAccount.Nominee, function (item) {
                    $scope.nomineePercentage += item.Percentage;
                });
                if ($scope.nomineePercentage !== 100) {
                    swal({ title: "Nominee Percentage Error", text: "Sum of all Nominee percentage must be equeal to 100", type: "error" });
                    return;
                }
            }

            var mandatorySavingsList = [];
            angular.forEach($scope.productDetails.AmmsSavingProductAmountFrequencies, function (item) {
                if (item.InstallmentFrequencyId == $scope.editAccount.InstallmentFrequencyId) mandatorySavingsList.push(item.MandatorySavingsAmount);
            });

            var uniquemandatorySavingsList = Array.from(new Set(mandatorySavingsList));

            if (uniquemandatorySavingsList.indexOf($scope.editAccount.MinimumDepositAmount) < 0 && !$scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.General) { //validation modded for non general savings prod 16apr2k18
                swal(
                    'Oops...',
                    'Minimum deposit amount can be the following amounts ' + uniquemandatorySavingsList,
                    'error'
                );
                return;
            }

            var depositRow = null;

            if ($scope.editAccount.Flag === 6) {
                if ($rootScope.user.Role === "4") {
                    if ((moment($scope.workingDay).diff(moment($scope.savedSavingsAccountDetails.ClosingDate), 'days')) > 90) {
                        swal("DM cannot Re-open an account after 90 days ! ", 'WARNING', 'warning');
                        return;
                    }
                }
                else if ($rootScope.user.Role === "5") {
                    if ((moment($scope.workingDay).diff(moment($scope.savedSavingsAccountDetails.ClosingDate), 'days')) > 90) {
                        swal("DM cannot Re-open an account after 90 days ! ", 'WARNING', 'warning');
                        return;
                    }
                }
            }

            if ($scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.LTS) {
                depositRow = $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                    return obj.InstallmentFrequencyId === $scope.editAccount.InstallmentFrequencyId && obj.Duration === $scope.editAccount.Duration;
                })[0];
            } else {
                depositRow = $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                    return obj.InstallmentFrequencyId === $scope.editAccount.InstallmentFrequencyId;
                })[0];
            }
            //new implement 16 apr 2k18 --moved to backend

            //if ($scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.General && depositRow !== null) {
            //    var genDepositRows = $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(function (obj) {
            //        return obj.InstallmentFrequencyId === $scope.editAccount.InstallmentFrequencyId;
            //    });

            //    //if ($scope.productDetails.IsVaryingAmountFrequencyOverriden && genDepositRows.filter(row=>row.MandatorySavingsAmount === $scope.editAccount.MinimumDepositAmount).length < 1) {
            //    //    //if () {
                        
            //    //    //}
            //    //    swal("Minimum deposti amount must be the following" + Array.from(new Set(genDepositRows.map(function (row) {
            //    //        return row.MandatorySavingsAmount;
            //    //    }))));
            //    //    return;
            //    //}

            //}



            if (depositRow === null && $scope.editAccount.CategoryId === $rootScope.SavingsConfig.SavingsType.General) {
                //console.log($scope.account.CategoryId);
                //console.log($scope.productDetails);
                if ($scope.editAccount.InstallmentFrequencyId === 1) {
                    if (!($scope.editAccount.MinimumDepositAmount >= $scope.productDetails.MinSavingAmount && $scope.editAccount.MinimumDepositAmount <= $scope.productDetails.MaxSavingAmount)) {
                        swal("Minimum deposit amount must be between " + $scope.productDetails.MinSavingAmount + " and " + $scope.productDetails.MaxSavingAmount);
                        return;
                    };

                }
                else if ($scope.editAccount.InstallmentFrequencyId === 2) {
                    if (!($scope.editAccount.MinimumDepositAmount >= $scope.productDetails.MinSavingAmountMonthly && $scope.editAccount.MinimumDepositAmount <= $scope.productDetails.MaxSavingAmountMonthly)) {
                        swal("Minimum deposit amount must be between " + $scope.productDetails.MinSavingAmountMonthly + " and " + $scope.productDetails.MaxSavingAmountMonthly);
                        return;
                    };

                }
            } else if ($scope.editAccount.InstallmentFrequencyId === 3) {

                if (!($scope.editAccount.MinimumDepositAmount >= depositRow.MinAmount && $scope.editAccount.MinimumDepositAmount <= depositRow.MaxAmount) && $scope.editAccount.CategoryId !== 3) {
                    console.log($scope.editAccount.CategoryId);
                    swal("Minimum deposit amount must be between " + depositRow.MinAmount + " and " + depositRow.MaxAmount);
                    return;
                };
            }
           
            


            $scope.editAccount.BranchId = $scope.selectedBranchId;

            if ($scope.editAccount.AdjustedWorkingDat) {
                if ($scope.editAccount.AdjustedWorkingDate < $scope.editAccount.OpeningDate) {
                    swal("Adjust date can't be before start date ", 'WARNING', 'warning');
                    return;
                }
            }

            if ($scope.docError) {
                swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');
                return;
            }

            if (moment($scope.editAccount.OpeningDate) > moment($scope.editAccount.ClosingDate)) {
                swal("Closing Date Cannot be less than Opening Date ! ", 'WARNING', 'warning');
                return;
            }

            if ($scope.editAccount.Status === $rootScope.SavingsConfig.SavingsAccountStatus.Closed && $scope.editAccount.ClosingDate === null) {
                swal('please select a closing date for closed member!');
                return;
            }


            //TODO closing date cannot be less than any transaction date
            transferService.IsMemberInTransferTransitState($scope.editAccount.MemberId, $rootScope.selectedBranchId).then(function (response) {
                if (response.data) {
                    swal("The Member is in Transfer Transit State");
                    return;
                }
                swal({
                    title: $scope.rootType == 1 ? $rootScope.showMessage($rootScope.editConfirmation, $rootScope.savingsAccount) : $rootScope.showMessage($rootScope.editConfirmation, $rootScope.cbsAccount),
                    showCancelButton: true,
                    confirmButtonText: "Yes, Edit it!",
                    cancelButtonText: "No, cancel !",
                    type: "info",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                },
                    function (isConfirmed) {
                        if (isConfirmed) {
                            $scope.editAccount.OpeningDate = moment($scope.editAccount.OpeningDate).format('YYYY-MM-DD');
                            $scope.balanceAndInterestCalculation();
                            $scope.editAccount.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                            $scope.editAccount.ClosingDate = $scope.editAccount.ClosingDate != null ? moment($scope.editAccount.ClosingDate).format("YYYY-MM-DD") : null;
                            $scope.editAccount.AdjustedWorkingDate = $scope.editAccount.AdjustedWorkingDate != null ? moment($scope.editAccount.AdjustedWorkingDate).format("YYYY-MM-DD") : null;
                            savingsAccountService.editSavingsAccount($scope.editAccount).then(function (response) {
                                if (response.data.Success) {
                                    if (response.data.Entity && response.data.Entity.Id && $scope.files.length > 0) {
                                        documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.SavingsAccount, $rootScope.user.UserId)
                                            .then(function (res) {
                                                if (res.data.Success) {
                                                    $rootScope.$broadcast('SavingsAccount-edit-finished');
                                                    $scope.removeLocalFile($rootScope.SavingsAccountFileHash);
                                                    if ($scope.rootType == 1) swal($rootScope.showMessage($rootScope.editSuccess, 'savings account'), "Successful!", "success");
                                                    else swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.cbsAccount), "Successful!", "success");
                                                    $scope.clearAndCloseTab();
                                                } else {
                                                    swal(res.data.Message, "Edit Error!", "error");
                                                }
                                            }, AMMS.handleServiceError);
                                    } else {
                                        $rootScope.$broadcast('savingsAccount-edit-finished');
                                        $scope.removeLocalFile($rootScope.SavingsAccountFileHash);
                                        if ($scope.rootType == 1) swal($rootScope.showMessage($rootScope.editSuccess, 'savings account'), "Successful!", "success");
                                        else swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.cbsAccount), "Successful!", "success");
                                        $scope.clearAndCloseTab();
                                    }
                                } else {
                                    swal(response.data.Message, "Edit Error!", "error");
                                    $scope.editAccount.OpeningDate = new Date($scope.editAccount.OpeningDate);
                                }
                            }, AMMS.handleServiceError);
                        } else {
                            swal("Cancelled", "something is wrong", "error");
                            $scope.editAccount.OpeningDate = new Date($scope.editAccount.OpeningDate);
                        }
                    });
            });
        }


        //new date 
        //$rootScope.today = function () {
        //    $scope.editAccount.OpeningDate = new Date($scope.branchWorkingDay);
        //};
        ///$scope.today();


        //$scope.clear = function () {
        //    $scope.editAccount.OpeningDate = null;
        //};

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($scope.branchWorkingDay),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(2040, 5, 22),
            minDate: new Date($scope.branchWorkingDay),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5))
                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.RM
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate)).add(-29, 'days')))
                || (moment(date) > moment(new Date($rootScope.workingdate))))

                || ($rootScope.selectedBranchId > 0 && ($rootScope.user.Role == $rootScope.UserRole.BM || $rootScope.user.Role == $rootScope.UserRole.ABM || $rootScope.user.Role == $rootScope.UserRole.LO)
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate))))
                || (moment(date) > moment(new Date($rootScope.workingdate))))

                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.DM
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate)).add(-89, 'days')))
                || (moment(date) > moment(new Date($rootScope.workingdate))))

                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.Admin
                && (moment(date) > moment(new Date($rootScope.workingdate))))
            ;
        }

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($scope.branchWorkingDay);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };
        $scope.popup2 = {
            opened: false
        };


        function getDayClass(data) {
            console.log(data);
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
        $scope.openingDateValidator = function () {
            if ($scope.editAccount.OpeningDate == undefined || $scope.editAccount.OpeningDate == null) {
                swal("This date is required and can not be cleared!");
                $scope.editAccount.OpeningDate = new Date($scope.savedSavingsAccountDetails.OpeningDate);
                return;
            }
            if (moment($scope.editAccount.OpeningDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
               swal("unable to select future date!");
               $scope.editAccount.OpeningDate = new Date($scope.savedSavingsAccountDetails.OpeningDate);
                return;
            }
            //if (moment($scope.editAccount.OpeningDate) < moment($scope.AdmissionDate)) {
            //    swal("cant create account before member admission date!");
            //    $scope.today();
            //    return;
            //}
            if ($scope.productDetails !== null && moment($scope.editAccount.OpeningDate).format() < moment($scope.productDetails.StartDate).format()) {
                swal("unable to create account before product launch date!");
                $scope.editAccount.OpeningDate = new Date($scope.savedSavingsAccountDetails.OpeningDate);
                return;
            }
        }


        $scope.closingDateValidator = function () {

            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }
            console.log(moment(new Date(maxDate)));
            console.log(moment(new Date(minDate)));
           
            if (moment($scope.editAccount.ClosingDate) > moment(new Date(maxDate)) || moment($scope.editAccount.ClosingDate) < moment(new Date(minDate))) {
                swal("invalid closing date!");
                $scope.editAccount.ClosingDate = new Date($rootScope.workingdate);
                return;
            }

            
          
           
        }
  
    }
]);