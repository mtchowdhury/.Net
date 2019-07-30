ammsAng.controller('bankaccountDetailsEditController', ['$scope', '$rootScope', 'commonService', '$timeout', 'bankAccountDetailsService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'generalJournalService',
    function ($scope, $rootScope, commonService, $timeout, bankAccountDetailsService, DTOptionsBuilder, DTColumnDefBuilder, generalJournalService) {
        $scope.Bank = {};
        $scope.StatusList = [];
        $scope.bankObject = angular.copy($rootScope.bankObject);
        delete $rootScope.bankObject;
        $scope.specialRegex = /[^a-zA-Z0-9\-\/]/;

        $scope.roleId = $scope.user.Role.toString();
        $scope.roleId = $rootScope.user.Role;

        $scope.init = function () {

            $scope.StatusList.push({
                Name: 'Open',
                Value: 'Open'
            });
            if ($scope.bankObject.BankAccountId!==0) $scope.StatusList.push({
                Name: 'Close',
                Value: 'Close'
            });
            $scope.setDefaults();
        }
        $scope.setDefaults=function() {
            if ($scope.bankObject.BankAccountId!==0) {
                $scope.Bank.AccountNumber = $scope.bankObject.AccountNumber;
                $scope.Bank.Type = $scope.bankObject.Type;
                $scope.Bank.BankName = $scope.bankObject.BankName;
                $scope.Bank.BankBranch = $scope.bankObject.BankBranch;
                $scope.Bank.OpeningDateDT = $scope.getDateTimeObjectFromWiredFormattedString($scope.bankObject.OpeningDate);
                $scope.Bank.OpeningDateDTBackup = $scope.getDateTimeObjectFromWiredFormattedString($scope.bankObject.OpeningDate);
                $scope.Bank.MinimumBalance = $scope.bankObject.MinimumBalance;
                $scope.Bank.MaximumBalance = $scope.bankObject.MaximumBalance;
                $scope.Bank.Status = $scope.bankObject.Status;
                $scope.Bank.ClosingDateDT = $scope.bankObject.ClosingDate !== '' ? $scope.getDateTimeObjectFromWiredFormattedString($scope.bankObject.ClosingDate) : null;
                $scope.Bank.Notes = $scope.bankObject.Notes;

            } else {
                $scope.Bank.AccountNumber = '';
                $scope.Bank.Type = $scope.bankObject.Type;
                $scope.Bank.BankName = '';
                $scope.Bank.BankBranch = '';
                $scope.Bank.OpeningDateDT = new Date($rootScope.workingdate);
                $scope.Bank.MinimumBalance =100;
                $scope.Bank.MaximumBalance = 10000000000;
                $scope.Bank.Status = $scope.bankObject.Status;
                $scope.Bank.ClosingDateDT = $scope.bankObject.ClosingDate !== '' ? new Date($scope.bankObject.ClosingDate) : null;
            }
        }

        $scope.minValidator=function() {
            if ($scope.Bank.MinimumBalance < 10) {
                swal("please input amount within allowed range!");
                $scope.Bank.MinimumBalance = 100;
                return;
            }
        }
        $scope.maxValidator = function () {
            if ($scope.Bank.MaximumBalance < 10 || $scope.Bank.MaximumBalance > 10000000000) {
                swal("please input amount within allowed range!");
                $scope.Bank.MaximumBalance = 10000000000;
                return;
            }
        }

        document.querySelector('#Number').onkeypress = specialCharValidate;
        document.querySelector('#bankname').onkeypress = specialCharValidate;
        function specialCharValidate(e) {
            e = e || event;
            return /[a-z0-9_ _._-]/i.test(
                       String.fromCharCode(e.charCode || e.keyCode)
                   ) || !e.charCode && e.keyCode < 48;
        }


        $scope.getDateTimeObjectFromWiredFormattedString=function(datestr) {
            var splitteddate = datestr.split('/');
            return new Date(splitteddate[2], splitteddate[1]-1, splitteddate[0]);
        }

        $scope.addBankAccount = function () {
            $scope.Bank.BranchId = $rootScope.selectedBranchId;
            //$scope.Bank.BranchId = $rootScope.selectedBranchId;
            $scope.Bank.GlAccountId = $scope.bankObject.GlAccountId;
            if ($scope.validateMinmax() === -1) return;


            if ($scope.Bank.Status === 'Close' && ($scope.Bank.ClosingDateDT === undefined || $scope.Bank.ClosingDateDT === null)) {
                swal('please select a closing date for closed bank account!');
                return;
            }
            if ($scope.Bank.Status === 'Open' && ($scope.Bank.ClosingDateDT !== undefined && $scope.Bank.ClosingDateDT !== null)) {
                swal('please remove closing date for open bank account!');
                return;
            }

            swal({
                title: "confirm?",
                //text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.BankAccount),
                text:"Bank Account will be updated! Are you sure?",
                showCancelButton: true,
                confirmButtonText: "yes,Udate it!",
                cancelButtonText: "No,Cancel!",
                type: 'info',
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.Bank.OpeningDateDT = moment($scope.Bank.OpeningDateDT).format();
                    $scope.Bank.OpeningBranchDate = moment($rootScope.workingdate).format();
                    $scope.Bank.ClosingDateDT =$scope.Bank.ClosingDateDT!==null? moment($scope.Bank.ClosingDateDT).format():null;

                    $scope.Bank.BankAccountId = $scope.bankObject.BankAccountId;

                    bankAccountDetailsService.addBankAccount($scope.Bank).then(function (response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('bankAccount-add-finished');
                            swal({
                               // title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.BankAccount),
                                title: "Bank Account Updated Successfully!",
                                //text: "What do you want to do next?",
                                type: "success"
                               
                            }
                               );
                            $scope.clearAndCloseTab();
                        } else {

                            $scope.Bank.OpeningDateDT = new Date($scope.Bank.OpeningDateDT);
                            $scope.Bank.ClosingDateDT = $scope.Bank.ClosingDateDT !== null ? new Date($scope.Bank.ClosingDateDT) : null;

                            swal($rootScope.showMessage($rootScope.addError, $rootScope.BankAccount), response.data.Message, "error");
                        }
                    });
                }
            });
        }


        $scope.onStatusChange=function() {
            if ($scope.Bank.Status === "Open") {
                $scope.Bank.ClosingDateDT = null;
            } else {
                $scope.Bank.ClosingDateDT = new Date($rootScope.workingdate);
            }
        }

        $scope.clearModelData = function () {
            $scope.Bank = {};
            
        }
        $scope.clearAndCloseTab = function () {
            $scope.Bank = {};

            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };
        $scope.validateMinmax=function() {
            if ($scope.Bank.MinimumBalance > $scope.Bank.MaximumBalance) {
                swal("minimum balance can not be greater than maximum balance!");
                $scope.Bank.MinimumBalance = 100;
                $scope.Bank.MaximumBalance = 10000000000;
                return -1;
            }
            return 1;
        }

        $scope.init();


        //date picker

        $scope.today = function () {
            $scope.Bank.OpeningDate = $scope.Bank.OpeningDate === undefined ? new Date($rootScope.workingdate) : $scope.Bank.OpeningDate;

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
            startingDay: 1,
            initDate: new Date($rootScope.workingdate)
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

        $scope.openODatePop = function () {
            $scope.odate.opened = true;
        };
        $scope.openCDatePop = function () {
            $scope.cdate.opened = true;
        };


        // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.odate = {
            opened: false
        };
        $scope.cdate = {
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
        $scope.openValidator = function () {


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
               // maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                maxDate = moment($rootScope.workingdate).valueOf();
                minDate = moment($rootScope.workingdate).add(-30, 'days').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin || $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }



            if (
                (moment($scope.Bank.OpeningDateDT).valueOf() > moment(maxDate).valueOf() || moment($scope.Bank.OpeningDateDT).valueOf() < moment(minDate).valueOf())) {
               // swal("you are not allowed to perform this operation! please contact system administrator!");
                swal("Bank Account can not opened on future date!");
                $scope.Bank.OpeningDateDT = ($scope.Bank.OpeningDateDTBackup !== undefined && $scope.Bank.OpeningDateDTBackup !== null) ? new Date($scope.Bank.OpeningDateDTBackup) : new Date($rootScope.workingdate);
                return;
            }



            if ($scope.Bank.OpeningDateDT === undefined || $scope.Bank.OpeningDateDT === null) {
                swal("please select a opening date!");
                $scope.Bank.OpeningDateDT = new Date($rootScope.workingdate);
                return;
            }
            if ($scope.Bank.ClosingDateDT!==null && moment($scope.Bank.OpeningdateDT) > moment($scope.Bank.ClosingDateDT)) {
                swal("Opening date can not be greater than closing date!");
                $scope.Bank.OpeningDateDT = new Date($rootScope.workingdate);
                return;
            }

        }
        $scope.closeValidator = function () {
            //if ($scope.Bank.ClosingDate === undefined || $scope.Bank.ClosingDate === null) {
            //    swal("please select a date!");
            //    return;
            //}

           
            //var maxDate = moment($rootScope.workingdate).valueOf();
            //// minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //var minDate = moment($rootScope.workingdate).valueOf();


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
                // maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                maxDate = moment($rootScope.workingdate).valueOf();
                minDate = moment($rootScope.workingdate).add(-30, 'days').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin || $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }

            if (($scope.Bank.ClosingDateDT !== undefined && $scope.Bank.ClosingDateDT !== null) &&
               (moment($scope.Bank.ClosingDateDT).valueOf() > moment(maxDate).valueOf())) {
                swal("Bank Account can not be closed on future date!");
                $scope.Bank.ClosingDateDT = null;
                return;
            }

            var opd = moment($scope.Bank.OpeningdateDT).valueOf();
            var opdc = moment($scope.Bank.ClosingDateDT).valueOf();

            if (moment($scope.Bank.OpeningDateDT).valueOf() > moment($scope.Bank.ClosingDateDT).add(1, 'days').valueOf()) {
                swal("Closing date can not be less than opening date!");
                $scope.Bank.ClosingDateDT = new Date($rootScope.workingdate);
                return;
            }
        }




    }]);