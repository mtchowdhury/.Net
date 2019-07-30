ammsAng.controller('calendarEditController', ['$scope', '$rootScope', 'filterService', 'commonService','calendarService',

    function ($scope, $rootScope, filterService, commonService, calendarService) {
        $scope.saveButtonEnabled = false;
        $scope.calendarChanged = false;

        $scope.Init = function () {
            $scope.Calendar = {};
            $scope.CalendarYears = [];
            $scope.CalendarData = [];
            $scope.Calendar.CancelledHolidays = [];
            $scope.holiday = {};
            $scope.minDate = new Date();
            $scope.year = 0;
            $scope.yearSelectDisable = false;
            $scope.dateInputmessage = "";
            $scope.buttonText = "Add to list";
            $scope.editMode = false;
            $scope.weekends = [];
            $scope.editIndex = -1;
            $scope.year = $rootScope.editCalendarYear;
            $scope.CalendarYears.push($scope.year);
            $scope.branchSpecificHoliday = true;
            $scope.isEligibleForCancelling = true;
            $scope.ChangedHolidays = [];
            if ($scope.isAdmin()) $scope.branchSpecificHoliday = false;
            $scope.GetFilters();

            calendarService.getHolidays($scope.year, $rootScope.selectedBranchId).then(function (response) {
                var holiday = {};
                $scope.Calendar = response.data;
                $scope.CaledarOld = angular.copy(response.data);
                console.log(response.data);
                if ($scope.Calendar.CalendarData !== null) {
                    $scope.Calendar.CalendarData.forEach(function (day) {
                        holiday.Description = day.Description;
                        holiday.Reason = day.Reason;
                        holiday.date = moment(day.Date).format();
                        holiday.IsCommonHoliday = day.IsCommonHoliday;
                        holiday.Type = day.Type;
                        holiday.ApplicationType = day.ApplicationType;
                        holiday.TypeName = $scope.holidayTypeMain.filter(e => e.Value == holiday.Type.toString())[0].Name;
                        holiday.formatedDate = moment(day.Date).format('DD-MMM-YYYY');//because of bd  timezone;
                        $scope.CalendarData.push(angular.copy(holiday));
                    });
                }
                
                //cancelled holidays 
                if ($scope.Calendar.CancelledHolidays !== null) {
                    $scope.Calendar.CancelledHolidays.forEach(function (day) {
                        day.TypeName = $scope.holidayTypeMain.filter(e => e.Value == day.Type.toString())[0].Name;
                        day.formatedDate = moment(day.Date).format('DD-MMM-YYYY');

                    });
                }
               






                $scope.holiday.date = new Date($scope.year, 0, 1);
                filterService.getOrganizationalFilterDataByType('WeekDays')
                    .then(function (response) {
                        $scope.daysInWeek = response.data;
                        $scope.weekends = $scope.Calendar.WeeklyHolidays;
                        console.log($scope.Calendar);

                    });
            });

            
        };

        $scope.GetFilters= function() {
            calendarService.getFilters().then(function (response) {
                $scope.filters = response.data;
                $scope.holidayTypeMain = angular.copy($scope.filters.Holidaytype);
                $scope.HolidayApplicableAreaMain = angular.copy($scope.filters.HolidayApplicableArea);

                $scope.CalendarData.forEach(function(c) {
                    c.TypeName = $scope.filters.Holidaytype.filter(e=>e.Value==c.Type.toString())[0].Name;
                });
                console.log($scope.filters);
                if ($scope.isAdmin() && $rootScope.selectedBranchId == -1) {
                    $scope.holiday.Type = "1";
                    $scope.holiday.ApplicationType = "1";
                } else {
                    $scope.filters.HolidayApplicableArea = $scope.filters.HolidayApplicableArea.filter(e => e.Value === "2");
                    $scope.filters.Holidaytype = $scope.filters.Holidaytype.filter(e => e.Value === "3");
                    $scope.holiday.Type = "3";
                    $scope.holiday.ApplicationType = "2";
                }
            });
        }


        //*** Store current edited calendar ***
          
        $scope.editCalendarYear = function() {
            var calendar = {};
            if ($scope.isAdmin() && !$scope.branchSpecificHoliday) {
                calendar.CalendarData = $scope.CalendarData;
            } else {
                calendar.CalendarData = [];
                $scope.CalendarData.forEach(function (holiday) {
                    if (!holiday.IsCommonHoliday) {
                        calendar.CalendarData.push(holiday);
                    }
                });
                
            }
            
            if ($scope.branchSpecificHoliday) {
               calendar.BranchId = $rootScope.selectedBranchId;
            } else {
                calendar.BranchId = null;
            }
            calendar.CalendarYear = $scope.year;
            calendar.WeeklyHolidays = $scope.weekends;
            calendar.CreatedBy = $rootScope.user.UserId;
            calendar.SelectedBranch = $rootScope.selectedBranchId;
            calendar.BranchId = $rootScope.selectedBranchId;
            calendar.IsUserAdmin = $scope.isAdmin();
            calendar.CancelledHolidays = $scope.Calendar.CancelledHolidays;
            calendar.ChangedHolidays = $scope.ChangedHolidays;
            swal({
                    title: "Confirm?",
                    text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.calendar),
                    type: "warning",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                    showCancelButton: true
                },
                function () {
                     calendarService.editCalendatYear(calendar).then(function(response) {

                        if (response.data.Success) {
                            $rootScope.$broadcast('calendar-edit-finished');
                            swal({
                                title: $rootScope.showMessage($rootScope.editSuccess, $rootScope.calendar),
                                    type: "success"
                                },
                                function(isConfirm) {
                                    $scope.removeTab($scope.tab);
                                });
                        } else {
                            swal($rootScope.showMessage($rootScope.editError, $rootScope.calendar), response.data.Message, "error");
                        }
                    });
                });
           
        }

        $scope.changeCalendarView=function() {
            $scope.holiday.date = new Date($scope.year, 0, 1);
        }

        $scope.isPermitted = function(holiday) {
            if ($rootScope.user.Role == 1) return true;
            else if (holiday.ApplicationType == '2') {
                return true;
            }
            return false;


        }

        $scope.toggleSelection = function toggleSelection(day) {
            var idx = $scope.weekends.indexOf(day);
            if (idx > -1) {
                $scope.weekends.splice(idx, 1);
            }
            else {
                $scope.weekends.push(day);
            }
            $scope.calendarChanged = true;

        };

        $scope.addToHoliday=function() {
            if (!$scope.year) return;
            if (!$scope.holiday.Reason || $scope.holiday.Reason === "") {
                swal("please add reason for this holiday");
                return;
            }
            $scope.holiday.formatedDate = moment($scope.holiday.date).format('DD-MMM-YYYY');
            $scope.holiday.TypeName = $scope.filters.Holidaytype.filter(e => e.Value == $scope.holiday.Type.toString())[0].Name;
            
            var position = $scope.CalendarData.findIndex(e=>e.formatedDate === $scope.holiday.formatedDate);
            $scope.holiday.date = moment($scope.holiday.date);
            if ($scope.holiday.date.year() === $scope.year && position === -1) {
                $scope.holiday.date = $scope.holiday.date.format();
                $scope.CalendarData.push(angular.copy($scope.holiday));
                $scope.ChangedHolidays.push(angular.copy($scope.holiday));
                $scope.yearSelectDisable = true;
                $scope.dateInputmessage = "";
                $scope.holiday.Description = "";
                $scope.holiday.Reason = "";
            }

            if (position >= 0) {
                $scope.dateInputmessage = "this date is already in the list";
            }

            $scope.calendarChanged = true;
            
        }


        
        $scope.addToCancelledHolidays = function () {
            if (!$scope.holiday.Reason || $scope.holiday.Reason === "") {
                swal("please add reason for this Cancelled holiday");
                return;
            }
            $scope.holiday.formatedDate = moment($scope.holiday.date).format('DD-MMM-YYYY');
            $scope.holiday.TypeName = $scope.filters.Holidaytype.filter(e => e.Value == $scope.holiday.Type.toString())[0].Name;
            var position = $scope.Calendar.CancelledHolidays.findIndex(e=>e.formatedDate === $scope.holiday.formatedDate);
            $scope.holiday.date = moment($scope.holiday.date);



            if ($scope.holiday.date.year() === $scope.year && position === -1) {
                $scope.holiday.date = $scope.holiday.date.format();
                $scope.Calendar.CancelledHolidays.push(angular.copy($scope.holiday));
                $scope.yearSelectDisable = true;
                $scope.dateInputmessage = "";
                $scope.holiday.Description = "";
                $scope.holiday.Reason = "";
            }

            if (position >= 0) {
                $scope.dateInputmessage = "this date is already in the list";
            }

            $scope.calendarChanged = true;
            console.log($scope.Calendar.CancelledHolidays);

        };



        $scope.isAdmin = function() {
            if ($rootScope.user.Role == 1) return true;
            else return false;
        }

        //**checks if the date is already in the list**
        $scope.dateSet = function() {
            $scope.holiday.formatedDate = moment($scope.holiday.date).format('DD-MMM-YYYY');
            var position = $scope.CalendarData.findIndex(e=>e.formatedDate === $scope.holiday.formatedDate);
            if (position >= 0) {
                $scope.dateInputmessage = "this date is already in the list";
                $scope.isEligibleForCancelling = false;
            } else {
                var weekDayName = moment($scope.holiday.date).format('dddd');
                if ($scope.weekends.findIndex(e => e === weekDayName) >= 0) {
                    $scope.isEligibleForCancelling = false;
                } else {
                    $scope.isEligibleForCancelling = true;
                }
                $scope.dateInputmessage = "";
               
            }

        }

        $scope.removeHoliday = function (holiday) {
            var position = $scope.CalendarData.indexOf(holiday);
            var positionInChangedHolidays = $scope.ChangedHolidays.indexOf(holiday);
            if (positionInChangedHolidays > -1) $scope.ChangedHolidays.splice(position, 1);
            $scope.CalendarData.splice(position, 1);
            if ($scope.CalendarData.length === 0) {
                $scope.yearSelectDisable = false;
                
            }
            $scope.calendarChanged = true;
        }

        $scope.removeCancelledHoliday= function(holiday) {
            var position = $scope.Calendar.CancelledHolidays.indexOf(holiday);
            $scope.Calendar.CancelledHolidays.splice(position, 1);
            $scope.calendarChanged = true;
        }

        $scope.editHoliday = function (holiday, index) {
            $scope.editIndex = index;
            $scope.editMode = true;

        }

        $scope.submitChange=function() {
            $scope.editIndex = -1;
            $scope.editMode = false;
        }

        //** before rendering the calendar view this is called**
        $scope.beforeRender = function ($view,$dates) {

            
            var minDate = new Date("1/1/" + $rootScope.editCalendarYear).setHours(0, 0, 0, 0);
            var nextYear = $rootScope.editCalendarYear + 1;
            var maxDate = new Date("1/1/" + nextYear).setHours(0, 0, 0, 0) ;// Set minimum date to whatever you want here
            for (d in $dates) {
                if ($dates[d].utcDateValue < minDate || $dates[d].utcDateValue > maxDate) {
                    $dates[d].selectable = false;
                    
                   
                }
                if ($view === 'day') {
                    var dateValue = moment($dates[d].utcDateValue).format('DD-MMM-YYYY');
                    var dateName = moment($dates[d].utcDateValue).format('dddd');
                    if ($scope.CalendarData.findIndex(e => e.formatedDate === dateValue) > -1 || $scope.weekends.findIndex(e=>e === dateName) > -1) { 
                        $dates[d].active = true;
                    }
                }

            }
            
        }

        $scope.$on('tab-switched', function () {
           $scope.Init();
        });


        

        $scope.Init();
}]);