ammsAng.controller('savingsAccountAdd' +
    'Controller', [
    '$scope', '$q', '$timeout', 'loanGroupService', 'transferService', 'savingsAccountService', '$rootScope', 'documentService', 'workingDayService', 'feeService',
    function ($scope, $q, $timeout, loanGroupService, transferService, savingsAccountService, $rootScope, documentService, workingDayService, feeService) {

        if ($scope.tab.id.includes("1034")) $scope.rootType = 1;
        else $scope.rootType = 2;
        $scope.roleId = $rootScope.user.Role;
        $scope.branchWorkingDay = moment(new Date($rootScope.workingdate).setHours(0,0,0,0)).format('YYYY-MM-DD');

        $scope.account = {};
        $scope.CategoryList = [];
        $scope.ProductList = [];
        $scope.DurationList = [];
        $scope.InstallmentFrequencyList = [];
        $scope.MeetingDateList = [];
        $scope.StatusTest = 'Open';
        $scope.filterFreqOptions = [];
        $scope.MandatorySavingsAmount = [];
        $scope.productDetails = null;

        $scope.account.MemberId = $scope.selectedMenu.Id;
        $scope.account.OriginatingGroupId = $scope.selectedMenu.GroupId;
        $scope.account.OriginatingBranchId = $scope.selectedBranchId;
        $scope.account.OriginatingProgramOfficerId = null;
        $scope.account.ProductId = null;
        $scope.account.Status = null;
        $scope.account.IsSyncWithMeetingDay = true;
        $scope.account.Nominee = [];
        $scope.account.AccountFeeInfo = [];
        $scope.files = [];
        $scope.InstallmentFrequencyListTemp = [];
        $scope.LTSMinDeposits = [];
        $scope.amountfreqList = [];
        $scope.CbsMinDepositWeekly = [];
        $scope.CbsMinDepositMonthly = [];
        $scope.CBSMinDeposits = [];
        $scope.DisbaleMinDeposit = true;
        $scope.nomineePercentage = 0;

        $scope.groupSecurityDepositAmount = 0;
        $scope.groupGsavingDepositAmount = 0;


        $scope.$watch('files', function () {
            $scope.docSizeBoolChecker();
        });


        $scope.onInstallmentTypeChange=function() {
             if ($scope.account.InstallmentFrequencyId == $rootScope.SavingsConfig.InstallmentFrequencyId.Weekly) {
                 $scope.account.IsSyncWithMeetingDay = true;
             }
        }


        $scope.docSizeBoolChecker = function () {
            $scope.fileSize = 0;
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
        console.log($rootScope.SavingsConfig.SavingsType);
        if ($scope.rootType === 1) $scope.account.CategoryId = $rootScope.SavingsConfig.SavingsType.General;

        else $scope.account.CategoryId = $rootScope.SavingsConfig.SavingsType.CBS;
        $scope.account.OpeningDate = moment($rootScope.workingdate).format();
        for (var i = 1; i <= 31; i++) $scope.MeetingDateList.push({ Name: i, Value: i });

        $scope.PercentageValidator = function (percentange) {
            var validatorObj = {};
            validatorObj.message = "percentage can not be greater than 100%";
            if (percentange <= 100) return true;
            else return validatorObj;
        }

        $scope.getGroupDetails = function () {
            loanGroupService.getloanGroup($scope.account.OriginatingGroupId).then(function (response) {
                $scope.group = response.data.Name;
                $scope.account.OriginatingProgramOfficerId = response.data.ProgramOfficerId;
                $scope.groupSecurityDepositAmount = response.data.MinSecurityDeposit;
                $scope.groupGsavingDepositAmount = response.data.MinSavingDeposit;
            }, AMMS.handleServiceError);
        };

        $scope.getWorkingDate = function () {
            workingDayService.getDateOfBranch($scope.selectedBranchId).then(function (response) {
                $scope.workingDay = moment(response.data.date.toString().slice(0, 8)).toDate();
            }, AMMS.handleServiceError);
        }

        $scope.getAllPrograms = function () {
            savingsAccountService.getAllPrograms($scope.account.CategoryId).then(function (response) {
                $scope.ProductList = response.data;
                $scope.ProductList.forEach(function (p) {
                    var x = new Date(p.DateValue) <= new Date($scope.branchWorkingDay);
                    var y = new Date(p.EndDateValue) >= new Date($scope.branchWorkingDay);
                    var z = p.EnddateValue == null || (p.EndDateValue !== null && new Date(p.EndDateValue) >= new Date($scope.branchWorkingDay));
                    var l = new Date($scope.branchWorkingDay);
                    var m = moment(p.EndDateValue).format();
                });
                $scope.ProductList = $scope.ProductList.filter(p => new Date(p.DateValue) <= new Date($scope.branchWorkingDay) && (p.EndDateValue == null || (p.EndDateValue !== null && new Date(p.EndDateValue) >= new Date(new Date($scope.branchWorkingDay).setHours(0,0,0,0)))));

                savingsAccountService.getAllowedProduct($scope.account.MemberId).then(function (response) {
                    $scope.allowedProdList = response.data;
                    $scope.ProductList = $scope.ProductList.filter(function (item) {
                        return $scope.allowedProdList.indexOf(item.Value) !== -1;
                    });
                    $scope.account.ProductId = $scope.ProductList[0].Value;
                    $scope.setProgramDetails();
                });

               // $scope.account.ProductId = response.data[0].Value;
              //  $scope.setProgramDetails();
            }, AMMS.handleServiceError);
        };
        $scope.productInstallmentfrequencyIdentifier = function (frequencies) {
            if (frequencies == undefined ) {
                return;
            }
            $scope.InstallmentFrequencyList = [];
            frequencies.forEach(function(freq) {
                if (freq.InstallmentFrequencyId === 1 && $scope.InstallmentFrequencyList.filter(x=>x.Value === 1).length < 1) {
                    var weeklyObject = {};
                    weeklyObject.Name = 'Weekly';
                    weeklyObject.Value = 1;
                    $scope.InstallmentFrequencyList.push(weeklyObject);
                }
                if (freq.InstallmentFrequencyId === 2 && $scope.InstallmentFrequencyList.filter(x=>x.Value === 2).length < 1) {
                    var monthlyObject = {};
                    monthlyObject.Name = 'Monthly';
                    monthlyObject.Value = 2;
                    $scope.InstallmentFrequencyList.push(monthlyObject);
                }
            });
        }

        $scope.setProgramDetails = function () {
            $scope.account.AccountFeeInfo = [];
            //   $scope.account.ProductId = $scope.ProductList[0].Value;
            if (!$scope.account.ProductId)return;
            savingsAccountService.getProductInfo($scope.account.ProductId).then(function (response) {
                console.log(response.data);
                $scope.InstallmentFrequencyList = angular.copy($scope.InstallmentFrequencyListTemp);
                if($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.CBS) {
                    $scope.productInstallmentfrequencyIdentifier(response.data.AmmsSavingProductAmountFrequencies);
                }

                if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.LTS) {
                    $scope.InstallmentFrequencyList = $scope.InstallmentFrequencyList.filter(i => i.Value === 2);
                }
                console.log($scope.InstallmentFrequencyList);
                if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.General) {
                    $scope.account.InstallmentFrequencyId = response.data.DefaultInstallmentFrequency;
                    $scope.onInstallmentTypeChange();
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


                if ($scope.account.CategoryId !== $rootScope.SavingsConfig.SavingsType.General) {
                    $scope.account.InstallmentFrequencyId = $scope.InstallmentFrequencyList[0].Value;
                    $scope.onInstallmentTypeChange();
                }

                if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.LTS) {
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
                    $scope.account.Duration = $scope.DurationList[0].Value;
                }

                if ($scope.account.CategoryId !== $rootScope.SavingsConfig.SavingsType.LTS)
                    $scope.mandatorySavingsAmount = response.data.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                        return obj.InstallmentFrequencyId === $scope.account.InstallmentFrequencyId;
                    });
                else $scope.mandatorySavingsAmount = response.data.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                    return obj.InstallmentFrequencyId === $scope.account.InstallmentFrequencyId && obj.Duration === $scope.account.Duration;
                });

                if ($scope.mandatorySavingsAmount.length <= 0 && $scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.General) $scope.account.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmount;
                else $scope.account.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmount;
                $scope.amountfreqList = angular.copy(response.data.AmmsSavingProductAmountFrequencies);
                console.log($scope.amountfreqList);
                $scope.CbsMinDepositWeekly = [];
                $scope.CbsMinDepositMonthly = [];
                $scope.amountfreqList.forEach(function (a) {
                    if (a.InstallmentFrequencyId === 1)
                        $scope.CbsMinDepositWeekly.push({ Name: a.MandatorySavingsAmount, Value: a.MandatorySavingsAmount });
                    if (a.InstallmentFrequencyId === 2)
                        $scope.CbsMinDepositMonthly.push({ Name: a.MandatorySavingsAmount, Value: a.MandatorySavingsAmount });

                });
                if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.CBS) {
                    $scope.DisbaleMinDeposit = true;
                    if ($scope.account.InstallmentFrequencyId === 1) $scope.CBSMinDeposits = $scope.CbsMinDepositWeekly;
                    if ($scope.account.InstallmentFrequencyId === 2) $scope.CBSMinDeposits = $scope.CbsMinDepositMonthly;
                    if ($scope.CBSMinDeposits.length > 1) $scope.DisbaleMinDeposit = false;
                }
                if ($scope.DisbaleMinDeposit) {
                    if ($scope.account.InstallmentFrequencyId === 1)
                        if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.General) $scope.account.MinimumDepositAmount = $scope.groupGsavingDepositAmount;
                    if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.CBS) $scope.account.MinimumDepositAmount = $scope.groupSecurityDepositAmount;
                    else if ($scope.account.InstallmentFrequencyId === 2)
                        if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.General) $scope.account.MinimumDepositAmount = $scope.groupGsavingDepositAmount;
                    if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.CBS) $scope.account.MinimumDepositAmount = $scope.groupSecurityDepositAmount;
                }
                console.log($scope.CbsMinDepositWeekly);
                console.log($scope.CbsMinDepositMonthly);

                if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.LTS) {
                    $scope.LTSMinDeposits = [];
                    response.data.AmmsSavingProductAmountFrequencies.forEach(function (f) {
                        if ($scope.account.Duration === f.Duration) {
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
                    if ($scope.LTSMinDeposits.length > 0) $scope.account.MinimumDepositAmount = $scope.LTSMinDeposits[0].Value;
                }

            }, AMMS.handleServiceError);
            $scope.getFees();


        };
        $scope.totalNomineePercentage = function () {
            $scope.nomineePercentage = 0;
            angular.forEach($scope.account.Nominee, function (item) {
                $scope.nomineePercentage += item.Percentage;
            });
        }
        $scope.addNominee = function () {
            if ($scope.nomineePercentage >= 100) alert("Nominee percentage already reached 100%");
            else {
                $scope.account.Nominee.push({
                    Name: null,
                    Relation: null,
                    Percentage: null
                });
            }
        };
        $scope.removeFromList = function (nmn) {
            $scope.nomineePercentage -= nmn.Percentage;
            $scope.account.Nominee.splice($scope.account.Nominee.indexOf(nmn), 1);
        };
        $scope.getMemberInfo = function () {
            savingsAccountService.getMemberInfo($scope.account.MemberId).then(function (response) {
                $scope.AdmissionDate = response.data.AdmissionDate;
                console.log($scope.AdmissionDate);
            }, AMMS.handleServiceError);
        };
        $scope.getFilters = function () {
            savingsAccountService.getFilters($scope.account.MemberId).then(function (response) {
                $scope.InstallmentFrequencyList = $scope.InstallmentFrequencyListTemp = response.data.savingInstallmentFrequencies;
                $scope.account.Status = $rootScope.SavingsConfig.SavingsAccountStatus.Active;
                $scope.account.MeetingDay = response.data.meetingDay[0].Name;
            }, AMMS.handleServiceError);
        };
        $scope.beforeStartDateRender = function ($dates) {
            $scope.init();

            //var maxDate = new Date($scope.branchWorkingDay);
            //var minDate = new Date($scope.branchWorkingDay);
            //console.log($scope.AdmissionDate);
            //$scope.AdmissionDate = new Date($scope.AdmissionDate).setHours(0, 0, 0, 0);
            //console.log($scope.AdmissionDate);
            //if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.BM) {
            //    minDate.setDate(minDate.getDate() + 1);
            //    minDate = new Date(minDate).setHours(0, 0, 0, 0);
            //} else if ($scope.roleId == $rootScope.rootLevel.RM) {
            //    minDate.setDate(minDate.getDate() - 30);
            //    minDate = new Date(minDate).setHours(0, 0, 0, 0);
            //} else if ($scope.roleId == $rootScope.rootLevel.DM) {
            //    minDate.setDate(minDate.getDate() - 90);
            //    minDate = new Date(minDate).setHours(0, 0, 0, 0);
            //}
            //else {
            //    minDate.setDate(minDate.getDate() - 90);
            //    minDate = new Date(minDate).setHours(0, 0, 0, 0);
            //}

            //for (d in $dates)
            //    if ($dates.hasOwnProperty(d) && ($dates[d].utcDateValue >= moment($scope.workingDay).add(1, 'days').valueOf() || $dates[d].utcDateValue < moment($scope.AdmissionDate).valueOf()))
            //        $dates[d].selectable = false;
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        //if ($dates[d].utcDateValue < minDate || $dates[d].utcDateValue > maxDate || $dates[d].utcDateValue < $scope.AdmissionDate) {
                        //    $dates[d].selectable = false;

                        if ($dates[d].utcDateValue >= moment($scope.branchWorkingDay).add(1, 'days').valueOf() ||
                                $dates[d].utcDateValue < moment($scope.AdmissionDate).valueOf() ||
                               ($scope.productDetails!==null && $dates[d].utcDateValue < moment($scope.productDetails.StartDate).valueOf()) )  {
                                $dates[d].selectable = false;
                        }
                    }
                }
            }
        };
        $scope.clearAndCloseTab = function () {
            $scope.account = {};
            $scope.execRemoveTab($scope.tab);
        };
        $scope.addsavingsAccount = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            console.log(moment($scope.account.OpeningDate).format("YYYY-MM-DD"));
            if ($scope.account.MinimumDepositAmount % $scope.productDetails.MultiplesOf > 0) {
                swal('Installment amount needs to be multiple of ' + $scope.productDetails.MultiplesOf);
                return ;
            }

            if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.CBS) {
                var mandatorySavingsList = [];
                
                angular.forEach($scope.productDetails.AmmsSavingProductAmountFrequencies, function (item) {
                    if (item.InstallmentFrequencyId == $scope.account.InstallmentFrequencyId && mandatorySavingsList.indexOf(item.MandatorySavingsAmount) < 0) mandatorySavingsList.push(item.MandatorySavingsAmount);
                });

                if (mandatorySavingsList.indexOf($scope.account.MinimumDepositAmount) < 0) {
                    swal(
                        'Oops...',
                        'Minimum deposit can be the following amount(s) only : ' + mandatorySavingsList,
                        'error'
                    );
                    return;
                }
            }
           

           
            if ($scope.account.Nominee.length > 0) {
                if ($scope.nomineePercentage !== 100) {
                    swal({ title: "Nominee Percentage Error", text: "Sum of all Nominee percentage must be equeal to 100", type: "error" });
                    return;
                }
            }
            var depositRow = null;
            if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.General) {
                depositRow = $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                    return obj.InstallmentFrequencyId === $scope.account.InstallmentFrequencyId && obj.Duration === $scope.account.Duration;
                })[0];
            } else {
                depositRow = $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                    return obj.InstallmentFrequencyId === $scope.account.InstallmentFrequencyId;
                })[0];

                $scope.cbsDepMin = $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(r=>r.InstallmentFrequencyId === 1).length > 0 ? $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(r=>r.InstallmentFrequencyId === 1)[0].MandatorySavingsAmount : 0;
                $scope.cbsDepMax = $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(r=>r.InstallmentFrequencyId === 2).length > 0 ? $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(r=>r.InstallmentFrequencyId === 2)[0].MandatorySavingsAmount : 0;
            }

            if (depositRow === null || $scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.General) {
                if ($scope.account.InstallmentFrequencyId === 1) {
                    if (!($scope.account.MinimumDepositAmount >= $scope.productDetails.MinSavingAmount && $scope.account.MinimumDepositAmount <= $scope.productDetails.MaxSavingAmount)) {
                        swal("Minimum deposit amount must be between " + $scope.productDetails.MinSavingAmount + " and " + $scope.productDetails.MaxSavingAmount);
                        return;
                    };

                }
                else if ($scope.account.InstallmentFrequencyId === 2) {
                    if (!($scope.account.MinimumDepositAmount >= $scope.productDetails.MinSavingAmountMonthly && $scope.account.MinimumDepositAmount <= $scope.productDetails.MaxSavingAmountMonthly)) {
                        swal("Minimum deposit amount must be between " + $scope.productDetails.MinSavingAmountMonthly + " and " + $scope.productDetails.MaxSavingAmountMonthly);
                        return;
                    };

                }
            } else if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.CBS) {

                //if (!($scope.account.MinimumDepositAmount >= $scope.cbsDepMin && $scope.account.MinimumDepositAmount <= $scope.cbsDepMax) && $scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.CBS) {
                //    swal("Minimum deposit amount must be between " + $scope.cbsDepMin + " and " + $scope.cbsDepMax);
                //    return;
                //};
            }

            $scope.account.BranchId = $scope.account.OriginatingBranchId;


            if ($scope.docError) {
                swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');
                return;
            }

            console.log($scope.account);
            console.log($scope.productDetails);
            transferService.IsMemberInTransferTransitState($scope.account.MemberId, $rootScope.selectedBranchId).then(function (response) {
                if (response.data) {
                    swal("The Member is in Transfer Transit State");
                    return;
                }
                swal({
                    title: $scope.rootType == 1 ? $rootScope.showMessage($rootScope.addConfirmation, $rootScope.savingsAccount) : $rootScope.showMessage($rootScope.addConfirmation, $rootScope.cbsAccount),
                    showCancelButton: true,
                    confirmButtonText: "Yes, Create it!",
                    cancelButtonText: "No, cancel !",
                    type: "info",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                },
                    function (isConfirmed) {
                        if (isConfirmed) {
                            $scope.account.OpeningDate = moment($scope.account.OpeningDate).format("YYYY-MM-DD");
                            savingsAccountService.AddSavingsAccount($scope.account).then(function (response) {
                                console.log(response);
                                if (response.data.Success) {
                                    console.log(response.data);
                                    if (response.data.Entity && response.data.Entity.Id && $scope.files.length > 0) {
                                        documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.SavingsAccount, $rootScope.user.UserId)
                                            .then(function (res) {
                                                if (res.data.Success) {
                                                    $rootScope.$broadcast('SavingsAccount-add-finished');
                                                    if ($scope.rootType == 1) swal($rootScope.showMessage($rootScope.addSuccess, 'savings account'), "Successful!", "success");
                                                    else swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.cbsAccount), "Successful!", "success");
                                                    $scope.clearAndCloseTab();
                                                } else {
                                                    swal($rootScope.docAddError, res.data.Message, "error");
                                                }
                                            }, AMMS.handleServiceError);
                                    } else {
                                        $rootScope.$broadcast('savingsAccount-add-finished');
                                        if ($scope.rootType == 1) swal($rootScope.showMessage($rootScope.addSuccess, 'savings account'), "Successful!", "success");
                                        else swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.cbsAccount), "Successful!", "success");
                                        $scope.clearAndCloseTab();
                                    }

                                } else {
                                    swal($rootScope.showMessage(response.data.Message, 'Savings account'), "", "error");
                                    $scope.account.OpeningDate = new Date($scope.account.OpeningDate);
                                }
                            }, AMMS.handleServiceError);
                        } else {
                            swal("Cancelled", "something is wrong", "error");
                            $scope.account.OpeningDate = new Date($scope.account.OpeningDate);
                        }
                    });
            });
        };
        $scope.removefile = function (file, files, propertyName) {
            var value = file.name;
            var i = AMMS.findWithAttr(files, propertyName, value);
            files.splice(i, 1);
            $scope.docSizeBoolChecker();

        };
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
        };
        $scope.removeLocalFile = function (hash) {
            if (hash) {
                documentService.deleteLocalDocument(hash);
            }
        };

        $scope.changeSync = function () {
            //if ($scope.account.InstallmentFrequencyId === 2) $scope.account.IsSyncWithMeetingDay = true;
            if ($scope.account.CategoryId !== $rootScope.SavingsConfig.SavingsType.LTS)
                $scope.mandatorySavingsAmount = $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                    return obj.InstallmentFrequencyId === $scope.account.InstallmentFrequencyId;
                });
            else $scope.mandatorySavingsAmount = $scope.productDetails.AmmsSavingProductAmountFrequencies.filter(function (obj) {
                return obj.InstallmentFrequencyId === $scope.account.InstallmentFrequencyId && obj.Duration === $scope.account.Duration;
            });
            if ($scope.account.InstallmentFrequencyId === 1)
                $scope.account.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmount;
            else if ($scope.account.InstallmentFrequencyId === 2)
                $scope.account.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmountMonthly;

            if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.LTS) {
                $scope.LTSMinDeposits = [];
                $scope.amountfreqList.forEach(function (f) {
                    if ($scope.account.Duration === f.Duration) {
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
                if ($scope.LTSMinDeposits.length > 0) $scope.account.MinimumDepositAmount = $scope.LTSMinDeposits[0].Value;
            }
            if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.CBS) {
                $scope.DisbaleMinDeposit = true;
                if ($scope.account.InstallmentFrequencyId === 1) $scope.CBSMinDeposits = $scope.CbsMinDepositWeekly;
                if ($scope.account.InstallmentFrequencyId === 2) $scope.CBSMinDeposits = $scope.CbsMinDepositMonthly;
                if ($scope.CBSMinDeposits.length > 1) $scope.DisbaleMinDeposit = false;
            }

            if ($scope.DisbaleMinDeposit) {
                if ($scope.account.InstallmentFrequencyId === 1)
                    $scope.account.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmount;
                else if ($scope.account.InstallmentFrequencyId === 2)
                    $scope.account.MinimumDepositAmount = $scope.productDetails.DefaultSavingAmountMonthly;
            }
        }

        $scope.getFees = function () {
            if ($scope.account.ProductId) {
                $q.all([feeService.getBySavingsProduct($scope.account.ProductId), feeService.getFeeConfig("FeeType")]).then(function(response) {
                    $scope.availableFees = response[0].data;
                    $scope.feeTypes = response[1].data;
                    $scope.operationOnFees();
                    console.log(response);
                });
            }
        }

        $scope.operationOnFees = function () {

            console.log($scope.availableFees);
            if ($scope.availableFees == null) return;
            for (var i = 0; i < $scope.availableFees.length; i++) {
                var amountRateIsAppliedTo = 0;
                var sourceObject = $scope.availableFees[i];
                var feeObject = {
                    Id: sourceObject.Id,
                    Name: sourceObject.Name,
                    Amount: 0,
                    Exempt: false,
                    ChargeType: sourceObject.ChargeType,
                    SelectedPolicy: 1,
                    TimeOfCharge: sourceObject.TimeOfCharge,
                    Type: $scope.feeTypes.filter(e => e.value == sourceObject.ChargeType)[0].text
                };
                var appliedRow = {
                    Value: 0
                };

                if (sourceObject.ChargeType == 2) {
                    //late fee add er somoy 0
                    feeObject.Amount = 0;
                }
                if (sourceObject.ChargeType == 3 && sourceObject.FeeRateFrequency != null) {
                    feeObject.Amount = sourceObject.FeeRateFrequency[0].Value;
                }
                if (sourceObject.ChargeType == 4 && sourceObject.FeeRateFrequency != null) {
                    feeObject.Amount = sourceObject.FeeRateFrequency[0].Value;
                }

                $scope.account.AccountFeeInfo.push(feeObject);
            }
           
        }

        $scope.mindepInitializer = function () {
            if ($scope.account.CategoryId === $rootScope.SavingsConfig.SavingsType.General)
                $scope.account.MinimumDepositAmount = $scope.groupGsavingDepositAmount;
        }

        $scope.init = function () {
            $scope.getWorkingDate();
            $scope.CategoryList = $scope.rootType === 1 ? [{ Name: 'General Savings', Value: 2 }, { Name: 'LTS', Value: 4 }] : [{ Name: 'Capital BuildUp Savings', Value: 3 }];
            $scope.getGroupDetails();
            $timeout(function () { $scope.account.IsSyncWithMeetingDay = true; }, 100);
            $scope.getAllPrograms();
            $scope.getMemberInfo();
            $scope.getFilters();
            $scope.account.MeetingDate = $scope.MeetingDateList[0].Value;
            $scope.mindepInitializer();
            

        };
        $scope.init();


        //all the functions for angular-ui-bootstrap
        $scope.today = function () {
            $scope.account.OpeningDate = new Date($rootScope.workingdate);
            //$scope.account.OpeningDate = null;

        };
        $scope.today();
        

        $scope.clear = function () {
            $scope.account.OpeningDate = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($scope.branchWorkingDay),
            showWeeks: true
        };

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

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(2040, 5, 22),
            minDate: new Date($scope.branchWorkingDay),
            startingDay: 1
        };

        // Disable weekend selection
        //function disabled(data) {
        //    var date = data.date,
        //      mode = data.mode;
        //    return (mode === 'day' && (date.getDay() === 5)) || (moment(date) > moment(new Date($scope.branchWorkingDay)+1));
        // }

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($scope.branchWorkingDay);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
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
        $scope.validator = function () {
            if ($scope.account.OpeningDate == undefined || $scope.account.OpeningDate == null) {
                swal("This date is required and can not be cleared!");
                $scope.today();
                return ;
            }
           
            if (moment($scope.account.OpeningDate) > moment(new Date($scope.branchWorkingDay)+1)) {
                console.log(moment($scope.account.OpeningDate));
                console.log(moment($scope.branchWorkingDay));
                swal("unable to select future date!");
                $scope.today();
                return ;
            }
            if (moment($scope.account.OpeningDate) < moment($scope.AdmissionDate)) {
                swal("cant create account before member admission date!");
                $scope.today();
                return ;
            }
            if ($scope.productDetails !== null && moment($scope.account.OpeningDate).format() < moment($scope.productDetails.StartDate).format()) {
                swal("unable to create account before product launch date!");
                $scope.today();
                return ;
            }
        }
        //$scope.open2 = function () {
        //    $scope.popup2.opened = true;
        //};

        //$scope.setDate = function (year, month, day) {
        //    $scope.dt = new Date(year, month, day);
        //};

        //$scope.popup2 = {
        //    opened: false
        //};

        //var tomorrow = new Date();
        //tomorrow.setDate(tomorrow.getDate() + 1);
        //var afterTomorrow = new Date();
        //afterTomorrow.setDate(tomorrow.getDate() + 1);
        //$scope.events = [
        //  {
        //      date: tomorrow,
        //      status: 'full'
        //  },
        //  {
        //      date: afterTomorrow,
        //      status: 'partially'
        //  }
        //];

    }]);