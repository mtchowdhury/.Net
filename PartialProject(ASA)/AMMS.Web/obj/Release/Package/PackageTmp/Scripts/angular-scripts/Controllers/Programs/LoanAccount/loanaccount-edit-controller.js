ammsAng.controller('loanaccountEditController', [
    '$scope', '$rootScope', '$timeout', 'loanaccountService', 'transferService', 'memberDailyTransactionService',
    'branchService', 'filterService', 'loanGroupService', 'productService', 'workingDayService', 'commonService',
    'DTOptionsBuilder', 'DTColumnDefBuilder', 'documentService', 'feeService', 'memberService',
    function ($scope, $rootScope, $timeout, loanaccountService, transferService, memberDailyTransactionService,
        branchService, filterService, loanGroupService, productService, workingDayService, commonService,
        DTOptionsBuilder, DTColumnDefBuilder, documentService, feeService, memberService) {

        var declareVariable = function () {
            $scope.loan = {};
            $scope.supplistate = null;
            $scope.loan.MemberId = angular.copy($scope.selectedMenu.Id);
            $scope.loan.BranchId = angular.copy($scope.selectedBranchId);
            $scope.loan.GroupId = angular.copy($scope.selectedMenu.GroupId);
            $scope.loan.LoanOfficerId = null;
            //$scope.loan.IsSupplimentary = 0;
            // $scope.member = angular.copy($scope.selectedMenu.ToolTip);
            $scope.group = null;
            $scope.workingDayInt = 20170103000000;
            $scope.loan.OriginatingBranchId = $scope.selectedBranchId;
            $scope.ProductCategories = [];
            $scope.ProductListAll = [];
            $scope.productIds = [];
            $scope.ProductList = [];
            $scope.ServiceChargeList = [];
            $scope.installmentFrequencyList = [];
            $scope.installmentFrequencyListMain = [];
            $scope.loan.NumberOfInstallment = 44;
            $scope.loan.FinanceData = {};
            $scope.servicechargerate = 25;
            //$scope.loan.PrincipalAmount = 10000;
            $scope.otherInfo = false;
            $scope.freqChanged = false;
            $scope.FirstTime = true;
            $scope.loan.FundId = null;
            $scope.ProductTenures = [];
            $scope.loan.FinanceData.ServiceCharge = 0;
            $scope.loan.Rate = 0;
            $scope.isfreqChanged = false;
            $scope.isDurationChanged = false;
            $scope.graceperiodListMain = [];
            $scope.uploadError = false;
            $scope.availableFees = null;
            $scope.graceChanged = true;
            $scope.loanRangeWithGroupType = null;

            $scope.loan.IsAccountpayable = false;
            $scope.loan.IsSyncWithMeetingDay = false;
            $scope.loan.IsSupplimentary = false;

            $scope.uploadedFiles = [];
            $scope.files = [];
            $scope.loanAccountId = '';
            $scope.GroupTypeId = null;
            $scope.durationList = [];
            $scope.ProductGracePeriods = [];
            $scope.feePolicy = null;
            $scope.durationListMain = [];
            $scope.installmentFrequencyAll = [];
            $scope.installmentFrequencyFiltered = [];
            $scope.allowAllValue = -100000;
            $scope.allowNone = -999999;
            $scope.productDetails = {};
            $scope.branchHolidayAndOffDay = [];
            $scope.workingDay = $rootScope.workingdate;
            $scope.loanMain = [];
            $scope.IsFirstTimeLoaded = true; // forfirst time load [0].value s wont be selected and schedulelist wont be fteched
            $scope.IsProductChanged = false;
            $scope.roleId = $rootScope.user.Role;
            $scope.specificGracePeriodList = null;
            $scope.fChange = true;
            $scope.memberSex = null;
            $scope.savedLoanAccount = {};
            $scope.editLoanAccountId = angular.copy($rootScope.editLoanAccount.Id);
            $scope.editMemberId = angular.copy($rootScope.editLoanAccount.MemberId);
            $scope.haveToCheckForSupplimentary = false;
            $scope.showSupplimentaryCheckbox = true;
        }

        var declareVariable2 = function () {
            $scope.loan = {};
            $scope.supplistate = null;
            $scope.loan.LoanOfficerId = null;
            //$scope.loan.IsSupplimentary = 0;
            //$scope.member = $scope.selectedMenu.ToolTip;
            $scope.group = null;
            $scope.workingDayInt = 20170103000000;
            $scope.ProductCategories = [];
            $scope.ProductListAll = [];
            $scope.productIds = [];
            $scope.ProductList = [];
            $scope.ServiceChargeList = [];
            $scope.installmentFrequencyList = [];
            $scope.installmentFrequencyListMain = [];
            $scope.loan.NumberOfInstallment = 44;
            $scope.loan.FinanceData = {};
            $scope.servicechargerate = 25;
            //$scope.loan.PrincipalAmount = 10000;
            $scope.otherInfo = false;
            $scope.freqChanged = false;
            $scope.FirstTime = true;
            $scope.loan.FundId = null;
            $scope.ProductTenures = [];
            $scope.loan.FinanceData.ServiceCharge = 0;
            $scope.loan.Rate = 0;
            $scope.isfreqChanged = false;
            $scope.isDurationChanged = false;
            $scope.graceperiodListMain = [];
            $scope.uploadError = false;
            $scope.availableFees = null;
            $scope.graceChanged = true;
            $scope.loanRangeWithGroupType = null;

            $scope.loan.IsAccountpayable = false;
            $scope.loan.IsSyncWithMeetingDay = false;
            $scope.loan.IsSupplimentary = false;

            $scope.uploadedFiles = [];
            $scope.files = [];
            $scope.loanAccountId = '';
            $scope.GroupTypeId = null;
            $scope.durationList = [];
            $scope.ProductGracePeriods = [];
            $scope.feePolicy = null;
            $scope.durationListMain = [];
            $scope.installmentFrequencyAll = [];
            $scope.installmentFrequencyFiltered = [];
            $scope.allowAllValue = -100000;
            $scope.allowNone = -999999;
            $scope.productDetails = {};
            $scope.branchHolidayAndOffDay = [];
            $scope.workingDay = $rootScope.workingdate;
            $scope.loanMain = [];
            $scope.IsFirstTimeLoaded = true; // forfirst time load [0].value s wont be selected and schedulelist wont be fteched
            $scope.IsProductChanged = false;
            $scope.roleId = $rootScope.user.Role;
            $scope.specificGracePeriodList = null;
            $scope.fChange = true;
            $scope.memberSex = null;
            $scope.savedLoanAccount = {};


        }

        declareVariable();
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

        $scope.getHolidays = function (branchId) {
            memberDailyTransactionService.getBranchOffDayAndHolidays(branchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }

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
        $scope.graceChange = function () {
            $scope.graceChanged = true;
        }

        $scope.dtColumnDefs = [
             { targets: 'no-sort', orderable: false, sortable: false }
            //    DTColumnDefBuilder.newColumnDef(0)
            //        .withOption("color", "black"),
            //    DTColumnDefBuilder.newColumnDef(1)
            //        .withOption('autoWidth', false),
            //    DTColumnDefBuilder.newColumnDef(0)
            //        .withOption('order', []),
            //    DTColumnDefBuilder.newColumnDef(1)
            //        .withOption('sort', []),
            //{ order: [[2, 'asc']] }
        ];
        //$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [[]]);
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
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        if ($dates[d].utcDateValue < minDate.valueOf() || $dates[d].utcDateValue > maxDate.valueOf() ||
                            $dates[d].utcDateValue < moment($scope.AdmissionDate).valueOf() ||
                            $dates[d].utcDateValue < moment($scope.productDetails.StartDate).valueOf()) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }

            //for (d in $dates) {
            //    if ($dates[d].utcDateValue >= moment($scope.workingDay).add(1, 'days').valueOf() ||
            //        $dates[d].utcDateValue < moment($scope.AdmissionDate).valueOf() ||
            //        $dates[d].utcDateValue < moment($scope.productDetails.StartDate).valueOf()) {
            //        $dates[d].selectable = false;
            //    }
            //}
        }
        $scope.beforeCloseDateRender = function ($dates) {
            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM) {
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
        $scope.getCategory = function () {
            productService.getProductCategoryByProductType(1).then(function (response) {
                $scope.categoryList = response.data;
                $scope.getCategoryByProduct($scope.loan.ProductId);

                var primaryCount = 0;
                var specialCount = 0;
                var projectCount = 0;
                var msmeCount = 0;
                $scope.ProductListAll.forEach(function (p) {
                    $scope.ProductCategories.forEach(function (pc) {
                        if (p.Value == pc.Value && !p.DisabledState) {
                            if (pc.Name == $rootScope.LoanConfig.LoanProductCategory.Primary) primaryCount++;
                            else if (pc.Name == $rootScope.LoanConfig.LoanProductCategory.Special) specialCount++;
                            else if (pc.Name == $rootScope.LoanConfig.LoanProductCategory.ProjectLoan) projectCount++;
                            else if (pc.Name == $rootScope.LoanConfig.LoanProductCategory.MSME) msmeCount++;
                        }
                    });
                });
                if (primaryCount == 0) {
                    $scope.categoryList = $scope.categoryList.filter(function (c) {
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
            }, AMMS.handleServiceError);
        }

        $scope.getCategoryByProduct = function (productId) {
            $scope.ProductCategories.forEach(function (a) {
                if (Number(a.Value) === productId) {
                    $scope.loan.CategoryId = Number(a.Name);
                }
            });

            $scope.getProductsByCategory($scope.loan.CategoryId);
        }

        $scope.getProducts = function () {
            loanaccountService.getProductsByMemberBranch($scope.loan.MemberId, $scope.loan.BranchId, moment($scope.loan.DisburseDate).format(), $scope.loan.ProductId).then(function (response) {
                $scope.ProductListAll = response.data.Products;
                $scope.ProductList = response.data.Products;
                $scope.ProductCategories = response.data.ProductsCategories;


                //$scope.getProductsByCategory($scope.loan.CategoryId);
                $scope.ProductListAll.forEach(function (p) {
                    if (p.DisabledState && p.Value !== $scope.loan.ProductId) p.Name = p.Name + " (" + p.Reason + " )";
                    if (p.DisabledState && p.Value === $scope.loan.ProductId) p.DisabledState = false;
                });

                $scope.loan.ProductId = $scope.loanMain.ProductId;
                //for (var k = 0; k < $scope.ProductList.length; k++) {
                //    if (!$scope.ProductList[k].DisabledState) {
                //        $scope.loan.ProductId = $scope.ProductList[k].Value;
                //        break;
                //    }
                //}

                if ($scope.loan.ProductId) {
                    $scope.getCategory();
                    $scope.getFiltersByProduct($scope.loan.ProductId);
                    $scope.getProductDetails();
                } else {
                    $("#loadingImage").css("display", "none");
                }
            }, AMMS.handleServiceError);
        }

        $scope.getSpecificProductGracePeriods = function () {
            if (!$scope.loan.ProductId) {
                swal("Please Select a product!");
                return;
            }
            loanaccountService.getSpecificProductGracePeriods($scope.loan.ProductId).then(function (response) {
                $scope.specificGracePeriodList = response.data;
            });
        }

        $scope.getFiltersByProduct = function (productId) {
            $scope.productId = productId;
            //$scope.getFees();
            $scope.getProductDetails(); // for fetching product details when chaning the product ; prods ng-change calls this function
            $scope.getSpecificProductGracePeriods();
            if ($scope.loan.ProductId) {
                loanaccountService.getFiltersByProduct(productId).then(function (response) {
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
                    //if ($scope.subcodeList[0]) $scope.loan.SubCodeId = $scope.subcodeList[0].Value;

                    $scope.schemeList = response.data.Schemes;
                    $scope.schemeList = $scope.schemeList.sort(function (a, b) {
                        var textA = a.Name.toUpperCase();
                        var textB = b.Name.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });
                    //if ($scope.schemeList[0]) $scope.loan.SchemeId = $scope.schemeList[0].Value;

                    $scope.fundList = response.data.Funds;
                    //if ($scope.fundList[0]) $scope.loan.FundId = $scope.fundList[0].Value;

                    $scope.getProductTenures();
                    $scope.checkForSupplimentary();


                }, AMMS.handleServiceError);


                //loanaccountService.getCycleOfMemberProduct($scope.loan.MemberId, $scope.loan.ProductId).then(function (response) {
                //$scope.loan.LoanCycle = response.data;
                //}, AMMS.handleServiceError);
            }
        }

        $scope.checkForSupplimentary = function () {
            //$scope.haveToCheckForSupplimentary
            if (!$scope.savedLoanAccount.IsPrimary && $scope.HasPrimaryAccount && $scope.loan.IsPrimary) {
                $scope.showSupplimentaryCheckbox = true;
                $scope.IsSupplimentary = false;
                $scope.loan.IsSupplimentary = true;
            }
            if (!$scope.loan.IsPrimary) {
                $scope.showSupplimentaryCheckbox = false;
                $scope.loan.IsSupplimentary = false;
            } else {
                $scope.showSupplimentaryCheckbox = true;
            }

        }

        $scope.getProductTenures = function () {
            if (!$scope.loan.ProductId) {
                swal("Please Select a product!");
                return;
            }
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
                    if (pt.DurationId !== -100000) {
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
                    if (!(d.FundId === -100000 && d.GroupTypeId === -100000)) {
                        $scope.specificDuration = true;
                        $scope.durationList = [];
                    }
                });

                $scope.matchFound = false;
                $scope.durationList = [];
                $scope.ProductDurations.forEach(function (a) {
                    if ($scope.specificDuration && $scope.loan.FundId === a.FundId && ($scope.loan.GroupTypeId === a.GroupTypeId || a.GroupTypeId === -100000)) {
                        $scope.durationList.push({ Name: a.DurationId, Value: a.DurationId });
                        $scope.matchFound = true;
                    }
                });
                if (!$scope.matchFound) $scope.durationList = $scope.durationListMain;
                if ($scope.durationList.length > 0 && (!$scope.IsFirstTimeLoaded || $scope.isDurationChanged)) $scope.loan.Duration = $scope.durationList[0].Value;
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
                $scope.filterInstallmentFrequency();
            });
        }

        $scope.filterInstallmentFrequency = function () {
            $scope.installmentFrequencyList = [];

            $scope.ProductTenures.forEach(function (a) {
                if (a.DurationId == $scope.loan.Duration) {
                    if (a.InstallmentFrequencyId === -100000) {
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
            //if ($scope.installmentFrequencyList[0] && (!$scope.IsFirstTimeLoaded || !$scope.isfreqChanged)) $scope.loan.InstallmentFrequencyId = $scope.installmentFrequencyList[0].Value;
            //TODO change 1 from rootscope variable

            memberService.getMember($scope.loan.MemberId).then(function (response) {
                $scope.loan.MeetingDayId = response.data.MeetingDayId;
                if ($scope.loan.MeetingDayId == $rootScope.meetingDayId.None) {
                    $scope.loan.IsSyncWithMeetingDay = false;
                    $scope.IsSyncDisabled = true;
                } else {
                    if ($scope.loan.InstallmentFrequencyId === $rootScope.loanAccountInstallmentFrequency.Weekly) {
                        $scope.loan.IsSyncWithMeetingDay = true;
                        $scope.IsSyncDisabled = true;
                    } else if ($scope.loan.InstallmentFrequencyId === $rootScope.loanAccountInstallmentFrequency.Monthly) {
                        $scope.loan.IsSyncWithMeetingDay = true;
                        $scope.IsSyncDisabled = false;
                    }
                }
            });

            //if ($scope.loan.InstallmentFrequencyId === $rootScope.loanAccountInstallmentFrequency.Weekly) {
            //    $scope.loan.IsSyncWithMeetingDay = true;
            //    memberService.getMember($scope.loan.MemberId).then(function (response) {
            //        $scope.loan.MeetingDayId = response.data.MeetingDayId;
            //        if ($scope.loan.MeetingDayId != $rootScope.meetingDayId.None) $scope.IsSyncDisabled = true;
            //        else $scope.IsSyncDisabled = false;
            //    });
            //}
            //else if ($scope.loan.InstallmentFrequencyId === $rootScope.loanAccountInstallmentFrequency.Monthly) {
            //    $scope.IsSyncDisabled = false;
            //    if ($scope.loan.MeetingDayId != $rootScope.meetingDayId.None) $scope.loan.IsSyncWithMeetingDay = true;
            //    else $scope.loan.IsSyncWithMeetingDay = false;
            //}

            //if ($scope.loan.InstallmentFrequencyId === 1) $scope.loan.IsSyncWithMeetingDay = true;
            //else $scope.loan.IsSyncWithMeetingDay = false;
            //if ($scope.installmentFrequencyList[0] && !$scope.isfreqChanged) {
            //    //$scope.loan.InstallmentFrequencyId = $scope.installmentFrequencyList[0].Value;
            //} else $scope.loan.InstallmentFrequencyId = $scope.loan.InstallmentFrequencyId;
            $scope.getGracePeriod();
        }

        $scope.changeIsSync = function () {
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
                        $scope.ProductRates[i].InstallmentFrequencyId == $scope.loan.InstallmentFrequencyId && $scope.ProductRates[i].GenderId == Number($scope.loan.Sex)) {
                        $scope.ServiceChargeList.push({ Name: $scope.ProductRates[i].DeclineInterestRate, Value: $scope.ProductRates[i].DeclineInterestRate });
                        $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
                        $scope.loan.MinimumPrincipal = $scope.ProductRates[i].MinPrincipal;
                        $scope.loan.MaximumPrincipal = $scope.ProductRates[i].MaxPrincipal;
                        $scope.PrincipalAmountValidator($scope.loan.PrincipalAmount);

                        serviceChargeFound = true;
                        break;
                    }

                    if (($scope.ProductRates[i].FundId === $scope.loan.FundId || $scope.ProductRates[i].FundId == -100000) &&
                        ($scope.ProductRates[i].SubCodeId == $scope.loan.SubCodeId || $scope.ProductRates[i].SubCodeId == -100000) &&
                        ($scope.ProductRates[i].DurationId == $scope.loan.Duration || $scope.ProductRates[i].DurationId == -100000) &&
                        ($scope.ProductRates[i].InstallmentFrequencyId == $scope.loan.InstallmentFrequencyId || $scope.ProductRates[i].InstallmentFrequencyId == -100000) &&
                        ($scope.ProductRates[i].GenderId == Number($scope.loan.Sex) || $scope.ProductRates[i].GenderId == -100000)) {
                        $scope.ServiceChargeList.push({ Name: $scope.ProductRates[i].DeclineInterestRate, Value: $scope.ProductRates[i].DeclineInterestRate });
                        $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
                        $scope.loan.MinimumPrincipal = $scope.ProductRates[i].MinPrincipal;
                        $scope.loan.MaximumPrincipal = $scope.ProductRates[i].MaxPrincipal;
                        $scope.PrincipalAmountValidator($scope.loan.PrincipalAmount);
                        serviceChargeFound = true;
                    }
                }

                if (!serviceChargeFound) {
                    $scope.ServiceChargeList.push({ Name: $scope.productDetails.DefaultDeclineInterestRate, Value: $scope.productDetails.DefaultDeclineInterestRate });
                    $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
                }
                if ($scope.IsFirstTimeLoaded) { $("#loadingImage").css("display", "none"); }
                //if ($scope.servicechargerate && !$scope.IsFirstTimeLoaded) $scope.getSchedule();
                $scope.IsFirstTimeLoaded = false;
            }, AMMS.handleServiceError);
        }

        $scope.getFees = function () {
            if (!$scope.loan.ProductId) {
                swal("Please Select a product!");
                return;
            }
            feeService.getByProduct($scope.loan.ProductId).then(function (response) {
                $scope.hasFee = false;
                $scope.availableFees = response.data;
                if ($scope.availableFees.length < 1) {
                    $scope.hasFee = false;
                    return;
                }
                else $scope.hasFee = true;
                if ($scope.loan.ProductId === $scope.savedLoanAccount.ProductId && $scope.loan.Duration === $scope.savedLoanAccount.Duration && $scope.loan.PrincipalAmount === $scope.savedLoanAccount.PrincipalAmount) {
                    $scope.loan.AccountFeeInfo.forEach(function (feeInfo) {
                        $scope.availableFees.forEach(function (avFee) {
                            if (feeInfo.FeeId === avFee.Id) {
                                feeInfo.Name = avFee.Name;
                                feeInfo.ChargeType = avFee.ChargeType;
                                feeInfo.SelectedPolicy = feeInfo.SelectedPolicy.toString();
                            }
                        });
                    });
                    $scope.savedLoanAccount.AccountFeeInfo = angular.copy($scope.loan.AccountFeeInfo);
                }

            });
            feeService.getFeeConfig("PolicyType").then(function (response) {
                $scope.feePolicy = response.data;
            });
            $scope.getStatusOptions();

        }
        $scope.operationOnFees = function () {
            $scope.loan.AccountFeeInfo = [];
            if ($scope.loan.ProductId === $scope.savedLoanAccount.ProductId && $scope.loan.Duration === $scope.savedLoanAccount.Duration && $scope.loan.PrincipalAmount === $scope.savedLoanAccount.PrincipalAmount) {
                $scope.loan.AccountFeeInfo = angular.copy($scope.savedLoanAccount.AccountFeeInfo);
                return;
            }

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
                    //if ($scope.loan.CategoryId === 5) {
                    //    var matchedInsurance = sourceObject.FeeRateFrequency.find(f => f.Policy == null && f.Frequency == null && f.Duration == $scope.loan.Duration && ($scope.loan.PrincipalAmount >= f.MinPrinciple && $scope.loan.PrincipalAmount <= f.MaxPrinciple));
                    //    if (matchedInsurance != undefined) {
                    //        appliedRow.Value = matchedInsurance.Value;
                    //    }
                    //} else {
                    for (var j = 0; j < sourceObject.FeeRateFrequency.length; j++) {
                        if (sourceObject.FeeRateFrequency[j].Policy == feeObject.SelectedPolicy) {
                            appliedRow = sourceObject.FeeRateFrequency[j];
                            break;
                        }
                    }
                    // }

                } else {
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
                    feeObject.Amount = amountRateIsAppliedTo * appliedRow.Value;
                }

                if (feeObject.Amount > 0) {
                    $scope.loan.AccountFeeInfo.push(feeObject);
                }
                if ($scope.loan.AccountFeeInfo)
                    $scope.hasFee = true;
                else
                    $scope.hasFee = false;
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
            if (sourceObject.CalculationMethod == 1) {
                fee.Amount = appliedRow.Value;
            } else {
                if (sourceObject.CalculationMethod == 2) amountRateIsAppliedTo = $scope.loan.PrincipalAmount;
                if (sourceObject.CalculationMethod == 3) amountRateIsAppliedTo = $scope.loan.DisburseAmount;
                //fee.Amount = amountRateIsAppliedTo * appliedRow.Value / 100;
                //checking
                fee.Amount = amountRateIsAppliedTo * appliedRow.Value;
            }
        }

        $scope.getProductDetails = function () {
            if (!$scope.loan.ProductId) {
                swal("Please Select a product!");
                return;
            }
            loanaccountService.getProductInfo($scope.loan.ProductId).then(function (response) {
                $scope.productDetails = response.data;

                if ((!$scope.IsFirstTimeLoaded || $scope.isfreqChanged || $scope.isDurationChanged) && response.data.DefaultPrincipal)
                    $scope.loan.PrincipalAmount = response.data.DefaultPrincipal;

                $scope.loan.MinimumPrincipal = response.data.MinimumPrincipal;
                $scope.loan.MaximumPrincipal = response.data.MaximumPrincipal;
                //$scope.loan.IsSupplimentary = response.data.IsSupplimentary;
                $scope.loan.IsPrimary = response.data.IsPrimary;
                // if (!$scope.loan.IsPrimary && $scope.IsFirstTimeLoaded && !$scope.haveToCheckForSupplimentary)$scope.haveToCheckForSupplimentary = true;
                if (!$scope.savedLoanAccount.IsPrimary) $scope.haveToCheckForSupplimentary = true;
                $scope.IsSupplimentary = angular.copy(response.data.IsSupplimentary);
            }, AMMS.handleServiceError);
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

            if (!$scope.IsFirstTimeLoaded && !$scope.IsProductChanged) {
                var i = 0;
                for (i = 0; i < $scope.ProductList.length; i++) {
                    if (!$scope.ProductList[i].DisabledState) {
                        $scope.loan.ProductId = $scope.ProductList[i].Value;
                        break;
                    }
                }
            }
            $scope.IsProductChanged = false;
            if (!$scope.loan.ProductId) $scope.scheduleList = [];
        }
        $scope.toggleProductChange = function () {
            $scope.IsProductChanged = true;
            $scope.getCategoryByProduct($scope.loan.ProductId);
        }

        $scope.getGroupDetails = function () {
            loanGroupService.getloanGroup($scope.loan.GroupId).then(function (response) {
                $scope.group = response.data.Name;
                $scope.loan.LoanOfficerId = response.data.ProgramOfficerId;
                $scope.GroupTypeId = response.data.GroupTypeId;
                $scope.loan.GroupTypeId = response.data.GroupTypeId;
            }, AMMS.handleServiceError);
        }

        $scope.getBankAccounts = function () {
            filterService.GetActiveBankAccountListByBranch($scope.loan.BranchId).then(function (response) {
                $scope.bankaccountList = response.data;

                $scope.getAccountDetails();

            }, AMMS.handleServiceError);
        }

        $scope.getAccountDetails = function () {
            $("#loadingImage").css("display", "block");
            loanaccountService.getLoanAccount($scope.editLoanAccountId).then(function (response) {
                $scope.loan = response.data;
                $scope.ClosingDate = new Date(angular.copy($scope.loan.ClosingDate));
                $scope.loan.DisburseDate = new Date($scope.loan.DisburseDate);
                $scope.loan.ClosingDate = $scope.loan.ClosingDate == null ? null : new Date(moment($scope.loan.ClosingDate).format("YYYY-MM-DD"));
                $scope.loan.ResolvedDate = $scope.loan.ResolvedDate == null ? null : new Date(moment($scope.loan.ResolvedDate).format("YYYY-MM-DD"));
                $scope.dateOptionResolvedDate.maxDate = $scope.loan.ClosingDate ? new Date(moment($scope.loan.ClosingDate).format("YYYY-MM-DD")) : new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
                $scope.dateOptionResolvedDate.minDate = new Date(moment($scope.loan.DisburseDate).format("YYYY-MM-DD")),
                console.log($scope.loan);
                $scope.savedLoanAccount = angular.copy(response.data);
                $scope.supplistate = response.data.IsSupplimentary;
                $scope.loan.IsSupplimentary = response.data.IsSupplimentary;
                if ($scope.loan.BankAccountId != null) $scope.loan.BankAccountId = $scope.loan.BankAccountId.toString();
                $scope.member = $scope.loan.MemberName;
                if ($scope.loan.Sex === "0") $scope.loan.Sex = "Female";
                else if ($scope.loan.Sex === "1") $scope.loan.Sex = "Male";

                if ($scope.loan.PaymentMethodId) $scope.loan.PaymentMethodId = $scope.loan.PaymentMethodId.toString();
                $scope.loanMain = angular.copy(response.data);

                if ($scope.loan.LoanGrantor || $scope.loan.LoanWitness || $scope.loan.ApprovedBy) $scope.otherInfo = true;
                $scope.scheduleList = response.data.LoanSchedule;
                $scope.scheduleList.forEach(function (s) {
                    if (s.InstallmentDate > moment($rootScope.workingdate).format()) {
                        s.OverdueInterestAmount = 0;
                        s.OverduePrincipalAmount = 0;
                        s.OverdueTotalAmount = 0;
                    }
                    s.InterestAmount = Math.round(s.InterestAmount * 100) / 100;
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
                    s.InstallmentDay = moment(s.InstallmentDate).format('ddd, DD/MM/YYYY');

                });
                if ($scope.scheduleList[0]) $scope.loan.FirstInstallmentDay = moment($scope.loan.FirstInstallmentDate).format('dddd, DD/MM/YYYY');

                $scope.loan.FinanceData.ServiceCharge = response.data.FinanceData.OriginalInterest;


                if ($scope.loan.PaymentMethodId) $scope.loan.PaymentMethodId = $scope.loan.PaymentMethodId.toString();
                $scope.servicechargerate = $scope.loan.Rate;
                $scope.loan.BranchId = $scope.loan.CurrentBranchId;
                $scope.loanAccountId = $scope.editLoanAccountId;

                $scope.getProducts();
                documentService.getFilesbyEntity($scope.loanAccountId, $rootScope.FileUploadEntities.LoanAccount).then(function (response) {
                    $scope.uploadedFiles = response.data;
                    $rootScope.loanAccountFileHash = response.data && response.data.length > 0 ? response.data[0].Hash : '';
                }, AMMS.handleServiceError);
                $scope.getFees();
            }, AMMS.handleServiceError);
        }

        $scope.getMemberInfo = function () {
            loanaccountService.getMemberInfo($scope.loan.MemberId).then(function (response) {
                $scope.HasPrimaryAccount = response.data.HasPrimaryAccount;
                $scope.AdmissionDate = response.data.AdmissionDate;
                $scope.memberSex = Number(response.data.Sex);
                if (response.data.Sex === "0") $scope.loan.Sex = "Female";
                else $scope.loan.Sex = "Male";
                //$scope.loan.Sex = response.data.Sex;
            }, AMMS.handleServiceError);
        }

        $scope.getStatusOptions = function () {
            filterService.getProgramFilterDataByType('LoanAccountStatus').then(function (response) {
                $scope.statusList = response.data;
                $scope.statusList = $scope.statusList.filter(s => s.Value != 3);
                $scope.getFlagOptions();
            }, AMMS.handleServiceError);
        }
        $scope.getFlagOptions = function () {
            filterService.getProgramFilterDataByType('LoanFlag').then(function (response) {
                $scope.flagListMain = angular.copy(response.data);
                console.log($scope.flagListMain);
                //if ($scope.savedLoanAccount.Status == $rootScope.LoanConfig.LoanAccountStatus.Active) {
                if ($scope.loan.Status == $rootScope.LoanConfig.LoanAccountStatus.Active) {

                    $scope.flagList = $scope.flagListMain.filter(a => a.Value == $rootScope.LoanConfig.LoanFlag.GoodStanding
                        || a.Value == $rootScope.LoanConfig.LoanFlag.BadStanding
                        || a.Value == $rootScope.LoanConfig.LoanFlag.NewOrDisbursed
                        || a.Value == $rootScope.LoanConfig.LoanFlag.ReOpened
                        );
                    // }

                }
                if ($scope.savedLoanAccount.Status == $rootScope.LoanConfig.LoanAccountStatus.Close) {

                    $scope.flagList = $scope.flagListMain.filter(a => a.Value == $rootScope.LoanConfig.LoanFlag.Normal
                        || a.Value == $rootScope.LoanConfig.LoanFlag.EarlySettlement || a.Value == $rootScope.LoanConfig.LoanFlag.BadDebt
                        || a.Value == $rootScope.LoanConfig.LoanFlag.FullPaid
                        || a.Value == $rootScope.LoanConfig.LoanFlag.DisabilityResolve
                        || a.Value == $rootScope.LoanConfig.LoanFlag.DeathResolve);

                }
                $scope.operationOnFees();
            }, AMMS.handleServiceError);
        }
        $scope.ChangeStatus = function () {
            if ($scope.loan.Status == $rootScope.LoanConfig.LoanAccountStatus.Active) {
                $scope.flagList = $scope.flagListMain.filter(a => a.Value == $rootScope.LoanConfig.LoanFlag.GoodStanding
                        || a.Value == $rootScope.LoanConfig.LoanFlag.BadStanding || a.Value == $rootScope.LoanConfig.LoanFlag.NewOrDisbursed
                        || a.Value == $rootScope.LoanConfig.LoanFlag.ReOpened
                        );
                $scope.loan.ClosingDate = null;
                $scope.loan.DisabilityFor = null;
            }

            if ($scope.loan.Status == $rootScope.LoanConfig.LoanAccountStatus.Close) {
                $scope.flagList = $scope.flagListMain.filter(a => a.Value == $rootScope.LoanConfig.LoanFlag.Normal
                       || a.Value == $rootScope.LoanConfig.LoanFlag.EarlySettlement || a.Value == $rootScope.LoanConfig.LoanFlag.BadDebt
                       || a.Value == $rootScope.LoanConfig.LoanFlag.FullPaid
                       || a.Value == $rootScope.LoanConfig.LoanFlag.DisabilityResolve
                       || a.Value == $rootScope.LoanConfig.LoanFlag.DeathResolve
                       );
                $scope.loan.ClosingDate = new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
            }
            if ($scope.flagList.length > 0)
                $scope.loan.Flag = $rootScope.LoanConfig.LoanFlag.FullPaid.toString();
        }

        $scope.changeAppliedfor = function () {
            if ($scope.loan.Status == $rootScope.LoanConfig.LoanAccountStatus.Close) {
                if ($scope.loan.Flag == $rootScope.LoanConfig.LoanFlag.DeathResolve) {
                    if ($scope.roleId == $rootScope.rootLevel.ASE ||
                        $scope.roleId == $rootScope.rootLevel.LO) {
                        $scope.loan.Status = $rootScope.LoanConfig.LoanAccountStatus.Close;
                        $scope.loan.Flag = $rootScope.LoanConfig.LoanFlag.FullPaid;
                        swal("LO/ASE doesn't have permission for death resolve");
                        return;
                    }
                }
                if ($scope.loan.Flag == $rootScope.LoanConfig.LoanFlag.DisabilityResolve) {
                    if ($scope.roleId == $rootScope.rootLevel.BM ||
                        $scope.roleId == $rootScope.rootLevel.ASE ||
                        $scope.roleId == $rootScope.rootLevel.RM ||
                        $scope.roleId == $rootScope.rootLevel.LO ||
                        $scope.roleId == $rootScope.rootLevel.ABM) {
                        $scope.loan.Status = $rootScope.LoanConfig.LoanAccountStatus.Close;
                        $scope.loan.Flag = $rootScope.LoanConfig.LoanFlag.FullPaid;
                        swal("LO/ABM/BM/RM/ASE doesn't have permission for disability resolve");
                        return;
                    }
                }
            }
        }

        $scope.getDisabilityForOptions = function () {
            filterService.getProgramFilterDataByType('ResolveFor').then(function (response) {
                $scope.disabilityForList = angular.copy(response.data);
                console.log($scope.disabilityForList);
            });
        }

        $scope.getPaymentMethodOptions = function () {
            filterService.getProgramFilterDataByType('PaymentMethod').then(function (response) {
                $scope.paymentmethodList = response.data;
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
            filterString += 'AccountId' + "|" + $scope.editLoanAccountId + "#";
            filterString += 'Duration' + "|" + $scope.loan.Duration + "#";
            filterString += 'MemberId' + "|" + $scope.loan.MemberId + "#";

            var url = commonService.getExportUrl($rootScope.programsApiBaseUrl + 'account/loan/scheduleByDeclineExport', filterString, 'Schedule-list');
            window.open(url, '_blank');
        }


        $scope.getSchedule = function () {
            $scope.IsEverythingloaded = false;

            if ($scope.loan.PrincipalAmount < $scope.loan.MinimumPrincipal || $scope.loan.PrincipalAmount > $scope.loan.MaximumPrincipal) {
                swal("Please insert principal amount between " + $scope.loan.MinimumPrincipal + " && " + $scope.loan.MinimumPrincipal);
                return;
            }

            $("#loadingImage").css("display", "block");
            if (!$scope.loan.InstallmentFrequencyId || !$scope.loan.ProductId) return;
            if (!angular.isDefined($scope.loan.InstallmentFrequencyId) || !angular.isDefined($scope.loan.ProductId) || !angular.isDefined($scope.loan.GracePeriod)) {
                $scope.scheduleList = [];
                $("#loadingImage").css("display", "none");
                return;
            }

            $scope.loan.FinanceData.ServiceCharge = 0;
            $scope.loan.DisburseAmount = 0;
            $scope.DisburseDate = moment($scope.loan.DisburseDate).format();
            //if ($scope.loan.PrincipalAmount == null) $scope.loan.PrincipalAmount = 0;

            loanaccountService.getReSchedules($scope.servicechargerate, $scope.loan.PrincipalAmount, $scope.loan.InstallmentAmountPerThousand,
                                            $scope.loan.NumberOfInstallment, $scope.DisburseDate, $scope.loan.GracePeriod, $scope.loan.InstallmentFrequencyId,
                                            $scope.loan.GroupId, $scope.loan.CurrentBranchId, $scope.loan.IsSyncWithMeetingDay, $scope.loan.ProductId, $scope.editLoanAccountId, $scope.loan.Duration, $scope.loan.MemberId).then(function (response) {

                                                $scope.scheduleList = response.data;
                                                //$scope.scheduleList.sort(function(a, b) {
                                                //    return (moment(a.InstallmentDate).format('DD-MM-YYYY') > moment(b.InstallmentDate).format('DD-MM-YYYY')) ? 1 : ((moment(b.InstallmentDate).format('DD-MM-YYYY') > moment(a.InstallmentDate).format('DD-MM-YYYY')) ? -1 : 0);
                                                //});
                                                //$scope.scheduleList.sort(function (a, b) {
                                                //    return (a.InstallmentDate > b.InstallmentDate) ? 1 : (b.InstallmentDate > a.InstallmentDate) ? -1 : 0;
                                                //});
                                                $scope.scheduleList.forEach(function (s) {
                                                    $scope.loan.FinanceData.ServiceCharge += s.InterestAmount;

                                                    s.InterestAmount = Math.round(s.InterestAmount * 100) / 100;
                                                    s.TotalAmount = Math.round(s.TotalAmount * 100) / 100;
                                                    s.OutstandingInterestAmount = Math.round(s.OutstandingInterestAmount * 100) / 100;
                                                    s.OutstandingPrincipalAmount = Math.round(s.OutstandingPrincipalAmount * 100) / 100;
                                                    s.OutstandingTotalAmount = Math.round(s.OutstandingTotalAmount * 100) / 100;
                                                    s.OverdueInterestAmount = Math.round(s.OverdueInterestAmount * 100) / 100;
                                                    s.OverduePrincipalAmount = Math.round(s.OverduePrincipalAmount * 100) / 100;
                                                    s.OverdueTotalAmount = Math.round(s.OverdueTotalAmount * 100) / 100;
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

                                                //$scope.scheduleList.forEach(function (a) {
                                                //    a.InstallmentDate = moment(a.InstallmentDate).format('DD-MM-YYYY');
                                                //});
                                                $scope.loan.DisburseAmount = Number($scope.loan.FinanceData.ServiceCharge) + Number($scope.loan.PrincipalAmount);
                                                $("#loadingImage").css("display", "none");
                                                $scope.IsEverythingloaded = true;
                                            }, AMMS.handleServiceError);
        }

        $scope.toggleFrqChange = function () {
            $scope.isfreqChanged = !$scope.isfreqChanged;
            $scope.freeChanged = true;
        }
        $scope.toggleDurationChange = function () {
            $scope.isDurationChanged = !$scope.isDurationChanged;
        }


        $scope.PrincipalAmountValidator = function (amount) {

            if ($rootScope.user.Role == $rootScope.UserRole.Admin ||
                !$scope.productDetails.IsPrimary || $scope.savedLoanAccount.OldAccountIdentityValue != null) return true;

            if (amount < $scope.loan.MinimumPrincipal || amount > $scope.loan.MaximumPrincipal) return "Principal amount for this product must be between BDT " + $scope.loan.MinimumPrincipal
                                                                                                         + " and BDT " + $scope.loan.MaximumPrincipal;
            if ($scope.productDetails.PrincipleAmountMultipleOf !== null) {
                if (amount % $scope.productDetails.PrincipleAmountMultipleOf !== 0)
                    return "Principal amount must be multiple of " + $scope.productDetails.PrincipleAmountMultipleOf;
            }
            return true;
        };

        $scope.BankAccountValidator = function (account) {
            if (!account) return "Bank Account Number is required";
            return true;
        };

        $scope.ChequeValidator = function (cheque) {
            if (!cheque) return "Bank Account Number is required";
            return true;
        };

        $scope.clearAndCloseTab = function () {
            $scope.loan = {};
            $scope.tab.ConfirmPrompt = false;
            $scope.execRemoveTab($scope.tab);
        };

        $scope.CheckForChange = function () {
            if ($scope.loanMain.Status !== $scope.loan.Status) {
                $scope.loan.StatusChangeDate = moment($scope.workingDay).format("YYYY-MM-DD");
                //if ($scope.loan.Status === '2') {
                //    $scope.loan.ClosingDate = moment($scope.workingDay).format();
                //}
            }
            if ($scope.loanMain.Flag != $scope.loan.Flag) {
                $scope.loan.FlagChangeDate = moment($scope.workingDay).format("YYYY-MM-DD");
            }
        }
        $scope.freqChange = function () {
            $scope.fChange = true;
        }
        $scope.changeGRT = function () {
            $("#loadingImage").css("display", "block");
            if (!($scope.loan.ProductId && $scope.ProductRates)) {
                $("#loadingImage").css("display", "none");
                return;
            }

            //$scope.graceperiodList = [];
            //$scope.ProductGracePeriods.forEach(function (a) {
            //    if ((a.DurationId === $scope.loan.Duration || a.DurationId == -100000) && (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId) || a.InstallmentFrequencyId == -100000) {
            //        $scope.loan.GracePeriod = a.GracePeriodId;
            //        $scope.graceperiodList.push({ Name: a.GracePeriodId, Value: a.GracePeriodId });
            //    }
            //});

            var serviceChargeFound = false;
            $scope.ServiceChargeList = [];
            for (i = 0; i < $scope.ProductRates.length ; i++) {
                // TODO add the logic  && $scope.ProductRates[i].GracePeriodId == $scope.loan.GracePeriod  // currently not bringing GracePeriod in Productrates
                if ($scope.ProductRates[i].FundId === $scope.loan.FundId && $scope.ProductRates[i].SubCodeId == $scope.loan.SubCodeId && $scope.ProductRates[i].DurationId == $scope.loan.Duration &&
                    $scope.ProductRates[i].InstallmentFrequencyId == $scope.loan.InstallmentFrequencyId && $scope.ProductRates[i].GenderId == Number($scope.loan.Sex)) {
                    $scope.ServiceChargeList.push({ Name: $scope.ProductRates[i].DeclineInterestRate, Value: $scope.ProductRates[i].DeclineInterestRate });
                    $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
                    //$scope.loan.PrincipalAmount = $scope.ProductRates[i].DefaultPrincipal;
                    $scope.loan.MinimumPrincipal = $scope.ProductRates[i].MinPrincipal;
                    $scope.loan.MaximumPrincipal = $scope.ProductRates[i].MaxPrincipal;
                    $scope.PrincipalAmountValidator($scope.loan.PrincipalAmount);
                    serviceChargeFound = true;
                    break;
                }

                if (($scope.ProductRates[i].FundId === $scope.loan.FundId || $scope.ProductRates[i].FundId == -100000) &&
                    ($scope.ProductRates[i].SubCodeId == $scope.loan.SubCodeId || $scope.ProductRates[i].SubCodeId == -100000) &&
                    ($scope.ProductRates[i].DurationId == $scope.loan.Duration || $scope.ProductRates[i].DurationId == -100000) &&
                    ($scope.ProductRates[i].InstallmentFrequencyId == $scope.loan.InstallmentFrequencyId || $scope.ProductRates[i].InstallmentFrequencyId == -100000) &&
                    ($scope.ProductRates[i].GenderId == Number($scope.loan.Sex) || $scope.ProductRates[i].GenderId == -100000)) {

                    $scope.ServiceChargeList.push({ Name: $scope.ProductRates[i].DeclineInterestRate, Value: $scope.ProductRates[i].DeclineInterestRate });
                    $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
                    //$scope.loan.PrincipalAmount = $scope.ProductRates[i].DefaultPrincipal;
                    $scope.loan.MinimumPrincipal = $scope.ProductRates[i].MinPrincipal;
                    $scope.loan.MaximumPrincipal = $scope.ProductRates[i].MaxPrincipal;
                    $scope.PrincipalAmountValidator($scope.loan.PrincipalAmount);
                    serviceChargeFound = true;

                }
            }

            if (!serviceChargeFound) {
                $scope.ServiceChargeList.push({ Name: $scope.productDetails.DefaultDeclineInterestRate, Value: $scope.productDetails.DefaultDeclineInterestRate });
                $scope.servicechargerate = $scope.ServiceChargeList[0].Value;
            }


            $scope.filterInstallmentFrequency();
            if (!$scope.freqChanged && $scope.installmentFrequencyList.length > 0) {
                //$scope.loan.InstallmentFrequencyId = $scope.installmentFrequencyList[0].Value;
                $scope.freqChanged = false;
            }

            $scope.graceperiodList = [];

            $scope.ProductTenures.forEach(function (a) {
                if ((a.DurationId === $scope.loan.Duration || a.DurationId === -100000) &&
                        (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || a.InstallmentFrequencyId === -100000)) {
                    if (a.GracePeriod === -100000) {
                        $scope.graceperiodList = [];
                        $scope.graceperiodList = $scope.graceperiodListMain;
                    } else $scope.graceperiodList.push({ Name: a.GracePeriod, Value: a.GracePeriod });
                }
            });
            //if ($scope.graceperiodList.length > 0) $scope.loan.GracePeriod = $scope.graceperiodList[0].Value;

            $scope.graceperiodList = $scope.graceperiodList.filter(function (o) {
                return o.Value != -100000;
            });

            //var specificGracePeriod = false;
            //$scope.ProductGracePeriods.forEach(function (g) {
            //    if (!(g.DurationId === -100000 && g.GenderId == -100000 && g.InstallmentFrequencyId === -100000)) {
            //        specificGracePeriod = true;

            //    }
            //});
            //$scope.ProductGracePeriods.forEach(function (a) {
            //    if (specificGracePeriod && ($scope.loan.Duration === a.DurationId) &&
            //        (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId) &&
            //        ($scope.loan.Sex == a.GenderId)) {
            //        $scope.graceperiodList = [];
            //        $scope.graceperiodList.push({ Name: a.GracePeriodId, Value: a.GracePeriodId });
            //    }
            //});
            //var specificGracePeriodOfProduct = false;
            //$scope.specificGracePeriodList.forEach(function (gp) {
            //    if (gp.DurationId === $scope.loan.Duration && gp.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId && gp.SchemeId === $scope.loan.SchemeId && gp.GenderId === $scope.memberSex) {
            //        specificGracePeriodOfProduct = true;
            //    }
            //});
            //$scope.specificGracePeriodList.forEach(function (gp) {
            //    if (specificGracePeriodOfProduct && gp.DurationId === $scope.loan.Duration && gp.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId && gp.SchemeId === $scope.loan.SchemeId && gp.GenderId === $scope.memberSex) {
            //        $scope.graceperiodList = [];
            //        $scope.graceperiodList.push({ Name: gp.GracePeriodId, Value: gp.GracePeriodId });
            //    }
            //});

            //if ($scope.graceperiodList.length > 0) $scope.loan.GracePeriod = $scope.graceperiodList[0].Value;

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

            $scope.ProductTenures.forEach(function (a) {
                if (a.DurationId === $scope.loan.Duration && (a.InstallmentFrequencyId === $scope.loan.InstallmentFrequencyId || a.InstallmentFrequencyId === $scope.allowAllValue) && a.GracePeriod === $scope.loan.GracePeriod) {
                    $scope.loan.NumberOfInstallment = a.TotalNumberOfInstallment;
                    $scope.loan.InstallmentAmountPerThousand = a.InstallmentAmountPerThousand;
                }
            });

            $scope.ProductTenures.forEach(function (pt) {
                if (pt.DurationId !== -100000) {
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
                if (!(d.FundId === -100000 && d.GroupTypeId === -100000)) {
                    $scope.specificDuration = true;
                    $scope.durationList = [];
                }
            });

            $scope.matchFound = false;
            $scope.ProductDurations.forEach(function (a) {
                if ($scope.specificDuration && $scope.loan.FundId === a.FundId && ($scope.loan.GroupTypeId === a.GroupTypeId || a.GroupTypeId === -100000)) {
                    $scope.durationList.push({ Name: a.DurationId, Value: a.DurationId });
                    $scope.matchFound = true;
                }
            });
            if (!$scope.matchFound) $scope.durationList = $scope.durationListMain;

            if (!$scope.installmentFrequencyList.find(g => g.Value === $scope.loan.InstallmentFrequencyId)) {
                if ($scope.installmentFrequencyList.length > 0) $scope.loan.InstallmentFrequencyId = $scope.installmentFrequencyList[0].Value;
            }

            if (!$scope.graceperiodList.find(g => g.Value === $scope.loan.GracePeriod)) {
                if ($scope.graceperiodList.length > 0) $scope.loan.GracePeriod = $scope.graceperiodList[0].Value;
            }


            $("#loadingImage").css("display", "none");
            //$scope.loan.Duration = $scope.durationList[0].Value;
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

        $scope.getReceiveInfo = function () {
            loanaccountService.getReceiveInfo($scope.editID, $rootScope.selectedBranchId).then(function (response) {
                if (response.data.ReceiveDate != null) {
                    $scope.isAccountReceived = true;
                    $scope.ReceiveDate = response.data.ReceiveDate;
                    $scope.ReceiveAmount = response.data.ReceiveAmount;
                }
            });
        }
        $scope.closingDateChanged = function () {
            $scope.dateOptionResolvedDate.maxDate = $scope.loan.ClosingDate ? new Date(moment($scope.loan.ClosingDate).format("YYYY-MM-DD")) : new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
        }
        $scope.init = function () {

            $scope.editID = angular.copy($scope.editLoanAccountId);

            $scope.getMemberInfo();
            $scope.getHolidays($scope.loan.BranchId);
            $scope.getGroupDetails($scope.loan.GroupId);
            $scope.getBankAccounts($scope.loan.BranchId);
            $scope.getPaymentMethodOptions();
            $scope.getDisabilityForOptions();
            //$scope.getProducts();
            // TO Load bank account details and then get LA details info $scope.getAccountDetails(); is called inside $scope.getBankAccounts($scope.loan.BranchId);
            //$scope.getAccountDetails();
            $scope.hasFee = false;
            $scope.isAccountReceived = false;
            $scope.ReceiveDate = "";
            $scope.ReceiveAmount = "";
            $scope.IsEverythingloaded = true;
            declareVariable();
            $scope.getReceiveInfo();
        }


        $scope.initHabibi = function () {

            $scope.editID = angular.copy($scope.editLoanAccountId);

            $scope.getMemberInfo();
            $scope.getHolidays($scope.loan.BranchId);
            $scope.getGroupDetails($scope.loan.GroupId);
            $scope.getBankAccounts($scope.loan.BranchId);
            $scope.getPaymentMethodOptions();
            $scope.getDisabilityForOptions();
            //$scope.getProducts();
            $scope.getAccountDetails();
            $scope.hasFee = false;
            declareVariable2();
        }



        $scope.init();

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
        $scope.isMemberAbleToGetAllowance = function () {
            $scope.isAbleToGetAllowance = { IsAbleToGet: false, Amount: 0 };
            loanaccountService.isAbleToGetAllowance($scope.loan.MemberId, moment($scope.loan.ResolvedDate).format("YYYY-MM-DD"), moment($scope.loan.ClosingDate).format("YYYY-MM-DD")).then(function (response) {
                console.log(response.data);
                $scope.isAbleToGetAllowance = response.data;
            });
        }
        $timeout(function(
            ) {
            $scope.EditLoanAccount = function () {
                if (!$scope.IsEverythingloaded) return;

                //////**********  is the form realy edited ?? ******** ///////////////////

                if (moment($scope.savedLoanAccount.DisburseDate).format() == moment($scope.loan.DisburseDate).format() &&
                    //$scope.savedLoanAccount.CategoryId != $scope.loan.CategoryId ||
                        $scope.savedLoanAccount.ProductId == $scope.loan.ProductId &&
                        $scope.savedLoanAccount.SubCodeId == $scope.loan.SubCodeId &&
                        $scope.savedLoanAccount.FundId == $scope.loan.FundId &&
                        $scope.savedLoanAccount.SchemeId == $scope.loan.SchemeId &&
                        $scope.savedLoanAccount.Duration == $scope.loan.Duration &&
                        $scope.savedLoanAccount.InstallmentFrequencyId == $scope.loan.InstallmentFrequencyId &&
                        $scope.savedLoanAccount.GracePeriod == $scope.loan.GracePeriod &&
                        $scope.savedLoanAccount.PrincipalAmount == $scope.loan.PrincipalAmount &&
                        $scope.savedLoanAccount.PaymentMethodId == $scope.loan.PaymentMethodId &&
                        $scope.savedLoanAccount.Status == $scope.loan.Status &&
                        $scope.savedLoanAccount.Flag == $scope.loan.Flag &&
                        $scope.savedLoanAccount.AccountFeeInfo[0].FeeId == $scope.fee.SelectedPolicy
                ) {
                    swal("Loan Account updated Successfully");
                    $scope.clearAndCloseTab();
                }

                ////*****************                       ************//////////////////



                if (!$rootScope.isDayOpenOrNot()) return;
                if ($rootScope.user.Role == $rootScope.UserRole.BM) {
                    if ($scope.savedLoanAccount.Status == $rootScope.LoanConfig.LoanAccountStatus.Active) {
                        if ($scope.loan.Status == $rootScope.LoanConfig.LoanAccountStatus.Close) {
                            if ($scope.loan.Flag != $rootScope.LoanConfig.LoanFlag.DeathResolve) {
                                swal("BM can only Death resolve loan acocunt in Edit form");
                                return;
                            }
                        } else {
                            swal("BM can only Death resolve loan acocunt in Edit form");
                            return;
                        }
                    }
                }

                if ($rootScope.user.Role == $rootScope.UserRole.BM
                        &&
                        (moment($scope.savedLoanAccount.DisburseDate).format() != moment($scope.loan.DisburseDate).format() ||
                    //$scope.savedLoanAccount.CategoryId != $scope.loan.CategoryId ||
                                $scope.savedLoanAccount.ProductId != $scope.loan.ProductId ||
                                $scope.savedLoanAccount.SubCodeId != $scope.loan.SubCodeId ||
                                $scope.savedLoanAccount.FundId != $scope.loan.FundId ||
                                $scope.savedLoanAccount.SchemeId != $scope.loan.SchemeId ||
                                $scope.savedLoanAccount.Duration != $scope.loan.Duration ||
                                $scope.savedLoanAccount.InstallmentFrequencyId != $scope.loan.InstallmentFrequencyId ||
                                $scope.savedLoanAccount.GracePeriod != $scope.loan.GracePeriod ||
                                $scope.savedLoanAccount.PrincipalAmount != $scope.loan.PrincipalAmount ||
                                $scope.savedLoanAccount.PaymentMethodId != $scope.loan.PaymentMethodId
                        )
                ) {
                    swal("BM user cannot edit loan account except death resolve");
                    return;
                }

                if ($rootScope.user.Role == $rootScope.UserRole.LO
                    &&
                    moment($scope.savedLoanAccount.CreateWorkingDate).format('YYYY-MM-DD') != moment($rootScope.workingdate).format('YYYY-MM-DD')) {
                        swal("LO user doesn't have permission to edit loan account.");
                        return;
                }

                var a = moment($scope.loan.DisburseDate).format('YYYY-MM-DD');
                var as = moment($rootScope.workingdate).format('YYYY-MM-DD');
                var diff = moment($rootScope.workingdate).diff(moment($scope.loan.DisburseDate), 'days');
                if ($rootScope.user.Role == $rootScope.UserRole.LO && ($scope.loan.ClosingDate != null && moment($scope.loan.ClosingDate).format('YYYY-MM-DD') != moment($rootScope.workingdate).format('YYYY-MM-DD')) &&
                    $scope.savedLoanAccount.Status != $rootScope.LoanConfig.LoanAccountStatus.Close) {
                    swal("LO is not allowed to perform this operation");
                    return;
                }
                if ($rootScope.user.Role == $rootScope.UserRole.LO && moment($scope.savedLoanAccount.ClosingDate).format('YYYY-MM-DD') != moment($rootScope.workingdate).format('YYYY-MM-DD') &&
                $scope.savedLoanAccount.Status == $rootScope.LoanConfig.LoanAccountStatus.Close && $scope.loan.Status == $rootScope.LoanConfig.LoanAccountStatus.Active) {
                    swal("LO is not allowed to reopen closed account except current working date");
                    return;
                }
                //if ($rootScope.user.Role == $rootScope.UserRole.ABM && diff !== 0) {
                //    swal("ABM is not allowed to perform this operation");
                //    return;
                //}
                //if ($rootScope.user.Role == $rootScope.UserRole.RM && diff > 30) {
                //    swal("RM is not allowed to perform this operation");
                //    return;
                //}
                //if ($rootScope.user.Role == $rootScope.UserRole.DM && diff > 90) {
                //    swal("DM is not allowed to perform this operation");
                //    return;
                //}

                var q = moment($scope.loan.ClosingDate).format('YYYY-MM-DD');
                var w = moment($scope.loan.ClosingDate).format('YYYY-MM-DD');
                if ($scope.savedLoanAccount.Status == $rootScope.LoanConfig.LoanAccountStatus.Close && $rootScope.user.Role == $rootScope.UserRole.LO &&
                    moment($scope.ClosingDate).format('YYYY-MM-DD') != moment($rootScope.workingdate).format('YYYY-MM-DD')) {
                    swal("LO is not allowed to edit Closed loan account");
                    return;
                }
                $scope.loan.GroupTypeId = $scope.GroupTypeId;

                if ($scope.loan.GroupTypeId == 1 && $scope.loan.OldAccountIdentityValue == null && $scope.productDetails.IsPrimary && ($scope.loan.PrincipalAmount < $scope.loanRangeWithGroupType.filter(function (b) {
                   return b.Name == 'GeneralLower';
                })[0].Value || $scope.loan.PrincipalAmount > $scope.loanRangeWithGroupType.filter(function (b) {
                   return b.Name == 'GeneralUpper';
                })[0].Value)) {
                    swal("'Principal Amount' exceeds allowed range for 'General' group type. Please type principal amount less than 100000 ! ", 'WARNING', 'warning');
                    return;
                }

                if ($scope.loan.GroupTypeId == 2 && $scope.loan.OldAccountIdentityValue == null && $scope.productDetails.IsPrimary && ($scope.loan.PrincipalAmount < $scope.loanRangeWithGroupType.filter(function (b) {
                    return b.Name == 'SpecialLower';
                })[0].Value || $scope.loan.PrincipalAmount > $scope.loanRangeWithGroupType.filter(function (b) {
                    return b.Name == 'SpecialUpper';
                })[0].Value)) {
                    swal("'Principal Amount' is less than allowed range for 'Special' group type. Please type principal amount greater than 100000  ", 'WARNING', 'warning');
                    return;
                }
                if (!$scope.hasFee) $scope.loan.AccountFeeInfo = null;
                $scope.loan.Rate = $scope.servicechargerate;

                $scope.loan.ModifiedBranchWorkingDate = moment($scope.workingDay, "DD.MM.YYYY").format('YYYY-MM-DD');
                $scope.loan.FirstInstallmentDate = moment($scope.loan.FirstInstallmentDate).format();
                $scope.CheckForChange();

                if ($scope.loan.PaymentMethodId === "1") {
                    $scope.loan.BankAccountId = null;
                    $scope.loan.ChequeNo = null;
                    $scope.loan.IsAccountPayable = null;
                }



                if ($scope.docError) {
                    swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');
                    // $scope.docError = false;
                    return;
                }
                if ($scope.loan.Status == $rootScope.LoanConfig.LoanAccountStatus.Close && !$scope.loan.ClosingDate) {
                    swal("Closing Date is required");
                    return;
                }
                $scope.loan.ClosingBranchWorkingDate = $scope.loan.Status == $rootScope.LoanConfig.LoanAccountStatus.Close ? moment($rootScope.workingdate).format("YYYY-MM-DD") : null;
                transferService.IsMemberInTransferTransitState($scope.loan.MemberId, $scope.loan.BranchId).then(function (response) {
                    if (response.data) {
                        swal("The Member is in Transfer Transit State");
                        return;
                    }
                    if ($scope.loan.Status == $rootScope.LoanConfig.LoanAccountStatus.Close && $scope.loan.Flag == $rootScope.LoanConfig.LoanFlag.DeathResolve && $scope.loan.DisabilityFor == $rootScope.LoanConfig.ResolveFor.Member) {
                        if (!$scope.loan.ResolvedDate) {
                            swal("Died Date is required");
                            return;
                        }
                        if (moment($scope.loan.ResolvedDate).format("YYYY-MM-DD") > moment($scope.loan.ClosingDate).format("YYYY-MM-DD")) {
                            swal("Close date can't be less than resolve date");
                            return;
                        }
                        loanaccountService.GetAllowanceAmount($scope.loan.MemberId, moment($scope.loan.ResolvedDate).format("YYYY-MM-DD"), moment($scope.loan.ClosingDate).format("YYYY-MM-DD")).then(function (response) {
                            $scope.loan.DeathAllowanceAmount = response.data;
                            if ($scope.loan.DeathAllowanceAmount > 0) {
                                swal({
                                    title: "An Allowance of " + $scope.loan.DeathAllowanceAmount + " tk will be deposit to member's savings Account. (Transaction type Allowance of death). Are you sure you want to close this account with DEATH_RESOLVE reason?",
                                    showCancelButton: true,
                                    confirmButtonText: "Yes",
                                    cancelButtonText: "No, cancel !",
                                    type: "info",
                                    closeOnConfirm: false,
                                    showLoaderOnConfirm: true
                                },
                       function (isConfirmed) {
                           if (isConfirmed) {
                               $scope.loan.DisburseDate = moment($scope.loan.DisburseDate).format();
                               $scope.loan.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                               $scope.loan.ResolvedDate = new Date(moment($scope.loan.ResolvedDate).format("YYYY-MM-DD"));
                               //$scope.loan.DeathAllowance = angular.copy(isAbleToGetAllowance);
                               loanaccountService.editLoanAccount($scope.loan).then(function (response) {
                                   if (response.data.Success) {
                                       if (response.data.Entity.Id && $scope.files.length > 0) {
                                           documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.LoanAccount, $rootScope.user.UserId).
                                               then(function (res) {
                                                   if (res.data.Success) {
                                                       $rootScope.$broadcast('loanAccount-edit-finished', $scope.loan);
                                                       swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.loanAccount), "Successful!", "success");
                                                       $scope.clearAndCloseTab();
                                                   } else {
                                                       $scope.uploadError = true;
                                                       loanaccountService.deleteLoanAccount(response.data.Entity.Id);
                                                       swal($rootScope.docAddError, "File is not Uploaded", "error");
                                                   }
                                               }, AMMS.handleServiceError);
                                       } else {
                                           if (!$scope.uploadError) {
                                               $rootScope.$broadcast('loanAccount-edit-finished', $scope.loan);
                                               swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.loanAccount), "Successful!", "success");
                                           }
                                           $scope.clearAndCloseTab();
                                       }


                                   } else {
                                       swal($rootScope.showMessage(response.data.Message, $rootScope.loanAccount), "", "error");
                                   }
                               }, AMMS.handleServiceError);
                           } else {
                               swal("Cancelled", "something is wrong", "error");
                           }
                       });
                            } else {
                                swal({
                                    title: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.loanAccount),
                                    showCancelButton: true,
                                    confirmButtonText: "Yes, Edit it!",
                                    cancelButtonText: "No, cancel !",
                                    type: "info",
                                    closeOnConfirm: false,
                                    showLoaderOnConfirm: true
                                },
                                    function (isConfirmed) {
                                        if (isConfirmed) {
                                            $scope.loan.DisburseDate = moment($scope.loan.DisburseDate).format();
                                            $scope.loan.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                                            loanaccountService.editLoanAccount($scope.loan).then(function (response) {
                                                if (response.data.Success) {
                                                    if (response.data.Entity.Id && $scope.files.length > 0) {
                                                        documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.LoanAccount, $rootScope.user.UserId).
                                                            then(function (res) {
                                                                if (res.data.Success) {
                                                                    $rootScope.$broadcast('loanAccount-edit-finished', $scope.loan);
                                                                    swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.loanAccount), "Successful!", "success");
                                                                    $scope.clearAndCloseTab();
                                                                } else {
                                                                    $scope.uploadError = true;
                                                                    loanaccountService.deleteLoanAccount(response.data.Entity.Id);
                                                                    swal($rootScope.docAddError, "File is not Uploaded", "error");
                                                                }
                                                            }, AMMS.handleServiceError);
                                                    } else {
                                                        if (!$scope.uploadError) {
                                                            $rootScope.$broadcast('loanAccount-edit-finished', $scope.loan);
                                                            swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.loanAccount), "Successful!", "success");
                                                        }
                                                        $scope.clearAndCloseTab();
                                                    }


                                                } else {
                                                    swal($rootScope.showMessage(response.data.Message, $rootScope.loanAccount), "", "error");
                                                }
                                            }, AMMS.handleServiceError);
                                        } else {
                                            swal("Cancelled", "something is wrong", "error");
                                        }
                                    });
                            }
                        });
                    } else {
                        swal({
                            title: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.loanAccount),
                            showCancelButton: true,
                            confirmButtonText: "Yes, Edit it!",
                            cancelButtonText: "No, cancel !",
                            type: "info",
                            closeOnConfirm: false,
                            showLoaderOnConfirm: true
                        },
                            function (isConfirmed) {
                                if (isConfirmed) {
                                    $scope.loan.DisburseDate = moment($scope.loan.DisburseDate).format();
                                    $scope.loan.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                                    loanaccountService.editLoanAccount($scope.loan).then(function (response) {
                                        if (response.data.Success) {
                                            if (response.data.Entity.Id && $scope.files.length > 0) {
                                                documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.LoanAccount, $rootScope.user.UserId).
                                                    then(function (res) {
                                                        if (res.data.Success) {
                                                            $rootScope.$broadcast('loanAccount-edit-finished', $scope.loan);
                                                            swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.loanAccount), "Successful!", "success");
                                                            $scope.clearAndCloseTab();
                                                        } else {
                                                            $scope.uploadError = true;
                                                            loanaccountService.deleteLoanAccount(response.data.Entity.Id);
                                                            swal($rootScope.docAddError, "File is not Uploaded", "error");
                                                        }
                                                    }, AMMS.handleServiceError);
                                            } else {
                                                if (!$scope.uploadError) {
                                                    $rootScope.$broadcast('loanAccount-edit-finished', $scope.loan);
                                                    swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.loanAccount), "Successful!", "success");
                                                }
                                                $scope.clearAndCloseTab();
                                            }


                                        } else {
                                            swal($rootScope.showMessage(response.data.Message, $rootScope.loanAccount), "", "error");
                                        }
                                    }, AMMS.handleServiceError);
                                } else {
                                    swal("Cancelled", "something is wrong", "error");
                                }
                            });
                    }
                });
            }
            },
            1500);
        


        $scope.$on('tab-switched', function () {
            if ($scope.editLoanAccountId !== $rootScope.editLoanAccount.Id && $scope.editMemberId === $rootScope.editLoanAccount.MemberId) {
                $scope.editLoanAccountId = angular.copy($rootScope.editLoanAccount.Id);
                $scope.init();
            }
        });


        $scope.checkSupplimentaryToPrimaryConvertionAbility = function () {
            if ($scope.loan.IsSupplimentary) {
                if (!$scope.loan.CanBeMadeSupplimentary) {
                    swal("Action not permitted. This loan account can't be converted to supplimentary");
                    $scope.loan.IsSupplimentary = !$scope.loan.IsSupplimentary;
                    return;
                }
            } else {
                if (!$scope.loan.CanBeMadePrimary) {
                    swal("Action not permitted. This loan account can't be converted to primary");
                    $scope.loan.IsSupplimentary = !$scope.loan.IsSupplimentary;
                    return;
                }
            }
        }
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

        $scope.popupEntryDate = {
            opened: false
        };
        $scope.openEntryDate = function () {
            //console.log($scope.branchHolidayAndOffDay);
            $scope.popupEntryDate.opened = true;
        };

        $scope.format = 'dd/MM/yyyy';

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1,
            showWeeks: false
        };

        $scope.popupClosingDate = {
            opened: false
        };
        $scope.openClosingDate = function () {
            //console.log($scope.branchHolidayAndOffDay);
            $scope.popupClosingDate.opened = true;
        };

        $scope.dateOptionsClosingDate = {
            //dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1,
            showWeeks: false
        };

        $scope.popupResolvedDate = {
            opened: false
        };
        $scope.openResolvedDate = function () {
            $scope.popupResolvedDate.opened = true;
        };

        $scope.dateOptionResolvedDate = {
            formatYear: 'yyyy',
            startingDay: 1,
            showWeeks: false
        };
        console.log($scope.dateOptionResolvedDate);
    }
]);