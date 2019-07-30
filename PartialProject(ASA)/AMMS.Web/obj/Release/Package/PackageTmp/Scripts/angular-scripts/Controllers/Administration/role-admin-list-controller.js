ammsAng.controller('roleAdminListController', ['$scope', '$rootScope', '$timeout', 'roleAdminService', 'commonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, $timeout, roleAdminService, commonService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.roles = [];
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
            .withOption("bSearchable", true)
        ];
        $scope.roleToDelete = null;
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }

        $scope.getRoles = function () {
            $("#loadingImage").css("display", "block");
            roleAdminService.getRoles().then(function (response) {
                $scope.roles = response.data;
                $("#loadingImage").css("display", "none");
                $timeout(function() {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);                
            });
        }

        $scope.handleNonGeneralActions = function (actionName, role) {
            $scope.roleToDelete = role;
            if (actionName === "DELETE") {
                $scope.deleteRole();
            }
        }

        $scope.$on('role-add-finished', function () {
            $scope.getRoles();
            $scope.getMenus();
            });

        $scope.$on('role-edit-finished', function () {
            $scope.getRoles();
            $scope.getMenus();
        });


        $scope.$on('role-delete-finished', function () {
            $scope.getRoles();
            $scope.getMenus();
        });

        $scope.deleteRole = function () {
            swal({
                    title: "Confirm?",
                    text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.role),
                    type: "info",
                    closeOnConfirm: false,
                    showCancelButton: true,
                    showLoaderOnConfirm: true
                },
                function() {
                    roleAdminService.deleteRole($scope.roleToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.role), "Successful!", "success");
                            $rootScope.$broadcast('role-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.role), "", "error");
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
                $scope.getRoles();
            });
            
        };

        $scope.exportData = function () {
            roleAdminService.getExportReportResult($scope.tab.PropertyId).then(function (responseResult) {
                $scope.exportResult = responseResult.data;
            });
            window.open($rootScope.apiBaseUrl + "Export/GetEmployees?reportName=" + Encrypt.encrypt($scope.exportResult[0].Name), "_blank");
        }
        $scope.Init();
    }]);