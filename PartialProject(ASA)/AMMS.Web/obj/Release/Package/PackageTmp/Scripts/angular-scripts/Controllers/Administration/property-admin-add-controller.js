ammsAng.controller('propertyAdminAddController', ['$scope', '$rootScope', '$timeout', 'filterService', 'propertyAdminService',
    function ($scope, $rootScope, $timeout, filterService, propertyAdminService) {
        $scope.isDirty = false;
        $scope.moduleList = [];
        $scope.property = {};
        $scope.roleList = [];
        $scope.checkedRoles = [];
        $scope.commandList = [];
        $scope.formTypeList = [];
        $scope.selectedRoles = [];
        $scope.selectedCommands = [];
        $scope.formTypes = [];
        $scope.customFormType = 0;
        $scope.commandallchecked = [];
        $scope.selectedCommandList = [];

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
        $scope.getModules=function() {
            filterService.getModules().then(function (response) {
                $scope.moduleList = angular.copy(response.data);
            });
        }
        $scope.getRoles = function () {
            filterService.getRoles().then(function (response) {
                $scope.roleList = response.data;
            });
        }
        $scope.getCommands = function () {
            filterService.getCommands().then(function (response) {
                $scope.commandList = response.data;
            });
        }
        $scope.getFormType=function() {
            filterService.getFormType().then(function (response) {
                $scope.formTypeList = response.data;
            });
        }
        $scope.filterCommand=function() {
            return function (item) {
                if ($scope.selectedCommands.find(x => x.id === item.Value) !== undefined) {
                    return true;
                }
                return false;
            };
        }
        $scope.filterRole=function() {
            return function (item) {
                if ($scope.selectedRoles.find(x => x.id === item.Value) !== undefined) {
                    return true;
                }
                return false;
            };
        }
        $scope.checkAllCommands = function (roleId, cmd) {
            for (var i = 0; i < $scope.selectedCommandList.length; i++) {
                if ($scope.selectedCommandList[i].RoleId === roleId) {
                    for (var j = 0; j < $scope.selectedCommandList[i].Commands.length; j++) {
                        $scope.selectedCommandList[i].Commands[j].Checked = cmd;
                    }
                }
            }
        }

        $scope.roleDdlEvents = {
            onItemSelect: function (item) {
                $scope.selectedCommandList.push({
                    RoleId: item.id,
                    Commands: $scope.selectedCommands.map(function (i) { return { Id: i.id, Checked: 0 } })
                });
                var role = $scope.roleList.find(x => x.Value === item.id);
                $scope.checkedRoles.push({ id: item.id, name: (role ? role.Name : '') });
            },
            onItemDeselect: function (item) {
                var i = $scope.selectedCommandList.find(x => x.RoleId === item.id);
                var index = $scope.selectedCommandList.indexOf(i);
                $scope.selectedCommandList.splice(index, 1);
                var ri = $scope.checkedRoles.find(x => x.id === item.id);
                var rindex = $scope.checkedRoles.indexOf(ri);
                $scope.checkedRoles.splice(rindex, 1);
            },
            onSelectAll: function () {
                $scope.selectedCommandList = [];
                $scope.roleList.forEach(function(role,index) {
                    $scope.selectedCommandList.push({
                        RoleId: role.Value,
                        Commands: $scope.selectedCommands.map(function (i) { return { Id: i.id, Checked: 0 } })
                    });
                });
                $scope.checkedRoles = [];
                $timeout(function() {
                    $scope.selectedRoles.forEach(function (item, index) {
                        var role = $scope.roleList.find(x => x.Value === item.id);
                        $scope.checkedRoles.push({ id: item.id, name: (role ? role.Name : '') });
                    });
                }, 100);
            },
            onDeselectAll:function() {
                $scope.selectedCommandList = [];
                $scope.checkedRoles = [];
            }
        };

        $scope.commandsDdlEvents = {
            onItemSelect: function (item) {
                for (var i = 0; i < $scope.selectedCommandList.length; i++) {
                    if ($scope.selectedCommandList[i])
                        $scope.selectedCommandList[i].Commands.push({ Id: item.id, Checked: 0});
                }
            },
            onItemDeselect: function (item) {
                $scope.selectedCommandList.forEach(function (cmd, scindex) {
                    var itm = cmd.Commands.find(x => x.Value === item.id);
                    var index = cmd.Commands.indexOf(itm);
                    cmd.Commands.splice(index, 1);
                });
            },
            onSelectAll: function () {
                $scope.selectedCommandList.forEach(function (command, index) {
                    command.Commands = [];
                    command.Commands = $scope.commandList.map(function (i) { return { Id: i.Value, Checked: 0 } });
                });
            },
            onDeselectAll: function () {
                $scope.selectedCommandList.forEach(function(command, index) {
                    command.Commands = [];
                });
            }
        };

        $scope.uncheckSingleCommand = function (isCheck, allCheckindex, cmdIndex) {
            var checkCounter = 0;
            if (isCheck===0) {
                $scope.commandallchecked[allCheckindex] = 0;
            }
            $scope.selectedCommandList[allCheckindex].Commands.forEach(function (command) {
                if (command.Checked===1) {
                    checkCounter++;
                }
            });
            if (checkCounter === $scope.selectedCommandList[allCheckindex].Commands.length) {
                $scope.commandallchecked[allCheckindex] = 1;
            }
        }
        $scope.clearFormType = function () {
            if ($scope.customFormType === 1)
                $scope.property.FormType = '';
        }
        $scope.addProperty = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.property),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
           function (isConfirmed) {
               if (isConfirmed) {
                   $scope.property.Roles = $scope.selectedRoles.map(function (item) { return item.id; });
                   $scope.property.Commands = $scope.selectedCommands.map(function (item) { return item.id; });
                   $scope.property.RoleCommands = $scope.selectedCommandList;
                   propertyAdminService.addProperty($scope.property)
                       .then(function (response) {
                           if (response.data.Success) {
                               $rootScope.$broadcast('property-add-finished');
                               swal({
                                   title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.property),
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
                                            $scope.propertyAddForm.reset();
                                            $scope.propertyAddForm.$dirty = false;
                                            $scope.clearModelData();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                           } else {
                               swal($rootScope.showMessage($rootScope.addError, $rootScope.property), response.data.Message, "error");
                           }
                       });
               }
           });
        }

        $scope.clearModelData = function () {
            $scope.selectedRoles = [];
            $scope.property = {};
        }

        $scope.clearAndCloseTab = function () {
            $scope.selectedRoles = [];
            $scope.property = {};
            $scope.removeTab($scope.tab);
        };

        $scope.$on('tab-switched', function () {
            $scope.init();
        });

        $scope.init = function () {
            $scope.getModules();
            $scope.getRoles();
            $scope.getFormType();
            $scope.getCommands();
        }
        $scope.init();
    }
]);