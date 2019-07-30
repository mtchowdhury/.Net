ammsAng.controller('generalLedgerListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'generalLedgerService', 'generalJournalService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, generalLedgerService, generalJournalService) {

        $scope.showCoA = true;
        //$scope.treeSearchQuery = null;
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
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(8)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(9)
            .withOption("bSearchable", true)
        ];

        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];
        $scope.filter = {};
        $scope.search = {};
        $rootScope.NodeName = {};
        $scope.filter.AccountHead = {};


        $scope.SelectedBranchHierarchy = $rootScope.branchList.filter(b=>b.BranchId === $rootScope.selectedBranchId)[0];


        $scope.Init = function () {
            $scope.ledgers = [];
            $scope.filter = {};
            $scope.filter.ToDateM = new Date($rootScope.workingdate);
            $scope.filter.FromDateM = new Date($rootScope.workingdate);
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                console.log($scope.commandList);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;


                $scope.getGJFilterData();
                $scope.viewOptionModifier(false, -1);
                $scope.isLeaf = null;
                $scope.filter.IsSplitMonthly = false;
                //$scope.filters = {};
                $scope.ConsolidatedByList = [
                    { Name: "Branch", Value: 1 },
                    { Name: "Region", Value: 2 },
                    { Name: "District", Value: 3 },
                    { Name: "Division", Value: 4 }
                ];

            }, AMMS.handleServiceError);

        };

        $scope.$on('coa-node-label-single-clicked', function () {
        });

        $scope.setDefaultValues = function () {
            $scope.filter.Entity = 4;
            $scope.correspondingEntityDataLoader($scope.filter.Entity);
            $scope.filter.AccountHead = null;
            $scope.filter.EntryMethod = null;
            $scope.filter.AccountHead = null;
            $scope.filter.Module = null;
            $scope.filter.VoucherType = null;
            $scope.filter.VoucherId = null;
            $scope.filter.AmountFrom = null;
            $scope.filter.AmountTo = null;
            $scope.filter.EnteredBy = null;
        }

        $scope.getLedgerList = function () {
            $("#loadingImage").css("display", "block");

            $scope.showCoA = false;
            $timeout(function () { $('.selected-coa').text($('#myid').attr('name')); }, 300);

            $scope.search.DivisionId = $scope.filter.Zone;
            $scope.search.DistrictId = $scope.filter.District;
            $scope.search.RegionId = $scope.filter.Region;
            $scope.search.BranchId = $scope.filter.Branch;
            $scope.search.FromDate = moment($scope.filter.FromDateM).format();
            $scope.search.ToDate = moment($scope.filter.ToDateM).format();

            $scope.isLeaf = $scope.search.coaTitle[$scope.search.coaTitle.length - 1] == "*" ? true : false;
            if ($scope.isLeaf && !$scope.filter.IsSplitMonthly) {
                $scope.ledgers = [];
                generalLedgerService.getGeneralLedgerBranchLeafLevel($scope.search).then(function (response) {
                    $scope.ledgers = response.data;
                    $scope.ledgers.forEach(function (l) {
                        if (l == $scope.ledgers[$scope.ledgers.length - 1]) 
                            l.Date = 'Total';
                        else l.Date = moment(l.Date).format('DD-MM-YYYY');
                        if(l.VoucherNo != null) l.VoucherNoShow = l.VoucherNo.substr(l.VoucherNo.indexOf('V') - 1);
                        if(l.Credit != null) l.Credit = $rootScope.formatNumber(l.Credit);
                        if(l.Debit != null) l.Debit = $rootScope.formatNumber(l.Debit);
                        //l.OpeningBalance = $rootScope.formatNumber(l.OpeningBalance);
                        //l.ClosingBalance = $rootScope.formatNumber(l.ClosingBalance);
                        l.Balance = $rootScope.formatNumber(l.Balance);
                    });

                    $("#loadingImage").css("display", "none");
                });
            } else if ($scope.isLeaf &&  $scope.filter.IsSplitMonthly) {
                $scope.ledgers = [];
                generalLedgerService.getGeneralLedgerBranchLeafSplitMonthly($scope.search).then(function (response) {
                    $scope.ledgers = response.data;
                    $scope.ledgers.forEach(function (l) {
                        if (l.Credit != null) l.Credit = $rootScope.formatNumber(l.Credit);
                        if (l.Debit != null) l.Debit = $rootScope.formatNumber(l.Debit);
                        if (l.OpeningBalance != null) l.OpeningBalance = $rootScope.formatNumber(l.OpeningBalance);
                        if (l.ClosingBalance != null) l.ClosingBalance = $rootScope.formatNumber(l.ClosingBalance);
                    });
                    $("#loadingImage").css("display", "none");
                });
            } else if (!$scope.isLeaf && !$scope.filter.IsSplitMonthly) {
                $scope.ledgers = [];
                generalLedgerService.getGeneralLedgerBranchParentLevel($scope.search).then(function (response) {
                    $scope.ledgers = response.data;
                    $scope.ledgers.forEach(function (l) {
                        if (l.Credit != null) l.Credit = $rootScope.formatNumber(l.Credit);
                        if (l.Debit != null) l.Debit = $rootScope.formatNumber(l.Debit);
                        if (l.OpeningBalance != null) l.OpeningBalance = $rootScope.formatNumber(l.OpeningBalance);
                        if (l.ClosingBalance != null) l.ClosingBalance = $rootScope.formatNumber(l.ClosingBalance);
                    });
                    $("#loadingImage").css("display", "none");
                });
            } else if (!$scope.isLeaf && $scope.filter.IsSplitMonthly) {
                $scope.ledgers = [];
                generalLedgerService.getGeneralLedgerBranchParentLevelSplitMonthly($scope.search).then(function (response) {
                    $scope.ledgers = response.data;
                    $scope.ledgers.forEach(function (l) {
                        if (l.Credit != null) l.Credit = $rootScope.formatNumber(l.Credit);
                        if (l.Debit != null) l.Debit = $rootScope.formatNumber(l.Debit);
                        if (l.OpeningBalance != null) l.OpeningBalance = $rootScope.formatNumber(l.OpeningBalance);
                        if (l.ClosingBalance != null) l.ClosingBalance = $rootScope.formatNumber(l.ClosingBalance);
                    });
                    $("#loadingImage").css("display", "none");
                });
            }
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
                    $scope.filter.Branch = $scope.SelectedBranchHierarchy.BranchId;
            });
        }


        $scope.getGJFilterData = function () {
            $("#loadingImage").css("display", "block");
            generalJournalService.getGJFilterData().then(function (response) {
                $scope.filters = response.data;
                $scope.filters.Entity = response.data.Entity.filter(e=>e.AnyAdditionalValue > 3);
                $scope.filters.VoucherType = response.data.VoucherType.filter(e=>e.Value < 5);
                $scope.setDefaultValues();
                $("#loadingImage").css("display", "none");

            }, AMMS.handleServiceError);
        }

        
        $scope.viewOptionModifier = function (bool, index) {
            // if (index === undefined || index === null) index = $scope.savedIndex;
            //$scope.savedIndex = index;
            $rootScope.listViewShown = bool;
            $scope.filter.AccountHead = document.getElementById("myid");
            // $scope.filter.AccountHead.Name = document.getElementById("myid").name;
            // $scope.filter.AccountHead.Title = document.getElementById("myid").title;
            bool ? $rootScope.$broadcast('coa-popup-closed') :
            $rootScope.$broadcast('coa-popup-opened');

            // $scope.voucher.GlTransactions[index].GlAccountId = document.getElementById("myid").value;

            //$scope.voucher.GlTransactions[index].AccountHeadCode = document.getElementById("myid").title;

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
            $scope.filter.ToDateM = new Date(moment($rootScope.workingdate));
            $scope.filter.FromDateM = new Date(moment($rootScope.workingdate));
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
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };
        $scope.dateOptionsDOB = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date($rootScope.workingdate),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
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

        $scope.toValidator = function () {

        }
        $scope.$on('voucher-add-finished', function () {
            $scope.getVoucherList();
        });

        $scope.$on('voucher-edit-finished', function () {
            $scope.getVoucherList();
        });


        $scope.$on('voucher-delete-finished', function () {
            $scope.getVoucherList();
        });


        $scope.$on('coa-node-label-single-clicked', function () {
            //$scope.viewOptionModifier(true);
            $timeout(function() {
                $scope.search.coaId = document.getElementById("myid").value;
                $scope.search.coaTitle = document.getElementById("myid").name;
                    $scope.isLeaf = null;
                    $scope.getLedgerList();
                },
                500);
            
            //$('#myModalHorizontal').modal('hide');
        });

        $scope.export = function () {

            $scope.isLeaf = $scope.search.coaTitle[$scope.search.coaTitle.length - 1] == "*" ? true : false;


            var filterString = "";

            for (var property in $scope.search) {
                if ($scope.search.hasOwnProperty(property)) {
                    filterString += property + "|" + $scope.search[property] + "#";
                }
            }
            var url;
            if ($scope.isLeaf && !$scope.filter.IsSplitMonthly) {
                url = commonService.getExportUrl($rootScope.accountsApiBaseUrl + 'generalLedger/branchleaflevelExport', filterString, 'General-Ledger');
            } else if ($scope.isLeaf && $scope.filter.IsSplitMonthly) {
                url = commonService.getExportUrl($rootScope.accountsApiBaseUrl + 'generalLedger/branchleaflevelSplitMonthlyExport', filterString, 'General-Ledger');
            } else if (!$scope.isLeaf && !$scope.filter.IsSplitMonthly) {
                url = commonService.getExportUrl($rootScope.accountsApiBaseUrl + 'generalLedger/branchParentlevelExport', filterString, 'General-Ledger');
            } else if (!$scope.isLeaf && $scope.filter.IsSplitMonthly) {
                url = commonService.getExportUrl($rootScope.accountsApiBaseUrl + 'generalLedger/branchParentlevelSplitMonthlyExport', filterString, 'General-Ledger');
            }

            window.open(url, '_blank');
        }

        $scope.expandCoAStyle = function() {
            return $scope.showCoA ? 'col-lg-3 col-md-3 col-sm-12' : 'col-lg-12 col-md-12 col-sm-12';
        }

        $scope.expandArrowStyle = function () {
            return $scope.showCoA ? 'fa-arrow-left' : 'fa-arrow-right';
        }


        $scope.Init();
    }]);