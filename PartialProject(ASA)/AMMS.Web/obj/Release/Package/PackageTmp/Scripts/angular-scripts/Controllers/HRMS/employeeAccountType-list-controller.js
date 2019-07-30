ammsAng.controller('employeeAccountTypeListController', ['$scope', '$rootScope', 'employeeService', 'commonService', '$timeout',
    function ($scope, $rootScope, employeeService, commonService, $timeout) {

        $scope.commandList = [];
        $scope.employeeAccountTypeList = [];
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        };

        $scope.init = function () {
            $scope.getAccountTypes();
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                if ($scope.commandList.find(c => !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            });
        }
        $scope.$on('employeeAccountType-add-finished', function () {
            $scope.getAccountTypes();
        });

        $scope.$on('employeeAccountType-edit-finished', function () {
            $scope.getAccountTypes();
        });


        $scope.$on('employeeAccountType-delete-finished', function () {
            $scope.getAccountTypes();
        });

        $scope.handleNonGeneralActions = function (actionName, employeeAccountType) {
            $scope.employeeAccountTypeToDelete = employeeAccountType;
            if (actionName === "DELETE") {
                $scope.deleteEmployeeAccountType();
            }
        }

        $scope.deleteEmployeeAccountType = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.employeeAccountType),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    employeeService.deleteAccountTypeById($scope.employeeAccountTypeToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.employeeAccountType), "Successful!", "success");
                            $rootScope.$broadcast('employeeAccountType-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.employeeAccountType), "", "error");
                        }

                    });
                });
        };

        $scope.getAccountTypes = function () {
            $("#loadingImage").css("display", "block");
            employeeService.getAccountTypes($rootScope.user.Role, $rootScope.selectedBranchId).then(function (response) {
                $scope.employeeAccountTypeList = response.data;
                $scope.employeeAccountTypeList.forEach(function (e) {
                    e.EffectiveDateFrom = moment(e.EffectiveDateFrom).format('DD/MM/YYYY');
                    if (e.EffectiveDateTo != null) e.EffectiveDateTo = moment(e.EffectiveDateTo).format('DD/MM/YYYY');
                });
                console.log(response.data);
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            });
        }
        $scope.init();
    }
]);