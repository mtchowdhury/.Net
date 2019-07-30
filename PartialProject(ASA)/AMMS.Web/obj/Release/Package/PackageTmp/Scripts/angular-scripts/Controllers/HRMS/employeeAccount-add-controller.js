ammsAng.controller('employeeAccountAddController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'employeeAccountService','commonService','employeeService',
    function ($scope, $rootScope, $timeout, $q, filterService, employeeAccountService, commonService, employeeService) {
        $scope.eaccount = {};
        $scope.filters = {};
        $scope.filter = {};
        //$scope.eaccount.employee = angular.copy($rootScope.eObjectForAccountAdd);
        //$scope.eaccount.CurrentOfficeCode = angular.copy($rootScope.branchInfo.branchCode);
        //$scope.eaccount.CurrentOfficeType = angular.copy($rootScope.branchInfo.officeType);
        //$scope.eaccount.EmployeeId = $scope.eaccount.employee.Value;
        //$scope.eaccount.EmployeeName = $scope.eaccount.employee.Name.concat("(", $scope.eaccount.employee.Value, ")");

        $scope.eObjectForAccountAdd = angular.copy($rootScope.eObjectForAccountAdd);
        $scope.branchInfo = angular.copy($rootScope.branchInfo);
       // delete $rootScope.eObjectForAccountAdd;
       // delete $rootScope.branchInfo;
        $scope.roleId = $rootScope.user.Role;
       

        $scope.GetFilters = function () {
            $("#loadingImage").css("display", "block");
            employeeAccountService.getFilterData(0, $rootScope.user.Role, $rootScope.selectedBranchId).then(function (response) {
                $scope.filters = response.data;
                $scope.filterDurationListCopy = angular.copy($scope.filters.Duration);
                $scope.eaccount.AccountTypeId = $scope.filters.AccountTypes[0].Value;
                $scope.getAccoutTypeById();
                $scope.getEmployeeBankAccounts();
                $("#loadingImage").css("display", "none");
              //  $scope.getEmployeeAccountCycleCount();
            });
            if ($rootScope.user.Role === $rootScope.rootLevel.BM.toString()) {
                $scope.filter.OfficeTypeId = 1;
                $("#loadingImage").css("display", "block");
                employeeAccountService.getBranchesByOfficeTypeId(1, $rootScope.user.Role, $rootScope.selectedBranchId).then(function (response) {
                    $scope.BranchList = response.data;
                    $scope.filter.BranchId = $scope.BranchList[0].Value;
                    //$scope.loadEmployees($scope.filter.BranchId);
                    $("#loadingImage").css("display", "none");
                    $scope.loadEmployeesFromSp();
                });
            }
           
        }
        $scope.getEmployeeBankAccounts=function() {
            //employeeAccountService.getEmployeeBankcAccounts($scope.filter.BranchId.Value).then(function (response) {
            //    $scope.filters.BankAccounts = response.data;
            //});
            filterService.GetActiveBankAccountListByBranch($scope.filter.BranchId.Value).then(function (response) {
                $scope.filters.BankAccounts = response.data;
           });
        }

        $scope.loadBranches = function (officeTypeId) {
            employeeAccountService.getBranchesByOfficeTypeId(officeTypeId, $rootScope.user.Role, $rootScope.selectedBranchId).then(function (response) {
                $scope.BranchList = response.data;
            });
        }
        $scope.loadEmployees = function (branchId) {
            employeeAccountService.getEmployeeListByBranchId(branchId).then(function (response) {
                $scope.EmployeeList = response.data.filter(e=>e.RelationalValue===1);
            });
        }
        $scope.loadEmployeesFromSp = function () {
            $("#loadingImage").css("display", "block");
            commonService.getEmployeeFilterFromSP($scope.filter.BranchId.Value, $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901,00,01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                $scope.EmployeeList = response.data;
                $("#loadingImage").css("display", "none");
            });
        }
        $scope.setDefaultValues = function () {

            $scope.filters.Duration = $scope.selectedAccountType.Category === 1 ? $scope.selectedAccountType.DurationInMonth : $scope.filterDurationListCopy;
            $scope.eaccount.ServiceChargeRate = $scope.selectedAccountType.Category === 1 ? $scope.selectedAccountType.InterestRate : undefined;
            $scope.eaccount.AccountOpeningType = 2;
            $scope.eaccount.Duration = $scope.selectedAccountType.Category !== 1 ? 12 : undefined;
            $scope.eaccount.InstallmentType = 1;
            $scope.eaccount.LifeCycle = $scope.selectedAccountType.Category === 1 ? 2 : $scope.selectedAccountType.Category === 3 ? 3 : 1;
            $scope.eaccount.Status = 1;
            $scope.eaccount.SubsidyAmount = 0;
            $scope.eaccount.TotalInstallment = ($scope.selectedAccountType.Category !== 1 || $scope.selectedAccountType.Category !== 5) ? $scope.eaccount.Duration : undefined;
            $scope.eaccount.RepeatInPayroll = $scope.selectedAccountType.Category === 1 || $scope.selectedAccountType.Category === 2 || $scope.selectedAccountType.Category === 5 ? true : false;
        }


        $scope.addEmployeeAccount = function () {
            
            if (($scope.selectedAccountType.Category === 1 || $scope.selectedAccountType.Category === 5) && ($scope.eaccount.DisburseDate===null ||$scope.eaccount.DisburseDate===undefined)) {
                swal('please select a disburse date!');
                return;
            }
            if (($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5) && ($scope.eaccount.OpeningDate === null || $scope.eaccount.OpeningDate === undefined)) {
                swal('please select an opening date!');
                return;
            }


            console.log($scope.eaccount);
            swal({
                title: "confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.employeeAccount),
                showCancelButton: true,
                confirmButtonText: "yes,Create it!",
                cancelButtonText: "No,Cancel!",
                type: 'info',
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.eaccount.OpeningDate = ($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5) ? moment($scope.eaccount.OpeningDate).format() : undefined;
                    $scope.eaccount.DisburseDate = ($scope.selectedAccountType.Category === 1 || $scope.selectedAccountType.Category === 5) ? moment($scope.eaccount.DisburseDate).format() : undefined;
                    $scope.eaccount.Type = $scope.selectedAccountType.Type;
                    $scope.eaccount.CreatedOn = moment($rootScope.workingdate).format();
                    employeeAccountService.addEmployeeAccount($scope.eaccount).then(function (response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('employeeAccount-add-finished');
                            swal({
                                title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.employeeAccount),
                                text: "What do you want to do next?",
                                type: "success",
                                showCancelButton: true,
                                confirmButtonColor: "#008000",
                                confirmButtonText: "Add New",
                                cancelButtonText: "Close and Exit",
                                closeOnConfirm: true,
                                closeOnCancel: true
                            },
                                function (isConfirmed) {
                                    if (isConfirmed) {
                                        $scope.addEmployeeAccountForm.reset();
                                        $scope.addEmployeeAccountForm.$dirty = false;
                                        $timeout(function () { $scope.clearModelData(); }, 300);
                                    } else {
                                        $timeout(function () { $scope.clearAndCloseTab(); }, 300);
                                    }
                                });
                        } else {
                            $scope.today();
                            swal($rootScope.showMessage($rootScope.addError, $rootScope.employeeAccount), response.data.Message, "error");
                        }
                    });
                }
            });
        }
        $scope.getAccoutTypeById = function () {
            employeeService.getAccountTypeById($scope.eaccount.AccountTypeId).then(function(response) {
                $scope.selectedAccountType = response.data;
                $scope.mapAccountTypeDuration();
                $scope.setDefaultValues();
            });
          
        }
        ////$scope.getEmployeeIdByEmployeeId = function () {
        ////    var employeeId = $scope.filter.employee.substring($scope.filter.employee.indexOf('('), $scope.filter.employee.indexOf('('));
        ////    employeeService.getEmployeeIdByEmployeeId(employeeId).then(function (response) {
        ////        $scope.eaccount.EmployeeId = response.data;
        ////    });
        ////}
        //$scope.setEmployeeId=function() {
        //    $scope.eaccount.EmployeeId
        //}

        $scope.getEmployeeAccountCycleCount = function () {
            if ($scope.eaccount.EmployeeId === undefined || $scope.eaccount.EmployeeId === null) return;
            employeeAccountService.getEmployeeAccountCycleCount($scope.eaccount.EmployeeId, $scope.eaccount.AccountTypeId).then(function (response) {
                $scope.eaccount.Cycle = response.data;
            });
        }

        $scope.mapAccountTypeDuration = function () {
            $scope.selectedAccountType.DurationInMonth =
            angular.copy($scope.selectedAccountType.DurationInMonth.split(',').map(function (e) { return { Name: e, Value: parseInt(e) } }));
        }
        $scope.getSelectedBranchTypeIdAndSetDefaultBranchForUser = function () {
            $("#loadingImage").css("display", "block");
            employeeAccountService.getSelectedOfficeTypeIdByBranchId($rootScope.selectedBranchId).then(function (response) {
                $scope.selectedBranchTypeId = response.data;
                $scope.filter.OfficeTypeId = $scope.selectedBranchTypeId;
                employeeAccountService.getBranchesByOfficeTypeId($scope.filter.OfficeTypeId, $rootScope.user.Role, $rootScope.selectedBranchId).then(function (response) {
                    $scope.BranchList = response.data;
                    $scope.filter.BranchId = $scope.BranchList.filter(br => br.Value === $rootScope.selectedBranchId)[0];
                    $scope.loadEmployeesFromSp();
                   // $("#loadingImage").css("display", "block");
                });
            });
        }
    $scope.init=function() {
        $scope.GetFilters();
        $scope.getSelectedBranchTypeIdAndSetDefaultBranchForUser();
       
    }

    $scope.clearModelData=function() {
        $scope.eaccount = {};
    }

        //$scope.fortestpurpose=function() {
        //    $scope.eaccount.ServiceCharge = 25;
        //    $scope.eaccount.Disbursed = 2500;
        //    $scope.eaccount.TotalInstallment = 12;
        //    $scope.eaccount.InstallmentAmount = 120;

        //}

        $scope.clearCalculatedData=function() {
            //$scope.eaccount.ServiceCharge = undefined;
            //$scope.eaccount.Disbursed = undefined;
            //$scope.eaccount.TotalInstallment = undefined;
            //$scope.eaccount.InstallmentAmount = undefined;
          
        }
        $scope.clearTypeChangeData=function() {
            $scope.eaccount.InstallmentAmount=undefined;
            $scope.eaccount.SubsidyAmount = undefined;
            $scope.eaccount.PrincipalAmount = undefined;
            $scope.eaccount.ServiceChargeRate = undefined;
            $scope.eaccount.ServiceCharge = undefined;
            $scope.eaccount.Disbursed = undefined;

            //for duration & related values
            $scope.eaccount.Duration = undefined;
            $scope.eaccount.InstallmentType = undefined;
            $scope.eaccount.TotalInstallment = undefined;
        }

        $scope.calculateOtherValue = function () {
            if ($scope.eaccount.Duration === undefined || $scope.eaccount.Duration === null)return;
            if ($scope.selectedAccountType.Category === 1) {
                if ($scope.eaccount.PrincipalAmount === undefined || $scope.eaccount.PrincipalAmount === null) return;
                $scope.clearCalculatedData();
                $scope.eaccount.ServiceCharge = ($scope.eaccount.PrincipalAmount / 100) * $scope.eaccount.ServiceChargeRate;
                $scope.eaccount.Disbursed = $scope.eaccount.PrincipalAmount + $scope.eaccount.ServiceCharge;
                $scope.eaccount.TotalInstallment = $scope.eaccount.Duration;
                $scope.eaccount.InstallmentAmount = Math.ceil(($scope.eaccount.Disbursed - $scope.eaccount.SubsidyAmount) / $scope.eaccount.TotalInstallment);
            }
            else {
                $scope.clearCalculatedData();
                $scope.eaccount.TotalInstallment = $scope.eaccount.Duration;
            }
            if ($scope.selectedAccountType.Category === 5) {
                $scope.eaccount.InstallmentAmount = Math.ceil(($scope.eaccount.PrincipalAmount) / $scope.eaccount.TotalInstallment);
            }
        }
        $scope.validateSubsidy=function() {
            if ($scope.eaccount.PrincipalAmount !== undefined && $scope.eaccount.PrincipalAmount !== null && $scope.eaccount.SubsidyAmount !== undefined && $scope.eaccount.SubsidyAmount !== null && $scope.eaccount.SubsidyAmount > $scope.eaccount.PrincipalAmount) {
                swal("subsidy amount can not be greater than principal amount!");
                $scope.eaccount.SubsidyAmount = 0;
                // $scope.clearCalculatedData();
                $scope.calculateOtherValue();
                return;
            }
        }
        $scope.providentFundLoanServiceChargeStepper=function() {
            if ($scope.eaccount.AccountTypeId !== 5) return;
            if ($scope.eaccount.Duration === undefined || $scope.eaccount.Duration === null) return;
            var yearCount = Math.floor($scope.eaccount.Duration / 12);
            if (yearCount === 0) {
                $scope.eaccount.ServiceChargeRate = $scope.selectedAccountType.Category === 1 ? $scope.selectedAccountType.InterestRate : undefined;; return;
            }
            $scope.eaccount.ServiceChargeRate = $scope.selectedAccountType.InterestRate + ((yearCount-1) * 5);

        }

        $scope.clearModelData = function () {
            $scope.eaccount = {};
            //$scope.eaccount.employee = angular.copy($scope.eObjectForAccountAdd);
            //$scope.eaccount.CurrentOfficeCode = angular.copy($scope.branchInfo.branchCode);
            //$scope.eaccount.CurrentOfficeType = angular.copy($scope.branchInfo.officeType);
            //$scope.eaccount.EmployeeId = $scope.eaccount.employee.Value;
            //$scope.eaccount.EmployeeName = $scope.eaccount.employee.Name.concat("(", $scope.eaccount.employee.Value, ")");
        }
        

        $scope.clearAndCloseTab = function () {
            $scope.eaccount = {};
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

    $scope.init();
    //new date picker 
        $scope.today = function () {
            $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
            $scope.eaccount.DisburseDate = new Date($rootScope.workingdate);
        };
        $scope.today();

       

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
          return (mode === 'day' && (date.getDay() === 5))
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

        $scope.openDpop = function () {
            $scope.disbursePop.opened = true;
        };

       // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','dd/MM/yyyy'];
        $scope.format = $rootScope.formats[4];
        //$scope.format = $scope.altInputFormats;
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.openingpPop = {
            opened: false
        };

        $scope.disbursePop = {
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
        $scope.opValidator = function () {
            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM || $scope.roleId == $rootScope.rootLevel.BM) {
               // maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                maxDate = moment($rootScope.workingdate).valueOf();
               // minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).valueOf();
            }
            //else if ($scope.roleId == $rootScope.rootLevel.RM) {
            //    maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //    minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
            //}
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-90, 'days').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin || $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }

            

            if (($scope.selectedAccountType.Category === 1 || $scope.selectedAccountType.Category === 5) &&
                (moment($scope.eaccount.DisburseDate).valueOf() > moment(maxDate).valueOf() || moment($scope.eaccount.DisburseDate).valueOf() <  moment(minDate).valueOf())) {
                swal("you are not allowed to perform this operation! please contact system administrator!");
                $scope.eaccount.DisburseDate=new Date($rootScope.workingdate);
                return;
            }
            if (($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5) &&
                (moment($scope.eaccount.OpeningDate).valueOf() > moment(maxDate).valueOf() || moment($scope.eaccount.OpeningDate).valueOf() <  moment(minDate).valueOf())) {
                swal("you are not allowed to perform this operation! please contact system administrator!");
                $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
                return;
            }

        }
      

      

    }
]);