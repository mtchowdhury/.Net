ammsAng.controller('loanGroupListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder',
    function ($scope, $rootScope, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder) {
        $scope.loanGroupList = [];
        $scope.commandList = [];
        $scope.loanGroupToDelete = null;
        $scope.hasNonGeneralCommands = false;
        var otherParam = {};
        $scope.roleId = $rootScope.user.Role;

        if ($rootScope.notificationData != null) {
            var obj = $rootScope.notificationData;
            $scope.selectedMenu.programOfficerId = obj.ProgramOfficerId;
            $scope.GroupTypeId = obj.GroupType;
            $rootScope.notificationData = null;
        }
        otherParam.programOfficerId = $scope.selectedMenu.programOfficerId;
        if ($scope.selectedMenu.Name === 'General') {
            $scope.GroupTypeId = 1;
        }
        if ($scope.selectedMenu.Name === 'Special') {
            $scope.GroupTypeId = 2;
        }
        if ($scope.selectedMenu.Name === 'Bad Debt') {
            $scope.GroupTypeId = 3;
        }
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }

        $scope.formatDate = function (dateString) {
            var formattedDate = dateString.toString().substring(6, 8) + "/" + dateString.toString().substring(4, 6) + "/" + dateString.toString().substring(0, 4);
            return formattedDate;
        }

        $scope.getloanGroups = function () {
            $("#loadingImage").css("display", "block");
            if (typeof officerId == 'undefined') var officerId = $scope.selectedMenu.programOfficerId;
            loanGroupService.getGroupsB(officerId, $scope.GroupTypeId).then(function (response) {
                $scope.loanGroupList = response.data;
                if ($scope.loanGroupList.length > 0) {
                    for (var i = 0; i < $scope.loanGroupList.length; i++) {
                        $scope.loanGroupList[i].FormationDate = $scope.formatDate($scope.loanGroupList[i].FormationDate);

                    }
                }
            }, AMMS.handleServiceError);
            if ($scope.loanGroupList.length <= 1)
                $("#loadingImage").css("display", "none");
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(2);
            $("#loadingImage").css("display", "none");
            $timeout(function () {
                $(".dataTables_filter label").css("margin-left", "10px");
                $(".dataTables_filter input").css(dataTable_css);
            }, 100);
        }





        $scope.handleNonGeneralActions = function (actionName, loanGroup) {
            $scope.loanGroupToDelete = loanGroup;
            if (actionName === "DELETE") {

                $scope.deleteloanGroup();
            }
        }

        $scope.$on('loanGroup-add-finished', function () {
            $rootScope.dataLoadedFirstTime = false;
           // $scope.loadData();
            $scope.getMenus();
            
            $scope.getloanGroups();
        });

        $scope.$on('loanGroup-edit-finished', function () {
            $rootScope.dataLoadedFirstTime = false;
           // $scope.loadData();
            $scope.getMenus();
            $scope.getloanGroups();
        });

        $scope.$on('group-move-finished', function () {
            $rootScope.dataLoadedFirstTime = false;
           // $scope.loadData();
            $scope.getMenus();
            $scope.getloanGroups();
        });

        $scope.$on('loanGroup-delete-finished', function () {
            $rootScope.dataLoadedFirstTime = false;
           // $scope.loadData();
            $scope.getMenus();
            $scope.getloanGroups();
        });

        $rootScope.$on('propertyNotificationClicked', function (args, newTabInfo) {
            //do something


        });
        $scope.$on('meeting-day-change-finished', function () {
            $rootScope.dataLoadedFirstTime = false;
           // $scope.loadData();
            $scope.getMenus();
            $scope.getloanGroups();
        });

        $scope.exportData = function () {
            employeeService.getExportReportResult($scope.tab.PropertyId).then(function (responseResult) {
                $scope.exportResult = responseResult.data;
                var methodName = "GetGroupsOfProgramOfficer";
                otherParam = JSON.stringify(otherParam);
                window.open($rootScope.apiBaseUrl + "Export/GetExportData?reportName=" + Encrypt.encrypt($scope.exportResult[0].Name) + "&methodName=" + Encrypt.encrypt(methodName) + "&otherParam=" + Encrypt.encrypt($scope.selectedMenu.programOfficerId), "_blank");
            }, AMMS.handleServiceError);
        }

        $scope.deleteloanGroup = function () {
            if ($scope.roleId == $rootScope.rootLevel.LO) {
                swal("LO cannot Delete Group");
                return;
            }
            if (!$rootScope.isDayOpenOrNot()) return;
            swal({
                title: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.group),
                showCancelButton: true,
                confirmButtonText: "Yes, Delete it!",
                cancelButtonText: "No, Cancel Please!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function () {
                    loanGroupService.deleteloanGroup($scope.loanGroupToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.group), "Successful!", "success");
                            $rootScope.$broadcast('loanGroup-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.group), response.data.Message, "error");
                        }
                    }, AMMS.handleServiceError);
                });
        };
        $scope.Init = function () {
            $scope.getloanGroups();
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            }, AMMS.handleServiceError);

        };
        $scope.Init();
    }]);