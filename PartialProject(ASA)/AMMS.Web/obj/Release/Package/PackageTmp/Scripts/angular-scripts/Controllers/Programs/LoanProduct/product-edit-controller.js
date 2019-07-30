ammsAng.controller('productEditController', [
    '$scope', '$rootScope', '$timeout', 'productService', 'branchService', 'staticDataService', 'filterService', 'documentService', 'commonService',
    function ($scope, $rootScope, $timeout, productService, branchService, staticDataService, filterService, documentService, commonService) {

        $scope.durationsMultiSelect = [];

        $scope.allowAllValue = -100000;
        $scope.allowNone = -999999;

        $scope.IsVersionChanged = false;
        $scope.durations = [];
        $scope.GracePeriods = [];
        $scope.ProductPreferences = [];
        $scope.preferenceObjects = [];
        $scope.installmentFrequencies = [];
        $scope.allBranches = [];
        $scope.Subcodes = [];

        $scope.durationList = [];
        $scope.gracePeriodList = [];
        $scope.loanProductPreferenceList = [];
        $scope.installmentFrequencyList = [];
        $scope.genderList = [];
        $scope.SubcodeList = [];

        $scope.durationListMain = [];
        $scope.gracePeriodListMain = [];
        $scope.loanProductPreferenceListMain = [];
        $scope.installmentFrequencyListMain = [];
        $scope.fundsListMain = [];
        $scope.SubcodeListMain = [];

        $scope.categories = [];
        $scope.InterestCalculationMethodList = [];
        $scope.InterestCalculationPeriodList = [];
        $scope.InterestRatePeriodList = [];
        $scope.statusList = staticDataService.getLoanStatusOptions();
        $scope.purposeList = [];
        $scope.fundsList = [];
        $scope.amortizationList = [];
        $scope.repaymentStrategyList = [];
        $scope.groupTypeList = [];
        $scope.Roles = [];
        $scope.ProductList = [];

        $scope.product = {};

        $scope.product.RestrictedProductId = [];
        $scope.product.PrerequisiteProductId = [];
        $scope.product.BranchId = [];
        $scope.product.SchemeId = [];
        $scope.product.FundId = [];
        $scope.product.RoleId = [];
        $scope.product.SubCodeId = [];

        $scope.product.ProductRates = [];
        $scope.product.ProductCycleTenures = [];
        $scope.product.ProductDurations = [];
        $scope.product.ProductGracePeriods = [];

        $scope.product.IsSupplimentary = 0;
        $scope.product.IsIncludedInCycle = 1;
        $scope.product.IsPrimary = 1;
        $scope.product.IsVaryingCycle = 0;

        $scope.productDescriptionLength = null;

        $scope.uploadedFiles = [];
        $scope.files = [];
        $scope.productId = '';
        $scope.savedStartDay = {};
        $scope.ProductStatus = {};
        $scope.serverDateTimeToday = undefined;

        $scope.gracePeriodIdForTenure = [];
        $scope.frequencyIdForTenure = [];
        $scope.durationIdForTenure = [];
        $scope.uploadError = false;
        $scope.durationIdForDuration = [];
        $scope.durationIdForRateRange = [];
        $scope.frequencyIdForRateRange = [];
        $scope.InsuranceFee = [];
        $scope.lateFee = [];
        $scope.oneTimeFee = [];
        $scope.InsuranceFeeMain = [];
        $scope.lateFeeMain = [];
        $scope.oneTimeFeeMain = [];
        $scope.fee = {};
        $scope.product.Insurance = null;
        $scope.product.oneTimeFee = [];
        $scope.loanFees = [];
        $scope.previousVersionNo = null;
        $scope.savingsProductsList = [];
        $scope.SavingsProductIdList = [];
        $scope.purposeListMain = [];


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



        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value'
        }

        $scope.dropdownSetting_2 = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'text',
            idProp: 'value'
        }

        $scope.dropdownSetting_3 = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value',
            enableSearch: true,
            searchField: 'Name',
            showCheckAll: false,
            showUncheckAll: false
        }
        $scope.branchDdlEvents = {
            onItemSelect: function (item) {
                if (item.id === -999999 || item.id === -100000) {
                    $scope.product.BranchId = [];
                    $scope.product.BranchId.push(item);
                } else {
                    var index = $scope.product.BranchId.map(function (e) { return e.id }).indexOf(-999999);
                    if (index > -1)
                        $scope.product.BranchId.splice(index, 1);
                }
                if ($scope.product.BranchId.length <= 0) {
                    $scope.product.BranchId.push({ id: -100000 });
                }
                if (item.id !== -100000 && $scope.product.BranchId.length >= 2) {
                    var i = $scope.product.BranchId.map(function (e) { return e.id }).indexOf(-100000);
                    if (i > -1) {
                        $scope.product.BranchId.splice(i, 1);
                    }
                }
            },
            onItemDeselect: function (item) {
                if ($scope.product.BranchId.length <= 0) {
                    $scope.product.BranchId.push({ id: -100000 });
                }
            }
        };

        $scope.alphanumericValidator = function (name) {
            if (!name) return "false";
            if (!/^[\w\-\s]+$/.test(name)) {
                return "Only AlphaNumeric is allowed";
            }
            return true;
        }

        $scope.removeFromList = function (listName, item) {
            $scope.product[listName].splice($scope.product[listName].indexOf(item), 1);
            if (listName === "ProductCycleTenures" && $scope.product.ProductCycleTenures.length <= 0) {
                $scope.product.ProductRates = [];
                $scope.product.ProductDurations = [];
                $scope.product.ProductGracePeriods = [];
            }
        }

        $scope.getExistingProduct = function () {
            productService.getLatestProducts($scope.productId).then(function (response) {
                $scope.ProductList = response.data;
                $scope.getFrequency();
            });
        }

        $scope.rateRangeVaryingChange = function (isChecked) {
            if (isChecked) {
                $scope.addRateObject();
            } else {
                $scope.product.ProductRates = [];
            }
        }
        $scope.getProductType = function () {
            productService.getProductTypes().then(function (response) {
                $scope.types = response.data;
                $scope.product.ProductTypeId = response.data[0].Value;
                //$scope.getCategory($scope.product.ProductTypeId);
            });
        }



        $scope.getFrequency = function () {
            productService.getInstallmentfrequency().then(function (response) {
                $scope.installmentFrequencyList = angular.copy(response.data);
                $scope.installmentFrequencyListMain = response.data.filter(freq => freq.Value !== $scope.allowAllValue && freq.Value !== $scope.allowNone);
                $scope.getPurpose();
            });
        }

        var cloneAndPluck = function (sourceObject, keys) {
            var newObject = {};
            keys.forEach(function (key) { newObject[key] = sourceObject[key]; });
            return newObject;
        };

        //var subset = cloneAndPluck(elmo, ["color", "height"]);

        $scope.getSavingsProducts = function () {
            productService.getSavingsProducts().then(function (resoponse) {
                $scope.savingsProductsList = resoponse.data;
                //$scope.savingsProductsList.forEach(function (sp) {
                //    $scope.SavingsProductIdList.push(sp.Value);
                //});
            });
        }

        

        $scope.getFees = function () {
            productService.getFees().then(function (response) {
                $scope.InsuranceFeeMain = $scope.lateFeeMain = $scope.oneTimeFeeMain = angular.copy(response.data);

                $scope.InsuranceFeeMain = $scope.InsuranceFeeMain.filter(i => i.ChargeType === 1 && i.AppliedTo === 1);
                $scope.lateFeeMain = $scope.lateFeeMain.filter(i => i.ChargeType === 2 && i.AppliedTo === 1);
                $scope.oneTimeFeeMain = $scope.oneTimeFeeMain.filter(i => i.ChargeType === 3 && i.AppliedTo === 1);


                $scope.InsuranceFeeMain.forEach(function (i) {
                    i = cloneAndPluck(i, ["Id", "Name"]);
                    $scope.InsuranceFee.push(i);
                });

                $scope.lateFeeMain.forEach(function (i) {
                    i = cloneAndPluck(i, ["Id", "Name"]);
                    $scope.lateFee.push(i);
                });

                $scope.oneTimeFeeMain.forEach(function (i) {
                    i = cloneAndPluck(i, ["Id", "Name"]);
                    $scope.oneTimeFee.push({ Name: i.Name, Value: i.Id });
                });
                $scope.getServerDateTime();
                
            });
        }

        $scope.getPurpose = function () {
            productService.getProductScheme().then(function (response) {
                $scope.purposeList = response.data.filter(fund => fund.Value !== $scope.allowAllValue && fund.Value !== $scope.allowNone);
                $scope.purposeListMain = response.data.filter(fund =>fund.Value !== $scope.allowNone);
                $scope.getFunds();
            });
        }

        $scope.getFunds = function () {
            productService.getFunds().then(function (response) {
                $scope.fundsList = response.data;
                $scope.fundsListMain = response.data;
                //$scope.fundsList.push({ Name: 'N/A', Value: $scope.allowAllValue });
                $scope.fundsListMain = $scope.fundsListMain.filter(fund => fund.Value !== $scope.allowAllValue && fund.Value !== $scope.allowNone);
                $scope.getDuration();
            });
        }

        $scope.getDuration = function () {
            productService.getDuration().then(function (response) {
                response.data.forEach(function (d) {
                    d.Value = parseInt(d.Value);
                });
                $scope.durationList = angular.copy(response.data);
                $scope.durationListMain = response.data.filter(dur => dur.Value !== $scope.allowAllValue && dur.Value !== $scope.allowNone && dur.Value !== $scope.allowAllValue.toString());
                $scope.getCalculationMethod();
                //$scope.durationList.push({ Name: 'N/A', Value: $scope.allowAllValue });
            });
        }

        $scope.getCalculationMethod = function () {
            filterService.getProgramFilterDataByType("InterestCalculationMethod").then(function (response) {
                $scope.InterestCalculationMethodList = response.data;
                $scope.getCalculationPeriod();
            });
        }

        $scope.getCalculationPeriod = function () {
            filterService.getProgramFilterDataByType("InterestCalculationPeriod").then(function (response) {
                $scope.InterestCalculationPeriodList = response.data;
                $scope.getRatePeriod();
            });
        }

        $scope.getRatePeriod = function () {
            filterService.getProgramFilterDataByType("InterestRatePeriod").then(function (response) {
                $scope.InterestRatePeriodList = response.data;
                $scope.getGracePeriod();
            });
        }

        $scope.getAmortizationList = function () {
            filterService.getProgramFilterDataByType("Amortization").then(function (response) {
                $scope.amortizationList = response.data;
                $scope.getRoles();

            });
        }

        $scope.getGracePeriod = function () {
            filterService.getProgramFilterDataByType("GracePeriod").then(function (response) {
                response.data.forEach(function (period) {
                    period.Value = Number(period.Value);
                });
                $scope.gracePeriodList = angular.copy(response.data);
                $scope.gracePeriodListMain = response.data.filter(gp => gp.Value !== $scope.allowAllValue && gp.Value !== $scope.allowNone && gp.Value !== $scope.allowAllValue.toString());
                $scope.getRepaymentStrategy();
                //$scope.gracePeriodList.push({ Name: 'N/A', Value: $scope.allowAllValue });
            });
        }
        $scope.getLoanProductPreference = function () {
            filterService.getProgramFilterDataByType("LoanPreference").then(function (response) {
                $scope.loanProductPreferenceList = response.data;
                $scope.loanProductPreferenceListMain = response.data;
            });
        }
        $scope.changePreferenceDataType = function () {
            $scope.ProductPreferences.forEach(function (preference, index) {
                var preferenceObj = {
                    PreferenceOrder: index + 1,
                    PreferenceType: preference
                };
                $scope.preferenceObjects.push(preferenceObj);
            });
        }

        $scope.getRepaymentStrategy = function () {
            productService.getRepaymentStrategy().then(function (response) {
                $scope.repaymentStrategyList = response.data;
                $scope.getAmortizationList();
            });
        }

        $scope.getRoles = function () {
            productService.getRoles().then(function (response) {
                $scope.Roles = response.data;
                $scope.getGroupTypes();
            });
        }

        $scope.getGroupTypes = function () {
            branchService.getGroupTypes().then(function (response) {
                $scope.groupTypeList = JSON.parse(response.data);
                $scope.groupTypeList.push({ Name: 'Allow All', Id: -100000 });
                $scope.getGenders();
            });
        }

        $scope.getGenders = function () {
            filterService.getOrganizationalFilterDataByType('Sex').then(function (response) {
                $scope.genderList = response.data;
                $scope.getBranches();
            });
        }

        $scope.getBranches = function () {
            productService.getAllBranch().then(function (response) {
                $scope.allBranches = response.data;
                $scope.allBranches.unshift($scope.allBranches.splice($scope.allBranches.findIndex(elt => elt.Value === -100000), 1)[0]);
                $scope.getSubcodeOptions();
            });
        }

        $scope.getStatusOptions = function () {
            filterService.getOrganizationalFilterDataByType('ProductStatus').then(function (response) {
                $scope.statusList = response.data;

            });
        }


        $scope.getSubcodeOptions = function () {
            productService.getSubcodes().then(function (response) {
                $scope.SubcodeList = angular.copy(response.data);
                $scope.SubcodeListMain = response.data.filter(sc => sc.Value !== $scope.allowAllValue && sc.Value !== $scope.allowNone && sc.Value !== $scope.allowAllValue.toString());
                $scope.getFees();
            });
        }

        $scope.durationFilter = function () {
            return function (item) {
                if ($scope.durationsMultiSelect.find(x => x.id === item.Value) !== undefined || Number(item.Value) === Number($scope.allowAllValue)) {
                    return true;
                }
                return false;
            };
        }
        $scope.filterPreference = function (index) {
            return function (item) {
                for (var i = 0; i < $scope.loanProductPreferenceListMain.length; i++) {
                    if ($scope.ProductPreferences[i] === item.Value && i !== index) {
                        return false;
                    }
                }
                return true;
            }

        }
        $scope.gracePeriodFilter = function () {
            return function (item) {
                if ($scope.GracePeriods.find(x => x.id === item.Value) !== undefined || Number(item.Value) === Number($scope.allowAllValue)) {
                    return true;
                }
                return false;
            };
        }

        $scope.installmentFrequencyFilter = function () {
            return function (item) {
                if ($scope.installmentFrequencies.find(x => x.id === item.Value) !== undefined || Number(item.Value) === Number($scope.allowAllValue)) {
                    return true;
                }
                return false;
            };
        }

        $scope.fundFilter = function () {
            return function (item) {
                if ($scope.product.FundId.find(x => x.id === item.Value) !== undefined || item.Value === $scope.allowAllValue) {
                    return true;
                }
                return false;
            };
        }
        $scope.subcodeFilter = function () {
            return function (item) {
                if ($scope.product.SubCodeId.find(x => x.id === item.Value) !== undefined || Number(item.Value) === Number($scope.allowAllValue)) {
                    return true;
                }
                return false;
            };
        }
        $scope.schemeFilter = function () {
            return function (item) {
                if ($scope.product.SchemeId.find(x => x.id === item.Value) !== undefined || Number(item.Value) === Number($scope.allowAllValue)) {
                    return true;
                }
                return false;
            };
        }

        $scope.toggleRestricted = function (productId) {
            if ($scope.product.RestrictedProductId.indexOf(productId) === -1) {
                $scope.product.RestrictedProductId.push(productId);
                if ($scope.product.PrerequisiteProductId.indexOf(productId) >= 0) $scope.product.PrerequisiteProductId.splice($scope.product.PrerequisiteProductId.indexOf(productId), 1);
            }
            else $scope.product.RestrictedProductId.splice($scope.product.RestrictedProductId.indexOf(productId), 1);
        }

        $scope.togglePrerequisite = function (productId) {
            if ($scope.product.PrerequisiteProductId.indexOf(productId) === -1) {
                $scope.product.PrerequisiteProductId.push(productId);
                if ($scope.product.RestrictedProductId.indexOf(productId) >= 0) $scope.product.RestrictedProductId.splice($scope.product.RestrictedProductId.indexOf(productId), 1);
            }
            else $scope.product.PrerequisiteProductId.splice($scope.product.PrerequisiteProductId.indexOf(productId), 1);
        }
        $scope.toggleAllowSavingsProduct = function (productId) {
            if ($scope.SavingsProductIdList.indexOf(productId) !== -1)
                $scope.SavingsProductIdList.splice($scope.SavingsProductIdList.indexOf(productId), 1);
            else
                $scope.SavingsProductIdList.push(productId);
        }

        $scope.MaxPrincipalConstraint = function ($index) {
            if ($scope.product.ProductRates[$index].MaxPrincipal < $scope.product.ProductRates[$index].MinPrincipal) $scope.product.ProductRates[$index].MaxPrincipal = $scope.product.ProductRates[$index].MinPrincipal + 2;
        }

        $scope.addRateObject = function () {
            if ($scope.product.FundId.length <= 0) {
                swal("Please select Funds in Loan Disbursement Information  block first");
                return;
            }
            if ($scope.product.SubCodeId.length <= 0) {
                swal("Please select Sub Codes in Loan Disbursement Information  block first");
                return;
            }
            if ($scope.durations.length <= 0) {
                swal("Please select Durations in Loan Disbursement Information  block first");
                return;
            }
            if ($scope.installmentFrequencies.length <= 0) {
                swal("Please select Frequencies in Loan Disbursement Information  block first");
                return;
            }
            $scope.durationIdForRateRange = [];
            $scope.frequencyIdForRateRange = [];
            var countF = 0;
            var countD = 0;
            $scope.product.ProductCycleTenures.forEach(function (pt) {
                var isExistDuration = true;


                if (Number(pt.InstallmentFrequencyId) === Number($scope.allowAllValue)) {
                    $scope.frequencyIdForRateRange = angular.copy($scope.installmentFrequencyList);
                    for (var i = 0; i < $scope.frequencyIdForRateRange.length; i++) {
                        if (Number($scope.frequencyIdForRateRange[i].Value) === Number($scope.allowNone)) {
                            $scope.frequencyIdForRateRange.splice(i, 1);
                        }
                    }
                } else {
                    countF++;
                    if (countF === 1) {
                        $scope.frequencyIdForRateRange.push({
                            Name: "Allow All",
                            Value: $scope.allowAllValue
                        });
                    }
                }
                if (Number(pt.DurationId) === Number($scope.allowAllValue)) {
                    $scope.durationIdForRateRange = angular.copy($scope.durationList);
                } else {
                    countD++;
                    if (countD === 1) {
                        $scope.durationIdForRateRange.push({
                            Name: "Allow All",
                            Value: $scope.allowAllValue
                        });
                    }
                }

                for (var i = 0; i < $scope.durationIdForRateRange.length; i++) {
                    if ($scope.durationIdForRateRange[i].Value === pt.DurationId) {
                        isExistDuration = false;
                        break;
                    }
                }
                if (isExistDuration) {
                    $scope.durationIdForRateRange.push({
                        Name: $scope.durationList.find(x => x.Value === pt.DurationId).Name,
                        Value: pt.DurationId
                    });
                }

                var isExistFrequency = true;
                for (var i = 0; i < $scope.frequencyIdForRateRange.length; i++) {
                    if ($scope.frequencyIdForRateRange[i].Value === pt.InstallmentFrequencyId) {
                        isExistFrequency = false;
                        break;
                    }
                }
                if (isExistFrequency) {
                    $scope.frequencyIdForRateRange.push({
                        Name: $scope.installmentFrequencyList.find(x => x.Value === pt.InstallmentFrequencyId).Name,
                        Value: pt.InstallmentFrequencyId
                    });
                }
            });
            if ($scope.product.ProductCycleTenures.length > 0) {
                var rateObject = {
                    MinCycle: $scope.product.ProductRates.length > 0 ? $scope.product.ProductRates[$scope.product.ProductRates.length - 1].MaxCycle + 1 : 1,

                    FundId: $scope.allowAllValue,
                    SubCodeId: $scope.allowAllValue,
                    DurationId: $scope.product.ProductCycleTenures[0].DurationId !== undefined ? $scope.allowAllValue : null,
                    InstallmentFrequencyId: $scope.installmentFrequencies.length > 0 ? $scope.allowAllValue : null,
                    MinPrincipal: 0,
                    MaxPrincipal: 0,
                    DefaultPrincipal: 0,
                    InterestRate: 0,
                    GenderId: $scope.allowAllValue.toString(),
                    init: function () {
                        this.MaxCycle = this.MinCycle + 1;
                        return this;
                    }
                }.init();
                if ($scope.durations.length && $scope.installmentFrequencies.length && $scope.installmentFrequencies.length) $scope.product.ProductRates.push(rateObject);
                else swal("please fill in the Loan Disbursement information list");
            } else {
                swal("Please select in the Frequency, Duration and Grace Period information in Tenure Information  block first");
            }

        }
        console.log($scope.durationList);
        $scope.addDurationObject = function () {
            if ($scope.durations.length <= 0) {
                swal("Please select Durations in Loan Disbursement Information  block first");
                return;
            }
            if ($scope.product.FundId.length <= 0) {
                swal("Please select Funds in Loan Disbursement Information  block first");
                return;
            }
            $scope.durationIdForDuration = [];

            $scope.product.ProductCycleTenures.forEach(function (pt) {
                var isExistDuration = true;
                if (Number(pt.DurationId) === Number($scope.allowAllValue)) {
                    $scope.durationIdForDuration = angular.copy($scope.durationList);
                    for (var i = 0; i < $scope.durationIdForDuration.length; i++) {
                        if (Number($scope.durationIdForDuration[i].Value) === Number($scope.allowAllValue)) {
                            $scope.durationIdForDuration.splice(i, 1);
                        }
                    }
                }
                for (var i = 0; i < $scope.durationIdForDuration.length; i++) {
                    if ($scope.durationIdForDuration[i].Value === pt.DurationId) {
                        isExistDuration = false;
                        break;
                    }
                }
                if (isExistDuration) {
                    if (Number(pt.DurationId) !== Number($scope.allowAllValue)) {
                        $scope.durationIdForDuration.push({
                            Name: $scope.durationList.find(x => x.Value === pt.DurationId).Name,
                            Value: pt.DurationId
                        });
                    }
                }
                
            });
            if ($scope.product.ProductCycleTenures.length > 0) {
                var durationObject = {
                    DurationId: $scope.durationList[0].Value,
                    FundId: $scope.allowAllValue,
                    GroupTypeId: $scope.allowAllValue

                };
                if ($scope.durations.length) $scope.product.ProductDurations.push(durationObject);
                else swal("Please fill in the Durations information in Loan Disbursement Information block first!");
            } else {
                swal("Please select in the Frequency, Duration and Grace Period information in Tenure Information  block first");
            }
        }

        $scope.addTenure = function () {
            if ($scope.durations.length <= 0) {
                swal("Please select Durations in Loan Disbursement Information  block first");
                return;
            }
            if ($scope.installmentFrequencies.length <= 0) {
                swal("Please select Frequencies in Loan Disbursement Information  block first");
                return;
            }
            if ($scope.GracePeriods.length <= 0) {
                swal("Please select Grace Period in Loan Disbursement Information block first");
                return;
            }
            var tenureObject = {
                DurationId: $scope.durations.length > 0 ? $scope.allowAllValue : null,
                InstallmentFrequencyId: $scope.installmentFrequencies.length > 0 ? $scope.allowAllValue : null,
                TotalNumberOfInstallment: 0,
                InstallmentAmountPerThousand: 0,
                GracePeriod: $scope.GracePeriods.length > 0 ? $scope.allowAllValue : null
            }
            if ($scope.durations.length && $scope.installmentFrequencies.length && $scope.GracePeriods.length) $scope.product.ProductCycleTenures.push(tenureObject);
            else swal("Please fill in the Frequencies, Durations and Grace Periods information in Loan Disbursement Information block first!");
        }

        $scope.addGracePeriod = function () {
            if ($scope.durations.length <= 0) {
                swal("Please select Durations in Loan Disbursement Information  block first");
                return;
            }
            if ($scope.installmentFrequencies.length <= 0) {
                swal("Please select Frequencies in Loan Disbursement Information  block first");
                return;
            }
            if ($scope.GracePeriods.length <= 0) {
                swal("Please select Grace Periods in Loan Disbursement Information  block first");
                return;
            }
            $scope.gracePeriodIdForTenure = [];
            $scope.durationIdForTenure = [];
            $scope.frequencyIdForTenure = [];
            var countD = 0;
            var countF = 0;
            $scope.product.ProductCycleTenures.forEach(function (pt) {
                var isExistGracePeriod = true;
                if (Number(pt.DurationId) === Number($scope.allowAllValue)) {
                    $scope.durationIdForTenure = angular.copy($scope.durationList);
                } else {
                    countD++;
                    if (countD === 1) {
                        $scope.durationIdForTenure.push({
                            Name: "Allow All",
                            Value: $scope.allowAllValue
                        });
                    }
                }
                
                if (Number(pt.GracePeriod) === Number($scope.allowAllValue)) {
                    $scope.gracePeriodIdForTenure = angular.copy($scope.gracePeriodList);
                    for (var i = 0; i < $scope.gracePeriodIdForTenure.length; i++) {
                        if (Number($scope.gracePeriodIdForTenure[i].Value) === Number($scope.allowAllValue)) {
                            $scope.gracePeriodIdForTenure.splice(i, 1);
                        }
                    }
                }
                if (Number(pt.InstallmentFrequencyId) === Number($scope.allowAllValue)) {
                    $scope.frequencyIdForTenure = angular.copy($scope.installmentFrequencyList);
                    for (var i = 0; i < $scope.frequencyIdForTenure.length; i++) {
                        if (Number($scope.frequencyIdForTenure[i].Value) === Number($scope.allowNone)) {
                            $scope.frequencyIdForTenure.splice(i, 1);
                        }
                    }
                } else {
                    countF++;
                    if (countF === 1) {
                        $scope.frequencyIdForTenure.push({
                            Name: "Allow All",
                            Value: $scope.allowAllValue
                        });
                    }
                }
                for (var i = 0; i < $scope.gracePeriodIdForTenure.length; i++) {
                    if ($scope.gracePeriodIdForTenure[i].Value === pt.GracePeriod) {
                        isExistGracePeriod = false;
                        break;
                    }
                }
                if (isExistGracePeriod) {
                    if (Number(pt.GracePeriod) !== Number($scope.allowAllValue)) {
                        $scope.gracePeriodIdForTenure.push({
                            Name: $scope.gracePeriodList.find(x => x.Value === pt.GracePeriod).Name,
                            Value: pt.GracePeriod
                        });
                    }
                }

                var isExistDuration = true;
                for (var i = 0; i < $scope.durationIdForTenure.length; i++) {
                    if ($scope.durationIdForTenure[i].Value === pt.DurationId) {
                        isExistDuration = false;
                        break;
                    }
                }
                if (isExistDuration) {
                    $scope.durationIdForTenure.push({
                        Name: $scope.durationList.find(x => x.Value === pt.DurationId).Name,
                        Value: pt.DurationId
                    });
                }

                var isExistFrequency = true;
                for (var i = 0; i < $scope.frequencyIdForTenure.length; i++) {
                    if ($scope.frequencyIdForTenure[i].Value === pt.InstallmentFrequencyId) {
                        isExistFrequency = false;
                        break;
                    }
                }
                if (isExistFrequency) {
                    $scope.frequencyIdForTenure.push({
                        Name: $scope.installmentFrequencyList.find(x => x.Value === pt.InstallmentFrequencyId).Name,
                        Value: pt.InstallmentFrequencyId
                    });
                }


            });
            
            if ($scope.product.ProductCycleTenures.length > 0) {
                var gracePeriodObject = {
                    GracePeriodId: $scope.product.ProductCycleTenures[0].GracePeriod.length !== null ? $scope.product.ProductCycleTenures[0].GracePeriod : null,
                    DurationId: $scope.product.ProductCycleTenures[0].DurationId !== undefined ? $scope.allowAllValue : null,
                    InstallmentFrequencyId: $scope.product.ProductCycleTenures[0].InstallmentFrequencyId !== undefined ? $scope.allowAllValue : null,
                    GenderId: $scope.allowAllValue.toString(),
                    SchemeId: $scope.allowAllValue
                }
                if ($scope.GracePeriods.length && $scope.durations.length && $scope.installmentFrequencies.length) $scope.product.ProductGracePeriods.push(gracePeriodObject);
            } else {
                swal("Please select in the Frequency, Duration and Grace Period information in Tenure Information  block first");
            }

        }

        var checkArrayChange = function (source, target) {
            if (source.length !== target.length) return true;
            var result = source.filter(function (item) { return target.indexOf(item) === -1 });


            return (result.length > 0);
        }

        var isChanged = function (a, b) {
            if (a !== b) $scope.IsVersionChanged = true;
        }

        var checkArrayOfObjectChange = function (sources, targets) {
            if (sources.length !== targets.length) {
                $scope.IsVersionChanged = true;

            } else {
                sources.forEach(function (source, i) {
                    for (var propertyName in source) {
                        if (propertyName === "$$hashKey") continue;
                        if (source[propertyName] !== targets[i][propertyName]) {
                            $scope.IsVersionChanged = true;
                        }
                    }
                });
            }

        };

        var detectChange = function (product, originalProduct) {
            var changingValues = ['EndDate', 'IsIncludedInCycle', 'IsPrimary', 'IsSupplimentary', 'IsVaryingCycle',
                                'InterestCalculationMethod', 'InterestCalculationPeriod', 'Amortization', 'RepaymentStrategyId',
                                'MinimumMemberCycle', 'insurance', 'lateFee'];
            changingValues.forEach(function (key) {
                isChanged(product[key], originalProduct[key]);
            });
            var changingAttributesArrays = ['FundId', 'DurationId', 'BranchId', 'SchemeId', 'RoleId', 'oneTimeFee', 'RestrictedProductId', 'PrerequisiteProductId'];
            changingAttributesArrays.forEach(function (key) {

                if (checkArrayChange(product[key], originalProduct[key])) $scope.IsVersionChanged = true;

            });


            var changingAttributesArraysOfObjects = ['ProductRates', 'ProductCycleTenures', 'ProductDurations', 'ProductGracePeriods'];
            changingAttributesArraysOfObjects.forEach(function (key) {
                if (checkArrayOfObjectChange(product[key], originalProduct[key])) $scope.IsVersionChanged = true;
            });
        };

        var changeDataTypes = function () {
            $scope.durationsMultiSelect = $scope.product.DurationId.map(function (a) { return { id: a } });
            $scope.durations = $scope.durationsMultiSelect;
            $scope.installmentFrequencies = $scope.product.FrequencyId.map(function (a) { return { id: a } });

            $scope.GracePeriods = $scope.product.GracePeriods.map(function (a) { return { id: a } });

            $scope.product.FundId = $scope.product.FundId.map(function (a) { return { id: a } });

            $scope.product.BranchId = $scope.product.BranchId.map(function (a) { return { id: a } });
            $scope.product.SchemeId = $scope.product.SchemeId.map(function (a) { return { id: a } });
            $scope.product.InterestCalculationPeriod = $scope.product.InterestCalculationPeriod.toString();
            $scope.product.InterestRatePeriod = $scope.product.InterestRatePeriod.toString();
            $scope.product.RoleId = $scope.product.RoleId.map(function (a) { return { id: a } });

            $scope.product.SubCodeId = $scope.product.SubCodeId.map(function (a) { return { id: a } });
            //$scope.product.oneTimeFee = $scope.product.oneTimeFee.map(function (a) { return { id: a } });

            $scope.product.ProductRates.forEach(function (pct) {
                pct.GenderId = pct.GenderId.toString();
            });

            $scope.product.ProductGracePeriods.forEach(function (pgp) {
                pgp.GenderId = pgp.GenderId.toString();
            });
        }

        $scope.getProductInfo = function (productId) {
            productService.getProductInfo(productId).then(function (response) {
                $scope.product = response.data;
                $scope.getSavingsProducts();
                if ($scope.product.EndDate === null) {
                    $scope.product.EndDate = undefined;
                }
                $scope.previousVersionNo = $scope.product.VersionNo;
                console.log($scope.product);
                $scope.product.StartDate = new Date($scope.product.StartDate);
                $scope.product.EndDate = new Date($scope.product.EndDate);
                $scope.savedStartDay = moment($scope.product.StartDate).format("YYYY-MM-DD");
                $scope.dateOptionsEndDate.minDate = new Date(moment($scope.savedStartDay).add(1,"days"));
                $scope.ProductStatus = $scope.product.Status;
                $scope.productName = response.data.Name;
                $scope.productShortName = response.data.ShortName;
                $scope.productDescriptionLength = response.data.Description.length;
                $scope.getCategory(response.data.CategoryId);
                $scope.generateDataFromTenure($scope.product.ProductCycleTenures);

                $scope.loanFees = $scope.product.LoanFees;
                if ($scope.loanFees.filter(f => f.AppliedTo === 1 && f.ChargeType === 1)[0])
                    $scope.product.insurance = $scope.loanFees.filter(f => f.AppliedTo === 1 && f.ChargeType === 1)[0].Id;
                if ($scope.loanFees.filter(f => f.AppliedTo === 1 && f.ChargeType === 2)[0])
                    $scope.product.lateFee = $scope.loanFees.filter(f => f.AppliedTo === 1 && f.ChargeType === 2)[0].Id;
                $scope.product.oneTimeFee = $scope.loanFees.filter(f => f.AppliedTo === 1 && f.ChargeType === 3);
                $scope.product.oneTimeFee = [];
                $scope.loanFees.forEach(function (f) {
                    if (f.AppliedTo === 1 && f.ChargeType === 3) $scope.product.oneTimeFee.push({ id: f.Id });
                });
                $scope.OriginalProduct = angular.copy($scope.product);
                if (response.data.ProductPreferences)
                    $scope.ProductPreferences = response.data.ProductPreferences.map(function (item) { return item.PreferenceType.toString() });
                documentService.getFilesbyEntity(productId, $rootScope.FileUploadEntities.Product).then(function (response) {
                    $scope.uploadedFiles = response.data;
                    $rootScope.productFileHash = response.data && response.data.length > 0 ? response.data[0].Hash : '';
                });
                if ($scope.product.SavingsProductsId != null && $scope.product.SavingsProductsId.length > 0) {
                    $scope.SavingsProductIdList = $scope.product.SavingsProductsId.split(",").map(Number);
                }

                changeDataTypes();
                $scope.dateRangeValidation();
                $("#loadingImage").css("display", "none");
            });
        }
        $scope.generateDataFromTenure = function (tenure) {
            tenure.forEach(function (pt) {
                var isExistDurationFg = false;
                var isExistFrequencyFg = false;
                var isExistDurationFr = false;
                var isExistDurationFd = false;
                var isExistFrequencyFr = false;
                var isExistGracePeriodFg = false;
                $scope.frequencyIdForTenure.push({
                    Name: "Allow All",
                    Value: $scope.allowAllValue
                });
                //$scope.durationIdForTenure.push({
                //    Name: "Allow All",
                //    Value: $scope.allowAllValue
                //});
                if (pt.DurationId !== null) {
                    if (pt.DurationId === $scope.allowAllValue) {
                        $scope.durationIdForRateRange = angular.copy($scope.durationList);
                        $scope.durationIdForTenure = angular.copy($scope.durationList);
                    } else {
                        for (var i = 0; i < $scope.durationIdForRateRange.length; i++) {
                            if ($scope.durationIdForRateRange[i].Value === pt.DurationId) {
                                isExistDurationFr = true;
                                break;
                            }
                        }
                        if (!isExistDurationFr) {
                            $scope.durationIdForRateRange.push({
                                Name: $scope.durationList.find(x => x.Value === pt.DurationId).Name,
                                Value: pt.DurationId
                            });
                        }
                        for (var i = 0; i < $scope.durationIdForDuration.length; i++) {
                            if ($scope.durationIdForDuration[i].Value === pt.DurationId) {
                                isExistDurationFd = true;
                                break;
                            }
                        }
                        if (!isExistDurationFd) {
                            if (pt.DurationId !== $scope.allowAllValue) {
                                $scope.durationIdForDuration.push({
                                    Name: $scope.durationList.find(x => x.Value === pt.DurationId).Name,
                                    Value: pt.DurationId
                                });
                            }
                        }
                        for (var i = 0; i < $scope.durationIdForTenure.length; i++) {
                            if ($scope.durationIdForTenure[i].Value === pt.DurationId) {
                                isExistDurationFg = true;
                                break;
                            }
                        }
                        if (!isExistDurationFg) {
                            $scope.durationIdForTenure.push({
                                Name: $scope.durationList.find(x => x.Value === pt.DurationId).Name,
                                Value: pt.DurationId
                            });
                        }
                    }

                }
                $scope.durationIdForDuration = angular.copy($scope.durationIdForTenure);
                $scope.durationIdForDuration.push({
                    Name: "Allow All",
                    Value: $scope.allowAllValue
                });
                console.log($scope.durationIdForDuration);
                if (pt.GracePeriod !== null && pt.GracePeriod !== $scope.allowAllValue) {
                    for (var i = 0; i < $scope.gracePeriodIdForTenure.length; i++) {
                        if ($scope.gracePeriodIdForTenure[i].Value === pt.GracePeriod) {
                            isExistGracePeriodFg = true;
                            break;
                        }
                    }
                    if (!isExistGracePeriodFg) {
                        $scope.gracePeriodIdForTenure.push({
                            Name: $scope.gracePeriodList.find(x => x.Value === pt.GracePeriod).Name,
                            Value: pt.GracePeriod
                        });
                    }
                } else {
                    $scope.gracePeriodIdForTenure = angular.copy($scope.gracePeriodList);
                }


                if (pt.InstallmentFrequencyId !== null) {
                    if (pt.InstallmentFrequencyId === $scope.allowAllValue) {
                        $scope.frequencyIdForRateRange = angular.copy($scope.installmentFrequencyList);
                        $scope.frequencyIdForTenure = angular.copy($scope.installmentFrequencyList);
                        for (var i = 0; i < $scope.frequencyIdForTenure.length; i++) {
                            if (Number($scope.frequencyIdForTenure[i].Value) === Number($scope.allowNone)) {
                                $scope.frequencyIdForTenure.splice(i, 1);
                            }
                        }
                    } else {
                        for (var i = 0; i < $scope.frequencyIdForRateRange.length; i++) {
                            if ($scope.frequencyIdForRateRange[i].Value === pt.InstallmentFrequencyId) {
                                isExistFrequencyFr = true;
                                break;
                            }
                        }
                        if (!isExistFrequencyFr) {
                            $scope.frequencyIdForRateRange.push({
                                Name: $scope.installmentFrequencyList.find(x => x.Value === pt.InstallmentFrequencyId).Name,
                                Value: pt.InstallmentFrequencyId
                            });
                        }
                        for (var i = 0; i < $scope.frequencyIdForTenure.length; i++) {
                            if ($scope.frequencyIdForTenure[i].Value === pt.InstallmentFrequencyId) {
                                isExistFrequencyFg = true;
                                break;
                            }
                        }
                        if (!isExistFrequencyFg) {
                            $scope.frequencyIdForTenure.push({
                                Name: $scope.installmentFrequencyList.find(x => x.Value === pt.InstallmentFrequencyId).Name,
                                Value: pt.InstallmentFrequencyId
                            });
                        }
                    }

                }

            });
        }
        $scope.getCategory = function (categoryId) {
            productService.getProductCategoryName(categoryId).then(function (response) {
                $scope.categories = response.data;
                $scope.categories.productCategoryName = $scope.categories[0].Name;
            });
        }
        $scope.getServerDateTime = function ($date) {
            commonService.getServerDateTime().then(function (response) {
                $scope.serverDateTimeToday = response.data;
                //$scope.startDateRender($date);
                $scope.getProductInfo($scope.productId);
            });
        }
        $scope.startDateRender = function ($dates) {
            var startDate = moment($scope.savedStartDay);
            var systemDate = moment($scope.serverDateTimeToday).format("YYYY-MM-DD");
            var maxDate = moment(systemDate).add(3, 'months');
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        if ($dates[d].utcDateValue < startDate.valueOf() || $dates[d].utcDateValue > maxDate.valueOf()) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }
            if (moment($scope.savedStartDay).format("YYYY-MM-DD") !== moment($scope.product.StartDate).format("YYYY-MM-DD")) {
                $scope.changeProductStatus();
            } 
        }
        $scope.editBeforeStartDateRender = function ($dates) {
            if ($scope.serverDateTimeToday) {
                $scope.startDateRender($dates);
            } else {
                $scope.getServerDateTime($dates);
            }
            $scope.getStatusOptions();
        }

        $scope.editBeforeEndDateRender = function ($dates) {
            var minDate = new Date($scope.product.StartDate).setHours(0, 0, 0, 0);
            minDate = new Date(minDate);
            minDate.setDate(minDate.getDate() + 1);
            minDate = minDate.setHours(0, 0, 0, 0);
            if ($scope.product.EndDate < minDate && $scope.product.EndDate !== null) {
                swal('End date can not be less than start date');
                $scope.product.EndDate = new Date(minDate);
            }
            for (d in $dates) {
                if ($dates.hasOwnProperty(d)) {
                    if ($dates.length > 27) {
                        if ($dates[d].utcDateValue <= minDate) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }
        }


        $scope.changeProductStatus = function () {
            if (moment($scope.product.StartDate).format("YYYY-MM-DD") <= moment($scope.serverDateTimeToday).format("YYYY-MM-DD")) {
                $scope.product.Status = $scope.statusList[0].value;
            } else {
                $scope.product.Status = $scope.statusList[2].value;
            }
        }

        $scope.minprincipalValidator = function () {
            if ($scope.product.MinimumPrincipal !== NaN && $scope.product.MaximumPrincipal !== NaN && $scope.product.DefaultPrincipal !== NaN) {
                if ($scope.product.MinimumPrincipal > $scope.product.MaximumPrincipal) {

                    return 'Minimum Principal amount is invalid. Please provide a value less than or equal to Maximum Principal!';
                }

            }
            if ($scope.product.PrincipleAmountMultipleOf != undefined) {
                if ($scope.product.PrincipleAmountMultipleOf !== 0) {
                    if ($scope.product.MinimumPrincipal % $scope.product.PrincipleAmountMultipleOf !== 0)
                        return "Value should be multiple of " + $scope.product.PrincipleAmountMultipleOf;
                }
            }
            return true;

        }
        $scope.maxprincipalValidator = function () {
            if ($scope.product.MinimumPrincipal !== NaN && $scope.product.MaximumPrincipal !== NaN && $scope.product.DefaultPrincipal !== NaN) {
                if ($scope.product.MinimumPrincipal > $scope.product.MaximumPrincipal) {

                    return 'Maximum Principal amount is invalid. Please provide a value greater than or equal to Minimum Principal!';
                }

            }
            if ($scope.product.PrincipleAmountMultipleOf != undefined) {
                if ($scope.product.PrincipleAmountMultipleOf !== 0) {
                    if ($scope.product.MaximumPrincipal % $scope.product.PrincipleAmountMultipleOf !== 0)
                        return "Value should be multiple of " + $scope.product.PrincipleAmountMultipleOf;
                }
            }
            return true;

        }

        $scope.defaultprincipalValidator = function () {
            if (($scope.product.DefaultPrincipal > $scope.product.MaximumPrincipal || $scope.product.DefaultPrincipal < $scope.product.MinimumPrincipal)) {

                return 'Principal amount is invalid. Please provide a value within the range of Minimum Principal and Maximum Principal amount provided.';
            }
            if ($scope.product.PrincipleAmountMultipleOf != undefined) {
                if ($scope.product.PrincipleAmountMultipleOf !== 0) {
                    if ($scope.product.DefaultPrincipal % $scope.product.PrincipleAmountMultipleOf !== 0)
                        return "Value should be multiple of " + $scope.product.PrincipleAmountMultipleOf;
                }
            }
            return true;
        }



        //upload document
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
                    });

                    swal("Deleted!", "file has been deleted.", "success");
                });
        }

        $scope.removeLocalFile = function (hash) {
            if (hash) {
                documentService.deleteLocalDocument(hash);
                $scope.docSizeBoolChecker();
            }
        }



        $scope.init = function () {
            $("#loadingImage").css("display", "block");
            $scope.productId = $rootScope.editProductId;
            $scope.getStatusOptions();
            $scope.getExistingProduct();
            delete $rootScope.editProductId;
        }

        $scope.init();

        $scope.removeEndDate = function () {
            $scope.product.EndDate = undefined;
        }

        $scope.clearAndCloseTab = function () {
            $scope.product = {};
            $scope.execRemoveTab($scope.tab);
        };

        $scope.onSubmitForm = function () {
            if (!$scope.editProductForm.$valid) {
                $scope.editProductForm.$dirty = true;
            } else {
                $scope.editProductForm.$dirty = false;
            }
        }

        $scope.$on('tab-switched', function () {
            if ($rootScope.hasOwnProperty("editProductId")) {
                $scope.productId = $rootScope.editProductId;
                $scope.getProductInfo($scope.productId);
            }
        });
        $scope.rebateChange = function () {
            if (!$scope.product.IsRebatable) {
                $scope.product.RebatePercentage = null;
            }
        }

        $scope.multiselectValidator = function () {
            if ($scope.product.FundId.length <= 0) {
                swal("Fund Information Required In Loan Disbursement Information");
                return false;
            }

            if ($scope.product.SchemeId.length <= 0) {
                swal("Scheme Information Required In Loan Disbursement Information");
                return false;
            }



            if ($scope.durations.length <= 0) {
                swal("Duration Information Required In Loan Disbursement Information");
                return false;
            }

            if ($scope.GracePeriods.length <= 0) {
                swal("GracePeriods Information Required In Loan Disbursement Information");
                return false;
            }

            if ($scope.product.SubCodeId.length <= 0) {

                swal("Subcodes Information Required In Loan Disbursement Information");
                return false;
            }

            if ($scope.installmentFrequencies.length <= 0) {
                swal("Frequency Information Required In Loan Disbursement Information");
                return false;
            }

            return true;
        }
        $scope.minMaxDisburseNumberValidation = function (value) {
            if (value < 1 || value === null || value === undefined) {
                $scope.product.MaxDisburseNumber = 1;
            }
        }
        $scope.minMultipleOfValidation = function (value) {
            if (value < 1 || value === null || value === undefined) {
                $scope.product.PrincipleAmountMultipleOf = 1;
            }
        }
        //console.log($scope.durationIdForDuration);
        //for (var i = $scope.durationIdForDuration.length - 1; i >= 0; --i) {
        //    if ($scope.durationIdForDuration[i].Name === "Allow All") {
        //        $scope.durationIdForDuration.splice(i, 1);
        //    }
        //}
        //$scope.durationIdForDuration.push({
        //    Name: "Allow All",
        //    Value: $scope.allowAllValue
        //});
        //console.log($scope.durationIdForDuration);

        $scope.editProduct = function () {
            console.log($scope.product);
            if ($scope.product.StartDate >= $scope.product.EndDate) {
                swal({
                    title: "Error!",
                    text: "End date can not be less than or equal to Start date",
                    type: "error",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                });
                return;
            }
            if ($scope.product.ProductCycleTenures.length < 1) {
                swal("Tenure Information Is Required");
                return;
            }
            if ($scope.product.IsVaryingCycle) {
                if ($scope.product.ProductRates.length <= 0) {
                    swal("You need to add at least 1 rule for your selected setting: 'Varying principal & Service Charge with Respect to Different Attributes' under Rate Range Information Block");
                    return;
                }
            }
            if ($scope.product.ProductDurations.length > 0) {
                $scope.fundOfDurationBug = false;
                $scope.fundMissingDuration = null;
                for (var i = 0; i < $scope.product.ProductCycleTenures.length; i++) {
                    if ($scope.product.ProductCycleTenures[i].DurationId != -100000) {
                        var j = $scope.product.ProductDurations.find(x => x.DurationId == $scope.product.ProductCycleTenures[i].DurationId);
                        if (j == undefined) {
                            $scope.fundOfDurationBug = true;
                            $scope.fundMissingDuration = $scope.product.ProductCycleTenures[i].DurationId;
                            break;
                        }
                    }
                }
                if ($scope.fundOfDurationBug) {
                    swal("Fund not found for duration " + $scope.fundMissingDuration + " in Duration Information block");
                    return;
                }
            }
            if (!$scope.multiselectValidator()) return;



            if ($scope.docError) {
                swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');
                return;
            }

            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.product),
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                cancelButtonText: 'Cancel'
            },
           function (isConfirmed) {
               if (isConfirmed) {
                   $scope.product.StartDate = moment($scope.product.StartDate).format();
                   $scope.product.EndDate = $scope.product.EndDate !== undefined ? moment($scope.product.EndDate).format() : undefined;
                   $scope.product.DurationId = $scope.durationsMultiSelect.map(function (a) { return a.id; });
                   $scope.product.FundId = $scope.product.FundId.map(function (a) { return a.id; });
                   $scope.product.SchemeId = $scope.product.SchemeId.map(function (a) { return a.id; });
                   $scope.product.RoleId = $scope.product.RoleId.map(function (a) { return a.id; });

                   $scope.product.GracePeriods = $scope.GracePeriods.map(function (a) { return a.id; });
                   $scope.product.BranchId = $scope.product.BranchId.map(function (a) { return a.id; });
                   $scope.product.SubCodeId = $scope.product.SubCodeId.map(function (a) { return a.id; });

                   $scope.product.InterestCalculationPeriod = Number($scope.product.InterestCalculationPeriod);
                   $scope.product.FrequencyId = $scope.installmentFrequencies.map(function (a) { return a.id; });
                   $scope.product.oneTimeFee = $scope.product.oneTimeFee.map(function (a) { return a.id; });
                   $scope.changePreferenceDataType();
                   $scope.product.ProductPreferences = $scope.preferenceObjects;

                   detectChange($scope.product, $scope.OriginalProduct);
                   $scope.product.ChangeVersion = $scope.IsVersionChanged;
                   if ($scope.ProductStatus === '3') {
                       $scope.product.ChangeVersion = false;
                   };
                   $scope.product.ProductCycleTenures.forEach(function (pct) {
                       pct.GracePeriod = Number(pct.GracePeriod);
                   });

                   if ($scope.SavingsProductIdList != null && $scope.SavingsProductIdList.length > 0) {
                       $scope.product.SavingsProductsId = "";
                       $scope.SavingsProductIdList.forEach(function (sp) {
                           $scope.product.SavingsProductsId = $scope.product.SavingsProductsId + sp + ",";
                       });
                       $scope.product.SavingsProductsId = $scope.product.SavingsProductsId.substring(0, $scope.product.SavingsProductsId.length - 1);
                   }

                   productService.edit($scope.product).then(function (response) {
                       var str = response.data.Message.split(" ");
                       var productId = str[0];
                       var versionNo = str[1];
                       if (response.data.Success) {
                           if (response.data.Entity.Id && $scope.files.length > 0) {
                               documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.Product, $rootScope.user.UserId)
                                   .then(function (res) {
                                       if (res.data.Success) {
                                           $rootScope.$broadcast('product-edit-finished', $scope.product);
                                           $scope.removeLocalFile($rootScope.productFileHash);
                                           if (response.data.Entity.VersionNo == $scope.previousVersionNo) swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.product), "Successful!", "success");
                                           if (response.data.Entity.VersionNo != $scope.previousVersionNo) swal("Product (Id - " + productId + ") Added With New Version - " + versionNo, "Successfully!", "success");
                                           $scope.clearAndCloseTab();
                                       } else {
                                           $scope.uploadError = true;
                                           productService.delete(response.data.Entity.Id);
                                           swal(__env.docAddError, "File is not Uploaded", "error");
                                       }
                                   });
                           } else {
                               if (!$scope.uploadError) {
                                   $rootScope.$broadcast('product-edit-finished', $scope.product);
                                   $scope.removeLocalFile($rootScope.productFileHash);
                                   if (response.data.Entity.VersionNo == $scope.previousVersionNo) swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.product), "Successful!", "success");
                                   if (response.data.Entity.VersionNo != $scope.previousVersionNo) swal("Product (Id - " + productId + ") Added With New Version - " + versionNo, "Successfully!", "success");
                               }
                               $scope.clearAndCloseTab();
                           }


                       } else {
                           $scope.product.FundId = $scope.product.FundId.map(function (a) { return { id: a } });
                           $scope.product.SchemeId = $scope.product.SchemeId.map(function (a) { return { id: a } });
                           $scope.product.RoleId = $scope.product.RoleId.map(function (a) { return { id: a } });
                           $scope.product.DurationId = $scope.durations.map(function (a) { return { id: a } });
                           $scope.product.GracePeriods = $scope.GracePeriods.map(function (a) { return { id: a } });
                           $scope.product.SubCodeId = $scope.Subcodes.map(function (a) { return { id: a } });
                           $scope.product.BranchId = $scope.product.BranchId.map(function (a) { return { id: a } });
                           $scope.product.FrequencyId = $scope.installmentFrequencies.map(function (a) { return { id: a } });
                           $scope.product.oneTimeFee = $scope.product.oneTimeFee.map(function (a) { return { id: a } });
                           swal($rootScope.showMessage($rootScope.editError, $rootScope.product), response.data.Message, "error");
                       }
                   });
               }
           });
        }


        //new datepicker
        $scope.today = function () {
            $scope.product.StartDate = new Date(moment($scope.savedStartDay).format("YYYY-MM-DD"));
        };
        
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($scope.serverDateTimeToday),
            showWeeks: true
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            //console.log((new Date($rootScope.workingdate)).getDate);
            return (mode === 'day' && (date.getDay() === 5));
            //|| (moment(date) > moment(new Date($scope.serverDateTimeToday)).add(1, 'days'));
        }
        $scope.dateOptionsStartDate = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(),
            minDate: new Date($scope.serverDateTimeToday),
            startingDay: 1
        };
        console.log($scope.dateOptionsStartDate);
        $scope.dateOptionsEndDate = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(2099, 12, 31),
            minDate: new Date(),
            startingDay: 1
        };
        console.log($scope.dateOptionsEndDate);
        //$scope.toggleMin = function () {
        //    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($scope.serverDateTimeToday.getDate() + 1);
        //    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        //};

      //  $scope.toggleMin();

        $scope.openStartDate = function () {
            $scope.popupStartDate.opened = true;
        };
        $scope.openEndDate = function () {
            $scope.popupEndDate.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popupStartDate = {
            opened: false
        };
        $scope.popupEndDate = {
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
        $scope.startDateValidator = function () {
            $scope.dateOptionsEndDate.minDate = moment($scope.product.StartDate).add(1, 'days');
            $scope.product.EndDate = moment($scope.product.StartDate).format("YYYY-MM-DD") == moment($scope.product.EndDate).format("YYYY-MM-DD") ? new Date($scope.dateOptionsEndDate.minDate) : new Date($scope.product.EndDate);
            if ($scope.product.EndDate) {
                if (moment($scope.product.StartDate).valueOf() > moment($scope.product.EndDate).valueOf()) {
                    swal('please select valid date!');
                    $scope.today();
                    //$scope.isHolidayOrOffDay($scope.product.StartDate);
                    return;
                }
            }
        }
        $scope.endDateValidator = function () {
            if (moment($scope.product.EndDate) < moment(new Date($scope.product.StartDate))) {
                swal("End Date can't be less then start date");
               // $scope.isHolidayOrOffDay($scope.product.EndDate);
                return;
            }
        }
        $scope.dateRangeValidation = function () {
            var minDate = moment($scope.serverDateTimeToday).format("YYYY-MM-DD");
            if ($rootScope.user.Role == $rootScope.rootLevel.LO || $rootScope.user.Role == $rootScope.rootLevel.ABM) {
                minDate = moment($scope.serverDateTimeToday).add(1, 'days');
            }
            else if ($rootScope.user.Role == $rootScope.rootLevel.RM) {
                minDate = moment($scope.serverDateTimeToday).add(-1, 'months');
            }
            else if ($rootScope.user.Role == $rootScope.rootLevel.DM) {
                minDate = moment($scope.serverDateTimeToday).add(-3, 'months');
            } else if ($rootScope.user.Role == $rootScope.rootLevel.Admin) {
                minDate = moment($scope.serverDateTimeToday).add(-50, 'years');
            }
            $scope.dateOptionsStartDate.maxDate = new Date(moment($scope.serverDateTimeToday).format("YYYY-MM-DD"));
            $scope.dateOptionsStartDate.minDate = new Date(moment(minDate).format("YYYY-MM-DD"));
            $scope.dateOptionsEndDate.minDate = new Date(moment($scope.savedStartDay).add(1, 'days').format("YYYY-MM-DD"));
            $scope.dateOptionsEndDate.maxDate = new Date(moment(new Date(2099, 12, 31)).format("YYYY-MM-DD"));
        }
    }
]);