ammsAng.controller('hrmTransactionAddController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'workingDayService', 'commonService', 'memberDailyTransactionService', 'employeeService', 'hrmTransactionService',
    function ($scope, $rootScope, $timeout, $q, filterService, workingDayService, commonService, memberDailyTransactionService, employeeService, hrmTransactionService) {
        $scope.isDirty = false;
        $scope.filters = {};
        $scope.hrmTransactionToAdd = {};
        $scope.roleId = $rootScope.user.Role;
        console.log($rootScope.user.EmoloyeeId);

        $scope.getAllFilters = function () {
            hrmTransactionService.getAllFilters($rootScope.selectedBranchId).then(function (filterdata) {
               
                console.log(filterdata.data);
                //$scope.filters.employees = filterdata.data.employees;
                $scope.filters.transactionTypes = filterdata.data.transactionTypes;
                $scope.filters.transactionProcesses = filterdata.data.transactionProcesses;
                console.log($scope.filters.transactionProcesses);
                $scope.filters.transactionLocation = filterdata.data.transactionLocation;

                commonService.getEmployeeFilterFromSP($rootScope.selectedBranchId, $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                    $scope.filters.employees = response.data;
                });
                
                $scope.hrmTransactionToAdd.Location = 63;
                $scope.hrmTransactionToAdd.TransactionProcess = 1;
                $scope.hrmTransactionToAdd.CreatedBy = $rootScope.user.EmployeeId;
                $scope.hrmTransactionToAdd.ModifiedBy = $rootScope.user.EmployeeId;
                console.log($scope.hrmTransactionToAdd.CreatedBy);
            });
        };

        $scope.getHolidays = function (branchId) {
            memberDailyTransactionService.getBranchOffDayAndHolidays(branchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }

        $scope.checkTransactionDate = function () {
            if ($scope.hrmTransactionToAdd.TransactionDate > new Date($rootScope.workingdate)) {
                swal("Transaction date can't be future date");
                return true;
            }
            return false;
        }
        $scope.checkTransactionDateForDisbuseDate = function (disburseDate) {
            if ($scope.hrmTransactionToAdd.TransactionDate < disburseDate) {
                swal("Cannot Create Transaction before disburse date.");
                $scope.init();
                return true;
            }
            return false;
        }

        $scope.checkTransactionForOutstanding = function (outstanding,installmentAmount) {
            if ( $scope.hrmTransactionToAdd.Amount > outstanding) {
                swal("Cannot Create Transaction for more amount than Outstanding Amount.");
                $scope.init();
                return true;
            }
            return false;
        }


        $scope.checkIfEmployeeIsActive = function (employeeId) {
            employeeService.getEmployee(employeeId).then(function (response) {
                $scope.isEmployeeActive = response.data.Status;
                if ($scope.isEmployeeActive != 1) {
                    swal("Employee Is Not Active");
                    return true;
                }
                return false;
            });

        }

        $scope.checkIfEmployeeIsInTransferState = function (employeeId) {
            hrmTransactionService.getEmployeeTransferStatus(employeeId).then(function (response) {
                $scope.isEmployeeInTransferState = response.data;
                if ($scope.isEmployeeInTransferState) {
                    swal("Employee Is In Transfer State.");
                    return true;
                }

                return false;
            });
        }

        $scope.checkPermission = function () {
            //var day = new Date($scope.createdDate);
            var date = $scope.createdDate;
            var newdate = date.split("-").reverse().join("-");
            var checkDay = new Date(newdate);
            if ($rootScope.user.Role == 3) {
                checkDay.setDate(checkDay.getDate() - 2);
                if ($scope.hrmTransactionToAdd.TransactionDate < checkDay) {
                    swal("You are not allowed to perform this transaction. Please contact with administrator.");
                    return true;
                }
                return false;
            }
            if ($rootScope.user.Role == 5) {
                checkDay.setDate(checkDay.getDate() - 91);
                if ($scope.hrmTransactionToAdd.TransactionDate < checkDay) {
                    swal("You are not allowed to perform this transaction. Please contact with administrator.");
                    return true;
                }
                return false;
            }

            //if ($rootScope.user.Role == 1 ) {
            //    checkDay.setDate(checkDay.getDate() -15000);
            //    if ($scope.paySalaryToAdd.TransactionDate < checkDay) {
            //        swal("Transaction date can't be less than 90 previous day.");
            //        return true;
            //        }
            //    return false;
            //    }

            return false;
        }

        $scope.onAccountChange = function (accountId) {
            hrmTransactionService.accountDetails(accountId).then(function (response) {
                $scope.disburseInformation = response.data;
                if ($scope.disburseInformation.DisburseDate != null) {
                    $scope.DisburseDate = new Date($scope.disburseInformation.DisburseDate);
                    $scope.OutstandingAmount = $scope.disburseInformation.OutstandingAmount;
                    $scope.InstallmentAmount = $scope.disburseInformation.InstallmentAmount;
                    $scope.AccountTypeId = $scope.disburseInformation.AccountTypeId;
                    //$scope.checkTransactionForOutstanding($scope.OutstandingAmount);
                    $scope.checkTransactionDateForDisbuseDate($scope.DisburseDate);
                    
                }
            });
            hrmTransactionService.getTransactionTypesByAccountId($scope.hrmTransactionToAdd.EmployeeAccountId).then(function(response) {
                $scope.filters.transactionTypes = response.data;
                if ($scope.filters.transactionTypes.length > 0) {
                    $scope.filters.transactionTypes.forEach(function(trans) {
                        if (trans.AnyAdditionalValue === 1) trans.Name = "*" + trans.Name;
                    });
                   
                }
            });
        }



        $scope.onEmployeeChange = function (employeeId) {
            hrmTransactionService.employeeDetails(employeeId).then(function (response) {
                $scope.employeeDetails = response.data;
                $scope.$watch('employeeDetails', function (obj) {

                    $scope.hrmTransactionToAdd.OfficeType = obj.CurrentOfficeType;
                    $scope.hrmTransactionToAdd.OfficeCode = obj.CurrentBranchId;
                    $scope.hrmTransactionToAdd.EmployeeName = obj.Name;
                    $scope.hrmTransactionToAdd.Designation = obj.CurrentDesignation;
                    $scope.hrmTransactionToAdd.Grade = obj.CurrentGrade;
                    console.log($scope.hrmTransactionToAdd.OfficeType);
                    console.log($scope.hrmTransactionToAdd.OfficeCode);
                    console.log($scope.hrmTransactionToAdd.EmployeeName);
                    console.log($scope.hrmTransactionToAdd.Designation);
                    console.log(obj.CurrentGrade);
                    console.log(obj);
                }, true);
            });

            hrmTransactionService.getAllEmployeeBankAccounts(employeeId).then(function (response) {
                $scope.employeeBankAccounts = response.data;
            });
            hrmTransactionService.getEmployeeAccountById(employeeId).then(function (response) {
                $scope.employeeAccounts = response.data.accounts;
                if ($scope.employeeAccounts.length > 0) {
                    $scope.employeeAccounts.forEach(function(account) {
                        if (account.AnyAdditionalValue === 1) account.Name = "*" + account.Name;
                        account.Name = account.Name +"("+ account.AnyAdditionalString +")";
                    });
                    $scope.employeeAccounts = angular.copy($scope.employeeAccounts.filter(x=>x.AnyAdditionalValue === 1));
                    
                }
                console.log(response.data.employeeAccounts);
                console.log($scope.employeeAccounts);
            });
        }
        //$scope.onEmployeeChange = function(employeeId) {
            
        //}

        //$scope.$watch('employeeDetails', function (obj) {

        //    $scope.hrmTransactionToAdd.OfficeType = obj.CurrentOfficeType;
        //    $scope.hrmTransactionToAdd.OfficeCode = obj.CurrentBranchId;
        //    $scope.hrmTransactionToAdd.EmployeeName = obj.Name;
        //    $scope.hrmTransactionToAdd.Designation = obj.CurrentDesignation;
        //    $scope.hrmTransactionToAdd.Grade = obj.CurrentGrade;
        //    console.log($scope.hrmTransactionToAdd.OfficeType);
        //    console.log($scope.hrmTransactionToAdd.OfficeCode);
        //    console.log($scope.hrmTransactionToAdd.EmployeeName);
        //    console.log($scope.hrmTransactionToAdd.Designation);
        //    console.log(obj.CurrentGrade);
        //    console.log(obj);
        //}, true);

        hrmTransactionService.getHrmTransactionCreatedFrom().then(function (response) {
            $scope.transactionFrom = response.data;
        });
        $scope.$watch('transactionFrom', function (obj) {

            $scope.hrmTransactionToAdd.TransactionCreatedFrom = obj;
            
        }, true);


        $scope.addHrmTransaction = function () {
            if ($scope.checkIfEmployeeIsActive($scope.hrmTransactionToAdd.EmployeeId)) return;
            if ($scope.checkIfEmployeeIsInTransferState($scope.hrmTransactionToAdd.EmployeeId)) return;
            if ($scope.hrmTransactionToAdd.TransactionDate != null) {
                if ($scope.checkTransactionDate()) return;

            }
            if ($scope.checkTransactionDateForDisbuseDate($scope.DisburseDate)) return;
            if ($scope.AccountTypeId != 13 && $scope.AccountTypeId != 24 && $scope.AccountTypeId != 30 && $scope.AccountTypeId != 32 && $scope.AccountTypeId != 33
                && $scope.AccountTypeId != 34 && $scope.AccountTypeId != 35 && $scope.AccountTypeId != 36 && $scope.AccountTypeId != 48
                && $scope.AccountTypeId != 41) {
                if ($scope.checkTransactionForOutstanding($scope.OutstandingAmount, $scope.InstallmentAmount)) return;
            }
            
            if ($scope.checkPermission()) return;
            //var parts = $scope.hrmTransactionToAdd.TransactionDate.split('-');
            //$scope.hrmTransactionToAdd.TransactionDate = new Date(parts[2], parts[1] - 1, parts[0]);
            //console.log($scope.hrmTransactionToAdd);



            //var tranDate = $scope.hrmTransactionToAdd.TransactionDate.toString();
            //tranDate = new Date(tranDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
            //tranDate.setDate(tranDate.getDate() + 1);
            //$scope.hrmTransactionToAdd.TransactionDate = tranDate;


            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.hrmTransactions),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.hrmTransactionToAdd.TransactionDate = moment($scope.hrmTransactionToAdd.TransactionDate).format();
                    

                    hrmTransactionService.hrmTransaction($scope.hrmTransactionToAdd,true,false)
                        .then(function (response) {

                            if (response.data.Success) {
                                $rootScope.$broadcast('hrmTransaction-add-finished');
                                swal({
                                    title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.hrmTransactions),
                                    //text: "What do you want to do next?",
                                    //type: "success",
                                    showCancelButton: true,
                                    //confirmButtonColor: "#008000",
                                    //confirmButtonText: "Add New",
                                    cancelButtonText: "Close and Exit",
                                    //closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            $scope.hrmTransactionAddForm.$dirty = false;
                                            $scope.hrmTransactionAddForm.reset();

                                            $scope.clearModelData();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                            } else {
                                swal($rootScope.showMessage($rootScope.addError, $rootScope.hrmTransactions), response.data.Message, "error");
                            }

                        });

                }
            });
        }

        $scope.clearModelData = function () {
            $scope.hrmTransactionToAdd = null;
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
                    var branchDate = commonService.intToDate(obj).toString();
                    $scope.createdDate = branchDate;
                    $scope.hrmTransactionToAdd.CreatedBranchWorkingDate = obj;
                    $scope.hrmTransactionToAdd.CurrentBranchWorkingDate = obj;
                //    $scope.hrmTransactionToAdd.TransactionDate = commonService.intToDate(obj);

                //var ss=    moment($scope.hrmTransactionToAdd.TransactionDate, "MM-DD-YYYY");
                //    var dateparts = commonService.intToDate(obj).split('-');

                //    $scope.hrmTransactionToAdd.TransactionDate = new Date(dateparts[2], dateparts[1] - 1, dateparts[0]);
                    //$scope.hrmTransactionToAdd.TransactionDate = new Date($rootScope.workingDate);
                    $scope.today();
                    console.log(obj);
                }, true);

            });

        }


        //new date picker 
        $scope.today = function () {
            $scope.hrmTransactionToAdd.TransactionDate = new Date($rootScope.workingdate);
            
        };
        



        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($rootScope.workingdate),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2040, 5, 22),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };

        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5)) || (moment(date) > moment(new Date($rootScope.workingdate)).add(1, 'days'));
            //            || (moment(date) > moment(new Date($rootScope.workingdate)));
        }

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate.getDate() + 1);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.openOpop = function () {
            $scope.openingpPop.opened = true;
        };

      

        // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','dd/MM/yyyy'];
        $scope.format = $rootScope.formats[4];
        //$scope.format = $scope.altInputFormats;
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.openingpPop = {
            opened: false
        };

       


        function getDayClass(data) {
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
        $scope.dValidator = function () {
            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.BM) {
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
            if (moment($scope.hrmTransactionToAdd.TransactionDate) > moment(new Date(maxDate)) || moment($scope.hrmTransactionToAdd.TransactionDate) < moment(new Date(minDate))) {
                swal("invalid closing date!");
                $scope.hrmTransactionToAdd.TransactionDate = new Date($rootScope.workingdate);
                return;
            }
            $scope.isHolidayOrOffDay($scope.hrmTransactionToAdd.TransactionDate);



            //if (($scope.selectedAccountType.Category === 1 || $scope.selectedAccountType.Category === 5) &&
            //    (moment($scope.eaccount.DisburseDate).valueOf() > moment(maxDate).valueOf() || moment($scope.eaccount.DisburseDate).valueOf() < moment(minDate).valueOf())) {
            //    swal("invalid or back date selected!");
            //    $scope.eaccount.DisburseDate = new Date($rootScope.workingdate);
            //    return;
            //}
            //if (($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5) &&
            //    (moment($scope.eaccount.OpeningDate).valueOf() > moment(maxDate).valueOf() || moment($scope.eaccount.OpeningDate).valueOf() < moment(minDate).valueOf())) {
            //    swal("invalid or back date selected!");
            //    $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
            //    return;
            //}

        }

        $scope.isHolidayOrOffDay = function (date) {
            $scope.selectedDate = moment(date).format("YYYY-MM-DD");
            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    $scope.hrmTransactionToAdd.TransactionDate = new Date($rootScope.workingdate);
                    return;
                }
            });

        }

        $scope.init();

    }
]);