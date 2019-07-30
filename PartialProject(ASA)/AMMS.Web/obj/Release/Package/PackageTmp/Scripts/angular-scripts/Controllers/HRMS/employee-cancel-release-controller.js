ammsAng.controller('cancelReleaseEmployeeController', [
    '$scope', '$rootScope', '$timeout', '$q', 'filterService', 'workingDayService', 'commonService', 'memberDailyTransactionService', 'employeeReleaseService',
    function ($scope, $rootScope, $timeout, $q, filterService, workingDayService, commonService, memberDailyTransactionService, employeeReleaseService) {
        $scope.isDirty = false;
        $scope.filters = {};
        $scope.employeeToCancelRelease = angular.copy($rootScope.releaseEmployee);
        $scope.EmployeeId = $rootScope.releaseEmployee.EmpId;
        employeeReleaseService.getEmployeeReleaseDateByEmployeeId($scope.EmployeeId).then(function (response) {
            $scope.employeeToCancelRelease.ReleaseDate = commonService.intToDate(response.data);
            var releaseDateParts = $scope.employeeToCancelRelease.ReleaseDate.split('-');
            $scope.employeeToCancelRelease.ReleaseDate = new Date(releaseDateParts[2], releaseDateParts[1] - 1, releaseDateParts[0]);
            $scope.employeeToCancelRelease.LetterDate = $scope.employeeToCancelRelease.ReleaseDate;

        });
        employeeReleaseService.getEmployeeReleaseFilters($scope.employeeToCancelRelease.CurrentBranchId).then(function (filterdata) {
            var releaseReason = filterdata.data.statuses;
            var i = 0;
            var j = 0;
            for (i; i < releaseReason.length; i++) {
                if ($scope.employeeToCancelRelease.SubStatus === releaseReason[i].Value) {

                    j =1;

                } 
            }
            if (j !== 1) {
                
                swal({
                    title: $rootScope.showMessage("Cancel Release is not available for this active employee.", $rootScope.employeeReleaseFromActiveService),
                    cancelButtonText: "Close and Exit",
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                  function (isConfirm) {
                      if (isConfirm) {
                          $scope.clearAndCloseTab();
                      } else {
                          $scope.clearAndCloseTab();
                      }
                  }); 
                    
            }

        });
        $scope.clearAndCloseTab = function () {
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };
        $scope.getHolidays = function (branchId) {
            memberDailyTransactionService.getBranchOffDayAndHolidays(branchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }
        $scope.EmployeeId = $rootScope.releaseEmployee.EmpId;
        console.log($scope.employeeToCancelRelease);
        $scope.roleId = $rootScope.user.Role;

        $scope.getAllFilters = function () {
            employeeReleaseService.getEmployeeReleaseFilters($scope.employeeToCancelRelease.CurrentBranchId).then(function (filterdata) {
                console.log(filterdata.data);
                $scope.filters.statuses = filterdata.data.statuses;
                //$scope.employeeToCancelRelease.ReleaseReason = $rootScope.releaseEmployee.ReleaseReason;
                $scope.employeeToCancelRelease.LetterNo = $rootScope.releaseEmployee.ReleaseLetterNo;
                // $scope.filters.Employees = filterdata.data.employees;
                var branchId = $rootScope.searchedBranchId === undefined ? $rootScope.selectedBranchId : $rootScope.searchedBranchId;
                commonService.getEmployeeFilterFromSP(branchId, $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                    $scope.filters.Employees = response.data;
                });


            });
        };

        $scope.checkStartDate = function () {
            if ($scope.employeeToCancelRelease.ReleaseDate < Date.now()) {
                swal("Release date can't be Back date.");
                return true;
            }
            return false;
        }

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


        employeeReleaseService.getEmployeeDetailsByEmployeeId($scope.EmployeeId).then(function (response) {
            $scope.employeeData = response.data;
            console.log($scope.employeeData);
            $scope.$watch('employeeData', function (obj) {

                $scope.employeeToCancelRelease.CurrentOfficeType = obj.CurrentOfficeType;
                $scope.employeeToCancelRelease.CurrentBranchId = obj.CurrentBranchId;
                $scope.employeeToCancelRelease.EmpId = obj.EmpId;
                $scope.employeeToCancelRelease.ReleasedBy = $rootScope.user.EmployeeId;
                console.log($scope.employeeToCancelRelease);

            }, true);
        });

        employeeReleaseService.getEmployeeReleaseIdByEmployeeId($scope.EmployeeId).then(function(response) {
            $scope.employeeReleaseId = response.data;
            console.log($scope.employeeReleaseId);
        });

        //employeeReleaseService.getEmployeeReleaseDate($scope.EmployeeId).then(function (response) {
        //    $scope.employeeToCancelRelease.ReleaseDate = commonService.intToDate(response.data);
        //});



        $scope.cancelReleaseEmployeeFromService = function () {
            if ($scope.employeeToCancelRelease.ReleaseDate != null) {
                //if ($scope.checkStartDate()) return;
                //var releaseLetterDateParts = $scope.employeeToCancelRelease.LetterDate.split('-');
                //$scope.employeeToCancelRelease.LetterDate = new Date(releaseLetterDateParts[2], releaseLetterDateParts[1] - 1, releaseLetterDateParts[0]);
            }



            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.CancelReleaseConfirmation, $rootScope.employeeCancelRelease),
                showCancelButton: true,
                confirmButtonText: "Yes, Cancel Release!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.employeeToCancelRelease.ReleaseDate = moment($scope.employeeToCancelRelease.ReleaseDate).format();


                    employeeReleaseService.cancelReleaseEmployee($scope.employeeReleaseId, $scope.EmployeeId,$rootScope.user.EmployeeId)
                        .then(function (response) {
                            console.log(response.data);
                            if (response.data > 0) {
                                $rootScope.$broadcast('Employee-cancel-release-finished');
                                swal({
                                    title: $rootScope.showMessage($rootScope.ReleaseSuccess, $rootScope.employeeCancelRelease),
                                    //text: "What do you want to do next?",
                                    //type: "success",
                                    showCancelButton: true,
                                    showConfirmButton: false,
                                    //confirmButtonColor: "#008000",
                                    //confirmButtonText: "Cancel Release Another",
                                    cancelButtonText: "Close and Exit",
                                    //closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            $scope.cancelReleaseEmployeeForm.$dirty = false;
                                            $scope.cancelReleaseEmployeeForm.reset();

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

        $scope.init = function () {
            $scope.getAllFilters();
            $scope.getHolidays($rootScope.selectedBranchId);
            workingDayService.getDateOfBranch($rootScope.selectedBranchId).then(function (response) {
                $scope.createdBranchWorkingDate = response.data.date;
                $scope.$watch('createdBranchWorkingDate', function (obj) {
                    $scope.employeeToCancelRelease.BranchWorkingDate = obj;
                   
                    $scope.employeeToCancelRelease.LetterDate = commonService.intToDate(obj);
                    console.log(obj);
                    //console.log($scope.employeeToCancelRelease.LetterDate);
                    
                }, true);
                

            });
        }


        $scope.today = function () {

            $scope.employeeToCancelRelease.ReleaseDate = new Date($rootScope.workingdate);
            $scope.employeeToCancelRelease.LetterDate = new Date($rootScope.workingdate);

        };
        //$scope.today();




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

            if (moment($scope.employeeToCancelRelease.ReleaseDate) > moment(new Date(maxDate)) || moment($scope.employeeToCancelRelease.ReleaseDate) < moment(new Date(minDate))) {
                swal("Invalid Release date!");
                $scope.employeeToCancelRelease.ReleaseDate = new Date($rootScope.workingdate);
                return;
            }



            $scope.isHolidayOrOffDay($scope.employeeToCancelRelease.ReleaseDate);
        }
        $scope.isHolidayOrOffDay = function (d) {
            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    $scope.employeeToCancelRelease.ReleaseDate = new Date($rootScope.workingdate);
                    $scope.employeeToCancelRelease.LetterDate = new Date($rootScope.workingdate);
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
                minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }

            if (moment($scope.employeeToCancelRelease.LetterDate) > moment(new Date(maxDate)) || moment($scope.employeeToCancelRelease.LetterDate) < moment(new Date(minDate))) {
                swal("Invalid Release date!");
                $scope.employeeToCancelRelease.LetterDate = new Date($rootScope.workingdate);
                return;
            }



            $scope.isHolidayOrOffDay($scope.employeeToCancelRelease.LetterDate);

        }



        $scope.init();
    }
]);