ammsAng.controller('propertyAdminListController', ['$scope', '$rootScope', '$timeout', 'propertyAdminService', 'commonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, $timeout, propertyAdminService, commonService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.propertyList = [];
        $scope.commandList = [];
        $scope.hasNonGeneralCommands = false;
        $scope.exportResult = [];
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
        ];
        $scope.propertyToDelete = null;
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }

        $scope.getProperties = function () {
            $("#loadingImage").css("display", "block");
            propertyAdminService.getProperties().then(function (response) {
                $scope.propertyList = response.data;
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            });
        }

        $scope.handleNonGeneralActions = function (actionName, property) {
            $scope.propertyToDelete = property;
            if (actionName === "DELETE") {
                $scope.deleteProperty();
            }
        }

        $scope.$on('property-add-finished', function () {
            $scope.getProperties();
            $scope.getMenus();
            //$scope.removeAllTab();
        });

        $scope.$on('property-edit-finished', function () {
            $scope.getProperties();
            $scope.getMenus();
            //$scope.removeAllTab();
        });


        $scope.$on('property-delete-finished', function () {
            $scope.getProperties();
            $scope.getMenus();
           // $scope.removeAllTab();
        });

        $scope.deleteProperty = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.property),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    propertyAdminService.deleteProperty($scope.propertyToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.property), "Successful!", "success");
                            $rootScope.$broadcast('property-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.property), "", "error");
                        }

                    });
                });
        };

        $scope.Init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;

                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
                $scope.getProperties();
            });

        };

        $scope.exportData = function () {
            moduleAdminService.getExportReportResult($scope.tab.PropertyId).then(function (responseResult) {
                $scope.exportResult = responseResult.data;
            });
            window.open($rootScope.apiBaseUrl + "Export/GetEmployees?reportName=" + Encrypt.encrypt($scope.exportResult[0].Name), "_blank");
        }
        $scope.Init();
    }]);