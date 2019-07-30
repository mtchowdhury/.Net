ammsAng.controller('transactionSummaryReportController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'transactionSummaryService', 'generalJournalService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, transactionSummaryService, generalJournalService) {

        //$scope.treeSearchQuery = null;
        $scope.dtOptions = DTOptionsBuilder.newOptions()
               .withPaginationType('full_numbers')
                .withOption('order', [])
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
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(8)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(9)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(10)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(11)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(12)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(13)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(14)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(15)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(16)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(17)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(18)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(19)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(20)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(21)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(22)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(23)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(24)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(25)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(26)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(27)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(28)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(29)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(30)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(31)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(32)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(33)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(34)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(35)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(36)
            .withOption("bSearchable", true),
             DTColumnDefBuilder.newColumnDef(37)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(38)
            .withOption("bSearchable", true)
        ];

        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];
        $scope.filter = {};
        $scope.filter.TransactionDate = new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
        $rootScope.NodeName = {};
        $scope.transactionSummaryData = {};

        $scope.SelectedBranchHierarchy = $rootScope.branchList.filter(b=>b.BranchId === $rootScope.selectedBranchId)[0];


        $scope.Init = function () {
             $scope.getGJFilterData();

        };

        $scope.setDefaultValues = function () {
            $scope.filter.Entity = 4;
            $scope.correspondingEntityDataLoader($scope.filter.Entity);
            $scope.filter.AccountHead = null;
            $scope.filter.ReportType = null;
            $scope.filter.Module = null;
            $scope.filter.VoucherType = null;
            $scope.filter.VoucherId = null;
            $scope.filter.AmountFrom = null;
            $scope.filter.AmountTo = null;
            $scope.filter.EnteredBy = null;
        }
        $scope.correspondingEntityDataLoader = function (entityId) {
            if (entityId === 4) {
                $scope.filter.Zone = $scope.SelectedBranchHierarchy.ZoneId;
                $scope.getDistrictsByZoneId($scope.filter.Zone);
            }

        }

        $scope.getDistrictsByZoneId = function () {
            generalJournalService.getDistrictsByZoneId($scope.filter.Zone).then(function (response) {
                $scope.filters.Districts = response.data;
                if ($scope.filters.Districts.length > 0)
                    $scope.filter.District = $scope.SelectedBranchHierarchy.DistrictId;
                $scope.getRegionsByDistrictId();
            });
        }
        $scope.getRegionsByDistrictId = function () {
            generalJournalService.getRegionsByDistrictId($scope.filter.District).then(function (response) {
                $scope.filters.Regions = response.data;
                if ($scope.filters.Regions.length > 0)
                    $scope.filter.Region = $scope.SelectedBranchHierarchy.RegionId;
                $scope.getBranchesByRegionId();
            });
        }
        $scope.getBranchesByRegionId = function () {
            generalJournalService.getBranchesByRegionId($scope.filter.Region).then(function (response) {
                $scope.filters.Branches = response.data;
                if ($scope.filters.Branches.length > 0)
                    $scope.filter.BranchId = $scope.SelectedBranchHierarchy.BranchId;
                $scope.getLoanOfficersByBranch();
            });
        }
        $scope.getLoanOfficersByBranch=function() {
            commonService.getPOFilter($rootScope.selectedBranchId,$rootScope.user.Role,$rootScope.user.EmployeeId,true).then(function(response) {
                $scope.filters.LoanOfficers = response.data;
                $scope.filters.LoanOfficers.unshift({ Name: "All", Value: -1 });
                $scope.filter.LoanOfficer = -1;
                    $scope.getGroupsByLoanOfficers($scope.filter.LoanOfficer);
            });
        }
        $scope.getGroupsByLoanOfficers=function(lo) {
            commonService.getGroupsByProgramOfficer(lo, true).then(function(response) {
                $scope.filters.Groups = response.data;
                $scope.filters.Groups.unshift({ Name: "All", Value: -1 });
                $scope.filter.Group = -1;
                    $scope.getMembersByGroup($scope.filter.Group);
                
            });
        }
        $scope.getMembersByGroup=function(groupId) {
             commonService.getMembersByGroup(groupId, true).then(function(response) {
                 $scope.filters.Members = response.data;
                 $scope.filters.Members.unshift({ Name: "All", Value: -1 });
                 $scope.filter.Member = -1;
            });
        }

        $scope.getGJFilterData = function () {
            $("#loadingImage").css("display", "block");
            generalJournalService.getGJFilterData().then(function (response) {
                $scope.filters = response.data;
                $scope.filters.Entity = response.data.Entity.filter(e=>e.AnyAdditionalValue > 3);
                $scope.setDefaultValues();
                $("#loadingImage").css("display", "none");

            }, AMMS.handleServiceError);
        }
        $scope.viewOptionModifier = function (bool) {
            $rootScope.listViewShown = bool;
            $scope.filter.AccountHead = document.getElementById("myid");

            bool ? $rootScope.$broadcast('coa-popup-closed') :
            $rootScope.$broadcast('coa-popup-opened');



        }

        $scope.ensureSingleCheck = function (index) {
            $scope.vouchers.forEach(function (v, i) {
                if (i !== index) {
                    v.checked = false;
                }
            });
        }
        //new datepicker
        $scope.today = function () {
            $scope.filter.ToDateM = new Date($rootScope.workingdate);
            $scope.filter.FromDateM = new Date($rootScope.workingdate);

        };
        $scope.today();



        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($rootScope.workingdate),
            showWeeks: true
        };


        function disabled(data) {
            var date = data.date,
              mode = data.mode;

            return (mode === 'day' && (date.getDay() === 5));
        }
        $scope.dateOptions = {
            //dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
           // minDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            startingDay: 1
        };
        $scope.popup = {
            opened: false
        };
        $scope.open = function () {
            $scope.popup.opened = true;
        };
        

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
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        // $scope.format = $scope.formats[0];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.fromPop = {
            opened: false
        };
        $scope.toPop = {
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
        $scope.fromValidator = function () {
            //var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            //var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            //if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM) {
            //    maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //    minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //}
            //else if ($scope.roleId == $rootScope.rootLevel.RM) {
            //    maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //    minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
            //}

        }
        $scope.toValidator = function () {

        }

        $scope.Init();

       
        $scope.getActiveTab = function (index) {
            return index === 0 ? 'active' : '';
        }
        $scope.setPageLength = function (rows) {
            return rows.length <= 10 ? 10 : rows.length <= 20 ? 20 : 50;
        }
        $scope.setHeaderStyle = function (colSpan, rowSpan, layer) {
            var style = {};
            if (colSpan > 1) style['text-align'] = 'center';
            if (rowSpan > 1) style['vertical-align'] = 'middle';
            if (layer === 0) style["background-color"] = '#77b4f3';
            else if (layer === 1) style["background-color"] = '#8abbe0';
            else if (layer === 2) style["background-color"] = '#a7cae4';
            else style["background-color"] = '#cbddea';
            return style;
        }
        $scope.styleTotalRow = function (cells) {
            var cls = '';
            angular.forEach(cells, function (cell, key) {
                if ((cell + '').indexOf('Total') > -1 || (cell + '').indexOf('Summary') > -1)
                    cls = "total-row";
            });
            return cls;
        }
        $scope.formatCellValue = function (cell, column) {
            //if ((column.toLowerCase().indexOf('_date') > -1 || column.toLowerCase().indexOf('_int date') > -1
            //    || column.toLowerCase().indexOf('_intdate') > -1) && cell)
            //    return moment(cell).format('DD-MM-YYYY');
            //if ((column.toLowerCase().indexOf('_datetime') > -1 || column.toLowerCase().indexOf('_int datetime') > -1
            //    || column.toLowerCase().indexOf('_intdatetime') > -1) && cell)
            //    return moment(cell).format('DD-MM-YYYY hh:mm:ss');
            //if ((column.toLowerCase().indexOf('_double') > -1 || column.toLowerCase().indexOf('_float') > -1) && cell)
            //    return numeral(cell).format('0,0.00');
            //if ((column.toLowerCase().indexOf('_int') > -1) && cell)
            //    return numeral(cell).format('0,0');
            return cell;
        }
        $scope.getTransactionSummaryData=function() {
            transactionSummaryService.getTransactionSummaryData($scope.filter.BranchId,moment($scope.filter.TransactionDate).format('YYYY-MM-DD'),$scope.filter.LoanOfficer,$scope.filter.Group,$scope.filter.Member).then(function (response) {
                $scope.transactionSummaryData = response.data;
                console.log($scope.transactionSummaryData);
            });
        }
        $scope.exportTransactionSummaryData=function() {
            var reportUrl = $rootScope.programsApiBaseUrl + 'reports/transactionsummary/exporttransactionsummarydata?branchId=' + Encrypt.encrypt($scope.filter.BranchId) + '&transactionDate=' + Encrypt.encrypt(moment($scope.filter.TransactionDate).format('YYYY-MM-DD')) + '&loanOfficerId=' + Encrypt.encrypt($scope.filter.LoanOfficer) + '&groupId=' + Encrypt.encrypt($scope.filter.Group) + '&memberId=' + Encrypt.encrypt($scope.filter.Member);
            //var reportUrl = $rootScope.programsApiBaseUrl + 'reports/transactionsummary/exporttransactionsummarydata?branchId=' + Encrypt.encrypt(3436) + '&transactionDate=' + Encrypt.encrypt('2018-01-08') + '&loanOfficerId=' + Encrypt.encrypt(-1) + '&groupId=' + Encrypt.encrypt(-1) + '&memberId=' + Encrypt.encrypt(-1);
            window.open(reportUrl, '_blank');
        }
    }]);