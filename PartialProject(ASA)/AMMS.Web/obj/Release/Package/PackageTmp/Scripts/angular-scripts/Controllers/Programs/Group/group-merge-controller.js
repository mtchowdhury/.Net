ammsAng.controller('loanGroupMergeController', ['$scope', '$rootScope', 'branchService', 'validatorService', 'loanGroupService', 'loanGroupFilterService','employeeService',
    function ($scope, $rootScope, branchService, validatorService, loanGroupService, loanGroupFilterService, employeeService) {
        
        $scope.disolveGroup = {};
        $scope.mergeGroup = {};
        $scope.filters = {};
        $scope.group = {};
        $scope.groupTypeList = {};
        $scope.disolveGroupMeetingDay = null;
       // $scope.disolveGroupLoanOfficerList = $scope.menus[0].SubModules;
       // $scope.mergeGroupLoanOfficerList = $scope.menus[0].SubModules;
        $scope.disolveGroup.groupType = "1";
        $scope.mergeGroup.groupType = "1";
        $scope.group.MergeDate = moment($rootScope.workingdate).format();
        
        

        $scope.getProgramOfficerOfBranch = function (branchId) {
            employeeService.getProgramOfficerOfBranch(branchId).success(function (response) {
              if ($rootScope.user.Role === $rootScope.UserRole.LO || $rootScope.user.Role === $rootScope.UserRole.HRAdmin) {
                    response = response.filter(
                            user => user.Id.toString() === $rootScope.user.EmployeeId);
                }
                //$rootScope.$broadcast('program-officer-fetched', response, branchId);
              console.log(response);
//              if (response.length > 0) {
//                  response.forEach(function (lo) {
//                      lo.Name = lo.Name + " (" + lo.EmployeeId + ")";
//                  });
//              }
                $scope.disolveGroupLoanOfficerList = response;
                $scope.mergeGroupLoanOfficerList = response;

               // $scope.getProgramOfficerOfBranch($scope.selectedBranchId);
                $scope.addLoanGroupFilterData();
                $scope.setDefaultLoanOfficer();
                $scope.getGroupTypesOfLoanOfficer($scope.disolveGroup.LoanOfficer);
                $scope.getGroupsByProgramOfficerAndGroupTypeForDisolve($scope.disolveGroup.LoanOfficer, $scope.disolveGroup.groupType);
            }).error(function (response, data) {
                console.log(data, status);
            });
        }

        $scope.getDetails = function (groupId, id) {
            if (groupId != null) {
                $("#loadingImage").css("display", "block");
                loanGroupService.getDetails(groupId).then(function(response) {
                    if (id === 2) {
                        $scope.disolveGroupMeetingDay = response.data;
                    }
                    if (id === 1) {
                        $scope.mergeGroupMeetingDay = response.data;
                    }
                    $("#loadingImage").css("display", "none");
                }, AMMS.handleServiceError);
            } else {
                if (id === 2) $scope.disolveGroupMeetingDay = undefined;
                if (id === 1) $scope.mergeGroupMeetingDay = undefined;
            }
        }
        $scope.getMembersByGroupId = function (groupId, id) {
           if (groupId != null) {
               loanGroupFilterService.getMembersByGroupId(groupId).then(function(response) {
                   $scope.groupMembers = response.data;
                   if (id === 2) {
                       $scope.disolveGroupTotalMember = $scope.groupMembers.length;
                   }
                   if (id === 1) {
                       $scope.mergeGroupTotalMember = $scope.groupMembers.length;
                   }
               }, AMMS.handleServiceError);
           } else {
               if (id === 2) $scope.disolveGroupTotalMember = 0;
              
               if (id === 1) $scope.mergeGroupTotalMember = 0;
           }

        }       

        $scope.$on('tab-switched', function () {
            if ($rootScope.hasOwnProperty("editloanGroupId")) {
                $scope.getloanGroupInfo();
            }
        });


        $scope.getGroupsByProgramOfficerAndGroupTypeForDisolve = function (programOfficerId, grouptypeId) {
            if (programOfficerId != null) {
                loanGroupFilterService.getGroupsByProgramOfficerAndGroupTypeForReal(programOfficerId, grouptypeId).then(function(response) {                  
                    $scope.disolveGroupGroupList = response.data;

                    $scope.setSameGroupType();
                    $scope.disolveGroup.Group = $scope.disolveGroupGroupList.length>0? $scope.disolveGroupGroupList[0].Value:undefined;
                    $scope.getGroupsByProgramOfficerAndGroupTypeForMerge($scope.mergeGroup.LoanOfficer, $scope.mergeGroup.groupType);

                    $scope.getMembersByGroupId($scope.disolveGroup.Group, 2);
                    $scope.getDetails($scope.disolveGroup.Group, 2);
                    

                }, AMMS.handleServiceError);
            }
        }
        $scope.getGroupsByProgramOfficerAndGroupTypeForMerge = function (programOfficerId, grouptypeId) {
           if (programOfficerId != null) {
               loanGroupFilterService.getGroupsByProgramOfficerAndGroupTypeForReal(programOfficerId, grouptypeId).then(function (response) {
                    $scope.mergeGroupGroupList = response.data;
                    $scope.mergeGroup.Group =$scope.mergeGroupGroupList.length>0? $scope.mergeGroupGroupList[0].Value:undefined;
                    $scope.getMembersByGroupId($scope.mergeGroup.Group, 1);
                    $scope.getDetails($scope.mergeGroup.Group, 1);
                }, AMMS.handleServiceError);
            }
        }
        
        $scope.getGroupTypesOfLoanOfficer = function (programOfficerId, id) {
            if (programOfficerId != null) {
                
                loanGroupFilterService.getAllGroupTypes().then(function (response) {
                   $scope.groupTypeList = response.data;
                }, AMMS.handleServiceError);
            }
        }

        $scope.getMergeLoanOfficerGroups = function (programOfficerId) {
            if (programOfficerId != null) {
                loanGroupFilterService.getGroups(programOfficerId).then(function (response) {
                   $scope.mergeGroupGroupList = response.data;
                }, AMMS.handleServiceError);
            }
        }

        
        $scope.getGroupDetails = function (groupId) {
            if (groupId != null) {
                loanGroupService.getloanGroup(groupId).then(function (response) {
                    $scope.disolveGroup.groupType = response.data.GroupType;
                }, AMMS.handleServiceError);
            }
            loanGroupFilterService.getGroupTypes().then(function (response) {
                    $scope.groupTypeList = response.data;
            }, AMMS.handleServiceError);
        }

        $scope.addLoanGroupFilterData = function () {
            $scope.filtersservice = loanGroupFilterService.getLoanGroupAddfilters().then(function (response) {
                var data = response.data;
                $scope.filters.MeetingDay = data.MeetingDay;
                $scope.filters.DefaultPrograms = data.DefaultPrograms;

            }, AMMS.handleServiceError);
        }

        $scope.setDefaultLoanOfficer = function () {
           
            $scope.disolveGroup.LoanOfficer =$scope.disolveGroupLoanOfficerList.length>0? $scope.disolveGroupLoanOfficerList[0].Id:null;
            $scope.mergeGroup.LoanOfficer =$scope.mergeGroupLoanOfficerList.length>0? $scope.mergeGroupLoanOfficerList[0].Id:null;

            $scope.getGroupTypesOfLoanOfficer($scope.disolveGroup.LoanOfficer);

        }

        $scope.setSameGroupType = function () {
            $scope.mergeGroup.groupType = $scope.mergeGroup.LoanOfficer!==undefined ? $scope.disolveGroup.groupType : null;

        }

        if ($scope.selectedBranchId)
        $scope.getProgramOfficerOfBranch($scope.selectedBranchId);
        
        $scope.clearAndCloseTab = function () {
            $scope.group = {};
            $scope.removeTab($scope.tab);
        };


        

        $scope.mergeLoanGroup = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            if ($scope.disolveGroup.Group === $scope.mergeGroup.Group) {
                swal('Dissolving and merging groups are same.Please select different groups !');
                return;
            }
            if ($scope.disolveGroupTotalMember < 1) {swal('Selected dissolveing group has no active member and can not merged!');
                return;
            }
            if ($scope.mergeGroupTotalMember < 1) {swal('Selected merging group has no active member and can not merged!');
                return;
            }
            $scope.group.Merger = $rootScope.user.UserId;
            var data1 = JSON.stringify({
                disolveGroup: $scope.disolveGroup,
                mergeGroup: $scope.mergeGroup
            });
            $scope.group.dissolveGroupLoanOff = $scope.disolveGroup.LoanOfficer;
            $scope.group.dissolveGroupNo = $scope.disolveGroup.Group;
            $scope.group.mergeGroupLoanOff = $scope.mergeGroup.LoanOfficer;
            $scope.group.mergeGroupNo = $scope.mergeGroup.Group;
            swal({
                title: "Confirm?",
                text: "This two groups will be Merged !",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
            function () {
                loanGroupService.mergeloanGroup($scope.group).then(function (response) {
                    if (response.data.Success) {
                        swal("Groups Merged", "Successfully!", "success");
                        $rootScope.$broadcast('group-merge-finished');
                        $scope.getMenus();
                        $scope.clearAndCloseTab();
                    } else {
                        swal("Something went wrong", "", "error");
                    }
                }, AMMS.handleServiceError);
            });
        };
    }]);