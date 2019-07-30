ammsAng.controller('releaseEmployeeController', [
    '$scope', '$rootScope', '$timeout', '$q', 'filterService', 'workingDayService', 'commonService', 'memberDailyTransactionService', 'employeeReleaseService',
    function ($scope, $rootScope, $timeout, $q, filterService, workingDayService, commonService, memberDailyTransactionService, employeeReleaseService) {
        $scope.isDirty = false;
        $scope.filters = {};
        $scope.employeeToRelease = angular.copy($rootScope.releaseEmployee);
        $scope.EmployeeId = angular.copy($rootScope.releaseEmployee.EmpId);
        console.log($scope.employeeToRelease);
        $scope.roleId = angular.copy($rootScope.user.Role);
        
        $scope.checkIsAlreadyReleased = function () {
            employeeReleaseService.getEmployeeReleaseDetailsByEmployeeId($scope.EmployeeId).then(function (response) {
                console.log(response.data);
                if (response.data === true) {
                    swal("Employee is already released.");
                    $timeout(function () {
                        $('#saveComplete').modal('hide');
                        $('.modal-backdrop').remove();
                    }, 500);
                    $scope.execRemoveTab($scope.tab);
                    return true;
                }
                return false;
            });
        };
        $scope.IsReleasedBySelf = function () {
            if ($scope.EmployeeId == $rootScope.user.EmployeeId) {
                console.log($rootScope.user.EmployeeId);
                console.log($scope.EmployeeId);
                swal("You Cannot Release Yourself.");
                $timeout(function () {
                    $('#saveComplete').modal('hide');
                    $('.modal-backdrop').remove();
                }, 500);
                $scope.execRemoveTab($scope.tab);
                return true;
            }
            return false;
        }
        $scope.getHolidays = function (branchId) {
            memberDailyTransactionService.getBranchOffDayAndHolidays(branchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }
        if ($scope.checkIsAlreadyReleased()) {
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        }
        if ($scope.IsReleasedBySelf()) {
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        }


        $scope.$on('tab-switched', function () {
            if ($scope.EmployeeId !== $rootScope.releaseEmployee.EmpId) {
                $scope.employeeToRelease = angular.copy($rootScope.releaseEmployee);
                $scope.EmployeeId = angular.copy($rootScope.releaseEmployee.EmpId);
                $scope.employeeToRelease.ReleaseDate = new Date($rootScope.workingdate);
                $scope.employeeToRelease.LetterDate = new Date($rootScope.workingdate);
                init();
            }
        });



        $scope.getAllFilters = function () {
            employeeReleaseService.getEmployeeReleaseFilters($scope.employeeToRelease.CurrentBranchId).then(function (filterdata) {
                console.log(filterdata.data);
                $scope.filters.statuses = filterdata.data.statuses;
                $scope.employeeToRelease.SubStatus = angular.copy($rootScope.releaseEmployee.SubStatus);
                $scope.filters.Employees = angular.copy(filterdata.data.employees);
                var branchId = $rootScope.searchedBranchId === undefined ? $rootScope.selectedBranchId : $rootScope.searchedBranchId;
                commonService.getEmployeeFilterFromSP(branchId, $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                    $scope.filters.Employees = response.data;
                });

                console.log($scope.employeeToRelease.SubStatus);
            });
        };

        $scope.checkStartDate = function () {
            if ($scope.employeeToRelease.ReleaseDate < Date.now()) {
                swal("Release date can't be Back date.");
                return true;
            }
            return false;
        }

        //$scope.checkIsAlreadyReleased = function() {
        //    employeeReleaseService.getEmployeeReleaseDetailsByEmployeeId($scope.EmployeeId).then(function (response) {
        //        console.log(response.data);
        //        if (response.data === true) {
        //            swal("Employee is already released.");
        //            return true;
        //        }
        //        return false;
        //    });
        //};

        $scope.beforeDateRender = function ($dates) {
            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        if ($dates[d].utcDateValue < minDate.valueOf() || $dates[d].utcDateValue > maxDate.valueOf()) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }
        }


        //$scope.IsReleasedBySelf = function() {
        //    if ($scope.EmployeeId == $rootScope.user.EmployeeId) {
        //        console.log($rootScope.user.EmployeeId);
        //        console.log($scope.EmployeeId);
        //        swal("You Cannot Release Yourself.");
        //        return true;
        //    }
        //    return false;
        //}

      

        
        $scope.getEmployeeReleaseData = function () {
            employeeReleaseService.getEmployeeDetailsByEmployeeId($scope.EmployeeId).then(function (response) {
                $scope.employeeData = response.data;
                console.log($scope.employeeData);
                $scope.$watch('employeeData', function (obj) {

                    $scope.employeeToRelease.CurrentOfficeType = obj.CurrentOfficeType;
                    $scope.employeeToRelease.CurrentBranchId = obj.CurrentBranchId;
                    $scope.employeeToRelease.EmpId = obj.EmpId;
                    $scope.employeeToRelease.ReleasedBy = $rootScope.user.EmployeeId;
                    console.log($scope.employeeToRelease);

                }, true);
            });
        }
   


        $scope.releaseEmployeeFromService = function () {
            if ($scope.employeeToRelease.ReleaseDate != null && $scope.employeeToRelease.LetterDate != null) {
                //if ($scope.checkStartDate()) return;
                //var parts = $scope.employeeToRelease.ReleaseDate.split('-');
                //$scope.employeeToRelease.ReleaseDate = new Date(parts[2], parts[1] - 1, parts[0]);
                //var releaseLetterDateParts = $scope.employeeToRelease.LetterDate.split('-');
                //$scope.employeeToRelease.LetterDate = new Date(releaseLetterDateParts[2], releaseLetterDateParts[1] - 1, releaseLetterDateParts[0]);
                var releaseDate = $scope.employeeToRelease.ReleaseDate.toString();
                $scope.employeeToRelease.ReleaseDate = new Date(releaseDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));

                var letterDate = $scope.employeeToRelease.LetterDate.toString();
                $scope.employeeToRelease.LetterDate = new Date(letterDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));

            }
            //if ($scope.checkIsAlreadyReleased())return;
            //if ($scope.IsReleasedBySelf())return;


            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.employeeReleaseFromActiveService),
                showCancelButton: true,
                confirmButtonText: "Yes, Release!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.employeeToRelease.ReleaseDate = moment($scope.employeeToRelease.ReleaseDate).format();
                    $scope.employeeToRelease.LetterDate = moment($scope.employeeToRelease.LetterDate).format();

                    employeeReleaseService.releaseEmployee($scope.employeeToRelease)
                        .then(function (response) {
                            console.log(response.data);
                            if (response.data>=4) {
                                $rootScope.$broadcast('Employee-release-finished');
                                swal({
                                    title: $rootScope.showMessage($rootScope.ReleaseSuccess, $rootScope.employeeReleaseFromActiveService),
                                    //text: "What do you want to do next?",
                                    //type: "success",
                                    showCancelButton: true,
                                    showConfirmButton: false,
                                    //confirmButtonColor: "#008000",
                                    //confirmButtonText: "Release New",
                                    cancelButtonText: "Close and Exit",
                                    //closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            $scope.releaseEmployeeForm.$dirty = false;
                                            $scope.releaseEmployeeForm.reset();

                                            $scope.clearModelData();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                            } else {
                                swal($rootScope.showMessage($rootScope.releaseError, $rootScope.employeeReleaseFromActiveService), response.data.Message, "error");
                            }

                        });

                }
            });
        }

        $scope.clearAndCloseTab = function () {
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

        $scope.clearModelData = function () {
            $scope.employeeToRelease = null;
            $scope.getAllFilters = null;
        }


        $scope.getEmployeeDetailsReport = function () {
            $scope.employeeDetails = null;
            employeeReleaseService.getEmployeeDetailsReport($scope.employeeToRelease.EmpId, -1, $rootScope.selectedBranchId, $rootScope.workingdateInt).then(function (response) {
                $scope.employeeDetails = response.data;
                console.log($scope.employeeDetails);
            });
        }
        $scope.init = function () {
            $scope.getAllFilters();
            $scope.getHolidays($rootScope.selectedBranchId);
            $scope.today();
            workingDayService.getDateOfBranch($rootScope.selectedBranchId).then(function (response) {
                $scope.createdBranchWorkingDate = response.data.date;
                $scope.$watch('createdBranchWorkingDate', function (obj) {
                    $scope.employeeToRelease.BranchWorkingDate = obj;
                    //$scope.employeeToRelease.LetterDate = obj;
                    //$scope.employeeToRelease.ReleaseDate = commonService.intToDate(obj);
                    //$scope.employeeToRelease.LetterDate = commonService.intToDate(obj);
                    console.log(obj);
                }, true);

            });
            $scope.getEmployeeReleaseData();
        }




        $scope.today = function () {

            $scope.employeeToRelease.ReleaseDate = new Date($rootScope.workingdate);
            $scope.employeeToRelease.LetterDate = new Date($rootScope.workingdate);

        };
        $scope.today();




        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($rootScope.workingdate),
            showWeeks: true
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            //console.log((new Date($rootScope.workingdate)).getDate);
            return (mode === 'day' && (date.getDay() === 5))
                || (moment(date) > moment(new Date($rootScope.workingdate)));//.add(1, 'days'));
        }
        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2040, 5, 22),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate.getDate() + 1);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.openReleaseDate = function () {
            $scope.popupReleaseDate.opened = true;
        };
        $scope.openLetterDate = function () {
            $scope.popupLetterDate.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popupReleaseDate = {
            opened: false
        };
        $scope.popupLetterDate = {
            opened: false
        };


        function getDayClass(data) {
            console.log(data);
            var date = data.date,
              mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
        $scope.releaseDateValidator = function () {
            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }
           
            if (moment($scope.employeeToRelease.ReleaseDate) > moment(new Date(maxDate)) || moment($scope.employeeToRelease.ReleaseDate) < moment(new Date(minDate))) {
                swal("Invalid Release date!");
                $scope.employeeToRelease.ReleaseDate = new Date($rootScope.workingdate);
                return;
            }


           
            $scope.isHolidayOrOffDay($scope.employeeToRelease.ReleaseDate);
        }
        $scope.isHolidayOrOffDay = function (d) {
            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    $scope.employeeToRelease.ReleaseDate = new Date($rootScope.workingdate);
                    $scope.employeeToRelease.LetterDate = new Date($rootScope.workingdate);
                    return;
                }
            });

        }
        $scope.letterDateValidator = function () {
            //if (moment($scope.employeeBankAccountToAdd.EndDate) < moment(new Date($scope.employeeBankAccountToAdd.StartDate))) {
            //    swal("unable to select past date!");

            //    return;
            //}


            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-1, 'days').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }

            if (moment($scope.employeeToRelease.LetterDate) > moment(new Date(maxDate)) || moment($scope.employeeToRelease.LetterDate) < moment(new Date(minDate))) {
                swal("Invalid Release date!");
                $scope.employeeToRelease.LetterDate = new Date($rootScope.workingdate);
                return;
            }



            $scope.isHolidayOrOffDay($scope.employeeToRelease.LetterDate);

        }



        $scope.init();
    }
]);