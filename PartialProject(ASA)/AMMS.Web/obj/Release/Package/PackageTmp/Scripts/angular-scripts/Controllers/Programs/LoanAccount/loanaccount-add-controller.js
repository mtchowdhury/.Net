ammsAng.controller('loanaccountAddController', [
    '$scope', '$rootScope', '$timeout', 'loanaccountService', 'transferService', 'memberDailyTransactionService', 'branchService', 'filterService', 'loanGroupService', 'productService', 'workingDayService', 'commonService',
    'savingsAccountService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'documentService', 'feeService', 'memberService',
    function ($scope, $rootScope, $timeout, loanaccountService, transferService, memberDailyTransactionService, branchService, filterService, loanGroupService, productService, workingDayService, commonService,
        savingsAccountService, DTOptionsBuilder, DTColumnDefBuilder, documentService, feeService, memberService) {
        var declareVariable = function () {
            $scope.loan = {};
            $scope.showSupplimentaryCheckbox = false;
            $scope.productId = null;
            $scope.loan.MemberId = $scope.selectedMenu.Id;
            $scope.loan.BranchId = null;
            $scope.loan.GroupId = $scope.selectedMenu.GroupId;
            $scope.loan.LoanOfficerId = null;
            $scope.loan.IsSupplimentary = 0;
            $scope.member = $scope.selectedMenu.ToolTip;
            $scope.workingDay = $rootScope.workingdate;
            $scope.loan.BranchWorkingDate = $rootScope.workingdate;
            $scope.loan.DisburseDate = $rootScope.workingdate;
            $scope.group = null;
            $scope.loan.BranchId = $scope.selectedBranchId;
            $scope.loan.CurrentBranchId = $scope.selectedBranchId;
            $scope.loan.OriginatingBranchId = $scope.selectedBranchId;
            $scope.roleId = $rootScope.user.Role;
            $scope.loan.FirstInstallmentDate = moment();
            $scope.ProductCategories = [];
            $scope.ProductListAll = [];
            $scope.productIds = [];
            $scope.ProductList = [];
            $scope.ServiceChargeList = [];
            $scope.installmentFrequencyList = [];
            $scope.loan.NumberOfInstallment = 45;
            $scope.loan.FinanceData = {};
            $scope.servicechargerate = 25;
            $scope.loan.InstallmentAmountPerThousand = 25;
            $scope.loan.GracePeriod = 0;
            $scope.loan.InstallmentFrequencyId = 1;
            $scope.loan.PrincipalAmount = 0;
            $scope.otherInfo = false;
            $scope.loan.FundId = null;
            $scope.ProductTenures = [];
            $scope.loan.FinanceData.ServiceCharge = 0;
            $scope.loan.Rate = 0;
            $scope.isfreqChanged = false;
            $scope.savingsAccounts = [];
            $scope.flagListMain = [];
            $scope.flagList = [];
            $scope.graceperiodListMain = [];
            $scope.uploadError = false;
            $scope.availableFees = null;
            $scope.feePolicy = null;
            $scope.loan.AccountFeeInfo = [];
            $scope.loan.IsAccountpayable = false;
            $scope.loan.IsSyncWithMeetingDay = false;
            $scope.graceChanged = false;
            $scope.loan.IsSupplimentary = false;
            $scope.files = [];
            $scope.entityId = '';
            $scope.GroupTypeId = null;
            $scope.durationList = [];
            $scope.ProductGracePeriods = [];
            $scope.durationListMain = [];
            $scope.installmentFrequencyAll = [];
            $scope.installmentFrequencyFiltered = [];
            $scope.allowAllValue = -100000;
            $scope.allowNone = -999999;
            $scope.ProductDurations = [];
            $scope.productDetails = {};
            $scope.branchHolidayAndOffDay = [];
            $scope.fromChangeGRT = false;
            $scope.dtOptions = [];
            $scope.specificGracePeriodList = null;
            $scope.memberSex = null;
            $scope.loanRangeWithGroupType = null;
            $scope.IsSyncDisabled = true;
            $scope.IsEverythingloaded = true;
        }

        declareVariable();

        

        $scope.policyFilter = function () {
            return function (item) {
                if ($scope.loan.Sex == 'Male') {
                    if (item.value == '3' || item.value == '4')
                        return true;
                }

                if ($scope.loan.Sex == 'Female') {
                    if (item.value == '1' || item.value == '2')
                        return true;
                }
                return false;
            };
        }

        $scope.getHolidays = function (branchId) {
            memberDailyTransactionService.getBranchOffDayAndHolidays(branchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }
        $scope.$watch('files', function () {
            $scope.docSizeBoolChecker();
        });

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

        //$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [[2, 'asc']]);
        $scope.beforeStartDateRender = function ($dates) {

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
            }
            else if ($scope.roleId == $rootScope.rootLevel.Admin) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.ABM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            }
            //if ($dates.length > 27) {
            //    for (d in $dates) {
            //        if ($dates.hasOwnProperty(d)) {
            //            if ($dates[d].utcDateValue < minDate.valueOf() || $dates[d].utcDateValue > maxDate.valueOf() ||
            //                $dates[d].utcDateValue < moment($scope.AdmissionDate).valueOf() ||
            //                $dates[d].utcDateValue < moment($scope.productDetails.StartDate).valueOf()) {
            //                $dates[d].selectable = false;
            //            }
            //        }
            //    }
            //}
            //for (d in $dates) {
            //    if ($dates[d].utcDateValue >= moment($scope.workingDay).add(1, 'days').valueOf() ||
            //        $dates[d].utcDateValue < moment($scope.AdmissionDate).valueOf() ||
            //        $dates[d].utcDateValue < moment($scope.productDetails.StartDate).valueOf()) {
            //        $dates[d].selectable = false;
            //    }
            //}
        }

        $scope.getCategory = function () {
            productService.getProductCategoryByProductType(1).then(function (response) {
                $scope.categoryList = response.data;
                if ($scope.categoryList.length > 0) $scope.loan.CategoryId = $scope.categoryList[0].Value;
                $scope.getProducts();
            }, AMMS.handleServiceError);
        }

        $scope.getProducts = function () {
            loanaccountService.getProductsByMemberBranch($scope.loan.MemberId, $scope.loan.BranchId, moment($scope.loan.DisburseDate).format(), -1).then(function (response) {
                $scope.ProductListAll = response.data.Products;
                $scope.ProductCategories = response.data.ProductsCategories;
                var primaryCount = 0;
                var specialCount = 0;
                var projectCount = 0;
                var msmeCount = 0;
                $scope.ProductListAll.forEach(function (p) {
                    $scope.ProductCategories.forEach(function(pc) {
                        if (p.Value == pc.Value
                           // && !p.DisabledState
                                ) {
                            if (pc.Name == $rootScope.LoanConfig.LoanProductCategory.Primary) primaryCount++;
                            else if (pc.Name == $rootScope.LoanConfig.LoanProductCategory.Special) specialCount++;
                            else if (pc.Name == $rootScope.LoanConfig.LoanProductCategory.ProjectLoan) projectCount++;
                            else if (pc.Name == $rootScope.LoanConfig.LoanProductCategory.MSME) msmeCount++;
                        }
                    });
                });
                if (primaryCount == 0) {
                    $scope.categoryList = $scope.categoryList.filter(function(c) {
                        return c.Value != $rootScope.LoanConfig.LoanProductCategory.Primary;
                    });
                }
                if (specialCount == 0) {
                    $scope.categoryList = $scope.categoryList.filter(function (c) {
                        return c.Value != $rootScope.LoanConfig.LoanProductCategory.Special;
                    });
                }
                if (projectCount == 0) {
                    $scope.categoryList = $scope.categoryList.filter(function (c) {
                        return c.Value != $rootScope.LoanConfig.LoanProductCategory.ProjectLoan;
                    });
                }
                if (msmeCount == 0) {
                    $scope.categoryList = $scope.categoryList.filter(function (c) {
                        return c.Value != $rootScope.LoanConfig.LoanProductCategory.MSME;
                    });
                }


                $scope.getProductsByCategory($scope.loan.CategoryId);
                $scope.ProductListAll.forEach(function (p) {
                    if (p.DisabledState) p.Name = p.Name + " (" + p.Reason + " )";
                });

                for (var k = 0; k < $scope.ProductList.length; k++) {
                    if (!$scope.ProductList[k].DisabledState) {
                        $scope.loan.ProductId = $scope.ProductList[k].Value;
                        break;
                    }
                }

                if ($scope.loan.ProductId) {
                    $scope.getFiltersByProduct($scope.loan.ProductId);
                    $scope.getProductDetails();
                } else {
                    $("#loadingImage").css("display", "none");
                }

                //$scope.removeEmptyCategpries();

            }, AMMS.handleServiceError);
        }

        $scope.getSpecificProductGracePeriods = function () {
            if (!$scope.loan.ProductId) return;
            loanaccountService.getSpecificProductGracePeriods($scope.loan.ProductId).then(function (response) {
                $scope.specificGracePeriodList = response.data;
            });
        }

        $scope.removeEmptyCategpries = function() {
            var primaryCount = 0;
            var specialCount = 0;
            var msmeCount = 0;
            var projectCount = 0;
            $scope.ProductCategories.forEach(function(pc) {
                if (pc.CategoryId == $rootScope.LoanConfig.LoanProductCategory.Primary) primaryCount++;
                if (pc.CategoryId == $rootScope.LoanConfig.LoanProductCategory.Special) specialCount++;
                if (pc.CategoryId == $rootScope.LoanConfig.LoanProductCategory.MSME) msmeCount++;
                if (pc.CategoryId == $rootScope.LoanConfig.LoanProductCategory.ProjectLoan) projectCount++;
            });
            if (primaryCount == 0) {
                $scope.categoryList = $scope.categoryList.filter(function (obj) {
                    return obj.Value != $rootScope.LoanConfig.LoanProductCategory.Primary;
                });
            }
            if (specialCount == 0) {
                $scope.categoryList = $scope.categoryList.filter(function (obj) {
                    return obj.Value != $rootScope.LoanConfig.LoanProductCategory.Special;
                });
            }
            if (msmeCount == 0) {
                $scope.categoryList = $scope.categoryList.filter(function (obj) {
                    return obj.Value != $rootScope.LoanConfig.LoanProductCategory.MSME;
                });
            }
            if (projectCount == 0) {
                $scope.categoryList = $scope.categoryList.filter(function (obj) {
                    return obj.Value != $rootScope.LoanConfig.LoanProductCategory.ProjectLoan;
                });
            }
        }

        $scope.getFiltersByProduct = function (productId) {
            

            if (!productId) return;
            loanaccountService.getSupplimentaryAvailability($scope.loan.MemberId, productId).then(function (response) {
                $scope.showSupplimentaryCheckbox = response.data;
                if (response.data == false) $scope.loan.IsSupplimentary = false;
            });
            $scope.productId = productId;
            $scope.getProductDetails();
            $scope.getFees();

            $scope.getSpecificProductGracePeriods();
            if ($scope.loan.ProductId) {
                loanaccountService.getFiltersByProduct(productId).then(function (response) {
                    console.log(response.data);
                    $scope.loanRangeWithGroupType = angular.copy(response.data.Ranges);
                    $scope.installmentFrequencyListMain = angular.copy(response.data.Installments);
                    $scope.graceperiodListMain = angular.copy(response.data.GracePeriods);
                    $scope.subcodeList = response.data.SubCodes;
                    var sflags = {};
                    $scope.subcodeList = $scope.subcodeList.filter(function (entry) {
                        if (sflags[entry.Value]) {
                            return false;
                        }
                        sflags[entry.Value] = true;
                        return true;
                    });
                    if ($scope.subcodeList[0]) $scope.loan.SubCodeId = $scope.subcodeList[0].Value;

                    $scope.schemeList = response.data.Schemes;
                    $scope.schemeList = $scope.schemeList.sort(function (a, b) {
                        var textA = a.Name.toUpperCase();
                        var textB = b.Name.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });
                    if ($scope.schemeList[0]) $scope.loan.SchemeId = $scope.schemeList[0].Value;
                    

                    $scope.fundList = response.data.Funds;
                    if ($scope.fundList[0]) $scope.loan.FundId = $scope.fundList[0].Value;

                    $scope.getProductTenures();

                }, AMMS.handleServiceError);


                loanaccountService.getCycleOfMemberProduct($scope.loan.MemberId, $scope.loan.ProductId).then(function (response) {
                    $scope.loan.LoanCycle = response.data;
                }, AMMS.handleServiceError);
            }
        }

        $scope.getProductTenures = function () {
            if (!$scope.loan.ProductId) return;
            loanaccountService.getProductTenures($scope.loan.ProductId).then(function (response) {
                $scope.ProductTenures = response.data;

                if ($scope.loan.ProductId) $scope.getDuration();
            }, AMMS.handleServiceError);
        }

        $scope.getDuration = function () {
            loanaccountService.getProductDurations($scope.loan.ProductId).then(function (response) {
                $scope.ProductDurations = response.data;
                $scope.durationListMain = [];
                $scope.ProductTenures.forEach(function (pt) {
                    if (pt.DurationId !== $scope.allowAllValue) {
                        $scope.durationListMain.push({ Name: pt.DurationId, Value: pt.DurationId });
                    }

                });

                var dflags = {};
                $scope.durationListMain = $scope.durationListMain.filter(function (entry) {
                    if (dflags[entry.Value]) {
                        return false;
                    }
                    dflags[entry.Value] = true;
                    return true;
                });

                $scope.durationList = $scope.durationListMain;
                $scope.specificDuration = false;
                $scope.ProductDurations.forEach(function (d) {
                    if (!(d.FundId === $scope.allowAllValue && d.GroupTypeId === $scope.allowAllValue)) {
                        $scope.specificDuration = true;
                        $scope.durationList = [];
                    }
                });

                $scope.matchFound = false;
                $scope.durationList = [];
                $scope.ProductDurations.forEach(function (a) {
                    if ($scope.specificDuration && $scope.loan.FundId === a.FundId && ($scope.loan.GroupTypeId === a.GroupTypeId || a.GroupTypeId === $scope.allowAllValue)) {
                        $scope.durationList.push({ Name: a.DurationId, Value: a.DurationId });
                        $scope.matchFound = true;
                    }
                });
                if (!$scope.matchFound) $scope.durationList = $scope.durationListMain;
                if ($scope.durationList.length > 0 && $scope.durationList.filter(d=> d.Value === 12).length !== 0) //$scope.loan.Duration = $scope.durationList[0].Value;
                     $scope.loan.Duration = $scope.durationList.filter(d=> d.Value === 12)[0].Value;
                else
                    if ($scope.durationList[0]) $scope.loan.Duration = $scope.loan.Duration = $scope.durationList[0].Value;
                $scope.getFrequency();
            }, AMMS.handleServiceError);
        }
        $scope.getFrequency = function () {
            productService.getInstallmentfrequency().then(function (response) {
                $scope.installmentFrequencyAll = angular.copy(response.data);
                $scope.installmentFrequencyAll = response.data.filter(freq => freq.Value !== $scope.allowAllValue && freq.Value !== $scope.allowNone);
                $scope.installmentFrequencyFiltered = [];
                productService.getProductInstallmentfrequency($scope.loan.ProductId).then(function (response) {
                    response.data.forEach(function (pf) {
                        $scope.installmentFrequencyAll.forEach(function (f) {
                            if (pf.Name === f.Value.toString()) {
                                $scope.installmentFrequencyFiltered.push({ Name: f.Name, Value: f.Value });
                            }
                        });
                    });
                });
                $scope.installmentFrequencyList = $scope.installmentFrequencyFiltered;
                $scope.filterInstallmentFrequency(1);

            });
        }

        $scope.filterInstallmentFrequency = function (callService) {
            $scope.installmentFrequencyList = [];

            $scope.ProductTenures.forEach(function (a) {
                if (a.DurationId == $scope.loan.Duration) {
                    if (a.InstallmentFrequencyId === $scope.allowAllValue) {
                        $scope.installmentFrequencyList = $scope.installmentFrequencyFiltered;
                        return;
                    }
                    $scope.installmentFrequencyListMain.filter(function (b) {
                        return b.Value == a.InstallmentFrequencyId;
                    }).forEach(function (temp) { $scope.installmentFrequencyList.push(temp); });
                };
            });
            //TODO product installment fre allow all case handle 
            var iflags = {};
            $scope.installmentFrequencyList = $scope.installmentFrequencyList.filter(function (entry) {
                if (iflags[entry.Value]) {
                    return false;
                }
                iflags[entry.Value] = true;
                return true;
            });
            if ($scope.installmentFrequencyList[0] && !$scope.isfreqChanged) $scope.loan.InstallmentFrequencyId = $scope.installmentFrequencyList[0].Value;
            //TODO change 1 from rootscope variable

            memberService.getMember($scope.loan.MemberId).then(function (response) {
                $scope.loan.MeetingDayId = response.data.MeetingDayId;
                if ($scope.loan.MeetingDayId == $rootScope.meetingDayId.None) {
                    $scope.loan.IsSyncWithMeetingDay = false;
                    $scope.IsSyncDisabled = true;
                }else {
                    if ($scope.loan.InstallmentFrequencyId === $rootScope.loanAccountInstallmentFrequency.Weekly) {
                        $scope.loan.IsSyncWithMeetingDay = true;
                        $scope.IsSyncDisabled = true;
                    } else if ($scope.loan.InstallmentFrequencyId === $rootScope.loanAccountInstallmentFrequency.Monthly) {
                        $scope.loan.IsSyncWithMeetingDay = true;
                        $scope.IsSyncDisabled = false;
                    }
                }
            });

            
                
            if (callService)
                $scope.getGracePeriod();
        }
        $scope.changeIsSync = function() {
            if ($scope.loan.InstallmentFrequencyId === $rootScope.loanAccountInstallmentFrequency.Weekly) {
                $scope.loan.IsSyncWithMeetingDay = true;                
                    if ($scope.loan.MeetingDayId != $rootScope.meetingDayId.None) $scope.IsSyncDisabled = true;
                    else $scope.IsSyncDisabled = false;
            }
            else if ($scope.loan.InstallmentFrequencyId === $rootScope.loanAccountInstallmentFrequency.Monthly) {
                $scope.IsSyncDisabled = false;
                if ($scope.loan.MeetingDayId != $rootScope.meetingDayId.None) $scope.loan.IsSyncWithMeetingDay = true;
                else $scope.loan.IsSyncWithMeetingDay = false;
            }
        }

        $scope.graceChange = function () {
            $scope.graceChanged = true;
        }

        $scope.getGracePeriod = function () {
            loanaccountService.getProductGracePeriods($scope.loan.ProductId).then(function (response) {
                $scope.ProductGracePeriods = response.data;

                $scope.graceperiodList = [];
                $scope.ProductTenures.forEach(function (a) {
                    if ((a.DurationId === $scope.loan.Duration || a.DurationId === $scope.allowAllValue) &&
                    (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || a.InstallmentFrequencyId === $scope.allowAllValue)) {
                        if (a.GracePeriod === $scope.allowAllValue) {
                            $scope.graceperiodList = [];
                            $scope.graceperiodList = $scope.graceperiodListMain;
                        } else $scope.graceperiodList.push({ Name: a.GracePeriod, Value: a.GracePeriod });
                    }
                });

                $scope.graceperiodList = $scope.graceperiodList.filter(function (o) {
                    return o.Value != $scope.allowAllValue;
                });

                for (var i = 0; i < $scope.ProductGracePeriods.length; i++) {
                    if (($scope.loan.Duration === $scope.ProductGracePeriods[i].DurationId || $scope.ProductGracePeriods[i].DurationId == $scope.allowAllValue) &&
                    ($scope.ProductGracePeriods[i].InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || $scope.ProductGracePeriods[i].InstallmentFrequencyId == $scope.allowAllValue) &&
                    ($scope.loan.Sex == $scope.ProductGracePeriods[i].GenderId || $scope.ProductGracePeriods[i].GenderId == $scope.allowAllValue) &&
                    ($scope.ProductGracePeriods[i].SchemeId == $scope.loan.SchemeId)) {
                        $scope.graceperiodList = [];
                        $scope.graceperiodList.push({ Name: $scope.ProductGracePeriods[i].GracePeriodId, Value: $scope.ProductGracePeriods[i].GracePeriodId });
                        break;
                    } else {
                        $scope.graceperiodList = [];
                        $scope.ProductTenures.forEach(function (a) {
                            if ((a.DurationId === $scope.loan.Duration || a.DurationId === $scope.allowAllValue) &&
                            (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || a.InstallmentFrequencyId === $scope.allowAllValue)) {
                                if (a.GracePeriod === $scope.allowAllValue) {
                                    $scope.graceperiodList = [];
                                    $scope.graceperiodList = $scope.graceperiodListMain;
                                } else $scope.graceperiodList.push({ Name: a.GracePeriod, Value: a.GracePeriod });
                            }
                        });
                    }
                }
                var gflags = {};
                $scope.graceperiodList = $scope.graceperiodList.filter(function (entry) {
                    if (gflags[entry.Value]) {
                        return false;
                    }
                    gflags[entry.Value] = true;
                    return true;
                });

                $scope.loan.GracePeriod = $scope.graceperiodList[0].Value;

                $scope.ProductTenures.forEach(function (a) {
                    if (a.DurationId === $scope.loan.Duration && (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || a.InstallmentFrequencyId === $scope.allowAllValue) && a.GracePeriod === $scope.loan.GracePeriod) {
                        $scope.loan.NumberOfInstallment = a.TotalNumberOfInstallment;
                        $scope.loan.InstallmentAmountPerThousand = a.InstallmentAmountPerThousand;
                    }
                });
                $scope.getRatesOfproduct();
            }, AMMS.handleServiceError);
        }

        $scope.getRatesOfproduct = function () {
            loanaccountService.getProductrates($scope.loan.ProductId).then(function (response) {
                $scope.ProductRates = response.data;

                var i;
                $scope.ServiceChargeList = [];
                var serviceChargeFound = false;
                for (i = 0; i < $scope.ProductRates.length ; i++) {
                    if ($scope.ProductRates[i].FundId === $scope.loan.FundId && $scope.ProductRates[i].SubCodeId == $scope.loan.SubCodeId && $scope.ProductRates[i].DurationId == $scope.loan.Duration &&
                        $scope.ProductRates[i].InstallmentFrequencyId == $scope.loan.InstallmentFrequencyId && $scope.ProductRates[i].GenderId === $scope.getSexCode()) {
                        $scope.ServiceChargeList.push({
                            Name: $scope.ProductRates[i].DeclineInterestRate, Value: $scope.ProductRates[i].DeclineInterestRate, DefaultPrincipal
                            : $scope.ProductRates[i].DefaultPrincipal, MaxPrincipal: $scope.ProductRates[i].MaxPrincipal, MinPrincipal: $scope.ProductRates[i].MinPrincipal
                        });
                        $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
                        //$scope.loan.PrincipalAmount = $scope.ServiceChargeList[0].DefaultPrincipal;

                        serviceChargeFound = true;
                        break;
                    }

                    if (($scope.ProductRates[i].FundId === $scope.loan.FundId || $scope.ProductRates[i].FundId == $scope.allowAllValue) &&
                        ($scope.ProductRates[i].SubCodeId == $scope.loan.SubCodeId || $scope.ProductRates[i].SubCodeId == $scope.allowAllValue) &&
                        ($scope.ProductRates[i].DurationId == $scope.loan.Duration || $scope.ProductRates[i].DurationId == $scope.allowAllValue) &&
                        ($scope.ProductRates[i].InstallmentFrequencyId == $scope.loan.InstallmentFrequencyId || $scope.ProductRates[i].InstallmentFrequencyId == $scope.allowAllValue) &&
                        ($scope.ProductRates[i].GenderId == Number($scope.loan.Sex) || $scope.ProductRates[i].GenderId == $scope.allowAllValue)) {
                        $scope.ServiceChargeList.push({
                            Name: $scope.ProductRates[i].DeclineInterestRate, Value: $scope.ProductRates[i].DeclineInterestRate,
                            DefaultPrincipal: $scope.ProductRates[i].DefaultPrincipal, MaxPrincipal: $scope.ProductRates[i].MaxPrincipal, MinPrincipal: $scope.ProductRates[i].MinPrincipal
                        });
                        $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
                        $scope.loan.PrincipalAmount = $scope.ServiceChargeList[0].DefaultPrincipal;
                        $scope.loan.MinimumPrincipal = $scope.ProductRates[i].MinPrincipal;
                        $scope.loan.MaximumPrincipal = $scope.ProductRates[i].MaxPrincipal;
                        serviceChargeFound = true;
                    }
                }

                if (!serviceChargeFound) {
                    $scope.ServiceChargeList.push({
                        Name: $scope.productDetails.DefaultDeclineInterestRate, Value: $scope.productDetails.DefaultDeclineInterestRate, DefaultPrincipal: $scope.productDetails.DefaultPrincipal,
                        MaxPrincipal: $scope.productDetails.MaximumPrincipal, MinPrincipal: $scope.productDetails.MinimumPrincipal

                    });
                    $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
                    $scope.loan.PrincipalAmount = $scope.ServiceChargeList[0].DefaultPrincipal;
                }
                $scope.PrincipalAmountValidator($scope.loan.PrincipalAmount);
                //if ($scope.servicechargerate) $scope.getSchedule();
            }, AMMS.handleServiceError);
        }

        $scope.getGroupDetails = function () {
            loanGroupService.getloanGroup($scope.loan.GroupId).then(function (response) {
                $scope.group = response.data.Name;
                $scope.loan.LoanOfficerId = response.data.ProgramOfficerId;
                $scope.GroupTypeId = response.data.GroupTypeId;
                $scope.loan.GroupTypeId = response.data.GroupTypeId;
            }, AMMS.handleServiceError);
        }

        //$scope.getBankAccounts = function () {
        //    loanaccountService.getBankAccounts($scope.loan.BranchId).then(function (response) {
        //        $scope.bankaccountList = response.data;
        //    }, AMMS.handleServiceError);
        //}

        $scope.getWorkingDate = function () {
            workingDayService.getDateOfBranch($scope.loan.BranchId).then(function (response) {
                $scope.workingDay = moment(response.data.date.toString().slice(0, 8)).toDate();
                $scope.loan.BranchWorkingDate = moment($scope.workingDay).format();
                $scope.loan.DisburseDate = moment(response.data.date.toString().slice(0, 8)).toDate();
            }, AMMS.handleServiceError);
        }

        $scope.getMemberInfo = function () {
            loanaccountService.getMemberInfo($scope.loan.MemberId).then(function (response) {
                $scope.HasPrimaryAccount = response.data.HasPrimaryAccount;
                $scope.AdmissionDate = response.data.AdmissionDate;
                $scope.memberSex = Number(response.data.Sex);
                if (response.data.Sex === "0") $scope.loan.Sex = "Female";
                else $scope.loan.Sex = "Male";
            }, AMMS.handleServiceError);
        }

        $scope.getProductDetails = function () {
            if (!$scope.loan.ProductId) {
                swal("Please Select a product!");
                return;
            }
            loanaccountService.getProductInfo($scope.loan.ProductId).then(function (response) {
                $scope.productDetails = response.data;
                if (response.data.DefaultPrincipal) $scope.loan.PrincipalAmount = response.data.DefaultPrincipal;
                $scope.loan.MinimumPrincipal = response.data.MinimumPrincipal;
                $scope.loan.MaximumPrincipal = response.data.MaximumPrincipal;
                $scope.loan.IsSupplimentary = response.data.IsSupplimentary;
                $scope.loan.IsPrimary = response.data.IsPrimary;
                $scope.IsSupplimentary = false;
            }, AMMS.handleServiceError);
        }

        $scope.getFees = function () {
            if (!$scope.productId) return;
            feeService.getByProduct($scope.productId).then(function (response) {
                $scope.availableFees = response.data;
                if ($scope.availableFees.length < 1) $scope.hasFee = false;
                else $scope.hasFee = true;
                $scope.operationOnFees();
            });
            feeService.getFeeConfig("PolicyType").then(function (response) {
                $scope.feePolicy = response.data;
            });
        }

        $scope.operationOnFees = function () {
            $scope.loan.AccountFeeInfo = [];
            if ($scope.availableFees == null) return;
            for (var i = 0; i < $scope.availableFees.length; i++) {
                var amountRateIsAppliedTo = 0;
                var sourceObject = $scope.availableFees[i];
                var feeObject = {
                    Id: sourceObject.Id,
                    FeeId: sourceObject.Id,
                    Name: sourceObject.Name,
                    ProductId: sourceObject.Id,
                    Amount: 0,
                    shownAmount: 0,
                    Exempt: false,
                    ChargeType: sourceObject.ChargeType
                };
                if ($scope.loan.Sex == 'Female') {
                    feeObject.SelectedPolicy = '2';
                } else feeObject.SelectedPolicy = '3';
                var appliedRow = {
                    Value: 0
                };
                if (sourceObject.ChargeType == $rootScope.FeeConfig.ChargeType.Insurance.value && sourceObject.FeeRateFrequency != null) {
                    for (var j = 0; j < sourceObject.FeeRateFrequency.length; j++) {
                        //if ($scope.loan.CategoryId === 5) {
                        //    var matchedInsurance = sourceObject.FeeRateFrequency.find(f => f.Policy == null && f.Frequency == null && f.Duration == $scope.loan.Duration && ($scope.loan.PrincipalAmount >= f.MinPrinciple && $scope.loan.PrincipalAmount <= f.MaxPrinciple));
                        //    if (matchedInsurance != undefined) {
                        //        appliedRow.Value = matchedInsurance.Value;
                        //    }
                        //} else {
                        if (sourceObject.FeeRateFrequency[j].Policy == feeObject.SelectedPolicy) {
                            appliedRow = sourceObject.FeeRateFrequency[j];
                            break;
                        }
                    }
                    //if (sourceObject.FeeRateFrequency[j].Policy == feeObject.SelectedPolicy) {
                    //    appliedRow = sourceObject.FeeRateFrequency[j];
                    //    break;
                    //} 
                    //}
                }
                else {
                    if (sourceObject.FeeRateFrequency != null) appliedRow.Value = sourceObject.FeeRateFrequency[0].Value;
                }
                if ($scope.loan.CategoryId === $rootScope.LoanConfig.LoanProductCategory.MSME) {
                    var matchedInsurance = sourceObject.FeeRateFrequency != null ? sourceObject.FeeRateFrequency.find(f => f.Policy == null && f.Frequency == null && f.Duration == $scope.loan.Duration && ($scope.loan.PrincipalAmount >= f.MinPrinciple && $scope.loan.PrincipalAmount <= f.MaxPrinciple)) : undefined;
                    if (matchedInsurance != undefined) {
                        appliedRow.Value = matchedInsurance.Value;
                    } else {
                        appliedRow.Value = 0;
                    }
                }
                if (sourceObject.CalculationMethod == $rootScope.FeeConfig.CalculationMethod.Fixed.value) {
                    feeObject.Amount = appliedRow.Value;
                } else {
                    if (sourceObject.CalculationMethod == $rootScope.FeeConfig.CalculationMethod.PercentOfInitialLoanPrincipal.value) amountRateIsAppliedTo = $scope.loan.PrincipalAmount;
                    if (sourceObject.CalculationMethod == $rootScope.FeeConfig.CalculationMethod.PercentOfInitialLoanPrincipalPlusInterest.value) amountRateIsAppliedTo = $scope.loan.DisburseAmount;
                    feeObject.Amount = amountRateIsAppliedTo * appliedRow.Value / 100;
                }
                if (feeObject.Amount > 0) {
                    feeObject.shownAmount = Math.round(feeObject.Amount * 100);
                    $scope.loan.AccountFeeInfo.push(feeObject);
                }
            }
        }

        $scope.policyChange = function (fee) {
            var sourceObject = null;
            var amountRateIsAppliedTo = 0;
            var appliedRow = {
                Value: 0
            };
            for (var i = 0; i < $scope.availableFees.length; i++) {
                if ($scope.availableFees[i].Id === fee.Id) sourceObject = $scope.availableFees[i];
            }

            if (sourceObject.FeeRateFrequency != null) {

                for (var j = 0; j < sourceObject.FeeRateFrequency.length; j++) {
                    if (sourceObject.FeeRateFrequency[j].Policy == fee.SelectedPolicy) {
                        appliedRow = sourceObject.FeeRateFrequency[j];
                        break;
                    }
                }
            }
            if (sourceObject.CalculationMethod == $rootScope.FeeConfig.CalculationMethod.Fixed.value) {
                fee.Amount = appliedRow.Value;
            } else {
                if (sourceObject.CalculationMethod == $rootScope.FeeConfig.CalculationMethod.PercentOfInitialLoanPrincipal.value) amountRateIsAppliedTo = $scope.loan.PrincipalAmount;
                if (sourceObject.CalculationMethod == $rootScope.FeeConfig.CalculationMethod.PercentOfInitialLoanPrincipalPlusInterest.value) amountRateIsAppliedTo = $scope.loan.DisburseAmount;
                fee.Amount = amountRateIsAppliedTo * appliedRow.Value / 100;
            }
            fee.shownAmount = Math.round(fee.Amount * 100);
        }

        $scope.getProductsByCategory = function (categoryId) {
            $scope.ProductList = [];
            $scope.productIds = [];

            $scope.ProductCategories.forEach(function (a) {
                if (Number(a.Name) === $scope.loan.CategoryId) {
                    $scope.productIds.push(a.Value);
                }
            });
            $scope.ProductListAll.forEach(function (a) {
                for (var i in $scope.productIds) {
                    if (a.Value === $scope.productIds[i]) {
                        $scope.ProductList.push(a);
                    }
                }
            });

            var i = 0;
            for (i = 0; i < $scope.ProductList.length; i++) {
                if (!$scope.ProductList[i].DisabledState) {
                    $scope.loan.ProductId = $scope.ProductList[i].Value;
                    break;
                }
            }
        }

        $scope.getBankAccounts = function () {
            filterService.GetActiveBankAccountListByBranch($scope.selectedBranchId).then(function (response) {
                $scope.bankaccountList = response.data;
                if ($scope.bankaccountList.length > 0) $scope.loan.BankAccountId = $scope.bankaccountList[0].Value;
            }, AMMS.handleServiceError);
        }


        $scope.getStatusOptions = function () {
            filterService.getProgramFilterDataByType('LoanAccountStatus').then(function (response) {
                $scope.statusList = response.data;
                if ($scope.statusList.length > 0) $scope.loan.Status = $scope.statusList[0].Value;
                $scope.statusList = $scope.statusList.filter(s => s.Value == 1);
                $scope.getFlagOptions();
            }, AMMS.handleServiceError);
        }

        $scope.getFlagOptions = function () {
            filterService.getProgramFilterDataByType('LoanFlag').then(function (response) {
                $scope.flagListMain = angular.copy(response.data);
                if ($scope.loan.Status === "1") {
                    $scope.flagList = $scope.flagListMain.filter(a => a.Value === "8" || a.Value === "9");
                    $scope.loan.Flag = "8";
                }
                if ($scope.loan.Status === "2") {
                    $scope.flagList = $scope.flagListMain.filter(a => a.Value === "6" || a.Value === "7");
                    $scope.loan.Flag = "6";
                }
                if ($scope.flagList.length > 0) $scope.loan.Flag = "8"; // good standig
            }, AMMS.handleServiceError);
        }

        $scope.ChangeStatus = function () {
            if ($scope.loan.Status === $rootScope.LoanAccountStatus.Active)
                $scope.flagList = $scope.flagListMain.filter(a => a.Value === $rootScope.LoanFlag.GoodStanding || a.Value === $rootScope.LoanFlag.BadStanding);
            if ($scope.loan.Status === $rootScope.LoanAccountStatus.Close)
                $scope.flagList = $scope.flagListMain.filter(a => a.Value === $rootScope.LoanFlag.Normal || a.Value === $rootScope.LoanFlag.EarlySettlement || a.Value === $rootScope.LoanFlag.BadDebt);
            if ($scope.flagList.length > 0)
                $scope.loan.Flag = $scope.flagList[0].Value;
        }

        $scope.getPaymentMethodOptions = function () {
            filterService.getProgramFilterDataByType('PaymentMethod').then(function (response) {
                $scope.paymentmethodList = response.data;
                if ($scope.paymentmethodList.length > 0) $scope.loan.PaymentMethodId = $scope.paymentmethodList[0].Value;
            }, AMMS.handleServiceError);
        }

        $scope.exportSchedule = function () {

            var filterString = "";
           

            filterString += 'Interestrate' + "|" + $scope.servicechargerate + "#";
            filterString += 'Principal' + "|" + $scope.loan.PrincipalAmount + "#";
            filterString += 'InstallmentAmount' + "|" + $scope.loan.InstallmentAmountPerThousand + "#";
            filterString += 'NumberOfIstallment' + "|" + $scope.loan.NumberOfInstallment + "#";
            filterString += 'DisburseDate' + "|" + $scope.DisburseDate + "#";
            filterString += 'GracePeriod' + "|" + $scope.loan.GracePeriod + "#";
            filterString += 'InstallmentFrequency' + "|" + $scope.loan.InstallmentFrequencyId + "#";
            filterString += 'GroupId' + "|" + $scope.loan.GroupId + "#";
            filterString += 'BranchId' + "|" + $scope.loan.CurrentBranchId + "#";
            filterString += 'IsSyncWithMeetingDay' + "|" + $scope.loan.IsSyncWithMeetingDay + "#";
            filterString += 'ProductId' + "|" + $scope.loan.ProductId + "#";
            filterString += 'AccountId' + "|" + '-10' + "#";
            filterString += 'Duration' + "|" + $scope.loan.Duration + "#";
            filterString += 'MemberId' + "|" + $scope.loan.MemberId + "#";

            var url = commonService.getExportUrl($rootScope.programsApiBaseUrl + 'account/loan/scheduleByDeclineExport', filterString, 'Schedule-list');
            window.open(url, '_blank');
        }

        $scope.getSchedule = function () {
            $scope.IsEverythingloaded = false;
            if ($scope.loan.PrincipalAmount == 0) {
                swal("Please insert principal amount");
                return;
            }
            
            if ($scope.loan.PrincipalAmount < $scope.loan.MinimumPrincipal || $scope.loan.PrincipalAmount > $scope.loan.MaximumPrincipal) {
                swal("Please insert principal amount between " + $scope.loan.MinimumPrincipal + " && " + $scope.loan.MaximumPrincipal);
                return;
            }

            $("#loadingImage").css("display", "block");
            $scope.operationOnFees();
            if (!angular.isDefined($scope.loan.InstallmentFrequencyId) || !angular.isDefined($scope.loan.ProductId) || !angular.isDefined($scope.loan.GracePeriod)) {
                $scope.scheduleList = [];
                $("#loadingImage").css("display", "none");
                return;
            }

            $scope.PrincipalAmountValidator($scope.loan.PrincipalAmount);

            $scope.loan.FinanceData.ServiceCharge = 0;
            $scope.loan.DisburseAmount = 0;
            $scope.DisburseDate = moment($scope.loan.DisburseDate).format();
            if ($scope.loan.PrincipalAmount == null) $scope.loan.PrincipalAmount = 0;
            loanaccountService.getSchedules($scope.servicechargerate, $scope.loan.PrincipalAmount, $scope.loan.InstallmentAmountPerThousand,
                                            $scope.loan.NumberOfInstallment, $scope.DisburseDate, $scope.loan.GracePeriod, $scope.loan.InstallmentFrequencyId,
                                            $scope.loan.GroupId, $scope.loan.CurrentBranchId, $scope.loan.IsSyncWithMeetingDay, $scope.loan.ProductId, -10, $scope.loan.Duration, $scope.loan.MemberId).then(function (response) {

                                                $scope.scheduleList = response.data;
                                                $scope.scheduleList.sort(function (a, b) {
                                                    return (moment(a.InstallmentDate).format('DD-MM-YYYY') > moment(b.InstallmentDate).format('DD-MM-YYYY')) ? 1 : ((moment(b.InstallmentDate).format('DD-MM-YYYY') > moment(a.InstallmentDate).format('DD-MM-YYYY')) ? -1 : 0);
                                                });
                                                $scope.scheduleList.forEach(function (s) {
                                                    if (s.InstallmentDate > moment($rootScope.workingdate).format()) {
                                                        s.OverdueInterestAmount = 0;
                                                        s.OverduePrincipalAmount = 0;
                                                        s.OverdueTotalAmount = 0;
                                                    }
                                                    $scope.loan.FinanceData.ServiceCharge += s.InterestAmount;

                                                    s.InterestAmount = Math.round(s.InterestAmount * 100) / 100;
                                                    s.TotalAmount = Math.round(s.TotalAmount * 100) / 100;
                                                    s.OutstandingInterestAmount = Math.round(s.OutstandingInterestAmount * 100) / 100;
                                                    s.OutstandingPrincipalAmount = Math.round(s.OutstandingPrincipalAmount * 100) / 100;
                                                    s.OutstandingTotalAmount = Math.round(s.OutstandingTotalAmount * 100) / 100;
                                                    s.OverdueInterestAmount = Math.round(s.OverdueInterestAmount * 100) / 100;
                                                    s.OverduePrincipalAmount = Math.round(s.OverduePrincipalAmount * 100) / 100;
                                                    s.OverdueTotalAmount = Math.round(s.OverdueTotalAmount * 100) / 100;
                                                    s.PrincipalAmount = Math.round(s.PrincipalAmount * 100) / 100;
                                                    s.PaidInterestAmount = Math.round(s.PaidInterestAmount * 100) / 100;
                                                    s.PaidPrincipalAmount = Math.round(s.PaidPrincipalAmount * 100) / 100;
                                                    s.PaidTotalAmount = Math.round(s.PaidTotalAmount * 100) / 100;
                                                    if (s.AdvanceAmount) s.AdvanceAmount = Math.round(s.AdvanceAmount * 100) / 100;

                                                    s.InstallmentDay = moment(s.InstallmentDate).format('ddd, DD/MM/YYYY');
                                                });
                                                $scope.loan.FinanceData.ServiceCharge = Math.round($scope.loan.FinanceData.ServiceCharge);
                                                if ($scope.scheduleList.length > 0) {
                                                    $scope.scheduleList.forEach(function (a) {
                                                        if (a.InstallmentNo == 1)
                                                            $scope.loan.FirstInstallmentDate = a.InstallmentDate;
                                                    });
                                                }
                                                $scope.loan.FirstInstallmentDay = moment($scope.loan.FirstInstallmentDate).format('dddd, DD/MM/YYYY');

                                                $scope.scheduleList.forEach(function (a) {
                                                    a.InstallmentDate = moment(a.InstallmentDate).format('DD-MM-YYYY');
                                                });
                                                $scope.loan.DisburseAmount = Number($scope.loan.FinanceData.ServiceCharge) + Number($scope.loan.PrincipalAmount);

                                                $("#loadingImage").css("display", "none");
                                            $scope.IsEverythingloaded = true;
                                            }, AMMS.handleServiceError);
        }


        $scope.changeGRT = function () {
            $("#loadingImage").css("display", "block");
            if (!($scope.loan.ProductId && $scope.ProductRates)) {
                $("#loadingImage").css("display", "none");
                return;
            }
            var serviceChargeFound = false;
            $scope.ServiceChargeList = [];
            for (i = 0; i < $scope.ProductRates.length; i++) {
                if ($scope.ProductRates[i].FundId === $scope.loan.FundId && $scope.ProductRates[i].SubCodeId == $scope.loan.SubCodeId && $scope.ProductRates[i].DurationId == $scope.loan.Duration &&
                    $scope.ProductRates[i].InstallmentFrequencyId == $scope.loan.InstallmentFrequencyId && $scope.ProductRates[i].GenderId == Number($scope.loan.Sex)) {
                    $scope.ServiceChargeList.push({ Name: $scope.ProductRates[i].DeclineInterestRate, Value: $scope.ProductRates[i].DeclineInterestRate });
                    $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
                    $scope.loan.PrincipalAmount = $scope.ProductRates[i].DefaultPrincipal;
                    $scope.loan.MinimumPrincipal = $scope.ProductRates[i].MinPrincipal;
                    $scope.loan.MaximumPrincipal = $scope.ProductRates[i].MaxPrincipal;
                    serviceChargeFound = true;
                    break;
                }
                //$scope.loan.PrincipalAmount = $scope.PrincipalAmount;
                var asd = $scope.loan.PrincipalAmount;
                var minPrincipal = $scope.loan.MinimumPrincipal;
                var maxPrincipal = $scope.loan.MaximumPrincipal;

                if (($scope.ProductRates[i].FundId === $scope.loan.FundId || $scope.ProductRates[i].FundId == $scope.allowAllValue) &&
                ($scope.ProductRates[i].SubCodeId == $scope.loan.SubCodeId || $scope.ProductRates[i].SubCodeId == $scope.allowAllValue) &&
                ($scope.ProductRates[i].DurationId == $scope.loan.Duration || $scope.ProductRates[i].DurationId == $scope.allowAllValue) &&
                ($scope.ProductRates[i].InstallmentFrequencyId == $scope.loan.InstallmentFrequencyId || $scope.ProductRates[i].InstallmentFrequencyId == $scope.allowAllValue) &&
                ($scope.ProductRates[i].GenderId == Number($scope.loan.Sex) || $scope.ProductRates[i].GenderId == $scope.allowAllValue)) {

                    $scope.ServiceChargeList.push({ Name: $scope.ProductRates[i].DeclineInterestRate, Value: $scope.ProductRates[i].DeclineInterestRate });
                    $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
                    $scope.loan.PrincipalAmount = $scope.ProductRates[i].DefaultPrincipal;
                    $scope.loan.MinimumPrincipal = $scope.ProductRates[i].MinPrincipal;
                    $scope.loan.MaximumPrincipal = $scope.ProductRates[i].MaxPrincipal;
                    serviceChargeFound = true;

                }
            }

            if (!serviceChargeFound) {
                $scope.ServiceChargeList.push({ Name: $scope.productDetails.DefaultDeclineInterestRate, Value: $scope.productDetails.DefaultDeclineInterestRate });
                $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
            }

            //$scope.PrincipalAmountValidator($scope.loan.PrincipalAmount);
            
            $scope.installmentFrequencyList = [];


            $scope.filterInstallmentFrequency(0);
            //if ($scope.ProductGracePeriods.length < 1) {
            //    $scope.graceperiodList = [];
            //    $scope.ProductTenures.forEach(function (a) {
            //        if ((a.DurationId === $scope.loan.Duration || a.DurationId === $scope.allowAllValue) &&
            //        (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || a.InstallmentFrequencyId === $scope.allowAllValue)) {
            //            if (a.GracePeriod === $scope.allowAllValue) {
            //                $scope.graceperiodList = [];
            //                $scope.graceperiodList = $scope.graceperiodListMain;
            //            } else $scope.graceperiodList.push({ Name: a.GracePeriod, Value: a.GracePeriod });
            //        }
            //    });
            //    $scope.graceperiodList = $scope.graceperiodList.filter(function (o) {
            //        return o.Value != $scope.allowAllValue;
            //    });
            //}

            //if ($scope.graceperiodList.length && !$scope.graceChanged > 0) {
            //    $scope.loan.GracePeriod = $scope.graceperiodList[0].Value;
                
            //}

            //var gflags = {};
            //$scope.graceperiodList = $scope.graceperiodList.filter(function (entry) {
            //    if (gflags[entry.Value]) {
            //        return false;
            //    }
            //    gflags[entry.Value] = true;
            //    return true;
            //});

            if (!$scope.graceperiodList.find( g => g.Value === $scope.loan.GracePeriod)) {
                if ($scope.graceperiodList.length > 0) $scope.loan.GracePeriod = $scope.graceperiodList[0].Value;
            }


            var specificGracePeriod = false;
            $scope.ProductGracePeriods.forEach(function (g) {
                if (!(g.DurationId === $scope.allowAllValue && g.GenderId == $scope.allowAllValue && g.InstallmentFrequencyId === $scope.allowAllValue)) {
                    specificGracePeriod = true;

                }
            });
            $scope.ProductGracePeriods.forEach(function (a) {
                if (specificGracePeriod &&
                ($scope.loan.Duration === a.DurationId || a.DurationId == $scope.allowAllValue) &&
                (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || a.InstallmentFrequencyId == $scope.allowAllValue) &&
                ($scope.loan.Sex == a.GenderId || a.GenderId == $scope.allowAllValue) &&
                (a.SchemeId == $scope.loan.SchemeId || a.SchemeId == $scope.allowAllValue)) {
                    $scope.graceperiodList = [];
                    $scope.graceperiodList.push({ Name: a.GracePeriodId, Value: a.GracePeriodId });

                }
            });
            var specificGracePeriodOfProduct = false;
            $scope.specificGracePeriodList.forEach(function (gp) {
                if (gp.DurationId === $scope.loan.Duration && gp.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId && gp.SchemeId === $scope.loan.SchemeId && gp.GenderId === $scope.memberSex) {
                    specificGracePeriodOfProduct = true;
                }
            });
            $scope.specificGracePeriodList.forEach(function (gp) {
                if (specificGracePeriodOfProduct && gp.DurationId === $scope.loan.Duration && gp.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId && gp.SchemeId === $scope.loan.SchemeId && gp.GenderId === $scope.memberSex) {
                    $scope.graceperiodList = [];
                    $scope.graceperiodList.push({ Name: gp.GracePeriodId, Value: gp.GracePeriodId });
                }
            });

            for (var i = 0; i < $scope.ProductGracePeriods.length; i++) {
                if (($scope.loan.Duration === $scope.ProductGracePeriods[i].DurationId || $scope.ProductGracePeriods[i].DurationId == $scope.allowAllValue) &&
                ($scope.ProductGracePeriods[i].InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || $scope.ProductGracePeriods[i].InstallmentFrequencyId == $scope.allowAllValue) &&
                ($scope.loan.Sex == $scope.ProductGracePeriods[i].GenderId || $scope.ProductGracePeriods[i].GenderId == $scope.allowAllValue) &&
                ($scope.ProductGracePeriods[i].SchemeId == $scope.loan.SchemeId)) {
                    $scope.graceperiodList = [];
                    $scope.graceperiodList.push({ Name: $scope.ProductGracePeriods[i].GracePeriodId, Value: $scope.ProductGracePeriods[i].GracePeriodId });
                    break;
                } else {
                    $scope.graceperiodList = [];
                    $scope.ProductTenures.forEach(function (a) {
                        if ((a.DurationId === $scope.loan.Duration || a.DurationId === $scope.allowAllValue) &&
                        (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || a.InstallmentFrequencyId === $scope.allowAllValue)) {
                            if (a.GracePeriod === $scope.allowAllValue) {
                                $scope.graceperiodList = [];
                                $scope.graceperiodList = $scope.graceperiodListMain;
                            } else $scope.graceperiodList.push({ Name: a.GracePeriod, Value: a.GracePeriod });
                        }
                    });
                }
            }


            ///can be deleted later 
            //if ($scope.graceperiodList.length > 0) $scope.loan.GracePeriod = $scope.graceperiodList[0].Value;
            //asdasd
            //$scope.ProductGracePeriods.forEach(function (a) {
            //    if (($scope.loan.Duration === a.DurationId || a.DurationId == $scope.allowAllValue) &&
            //    (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || a.InstallmentFrequencyId == $scope.allowAllValue) &&
            //    ($scope.loan.Sex == a.GenderId || a.GenderId == $scope.allowAllValue) &&
            //    (a.SchemeId == $scope.loan.SchemeId)) {
            //        $scope.graceperiodList = [];
            //        $scope.graceperiodList.push({ Name: a.GracePeriodId, Value: a.GracePeriodId });
            //    } else $scope.graceperiodList = $scope.graceperiodListMain;
            //});
            //for (var i = 0; i < $scope.ProductGracePeriods.length; i++) {
            //    if (($scope.loan.Duration === $scope.ProductGracePeriods[i].DurationId || $scope.ProductGracePeriods[i].DurationId == $scope.allowAllValue) &&
            //    ($scope.ProductGracePeriods[i].InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || $scope.ProductGracePeriods[i].InstallmentFrequencyId == $scope.allowAllValue) &&
            //    ($scope.loan.Sex == $scope.ProductGracePeriods[i].GenderId || $scope.ProductGracePeriods[i].GenderId == $scope.allowAllValue) &&
            //    ($scope.ProductGracePeriods[i].SchemeId == $scope.loan.SchemeId || $scope.ProductGracePeriods[i].SchemeId == $scope.allowAllValue)) {
            //        $scope.graceperiodList = [];
            //        $scope.graceperiodList.push({ Name: $scope.ProductGracePeriods[i].GracePeriodId, Value: $scope.ProductGracePeriods[i].GracePeriodId });
            //        if (!$scope.graceChanged) {
            //            $scope.loan.GracePeriod = $scope.graceperiodList[0].Value;
            //            $scope.graceChanged = true;
            //        }

            //        break;
            //    }
            //}
            $scope.ProductTenures.forEach(function (a) {
                if (a.DurationId === $scope.loan.Duration && (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || a.InstallmentFrequencyId === $scope.allowAllValue) && a.GracePeriod === $scope.loan.GracePeriod) {
                    $scope.loan.NumberOfInstallment = a.TotalNumberOfInstallment;
                    $scope.loan.InstallmentAmountPerThousand = a.InstallmentAmountPerThousand;
                }
            });

            $scope.durationListMain = [];
            $scope.ProductTenures.forEach(function (pt) {
                if (pt.DurationId !== $scope.allowAllValue) {
                    $scope.durationListMain.push({ Name: pt.DurationId, Value: pt.DurationId });
                }

            });

            $scope.durationList = $scope.durationListMain;

            $scope.specificDuration = false;
            $scope.ProductDurations.forEach(function (d) {
                if (!(d.FundId === $scope.allowAllValue && d.GroupTypeId === $scope.allowAllValue)) {
                    $scope.specificDuration = true;
                    $scope.durationList = [];
                }
            });

            $scope.matchFound = false;
            $scope.ProductDurations.forEach(function (a) {
                if ($scope.specificDuration && $scope.loan.FundId === a.FundId && ($scope.loan.GroupTypeId === a.GroupTypeId || a.GroupTypeId === $scope.allowAllValue)) {
                    $scope.durationList.push({ Name: a.DurationId, Value: a.DurationId });
                    $scope.matchFound = true;
                }
            });
            if (!$scope.matchFound) $scope.durationList = $scope.durationListMain;
            var dflags = {};
            $scope.durationList = $scope.durationList.filter(function (entry) {
                if (dflags[entry.Value]) {
                    return false;
                }
                dflags[entry.Value] = true;
                return true;
            });
            $("#loadingImage").css("display", "none");
            //if ($scope.loan.ProductId) $scope.getSchedule();
        }


        $scope.toggleFrqChange = function () {
            $scope.isfreqChanged = !$scope.isfreqChanged;
        }




        var checkIfExists = function (username) {
            return $scope.durationList.some(function (el) {
                return el.username === username;
            });
        }






        $scope.BankAccountValidator = function (account) {
            if (!account) return "Bank Account Number is required";
            return true;
        };

        $scope.PrincipalAmountValidator = function (amount) {
            amount = $scope.loan.PrincipalAmount;
            // add bypass for Admin, Secondary Loan & migrated Data 
            if (!($scope.loan.MinimumPrincipal && $scope.loan.MaximumPrincipal)) return true;
            if ($rootScope.user.Role == $rootScope.UserRole.Admin ||
                !$scope.productDetails.IsPrimary ) return true;

            //if ($scope.ServiceChargeList.length > 0) {
            //    var selectedServiceCharge = $scope.ServiceChargeList.filter(x => x.Value === $scope.servicechargerate);
            //    if (selectedServiceCharge.length > 0) {
            //        if (amount < selectedServiceCharge[0].MinPrincipal || amount > selectedServiceCharge[0].MaxPrincipal) return "Principal amount for this product must be between BDT " + selectedServiceCharge[0].MinPrincipal
            //                                                                                             + "and BDT " + selectedServiceCharge[0].MaxPrincipal;
            //    }
            //}

            if (amount < $scope.loan.MinimumPrincipal || amount > $scope.loan.MaximumPrincipal) return "Principal amount for this product must be between BDT " + $scope.loan.MinimumPrincipal
                                                                                                         + " and BDT " + $scope.loan.MaximumPrincipal;
            if ($scope.productDetails.PrincipleAmountMultipleOf !== null) {
                if (amount % $scope.productDetails.PrincipleAmountMultipleOf !== 0)
                    return "Principal amount must be multiple of " + $scope.productDetails.PrincipleAmountMultipleOf;
            }
            return true;
        };

        $scope.ChequeValidator = function (cheque) {
            if (!cheque) return "Bank Account Number is required";
            return true;
        };

        $scope.getSexCode = function () {
            if ($scope.loan.Sex === 'Female') return 0;
            if ($scope.loan.Sex === 'Male') return 1;
            return -1;
        }

        $scope.clearAndCloseTab = function () {
            $scope.loan = {};
            $scope.tab.ConfirmPrompt = false;
            $scope.execRemoveTab($scope.tab);
        };



        $scope.init = function () {
            declareVariable();
            //$("#loadingImage").css("display", "block");
            $scope.getMemberInfo();
            $scope.getCategory();
            $scope.getGroupDetails($scope.loan.GroupId);
            $scope.getBankAccounts($scope.loan.BranchId);
            $scope.getHolidays($scope.loan.BranchId);
            $scope.getStatusOptions();
            $scope.getFlagOptions();
            $scope.getPaymentMethodOptions();
            $scope.hasFee = false;
        }

        $scope.init();


        $scope.addLoanAccount = function () {

            if ($scope.loan.PrincipalAmount == 0) {
                swal("Please insert principal amount");
                return;
            }

            if ($scope.loan.IsSupplimentary) {
                $scope.addConfirmation = "This Loan Will be disbursed as Supplimentary, Are you sure?";
            } else {
                $scope.addConfirmation = $rootScope.addConfirmation;
            }

            if (!$rootScope.isDayOpenOrNot()) return;

            console.log($scope.loan);
            //if ($rootScope.user.Role != '4' && $rootScope.user.Role != '1' && $scope.loan.IsSupplimentary) {
            //    swal("Only RM/admin can disburse supplimentary loan");
            //    return;
            //}


            $scope.loan.Rate = $scope.servicechargerate;

            

            if ($scope.loan.PaymentMethodId === $rootScope.LoanPaymentMethod.Cash) {
                $scope.loan.BankAccountId = null;
                $scope.loan.ChequeNo = null;
                $scope.loan.IsAccountPayable = null;
            }

            if ($scope.loan.GroupTypeId == 1 && $scope.productDetails.IsPrimary && ($scope.loan.PrincipalAmount < $scope.loanRangeWithGroupType.filter(function (b) {
                return b.Name == 'GeneralLower';
            })[0].Value || $scope.loan.PrincipalAmount > $scope.loanRangeWithGroupType.filter(function (b) {
                return b.Name == 'GeneralUpper';
            })[0].Value)) {
                swal("'Principal Amount' exceeds allowed range for 'General' group type. Please type principal amount less than 100000 ", 'WARNING', 'warning');
                return;
            }

            if ($scope.loan.GroupTypeId == 2 && $scope.productDetails.IsPrimary && ($scope.loan.PrincipalAmount < $scope.loanRangeWithGroupType.filter(function (b) {
                return b.Name == 'SpecialLower';
            })[0].Value || $scope.loan.PrincipalAmount > $scope.loanRangeWithGroupType.filter(function (b) {
                return b.Name == 'SpecialUpper';
            })[0].Value)) {
                swal("'Principal Amount' is less than allowed range for 'Special' group type. Please type principal amount greater than 100000 ", 'WARNING', 'warning');
                return;
            }

            if ($scope.docError) {
                swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');
                return;
            }
            if ($scope.scheduleList === undefined || $scope.scheduleList.length < 1) {
                swal('please load the schedule by clicking the LOAD SCHEDULE button before submitting!');
                return;
            }
            transferService.IsMemberInTransferTransitState($scope.loan.MemberId, $scope.loan.BranchId).then(function (response) {
                if (response.data) {
                    swal("The Member is in Transfer Transit State");
                    return;
                }

                savingsAccountService.getSavingsAccounts($scope.loan.MemberId).then(function (response) {
                    $scope.savingsAccounts = response.data;
                    $scope.savingsAccounts = $scope.savingsAccounts.filter(s => s.Status === $rootScope.SavingsConfig.SavingsAccountStatus.Active && s.CategoryId === $rootScope.SavingsConfig.SavingsProductType.General);
                    if ($scope.savingsAccounts.length === 0) {
                        swal("The member does not have any active savings account. Please create/open a new savings account before disbursing this loan");
                        return;
                    }
                    swal({
                        title: $rootScope.showMessage($scope.addConfirmation, $rootScope.loanAccount),
                        showCancelButton: true,
                        confirmButtonText: "Yes, Create it!",
                        cancelButtonText: "No, cancel !",
                        type: "info",
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true,
                    },
                    function (isConfirmed) {
                        if (isConfirmed) {
                            $scope.loan.DisburseDate = moment($scope.loan.DisburseDate).format();

                            $scope.loan.AccountFeeInfo.forEach(function (a) {
                                a.Amount = Math.round(a.Amount * 100);
                            });
                            //$scope.getSchedule();
                            loanaccountService.addLoanAccount($scope.loan).then(function (response) {
                                if (response.data.Success) {
                                    if (response.data.Entity.Id && $scope.files.length > 0) {
                                        documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.LoanAccount, $rootScope.user.UserId)
                                            .then(function (res) {
                                                if (res.data.Success) {
                                                    $rootScope.$broadcast('loanAccount-add-finished', $scope.group);
                                                    swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.loanAccount), "Successful!", "success");
                                                    $scope.clearAndCloseTab();
                                                } else {
                                                    $scope.uploadError = true;
                                                    loanaccountService.deleteLoanAccount(response.data.Entity.Id);
                                                    swal($rootScope.docAddError, "File is not Uploaded", "error");
                                                }
                                            });
                                    } else {
                                        if (!$scope.uploadError) {
                                            $rootScope.$broadcast('loanAccount-add-finished', $scope.group);
                                            swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.loanAccount), "Successful!", "success");
                                        }
                                        $scope.clearAndCloseTab();
                                    }

                                } else {
                                    swal($rootScope.showMessage($rootScope.addError, $rootScope.loanAccount), response.data.Message, "error");
                                }
                            }, AMMS.handleServiceError);
                        } else {
                            swal("Cancelled", "something is wrong", "error");
                        }
                    });
                }, AMMS.handleServiceError);
            });

        }
        $scope.schemeChange = function () {
            //$scope.ProductGracePeriods.forEach(function (a) {

            //});
            for (var i = 0; i < $scope.ProductGracePeriods.length; i++) {
                if (($scope.loan.Duration === $scope.ProductGracePeriods[i].DurationId || $scope.ProductGracePeriods[i].DurationId == $scope.allowAllValue) &&
                ($scope.ProductGracePeriods[i].InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || $scope.ProductGracePeriods[i].InstallmentFrequencyId == $scope.allowAllValue) &&
                ($scope.loan.Sex == $scope.ProductGracePeriods[i].GenderId || $scope.ProductGracePeriods[i].GenderId == $scope.allowAllValue) &&
                ($scope.ProductGracePeriods[i].SchemeId == $scope.loan.SchemeId)) {
                    $scope.graceperiodList = [];
                    $scope.graceperiodList.push({ Name: $scope.ProductGracePeriods[i].GracePeriodId, Value: $scope.ProductGracePeriods[i].GracePeriodId });
                    break;
                } else {
                    $scope.graceperiodList = [];
                    $scope.ProductTenures.forEach(function (a) {
                        if ((a.DurationId === $scope.loan.Duration || a.DurationId === $scope.allowAllValue) &&
                        (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || a.InstallmentFrequencyId === $scope.allowAllValue)) {
                            if (a.GracePeriod === $scope.allowAllValue) {
                                $scope.graceperiodList = [];
                                $scope.graceperiodList = $scope.graceperiodListMain;
                            } else $scope.graceperiodList.push({ Name: a.GracePeriod, Value: a.GracePeriod });
                        }
                    });
                }
            }
        }


        $scope.removefile = function (file, files, propertyName) {
            var value = file.name;
            var i = AMMS.findWithAttr(files, propertyName, value);
            files.splice(i, 1);
            $scope.docSizeBoolChecker();
        }

        $scope.format = 'dd/MM/yyyy';

        $scope.checkSupplimentaryToPrimaryConvertionAbility = function () {
            if ($scope.HasPrimaryAccount) {
                swal("Can not save this loan account as an active Primary loan. Member already has an active primary loan");
                $scope.loan.IsSupplimentary = true;
            }
        }

        $scope.checkHoliday = function () {

            if ($scope.loan.DisburseDate === undefined || $scope.loan.DisburseDate === null) {
                swal("This date is required and can not be cleared!");
                $scope.loan.DisburseDate = $rootScope.workingdate;
                return;
            }

            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment($scope.loan.DisburseDate).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    $scope.loan.DisburseDate = $rootScope.workingdate;
                }
            });
        }

        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5))
                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.RM
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate)).add(-29, 'days')))
                || (moment(date) > moment(new Date($rootScope.workingdate)))
                || moment(date) < moment($scope.AdmissionDate))

                || ($rootScope.selectedBranchId > 0 && ($rootScope.user.Role == $rootScope.UserRole.BM || $rootScope.user.Role == $rootScope.UserRole.ABM || $rootScope.user.Role == $rootScope.UserRole.LO)
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate))))
                || (moment(date) > moment(new Date($rootScope.workingdate)))
                || moment(date) < moment($scope.AdmissionDate))

                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.DM
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate)).add(-89, 'days')))
                || (moment(date) > moment(new Date($rootScope.workingdate)))
                || moment(date) < moment($scope.AdmissionDate))

                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.Admin
                && (moment(date) > moment(new Date($rootScope.workingdate)))
                || moment(date) < moment($scope.AdmissionDate))
            ;
        }

        $scope.popupEntryDate = {
            opened: false
        };
        $scope.openEntryDate = function () {
            console.log($scope.branchHolidayAndOffDay);
            $scope.popupEntryDate.opened = true;
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1,
            showWeeks: false
        };

        

    }
]);