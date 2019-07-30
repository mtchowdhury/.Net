ammsAng.controller('salaryStructureEditController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'workingDayService', 'commonService', 'salaryStructureService', 'memberDailyTransactionService',
    function($scope, $rootScope, $timeout, $q, filterService, workingDayService, commonService, salaryStructureService, memberDailyTransactionService) {
        $scope.isDirty = false;
        $scope.filters = {};
        $scope.salaryStructureId = $rootScope.editemployeesalaryStructure.Id;
        console.log($scope.salaryStructureId);
        $scope.salaryStructureToEdit = {};
        $scope.salaryStructureToEdit.SalaryStructureId = $rootScope.editemployeesalaryStructure.Id;
        $scope.getAsaJoinig = function(employeeId) {
            salaryStructureService.getAsaJoiningDate(employeeId).then(function(response) {
                $scope.SalaryStructureOpenDate = response.data;
                //var date = commonService.intToDate($scope.SalaryStructureOpenDate);
                var openingDate = moment(response.data.toString().slice(0, 8)).format('MM-DD-YYYY');
                var d = new Date(openingDate);
                d.setDate(d.getDate() - 1);
                $scope.SalaryStructureStartDate = d; //new Date(openingDate);

            });
        }

        $scope.getAsaJoinig($rootScope.editemployeesalaryStructure.EmpId);
        console.log($scope.salaryStructureToEdit.SalaryStructureId);

        $scope.getSalaryStructureById = function() {
            salaryStructureService.getEmployeeSalaryStructureById($scope.salaryStructureId).then(function(response) {
                $scope.salaryStructureToEdit.EmployeeId = response.data.EmployeeId;
                $scope.salaryStructureToEdit.OfficeCode = response.data.OfficeCode;
                $scope.salaryStructureToEdit.StartDate = response.data.StartDate;
                $scope.salaryStructureToEdit.EndDate = response.data.EndDate;
                $scope.salaryStructureToEdit.Description = response.data.Description;
                $scope.salaryStructureToEdit.ReasonId = response.data.ReasonId;

                $scope.salaryStructureToEdit.OpeningDate = new Date($scope.salaryStructureToEdit.StartDate);
                var open = $scope.salaryStructureToEdit.OpeningDate;
                open.setDate(open.getDate());
                $scope.salaryStructureToEdit.OpeningDate = open;
                $scope.salaryStructureToEdit.ClosingDate = new Date($scope.salaryStructureToEdit.EndDate);
                $scope.close = $scope.salaryStructureToEdit.EndDate;
                if ($scope.close !== "" && $scope.close !== null) {
                    var close = new Date($scope.close);
                    close.setDate(close.getDate());
                    $scope.salaryStructureToEdit.ClosingDate = close;
                } else {
                    $scope.salaryStructureToEdit.ClosingDate = null;
                }

                if ($rootScope.command == 'Close') {
                    $scope.salaryStructureToEdit.ClosingDate = new Date($rootScope.workingdate);
                }
                console.log(response.data);
            });
        }

        $scope.getSalaryStructureById();
        //if ($rootScope.command == 'Close') {
        //    $scope.salaryStructureToEdit.ClosingDate = new Date($rootScope.workingdate);
        //}

        $scope.branchHolidayAndOffDay = null;
        $scope.salaryStructureToEdit.UpdatedBy = $rootScope.user.EmployeeId;

        $scope.salaryStructureToEdit.allowanceAccounts = [];
        $scope.salaryStructureToEdit.allowanceAccounts = [];
        console.log($scope.salaryStructureId);
        console.log($scope.salaryStructureToEdit.EmployeeId);

        $scope.$on('tab-switched', function () {
            if ($scope.salaryStructureId !== $rootScope.editemployeesalaryStructure.Id) {
                $scope.salaryStructureId = $rootScope.editemployeesalaryStructure.Id;
                $scope.getSalaryStructureById();
                $scope.init();
            }
        });




        $scope.getAllFilters = function () {
            salaryStructureService.permittedBranchFilters($rootScope.user.Role, $rootScope.user.EmployeeId).then(function (filterdata) {
                console.log(filterdata.data);
                $scope.filters.Branches = filterdata.data.branches;
                $scope.filters.Reasons = filterdata.data.reasons;
                //salaryStructureService.getEmployeeByOfficeCode($scope.salaryStructureToEdit.OfficeCode).then(function (response) {
                //    $scope.filters.BranchEmployees = response.data.employees;
                //});
                var branchId = $rootScope.searchedBranchId === undefined ? $rootScope.selectedBranchId : $rootScope.searchedBranchId;
                commonService.getEmployeeFilterFromSP(branchId, $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                    $scope.filters.BranchEmployees = response.data;
                });
                console.log($rootScope.user.EmployeeId);

            });
        };
        
            
        console.log($scope.salaryStructureToEdit.allowanceAccounts);
        console.log($rootScope.user.Role);


        $scope.checkJoiningDate = function () {
            if (moment($scope.salaryStructureToEdit.OpeningDate).format() != moment(new Date($scope.salaryStructureToEdit.StartDate)).format()) {
                swal("Opening Date is not valid.");
                return true;
            }
            return false;
        }

        $scope.checkStartDate = function () {
            if ($scope.salaryStructureToEdit.OpeningDate > new Date($rootScope.workingdate)) {
                swal("Start date can't be future date.");
                return true;
            }
            return false;
        }
        $scope.$on('salary-structure-edit-finished', function () {
            $scope.getSalaryStructures();
        });
        $scope.OfficeCode = $rootScope.selectedBranchId;
        $scope.$watch('OfficeCode', function (obj) {
            $scope.salaryStructureToEdit.OriginatingOfficeCode = obj;
        }, true);


        console.log($scope.salaryStructureToEdit);
        $scope.editSalaryStructure = function () {
            if ($scope.salaryStructureToEdit.OpeningDate != null) {
                if ($scope.checkStartDate()) return;
                if ($scope.checkJoiningDate()) return;
            }
            console.log($scope.salaryStructureToEdit);


            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.employeeSalaryStructure),
                showCancelButton: true,
                confirmButtonText: "Yes, Edit it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.salaryStructureToEdit.StartDate = moment($scope.salaryStructureToEdit.OpeningDate).format();
                    if ($scope.salaryStructureToEdit.ClosingDate != null) {

                        $scope.salaryStructureToEdit.ClosingDate = moment($scope.salaryStructureToEdit.ClosingDate).format();
                    }
                    //else {
                    //    $scope.salaryStructureToEdit.ClosingDate = moment($scope.salaryStructureToEdit.ClosingDate).format();
                    //}
                    



                    salaryStructureService.editEmployeeSalaryStructure($scope.salaryStructureToEdit)
                        .then(function (response) {

                            if (response.data.Success) {
                                $rootScope.$broadcast('salary-structure-edit-finished');
                                swal({
                                    title: $rootScope.showMessage($rootScope.editSuccess, $rootScope.employeeSalaryStructure),
                                    //text: "What do you want to do next?",
                                    type: "success",
                                    showCancelButton: true,
                                    showConfirmButton: false,
                                    //confirmButtonColor: "#008000",
                                    //confirmButtonText: "Edit New",
                                    cancelButtonText: "Close and Exit",
                                    closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            $scope.editSalaryStructureForm.$dirty = false;
                                            $scope.editSalaryStructureForm.reset();

                                            $scope.clearModelData();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                            } else {
                                swal($rootScope.showMessage($rootScope.editError, $rootScope.employeeSalaryStructure), response.data.Message, "error");
                            }

                        });

                }
            });
        }

        $scope.clearModelData = function () {
            $scope.salaryStructureToEdit = null;
            $scope.getAllFilters = null;
        }

        $scope.clearAndCloseTab = function () {
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

        


        

        $scope.init = function () {
            $scope.getAllFilters();
            
            //salaryStructureService.getEmployeeByOfficeCode($scope.salaryStructureToEdit.OfficeCode).then(function (response) {
            //    $scope.filters.BranchEmployees = response.data.employees;
            //});
            
            workingDayService.getDateOfBranch($rootScope.selectedBranchId).then(function (response) {
                $scope.createdBranchWorkingDate = response.data.date;
                $scope.salaryStructureToEdit.CheckDay = new Date($rootScope.workingdate);
                $scope.salaryStructureToEdit.CheckDay = moment($scope.salaryStructureToEdit.CheckDay).format();

                console.log($scope.salaryStructureId);
                console.log($scope.salaryStructureToEdit.EmployeeId);
                salaryStructureService.getEmployeeAccounts($scope.salaryStructureId).then(function (response) {
                    $scope.salaryStructureToEdit.allowanceAccounts = angular.copy(response.data.filter(v=>v.Type === 1 || v.Type === 3));
                    $scope.salaryStructureToEdit.deductionAccounts = angular.copy(response.data.filter(v=>v.Type === 2 || v.Type === 3));
                    console.log(response.data);
                    $scope.getTotalAllowance = function () {
                        var allowanceTotal = 0;
                        for (var i = 0; i < $scope.salaryStructureToEdit.allowanceAccounts.length; i++) {
                            var account = $scope.salaryStructureToEdit.allowanceAccounts[i];
                            allowanceTotal += account.PrincipalAmount;
                        }
                        return allowanceTotal;
                    }
                    $scope.getTotalDeduction = function () {
                        var deductionTotal = 0;
                        for (var i = 0; i < $scope.salaryStructureToEdit.deductionAccounts.length; i++) {
                            var account = $scope.salaryStructureToEdit.deductionAccounts[i];
                            deductionTotal += account.PrincipalAmount;
                        }
                        return deductionTotal;
                    }
                    $scope.netPayableSalary = function() {
                        var netPayable = $scope.getTotalAllowance() - $scope.getTotalDeduction();
                        return netPayable;
                    }
                });

                

            });



            $scope.getSalaryStructures = function () {
                salaryStructureService.getEmployeeSalaryStructureByBranchId($rootScope.selectedBranchId).then(function (response) {
                    $scope.salaryStructureList = response.data;
                    console.log($scope.salaryStructureList);
                }, AMMS.handleServiceError);
            }
            $scope.salaryStructureToEdit.ClosingDate = new Date($rootScope.workingdate);
            //$scope.today();
        }

        $scope.init();
        //if ($rootScope.command == 'Close') {
        //    $scope.salaryStructureToEdit.ClosingDate = new Date($rootScope.workingdate);
        //}
        $scope.getHolidays = function () {
            memberDailyTransactionService.getBranchOffDayAndHolidays($scope.selectedBranchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }

        $scope.isHolidayOrOffDay = function (d) {
            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    $scope.salaryStructureToEdit.OpeningDate = new Date($rootScope.workingdate);
                    return;
                }
            });

        }

        //new datepicker
        $scope.today = function () {
            //$scope.salaryStructureToEdit.OpeningDate = new Date($scope.salaryStructureToEdit.StartDate);
            $scope.salaryStructureToEdit.ClosingDate = new Date($rootScope.workingdate);

        };
         $scope.today();

         //if ($rootScope.command == 'Close') {
         //    $scope.salaryStructureToEdit.ClosingDate = new Date($rootScope.workingdate);
         //}

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
                || (moment(date) > moment(new Date($rootScope.workingdate)).add(1, 'days'));
        }
        function disabledForEndDate(data) {
            var date = data.date,
              mode = data.mode;
            //console.log((new Date($rootScope.workingdate)).getDate);
            return (moment(date) > moment(new Date($rootScope.workingdate)).add(5, 'years'));
        }
        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2040, 5, 22),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };

        $scope.dateOptionsForEndDate = {
            dateDisabled: disabledForEndDate,
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
            //if (moment($scope.fee.StartDate).valueOf() < moment($scope.fee.EndDate).valueOf()) {
            //    swal('please select valid admission date!');
            //    $scope.today();
            //    return;
            //}
            if (moment($scope.salaryStructureToEdit.OpeningDate).valueOf() > maxDate || moment($scope.salaryStructureToEdit.OpeningDate).valueOf() < minDate) {
                swal('please select valid date!');
                //$scope.today();
                return;
            }


            if (moment($scope.salaryStructureToEdit.OpeningDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
                swal("unable to select future date!");
                //$scope.today();
                return;
            }
            //$scope.isHolidayOrOffDay = function (d) {
            //    $scope.branchHolidayAndOffDay.forEach(function (h) {
            //        if (moment(h).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
            //            swal('Selected date is holiday or Offday');

            //        }
            //    });

            //}
            $scope.isHolidayOrOffDay($scope.salaryStructureToEdit.OpeningDate);
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

            if (moment($scope.salaryStructureToEdit.ClosingDate).valueOf() > maxDate || moment($scope.salaryStructureToEdit.ClosingDate).valueOf() < minDate) {
                swal('please select valid date!');
                //$scope.today();
                return;
            }

            if (moment($scope.salaryStructureToEdit.ClosingDate) < moment(new Date($scope.salaryStructureToEdit.OpeningDate))) {
                swal("unable to select past date!");
                return;
            }

        }

    }
]);