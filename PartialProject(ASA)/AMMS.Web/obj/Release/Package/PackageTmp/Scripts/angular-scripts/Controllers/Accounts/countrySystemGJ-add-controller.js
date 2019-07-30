ammsAng.controller('countrySystemGJAddController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'countrySystemGJService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, countrySystemGJService) {

        $scope.voucher = {};
        $scope.voucher.GlTransactions = [];
        $scope.filters = {};
        $scope.debitSum = 0;
        $scope.creditSum = 0;
        $scope.voucher.Paytochecked = 'NO';
        $scope.voucher.TransactionDate = moment($rootScope.workingdate).format('DD-MM-YYYY');
        $scope.previouslySelectedHead = "";
        $scope.data = [];


        $scope.$on('coa-node-label-double-clicked', function () {
            $scope.viewOptionModifier(true);
            $('#myModalHorizontal').modal('hide');
        });
       

        $scope.getTemplateUrl= function () {
            var url = window.location.origin;
            var paths = window.location.pathname.substring(1, window.location.pathname.length).split('/');
            for (var i = 0; i < paths.length; i++) {
                url += '/' + paths[i];
            }
            url = url + '/Content/BulkFileTemplate/BulkFormat.xlsx';
                window.open(url,'_blank');
        }

        $scope.init = function () {

            $scope.getFilterData();
            $scope.addHrmTransaction();
            $scope.addHrmTransaction();
            console.log($scope.voucher);
        }

        $scope.addHrmTransaction = function () {
            $scope.voucher.GlTransactions.push({
                Credit: 0,
                Debit: 0,
                AccountHeadValue: '',
                AccountHeadName: '',
                GlAccountId: '',
                GlAccount: {}
            });
        }
        $scope.removeTransaction = function (index) {
            if ($scope.voucher.GlTransactions.length < 3) {
                swal("at least two transactions required!");
                return;
            }
            $scope.voucher.GlTransactions.splice(index, 1);
        }

        $scope.sumDebit = function () {
            $scope.debitSum = 0;
            $scope.voucher.GlTransactions.forEach(function (tr) {

                $scope.debitSum += tr.Debit;
            });
        }
        $scope.sumCredit = function () {
            $scope.creditSum = 0;
            $scope.voucher.GlTransactions.forEach(function (tr) {
                $scope.creditSum += tr.Credit;
            });

        }
        $scope.debitCreditNonZeroMaker=function(index) {
            if ($scope.voucher.GlTransactions[index].Debit === null) $scope.voucher.GlTransactions[index].Debit = 0;
            if ($scope.voucher.GlTransactions[index].Credit === null) $scope.voucher.GlTransactions[index].Credit = 0;
        }
        $scope.getFilterData = function () {
            countrySystemGJService.getAddPageFilterData().then(function (response) {
                $scope.filters.AdministrativeDistricts = response.data.AdministrativeDistrict;
                $scope.filters.Entity = response.data.Entity;
                $scope.voucher.Entity = response.data.Entity[1].Value;
            });
        }
        $scope.loadDistrictwiseBranches = function (districtId, index) {
            countrySystemGJService.loadDistrictwiseBranches(districtId).then(function (response) {
                $scope.voucher.GlTransactions[index].Branches = response.data;
            });
        }
        $scope.viewOptionModifier = function (bool, index) {
            if (index === undefined || index === null) index = $scope.savedIndex;
            $scope.savedIndex = index;
            $rootScope.listViewShown = bool;
            // $rootScope.onlyChildSelectable = !bool;


            $rootScope.onlyChildSelectable = !bool;
            $rootScope.forAdd = !bool;
            $rootScope.officeType = !bool ? 2 : -1;
            $rootScope.coAModule = !bool ? 1 : -1;

            bool ? $rootScope.$broadcast('coa-popup-closed') :
            $rootScope.$broadcast('coa-popup-opened');

            if ($scope.previouslySelectedHead !== document.getElementById("myid").value) {
                $scope.voucher.GlTransactions[index].AccountHeadValue = document.getElementById("myid").value;
                $scope.voucher.GlTransactions[index].GlAccountId = document.getElementById("myid").value;
                $scope.voucher.GlTransactions[index].AccountHeadName = document.getElementById("myid").name;
                $scope.voucher.GlTransactions[index].AccountHeadCode = document.getElementById("myid").title;
                $scope.getGlAccountsDetails($scope.voucher.GlTransactions[index].GlAccountId, index);
            } else if (bool && $scope.previouslySelectedHead === document.getElementById("myid").value) {
                swal("nothing is selected!");
            }

            $scope.previouslySelectedHead = angular.copy(document.getElementById("myid").value);

        }

        //$scope.setVoucherType = function () {
        //    // var dcVouchers = $scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.VoucherType === 5);

        //    var dcVc = $scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.AccountSubType === 1);

        //    if (dcVc.length > 0) {
        //        $scope.voucher.VoucherType = dcVc.filter(gtr => gtr.Credit > 0).length > 0 ? 1 : 2;
        //        return;
        //    }
        //    $scope.voucher.VoucherType = 3;
        //}
        $scope.setVoucherType = function () {
            // var dcVouchers = $scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.VoucherType === 5);

            var dcVc = $scope.voucher.GlTransactions.filter(gtr =>(gtr.GlAccount.VoucherType === 1 || gtr.GlAccount.VoucherType === 2 || gtr.GlAccount.VoucherType === 5) && (gtr.GlAccount.AccountSubType === 1 || gtr.GlAccount.AccountSubType === 2));

            if (dcVc.length === 1) {
                $scope.voucher.VoucherType = dcVc.filter(gtr => gtr.Credit > 0).length > 0 ? 1 : 2;
                return;
            }
            if (dcVc.length > 1) {
                $scope.voucher.VoucherType = dcVc.filter(gtr =>gtr.AccountSubType === 1 && gtr.Credit > 0).length > 0 ? 1 : 2;
                return;
            }
            $scope.voucher.VoucherType = 3;
        }

        $scope.saveVoucher = function () {

            var roleWiseRestrictedTr = null;
            var somethingiswrongmrwong = false;
            $scope.voucher.GlTransactions.forEach(function (gtr, i) {
                if (gtr.AccountHeadCode === undefined || gtr.AccountHeadCode === null) {
                    swal("please select Account Head at  transaction No# " + (i + 1) + " before submitting !");
                    somethingiswrongmrwong = true;
                    return;
                }
                if (gtr.Debit === 0 && gtr.Credit === 0) {
                    swal("Debit and Credit both values are unset at transaction No# " + (i + 1));
                    somethingiswrongmrwong = true;
                    return;
                }
                if ($scope.debitSum !== $scope.creditSum) {
                    swal("Debit and Credit Sum is not Same!");
                    somethingiswrongmrwong = true;
                    return;
                }
                if (($scope.voucher.GlTransactions.filter(gtr => gtr.Credit > 0).length > 1) && ($scope.voucher.GlTransactions.filter(gtr => gtr.Debit > 0).length > 1)) {
                    swal("Multiple Credit GL heads with multiple Debit GL heads transation is not allowed!");
                    somethingiswrongmrwong = true;
                    return;
                }
                if ($scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.InterbranchHead && ((gtr.District === undefined || gtr.District === null) || (gtr.DistrictBranch === undefined || gtr.DistrictBranch === null))).length > 0) {
                    swal("please select District and Branch on Interbranch Account Head!");
                    somethingiswrongmrwong = true;
                    return;
                }
                if ($scope.voucher.GlTransactions.map(function (item) {
                    return item.GlAccountId;
                }).filter((v, i, a) => a.indexOf(v) === i).length !== $scope.voucher.GlTransactions.map(function (item) {
                    return item.GlAccountId;
                }).length) {
                    swal("repeating same account head in multiple transactions is not allowed!");
                    somethingiswrongmrwong = true;
                    return;
                }
                if (gtr.GlAccount.ManualEntryRole.split(',').filter(g => g === $rootScope.user.Role).length < 1) {
                    roleWiseRestrictedTr = gtr;
                }
            });

            if (roleWiseRestrictedTr !== null) {
                swal("The following transaction head (" + roleWiseRestrictedTr.GlAccount.Code + ") is not allowed for current user! please remove this transaction before submitting voucher!");
                return;
            }
            if (somethingiswrongmrwong) return;
            swal({
                title: 'voucher will be added with amount: ' + $scope.debitSum + '! Are you sure?',
                //text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.GeneralJournal),
                //text: 'voucher will be added with amount: ' + $scope.debitSum+'! Are you sure?',
                showCancelButton: true,
                confirmButtonText: "yes,Create it!",
                cancelButtonText: "No,Cancel!",
                type: 'info',
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.voucher.TransactionDate = moment($rootScope.workingdate).format();
                    $scope.voucher.BranchCode = $rootScope.selectedBranchId;
                    $scope.voucher.PostedBranchCode = $rootScope.selectedBranchId;
                    $scope.voucher.BranchWorkingDate = moment($rootScope.workingdate).format();
                    $scope.setVoucherType();
                    $scope.voucher.VoucherGroup = $scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.VoucherGroup === 1).length > 0 ? 1 :
                    2;

                    $scope.voucher.GlTransactions.forEach(function (gtr) {
                        gtr.BankAccountId = gtr.BankAccount;
                        gtr.BankAccount = gtr.BankAccountName;
                    });

                    countrySystemGJService.addGeneralJournal($scope.voucher).then(function (response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('voucher-add-finished');
                            swal({
                                //title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.GeneralJournal),
                                title: response.data.Message + $scope.debitSum,
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
                                        $timeout(function () { $scope.clearModelData(); }, 300);
                                    } else {
                                        $timeout(function () { $scope.clearAndCloseTab(); }, 300);
                                    }
                                });
                        } else {

                            swal($rootScope.showMessage($rootScope.addError, $rootScope.GeneralJournal), response.data.Message, "error");
                        }
                    });
                }
            });


            //$scope.voucher.GlTransactions.forEach(function (gtr, i) {
            //    if (gtr.AccountHeadCode === undefined || gtr.AccountHeadCode === null) {
            //        swal("please select Account Head at  transaction No# " + (i + 1) + " before submitting !");
            //        return;
            //    }
            //    if (gtr.Debit === 0 && gtr.Credit === 0) {
            //        swal("Debit and Credit both values are unset at transaction No# " + (i + 1));
            //        return;
            //    }
            //    if ($scope.debitSum !== $scope.creditSum) {
            //        swal("Debit and Credit Sum is not Same!");
            //        return;
            //    }
            //    if (($scope.voucher.GlTransactions.filter(gtr => gtr.Credit > 0).length > 1) && ($scope.voucher.GlTransactions.filter(gtr => gtr.Debit > 0).length > 1)) {
            //        swal("Multiple Credit GL heads with multiple Debit GL heads transation is not allowed!");
            //        return;
            //    }
            //    if ($scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.InterbranchHead && ((gtr.District === undefined || gtr.District === null) || (gtr.DistrictBranch === undefined || gtr.DistrictBranch === null))).length > 0) {
            //        swal("please select District and Branch on Interbranch Account Head!");
            //        return;
            //    }
            //    if ($scope.voucher.GlTransactions.map(function (item) {
            //        return item.GlAccountId;
            //    }).filter((v, i, a) => a.indexOf(v) === i).length !== $scope.voucher.GlTransactions.map(function (item) {
            //        return item.GlAccountId;
            //    }).length) {
            //        swal("repeating same account head in multiple transactions is not allowed!");
            //        return;
            //    }

            //    swal({
            //        title: "confirm?",
            //        //text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.GeneralJournal),
            //        text: 'voucher will be added with amount: ' + $scope.debitSum + '! Are you sure?',
            //        showCancelButton: true,
            //        confirmButtonText: "yes,Create it!",
            //        cancelButtonText: "No,Cancel!",
            //        type: 'info',
            //        closeOnConfirm: false,
            //        showLoaderOnConfirm: true
            //    }, function (isConfirmed) {
            //        if (isConfirmed) {
            //            $scope.voucher.TransactionDate = moment($scope.voucher.TransactionDate).format();
            //            $scope.voucher.BranchCode = $scope.voucher.Entity;
            //            $scope.voucher.PostedBranchCode = $rootScope.selectedBranchId;
            //            $scope.voucher.BranchWorkingDate = moment($rootScope.workingdate).format();
            //            $scope.setVoucherType();
            //            $scope.voucher.VoucherGroup = $scope.voucher.GlTransactions.filter(gtr => gtr.GlAccount.VoucherGroup === 1).length > 0 ? 1 :
            //            2;

            //            countrySystemGJService.addGeneralJournal($scope.voucher).then(function (response) {
            //                if (response.data.Success) {
            //                    $rootScope.$broadcast('voucher-add-finished');
            //                    swal({
            //                        //title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.GeneralJournal),
            //                        title: response.data.Message + $scope.debitSum,
            //                        text: "What do you want to do next?",
            //                        type: "success",
            //                        showCancelButton: true,
            //                        confirmButtonColor: "#008000",
            //                        confirmButtonText: "Add New",
            //                        cancelButtonText: "Close and Exit",
            //                        closeOnConfirm: true,
            //                        closeOnCancel: true
            //                    },
            //                        function (isConfirmed) {
            //                            if (isConfirmed) {
            //                                $timeout(function () { $scope.clearModelData(); }, 300);
            //                            } else {
            //                                $timeout(function () { $scope.clearAndCloseTab(); }, 300);
            //                            }
            //                        });
            //                } else {

            //                    swal($rootScope.showMessage($rootScope.addError, $rootScope.GeneralJournal), response.data.Message, "error");
            //                }
            //            });
            //        }
            //    });

            //});
        }

        $scope.getGlAccountsDetails = function (accountId, index) {
            countrySystemGJService.getGlAccountById(accountId,$rootScope.selectedBranchId).then(function (response) {
                $scope.voucher.GlTransactions[index].GlAccount = response.data;
                $scope.voucher.GlTransactions[index].District = null;
                $scope.voucher.GlTransactions[index].DistrictBranch = null;
                if (response.data.InterbranchHead) {
                    $scope.getAdministrativeDistrictIdByBranchId(index);
                }
                
                if (response.data.BankAccountId !== null) {
                    $scope.voucher.GlTransactions[index].BankAccount = response.data.BankAccountId;
                    $scope.voucher.GlTransactions[index].BankAccountName = response.data.BankAccountName;
                }
            });
        }
      
        $scope.getAdministrativeDistrictIdByBranchId = function (index) {
            countrySystemGJService.getAdministrativeDistrictIdByBranchId($rootScope.selectedBranchId).then(function (response) {
                $scope.voucher.GlTransactions[index].District = response.data;
                if (response.data !== null) $scope.loadDistrictwiseBranches(response.data, index);
            });
        }

        $scope.clearModelData = function () {
            $scope.voucher = {};
            $scope.voucher.GlTransactions = [];
            $scope.filters = {};
            $scope.debitSum = 0;
            $scope.creditSum = 0;
            $scope.voucher.Paytochecked = 'NO';
            $scope.voucher.TransactionDate = moment($rootScope.workingdate).format('DD-MM-YYYY');
            $scope.addHrmTransaction();
            $scope.addHrmTransaction();
        }
        $scope.clearAndCloseTab = function () {
            $scope.voucher = {};

            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

        $scope.init();

        //date picker

        $scope.today = function () {
            $scope.voucher.TransactionDate = new Date($rootScope.workingdate);
           
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
        $scope.dateOptionsDOB = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date($rootScope.workingdate),
            //minDate: new Date($rootScope.workingdate),
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

        $scope.openTDatePop = function () {
            $scope.tdate.opened = true;
        };
       

        // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.tdate = {
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
        $scope.tDateValidator = function () {
            if ($scope.voucher.TransactionDate === undefined || $scope.voucher.TransactionDate === null) {
                swal("please select a date!");
                return;
            }
            //if (($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5) &&
            //     (moment($scope.eaccount.OpeningDate).valueOf() > maxDate || moment($scope.eaccount.OpeningDate).valueOf() < minDate)) {
            //     swal("please select valid date!");
            //     $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
            //     return;
            // }
        }

        // test purpose for excel import

        $scope.importData = function () {
            $("#loadingImage").css("display", "block");
           // $scope.readData();
            if ($scope.data.length > 0) {
                $scope.voucher.GlTransactions = [];
                var obj = {};
                var invalidData = false;
                $scope.data.forEach(function (d, index) {
                    invalidData = d['GL Account / Description'] === undefined ? true : false;

                    if (invalidData) {
                        swal("please make sure imported file is in proper format!");
                        return;
                    }
                    var accountCode = d['GL Account / Description'].split(':')[0];
                    if (accountCode === undefined || accountCode === '') {
                        // swal("Specified account Head at row number " + index + " not found!");
                        swal("No account Head specified  at row number: " + index);
                        $("#loadingImage").css("display", "none");
                        return;
                    }
                    var glAccount = {};
                    countrySystemGJService.getGlAccountByCode(accountCode).then(function(response) {
                        glAccount = response.data;
                        if (glAccount === null) {
                            swal("Specified account Head at row number " + index + " not found!");
                            invalidData = true;
                            $scope.voucher.GlTransactions = [];
                            $("#loadingImage").css("display", "none");
                            return;
                        }
                        obj = {
                            Credit: d.Credit !== undefined ? parseInt(d.Credit) : 0,
                            Debit: d.Debit !== undefined ? parseInt(d.Debit) : 0,
                            AccountHeadCode: d['GL Account / Description'].split(':')[0],
                            AccountHeadName: d['GL Account / Description'].split(':')[1],
                            GlAccountId: glAccount.Id,
                            GlAccount: glAccount,
                            ChequeNumber: d['Cheque No']!==undefined?d['Cheque No']:''

                        }
                        if (!(obj.Debit === undefined && obj.Credit === undefined)) {
                            $scope.voucher.GlTransactions.push(obj);
                        }
                        $scope.sumDebit();
                        $scope.sumCredit();
                        //if (response.data.InterbranchHead) {
                        //    $scope.getAdministrativeDistrictIdByBranchId(index);
                        //}
                    });
                    $("#loadingImage").css("display", "none");

                });
                if (invalidData) {
                   $scope.addHrmTransaction();
                   $scope.addHrmTransaction();
                   $("#loadingImage").css("display", "none");
                   return;
               }
                console.log($scope.voucher);
            } else {
                swal("please select a valid file first to import!");
                $("#loadingImage").css("display", "none");
                return;
            }
            $("#loadingImage").css("display", "none");
            
            }

        
        $scope.readData = function () {
            /*Checks whether the file is a valid excel file*/
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
            var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($("#ngexcelfile").val().toLowerCase().indexOf(".xlsx") > 0) {
                xlsxflag = true;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                if (xlsxflag) {
                    var workbook = XLSX.read(data, { type: 'binary' });
                }
                else {
                    var workbook = XLS.read(data, { type: 'binary' });
                }

                var sheet_name_list = workbook.SheetNames;
                var cnt = 0;
                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/

                    if (xlsxflag) {
                        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                    }
                    else {
                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                    }
                    if (exceljson.length > 0) {
                        $scope.data = [];
                        for (var i = 0; i < exceljson.length; i++) {
                            $scope.data.push(exceljson[i]);
                            $scope.$apply();
                        }
                    }
                });
                $scope.importData();
            }
            if (xlsxflag) {
                reader.readAsArrayBuffer($("#ngexcelfile")[0].files[0]);
            }
            else {
                reader.readAsBinaryString($("#ngexcelfile")[0].files[0]);
            }
            console.log($scope.data);
        };

    }]);