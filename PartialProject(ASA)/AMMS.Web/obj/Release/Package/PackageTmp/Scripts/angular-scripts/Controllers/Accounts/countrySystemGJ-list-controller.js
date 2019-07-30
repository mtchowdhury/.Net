ammsAng.controller('countrySystemGJListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'countrySystemGJService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, countrySystemGJService) {

        //$scope.treeSearchQuery = null;

        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];
        $scope.filter = {};
        $rootScope.NodeName = {};
        $scope.filter.DebitHead = {};
        $scope.filter.CreditHead = {};
        $scope.SelectedBranchHierarchy = $rootScope.branchList.filter(b=>b.BranchId === $rootScope.selectedBranchId)[0];
      

        $scope.$on('coa-node-label-double-clicked', function () {
            $scope.viewOptionModifier(true);
            $('#myModalHorizontal').modal('hide');
        });

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
            $scope.filter.Entity = -1;
            $scope.correspondingEntityDataLoader($scope.filter.Entity);
            //$scope.filter.EntryMethod = 1;
            //$scope.filter.Module = 1;
            //$scope.filter.VoucherType = 1;
            $scope.filter.AccountHead = null;
            $scope.filter.EntryMethod = null;
            $scope.filter.AccountHead = null;
            $scope.filter.Module = null;
            $scope.filter.VoucherType = null;
            $scope.filter.VoucherId = null;
            $scope.filter.AmountFrom = null;
            $scope.filter.AmountTo = null;
            $scope.filter.EnteredBy = null;
            $scope.getVoucherList();
        }

        $scope.getVoucherList = function () {
            $("#loadingImage").css("display", "block");
            $scope.entityHolder = angular.copy($scope.filter.Entity);
            $scope.filter.Entity = $scope.filter.Entity > 3 ? $scope.filter.Entity === 4 ? $scope.filter.Branch : $scope.filter.DivisionalOffice : $scope.filter.Entity;
            $scope.debitHeadHolder = $scope.filter.DebitHead;
            $scope.creditHeadHolder = $scope.filter.CreditHead;
            $scope.filter.DebitHead = $scope.filter.DebitHead != null ? $scope.filter.DebitHead.value : null;
            $scope.filter.CreditHead = $scope.filter.CreditHead != null ? $scope.filter.CreditHead.value : null;
            $scope.filter.FromDate = moment($scope.filter.FromDateM).format();
            $scope.filter.ToDate = moment($scope.filter.ToDateM).format();

            countrySystemGJService.getVoucherList($scope.filter).then(function (response) {
                $scope.vouchers = response.data;
                $scope.vouchers.forEach(function (v) {
                    v.TransactionDate = moment(v.TransactionDate).format('DD-MM-YYYY');
                    v.GlTransactions.forEach(function(gtr) {
                        gtr.sort = gtr.Debit !== 0;
                    });
                });
                
               // $scope.filter.AccountHead = {};
                 $scope.filter.DebitHead = $scope.debitHeadHolder;
                $scope.filter.CreditHead = $scope.creditHeadHolder;
                $scope.filter.Entity = $scope.entityHolder;
                $("#loadingImage").css("display", "none");
            });
        }
        $scope.removeDebitHead = function () {
            $scope.filter.DebitHead = {};
        }
        $scope.removeCreditHead = function () {
            $scope.filter.CreditHead = {};
        }

        $scope.correspondingEntityDataLoader = function (entityId) {
            if (entityId === 4) {
                $scope.filter.Zone = $scope.SelectedBranchHierarchy.ZoneId;
                $scope.getDistrictsByZoneId($scope.filter.Zone);
            }

        }


        //$scope.selecteDefaultHeierarchy=function() {
        //    $scope.getDistrictsByZoneId($scope.SelectedBranchHierarchy.ZoneId);
        //   // $scope.
        //}
        $scope.getDistrictsByZoneId = function () {
            countrySystemGJService.getDistrictsByZoneId($scope.filter.Zone).then(function (response) {
                $scope.filters.Districts = response.data;
                if ($scope.filters.Districts.length > 0)
                   // $scope.filter.District = $scope.filters.Districts[0].Value;
                    $scope.filter.District = $scope.SelectedBranchHierarchy.DistrictId;
                $scope.getRegionsByDistrictId();
            });
        }
        $scope.getRegionsByDistrictId = function () {
            countrySystemGJService.getRegionsByDistrictId($scope.filter.District).then(function (response) {
                $scope.filters.Regions = response.data;
                if ($scope.filters.Regions.length > 0)
                    //$scope.filter.Region = $scope.filters.Regions[0].Value;
                    $scope.filter.Region = $scope.SelectedBranchHierarchy.RegionId;
                $scope.getBranchesByRegionId();
            });
        }
        $scope.getBranchesByRegionId = function () {
            countrySystemGJService.getBranchesByRegionId($scope.filter.Region).then(function (response) {
                $scope.filters.Branches = response.data;
                if ($scope.filters.Branches.length > 0)
                    $scope.filter.Branch = $scope.SelectedBranchHierarchy.BranchId;
            });
        }


        $scope.getGJFilterData = function () {
            $("#loadingImage").css("display", "block");
            countrySystemGJService.getGJFilterData().then(function (response) {
                $scope.filters = response.data;
                $scope.filters.VoucherType = response.data.VoucherType.filter(e=>e.Value < 5);
                $scope.setDefaultValues();
                $("#loadingImage").css("display", "none");

            }, AMMS.handleServiceError);
        }

        //$scope.viewOptionModifier=function(bool) {
        //    $rootScope.listViewShown = bool;
        //    $scope.filter.AccountHead.Value = document.getElementById("myid").value;
        //    $scope.filter.AccountHead.Name = document.getElementById("myid").name;
        //   console.log($scope.filter.AccountHead);
        //}
        $scope.viewOptionModifier = function (bool, head) {
            // if (index === undefined || index === null) index = $scope.savedIndex;
            //$scope.savedIndex = index;
            $rootScope.listViewShown = bool;
            if(head===1)$scope.filter.DebitHead = document.getElementById("myid");
            if (head === 2) $scope.filter.CreditHead = document.getElementById("myid");
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
        $scope.editVoucher = function () {

            if ($scope.vouchers.filter(v => v.checked).length < 1) {
                swal('please select a voucher first to update it!');
                return;
            }
            $scope.openCommandTab($scope.commandList.filter(c=>c.CommandName === 'EDIT')[0], $scope.tab.id, 'Accounts_G_J_C', {});
            $rootScope.selectedJournalObject = $scope.vouchers.filter(v => v.checked)[0];
        }
        //new datepicker
        $scope.today = function () {
            $scope.filter.ToDateM = new Date($rootScope.workingdate);
            $scope.filter.FromDateM = new Date($rootScope.workingdate);
            //$scope.filter.FromDateM = new Date($rootScope.workingdate).setMonth($scope.filter.ToDateM.getMonth() - 1);

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

        $scope.deleteVoucher = function () {
            if ($scope.vouchers.filter(v => v.checked).length < 1) {
                swal('please select a voucher first to delete it!');
                return;
            }
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.GeneralJournal),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    countrySystemGJService.deleteVoucher($scope.vouchers.filter(v => v.checked)[0].Id, moment($rootScope.workingdate).format()).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.GeneralJournal), "Successful!", "success");
                            $rootScope.$broadcast('voucher-delete-finished');
                        } else {
                            swal($rootScope.showMessage(response.data.Message, $rootScope.GeneralJournal), "", "error");
                        }

                    }, AMMS.handleServiceError);
                });
        };

        $scope.Init();
    }]);