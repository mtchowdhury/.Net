ammsAng.controller('assetTransferController', [
    '$scope', '$rootScope', '$timeout', 'assetTransferReceiveService', 'assetEntryService', 'branchService', 'filterService', 'workingDayService', 'commonService',
    'DTOptionsBuilder', 'DTColumnDefBuilder', 'employeeFilterService',
    function ($scope, $rootScope, $timeout, assetTransferReceiveService, assetEntryService, branchService, filterService, workingDayService, commonService,
         DTOptionsBuilder, DTColumnDefBuilder, employeeFilterService) {

        var declareVariable = function () {
            $scope.btnTransferShow = true;
            $scope.assetToTransfer = {};
            $scope.assetTransferReceiveHistoryList = null;
            $scope.serverDateTimeToday = null;
            $scope.assetToTransfer.TransferDate = $scope.selectedBranchId > 0 ? new Date($rootScope.workingdate) : new Date();
            $scope.officeTypeList = [];
            $scope.branchList = [];
            $scope.branchListMain = [];
            console.log($scope.asset);
            $scope.asset.PurchaseWorkingDateS = moment($scope.asset.PurchaseWorkingDate).format("YYYY-MM-DD");
            $scope.assetToTransfer.AssetSystemId = $scope.asset.Id;
            $scope.asset.WrittenDownValue = Math.round($scope.asset.WrittenDownValue);
            $scope.assetToTransfer.TransferBranchWorkingDate = moment($rootScope.workingdate).format();
            $scope.assetToTransfer.BranchWorkingDate = moment($rootScope.workingdate).format();
            $scope.assetToTransfer.AssetTagId = $scope.asset.AssetId;
            $scope.assetToTransfer.TransferredByUserId = $rootScope.user.EmployeeId;
            $scope.assetToTransfer.TransferredOfficeOrBranch = $rootScope.selectedBranchId;
            $scope.updateButtonText = "Update";
            $scope.btnUpdateShow = false;
        }
        $scope.openTransferDatePopup = function () {
            $scope.popupTransferDate.opened = true;
        };
        $scope.popupTransferDate = {
            opened: false
        };
        declareVariable();

        $scope.filterOfficeList = function () {
            $scope.assetToTransfer.ReceivingOfficeBranchId = null;
            $scope.branchList = $scope.branchListMain.filter(b => b.RelationalValue == $scope.assetToTransfer.ReceivingOfficeType);
        }
        $scope.officeTypeChanged=function() {
            $scope.recBranch = null;
        }
        $scope.GetAdditinalFilters=function() {
            assetTransferReceiveService.GetAdditinalFilters().then(function (response) {
                console.log(response.data);
                $scope.officeTypeList = angular.copy(response.data.officeType);
                $scope.branchListAll= angular.copy(response.data.branchList)
                $scope.branchList = angular.copy(response.data.branchList.filter(b=>b.Value!=$rootScope.selectedBranchId));
                $scope.districtList = angular.copy(response.data.districtList);
                $scope.branchListMain = angular.copy(response.data.branchList.filter(b=>b.Value != $rootScope.selectedBranchId));
                $scope.transferStatusList = angular.copy(response.data.transferStatusList);
                $scope.getTransferReceiveHistory();
            });
        }


        $scope.getTransferReceiveHistory=function() {
            assetTransferReceiveService.getTransferReceiveHistory($scope.assetToTransfer.AssetSystemId).then(function (response) {
                $scope.assetTransferReceiveHistoryList = response.data;
                console.log($scope.assetTransferReceiveHistoryList);
                $scope.assetTransferReceiveHistoryList.forEach(function (atr) {
                    atr.WrittenDownValueToShow = Math.round(atr.WrittenDownValue);
                    var trot = $scope.officeTypeList.find(o => o.Value == atr.TransferredOfficeType);
                    if (trot)
                        atr.TransferredOfficeTypeStr = trot.Name;
                    var trd = $scope.districtList.find(o => o.Value == atr.TransferredDistrictId);
                    if (trd)
                        atr.TransferredDistrictName = trd.Name;
                    var trb = $scope.branchListAll.find(o => o.Value == atr.TransferredOfficeOrBranch);
                    if(trb)
                        atr.TransferredBranchName = trb.Name;
                    var rot = $scope.officeTypeList.find(o => o.Value == atr.ReceivingOfficeType);
                    if(rot)
                        atr.ReceivedOfficeTypeStr = rot.Name;
                    var trrd = $scope.districtList.find(o => o.Value == atr.ReceivingDistrictId);
                    if (trrd)
                        atr.ReceivedDistrictName = trrd.Name;
                    var rb = $scope.branchListMain.find(o => o.Value == atr.ReceivingOfficeBranchId);
                    if(rb)
                        atr.ReceivedBranchName = rb.Name;
                    atr.TransferStatusStr = $scope.transferStatusList.find(t=>t.Value == atr.TransferStatus).Name;
                    atr.TransferDateStr = moment(atr.TransferDate).format("YYYY-MM-DD");
                    atr.TransferBranchWorkingDateStr = moment(atr.TransferBranchWorkingDate).format("YYYY-MM-DD");
                    atr.ReceivedDateStr = atr.ReceivedDate==null?"":moment(atr.ReceivedDate).format("YYYY-MM-DD");
                    atr.ReceivingBranchWorkingDateStr =atr.ReceivingBranchWorkingDate==null?"": moment(atr.ReceivingBranchWorkingDate).format("YYYY-MM-DD");
                    
                });
                if ($scope.assetTransferReceiveHistoryList.find(t => t.TransferStatus == $rootScope.AssetConfig.AssetTransferStatus.TransferInitiated)) //1 for transfer inititated{
                {
                    $scope.btnTransferShow = false;
                    $scope.assetToTransferBranchId = $scope.assetTransferReceiveHistoryList.find(t => t.TransferStatus == $rootScope.AssetConfig.AssetTransferStatus.TransferInitiated).ReceivingOfficeBranchId;
                }
                console.log($scope.assetTransferReceiveHistoryList);


            });
        }

        $scope.getServerDateTime=function() {
            commonService.getServerDateTime().then(function (response) {
                $scope.serverDateTimeToday = response.data;
                $scope.assetToTransfer.TransferDate = $scope.selectedBranchId > 0 ? moment($rootScope.workingdate).format("YYYY-MM-DD") : moment($scope.serverDateTimeToday).format("YYYY-MM-DD");
            });
        }
        $scope.updateAssetToTransferFields=function(assetTot) {
            $scope.assetToTransfer = angular.copy(assetTot);
            $scope.recBranch = $scope.branchList.find(b => b.Value == $scope.assetToTransfer.ReceivingOfficeBranchId);
            $scope.assetToTransfer.Note = assetTot.TransferNote;
            $scope.assetToTransfer.TransferDate = new Date(assetTot.TransferDate);
            $scope.btnTransferShow = false;
            $scope.btnUpdateShow = true;
        }
        $scope.branchChange = function () {
            if ($scope.assetToTransferBranchId) {
                if ($scope.assetToTransferBranchId != $scope.recBranch.Value) {
                    $scope.updateButtonText = "Update and Transfer";
                } else {
                    $scope.updateButtonText = "Update";
                }
            }
        }
        $scope.transferDateChanged = function () {
            if (!$scope.assetToTransfer.TransferDate) 
                $scope.assetToTransfer.TransferDate = new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
        }
        //$scope.getReceivingBranchCurrentWorkingDate = function () {
        //    if ($scope.recBranch && $scope.recBranch.Value) {
        //        commonService.getBranchCurrentWorkingDateById($scope.recBranch.Value).then(function (response) {
        //            if (!response.data) {
        //                swal("Receiving Branch's current Working Date not found");
        //                $scope.receivingBranchCurrentWorkingDate = null;
        //                $scope.recBranch = null;
        //                return;
        //            }
        //            $scope.receivingBranchCurrentWorkingDate = moment(response.data).format("YYYY-MM-DD");
        //            if (moment($scope.assetToTransfer.TransferDate).format("YYYY-MM-DD") != $scope.receivingBranchCurrentWorkingDate) {
        //                swal("Receiving Branch's Working Date " + $scope.receivingBranchCurrentWorkingDate + " is not same as Transfer Date");
        //                $scope.receivingBranchCurrentWorkingDate = null;
        //                $scope.recBranch = null;
        //                return;
        //            }
        //        });
        //    }
        //}
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5))
                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.RM
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate)).add(-29, 'days')))
                || (moment(date) > moment(new Date($rootScope.workingdate))))

                || ($rootScope.selectedBranchId > 0 && ($rootScope.user.Role == $rootScope.UserRole.BM || $rootScope.user.Role == $rootScope.UserRole.ABM || $rootScope.user.Role == $rootScope.UserRole.LO)
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate))))
                || (moment(date) > moment(new Date($rootScope.workingdate))))

                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.DM
                && (
                 (moment(date) < moment(new Date($rootScope.workingdate)).add(-89, 'days')))
                || (moment(date) > moment(new Date($rootScope.workingdate))))

                || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.Admin
                && (moment(date) > moment(new Date($rootScope.workingdate))))
            ;
        }
        $scope.dateOptionsTransferDate = {
            //dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            minDate: new Date(moment($scope.asset.PurchaseWorkingDate).format("YYYY-MM-DD")),
            startingDay: 1,
            showWeeks: false
        }
        $scope.officeSeleted = function () {
                $("#office").blur();
        }
        $scope.getAssetByAssetId = function (assetId) {
            assetEntryService.getAssetById(assetId).then(function (response) {
                $scope.asset = response.data;
                $scope.asset.WrittenDownValue = Math.round($scope.asset.WrittenDownValue);
            });
        }
        $scope.transferAsset = function () {
            if (!$scope.recBranch.Value) {
                swal("Please select receiving office");
                return;
            }
            if ($scope.asset.Status != $rootScope.AssetConfig.AssetStatus.Active) {
                swal("Asset is inactive. Transfer operation can't be done");
                return;
            }
            if ($scope.asset.SubStatus == $rootScope.AssetConfig.AssetSubStatus.Intransit) {
                swal("Asset is intransit. Transfer operation can't be done");
                return;
            }
            //if (!$scope.asset.IsFixedAsset) {
            //    swal("Asset is not fixed asset. Transfer operation can't be done");
            //    return;
            //}
            var dayDiff = moment($rootScope.workingdate).diff(moment($scope.assetToTransfer.TransferDate), 'days');
            if ($rootScope.user.Role == $rootScope.UserRole.BM && dayDiff !== 0) {
                swal("BM is not allowed to perform this operation on this day");
                return;
            }
            if ($rootScope.user.Role == $rootScope.UserRole.DM && dayDiff > 90) {
                swal("DM is not allowed to perform this operation on this day");
                return;
            }
            //if (moment($scope.receivingBranchCurrentWorkingDate).format("YYYY-MM-DD") != moment($scope.assetToTransfer.TransferDate).format("YYYY-MM-DD")) {
            //    swal("Receiving branch's working date " + moment($scope.receivingBranchCurrentWorkingDate).format("YYYY-MM-DD")
            //        + " is not same as transfer date " + moment($scope.assetToTransfer.TransferDate).format("YYYY-MM-DD") + ". Asset can't be transferred");
            //    return;
            //}
            swal({
                title: "Confirm?",
                text: "Asset will be transferred",
                showCancelButton: true,
                confirmButtonText: "Yes, Transfer it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
           function (isConfirmed) {
               if (isConfirmed) {
                   //swal(__env.showMessage($rootScope.showMessage($rootScope.transferSuccess, $rootScope.AssetEntry)), "Successful!", "success");
                   $scope.assetToTransfer.TransferDate = new Date(moment($scope.assetToTransfer.TransferDate).format("YYYY-MM-DD"));
                   $scope.assetToTransfer.ReceivingOfficeBranchId = angular.copy($scope.recBranch.Value);
                   assetTransferReceiveService.transferAsset($scope.assetToTransfer)
                       .then(function (response) {
                           if (response.data.Success) {
                               $scope.getAssetByAssetId($scope.assetToTransfer.AssetSystemId);
                               $scope.getTransferReceiveHistory();
                               $rootScope.$broadcast('asset-transfer-finished');
                               swal({
                                   title:"Asset Transfer",
                                   text: "Asset Transferred Successfully",
                                   type: "success",
                                   //showCancelButton: true,
                                   //cancelButtonText: "Close",
                                   closeOnCancel: true
                               },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            //$scope.assetTransferForm.reset();
                                            //$scope.assetTransferForm.$dirty = false;
                                            //declareVariable();
                                            $scope.btnTransferShow = false;
                                        } 
                                    });
                           } else {
                               $scope.assetToTransfer.TransferDate = new Date(moment($scope.assetToTransfer.TransferDate).format("YYYY-MM-DD"));
                               swal($rootScope.showMessage($rootScope.transferError, $rootScope.AssetEntry), response.data.Message, "error");
                           }
                           $scope.clearAndCloseTab();
                       });
               }
           });
        }
        $scope.updateAssetTransfer=function() {

            if ($scope.asset.Status != $rootScope.AssetConfig.AssetStatus.Active) {
                swal("Asset is inactive. Transfer update operation can't be done");
                return;
            }
            if ($scope.asset.SubStatus != $rootScope.AssetConfig.AssetSubStatus.Intransit) {
                swal("Asset is not intransit. Transfer update operation can't be done");
                return;
            }
            swal({
                title: "Confirm?",
                text: "Asset transfer will be updated",
                showCancelButton: true,
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
           function (isConfirmed) {
               if (isConfirmed) {
                   //swal(__env.showMessage($rootScope.showMessage($rootScope.transferSuccess, $rootScope.AssetEntry)), "Successful!", "success");
                   $scope.assetToTransfer.ReceivingOfficeBranchId = angular.copy($scope.recBranch.Value);
                   $scope.assetToTransfer.TransferDate = new Date(moment($scope.assetToTransfer.TransferDate).format("YYYY-MM-DD"));
                   assetTransferReceiveService.updateAssetTransfer($scope.assetToTransfer)
                       .then(function (response) {
                           if (response.data.Success) {
                               $scope.getAssetByAssetId($scope.assetToTransfer.AssetSystemId);
                               $scope.getTransferReceiveHistory();
                               $rootScope.$broadcast('asset-transfer-update-finished');
                               swal({
                                   title: "Asset Transfer",
                                   text: "Asset Transferred Successfully",
                                   type: "success",
                                   showCancelButton: true,
                                   cancelButtonText: "Close",
                                   closeOnCancel: true
                               },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            //$scope.assetTransferForm.reset();
                                            //$scope.assetTransferForm.$dirty = false;
                                            //$scope.clearModelData();
                                        } else {
                                            //$scope.clearAndCloseTab();
                                        }
                                    });
                           } else {
                               swal($rootScope.showMessage($rootScope.transferError, $rootScope.AssetEntry), response.data.Message, "error");
                           }
                           $scope.clearAndCloseTab();
                       });
               }
           });
        }
        $scope.cancelTransferAsset = function (assetTransfer) {
            if ($scope.asset.Status != $rootScope.AssetConfig.AssetStatus.Active) {
                swal("Asset is inactive. Transfer cancel operation can't be done");
                return;
            }
            if ($scope.asset.SubStatus != $rootScope.AssetConfig.AssetSubStatus.Intransit) {
                swal("Asset is not intransit. Transfer cancel operation can't be done");
                return;
            }
            swal({
                title: "Confirm?",
                text: "Asset transfer will be cancelled",
                showCancelButton: true,
                confirmButtonText: "Yes, Cancel it!",
                cancelButtonText: "No",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
           function (isConfirmed) {
               if (isConfirmed) {
                   //swal(__env.showMessage($rootScope.showMessage($rootScope.transferSuccess, $rootScope.AssetEntry)), "Successful!", "success");
                   assetTransferReceiveService.cancelTransferAsset(assetTransfer)
                       .then(function (response) {
                           if (response.data.Success) {
                               //$scope.getAssetByAssetId($scope.assetToTransfer.AssetSystemId);
                               //$scope.getTransferReceiveHistory();
                               $rootScope.$broadcast('asset-transfer-reject-finished');
                               swal({
                                   title: "Asset Transfer",
                                   text: "Asset Transfer Cancelled Successfully",
                                   type: "success",
                                   showCancelButton: true,
                                   cancelButtonText: "Close",
                                   closeOnCancel: true
                               },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            //$scope.assetTransferForm.reset();
                                            //$scope.assetTransferForm.$dirty = false;
                                            //$scope.clearModelData();
                                        } else {
                                            //$scope.clearAndCloseTab();
                                        }
                                    });
                           } else {
                               swal($rootScope.showMessage($rootScope.transferError, $rootScope.AssetEntry), response.data.Message, "error");
                           }
                           $scope.clearAndCloseTab();
                       });
               }
           });
        }
        $scope.clearAndCloseTab = function () {
           // $scope.asset = {};
            //$timeout(function() {
            $('#saveComplete').modal('hide');
            $('.modal-backdrop').remove();
            // }, 500);
            $scope.execRemoveTab($scope.tab);
        };
        $scope.init = function () {
            $scope.GetAdditinalFilters();
            
            //$scope.getAsset();
            //$scope.filterParams = {};
            
        }
        $scope.init();

    }
]);