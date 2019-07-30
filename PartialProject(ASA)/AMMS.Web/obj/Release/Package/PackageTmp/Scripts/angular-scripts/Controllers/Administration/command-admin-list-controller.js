ammsAng.controller('commandAdminListController', ['$scope', '$rootScope', '$timeout', 'commandAdminService', 'commonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, $timeout, commandAdminService, commonService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.mcommandList = [];
        $scope.commandList = [];
        $scope.exportResult = [];
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
            .withOption("bSearchable", true)
        ];
        $scope.commandToDelete = null;
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }

        $scope.getCommands = function () {
            $("#loadingImage").css("display", "block");
            commandAdminService.getCommands().then(function (response) {
                $scope.mcommandList = response.data;
                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.mcommandList[1]);
                console.log($scope.mcommandList);
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            });
        }

        $scope.handleNonGeneralActions = function (actionName, command) {
            $scope.commandToDelete = command;
            if (actionName === "DELETE") {
                $scope.deleteCommand();
            }
        }

        $scope.$on('command-add-finished', function () {
            $scope.getCommands();
            $scope.getMenus();
            //$scope.removeAllTab();
        });

        $scope.$on('command-edit-finished', function () {
            $scope.getCommands();
            $scope.getMenus();
            //$scope.removeAllTab();
        });


        $scope.$on('command-delete-finished', function () {
            $scope.getCommands();
            $scope.getMenus();
            //$scope.removeAllTab();
        });

        $scope.deleteCommand = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.command),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    commandAdminService.deleteCommand($scope.commandToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.command), "Successful!", "success");
                            $rootScope.$broadcast('command-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.command), "", "error");
                        }

                    });
                });
        };

        $scope.Init = function () {
            $scope.getCommands();
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            });

        };

        $scope.exportData = function () {
            commandAdminService.getExportReportResult($scope.tab.PropertyId).then(function (responseResult) {
                $scope.exportResult = responseResult.data;
            });
            window.open($rootScope.apiBaseUrl + "Export/GetEmployees?reportName=" + Encrypt.encrypt($scope.exportResult[0].Name), "_blank");
        }
        $scope.Init();
    }]);