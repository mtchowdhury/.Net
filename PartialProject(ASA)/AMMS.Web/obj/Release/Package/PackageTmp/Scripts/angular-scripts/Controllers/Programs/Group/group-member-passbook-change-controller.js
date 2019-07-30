ammsAng.controller('memberPassBookNumberChangeListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'memberService', 'workingDayService',
    function ($scope, $rootScope, commonService, $timeout, memberService, workingDayService) {

        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];
        $scope.memberPassbookUpdate = {};

        //$scope.dtOptions = DTOptionsBuilder.newOptions()
        //        .withPaginationType('full_numbers')
        //        .withDisplayLength(10);

        //$scope.dtColumnDefs = [
        //DTColumnDefBuilder.newColumnDef(0)
        //    .withOption("bSearchable", true),
        //DTColumnDefBuilder.newColumnDef(1)
        //    .withOption("bSearchable", true),
        //DTColumnDefBuilder.newColumnDef(2)
        //    .withOption("bSearchable", true),
        //DTColumnDefBuilder.newColumnDef(3)
        //    .withOption("bSearchable", true),
        //DTColumnDefBuilder.newColumnDef(4)
        //    .withOption("bSearchable", true),
        //DTColumnDefBuilder.newColumnDef(5)
        //    .withOption("bSearchable", true),
        //DTColumnDefBuilder.newColumnDef(6)
        //    .withOption("bSearchable", true),
        //DTColumnDefBuilder.newColumnDef(7)
        //    .withOption("bSearchable", true),
        //DTColumnDefBuilder.newColumnDef(8)
        //    .withOption("bSearchable", true)
        //];

        $scope.Init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                console.log($scope.commandList);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;

                $scope.getmemberInfo();

            }, AMMS.handleServiceError);
            workingDayService.getDateOfBranch($rootScope.selectedBranchId).then(function(response) {
                $scope.branchWorkingDate = response.data.date;
                $scope.CreatedBy = $rootScope.user.EmployeeId;
            });

        };
        $scope.getmemberInfo = function () {
            //var menu = $scope.menus.filter(e => e.ModuleId = newTabInfo.ModuleId)[0];
            memberService.getMembersOfGroupByGroupId($scope.selectedMenu.Id).then(function (response) {
                $scope.memberList = angular.copy(response.data.filter(m=>m.Status===1));
                $scope.memberPassbookUpdate.Members = angular.copy($scope.memberList);
                $scope.memberPassbookUpdate.Members.forEach(function (member) {
                    member.StartDate = moment(member.StartDate).format('DD/MM/YYYY');
                    member.EndDate = member.EndDate == null || member.EndDate == "0001-01-01T00:00:00" || member.EndDate == "1901-01-01T00:00:00" ? "" : moment(member.EndDate).format('DD/MM/YYYY');
                    if (member.GuardianRelation == 5 && member.sex == '1') {
                        member.Isirregular = true;
                    }
                });
                console.log($scope.memberList);
            }, AMMS.handleServiceError);
        }

        $scope.Init();
        $scope.checkIfEmptyOrZero = function (members) {

            var flag = false;
            for(var i=0;i<members.length;i++) {
                
                if (members[i].PassbookNumber == '' || members[i].PassbookNumber == null || members[i].PassbookNumber==undefined) {
                    //member.Isirregular = true;
                    flag = true;
                    break;
                }
            };
                if (flag) {
                    swal("PassBook Number Cannot be Empty");
                    return true;
                }
                return false;
        }
        $scope.updatePassBookNumbers = function() {
            

            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.employeePassbook),
                showCancelButton: true,
                confirmButtonText: "Yes, Update it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function(isConfirmed) {
                if (isConfirmed) {
                    var members = [];
                    for (var i = 0; i < $scope.memberList.length; i++) {
                        if ($scope.memberPassbookUpdate.Members[i].PassbookNumber != $scope.memberList[i].PassbookNumber) {
                            $scope.memberPassbookUpdate.Members[i].ProgramId = $scope.memberList[i].PassbookNumber;
                            members.push($scope.memberPassbookUpdate.Members[i]);
                        }
                    }
                    $scope.memberPassbookUpdate.Members = angular.copy(members);
                    $scope.memberPassbookUpdate.CreatedBy = $scope.CreatedBy;
                    $scope.memberPassbookUpdate.BranchWorkingDay = $scope.branchWorkingDate;
                    //if (!$scope.checkIfEmptyOrZero($scope.memberPassbookUpdate.Members)) {
                        memberService.updatePassBookNumber($scope.memberPassbookUpdate).then(function(response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('member-passbook-update-finished');
                                swal({
                                        title: $rootScope.showMessage($rootScope.editSuccess, $rootScope.employeePassbook),
                                        //text: "What do you want to do next?",
                                        //type: "success",
                                        showCancelButton: true,
                                        showConfirmButton: false,
                                        //confirmButtonColor: "#008000",
                                        //confirmButtonText: "Add New",
                                        cancelButtonText: "Close and Exit",
                                        //closeOnConfirm: true,
                                        closeOnCancel: true
                                    },
                                    function(isConfirm) {
                                        if (isConfirm) {
                                            $scope.passbookNumbersToUpdate.$dirty = false;
                                            //$scope.passbookNumbersToUpdate.reset();

                                            //$scope.clearModelData();
                                        } else {
                                            //$scope.clearAndCloseTab();
                                        }
                                    });
                                $scope.getMenus();
                                $scope.Init();
                            } else {
                                swal($rootScope.showMessage($rootScope.updateError, $rootScope.employeePassbook), response.data.Message, "error");
                            }
                        });
                    //} else {
                    //    swal("PassBook Number Cannot be Empty");
                    //    //sweetAlert.close();
                    //}
            }
            });
        }

        $scope.$on('member-passbook-update-finished', function () {
            $scope.updatePassBookNumbers();
        });
        $scope.clearModelData = function () {
            $scope.memberPassbookUpdate = null;
        }

        $scope.clearAndCloseTab = function () {
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

        $scope.$on('tab-switched', function () {

        });
    }]);