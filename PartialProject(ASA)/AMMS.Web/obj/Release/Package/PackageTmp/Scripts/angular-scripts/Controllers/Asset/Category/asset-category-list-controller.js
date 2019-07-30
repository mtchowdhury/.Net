ammsAng.controller('assetCategoryListController', ['$scope', '$rootScope', 'assetCategoryService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder',
    function ($scope, $rootScope, assetCategoryService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder) {

        var init = function () {
            $scope.commandList = [];
            $scope.itemTypeList = [];
            $scope.hasNonGeneralCommands = false;
            $scope.getAllCategories();
        }
        $scope.getAllCategories = function () {
            $("#loadingImage").css("display", "block");
            assetCategoryService.getAll().then(function (response) {
                $scope.categories = response.data;
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }
        init();
        commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
            $scope.commandList = responseCommand.data;

            $scope.customCommandList = [];

            $scope.customCommandList.push($scope.commandList[1]);
            if ($scope.commandList.find(c=> !c.IsGeneral))
                $scope.hasNonGeneralCommands = true;
        }, AMMS.handleServiceError);

       

        

        $scope.handleNonGeneralActions = function (actionName, category) {
            $scope.categoryToDelete = category;
            if (actionName === "DELETE") {
                $scope.deleteCategory();
            }
        }

        $scope.deleteCategory = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.AssetCategory),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    assetCategoryService.delete($scope.categoryToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.AssetCategory), "Successful!", "success");
                            $rootScope.$broadcast('assetCategory-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.AssetCategory), response.data.Message, "error");
                        }

                    }, AMMS.handleServiceError);
                });
        };
        $scope.$on('assetCategory-add-finished', function () {
            $scope.getAllCategories();
        });

        $scope.$on('assetCategory-edit-finished', function () {
            $scope.getAllCategories();
        });


        $scope.$on('assetCategory-delete-finished', function () {
            $scope.getAllCategories();
        });

        $scope.exportData = function () {
            var url = commonService.getExportUrl($rootScope.assetApiBaseUrl + 'category/export', '~NA~', 'Asset-Category');
            window.open(url, '_blank');
        }

    }]);