ammsAng.controller('calendarAddController', ['$scope', '$rootScope', 'filterService', 'commonService','calendarService',
    function ($scope, $rootScope, filterService, commonService, calendarService) {
        $scope.CalendarYears = [];
        $scope.CalendarData = [];
        $scope.holiday = {};
        $scope.minDate = new Date();
        $scope.year = 0;
        $scope.yearSelectDisable = false;
        $scope.dateInputmessage = "";
        $scope.weekends = [];
        $scope.notes = "";

        $scope.addCalendarYear = function() {
            var calendar = {};
            calendar.CalendarData = $scope.CalendarData;
            calendar.CalendarData.forEach(function(holiday) {
                holiday.date = $rootScope.toServerSideDate(holiday.date);
                
            });
            calendar.WeeklyHolidays = $scope.weekends;
            calendar.CalendarYear = $scope.year;
            calendar.CreatedBy = $rootScope.user.UserId;
            calendar.Notes = $scope.notes;
            swal({
                    title: "Confirm?",
                    text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.calendar),
                    type: "warning",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                    showCancelButton: true
                },
                function () {
                    console.log(calendar);
                    calendarService.addCalendatYear(calendar).then(function(response) {

                        if (response.data.Success) {
                            $rootScope.$broadcast('calendar-add-finished');
                            swal({
                                title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.calendar),
                                    type: "success"
                                },
                                function(isConfirm) {
                                    $scope.removeTab($scope.tab);
                                });
                        } else {
                            swal($rootScope.showMessage($rootScope.addError, $rootScope.calendar), response.data.Message, "error");
                        }
                    });
                });
           

           


        }

        $scope.changeCalendarView=function() {
            $scope.holiday.date = new Date($scope.year, 0, 1);
        }

        $scope.Init = function () {
            
            calendarService.getCalendarYears().then(function(response) {
                var availableYears = response.data.map(function (y) { return y.Year });
                var year = new Date().getFullYear() - 3;
                for (var i = 0; i < 10;) {
                    if (availableYears.indexOf(year) === -1) {
                        $scope.CalendarYears.push(year);
                        i++;
                    }
                    year++;
                }
                $scope.year = $scope.CalendarYears[0];
            });

            filterService.getOrganizationalFilterDataByType('WeekDays')
                .then(function (response) {
                    $scope.daysInWeek = response.data;
                    $scope.weekends.push($scope.daysInWeek[0].value);
                });
        };

        $scope.addToHoliday=function() {
            if (!$scope.year) return;
            $scope.holiday.formatedDate = moment($scope.holiday.date).format('DD-MMM-YYYY');
            var position = $scope.CalendarData.findIndex(e=>e.formatedDate===$scope.holiday.formatedDate);
            $scope.holiday.IsCommonHoliday = true;
            if ($scope.holiday.date.getFullYear() === $scope.year && position ===-1) {
                $scope.CalendarData.push(angular.copy($scope.holiday));
                $scope.yearSelectDisable = true;
                $scope.dateInputmessage = "";
                $scope.holiday.description = "";
                
            }

            if (position >= 0) {
                $scope.dateInputmessage = "this date is already in the list";
            }
            
        }

        $scope.dateSet = function() {
            $scope.holiday.formatedDate = moment($scope.holiday.date).format('DD-MMM-YYYY');
            var position = $scope.CalendarData.findIndex(e=>e.formatedDate === $scope.holiday.formatedDate);
            if (position >= 0) {
                $scope.dateInputmessage = "this date is already in the list";
            } else {
                $scope.dateInputmessage = "";
            }

        }

        $scope.removeHoliday = function (holiday) {
            var position = $scope.CalendarData.indexOf(holiday);
            $scope.CalendarData.splice(position, 1);
            if ($scope.CalendarData.length === 0) {
                $scope.yearSelectDisable = false;
                //$scope.disabledSubmitButton = true;
            }

        }

        $scope.toggleSelection = function toggleSelection(day) {
            var idx = $scope.weekends.indexOf(day);
            if (idx > -1) {
              $scope.weekends.splice(idx, 1);
            }
            else {
              $scope.weekends.push(day);
            }
            

        };

        $scope.beforeRender = function ($dates) {
            var minDate = new Date("1/1/" + $scope.year).setHours(0, 0, 0, 0);
            var nextYear = $scope.year + 1;
            var maxDate = new Date("1/1/" + nextYear).setHours(0, 0, 0, 0);// Set minimum date to whatever you want here
            console.log($scope.year);
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates[d].utcDateValue < minDate || $dates[d].utcDateValue > maxDate) {
                        $dates[d].selectable = false;
                    }
                    var dateValue = moment($dates[d].utcDateValue).format('DD-MMM-YYYY');
                    if ($scope.CalendarData.findIndex(e => e.formatedDate === dateValue) > -1) {
                        $dates[d].active = true;
                    }
                }
            }
            
            
        }


        $scope.Init();


    }]);