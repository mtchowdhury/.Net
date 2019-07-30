ammsAng.controller('cashBookReceivePaymentReportController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'cashBookReceivePaymentService', 'generalJournalService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, cashBookReceivePaymentService, generalJournalService) {

        //$scope.treeSearchQuery = null;
        $scope.dtOptions = DTOptionsBuilder.newOptions()
               .withPaginationType('full_numbers')
               .withOption('order', [''])
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
        $rootScope.NodeName = {};
        //$scope.filter.AccountHead = {};


        $scope.SelectedBranchHierarchy = $rootScope.branchList.filter(b=>b.BranchId === $rootScope.selectedBranchId)[0];


        $scope.Init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                console.log($scope.commandList);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;


                $scope.getGJFilterData();

            }, AMMS.handleServiceError);

        };

        $scope.setDefaultValues = function () {
            $scope.filter.Entity = 4;
            $scope.correspondingEntityDataLoader($scope.filter.Entity);
            //$scope.filter.EntryMethod = 1;
            //$scope.filter.Module = 1;
            //$scope.filter.VoucherType = 1;
            $scope.filter.AccountHead = null;
            $scope.filter.ReportType = null;
            //$scope.filter.AccountHead = null;
            $scope.filter.Module = null;
            $scope.filter.VoucherType = null;
            $scope.filter.VoucherId = null;
            $scope.filter.AmountFrom = null;
            $scope.filter.AmountTo = null;
            $scope.filter.EnteredBy = null;
            //$scope.getVoucherList();
        }

        //$scope.getVoucherList = function () {
        //    $("#loadingImage").css("display", "block");
        //    $scope.holdEntity = angular.copy($scope.filter.Entity);
        //    $scope.filter.Entity = $scope.filter.Entity > 3 ? $scope.filter.Entity === 4 ? $scope.filter.Branch : $scope.filter.DivisionalOffice : $scope.filter.Entity;
        //    $scope.filter.Entity = $scope.filter.Entity === undefined ? $rootScope.selectedBranchId : $scope.filter.Entity;
        //    $scope.filter.AccountHead = $scope.filter.AccountHead != null ? $scope.filter.AccountHead.value : null;
        //    $scope.filter.FromDate = moment($scope.filter.FromDateM).format();
        //    $scope.filter.ToDate = moment($scope.filter.ToDateM).format();


        //    generalJournalService.getVoucherList($scope.filter).then(function (response) {
        //        $scope.vouchers = response.data;
        //        $scope.vouchers.forEach(function (v) {
        //            v.TransactionDate = moment(v.TransactionDate).format('DD-MM-YYYY');
        //            v.GlTransactions.forEach(function (gtr) {
        //                gtr.sort = gtr.Debit !== 0;
        //            });
        //        });
        //        $scope.filter.AccountHead = {};
        //        $scope.filter.Entity = $scope.holdEntity;
        //        $("#loadingImage").css("display", "none");
        //    });
        //}

        $scope.getReportData = function() {
                $("#loadingImage").css("display", "block");
                $scope.holdEntity = angular.copy($scope.filter.Entity);
                $scope.filter.Entity = $scope.filter.Entity > 3 ? $scope.filter.Entity === 4 ? $scope.filter.Branch : $scope.filter.DivisionalOffice : $scope.filter.Entity;
                $scope.filter.Entity = $scope.filter.Entity === undefined ? $rootScope.selectedBranchId : $scope.filter.Entity;
                //$scope.filter.AccountHead = $scope.filter.AccountHead != null ? $scope.filter.AccountHead.value : null;
                $scope.filter.FromDate = moment($scope.filter.FromDateM).format();
                $scope.filter.ToDate = moment($scope.filter.ToDateM).format();
            //$scope.filter.BranchId = $rootScope.selectedBranchId;

                if ($scope.filter.ReportType == "" || $scope.filter.ReportType == 0 || $scope.filter.ReportType == undefined || $scope.filter.ReportType == null) {
                    swal("Please Select a report type .");
                }

                if ($scope.filter.ReportType == 1) {
                   // $("#loadingImage").css("display", "block");
                    cashBookReceivePaymentService.getCashBookReceiveReportData($scope.filter).then(function(response) {
                        $scope.reportData = response.data;
                        $scope.filter.AccountHead = {};
                        $scope.filter.Entity = $scope.holdEntity;
                        $("#loadingImage").css("display", "none");
                    });
                } else {
                    // Another
                   // $("#loadingImage").css("display", "block");
                    cashBookReceivePaymentService.getCashBookPaymentReportData($scope.filter).then(function (response) {
                        $scope.reportData = response.data;

                        $scope.filter.AccountHead = {};
                        $scope.filter.Entity = $scope.holdEntity;
                        $("#loadingImage").css("display", "none");
                    });
                }



            
                // $("#loadingImage").css("display", "none");

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
        $scope.editVoucher = function () {

            if ($scope.vouchers.filter(v => v.checked).length < 1) {
                swal('please select a voucher first to update it!');
                return;
            }
            $scope.openCommandTab($scope.commandList.filter(c=>c.CommandName === 'EDIT')[0], $scope.tab.id, 'Accounts_General_Journal', {});
            $rootScope.selectedJournalObject = $scope.vouchers.filter(v => v.checked)[0];
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

        $scope.exportData = function (reportType) {

            var filterString = "";
            //iterate through properties of objec
            if (reportType == 1) {
                for (var property in $scope.filter) {
                    if ($scope.filter.hasOwnProperty(property)) {
                        //if (property != "AssetTypeList" && property != "BranchList" && property != "CategoryList" &&
                        //    property != "DistrictList" && property != "Office" && property != "OfficeTypeList" && property != "OfficeTypeListMain"
                        //    && property != "StatusList" && property != "SubStatusList" && property != "ZoneList" && property != "RegionList")
                        if (property == "FromDate" || property == "ToDate" || property == "BranchId" || property == "Region" || property == "District" || property == "Zone")
                            filterString += property + "|" + $scope.filter[property] + "#";
                    }
                }

                var url = commonService.getExportUrl($rootScope.accountsApiBaseUrl + 'cashbookReport/getCashBookReceiveReportForExport', filterString, 'Cash-Book-Receive');
                window.open(url, '_blank');
            }
            if (reportType == 2) {
                for (var filter in $scope.filter) {
                    if ($scope.filter.hasOwnProperty(filter)) {
                        
                        if (filter == "FromDate" || filter == "ToDate" || filter == "BranchId" || filter == "Region" || filter == "District" || filter == "Zone")
                            filterString += filter + "|" + $scope.filter[filter] + "#";
                    }
                }

                var reportUrl = commonService.getExportUrl($rootScope.accountsApiBaseUrl + 'cashbookReport/getCashBookPaymentReportForExport', filterString, 'Cash-Book-Payment');
                window.open(reportUrl, '_blank');
            }
            
        }
    }]);