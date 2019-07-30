ammsAng.controller('roleAdminAddController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'roleAdminService',
    function ($scope, $rootScope, $timeout, $q, filterService, roleAdminService) {
        $scope.isDirty = false;
        $scope.roleToAdd = { };
        $scope.roleList = [];
        $scope.roleLevels = [];
       
        $scope.getRoles = function() {
            filterService.getRoles().then(function(response) {
                $scope.roleList = response.data;
            });
        }

        $scope.roleValidator = function (name) {
            if (!name)
                return 'name field is mandatory';

            for (var i = 0; i < $scope.roleList.length; i++) {
                if ($scope.roleList[i].Name.toLowerCase() === name.toLowerCase())
                    return 'role name already exists!';

            }
            return true;
        }
        $scope.getRoleLevels=function() {
            roleAdminService.getRoleLevels().then(function (response) {
                $scope.roleLevels = response.data;
            });
        }


        $scope.addRole = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.role),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function(isConfirmed) {
                if (isConfirmed) {
                    roleAdminService.addRole($scope.roleToAdd)
                        .then(function (response) {

                            if (response.data.Success) {
                                $rootScope.$broadcast('role-add-finished');
                                swal({
                                    title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.role),
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
                                            $scope.roleAddForm.reset();
                                            $scope.roleAddForm.$dirty = false;
                                            $scope.clearModelData();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                              } else {
                                swal($rootScope.showMessage($rootScope.addError, $rootScope.role), response.data.Message, "error");
                            }
                            
                        });

                }
            }); 
        }

        $scope.clearModelData = function () {
            $scope.roleToAdd = {};
            $scope.roleList = [];
        }

        $scope.clearAndCloseTab = function () {
            $scope.roleToAdd = { };
            $scope.roleList = [];
            $scope.removeTab($scope.tab);
        };

        $scope.$on('tab-switched', function () {
            $scope.init();
        });

        $scope.init = function () {
            $scope.getRoles();
            $scope.getRoleLevels();
        }

        $scope.init();
    }
]);