ammsAng.controller('paySalaryAddController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'workingDayService', 'commonService', 'employeeBankAccountService', 'salaryStructureService', 'hrmTransactionService', 'employeeService', 'paySalaryService',
    function ($scope, $rootScope, $timeout, $q, filterService, workingDayService, commonService, employeeBankAccountService, salaryStructureService, hrmTransactionService, employeeService, paySalaryService) {
        $scope.isDirty = false;
        $scope.filters = {};
        $scope.paySalaryToAdd = {};
        $scope.paySalaryToAdd.CreatedBy = $rootScope.user.EmployeeId;
        console.log($rootScope.workingdate);
        $scope.paySalaryToAdd.ModifiedBy = $rootScope.user.EmployeeId;
        $scope.paySalaryToAdd.TransactionCreatedFrom = 65;
        $scope.paySalaryToAdd.Location = 63;
        $scope.paySalaryToAdd.TransactionProcess = 1;
        console.log($rootScope.user.Role, $rootScope.selectedBranchId);
        $scope.roleId = $rootScope.user.Role;
        $scope.tab.ConfirmPrompt = true;


        $scope.getAllFilters = function () {
            paySalaryService.getRoleWiseBranchInfo($rootScope.user.Role, $rootScope.user.EmployeeId).then(function (filterdata) {
                console.log(filterdata.data);
                $scope.filters.Branches = filterdata.data.branches;
                //getEmployerBankAccountFilters

            });
        };

        $scope.getYearMonthDate = function () {
            paySalaryService.getAllFilters().then(function (filterdata) {
                console.log(filterdata.data);
                $scope.filters.Years = filterdata.data.year;
                $scope.filters.Months = filterdata.data.month;
                $scope.filters.Dates = filterdata.data.date;
                $scope.filters.TransactionProcessFilter = filterdata.data.transactionProcessFilter;
            });
        };

        $scope.DateToInt = function (date) {
            //var dateString = dateToInt.toString();
            //var year = dateString.length >= 4 ? parseInt(dateString.substring(0, 4)) < 1901 ? 1901 : parseInt(dateString.substring(0, 4)) : 1901;
            //var month = dateString.length >= 6 ? parseInt(dateString.substring(4, 6)) < 1 ? 1 : parseInt(dateString.substring(4, 6)) : 1;
            //var day = dateString.length >= 8 ? parseInt(dateString.substring(6, 8)) < 1 ? 1 : parseInt(dateString.substring(6, 8)) : 1;
            //var date = year.toString().concat(month.toString());
            //date = date.concat(day.toString());
            //date = date.concat('000000');
            //var tDate = parseInt(date);
            //return tDate;
            var dateInDate = new Date(date);
            var day = dateInDate.getDate();
            var month = dateInDate.getMonth() + 1;
            var year = dateInDate.getFullYear();
            if (day.toString().length === 1) {
                day = '0' + day;
            }
            if (month.toString().length === 1) {
                month = '0' + month;
            }
            var dateInInt = year.toString().concat(month.toString());
            dateInInt = dateInInt.concat(day.toString());
            dateInInt = dateInInt.concat('000000');
            var intDate = parseInt(dateInInt);
            return intDate;
        }


        $scope.onBranchChange = function (branchId) {
            commonService.getEmployeeFilterFromSP(branchId, $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                $scope.filters.Employees = response.data;
                console.log(response.data);
                paySalaryService.getEmployerBankAccountFilters(branchId).then(function (response) {
                    $scope.filters.EmployerBankAccount = response.data.accounts;
                });

            });

        }
        $scope.onEmployeeChange = function (transactionDate, employeeId, year, month, date) {
            paySalaryService.getBankFilters(employeeId).then(function (filterdata) {
                console.log(filterdata.data.bankNames);
                //var bank = filterdata.data.bankNames;
                //console.log(bank);
                //if (filterdata.data.bankNames === undefined) {
                //    swal("Employee Doesn't have any Bank Account. Please Add Bank Account For Selected employee.");
                //} else {
                $scope.filters.Banks = filterdata.data.bankNames;
                $scope.filters.AccountNumbers = filterdata.data.accounts;
                //}
                    if ((year != null || year !=undefined) && (month != null || month!= undefined) && (date != null || year != undefined)) {
                        $scope.loadSalaryInformation(transactionDate, employeeId, year, month, date);
                    }
                
            });
        }

        $scope.paySalaryToAdd.allowanceAccounts = [];
        $scope.paySalaryToAdd.deductionAccounts = [];

        $scope.loadSalaryInformation = function (transactionDate, employeeId, year, month, date) {
            var day = date.getDate();
            if (day != null && employeeId != null && year != null && month != null) {
                paySalaryService.getEmployeeSalaryStructureInfo($scope.paySalaryToAdd.TransactionDateTime, employeeId, year, month, day).then(function (salaryStructureData) {
                    console.log(salaryStructureData);
                    if (salaryStructureData.data.length > 0 && salaryStructureData.data[0].Status === 1) {
                        $scope.paySalaryToAdd.allowanceAccounts = angular.copy(salaryStructureData.data.filter(v => v.Type === 1 || v.Type === 3));
                        $scope.paySalaryToAdd.deductionAccounts = angular.copy(salaryStructureData.data.filter(v => v.Type === 2 || v.Type === 3 || v.Type === 16 || v.Type === 4 || v.Type === 5));


                    } else {
                        $scope.paySalaryToAdd.allowanceAccounts = angular.copy(salaryStructureData.data.filter(v => v.Type === 1 || v.Type === 3));
                        $scope.paySalaryToAdd.deductionAccounts = angular.copy(salaryStructureData.data.filter(v => v.Type === 2 || v.Type === 3 || v.Type === 16 || v.Type === 4 || v.Type === 5));

                        if ($scope.paySalaryToAdd.allowanceAccounts.length === 0 && $scope.paySalaryToAdd.deductionAccounts.length === 0) {
                            swal("Employee doesn't have any active salary structure or doesn't have any transaction in selected month.");
                        }

                    }

                    var allowanceAccounts = $scope.paySalaryToAdd.allowanceAccounts;
                    var deductionAccounts = $scope.paySalaryToAdd.deductionAccounts;
                    var i = 0;
                    if (allowanceAccounts[0].Status === 2) {
                        var process = allowanceAccounts[0].EmployeeId;
                        if (process !== 1) {
                            process = 2;
                            $scope.paySalaryToAdd.EmployerBankAccount = parseInt(allowanceAccounts[0].UpdatedBy);

                            //$scope.paySalaryToAdd.BankName = 
                            $scope.paySalaryToAdd.TransactionProcess = process;
                        } else {
                            $scope.paySalaryToAdd.TransactionProcess = process;
                        }

                    } else {
                        $scope.paySalaryToAdd.TransactionProcess = 1;
                    }

                    for (i; i < deductionAccounts.length; i++) {
                        var cheque = deductionAccounts[i].ChequeNo;


                        if ($scope.paySalaryToAdd.ChequeNo == null && $scope.paySalaryToAdd.EmployerBankAccount == null) {
                            $scope.paySalaryToAdd.ChequeNo = cheque;
                            $scope.paySalaryToAdd.EmployerBankAccount = parseInt(deductionAccounts[i].UpdatedBy);
                        }
                        if (deductionAccounts[0].Status === 1) {
                            if (deductionAccounts[i].SalaryStructureId === null || deductionAccounts[i].SalaryStructureId === 0) {
                                if (deductionAccounts[i].InstallmentAmount < deductionAccounts[i].OutstandingAmount) {
                                    deductionAccounts[i].PrincipalAmount = deductionAccounts[i].InstallmentAmount;
                                } else {
                                    deductionAccounts[i].PrincipalAmount = deductionAccounts[i].OutstandingAmount;
                                }
                                //(deductionAccounts[i].PrincipalAmount = deductionAccounts[i].ServiceCharge) / deductionAccounts[i].Duration;
                            }
                        }

                        // New Added 21/8/2017

                        if (deductionAccounts[0].Status === 2) {
                            if (deductionAccounts[i].SalaryStructureId === null || deductionAccounts[i].SalaryStructureId === 0) {
                                if (deductionAccounts[i].InstallmentAmount < deductionAccounts[i].OutstandingAmount) {
                                    deductionAccounts[i].PrincipalAmount = deductionAccounts[i].InstallmentAmount;
                                } else {
                                    deductionAccounts[i].PrincipalAmount = deductionAccounts[i].OutstandingAmount;
                                }
                                //(deductionAccounts[i].PrincipalAmount = deductionAccounts[i].ServiceCharge) / deductionAccounts[i].Duration;
                            }
                        }


                    }
                    $scope.paySalaryToAdd.deductionAccounts = deductionAccounts;


                    var j = 0;
                    var bankAccount = allowanceAccounts[0].BankAccount;
                    if (bankAccount != null && bankAccount !== 0) {
                        // $scope.paySalaryToAdd.BankName = bankAccount;
                        paySalaryService.getEmployeeBankAccountById(bankAccount).then(function (response) {
                            $scope.paySalaryToAdd.BankAccount = bankAccount;
                            $scope.paySalaryToAdd.BankName = parseInt(response.data.BankName);
                        });
                    }
                    for (j; j < allowanceAccounts.length; j++) {
                        var chequeNo = allowanceAccounts[j].ChequeNo;

                        if ($scope.paySalaryToAdd.ChequeNo == null && $scope.paySalaryToAdd.EmployerBankAccount == null && chequeNo != null) {
                            $scope.paySalaryToAdd.ChequeNo = chequeNo;
                            //if (bankAccount != null && bankAccount !== 0) {
                            //    $scope.paySalaryToAdd.BankName = bankAccount;
                            //    paySalaryService.getEmployeeBankAccountById(bankAccount).then(function (data) {
                            //        $scope.paySalaryToAdd.BankAccountNumber = data;

                            //    });
                            //}


                            $scope.paySalaryToAdd.EmployerBankAccount = parseInt(allowanceAccounts[j].UpdatedBy);
                        }
                        if (chequeNo != null && chequeNo != "") {
                            $scope.paySalaryToAdd.ChequeNo = chequeNo;
                            //$scope.paySalaryToAdd.EmployerBankAccount = parseInt(allowanceAccounts[j].UpdatedBy);
                        }
                        if (allowanceAccounts[j].UpdatedBy != null) {
                            //$scope.paySalaryToAdd.ChequeNo = chequeNo;
                            //$scope.paySalaryToAdd.EmployerBankAccount = parseInt(allowanceAccounts[j].UpdatedBy);
                        }


                        if (allowanceAccounts[0].Staus == 2) {
                            if (allowanceAccounts[j].SalaryStructureId === null || allowanceAccounts[j].SalaryStructureId === 0) {
                                allowanceAccounts[j].PrincipalAmount = allowanceAccounts[j].InstallmentAmount; //(deductionAccounts[i].PrincipalAmount = deductionAccounts[i].ServiceCharge) / deductionAccounts[i].Duration;

                            }
                        }


                    }
                    $scope.paySalaryToAdd.allowanceAccounts = allowanceAccounts;
                    if ($scope.paySalaryToAdd.allowanceAccounts.length > 0 && $scope.paySalaryToAdd.allowanceAccounts[0].Status === 2) {
                        var year = $scope.paySalaryToAdd.SalaryYear;
                        var month = $scope.paySalaryToAdd.SalaryMonth;

                        var day = $scope.paySalaryToAdd.Date;
                        day = day.getDate();
                        if (day.toString().length === 1) {
                            day = '0' + day;
                        }
                        if (month.toString().length === 1) {
                            month = '0' + month;
                        }
                        var dateInInt = year.toString().concat(month.toString());
                        dateInInt = dateInInt.concat(day.toString());
                        dateInInt = dateInInt.concat('000000');
                        var intDate = parseInt(dateInInt);

                        // $scope.getTotalPaidAllowance = function () {
                        var allowanceTotal = 0;
                        for (var k = 0; k < $scope.paySalaryToAdd.allowanceAccounts.length; k++) {
                            var account = $scope.paySalaryToAdd.allowanceAccounts[k];
                            allowanceTotal += account.PrincipalAmount;
                        }
                        if ($scope.DateToInt(new Date($scope.paySalaryToAdd.allowanceAccounts[0].ClosingDate)) === intDate) {
                            $scope.PaidAllowanceTotal = allowanceTotal;
                        } else {
                            $scope.PaidAllowanceTotal = 0;
                        }

                        // }
                        //$scope.getTotalPaidDeduction = function () {
                        var deductionTotal = 0;
                        for (var a = 0; a < $scope.paySalaryToAdd.deductionAccounts.length; a++) {
                            var accountA = $scope.paySalaryToAdd.deductionAccounts[a];
                            deductionTotal += accountA.PrincipalAmount;
                            deductionTotal += accountA.ServiceCharge;
                        }
                        if ($scope.DateToInt(new Date($scope.paySalaryToAdd.allowanceAccounts[0].ClosingDate)) === intDate) {
                            $scope.DeductedTotal = deductionTotal;
                        } else {
                            $scope.DeductedTotal = 0;
                        }
                        // }
                        //$scope.netPaidPayableSalary = function () {
                        var netPayable = $scope.PaidAllowanceTotal - $scope.DeductedTotal;
                        $scope.NetPaid = netPayable;
                        // }
                    } else {
                        $scope.PaidAllowanceTotal = 0;
                        $scope.DeductedTotal = 0;
                        $scope.NetPaid = 0;
                    }

                });
            } else {
                swal("Please select Employee year,Month, date correctly.");
            }

        }
        //$scope.onDateChange = function (transactionDate, employeeId, year, month, day) {
        //    //$scope.paySalaryToAdd.SalaryYear = year;
        //    //$scope.paySalaryToAdd.SalaryMonth = month;
        //    //$scope.paySalaryToAdd = day;
        //    //var dateInInt = year.toString().concat(month.toString());
        //    //dateInInt = dateInInt.concat(day.toString());
        //    //dateInInt = dateInInt.concat('000000');
        //    //var intDate = parseInt(dateInInt);
        //    ////$scope.paySalaryToAdd.TransactionDate = moment(intDate.toString().slice(0, 8)).format('DD-MM-YYYY');
        //    //var aDate = moment(intDate.toString().slice(0, 8)).format('DD-MM-YYYY');
        //    //var tDate = aDate.toString();
        //    //$scope.paySalaryToAdd.TransactionDate = new Date(tDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
        //    //var tDate = aDate.toString();

        //    paySalaryService.getEmployeeSalaryStructureInfo($scope.paySalaryToAdd.TransactionDateTime, employeeId, year, month, day).then(function (salaryStructureData) {
        //        console.log(salaryStructureData);
        //        if (salaryStructureData.data.length>0 && salaryStructureData.data[0].Status === 1) {
        //            $scope.paySalaryToAdd.allowanceAccounts = angular.copy(salaryStructureData.data.filter(v => v.Type === 1 || v.Type === 3));
        //            $scope.paySalaryToAdd.deductionAccounts = angular.copy(salaryStructureData.data.filter(v => v.Type === 2 || v.Type === 3 || v.Type === 16 || v.Type === 4));
        //        } else {
        //            $scope.paySalaryToAdd.allowanceAccounts = angular.copy(salaryStructureData.data.filter(v => v.Type === 1 || v.Type === 3));
        //            $scope.paySalaryToAdd.deductionAccounts = angular.copy(salaryStructureData.data.filter(v => v.Type === 2 || v.Type === 3 || v.Type === 16 || v.Type === 4));
        //        }




        //        var deductionAccounts = $scope.paySalaryToAdd.deductionAccounts;
        //        var i = 0;
        //        if (deductionAccounts[0].Status === 2) {
        //            var process = deductionAccounts[0].EmployeeId;
        //            if (process !== 1) {
        //                process = 2;
        //            }
        //            $scope.paySalaryToAdd.TransactionProcess = process;
        //        } else {
        //            $scope.paySalaryToAdd.TransactionProcess = 1;
        //        }

        //        for (i; i < deductionAccounts.length; i++) {
        //            var cheque = deductionAccounts[i].ChequeNo;


        //            if ($scope.paySalaryToAdd.ChequeNo == null && $scope.paySalaryToAdd.EmployerBankAccount == null) {
        //                $scope.paySalaryToAdd.ChequeNo = cheque;
        //                $scope.paySalaryToAdd.EmployerBankAccount = deductionAccounts[i].UpdatedBy;
        //            }
        //            if (deductionAccounts[0].Status === 1) {
        //                if (deductionAccounts[i].SalaryStructureId === null || deductionAccounts[i].SalaryStructureId === 0) {
        //                    if (deductionAccounts[i].InstallmentAmount<deductionAccounts[i].OutstandingAmount) {
        //                        deductionAccounts[i].PrincipalAmount = deductionAccounts[i].InstallmentAmount; 
        //                    } else {
        //                        deductionAccounts[i].PrincipalAmount = deductionAccounts[i].OutstandingAmount;
        //                    }
        //                    //(deductionAccounts[i].PrincipalAmount = deductionAccounts[i].ServiceCharge) / deductionAccounts[i].Duration;
        //                }
        //            }


        //        }
        //        $scope.paySalaryToAdd.deductionAccounts = deductionAccounts;

        //        var allowanceAccounts = $scope.paySalaryToAdd.allowanceAccounts;
        //        var j = 0;
        //        for (j; j < allowanceAccounts.length; j++) {
        //            var chequeNo = allowanceAccounts[j].ChequeNo;
        //            if ($scope.paySalaryToAdd.ChequeNo == null && $scope.paySalaryToAdd.EmployerBankAccount == null) {
        //                $scope.paySalaryToAdd.ChequeNo = chequeNo;
        //                $scope.paySalaryToAdd.EmployerBankAccount = parseInt(allowanceAccounts[j].UpdatedBy);
        //            }
        //            $scope.paySalaryToAdd.ChequeNo = chequeNo;
        //            $scope.paySalaryToAdd.EmployerBankAccount = parseInt(allowanceAccounts[j].UpdatedBy);
        //            if (allowanceAccounts[0].Staus === 2) {
        //                if (allowanceAccounts[j].SalaryStructureId === null || allowanceAccounts[j].SalaryStructureId === 0) {
        //                    allowanceAccounts[j].PrincipalAmount = allowanceAccounts[j].InstallmentAmount; //(deductionAccounts[i].PrincipalAmount = deductionAccounts[i].ServiceCharge) / deductionAccounts[i].Duration;

        //                }
        //            }


        //        }
        //        $scope.paySalaryToAdd.allowanceAccounts = allowanceAccounts;
        //        if ($scope.paySalaryToAdd.allowanceAccounts.length>0 && $scope.paySalaryToAdd.allowanceAccounts[0].Status === 2) {
        //            var year = $scope.paySalaryToAdd.SalaryYear;
        //            var month = $scope.paySalaryToAdd.SalaryMonth;

        //            var day = $scope.paySalaryToAdd.Date;
        //            if (day.toString().length === 1) {
        //                day = '0' + day;
        //            }
        //            if (month.toString().length === 1) {
        //                month = '0' + month;
        //            }
        //            var dateInInt = year.toString().concat(month.toString());
        //            dateInInt = dateInInt.concat(day.toString());
        //            dateInInt = dateInInt.concat('000000');
        //            var intDate = parseInt(dateInInt);

        //           // $scope.getTotalPaidAllowance = function () {
        //                var allowanceTotal = 0;
        //                for (var k = 0; k < $scope.paySalaryToAdd.allowanceAccounts.length; k++) {
        //                    var account = $scope.paySalaryToAdd.allowanceAccounts[k];
        //                    allowanceTotal += account.PrincipalAmount;
        //                }
        //                if ($scope.paySalaryToAdd.allowanceAccounts[0].TransactionDate === intDate) {
        //                    $scope.PaidAllowanceTotal = allowanceTotal;
        //                } else {
        //                    $scope.PaidAllowanceTotal = 0;
        //                }

        //           // }
        //            //$scope.getTotalPaidDeduction = function () {
        //                var deductionTotal = 0;
        //                for (var a = 0; a < $scope.paySalaryToAdd.deductionAccounts.length; a++) {
        //                    var accountA = $scope.paySalaryToAdd.deductionAccounts[a];
        //                    deductionTotal += accountA.PrincipalAmount;
        //                }
        //                if ($scope.DateToInt(new Date($scope.paySalaryToAdd.allowanceAccounts[0].ClosingDate)) === intDate) {
        //                $scope.DeductedTotal = deductionTotal;
        //            } else {
        //                $scope.DeductedTotal = 0;
        //            }
        //            // }
        //            //$scope.netPaidPayableSalary = function () {
        //                var netPayable = $scope.PaidAllowanceTotal = allowanceTotal - $scope.DeductedTotal;
        //                $scope.NetPaid = netPayable;
        //           // }
        //        }
        //    });

        //}



















        //var deductionAccounts = $scope.paySalaryToAdd.deductionAccounts;
        //var i = 0;
        //for (i; i < deductionAccounts.length; i++) {
        //    var cheque = deductionAccounts[i].ChequeNo;
        //    if (paySalaryToAdd.ChequeNo == null && paySalaryToAdd.EmployerBankAccount == null) {
        //        paySalaryToAdd.ChequeNo = cheque;
        //        paySalaryToAdd.EmployerBankAccount = deductionAccounts[i].UpdatedBy;
        //    }

        //    if (deductionAccounts[i].SalaryStructureId === null || deductionAccounts[i].SalaryStructureId === 0) {
        //        deductionAccounts[i].PrincipalAmount = deductionAccounts[i].InstallmentAmount; //(deductionAccounts[i].PrincipalAmount = deductionAccounts[i].ServiceCharge) / deductionAccounts[i].Duration;
        //    }

        //}
        //$scope.paySalaryToAdd.deductionAccounts = deductionAccounts;

        //var allowanceAccounts = $scope.paySalaryToAdd.allowanceAccounts;
        //var j = 0;
        //for (j; j < allowanceAccounts.length; j++) {
        //    var chequeNo = allowanceAccounts[j].ChequeNo;
        //    if (paySalaryToAdd.ChequeNo == null && paySalaryToAdd.EmployerBankAccount == null) {
        //        paySalaryToAdd.ChequeNo = chequeNo;
        //        paySalaryToAdd.EmployerBankAccount = deductionAccounts[i].UpdatedBy;
        //    }
        //    paySalaryToAdd.ChequeNo = chequeNo;
        //    paySalaryToAdd.EmployerBankAccount = allowanceAccounts[j].UpdatedBy;
        //    if (allowanceAccounts[j].SalaryStructureId === null || allowanceAccounts[j].SalaryStructureId === 0) {
        //        allowanceAccounts[j].PrincipalAmount = allowanceAccounts[j].InstallmentAmount; //(deductionAccounts[i].PrincipalAmount = deductionAccounts[i].ServiceCharge) / deductionAccounts[i].Duration;

        //    }

        //}
        //$scope.paySalaryToAdd.allowanceAccounts = allowanceAccounts;

        //$scope.resetEndDate = function () {
        //    $scope.employeeBankAccountToAdd.EndDate = null;
        //}

        //$scope.checkStartDate = function () {
        //    if ($scope.paySalaryToAdd.Date > Date.now()) {
        //        swal("Start date can't be future date");
        //        return true;
        //    }
        //    return false;
        //}
        //$scope.$on('pay-salary-add-finished', function () {
        //    $scope.getEmployeeBankAccounts();
        //});
        //$scope.OfficeCode = $rootScope.selectedBranchId;
        //$scope.$watch('OfficeCode', function (obj) {
        //    $scope.employeeBankAccountToAdd.OfficeCode = obj;
        //}, true);


        //$scope.onEmployeeChange = function (employeeId) {
        //    employeeBankAccountService.getEmployeeOfficeCodeAndOfficeTypeByEmployeeId(employeeId).then(function (response) {
        //        $scope.employeeOfficeTypeAndCode = response.data;
        //    });
        //}

        //$scope.$watch('employeeOfficeTypeAndCode', function (obj) {

        //    $scope.employeeBankAccountToAdd.OfficeType = obj.OfficeType;
        //    $scope.employeeBankAccountToAdd.OfficeCode = obj.OfficeCode;
        //    console.log($scope.employeeBankAccountToAdd.OfficeType);
        //    console.log($scope.employeeBankAccountToAdd.OfficeType);
        //}, true);

        $scope.checkStartDate = function () {
            var date = $scope.createdDate;
            var newdate = date.split("-").reverse().join("-");
            var day = new Date(newdate);
            if ($scope.paySalaryToAdd.TransactionDate > day) {
                swal("Transaction date can't be future date");
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


        $scope.checkIfTotalSalaryIsLessThanZero = function () {
            if ($scope.netPayableSalary() < 0) {
                swal("Net payable salary cannot be negative amount.");
                return true;
            }
            return false;
        };


        $scope.checkIfInstallmentIsGreaterThanOutstanding = function (deductionAccount) {
            var accountTypeName = "";
            var loanAccount = deductionAccount.filter(function (account) {
                if (account.AccountTypeId == 1 || account.AccountTypeId == 2 || account.AccountTypeId == 3 || account.AccountTypeId == 4 || account.AccountTypeId == 5) {
                    return true;
                }
                return false;
            });

            //angular.forEach(loanAccount, function (value, key) {
            //    var flag = 0;
            //    if (value.PrincipalAmount > value.OutstandingAmount) {
            //        //swal("Amount Cannot be greater than outstanding for Loan Account.");
            //        //return true;
            //        flag = 1;
            //        tieBreaker;
            //    } else {
            //        flag = 0;
            //    }
            //});
            var flag = 0;
            for (var i = 0; i < Object.keys(loanAccount).length; i++) {


                if (loanAccount[i].PrincipalAmount > loanAccount[i].OutstandingAmount) {
                    flag = 1;
                    accountTypeName = loanAccount[i].AccountTypeName;
                    break;
                }
                flag = 0;
            }
            if (flag == 1) {
                var message = "Amount Cannot be greater than outstanding for ";
                var res = message.concat(accountTypeName);
                swal(res);
                return true;
            } return false;
        };



        $scope.checkIfEmployeeIsInTransferState = function (employeeId) {
            paySalaryService.getEmployeeTransferStatus(employeeId).then(function (response) {
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
                checkDay.setDate(checkDay.getDate() - 1);
                if ($scope.paySalaryToAdd.TransactionDate < checkDay) {
                    swal("You are not allowed to perform this transaction. Please contact with administrator.");
                    return true;
                }
                return false;
            }
            if ($rootScope.user.Role == 5) {
                checkDay.setDate(checkDay.getDate() - 90);
                if ($scope.paySalaryToAdd.TransactionDate < checkDay) {
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

        $scope.getTotalAllowance = function () {
            var allowanceTotal = 0;
            for (var i = 0; i < $scope.paySalaryToAdd.allowanceAccounts.length; i++) {
                var account = $scope.paySalaryToAdd.allowanceAccounts[i];
                allowanceTotal += account.PrincipalAmount;
            }
            return allowanceTotal;
        }
        $scope.getTotalDeduction = function () {
            var deductionTotal = 0;
            for (var i = 0; i < $scope.paySalaryToAdd.deductionAccounts.length; i++) {
                var account = $scope.paySalaryToAdd.deductionAccounts[i];
                deductionTotal += account.PrincipalAmount;
                deductionTotal += account.ServiceCharge;
            }

            //for (var k = 0; k < $scope.paySalaryToAdd.deductionAccounts.length; k++) {
            //    var penal = $scope.paySalaryToAdd.deductionAccounts[k];
            //    deductionTotal += penal.ServiceCharge;
            //}

            return deductionTotal;
        }
        $scope.netPayableSalary = function () {
            var netPayable = $scope.getTotalAllowance() - $scope.getTotalDeduction();
            return netPayable;
        }

        //$scope.check = function() {

        //}
        //$scope.removeTab();



        $scope.payEmployeeSalary = function () {
            //if ($scope.paySalaryToAdd.StartDate != null) {
            //    if ($scope.checkStartDate()) return;

            //}
            var year = $scope.paySalaryToAdd.SalaryYear;
            var month = $scope.paySalaryToAdd.SalaryMonth;

            var day = ($scope.paySalaryToAdd.Date).getDate();
            if (day.toString().length === 1) {
                day = '0' + day;
            }
            if (month.toString().length === 1) {
                month = '0' + month;
            }
            var dateInInt = year.toString().concat(month.toString());
            dateInInt = dateInInt.concat(day.toString());
            dateInInt = dateInInt.concat('000000');
            var intDate = parseInt(dateInInt);
            //$scope.paySalaryToAdd.TransactionDate = moment(intDate.toString().slice(0, 8)).format('DD-MM-YYYY');
            var aDate = commonService.intToDate(intDate);//moment(intDate.toString().slice(0, 8)).format('DD-MM-YYYY');
            var tDate = aDate.toString();
            $scope.paySalaryToAdd.TransactionDate = new Date(tDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
            if ($scope.paySalaryToAdd.TransactionDate != null) {
                if ($scope.checkStartDate()) return;
                if ($scope.checkPermission()) return;
            }
            if ($scope.checkIfEmployeeIsActive($scope.paySalaryToAdd.EmployeeId)) return;
            if ($scope.checkIfEmployeeIsInTransferState($scope.paySalaryToAdd.EmployeeId)) return;
            if ($scope.checkIfTotalSalaryIsLessThanZero()) return;
            if ($scope.paySalaryToAdd.allowanceAccounts[0].Status === 1) {
                if ($scope.checkIfInstallmentIsGreaterThanOutstanding($scope.paySalaryToAdd.deductionAccounts)) return;
            }
            //var tDate = aDate.toString();
            console.log($scope.paySalaryToAdd);


            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.employeePaySalary),
                showCancelButton: true,
                confirmButtonText: "Yes, Pay Salary!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {

                    //$scope.paySalaryToAdd.Date = moment($scope.paySalaryToAdd.Date).format();
                    //if ($scope.employeeBankAccountToAdd.EndDate != null) {

                    //    $scope.paySalaryToAdd.EndDate = moment($scope.paySalaryToAdd.EndDate).format();
                    //}
                    //var parts = $scope.paySalaryToAdd.TransactionDate.split('-');
                    //$scope.paySalaryToAdd.TransactionDate = new Date(parts[2], parts[1] - 1, parts[0]);

                    var transactionDate = $scope.paySalaryToAdd.TransactionDate.toString();
                    $scope.paySalaryToAdd.TransactionDate = new Date(transactionDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                    var allowanceAccounts = [];
                    var deductionAccounts = [];
                    allowanceAccounts = $scope.paySalaryToAdd.allowanceAccounts;
                    deductionAccounts = $scope.paySalaryToAdd.deductionAccounts;
                    var tDate;
                    var oDate;
                    var dDate;
                    var rDate;
                    var i;
                    for (i = 0; i < allowanceAccounts.length; i++) {
                        tDate = new Date(allowanceAccounts[i].ClosingDate);
                        allowanceAccounts[i].ClosingDate = $scope.DateToInt(tDate);
                        oDate = new Date(allowanceAccounts[i].OpeningDate);
                        allowanceAccounts[i].OpeningDate = $scope.DateToInt(oDate);
                        dDate = new Date(allowanceAccounts[i].DisburseDate);
                        allowanceAccounts[i].DisburseDate = $scope.DateToInt(dDate);
                        rDate = new Date(allowanceAccounts[i].ReceiveDate);
                        allowanceAccounts[i].ReceiveDate = $scope.DateToInt(rDate);

                    }
                    $scope.paySalaryToAdd.allowanceAccounts = allowanceAccounts;
                    for (i = 0; i < deductionAccounts.length; i++) {
                        tDate = new Date(deductionAccounts[i].ClosingDate);
                        deductionAccounts[i].ClosingDate = $scope.DateToInt(tDate);
                        oDate = new Date(deductionAccounts[i].OpeningDate);
                        deductionAccounts[i].OpeningDate = $scope.DateToInt(oDate);
                        dDate = new Date(deductionAccounts[i].DisburseDate);
                        deductionAccounts[i].DisburseDate = $scope.DateToInt(dDate);
                        rDate = new Date(deductionAccounts[i].ReceiveDate);
                        deductionAccounts[i].ReceiveDate = $scope.DateToInt(rDate);
                    }
                    $scope.paySalaryToAdd.deductionAccounts = deductionAccounts;

                    console.log(allowanceAccounts);
                    console.log(deductionAccounts);

                    console.log(allowanceAccounts);
                    console.log(deductionAccounts);
                    //new added.
                    if (allowanceAccounts.length === 0 && deductionAccounts.length === 0) {
                        swal("Salary,Allowance & Deduction cannot be Empty");
                    } else {
                        if (allowanceAccounts[0].Status === 1) {
                            // if ($scope.checkIfInstallmentIsGreaterThanOutstanding(deductionAccounts)) return;
                            hrmTransactionService.bulkHrmTransaction($scope.paySalaryToAdd, true, false)
                            .then(function (response) {

                                if (response.data.Success) {
                                    $rootScope.$broadcast('pay-salary-add-finished');
                                    swal({
                                        title: $rootScope.showMessage($rootScope.paidSuccess, $rootScope.employeePaySalary),
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
                                                $scope.payEmployeeSalaryForm.$dirty = false;
                                                $scope.payEmployeeSalaryForm.reset();

                                                $scope.clearModelData();
                                            } else {
                                                $scope.clearAndCloseTab();
                                            }
                                        });
                                } else {
                                    swal($rootScope.showMessage($rootScope.addError, $rootScope.employeePaySalary), response.data.Message, "error");
                                }

                            });
                        } else {
                            //var allowanceAccountsForEdit = [];
                            //var deductionAccountsForEdit = [];
                            //allowanceAccountsForEdit = $scope.paySalaryToAdd.allowanceAccounts;
                            //deductionAccountsForEdit = $scope.paySalaryToAdd.deductionAccounts;
                            //var tDate;
                            //var oDate;
                            //var dDate;
                            //var rDate;
                            //var i;
                            //for (i = 0; i < allowanceAccountsForEdit.length; i++) {
                            //    tDate = new Date(allowanceAccountsForEdit[i].ClosingDate);
                            //    allowanceAccountsForEdit[i].ClosingDate = $scope.DateToInt(tDate);
                            //    oDate = new Date(allowanceAccountsForEdit[i].OpeningDate);
                            //    allowanceAccountsForEdit[i].OpeningDate = $scope.DateToInt(oDate);
                            //    dDate = new Date(allowanceAccountsForEdit[i].DisburseDate);
                            //    allowanceAccountsForEdit[i].DisburseDate = $scope.DateToInt(dDate);
                            //    rDate = new Date(allowanceAccountsForEdit[i].ReceiveDate);
                            //    allowanceAccountsForEdit[i].ReceiveDate = $scope.DateToInt(rDate);

                            //}
                            //$scope.paySalaryToAdd.allowanceAccounts = allowanceAccountsForEdit;
                            //for (i = 0; i < deductionAccountsForEdit.length; i++) {
                            //    tDate = new Date(deductionAccountsForEdit[i].ClosingDate);
                            //    deductionAccounts[i].ClosingDate = $scope.DateToInt(tDate);
                            //    oDate = new Date(allowanceAccounts[i].OpeningDate);
                            //    deductionAccounts[i].OpeningDate = $scope.DateToInt(oDate);
                            //    dDate = new Date(deductionAccounts[i].DisburseDate);
                            //    deductionAccounts[i].DisburseDate = $scope.DateToInt(dDate);
                            //    rDate = new Date(deductionAccounts[i].ReceiveDate);
                            //    deductionAccounts[i].ReceiveDate = $scope.DateToInt(rDate);
                            //}
                            //$scope.paySalaryToAdd.deductionAccounts = deductionAccounts;


                            console.log($scope.paySalaryToAdd);
                            hrmTransactionService.bulkHrmTransaction($scope.paySalaryToAdd, false, true)
                            .then(function (response) {

                                if (response.data.Success) {
                                    $rootScope.$broadcast('pay-salary-edit-finished');
                                    swal({
                                        title: $rootScope.showMessage($rootScope.editSuccess, $rootScope.employeePaySalary),
                                        //text: "What do you want to do next?",
                                        //type: "success",
                                        showCancelButton: true,
                                        showConfirmButton: false,
                                        //confirmButtonColor: "#008000",
                                        //confirmButtonText: "Edit New",
                                        cancelButtonText: "Close and Exit",
                                        //closeOnConfirm: true,
                                        closeOnCancel: true
                                    },
                                        function (isConfirm) {
                                            if (isConfirm) {
                                                $scope.payEmployeeSalaryForm.$dirty = false;
                                                $scope.payEmployeeSalaryForm.reset();

                                                $scope.clearModelData();
                                            } else {
                                                $scope.clearAndCloseTab();
                                            }
                                        });
                                } else {
                                    swal($rootScope.showMessage($rootScope.editError, $rootScope.employeePaySalary), response.data.Message, "error");
                                }

                            });
                        }//
                    }



                }
            });
        }

        $scope.clearModelData = function () {
            $scope.paySalaryToAdd = null;
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
            $scope.paySalaryToAdd.Date = new Date($rootScope.workingdate);
            $scope.paySalaryToAdd.OfficeCode = $rootScope.selectedBranchId;
            commonService.getEmployeeFilterFromSP($rootScope.selectedBranchId, $rootScope.user.Role, $rootScope.user.EmployeeId, true, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                $scope.filters.Employees = response.data;
                console.log(response.data);
                //paySalaryService.getEmployerBankAccountFilters($rootScope.selectedBranchId).then(function (response) {
                //    $scope.filters.EmployerBankAccount = response.data.accounts;
                //});
                filterService.GetActiveBankAccountListByBranch($rootScope.selectedBranchId).then(function (response) {
                   $scope.filters.EmployerBankAccount = response.data;
                    console.log($scope.bankAccounts);
                });

            });
            $scope.getYearMonthDate();
            $scope.paySalaryToAdd.allowanceAccounts = [];
            $scope.paySalaryToAdd.deductionAccounts = [];
            workingDayService.getDateOfBranch($rootScope.selectedBranchId).then(function (response) {
                $scope.createdBranchWorkingDate = response.data.date;
                $scope.$watch('createdBranchWorkingDate', function (obj) {
                    $scope.paySalaryToAdd.CreatedBranchDate = obj;
                    //$scope.paySalaryToAdd.TransactionDate = commonService.intToDate(obj);
                    var branchDate = commonService.intToDate(obj).toString();
                    $scope.createdDate = branchDate;
                    var year = branchDate.slice(6, 10);
                    var month = branchDate.slice(3, 5);
                    var date = branchDate.slice(0, 2);
                    $scope.paySalaryToAdd.SalaryYear = parseInt(year);
                    $scope.paySalaryToAdd.SalaryMonth = parseInt(month);
                    $scope.paySalaryToAdd.TransactionDateTime = obj;
                    $scope.paySalaryToAdd.CurrentBranchWorkingDate = obj;
                    //$scope.paySalaryToAdd.ChequeNo = "0";
                    //$scope.paySalaryToAdd.UpdatedBy = "0";
                    console.log(obj);
                    console.log($scope.paySalaryToAdd.TransactionDate);
                }, true);

            });

        }

        $scope.init();
















        //$scope.isHolidayOrOffDay = function (d) {
        //    $scope.branchHolidayAndOffDay.forEach(function (h) {
        //        if (moment(h).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
        //            swal('Selected date is holiday or Offday');
        //            $scope.paySalaryToAdd.Date = new Date($rootScope.workingdate);
        //            return;
        //        }
        //    });

        //}

        //new datepicker
        $scope.today = function () {

            $scope.paySalaryToAdd.Date = new Date($rootScope.workingdate);


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

            return (mode === 'day' && (date.getDay() === 5))
                || (moment(date) > moment(new Date($rootScope.workingdate))); //.add(1, 'days'));
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
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }

            if (moment($scope.paySalaryToAdd.Date).valueOf() > maxDate || moment($scope.paySalaryToAdd.Date).valueOf() < minDate) {
                swal('please select valid date!');
                $scope.today();
                return;
            }


            if (moment($scope.paySalaryToAdd.Date) > moment(new Date($scope.branchWorkingDay) + 1)) {
                swal("unable to select future date!");
                $scope.today();
                return;
            }

            //$scope.isHolidayOrOffDay($scope.paySalaryToAdd.Date);
        }


    }
]);