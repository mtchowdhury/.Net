ammsAng.controller('memberMeetingDayChangeController', ['$scope', '$rootScope', 'filterService', 'memberService', 'loanGroupFilterService','$timeout',
    function ($scope, $rootScope, filterService, memberService, loanGroupFilterService, $timeout) {
        $scope.member = {};
        $scope.member.Id = '';
        $scope.member.Rows = [];
        $scope.memberIds = [];
        $scope.member.Notes = '';

        

        $scope.getFilterData = function () {
            console.log($scope.selectedMenu);
            loanGroupFilterService.getLoanGroupAddfilters().then(function (response) {
                console.log(response.data);
                var thisYearObject = response.data.Calendar.filter(c=>c.Value === moment($rootScope.workingdate).year().toString())[0];
                $scope.thisYearWeeklyHolidays = thisYearObject.Name.split(',');
                $scope.MeetingDays = response.data.MeetingDay;
                $scope.MeetingDays.forEach(function (m) {
                    m.DisabledState = false;
                });
                $scope.MeetingDays.forEach(function (m) {
                    m.Value = parseInt(m.Value);
                    $scope.thisYearWeeklyHolidays.forEach(function (holiday) {
                        if (m.Name === holiday) m.DisabledState = true;
                    });
                    
                });
                //$scope.selectedGroups = $scope.selectedMenu.SubModules;
                //$scope.getGroupMeetingDayChangeLogs();

            });
            memberService.getMembersOfGroup($scope.selectedMenu.Id).then(function (response) {
                $scope.selectedMembers = response.data.filter(m=>m.Status === $rootScope.MemberConfig.MemberStatus.Active);
                $scope.selectedMembers.forEach(function(m) {
                    m.DisplayName = m.NickName + '/' + m.GuardianName + '(' + m.PassbookNumber +
                    ')';
                });
                console.log($scope.selectedMembers);
                $scope.getMemberMeetingDayChangeLogs();
            });
        }
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5));
        }

        $scope.getMemberMeetingDayChangeLogs = function () {

            $("#loadingImage").css("display", "block");

            $scope.changeLogs = [];
            $scope.memberIds = [];
            $scope.member.Id = null;
            $scope.popup = [];
            $scope.dateOptions = {
                dateDisabled: disabled,
                formatYear: 'yyyy',
                maxDate: new Date(2040, 12, 31),
                minDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
                startingDay: 1
            };

            $scope.selectedMembers.forEach(function (member) {
                $scope.memberIds.push(member.Id);
            });
            console.log($scope.selectedMembers);
            memberService.getMemberMeetingDayChangeLogs($scope.memberIds).then(function (response) {
               
                $scope.changeLogs = {};
                $scope.changeLogs = response.data;

                $scope.changeLogs.forEach(function (item) {
                    item.EffectiveFromDate = new Date(moment(item.EffectiveFromDate).format("YYYY-MM-DD"));
                    item.EffectiveToDate = item.EffectiveToDate == null ? "" : new Date(moment(item.EffectiveToDate).format("YYYY-MM-DD"));
                    
                });

                $("#loadingImage").css("display", "none");
                
            });
            $scope.initiateRow($scope.member.Id);
        }
      

        //$scope.beforeDateRender = function ($dates) {
        //    var maxDate = null;
        //    var minDate = null;

        //    if ($scope.member.Rows.length > 1)
        //        maxDate = new Date($scope.member.Rows[$scope.member.Rows.length - 2].EffectiveFromDate).setUTCHours(0, 0, 0, 0);
        //    minDate = new Date($rootScope.workingdate).setUTCHours(0, 0, 0, 0);
        //    maxDate = moment(maxDate).add('days', 1);
        //    if ($dates.length > 27) {
        //        for (d in $dates) {
        //            if ($dates.hasOwnProperty(d)) {
        //                if ($dates[d].utcDateValue <= maxDate || $dates[d].utcDateValue<=minDate) {
        //                    $dates[d].selectable = false;
        //                }
        //            }
        //        }
        //    }
        //    $scope.endDateSetter();
        //}
        //$scope.endDateSetter = function () {
        //    if ($scope.member.Rows.length > 1)
        //    $scope.member.Rows[$scope.member.Rows.length - 2].EffectiveToDate = $scope.member.Rows[$scope.member.Rows.length - 1].EffectiveFromDate ?
        //       moment($scope.member.Rows[$scope.member.Rows.length - 1].EffectiveFromDate).add('days', -1) : null;
        //}
        $scope.open = function (index) {
            $scope.member.Rows[index].opened = true;
        };
        $scope.effectiveFromDateChanged = function (index) {
            $scope.member.Rows[index - 1].EffectiveToDate = new Date(moment($scope.member.Rows[index].EffectiveFromDate).add(-1, "days").format("YYYY-MM-DD"));
        }

        $scope.initiateRow = function (mid) {
            if (mid === null|| mid==='')return;
            var selectedMemberLogs = $scope.changeLogs.filter(l => l.MemberId === mid);
            $scope.member.Rows = angular.copy(selectedMemberLogs);

            var index = {};
            index.CurrentMeetingDayId = 0;
            $scope.member.Rows.push(index);
        }
        $scope.getlogObject = function () {
            $scope.logObject = {};
            $scope.invalid = false;

            $scope.logObject.UpdatedOn = moment($rootScope.workingdate).format();
            $scope.logObject.MemberId = $scope.member.Id;
            if ($scope.logObject.memberId === '') {
                swal('please select a member first!');
                $scope.invalid = true;
                return;
            }
            if ($scope.member.Rows[$scope.member.Rows.length - 1].EffectiveFromDate === null || $scope.member.Rows[$scope.member.Rows.length - 1].EffectiveFromDate === undefined) {
                swal('please select a Effective-From-Date!');
                $scope.invalid = true;
                return;
            }
           // $scope.logObject.EffectiveFromDate = moment($scope.member.Rows[$scope.member.Rows.length - 1].EffectiveFromDate).format();

            $scope.logObject.EffectiveFromDate = new Date(moment($scope.member.Rows[$scope.member.Rows.length - 1].EffectiveFromDate).format("YYYY-MM-DD"));

            $scope.logObject.NewMeetingDayId = $scope.member.Rows[$scope.member.Rows.length - 1].NewMeetingDayId;
            if ($scope.logObject.NewMeetingDayId === undefined || $scope.logObject.NewMeetingDayId === 0 || $scope.logObject.NewMeetingDayId === $scope.member.Rows[$scope.member.Rows.length - 2].NewMeetingDayId) {
                swal('please select a New Meeting Day!');
                $scope.invalid = true;
                return;
            }
            $scope.logObject.Notes = $scope.member.Notes;
            if ($scope.logObject.Notes.length < 1) {
                swal("please put some remarks on notes field!");
                $scope.invalid = true;
                return;
            }

        }

        $scope.changeMeetingDay = function () {
            $scope.getlogObject();
            if ($scope.invalid) return;

            
            swal({
                title: $rootScope.showMessage($rootScope.addConfirmation, 'MemberMeetingDayChange'),
                showCancelButton: true,
                confirmButtonText: "Yes, Change it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true

            }, function (isConfirmed) {
                if (isConfirmed) {

                    memberService.changeMeetingDay($scope.logObject).then(function (response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('meeting-day-change-finished', $scope.member);
                            swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.memberMeetingDayChange), "Successful!", "success");
                            $scope.clearAndCloseTab();

                        } else {
                            swal($rootScope.showMessage($rootScope.addError, $rootScope.memberMeetingDayChange), response.data.Message, "error");
                        }
                    }, AMMS.handleServiceError);
                }
            });
        }


        $scope.init = function () {
           
            $scope.getFilterData();


        }
        $scope.clearAndCloseTab = function () {
            $scope.member = {};
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

        $scope.init();

    }]);