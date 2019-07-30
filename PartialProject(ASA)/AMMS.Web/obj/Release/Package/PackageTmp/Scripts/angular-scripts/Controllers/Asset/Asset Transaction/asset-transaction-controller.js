﻿ammsAng.controller('assetTransactionListController', ['$scope', '$rootScope', 'assetEntryService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder', 'salaryStructureService', 'assetTypeService',
function ($scope, $rootScope, assetEntryService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder, salaryStructureService, assetTypeService) {



    $scope.popupToDate = {
        opened: false
    };
    $scope.openToDate = function () {
        $scope.popupToDate.opened = true;
    };
    $scope.popupFromDate = {
        opened: false
    };
    $scope.openFromDate = function () {
        $scope.popupFromDate.opened = true;
    };
    
    $scope.getCommands = function () {
        commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
            $scope.commandList = responseCommand.data;

            $scope.customCommandList = [];

            $scope.customCommandList.push($scope.commandList[1]);
            if ($scope.commandList.find(c=> !c.IsGeneral))
                $scope.hasNonGeneralCommands = true;
        }, AMMS.handleServiceError);
    }

    $scope.getBranchesByRoleAndBranch = function () {
        commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, $rootScope.user.Role).then(function (response) {
            $scope.BranchList = response.data;
            $scope.BranchListMain = angular.copy(response.data);

            $scope.GetFilters();
            //$scope.BranchListMain.push({ Name: "All", Value: "-100000" });
            //$scope.BranchList.push({ Name: "All", Value: "-100000" });


            
        }, AMMS.handleServiceError);
    }


    $scope.GetAll = function () {
        $("#loadingImage").css("display", "block");
        assetEntryService.GetAll().then(function (response) {
            $scope.transtList = response.data;
            $("#loadingImage").css("display", "none");
            console.log($scope.assetList);
        }, AMMS.handleServiceError);
    }

    $scope.handleNonGeneralActions = function (actionName, item) {
        $scope.itemToDelete = item;
        if (actionName === "DELETE") {
            $scope.deleteAsset();
        }
    }
    $scope.Search = function () {
        $("#loadingImage").css("display", "block");
        if ($scope.filterParams.OfficeId == "-100000") {
            $scope.BranchList.forEach(function(b) {
                $scope.filterParams.BranchIds.push(b.Value);
            });

        }
        $scope.tempFromDate = angular.copy($scope.filterParams.FromDate);
        $scope.tempToDate = angular.copy($scope.filterParams.ToDate);
        if ($scope.filterParams.Office) $scope.filterParams.OfficeId = $scope.filterParams.Office.originalObject.Value;
        else { $("#loadingImage").css("display", "none"); swal("Please select a branch"); return; }
        if ($scope.filterParams.FromDate) $scope.filterParams.FromDate = moment($scope.filterParams.FromDate).format();
        if ($scope.filterParams.ToDate) $scope.filterParams.ToDate = moment($scope.filterParams.ToDate).format();
        $scope.filterParams.BranchId = $rootScope.selectedBranchId;
        $scope.filterParams.RoleId = $rootScope.user.Role;
        assetEntryService.SearchTransaction($scope.filterParams).then(function (response) {
            console.log(response.data);
            $scope.transtList = response.data;
            //$scope.assetList = $scope.assetList.filter(a => a.Status != $rootScope.AssetConfig.AssetStatus.Deleted);
            $scope.transtList.forEach(function (a) {
                a.TransDate = moment(a.TransDate).format('DD-MM-YYYY');
                a.PurchaseDate = moment(a.PurchaseDate).format('DD-MM-YYYY');
                a.PurchaseAmount = Math.round(a.PurchaseAmount);
                a.TransactionAmount = Math.round(a.TransactionAmount);
                a.VatAmount = Math.round(a.VatAmount);
                a.TaxAmount = Math.round(a.TaxAmount);
                a.PurchaseAmount = Math.round(a.PurchaseAmount * 100) / 100;
                a.TotalAmount = Math.round(a.TotalAmount * 100) / 100;
            });
            $scope.filterParams.FromDate = angular.copy($scope.tempFromDate);
            $scope.filterParams.ToDate = angular.copy($scope.tempToDate);
            $("#loadingImage").css("display", "none");
        });
    }


    $scope.deleteAsset = function () {
        if ($scope.itemToDelete.SubStatus == $rootScope.AssetConfig.AssetSubStatus.Intransit) {
            swal("In Transit Asset cannot be deleted.");
            return;
        }
        //if (!$rootScope.isDayOpenOrNot()) return;
        swal({
            title: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.AssetEntry),
            showCancelButton: true,
            confirmButtonText: "Yes, Delete it!",
            cancelButtonText: "No, Cancel Please!",
            type: "info",
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        },
            function () {
                assetEntryService.delete($scope.itemToDelete.Id).then(function (response) {
                    if (response.data.Success) {
                        swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.AssetItemType), "Successful!", "success");
                        $rootScope.$broadcast('asset-delete-finished');
                    } else {
                        swal($rootScope.showMessage($rootScope.deleteError, $rootScope.AssetItemType), response.data.Message, "error");
                    }
                }, AMMS.handleServiceError);
            });
    };
    $scope.filterItem = function (categoryId) {
        //if (categoryId === "-100000") return;
        $scope.filterParams.ItemTypeList = [];
        $scope.categoryItems.forEach(function (c, i) {
            if (categoryId != "-100000" && c.Id === categoryId) {
                c
                $scope.filterParams.ItemTypeList.push({ Name: c.CategoryItems[i].Name, Value: c.CategoryItems[i].Id }); //= c.CategoryItems;
            } else if (categoryId === "-100000" && c.Id != "-100000") {
                if (c)
                    $scope.filterParams.ItemTypeList.push({ Name: c.CategoryItems[i].Name, Value: c.CategoryItems[i].Id });
            }
        });
        //if ($scope.filterParams.ItemTypeList) $scope.filterParams.ItemId = $scope.filterParams.ItemTypeList[0].Id;
    }
    $scope.filterOfficeList = function (officeLevel) {
        $scope.$broadcast('angucomplete-alt:clearInput');
        if (officeLevel == "-100000") $scope.BranchList = $scope.BranchListMain;
        else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == officeLevel);
    }
    $scope.GetFilters = function () {
        $("#loadingImage").css("display", "block");
        assetEntryService.GetAdditionalFilters($rootScope.selectedBranchId,-100000).then(function (response) {
            console.log(response.data);
            //$scope.categoryItems = angular.copy(response.data);
            $scope.filterParams.RegionList = response.data.regions;
            $scope.filterParams.DistrictList = response.data.districts;
            $scope.filterParams.ZoneList = response.data.zones;
            $scope.filterParams.BranchList = response.data.branches;
            $scope.filterParams.OfficeTypeList = response.data.PermittedOfficeLevel;
            $scope.filterParams.OfficeTypeListMain = angular.copy(response.data.PermittedOfficeLevel);
            //role base office type filters
            if ($rootScope.user.Role == $rootScope.UserRole.BM || $rootScope.user.Role == $rootScope.UserRole.RM)
                $scope.filterParams.OfficeTypeList = $scope.filterParams.OfficeTypeListMain.filter(o => o.Value == $rootScope.AssetConfig.OfficeType.Branch);
            if ($rootScope.user.Role == $rootScope.UserRole.ZM || $rootScope.user.Role == $rootScope.UserRole.DM)
                $scope.filterParams.OfficeTypeList = $scope.filterParams.OfficeTypeListMain.filter(o => o.Value == $rootScope.AssetConfig.OfficeType.Branch || o.Value == $rootScope.AssetConfig.OfficeType.Division);
            if ($rootScope.user.Role == $rootScope.UserRole.Admin) {
                $scope.filterParams.OfficeTypeList = $scope.filterParams.OfficeTypeListMain.filter(o => o.Value == $rootScope.AssetConfig.OfficeType.Branch || o.Value == $rootScope.AssetConfig.OfficeType.Division || o.Value == $rootScope.AssetConfig.OfficeType.Central);
                //$scope.filterParams.OfficeTypeList.push({ Name: "All", Value: "-100000" });
            }

            //$scope.filterParams.OfficeType = "-100000";
            if ($rootScope.user.Role == $rootScope.UserRole.Admin)
                $scope.filterParams.OfficeType = 3; // admin belongs to Asa Central
            else $scope.filterParams.OfficeType = $scope.filterParams.OfficeTypeList[0].Value;
            $scope.filterParams.OfficeId = $rootScope.selectedBranchId;
            $scope.UpdateOfficeType();

            $scope.getAssetsByBranch($scope.filterParams.OfficeId);

            if ($scope.filterParams.OfficeType == "-100000") $scope.BranchList = $scope.BranchListMain;
            else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == $scope.filterParams.OfficeType);
            //$scope.Search();  // initial call for fetching the transaction automatically 
            //$scope.filterOfficeList($scope.filterParams.OfficeType);
        });

        $scope.UpdateOfficeType = function () {
            $scope.filterParams.OfficeType = $scope.BranchList.filter(br => br.Value == $scope.filterParams.OfficeId)[0].RelationalValue;
        }

        $scope.getAssetsByBranch = function() {
            assetEntryService.GetAssetsOfBranch($scope.filterParams.OfficeId).then(function (response) {
                $scope.NameListMain.push({ Name: "All", Id: -100000 });
                $scope.NameListMain.push.apply($scope.NameListMain, angular.copy(response.data));

                $scope.NameListMain.forEach(function(a) {
                    if (a.Name != null && a.Id != -100000) a.Name = a.Name + "( " + a.AssetId + " )";
                    else if(a.Id != -100000) a.Name = "---" + "( " + a.AssetId + " )";
                });

                $scope.NameList = $scope.NameListMain;
                $scope.filterName();
                $("#loadingImage").css("display", "none"); // stoping the loading icon in initial filter fetch

            });
        }

        $scope.filterName = function() {
            if ($scope.filterParams.CategoryId != "-100000")
                $scope.NameList = $scope.NameListMain.filter(n => n.CategoryId == $scope.filterParams.CategoryId);
            else $scope.NameList = $scope.NameListMain;
            if ($scope.filterParams.ItemId != "-100000")
                $scope.NameList = $scope.NameListMain.filter(n => n.ItemTypeId == $scope.filterParams.ItemId);
            else $scope.NameList = $scope.NameListMain;

            //$scope.NameList.push({ Name: "All", Id: -100000 });
            $scope.filterParams.AssetId = -100000;
        }


        assetEntryService.GetFilters().then(function (response) {
            console.log(response.data);
            $scope.filterParams.SubStatusList = response.data.AssetSubStatus;
            $scope.flagListMain = angular.copy(response.data.AssetSubStatus);
            $scope.flagListMain.push({ Name: "All", Value: "0" });
            $scope.filterParams.SubStatusList.push({ Name: "All", Value: "0" });
            $scope.filterParams.SubStatus = "0";

            $scope.filterParams.StatusList = response.data.AssetStatus;
            $scope.filterParams.StatusList.push({ Name: "All", Value: "0" });
            $scope.filterParams.Status = "0";

            $scope.filterParams.AssetTypeList = response.data.AssetType;
            $scope.filterParams.AssetTypeList.push({ Name: "All", Value: "0" });
            $scope.filterParams.AssetType = "0";

            $scope.transactionTypeList = response.data.AssetTransactionType;
            $scope.transactionTypeList.push({ Name: "All", Value: "-100000" });
            $scope.filterParams.TransactionType = "-100000";


        });

        assetTypeService.GetAll().then(function (response) {
            $scope.itemListMain.push({ Name: "All", Id: "-100000" });
            $scope.itemListMain.push.apply($scope.itemListMain, angular.copy(response.data));
            

            $scope.filterParams.ItemId = "-100000";

            assetEntryService.categoryFilters().then(function (response) {
                console.log(response.data);
                $scope.categoryItems.push({ Name: "All", Id: "-100000" });
                $scope.categoryItems.push.apply($scope.categoryItems, angular.copy(response.data));
                
                $scope.filterParams.CategoryList = response.data;
                $scope.filterParams.CategoryList.push({ Name: "All", Value: "-100000" });
                $scope.filterParams.CategoryId = "-100000";
                //$scope.filterItem($scope.filterParams.CategoryId);
                $scope.filterItemByCategory($scope.filterParams.CategoryId);

            });

        });
    }

    $scope.filterItemByCategory = function (categoryId) {
        if (categoryId == "-100000") $scope.itemList = $scope.itemListMain;
        else $scope.itemList = $scope.itemListMain.filter(i => i.CategoryId == categoryId);
    }


    $scope.assetStatusChange = function () {

        if ($scope.filterParams.Status == $rootScope.AssetConfig.AssetStatus.Active) {
            $scope.filterParams.SubStatusList = $scope.flagListMain.filter(f => f.Value == $rootScope.AssetConfig.AssetSubStatus.Inuse
                    || f.Value == $rootScope.AssetConfig.AssetSubStatus.InStock
                    || f.Value == $rootScope.AssetConfig.AssetSubStatus.InMaintence
                    || f.Value == $rootScope.AssetConfig.AssetSubStatus.Intransit
                    || f.Value == "0");
        }
        else if ($scope.filterParams.Status == $rootScope.AssetConfig.AssetStatus.Inactive) {
            $scope.filterParams.SubStatusList = $scope.flagListMain.filter(f => f.Value == $rootScope.AssetConfig.AssetSubStatus.Disposed || f.Value == $rootScope.AssetConfig.AssetSubStatus.Sold
                || f.Value == $rootScope.AssetConfig.AssetSubStatus.Donate || f.Value == $rootScope.AssetConfig.AssetSubStatus.Stolen
                || f.Value == $rootScope.AssetConfig.AssetSubStatus.Lost
                || f.Value == "0");
        }
        else if ($scope.filterParams.Status == $rootScope.AssetConfig.AssetStatus.Deleted) {
            $scope.filterParams.SubStatusList = $scope.flagListMain.filter(f => f.Value == $rootScope.AssetConfig.AssetSubStatus.Disposed || f.Value == $rootScope.AssetConfig.AssetSubStatus.Deleted || f.Value == "0");
        }
        else if ($scope.filterParams.Status == "0") {
            $scope.filterParams.SubStatusList = $scope.flagListMain;
        }
        //else
        //    $scope.filters.subStatusList = $scope.flagListMain;
    }
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
        startingDay: 1,
        initDate: new Date($rootScope.workingdate),
        showWeeks: false
    };

    $scope.exportData = function () {

        var filterString = "";
        //iterate through properties of objec

        for (var property in $scope.filterParams) {
            if ($scope.filterParams.hasOwnProperty(property)) {
                if (property != "AssetTypeList" && property != "BranchList" && property != "CategoryList" &&
                    property != "DistrictList" && property != "Office" && property != "OfficeTypeList" && property != "OfficeTypeListMain"
                    && property != "StatusList" && property != "SubStatusList" && property != "ZoneList" && property != "RegionList")
                    filterString += property + "|" + $scope.filterParams[property] + "#";
            }
        }

        var url = commonService.getExportUrl($rootScope.assetApiBaseUrl + 'asset/getTransactionSearchResultlist', filterString, 'Asset-Transaction');
        window.open(url, '_blank');
    }

    $scope.init = function () {
        $scope.commandList = [];
        $scope.itemTypeList = [];
        $scope.filterParams = {};
        $scope.categoryItems = [];
        $scope.transactionTypeList = [];
        $scope.itemListMain = [];
        $scope.NameListMain = [];
        $scope.hasNonGeneralCommands = false;
        $scope.getCommands();
        //$scope.GetAll();
        //$scope.GetFilters();
        $scope.getBranchesByRoleAndBranch();
        $scope.filterParams.Office = { title: $rootScope.selectedBranchTitle, originalObject: { Name: $rootScope.selectedBranchTitle, Value: $rootScope.selectedBranchId } };
    }
    $scope.init1 = function () {
        //$scope.commandList = [];
        //$scope.itemTypeList = [];
        //$scope.filterParams = {};
        //$scope.hasNonGeneralCommands = false;
        $scope.getCommands();
        //$scope.GetAll();
        //$scope.GetFilters();
    }

    $scope.init2 = function () {
        $scope.GetAll();
    }

    $scope.init();

}]);