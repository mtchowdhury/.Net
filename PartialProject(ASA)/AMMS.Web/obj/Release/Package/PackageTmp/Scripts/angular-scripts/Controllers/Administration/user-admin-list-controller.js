ammsAng.controller('userAdminListController', ['$scope', '$rootScope', '$timeout', 'userAdminService', 'commonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, $timeout, userAdminService, commonService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.userList = [];
        $scope.commandList = [];
        $scope.branchList = null;
        $scope.selectedBranchForUserList = null;
        $scope.hasNonGeneralCommands = false;
        $scope.exportResult = [];
        console.log($rootScope.user);
        $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10);

        $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0)
            .withOption("bSearchable", false),
        DTColumnDefBuilder.newColumnDef(1)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(2)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(3)
            .withOption("bSearchable", true)
        ];
        $scope.roleToDelete = null;
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }

        $scope.getUsers = function (branchId) {
            $("#loadingImage").css("display", "block");
            if (!branchId) {
                $("#loadingImage").css("display", "none");
                return;
            }
            userAdminService.getUsers($rootScope.user.Role, $rootScope.user.EmployeeId, branchId).then(function (responseUsers) {
                $scope.userList = angular.copy(responseUsers.data);
                if ($rootScope.user.Role == $rootScope.UserRole.Admin || $rootScope.user.Role == $rootScope.UserRole.HRAdmin || $rootScope.user.Role == $rootScope.UserRole.SuperAdmin || $rootScope.user.Role == $rootScope.UserRole.OperationsAdmin) {
                    $scope.userList = angular.copy(responseUsers.data);
                    $scope.userList = $scope.userList;
                }
                if ($rootScope.user.Role == $rootScope.UserRole.ZM) {
                    $scope.userList = angular.copy(responseUsers.data);
                    $scope.userList = $scope.userList.filter(x => x.RoleNames != 'HR Admin' && x.RoleNames != 'Admin' && x.RoleNames != 'Super Admin' && x.RoleNames != 'Operations Admin');
                }
                if ($rootScope.user.Role == $rootScope.UserRole.DM) {
                    $scope.userList = angular.copy(responseUsers.data);
                    $scope.userList = $scope.userList.filter(x => x.RoleNames != 'HR Admin' && x.RoleNames != 'Admin' && x.RoleNames != 'Super Admin' && x.RoleNames != 'Operations Admin' && x.RoleNames != 'ZM');
                }
                if ($rootScope.user.Role == $rootScope.UserRole.RM) {
                    $scope.userList = angular.copy(responseUsers.data);
                    $scope.userList = $scope.userList.filter(x => x.RoleNames != 'HR Admin' && x.RoleNames != 'Admin' && x.RoleNames != 'Super Admin' && x.RoleNames != 'Operations Admin' && x.RoleNames != 'ZM' && x.RoleNames != 'DM');
                }
                if ($rootScope.user.Role == $rootScope.UserRole.BM) {
                    $scope.userList = angular.copy(responseUsers.data);
                    $scope.userList = $scope.userList.filter(x => x.RoleNames != 'HR Admin' && x.RoleNames != 'Admin' && x.RoleNames != 'Super Admin' && x.RoleNames != 'Operations Admin' && x.RoleNames != 'ZM' && x.RoleNames != 'DM' && x.RoleNames != 'RM');
                }
                //scope.userList = scope.userList.filter(x=>x.RoleNames)
                //$scope.userList = responseUsers.data;
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            });
        }

        $scope.handleNonGeneralActions = function (actionName, user) {
            $scope.roleToDelete = user;
            if (actionName === "DELETE") {
                $scope.deleteUser();
            }
        }

        $scope.$on('user-add-finished', function () {
            $rootScope.dataLoadedFirstTime = false;
            $scope.getUsers($scope.selectedBranchId);
        });

        $scope.$on('user-edit-finished', function () {
            $rootScope.dataLoadedFirstTime = false;
            $scope.getUsers($scope.selectedBranchId);
        });


        $scope.$on('user-delete-finished', function () {
            $rootScope.dataLoadedFirstTime = false;
            $scope.getUsers($scope.selectedBranchId);
        });

        $scope.deleteUser = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.userT),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    userAdminService.deleteUser($scope.roleToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.userT), "Successful!", "success");
                            $rootScope.$broadcast('user-delete-finished');
                        } else {
                            swal($rootScope.showMessage(response.data.Message, $rootScope.userT), "", "error");
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

                console.log($scope.commandList);

                $scope.getAllBranch();

            });

        };
        $scope.getAllBranch = function () {
            //userAdminService.getAllBranch().then(function (response) {
            //    $scope.branchList = response.data;
            //    $scope.selectedBranchForUserList = $scope.selectedBranchId;
            //    $scope.getUsers($scope.selectedBranchForUserList);
            //});

            commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, $rootScope.user.Role).then(function (response) {
                $scope.supervisedBranches = angular.copy(response.data);
                $scope.supervisedBranches = $scope.supervisedBranches.filter(function (el) {
                    return el.Value !== -100000;
                });
                if ($rootScope.user.Role == '2') {
                    $scope.getUsers($rootScope.selectedBranchId);
                } else {
                    $scope.getUsers($scope.selectedBranchForUserList);
                }
                
                //console.log($rootScope.supervisedBranches);
            }, AMMS.handleServiceError);
        }

        //$scope.exportData = function () {
        //    userAdminService.getExportReportResult($scope.tab.PropertyId).then(function (responseResult) {
        //        $scope.exportResult = responseResult.data;
        //    });
        //    window.open($rootScope.apiBaseUrl + "Export/GetEmployees?reportName=" + Encrypt.encrypt($scope.exportResult[0].Name), "_blank");
        //}
        $scope.Init();
    }]);