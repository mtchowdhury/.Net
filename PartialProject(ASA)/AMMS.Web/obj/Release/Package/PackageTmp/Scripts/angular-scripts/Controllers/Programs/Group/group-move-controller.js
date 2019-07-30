ammsAng.controller('loanGroupMoveController', ['$scope', '$rootScope', 'branchService', 'validatorService', 'loanGroupService', 'loanGroupFilterService','employeeService',
    function ($scope, $rootScope, branchService, validatorService, loanGroupService, loanGroupFilterService, employeeService) {

        $scope.disolveGroup = {};
        $scope.mergeGroup = {};
        $scope.newGroup = {};
        $scope.filters = {};
        $scope.group = {};
        $scope.groupTypeList = {};
        $scope.dgroup = [];
        $scope.newgroup = [];
        $scope.groupMembersAll = [];
        $scope.disolveGroupMeetingDay = null;
        $scope.disolveGroupTotalMember = null;
       // $scope.disolveGroupLoanOfficerList = $scope.menus[0].SubModules;
       // $scope.mergeGroupLoanOfficerList = $scope.menus[0].SubModules;
        var branchId = $scope.selectedBranchId;
        $scope.group.MoveDate = moment($rootScope.workingdate).format();




        $scope.getProgramOfficerOfBranch = function (branchId) {
            employeeService.getProgramOfficerOfBranch(branchId).success(function (response) {

//                if (response.length > 0) {
//                    response.forEach(function (lo) {
//                        lo.Name = lo.Name + " (" + lo.EmployeeId + ")";
//                    });
//                }
                if ($rootScope.user.Role === $rootScope.UserRole.LO || $rootScope.user.Role === $rootScope.UserRole.HRAdmin) {
                    response = response.filter(
                            user => user.Id.toString() === $rootScope.user.EmployeeId);
                }
               console.log(response);
                $scope.disolveGroupLoanOfficerList = response;
                $scope.mergeGroupLoanOfficerList = response;

                //
               
            }).error(function (response, data) {
                console.log(data, status);
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
            if ($scope.dgroup.groupMembers === undefined) {
                swal('please select at least one group to move!');
                return;
            }
                if ($scope.dgroup.groupMembers.length < 1) {
                    swal('please select at least one group to move!');
                    return;
                }
            
            
            for (var j = 0; j < $scope.dgroup.groupMembers.length; j++) {
                $scope.newgroup.push($scope.dgroup.groupMembers[j]);
            }

            for (var i = 0; i < $scope.dgroup.groupMembers.length; i++) {
                var index = $scope.groupMembers.indexOf($scope.dgroup.groupMembers[i]);
                $scope.groupMembers.splice(index, 1);
            }
            $scope.dgroup.groupMembers = [];
        }

        $scope.shiftLeft = function () {

            if ($scope.dgroup.newgroupMembers === undefined) {
                swal('please select at least one group to move!');
                return;
            }
            if ($scope.dgroup.newgroupMembers.length < 1) {
                swal('please select at least one group to move!');
                return;
            }

            for (var j = 0; j < $scope.dgroup.newgroupMembers.length; j++) {
                $scope.groupMembers.push($scope.dgroup.newgroupMembers[j]);
            }

            for (var i = 0; i < $scope.dgroup.newgroupMembers.length; i++) {
                var index = $scope.newgroup.indexOf($scope.dgroup.newgroupMembers[i]);
                $scope.newgroup.splice(index, 1);
            }
            $scope.dgroup.newgroupMembers = [];
        }
        $scope.shiftAllRight = function () {
            $scope.dgroup.groupMembers = [];
            if ($scope.groupMembersAll.length < 1) {
                swal('No groups to move!');
                return;
            }
            $scope.newgroup = angular.copy($scope.groupMembersAll);
            $scope.groupMembers = [];
        }
        $scope.shiftAllLeft = function () {
            if ($scope.groupMembersAll.length < 1) {
                swal('No groups to move!');
                return;
            }
            $scope.groupMembers = angular.copy($scope.groupMembersAll);
            $scope.newgroup = [];
            $scope.dgroup.newgroupMembers = [];
        }

        $scope.$on('tab-switched', function () {
            if ($rootScope.hasOwnProperty("editloanGroupId")) {
                $scope.getloanGroupInfo();
            }
        });

        $scope.getGroupsByProgramOfficer = function (programOfficerId) {
            if (programOfficerId != null) {
                loanGroupFilterService.getGroups(programOfficerId).then(function (response) {
//                    response.data.forEach(function (e) {
//                        e.Name = e.Name + ' ('+ e.MeetingDay.substring(0, 3) + ')';
//                    });
                    $scope.groupMembers = response.data;
                    $scope.groupMembersAll = angular.copy(response.data);
                    $scope.disolveGroupTotalMember = $scope.groupMembers.length;
                }, AMMS.handleServiceError);
            }
        }

        $scope.addLoanGroupFilterData = function () {
            $scope.filtersservice = loanGroupFilterService.getLoanGroupAddfilters().then(function (response) {
                var data = response.data;
                $scope.filters.MeetingDay = data.MeetingDay;
                $scope.filters.DefaultPrograms = data.DefaultPrograms;

            }, AMMS.handleServiceError);
        }
        $scope.addLoanGroupFilterData();

        $scope.$on('group-move-finished', function () {
            $scope.newgroup = [];
            $scope.groupMembers = [];
        });


        $scope.clearAndCloseTab = function () {
            $scope.group = {};
            $scope.removeTab($scope.tab);
        };

        $scope.clearToGroupList=function() {
            $scope.newgroup = [];
            
        }
        $scope.duplicateLoChecker=function() {
            if ($scope.disolveGroup.LoanOfficer === $scope.mergeGroup.LoanOfficer) {

                swal('please select a different officer to move group!');
                $scope.mergeGroup.LoanOfficer = null;
                return;
            }
        }
        if ($scope.selectedBranchId)
        $scope.getProgramOfficerOfBranch($scope.selectedBranchId);

        $scope.MoveGroup = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            $scope.group.Newgroups = [];

            if ($scope.disolveGroup.LoanOfficer === $scope.mergeGroup.LoanOfficer) {
                swal('Please select two different officers to move group!');
                return;
            }
            

            for (var i = 0; i < $scope.newgroup.length; i++) {
                $scope.group.Newgroups.push($scope.newgroup[i].Value);
            }
            $scope.group.Mover = $rootScope.user.UserId;
            $scope.group.NewGroupLoanOff = $scope.mergeGroup.LoanOfficer;
            if ($scope.group.Newgroups.length < 1) {
                swal('Please select at least one group to move!');
                return;
            }

            swal({
                title: "Confirm?",
                text: "This group will be Moved !",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function () {
                    loanGroupService.MoveloanGroup($scope.group).then(function (response) {
                        if (response.data.Success) {
                            swal("Groups moved", "Successfully!", "success");
                            $scope.groupMembers = null;
                            $scope.newgroup = null;
                            $scope.mergeGroup.LoanOfficer = null;
                            $scope.disolveGroup.LoanOfficer = null;
                            $rootScope.$broadcast('group-move-finished');
                            $scope.getMenus();
                            $scope.clearAndCloseTab();
                        } else {
                            swal("Something went wrong", "", "error");
                        }
                    }, AMMS.handleServiceError);
                });
        }
    }]);