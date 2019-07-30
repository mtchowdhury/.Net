ammsAng.controller('hrmTransactionListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'hrmTransactionService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, commonService, $timeout, hrmTransactionService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.hrmTransactionListFull = [];
        $scope.hrmTransactionList = [];
        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];
        $scope.hrmTransactionModel = {};
        $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10);

        $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(1)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(2)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(3)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(4)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(5)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(6)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(7)
            .withOption("bSearchable", true)
        //DTColumnDefBuilder.newColumnDef(8)
        //    .withOption("bSearchable", true)
        //DTColumnDefBuilder.newColumnDef(9)
        //    .withOption("bSearchable", true)
        ];
        $scope.hrmTransactionModel.Office = $rootScope.selectedBranchId;
        
        $scope.filters = {};
        $scope.getAllFilters = function () {
            hrmTransactionService.getOfficeType().then(function (filterdata) {

                $scope.filters.OfficeTypes = filterdata.data.officeTypes;
                $scope.filters.AccountTypes = filterdata.data.accountTypes;
                $scope.filters.TransactionTypes = filterdata.data.hrmTransactionTypes;

                //$scope.filters.employees = filterdata.data.employees;
                //$scope.filters.transactionTypes = filterdata.data.transactionTypes;
            });
        };

        $scope.
            DateToInt = function (date) {
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


        $scope.employeeToDelete = null;
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
        //$scope.searchArr = [
        //   {
        //       filterColumnName: "",
        //       comparison: "",
        //       searchValue: "",
        //       radioOption: "and"
        //   },
        //   {
        //       filterColumnName: "",
        //       comparison: "",
        //       searchValue: "",
        //       radioOption: "and"
        //   },
        //   {
        //       filterColumnName: "",
        //       comparison: "",
        //       searchValue: "",
        //       radioOption: "and"
        //   }
        //];

        //$scope.intersect = function (arr1, arr2) {
        //    var intersect = [];
        //    _.each(arr1, function (a) {
        //        _.each(arr2, function (b) {
        //            if (compare(a, b))
        //                intersect.push(a);
        //        });
        //    });

        //    return intersect;
        //};
        //$scope.number = 3;
        //$scope.getNumber = function (num) {
        //    return new Array(num);
        //}

        $scope.getAccountAndTransactionTypeByAccountType = function () {
            $scope.filters.Accounts = [];
            $scope.filters.TransactionTypes = [];
            $scope.filters.Accounts.push({
                Name: "All"
               , Value: -100000
               ,AnyAdditionalValue:1
            });
            $scope.filters.TransactionTypes.push({
                Name: "All"
               , Value: -100000
               , AnyAdditionalValue: 1
            });
            hrmTransactionService.getTransactionTypeAndAccountByAccountType($scope.hrmTransactionModel.AccountTypeId, $scope.hrmTransactionModel.EmployeeId).then(function (response) {
                $scope.filters.Accounts.push.apply($scope.filters.Accounts, response.data.accounts);;
                $scope.filters.TransactionTypes.push.apply($scope.filters.TransactionTypes, response.data.transactionTypes);;
               // $scope.filters.TransactionTypes = response.data.transactionTypes;
                if ($scope.filters.Accounts.length > 0) {
                    $scope.filters.Accounts.forEach(function (account) {
                        if (account.Value === -100000)return;
                        if (account.AnyAdditionalValue === 1) account.Name = "*" + account.Name;
                        account.Name = account.Name +"("+ account.AnyAdditionalString +")";
                    });
                }

                if ($scope.filters.TransactionTypes.length > 0) {
                    $scope.filters.TransactionTypes.forEach(function (ttype) {
                        if (ttype.Value === -100000) return;
                        if (ttype.AnyAdditionalValue === 1) ttype.Name = "*" + ttype.Name;
                    });
                }

               
            });
        
        }


        $scope.getHrmTransactions = function () {
            var from = $scope.DateToInt($scope.hrmTransactionModel.enlistDayFrom);
            var to = $scope.DateToInt($scope.hrmTransactionModel.enlistDayTo);

            $("#loadingImage").css("display", "block");
            hrmTransactionService.getHrmTransactionsForDefaultView($rootScope.selectedBranchId,from,to).then(function (responsehrmTransactions) {
                $scope.hrmTransactionModel.Office = $rootScope.selectedBranchId;
                //console.log(responsehrmTransactions.data);
                $scope.hrmTransactionList = angular.copy(responsehrmTransactions.data);//.filter(emp=>emp.BranchId == $scope.selectedBranchId);
                $scope.hrmTransactionListFull = angular.copy(responsehrmTransactions.data);
                //if ($rootScope.user.Role != "0" && $rootScope.user.Role != "1" && $rootScope.user.Role != "12") {
                //    $scope.employeeList = responseEmployee.data.filter(emp=>emp.BranchId == $scope.selectedBranchId);
                //    $scope.employeeListFull = responseEmployee.data.filter(emp=>emp.BranchId == $scope.selectedBranchId);
                //}
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);
        }
        $scope.format = $rootScope.formats[4];
        $scope.openEnlistDayFromPopup = function () {
            $scope.popupEnlistDayFrom.opened = true;
        }
        $scope.popupEnlistDayFrom = {
            opened: false
        };
        $scope.openEnlistDayToPopup = function () {
            $scope.popupEnlistDayTo.opened = true;
        }
        $scope.popupEnlistDayTo = {
            opened: false
        };
        $scope.dateOptionsEnlistDayFrom = {
            // dateDisabled: false,
            formatYear: 'yyyy',
            maxDate: new Date($rootScope.workingdate),
            minDate: new Date(1, 1, 1991),
            startingDay: 1
        };
        $scope.dateOptionsEnlistDayTo = {
            //dateDisabled: true,
            formatYear: 'yyyy',
            maxDate: new Date($rootScope.workingdate),
            minDate: new Date(1, 1, 1991),
            startingDay: 1
        };

        $scope.OnOfficeTypeChange = function (officeType) {
            hrmTransactionService.getBranchesByOfficeTypeId(officeType, $rootScope.user.Role, $rootScope.selectedBranchId).then(function (response) {
                $scope.filters.Offices = response.data;
            });
            //hrmTransactionService.getOffices($rootScope.selectedBranchId, parseInt($rootScope.user.Role)).then(function (filterdata) {

            //    $scope.filters.Offices = filterdata.data.Branches;
                
            //});
        }

        $scope.OnOfficeChange = function (officeName) {
            //hrmTransactionService.getEmployeesByBranch(officeName).then(function (filterdata) {

            //    $scope.filters.Employees = filterdata.data.employees;

            //});
            commonService.getEmployeeFilterFromSP(officeName, $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                $scope.filters.Employees = response.data;
            });
        }

        $scope.onEmployeeChange = function (employee) {
            hrmTransactionService.getEmployeeAccount(employee).then(function (filterdata) {
                $scope.filters.Accounts = filterdata.data.employeeAccount;
            });
        }

        //$scope.searchTransaction = function () {
        //    var fullTransactionList = $scope.hrmTransactionList;
        //    if ($scope.hrmTransactionModel.OfficeType != null && $scope.hrmTransactionModel.OfficeType !== 0 && $scope.hrmTransactionModel.OfficeType !== undefined) {
        //        fullTransactionList = fullTransactionList.filter(e => e.OfficeType === $scope.hrmTransactionModel.OfficeType);
        //    }
        //    if ($scope.hrmTransactionModel.Office !== null && $scope.hrmTransactionModel.Office !== 0 && $scope.hrmTransactionModel.Office !== undefined) {
        //        fullTransactionList = fullTransactionList.filter(e => e.OfficeCode === $scope.hrmTransactionModel.Office);
        //    }
        //    if ($scope.hrmTransactionModel.EmployeeId !== null && $scope.hrmTransactionModel.EmployeeId !== 0 && $scope.hrmTransactionModel.EmployeeId !== undefined) {
        //        fullTransactionList = fullTransactionList.filter(e => e.EmpId === $scope.hrmTransactionModel.EmployeeId);
        //    }
        //    if ($scope.hrmTransactionModel.AccountId !== null && $scope.hrmTransactionModel.AccountId !== 0 && $scope.hrmTransactionModel.AccountId !== undefined) {
        //        fullTransactionList = fullTransactionList.filter(e => e.EmpAccountId === $scope.hrmTransactionModel.AccountId);
        //    }
        //    if ($scope.hrmTransactionModel.AccountTypeId !== null && $scope.hrmTransactionModel.AccountTypeId !== 0 && $scope.hrmTransactionModel.AccountTypeId !== undefined) {
        //        fullTransactionList = fullTransactionList.filter(e => e.AccountTypeId === $scope.hrmTransactionModel.AccountTypeId);
        //    }
        //    if ($scope.hrmTransactionModel.TransactionTypeId !== null && $scope.hrmTransactionModel.TransactionTypeId !== 0 && $scope.hrmTransactionModel.TransactionTypeId !== undefined) {
        //        fullTransactionList = fullTransactionList.filter(e => e.TransactionTypeId === $scope.hrmTransactionModel.TransactionTypeId);
        //    }

        //    if ($scope.hrmTransactionModel.enlistDayFrom !== null && $scope.hrmTransactionModel.enlistDayFrom !== undefined && $scope.hrmTransactionModel.enlistDayTo !== null && $scope.hrmTransactionModel.enlistDayTo !== undefined) {
        //        var fDate = $scope.hrmTransactionModel.enlistDayFrom;
        //        fDate = fDate.toISOString().slice(0, 10);
        //        var fDateInt = $scope.DateToInt(fDate);
        //        var tDate = $scope.hrmTransactionModel.enlistDayTo;
        //        tDate = tDate.toISOString().slice(0, 10);
        //        var tDateInt = $scope.DateToInt(tDate);
                
        //        fullTransactionList = fullTransactionList.filter(e=>e.TransactionDate >= fDate && e.TransactionDate <= tDate);
        //    }
            

        //    if ($scope.hrmTransactionModel.enlistDayFrom !== null && $scope.hrmTransactionModel.enlistDayFrom !== undefined) {
        //        var fromDate = $scope.hrmTransactionModel.enlistDayFrom;
        //        fromDate = fromDate.toISOString().slice(0, 10);
                
        //        var fromDateInt = $scope.DateToInt(fromDate);
        //        fullTransactionList = fullTransactionList.filter(e=>e.TransactionDate >= fromDate);
        //    }

        //    if ($scope.hrmTransactionModel.enlistDayTo !== null && $scope.hrmTransactionModel.enlistDayTo !== undefined) {
        //        var toDate = $scope.hrmTransactionModel.enlistDayTo;
        //        toDate = toDate.toISOString().slice(0, 10);
        //        var toDateInt = $scope.DateToInt(toDate); 
        //        fullTransactionList = fullTransactionList.filter(e=>e.TransactionDate <= toDate);
        //    }
            
        //    $scope.hrmTransactionList = fullTransactionList;

        //}
        $scope.DateToInt = function (date) {
            
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

        $scope.searchTransaction = function() {
            var fromDate = null;
            var toDate = null;
            if ($scope.hrmTransactionModel.AccountId == null) {
                $scope.hrmTransactionModel.AccountId = -100000;
            }
            if ($scope.hrmTransactionModel.EmployeeId == null) {
                $scope.hrmTransactionModel.EmployeeId = -100000;
            }

            if ($scope.hrmTransactionModel.enlistDayFrom != null) { 
                 fromDate = moment($scope.hrmTransactionModel.enlistDayFrom).format();
                fromDate = $scope.DateToInt(fromDate);
            }

            if ($scope.hrmTransactionModel.enlistDayTo != null) {
                toDate = moment($scope.hrmTransactionModel.enlistDayTo).format();
                toDate = $scope.DateToInt(toDate);
            }

            $scope.fromDate = fromDate;
            $scope.toDate = toDate;

            if ($scope.hrmTransactionModel.AccountTypeId == null || $scope.hrmTransactionModel.AccountTypeId == undefined) {
                $scope.hrmTransactionModel.AccountTypeId = -100000;
            }
            if ($scope.hrmTransactionModel.TransactionTypeId == null || $scope.hrmTransactionModel.TransactionTypeId == undefined) {
                $scope.hrmTransactionModel.TransactionTypeId = -100000;
            }


            hrmTransactionService.getHrmsTransactionByFilter($scope.hrmTransactionModel.Office, $scope.hrmTransactionModel.EmployeeId,
                $scope.hrmTransactionModel.AccountId, $scope.hrmTransactionModel.AccountTypeId,
                $scope.hrmTransactionModel.TransactionTypeId, fromDate, toDate).then(function (response) {
                    $scope.hrmTransactionList = response.data;
            });
        }


        $scope.handleNonGeneralActions = function (actionName, hrmTransaction) {
            $scope.hrmTransactionToDelete = hrmTransaction;
            if (actionName === "DELETE") {
                $scope.deleteHrmTransaction();
            }
        }

        $scope.$on('hrmTransaction-add-finished', function () {
            $scope.getHrmTransactions();
        });

        $scope.$on('hrmTransaction-edit-finished', function () {
            $scope.getHrmTransactions();
        });


        $scope.$on('hrmTransaction-delete-finished', function () {
            $scope.getHrmTransactions();
        });
        $scope.checkTransactionCreatedFrom = function () {
            if ($scope.hrmTransactionToDelete.TransactionCreatedFrom !==64) {
                swal("Cannot delete transaction Created from Other location.");
                return true;
            }
            return false;
        }

        $scope.deleteHrmTransaction = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.hrmTransactions),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    if (!$scope.checkTransactionCreatedFrom()) {
                        hrmTransactionService.deleteHrmsTransaction($scope.hrmTransactionToDelete.Id,moment($rootScope.workingdate).format(),parseInt($rootScope.user.Role)).then(function (response) {
                            if (response.data.Success) {
                                swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.hrmTransactions), "Successful!", "success");
                                $rootScope.$broadcast('hrmTransaction-delete-finished');
                            } else {
                                swal($rootScope.showMessage(response.data.Message, $rootScope.hrmTransactions), "", "error");
                                hrmTransactionService.getAllHrmTransactions($rootScope.selectedBranchId).then(function (responsehrmTransactions) {
                                    //console.log(responsehrmTransactions.data);
                                    $scope.hrmTransactionList = responsehrmTransactions.data;//.filter(emp=>emp.BranchId == $scope.selectedBranchId);
                                    $scope.hrmTransactionListFull = responsehrmTransactions.data;
                                    //if ($rootScope.user.Role != "0" && $rootScope.user.Role != "1" && $rootScope.user.Role != "12") {
                                    //    $scope.employeeList = responseEmployee.data.filter(emp=>emp.BranchId == $scope.selectedBranchId);
                                    //    $scope.employeeListFull = responseEmployee.data.filter(emp=>emp.BranchId == $scope.selectedBranchId);
                                    //}

                                }, AMMS.handleServiceError);
                            }

                        }, AMMS.handleServiceError);
                    }
                        
                    
                   
                });
        };

        //$scope.searchEmployee = function () {
        //    $scope.employeeList = [];
        //    var k = -1;
        //    if ($scope.searchArr[0].filterColumnName &&
        //        $scope.searchArr[0].comparison) {
        //        k = 0;
        //    }
        //    if ($scope.searchArr[0].filterColumnName &&
        //        $scope.searchArr[0].comparison &&
        //        $scope.searchArr[1].filterColumnName &&
        //        $scope.searchArr[1].comparison) {
        //        k = 1;
        //    }
        //    if ($scope.searchArr[0].filterColumnName &&
        //        $scope.searchArr[0].comparison &&
        //        $scope.searchArr[1].filterColumnName &&
        //        $scope.searchArr[1].comparison &&
        //        $scope.searchArr[2].filterColumnName &&
        //        $scope.searchArr[2].comparison) {
        //        k = 2;
        //    }

        //    if (k === 0) {
        //        var response = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 0);
        //        $scope.employeeList = response;
        //    }

        //    if (k === 1) {
        //        var firstQueryResult = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 0);
        //        if ($scope.searchArr[0].radioOption === "or") {
        //            var secondQuertResult1 = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 1);
        //            for (var j = 0; j < secondQuertResult1.length; j++) {
        //                if (!firstQueryResult.includes(secondQuertResult1[j])) {
        //                    firstQueryResult.push(secondQuertResult1[j]);
        //                }
        //            }
        //            $scope.employeeList = firstQueryResult;
        //        }
        //        if ($scope.searchArr[0].radioOption === "and") {
        //            var secondQuertResult = employeeService.searchEmployee(firstQueryResult, $scope.searchArr, 1);
        //            $scope.employeeList = secondQuertResult;
        //        }
        //    }

        //    if (k === 2) {
        //        var firstQueryResult = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 0);

        //        if ($scope.searchArr[0].radioOption === "or") {
        //            var secondQuertResult = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 1);
        //            var thirdQuertResult = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 1);
        //            for (var j = 0; j < secondQuertResult.length; j++) {
        //                if (!firstQueryResult.includes(secondQuertResult[j])) {
        //                    firstQueryResult.push(secondQuertResult[j]);
        //                }
        //            }
        //            for (var j = 0; j < thirdQuertResult.length; j++) {
        //                if (!firstQueryResult.includes(thirdQuertResult[j])) {
        //                    firstQueryResult.push(thirdQuertResult[j]);
        //                }
        //            }
        //            $scope.employeeList = firstQueryResult;
        //        }

        //        if ($scope.searchArr[0].radioOption === "and") {

        //            var secondQuertResult = employeeService.searchEmployee(firstQueryResult, $scope.searchArr, 1);
        //            var thirdQueryResult = employeeService.searchEmployee(secondQuertResult, $scope.searchArr, 2);
        //            $scope.employeeList = thirdQueryResult;
        //        }
        //    }
        //};


        $scope.Init = function () {
            $scope.filterParams = {};
            $scope.hrmTransactionModel = {};
            $scope.hrmTransactionModel.Office = $rootScope.selectedBranchId;

            //hrmTransactionService.getEmployeesByBranch($scope.hrmTransactionModel.Office).then(function (filterdata) {

            //    $scope.filters.Employees = filterdata.data.employees;

            //});
            commonService.getEmployeeFilterFromSP($rootScope.selectedBranchId, $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                $scope.filters.Employees = response.data;
            });

            hrmTransactionService.getOfficeTypeFromBranchId($rootScope.selectedBranchId).then(function (filterdata) {

                $scope.hrmTransactionModel.OfficeType = filterdata.data;

            });


            $scope.hrmTransactionModel.enlistDayFrom = new Date($rootScope.workingdate);
            $scope.hrmTransactionModel.enlistDayTo = new Date($rootScope.workingdate);
            hrmTransactionService.getOffices($rootScope.selectedBranchId, parseInt($rootScope.user.Role)).then(function (filterdata) {

                $scope.filters.Offices = filterdata.data.Branches;

            });
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.getAllFilters();
                $scope.commandList = responseCommand.data;

                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
                $scope.getHrmTransactions();
            }, AMMS.handleServiceError);

        };
        $scope.reloadPage = function () {
            $scope.employeeList = $scope.hrmTransactionListFull.filter(transaction=>transaction.BranchId == $rootScope.selectedBranchId);
            //if ($rootScope.user.Role != "0" && $rootScope.user.Role != "1" && $rootScope.user.Role != "12") {
            //    $scope.employeeList = $scope.employeeListFull.filter(emp=>emp.BranchId == $scope.selectedBranchId);
            //}
        }

        $scope.exportData = function () {
            
            $scope.filterParams.brachId = $scope.hrmTransactionModel.Office;
            $scope.filterParams.employeeId = $scope.hrmTransactionModel.EmployeeId;
            $scope.filterParams.employeeAccountId = $scope.hrmTransactionModel.AccountId;
            $scope.filterParams.accountTypeId = $scope.hrmTransactionModel.AccountTypeId;
            $scope.filterParams.transactionTypeId = $scope.hrmTransactionModel.TransactionTypeId;
            $scope.filterParams.fromDate = $scope.fromDate;
            $scope.filterParams.toDate = $scope.toDate;
            
            var filterString = "";

            
            for (var property in $scope.filterParams) {
                if ($scope.filterParams.hasOwnProperty(property)) {
                    filterString += property + "|" + $scope.filterParams[property] + "#";
                }
            }

            var url = commonService.getExportUrl($rootScope.hrmsApiBaseUrl + 'hrmTransaction/getHrmsTransactionsByFilterExport', filterString, 'HRMS-Transaction');
            window.open(url, '_blank');
        }
        $scope.Init();
    }]);