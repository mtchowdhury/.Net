ammsAng.controller('commandAdminEditController', ['$scope', '$rootScope', '$timeout', 'filterService', 'commandAdminService',
    function ($scope, $rootScope, $timeout, filterService, commandAdminService) {
        $scope.isDirty = false;
        $scope.moduleList = [];
        $scope.command = {};

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
        $scope.commandNameValidator = function (name) {
            if (!name)
                return "Name is Required";
            for (var i = 0; i < $scope.commandList.length; i++) {
                if ($scope.commandList[i].Name.toLowerCase() === name.toLowerCase())
                    if (name !== $scope.commandName) {
                        return 'Command name already exists!';
                    }

            }
            return true;
        }
        $scope.commandDisplayNameValidator = function (displayName) {
            if (!displayName)
                return "Display Name is Required";
            for (var i = 0; i < $scope.commandList.length; i++) {
                if ($scope.commandList[i].DisplayName.toLowerCase() === displayName.toLowerCase()) {
                    if (displayName !== $scope.commandDisplayName) {
                        return 'Command Display name already exists!';
                    }
                }
            }
            return true;
        }
        $scope.getCommands = function () {
            commandAdminService.getCommands().then(function (response) {
                $scope.commandList = response.data;
            });
        }
        $scope.getCommandById=function (id) {
            commandAdminService.getCommandById(id).then(function (response) {
                $scope.command = response.data;
                $scope.commandName = response.data.Name;
                $scope.commandDisplayName = response.data.DisplayName;
            });
        }
        $scope.editCommand = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.command),
                showCancelButton: true,
                confirmButtonText: "Yes, Edit it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
           function (isConfirmed) {
               if (isConfirmed) {
                   commandAdminService.editCommand($scope.command)
                       .then(function (response) {
                           if (response.data.Success) {
                               $rootScope.$broadcast('command-edit-finished', $scope.command);
                               swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.command), "Successful!", "success");
                               $scope.clearAndCloseTab();
                           } else {
                               swal($rootScope.showMessage($rootScope.editError, $rootScope.command), response.data.Message, "error");
                           }
                       });
               }
           });
        }

        $scope.clearModelData = function () {
            $scope.commandToAdd = { Active: true };
            $scope.command = {};
        }

        $scope.clearAndCloseTab = function () {
            $scope.command = {};
            $scope.removeTab($scope.tab);
        };

        $scope.$on('tab-switched', function () {
            $scope.init();
        });

        $scope.init = function () {
            $scope.getCommandById($scope.commandId);
            $scope.getCommands();
        }
        $scope.init();
    }
]);