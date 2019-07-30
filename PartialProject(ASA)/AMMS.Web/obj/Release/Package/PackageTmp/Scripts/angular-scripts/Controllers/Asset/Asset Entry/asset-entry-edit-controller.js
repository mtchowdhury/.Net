ammsAng.controller('assetEntryEditController', ['$scope', '$rootScope', 'assetEntryService', 'commonService','filterService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder', 'assetDisposalService', 'assetCategoryService', 'documentService', 'assetTransferReceiveService',
    function ($scope, $rootScope, assetEntryService, commonService,filterService, $timeout, employeeService, loanGroupService, DTOptionsBuilder, assetDisposalService, assetCategoryService, documentService, assetTransferReceiveService) {
        var initialBillingPrice = 0;
        $scope.asset = null;
        $scope.savedAsset = {};
        $scope.dateOptionsPurchaseDate = {};
        $scope.getAssetById = function () {
            assetEntryService.getAssetById($scope.editAssetId).then(function (response) {
                $scope.asset = response.data;
                $scope.getBankAccountList();

                if ($scope.asset.ItemCategoryName == "Furniture & Fixtures") {
                    $scope.ShowLocalSalesOption = true;
                    

                } else {
                    $scope.ShowLocalSalesOption = false;
                    
                }
                $scope.getVattaxInfo();


                //$scope.asset.IsVatIncluded = $scope.asset.IsVatIncluded ? 1 : 0;
                $scope.savedAsset = angular.copy(response.data);
                $scope.subStatusFirstTime = $scope.savedAsset.SubStatus;
                initialBillingPrice = $scope.asset.BillingPrice;
                // change the date formats
                if ($scope.asset.BankAccount != null) $scope.asset.BankAccount = parseInt($scope.asset.BankAccount);
                if ($scope.asset.ExpiryDate != null) $scope.asset.ExpiryDate = new Date($scope.asset.ExpiryDate);
                if ($scope.asset.PurchaseWorkingDate != null) $scope.asset.PurchaseWorkingDate = new Date($scope.asset.PurchaseWorkingDate);
                if ($scope.asset.WarrantyExpireDate != null) $scope.asset.WarrantyExpireDate = new Date($scope.asset.WarrantyExpireDate);
                if ($scope.asset.PurchaseOrderDate != null) $scope.asset.PurchaseOrderDate = new Date($scope.asset.PurchaseOrderDate);
                if ($scope.asset.InvoiceDate != null) $scope.asset.InvoiceDate = new Date($scope.asset.InvoiceDate);
                if ($scope.asset.ChalanDate != null) $scope.asset.ChalanDate = new Date($scope.asset.ChalanDate);
                if ($scope.asset.DisposalDate != null) $scope.asset.DisposalDate = new Date($scope.asset.DisposalDate);
                if ($scope.asset.DisposalDate != null) $scope.asset.DisposalDateS = moment($scope.asset.DisposalDate).format("YYYY-MM-DD");
                if ($scope.asset.ChequeDate != null) $scope.asset.ChequeDate = new Date($scope.asset.ChequeDate);
                if ($scope.asset.LastDepreciationPeriod != null) $scope.asset.LastDepreciationPeriod = moment($scope.asset.LastDepreciationPeriod).format('DD-MM-YYYY');
                //round the depreciation values
                if ($scope.asset.AccumulatedDepreciationAmount != null) $scope.asset.AccumulatedDepreciationAmount = Math.round($scope.asset.AccumulatedDepreciationAmount);
                if ($scope.asset.CurrentYearDepreciationAmount != null) $scope.asset.CurrentYearDepreciationAmount = Math.round($scope.asset.CurrentYearDepreciationAmount);
                if ($scope.asset.WrittenDownValue != null) $scope.asset.WrittenDownValue = Math.round($scope.asset.WrittenDownValue);
                //$scope.asset.ChalanDate = new Date(scope.asset.ChalanDate);
                $scope.asset.Quantity = 1;
                if ($scope.asset.IsVatDeductible) $scope.asset.IsVatDeductible = 1;
                else $scope.asset.IsVatDeductible = 0;
                if ($scope.asset.IsTaxDeductible) $scope.asset.IsTaxDeductible = 1;
                else $scope.asset.IsTaxDeductible = 0;
                if ($scope.asset.Mushak11 != "False") $scope.asset.Mushak11Radio = true;
                else $scope.asset.Mushak11Radio = false;
                $scope.asset.BillingPrice = Math.round($scope.asset.BillingPrice);
                $scope.asset.VatAmountView = $scope.asset.VatAmount;
                $scope.asset.TaxAmountView = $scope.asset.TaxAmount;
                $scope.asset.IsFixedAsset = $scope.savedAsset.IsFixedAsset ? "Fixed" : "Not Fixed";
                $scope.asset.Status = $scope.asset.Status.toString();
                $scope.asset.SubStatus = $scope.asset.SubStatus.toString();
                $scope.asset.CurrentBranch = $rootScope.selectedBranchTitle;
                $scope.IsCheque = $scope.asset.PurchaseMethod == "2" ? true : false;
                $scope.setRoleWisePurchaseEntryDateRange();
                console.log($scope.asset);
                //$scope.GetFilters();
                if (response.data.BranchAmmsId == null) $scope.UpdateTotalPrice();
                $scope.asset.UnitBillingPrice = Math.round(($scope.asset.BillingPrice / $scope.asset.Quantity) * 100) / 100;
                $scope.getBranchesByRoleAndBranch();
                $scope.getVattaxInfoInit();
                $scope.assetStatusChange();
                $scope.filterCategory($scope.asset.ItemTypeId);
                $scope.filters.AssetTypeList =
                    $scope.filters.AssetTypeList.filter(e => e.Status != 2 || e.Value == $scope.asset.ItemTypeId);
                // if (i.Status != 2 || i.Id == $scope.asset.ItemTypeId) {
            });
        }
        $scope.getBankAccountList = function () {
            filterService.GetActiveBankAccountListByBranch($rootScope.selectedBranchId).then(function (response) {
                $scope.filters.bankAccountList = response.data;
                $scope.bankAccountList = response.data;
            });
        }
        $scope.setRoleWisePurchaseEntryDateRange = function () {
            $scope.dateOptionsPurchaseDate.maxDate = new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
            if ($rootScope.user.Role == $rootScope.UserRole.BM) {
                $scope.dateOptionsPurchaseDate.minDate = new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
            } else if ($rootScope.user.Role == $rootScope.UserRole.DM) {
                $scope.dateOptionsPurchaseDate.minDate = new Date(moment($rootScope.workingdate).add(-90, "days"));
            } else if ($rootScope.user.Role == $rootScope.UserRole.RM || $rootScope.user.Role == $rootScope.UserRole.Admin || $rootScope.user.Role == $rootScope.UserRole.SuperAdmin) {
                $scope.dateOptionsPurchaseDate.minDate = new Date(moment($rootScope.workingdate).add(-100, "years"));
            } else {
                $scope.dateOptionsPurchaseDate.minDate = null;
                $scope.dateOptionsPurchaseDate.maxDate = null;
                $scope.asset.PurchaseWorkingDate = null;
            }
        }
        $scope.GetFilters = function () {
            assetEntryService.GetAdditionalFilters($rootScope.selectedBranchId, $scope.editAssetId).then(function (response) {
                //$scope.filters.BranchList = response.data.branches;
                $scope.asset.CurrentBranchId = $rootScope.selectedBranchId;

                $scope.filters.supplierList = response.data.suppliers;
                $scope.filters.bankAccountList = response.data.bankAccounts;
                $scope.filters.manufacturerList = response.data.manufacturers;

                $scope.filters.OfficeTypeList = response.data.PermittedOfficeLevel;
                $scope.filters.DepartmentList = response.data.departments;

                $scope.filters.OfficeTypeList.push({ Name: "All", Value: -100000 });
                $scope.getAssetById();
                assetEntryService.getEmployeeByOfficeCode($rootScope.selectedBranchId).then(function (response) {
                    $scope.filters.employeeList = response.data;
                    //if ($scope.filters.employeeList) $scope.asset.AssignedEmployee = $scope.filters.employeeList[0].Value;

                });

                //assetEntryService.getEmployeeByOfficeCode($scope.asset.CurrentBranchId).then(function(response) {
                //    $scope.filters.employeeList = response.data;

                //});
            });

            $scope.toggleExempt = function() {
                if ($scope.asset.IsVatExemption == false) {
                    $scope.asset.IsVatDeductible = 1;
                }
            }

            $scope.toggleTaxDeductible = function() {
                if ($scope.asset.IsTaxExemption == false) {
                    $scope.asset.IsTaxDeductible = 1;
                }
            }

            assetEntryService.categoryFilters().then(function(response) {

                $scope.categoryItems = angular.copy(response.data);

                $scope.categoryItems.forEach(function(c) {
                    c.CategoryItems.forEach(function(i) {
                       
                            $scope.ItemList.push({
                                Name: i.Name,
                                Value: i.Id,
                                CategoryId: i.CategoryId,
                                CategoryName: c.Name,
                                IsFixed: i.IsFixedStatus,
                            });
                        
                    });

                });
                $scope.filters.AssetTypeList = $scope.ItemList;
            });

            assetEntryService.GetFilters().then(function (response) {
                $scope.filters.statusList = response.data.AssetStatus;
                $scope.filters.subStatusList = response.data.AssetSubStatus;
                $scope.filters.subStatusListMain = angular.copy(response.data.AssetSubStatus);
                $scope.statusListMain = angular.copy(response.data.AssetStatus);
                $scope.flagListMain = angular.copy(response.data.AssetSubStatus);

            });

        }

        function dateOptionsWithFutureDateWithHoliday(data) {
            var date = data.date,
                mode = data.mode;

            return (mode === 'day' && (date.getDay() === -1))
                ||
                (moment(date) <= moment(new Date($scope.asset.PurchaseWorkingDate)).add(-1, 'days'));
        }


        $scope.expirydateOptions2 = {
            dateDisabled: dateOptionsWithFutureDateWithHoliday,
            initDate: new Date($rootScope.workingdate),
            formatYear: 'yy',
            //maxDate: new Date(2099, 5, 22),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1,
            showWeeks: false
        };

        $scope.getBranchesByRoleAndBranch = function () {
            commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, $rootScope.user.Role).then(function (response) {

                $scope.BranchListMain = angular.copy(response.data);

                $scope.BranchListMain = $scope.BranchListMain.filter(function (el) {
                    return el.Value !== -100000;
                });
                $scope.BranchList = angular.copy($scope.BranchListMain);

                $scope.filterOfficeList();
            }, AMMS.handleServiceError);
        }

        $scope.filterOfficeList = function () {
            if ($scope.asset.LocationOfficeType == "-100000") $scope.BranchList = $scope.BranchListMain;
            else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == $scope.asset.LocationOfficeType);
        }

        //$scope.filterOfficeList = function () {
        //    if ($scope.asset.LocationOfficeType == "-100000") $scope.BranchList = $scope.BranchListMain;
        //    else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == $scope.asset.LocationOfficeType);
        //}

        $scope.ChangePurchaseMethod = function () {
            if ($scope.asset.PurchaseMethod == 2)
                $scope.IsCheque = true;
            else if ($scope.asset.PurchaseMethod == 1) {
                $scope.IsCheque = false;
                $scope.asset.BankAccount = null;
                $scope.asset.ChequeNo = null;
                $scope.asset.ChequeDate = null;
            }
        }

        $scope.UpdateExpiryDate = function () {
            //var year = moment($scope.asset.PurchaseWorkingDate).format('YYYY');
            //var month = $scope.asset.PurchaseWorkingDate.getMonth();
            //var day = $scope.asset.PurchaseWorkingDate.getDate();
            $scope.asset.ExpiryDate = new Date(moment($scope.asset.PurchaseWorkingDate).add($scope.asset.UsefulLife, 'years').add(-1, 'days'));
            assetCategoryService.getCategoryInfo($scope.asset.ItemCategoryId).then(function (response) {
                var res = response.data;
                if ($scope.asset.UsefulLife < res.MinimumUsefulLife || $scope.asset.UsefulLife > res.MaximumUsefulLife) {
                    $scope.asset.UsefulLife = res.DefaultUsefulLife;
                    swal("UsefulLife Life Must be between Min : " + res.MinimumUsefulLife + " and Max : " + res.MaximumUsefulLife);
                    return;
                }
            });

        }

        $scope.UpdateUsefulLife = function () {
            $scope.asset.UsefulLife = moment($scope.asset.ExpiryDate).diff(moment($scope.asset.PurchaseWorkingDate), 'years', false);
        }


        var initvariables = function () {

            $scope.filters = {};
            $scope.asset = {};
            $scope.files = [];
            $scope.AssetImage = [];
            $scope.assetImage = [];
            $scope.invoiceimage = [];
            $scope.POimage = [];
            $scope.paychequeImage = [];
            $scope.assetDocuments = {};
            $scope.assetDocuments.asset = [];
            $scope.assetDocuments.documents = [];
            //$scope.filters.purchaseMethodList = [];
            //$scope.filters.purchaseMethodList = [{ Name: "Cash", Value: 1 }, { Name: "Cheque", Value: 2 }];

            //$scope.asset.AssetTypeId = 1;
            //$scope.asset.PurchaseMethod = 1;
            $scope.IsCheque = false;
            $scope.asset = {};
            $scope.filters = {};
            $scope.ItemList = [];
            if ($rootScope.selectedBranchId < 0)
                $scope.asset.PurchaseWorkingDate = new Date(moment());
            else $scope.asset.PurchaseWorkingDate = new Date($rootScope.workingdate);


        }
        initvariables();

        $scope.filterItem = function (categoryId) {
            $scope.categoryItems.forEach(function (c) {
                if (c.Id === categoryId) {
                    $scope.filterParams.ItemTypeList = c.CategoryItems;
                }
            });
        }
        $scope.filterCategory = function (itemId) {
            $scope.ItemList.forEach(function (i) {
                if (i.Value === itemId) {
                    $scope.asset.ItemCategoryName = i.CategoryName;
                    $scope.asset.ItemCategoryId = i.CategoryId;
                    $scope.asset.IsFixedAsset = i.IsFixed ? "Fixed" : "Not Fixed";
                    $scope.filters.vatcategoryList = [];
                    $scope.filters.vatcategoryList.push({ Name: i.Name, Value: i.Value });
                   // $scope.asset.VatCategory = i.VatCategoryId;
                    $scope.filters.taxcategorylist = [];
                    $scope.filters.taxcategorylist.push({ Name: i.Name, Value: i.Value });
                    $scope.asset.TaxCategory = i.TaxCategoryId;
                    //$scope.vatPercentage = i.VatPercentage;
                    $scope.salesCenterVat = i.salesCenterVat,
                    $scope.manufacturerVat = i.manufacturerVat,
                    $scope.taxPercentage = i.TaxPercentage;

                }
            });

            $scope.filters.AssetTypeList = $scope.ItemList;

            $scope.filters.typeList = [{ Name: "Non IT", Value: 0 }, { Name: "IT", Value: 1 }];
            //$scope.filters.purchaseMethodList = [{ Name: "Cash", Value: 1 }, { Name: "Cheque", Value: 2 }];

            //$scope.asset.PurchaseMethod = 1;
            $scope.categoryItems.forEach(function (c) {
                if (c.Id === $scope.asset.ItemCategoryId) $scope.asset.AssetTypeId = c.AssetType;
            });
            console.log($scope.filters.BranchList);
            if ($scope.BranchList != undefined) {
                $scope.BranchList.forEach(function (b) {
                    if (b.Value === $scope.asset.LocationOfficeId)
                        $scope.asset.LocationName = b.Name;
                });
            }
            //$scope.filters.AssetTypeList = $scope.ItemList;


            //if ($scope.asset.LocationOfficeType == "-100000") $scope.BranchList = $scope.BranchListMain;
            //else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == $scope.asset.LocationOfficeType);

        }

        $scope.getVattaxInfoInit = function () {
            if ($scope.asset.ItemTypeId == null) {
                swal("Please Select an Item Type!");
                return;
            }
            var fiscalYear = moment(new Date($rootScope.workingdate), "DD/MM/YYYY").year();
            assetEntryService.getVattaxInfo($scope.asset.ItemTypeId, $scope.asset.PurchasingLevel, $rootScope.selectedBranchId, fiscalYear, $scope.asset.BillingPrice).then(function (response) {
                var vattaxinfo = response.data;

                $scope.filters.vatcategoryList = [];
                $scope.filters.vatcategoryList.push({ Name: vattaxinfo.VatCategoryName, Value: vattaxinfo.VatCategoryId });
                $scope.asset.VatCategory = vattaxinfo.VatCategoryId;
                $scope.asset.VatCategoryName = vattaxinfo.VatCategoryName;
                $scope.filters.taxcategorylist = [];
                $scope.filters.taxcategorylist.push({ Name: vattaxinfo.TaxCategoryName, Value: vattaxinfo.TaxCategoryId });

                $scope.asset.TaxCategory = vattaxinfo.TaxCategoryId;
                $scope.asset.TaxCategoryId = vattaxinfo.TaxCategoryId;
                $scope.asset.TaxCategoryName = vattaxinfo.TaxCategoryName;

                $scope.asset.VatCategoryId = vattaxinfo.VatCategoryId;
                $scope.vatPercentage = vattaxinfo.VatPercentage;
                $scope.taxPercentage = vattaxinfo.TaxPercentage;
                //$scope.ShowLocalSalesOption = vattaxinfo.ShowLocalSalesOption;
                //if (!$scope.ShowLocalSalesOption) $scope.asset.PurchasingLevel = "0";
                //if ($scope.asset.VatCategoryId < 0 || $scope.vatPercentage === 0) $scope.asset.IsVatExemption = 1;
                //if ($scope.asset.TaxCategoryId < 0 || $scope.taxPercentage === 0) $scope.asset.IsTaxExemption = 1;
            });
        }

        $scope.changeShowLocalOption = function () {
            if ($scope.asset.ItemCategoryName == "Furniture & Fixtures") {
                $scope.ShowLocalSalesOption = true;
                $scope.asset.PurchasingLevel = "1";

            } else {
                $scope.ShowLocalSalesOption = false;
                $scope.asset.PurchasingLevel = "0";
            }
            $scope.getVattaxInfo();
        }

        $scope.getVattaxInfo = function () {

            if ($scope.asset.ItemTypeId == null) {
                swal("Please Select an Item Type!");
                return;
            }
            var fiscalYear = moment(new Date($rootScope.workingdate), "DD/MM/YYYY").year();
            assetEntryService.getVattaxInfo($scope.asset.ItemTypeId, $scope.asset.PurchasingLevel, $rootScope.selectedBranchId, fiscalYear, $scope.asset.BillingPrice).then(function (response) {
                var vattaxinfo = response.data;

                $scope.filters.vatcategoryList = [];
                $scope.filters.vatcategoryList.push({ Name: vattaxinfo.VatCategoryName, Value: vattaxinfo.VatCategoryId });
                $scope.asset.VatCategory = vattaxinfo.VatCategoryId;
                $scope.asset.VatCategoryName = vattaxinfo.VatCategoryName;
                $scope.filters.taxcategorylist = [];
                $scope.filters.taxcategorylist.push({ Name: vattaxinfo.TaxCategoryName, Value: vattaxinfo.TaxCategoryId });

                $scope.asset.TaxCategory = vattaxinfo.TaxCategoryId;
                $scope.asset.TaxCategoryId = vattaxinfo.TaxCategoryId;
                $scope.asset.TaxCategoryName = vattaxinfo.TaxCategoryName;

                $scope.asset.VatCategoryId = vattaxinfo.VatCategoryId;
                $scope.vatPercentage = vattaxinfo.VatPercentage;
                $scope.taxPercentage = vattaxinfo.TaxPercentage;
                $scope.ShowLocalSalesOption = vattaxinfo.ShowLocalSalesOption;
                //if (!$scope.ShowLocalSalesOption) $scope.asset.PurchasingLevel = "0";
                if ($scope.asset.VatCategoryId < 0 || $scope.vatPercentage === 0) $scope.asset.IsVatExemption = 1;
                if ($scope.asset.TaxCategoryId < 0 || $scope.taxPercentage === 0) $scope.asset.IsTaxExemption = 1;

                $scope.UpdateTotalPrice();
            });
        }

        $scope.DateToInt = function (date) {

            var dateInDate = new Date(date);
            var day = dateInDate.getDate();
            var month = dateInDate.getMonth() + 1;
            var year = dateInDate.getFullYear();
            if (day.toString().length === 1) {
                day = '0' + day;
            }
            if (month.toString().length === 1) {
                month = '0' + month;
            }
            var dateInInt = year.toString().concat(month.toString());
            dateInInt = dateInInt.concat(day.toString());
            dateInInt = dateInInt.concat('000000');
            var intDate = parseInt(dateInInt);
            return intDate;
        }

        var nullifyVatFields = function () {
            $scope.vatPercentage = 0;
            $scope.asset.VatAmountView = 0;
            $scope.asset.VatAmount = 0;
        }

        var nullifyTaxFields = function () {
            $scope.taxPercentage = 0;
            $scope.asset.TaxAmountView = 0;
            $scope.asset.TaxAmount = 0;
        }

        $scope.UpdateTotalPrice = function () {

            if ($scope.asset.Quantity < 1) {
                swal("Please insert Quantity > 1");
                return;
            }


            if (!$scope.ShowLocalSalesOption) $scope.asset.PurchasingLevel = "0";

            if ($scope.asset.VatCategoryId == -1) {
                nullifyVatFields();
            }

            if ($scope.asset.TaxCategoryId == -1) {
                nullifyTaxFields();
            }


            $scope.asset.UnitNetPayable = $scope.asset.BillingPrice / $scope.asset.Quantity;
            $scope.asset.UnitBillingPrice = Math.round(($scope.asset.BillingPrice / $scope.asset.Quantity) * 100) / 100;

            $scope.asset.UnitTotalPayable = $scope.asset.UnitNetPayable * $scope.asset.Quantity;

            $scope.asset.VatAmount = 0;
            $scope.asset.VatAmountView = 0;
            $scope.asset.TaxAmount = 0;
            $scope.asset.TaxAmountView = 0;


            if (!$scope.asset.IsVatExemption && $scope.asset.IsVatDeductible) {
                $scope.asset.VatAmountView = $scope.asset.VatAmount = Math.ceil(Math.round(((($scope.asset.UnitNetPayable) / (100 + $scope.vatPercentage)) * 100) * $scope.vatPercentage / 100 * 100) / 100);
                $scope.asset.UnitNetPayable = $scope.asset.UnitNetPayable - $scope.asset.VatAmountView;



                if ($scope.asset.Mushak11Radio) {
                    $scope.asset.VatAmount = 0;
                    $scope.asset.UnitNetPayable = $scope.asset.UnitNetPayable + $scope.asset.VatAmountView;
                }
            }

            if (!$scope.asset.IsTaxExemption && $scope.asset.IsTaxDeductible) {
                $scope.asset.TaxAmountView = $scope.asset.TaxAmount = Math.ceil(Math.round($scope.asset.UnitNetPayable * $scope.taxPercentage / 100 * 100) / 100);
                $scope.asset.UnitNetPayable = $scope.asset.UnitNetPayable - $scope.asset.TaxAmountView;
            }

            $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;

            //$scope.asset.VatAmountView = Math.round($scope.asset.VatAmountView * 100) / 100;
            //$scope.asset.TaxAmountView = Math.round($scope.asset.TaxAmountView * 100) / 100;
            $scope.asset.UnitNetPayable = Math.round($scope.asset.UnitNetPayable * 100) / 100;
            $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitTotalPayable * 100) / 100;

        } 


        // this is the last one
        //$scope.UpdateTotalPrice = function () {

        //    if ($scope.asset.Quantity < 1) {
        //        swal("Please insert Quantity > 1");
        //        return;
        //    }

        //    $scope.asset.UnitBillingPrice = Math.round(($scope.asset.BillingPrice / $scope.asset.Quantity) * 100) / 100;

        //    if (!$scope.ShowLocalSalesOption) $scope.asset.PurchasingLevel = "0";
        //    var unitPrice = $scope.asset.BillingPrice / $scope.asset.Quantity;
        //    var basePrice = unitPrice;

        //    if ($scope.asset.VatCategoryId == -1) {
        //        nullifyVatFields();
        //    }

        //    if ($scope.asset.TaxCategoryId == -1) {
        //        nullifyTaxFields();
        //    }

        //    //update this fun.
        //    if ($scope.asset.VatCategoryId == -1 || $scope.asset.TaxCategoryId == -1) {
        //        $scope.asset.UnitNetPayable = basePrice;
        //        $scope.asset.UnitTotalPayable = basePrice * $scope.asset.Quantity;
        //    }

        //    //check if in vat/tax mapping list ? Yes :
        //    if ($scope.asset.VatCategoryId > -1) {
        //        //if the item is furniture & fixture 
        //        if ($scope.ShowLocalSalesOption) {
        //            //Local
        //            if ($scope.asset.PurchasingLevel == "1") {
        //                nullifyVatFields();
        //                $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100 * 100) / 100;
        //                basePrice = unitPrice;
        //                $scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100)) * 100) / 100;
        //                $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //            }
        //                // sales center / manufacturer
        //            else if ($scope.asset.PurchasingLevel != "1") {
        //                //Vat exemption ? 
        //                if ($scope.asset.IsVatExemption) {
        //                    nullifyVatFields();
        //                    $scope.asset.VatAmount = 0;
        //                    $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100 * 100) / 100;
        //                    basePrice = (unitPrice / (100 + $scope.vatPercentage)) * 100;
        //                    $scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100)) * 100) / 100;
        //                    $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                } else if (!$scope.asset.IsVatExemption) {
        //                    if (!$scope.asset.IsVatDeductible) {
        //                        basePrice = (unitPrice / (100 + $scope.vatPercentage)) * 100;
        //                        $scope.asset.VatAmount = 0;
        //                        $scope.asset.VatAmountView = 0;
        //                        //$scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100)) * 100) / 100;
        //                        //$scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                    }
        //                    else if ($scope.asset.IsVatDeductible) {
        //                        if ($scope.asset.Mushak11Radio) {
        //                            basePrice = (unitPrice / (100 + $scope.vatPercentage)) * 100;
        //                            $scope.asset.VatAmount = 0;
        //                            $scope.asset.VatAmountView = Math.round(basePrice * $scope.vatPercentage) / 100;
        //                            $scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100)) * 100) / 100;
        //                            $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                        }
        //                        else if (!$scope.asset.Mushak11Radio) {
        //                            basePrice = (unitPrice / (100 + $scope.vatPercentage)) * 100;
        //                            $scope.asset.VatAmount = Math.round((basePrice * $scope.vatPercentage / 100) * 100) / 100;
        //                            $scope.asset.VatAmountView = Math.round((basePrice * $scope.vatPercentage / 100) * 100) / 100;
        //                            if ($scope.taxPercentage > 0) $scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100) * 100));
        //                            else $scope.asset.UnitNetPayable = Math.round(basePrice * 100) / 100;
        //                            $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //            //items other than furniture & fixture
        //        else if (!$scope.ShowLocalSalesOption) {
        //            //Vat exemption ? 
        //            if ($scope.asset.IsVatExemption) {
        //                nullifyVatFields();
        //                $scope.asset.VatAmount = 0;
        //                $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100 * 100) / 100;
        //                basePrice = unitPrice;
        //                $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100) * 100) / 100;
        //                $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //            } else if (!$scope.asset.IsVatExemption) {
        //                if (!$scope.asset.IsVatDeductible) {
        //                    basePrice = unitPrice;
        //                    $scope.asset.VatAmount = 0;
        //                    $scope.asset.VatAmountView = 0;
        //                }
        //                else if ($scope.asset.IsVatDeductible) {
        //                    if ($scope.asset.Mushak11Radio) {
        //                        basePrice = unitPrice;
        //                        $scope.asset.VatAmount = 0;
        //                        $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                        $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100));
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);
        //                    }
        //                    else if (!$scope.asset.Mushak11Radio) {
        //                        basePrice = unitPrice;
        //                        $scope.asset.VatAmount = Math.round((basePrice * $scope.vatPercentage / 100) * 100) / 100;
        //                        $scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100) * 100)) / 100;
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                    }
        //                }
        //            }
        //        }

        //    }
        //    if ($scope.asset.TaxCategoryId > -1) {
        //        if ($scope.ShowLocalSalesOption) {
        //            //Local
        //            if ($scope.asset.PurchasingLevel == "1") {
        //                nullifyTaxFields();
        //            }
        //                // sales center / manufacturer
        //            else if ($scope.asset.PurchasingLevel != "1") {
        //                //Vat exemption ? 
        //                if ($scope.asset.IsTaxExemption) {
        //                    nullifyTaxFields();
        //                    $scope.asset.UnitNetPayable = Math.round($scope.asset.UnitNetPayable * 100) / 100;
        //                    $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                } else if (!$scope.asset.IsTaxExemption) {
        //                    $scope.asset.UnitNetPayable = Math.round(($scope.asset.UnitNetPayable - ($scope.asset.UnitNetPayable * $scope.taxPercentage / 100)) * 100) / 100;
        //                    $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                    $scope.asset.TaxAmount = Math.round($scope.asset.UnitNetPayable * $scope.taxPercentage / 100 * 100) / 100;
        //                    $scope.asset.TaxAmountView = Math.round($scope.asset.UnitNetPayable * $scope.taxPercentage / 100 * 100) / 100;
        //                    //$scope.asset.IsTaxDeductible = 1;

        //                }
        //            }
        //        }
        //            // item other than furniture fixture
        //        else if (!$scope.ShowLocalSalesOption) {
        //            //Local
        //            if ($scope.asset.PurchasingLevel == "3") {
        //                nullifyTaxFields();
        //            }
        //                // sales center / manufacturer
        //            else if ($scope.asset.PurchasingLevel != "3") {
        //                //Tax exemption ? 
        //                if (!$scope.asset.IsTaxDeductible) {
        //                    $scope.asset.UnitNetPayable = Math.round($scope.asset.UnitNetPayable * 100) / 100;
        //                    $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                }
        //                else if ($scope.asset.IsTaxDeductible) {
        //                    if ($scope.asset.IsTaxExemption) {

        //                        basePrice = (100 * $scope.asset.UnitTotalPayable) / (100 + $scope.vatPercentage);
        //                        if ($scope.asset.Mushak11Radio) $scope.asset.UnitNetPayable = Math.round($scope.asset.UnitNetPayable);
        //                        if (!$scope.asset.Mushak11Radio) $scope.asset.UnitNetPayable = Math.round(basePrice);
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);

        //                        $scope.asset.TaxAmount = 0;
        //                        $scope.asset.TaxAmountView = 0;
        //                    } else if (!$scope.asset.IsTaxExemption) {

        //                        basePrice = (100 * $scope.asset.UnitNetPayable) / (100 + $scope.vatPercentage);
        //                        if (!$scope.asset.Mushak11Radio)
        //                            $scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100)) * 100) / 100;
        //                        if ($scope.asset.Mushak11Radio)
        //                            $scope.asset.UnitNetPayable = Math.round(($scope.asset.UnitNetPayable - (basePrice * $scope.taxPercentage / 100)) * 100) / 100;
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                        $scope.asset.TaxAmount = Math.round((basePrice * $scope.taxPercentage / 100) * 100) / 100;
        //                        $scope.asset.TaxAmountView = Math.round((basePrice * $scope.taxPercentage / 100) * 100) / 100;
        //                    }
        //                }
        //            }
        //        }
        //    }
        //}



        //$scope.UpdateTotalPrice = function () {

        //    $scope.asset.UnitBillingPrice = Math.round(($scope.asset.BillingPrice / $scope.asset.Quantity) * 100) / 100;

        //    if (!$scope.ShowLocalSalesOption) $scope.asset.PurchasingLevel = "0";
        //    var unitPrice = $scope.asset.BillingPrice / $scope.asset.Quantity;
        //    var basePrice = unitPrice;

        //    if ($scope.asset.VatCategoryId == -1) {
        //        nullifyVatFields();
        //    }

        //    if ($scope.asset.TaxCategoryId == -1) {
        //        nullifyTaxFields();
        //    }

        //    //update this fun.
        //    if ($scope.asset.VatCategoryId == -1 || $scope.asset.TaxCategoryId == -1) {
        //        $scope.asset.UnitNetPayable = basePrice;
        //        $scope.asset.UnitTotalPayable = basePrice * $scope.asset.Quantity;
        //    }

        //    //check if in vat/tax mapping list ? Yes :
        //    if ($scope.asset.VatCategoryId > -1) {
        //        //if the item is furniture & fixture 
        //        if ($scope.ShowLocalSalesOption) {
        //            //Local
        //            if ($scope.asset.PurchasingLevel == "1") {
        //                nullifyVatFields();
        //                $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100 * 100) / 100;
        //                basePrice = unitPrice;
        //                $scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100)) * 100);
        //                $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //            }
        //                // sales center / manufacturer
        //            else if ($scope.asset.PurchasingLevel != "1") {
        //                //Vat exemption ? 
        //                if ($scope.asset.IsVatExemption) {
        //                    nullifyVatFields();
        //                    $scope.asset.VatAmount = 0;
        //                    $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100 * 100) / 100;
        //                    basePrice = unitPrice;
        //                    $scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100) * 100)) / 100;
        //                    $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                } else if (!$scope.asset.IsVatExemption) {
        //                    if (!$scope.asset.IsVatDeductible) {
        //                        basePrice = unitPrice;
        //                        $scope.asset.VatAmount = 0;
        //                        $scope.asset.VatAmountView = 0;
        //                    }
        //                    else if ($scope.asset.IsVatDeductible) {
        //                        if ($scope.asset.Mushak11Radio) {
        //                            basePrice = unitPrice;
        //                            $scope.asset.VatAmount = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                            $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                            $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100));
        //                            $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                        }
        //                        else if (!$scope.asset.Mushak11Radio) {
        //                            basePrice = (100 * unitPrice) / (100 + $scope.vatPercentage);
        //                            $scope.asset.VatAmount = Math.round((basePrice * $scope.vatPercentage / 100) * 100) / 100;
        //                            $scope.asset.VatAmountView = Math.round((basePrice * $scope.vatPercentage / 100) * 100) / 100;
        //                            if ($scope.taxPercentage > 0) $scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100) * 100));
        //                            else $scope.asset.UnitNetPayable = Math.round(basePrice * 100) / 100;
        //                            $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //            //items other than furniture & fixture
        //        else if (!$scope.ShowLocalSalesOption) {
        //            //Vat exemption ? 
        //            if ($scope.asset.IsVatExemption) {
        //                nullifyVatFields();
        //                $scope.asset.VatAmount = 0;
        //                $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100 * 100) / 100;
        //                basePrice = unitPrice;
        //                $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100) * 100) / 100;
        //                $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //            } else if (!$scope.asset.IsVatExemption) {
        //                if (!$scope.asset.IsVatDeductible) {
        //                    basePrice = unitPrice;
        //                    $scope.asset.VatAmount = 0;
        //                    $scope.asset.VatAmountView = 0;
        //                }
        //                else if ($scope.asset.IsVatDeductible) {
        //                    if ($scope.asset.Mushak11Radio) {
        //                        basePrice = unitPrice;
        //                        $scope.asset.VatAmount = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                        $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                        $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100));
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);
        //                    }
        //                    else if (!$scope.asset.Mushak11Radio) {
        //                        basePrice = unitPrice;
        //                        $scope.asset.VatAmount = Math.round((basePrice * $scope.vatPercentage / 100) * 100) / 100;
        //                        $scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100) * 100)) / 100;
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                    }
        //                }
        //            }
        //        }

        //    }
        //    if ($scope.asset.TaxCategoryId > -1) {
        //        if ($scope.ShowLocalSalesOption) {
        //            //Local
        //            if ($scope.asset.PurchasingLevel == "1") {
        //                nullifyTaxFields();
        //            }
        //                // sales center / manufacturer
        //            else if ($scope.asset.PurchasingLevel != "1") {
        //                //Vat exemption ? 
        //                if ($scope.asset.IsVatExemption) {
        //                    nullifyTaxFields();
        //                    $scope.asset.UnitNetPayable = Math.round(basePrice * 100) / 100;
        //                    $scope.asset.UnitTotalPayable = Math.round(basePrice * $scope.asset.Quantity * 100) / 100;
        //                } else if (!$scope.asset.IsVatExemption) {
        //                    // jani na ki hoitese; andha gundha edit kortesi
        //                    //$scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100) * 100)) / 100;
        //                    $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100));
        //                    $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                    $scope.asset.TaxAmount = Math.round(basePrice * $scope.taxPercentage / 100 * 100) / 100;
        //                    $scope.asset.TaxAmountView = Math.round(basePrice * $scope.taxPercentage / 100 * 100) / 100;
        //                    //$scope.asset.IsTaxDeductible = 1;

        //                }
        //            }
        //        }
        //            // item other than furniture fixture
        //        else if (!$scope.ShowLocalSalesOption) {
        //            //Local
        //            if ($scope.asset.PurchasingLevel == "3") {
        //                nullifyTaxFields();
        //            }
        //                // sales center / manufacturer
        //            else if ($scope.asset.PurchasingLevel != "3") {
        //                //Tax exemption ? 
        //                if (!$scope.asset.IsTaxDeductible) {
        //                    $scope.asset.UnitNetPayable = Math.round(basePrice * 100) / 100;
        //                    $scope.asset.UnitTotalPayable = Math.round(basePrice * $scope.asset.Quantity * 100) / 100;
        //                }
        //                else if ($scope.asset.IsTaxDeductible) {
        //                    if ($scope.asset.IsTaxExemption) {

        //                        basePrice = (100 * unitPrice) / (100 + $scope.vatPercentage);
        //                        if ($scope.asset.Mushak11Radio) $scope.asset.UnitNetPayable = Math.round(unitPrice);
        //                        if (!$scope.asset.Mushak11Radio) $scope.asset.UnitNetPayable = Math.round(basePrice);
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);

        //                        $scope.asset.TaxAmount = 0;
        //                        $scope.asset.TaxAmountView = 0;
        //                    } else if (!$scope.asset.IsTaxExemption) {

        //                        basePrice = (100 * unitPrice) / (100 + $scope.vatPercentage);
        //                        if (!$scope.asset.Mushak11Radio)
        //                            $scope.asset.UnitNetPayable = Math.round((basePrice - (basePrice * $scope.taxPercentage / 100)) * 100) / 100;
        //                        if ($scope.asset.Mushak11Radio)
        //                            $scope.asset.UnitNetPayable = Math.round((unitPrice - (basePrice * $scope.taxPercentage / 100)) * 100) / 100;
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;
        //                        $scope.asset.TaxAmount = Math.round((basePrice * $scope.taxPercentage / 100) * 100) / 100;
        //                        $scope.asset.TaxAmountView = Math.round((basePrice * $scope.taxPercentage / 100) * 100) / 100;
        //                    }
        //                }
        //            }
        //        }
        //    }
        //}


        //$scope.UpdateTotalPrice = function () {

        //    $scope.asset.UnitBillingPrice = Math.round($scope.asset.BillingPrice / $scope.asset.Quantity);

        //    if (!$scope.ShowLocalSalesOption) $scope.asset.PurchasingLevel = "0";
        //    var unitPrice = $scope.asset.BillingPrice / $scope.asset.Quantity;
        //    var basePrice = 0;

        //    //check if in vat/tax mapping list ? No :
        //    if ($scope.asset.VatCategoryId == -1) {
        //        nullifyVatFields();
        //    }

        //    if ($scope.asset.TaxCategoryId == -1) {
        //        nullifyTaxFields();
        //    }

        //    //update this fun.
        //    if ($scope.asset.VatCategoryId == -1 || $scope.asset.TaxCategoryId == -1) {
        //        $scope.asset.UnitNetPayable = basePrice;
        //        $scope.asset.UnitTotalPayable = basePrice * $scope.asset.Quantity;
        //    }

        //    //check if in vat/tax mapping list ? Yes :
        //    if ($scope.asset.VatCategoryId > -1) {
        //        //if the item is furniture & fixture 
        //        if ($scope.ShowLocalSalesOption) {
        //            //Local
        //            if ($scope.asset.PurchasingLevel == "1") {
        //                nullifyVatFields();
        //            }
        //                // sales center / manufacturer
        //            else if ($scope.asset.PurchasingLevel != "1") {
        //                //Vat exemption ? 
        //                if ($scope.asset.IsVatExemption) {
        //                    nullifyVatFields();
        //                    $scope.asset.VatAmount = 0;
        //                    $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                    basePrice = unitPrice;
        //                    $scope.asset.UnitNetPayable = basePrice - (basePrice * $scope.taxPercentage / 100);
        //                    $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);
        //                } else if (!$scope.asset.IsVatExemption) {
        //                    if (!$scope.asset.IsVatDeductible) {
        //                        basePrice = unitPrice;
        //                        $scope.asset.VatAmount = 0;
        //                        $scope.asset.UnitNetPayable = basePrice - (basePrice * $scope.taxPercentage / 100);
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);
        //                    }
        //                    else if ($scope.asset.IsVatDeductible) {
        //                        if ($scope.asset.Mushak11Radio) {
        //                            basePrice = unitPrice;
        //                            $scope.asset.VatAmount = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                            $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                            $scope.asset.UnitNetPayable = basePrice - (basePrice * $scope.taxPercentage / 100);
        //                            $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);
        //                        }
        //                        else if (!$scope.asset.Mushak11Radio) {
        //                            basePrice = unitPrice - (unitPrice * $scope.vatPercentage / 100);
        //                            $scope.asset.VatAmount = unitPrice * $scope.vatPercentage / 100;
        //                            $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100));
        //                            $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //            //items other than furniture & fixture
        //        else if (!$scope.ShowLocalSalesOption) {
        //            //Vat exemption ? 
        //            if ($scope.asset.IsVatExemption) {
        //                nullifyVatFields();
        //                $scope.asset.VatAmount = 0;
        //                $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                basePrice = unitPrice;
        //                $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100));
        //                $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);
        //            } else if (!$scope.asset.IsVatExemption) {
        //                if (!$scope.asset.IsVatDeductible) {
        //                    basePrice = unitPrice;
        //                    $scope.asset.VatAmount = 0;
        //                }
        //                else if ($scope.asset.IsVatDeductible) {
        //                    if ($scope.asset.Mushak11Radio) {
        //                        basePrice = unitPrice;
        //                        $scope.asset.VatAmount = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                        $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                        $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100));
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);
        //                    }
        //                    else if (!$scope.asset.Mushak11Radio) {
        //                        basePrice = unitPrice - (unitPrice * $scope.vatPercentage / 100);
        //                        $scope.asset.VatAmount = unitPrice * $scope.vatPercentage / 100;
        //                        $scope.asset.VatAmountView = Math.round(unitPrice * $scope.vatPercentage / 100);
        //                        $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100));
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);
        //                    }
        //                }
        //            }
        //        }

        //    }
        //    if ($scope.asset.TaxCategoryId > -1) {
        //        if ($scope.ShowLocalSalesOption) {
        //            //Local
        //            if ($scope.asset.PurchasingLevel == "3") {
        //                nullifyTaxFields();
        //            }
        //                // sales center / manufacturer
        //            else if ($scope.asset.PurchasingLevel != "3") {
        //                //Vat exemption ? 
        //                if ($scope.asset.IsTaxExemption) {
        //                    nullifyTaxFields();
        //                    $scope.asset.UnitNetPayable = Math.round(basePrice);
        //                    $scope.asset.UnitTotalPayable = Math.round(basePrice * $scope.asset.Quantity);
        //                } else if (!$scope.asset.IsTaxExemption) {
        //                    $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100));
        //                    $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);
        //                    $scope.asset.TaxAmount = Math.round(basePrice * $scope.taxPercentage / 100);
        //                    $scope.asset.TaxAmountView = Math.round(basePrice * $scope.taxPercentage / 100);
        //                    //$scope.asset.IsTaxDeductible = 1;

        //                }
        //            }
        //        }
        //            // item other than furniture fixture
        //        else if (!$scope.ShowLocalSalesOption) {
        //            //Local
        //            if ($scope.asset.PurchasingLevel == "3") {
        //                nullifyTaxFields();
        //            }
        //                // sales center / manufacturer
        //            else if ($scope.asset.PurchasingLevel != "3") {
        //                //Vat exemption ? 
        //                if (!$scope.asset.IsTaxDeductible) {
        //                    $scope.asset.UnitNetPayable = Math.round(basePrice);
        //                    $scope.asset.UnitTotalPayable = Math.round(basePrice * $scope.asset.Quantity);
        //                }
        //                else if ($scope.asset.IsTaxDeductible) {
        //                    if ($scope.asset.IsTaxExemption) {
        //                        $scope.asset.UnitNetPayable = Math.round(basePrice);
        //                        $scope.asset.UnitTotalPayable = Math.round(basePrice * $scope.asset.Quantity);
        //                        $scope.asset.TaxAmount = 0;
        //                        $scope.asset.TaxAmountView = Math.round(basePrice * $scope.taxPercentage / 100);
        //                    } else if (!$scope.asset.IsTaxExemption) {
        //                        $scope.asset.UnitNetPayable = Math.round(basePrice - (basePrice * $scope.taxPercentage / 100));
        //                        $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity);
        //                        $scope.asset.TaxAmount = Math.round(basePrice * $scope.taxPercentage / 100);
        //                        $scope.asset.TaxAmountView = Math.round(basePrice * $scope.taxPercentage / 100);
        //                    }
        //                }
        //            }
        //        }
        //    }
        //}



        $scope.transfer = function () {
            //$scope.openCommandTab(,,2056);
        }

        $scope.checkIfAssetIsTransfered = function (assetId) {
            assetTransferReceiveService.getTransferReceiveHistory(assetId).then(function (response) {
                $scope.assetData = response.data;
                if ($scope.assetData.length > 0) {
                    var receivedList = $scope.assetData.filter(a => a.TransferStatus == $rootScope.AssetConfig.AssetTransferStatus.TransferAccept);
                    if (receivedList.length > 0) {
                        var lastReceived = receivedList[receivedList.length - 1];
                        if (lastReceived.TransferredOfficeType==$rootScope.AssetConfig.OfficeType.Branch && $rootScope.user.Role != $rootScope.UserRole.Admin) //>0 =>Branch Office 
                            return true;
                    }
                    //for (var asset = 0; asset < $scope.assetData.length; asset++) {
                    //    if ($scope.assetData[asset].ReceivingBranchWorkingDate != null && ($rootScope.user.Role != $rootScope.UserRole.Admin)) {
                    //        swal("Operation on transferred asset can only be done by admin.");
                    //        //$timeout(function () {
                    //        //    $('#saveComplete').modal('hide');
                    //        //    $('.modal-backdrop').remove();
                    //        //}, 500);
                    //        //$scope.execRemoveTab($scope.tab);
                    //        return true;
                    //    }
                    //}
                }

                return false;
            });
        }


        $scope.editAssetEntry = function () {
            $scope.asset.Id = $scope.editAssetId;
            $scope.asset.billingPriceAmountChanged =
                $scope.asset.BillingPrice - initialBillingPrice; 
            //if ($scope.checkIfAssetIsTransfered($scope.asset.Id)) {
                
            //}

            if ($scope.subStatusFirstTime != 2 && $scope.asset.SubStatus == "2") {
                swal("Asset can not be moved to in transit");
                return;
            }

            if ($scope.savedAsset.Status == $rootScope.AssetConfig.AssetStatus.Inactive && $scope.asset.Status == $rootScope.AssetConfig.AssetStatus.Inactive) {
                swal("Inactive asset can't be edited without change status to Active.");
                return;
            }
            if ($scope.asset.BillingPrice < 1) {
                swal("please enter Billing price");
                return;
            }

            if ($rootScope.user.Role == $rootScope.UserRole.BM && moment($scope.asset.PurchaseWorkingDate).format() != moment($rootScope.workingdate).format()) {
                swal("BM User cannot Update Backdated created Asset");
                return;
            }

            if ($scope.savedAsset.SubStatus == $rootScope.AssetConfig.AssetSubStatus.Intransit) {
                swal("In Transit Asset Cannot be Updated");
                return;
            }

            $scope.asset.PaymentDate = $scope.DateToInt($scope.asset.PurchaseWorkingDate);
            $scope.asset.PaymentWorkingDate = $scope.DateToInt($scope.asset.BranchWorkingDate);

            //if (!$scope.asset.IsVatIncluded) $scope.asset.VatAmount = 0;

            $scope.asset.CurrentBranchId = $scope.asset.LocationOfficeId;
            var imageToDelete = [];
            //$scope.files = $scope.assetImage.concat($scope.invoiceimage, $scope.paychequeImage, $scope.POimage);
            //typeof $scope.assetImage.name == 'string' is for checking if the object is file
            if (typeof $scope.assetImage.name == 'string') { $scope.files.push($scope.assetImage); if ($scope.OldAssetImage.length > 0) imageToDelete.push($scope.OldAssetImage[0].Id) }
            if (typeof $scope.invoiceimage.name == 'string') { $scope.files.push($scope.invoiceimage); if ($scope.OldinvoiceDoc.length > 0) imageToDelete.push($scope.OldinvoiceDoc[0].Id) }
            if (typeof $scope.paychequeImage.name == 'string') { $scope.files.push($scope.paychequeImage); if ($scope.OldPO.length > 0) imageToDelete.push($scope.OldPO[0].Id) }
            if (typeof $scope.POimage.name == 'string') { $scope.files.push($scope.POimage); if ($scope.OldPaycheck.length > 0) imageToDelete.push($scope.OldPaycheck[0].Id) }

            $scope.asset.User = $rootScope.user.UserId;
            if (!$scope.IsCheque) {
                $scope.asset.BankAccount = null;
                $scope.asset.ChequeNo = null;
                $scope.asset.ChequeDate = null;

            }
            if ($scope.IsCheque && (!$scope.asset.BankAccount || !$scope.asset.ChequeNo || !$scope.asset.ChequeDate)) {
                swal("Please add cheque informations : Bank Account, Cheque No , Cheque Date");
                return;
            }
            assetTransferReceiveService.getTransferReceiveHistory($scope.asset.Id).then(function (response) {
                $scope.assetData = response.data;
                if ($scope.assetData.length > 0) {
                    var receivedList = $scope.assetData.filter(a => a.TransferStatus == $rootScope.AssetConfig.AssetTransferStatus.TransferAccept);
                    if (receivedList.length > 0) {
                        var lastReceived = receivedList[receivedList.length - 1];
                        if (lastReceived.TransferredOfficeType == $rootScope.AssetConfig.OfficeType.Branch && $rootScope.user.Role != $rootScope.UserRole.Admin) //>0 =>Branch Office 
                        {
                            swal("This Asset has received from another Branch. Only Admin is allowed to Edit it!");
                            return;
                        }
                    }
                }
                swal({
                    title: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.AssetEntry),
                    showCancelButton: true,
                    confirmButtonText: "Yes, Update it!",
                    cancelButtonText: "No, cancel !",
                    type: "info",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                },
                function (isConfirmed) {
                    if (isConfirmed) {


                        //all dates must be formatted before submitting
                        //asset.PurchaseOrderDate
                        //asset.PurchaseWorkingDate
                        //asset.ChalanDate
                        //asset.InvoiceDate
                        //asset.WarrantyExpireDate


                        $scope.asset.PurchaseWorkingDate = moment($scope.asset.PurchaseWorkingDate).format();
                        if ($scope.asset.ExpiryDate) $scope.asset.ExpiryDate = moment($scope.asset.ExpiryDate).format();
                        if ($scope.asset.WarrantyExpireDate) $scope.asset.WarrantyExpireDate = moment($scope.asset.WarrantyExpireDate).format();
                        if ($scope.asset.ChequeDate) $scope.asset.ChequeDate = moment($scope.asset.ChequeDate).format();
                        if ($scope.asset.ChalanDate) $scope.asset.ChalanDate = moment($scope.asset.ChalanDate).format();
                        if ($scope.asset.PurchaseOrderDate) $scope.asset.PurchaseOrderDate = moment($scope.asset.PurchaseOrderDate).format();
                        if ($scope.asset.InvoiceDate) $scope.asset.InvoiceDate = moment($scope.asset.InvoiceDate).format();
                        if ($scope.asset.IsFixedAsset == "Fixed") $scope.asset.IsFixedAsset = 1;
                        else $scope.asset.IsFixedAsset = 0;
                        if ($scope.asset.Status != $scope.savedAsset.Status) $scope.asset.IsStatusChanged = true;
                        $scope.asset.BranchWorkingDateD = moment($rootScope.workingdate).format("YYYY-MM-DD");
                        if ($scope.files.length > 0) {
                            documentService.uploadAsset($scope.files, $rootScope.user.UserId,
                                    $scope.assetImage != null ? $scope.assetImage.name : "",
                                    $scope.invoiceimage != null ? $scope.invoiceimage.name : "",
                                    $scope.POimage != null ? $scope.POimage.name : "",
                                    $scope.paychequeImage != null ? $scope.paychequeImage.name : "")
                                .then(function (res) {
                                    if (res.data.Success) {
                                       
                                        assetEntryService.edit($scope.asset).then(function (response) {
                                            if (response.data.Success) {
                                                $scope.assetDocuments.asset = response.data.Entity;
                                                $scope.assetDocuments.documents = res.data.documentIdList;
                                                $scope.assetDocuments.imageToDelete = imageToDelete;
                                                assetEntryService.addAssetDocuments($scope.assetDocuments).then(function (r) {
                                                    if (r.data.Success) {
                                                        $rootScope.$broadcast('asset-edit-finished');
                                                        swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.AssetEntry), "Successful!", "success");
                                                        $scope.clearAndCloseTab();
                                                    } else swal($rootScope.showMessage($rootScope.editError, $rootScope.AssetEntry), response.data.Message, "error");
                                                });

                                            } else swal($rootScope.showMessage($rootScope.editError, $rootScope.AssetEntry), response.data.Message, "error");
                                        });
                                    } else {
                                        $scope.uploadError = true;
                                        //Implement It 
                                        //assetEntryService.deleteAsset(response.data.Entity.Id);
                                        swal($rootScope.docAddError, "File is not Uploaded", "error");
                                    }
                                });
                        } else {
                            assetEntryService.edit($scope.asset).then(function (response) {
                                if (response.data.Success) {
                                    $rootScope.$broadcast('asset-edit-finished');
                                    swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.AssetEntry), "Successful!", "success");
                                    $scope.clearAndCloseTab();
                                } else swal($rootScope.showMessage($rootScope.editError, $rootScope.AssetEntry), response.data.Message, "error");
                            });
                        }
                    } else {
                        swal("Cancelled", "something is wrong", "error");
                    }
                });
            });
            
        }

        $scope.clearAndCloseTab = function () {
            $scope.asset = {};
            //$timeout(function() {
            $('#saveComplete').modal('hide');
            $('.modal-backdrop').remove();
            // }, 500);
            $scope.execRemoveTab($scope.tab);
        };


        $scope.segregateFile = function () {

            $scope.AssetImage = $scope.uploadedFiles.filter(f => f.Category === $rootScope.FileCategory.ASSET_IMAGE);
            $scope.OldAssetImage = angular.copy($scope.AssetImage);
            $scope.invoiceDoc = $scope.uploadedFiles.filter(f => f.Category === $rootScope.FileCategory.INVOICE_IMAGE);
            $scope.OldinvoiceDoc = angular.copy($scope.invoiceDoc);
            $scope.PO = $scope.uploadedFiles.filter(f => f.Category === $rootScope.FileCategory.PO_IMAGE);
            $scope.OldPO = angular.copy($scope.PO);
            $scope.Paycheck = $scope.uploadedFiles.filter(f => f.Category === $rootScope.FileCategory.PO_IMAGE);
            $scope.OldPaycheck = angular.copy($scope.Paycheck);
        }

        $scope.assetImageUpload = function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageType = file.type.split('/')[1];
                if (imageType !== 'jpeg' && imageType !== 'jpg') {
                    swal("Image format jpg and jpeg are allowed");
                    return;
                }
                //if (file.size > (1024 * 100)) {
                //    swal("Image size is greater than 100 kb is not allowed");
                //    return;
                //}
                $scope.assetImage = file;
                $scope.AssetImage[0] = file;
                $scope.AssetImage[0].Name = $scope.AssetImage[0].name;
                $scope.AssetImage[0].Size = $scope.AssetImage[0].size;
                //move in config
                $scope.assetImage.Category = $rootScope.FileCategory.ASSET_IMAGE;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }

        $scope.invoiceImageUpload = function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageType = file.type.split('/')[1];
                if (imageType !== 'jpeg' && imageType !== 'jpg') {
                    swal("Image format jpg and jpeg are allowed");
                    return;
                }
                //if (file.size > (1024 * 100)) {
                //    swal("Image size is greater than 100 kb is not allowed");
                //    return;
                //}
                $scope.invoiceimage = file;
                $scope.invoiceDoc[0] = file;
                $scope.invoiceDoc[0].Name = file.name;
                $scope.invoiceDoc[0].Size = file.size;
                //move in config
                $scope.invoiceimage.Category = $rootScope.FileCategory.INVOICE_IMAGE;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }
        $scope.poImageUpload = function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageType = file.type.split('/')[1];
                if (imageType !== 'jpeg' && imageType !== 'jpg') {
                    swal("Image format jpg and jpeg are allowed");
                    return;
                }
                //if (file.size > (1024 * 100)) {
                //    swal("Image size is greater than 100 kb is not allowed");
                //    return;
                //}
                $scope.POimage = file;
                $scope.PO[0] = file;
                $scope.PO[0].Name = file.name;
                $scope.PO[0].Size = file.size;
                //move in config
                $scope.POimage.Category = $rootScope.FileCategory.PO_IMAGE;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }
        $scope.paychequeImageUpload = function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageType = file.type.split('/')[1];
                if (imageType !== 'jpeg' && imageType !== 'jpg') {
                    swal("Image format jpg and jpeg are allowed");
                    return;
                }
                //if (file.size > (1024 * 100)) {
                //    swal("Image size is greater than 100 kb is not allowed");
                //    return;
                //}
                $scope.paychequeImage = file;
                $scope.Paycheck[0] = file;
                $scope.Paycheck[0].Name = file.name;
                $scope.Paycheck[0].Size = file.size;
                //$scope.paychequeImage[0].Name = file.name;
                //move in config
                $scope.paychequeImage.Category = $rootScope.FileCategory.PAYCHEQUE_IMAGE;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }

        $scope.getAssetFiles = function () {
            documentService.getAssetFilesbyEntity($scope.editAssetId).then(function (response) {
                $scope.uploadedFiles = response.data;
                //$rootScope.memberFileHash = response.data && response.data.length > 0 ? response.data[0].Hash : '';
                $scope.segregateFile();

            }, AMMS.handleServiceError);
        };

        $scope.assetStatusChange = function () {
            if ($scope.asset.Status == $rootScope.AssetConfig.AssetStatus.Active) {
                $scope.filters.subStatusList =
                    $scope.flagListMain.filter(f => f.Value == $rootScope.AssetConfig.AssetSubStatus.Inuse ||
                    f.Value == $rootScope.AssetConfig.AssetSubStatus.InStock ||
                    f.Value == $rootScope.AssetConfig.AssetSubStatus.Reserved ||
                    f.Value == $rootScope.AssetConfig.AssetSubStatus.InMaintence ||
                    f.Value == $rootScope.AssetConfig.AssetSubStatus.Intransit);
            } else if ($scope.asset.Status == $rootScope.AssetConfig.AssetStatus.Inactive) {
                $scope.filters.subStatusList =
                    $scope.flagListMain.filter(f => f.Value == $rootScope.AssetConfig.AssetSubStatus.Disposed ||
                    f.Value == $rootScope.AssetConfig.AssetSubStatus.Sold ||
                    f.Value == $rootScope.AssetConfig.AssetSubStatus.Donate ||
                    f.Value == $rootScope.AssetConfig.AssetSubStatus.Lost ||
                    f.Value == $rootScope.AssetConfig.AssetSubStatus.Scrapped ||
                    f.Value == $rootScope.AssetConfig.AssetSubStatus.Stolen);
            } else if ($scope.asset.Status == $rootScope.AssetConfig.AssetStatus.Deleted) {
                $scope.filterParams.SubStatusList = $scope.flagListMain.filter(f => f.Value == $rootScope.AssetConfig.AssetSubStatus.Disposed || f.Value == $rootScope.AssetConfig.AssetSubStatus.Deleted);
            }
        }


        $scope.init = function () {
            $scope.filters.purchaseMethodList = [{ Name: "Cash", Value: 1 }, { Name: "Cheque", Value: 2 }];
            $scope.GetFilters();
            //$scope.getAssetById();
            $scope.getAssetFiles();
            //$scope.filterOfficeList();
            //$rootScope.assetIdToTransfer = $scope.editAssetId;
            console.log($scope.tab.Id);
            console.log($scope.command);
            console.log($rootScope.workingdate);
            $scope.commandList = [];
            $scope.editID = angular.copy($rootScope.editAssetId);
            //$scope.getCommands();
            //$scope.asset.IsTaxDeductible = 1;
            //$scope.asset.IsVatDeductible = 1;
            //$scope.asset.IsSalesCentre = true;
            //$scope.asset.IsTaxExemption = false;
            $scope.vatPercentage = 0;
            $scope.salesCenterVat = 0;
            $scope.manufacturerVat = 0;
            $scope.taxPercentage = 0;
            $scope.asset.Mushak11Radio = true;
            $scope.showTaxExemption = true;
        }
        $scope.init();

        $scope.$on('tab-switched', function () {
            if ($scope.editID !== $rootScope.editAssetId) {
                $scope.init();
            }
        });

        $scope.popupEntryDate = {
            opened: false
        };
        $scope.openEntryDate = function () {
            $scope.popupEntryDate.opened = true;
        };
        $scope.popupWarrentyDate = {
            opened: false
        };
        $scope.openWarrentyDate = function () {
            $scope.popupWarrentyDate.opened = true;
        };
        $scope.popupExpiryDate = {
            opened: false
        };
        $scope.openExpiryDate = function () {
            $scope.popupExpiryDate.opened = true;
        };
        $scope.popupPurchaseOrderDate = {
            opened: false
        };
        $scope.openPurchaseOrderDate = function () {
            $scope.popupPurchaseOrderDate.opened = true;
        };
        $scope.popupChalanDate = {
            opened: false
        };
        $scope.openChalanDate = function () {
            $scope.popupChalanDate.opened = true;
        };

        $scope.popupInvoiceDate = {
            opened: false
        };
        $scope.openInvoiceDate = function () {
            $scope.popupInvoiceDate.opened = true;
        };

        $scope.popupChequeDate = {
            opened: false
        };
        $scope.openChequeDate = function () {
            $scope.popupChequeDate.opened = true;
        };

        $scope.popupDisposalDate = {
            opened: false
        };
        $scope.popupDisposalDate = function () {
            $scope.popupChequeDate.opened = true;
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
              mode = data.mode;

            return (mode === 'day' && (date.getDay() === 5))
                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.RM
                && (moment(date) > moment(new Date($rootScope.workingdate)).add(1, 'days'))
                && (moment(date) < moment(new Date($rootScope.workingdate)).add(30, 'days')))
                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.DM
                && (moment(date) > moment(new Date($rootScope.workingdate)).add(1, 'days'))
                && (moment(date) < moment(new Date($rootScope.workingdate)).add(90, 'days')))
                || ($rootScope.selectedBranchId < 0 &&
                (moment(date) > moment(new Date())));

        }

        function disableDisposalDate(data) {
            console.log(data);
        }
        $scope.dateOptionsDisposalDate = {
            dateDisabled: disabled,
            initDate: new Date($rootScope.workingdate),
            formatYear: 'yyyy',
            minDate: new Date(1, 1, 1991),
            maxDate: new Date($rootScope.workingdate),
            startingDay: 1,
            showWeeks: false
        }
        $scope.dateOptions = {
            dateDisabled: disabled,
            initDate: new Date($rootScope.workingdate),
            formatYear: 'yy',
            //maxDate: new Date(2099, 5, 22),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1,
            showWeeks: false
        };

        function dateOptionsWithPreviousDate(data) {
            var date = data.date,
              mode = data.mode;

            return (mode === 'day' && (date.getDay() === 5))
                || ($rootScope.selectedBranchId > 0
                && (moment(date) > moment(new Date($scope.asset.PurchaseWorkingDate))))
                || ($rootScope.selectedBranchId < 0 &&
                (moment(date) > moment(new Date($scope.asset.PurchaseWorkingDate))));
        }

        $scope.dateOptionsWithPreviousDate = {
            initDate: new Date($rootScope.workingdate),
            dateDisabled: dateOptionsWithPreviousDate,
            formatYear: 'yy',
            //maxDate: new Date(2099, 5, 22),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1,
            showWeeks: false
        };

        function dateOptionsWithFutureDate(data) {
            var date = data.date,
              mode = data.mode;

            return (mode === 'day' && (date.getDay() === 5))
                ||
                (moment(date) < moment(new Date($scope.asset.PurchaseWorkingDate)));
        }

        $scope.dateOptionsWithFutureDate = {
            initDate: new Date($rootScope.workingdate),
            dateDisabled: dateOptionsWithFutureDate,
            formatYear: 'yy',
            //maxDate: new Date(2099, 5, 22),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1,
            showWeeks: false
        };

        function dateOptionsWithAllDate(data) {
            var date = data.date,
              mode = data.mode;

            return (mode === 'day' && (date.getDay() === 5));
        }

        $scope.dateOptionsWithAllDate = {
            initDate: new Date($rootScope.workingdate),
            dateDisabled: dateOptionsWithAllDate,
            formatYear: 'yy',
            //maxDate: new Date(2099, 5, 22),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 6,
            showWeeks: false
        };


        $scope.changeEntryDate = function () {
            $scope.asset.InvoiceDate = $scope.asset.PurchaseWorkingDate;
        }
        $scope.expirydateOptions = {
            initDate: new Date($rootScope.workingdate),
            dateDisabled: dateOptionsWithFutureDate,
            formatYear: 'yy',
            //maxDate: new Date(2099, 5, 22),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1,
            showWeeks: false
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.docSizeBoolChecker = function () {
            $scope.AssetfileSize = 0;
            $scope.AssetImage.forEach(function (file) {
                $scope.AssetfileSize += file.size;
                if ($scope.AssetfileSize > (1024 * 1024) * ($rootScope.documentSize)) {
                    $scope.docError = true;
                    return;

                } else {
                    $scope.docError = false;
                }

            });
            $scope.invoiceDoc.forEach(function (file) {
                $scope.invoicefileSize = 0;
                $scope.invoicefileSize += file.size;
                if ($scope.invoicefileSize > (1024 * 1024) * ($rootScope.documentSize)) {
                    $scope.docError = true;
                    return;

                } else {
                    $scope.docError = false;
                }

            });
            $scope.PO.forEach(function (file) {
                $scope.POfileSize = 0;
                $scope.POfileSize += file.size;
                if ($scope.POfileSize > (1024 * 1024) * ($rootScope.documentSize)) {
                    $scope.docError = true;
                    return;

                } else {
                    $scope.docError = false;
                }
            });
            $scope.Paycheck.forEach(function (file) {
                $scope.PCfileSize = 0;
                $scope.PCfileSize += file.size;
                if ($scope.PCfileSize > (1024 * 1024) * ($rootScope.documentSize)) {
                    $scope.docError = true;
                    return;

                } else {
                    $scope.docError = false;
                }
            });
        }

        $scope.removefile = function (file, files, propertyName) {
            var value = file.name;
            var i = AMMS.findWithAttr(files, propertyName, value);
            files.splice(i, 1);
            $scope.docSizeBoolChecker();
        }
        //}
        //]);
        $scope.popupDisposalDate = {
            opened: false
        };
        $scope.openDisposalDatePopup = function () {
            $scope.popupDisposalDate.opened = true;
        };
        $scope.popupDisposalDateM = {
            opened: false
        };
        $scope.openDisposalDatePopupM = function () {
            $scope.popupDisposalDateM.opened = true;
        };

        $scope.disposalAssetAdditionalFilter = function () {
            assetDisposalService.GetAdditinalFilters($scope.savedAsset.Id).then(function (response) {
                $scope.disposalTypeList = angular.copy(response.data.disposalTypeList);
                $scope.transactionProcessList = angular.copy(response.data.transactionProcessList);
                $scope.getBankAccountList();
                //$scope.bankAccountListMain = angular.copy(response.data.bankAccountList);
                //$scope.bankAccountList = $scope.bankAccountListMain.filter(b => b.RelationalValue == $rootScope.selectedBranchId);
            });
        }
        $scope.getDisposalByAssetId = function () {
            assetDisposalService.getDisposalByAssetId($scope.savedAsset.Id).then(function (response) {
                $scope.assetToDispose = angular.copy(response.data);
                $scope.assetToDispose.DisposalDate = new Date(moment($scope.assetToDispose.DisposalDate).format("YYYY-MM-DD"));
                $scope.assetToDispose.DisposalDateS = $scope.assetToDispose.DisposalDate ? moment($scope.assetToDispose.DisposalDate).format("YYYY-MM-DD") : null;
                $scope.assetToDispose.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                $scope.assetToDispose.DisposalWithdrawlBranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                $scope.assetToDispose.DisposalWithdrawlBy = $rootScope.user.UserId;
                $scope.assetToDispose.BranchBankAccountId = parseInt($scope.assetToDispose.BranchBankAccountId);
                console.log($scope.assetToDispose);
            });
        }

        $scope.dateOptionsPurchaseDate = {
            formatYear: 'yyyy',
            //maxDate: new Date(2099, 5, 22),
            // maxDate: new Date($rootScope.workingdate),
            startingDay: 1,
            initDate: new Date($rootScope.workingdate),
            showWeeks: false
        }

        $scope.disposeAssetInit = function () {
            //if ($scope.savedAsset.SubStaus == $rootScope.AssetConfig.AssetSubStatus.Intransit) {
            //    {
            //        swal("Asset is in transit. Derecognize operation can't be done");
            //        $scope.clearAndCloseTab();
            //    }
            //}
            $scope.disposalAssetAdditionalFilter();
            $scope.assetToDispose = {};
            $scope.disposalTypeList = [];
            if ($scope.savedAsset.Status == $rootScope.AssetConfig.AssetStatus.Active) {
                $scope.assetToDispose.AssetId = $scope.asset.Id;
                $scope.assetToDispose.DisposalDate = $scope.assetToDispose.DisposalDate ? new Date(moment($scope.assetToDispose.DisposalDate).format("YYYY-MM-DD")) : new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
                $scope.assetToDispose.DisposalDateS = $scope.assetToDispose.DisposalDate ? new Date(moment($scope.assetToDispose.DisposalDate).format("YYYY-MM-DD")) : null;
                $scope.assetToDispose.DisposalByUserId = $rootScope.user.UserId;
                $scope.assetToDispose.DisposalBranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                $scope.assetToDispose.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                $scope.assetToDispose.DisposalOfficeBranchId = $rootScope.selectedBranchId;
                $scope.assetToDispose.CurrentWrittenDownValue =$scope.savedAsset.WrittenDownValue;
                $scope.assetToDispose.CurrentWrittenDownValueToShow = $scope.savedAsset.WrittenDownValue.toFixed(2);
            } else {
                $scope.getDisposalByAssetId();
            }

        }
        $scope.getWrittenDownValueByDisposalDate = function () {
            if ($scope.assetToDispose.DisposalType) {
                assetDisposalService.getWrittenDownValueByDisposalDate($scope.assetToDispose.AssetId, moment($scope.assetToDispose.DisposalDate).format("YYYY-MM-DD"), $scope.assetToDispose.BranchWorkingDate).then(function (response) {
                    $scope.assetToDispose.WrittenDownValue = response.data;
                    $scope.assetToDispose.WrittenDownValueToShow = response.data.toFixed(2);
                    $scope.assetToDispose.Amount = response.data.toFixed(2);
                });
            }
        }
        $scope.disposeTypeChange = function () {
            if ($scope.assetToDispose.DisposalType != $rootScope.AssetConfig.AssetDisposalType.Sold)
                $scope.assetToDispose.Amount = 0;
            else
                $scope.assetToDispose.Amount = $scope.asset.WrittenDownValue.toFixed(2);
        }
        $scope.disposeAsset = function () {
            var workingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var disposeDate = moment($scope.assetToDispose.DisposalDate).format("YYYY-MM-DD");
            var dayDifference = moment(workingDate).diff(moment(disposeDate), 'days');
            if ($rootScope.user.Role == $rootScope.UserRole.BM && dayDifference!=0) {
                swal("BM can derecognize asset only on current working date");
                return;
            }
            else if ($rootScope.user.Role == $rootScope.UserRole.DM && dayDifference > 90) {
                swal("DM can derecognize asset upto 90 days from current working date");
                return;
            } else if ($rootScope.user.Role == $rootScope.UserRole.LO || $rootScope.user.Role == $rootScope.UserRole.ZM || $rootScope.user.Role == $rootScope.UserRole.ABM) {
                swal("You are not allowed to derecognize asset.");
                return;
            }
            if ($scope.savedAsset.Status != $rootScope.AssetConfig.AssetStatus.Active) {
                swal("Asset is inactive. Derecognize operation can't be done");
                return;
            }

            if ($scope.savedAsset.SubStatus == $rootScope.AssetConfig.AssetSubStatus.Intransit) {
                swal("Asset is intransit. Derecognize operation can't be done");
                return;
            }
            if (!$scope.savedAsset.IsFixedAsset) {
                swal("Asset is not fixed asset. Derecognize operation can't be done");
                return;
            }
            if (!$scope.assetToDispose.DisposalDate) {
                swal("Please select derecognize date");
                return;
            }
            if (!$scope.assetToDispose.DisposalType) {
                swal("Please select derecognize type");
                return;
            }
            if ($scope.assetToDispose.DisposalType == $rootScope.AssetConfig.AssetDisposalType.Sold) {
                if (!$scope.assetToDispose.PaymentMethod) {
                    if (!$scope.assetToDispose.BranchBankAccountId) {
                        swal("Please select Payment Method");
                        return;
                    }
                }
                if ($scope.assetToDispose.PaymentMethod == $rootScope.PaymentMethod.Cheque) {
                    if (!$scope.assetToDispose.BranchBankAccountId) {
                        swal("Please select Bank Account");
                        return;
                    }
                    if (!$scope.assetToDispose.ChequeNumber) {
                        swal("Please enter cheque number");
                        return;
                    }
                }
            } 
            swal({
                title: "Confirm?",
                text: "Asset will be Derecognized",
                showCancelButton: true,
                confirmButtonText: "Yes, Derecognize it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
           function (isConfirmed) {
               if (isConfirmed) {
                 
                   $scope.assetToDispose.DisposalDate = new Date(moment($scope.assetToDispose.DisposalDate).format("YYYY-MM-DD"));
                   if ($scope.assetToDispose.DisposalType != $rootScope.AssetConfig.AssetDisposalType.Sold)
                       $scope.assetToDispose.BranchBankAccountId = $scope.assetToDispose.PaymentMethod = $scope.assetToDispose.ChequeNumber = $scope.assetToDispose.IsAccountPayable = null;
                   assetDisposalService.disposeAsset($scope.assetToDispose)
                       .then(function (response) {
                           if (response.data.Success) {
                               //$("#modalAssetDisposal").modal("hide");
                               $rootScope.$broadcast('asset-dispose-finished');
                               swal({
                                   title: "Asset Derecognize",
                                   text: "Asset Derecognized Successfully",
                                   type: "success"
                               },
                                    function (isConfirm) {
                                        if (isConfirm)
                                            $("#modalAssetDisposal").modal("hide");
                                        else
                                            $("#modalAssetDisposal").modal("hide");
                                    });
                           } else {
                               swal($rootScope.showMessage(window.__env.derecognizeError, $rootScope.AssetEntry), response.data.Message, "error");
                           }
                           //$scope.clearAndCloseTab();
                       });
               }
           });
        }
        $scope.reverseDisposalAsset = function () {
            swal({
                title: "Confirm?",
                text: "Asset Derecognize will be reversed",
                showCancelButton: true,
                confirmButtonText: "Yes, reverse it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
          function (isConfirmed) {
              if (isConfirmed) {
                  $scope.assetToDispose.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                  $scope.assetToDispose.DisposalWithdrawlBranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                  assetDisposalService.reverseDisposalAsset($scope.assetToDispose)
                      .then(function (response) {
                          if (response.data.Success) {
                             // $("#modalAssetDisposal").modal("hide");
                              $rootScope.$broadcast('asset-dispose-reverese-finished');
                              swal({
                                  title: "Asset Derecognize",
                                  text: "Asset Derecognize Reversed Successfully",
                                  type: "success"
                              },
                                   function (isConfirm) {
                                       if (isConfirm) {
                                           $("#modalAssetDisposal").modal("hide");
                                       } else
                                           $("#modalAssetDisposal").modal("hide");
                                   });
                          } else {
                              swal($rootScope.showMessage(window.__env.derecognizeDeleteError, $rootScope.AssetEntry), response.data.Message, "error");
                          }
                          //$scope.clearAndCloseTab();
                      });
              }
          });
        }


    }]);
