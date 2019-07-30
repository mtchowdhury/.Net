ammsAng.controller('transactionStatementController', [
   '$scope', '$rootScope', '$timeout', 'filterService', 'transactionStatementService', 'commonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, $timeout, filterService, transactionStatementService, commonService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.loading = false;
        $scope.viewType = 'current';
        $scope.dateType = 'branch';
        $scope.showTransactionIds = false;
        $scope.transactionStatements = [];
        $scope.productTypeList = [{ text: 'Loan', value: '1' }, { text: 'Savings', value: '2' }, { text: 'Bad Debt', value: '3' }, { text: 'Others', value: '4' }];
        $scope.productList = [];
        $scope.transactionProcessList = [];
        $scope.transactionTypeList = [];
        $scope.loanOfficerList = [];
        $scope.groupList = [];
        $scope.memberList = [];
        $scope.filter = { fromDate: new Date($rootScope.workingdate), toDate: new Date($rootScope.workingdate), productType: '1' };

        $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10);

        $scope.init = function () {
            //$scope.getOrganizonalFilterData('ProductType', 'productTypeList', 'productType', $scope.getProductNameByType);
            $scope.getProductNameByType();
            $scope.getTransactionFilterData('TransactionProcess', 'transactionProcessList', 'transactionProcess', null);
            $scope.getLoanOfficerByBranch(true);
            $scope.getGroupsByLoanOfficer($rootScope.user.Role === '2' || $rootScope.user.Role === '14' ? $rootScope.user.EmployeeId : '-1');
            $scope.getMembersByGroupId($rootScope.user.Role === '2' || $rootScope.user.Role === '14' ? $rootScope.user.EmployeeId : '-1', '-1');
        }

        $scope.getTransactionFilterData = function (type, listToSet, model, callBack) {
            $scope.showHideLoading(true);
            filterService.getTransactionFilterDataByType(type)
                .then(function (response) {
                    $scope.showHideLoading(false);
                    if (response.data.length === 0) return;
                    var data = response.data;
                    if (type === 'TransactionType' && $scope.filter.productType === '1') {
                        data = response.data.filter(d => d.value === '0' || d.value === '1' || d.value === '2' || d.value === '4'
                            || d.value === '7' || d.value === '10' || d.value === '11' || d.value === '12' || d.value === '38' || d.value === '43');
                    } else if (type === 'TransactionType' && $scope.filter.productType === '2') {
                        data = response.data.filter(d => d.value === '0' || d.value === '13' || d.value === '14' || d.value === '15' || d.value === '16'
                            || d.value === '17' || d.value === '18' || d.value === '19' || d.value === '20' || d.value === '21'
                            || d.value === '22' || d.value === '23' || d.value === '24' || d.value === '25' || d.value === '33'
                            || d.value === '37' || d.value === '39' || d.value === '40' || d.value === '41' || d.value === '44'
                            || d.value === '45' || d.value === '46' || d.value === '61');
                    } else if (type === 'TransactionType' && $scope.filter.productType === '3') {
                        data = response.data.filter(d => d.value === '0' || d.value === '8' || d.value === '9' || d.value === '63');
                    } else if (type === 'TransactionType' && $scope.filter.productType === '4') {
                        data = response.data.filter(d => d.value === '0' || d.value === '5' || d.value === '6' || d.value === '42'
                            || d.value === '47' || d.value === '48' || d.value === '49' || d.value === '50' || d.value === '51' || d.value === '52'
                            || d.value === '53' || d.value === '54' || d.value === '55' || d.value === '56' || d.value === '57'
                            || d.value === '58' || d.value === '59' || d.value === '60' || d.value === '62');
                    }
                    $scope[listToSet] = data;
                    $scope.filter[model] = [];
                    $scope.filter[model].push($scope[listToSet][0].value);
                    if (callBack)
                        callBack();
                }, AMMS.handleServiceError);
        }

        $scope.getOrganizonalFilterData = function (type, listToSet, model, callBack) {
            $scope.showHideLoading(true);
            filterService.getOrganizationalFilterDataByType(type)
                .then(function (response) {
                    $scope.showHideLoading(false);
                    if (response.data.length === 0) return;
                    $scope[listToSet] = response.data;
                    $scope.filter[model] = $scope[listToSet][0].value;
                    if (callBack)
                        callBack();
                }, AMMS.handleServiceError);
        }

        $scope.getProductNameByType = function () {
            $scope.showHideLoading(true);
            $scope.getTransactionFilterData('TransactionType', 'transactionTypeList', 'transactionType', null);
            filterService.getProductNameByType($scope.filter.productType)
                .then(function (response) {
                    $scope.showHideLoading(false);
                    if (response.data.length === 0) return;
                    $scope.productList = [];
                    $scope.productList.push({ Value: '0', Name: 'All' });
                    $scope.productList = $scope.productList.concat(response.data);
                    $scope.filter.product = $scope.productList[0].Value;
                }, AMMS.handleServiceError);
        }

        $scope.getLoanOfficerByBranch = function (firstloader) {

            if (!firstloader && ($scope.fromDateValidator() || $scope.toDateValidator())) return;
            

            $scope.showHideLoading(true);
            commonService.getEmployeeFilterFromReportGeneralSP($rootScope.selectedBranchId, $rootScope.user.EmployeeId, moment($scope.filter.fromDate).format(), moment($scope.filter.toDate).format())
                .then(function (response) {
                    $scope.showHideLoading(false);
                    console.log(response.data);
                    if (response.data.length === 0) return;
                    $scope.loanOfficerList = [];
                    //if (response.data.length > 1)
                    //    $scope.loanOfficerList.push({ Value: '0', Name: 'All' });
                    //$scope.loanOfficerList = $scope.loanOfficerList.concat(response.data);
                    $scope.loanOfficerList = response.data;
                    $scope.filter.loanOfficer = $scope.loanOfficerList[0].Value;

                }, AMMS.handleServiceError);
        }

        $scope.getGroupsByLoanOfficer = function (loId) {
            $scope.showHideLoading(true);
            loId = loId ? loId : $scope.filter.loanOfficer;
           // filterService.getGroupsByBranchAndProgramOfficerAndRole($rootScope.selectedBranchId, loId, $rootScope.user.Role)
            filterService.getGroupsByBranchAndProgramOfficerAndRoleAndDate($rootScope.selectedBranchId, loId, moment($scope.filter.fromDate).format(), moment($scope.filter.toDate).format())
                .then(function (response) {
                    $scope.showHideLoading(false);
                    if (response.data.length === 0) return;
                    $scope.groupList = [];
                    if (response.data.length > 1)
                        $scope.groupList.push({ Value: '-1', Name: 'All' });
                    $scope.groupList = $scope.groupList.concat(response.data);
                    $scope.filter.group = $scope.groupList[0].Value;
                });
        }

        $scope.getMembersByGroupId = function (loId, groupId) {
            $scope.showHideLoading(true);
            loId = loId ? loId : $scope.filter.loanOfficer;
            groupId = groupId ? groupId : $scope.filter.group;
            //filterService.getMembersByLoanOfficerAndGroupIdAndRole($rootScope.selectedBranchId, loId, groupId, $rootScope.user.Role)
            filterService.getMembersByLoanOfficerAndGroupIdAndRoleAndDate($rootScope.selectedBranchId, loId, groupId, moment($scope.filter.fromDate).format(), moment($scope.filter.toDate).format())
                .then(function (response) {
                    $scope.showHideLoading(false);
                    if (response.data.length === 0) return;
                    $scope.memberList = [];
                    if (response.data.length > 1)
                        $scope.memberList.push({ Value: '-1', Name: 'All' });
                    $scope.memberList = $scope.memberList.concat(response.data);
                    $scope.filter.member = $scope.memberList[0].Value;
                });
        }

        $scope.getTransactionStatements = function () {
            if ($scope.loading) return;

            if ($scope.filter.fromDate > $scope.filter.toDate) {
                swal('From date cannot be greater than To date!');
                return;
            }

            $scope.loading = true;
            $scope.showHideLoading(true);
            var transParams = {
                ProductType: $scope.filter.productType,
                FromDate: $scope.dateToInt($scope.filter.fromDate),
                ToDate: $scope.dateToInt($scope.filter.toDate),
                BranchId: $rootScope.selectedBranchId,
                ProductId: $scope.filter.product,
                LoanOfficerId: $scope.filter.loanOfficer,
                GroupId: $scope.filter.group,
                MemberId: $scope.filter.member,
                TransactionProcessIds: $scope.filter.transactionProcess.join(),
                TransactionTypeIds: $scope.filter.transactionType.join(),
                ViewType: $scope.viewType,
                DateType: $scope.dateType
            };

            transactionStatementService.getTransactionStatement(transParams)
                .then(function (response) {
                    $scope.showHideLoading(false);
                    $scope.transactionStatements = response.data;
                    $scope.loading = false;
                    $timeout(function () {
                        $('#trans-statement-panel').width($('#trans-statement-table').width() + 50);
                    }, 100);
                }, AMMS.handleServiceError);
        }

        $scope.changeViewType = function(type) {
            $scope.viewType = type;
            $scope.getTransactionStatements();
        }

        $scope.changeDateType = function (type) {
            $scope.dateType = type;
            $scope.getTransactionStatements();
        }

        $scope.showHideLoading = function (show) {
            if (show)
                $("#loadingImage").css("display", "block");
            else
                $("#loadingImage").css("display", "none");
        }

        $scope.onTransactionProcessChange = function () {
            if ($scope.filter.transactionProcess.indexOf('0') === -1)
                return;
            $scope.filter.transactionProcess = ['0'];
        }

        $scope.onTransactionTypeChange = function () {
            if ($scope.filter.transactionType.indexOf('0') === -1)
                return;
            $scope.filter.transactionType = ['0'];
        }

        $scope.styleTotalRow = function (element) {
            return element.toLowerCase().indexOf('total') > -1 ? 'total-row' : '';
        }

        $scope.placeIndex = function (element, index) {
            return element.toLowerCase().indexOf('total') > -1 ? '' : (index + 1) + '';
        }

        $scope.dateToInt = function(date) {
            return date.getFullYear() + '' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)) +
            (date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate()) + '000000';
        }

        $scope.export = function () {
            if ($scope.loading) return;
            if ($scope.filter.fromDate > $scope.filter.toDate) {
                swal('From date cannot be greater than To date!');
                return;
            }
            var transParams = "productType=" + Encrypt.encrypt($scope.filter.productType) + "&fromDate=" + Encrypt.encrypt($scope.dateToInt($scope.filter.fromDate)) +
                "&toDate=" + Encrypt.encrypt($scope.dateToInt($scope.filter.toDate)) + "&branchId=" + Encrypt.encrypt($rootScope.selectedBranchId) +
                "&productId=" + Encrypt.encrypt($scope.filter.product) + "&loanOfficerId=" + Encrypt.encrypt($scope.filter.loanOfficer) +
                "&groupId=" + Encrypt.encrypt($scope.filter.group) + "&memberId=" + Encrypt.encrypt($scope.filter.member) +
                "&transactionProcessIds=" + Encrypt.encrypt($scope.filter.transactionProcess.join()) +
                "&transactionTypeIds=" + Encrypt.encrypt($scope.filter.transactionType.join()) +
                "&viewType=" + Encrypt.encrypt($scope.viewType) + "&dateType=" + Encrypt.encrypt($scope.dateType);

            var url = transactionStatementService.getExportUrl(transParams);
            window.open(url, '_blank');
        }

        $scope.init();



        //new date picker 
        //$scope.today = function () {
        //    $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
        //    $scope.eaccount.DisburseDate = new Date($rootScope.workingdate);
        //};
        //$scope.today();



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
                        || (moment(date) > moment(new Date($rootScope.workingdate)));
        }

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate.getDate() + 1);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.fromPopper = function () {
            $scope.fromPop.opened = true;
        };

        $scope.toPopper = function () {
            $scope.toPop.opened = true;
        };

        // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','dd/MM/yyyy'];
        $scope.format = $rootScope.formats[4];
        //$scope.format = $scope.altInputFormats;
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.fromPop = {
            opened: false
        };

        $scope.toPop = {
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

        $scope.fromDateValidator=function() {
            if ($scope.filter.fromDate === undefined || $scope.filter.fromDate === null) {
                swal("A from date must be selected!");
                $scope.filter.fromDate = new Date($rootScope.workingdate);
                return true;
            }

            if (($scope.filter.toDate !== undefined && $scope.filter.toDate !== null) && $scope.filter.fromDate > $scope.filter.toDate) {
                swal("from date can not be greater than to date!");
                $scope.filter.fromDate = new Date($rootScope.workingdate);
                return true;
            }
        }

        $scope.toDateValidator = function () {
            if ($scope.filter.toDate === undefined || $scope.filter.toDate === null) {
                swal("A to date must be selected!");
                $scope.filter.toDate = new Date($rootScope.workingdate);
                return true;
            }

            if (($scope.filter.fromDate !== undefined && $scope.filter.fromDate !== null) && $scope.filter.fromDate > $scope.filter.toDate) {
                swal("to date can not be less than from date!");
                $scope.filter.toDate = new Date($rootScope.workingdate);
                return true;
            }
        }

        $scope.toggleTransactionId = function() {
            $scope.showTransactionIds = !$scope.showTransactionIds;
            $timeout(function () {
                if ($scope.showTransactionIds)
                    $('#trans-statement-panel').width($('#trans-statement-panel').width() + 300);
                else
                    $('#trans-statement-panel').width($('#trans-statement-panel').width() - 300);
            }, 200);
        }

        $scope.toggleTransactionArrow = function () {
            return $scope.showTransactionIds ? 'fa-arrow-left' : 'fa-arrow-right';
        }
    }
]);