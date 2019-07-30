ammsAng.controller('inventoryEntryAddController', ['$scope', '$rootScope', 'inventoryEntryService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'documentService', 'assetTypeService', 'assetCategoryService', 'DTOptionsBuilder', 'filterService',
    function ($scope, $rootScope, inventoryEntryService, commonService, $timeout, employeeService, loanGroupService, documentService, assetTypeService, assetCategoryService, DTOptionsBuilder, filterService) {
        console.log(new Date($rootScope.workingdate));
        $scope.roleId = parseInt($rootScope.user.Role);
        console.log($scope.roleId);
        $scope.GetFilters = function () {
            inventoryEntryService.GetAdditionalFilters($rootScope.selectedBranchId, -100000).then(function (response) {
                $scope.asset.CurrentBranchId = $scope.asset.PurchaseBranchId;

                $scope.filters.supplierList = response.data.suppliers;
                $scope.filters.supplierList = $scope.filters.supplierList.filter(x=>x.RelationalValue == $rootScope.AssetConfig.AssetStatus.Active);
                //if ( .length > 0) $scope.asset.SupplierId = $scope.filters.supplierList[0].Value;
                //$scope.filters.bankAccountList = response.data.bankAccounts;
               
                $scope.filters.manufacturerList = response.data.manufacturers;
                $scope.filters.manufacturerList = $scope.filters.manufacturerList.filter(x=>x.RelationalValue == $rootScope.AssetConfig.AssetStatus.Active);
                //if ($scope.filters.manufacturerList.length > 0) $scope.asset.Manufacturer = $scope.filters.manufacturerList[0].Value;
                $scope.filters.DepartmentList = response.data.departments;
                //$scope.filters.employeeList = response.data.employees;

                if ($scope.filters.DepartmentList) {
                    if ($rootScope.selectedBranchId > 0)
                        $scope.asset.DepartmentId = 5; // field office
                    else
                        $scope.asset.DepartmentId = $scope.filters.DepartmentList[0].Value;
                }


                $scope.asset.InvoiceDate = $scope.asset.PurchaseWorkingDate;

                $scope.asset.CurrentBranch = $rootScope.selectedBranchTitle;
                $scope.getCategoryFilters();
                $scope.getBankAccountList();
            });
            $scope.getBankAccountList = function () {
                filterService.GetActiveBankAccountListByBranch($rootScope.selectedBranchId).then(function (response) {
                    $scope.filters.bankAccountList = response.data;
                });
            }


            inventoryEntryService.GetAdditionalFilters($rootScope.selectedBranchId, -100000).then(function (response) {
                $scope.filters.OfficeTypeList = response.data.PermittedOfficeLevel;
                $scope.filters.OfficeTypeListMain = angular.copy(response.data.PermittedOfficeLevel);

                if ($rootScope.user.Role == $rootScope.UserRole.BM || $rootScope.user.Role == $rootScope.UserRole.RM)
                    $scope.filters.OfficeTypeList = $scope.filters.OfficeTypeListMain.filter(o => o.Value == $rootScope.AssetConfig.OfficeType.Branch);
                if ($rootScope.user.Role == $rootScope.UserRole.ZM || $rootScope.user.Role == $rootScope.UserRole.DM)
                    $scope.filters.OfficeTypeList = $scope.filters.OfficeTypeListMain.filter(o => o.Value == $rootScope.AssetConfig.OfficeType.Branch || o.Value == $rootScope.AssetConfig.OfficeType.Division);
                if ($rootScope.user.Role == $rootScope.UserRole.Admin) {
                    $scope.filters.OfficeTypeList = $scope.filters.OfficeTypeListMain.filter(o => o.Value == $rootScope.AssetConfig.OfficeType.Branch || o.Value == $rootScope.AssetConfig.OfficeType.Division || o.Value == $rootScope.AssetConfig.OfficeType.Central);
                    $scope.filters.OfficeTypeList.push({ Name: "All", Value: "-100000" });
                }

                if ($rootScope.selectedBranchId < 1) $scope.asset.LocationOfficeType = 3;
                else $scope.asset.LocationOfficeType = 1;
                $scope.filterOfficeList($scope.asset.LocationOfficeType);
                //$scope.changeLocationOffice();
            });

            inventoryEntryService.GetFilters().then(function (response) {
                $scope.filters.statusList = response.data.AssetStatus.filter(a => a.Value == $rootScope.AssetConfig.AssetStatus.Active);
                $scope.filters.subStatusList = response.data.AssetSubStatus;
                $scope.statusListMain = response.data.AssetStatus;
                $scope.flagListMain = response.data.AssetSubStatus;
                if ($scope.filters.statusList)
                    $scope.asset.Status = $rootScope.AssetConfig.AssetStatus.Active.toString();
                if ($scope.filters.subStatusList) {
                    $scope.asset.SubStatus = $rootScope.AssetConfig.AssetSubStatus.Inuse.toString();
                    $scope.filters.subStatusList = $scope.flagListMain.filter(f => f.Value == $rootScope.AssetConfig.AssetSubStatus.Inuse
                        || f.Value == $rootScope.AssetConfig.AssetSubStatus.InStock);
                }
                $scope.filters.purchaseMethodList = response.data.AssetPaymentMethod;
                if ($scope.filters.purchaseMethodList)
                    $scope.asset.PurchaseMethod = "1";

            });
            $scope.getCategoryFilters = function () {
                inventoryEntryService.categoryFilters().then(function (response) {
                    $scope.categoryItems = angular.copy(response.data);
                    var selectedBranch = $scope.BranchList.filter(b => b.Value == $rootScope.selectedBranchId);
                    var selectedBranchOfficeType = selectedBranch ? selectedBranch[0].RelationalValue : -2;
                    $scope.categoryItems.forEach(function (c) {
                        c.CategoryItems.forEach(function (i) {
                            var permittedOfficeLevel = i.PermittedOfficeLevel.split(',');
                            var isFound = permittedOfficeLevel.indexOf(selectedBranchOfficeType.toString());
                            if (isFound != -1) {
                                $scope.ItemList.push({
                                    Name: i.Name,
                                    Value: i.Id,
                                    CategoryId: i.CategoryId,
                                    CategoryName: c.Name,
                                    IsFixed: i.IsFixedStatus
                                });
                            }
                        });

                    });
                    $scope.ItemList = $scope.ItemList.sort(function (a, b) {
                        var nameA = a.Name.toLowerCase(), nameB = b.Name.toLowerCase();
                        if (nameA < nameB)
                            return -1;
                        if (nameA > nameB)
                            return 1;
                        return 0;
                    });

                    $scope.filters.AssetTypeList = $scope.ItemList;

                    //var assetTypes = $scope.filters.AssetTypeList.filter(x=>x.);

                    //if ($scope.ItemList)  $scope.asset.ItemTypeId = $scope.ItemList[0].Value;

                    $scope.filterCategory($scope.asset.ItemTypeId);

                    if ($scope.asset.ItemTypeId !== undefined)
                        assetTypeService.getAssetItem($scope.asset.ItemTypeId).then(function (response) {
                            $scope.asset.ResidualValue = response.data.DefaultResidualValue;
                        });
                    if ($scope.asset.ItemTypeId !== undefined)
                        assetTypeService.getAssetItemDepriciation($scope.asset.ItemTypeId).then(function (response) {
                            $scope.itemDepricationList = angular.copy(response.data);
                            var res = response.data.filter(r => r.AssetItemId == $scope.asset.ItemTypeId && (moment(r.EffectiveDateFrom) >= moment($scope.asset.PurchaseWorkingDate)) && moment(r.EffectiveDateTo) <= moment($scope.asset.PurchaseWorkingDate))[0];

                            if (res != null) $scope.asset.UsefulLife = res.UsefulLife;
                            $scope.asset.ExpiryDate = new Date(moment($scope.asset.PurchaseWorkingDate).add($scope.asset.UsefulLife, 'years').add(-1, 'days'));
                        });
                });
            }
        }
        $scope.getBranchesByRoleAndBranch = function () {
            commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, $rootScope.user.Role).then(function (response) {

                $scope.BranchListMain = angular.copy(response.data);

                $scope.BranchListMain = $scope.BranchListMain.filter(function (el) {
                    return el.Value !== -100000;
                });
                $scope.BranchList = angular.copy($scope.BranchListMain);

                $scope.GetFilters();

            }, AMMS.handleServiceError);
        }
        //$scope.getBankAccountList = function () {
        //    filterService.GetActiveBankAccountListByBranch($rootScope.selectedBranchId).then(function (response) {
        //        $scope.filters.bankAccountList = response.data;
        //    });
        //}
        $scope.getVattaxInfo = function () {

            if ($scope.asset.ItemTypeId == null) {
                swal("Please Select an Item Type!");
                return;
            }
            var fiscalYear = moment(new Date($rootScope.workingdate), "DD/MM/YYYY").year();
            inventoryEntryService.getVattaxInfo($scope.asset.ItemTypeId, $scope.asset.PurchasingLevel, $rootScope.selectedBranchId, fiscalYear, $scope.asset.BillingPrice).then(function (response) {
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
                if (!$scope.ShowLocalSalesOption) $scope.asset.PurchasingLevel = "0";
                if ($scope.asset.VatCategoryId < 0 || $scope.vatPercentage === 0) $scope.asset.IsVatExemption = 1;
                //else $scope.asset.IsVatExemption = false;
                if ($scope.asset.TaxCategoryId < 0 || $scope.taxPercentage === 0) $scope.asset.IsTaxExemption = 1;
                //else $scope.asset.IsTaxExemption = false;

                $scope.UpdateTotalPrice();
            });
        }

        $scope.assetStatusChange = function () {
            if ($scope.asset.Status == $rootScope.AssetConfig.AssetStatus.Active) {
                $scope.filters.subStatusList = $scope.flagListMain.filter(f => f.Value == $rootScope.AssetConfig.AssetSubStatus.Inuse
                        || f.Value == $rootScope.AssetConfig.AssetSubStatus.InStock
                        || f.Value == $rootScope.AssetConfig.AssetSubStatus.InMaintence);
            }
            else if ($scope.asset.Status == $rootScope.AssetConfig.AssetStatus.Inactive) {
                $scope.filters.subStatusList = $scope.flagListMain.filter(f => f.Value == $rootScope.AssetConfig.AssetSubStatus.Disposed || f.Value == $rootScope.AssetConfig.AssetSubStatus.Sold
                    || f.Value == $rootScope.AssetConfig.AssetSubStatus.Donate || f.Value == $rootScope.AssetConfig.AssetSubStatus.Stolen
                    || f.Value == $rootScope.AssetConfig.AssetSubStatus.Lost || f.Value == $rootScope.AssetConfig.AssetSubStatus.Scrapped);
            } else
                $scope.filters.subStatusList = $scope.flagListMain;
        }
        $scope.UpdateExpiryDate = function () {
            $scope.asset.ExpiryDate = new Date(moment($scope.asset.PurchaseWorkingDate).add($scope.asset.UsefulLife, 'years').add(-1, 'days'));
            $scope.asset.ExpiryDate = $scope.DateToInt($scope.asset.ExpiryDate);
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


            $scope.filters.purchaseMethodList = [{ Name: "Cash", Value: 1 }, { Name: "Cheque", Value: 2 }];
            $scope.assetDocuments = {};
            $scope.assetDocuments.asset = [];
            $scope.assetDocuments.documents = [];

            $scope.files = [];
            $scope.AssetImage = [];
            $scope.assetImage = [];
            $scope.invoiceimage = [];
            $scope.POimage = [];
            $scope.paychequeImage = [];
            $scope.invoiceDoc = [];
            $scope.PO = [];
            $scope.Paycheck = [];
            $scope.asset.PurchaseMethod = 1;
            $scope.IsCheque = false;
            $scope.asset = {};
            $scope.filters = {};
            $scope.ItemList = [];



            $scope.asset.BranchWorkingDate = $rootScope.workingdateInt;
            $scope.asset.BranchWorkingDateD = $rootScope.workingdateInt;
            $scope.asset.LocationName = $rootScope.selectedBranchTitle;
            if ($rootScope.selectedBranchId < 0)
                $scope.asset.PurchaseWorkingDate = new Date(moment());
            else $scope.asset.PurchaseWorkingDate = new Date($rootScope.workingdate);

            $scope.asset.Quantity = 1;

            $scope.asset.IsTaxDeductible = 1;
            $scope.asset.IsVatDeductible = 1;
            $scope.asset.IsSalesCentre = true;
            $scope.asset.PurchasingLevel = "1";
            $scope.asset.IsTaxExemption = false;
            $scope.vatPercentage = 0;
            $scope.salesCenterVat = 0;
            $scope.manufacturerVat = 0;
            $scope.taxPercentage = 0;
            $scope.asset.Mushak11Radio = true;
            $scope.showTaxExemption = true;
            $scope.asset.IsVatExemption = 0;
            $scope.asset.IsTaxExemption = 0;
            $scope.ShowLocalSalesOption = false;
            $scope.asset.BillingPrice = 0;
            $scope.disableIsVatDeduction = false;
            $scope.asset.LocationOfficeId = $rootScope.selectedBranchId;

            $scope.asset.PurchasingLevel = "1";
            $scope.asset.AssetType = "-100000";
            $scope.getBranchesByRoleAndBranch();
        }
        initvariables();

        $scope.filterItem = function (categoryId) {
            $scope.categoryItems.forEach(function (c) {
                if (c.Id === categoryId) {
                    $scope.filterParams.ItemTypeList = c.CategoryItems;
                }
            });
            $scope.filterParams.ItemTypeId = $scope.filterParams.ItemTypeList[0].Value;
        }
        $scope.filterCategory = function (itemId) {
            $scope.ItemList.forEach(function (i) {
                if (i.Value === itemId) {
                    $scope.asset.ItemCategoryName = i.CategoryName;
                    $scope.asset.ItemCategoryId = i.CategoryId;
                    $scope.asset.IsFixedAsset = i.IsFixed ? "Fixed" : "Not Fixed";
                }
            });
            $scope.filters.typeList = [{ Name: "Non IT", Value: 0 }, { Name: "IT", Value: 1 }];
            $scope.filters.purchaseMethodList = [{ Name: "Cash", Value: 1 }, { Name: "Cheque", Value: 2 }];

            $scope.asset.PurchasingLevel = "0";

            $scope.asset.PurchaseMethod = 1;
            $scope.ChangePurchaseMethod();
            $scope.categoryItems.forEach(function (c) {
                if (c.Id === $scope.asset.ItemCategoryId) $scope.asset.AssetTypeId = c.AssetType;
            });
            if ($scope.asset.ItemTypeId) {
                inventoryEntryService.getAssettag($rootScope.selectedBranchId, $rootScope.workingdateInt, $scope.asset.ItemTypeId).then(function (response) {
                    $scope.asset.InventoryId = response.data; 
                    //$rootScope.selectedbranchId
                });
            }
            if ($scope.asset.ItemTypeId !== undefined)
                assetTypeService.getAssetItem($scope.asset.ItemTypeId).then(function (response) {
                    $scope.asset.ResidualValue = response.data.DefaultResidualValue;
                });
            //assetTypeService.getAssetItemDepriciation($scope.asset.ItemTypeId).then(function (response) {
            //    // var res = response.data.filter(r => r.AssetItemId == $scope.asset.ItemTypeId)[0];
            //    var res = response.data.filter(r => r.AssetItemId == $scope.asset.ItemTypeId && (moment(r.EffectiveDateFrom) <= moment($scope.asset.PurchaseWorkingDate)) && (r.EffectiveDateTo === null || moment(r.EffectiveDateTo) >= moment($scope.asset.PurchaseWorkingDate)))[0];
            //    if (res) {
            //        $scope.asset.UsefulLife = res.UsefulLife;
            //        $scope.asset.ExpiryDate = new Date(moment($scope.asset.PurchaseWorkingDate).add($scope.asset.UsefulLife, 'years').add(-1, 'days'));
            //    }
            //});

        }

        $scope.filterOfficeList = function (officeLevel) {
            if (officeLevel == "-100000") $scope.BranchList = $scope.BranchListMain;
            else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == officeLevel);

            $scope.asset.LocationOfficeId = $rootScope.selectedBranchId;
            $scope.changeLocationOffice();
        }

        $scope.changeLocationOffice = function () {
            inventoryEntryService.getEmployeeByOfficeCode($scope.asset.LocationOfficeId).then(function (response) {
                $scope.filters.employeeList = response.data;
                //if ($scope.filters.employeeList.length > 0) $scope.asset.AssignedEmployee = $scope.filters.employeeList[0].Value;

            });
        }

        var nullifyVatFields = function () {
            $scope.vatPercentage = 0;
            $scope.asset.VatAmountView = 0;
            $scope.asset.VatAmount = 0;
        }

        var nullifyTaxFields = function () {
            $scope.taxPercentage = 0;
            $scope.asset.TaxAmount = 0;
            $scope.asset.TaxAmountView = 0;
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
                $scope.asset.VatAmountView = $scope.asset.VatAmount = Math.round(((($scope.asset.UnitNetPayable) / (100 + $scope.vatPercentage)) * 100) * $scope.vatPercentage / 100 * 100) / 100;
                $scope.asset.UnitNetPayable = $scope.asset.UnitNetPayable - $scope.asset.VatAmountView;



                if ($scope.asset.Mushak11Radio) {
                    $scope.asset.VatAmount = 0;
                    $scope.asset.UnitNetPayable = $scope.asset.UnitNetPayable + $scope.asset.VatAmountView;
                }
            }

            if (!$scope.asset.IsTaxExemption && $scope.asset.IsTaxDeductible) {
                $scope.asset.TaxAmountView = $scope.asset.TaxAmount = Math.round($scope.asset.UnitNetPayable * $scope.taxPercentage / 100 * 100) / 100;
                $scope.asset.UnitNetPayable = $scope.asset.UnitNetPayable - $scope.asset.TaxAmountView;
            }

            $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitNetPayable * $scope.asset.Quantity * 100) / 100;

            $scope.asset.VatAmountView = Math.round($scope.asset.VatAmountView * 100) / 100;
            $scope.asset.TaxAmountView = Math.round($scope.asset.TaxAmountView * 100) / 100;
            $scope.asset.UnitNetPayable = Math.round($scope.asset.UnitNetPayable * 100) / 100;
            $scope.asset.UnitTotalPayable = Math.round($scope.asset.UnitTotalPayable * 100) / 100;


        }

        $scope.clearAndCloseTab = function () {
            $scope.transfer = {};
            $scope.removeTab($scope.tab);
        };

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
                //move in config
                $scope.paychequeImage.Category = $rootScope.FileCategory.PAYCHEQUE_IMAGE;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
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
        $scope.addInventoryEntry = function () {
            //$scope.asset.PurchaseWorkingDate = $scope.DateToInt($scope.asset.PurchaseWorkingDate);
            //$scope.asset.WarrantyExpireDate = $scope.DateToInt($scope.asset.WarrantyExpireDate);
            //$scope.asset.ExpiryDate = $scope.DateToInt($scope.asset.ExpiryDate);
            //$scope.asset.PurchaseOrderDate = $scope.DateToInt($scope.asset.PurchaseOrderDate);
            //$scope.asset.InvoiceDate = $scope.DateToInt($scope.asset.InvoiceDate);
            //$scope.asset.ChalanDate = $scope.DateToInt($scope.asset.ChalanDate); 
            //$scope.asset.ChequeDate = $scope.DateToInt($scope.asset.ChequeDate);
            //$scope.asset.LastStatusChangeSystemDate = $scope.DateToInt($scope.asset.LastStatusChangeSystemDate);
            //$scope.asset.LastStatusChangeBranchDate = $scope.DateToInt($scope.asset.LastStatusChangeBranchDate);
            //$scope.asset.PaymentDate = $scope.DateToInt($scope.asset.PaymentDate);
            //$scope.asset.PaymentWorkingDate = $scope.DateToInt($scope.asset.PaymentWorkingDate);
            //$scope.asset.PaymentWorkingDate = $scope.DateToInt($scope.asset.PaymentWorkingDate);

            if ($scope.asset.BillingPrice < 1) {
                swal("please enter Billing price");
                return;
            }
            if ($scope.Mushak11Radio && $scope.Mushak11 == null) {
                swal("please enter mushak-11 number");
                return;
            }

            if ($scope.asset.Quantity < 1) {
                swal("Please insert Quantity > 1");
                return;
            }
            $scope.assetModel = angular.copy($scope.asset);
            console.log($scope.asset);

            //$scope.asset.InventoryType = $scope.asset.AssetTypeId;


            $scope.asset.CurrentBranchId = $scope.asset.LocationOfficeId;
            $scope.asset.PurchaseBranchId = angular.copy($scope.asset.CurrentBranchId);

            $scope.asset.PaymentDate = moment($scope.asset.PurchaseWorkingDate).format();
            $scope.asset.PaymentWorkingDate = moment($scope.asset.PurchaseWorkingDate).format("YYYY-MM-DD");// change after requirement

            //if (!$scope.asset.IsVatIncluded) $scope.asset.VatAmount = 0;
            //if (!$scope.asset.IsVatIncluded) $scope.asset.VatAmount = 0;

            $scope.files = $scope.AssetImage.concat($scope.invoiceDoc, $scope.Paycheck, $scope.PO);
            //$scope.file1 = $scope.files;asset
            //$scope.invoiceDoc1 = $scope.invoiceDoc;
            console.log($scope.AssetImage, $scope.PO, $scope.Paycheck, $scope.invoiceDoc, $scope.files);

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
            console.log($scope.asset);
            swal({
                title: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.InventoryEntry),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function (isConfirmed) {
                    if (isConfirmed) {
                        console.log($scope.asset.IsVatExemption);
                        console.log($scope.asset.IsTaxExemption);
                        $scope.asset.PurchaseWorkingDate = moment($scope.asset.PurchaseWorkingDate).format();
                        $scope.asset.ExpiryDate = moment($scope.asset.ExpiryDate).format();
                        if ($scope.asset.WarrantyExpireDate) $scope.asset.WarrantyExpireDate = moment($scope.asset.WarrantyExpireDate).format('YYYY-MM-DD');
                        if ($scope.asset.ChequeDate) $scope.asset.ChequeDate = moment($scope.asset.ChequeDate).format('YYYY-MM-DD');
                        if ($scope.asset.ChalanDate) $scope.asset.ChalanDate = moment($scope.asset.ChalanDate).format('YYYY-MM-DD');
                        if ($scope.asset.PurchaseOrderDate) $scope.asset.PurchaseOrderDate = moment($scope.asset.PurchaseOrderDate).format('YYYY-MM-DD');
                        if ($scope.asset.InvoiceDate) $scope.asset.InvoiceDate = moment($scope.asset.InvoiceDate).format('YYYY-MM-DD');
                        $scope.asset.PaymentWorkingDate = moment($scope.asset.PaymentWorkingDate).format('YYYY-MM-DD');
                        //New added Mukit
                        $scope.asset.PurchaseWorkingDate = $scope.DateToInt($scope.asset.PurchaseWorkingDate);
                        $scope.asset.WarrantyExpireDate = $scope.DateToInt($scope.asset.WarrantyExpireDate);
                        $scope.asset.ExpiryDate = $scope.DateToInt($scope.asset.ExpiryDate);
                        $scope.asset.PurchaseOrderDate = $scope.DateToInt($scope.asset.PurchaseOrderDate);
                        $scope.asset.InvoiceDate = $scope.DateToInt($scope.asset.InvoiceDate);
                        $scope.asset.ChalanDate = $scope.DateToInt($scope.asset.ChalanDate);
                        $scope.asset.ChequeDate = $scope.DateToInt($scope.asset.ChequeDate);
                        $scope.asset.LastStatusChangeSystemDate = $scope.DateToInt($scope.asset.LastStatusChangeSystemDate);
                        $scope.asset.LastStatusChangeBranchDate = $scope.DateToInt($scope.asset.LastStatusChangeBranchDate);
                        $scope.asset.PaymentWorkingDate = $scope.DateToInt($scope.asset.PaymentWorkingDate);
                        $scope.asset.PaymentDate = $scope.asset.PurchaseWorkingDate;
                        $scope.asset.UpdatedBy = $rootScope.user.EmployeeId;
                        //$scope.asset.BranchWorkingDate = $scope.DateToInt($scope.asset.BranchWorkingDate);
                        //$scope.asset.BranchWorkingDateD = $scope.DateToInt($scope.asset.BranchWorkingDateD);
                        $scope.asset.InventoryType = $scope.asset.AssetTypeId;
                        if ($scope.asset.IsFixedAsset == "Fixed") $scope.asset.IsFixedAsset = 1;
                        else $scope.asset.IsFixedAsset = 0;
                        if ($scope.asset.IsVatExemption)
                            $scope.asset.IsVatDeductible = false;
                        if ($scope.asset.IsTaxExemption)
                            $scope.asset.IsTaxDeductible = false;
                        $scope.asset.SelectedBranchId = $rootScope.selectedBranchId;

                        if ($scope.files.length > 0) {
                            documentService.uploadAsset($scope.files, $rootScope.user.UserId,
                                    $scope.assetImage != null ? $scope.assetImage.name : "",
                                    $scope.invoiceimage != null ? $scope.invoiceimage.name : "",
                                    $scope.POimage != null ? $scope.POimage.name : "",
                                    $scope.paychequeImage != null ? $scope.paychequeImage.name : "")
                                .then(function (res) {
                                    if (res.data.Success) {
                                        inventoryEntryService.add($scope.asset).then(function (response) {
                                            if (response.data.Success) {
                                                $scope.assetDocuments.asset = response.data.Entity;
                                                $scope.assetDocuments.documents = res.data.documentIdList;
                                                inventoryEntryService.addAssetDocuments($scope.assetDocuments).then(function (r) {
                                                    if (r.data.Success) {
                                                        $rootScope.$broadcast('asset-add-finished');
                                                        swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.InventoryEntry), "Successful!", "success");
                                                        $scope.clearAndCloseTab();
                                                    } else swal($rootScope.showMessage($rootScope.addError, $rootScope.InventoryEntry), response.data.Message, "error");
                                                });

                                            } else swal($rootScope.showMessage($rootScope.addError, $rootScope.InventoryEntry), response.data.Message, "error");
                                        });
                                    } else {
                                        $scope.uploadError = true;
                                        //Implement It 
                                        //inventoryEntryService.deleteAsset(response.data.Entity.Id);
                                        swal($rootScope.docAddError, "File is not Uploaded", "error");
                                    }
                                });
                        } else {
                            inventoryEntryService.add($scope.asset).then(function (response) {
                                if (response.data.Success) {
                                    $rootScope.$broadcast('asset-add-finished');
                                    swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.InventoryEntry), "Successful!", "success");
                                    $scope.clearAndCloseTab();
                                } else swal($rootScope.showMessage($rootScope.addError, $rootScope.InventoryEntry), response.data.Message, "error");
                            });
                        }
                    } else {
                        swal("Cancelled", "something is wrong", "error");
                    }
                });
        }

        $scope.getAsset = function () {

        }



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
        //function disabled(data) {
        //    var date = data.date,
        //      mode = data.mode;
        //    return (mode === 'day' && (date.getDay() === 5))
        //        || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.RM
        //        && (moment(date) > moment(new Date($rootScope.workingdate)))
        //        || (moment(date) < moment(new Date($rootScope.workingdate)).add(30, 'days')))
        //        || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.Admin
        //        && (moment(date) > moment(new Date($rootScope.workingdate))))
        //        || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.DM
        //        && (moment(date) > moment(new Date($rootScope.workingdate)))
        //        || (moment(date) < moment(new Date($rootScope.workingdate)).add(90, 'days')))
        //        || ($rootScope.selectedBranchId > 0 && ($rootScope.user.Role == $rootScope.UserRole.BM || $rootScope.user.Role == $rootScope.UserRole.LO || $rootScope.user.Role == $rootScope.UserRole.ABM)
        //        && (moment(date) > moment(new Date($rootScope.workingdate)))
        //        || (moment(date) < moment(new Date($rootScope.workingdate)).add(1, 'days')))
        //        || ($rootScope.selectedBranchId < 0 && moment(date) > moment(new Date()));
        //}

        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5))
                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.RM
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate)).add(-40, 'years')))
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
            formatYear: 'yy',
            //maxDate: new Date(2099, 5, 22),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1,
            initDate: new Date($rootScope.workingdate),
            showWeeks: false
        };

        //function dateOptionsWithPreviousDate(data) {
        //    var date = data.date,
        //      mode = data.mode;

        //    return (mode === 'day' && (date.getDay() === 5))
        //        || ($rootScope.selectedBranchId > 0
        //        && (moment(date) > moment(new Date($rootScope.workingdate)).add(1, 'days')))
        //        ;
        //}

        function dateOptionsWithPreviousDate(data) {
            var date = data.date,
              mode = data.mode;

            return (mode === 'day' && (date.getDay() === 5))
                || ($rootScope.selectedBranchId > 0
                    && (moment(date) >= moment(new Date($scope.asset.PurchaseWorkingDate)).add(1, 'days')))
                || ($rootScope.selectedBranchId < 0 &&
                (moment(date) >= moment(new Date($scope.asset.PurchaseWorkingDate)).add(1, 'days')));
        }

        $scope.dateOptionsWithPreviousDate = {
            dateDisabled: dateOptionsWithPreviousDate,
            initDate: new Date($rootScope.workingdate),
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
            (moment(date) <= moment(new Date($scope.asset.PurchaseWorkingDate)).add(-1, 'days'));
        }

        function dateOptionsWithFutureDateWithHoliday(data) {
            var date = data.date,
              mode = data.mode;

            return (mode === 'day' && (date.getDay() === -1))
            ||
            (moment(date) <= moment(new Date($scope.asset.PurchaseWorkingDate)).add(-1, 'days'));
        }

        $scope.dateOptionsWithFutureDate = {
            dateDisabled: dateOptionsWithFutureDate,
            initDate: new Date($rootScope.workingdate),
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
            dateDisabled: dateOptionsWithAllDate,
            initDate: new Date($rootScope.workingdate),
            formatYear: 'yy',
            //maxDate: new Date(2099, 5, 22),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 6,
            showWeeks: false
        };


        $scope.changeEntryDate = function () {
            $scope.asset.InvoiceDate = $scope.asset.PurchaseWorkingDate;
            $scope.asset.ExpiryDate = new Date(moment($scope.asset.PurchaseWorkingDate).add($scope.asset.UsefulLife, 'years').add(-1, 'days'));
            $scope.purchaseDateValidator();
        }
        $scope.expirydateOptions = {
            dateDisabled: dateOptionsWithFutureDateWithHoliday,
            initDate: new Date($rootScope.workingdate),
            formatYear: 'yy',
            //maxDate: new Date(2099, 5, 22),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1,
            showWeeks: false
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];


        $scope.chalanDateValidator = function () {

            if (moment($scope.asset.ChalanDate).add(1, 'days') < moment($scope.asset.PurchaseWorkingDate)) {
                swal("Chalan date can not be less than purchase date!");
                $scope.asset.ChalanDate = $scope.asset.PurchaseWorkingDate;
                return;
            }
        }


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


        $scope.purchaseDateValidator = function () {
            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }

            if (moment($scope.asset.PurchaseWorkingDate).valueOf() > maxDate || moment($scope.asset.PurchaseWorkingDate).valueOf() < minDate) {
                swal('please select valid date!');
                $scope.today();
                return;
            }


            if (moment($scope.asset.PurchaseWorkingDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
                swal("unable to select future date!");
                $scope.today();
                return;
            }

            //$scope.isHolidayOrOffDay($scope.paySalaryToAdd.Date);
        }


    }]);