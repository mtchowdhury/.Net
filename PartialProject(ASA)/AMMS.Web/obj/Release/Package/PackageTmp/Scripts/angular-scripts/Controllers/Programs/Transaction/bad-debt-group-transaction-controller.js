ammsAng.controller('badDebtGroupTransactionController', ['$scope', '$rootScope', '$timeout', 'badDebtTransactionService', 'commonService', 'DTOptionsBuilder', 'workingDayService', 'transactionService',
    function ($scope, $rootScope, $timeout, badDebtTransactionService, commonService, DTOptionsBuilder, workingDayService, transactionService) {
        var declarevariables = function () {
            $scope.commandList = [];
            $scope.hasNonGeneralCommands = false;
            $scope.exportResult = [];
            $scope.transactions = {};
            $scope.groupList = [];
            $scope.tableHeaders = [];
            $scope.transactions.loans = [];
            $scope.transactions.savingsDeposits = [];
            $scope.transactions.savingsWithdrawl = [];
            $scope.groupTransactions = [];
            $scope.groupTransactionsMain = [];
            $scope.transaction = {};
            $scope.rand = 0;
            $scope.loadClicked = false;
            $scope.ProductList = [];
            $scope.postTransaction = [];
            $scope.warning = true;
            $scope.saveNclose = false;
            $scope.programOfficerId = 0;
            $scope.transaction.transactionDate = $rootScope.workingdate;
            $scope.depositRowCount = 0;
            $scope.withdrawRowCount = 0;
        }
        declarevariables();
        var purple = "#BF55EC";
        var red = "#ff0000";
        var orange = "#f46e42";
        var white = "#ffffff";
        var greenAdvance = "#5cc45c";
        var greenSaved = "#9ccc5a";

        //TODO We Dont have a PropertyId field in Property Table // Need To update these PropertyIds after EDMX update
        $scope.props = {
            "PropertyName": "Loan_Account",
            "DisplayName": "Loan Account",
            "FormName": "Loan_Account",
            "FormType": "List",
            "PropertyId": 1025
        };


        $scope.getGroupId = function () {
            if ($scope.selectedMenu.ParentName === "GROUP TYPE") {
                $scope.groupList.push({ Name: $scope.selectedMenu.Name, Value: $scope.selectedMenu.Id });
                $scope.transaction.groupId = $scope.groupList[0].Value;
                $scope.programOfficerId = $scope.selectedMenu.ProgramOfficerId;
            } else {
                console.log($scope.groupNames);
                $scope.groupList = $scope.groupList = $scope.groupNames.filter(gr => gr.ProgramOfficerId === $scope.selectedMenu.Id && gr.GroupTypeId == $rootScope.GroupTypes.BAD_DEBT);
                $scope.transaction.groupId = $scope.groupList[0].Value;
                $scope.programOfficerId = $scope.selectedMenu.Id;
            }
        }
        $scope.getWarning = function (m, headerId) {
            var transaction = m.Transactions.filter(e => e.ProductId === headerId)[0];
            if (transaction) {
                var productType = m.Transactions.filter(e => e.ProductId === headerId)[0].ProductType;

                var highestCollection = m.Transactions.filter(e => e.ProductId === headerId)[0].HighestCollection;
                var totalAmount = m.Transactions.filter(e => e.ProductId === headerId)[0].TotalAmount;
                var toBeGivenAmount = m.Transactions.filter(e => e.ProductId === headerId)[0].toBeGivenAmount;
                var isEdit = m.Transactions.filter(e => e.ProductId === headerId)[0].IsEdit;

                //if (productType === 1 && totalAmount > toBeGivenAmount && totalAmount < highestCollection) {
                //    console.log(totalAmount, highestCollection, toBeGivenAmount);
                //    transaction.CellColor = greenAdvance;
                //    return false;
                //} 
                //if (productType === 1 && totalAmount === toBeGivenAmount) {
                //    if (!transaction.IsEdit) transaction.CellColor = white;
                //    if (transaction.IsEdit) transaction.CellColor = greenSaved;
                //    return false;
                //}


                //if (totalAmount < toBeGivenAmount) {
                //    //console.log(totalAmount, highestCollection, toBeGivenAmount);
                //    transaction.CellColor = purple;
                //    return false;
                //}

                //if (totalAmount === toBeGivenAmount) {
                //    //console.log(totalAmount, highestCollection, toBeGivenAmount);
                //    if (!transaction.IsEdit) transaction.CellColor = white;
                //    if (transaction.IsEdit) transaction.CellColor = greenSaved;
                //    return false;
                //}

                if (totalAmount > highestCollection) {
                    transaction.CellColor = purple;
                    return false;
                } else {
                    transaction.CellColor = white;
                    return false;
                }
            }
            return false;
        }


        $scope.TransactionValidator = function (m, headerId) {


            var productType = m.Transactions.filter(e => e.ProductId === headerId)[0].ProductType;
            var totalAmount = m.Transactions.filter(e => e.ProductId === headerId)[0].TotalAmount;
            var highestCollection = m.Transactions.filter(e => e.ProductId === headerId)[0].HighestCollection;
            var isDeposit = m.Transactions.filter(e => e.ProductId === headerId)[0].IsDeposit;
            var productCategory = m.Transactions.filter(e => e.ProductId === headerId)[0].Productcategory;
            //var savingsBalance = m.Transactions.filter(e => e.ProductId === headerId)[0].SavingsBalance;
            //var toBeSavedBalance = m.Transactions.filter(e => e.ProductId === headerId)[0].toBeSavedBalance;
            var installmentCount = m.Transactions.filter(e => e.ProductId === headerId)[0].InstallmentCount;
            var toBeGivenAmount = m.Transactions.filter(e => e.ProductId === headerId)[0].toBeGivenAmount;
            var minimumBalance = m.Transactions.filter(e => e.ProductId === headerId)[0].MinimumBalance;
            var outstanding = m.Transactions.filter(e => e.ProductId === headerId)[0].OutstandingAmount;
            var defaultTotal = m.Transactions.filter(e => e.ProductId === headerId)[0].DefaultTotalAmount;
            var overdue = m.Transactions.filter(e => e.ProductId === headerId)[0].OverdueAmount;
            var role = $rootScope.user.Role;
            var validatorObj = {};

            if (totalAmount > highestCollection) {
                validatorObj.message = "$$$amount > outstanding";
                return validatorObj;
            }

            //For Savings Accounts , Balance Cannot be less than zero 

            var depositTransaction = m.Transactions.filter(e => e.ProductId === headerId)[0];
            if (depositTransaction && depositTransaction.IsDeposit && depositTransaction.ProductId.slice(-1) === 'd') {
                var withdrawlTransactionProduct = depositTransaction.ProductId.slice(0, -1).toString() + 'w';
                var withdrawlTransaction = m.Transactions.filter(e => e.ProductId === withdrawlTransactionProduct)[0];
                if (depositTransaction.TotalAmount - withdrawlTransaction.TotalAmount + depositTransaction.SavingsBalance < 0) {
                    validatorObj.message = "$$$Balance < 0";
                    return validatorObj;
                }
            }

            var wTransaction = m.Transactions.filter(e => e.ProductId === headerId)[0];
            if (wTransaction && !wTransaction.IsDeposit && wTransaction.ProductId.slice(-1) === 'w') {
                var dTransactionProduct = wTransaction.ProductId.slice(0, -1).toString() + 'd';
                var dTransaction = m.Transactions.filter(e => e.ProductId === dTransactionProduct)[0];
                if (dTransaction.TotalAmount - wTransaction.TotalAmount + dTransaction.SavingsBalance < 0) {
                    validatorObj.message = "$$$Balance < 0";
                    return validatorObj;
                }
            }

            return true;
        }
        
        //$scope.openLoanAccounts = function (props, tab, member) {
        //    $scope.selectedMenu.GroupId = $scope.groupTransactions.GroupId;
        //    $scope.selectedMenu.Id = member.MemberId;
        //    $scope.props.id = "13_" + member.MemberName.replace(/ /g, '_') + member.MemberId + "_prop_1025";
        //    $scope.openPropTab(props, tab);
        //}



        $scope.toggleLoadClicked = function () {
            $scope.loadClicked = false;
            $scope.groupTransactions = {};
            $scope.tableHeaders = [];
            $scope.transactions.loans = [];
            $scope.transactions.savingsDeposits = [];
            $scope.transactions.savingsWithdrawl = [];
        }

        $scope.isHolidayOrOffDay = function (date) {
            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    $scope.transaction.transactionDate = $rootScope.workingdate;
                }
            });

        }

        $scope.getSingleTransation = function (m, headerId) {
            return m.Transactions.filter(e => e.ProductId === headerId)[0];
        }

        $scope.getActiveStatus = function (m, headerId) {
            var transaction = m.Transactions.filter(e => e.ProductId === headerId)[0];
            //Todo have to return the accout status also 
            if (transaction.AccountStatus)
                return (m.MemberActiveState || transaction.AccountStatus);
            else return m.MemberActiveState;

        }

        $scope.setSingleTransation = function (m) {
            var net = 0;
            var balance = 0;

            m.Transactions.forEach(function (transaction) {
                net += transaction.TotalAmount;
                balance += transaction.TotalAmount;
                transaction.toBeSavedBalance = balance;
            });
            m.NetCollection = net;
        }

        $scope.depositFilter = function () {
            return function (item) {
                if (item.IsDeposit && item) {
                    return true;
                }
                return false;
            };
        }

        $scope.loadGroupTransactions = function () {
            if ($scope.loadClicked) return true;
            $("#loadingImage").css("display", "block");
            if (!$scope.transaction.groupId) swal("select a group!");
            if (!$scope.transaction.transactionDate) swal("Select a date");
            $scope.groupTransactions.BranchWorkingDate = moment($rootScope.workingdate).format();
            $scope.transaction.transactionDate = moment($scope.transaction.transactionDate).format();
            $scope.depositRowCount = 0;
            //$scope.withdrawRowCount = 0;
            badDebtTransactionService.getTransactionsOfGroup($scope.transaction.groupId, $scope.transaction.transactionDate, $scope.groupTransactions.BranchWorkingDate, $rootScope.selectedBranchId).then(function (response) {
                //transactionService.getTransactionsOfGroup($scope.transaction.groupId, $scope.transaction.transactionDate).then(function (response) {
                console.log(response.data);
                //if (response.data.IsEdit) {
                $scope.groupTransactions = [];
                $scope.groupTransactionsMain = [];
                for (var member in $scope.transactions) delete $scope.transactions[member];
                $scope.transactions.loans = [];
                $scope.transactions.savingsDeposits = [];
                $scope.transactions.savingsWithdrawl = [];
                $scope.tableHeaders = [];
                //}

                $scope.groupTransactions = response.data;
                $scope.groupTransactionsMain = angular.copy(response.data);
                $scope.memberTransactions = response.data.MemberTransactions;

                $scope.branchHolidayAndOffDay = $scope.groupTransactions.Holidays;

                $scope.groupTransactions.MemberTransactions.forEach(function (m) {

                    if (!m.MemberActiveState) m.RowColor = red; // red color for inactive users
                    m.Transactions.forEach(function (s) {

                        $scope.transactions.loans.push(s.ProductId);
                        s.memberActiveStatus = m.MemberActiveState;

                    });
                });

                //$scope.transactions.savingsDeposits = $scope.transactions.savingsDeposits.filter((v, i, a) => a.indexOf(v) === i);
                //$scope.transactions.savingsWithdrawl = $scope.transactions.savingsWithdrawl.filter((v, i, a) => a.indexOf(v) === i);
                $scope.transactions.loans = $scope.transactions.loans.filter((v, i, a) => a.indexOf(v) === i);

                //  $scope.tableHeaders.push({ Name: "Primary Program Name", IsData: false, Value: "Primary Program", IsSavings: false, IsPromaryProgramName: true });

                //$scope.transactions.savingsDeposits.forEach(function (a) {

                //    $scope.tableHeaders.push({ Name: a, IsData: true, Value: a, IsSavings: true, IsDeposit: true });
                //});
                $scope.transactions.loans.forEach(function (a) {
                    $scope.tableHeaders.push({ Name: a, IsData: true, Value: a, IsSavings: false, IsDeposit: true });
                });


                $scope.tableHeaders.push({ Name: "Net Collection", IsData: false, Value: "Net Collection", IsSavings: false });

                console.log($scope.tableHeaders);
                $scope.loadClicked = true;
                $scope.tableHeaders.forEach(function (t) {

                    if (t.IsDeposit) $scope.depositRowCount += 1;
                    if (t.IsWithdrawl) $scope.withdrawRowCount += 1;
                    $scope.ProductList.forEach(function (p) {
                        if (t.IsSavings) {
                            var prodId = t.Name.slice(0, -1);
                            if (p.Value == prodId) {
                                t.Value = p.Name;
                            }
                        }
                        if (p.Value == t.Name) t.Value = p.Name;

                    });
                });

                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }

        $scope.SaveTransaction = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            $("#loadingImage").css("display", "block");
            console.log($scope.saveNclose);
            if (!$scope.loadClicked) {
                swal("Please Load Transaction");
                return;
            }

            if ($scope.postTransaction.length > 1) {
                $scope.postTransaction.splice(0, 2);
            }

            delete $scope.groupTransactionsMain.$id;
            delete $scope.groupTransactions.$id;
            $scope.groupTransactions.ProgramOfficerId = $scope.programOfficerId;

            if ($scope.groupTransactions.IsEdit) {
                $scope.groupTransactionsMain.MemberTransactions.forEach(function (m) {
                    m.Transactions.forEach(function (s) {
                        t = $scope.groupTransactions.MemberTransactions
                            .filter(e => e.MemberId === m.MemberId)[0].Transactions
                            .filter(e => e.ProductId === s.ProductId)[0];
                        if (s.TotalAmount !== t.TotalAmount)
                            t.IsChanged = true;
                    });
                });
            }


            $scope.groupTransactions.MemberTransactions.forEach(function (t) {
                delete t.$id;
                t.BranchId = $rootScope.selectedBranchId;
                t.Transactions.forEach(function (s) {
                    delete s.$id;
                    s.TransactionDate = moment($scope.transaction.transactionDate).format();
                    s.ProductId = s.ProductId.slice(0, -1);
                });
            });
            $scope.groupTransactionsMain.MemberTransactions.forEach(function (t) {
                delete t.$id;
                t.Transactions.forEach(function (s) {
                    delete s.$id;
                    s.TransactionDate = moment($scope.transaction.transactionDate).format();
                    s.ProductId = s.ProductId.slice(0, -1);
                });
            });


            $scope.groupTransactionsMain.BranchWorkingDate = moment($rootScope.workingdate).format();
            $scope.groupTransactions.BranchWorkingDate = moment($rootScope.workingdate).format();
            $scope.postTransaction.push($scope.groupTransactionsMain);
            $scope.postTransaction.push($scope.groupTransactions);

            badDebtTransactionService.SaveTransaction($scope.postTransaction).then(function (response) {
                $("#loadingImage").css("display", "none");
                if (response.data.Success) {
                    if (!$scope.saveNclose) {
                        $scope.loadClicked = false;
                        $scope.loadGroupTransactions();
                    }
                    $rootScope.$broadcast('bad-debt-group-transaction-save-finished');
                    swal($rootScope.showMessage($rootScope.saveSuccess, $rootScope.groupTransactions), "Successful!", "success");
                    if ($scope.saveNclose) {
                        $scope.clearAndCloseTab();
                    }
                } else {
                    swal($rootScope.saveError, response.data.Message, "error");
                }

            }, AMMS.handleServiceError);

        }

        $scope.clearAndCloseTab = function () {
            $scope.transactions = {};
            $scope.groupList = [];
            $scope.tableHeaders = [];
            $scope.transactions.loans = [];
            $scope.transactions.savingsDeposits = [];
            $scope.transactions.savingsWithdrawl = [];
            $scope.groupTransactions = [];
            $scope.groupTransactionsMain = [];
            $scope.ProductList = [];
            $scope.postTransaction = [];
            $scope.removeTab($scope.tab);
        };

        $scope.getProductFilters = function () {
            transactionService.getProductFilters().then(function (response) {
                $scope.ProductList = response.data;
                $scope.loadGroupTransactions();

            }, AMMS.handleServiceError);
        }

        $scope.Init = function () {
            $scope.getGroupId();
            $scope.getProductFilters();
        };
        $scope.Init();


        $scope.getPropertyValueName = function (m, t) {
            var val = {};
            if (t.Name === "Member Name") val.x = m.DisplayName;
            //if (t.Name === "Primary Program Name") val.x = m.PrimaryProgramName;
            //if (t.Name === "Total Collection")
            //    val.x = m.TotalCollection;
            if (t.Name === "Net Collection")
                val.x = m.NetCollection;
            return val;
        }
    }]);