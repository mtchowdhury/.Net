ammsAng.controller('memberSearchListController', ['$scope', '$rootScope', '$timeout', 'memberService', 'transferService', 'commonService', 'DTOptionsBuilder',
    function ($scope, $rootScope, $timeout, memberService, transferService, commonService, DTOptionsBuilder) {
        $scope.employeeListFull = [];
        $scope.employeeList = [];
        $scope.commandList = [];
        $scope.hasNonGeneralCommands = false;
        $scope.exportResult = [];
        $scope.memberToDelete = null;
        $scope.memberSearch = {};
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }


        //$scope.getMembers = function (groupId) {
        //    console.log("ddd");
        //    $("#loadingImage").css("display", "block");
        //    memberService.getMembersOfGroup(groupId).then(function (response) {
        //        //$rootScope.memberListStoreForMHistory = response.data;
        //        //$scope.memberList = $scope.getFormattedData(response.data, groupId);
        //        //console.log($scope.memberList);
        //        //$scope.memberListFull = $scope.memberList;
        //        $scope.memberList = response.data;
        //        $scope.memberListFull = $scope.memberList;
        //        $scope.dtOptions = DTOptionsBuilder.newOptions()
        //        .withPaginationType('full_numbers')
        //        .withDisplayLength(2);
        //        $("#loadingImage").css("display", "none");
        //        $timeout(function () {
        //            $(".dataTables_filter label").css("margin-left", "10px");
        //            $(".dataTables_filter input").css(dataTable_css);
        //        }, 100);
        //    }, AMMS.handleServiceError);


        //}

        //$scope.getFormattedData = function (data, groupId) {

        //    for (var i = 0, len = data.length; i < len; i++) {
        //        data[i].DateOfBirth = memberService.getDateFromInt(data[i].DateOfBirth);
        //        data[i].AdmissionDate = memberService.getDateFromInt(data[i].AdmissionDate);
        //        data[i].ClosingDate = memberService.getDateFromInt(data[i].ClosingDate);
        //        data[i].GroupId = groupId;
        //    }

        //    return data;
        //}

        $scope.handleNonGeneralActions = function (actionName, member) {
            $scope.memberToDelete = member;
            if (actionName === "DELETE") {
                $scope.deleteMember();
            }
        }
        $scope.searchMember = function () {
            $("#loadingImage").css("display", "block");
            if ($scope.memberSearch.LO == undefined) {
                $scope.memberSearch.LO = '';
            }
            if ($scope.memberSearch.Group == undefined) {
                $scope.memberSearch.Group = '';
            }
            if ($scope.memberSearch.Member == undefined) {
                $scope.memberSearch.Member = '';
            }
            if ($scope.memberSearch.MemberId == undefined) {
                $scope.memberSearch.MemberId = '';
            }
            if ($scope.memberSearch.FH == undefined) {
                $scope.memberSearch.FH = '';
            }
            if ($scope.memberSearch.NID == undefined) {
                $scope.memberSearch.NID = '';
            }
            if ($scope.memberSearch.Mobile == undefined) {
                $scope.memberSearch.Mobile = '';
            }
            memberService.searchMemberByBranchId($scope.memberSearch.LO, $scope.memberSearch.Group, $scope.memberSearch.Member,
                $scope.memberSearch.MemberId, $scope.memberSearch.FH, $scope.memberSearch.NID, $scope.memberSearch.Mobile, $rootScope.selectedBranchId).then(function (response) {
                    $scope.memberList = response.data;
                    $scope.memberListFull = $scope.memberList;
                    $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withPaginationType('full_numbers')
                    .withDisplayLength(2);
                    $("#loadingImage").css("display", "none");
                    $timeout(function () {
                        $(".dataTables_filter label").css("margin-left", "10px");
                        $(".dataTables_filter input").css(dataTable_css);
                    }, 100);
                }, AMMS.handleServiceError);
        }
      

        $scope.$on('tab-switched', function () {
            //if ($scope.groupId !== $rootScope.groupIdOfMemberList) {
            //    $scope.getMembers($rootScope.groupIdOfMemberList);
            //}

        });
        //$scope.$on('member-replace-finished', function () {
        //    console.log("broadcast recieved");
        //    $scope.getMenus();
        //    $scope.getMembers($scope.groupId);
        //});



        $scope.deleteMember = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            transferService.IsMemberInTransferTransitState($scope.memberToDelete.Id, $rootScope.selectedBranchId).then(function (response) {
                if (response.data) {
                    swal("The Member is in Transfer Transit State");
                    return;
                }
                swal(
                    commonService.swalHeaders($rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.member), "warning"),
                    function () {
                        memberService.deleteMember($scope.memberToDelete.Id).then(function (response) {
                            if (response.data.Success) {
                                swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.member), "Successful!", "success");
                                $rootScope.$broadcast('member-delete-finished');
                            } else {
                                swal($rootScope.showMessage($rootScope.deleteError, $rootScope.member), response.data.Message, "error");
                            }

                        }, AMMS.handleServiceError);
                    });
            });
        };




        $scope.Init = function () {
            //if ($scope.groupId == null) $scope.groupId = $scope.selectedMenu.Id;
            //$scope.getMembers($scope.groupId);
            //$rootScope.groupIdOfMemberList = $scope.groupId;
            memberService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            }, AMMS.handleServiceError);

        };


        $scope.exportData = function () {
            commonService.getExportReportResult($scope.tab.PropertyId).then(function (responseResult) {
                $scope.exportResult = responseResult.data;
                var methodName = "GetMembersByGroup";
                otherParam = JSON.stringify(otherParam);
                window.open($rootScope.apiBaseUrl + "Export/GetExportData?reportName=" + Encrypt.encrypt($scope.exportResult[0].Name) + "&methodName=" + Encrypt.encrypt(methodName) + "&otherParam=" + Encrypt.encrypt($scope.groupId), "_blank");
            }, AMMS.handleServiceError);
        }
        $scope.Init();




    }]);