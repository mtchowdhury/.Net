ammsAng.controller('userAdminEditController', ['$scope', '$rootScope', '$timeout', 'filterService', 'userAdminService',
    function ($scope, $rootScope, $timeout, filterService, userAdminService) {
        if ($rootScope.user.EmployeeId == $rootScope.editEmpId) {

            $scope.isActiveForEdit = false;
            $scope.init = function () {
                $scope.editPassword = false;
                $scope.userToEdit = {};
                $scope.employees = [];
                $scope.roleEditList = [];
                $scope.selectedEditRoles = [];
                $scope.selectedEditEmployee = {};
                $scope.getRoles();
            }

            $scope.dropdownSetting = {
                scrollable: true,
                scrollableHeight: '200px',
                displayProp: 'Name',
                idProp: 'Value'
                //smartButtonMaxItems: 5
            }

            $scope.getRoles = function () {
                filterService.getRoles().then(function (response) {
                    $scope.roleEditList = response.data;
                    $scope.getUser($rootScope.editUserId);
                });
            }
            $scope.checkIfpasswordIsSame = function (user) {
                if (user.OldPassword == user.Password) {
                        swal("Old and New Password Cannot be the Same.");
                        return true;
                }
                    return false;
            }

            $scope.getUser = function (id) {
                userAdminService.getUser(id)
                    .then(function (response) {
                        $scope.userToEdit = angular.copy(response.data);
                        $scope.userToEdit.OldPassword = $scope.userToEdit.Password;
                        $scope.selectedEditRoles = response.data.RoleIds.map(function (a) { return { id: a } });
                        userAdminService.getUserPasswords($scope.userToEdit.EmployeeId, $scope.userToEdit.OldPassword).then(function(response) {
                            $scope.passwords = response.data;
                        });
                    });
            }
            $scope.checkIfpasswordIsMatched = function (user) {
                for (var i = 0; i < $scope.passwords.length; i++) {
                    if (user.Password == $scope.passwords[i].Password) {
                        swal("Previous 1 Password Cannot be your Password.");
                        return true;
                    }
                }
                return false;
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
                return true;
            }

            $scope.confirmPasswordValidator = function (password) {
                if (!password)
                    return 'Password confirmation field is mandatory';
                if (password !== $scope.userToEdit.Password)
                    return 'Confirm password is not matched with password';
                return true;
            }

            $scope.editUser = function () {
                if ($scope.checkIfpasswordIsSame($scope.userToEdit)) return;
                if ($scope.checkIfpasswordIsMatched($scope.userToEdit)) return;
                swal({
                    title: "Confirm?",
                    text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.userT),
                    showCancelButton: true,
                    confirmButtonText: "Yes, Edit it!",
                    cancelButtonText: "No, cancel!",
                    type: "info",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                },
               function (isConfirmed) {
                   if (isConfirmed) {
                       $scope.userToEdit.RoleIds = $scope.selectedEditRoles.map(function (item) { return item.id; });
                       $scope.userToEdit.Password = Encrypt.encrypt($scope.userToEdit.Password);
                       userAdminService.editUser($scope.userToEdit)
                           .then(function (response) {
                               if (response.data.Success) {
                                   $rootScope.$broadcast('user-edit-finished');
                                   swal({
                                       title: "Successfull!",
                                       text: $rootScope.showMessage($rootScope.editSuccess, $rootScope.userT),
                                       type: "success",
                                       showCancelButton: false,
                                       confirmButtonColor: "#008000",
                                       confirmButtonText: "OK",
                                       //cancelButtonText: "Close and Exit",
                                       closeOnConfirm: true,
                                       closeOnCancel: true
                                   },
                                        function (isConfirm) {
                                            if (isConfirm) {
                                                //$scope.clearAndCloseTab();
                                                document.getElementById('logoutForm').submit();
                                            } else {
                                                $scope.clearAndCloseTab();
                                            }
                                        });
                               } else {
                                   swal($rootScope.showMessage($rootScope.editError, $rootScope.userT), response.data.Message, "error");
                               }
                           });
                   }
               });
            }

            $scope.clearAndCloseTab = function () {
                $scope.removeTab($scope.tab);
            };

            $scope.$on('tab-switched', function () {
                $scope.init();
            });



            $scope.init();

        } else {
            //swal("Cannot Edit Another User's Account.");
            //$timeout(function () {
            //    $('#saveComplete').modal('hide');
            //    $('.modal-backdrop').remove();
            //}, 500);
            //$scope.execRemoveTab($scope.tab);
            $scope.isActiveForEdit = true;
            $scope.isActiveForEditPassword = false;
            $scope.init = function () {
                $scope.editPassword = false;
                $scope.userToEdit = {};
                $scope.employees = [];
                $scope.roleEditList = [];
                $scope.selectedEditRoles = [];
                $scope.selectedEditEmployee = {};
                $scope.getRoles();
            }

            $scope.dropdownSetting = {
                scrollable: true,
                scrollableHeight: '200px',
                displayProp: 'Name',
                idProp: 'Value'
                //smartButtonMaxItems: 5
            }

            $scope.getRoles = function () {
                filterService.getRoles().then(function (response) {
                    $scope.roleEditList = response.data;
                    $scope.getUser($rootScope.editUserId);
                });
            }
            //$scope.checkIfpasswordIsSame = function (user) {
            //    if (user.OldPassword == user.Password) {
            //        swal("Old and New Password Cannot be the Same.");
            //        return true;
            //    }
            //    return false;
            //}

            $scope.getUser = function (id) {
                userAdminService.getUser(id)
                    .then(function (response) {
                        $scope.userToEdit = angular.copy(response.data);
                        $scope.userToEdit.OldPassword = $scope.userToEdit.Password;
                        $scope.selectedEditRoles = response.data.RoleIds.map(function (a) { return { id: a } });
                        userAdminService.getUserPasswords($scope.userToEdit.EmployeeId, $scope.userToEdit.OldPassword).then(function (response) {
                            $scope.passwords = response.data;
                        });
                    });
            }
            //$scope.checkIfpasswordIsMatched = function (user) {
            //    for (var i = 0; i < $scope.passwords.length; i++) {
            //        if (user.Password == $scope.passwords[i].Password) {
            //            swal("Previous 1 Password Cannot be your Password.");
            //            return true;
            //        }
            //    }
            //    return false;
            //}



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
                return true;
            }

            $scope.confirmPasswordValidator = function (password) {
                if (!password)
                    return 'Password confirmation field is mandatory';
                if (password !== $scope.userToEdit.Password)
                    return 'Confirm password is not matched with password';
                return true;
            }

            $scope.editUser = function () {
                //if ($scope.checkIfpasswordIsSame($scope.userToEdit)) return;
                //if ($scope.checkIfpasswordIsMatched($scope.userToEdit)) return;
                swal({
                    title: "Confirm?",
                    text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.userT),
                    showCancelButton: true,
                    confirmButtonText: "Yes, Edit it!",
                    cancelButtonText: "No, cancel!",
                    type: "info",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                },
               function (isConfirmed) {
                   if (isConfirmed) {
                       $scope.userToEdit.RoleIds = $scope.selectedEditRoles.map(function (item) { return item.id; });
                       $scope.userToEdit.Password = Encrypt.encrypt($scope.userToEdit.Password);
                       userAdminService.editUser($scope.userToEdit)
                           .then(function (response) {
                               if (response.data.Success) {
                                   $rootScope.$broadcast('user-edit-finished');
                                   swal({
                                       title: "Successfull!",
                                       text: $rootScope.showMessage($rootScope.editSuccess, $rootScope.userT),
                                       type: "success",
                                       showCancelButton: false,
                                       confirmButtonColor: "#008000",
                                       confirmButtonText: "OK",
                                       //cancelButtonText: "Close and Exit",
                                       closeOnConfirm: true,
                                       closeOnCancel: true
                                   },
                                        function (isConfirm) {
                                            if (isConfirm) {
                                                $scope.clearAndCloseTab();
                                            } else {
                                                $scope.clearAndCloseTab();
                                            }
                                        });
                               } else {
                                   swal($rootScope.showMessage($rootScope.editError, $rootScope.userT), response.data.Message, "error");
                               }
                           });
                   }
               });
            }

            $scope.clearAndCloseTab = function () {
                $scope.removeTab($scope.tab);
            };

            $scope.$on('tab-switched', function () {
                $scope.init();
            });



            $scope.init();
        }
        //$scope.init = function () {
        //    $scope.editPassword = false;
        //    $scope.userToEdit = {};
        //    $scope.employees = [];
        //    $scope.roleEditList = [];
        //    $scope.selectedEditRoles = [];
        //    $scope.selectedEditEmployee = {};
        //    $scope.getRoles();
        //}

        //$scope.dropdownSetting = {
        //    scrollable: true,
        //    scrollableHeight: '200px',
        //    displayProp: 'Name',
        //    idProp: 'Value'
        //    //smartButtonMaxItems: 5
        //}

        //$scope.getRoles = function () {
        //    filterService.getRoles().then(function (response) {
        //        $scope.roleEditList = response.data;
        //        $scope.getUser($rootScope.editUserId);
        //    });
        //}

        //$scope.getUser = function(id) {
        //    userAdminService.getUser(id)
        //        .then(function (response) {
        //            $scope.userToEdit = response.data;
        //            $scope.selectedEditRoles = response.data.RoleIds.map(function (a) { return { id: a } });
        //        });
        //}

       

        //$scope.passwordValidator = function (password) {
        //    if (!password)
        //        return 'Password field is mandatory';

        //    var lower = /[a-z]/;
        //    var upper = /[A-Z]/;
        //    var digit = /[0-9]/;
        //    var special = /[~!@#$%^&*]/;

        //    if (password.length < 6 || password.length > 20)
        //        return 'Password length must be between 6 to 20';
        //    if (!lower.test(password))
        //        return 'Password must contains at least one lower case letter';
        //    if (!upper.test(password))
        //        return 'Password must contains at least one upper case letter';
        //    if (!digit.test(password))
        //        return 'Password must contains at least one digit (0 to 9)';
        //    if (!special.test(password))
        //        return 'Password must contains at least one spceial character';
        //    if (password.indexOf(' ') > -1)
        //        return 'Password cannot contain white space';
        //    return true;
        //}

        //$scope.confirmPasswordValidator = function (password) {
        //    if (!password)
        //        return 'Password confirmation field is mandatory';
        //    if (password !== $scope.userToEdit.Password)
        //        return 'Confirm password is not matched with password';
        //    return true;
        //}

        //$scope.editUser = function () {
        //    swal({
        //        title: "Confirm?",
        //        text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.userT),
        //        showCancelButton: true,
        //        confirmButtonText: "Yes, Edit it!",
        //        cancelButtonText: "No, cancel!",
        //        type: "info",
        //        closeOnConfirm: false,
        //        showLoaderOnConfirm: true,
        //    },
        //   function (isConfirmed) {
        //       if (isConfirmed) {
        //           $scope.userToEdit.RoleIds = $scope.selectedEditRoles.map(function (item) { return item.id; });
        //           $scope.userToEdit.Password = Encrypt.encrypt($scope.userToEdit.Password);
        //           userAdminService.editUser($scope.userToEdit)
        //               .then(function (response) {
        //                   if (response.data.Success) {
        //                       $rootScope.$broadcast('user-edit-finished');
        //                       swal({
        //                           title: "Successfull!",
        //                           text: $rootScope.showMessage($rootScope.editSuccess, $rootScope.userT),
        //                           type: "success",
        //                           showCancelButton: false,
        //                           confirmButtonColor: "#008000",
        //                           confirmButtonText: "OK",
        //                           //cancelButtonText: "Close and Exit",
        //                           closeOnConfirm: true,
        //                           closeOnCancel: true
        //                       },
        //                            function (isConfirm) {
        //                                if (isConfirm) {
        //                                    $scope.clearAndCloseTab();
        //                                } else {
        //                                    $scope.clearAndCloseTab();
        //                                }
        //                            });
        //                   } else {
        //                       swal($rootScope.showMessage($rootScope.editError, $rootScope.userT), response.data.Message, "error");
        //                   }
        //               });
        //       }
        //   });
        //}

        //$scope.clearAndCloseTab = function () {
        //    $scope.removeTab($scope.tab);
        //};

        //$scope.$on('tab-switched', function () {
        //    $scope.init();
        //});

        

        //$scope.init();



        //$scope.clearAndCloseTab = function () {
        //    $timeout(function () {
        //        $('#saveComplete').modal('hide');
        //        $('.modal-backdrop').remove();
        //    }, 500);
        //    $scope.execRemoveTab($scope.tab);
        //};
    }
]);