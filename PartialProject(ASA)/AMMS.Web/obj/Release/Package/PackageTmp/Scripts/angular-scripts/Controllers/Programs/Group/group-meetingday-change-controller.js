ammsAng.controller('groupMeetingDayChangeController', ['$scope', '$rootScope', 'filterService', 'loanGroupService', 'loanGroupFilterService', 'validatorService','$timeout',
    function ($scope, $rootScope, filterService, loanGroupService, loanGroupFilterService, validatorService, $timeout) {
        
        $scope.group = {};
        $scope.group.Id = '';
        $scope.group.Rows = [];
        $scope.groupIds = [];
        $scope.group.Notes = '';

        $scope.getGrouopTypeId=function() {
            if ($scope.selectedMenu.Name === 'General') {
                $scope.GroupTypeId = 1;
            }
            if ($scope.selectedMenu.Name === 'Special') {
                $scope.GroupTypeId = 2;
            }
            if ($scope.selectedMenu.Name === 'Bad-Debt') {
                $scope.GroupTypeId = 21;
            }
            $scope.getFilterData();
        }
       
        $scope.getFilterData=function() {
            loanGroupFilterService.getLoanGroupAddfilters().then(function(response) {
                console.log(response.data);
                var thisYearObject = response.data.Calendar.filter(c=>c.Value === moment($rootScope.workingdate).year().toString())[0];
                $scope.thisYearWeeklyHolidays = thisYearObject.Name.split(',');
                $scope.MeetingDays = response.data.MeetingDay;
                $scope.MeetingDays.forEach(function(m) {
                    m.DisabledState = false;
                });
                $scope.MeetingDays.forEach(function (m) {
                    m.Value = parseInt(m.Value);
                    $scope.thisYearWeeklyHolidays.forEach(function(holiday) {
                        if (m.Name === holiday) m.DisabledState = true;
                 });
                  
                });
                //$scope.selectedGroups = $scope.selectedMenu.SubModules;
                //$scope.getGroupMeetingDayChangeLogs();
                loanGroupService.getGroupsB($scope.selectedMenu.programOfficerId, $scope.GroupTypeId).then(function (response) {
                    $scope.selectedGroups = response.data.filter(g=>g.GroupStatus === 1);

                    $scope.getGroupMeetingDayChangeLogs();
                });
            });
           
        }
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5));
        }


        $scope.getGroupMeetingDayChangeLogs = function () {
            $("#loadingImage").css("display", "block");
            $scope.changeLogs = [];
            $scope.groupIds = [];
            $scope.group.Id = null;
            $scope.popup = [];
            // $scope.dateOptions = [];
            $scope.dateOptions = {
                dateDisabled: disabled,
                formatYear: 'yyyy',
                maxDate: new Date(2040, 12, 31),
                minDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
                startingDay: 1
            };
            $scope.selectedGroups.forEach(function (group) {
                $scope.groupIds.push(group.Id);
            });
            loanGroupService.getGroupMeetingDayChangeLogs($scope.groupIds).then(function (response) {
                $scope.changeLogs = {};
              $scope.changeLogs = response.data;
              $scope.changeLogs.forEach(function (item) {
                  item.EffectiveFromDate = new Date(moment(item.EffectiveFromDate).format("YYYY-MM-DD"));
                  item.EffectiveToDate = item.EffectiveToDate == null ? "" : new Date(moment(item.EffectiveToDate).format("YYYY-MM-DD"));
                  //item.EffectiveFromDate = new Date(moment(item.EffectiveFromDate).format("YYYY-MM-DD"));
                  //item.EffectiveToDate = item.EffectiveToDate == null ? "" : new Date(moment(item.EffectiveToDate).format("YYYY-MM-DD"));
                  //$scope.popup.push({ opened: false });
                  //$scope.dateOptions.push({
                  //    dateDisabled: disabled,
                  //    formatYear: 'yyyy',
                  //    maxDate: new Date(2040, 12, 31),
                  //    minDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
                  //    startingDay: 1
                  //});
              });
              $("#loadingImage").css("display", "none");
          });
          $scope.initiateRow($scope.group.Id);
      }

        //$scope.beforeDateRender=function($dates)
        //{
        //    var maxDate = null;
        //    var minDate = null;
        //    if ($scope.group.Rows.length > 1)
        //        maxDate = new Date($scope.group.Rows[$scope.group.Rows.length - 2].EffectiveFromDate).setUTCHours(0, 0, 0, 0);
        //    minDate = new Date($rootScope.workingdate).setUTCHours(0, 0, 0, 0);
        //    maxDate = moment(maxDate).add('days', 1);
        //    if ($dates.length > 27) {
        //        for (d in $dates) {
        //            if ($dates.hasOwnProperty(d)) {
        //                if ($dates[d].utcDateValue <= maxDate || $dates[d].utcDateValue <= minDate) {
        //                    $dates[d].selectable = false;
        //                }
        //            }
        //        }
        //    }
        //    $scope.endDateSetter();
        //}
        //$scope.endDateSetter = function () {
        //    if ($scope.group.Rows === undefined) return;
        //    if ($scope.group.Rows.length > 1)
        //    $scope.group.Rows[$scope.group.Rows.length - 2].EffectiveToDate = $scope.group.Rows[$scope.group.Rows.length - 1].EffectiveFromDate ?
        //       moment ($scope.group.Rows[$scope.group.Rows.length - 1].EffectiveFromDate).add('days',-1) : null;
        //}
        //$scope.dateOptions = {
        //    //dateDisabled: disabled,
        //    formatYear: 'yyyy',
        //    maxDate: new Date(2040, 12, 31),
        //    minDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
        //    startingDay: 1
        //};
        $scope.open = function (index) {
            // $scope.popup[index].opened = true;
            $scope.group.Rows[index].opened = true;
        };
        $scope.effectiveFromDateChanged=function(index) {
            $scope.group.Rows[index - 1].EffectiveToDate = new Date(moment($scope.group.Rows[index].EffectiveFromDate).add(-1, "days").format("YYYY-MM-DD"));
        }
        $scope.initiateRow = function (gid) {
            $scope.group.Rows = [];
            if (gid === null || gid === '') return;
            var selectedGroupLogs = $scope.changeLogs.filter(l => l.GroupId === gid);
            $scope.group.Rows = angular.copy(selectedGroupLogs);

            var index = {};
            index.CurrentMeetingDayId = 0;
            $scope.group.Rows.push(index);
        }
        $scope.getlogObject=function() {
            $scope.logObject = {};
            $scope.invalid = false;
            
            $scope.logObject.UpdatedOn = moment($rootScope.workingdate).format();
            $scope.logObject.GroupId = $scope.group.Id;
            $scope.logObject.ChangeBranchDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
           // $scope.logObject.CreatedBy = $rootScope.user.EmployeeId;
            if ($scope.logObject.GroupId === '') {
                swal('please select a group first!');
                $scope.invalid = true;
                return;
            }
            if ($scope.group.Rows[$scope.group.Rows.length - 1].EffectiveFromDate === null ||$scope.group.Rows[$scope.group.Rows.length - 1].EffectiveFromDate ===undefined) {
                swal('please select a Effective-From-Date!');
                $scope.invalid = true;
                return;
            }
            //$scope.logObject.EffectiveFromDate = moment($scope.group.Rows[$scope.group.Rows.length - 1].EffectiveFromDate).format();
            $scope.logObject.EffectiveFromDate =new Date(moment($scope.group.Rows[$scope.group.Rows.length - 1].EffectiveFromDate).format("YYYY-MM-DD"));
           
            $scope.logObject.NewMeetingDayId = $scope.group.Rows[$scope.group.Rows.length - 1].NewMeetingDayId;
            if ($scope.logObject.NewMeetingDayId === undefined ||
             //   $scope.logObject.NewMeetingDayId === 8 ||
                $scope.logObject.NewMeetingDayId === $scope.group.Rows[$scope.group.Rows.length - 2].NewMeetingDayId) {
                swal('please select a New Meeting Day!');
                $scope.invalid = true;
                return;
            }
            $scope.logObject.Notes = $scope.group.Notes;
            $scope.logObject.Notes = $scope.group.Notes;
            if ($scope.logObject.Notes.length < 1) {
                swal("please put some remarks on notes field!");
                $scope.invalid = true;
                return;
            }
            
        }

        $scope.changeMeetingDay = function () {
            $scope.getlogObject();
            if ($scope.invalid)return;
            swal({
                title: $rootScope.showMessage($rootScope.addConfirmation, 'GroupMeetingDayChange'),
                showCancelButton: true,
                confirmButtonText: "Yes, Change it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true

            }, function (isConfirmed) {
                if (isConfirmed) {
                   
                    loanGroupService.changeMeetingDay($scope.logObject).then(function (response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('meeting-day-change-finished', $scope.group);
                            swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.groupMeetingDayChange), "Successful!", "success");
                            $scope.clearAndCloseTab();

                        } else {
                            swal($rootScope.showMessage($rootScope.addError, $rootScope.groupMeetingDayChange), response.data.Message, "error");
                        }
                    }, AMMS.handleServiceError);
                }
            });
        }
       
        $scope.init = function () {
            $scope.getGrouopTypeId();
           
            
        }
        $scope.clearAndCloseTab = function () {
            $scope.group = {};
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

        $scope.init();
       
       
    }]);