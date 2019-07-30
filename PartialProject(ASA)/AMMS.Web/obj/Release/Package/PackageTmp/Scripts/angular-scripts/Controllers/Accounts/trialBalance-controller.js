ammsAng.controller('trialBalanceController', ['$scope', '$rootScope', 'commonService', '$timeout', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'trialBalanceService','generalJournalService',
    function ($scope, $rootScope, commonService, $timeout, DTOptionsBuilder, DTColumnDefBuilder, trialBalanceService,generalJournalService) {

    
        $scope.dtOptions = DTOptionsBuilder.newOptions()
             .withPaginationType('full_numbers')
             .withDisplayLength(50)
             .withOption('order', ['Id']);

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
        $rootScope.NodeName = {};
        $scope.filter.AccountHead = {};


        $scope.SelectedBranchHierarchy = $rootScope.branchList.filter(b=>b.BranchId === $rootScope.selectedBranchId)[0];



        $scope.correspondingEntityDataLoader = function (entityId) {
            if (entityId === 4) {
                $scope.filter.DivisionId = $scope.SelectedBranchHierarchy.ZoneId;



                //   $scope.filter.DivisionId = 35;

                $scope.getDistrictsByZoneId($scope.filter.DivisionId);
            }

        }

        $scope.addIndentationLevelWise = function (level) {
            var indentVar = "";
            for (var i = 0; i <= level; i++) {
                indentVar += " ";
            }
            return indentVar;
          //  document.getElementById("tname1").style.padding = "50px 10px 20px 30px";
            $("#tname1").css("paddingTop", 200);
        }

        $scope.objectifyLevels=function() {
            $scope.filters.Level = [];
            $scope.filters.Level.push({
                Name: "All",
                Value:null
            });

            for (var i = 0; i < 8; i++) {
                $scope.filters.Level.push({
                    Name: "Level " + (i + 1).toString(),
                    Value: i
                });
            }
        }

        $scope.getDistrictsByZoneId = function () {
           
            generalJournalService.getDistrictsByZoneId($scope.filter.DivisionId).then(function (response) {
                // $scope.filters.Districts = response.data;
                $scope.filters.Districts = [];
                $scope.filters.Districts.push({
                    Name: "All",
                    Value: null
                });
                $scope.filters.Districts.push.apply($scope.filters.Districts, response.data);

                $scope.filters.Districts.forEach(function (r) {
                    if (r.Name !== "All") {
                        r.sort = 1;
                    } else {
                        r.sort = 0;
                    }

                });

                if ($scope.filters.Districts.length > 0)
                    $scope.filter.DistrictId = $scope.SelectedBranchHierarchy.DistrictId;



                // $scope.filter.DistrictId = 45;

                $scope.getRegionsByDistrictId();
            });
        }
        $scope.getRegionsByDistrictId = function () {
            generalJournalService.getRegionsByDistrictId($scope.filter.DistrictId).then(function (response) {

                $scope.filters.Regions = [];
                $scope.filters.Regions.push({
                    Name: "All",
                    Value: null
                });
                $scope.filters.Regions.push.apply($scope.filters.Regions, response.data);

                $scope.filters.Regions.forEach(function (r) {
                    if (r.Name !== "All") {
                        r.sort = 1;
                    } else {
                        r.sort = 0;
                    }

                });

                if ($scope.filters.Regions.length > 0)
                    $scope.filter.RegionId = $scope.SelectedBranchHierarchy.RegionId;


                // $scope.filter.RegionId = 1145;

                $scope.getBranchesByRegionId();
            });
        }
        $scope.getBranchesByRegionId = function () {
            generalJournalService.getBranchesByRegionId($scope.filter.RegionId).then(function (response) {
                // $scope.filters.Branches = response.data;
                $scope.filters.Branches = [];
                $scope.filters.Branches.push({
                    Name: "All",
                    Value: null
                });
                $scope.filters.Branches.push.apply($scope.filters.Branches, response.data);


                $scope.filters.Branches.forEach(function (r) {
                    if (r.Name !== "All") {
                        r.sort = 1;
                    } else {
                        r.sort = 0;
                    }

                });

                if ($scope.filters.Branches.length > 0)
                    $scope.filter.BranchId = $scope.SelectedBranchHierarchy.BranchId;



                // $scope.filter.BranchId = 1471;

            });
        }


        $scope.Init = function () {
            $scope.getGJFilterData();

        };




        $scope.getGJFilterData = function () {
            $("#loadingImage").css("display", "block");
            generalJournalService.getGJFilterData().then(function (response) {
                $scope.filters = response.data;

                //$scope.pushAllInAllHierarchy();
                $scope.filters.Zones.push({
                    Name: "All",
                    Value: null
                });
                $scope.filters.Zones.forEach(function (z) {
                    if (z.Name !== "All") {
                        z.sort = 1;
                    } else {
                        z.sort = 0;
                    }
                   
                });

                $scope.filters.Entity = response.data.Entity.filter(e=>e.AnyAdditionalValue > 3);
               // $scope.filters.VoucherType = response.data.VoucherType.filter(e=>e.Value < 5);
                $scope.objectifyLevels();
                $scope.filter.Entity = 4;
                $scope.setDefaultValues();
               
                $("#loadingImage").css("display", "none");

            }, AMMS.handleServiceError);
        }


        $scope.setDefaultValues = function () {
          
            $scope.correspondingEntityDataLoader($scope.filter.Entity);
        
           
        

            $scope.filter.OfficeType = 3;
            $scope.filter.Level = 2;
            $scope.filter.SeparateCash = 0;
        }

        $scope.getTrialBalanceList = function () {
            $scope.filter.StartDate = moment($scope.filter.FromDateM).format();
            $scope.filter.EndDate = moment($scope.filter.ToDateM).format();
            $scope.filter.SeparateCash = $scope.filter.SeparateCash === "YES" ? true : false;
            $("#loadingImage").css("display", "block");
            trialBalanceService.getTrialBalanceList($scope.filter).then(function (response) {
                $scope.transactions = response.data;

                var nf = new Intl.NumberFormat();
                $scope.transactions.forEach(function (t) {
                   
                    t.OpeningBalanceDebit = nf.format(Math.round(t.OpeningBalanceDebit * 100) / 100);
                    t.OpeningBalanceCredit = nf.format(Math.round(t.OpeningBalanceCredit * 100) / 100);
                    t.TransactionDebit = nf.format(Math.round(t.TransactionDebit * 100) / 100);
                    t.TransactionCredit = nf.format(Math.round(t.TransactionCredit * 100) / 100);
                    t.CashDebit = nf.format(Math.round(t.CashDebit * 100) / 100);
                    t.CashCredit = nf.format(Math.round(t.CashCredit * 100) / 100);
                    t.ClosingBalanceDebit = nf.format(Math.round(t.ClosingBalanceDebit * 100) / 100);
                    t.ClosingBalanceCredit = nf.format(Math.round(t.ClosingBalanceCredit * 100) / 100);

                });


                $("#loadingImage").css("display", "none");
                $scope.addIndentationLevelWise();
            });
        }


        $scope.Init();



        $scope.exportData = function () {

            var filterString = "";
          
            var longSDate = commonService.dateToInt($scope.filter.FromDateM);
            var longEDate = commonService.dateToInt($scope.filter.ToDateM);
            $scope.filter.StartDate = longSDate;
            $scope.filter.EndDate = longEDate;
        
                for (var property in $scope.filter) {
                    if ($scope.filter.hasOwnProperty(property)) {
                        //if (property != "AssetTypeList" && property != "BranchList" && property != "CategoryList" &&
                        //    property != "DistrictList" && property != "Office" && property != "OfficeTypeList" && property != "OfficeTypeListMain"
                        //    && property != "StatusList" && property != "SubStatusList" && property != "ZoneList" && property != "RegionList")
                        
                            filterString += property + "|" + $scope.filter[property] + "#";
                    }
                }

                var url = trialBalanceService.getExportUrl($rootScope.accountsApiBaseUrl + 'trialBalance/getTrialBalanceListForExport?', filterString);
                window.open(url, '_blank');
            
        }



        //new datepicker
        $scope.today = function () {
            $scope.filter.ToDateM = new Date($rootScope.workingdate);
            $scope.filter.FromDateM = new Date($rootScope.workingdate);
            //  $scope.filter.FromDateM = new Date($rootScope.workingdate).setMonth($scope.filter.ToDateM.getMonth() - 1);

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
        // $scope.callThatsp();
    }]);