ammsAng.controller('commandAdminAddController', ['$scope', '$rootScope', '$timeout', 'filterService', 'commandAdminService',
    function ($scope, $rootScope, $timeout, filterService, commandAdminService) {
        $scope.isDirty = false;
        $scope.commandList = [];
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
        $scope.getCommands=function() {
            commandAdminService.getCommands().then(function (response) {
                $scope.commandList = response.data;
            });
        }
        $scope.commandNameValidator = function (name) {
            if (!name)
                return "Name is Required";
            for (var i = 0; i < $scope.commandList.length; i++) {
                if ($scope.commandList[i].Name.toLowerCase() === name.toLowerCase())
                    return 'Command name already exists!';
            }
            return true;
        }
        $scope.commandDisplayNameValidator = function (displayName) {
            if (!displayName)
                return "Display Name is Required";
            for (var i = 0; i < $scope.commandList.length; i++) {
                if ($scope.commandList[i].DisplayName.toLowerCase() === displayName.toLowerCase())
                    return 'Command Display name already exists!';
            }
            return true;
        }
        $scope.addCommand = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.command),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
           function (isConfirmed) {
               if (isConfirmed) {
                   commandAdminService.addCommand($scope.command)
                       .then(function (response) {
                           if (response.data.Success) {
                               $rootScope.$broadcast('command-add-finished');
                               swal({
                                   title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.command),
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
                                            $scope.commandAddForm.reset();
                                            $scope.commandAddForm.$dirty = false;
                                            $scope.clearModelData();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                           } else {
                               swal($rootScope.showMessage($rootScope.addError, $rootScope.command), response.data.Message, "error");
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
            $scope.getCommands();
        }
        $scope.init();
    }
]);