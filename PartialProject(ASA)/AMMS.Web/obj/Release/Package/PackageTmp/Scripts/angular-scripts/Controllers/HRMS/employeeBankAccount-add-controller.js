ammsAng.controller('employeeBankAccountAddController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'workingDayService', 'commonService', 'memberDailyTransactionService', 'employeeBankAccountService',
    function ($scope, $rootScope, $timeout, $q, filterService, workingDayService, commonService, memberDailyTransactionService, employeeBankAccountService) {
        $scope.isDirty = false;
        $scope.roleId = $rootScope.user.Role;
        $scope.filters = {};
        $scope.employeeBankAccountToAdd = {};

        $scope.getAllFilters = function () {
            employeeBankAccountService.getEmployeeBankAccountsFilters($rootScope.user.Role, $rootScope.selectedBranchId).then(function (filterdata) {
                console.log(filterdata.data);
                $scope.filters.Employees = filterdata.data.employees;
                $scope.filters.statuses = filterdata.data.statuses;
                $scope.employeeBankAccountToAdd.Status = 1;
                $scope.employeeBankAccountToAdd.CreatedBy = $rootScope.user.EmployeeId;
                $scope.employeeBankAccountToAdd.ModifiedBy = $rootScope.user.EmployeeId;
                $scope.employeeBankAccountToAdd.OfficeType = $scope.OfficeType;
                $scope.filters.banks = filterdata.data.banks;
                commonService.getEmployeeFilterFromSP($rootScope.selectedBranchId, $rootScope.user.Role, $rootScope.user.EmployeeId, false).then(function(response) {
                    $scope.filters.Employees = response.data;
                });
            });
        };

        $scope.getHolidays = function (branchId) {
            memberDailyTransactionService.getBranchOffDayAndHolidays(branchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }
        $scope.resetEndDate = function () {
            $scope.employeeBankAccountToAdd.EndDate = null;
        }

        $scope.checkStartDate = function () {
            if ($scope.employeeBankAccountToAdd.StartDate > new Date($rootScope.workingdate)) {
                swal("Start date can't be future date");
                return true;
            }
            return false;
        }
        $scope.$on('BankAccount-add-finished', function() {
            $scope.getEmployeeBankAccounts();
        });
        $scope.OfficeCode = $rootScope.selectedBranchId;
        $scope.$watch('OfficeCode', function (obj) {
            $scope.employeeBankAccountToAdd.OfficeCode = obj;
        }, true);


        $scope.onEmployeeChange = function (employeeId) {
            employeeBankAccountService.getEmployeeOfficeCodeAndOfficeTypeByEmployeeId(employeeId).then(function(response) {
                $scope.employeeOfficeTypeAndCode = response.data;
            });
        }

        $scope.$watch('employeeOfficeTypeAndCode', function (obj) {
            
            $scope.employeeBankAccountToAdd.OfficeType = obj.OfficeType;
            $scope.employeeBankAccountToAdd.OfficeCode = obj.OfficeCode;
            console.log($scope.employeeBankAccountToAdd.OfficeType);
            console.log($scope.employeeBankAccountToAdd.OfficeType);
        }, true);


        $scope.addEmployeeBankAccount = function () {
            if ($scope.employeeBankAccountToAdd.StartDate != null) {
                if ($scope.checkStartDate()) return;

            }
            //var parts = $scope.employeeBankAccountToAdd.StartDate.split('-');
            //$scope.employeeBankAccountToAdd.StartDate = new Date(parts[2],parts[1]-1,parts[0]);
            //var startDate = $scope.employeeBankAccountToAdd.StartDate.toString();
            //$scope.employeeBankAccountToAdd.StartDate = new Date(startDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
            //var bStartDate = $scope.employeeBankAccountToAdd.StartDate;
            //bStartDate = bStartDate.setDate(bStartDate.getDate() + 1);
            //$scope.employeeBankAccountToAdd.StartDate = bStartDate;
            console.log($scope.employeeBankAccountToAdd);


            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.employeeBankAccount),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.employeeBankAccountToAdd.StartDate = moment($scope.employeeBankAccountToAdd.StartDate).format();
                    
                    if ($scope.employeeBankAccountToAdd.EndDate != null) {

                        $scope.employeeBankAccountToAdd.EndDate = moment($scope.employeeBankAccountToAdd.EndDate).format();
                    }


                    
                    employeeBankAccountService.addEmployeeBankAccounts($scope.employeeBankAccountToAdd)
                        .then(function (response) {

                            if (response.data.Success) {
                                $rootScope.$broadcast('BankAccount-add-finished');
                                swal({
                                    title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.employeeBankAccount),
                                    //text: "What do you want to do next?",
                                    //type: "success",
                                    showCancelButton: true,
                                    showConfirmButton: false,
                                    //confirmButtonColor: "#008000",
                                    //confirmButtonText: "Add New",
                                    cancelButtonText: "Close and Exit",
                                    //closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            $scope.employeeBankAccountAddForm.$dirty = false;
                                            $scope.employeeBankAccountAddForm.reset();
                                            
                                            $scope.clearModelData();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                            } else {
                                swal($rootScope.showMessage($rootScope.addError, $rootScope.employeeBankAccount), response.data.Message, "error");
                            }

                        });

                }
            });
        }

        $scope.clearModelData = function () {
            $scope.employeeBankAccountToAdd = null;
            $scope.getAllFilters = null;
        }

        $scope.clearAndCloseTab = function () {
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

        $scope.$on('tab-switched', function () {

        });

        $scope.init = function () {
            $scope.getAllFilters();
            $scope.getHolidays($rootScope.selectedBranchId);
            workingDayService.getDateOfBranch($rootScope.selectedBranchId).then(function (response) {
                $scope.createdBranchWorkingDate = response.data.date;
                $scope.$watch('createdBranchWorkingDate', function (obj) {
                    $scope.employeeBankAccountToAdd.CreatedBranchDate = obj;
                    $scope.employeeBankAccountToAdd.StartDate = commonService.intToDate(obj);
                    var startDate = $scope.employeeBankAccountToAdd.StartDate.toString();
                    startDate = new Date(startDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));//startDate.setDate(startDate.getDate() + 1);
                    $scope.employeeBankAccountToAdd.StartDate = startDate.setDate(startDate.getDate());//new Date(startDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                    console.log(obj);
                    console.log($scope.employeeBankAccountToAdd.StartDate);
                }, true);

            });

            $scope.getEmployeeBankAccounts = function () {
                employeeBankAccountService.getEmployeeBankAccountsByOfficeCode($rootScope.selectedBranchId).then(function (response) {
                    $scope.bankAccountList = response.data;
                    console.log($scope.bankAccountList);
                }, AMMS.handleServiceError);
            }


        }

        
        



        //DatePicker
        

        //new datepicker
        $scope.today = function () {

            $scope.employeeBankAccountToAdd.StartDate = new Date($rootScope.workingdate);
            //$scope.employeeBankAccountToAdd.ClosingDate = new Date($rootScope.workingdate);

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

        $scope.openStartDate = function () {
            $scope.popupStartDate.opened = true;
        };
        $scope.openEndDate = function () {
            $scope.popupEndDate.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popupStartDate = {
            opened: false
        };
        $scope.popupEndDate = {
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
        $scope.startDateValidator = function () {
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
            ////if (moment($scope.fee.StartDate).valueOf() < moment($scope.fee.EndDate).valueOf()) {
            ////    swal('please select valid admission date!');
            ////    $scope.today();
            ////    return;
            ////}
            if (moment($scope.employeeBankAccountToAdd.StartDate) > moment(new Date(maxDate)) || moment($scope.employeeBankAccountToAdd.StartDate) < moment(new Date(minDate))) {
                swal("Invalid Start date!");
                $scope.employeeBankAccountToAdd.StartDate = new Date($rootScope.workingdate);
                return;
            }


            //if (moment($scope.employeeBankAccountToAdd.StartDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
            //    swal("unable to select future date!");
            //    $scope.employeeBankAccountToAdd.StartDate = new Date($rootScope.workingdate);
            //    return;
            //}


            //$scope.isHolidayOrOffDay = function (d) {
            //    $scope.branchHolidayAndOffDay.forEach(function (h) {
            //        if (moment(h).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
            //            swal('Selected date is holiday or Offday');

            //        }
            //    });

            //}
            $scope.isHolidayOrOffDay($scope.employeeBankAccountToAdd.StartDate);
        }
        $scope.isHolidayOrOffDay = function (d) {
            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    $scope.employeeBankAccountToAdd.startDate = new Date($rootScope.workingdate);
                    return;
                }
            });

        }
        $scope.endDateValidator = function () {
            //if (moment($scope.employeeBankAccountToAdd.EndDate) < moment(new Date($scope.employeeBankAccountToAdd.StartDate))) {
            //    swal("unable to select past date!");

            //    return;
            //}

        }
        $scope.init();
    }
]);