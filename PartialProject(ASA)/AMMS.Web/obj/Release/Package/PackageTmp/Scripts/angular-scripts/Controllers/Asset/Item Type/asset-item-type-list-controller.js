ammsAng.controller('assetItemTypeListController', ['$scope', '$rootScope', 'assetTypeService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder',
    function ($scope, $rootScope, assetTypeService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder) {


        $scope.$on('itemtype-edit-finished', function () {
            $scope.GetAll();
        });
        $scope.$on('itemtype-add-finished', function () {

            $scope.GetAll();
        });
        $scope.$on('itemtype-delete-finished', function () {
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
            assetTypeService.GetAll().then(function (response) {
                $scope.itemTypeList = response.data;
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
                title: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.AssetItemType),
                showCancelButton: true,
                confirmButtonText: "Yes, Delete it!",
                cancelButtonText: "No, Cancel Please!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function () {
                    assetTypeService.delete($scope.itemToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.AssetItemType), "Successful!", "success");
                            $rootScope.$broadcast('itemtype-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.AssetItemType), response.data.Message, "error");
                        }
                    }, AMMS.handleServiceError);
                });
        };

        $scope.exportData = function () {
            var url = commonService.getExportUrl($rootScope.assetApiBaseUrl + 'itemtype/export', '~NA~', 'Asset-ItemType');
            window.open(url, '_blank');
        }

        $scope.init = function () {
            $scope.commandList = [];
            $scope.itemTypeList = [];
            $scope.hasNonGeneralCommands = false;
            $scope.getCommands();
            $scope.GetAll();
        }

        $scope.init();

    }]);