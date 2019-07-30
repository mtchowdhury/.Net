ammsAng.controller('moduleAdminEditController', ['$scope', '$rootScope', '$timeout', 'filterService', 'moduleAdminService',
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
        $scope.getModuleById = function (moduleId) {
            moduleAdminService.getModuleById(moduleId).then(function (response) {
                $scope.module = response.data;
                $scope.moduleName = $scope.module.Name;
                $scope.moduleDisplayName = $scope.module.DisplayName;
                $scope.selectedRoles = $scope.module.Roles.map(function (item) { return { id: item } });

                $scope.selectedModules = $scope.module.Modules.map(function (item) { return { id: item } });
                var i = $scope.moduleList.find(x => x.Name === $scope.module.Name);
                var index = $scope.moduleList.indexOf(i);
                if ($scope.moduleList.find(x => x.Name === $scope.module.Name) !== undefined) {
                    $scope.moduleList.splice(index, 1);
                }
            });
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
            filterService.getRoles().then(function (response) {
                $scope.roleList = response.data;
            });
        }

        $scope.moduleNameValidator = function (name) {
            if (!name)
            return "Name is Required";
            for (var i = 0; i < $scope.moduleList.length; i++) {
                if ($scope.moduleListFromModule[i].Name.toLowerCase() === name.toLowerCase())
                    if (name.toLowerCase() !== $scope.moduleName.toLowerCase()) {
                        return 'Module name already exists!';
                    }

            }
            return true;
        }
        $scope.moduleDisplayNameValidator = function(displayName) {
            if (!displayName)
            return "Display Name is Required";
            for (var i = 0; i < $scope.moduleList.length; i++) {
                if ($scope.moduleListFromModule[i].DisplayName.toLowerCase() === displayName.toLowerCase()) {
                    if (displayName.toLowerCase() !== $scope.moduleDisplayName.toLowerCase()) {
                        return 'Module Display name already exists!';
                    }
                }
            }
            return true;
        }

        $scope.filterParentName = function () {
            return function (item) {
                    if ($scope.selectedModules.find(x => x.id === item.Value) !== undefined) {
                        return false;
                    }
                    if (item.Name === $scope.module.Name) {
                        return false;
                    }
                    return true;
                };
            }
            $scope.filterModules = function (pn) {
                var i = $scope.moduleList.find(x => x.Name === pn);
                var index = $scope.moduleList.indexOf(i);
                if ($scope.moduleList.find(x => x.Name === pn) !== undefined) {
                    $scope.moduleList.splice(index, 1);
                } else {
                    $scope.moduleList = angular.copy($scope.moduleListParent);
                    var id = $scope.moduleList.find(x => x.Name === $scope.module.Name);
                    var idx = $scope.moduleList.indexOf(id);
                    if ($scope.moduleList.find(x => x.Name === $scope.module.Name) !== undefined) {
                        $scope.moduleList.splice(idx, 1);
                    }
                }
            }

            $scope.editModule = function () {
                swal({
                    title: "Confirm?",
                    text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.module),
                    showCancelButton: true,
                    confirmButtonText: "Yes, Edit it!",
                    cancelButtonText: "No, cancel!",
                    type: "info",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                },
                function (isConfirmed) {
                    if (isConfirmed) {
                        $scope.module.Roles = $scope.selectedRoles.map(function (item) { return item.id; });
                        if ($scope.module.HasChildren === true) {
                            $scope.module.Modules = $scope.selectedModules.map(function (item) { return item.id; });
                        }
                        else
                            $scope.module.Modules=[];
                        if ($scope.module.IsRoot === true) {
                            $scope.module.ParentName = null;
                        }
                        
                        moduleAdminService.editModule($scope.module)
                            .then(function (response) {
                                if (response.data.Success) {
                                    $rootScope.$broadcast('module-edit-finished', $scope.module);
                                    swal(__env.showMessage($rootScope.showMessage($rootScope.editSuccess, $rootScope.module)), "Successful!", "success");
                                    $scope.clearAndCloseTab();
                                } else {
                                    swal($rootScope.showMessage($rootScope.editError, $rootScope.module), response.data.Message, "error");
                                }
                            });
                    }
                });
            }

            $scope.clearModelData = function () {
                $scope.selectedRoles = [];
                $scope.selectedEmployee = {};
                $scope.module = {};
            }

            $scope.clearAndCloseTab = function () {
                $scope.selectedRoles = [];
                $scope.selectedEmployee = {};
                $scope.module = {};
                $scope.removeTab($scope.tab);
            };

            $scope.$on('tab-switched', function () {
                $scope.init();
            });

            $scope.init = function () {
                $scope.getModuleById($scope.moduleId);
                $scope.getRoles();
                $scope.getModules();
                $scope.getModulesFromModule();
            }
            $scope.init();
        }
]);