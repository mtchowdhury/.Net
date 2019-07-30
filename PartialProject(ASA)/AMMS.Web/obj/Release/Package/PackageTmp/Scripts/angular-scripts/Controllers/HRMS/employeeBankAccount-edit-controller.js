ammsAng.controller('employeeBankAccountEditController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'workingDayService', 'commonService', 'memberDailyTransactionService', 'employeeBankAccountService',
    function ($scope, $rootScope, $timeout, $q, filterService, workingDayService, commonService, memberDailyTransactionService, employeeBankAccountService) {
        $scope.isDirty = false;
        $scope.filters = {};
        $scope.roleId = $rootScope.user.Role;
        $scope.employeeBankAccountToEdit = angular.copy($rootScope.editemployeeBankAccountId);

        console.log($scope.employeeBankAccountToEdit);
        //if ($scope.employeeBankAccountToEdit.EndDate == "") {
        //    $scope.employeeBankAccountToEdit.EndDate = null;
        //}
        function stringToDate(_date, _format, _delimiter) {
            var formatLowerCase = _format.toLowerCase();
            var formatItems = formatLowerCase.split(_delimiter);
            var dateItems = _date.split(_delimiter);
            var monthIndex = formatItems.indexOf("mm");
            var dayIndex = formatItems.indexOf("dd");
            var yearIndex = formatItems.indexOf("yyyy");
            var month = parseInt(dateItems[monthIndex]);
            month -= 1;
            var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
            return formatedDate;
        }
        var startDate = new Date($scope.employeeBankAccountToEdit.StartDate);//moment( $scope.employeeBankAccountToEdit.StartDate).format('DD-MM-YYYY');
        startDate = stringToDate($scope.employeeBankAccountToEdit.StartDate, "dd/MM/yyyy", "/");//new Date(startDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));//startDate.setDate(startDate.getDate() + 1);
        $scope.employeeBankAccountToEdit.StartDate = startDate;//.setDate(startDate.getDate());


        if ($scope.employeeBankAccountToEdit.EndDate != null && $scope.employeeBankAccountToEdit.EndDate != undefined && $scope.employeeBankAccountToEdit.EndDate != "") {
            var endDate = new Date($scope.employeeBankAccountToEdit.EndDate);//moment( $scope.employeeBankAccountToEdit.StartDate).format('DD-MM-YYYY');
            endDate = stringToDate($scope.employeeBankAccountToEdit.EndDate, "dd/MM/yyyy", "/");//new Date(startDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));//startDate.setDate(startDate.getDate() + 1);
            $scope.employeeBankAccountToEdit.EndDate = endDate;//.setDate(startDate.getDate());
        }
        


        $scope.EmployeeBankAccountId = $rootScope.editemployeeBankAccountId.EmployeeId;
        $scope.employeeBankAccountToEdit.EmployeeId = $scope.EmployeeBankAccountId;
        $scope.employeeBankAccountToEdit.BankName = parseInt($rootScope.editemployeeBankAccountId.BankName);
        
        workingDayService.getDateOfBranch($rootScope.selectedBranchId).then(function (response) {
            $scope.currentBranchWorkingDate = response.data.date;
            $scope.$watch('currentBranchWorkingDate', function (obj) {
                $scope.employeeBankAccountToEdit.ModifiedBranchDate = obj;
                //$scope.employeeBankAccountToEdit.EndDate = commonService.intToDate(obj);
                console.log(obj);
            }, true);

        });
        //employeeBankAccountService.getEmployeeBankAccountsById($scope.EmployeeBankAccountId).then(function (myData) {
        //    $scope.bankAccountData = myData.data;
        //    $scope.$watch('bankAccountData', function (obj) {
        //        $scope.employeeBankAccountToEdit.Id = obj.Id;
        //        $scope.employeeBankAccountToEdit.EmployeeId = parseInt(obj.EmployeeId);
        //        $scope.employeeBankAccountToEdit.BankName = parseInt(obj.BankName);
        //        $scope.employeeBankAccountToEdit.CreatedOn = obj.CreatedOn;
        //        $scope.employeeBankAccountToEdit.CreatedBy = obj.CreatedBy;
        //        $scope.employeeBankAccountToEdit.CreatedBranchDate = obj.CreatedBranchDate;
        //        $scope.employeeBankAccountToEdit.OfficeType = obj.OfficeType;
        //        $scope.employeeBankAccountToEdit.OfficeCode = obj.OfficeCode;
        //        console.log($scope.employeeBankAccountToEdit.CreatedBranchDate);
        //    }, true);
        //});

        console.log($scope.employeeBankAccountToEdit);
        $scope.getAllFilters = function () {
            employeeBankAccountService.getEmployeeBankAccountsFilters($rootScope.user.Role, $rootScope.selectedBranchId).then(function (filterdata) {
               // $scope.filters.Employees = filterdata.data.employees;
                $scope.filters.statuses = filterdata.data.statuses;


                for (var j = 0; j < $scope.filters.statuses.length; j++) {
                    if ($scope.filters.statuses[j].Name == 'Deleted') {
                        $scope.filters.statuses.splice(j, 1);
                    }
                }
                //$scope.employeeBankAccountToEdit.Status = 1;
                $scope.employeeBankAccountToEdit.ModifiedBy = $rootScope.user.EmployeeId;
                $scope.filters.banks = filterdata.data.banks;
                commonService.getEmployeeFilterFromSP($rootScope.selectedBranchId, $rootScope.user.Role, $rootScope.user.EmployeeId, false).then(function (response) {
                    $scope.filters.Employees = response.data;
                });
            });
        };

        
        $scope.onStatusChange = function (bankAccountStatus) {
            if (bankAccountStatus === 2 && ($scope.employeeBankAccountToEdit.EndDate == null) || $scope.employeeBankAccountToEdit.EndDate == undefined || $scope.employeeBankAccountToEdit.EndDate == "") {
                $scope.employeeBankAccountToEdit.EndDate = $scope.currentBranchWorkingDate;
                $scope.employeeBankAccountToEdit.EndDate = commonService.intToDate($scope.employeeBankAccountToEdit.EndDate);
                var endDate = stringToDate($scope.employeeBankAccountToEdit.EndDate, "dd-MM-yyyy", "-");//startDate.setDate(startDate.getDate() + 1); 
                $scope.employeeBankAccountToEdit.EndDate = endDate;//.setDate(endDate.getDate());
            }
        }
        $scope.getHolidays = function (branchId) {
            memberDailyTransactionService.getBranchOffDayAndHolidays(branchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }

        

        $scope.resetEndDate = function () {
            $scope.employeeBankAccountToEdit.EndDate = null;
        }

        $scope.checkStartDate = function () {
            var startDate = $scope.employeeBankAccountToEdit.StartDate;
            startDate = moment(new Date(startDate)).format();
            if (startDate > moment($rootScope.workingdate)) {
                swal("Start date can't be future date");
                return true;
            }
            return false;
        }


        $scope.checkEndDate = function () {
            var startDate = $scope.employeeBankAccountToEdit.StartDate;
            var endDate = $scope.employeeBankAccountToEdit.EndDate;
            startDate = new Date(startDate);
            endDate = new Date(endDate);


            if (startDate > endDate) {
                swal("End date must be greater than Start date");
                return true;
            }
            return false;
        }

        $scope.checkEndDateWithActive = function() {
            if ($scope.employeeBankAccountToEdit.EndDate != null && $scope.employeeBankAccountToEdit.EndDate !=="" && $scope.employeeBankAccountToEdit.Status === 1) {
                swal("Status cannont be active when End Date is Provided.");
                return true;
            }
            return false;
        }
        $scope.checkEndDateWithCurrentWorkingDate = function () {
            var endDate = Date.parse($scope.employeeBankAccountToEdit.EndDate);
            var newDate = new Date(endDate);
            var currentWorkingDate = moment($scope.employeeBankAccountToEdit.ModifiedBranchDate.toString().slice(0, 8));
            currentWorkingDate = new Date(currentWorkingDate);
            if (newDate > currentWorkingDate) {
                swal("End date Cannot be greater than Current working date");
                return true;
            }
            return false;
        }

        $scope.editEmployeeBankAccount = function () {
            if ($scope.employeeBankAccountToEdit.EndDate != null && $scope.employeeBankAccountToEdit.EndDate !=="") {
                var endDate = $scope.employeeBankAccountToEdit.EndDate.toString();
                $scope.employeeBankAccountToEdit.EndDate = new Date(endDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")); //new Date(parts[2], parts[1] - 1, parts[0]); //

            }
           

            console.log(typeof ($scope.employeeBankAccountToEdit.EndDate));
            console.log($scope.employeeBankAccountToEdit);
            

            if ($scope.employeeBankAccountToEdit.StartDate != null) {
                if ($scope.checkStartDate()) return;

            }
            if ($scope.employeeBankAccountToEdit.Status ===1) {
                if ($scope.checkEndDateWithActive()) return;

            }
            if ($scope.employeeBankAccountToEdit.EndDate != null) {
                if ($scope.checkEndDateWithCurrentWorkingDate()) return;
            }

            if ($scope.employeeBankAccountToEdit.EndDate != null) {
                if ($scope.checkEndDate()) return;

            }
            if ($rootScope.command == 'Close') {
                swal({
                    title: "Confirm?",
                    text: $rootScope.showMessage($rootScope.closeConfirmation, $rootScope.employeeBankAccount),
                    showCancelButton: true,
                    confirmButtonText: "Yes, Close it!",
                    cancelButtonText: "No, cancel!",
                    type: "info",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                }, function(isConfirmed) {
                    if (isConfirmed) {
                        $scope.employeeBankAccountToEdit.StartDate = moment($scope.employeeBankAccountToEdit.StartDate).format();
                        if ($scope.employeeBankAccountToEdit.EndDate != null) {

                            $scope.employeeBankAccountToEdit.EndDate = moment($scope.employeeBankAccountToEdit.EndDate).format();
                        }

                        employeeBankAccountService.editEmployeeBankAccounts($scope.employeeBankAccountToEdit)
                            .then(function(response) {
                                console.log($scope.employeeBankAccountToEdit);

                                if (response.data.Success) {
                                    $rootScope.$broadcast('BankAccount-edit-finished');
                                    swal({
                                            title: $rootScope.showMessage($rootScope.closeSuccess, $rootScope.employeeBankAccount),
                                            text: "What do you want to do next?",
                                            type: "success",
                                            showCancelButton: true,
                                            confirmButtonColor: "#008000",
                                            confirmButtonText: "Close Again",
                                            cancelButtonText: "Close and Exit",
                                            closeOnConfirm: true,
                                            closeOnCancel: true
                                        },
                                        function(isConfirm) {
                                            if (isConfirm) {
                                                //$scope.employeeBankAccountEditForm.reset();
                                                //$scope.employeeBankAccountEditForm.$dirty = false;
                                                //$scope.clearModelData();
                                            } else {
                                                $scope.clearAndCloseTab();
                                            }
                                        });
                                } else {
                                    swal($rootScope.showMessage($rootScope.closeError, $rootScope.employeeBankAccount), response.data.Message, "error");
                                    $scope.init();
                                }

                            });
                    }
                });
            } else {
                swal({
                    title: "Confirm?",
                    text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.employeeBankAccount),
                    showCancelButton: true,
                    confirmButtonText: "Yes, Edit it!",
                    cancelButtonText: "No, cancel!",
                    type: "info",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                }, function (isConfirmed) {
                    if (isConfirmed) {
                        $scope.employeeBankAccountToEdit.StartDate = moment($scope.employeeBankAccountToEdit.StartDate).format();
                        if ($scope.employeeBankAccountToEdit.EndDate != null) {

                            $scope.employeeBankAccountToEdit.EndDate = moment($scope.employeeBankAccountToEdit.EndDate).format();
                        }

                        employeeBankAccountService.editEmployeeBankAccounts($scope.employeeBankAccountToEdit)
                            .then(function (response) {
                                console.log($scope.employeeBankAccountToEdit);

                                if (response.data.Success) {
                                    $rootScope.$broadcast('BankAccount-edit-finished');
                                    swal({
                                        title: $rootScope.showMessage($rootScope.editSuccess, $rootScope.employeeBankAccount),
                                        text: "What do you want to do next?",
                                        type: "success",
                                        showCancelButton: true,
                                        confirmButtonColor: "#008000",
                                        confirmButtonText: "Edit Again",
                                        cancelButtonText: "Close and Exit",
                                        closeOnConfirm: true,
                                        closeOnCancel: true
                                    },
                                        function (isConfirm) {
                                            if (isConfirm) {
                                                //$scope.employeeBankAccountEditForm.reset();
                                                //$scope.employeeBankAccountEditForm.$dirty = false;
                                                //$scope.clearModelData();
                                            } else {
                                                $scope.clearAndCloseTab();
                                            }
                                        });
                                } else {
                                    swal($rootScope.showMessage($rootScope.editError, $rootScope.employeeBankAccount), response.data.Message, "error");
                                    $scope.init();
                                }

                            });
                    }
                });
            }
            
        }

        $scope.clearModelData = function () {
            $scope.employeeBankAccountToEdit = null;
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
            $scope.employeeBankAccountToEdit.StartDate = new Date($scope.employeeBankAccountToEdit.StartDate);
            //$scope.employeeBankAccountToEdit.EndDate = new Date($scope.employeeBankAccountToEdit.EndDate);
            workingDayService.getDateOfBranch($rootScope.selectedBranchId).then(function (response) {
                $scope.currentBranchWorkingDate = response.data.date;

                $scope.$watch('currentBranchWorkingDate', function (obj) {
                    $scope.employeeBankAccountToEdit.ModifiedBranchDate = obj;
                    //$scope.employeeBankAccountToEdit.EndDate = commonService.intToDate(obj);
                    //var endDate = stringToDate($scope.employeeBankAccountToEdit.EndDate, "dd-MM-yyyy", "-");//startDate.setDate(startDate.getDate() + 1);
                    //$scope.employeeBankAccountToEdit.EndDate = endDate;//.setDate(endDate.getDate());

                    console.log(obj);
                }, true);

            });

            //employeeBankAccountService.getEmployeeBankAccountsById($scope.EmployeeBankAccountId).then(function (myData) {
            //    $scope.bankAccountData = myData.data;
            //    $scope.$watch('bankAccountData', function(obj) {
            //        $scope.employeeBankAccountToEdit.Id = obj.Id;
            //        $scope.employeeBankAccountToEdit.EmployeeId = obj.EmployeeId;
            //        $scope.employeeBankAccountToEdit.BankName = parseInt(obj.BankName);
            //        $scope.employeeBankAccountToEdit.CreatedOn = obj.CreatedOn;
            //        $scope.employeeBankAccountToEdit.CreatedOn = obj.CreatedOn;
            //        $scope.employeeBankAccountToEdit.CreatedBy = obj.CreatedBy;
            //        $scope.employeeBankAccountToEdit.CreatedBranchDate = obj.CreatedBranchDate;
            //        $scope.employeeBankAccountToEdit.OfficeType = obj.OfficeType;
            //        $scope.employeeBankAccountToEdit.OfficeCode = obj.OfficeCode;
            //        console.log($scope.employeeBankAccountToEdit.CreatedBranchDate);
            //    },true);
            //});
        }

        
     
        


        //new datepicker
        $scope.today = function () {

            $scope.employeeBankAccountToEdit.StartDate = new Date($scope.employeeBankAccountToEdit.StartDate);
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
            if (moment($scope.employeeBankAccountToEdit.StartDate) > moment(new Date(maxDate)) || moment($scope.employeeBankAccountToEdit.StartDate) < moment(new Date(minDate))) {
                swal("Invalid Start date!");
                $scope.employeeBankAccountToEdit.StartDate = new Date($rootScope.workingdate);
                return;
            }


            $scope.isHolidayOrOffDay($scope.employeeBankAccountToEdit.StartDate,'s');
        }
        $scope.endDateValidator = function () {
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


            if (moment($scope.employeeBankAccountToEdit.EndDate).valueOf() > maxDate || moment($scope.employeeBankAccountToEdit.EndDate).valueOf() < minDate) {
                swal('please select valid date!');
                $scope.employeeBankAccountToEdit.EndDate = new Date($rootScope.workingdate);
                return;
            }


            $scope.isHolidayOrOffDay($scope.employeeBankAccountEdit.EndDate, 'e');
        }
        $scope.isHolidayOrOffDay = function (date, t) {
            $scope.selectedDate = moment(date).format("YYYY-MM-DD");
            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    if (t === 's') {

                        $scope.employeeBankAccountToEdit.StartDate = new Date($rootScope.workingdate);
                    } else {
                        $scope.employeeBankAccountToEdit.EndDate = new Date($rootScope.workingdate);

                    }
                    return;
                }
            });

        }
        $scope.init();
    }
]);