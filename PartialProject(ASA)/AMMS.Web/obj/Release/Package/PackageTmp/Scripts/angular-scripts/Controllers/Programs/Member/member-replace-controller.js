ammsAng.controller('memberReplaceController', ['$scope', '$rootScope', 'filterService', 'memberService', 'loanGroupFilterService','$timeout',
    function ($scope, $rootScope, filterService, memberService, loanGroupFilterService, $timeout) {

        $scope.replace = {};
        $scope.replace.WorkingDate = moment($rootScope.workingdate).format();
        $scope.roleId = $rootScope.user.Role;

        $scope.getFilterData = function () {
            memberService.getReplacableMembersByGroupId($scope.selectedMenu.Id).then(function (response) {
               // $scope.groupMembers = angular.copy(response.data.filter(m=>m.Status === $rootScope.MemberConfig.MemberStatus.Active));
                $scope.groupMembers = response.data.groupMembers;

               // $scope.newMembers = $scope.groupMembers.filter(m=>m.MemberEntryStatus === 2);
                $scope.newMembers = response.data.newMembers;

                $scope.groupMembers.forEach(function(m) {
                    m.NickName = m.NickName +'/' + m.GuardianName +'('+ m.PassbookNumber+')';
                });

                console.log($scope.groupMembers);
            });
        }
        $scope.beforeStartDateRender = function ($dates) {
            $scope.maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            $scope.minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");

            if ($scope.roleId === $rootScope.rootLevel.RM) {
                $scope.minDate = moment($rootScope.workingdate).add(-1, 'months');
            }
            else if ($scope.roleId === $rootScope.rootLevel.DM) {
                $scope.minDate = moment($rootScope.workingdate).add(-3, 'months');
            } else if ($scope.roleId === $rootScope.rootLevel.Admin) {
                $scope.minDate = moment($rootScope.workingdate).add(-50, 'years');
            }
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        if ($dates[d].utcDateValue < $scope.minDate && $dates[d].utcDateValue > $scope.maxDate) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }
            
        }
        $scope.fetchMemberData = function (memberType) {
            if (memberType === 'replace') {
                var rmember = $scope.groupMembers.filter(m => m.Id ===$scope.replace.ReplacedMemberId )[0];
                $scope.fGuardian = rmember.GuardianName;
                $scope.fPassbook = rmember.PassbookNumber;
            }
            if (memberType === 'new') {
                var fmember = $scope.groupMembers.filter(m => m.Id === $scope.replace.NewMemberId)[0];
                $scope.tGuardian = fmember.GuardianName;
                $scope.tPassbook = fmember.PassbookNumber;
            }
        }   

        $scope.replaceMember = function () {
            if ($scope.replace.NewMemberId === $scope.replace.ReplacedMemberId) {
                swal('new member and to be replaced member can not be the same!');
                return;
            }
            swal({
                title: $rootScope.showMessage($rootScope.addConfirmation, 'Member Replace'),
                showCancelButton: true,
                confirmButtonText: "Yes, Change it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true

            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.replace.WorkingDate = moment($scope.replace.WorkingDate).format();
                    memberService.replaceMember($scope.replace).then(function (response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('member-replace-finished', $scope.replace);
                            swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.memberReplace), "Successful!", "success");
                            $scope.clearAndCloseTab();

                        } else {
                            swal($rootScope.showMessage($rootScope.addError, $rootScope.memberReplace), response.data.Message, "error");
                        }
                    }, AMMS.handleServiceError);
                }
            });
        }

        $scope.clearAndCloseTab = function () {
            $scope.member = {};
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

        $scope.init=function() {
            $scope.getFilterData();
        }
        $scope.init();
    }]);