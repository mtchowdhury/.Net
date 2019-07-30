ammsAng.controller('hrmTransactionEditController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'workingDayService', 'commonService', 'employeeService', 'hrmTransactionService',
    function ($scope, $rootScope, $timeout, $q, filterService, workingDayService, commonService, employeeService, hrmTransactionService) {
        $scope.isDirty = false;
        $scope.filters = {};
        $scope.hrmTransactionToEdit = angular.copy($rootScope.hramTransactionEdit);
        $scope.checkIfAccountIsActive = function (accountId) {
            hrmTransactionService.checkIfAccountIsActive(accountId).then(function (response) {
                $scope.isAccountActive = response.data;
                if (!$scope.isAccountActive) {
                    swal("Cannot Edit transaction for closed account.");
                    $timeout(function () {
                        $('#saveComplete').modal('hide');
                        $('.modal-backdrop').remove();
                    }, 500);
                    $scope.execRemoveTab($scope.tab);
                    return true;
                    
                }

                return false;
            });
        }
        $scope.getAllFilters = function () {
            hrmTransactionService.getAllFilters($rootScope.selectedBranchId).then(function (filterdata) {
                $scope.filters.employees = filterdata.data.employees;

                

                $scope.filters.transactionTypes = filterdata.data.transactionTypes;
                $scope.filters.transactionProcesses = filterdata.data.transactionProcesses;
                $scope.filters.transactionLocation = filterdata.data.transactionLocation;
                $scope.hrmTransactionToEdit.Location = 63;
                $scope.hrmTransactionToEdit.ModifiedBy = $rootScope.user.EmployeeId;

                console.log(filterdata);
            });
        };
        hrmTransactionService.getHrmTransactionByTransactionId($scope.hrmTransactionToEdit.Id).then(function(singleTransaction) {
            $scope.hrmTransactionToEdit = angular.copy(singleTransaction.data);
            if ($scope.checkIfAccountIsActive($scope.hrmTransactionToEdit.EmpAccountId)) return;
            console.log($scope.hrmTransactionToEdit);
            $scope.hrmTransactionToEdit.CurrentBranchWorkingDate = $scope.currentBranchWorkingDate;
            console.log($scope.hrmTransactionToEdit);
            //commonService.getEmployeeFilterFromSP(parseInt($scope.hrmTransactionToEdit.OfficeName), $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
            //    $scope.filters.employees = response.data;
            //});
            if ($scope.hrmTransactionToEdit.TransactionCreatedFrom !== 64) {
                swal($rootScope.showMessage("Cannot Edit transaction created from other location.", $rootScope.hrmTransactions), "", "error");
                $timeout(function () {
                    $('#saveComplete').modal('hide');
                    $('.modal-backdrop').remove();
                }, 500);
                $scope.execRemoveTab($scope.tab);
                //function (isConfirm) {
                //    if (isConfirm) {
                //        $scope.clearAndCloseTab();
                //    } else {
                //        $scope.clearAndCloseTab();
                //    }

                //}

                //hrmTransactionService.getAllHrmTransactions($rootScope.selectedBranchId).then(function (responsehrmTransactions) {
                //    console.log(responsehrmTransactions.data);
                //    $scope.hrmTransactionList = responsehrmTransactions.data;//.filter(emp=>emp.BranchId == $scope.selectedBranchId);
                //    $scope.hrmTransactionListFull = responsehrmTransactions.data;
                //    //if ($rootScope.user.Role != "0" && $rootScope.user.Role != "1" && $rootScope.user.Role != "12") {
                //    //    $scope.employeeList = responseEmployee.data.filter(emp=>emp.BranchId == $scope.selectedBranchId);
                //    //    $scope.employeeListFull = responseEmployee.data.filter(emp=>emp.BranchId == $scope.selectedBranchId);
                //    //}

                //}, AMMS.handleServiceError);

            } else {
                $scope.transactionId = $rootScope.hramTransactionEdit.Id;
                console.log($rootScope.hramTransactionEdit);
                //$scope.getAllFilters = function () {
                //    hrmTransactionService.getAllFilters($rootScope.selectedBranchId).then(function (filterdata) {
                //        $scope.filters.employees = filterdata.data.employees;
                //        $scope.filters.transactionTypes = filterdata.data.transactionTypes;
                //        $scope.filters.transactionProcesses = filterdata.data.transactionProcesses;
                //        $scope.filters.transactionLocation = filterdata.data.transactionLocation;
                //        $scope.hrmTransactionToEdit.Location = 63;
                //        $scope.hrmTransactionToEdit.ModifiedBy = $rootScope.user.EmployeeId;

                //        console.log(filterdata);
                //    });
                //};
                if ($scope.hrmTransactionToEdit.Debit === 0) {
                    $scope.hrmTransactionToEdit.Amount = $scope.hrmTransactionToEdit.Credit;
                } else {
                    $scope.hrmTransactionToEdit.Amount = $scope.hrmTransactionToEdit.Debit;
                }

                //hrmTransactionService.getEmployeeAccountById($scope.hrmTransactionToEdit.EmployeeId).then(function (responseData) {
                //    $scope.employeesAccounts = responseData.data.employeeAccounts;
                //    console.log($scope.employeesAccounts);
                //    console.log(responseData.data.employeeAccounts);
                //});

                hrmTransactionService.getEmployeeAccountById($scope.hrmTransactionToEdit.EmployeeId).then(function (response) {
                $scope.employeeAccounts = response.data.accounts;
                if ($scope.employeeAccounts.length > 0) {
                    $scope.employeeAccounts.forEach(function(account) {
                        if (account.AnyAdditionalValue === 1) account.Name = "*" + account.Name;
                        account.Name = account.Name +"("+ account.AnyAdditionalString +")";
                    });
                    $scope.employeesAccounts = angular.copy($scope.employeeAccounts.filter(x=>x.AnyAdditionalValue === 1));
                    
                }
                console.log(response.data.employeeAccounts);
                console.log($scope.employeeAccounts);
            });

                hrmTransactionService.getAllEmployeeBankAccounts($scope.hrmTransactionToEdit.EmployeeId).then(function (responseData) {
                    $scope.employeeBankAccounts = responseData.data;
                });

                $scope.checkTransactionDate = function () {
                    if ($scope.hrmTransactionToEdit.TransactionDate > Date.now()) {
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

                


                $scope.editHrmTransaction = function () {
                    if ($scope.checkIfEmployeeIsActive($scope.hrmTransactionToEdit.EmployeeId)) return;
                    if ($scope.checkIfEmployeeIsInTransferState($scope.hrmTransactionToEdit.EmployeeId)) return;

                    if ($scope.hrmTransactionToEdit.TransactionDate != null) {
                        if ($scope.checkTransactionDate()) return;

                    }


                    swal({
                        title: "Confirm?",
                        text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.hrmTransactions),
                        showCancelButton: true,
                        confirmButtonText: "Yes, Edit it!",
                        cancelButtonText: "No, cancel!",
                        type: "info",
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true,
                    }, function (isConfirmed) {
                        if (isConfirmed) {
                            $scope.hrmTransactionToEdit.TransactionDate = moment($scope.hrmTransactionToEdit.TransactionDate).format();

                            hrmTransactionService.hrmTransaction($scope.hrmTransactionToEdit, false, true,$rootScope.user.Role)
                                .then(function (response) {
                                    console.log($scope.hrmTransactionToEdit);

                                    if (response.data.Success) {
                                        $rootScope.$broadcast('hrmTransaction-edit-finished');
                                        swal({
                                            title: $rootScope.showMessage($rootScope.editSuccess, $rootScope.hrmTransactions),
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
                                        swal($rootScope.showMessage($rootScope.editError, $rootScope.hrmTransactions), response.data.Message, "error");
                                    }

                                });
                        }
                    });
                }

                $scope.clearModelData = function () {
                    $scope.hrmTransactionToEdit = null;
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

                    workingDayService.getDateOfBranch($rootScope.selectedBranchId).then(function (response) {
                        $scope.currentBranchWorkingDate = response.data.date;
                        $scope.$watch('currentBranchWorkingDate', function (obj) {
                            $scope.hrmTransactionToEdit.ModifiedBranchWorkingDate = obj;
                            $scope.hrmTransactionToEdit.CurrentBranchWorkingDate = obj;
                            console.log(obj);
                        }, true);

                    });

                    //hrmTransactionService.getHrmTransactionByTransactionId($scope.transactionId).then(function (myData) {
                    //    $scope.transactionData = myData.data;
                    //    console.log($scope.transactionData);
                    //    $scope.$watch('transactionData', function (obj) {
                    //        $scope.hrmTransactionToEdit.Id = obj.Id;
                    //        //$scope.hrmTransactionToEdit.CreatedOn = obj.CreatedOn;
                    //        $scope.hrmTransactionToEdit.CreatedBy = obj.CreatedBy;
                    //        $scope.hrmTransactionToEdit.CreatedBranchWorkingDate = obj.CreatedBranchWorkingDate;
                    //        $scope.hrmTransactionToEdit.OfficeType = obj.OfficeType;
                    //        $scope.hrmTransactionToEdit.OfficeCode = obj.OfficeCode;
                    //        console.log(obj.CreatedBy);
                    //    }, true);
                    //});
                }

                //$scope.init();
            }
        });
        $scope.init = function () {
            $scope.getAllFilters();

            workingDayService.getDateOfBranch($rootScope.selectedBranchId).then(function (response) {
                $scope.currentBranchWorkingDate = response.data.date;
                $scope.$watch('currentBranchWorkingDate', function (obj) {
                    $scope.hrmTransactionToEdit.ModifiedBranchWorkingDate = obj;
                    $scope.hrmTransactionToEdit.CurrentBranchWorkingDate = obj;
                    console.log(obj);
                }, true);

            });

            //hrmTransactionService.getHrmTransactionByTransactionId($scope.transactionId).then(function (myData) {
            //    $scope.transactionData = myData.data;
            //    console.log($scope.transactionData);
            //    $scope.$watch('transactionData', function (obj) {
            //        $scope.hrmTransactionToEdit.Id = obj.Id;
            //        //$scope.hrmTransactionToEdit.CreatedOn = obj.CreatedOn;
            //        $scope.hrmTransactionToEdit.CreatedBy = obj.CreatedBy;
            //        $scope.hrmTransactionToEdit.CreatedBranchWorkingDate = obj.CreatedBranchWorkingDate;
            //        $scope.hrmTransactionToEdit.OfficeType = obj.OfficeType;
            //        $scope.hrmTransactionToEdit.OfficeCode = obj.OfficeCode;
            //        console.log(obj.CreatedBy);
            //    }, true);
            //});
        }
        $scope.init();

    }
]);