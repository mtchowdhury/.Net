ammsAng.controller('ahif7Controller', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'generalJournalService', 'trialBalanceService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, generalJournalService, trialBalanceService) {
      
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
        $rootScope.NodeName = {};
        //$scope.filter.AccountHead = {};


        $scope.SelectedBranchHierarchy = $rootScope.branchList.filter(b => b.BranchId === $rootScope.selectedBranchId)[0];


        $scope.Init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                console.log($scope.commandList);
                if ($scope.commandList.find(c => !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;


                $scope.getGJFilterData();

            }, AMMS.handleServiceError);

        };

        $scope.setDefaultValues = function () {
            $scope.filter.Entity = 4;
            $scope.correspondingEntityDataLoader($scope.filter.Entity);
          
            //$scope.filter.AccountHead = null;
            //$scope.filter.EntryMethod = null;
           // $scope.filter.AccountHead = null;
            //$scope.filter.Module = null;
            //$scope.filter.VoucherType = null;
            //$scope.filter.VoucherId = null;
            //$scope.filter.AmountFrom = null;
           // $scope.filter.AmountTo = null;
           // $scope.filter.EnteredBy = null;
            //$scope.getVoucherList();
        }


        $scope.exportData = function () {
            var filterString = "";
            var longSDate = commonService.dateToInt($scope.filter.FromDateM);
            var longEDate = commonService.dateToInt($scope.filter.ToDateM);
            $scope.filter.StartDate = longSDate;
            $scope.filter.EndDate = longEDate;
            for (var property in $scope.filter) {
                if ($scope.filter.hasOwnProperty(property)) {
                    filterString += property + "|" + $scope.filter[property] + "#";
                }
            }

            var url = trialBalanceService.getExportUrl($rootScope.accountsApiBaseUrl + 'trialBalance/getAhif7ListForExport?', filterString);
            window.open(url, '_blank');

        }




        $scope.getVoucherList = function () {
            $("#loadingImage").css("display", "block");
            $scope.filter.FromDate = moment($scope.filter.FromDateM).format();
            $scope.filter.ToDate = moment($scope.filter.ToDateM).format();
            generalJournalService.getAHIF7List($scope.filter).then(function (response) {

                


                $scope.ahifs = response.data;
                $scope.ahifsLeftSide = $scope.ahifs.filter(e => e.IsRecieveSide == true);
                $scope.ahifsRightSide = $scope.ahifs.filter(e => e.IsRecieveSide == false);
                
                $scope.leftSum = 0;
                for (var i = 0; i < $scope.ahifsLeftSide.length; i++) {
                    $scope.leftSum += $scope.ahifsLeftSide[i].Amount;
                    $scope.ahifsLeftSide[i].Amount = $rootScope.formatNumber($scope.ahifsLeftSide[i].Amount);
                    $scope.ahifsLeftSide[i].SumTotal = $rootScope.formatNumber($scope.ahifsLeftSide[i].SumTotal);
                };
                $scope.leftSum = $rootScope.formatNumber($scope.leftSum);
                //$scope.ahifsLeftSide.push({
                //    Name : "Total Receive",
                //    SumTotal: $scope.leftSum
                //});

                $scope.rightSum = 0;
                for (var i = 0; i < $scope.ahifsRightSide.length; i++) {
                    $scope.rightSum += $scope.ahifsRightSide[i].Amount;
                    $scope.ahifsRightSide[i].Amount = $rootScope.formatNumber($scope.ahifsRightSide[i].Amount);
                    $scope.ahifsRightSide[i].SumTotal = $rootScope.formatNumber($scope.ahifsRightSide[i].SumTotal);
                };

                $scope.rightSum = $rootScope.formatNumber($scope.rightSum);
                //$scope.ahifsRightSide.push({
                //    Name: "Total Payment",
                //    SumTotal: $scope.rightSum
                //});

                $("#loadingImage").css("display", "none");
            });
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
                $scope.filters.Entity = response.data.Entity.filter(e => e.AnyAdditionalValue > 3);
                $scope.filters.VoucherType = response.data.VoucherType.filter(e => e.Value < 5);
                $scope.setDefaultValues();
                $("#loadingImage").css("display", "none");

            }, AMMS.handleServiceError);
        }


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
        $scope.$on('coa-node-label-double-clicked', function () {
            $scope.viewOptionModifier(true);
            $('#myModalHorizontal').modal('hide');
        });
    
        $scope.Init();
    }]);