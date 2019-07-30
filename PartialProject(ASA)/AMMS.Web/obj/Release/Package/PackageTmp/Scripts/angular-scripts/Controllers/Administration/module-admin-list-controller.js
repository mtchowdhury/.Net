ammsAng.controller('moduleAdminListController', ['$scope', '$rootScope', '$timeout', 'moduleAdminService', 'commonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, $timeout, moduleAdminService, commonService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.moduleList = [];
        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
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
            .withOption("bSearchable", true)
        ];
        $scope.moduleToDelete = null;
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }

        $scope.getModules = function () {
            $("#loadingImage").css("display", "block");
            moduleAdminService.getModules().then(function (response) {
                $scope.moduleList = response.data;
                $("#loadingImage").css("display", "none");
                $timeout(function() {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);                
            });
        }

        $scope.handleNonGeneralActions = function (actionName, module) {
            $scope.moduleToDelete = module;
            if (actionName === "DELETE") {
                $scope.deleteModule();
            }
        }

        $scope.$on('module-add-finished', function () {
            $scope.getModules();
            $scope.getMenus();
            //$scope.removeAllTab();
            });

        $scope.$on('module-edit-finished', function () {
            $scope.getModules();
            $scope.getMenus();
            //$scope.removeAllTab();
        });


        $scope.$on('module-delete-finished', function () {
            $scope.getModules();
            $scope.getMenus();
            //$scope.removeAllTab();
        });

        $scope.deleteModule = function () {
            swal({
                    title: "Confirm?",
                    text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.module),
                    type: "info",
                    closeOnConfirm: false,
                    showCancelButton: true,
                    showLoaderOnConfirm: true
                },
                function() {
                    moduleAdminService.deleteModule($scope.moduleToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.module), "Successful!", "success");
                            $rootScope.$broadcast('module-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.module), "", "error");
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
                $scope.getModules();
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