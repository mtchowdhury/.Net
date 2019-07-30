ammsAng.controller('employeeAccountEditController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'employeeAccountService', 'commonService', 'employeeService',
    function ($scope, $rootScope, $timeout, $q, filterService, employeeAccountService, commonService, employeeService) {
        $scope.eaccount = {};
        $scope.filters = {};
        $scope.roleId = $rootScope.user.Role;
        $scope.editEmployeeAccountId = $rootScope.editEmployeeAccountId;
        $scope.roleWiseDiabledGeneralField = false;
        

        $scope.GetFilters = function () {
            $("#loadingImage").css("display", "block");
            employeeAccountService.getFilterData($scope.eaccount.EmployeeId, $rootScope.user.Role, $rootScope.selectedBranchId,true).then(function (response) {
                $scope.filters = response.data;
                $scope.filterDurationListCopy = angular.copy($scope.filters.Duration);
                //$scope.eaccount.AccountTypeId = $scope.filters.AccountTypes[0].Value;
                $scope.getAccoutTypeById();
               // $scope.getEmployeeAccountCycleCount();
                console.log($scope.filters);
                $("#loadingImage").css("display", "none");
                $scope.getEmployeeBankAccounts();
            });
        }
        $scope.getEmployeeBankAccounts = function () {
            $("#loadingImage").css("display", "block");
            //employeeAccountService.getEmployeeBankcAccounts($scope.eaccount.EmployeeId ,100).then(function (response) {
            //    $scope.filters.BankAccounts = response.data;
            //    $("#loadingImage").css("display", "none");
            //});
            filterService.GetActiveBankAccountListByBranch($scope.selectedBranchId).then(function (response) {
                $scope.filters.BankAccounts = response.data;
                $("#loadingImage").css("display", "none");
           });
        }



        $scope.$on('tab-switched', function () {
            if ($scope.editEmployeeAccountId !== $rootScope.editEmployeeAccountId) {
                $scope.editEmployeeAccountId = $rootScope.editEmployeeAccountId;
                $scope.init();
            }
        });

        $scope.getEmployeeAccountById = function () {
            $("#loadingImage").css("display", "block");
            var eaccountId = $rootScope.editEmployeeAccountId;
            employeeAccountService.getEmployeeAccountById(eaccountId).then(function (response) {
                $scope.eaccount = response.data;
                $scope.eaccount.DisburseDate = $scope.eaccount.DisburseDate !== null ? new Date($scope.eaccount.DisburseDate) : null;
                $scope.eaccount.OpeningDate = $scope.eaccount.OpeningDate !== null ? new Date($scope.eaccount.OpeningDate) : null;
                $scope.eaccount.ClosingDate = $scope.eaccount.ClosingDate !== null ? new Date($scope.eaccount.ClosingDate) : null;
                $scope.eaccount.ReceiveDate = $scope.eaccount.ReceiveDate !== null ? new Date($scope.eaccount.ReceiveDate) : null;
                // $scope.eaccount.EmployeeName = angular.copy($scope.eaccount.EmployeeName).concat("(", $scope.eaccount.EmployeeId, ")");

                var selectedDate = $scope.eaccount.DisburseDate !== null ? $scope.eaccount.DisburseDate : $scope.eaccount.OpeningDate;
                var daySpan = moment($rootScope.workingdate).diff(moment(selectedDate), 'days');

                if (($rootScope.user.Role === '3' && daySpan > 0) || ($rootScope.user.Role === '5' && daySpan > 90)) $scope.roleWiseDiabledGeneralField = true;

                $("#loadingImage").css("display", "none");
                $scope.GetFilters();
                console.log($scope.eaccount);
            });
        }

        $scope.getAccoutTypeById = function () {
            employeeService.getAccountTypeById($scope.eaccount.AccountTypeId).then(function (response) {
                $scope.selectedAccountType = response.data;
                $scope.mapAccountTypeDuration();
                if ($scope.selectedAccountType.Category === 1) $scope.eaccount.Disbursed = $scope.eaccount.PrincipalAmount + $scope.eaccount.ServiceCharge;
                if (((($scope.selectedAccountType.Category !== 1) || ($scope.selectedAccountType.Category !== 5)) && $scope.eaccount.SalaryStructureId!==null) && ($scope.eaccount.OpeningDate === null || $scope.eaccount.OpeningDate === undefined)) $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
                if (((($scope.selectedAccountType.Category === 1) || ($scope.selectedAccountType.Category === 5)) && $scope.eaccount.SalaryStructureId === null) && ($scope.eaccount.DisburseDate === null || $scope.eaccount.DisburseDate === undefined)) $scope.eaccount.DisburseDate = new Date($rootScope.workingdate);
               
                $scope.setDefaultValues();
            });

        }
        $scope.setDefaultValues = function () {

            $scope.filters.Duration = $scope.selectedAccountType.Category === 1 ? $scope.selectedAccountType.DurationInMonth : $scope.filterDurationListCopy;
            //$scope.eaccount.ServiceChargeRate = $scope.selectedAccountType.Category === 1 ? $scope.selectedAccountType.InterestRate : undefined;
            //$scope.eaccount.AccountOpeningType = 2;
            //$scope.eaccount.Duration = $scope.selectedAccountType.Category !== 1 ? 12 : undefined;
            //$scope.eaccount.InstallmentType = 1;
            //$scope.eaccount.LifeCycle = $scope.selectedAccountType.Category === 1 ? 2 : $scope.selectedAccountType.Category === 3 ? 3 : 1;
            //$scope.eaccount.Status = 1;
            //$scope.eaccount.SubsidyAmount = 0;
            //$scope.eaccount.TotalInstallment = ($scope.selectedAccountType.Category !== 1 || $scope.selectedAccountType.Category !== 5) ? $scope.eaccount.Duration : undefined;

        }
        $scope.getEmployeeAccountCycleCount = function () {
            $("#loadingImage").css("display", "block");
            employeeAccountService.getEmployeeAccountCycleCount($scope.eaccount.EmployeeId, $scope.eaccount.AccountTypeId).then(function (response) {
                $scope.eaccount.Cycle = response.data;
                $("#loadingImage").css("display", "none");
            });
        }
        $scope.clearCalculatedData = function () {
            //$scope.eaccount.ServiceCharge = undefined;
            //$scope.eaccount.Disbursed = undefined;
            //$scope.eaccount.TotalInstallment = undefined;
            //$scope.eaccount.InstallmentAmount = undefined;

        }

        $scope.mapAccountTypeDuration = function () {
            $scope.selectedAccountType.DurationInMonth =
            angular.copy($scope.selectedAccountType.DurationInMonth.split(',').map(function (e) { return { Name: e, Value: parseInt(e) } }));
        }
        $scope.init = function () {
            $scope.getEmployeeAccountById();
            
        }

        $scope.clearTypeChangeData = function () {
            $scope.eaccount.InstallmentAmount = undefined;
            $scope.eaccount.SubsidyAmount = undefined;
            $scope.eaccount.PrincipalAmount = undefined;
            $scope.eaccount.ServiceChargeRate = undefined;
            $scope.eaccount.ServiceCharge = undefined;
            $scope.eaccount.Disbursed = undefined;

        }
        $scope.calculateOtherValue = function () {
            if ($scope.eaccount.SalaryStructureId !== null)return;
            if ($scope.eaccount.Duration === undefined || $scope.eaccount.Duration === null) return;
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
        $scope.validateSubsidy = function () {
            if ($scope.eaccount.PrincipalAmount !== undefined && $scope.eaccount.PrincipalAmount !== null && $scope.eaccount.SubsidyAmount !== undefined && $scope.eaccount.SubsidyAmount !== null && $scope.eaccount.SubsidyAmount > $scope.eaccount.PrincipalAmount) {
                swal("subsidy amount can not be greater than principal amount!");
                $scope.eaccount.SubsidyAmount = 0;
                // $scope.clearCalculatedData();
                $scope.calculateOtherValue();
                return;
            }
        }

        $scope.clearAndCloseTab = function () {
            $scope.eaccount = {};
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };




        $scope.editEmployeeAccount = function () {
            if ($scope.eaccount.Status === 2 && ($scope.eaccount.ClosingDate === null || $scope.eaccount.ClosingDate === undefined)) {
                swal("please select a closing date for inacivated account!");
                return;
            }

            if ((($scope.selectedAccountType.Category === 1 || $scope.selectedAccountType.Category === 5) && $scope.eaccount.SalaryStructureId===null) && ($scope.eaccount.DisburseDate === null || $scope.eaccount.DisburseDate === undefined)) {
                swal('please select a disburse date!');
                return;
            }
            if ((($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5) && $scope.eaccount.SalaryStructureId !== null) && ($scope.eaccount.OpeningDate === null || $scope.eaccount.OpeningDate === undefined)) {
                swal('please select an opening date!');
                return;
            }
            if ($rootScope.command == 'Close') {
                swal({
                    title: "confirm?",
                    text: $rootScope.showMessage($rootScope.closeConfirmation, $rootScope.employeeAccount),
                    showCancelButton: true,
                    confirmButtonText: "yes,Close it!",
                    cancelButtonText: "No,Cancel!",
                    type: 'info',
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                }, function(isConfirmed) {
                    if (isConfirmed) {
                        // $scope.eaccount.OpeningDate = (($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5) && $scope.eaccount.SalaryStructureId !== null) ? moment($scope.eaccount.OpeningDate).format() : undefined;
                        //  $scope.eaccount.DisburseDate = (($scope.selectedAccountType.Category === 1 || $scope.selectedAccountType.Category === 5) && $scope.eaccount.SalaryStructureId===null) ? moment($scope.eaccount.DisburseDate).format() : undefined;
                        $scope.eaccount.ClosingDate = ($scope.eaccount.ClosingDate !== null || $scope.eaccount.ClosingDate !== undefined) ? moment($scope.eaccount.ClosingDate).format() : undefined;
                        $scope.eaccount.OpeningDate = ($scope.eaccount.OpeningDate !== null || $scope.eaccount.OpeningDate !== undefined) ? moment($scope.eaccount.OpeningDate).format() : undefined;
                        $scope.eaccount.DisburseDate = ($scope.eaccount.DisburseDate !== null || $scope.eaccount.DisburseDate !== undefined) ? moment($scope.eaccount.DisburseDate).format() : undefined;
                        $scope.eaccount.ClosingDate = $scope.eaccount.Status === 1 ? null : $scope.eaccount.ClosingDate;
                        $scope.eaccount.Type = $scope.selectedAccountType.Type;

                        $scope.eaccount.UpdatedOn = moment($rootScope.workingdate).format();
                        $scope.eaccount.CreatedBy = $rootScope.user.Role;

                        employeeAccountService.editEmployeeAccount($scope.eaccount).then(function(response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('employeeAccount-edit-finished');
                                swal({
                                        title: "Successfull!",
                                        text: $rootScope.showMessage($rootScope.closeSuccess, $rootScope.employeeAccount),
                                        type: "success",
                                        showCancelButton: false,
                                        confirmButtonColor: "#008000",
                                        confirmButtonText: "OK",
                                        //cancelButtonText: "Close and Exit",
                                        closeOnConfirm: true,
                                        closeOnCancel: true
                                    },
                                    function(isConfirmed) {
                                        if (isConfirmed) {

                                            $timeout(function() { $scope.clearAndCloseTab(); }, 300);
                                        } else {
                                            $timeout(function() { $scope.clearAndCloseTab(); }, 300);
                                        }
                                    });
                            } else {
                                swal($rootScope.showMessage($rootScope.closeError, $rootScope.employeeAccount), response.data.Message, "error");
                            }
                        });
                    }
                });
            } else {
                swal({
                    title: "confirm?",
                    text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.employeeAccount),
                    showCancelButton: true,
                    confirmButtonText: "yes,Edit it!",
                    cancelButtonText: "No,Cancel!",
                    type: 'info',
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                }, function (isConfirmed) {
                    if (isConfirmed) {
                        // $scope.eaccount.OpeningDate = (($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5) && $scope.eaccount.SalaryStructureId !== null) ? moment($scope.eaccount.OpeningDate).format() : undefined;
                        //  $scope.eaccount.DisburseDate = (($scope.selectedAccountType.Category === 1 || $scope.selectedAccountType.Category === 5) && $scope.eaccount.SalaryStructureId===null) ? moment($scope.eaccount.DisburseDate).format() : undefined;
                        $scope.eaccount.ClosingDate = ($scope.eaccount.ClosingDate !== null || $scope.eaccount.ClosingDate !== undefined) ? moment($scope.eaccount.ClosingDate).format() : undefined;
                        $scope.eaccount.OpeningDate = ($scope.eaccount.OpeningDate !== null || $scope.eaccount.OpeningDate !== undefined) ? moment($scope.eaccount.OpeningDate).format() : undefined;
                        $scope.eaccount.DisburseDate = ($scope.eaccount.DisburseDate !== null || $scope.eaccount.DisburseDate !== undefined) ? moment($scope.eaccount.DisburseDate).format() : undefined;
                        $scope.eaccount.ClosingDate = $scope.eaccount.Status === 1 ? null : $scope.eaccount.ClosingDate;
                        $scope.eaccount.Type = $scope.selectedAccountType.Type;

                        $scope.eaccount.UpdatedOn = moment($rootScope.workingdate).format();
                        $scope.eaccount.CreatedBy = $rootScope.user.Role;

                        employeeAccountService.editEmployeeAccount($scope.eaccount).then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('employeeAccount-edit-finished');
                                swal({
                                    title: "Successfull!",
                                    text: $rootScope.showMessage($rootScope.editSuccess, $rootScope.employeeAccount),
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonColor: "#008000",
                                    confirmButtonText: "OK",
                                    //cancelButtonText: "Close and Exit",
                                    closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                    function (isConfirmed) {
                                        if (isConfirmed) {

                                            $timeout(function () { $scope.clearAndCloseTab(); }, 300);
                                        } else {
                                            $timeout(function () { $scope.clearAndCloseTab(); }, 300);
                                        }
                                    });
                            } else {
                                swal($rootScope.showMessage($rootScope.editError, $rootScope.employeeAccount), response.data.Message, "error");
                            }
                        });
                    }
                });
            }
            
        }

        $scope.providentFundLoanServiceChargeStepper = function () {
            if ($scope.eaccount.AccountTypeId !== 5) return;
            if ($scope.eaccount.Duration === undefined || $scope.eaccount.Duration === null) return;
            var yearCount = Math.floor($scope.eaccount.Duration / 12);
            if (yearCount === 0) {
                $scope.eaccount.ServiceChargeRate = $scope.selectedAccountType.Category === 1 ? $scope.selectedAccountType.InterestRate : undefined;; return;
            }
            $scope.eaccount.ServiceChargeRate = $scope.selectedAccountType.InterestRate + ((yearCount - 1) * 5);

        }
        $scope.setClosingDate=function() {
            if ($scope.eaccount.Status === 2) $scope.eaccount.ClosingDate = new Date($rootScope.workingdate);
            else {
                $scope.eaccount.ClosingDate = null;
            }
        }

        $scope.init();
        //new date picker 
        $scope.today = function () {
            $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
            $scope.eaccount.DisburseDate = new Date($rootScope.workingdate);
            $scope.eaccount.ClosingDate = new Date($rootScope.workingdate);
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
            return (mode === 'day' && (date.getDay() === 5));
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
        $scope.openCpop = function () {
            $scope.closingPop.opened = true;
        };

        //$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.openingpPop = {
            opened: false
        };

        $scope.disbursePop = {
            opened: false
        };
        $scope.closingPop = {
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
                maxDate = moment($rootScope.workingdate).valueOf();
               // maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).valueOf();
               // minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            }
                //else if ($scope.roleId == $rootScope.rootLevel.RM) {
                //    maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                //    minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
                //}
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin || $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }
            

            if (($scope.selectedAccountType.Category === 1 || $scope.selectedAccountType.Category === 5)) {

                if (moment($scope.eaccount.DisburseDate) > moment(new Date($rootScope.workingdate) + 1)) {
                    swal("unable to select future date!");
                    $scope.eaccount.DisburseDate = new Date($rootScope.workingdate);
                    return;
                }

                if ((moment($scope.eaccount.DisburseDate).valueOf() >  moment(maxDate).valueOf() || moment($scope.eaccount.DisburseDate).valueOf() < moment(minDate).valueOf())) {
                    swal("please select valid date!");
                    $scope.eaccount.DisburseDate = new Date($rootScope.workingdate);
                    return;
                }
                if (moment($scope.eaccount.DisburseDate).valueOf() > moment($scope.eaccount.ClosingDate).valueOf()) {
                    swal("disburse date cant be greater than closing date!");
                    $scope.eaccount.DisburseDate = new Date($rootScope.workingdate);
                    return;
                }
            }
            if (($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5)) {
                if (moment($scope.eaccount.OpeningDate) > moment(new Date($rootScope.workingdate) + 1)) {
                    swal("unable to select future date!");
                    $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
                    return;
                }

                if ((moment($scope.eaccount.OpeningDate).valueOf() > moment(maxDate).valueOf() || moment($scope.eaccount.OpeningDate).valueOf() < moment(minDate).valueOf())) {
                    swal("please select valid date!");
                    $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
                    return;
                }
                if (moment($scope.eaccount.OpeningDate).valueOf() > moment($scope.eaccount.ClosingDate).valueOf()) {
                    swal("opening date cant be greater than closing date!");
                    $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
                    return;
                }
            }
            
        }

        $scope.clsValidator = function () {

            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM || $scope.roleId == $rootScope.rootLevel.BM) {
                maxDate = moment($rootScope.workingdate).valueOf();
                // maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).valueOf();
                // minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            }
                //else if ($scope.roleId == $rootScope.rootLevel.RM) {
                //    maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                //    minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
                //}
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin || $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }
            if (moment($scope.eaccount.ClosingDate) > moment(new Date($rootScope.workingdate) + 1)) {
                swal("unable to select future date!");
                $scope.eaccount.ClosingDate = new Date($rootScope.workingdate);
                return;
            }
            if ((moment($scope.eaccount.DisburseDate).valueOf() > moment(maxDate).valueOf() || moment($scope.eaccount.DisburseDate).valueOf() < moment(minDate).valueOf())) {
                swal("please select valid date or check user privilege!");
                $scope.eaccount.ClosingDate = new Date($rootScope.workingdate);
                return;
            }

            if (($scope.selectedAccountType.Category === 1 || $scope.selectedAccountType.Category === 5)) {
                if (moment($scope.eaccount.DisburseDate).valueOf() > moment($scope.eaccount.ClosingDate).valueOf()) {
                    swal("closing date cant be less than disburse date!");
                    $scope.eaccount.ClosingDate = new Date($rootScope.workingdate);
                    return;
                }
            }
            if (($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5)) {
                if (moment($scope.eaccount.OpeningDate).valueOf() > moment($scope.eaccount.ClosingDate).valueOf()) {
                    swal("closing date cant be less than opening date!");
                    $scope.eaccount.ClosingDate = new Date($rootScope.workingdate);
                    return;
                }
            }

        }

    }
]);