ammsAng.controller('userAdminAddController', ['$scope', '$rootScope', '$timeout', 'filterService', 'userAdminService',
    function ($scope, $rootScope, $timeout, filterService, userAdminService) {
        $scope.isDirty = false;
        $scope.userToAdd = { Active: true };
        $scope.employees = [];
        $scope.roleList = [];
        $scope.selectedRoles = [];
        $scope.selectedEmployee = {};

        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value'
            //smartButtonMaxItems: 5
        }

        $scope.remoteRequestUrlFormatterFn = function () {
            return $rootScope.commonApiBaseUrl + 'filters/hrms/employees/search';
        }

        $scope.remoteUrlRequestFn = function (str) {
            return { query: Encrypt.encrypt(str), branchId: Encrypt.encrypt($rootScope.selectedBranchId), role: Encrypt.encrypt($rootScope.user.Role) };
        }
        
        $scope.remoteRequestHeaderFn = function () {
            return $rootScope.headersWithoutLog;
        }

        $scope.onUserSelected = function (selected) {
            if (!selected)return;
            if (selected.originalObject.Exists) {
                alert('This employee is already an user to this system. Please select a different user');
                return;
            }
            $scope.selectedEmployee = selected;
        }

        $scope.getRoles = function () {
            $scope.roleList = [];
            $scope.selectedRoles = [];
            filterService.getRoles().then(function (response) {
                $scope.roleList = angular.copy(response.data);
                if ($rootScope.user.Role == $rootScope.UserRole.Admin || $rootScope.user.Role == $rootScope.UserRole.HRAdmin || $rootScope.user.Role == $rootScope.UserRole.SuperAdmin || $rootScope.user.Role == $rootScope.UserRole.OperationsAdmin) {
                    $scope.roleList = angular.copy(response.data);
                }
                if ($rootScope.user.Role == $rootScope.UserRole.ZM) {
                    $scope.roleList = angular.copy(response.data);
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'HR Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Operations Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Super Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'ZM');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'HR');
                    //$scope.roleList = $scope.roleList.filter(x => x.Value != $rootScope.UserRole.HRAdmin && x.Value != $rootScope.UserRole.Admin && x.Value != $rootScope.UserRole.OperationsAdmin && x.Value != $rootScope.UserRole.SuperAdmin);

                }
                if ($rootScope.user.Role == $rootScope.UserRole.DM) {
                    $scope.roleList = angular.copy(response.data);
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'HR Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Operations Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Super Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'ZM');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'DM');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'HR');
                }
                if ($rootScope.user.Role == $rootScope.UserRole.RM) {
                    $scope.roleList = angular.copy(response.data);
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'HR Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Operations Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Super Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'ZM');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'DM');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'RM');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'HR');
                }
                if ($rootScope.user.Role == $rootScope.UserRole.BM) {
                    $scope.roleList = angular.copy(response.data);
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'HR Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Operations Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'Super Admin');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'ZM');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'DM');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'RM');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'BM');
                    $scope.roleList = $scope.roleList.filter(x => x.Name != 'HR');
                }
            });
        }

        $scope.passwordValidator = function (password) {
            if (!password)
                return 'Password field is mandatory';

            var lower = /[a-z]/;
            var upper = /[A-Z]/;
            var digit = /[0-9]/;
            var special = /[~!@#$%^&*]/;

            if (password.length < 6 || password.length > 20)
                return 'Password length must be between 6 to 20';
            if (!lower.test(password))
                return 'Password must contains at least one lower case letter';
            if (!upper.test(password))
                return 'Password must contains at least one upper case letter';
            if (!digit.test(password))
                return 'Password must contains at least one digit (0 to 9)';
            if (!special.test(password))
                return 'Password must contains at least one spceial character';
            if (password.indexOf(' ') > -1)
                return 'Password cannot contain white space';
            //if (password.indexOf($scope.selectedEmployee.originalObject.Value) > -1)
            //    return 'Password cannot contain employee id';
            return true;
        }

        $scope.confirmPasswordValidator = function (password) {
            if (!password)
                return 'Password confirmation field is mandatory';
            if (password !== $scope.userToAdd.Password)
                return 'Confirm password is not matched with password';
            return true;
        }

        $scope.addUser = function () {
            if (!$scope.selectedEmployee.originalObject) {
                swal('No Employee is selected!', 'Please select an Employee before proceeding', "warning");
                return;
            }
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.userT),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
           function (isConfirmed) {
               if (isConfirmed) {
                   $scope.userToAdd.RoleIds = $scope.selectedRoles.map(function (item) { return item.id; });
                   $scope.userToAdd.EmployeeId = $scope.selectedEmployee.originalObject.Value;
                   $scope.userToAdd.Password = Encrypt.encrypt($scope.userToAdd.Password);
                   userAdminService.addUser($scope.userToAdd)
                       .then(function (response) {
                           if (response.data.Success) {
                               $rootScope.$broadcast('user-add-finished');
                               swal({
                                   title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.userT),
                                       text: "What do you want to do next?",
                                       type: "success",
                                       showCancelButton: true,
                                       confirmButtonColor: "#008000",
                                       confirmButtonText: "Add New",
                                       cancelButtonText: "Close and Exit",
                                       closeOnConfirm: true,
                                       closeOnCancel: true
                                   },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            $scope.userAddForm.reset();
                                            $scope.userAddForm.$dirty = false;
                                            $timeout(function () { $scope.clearModelData(); }, 300);
                                        } else {
                                            $timeout(function () { $scope.clearAndCloseTab(); }, 300);
                                        }
                                });
                           } else {
                               swal($rootScope.showMessage($rootScope.addError, $rootScope.userT), response.data.Message, "error");
                           }
                       });
               }
           });
        }

        $scope.clearSearch = function() {
            $rootScope.$broadcast('angucomplete-alt:clearInput', 'employeeId');
            $scope.selectedEmployee = {};
        }

        $scope.clearModelData = function () {
            $rootScope.$broadcast('angucomplete-alt:clearInput', 'employeeId');
            $scope.userToAdd = { Active: true };
            $scope.selectedRoles = [];
            $scope.selectedEmployee = {};
        }

        $scope.clearAndCloseTab = function () {
            $rootScope.$broadcast('angucomplete-alt:clearInput', 'employeeId');
            $scope.userToAdd = { Active: true };
            $scope.selectedRoles = [];
            $scope.selectedEmployee = {};
            $scope.removeTab($scope.tab);
        };

        $scope.$on('tab-switched', function () {
            $scope.init();
        });

        $scope.init = function () {
            $scope.getRoles();
        }

        $scope.init();
    }
]);