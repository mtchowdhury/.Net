ammsAng.controller('assetEntryListController', ['$scope', '$rootScope', 'assetEntryService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder', 'salaryStructureService', 'assetTypeService', 'assetTransferReceiveService',
function ($scope, $rootScope, assetEntryService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder, salaryStructureService, assetTypeService, assetTransferReceiveService) {


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
                $scope.commandList = responseCommand.data.filter(el => el.CommandId !== 1029);
                console.log($scope.commandList);
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
                $scope.BranchListMain.push({ Name: "All", Value: "-100000" });
                $scope.BranchList.push({ Name: "All", Value: "-100000" });

                $scope.GetFilters();

            }, AMMS.handleServiceError);
        }

        $scope.UpdateOfficeType = function() {
            $scope.filterParams.OfficeType = $scope.BranchList.filter(br => br.Value == $scope.filterParams.OfficeId)[0].RelationalValue;
        }


    $scope.GetAll = function () {
            $("#loadingImage").css("display", "block");
            assetEntryService.GetAll().then(function (response) {
                $scope.assetList = response.data;
                $scope.assetList.forEach(function (a) {
                    if (a.SubStatus == $rootScope.AssetConfig.AssetSubStatus.Scrapped) a.WrittenDownValueShow = 0;
                    else a.WrittenDownValueShow = Math.round(a.WrittenDownValue);
                    if (a.PurchaseWorkingDate != null) a.PurchaseWorkingDateS = moment(a.PurchaseWorkingDate).format("YYYY-MM-DD");
                    if (a.LastStatusChangeDate != null) a.LastStatusChangeDate = moment(a.LastStatusChangeDate).format('DD-MM-YYYY');
                    if (a.LastStatusChangeBranchDate != null) a.LastStatusChangeBranchDate = moment(a.LastStatusChangeBranchDate).format('DD-MM-YYYY');
                    if (a.LastStatusChangeSystemDate != null) a.LastStatusChangeSystemDate = moment(a.LastStatusChangeSystemDate).format('DD-MM-YYYY');
                });
                $("#loadingImage").css("display", "none");
                console.log($scope.assetList);
            }, AMMS.handleServiceError);
        }
    $scope.checkIfAssetIsTransfered = function (assetId) {
        assetTransferReceiveService.getTransferReceiveHistory(assetId).then(function (response) {
            $scope.assetData = response.data;
            if ($scope.assetData.length > 0) {
                for (var asset = 0; asset < $scope.assetData.length; asset++) {
                    if ($scope.assetData[asset].ReceivingBranchWorkingDate != null && ($rootScope.user.Role != $rootScope.UserRole.Admin)) {
                        swal("Operation on transferred asset can only be done by admin.");
                        //$timeout(function () {
                        //    $('#saveComplete').modal('hide');
                        //    $('.modal-backdrop').remove();
                        //}, 500);
                        //$scope.execRemoveTab($scope.tab);
                        return true;
                    }
                }
            }

            return false;
        });
    }
        $scope.handleNonGeneralActions = function (actionName, item) {
            $scope.itemToDelete = item;
            if (actionName === "DELETE") {
                if ($scope.checkIfAssetIsTransfered(item.Id)) return;
                $scope.deleteAsset();
            }
        }
        $scope.Search = function () {
            $("#loadingImage").css("display", "block");
            if ($scope.filterParams.Office) $scope.filterParams.OfficeId = $scope.filterParams.Office.originalObject.Value;
            else { $("#loadingImage").css("display", "none"); swal("Please select a branch"); return; }
            if ($scope.filterParams.PurchaseDateFrom) $scope.filterParams.PurchaseDateFrom = moment($scope.filterParams.PurchaseDateFrom).format();
            if ($scope.filterParams.PurchaseDateTo) $scope.filterParams.PurchaseDateTo = moment($scope.filterParams.PurchaseDateTo).format();
            if ($scope.filterParams.LastStatusChangeFrom) $scope.filterParams.LastStatusChangeFrom = moment($scope.filterParams.LastStatusChangeFrom).format();
            if ($scope.filterParams.LastStatusChangeTo) $scope.filterParams.LastStatusChangeTo = moment($scope.filterParams.LastStatusChangeTo).format();
            if ($scope.filterParams.PurchasePriceFrom == null) $scope.filterParams.PurchasePriceFrom = -1;
            if ($scope.filterParams.PurchasePriceTo == null) $scope.filterParams.PurchasePriceTo = -1;
            $scope.filterParams.BranchId = $rootScope.selectedBranchId;
            $scope.filterParams.RoleId = $rootScope.user.Role;
            assetEntryService.Search($scope.filterParams).then(function (response) {
                console.log(response.data);
                $scope.assetList = response.data;
                $scope.assetList = $scope.assetList.filter(a => a.Status != $rootScope.AssetConfig.AssetStatus.Deleted);
                $scope.assetList.forEach(function (a) {
                    if (a.SubStatus == $rootScope.AssetConfig.AssetSubStatus.Scrapped) a.WrittenDownValueShow = 0;
                    else a.WrittenDownValueShow = Math.round(a.WrittenDownValue);
                    a.PurchaseWorkingDateS= moment(a.PurchaseWorkingDate).format('YYYY-MM-DD');
                    if (a.LastStatusChangeSystemDate != null) a.LastStatusChangeSystemDate = moment(a.LastStatusChangeSystemDate).format('DD-MM-YYYY');

                });
                if ($scope.filterParams.PurchaseDateFrom != null) $scope.filterParams.PurchaseDateFrom = new Date($scope.filterParams.PurchaseDateFrom);
                if ($scope.filterParams.PurchaseDateTo != null) $scope.filterParams.PurchaseDateTo = new Date($scope.filterParams.PurchaseDateTo);
                if ($scope.filterParams.LastStatusChangeFrom != null) $scope.filterParams.LastStatusChangeFrom = new Date($scope.filterParams.LastStatusChangeFrom);
                if ($scope.filterParams.LastStatusChangeTo != null) $scope.filterParams.LastStatusChangeTo = new Date($scope.filterParams.LastStatusChangeTo);
                if ($scope.filterParams.PurchasePriceFrom == -1) $scope.filterParams.PurchasePriceFrom = null;
                if ($scope.filterParams.PurchasePriceTo == -1) $scope.filterParams.PurchasePriceTo = null;

                $("#loadingImage").css("display", "none");
            });
        }


        $scope.deleteAsset = function () {
            if ($scope.itemToDelete.SubStatus == $rootScope.AssetConfig.AssetSubStatus.Intransit) {
                swal("In Transit Asset cannot be deleted.");
                return;
            }
            var dayDifference = moment($rootScope.workingdate).diff(moment($scope.itemToDelete.PurchaseWorkingDate), 'days');
            if ($rootScope.user.Role == $rootScope.UserRole.BM && dayDifference!=0) {
                swal("BM can delete asset only on purchase date");
                return;
            }
            if ($rootScope.user.Role == $rootScope.UserRole.RM && dayDifference >30 ) {
                swal("RM can delete asset upto 30 days from purchase date");
                return;
            }
            if ($rootScope.user.Role == $rootScope.UserRole.DM && dayDifference > 90) {
                swal("DM can delete asset upto 90 days from purchase date");
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
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.AssetEntry), "Successful!", "success");
                            $rootScope.$broadcast('asset-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.AssetEntry), response.data.Message, "error");
                        }
                    }, AMMS.handleServiceError);
                });
        };
        $scope.filterItem = function (categoryId) {
            //if (categoryId === "-100000") return;
            $scope.filterParams.ItemTypeList = [];
            $scope.categoryItems.forEach(function (c, i ) {
                if (categoryId != "-100000" && c.Id === categoryId) {c
                    $scope.filterParams.ItemTypeList.push({ Name: c.CategoryItems[i].Name, Value: c.CategoryItems[i].Id }); //= c.CategoryItems;
                } else if (categoryId === "-100000" && c.Id != "-100000") {
                    if(c)
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
        $scope.GetFilters = function() {
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
                    if ($scope.filterParams.OfficeTypeList.lenght > 1) $scope.filterParams.OfficeTypeList.push({ Name: "All", Value: "-100000" });
                }

                ////$scope.filterParams.OfficeType = "-100000";
                //if ($rootScope.user.Role == $rootScope.UserRole.Admin)
                //    $scope.filterParams.OfficeType = 3; // admin belongs to Asa Central
                $scope.filterParams.OfficeId = $rootScope.selectedBranchId;
                if ($scope.filterParams.OfficeId > 0) $scope.filterParams.OfficeType = $scope.filterParams.OfficeTypeList[0].Value;
                else if ($scope.filterParams.OfficeId < 0) $scope.filterParams.OfficeType = 3; //  Asa Central
                else $scope.filterParams.OfficeId = 2; // field administration
                

                $scope.UpdateOfficeType();

                $scope.Search(); // initail call in search 
                //$scope.filterOfficeList($scope.filterParams.OfficeType);
                if ($scope.filterParams.OfficeType == "-100000") $scope.BranchList = $scope.BranchListMain;
                else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == $scope.filterParams.OfficeType);

            });


            assetEntryService.GetFilters().then(function (response) {
                console.log(response.data);
                $scope.filterParams.SubStatusList = response.data.AssetSubStatus;
                $scope.flagListMain = angular.copy(response.data.AssetSubStatus);
                $scope.flagListMain.push({ Name: "All", Value: "0" });
                $scope.filterParams.SubStatusList.push({Name: "All", Value: "0"});
                $scope.filterParams.SubStatusList = $scope.filterParams.SubStatusList.filter(f => f.Value != $rootScope.AssetConfig.AssetSubStatus.Deleted ||
                     f.Value != $rootScope.AssetConfig.AssetSubStatus.Disposed);
                $scope.filterParams.SubStatus = "0";

                $scope.filterParams.StatusList = response.data.AssetStatus;
                $scope.filterParams.StatusList.push({ Name: "All", Value: "0" });
                $scope.filterParams.StatusList = $scope.filterParams.StatusList.filter(f => f.Value == $rootScope.AssetConfig.AssetStatus.Active ||
                    f.Value == $rootScope.AssetConfig.AssetStatus.Inactive || f.Value == "0");
                $scope.filterParams.Status = "0";

                $scope.filterParams.AssetTypeList = response.data.AssetType;
                $scope.filterParams.AssetTypeList.push({ Name: "All", Value: "-100000" });
                $scope.filterParams.AssetType = "-100000";
                
                
            });

            
            assetTypeService.GetAll().then(function (response) {
                $scope.itemListMain = angular.copy(response.data);

                assetEntryService.categoryFilters().then(function (response) {
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

                
           // });            
        }

        $scope.filterItemByCategory = function(categoryId) {
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
    $scope.init2=function() {
        //$scope.GetAll();
        $scope.Search();
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

    $scope.init();

    $scope.dateOptions = {
        dateDisabled: disabled,
        initDate: new Date($rootScope.workingdate),
        formatYear: 'yy',
        //maxDate: new Date(2099, 5, 22),
        //minDate: new Date($rootScope.workingdate),
        startingDay: 1,
        showWeeks: false
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

}]);