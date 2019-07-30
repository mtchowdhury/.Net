ammsAng.controller('moduleAdminAddController', ['$scope', '$rootScope', '$timeout', 'filterService', 'moduleAdminService',
    function ($scope, $rootScope, $timeout, filterService, moduleAdminService) {
        $scope.isDirty = false;
        $scope.moduleList = [];
        $scope.moduleListParent = [];
        $scope.moduleListFromModule = [];
        $scope.roleList = [];
        $scope.selectedRoles = [];
        $scope.selectedModules = [];
        $scope.module = {};

        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value'
        }

        $scope.remoteUrlRequestFn = function (str) {
            return { query: Encrypt.encrypt(str) };
        }

        $scope.remoteRequestHeaderFn = function () {
            return $rootScope.headersWithoutLog;
        }
        $scope.getModules = function () {
            filterService.getModules().then(function (response) {
                $scope.moduleList = angular.copy(response.data);
                $scope.moduleListParent = angular.copy(response.data);
            });
        }
        $scope.getModulesFromModule = function () {
            moduleAdminService.getModules().then(function (response) {
                $scope.moduleListFromModule = response.data;
            });
        }
        $scope.getRoles = function () {
            $scope.roleList = [];
            $scope.selectedRoles = [];
            filterService.getRoles().then(function (response) {
                $scope.roleList = response.data;
            });
        }

        $scope.moduleNameValidator = function (name) {
            if (!name)
                return "Name is Required";
            for (var i = 0; i < $scope.moduleListFromModule.length; i++) {
                if ($scope.moduleListFromModule[i].Name.toLowerCase() === name.toLowerCase())
                    return 'Module name already exists!';
            }
            return true;
        }
        $scope.moduleDisplayNameValidator = function (displayName) {
            if (!displayName)
                return "Display Name is Required";
            for (var i = 0; i < $scope.moduleListFromModule.length; i++) {
                if ($scope.moduleListFromModule[i].DisplayName.toLowerCase() === displayName.toLowerCase())
                    return 'Module Display name already exists!';
            }
            return true;
        }

        $scope.filterParentName = function () {
            return function (item) {
                if ($scope.selectedModules.find(x => x.id === item.Value) !== undefined) {
                    return false;
                }
                return true;
            };
        }
        $scope.filterModules = function (pn) {
            $scope.moduleList = angular.copy($scope.moduleListParent);
            var i = $scope.moduleList.find(x => x.Name === pn);
            var index = $scope.moduleList.indexOf(i);
            if ($scope.moduleList.find(x => x.Name === pn) !== undefined) {
                $scope.moduleList.splice(index,1);
            }
        }

        $scope.addModule = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.module),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
           function (isConfirmed) {
               if (isConfirmed) {
                   $scope.module.Roles = $scope.selectedRoles.map(function (item) { return item.id; });
                   if ($scope.module.HasChildren === 1) {
                       $scope.module.Modules = $scope.selectedModules.map(function(item) { return item.id; });
                   } else
                       $scope.module.Modules = [];
                   if ($scope.module.IsRoot === 1) {
                       $scope.module.ParentName = null;
                   }
                   moduleAdminService.addModule($scope.module)
                       .then(function (response) {
                           if (response.data.Success) {
                               $rootScope.$broadcast('module-add-finished');
                               swal({
                                   title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.module),
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
                                            $scope.moduleAddForm.reset();
                                            $scope.moduleAddForm.$dirty = false;
                                            $scope.clearModelData();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                           } else {
                               swal($rootScope.showMessage($rootScope.addError, $rootScope.module), response.data.Message, "error");
                           }
                       });
               }
           });
        }

        $scope.clearModelData = function () {
            $scope.moduleToAdd = { Active: true };
            $scope.selectedRoles = [];
            $scope.selectedEmployee = {};
            $scope.module = {};
            $scope.module.IsRoot = 0;
            $scope.getModules();
            $scope.getModulesFromModule();
        }

        $scope.clearAndCloseTab = function () {
            $scope.moduleToAdd = { Active: true };
            $scope.selectedRoles = [];
            $scope.selectedEmployee = {};
            $scope.module = {};
            $scope.removeTab($scope.tab);
        };

        $scope.$on('tab-switched', function () {
            $scope.init();
        });

        $scope.init = function () {
            $scope.getRoles();
            $scope.getModules();
            $scope.getModulesFromModule();
        }
        $scope.init();
    }
]);