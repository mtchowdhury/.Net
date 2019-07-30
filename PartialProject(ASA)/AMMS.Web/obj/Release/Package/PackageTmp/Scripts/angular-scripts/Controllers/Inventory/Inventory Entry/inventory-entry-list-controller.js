ammsAng.controller('inventoryEntryListController', ['$scope', '$rootScope', 'inventoryEntryService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder', 'salaryStructureService', 'inventoryTypeService',
function ($scope, $rootScope, inventoryEntryService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder, salaryStructureService, inventoryTypeService) {


    $scope.$on('asset-edit-finished', function () {
        $scope.init1();
    });
    $scope.$on('asset-add-finished', function () {

        $scope.init1();
    });
    $scope.$on('asset-delete-finished', function () {

        $scope.init1();
    });
    $scope.$on('asset-dispose-finished', function () {
        $scope.init2();
    });
    $scope.$on('asset-dispose-reverese-finished', function () {
        $scope.init2();
    });
    $scope.$on('asset-transfer-finished', function () {
        $scope.init2();
    });
    $scope.$on('asset-transfer-update-finished', function () {
        $scope.init2();
    });
    $scope.$on('asset-transfer-reject-finished', function () {
        $scope.init2();
    });
    $scope.$on('asset-received-finished', function () {
        $scope.init2();
    });
    $scope.$on('asset-received-reject-finished', function () {
        $scope.init2();
    });
    $scope.getCommands = function () {
        console.log($scope.tab.PropertyId);
        commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
            $scope.commandList = responseCommand.data;
            console.log($scope.commandList);
            $scope.customCommandList = [];

            $scope.customCommandList.push($scope.commandList[1]);
            if ($scope.commandList.find(c=> !c.IsGeneral))
                $scope.hasNonGeneralCommands = true;
        }, AMMS.handleServiceError);
    }
    $scope.getBranchesByRoleAndBranch = function () {
        commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, $rootScope.user.Role).then(function (response) {
            if (response.status == 200) {

                $scope.BranchList = response.data;
                $scope.BranchListMain = angular.copy(response.data);
                $scope.BranchListMain.push({ Name: "All", Value: "-100000" });
                $scope.BranchList.push({ Name: "All", Value: "-100000" });
                $scope.GetFilters();
            }




        }, AMMS.handleServiceError);
    }
    $scope.GetFilters = function () {
        inventoryEntryService.GetAdditionalFilters($rootScope.selectedBranchId).then(function (response) {
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
                if ($scope.filterParams.OfficeTypeList.lenght > 1) $scope.filterParams.OfficeTypeList.push({ Name: "All", Value: "-100000" });
            }

            //$scope.filterParams.OfficeType = "-100000";
            if ($rootScope.user.Role == $rootScope.UserRole.Admin)
                $scope.filterParams.OfficeType = 3; // admin belongs to Asa Central
            else $scope.filterParams.OfficeType = $scope.filterParams.OfficeTypeList[0].Value;
            $scope.filterParams.OfficeId = $rootScope.selectedBranchId;

            $scope.UpdateOfficeType();
            
            $scope.SearchInventory(); // initail call in search 
            
            if ($scope.filterParams.OfficeType == "-100000") $scope.BranchList = $scope.BranchListMain;
            else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == $scope.filterParams.OfficeType);




            inventoryEntryService.GetFilters().then(function (response) {
                console.log(response.data);
                $scope.filterParams.SubStatusList = response.data.AssetSubStatus;
                $scope.flagListMain = angular.copy(response.data.AssetSubStatus);

                $scope.flagListMain = $scope.flagListMain.filter(x => x.Value != $rootScope.AssetConfig.AssetSubStatus.Deleted
                        && x.Value != $rootScope.AssetConfig.AssetSubStatus.Disposed);

                $scope.filterParams.SubStatusList = $scope.filterParams.SubStatusList.filter(x => x.Value != $rootScope.AssetConfig.AssetSubStatus.Deleted
                        && x.Value != $rootScope.AssetConfig.AssetSubStatus.Disposed);

                $scope.flagListMain.push({ Name: "All", Value: "0" });
                $scope.filterParams.SubStatusList.push({ Name: "All", Value: "0" });
                $scope.filterParams.SubStatus = "0";

                $scope.filterParams.StatusList = response.data.AssetStatus;

                $scope.filterParams.StatusList = $scope.filterParams.StatusList.filter(x=>x.Value != $rootScope.AssetConfig.AssetStatus.Deleted);
                $scope.filterParams.StatusList.push({ Name: "All", Value: "0" });
                $scope.filterParams.Status = "0";

                $scope.filterParams.AssetTypeList = response.data.AssetType;
                $scope.filterParams.AssetTypeList.push({ Name: "All", Value: "0" });
                $scope.filterParams.AssetType = "0";


            });

            inventoryTypeService.GetAll().then(function (response) {
                $scope.itemListMain = angular.copy(response.data);


                inventoryEntryService.categoryFilters().then(function (response) {
                    console.log(response.data);
                    $scope.categoryItems = angular.copy(response.data);
                    $scope.categoryItems.push({ Name: "All", Id: "-100000" });
                    $scope.filterParams.CategoryList = response.data;
                    $scope.filterParams.CategoryList.push({ Name: "All", Value: "-100000" });
                    $scope.filterParams.CategoryId = "-100000";
                    //$scope.filterItem($scope.filterParams.CategoryId);
                    $scope.filterItemByCategory($scope.filterParams.CategoryId);

                });

            });
        });




    }



    $scope.UpdateOfficeType = function () {
        $scope.filterParams.OfficeType = $scope.BranchList.filter(br => br.Value == $scope.filterParams.OfficeId)[0].RelationalValue;
    }


    $scope.GetAll = function () {
        $("#loadingImage").css("display", "block");
        inventoryEntryService.GetAll().then(function (response) {
            $scope.assetList = response.data;
            $scope.assetList.forEach(function (a) {
                if (a.SubStatus == $rootScope.AssetConfig.AssetSubStatus.Scrapped) a.WrittenDownValueShow = 0;
                else a.WrittenDownValueShow = Math.round(a.WrittenDownValue);
                if (a.PurchaseWorkingDate != null) {
                    var pDate = commonService.intToDate(a.PurchaseWorkingDate);
                    var puDate = pDate.toString();
                    a.PurchaseWorkingDate = new Date(puDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                    a.PurchaseWorkingDate = moment(a.PurchaseWorkingDate).format('DD-MM-YYYY');
                }
                if (a.LastStatusChangeDate != null) a.LastStatusChangeDate = moment(a.LastStatusChangeDate).format('DD-MM-YYYY');
                if (a.LastStatusChangeBranchDate != null) a.LastStatusChangeBranchDate = moment(a.LastStatusChangeBranchDate).format('DD-MM-YYYY');
                if (a.LastStatusChangeSystemDate != null) a.LastStatusChangeSystemDate = moment(a.LastStatusChangeSystemDate).format('DD-MM-YYYY');
            });
            $("#loadingImage").css("display", "none");
            console.log($scope.assetList);
        }, AMMS.handleServiceError);
    }
    $scope.SearchInventory = function () {
        $("#loadingImage").css("display", "block");
        if ($scope.filterParams.Office) $scope.filterParams.OfficeId = $scope.filterParams.Office.originalObject.Value;
        else { $("#loadingImage").css("display", "none"); swal("Please select a branch"); return; }
        //if ($scope.filterParams.PurchaseDateFrom == undefined) {
        //    $scope.filterParams.PurchaseDateFrom = $rootScope.WorkingDate;
        //}
        if ($scope.filterParams.PurchaseDateFrom) $scope.filterParams.PurchaseDateFrom = $scope.filterParams.PurchaseDateFrom;//moment($scope.filterParams.PurchaseDateFrom).format();
        if ($scope.filterParams.PurchaseDateTo) $scope.filterParams.PurchaseDateTo = $scope.filterParams.PurchaseDateTo;//moment($scope.filterParams.PurchaseDateTo).format();
        if ($scope.filterParams.LastStatusChangeFrom) $scope.filterParams.LastStatusChangeFrom = $scope.filterParams.LastStatusChangeFrom;//moment($scope.filterParams.LastStatusChangeFrom).format();
        if ($scope.filterParams.LastStatusChangeTo) $scope.filterParams.LastStatusChangeTo = $scope.filterParams.LastStatusChangeTo;//moment($scope.filterParams.LastStatusChangeTo).format();
        $scope.filterParams.BranchId = $rootScope.selectedBranchId;
        if ($scope.filterParams.PurchasePriceFrom == null) $scope.filterParams.PurchasePriceFrom = -1;
        if ($scope.filterParams.PurchasePriceTo == null) $scope.filterParams.PurchasePriceTo = -1;
        $scope.filterParams.RoleId = $rootScope.user.Role;
        inventoryEntryService.SearchInventory($scope.filterParams).then(function (response) {
            console.log(response.data);
            $scope.assetList = response.data;

            $scope.assetList = $scope.assetList.filter(a => a.Status != $rootScope.AssetConfig.AssetStatus.Deleted);
            $scope.assetList.forEach(function (a) {
                if (a.SubStatus == $rootScope.AssetConfig.AssetSubStatus.Scrapped) a.WrittenDownValueShow = 0;
                else a.WrittenDownValueShow = Math.round(a.WrittenDownValue);
                //a.PurchaseWorkingDate = moment(a.PurchaseWorkingDate).format('DD-MM-YYYY');
                if (a.PurchaseWorkingDate != null) {
                    var pDate = commonService.intToDate(a.PurchaseWorkingDate);
                    var puDate = pDate.toString();
                    a.PurchaseWorkingDate = new Date(puDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                    a.PurchaseWorkingDate = moment(a.PurchaseWorkingDate).format('DD-MM-YYYY');
                }
                if (a.LastStatusChangeSystemDate != null) a.LastStatusChangeSystemDate = moment(a.LastStatusChangeSystemDate).format('DD-MM-YYYY');
                if (a.WrittenDownValue != null) a.WrittenDownValue = Math.round(a.WrittenDownValue);

            });
            if ($scope.filterParams.PurchaseDateFrom != null) $scope.filterParams.PurchaseDateFrom = new Date($scope.filterParams.PurchaseDateFrom);
            if ($scope.filterParams.PurchaseDateTo != null) $scope.filterParams.PurchaseDateTo = new Date($scope.filterParams.PurchaseDateTo);
            if ($scope.filterParams.LastStatusChangeFrom != null) $scope.filterParams.LastStatusChangeFrom = new Date($scope.filterParams.LastStatusChangeFrom);
            if ($scope.filterParams.LastStatusChangeTo != null) $scope.filterParams.LastStatusChangeTo = new Date($scope.filterParams.LastStatusChangeTo);
            if ($scope.filterParams.PurchasePriceFrom == -1) $scope.filterParams.PurchasePriceFrom = null;
            if ($scope.filterParams.PurchasePriceTo == -1) $scope.filterParams.PurchasePriceTo = null;

            $("#loadingImage").css("display", "none");

        });
        //$scope.filterParams.PurchaseDateFrom = $scope.filterParams.PurchaseDateFrom;
        //$scope.filterParams.PurchaseDateTo = $scope.filterParams.PurchaseDateTo;
        //$scope.filterParams.LastStatusChangeFrom = $scope.filterParams.LastStatusChangeFrom;
        //$scope.filterParams.LastStatusChangeTo = $scope.filterParams.LastStatusChangeTo;

    }

    $scope.handleNonGeneralActions = function (actionName, item) {
        $scope.itemToDelete = item;
        if (actionName === "DELETE") {
            $scope.deleteAsset();
        }
    }
    


    $scope.deleteAsset = function () {
        if ($scope.itemToDelete.SubStatus == $rootScope.AssetConfig.AssetSubStatus.Intransit) {
            swal("In Transit Asset cannot be deleted.");
            return;
        }
        //if (!$rootScope.isDayOpenOrNot()) return;
        swal({
            title: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.InventoryEntry),
            showCancelButton: true,
            confirmButtonText: "Yes, Delete it!",
            cancelButtonText: "No, Cancel Please!",
            type: "info",
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        },
            function () {
                inventoryEntryService.delete($scope.itemToDelete.Id).then(function (response) {
                    if (response.data.Success) {
                        swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.InventoryEntry), "Successful!", "success");
                        $rootScope.$broadcast('asset-delete-finished');
                    } else {
                        swal($rootScope.showMessage($rootScope.deleteError, $rootScope.InventoryEntry), response.data.Message, "error");
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
        //$scope.filterParams.Office.title = "";
        //$scope.filterParams.Office = null;
        $scope.$broadcast('angucomplete-alt:clearInput');
        if (officeLevel == "-100000") $scope.BranchList = $scope.BranchListMain;
        else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == officeLevel);
    }
   

    $scope.filterItemByCategory = function (categoryId) {
        if (categoryId == "-100000") {
            $scope.itemList = $scope.itemListMain;
            $scope.itemList.push({ Name: "All", Id: "-100000" });
            $scope.filterParams.ItemId = "-100000";
        }
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

    $scope.init = function () {
        $scope.commandList = [];
        $scope.itemTypeList = [];
        $scope.filterParams = {};
        

        $scope.hasNonGeneralCommands = false;
        $scope.getCommands();
        //$scope.GetAll();
        $scope.getBranchesByRoleAndBranch();

        $scope.filterParams.Office = { title: $rootScope.selectedBranchTitle, originalObject: { Name: $rootScope.selectedBranchTitle, Value: $rootScope.selectedBranchId } };
        //var allbranches = $rootScope.allBranches;

        //$scope.filterParams.PurchaseDateFrom = new Date($rootScope.workingdate);
        //$scope.filterParams.PurchaseDateTo = new Date($rootScope.workingdate);
        //$scope.filterParams.LastStatusChangeFrom = new Date($rootScope.workingdate);
        //$scope.filterParams.LastStatusChangeTo = new Date($rootScope.workingdate);

    }
    $scope.init1 = function () {
        //$scope.commandList = [];
        //$scope.itemTypeList = [];
        //$scope.filterParams = {};
        //$scope.hasNonGeneralCommands = false;
        $scope.getCommands();
        //$scope.GetAll();
        $scope.GetFilters();


    }
    $scope.init2 = function () {
        $scope.GetAll();
    }

    $scope.popupPurchaseDateFrom = {
        opened: false
    };
    $scope.openPurchaseDateFrom = function () {
        $scope.popupPurchaseDateFrom.opened = true;
    };
    $scope.popupPurchaseDateTo = {
        opened: false
    };
    $scope.openPurchaseDateTo = function () {
        $scope.popupPurchaseDateTo.opened = true;
    };
    $scope.popupLastStatusChangeFrom = {
        opened: false
    };
    $scope.openLastStatusChangeFrom = function () {
        $scope.popupLastStatusChangeFrom.opened = true;
    };
    $scope.popupLastStatusChangeTo = {
        opened: false
    };
    $scope.openLastStatusChangeTo = function () {
        $scope.popupLastStatusChangeTo.opened = true;
    };


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

    $scope.dateOptions = {
        dateDisabled: disabled,
        initDate: new Date($rootScope.workingdate),
        formatYear: 'yy',
        //maxDate: new Date(2099, 5, 22),
        //minDate: new Date($rootScope.workingdate),
        startingDay: 1,
        showWeeks: false
    };
    
    $scope.PurchasePrice = function(value) {
        if (value == -1 || value == undefined) {
            return null;
        }
        return value;
    }

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

        var url = commonService.getExportUrl($rootScope.assetApiBaseUrl + 'asset/getSearchResultlist', filterString, 'Asset-Entry');
        window.open(url, '_blank');
    }
    $scope.init();

}]);