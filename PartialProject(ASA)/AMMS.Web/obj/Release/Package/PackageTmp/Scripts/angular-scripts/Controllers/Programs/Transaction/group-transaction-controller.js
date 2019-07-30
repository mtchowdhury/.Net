ammsAng.controller('groupTransactionController', ['$scope', '$rootScope', '$timeout', 'transactionService', 'commonService', 'DTOptionsBuilder', 'workingDayService',
    function ($scope, $rootScope, $timeout, transactionService, commonService, DTOptionsBuilder, workingDayService) {
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
            $scope.hasErrors = false;
            $scope.programOfficerId = 0;
            $scope.transaction.transactionDate = $rootScope.workingdate;
            $scope.roleId = $rootScope.user.Role;
            $scope.depositRowCount = 0;
            $scope.withdrawRowCount = 0;
            $scope.oldValue = 0;
        }
        declarevariables();
        var purple = "#BF55EC";
        var red = "#F08080";
        var orange = "#f46e42";
        var white = "#ffffff";
        var greenAdvance = "#5cc45c";
        var greenSaved = "#90EE90";
        var fullPaidColor = "#FF9479";
        var grey = "#D3D3D3";

        //TODO We Dont have a PropertyId field in Property Table // Need To update these PropertyIds after EDMX update
        $scope.props = {
            "PropertyName": "Loan_Account",
            "DisplayName": "Loan Account",
            "FormName": "Loan_Account",
            "FormType": "List",
            "PropertyId": 1025
        };
        $scope.savingsProps = {
            "PropertyName": "SAVINGS_ACCOUNT",
            "DisplayName": "Savings Account",
            "FormName": "SAVINGS_ACCOUNT",
            "FormType": "List",
            "PropertyId": 1034
        };
        $scope.securityProps = {
            "PropertyName": "SAVINGS_ACCOUNT",
            "DisplayName": "Security Account",
            "FormName": "SAVINGS_ACCOUNT",
            "FormType": "List",
            "PropertyId": 1035
        };

        $scope.beforeDateRender = function ($dates) {
            var maxDate = new Date($rootScope.workingdate);
            var minDate = new Date("01-01-1971");
            if ($scope.roleId == $rootScope.rootLevel.LO) {
                maxDate.setDate(maxDate.getDate() + 1);
                maxDate = new Date(maxDate).setHours(0, 0, 0, 0);
                minDate.setDate(minDate.getDate() + 1);
                minDate = new Date(minDate).setHours(0, 0, 0, 0);
            }
            else if ($scope.roleId == $rootScope.rootLevel.RM) {
                maxDate.setDate(maxDate.getDate() + 1);
                maxDate = new Date(maxDate).setHours(0, 0, 0, 0);
                minDate.setDate(minDate.getDate() - 29);
                minDate = new Date(minDate).setHours(0, 0, 0, 0);
            }
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate.setDate(maxDate.getDate() + 1);
                maxDate = new Date(maxDate).setHours(0, 0, 0, 0);
                minDate.setDate(minDate.getDate() - 89);
                minDate = new Date(minDate).setHours(0, 0, 0, 0);
            } else {
                maxDate.setDate(maxDate.getDate() + 1);
                maxDate = new Date(maxDate).setHours(0, 0, 0, 0);
                minDate = new Date(0, 0, 0, 0, 0, 0);
                minDate = new Date(minDate).setHours(0, 0, 0, 0);
            }
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        if ($dates[d].utcDateValue < minDate || $dates[d].utcDateValue > maxDate) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }
        }

        $scope.getGroupId = function () {
            console.log($scope.selectedMenu);
            if ($scope.selectedMenu.ParentName === "GROUP TYPE") {
                $scope.groupList.push({ Name: $scope.selectedMenu.Name, Value: $scope.selectedMenu.Id });
                $scope.transaction.groupId = $scope.groupList[0].Value;
                $scope.programOfficerId = $scope.selectedMenu.ProgramOfficerId;
            } else {
                $scope.groupList = $scope.groupNames.filter(gr => gr.ProgramOfficerId === $scope.selectedMenu.Id && (gr.GroupTypeId == $rootScope.GroupTypes.GENERAL || gr.GroupTypeId == $rootScope.GroupTypes.SPECIAL));
                $scope.transaction.groupId = $scope.groupList[0].Value;
                $scope.programOfficerId = $scope.selectedMenu.Id;
                console.log($scope.groupNames, $scope.selectedMenu.Id);
            }
        }
        $scope.getWarning = function (m, headerId) {
            if (m.MemberId === -10000) return false;
            var transaction = m.Transactions.filter(e => e.ProductId === headerId)[0];
            if (transaction) {
                var productType = m.Transactions.filter(e => e.ProductId === headerId)[0].ProductType;

                var highestCollection = m.Transactions.filter(e => e.ProductId === headerId)[0].HighestCollection;
                var totalAmount = m.Transactions.filter(e => e.ProductId === headerId)[0].TotalAmount;
                var toBeGivenAmount = m.Transactions.filter(e => e.ProductId === headerId)[0].toBeGivenAmount;
                var isEdit = m.Transactions.filter(e => e.ProductId === headerId)[0].IsEdit;
                var isDeposit = m.Transactions.filter(e => e.ProductId === headerId)[0].IsDeposit;

                if (productType === 1 && totalAmount > toBeGivenAmount && totalAmount < highestCollection) {
                    console.log(totalAmount, highestCollection, toBeGivenAmount);
                    transaction.CellColor = greenAdvance;
                    return false;
                }
                if (productType === 1 && totalAmount === toBeGivenAmount) {
                    if (!transaction.IsEdit) transaction.CellColor = white;
                    if (transaction.IsEdit) transaction.CellColor = greenSaved;
                    return false;
                }


                if (totalAmount < toBeGivenAmount && isDeposit) {
                    //console.log(totalAmount, highestCollection, toBeGivenAmount);
                    transaction.CellColor = purple;
                    return false;
                }
                //if (totalAmount > toBeGivenAmount) {
                //    //console.log(totalAmount, highestCollection, toBeGivenAmount);
                //    transaction.CellColor = greenAdvance;

                //}

                if (totalAmount === toBeGivenAmount) {
                    //console.log(totalAmount, highestCollection, toBeGivenAmount);
                    if (!transaction.IsEdit) transaction.CellColor = white;
                    if (transaction.IsEdit) transaction.CellColor = greenSaved;
                    return false;
                }
                if (totalAmount === 0 && toBeGivenAmount !== 0) {
                    //console.log(totalAmount, highestCollection, toBeGivenAmount);
                    if (!transaction.IsEdit) transaction.CellColor = white;
                    if (transaction.IsEdit) transaction.CellColor = greenSaved;
                    return false;
                }
                if (transaction.isFullPaid) transaction.CellColor = fullPaidColor;
            }
            return false;
        }


        $scope.updateSummation = function (m,headerId, val) {
            var totalAmount = m.Transactions.filter(e => e.ProductId === headerId)[0].TotalAmount;
            var sum = $scope.groupTransactions.MemberTransactions.filter(e => e.MemberId === -10000)[0];
            var field = sum.Transactions.filter(e => e.ProductId === headerId)[0];
            field.TotalAmount += totalAmount - parseInt(val);
            $scope.setSingleTransation(sum);
        };


        $scope.TransactionValidator = function (m, headerId) {


            var productType = m.Transactions.filter(e => e.ProductId === headerId)[0].ProductType;
            var highestCollection = m.Transactions.filter(e => e.ProductId === headerId)[0].HighestCollection;
            var totalAmount = m.Transactions.filter(e => e.ProductId === headerId)[0].TotalAmount;
            var IsTermOverdue = m.Transactions.filter(e => e.ProductId === headerId)[0].IsTermOverdue;
            var isDeposit = m.Transactions.filter(e => e.ProductId === headerId)[0].IsDeposit;
            var productCategory = m.Transactions.filter(e => e.ProductId === headerId)[0].Productcategory;
            var savingsBalance = m.Transactions.filter(e => e.ProductId === headerId)[0].SavingsBalance;
            var toBeSavedBalance = m.Transactions.filter(e => e.ProductId === headerId)[0].toBeSavedBalance;
            var installmentCount = m.Transactions.filter(e => e.ProductId === headerId)[0].InstallmentCount;
            var toBeGivenAmount = m.Transactions.filter(e => e.ProductId === headerId)[0].toBeGivenAmount;
            var minimumBalance = m.Transactions.filter(e => e.ProductId === headerId)[0].MinimumBalance;
            var outstanding = m.Transactions.filter(e => e.ProductId === headerId)[0].OutstandingAmount;
            var defaultTotal = m.Transactions.filter(e => e.ProductId === headerId)[0].DefaultTotalAmount;
            var overdue = m.Transactions.filter(e => e.ProductId === headerId)[0].OverdueAmount;
            var lastTransactionDate = moment(m.Transactions.filter(e => e.ProductId === headerId)[0].LastTransactionDate).format('DD-MM-YYYY');
            var role = $rootScope.user.Role;
            var validatorObj = {};


            


            var invalidDate = new Date('01-01-2001');
            if (productType === $rootScope.ProductType.Savings && productCategory === $rootScope.SavingsConfig.SavingsType.LTS.toString()
                && moment(lastTransactionDate).format('DD-MM-YYYY') !== moment(invalidDate).format('DD-MM-YYYY')) {
                // last transaction date coming from backend is in the format of 'mm-dd-yyyy',
                //so taking 'dd-yyyy' in front end will capture acual mm-yyyy

                var monthYear = moment(lastTransactionDate).format('DD-YYYY');
                var workingdayMonthYear = moment($rootScope.workingdate).format('MM-YYYY');
                if (monthYear === workingdayMonthYear && totalAmount !== 0) {

                    validatorObj.message = "$$$Transaction in this month done";
                    m.Transactions.filter(e => e.ProductId === headerId)[0].TotalAmount = 0  //LTS ekbar deya hoye gele 0
                    return validatorObj;
                }
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


            if (role !== $rootScope.UserRole.Admin && productType === $rootScope.ProductType.Loan && totalAmount > highestCollection) {
                if (totalAmount === outstanding) return true;
                if (IsTermOverdue) return true;
                validatorObj.message = "$$$Advance more than One Installment";
                return validatorObj;
            }


            //CBS withdrawl cannot be gretaer than 4000 (CBS MAx Amount)
            if (productType === $rootScope.ProductType.Savings && productCategory === $rootScope.SavingsConfig.SavingsType.CBS.toString() && isDeposit && highestCollection != null && totalAmount > highestCollection) {
                validatorObj.message = "$$$Deposit > " + highestCollection;
                if (highestCollection>0) return validatorObj;
            }
            //LTS cannot deposit more than premium amount 
            if (role === $rootScope.UserRole.LO && productType === $rootScope.ProductType.Savings && productCategory === $rootScope.SavingsConfig.SavingsType.LTS.toString() && isDeposit && highestCollection != null && (totalAmount !== highestCollection && totalAmount !== 0)) {
                validatorObj.message = "$$$Deposit != premium" + "(" + highestCollection + ")";
                return validatorObj;
            }
            if (role !== $rootScope.UserRole.LO && productType === $rootScope.ProductType.Savings && productCategory === $rootScope.SavingsConfig.SavingsType.LTS.toString() && isDeposit && highestCollection != null && (totalAmount % highestCollection !== 0)) {
                validatorObj.message = "$$$Deposit != premium" + "(" + highestCollection + ")";
                return validatorObj;
            }


            // check for LTS count more than 120
            if (installmentCount) {
                if (productType === $rootScope.ProductType.Savings && productCategory === $rootScope.SavingsConfig.SavingsType.LTS.toString() && isDeposit && installmentCount > 120) {
                    validatorObj.message = "$$$Deposit > 120";
                    return validatorObj;
                }
            }

            //cannot withdraw any amount from LTS unless admin

            if (role !== $rootScope.UserRole.Admin && productType === $rootScope.ProductType.Savings && productCategory === $rootScope.SavingsConfig.SavingsType.LTS.toString() && !isDeposit && totalAmount > 0) {
                validatorObj.message = "$$$Withdraw not Allowed";
                return validatorObj;
            }

            //cannot disposit more than the premium amount in LTS
            if (productType === $rootScope.ProductType.Savings && productCategory === $rootScope.SavingsConfig.SavingsType.LTS.toString() && isDeposit && highestCollection != null && totalAmount > highestCollection) {
                validatorObj.message = "$$$Deposit > Premium";
                return validatorObj;
            }

            return true;
        }

        $scope.openLoanAccounts = function (props, tab, member) {
            $scope.selectedMenu.GroupId = $scope.groupTransactions.GroupId;
            $scope.selectedMenu.Id = member.MemberId;
            $scope.props.id = "13_" + member.MemberName.replace(/ /g, '_') + member.MemberId + "_prop_1025";
            $scope.openPropTab(props, tab);
        }

        $scope.openSavingsAccounts = function (savingsProps, tab, member) {
            $scope.selectedMenu.Id = member.MemberId;
            $scope.savingsProps.id = "13_" + member.MemberName.replace(/ /g, '_') + member.MemberId + "_prop_1034";
            $scope.openPropTab(savingsProps, tab);
        }

        $scope.openSecurityAccounts = function (securityProps, tab, member) {
            $scope.selectedMenu.Id = member.MemberId;
            $scope.securityProps.id = "13_" + member.MemberName.replace(/ /g, '_') + member.MemberId + "_prop_1035";
            $scope.openPropTab(securityProps, tab);
        }

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
            if (m.MemberActiveState)
                return ( transaction.AccountActiveStatus);
            else return m.MemberActiveState;

        }

        $scope.setSingleTransation = function (m) {
            var total = 0;
            var net = 0;
            var balance = 0;

            m.Transactions.forEach(function (transaction) {
                if (transaction.IsDeposit) {
                    total += transaction.TotalAmount;
                    net += transaction.TotalAmount;
                    if (transaction.ProductType === 2) balance += transaction.TotalAmount;
                } else {
                    net -= transaction.TotalAmount;
                    if (transaction.ProductType === 2) balance -= transaction.TotalAmount;
                }

                transaction.toBeSavedBalance = balance;
            });
            m.TotalCollection = total;
            m.NetCollection = net;
        };

        $scope.depositFilter = function () {
            return function (item) {
                if (item.IsDeposit && item) {
                    return true;
                }
                return false;
            };
        }

        $scope.loadGroupTransactions = function () {
            //if ($scope.loadClicked) return true;
            $("#loadingImage").css("display", "block");
            //$scope.getWarning();
            if (!$scope.transaction.groupId) swal("select a group!");
            if (!$scope.transaction.transactionDate) swal("Select a date");
            $scope.groupTransactions.BranchWorkingDate = moment($rootScope.workingdate).format();
            $scope.transaction.transactionDate = moment($scope.transaction.transactionDate).format();
            $scope.depositRowCount = 0;
            $scope.withdrawRowCount = 0;
            transactionService.getTransactionsOfGroup($scope.transaction.groupId, $scope.transaction.transactionDate, $scope.groupTransactions.BranchWorkingDate, $rootScope.selectedBranchId).then(function (response) {
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
                $scope.cbsMaxAmount = $scope.groupTransactions.HighestCbsDeposit;
                $scope.branchHolidayAndOffDay = $scope.groupTransactions.Holidays;


                

                $scope.groupTransactions.MemberTransactions.forEach(function (m) {

                    if (!m.MemberActiveState) m.RowColor = red; // red color for inactive users
                    m.Transactions.forEach(function (s) {
                        if (s.ProductType === 2 && s.IsDeposit === true) {
                            $scope.transactions.savingsDeposits.push(s.ProductId);
                        }
                        if (s.ProductType === 2 && s.IsDeposit === false) {
                            $scope.transactions.savingsWithdrawl.push(s.ProductId);
                        }
                        if (s.ProductType === 1) {
                            $scope.transactions.loans.push(s.ProductId);
                        }
                        s.memberActiveStatus = m.MemberActiveState;
                        s.toBeGivenAmount = angular.copy(s.TotalAmount);

                    });
                });

                $scope.summationRow = $scope.groupTransactions.MemberTransactions.filter(e => e.MemberId === -10000)[0];
                $scope.setSingleTransation($scope.summationRow);
                $scope.summationRow.RowColor =grey ;
                $scope.summationRow.Transactions.forEach(function (t) { t.CellColor = grey;});

                $scope.transactions.savingsDeposits = $scope.transactions.savingsDeposits.filter((v, i, a) => a.indexOf(v) === i);
                $scope.transactions.savingsWithdrawl = $scope.transactions.savingsWithdrawl.filter((v, i, a) => a.indexOf(v) === i);
                $scope.transactions.savingsDeposits.sort();
                $scope.transactions.savingsWithdrawl.sort();
                $scope.transactions.loans = $scope.transactions.loans.filter((v, i, a) => a.indexOf(v) === i);
                $scope.transactions.loans.sort();
                $scope.tableHeaders.push({ Name: "Primary Program Name", IsData: false, Value: "Primary Program", IsSavings: false, IsPromaryProgramName: true });

                $scope.transactions.savingsDeposits.forEach(function (a) {

                    $scope.tableHeaders.push({ Name: a, IsData: true, Value: a, IsSavings: true, IsDeposit: true });
                });
                $scope.transactions.loans.forEach(function (a) {
                    $scope.tableHeaders.push({ Name: a, IsData: true, Value: a, IsSavings: false, IsDeposit: true });
                });
                $scope.tableHeaders.push({ Name: "Total Collection", IsData: false, Value: "Total Collection", IsSavings: false });
                $scope.transactions.savingsWithdrawl.forEach(function (a) {
                    $scope.tableHeaders.push({ Name: a, IsData: true, Value: a, IsSavings: true, IsWithdrawl: true });
                });
                $scope.tableHeaders.push({ Name: "Net Collection", IsData: false, Value: "Net Collection", IsSavings: false });
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
        $scope.validateBeforeSave = function () {
            var deposit = 0;
            var sbalance = 0;
            var withdraw = 0;
            $scope.groupTransactions.MemberTransactions.forEach(function (mt) {
                //if (mt.NetCollection < 0) {
                //    swal("Please fix the erros");
                //    $scope.hasErrors = true;
                //               return;
                //}

                mt.Transactions.forEach(function (st) {
                    if (st.ProductId.slice(-1) === 'd') {
                        deposit = st.TotalAmount;
                        sbalance = st.SavingsBalance;
                        var wProductId = st.ProductId.slice(0, -1).toString() + 'w';
                        var withdraw = mt.Transactions.filter(p => p.ProductId === wProductId)[0].TotalAmount;
                        if (sbalance && deposit && withdraw) {
                            if (deposit + sbalance - withdraw < 0) {
                                swal("saving balance is < 0 for member " + mt.MemberName + "");

                                $scope.hasErrors = true;
                                //$("#loadingImage").css("display", "none");
                                //return;
                            } else $scope.hasErrors = false;
                            //$("#loadingImage").css("display", "none");
                        }
                    }
                });
            });
            $("#loadingImage").css("display", "none");
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
        $scope.formatForSave = function () {


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

        }
        $scope.SaveTransaction = function () {
            $scope.validateBeforeSave();
            //$scope.TransactionValidator();
            //if ($scope.validatorObj.message !== null) {
            //    swal("Please fix erros!");
            //    return;
            //}
            if ($scope.hasErrors) {
                $("#loadingImage").css("display", "none");
                return;
            }
            var diff = moment($rootScope.workingdate).diff(moment($scope.transaction.transactionDate), 'days');
            if ($scope.roleId == $rootScope.rootLevel.LO) {
                if (diff >= 1) {
                    swal("LO Cannot Save old Transaction");
                    return;
                }
            }
            if ($scope.roleId == $rootScope.rootLevel.RM) {
                if (diff >= 30) {
                    swal("RM Cannot Save more than 30 days old Transaction");
                    return;
                }
            }
            if ($scope.roleId == $rootScope.rootLevel.DM) {
                if (diff >= 90) {
                    swal("DM Cannot Save more than 90 days old Transaction");
                    return;
                }
            }

            if (!$rootScope.isDayOpenOrNot()) return;
            $("#loadingImage").css("display", "block");
            console.log($scope.saveNclose);
            if (!$scope.loadClicked) {
                swal("Please Load Transaction");
                return;
            }


            swal({
                title: $rootScope.showMessage($rootScope.saveConfirmation, $rootScope.groupTransactions),
                showCancelButton: true,
                confirmButtonText: "Yes, Save it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function (isConfirmed) {
                    if (isConfirmed) {
                        $scope.formatForSave();
                        transactionService.SaveTransaction($scope.postTransaction, $rootScope.selectedBranchId).then(function (response) {
                            $("#loadingImage").css("display", "none");
                            if (response.data.Success) {
                                if (!$scope.saveNclose) {
                                    $scope.loadClicked = false;
                                    $scope.loadGroupTransactions();
                                }
                                $rootScope.$broadcast('grop-transaction-save-finished');
                                swal($rootScope.showMessage($rootScope.saveSuccess, $rootScope.groupTransactions), "Successful!", "success");
                                if ($scope.saveNclose) {
                                    $scope.clearAndCloseTab();
                                }
                                $("#loadingImage").css("display", "none");
                            } else {
                                swal($rootScope.saveError, response.data.Message, "error");
                                $scope.loadGroupTransactions();
                                $("#loadingImage").css("display", "none");
                            }

                        }, AMMS.handleServiceError);
                    } else {
                        swal("Cancelled", "something is wrong", "error");
                        $("#loadingImage").css("display", "none");
                    }
                });


        }


        $scope.getProductFilters = function () {
            transactionService.getProductFilters().then(function (response) {
                $scope.ProductList = response.data;
                $scope.loadGroupTransactions();

            }, AMMS.handleServiceError);
        }

        $scope.Init = function () {
            $scope.getGroupId();
            $scope.getProductFilters();
            //$scope.loadGroupTransactions();
        };
        $scope.Init();


        $scope.getPropertyValueName = function (m, t) {
            var val = {};
            if (t.Name === "Member Name") val.x = m.DisplayName;
            if (t.Name === "Primary Program Name") val.x = m.PrimaryProgramName;
            if (t.Name === "Total Collection")
                val.x = m.TotalCollection;
            if (t.Name === "Net Collection")
                val.x = m.NetCollection;
            return val;
        }
    }]);