ammsAng.controller('assetReceiveController', [
    '$scope', '$rootScope', '$timeout', 'assetTransferReceiveService', 'branchService', 'filterService', 'workingDayService', 'commonService',
    'DTOptionsBuilder', 'DTColumnDefBuilder', 'employeeFilterService',
    function ($scope, $rootScope, $timeout, assetTransferReceiveService, branchService, filterService, workingDayService, commonService,
         DTOptionsBuilder, DTColumnDefBuilder, employeeFilterService) {

        var declareVariable = function () {
            //$scope.btnTransferShow = true;
            $scope.assetToReceive = {};
            //$scope.assetToReceive.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            $scope.officeTypeList = [];
            $scope.branchList = [];
            $scope.branchListMain = [];
            $scope.receivableAssetList = [];
            $scope.receivableAssetListMain = [];
        }
        $scope.openReceiveDatePopup = function () {
            $scope.popupReceiveDate.opened = true;
        };
        $scope.popupReceiveDate = {
            opened: false
        };
        declareVariable();
        $scope.officeSeleted = function () {
            $("#searchBranch").blur();
        }
        $scope.filterTransferReceiveListByBranchId=function() {
            console.log($scope.searchBranch);
            $scope.receivableAssetList = $scope.receivableAssetListMain.filter(l => l.TransferredOfficeOrBranch == $scope.searchBranch.Value);
            $scope.receivableAssetList.forEach(function (atr) {
                var trot = $scope.officeTypeList.find(o => o.Value == atr.TransferredOfficeType);
                if (trot)
                    atr.TransferredOfficeTypeStr = trot.Name;
                var trd = $scope.districtList.find(o => o.Value == atr.TransferredDistrictId);
                if (trd)
                    atr.TransferredDistrictName = trd.Name;
                var trb = $scope.branchListMain.find(o => o.Value == atr.TransferredOfficeOrBranch);
                if (trb)
                    atr.TransferredBranchName = trb.Name;
                var rot = $scope.officeTypeList.find(o => o.Value == atr.ReceivingOfficeType);
                if (rot)
                    atr.ReceivedOfficeTypeStr = rot.Name;
                var trrd = $scope.districtList.find(o => o.Value == atr.ReceivingDistrictId);
                if (trrd)
                    atr.TransferredDistrictName = trrd.Name;
                var rb = $scope.branchListMain.find(o => o.Value == atr.ReceivingOfficeBranchId);
                if (rb)
                    atr.ReceivedBranchName = rb.Name;
                atr.TransferStatusStr = $scope.transferStatusList.find(t=>t.Value == atr.TransferStatus).Name;
                atr.TransferDateStr = moment(atr.TransferDate).format("YYYY-MM-DD");
                atr.TransferBranchWorkingDateStr = moment(atr.TransferBranchWorkingDate).format("YYYY-MM-DD");
                atr.ReceivedDateStr = atr.ReceivedDate == null ? "" : moment(atr.ReceivedDate).format("YYYY-MM-DD");
                atr.ReceivingBranchWorkingDateStr = atr.ReceivingBranchWorkingDate == null ? "" : moment(atr.ReceivingBranchWorkingDate).format("YYYY-MM-DD");
                atr.ReceivedOrRejectByUserId = $rootScope.user.EmployeeId;
                atr.WrittenDownValueToShow = Math.round(atr.WrittenDownValue);
            });
        }
        $scope.getReceivableAssetListOfTheBranch = function () {
            assetTransferReceiveService.getReceivableAssetListOfTheBranch($rootScope.selectedBranchId,moment($rootScope.workingdate).format("YYYY-MM-DD")).then(function (response) {
                $scope.receivableAssetList = angular.copy(response.data);
                $scope.receivableAssetListMain = angular.copy(response.data);
                $scope.receivableAssetList.forEach(function (atr) {
                    var trot = $scope.officeTypeList.find(o => o.Value == atr.TransferredOfficeType);
                    if (trot)
                        atr.TransferredOfficeTypeStr = trot.Name;
                    var trd = $scope.districtList.find(o => o.Value == atr.TransferredDistrictId);
                    if (trd)
                        atr.TransferredDistrictName = trd.Name;
                    var trb = $scope.branchListMain.find(o => o.Value == atr.TransferredOfficeOrBranch);
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
                    atr.ReceivedDateStr = atr.ReceivedDate == null ? "" : moment(atr.ReceivedDate).format("YYYY-MM-DD");
                    atr.ReceivingBranchWorkingDateStr = atr.ReceivingBranchWorkingDate == null ? "" : moment(atr.ReceivingBranchWorkingDate).format("YYYY-MM-DD");
                    atr.ReceivedOrRejectByUserId = $rootScope.user.EmployeeId;
                    atr.WrittenDownValueToShow = Math.round(atr.WrittenDownValue);
                });
                //console.log(response.data);
            });
        }
        $scope.updateAssetToReceiveFields = function (asset, isReceived) {
            $scope.isAssetReceived = isReceived;
            if (isReceived==1) {
                $scope.assetToReceive = asset;
                $scope.assetToReceive.TransferReferenceNo = asset.TransferReferenceNo;
                $scope.assetToReceive.TransferredOfficeOrBranch = asset.TransferredOfficeOrBranch;
                $scope.assetToReceive.TransferredOfficeType = asset.TransferredOfficeType;
                $scope.assetToReceive.TransferDate = new Date(asset.TransferDate);
                $scope.assetToReceive.TransferDateS = moment(asset.TransferDate).format("YYYY-MM-DD");
                $scope.assetToReceive.ReceivingOfficeBranchId = $rootScope.selectedBranchId;
                $scope.assetToReceive.ReceivingBranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                $scope.assetToReceive.ReceivedDate = new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
                $scope.assetToReceive.ReceivedDateS = moment($rootScope.workingdate).format("YYYY-MM-DD");
                $scope.assetToReceive.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            } else if (isReceived == -1) {
                $scope.assetToReject = asset;
                $scope.assetToReceive.TransferReferenceNo = asset.TransferReferenceNo;
                $scope.assetToReceive.TransferredOfficeOrBranch = asset.TransferredOfficeOrBranch;
                $scope.assetToReceive.TransferredOfficeType = asset.TransferredOfficeType;
                $scope.assetToReceive.TransferDate = new Date(asset.TransferDate);
                $scope.assetToReceive.TransferDateS = moment(asset.TransferDate).format("YYYY-MM-DD");
                $scope.assetToReceive.ReceivingOfficeBranchId = $rootScope.selectedBranchId;
                $scope.assetToReceive.ReceivingBranchWorkingDate =  moment($rootScope.workingdate).format("YYYY-MM-DD");
                $scope.assetToReceive.ReceivedDate = new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
                $scope.assetToReceive.ReceivedDateS = moment($rootScope.workingdate).format("YYYY-MM-DD");
                $scope.assetToReceive.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            }
        }

        $scope.GetAdditinalFilters=function() {
            assetTransferReceiveService.GetAdditinalFilters().then(function (response) {
                console.log(response.data);
                $scope.officeTypeList = angular.copy(response.data.officeType);
                $scope.branchList = angular.copy(response.data.branchList);
                $scope.districtList = angular.copy(response.data.districtList);
                $scope.branchListMain = angular.copy(response.data.branchList);
                $scope.transferStatusList = angular.copy(response.data.transferStatusList);
                $scope.getReceivableAssetListOfTheBranch();
            });
        }
        $scope.receiveAsset = function () {
            //if ($scope.assetToReceive.TransferDate > $scope.assetToReceive.ReceivedDate) {
            //    swal("Receiving date is less than Transfer date. Asset can't be received");
            //    return;
            //}
            //var rDayDiff = moment($scope.assetToReceive.ReceivedDate).diff(moment($scope.assetToReceive.TransferDate), 'days');
            //if (rDayDiff !== 0) {
            //    swal("Receive date is not equal to Transfer Date. Receive operation can't be done");
            //    return;
            //}
            var dayDiff = moment($rootScope.workingdate).diff(moment($scope.assetToReceive.ReceivedDate), 'days');
            if ($rootScope.user.Role == $rootScope.UserRole.DM && dayDiff > 90) {
                swal("DM is not allowed to perform this operation on this day");
                return;
            }
            if (!$scope.assetToReceive.Note) {
                swal("Note is required");
                return;
            }
            swal({
                title: "Confirm?",
                text: "Asset will be Received",
                showCancelButton: true,
                confirmButtonText: "Yes, Receive it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
           function (isConfirmed) {
               if (isConfirmed) {
                   //swal(__env.showMessage($rootScope.showMessage($rootScope.transferSuccess, $rootScope.AssetEntry)), "Successful!", "success");
                   $scope.assetToReceive.ReceivedDate = new Date(moment($scope.assetToReceive.ReceivedDate).format("YYYY-MM-DD"));
                   assetTransferReceiveService.receiveAsset($scope.assetToReceive)
                       .then(function (response) {
                           if (response.data.Success) {
                               $scope.isAssetReceived = -2;
                               $rootScope.$broadcast('asset-received-finished');
                               $scope.getReceivableAssetListOfTheBranch();
                               swal({
                                   title:"Asset Receive",
                                   text: "Asset Received Successfully",
                                   type: "success",
                                   showCancelButton: true,
                                   cancelButtonText: "Close",
                                   closeOnCancel: true
                               },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            //$scope.assetReceiveForm.reset();
                                            //$scope.assetReceiveForm.$dirty = false;
                                            //$scope.getReceivableAssetListOfTheBranch();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                           } else {
                               swal($rootScope.showMessage($rootScope.transferError, $rootScope.AssetEntry), response.data.Message, "error");
                           }
                       });
               }
           });
        }
        $scope.rejectReceiveAsset = function () {
            if (!$scope.assetToReject) return;
            if (!$scope.assetToReceive.Note) {
                swal("Note is required");
                return;
            }
            swal({
                title: "Confirm?",
                text: "Asset Receive will be rejected",
                showCancelButton: true,
                confirmButtonText: "Yes, reject it!",
                cancelButtonText: "No",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
           function (isConfirmed) {
               if (isConfirmed) {
                   //swal(__env.showMessage($rootScope.showMessage($rootScope.transferSuccess, $rootScope.AssetEntry)), "Successful!", "success");
                   $scope.assetToReject.Note = $scope.assetToReceive.Note;
                   $scope.assetToReject.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                   assetTransferReceiveService.rejectReceiveAsset($scope.assetToReject)
                       .then(function (response) {
                           if (response.data.Success) {
                               $scope.isAssetReceived = -2;
                               $rootScope.$broadcast('asset-received-reject-finished');
                               $scope.getReceivableAssetListOfTheBranch();
                               swal({
                                   title: "Asset Receive Reject",
                                   text: "Asset receive rejected Successfully",
                                   type: "success",
                                   showCancelButton: true,
                                   cancelButtonText: "Close",
                                   closeOnCancel: true
                               },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            //$scope.assetReceiveForm.reset();
                                            //$scope.assetReceiveForm.$dirty = false;
                                            //$scope.getReceivableAssetListOfTheBranch();
                                            //$scope.clearModelData();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                           } else {
                               swal($rootScope.showMessage($rootScope.transferError, $rootScope.AssetEntry), response.data.Message, "error");
                           }
                       });
               }
           });
        }
        $scope.getBranchesByRoleAndBranch = function() {
            commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, parseInt($rootScope.user.Role)).then(function(response) {
                $scope.BranchList = response.data;
                $scope.BranchListMain = angular.copy(response.data);
            });
        }
        $scope.init = function () {
            $scope.getBranchesByRoleAndBranch();
            $scope.GetAdditinalFilters();
            
            //$scope.getAsset();
            //$scope.filterParams = {};
           

        }
        $scope.init();

        $scope.clearAndCloseTab = function () {
            $scope.assetToReceive = {};
            declareVariable();
            $scope.execRemoveTab($scope.tab);
        };

    }
]);