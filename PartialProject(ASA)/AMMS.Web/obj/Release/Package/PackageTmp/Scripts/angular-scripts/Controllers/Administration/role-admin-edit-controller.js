ammsAng.controller('roleAdminEditController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'roleAdminService',
    function($scope, $rootScope, $timeout, $q, filterService, roleAdminService) {
        $scope.isDirty = false;
        $scope.roleToEdit = { };
        $scope.roleList = [];
        $scope.roleName = '';
        $scope.roleLevels = [];

        $scope.getRoles = function() {
            roleAdminService.getRoles().then(function (response) {
                $scope.roleList = response.data;
            });
        }
        $scope.getRoleLevels = function () {
            roleAdminService.getRoleLevels().then(function (response) {
                $scope.roleLevels = response.data;
            });
        }
        $scope.getRoleInfoById=function(id) {
            roleAdminService.getRoleById(id).then(function(response) {
                $scope.roleToEdit = response.data;
                $scope.roleName = response.data.RoleName;
            });
        }

        $scope.roleValidator = function (name) {
            if (!name)
                return 'Name field is mandatory';

            for (var i = 0; i < $scope.roleList.length; i++) {
                if ($scope.roleList[i].RoleName.toLowerCase() === name.toLowerCase()) {
                    if (name !== $scope.roleName)
                        return 'Role name already exists!';
                }
            }
            return true;
        }


        $scope.editRole = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.role),
                showCancelButton: true,
                confirmButtonText: "Yes, edit it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function(isConfirmed) {
                if (isConfirmed) {
                   roleAdminService.editRole($scope.roleToEdit)
                        .then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('role-edit-finished');
                                swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.role), "Successful!", "success");
                            } else {
                                swal($rootScope.showMessage($rootScope.editError, $rootScope.role), response.data.Message, "error");
                            }

                        });

                }
            }); 
        }

        $scope.$on('tab-switched', function () {
            $scope.init();
        });

        $scope.init = function () {
            $scope.getRoles();
            $scope.getRoleLevels();
            $timeout(function () {
                $scope.getRoleInfoById($scope.editRoleId);
            }, 300);
        }

        $scope.init();
    }
]);