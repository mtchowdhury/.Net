ammsAng.controller('salaryStructureAddController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'workingDayService', 'commonService', 'salaryStructureService', 'memberDailyTransactionService',
    function ($scope, $rootScope, $timeout, $q, filterService, workingDayService, commonService, salaryStructureService, memberDailyTransactionService) {
        $scope.isDirty = false;
        $scope.filters = {};
        $scope.salaryStructureToAdd = {};
        
        $scope.branchHolidayAndOffDay = null;
        $scope.salaryStructureToAdd.Status = 1;
        $scope.salaryStructureToAdd.CreatedBy = $rootScope.user.EmployeeId;
        $scope.salaryStructureToAdd.UpdatedBy = $rootScope.user.EmployeeId;
        console.log($scope.salaryStructureToAdd.CreatedBy);

        $scope.salaryStructureToAdd.allowanceAccountTypes = [];
        $scope.salaryStructureToAdd.deductionAccountTypes = [];

        $scope.getAllFilters = function () {
            salaryStructureService.permittedBranchFilters($rootScope.user.Role, $rootScope.user.EmployeeId).then(function (filterdata) {
                console.log(filterdata.data);
                $scope.filters.Branches = filterdata.data.branches;
                $scope.filters.Reasons = filterdata.data.reasons;
               
                console.log($rootScope.user.EmployeeId);

            });
        };
        console.log($rootScope.user.Role);



       

        $scope.checkStartDate = function () {
            if ($scope.salaryStructureToAdd.OpeningDate > $rootScope.workingdate) {
                swal("Start date can't be future date.");
                return true;
            }
            return false;
        }
        $scope.checkJoiningDate = function () {
            if (moment($scope.salaryStructureToAdd.OpeningDate).format() != moment($scope.SalaryStructureStartDate).format()) {
                swal("Opening date is not valid.");
                return true;
            }
            return false;
        }
        $scope.$on('salary-structure-add-finished', function () {
            $scope.getSalaryStructures();
        });
        $scope.OfficeCode = $rootScope.selectedBranchId;
        $scope.$watch('OfficeCode', function (obj) {
            $scope.salaryStructureToAdd.OriginatingOfficeCode = obj;
        }, true);


        $scope.onBranchChange = function (branchId) {
            commonService.getEmployeeFilterFromSP(branchId, $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                $scope.filters.Employees = response.data;
            });
        }

        $scope.onEmployeeChange = function (employeeId) {
            salaryStructureService.hasActiveSalaryStructure(employeeId, $rootScope.workingdateInt).then(function (response) {
                $scope.decission = response.data;
                if ($scope.decission) {
                    swal("Active Salary Structure Exist for Selected Employee.");
                    $scope.salaryStructureToAdd.EmployeeId = null;
                    $scope.salaryStructureToAdd.Status = 1;
                    $scope.salaryStructureToAdd.CreatedBy = $rootScope.user.EmployeeId;
                    $scope.salaryStructureToAdd.UpdatedBy = $rootScope.user.EmployeeId;
                    console.log($scope.salaryStructureToAdd.CreatedBy);

                    $scope.salaryStructureToAdd.allowanceAccountTypes = [];
                    $scope.salaryStructureToAdd.deductionAccountTypes = [];
                    $scope.init();
                } else {
                    salaryStructureService.getEmployeeDetails(employeeId).then(function (response) {
                        $scope.employeeData = response.data;
                        if ($scope.employeeData.CurrentBranchId != $scope.salaryStructureToAdd.OfficeCode) {
                            swal("Employee Is Not in Current Branch");
                        }
                        //console.log(response.data);
                    });
                    salaryStructureService.getAsaJoiningDate(employeeId).then(function (response) {
                        $scope.SalaryStructureOpenDate = response.data;
                        //var date = commonService.intToDate($scope.SalaryStructureOpenDate);
                        var openingDate = moment(response.data.toString().slice(0, 8)).format('MM-DD-YYYY');
                        $scope.salaryStructureToAdd.OpeningDate = new Date(openingDate);
                        $scope.SalaryStructureStartDate = new Date(openingDate);
                        $scope.salaryStructureToAdd.ClosingDate = null;
                    });
                }
            });


            

        }
        //$scope.$watch('employeeData', function (obj) {

        //    $scope.salaryStructureToAdd.OfficeType = obj.CurrentOfficeType;
        //    $scope.salaryStructureToAdd.OfficeCode = obj.CurrentBranchId;
        //    $scope.salaryStructureToAdd.EmployeeId = obj.Id;
        //    $scope.salaryStructureToAdd.EmployeeGrade = obj.CurrentGrade;
        //    $scope.salaryStructureToAdd.OfficeName = obj.SpouseName;
            
        //    console.log($scope.salaryStructureToAdd.OfficeName);

        //}, true);
        console.log($scope.salaryStructureToAdd.EmployeeId);
        //$scope.$watch('employeeByBranch', function (obj) {

        //    $scope.salaryStructureToAdd.OfficeType = obj.OfficeType;
        //    $scope.salaryStructureToAdd.OfficeCode = obj.OfficeCode;
        //    console.log($scope.salaryStructureToAdd.OfficeType);
        //    console.log($scope.salaryStructureToAdd.OfficeType);
        //}, true);
        $scope.getTotalAllowance = function () {
            var allowanceTotal = 0;
            for (var i = 0; i < $scope.salaryStructureToAdd.allowanceAccountTypes.length; i++) {
                var account = $scope.salaryStructureToAdd.allowanceAccountTypes[i];
                allowanceTotal += account.Amount;
            }
            return allowanceTotal;
        }
        $scope.getTotalDeduction = function () {
            var deductionTotal = 0;
            for (var i = 0; i < $scope.salaryStructureToAdd.deductionAccountTypes.length; i++) {
                var account = $scope.salaryStructureToAdd.deductionAccountTypes[i];
                deductionTotal += account.Amount;
            }
            return deductionTotal;
        }
        $scope.netPayableSalary = function () {
            var netPayable = $scope.getTotalAllowance() - $scope.getTotalDeduction();
            return netPayable;
        }
        console.log($scope.salaryStructureToAdd);
        $scope.addSalaryStructure = function () {
            if ($scope.salaryStructureToAdd.OpeningDate != null) {
                //if ($scope.checkStartDate()) return;
                if ($scope.checkJoiningDate()) return;
            }
            console.log($scope.salaryStructureToAdd);


            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.employeeSalaryStructure),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.salaryStructureToAdd.StartDate = moment($scope.salaryStructureToAdd.OpeningDate).format();

                    if ($scope.salaryStructureToAdd.EndDate != null) {

                        //$scope.salaryStructureToAdd.ClosingDate = moment($scope.salaryStructureToAdd.ClosingDate).format();
                    }


                    console.log($scope.salaryStructureToAdd);
                    salaryStructureService.addEmployeeSalaryStructure($scope.salaryStructureToAdd)
                        .then(function (response) {

                            if (response.data.Success) {
                                $rootScope.$broadcast('salary-structure-add-finished');
                                swal({
                                    title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.employeeSalaryStructure),
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
                                            $scope.addSalaryStructureForm.$dirty = false;
                                            $scope.addSalaryStructureForm.reset();

                                            $scope.clearModelData();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                            } else {
                                swal($rootScope.showMessage($rootScope.addError, $rootScope.employeeSalaryStructure), response.data.Message, "error");
                            }

                        });

                }
            });
        }

        $scope.clearModelData = function () {
            $scope.salaryStructureToAdd = null;
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
        function copyProvidentFund(accountType) {
            if (accountType.AccountTypeName == 'Provident Fund') {
                var amount = accountType.PrincipalAmount;
                for (var i = 0; i < $scope.salaryStructureToAdd.deductionAccountTypes.length; i++) {
                    if ($scope.salaryStructureToAdd.deductionAccountTypes[i].AccountTypeName == 'Employer Contribution') {
                        $scope.salaryStructureToAdd.deductionAccountTypes[i].PrincipalAmount = amount;
                    }
                }
            }
        }

        $scope.init = function () {
            $scope.getAllFilters();
            $scope.salaryStructureToAdd.OfficeCode = $rootScope.selectedBranchId;
            commonService.getEmployeeFilterFromSP($rootScope.selectedBranchId, $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                $scope.filters.Employees = response.data;
            });
            workingDayService.getDateOfBranch($rootScope.selectedBranchId).then(function (response) {
                $scope.createdBranchWorkingDate = response.data.date;


                salaryStructureService.getEmployeeAccountTypes(response.data.date).then(function (response) {
                   
                    $scope.salaryStructureToAdd.allowanceAccountTypes = angular.copy(response.data.filter(v=>v.Type === 1 || v.Type === 3));
                    $scope.salaryStructureToAdd.deductionAccountTypes = angular.copy(response.data.filter(v=>v.Type === 2||v.Type === 3));

                    console.log(response.data);
                    console.log($scope.salaryStructureToAdd.allowanceAccountTypes);
                    console.log($scope.salaryStructureToAdd.deductionAccountTypes);
                    
                });
                commonService.getServerDateTime().then(function (response) {
                    $scope.serverDateTimeToday = response.data;
                    console.log($scope.serverDateTimeToday);
                    
                    $scope.salaryStructureToAdd.ServerDate = new Date(angular.copy($scope.serverDateTimeToday));
                    console.log(response.data);
                    console.log($scope.serverDateTimeToday);
                    console.log($scope.salaryStructureToAdd.ServerDate);
                });


                $scope.$watch('createdBranchWorkingDate', function (obj) {
                    $scope.salaryStructureToAdd.CreatedOn = obj;
                    $scope.salaryStructureToAdd.UpdatedOn = obj;
                    console.log(obj);
                }, true);

                
            });
            
           

            $scope.getSalaryStructures = function () {
                salaryStructureService.getEmployeeSalaryStructureByBranchId($rootScope.selectedBranchId).then(function (response) {
                    $scope.salaryStructureList = response.data;
                    console.log($scope.salaryStructureList);
                }, AMMS.handleServiceError);
            }


        }

        $scope.init();

        $scope.getHolidays = function () {
            memberDailyTransactionService.getBranchOffDayAndHolidays($scope.selectedBranchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }

        $scope.isHolidayOrOffDay = function (d) {
            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    $scope.salaryStructureToAdd.OpeningDate = new Date($rootScope.workingdate);
                    return;
                }
            });

        }
        
        //new datepicker
        //$scope.today = function () {
        //    salaryStructureService.getAsaJoiningDate(salaryStructureToAdd.EmployeeId).then(function (response) {
        //        $scope.SalaryStructureOpenDate = response.data;
        //        $scope.salaryStructureToAdd.OpeningDate = new Date($scope.SalaryStructureOpenDate);
        //    });
            
        //    $scope.salaryStructureToAdd.ClosingDate = new Date($rootScope.workingdate);

        //};
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
            //if (moment($scope.fee.StartDate).valueOf() < moment($scope.fee.EndDate).valueOf()) {
            //    swal('please select valid admission date!');
            //    $scope.today();
            //    return;
            //}
            if (moment($scope.salaryStructureToAdd.OpeningDate).valueOf() > maxDate || moment($scope.salaryStructureToAdd.OpeningDate).valueOf() < minDate) {
                swal('please select valid date!');
                $scope.today();
                return;
            }


            if (moment($scope.salaryStructureToAdd.OpeningDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
                swal("unable to select future date!");
                $scope.today();
                return;
            }
            //$scope.isHolidayOrOffDay = function (d) {
            //    $scope.branchHolidayAndOffDay.forEach(function (h) {
            //        if (moment(h).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
            //            swal('Selected date is holiday or Offday');
                        
            //        }
            //    });

            //}
            $scope.isHolidayOrOffDay($scope.salaryStructureToAdd.OpeningDate);
        }
        $scope.endDateValidator = function () {
            //if (moment($scope.salaryStructureToAdd.ClosingDate) < moment(new Date($scope.salaryStructureToAdd.OpeningDate))) {
            //    swal("unable to select past date!");

            //    return;
            //}

        }

    }
]);