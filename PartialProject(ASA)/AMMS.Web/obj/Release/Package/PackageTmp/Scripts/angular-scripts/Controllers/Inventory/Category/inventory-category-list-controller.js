ammsAng.controller('inventoryCategoryListController', ['$scope', '$rootScope', 'inventoryCategoryService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, inventoryCategoryService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder,DTColumnDefBuilder) {

        $scope.commandList = [];
        $scope.itemTypeList = [];
        $scope.hasNonGeneralCommands = false;

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10);

        $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(1)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(2)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(3)
            .withOption("bSearchable", true)
        //DTColumnDefBuilder.newColumnDef(4)
        //    .withOption("bSearchable", true)

        ];
        $scope.init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;

                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
                $scope.getAllCategories();
            }, AMMS.handleServiceError);
        }
        $scope.getAllCategories = function () {
            $("#loadingImage").css("display", "block");
            inventoryCategoryService.getAll().then(function (response) {
                $scope.categories = response.data;
                console.log($scope.categories);
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }
        //$scope.init();

        $scope.handleNonGeneralActions = function (actionName, category) {
            $scope.categoryToDelete = category;
            if (actionName === "DELETE") {
                $scope.deleteCategory();
            }
        }

        $scope.IsCategoryInItemType = function() {
            inventoryCategoryService.ifItemExistForCategory($scope.categoryToDelete.Id).then(function (response) {
                if (response.data.Success) {
                    //swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.InventoryCategory), "Successful!", "success");
                    //$rootScope.$broadcast('inventoryCategory-delete-finished');
                    $scope.isAvailableToDelete = response.data;
                    if (!$scope.isAvailableToDelete) {
                        swal("Cannot Delete Category. It is attached to an item type.");
                        return true;
                    }
                    return false;
                }

            }, AMMS.handleServiceError);
        }

        $scope.deleteCategory = function () {
            if ($scope.IsCategoryInItemType()) return;
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.InventoryCategory),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    inventoryCategoryService.delete($scope.categoryToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.InventoryCategory), "Successful!", "success");
                            $rootScope.$broadcast('inventoryCategory-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.InventoryCategory), response.data.Message, "error");
                        }

                    }, AMMS.handleServiceError);
                });
        };
        $scope.init();
        $scope.$on('inventoryCategory-add-finished', function () {
            $scope.getAllCategories();
        });

        $scope.$on('inventoryCategory-edit-finished', function () {
            $scope.getAllCategories();
        });


        $scope.$on('inventoryCategory-delete-finished', function () {
            $scope.getAllCategories();
        });

        //$scope.exportData = function () {
        //    var url = commonService.getExportUrl($rootScope.assetApiBaseUrl + 'category/export', '~NA~', 'Asset-Category');
        //    window.open(url, '_blank');
        //}

    }]);