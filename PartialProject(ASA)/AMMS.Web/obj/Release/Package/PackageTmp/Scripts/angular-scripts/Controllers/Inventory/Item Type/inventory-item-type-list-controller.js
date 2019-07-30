ammsAng.controller('inventoryItemTypeListController', ['$scope', '$rootScope', 'inventoryTypeService', 'commonService', '$timeout', 'DTOptionsBuilder',
    function ($scope, $rootScope, inventoryTypeService, commonService, $timeout, DTOptionsBuilder) {


        $scope.$on('inventory-item-type-add-finished', function () {
            $scope.GetAll();
        });
        $scope.$on('inventory-item-type-edit-finished', function () {

            $scope.GetAll();
        });
        $scope.$on('inventory-item-type-delete-finished', function () {
            $scope.GetAll();
        });

        $scope.getCommands = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;

                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            }, AMMS.handleServiceError);
        }


        $scope.GetAll = function () {
            $("#loadingImage").css("display", "block");
            inventoryTypeService.GetAll().then(function (response) {
                $scope.itemTypeList = response.data;
                $scope.itemTypeList.forEach(function(item) {
                    item.CategoryName = $scope.categoryList.find(c => c.Value == item.CategoryId).Name;
                });
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }

        $scope.handleNonGeneralActions = function (actionName, item) {
            $scope.itemToDelete = item;
            if (actionName === "DELETE") {
                $scope.deleteItem();
            }
        }

        $scope.deleteItem = function () {
           // if (!$rootScope.isDayOpenOrNot()) return;
            swal({
                title: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.InventoryItemType),
                showCancelButton: true,
                confirmButtonText: "Yes, Delete it!",
                cancelButtonText: "No, Cancel Please!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function () {
                    inventoryTypeService.delete($scope.itemToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.InventoryItemType), "Successful!", "success");
                            $rootScope.$broadcast('inventory-item-type-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.InventoryItemType), response.data.Message, "error");
                        }
                    }, AMMS.handleServiceError);
                });
        };

        //$scope.exportData = function () {
        //    var url = commonService.getExportUrl($rootScope.assetApiBaseUrl + 'itemtype/export', '~NA~', 'Asset-ItemType');
        //    window.open(url, '_blank');
        //}
        $scope.getFilterData = function () {
            inventoryTypeService.getFiltersData().then(function (response) {
                console.log(response.data);
                $scope.itemTypeStatusList = response.data.StatusList.filter(s=>s.Value == $rootScope.InventoryConfig.ItemTypeStatus.Active);
                $scope.categoryListWithPermittedValues = response.data.CategoryListWithPerimittedOffice;
                $scope.categoryList = response.data.CategoryList;
                $scope.existingItemTypeNameList = response.data.NameList;
                $scope.existingItemTypeShortNameList = response.data.ShortNameList;
                $scope.officeTypeList = response.data.OfficeTypeList;
                $scope.GetAll();
            });
        }
        $scope.init = function () {
            $scope.commandList = [];
            $scope.itemTypeList = [];
            $scope.hasNonGeneralCommands = false;
            $scope.getCommands();
            $scope.getFilterData();
            
        }

        $scope.init();

    }]);