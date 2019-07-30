ammsAng.controller('loanGroupSplitController', ['$scope', '$rootScope', 'branchService', 'validatorService', 'loanGroupService', 'loanGroupFilterService','employeeService',
    function ($scope, $rootScope, branchService, validatorService, loanGroupService, loanGroupFilterService, employeeService) {
        
        $scope.disolveGroup = {};
        $scope.mergeGroup = {};
        $scope.newGroup = {};
        $scope.filters = {};
        $scope.group = {};
        $scope.group.SplitDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
        $scope.groupType = {};
        $scope.dgroup = [];
        $scope.newgroupMembers = [];
        $scope.groupMembersAll = [];
        $scope.disolveGroupMeetingDay = null;
        $scope.disolveGroupTotalMember = null;
        //$scope.disolveGroupLoanOfficerList = $scope.menus[0].SubModules.filter(lo=>lo.Status!==-1);
        //$scope.mergeGroupLoanOfficerList = $scope.menus[0].SubModules.filter(lo=>lo.Status !== -1);
        $scope.group.SplittedByUserId = $rootScope.user.UserId;
        $scope.existingGroupAllMembers = null;

        $scope.getProgramOfficerOfBranch = function (branchId) {
            employeeService.getProgramOfficerOfBranch(branchId).success(function (response) {
                if ($rootScope.user.Role === $rootScope.UserRole.LO || $rootScope.user.Role === $rootScope.UserRole.HRAdmin) {
                    response = response.filter(
                            user => user.Id.toString() === $rootScope.user.EmployeeId);
                }
                $scope.disolveGroupLoanOfficerList = response;
                $scope.mergeGroupLoanOfficerList = response;
                $scope.setDefaultLoanOfficer();
                $scope.addLoanGroupFilterData();
            }).error(function (response, data) {
                console.log(data, status);
            });
        }
        $scope.setDefaultLoanOfficer = function () {
            $scope.disolveGroup.LoanOfficer = $scope.disolveGroupLoanOfficerList.length > 0 ? $scope.disolveGroupLoanOfficerList[0].Id : null;
            $scope.mergeGroup.LoanOfficer = $scope.mergeGroupLoanOfficerList.length > 0 ? $scope.mergeGroupLoanOfficerList[0].Id : null;
            if ($scope.disolveGroup.LoanOfficer) {
                $scope.getGroupsByProgramOfficerForDisolve($scope.disolveGroup.LoanOfficer);
            }
            //$scope.getGroupTypesOfLoanOfficer($scope.disolveGroup.LoanOfficer);
        }
        $scope.getWeeklyHolidayListOfTheYear = function () {
            $scope.weeklyHolidayListOfTheYear = null;
            loanGroupService.getWeeklyHolidayListOfTheYear(parseInt(moment($rootScope.workingdate).format("YYYY"))).then(function (response) {
                if (response.data) {
                    $scope.weeklyHolidayListOfTheYear = response.data.split(",");
                    console.log($scope.weeklyHolidayListOfTheYear);
                    console.log($scope.weeklyHolidayListOfTheYear);
                    $scope.weeklyHolidayListOfTheYear.forEach(function (holiday) {
                        var i = $scope.filters.MeetingDay.find(m => m.Name == holiday);
                        if (i != undefined)
                            i.DisabledState = true;
                    });
                }
            });
        }
        $scope.getDetails = function (groupId) {
            if (groupId != null) {
                loanGroupService.getDetails(groupId).then(function (response) {
                    $scope.disolveGroupMeetingDay = response.data;
                }, AMMS.handleServiceError);
            }
        }

        $scope.shiftRight = function () {
            if ($scope.groupMembers == null || $scope.groupMembers.length <= 1) {
                swal("Group has less than 2 members. Group can't be splitted");
                return;
            }
            if (($scope.existingGroupAllMembers.length - ($scope.newgroupMembers.length + $scope.dgroup.groupMembers.length)) < 1) {
                swal("Existing group must have at least 1 active member");
                return;
            }
            if ($scope.dgroup.groupMembers != null) {
                
                for (var j = 0; j < $scope.dgroup.groupMembers.length; j++) {
                    $scope.newgroupMembers.push($scope.dgroup.groupMembers[j]);
                }

                for (var i = 0; i < $scope.dgroup.groupMembers.length; i++) {
                    var index = $scope.groupMembers.indexOf($scope.dgroup.groupMembers[i]);
                    $scope.groupMembers.splice(index, 1);
                }
            }
            $scope.dgroup.groupMembers = [];
        }

        $scope.shiftLeft = function () {
            if ($scope.dgroup.newgroupMembers != null) {
                for (var j = 0; j < $scope.dgroup.newgroupMembers.length; j++) {
                    $scope.groupMembers.push($scope.dgroup.newgroupMembers[j]);
                }
                for (var i = 0; i < $scope.dgroup.newgroupMembers.length; i++) {
                    var index = $scope.newgroupMembers.indexOf($scope.dgroup.newgroupMembers[i]);
                    $scope.newgroupMembers.splice(index, 1);
                }
            }
            $scope.dgroup.newgroupMembers = [];
        }
        $scope.shiftAllLeft = function () {
            $scope.groupMembers = [];
            $scope.groupMembers = angular.copy($scope.existingGroupAllMembers);
            $scope.newgroupMembers = [];

        }

        $scope.$on('tab-switched', function () {
            if ($rootScope.hasOwnProperty("editloanGroupId")) {
                $scope.getloanGroupInfo();
            }
        });

        $scope.getGroupsByProgramOfficerForDisolve = function (programOfficerId) {
            if (programOfficerId != null) {
                $scope.groupType = [];
                loanGroupFilterService.getGroupsByProgramOfficerAndGroupType(programOfficerId).then(function (response) {
                    $scope.disolveGroupGroupList = response.data;
                }, AMMS.handleServiceError);
            }
        }
        //$scope.getGroupsByProgramOfficerAndGroupTypeForMerge = function (programOfficerId, grouptypeId) {
        //    if (programOfficerId != null) {
        //        loanGroupFilterService.getGroupsByProgramOfficerAndGroupType(programOfficerId, grouptypeId).then(function (response) {
        //            $scope.mergeGroupGroupList = response.data;
        //        }, AMMS.handleServiceError);
        //    }
        //}
        $scope.getGroupTypesOfSelectedGroup = function (groupId) {
            $scope.newgroupMembers = [];
            $scope.groupMembers = [];
            if (groupId != null) {
                loanGroupFilterService.getGroupTypesOfLoanOfficer(groupId).then(function (response) {
                    $scope.groupType = response.data;
                    $scope.disolveGroup.groupType = $scope.groupType[0].Value;
                    $scope.mergeGroup.groupType = $scope.groupType[0].Value;
                }, AMMS.handleServiceError);
            }
        }

        //$scope.getMergeLoanOfficerGroups = function (programOfficerId) {
        //    if (programOfficerId != null) {
        //        loanGroupFilterService.getGroups(programOfficerId).then(function (response) {
        //            $scope.mergeGroupGroupList = response.data;
        //        }, AMMS.handleServiceError);
        //    }
        //}
        //$scope.newGroupNameValidation = function (newGroupName) {
        //    if (newGroupName == undefined) return true;
        //    if ($scope.mergeGroupGroupList != null) {
        //        var gn = $scope.mergeGroupGroupList.findIndex(g => g.Name.toLowerCase() === newGroupName.toLowerCase());
        //        if (gn !== -1) {
        //            return "Group Name already exist";
        //        }
        //    }
        //    return true;
        //}
        $scope.getMembersByGroupId = function (groupId) {
            $scope.newgroupMembers = [];
           if (groupId != null) {
                loanGroupFilterService.getMembersByGroupId(groupId).then(function (response) {
                    $scope.groupMembers = response.data;
                    $scope.disolveGroupTotalMember = $scope.groupMembers.length;
                    $scope.groupMembersAll = response.data;
                    $scope.existingGroupAllMembers = angular.copy(response.data);
                }, AMMS.handleServiceError);
            }

        }

        $scope.addLoanGroupFilterData = function () {
            $scope.filtersservice = loanGroupFilterService.getLoanGroupAddfilters().then(function (response) {
                var data = response.data;
                $scope.filters.MeetingDay = data.MeetingDay.filter(d=>d.Value !== "8");//8 for None
                $scope.filters.DefaultPrograms = data.DefaultPrograms;
                $scope.getWeeklyHolidayListOfTheYear();
            }, AMMS.handleServiceError);
        }
       

        $scope.clearAndCloseTab = function () {
            $scope.group = {};
            $scope.removeTab($scope.tab);
        };

        $scope.$on('group-split-finished', function () {
            $scope.newgroupMembers = [];
            $scope.groupMembers = [];
        });
        $scope.SplitGroup = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            if ($scope.newgroupMembers != null && $scope.newgroupMembers.length <= 0) {
                swal("New group doesn't have any members. Split can't be done");
                return;
            }
            $scope.group.NewGroupMembers = [];
            for (var i = 0; i < $scope.newgroupMembers.length; i++) {
                $scope.group.NewGroupMembers.push($scope.newgroupMembers[i].Id);
            }
            
            $scope.group.Splitter = $rootScope.user.UserId;
            $scope.group.NewGroupMeetingDayId = $scope.mergeGroup.MeetingDay;

            $scope.group.DissolveGroupLoanOfficerId = $scope.disolveGroup.LoanOfficer;
            $scope.group.DissolveGroupId = $scope.disolveGroup.Group;
            $scope.group.NewGroupLoanOfficerId = $scope.mergeGroup.LoanOfficer;
            swal({
                    title: "Confirm?",
                    text: "This group will Split !",
                    type: "info",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                },
                function () {
                    $scope.group.OriginatingBranchId = $rootScope.selectedBranchId;
                    loanGroupService.splitloanGroup($scope.group).then(function(response) {
                        if (response.data.Success) {
                            swal("Groups Split", "Successfully!", "success");
                            $rootScope.$broadcast('group-split-finished');
                            $scope.getMenus();
                            $scope.clearAndCloseTab();
                        } else {
                            swal("Something went wrong", "", "error");
                        }
                    }, AMMS.handleServiceError);
                });
        }
        $scope.init = function () {
            $scope.getProgramOfficerOfBranch($rootScope.selectedBranchId);
        }
        $scope.init();
    }]);