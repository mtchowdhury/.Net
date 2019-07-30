ammsAng.controller('memberMoveController', ['$scope', '$rootScope', 'loanGroupFilterService', 'loanGroupService', 'memberService','employeeService',
    function ($scope, $rootScope, loanGroupFilterService, loanGroupService, memberService, employeeService) {
        $scope.member = {};
       // $scope.LoanOfficers = $scope.menus[0].SubModules.filter(lo=>lo.Status !== -1);
        $scope.groups = null;
        $scope.groupsChanged = null;
        $scope.memberList = null;
        $scope.changedGroupMemberCount = 0;
        $scope.postData = {};
        $scope.member.MoveDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
        $scope.member.MovedByUserId = $rootScope.user.LoginId;
        $scope.member.BranchId = $rootScope.selectedBranchId;

        $scope.getGroupsByProgramOfficer = function (programOfficerId, type) {
            if (programOfficerId != null) {
                loanGroupService.getGroupsWithType(programOfficerId).then(function (response) {
                    if (type === 'original') {
                        $scope.groups = response.data;
                        $scope.member.MoveToLoId = null;
                        $scope.member.MoveToGroupId = null;
                        if ($scope.groups.length > 0) $scope.member.MoveFromGroupId = $scope.groups[0].Id;
                        $scope.getMeetingDay($scope.member.MoveFromGroupId, 'original');
                        $scope.getMembersByGroupId($scope.member.MoveFromGroupId, 'original');
                    }
                    else {
                        $scope.groupsChanged = response.data;
                        $scope.getMeetingDay($scope.member.MoveToGroupId, 'changed');
                        $scope.getMembersByGroupId($scope.member.MoveToGroupId, 'changed');
                        $scope.filterGroupForMemberMove();
                    }

                }, AMMS.handleServiceError);
            }
        }
        $scope.filterGroupForMemberMove = function () {
            if ($scope.groups != null) {

                var group = $scope.groups.find(g => g.Id === $scope.member.MoveFromGroupId);
                if (group != undefined) {
                    //$scope.groupsChanged = $scope.groupsChanged.filter(g => g.GroupTypeId === group.GroupTypeId);
                    $scope.groupsChanged.forEach(function (changedGroup) {
                        if (changedGroup.Id === group.Id || changedGroup.GroupTypeId !== group.GroupTypeId) {
                            changedGroup.DisabledState = true;
                        } else {
                            changedGroup.DisabledState = false;
                        }
                        //if () {
                        //    changedGroup.DisabledState = true;
                        //} else {
                        //    changedGroup.DisabledState = false;
                        //}
                    });
                }
            }
        }

        $scope.getMeetingDay = function (groupId, type) {
            console.log(groupId + type);
            if (groupId != null) {
                loanGroupService.getDetails(groupId).then(function (response) {
                    var data = response.data;
                    console.log(data);
                    if (type === 'original') {
                        $scope.member.meetingDay = ($scope.MeetingDay.find(d => d.Name == data)).Value;
                    }
                    else {
                        $scope.member.NewMeetingDay = ($scope.MeetingDay.find(d => d.Name == data)).Value;
                       
                      
                    }
                }, AMMS.handleServiceError);
            }
        }
        $scope.addLoanGroupFilterData = function () {
            loanGroupFilterService.getLoanGroupAddfilters().then(function (response) {
                var data = response.data;
                $scope.MeetingDay = data.MeetingDay.filter(d=>d.Name !== "Fri");
                $scope.MeetingDay.forEach(function (md) {
                    if(md.Name!='None')
                        md.Name = md.Name.substring(0, 3);
                });
            }, AMMS.handleServiceError);
        }
        $scope.getMembersByGroupId = function (groupId, type) {
            if (groupId != null) {
                loanGroupFilterService.getMembersByGroupId(groupId).then(function (response) {
                    $scope.groupMembers = response.data;
                    if (type == 'original') {
                        $scope.memberList = response.data;
                        if ($scope.memberList.length > 0) $scope.member.MemberId = $scope.memberList[0].Value;
                        $scope.member.MoveToLoId = null;
                        $scope.member.MoveToGroupId = null;
                    }
                    else $scope.changedGroupMemberCount = response.data.length;
                }, AMMS.handleServiceError);
            }
        }
        $scope.getLoanOfficerByBranch=function() {
            if ($rootScope.selectedBranchId != undefined) {
                employeeService.getProgramOfficerOfBranch($rootScope.selectedBranchId).then(function (response) {
                    $scope.LoanOfficers = response.data.filter(lo=>lo.Status==$rootScope.EmployeeConfig.EmploymentStatus.Working);
                    if ($scope.LoanOfficers.length > 0) {
                        $scope.LoanOfficers.forEach(function(lo) {
                            lo.Name = lo.Name;
                        });
                    }
                    console.log(response.data);
                    console.log($scope.LoanOfficers);
                        $scope.member.MoveFromLoId = $scope.LoanOfficers[0].Id;
                        $scope.member.MoveToLoId = $scope.LoanOfficers[0].Id;
                        $scope.getGroupsByProgramOfficer($scope.member.MoveFromLoId, 'original');
                        $scope.getGroupsByProgramOfficer($scope.member.MoveToLoId, 'changed');
                });
            }
        }
        $scope.init = function () {
            $scope.getLoanOfficerByBranch();
            $scope.addLoanGroupFilterData();
            
        }

        $scope.init();

        $scope.clearAndCloseTab = function () {
            $scope.member = {};
            $scope.removeTab($scope.tab);
        };
        $scope.moveMember = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            console.log($scope.member);
            swal({
                title: "Confirm?",
                text: "The Member will be Moved",
                type: "warning",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                showCancelButton: true
            },
            function () {
                memberService.moveMember($scope.member).then(function (response) {
                    if (response.data.Success) {
                        swal({
                            title: "Moved Successfully",
                            text: "What do you want to do next?",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonColor: "#008000",
                            confirmButtonText: "Move another Member",
                            cancelButtonText: "Close and Exit",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                            function (isConfirm) {
                                if (isConfirm) {
                                    $scope.moveMemberForm.reset();
                                    $scope.moveMemberForm.$dirty = false;
                                    $scope.init();
                                } else {
                                    $scope.clearAndCloseTab();
                                }
                            });
                        $scope.getMenus();
                    } else {
                        swal("Something Went Wrong", response.data.Message, "error");
                    }
                }, AMMS.handleServiceError);
            });
        }
    }]);