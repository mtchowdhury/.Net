ammsAng.controller('rollbackDepreciationController', ['$scope', '$rootScope', 'assetDepreciationService', '$timeout', 'DTOptionsBuilder', 'commonService', 'assetEntryService',
    function ($scope, $rootScope, assetDepreciationService, $timeout, DTOptionsBuilder, commonService, assetEntryService) {
        $scope.testValue = "testvalue";
        $scope.assetList = null;

        $scope.init = function () {
            $scope.filterParams = {};
            $scope.getBranchesByRoleAndBranch();
            $scope.GetFilters();
            $scope.allAssets = false;
            $scope.showRollbackByOptions = false;
            $scope.showRollback = false;
            $scope.assetList = [];
            $scope.filterParams.Office = { Name: $rootScope.selectedBranchTitle, Value: $rootScope.selectedBranchId };
        }

        $scope.getBranchesByRoleAndBranch = function () {
            commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, $rootScope.user.Role).then(function (response) {
                $scope.BranchList = response.data;
                $scope.BranchListMain = angular.copy(response.data);
                $scope.getRollbackFIlters(); // call for initial rollback options fetch

            }, AMMS.handleServiceError);
        }

        $scope.UpdateOfficeType = function () {
            $scope.filterParams.OfficeType = $scope.BranchList.filter(br => br.Value == $scope.filterParams.OfficeId)[0].RelationalValue;
        }

        $scope.changeOfficeId = function() {
            $scope.getRollbackFIlters();
        }

        $scope.getRollbackFIlters = function () {
            $("#loadingImage").css("display", "block");
            $scope.filterParams.OfficeId = $scope.filterParams.Office.Value;
            assetDepreciationService.GetFilters($scope.filterParams.OfficeId).then(function (response) {
                $scope.filterParams.RollbackByList = response.data.rollbackBy;
                $scope.filterParams.RollbackByOptionsListMain = angular.copy(response.data.rollbackByOptions);
                if ($scope.filterParams.RollbackByOptionsListMain) $scope.showRollbackByOptions = true;
                $scope.LastDepreciationInfoMain = angular.copy(response.data.LastDepreciationInfo);
                $scope.WorkingDate = moment($scope.LastDepreciationInfoMain.filter(d => d.Name == "WorkingDate")[0].Date).format('DD-MM-YYYY');
                if ($scope.LastDepreciationInfoMain.filter(d => d.Name == "LastDepreciationBatch")[0]) $scope.LastDepreciationbatch = $scope.LastDepreciationInfoMain.filter(d => d.Name == "LastDepreciationBatch")[0].StrValue;
                if ($scope.LastDepreciationInfoMain.filter(d => d.Name == "LastDepreciationPeriod")[0]) $scope.LastDepreciationBatchPeriod = $scope.LastDepreciationInfoMain.filter(d => d.Name == "LastDepreciationPeriod")[0].StrValue;
                $("#loadingImage").css("display", "none");
            });
        }
        $scope.filterOfficeList = function (officeLevel) {
            //$scope.$broadcast('angucomplete-alt:clearInput');
            $scope.filterParams.Office = null;
            if (officeLevel == "-100000") $scope.BranchList = $scope.BranchListMain;
            else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == officeLevel);
        }

        $scope.GetFilters = function () {
            $("#loadingImage").css("display", "block");
            assetEntryService.GetAdditionalFilters($rootScope.selectedBranchId, -100000).then(function (response) {
               

                $scope.filterParams.OfficeTypeList = response.data.PermittedOfficeLevel;
                $scope.filterParams.OfficeTypeListMain = angular.copy(response.data.PermittedOfficeLevel);
                //role base office type filters
                if ($rootScope.user.Role == $rootScope.UserRole.BM || $rootScope.user.Role == $rootScope.UserRole.RM)
                    $scope.filterParams.OfficeTypeList = $scope.filterParams.OfficeTypeListMain.filter(o => o.Value == $rootScope.AssetConfig.OfficeType.Branch);
                if ($rootScope.user.Role == $rootScope.UserRole.ZM || $rootScope.user.Role == $rootScope.UserRole.DM)
                    $scope.filterParams.OfficeTypeList = $scope.filterParams.OfficeTypeListMain.filter(o => o.Value == $rootScope.AssetConfig.OfficeType.Branch || o.Value == $rootScope.AssetConfig.OfficeType.Division);
                if ($rootScope.user.Role == $rootScope.UserRole.Admin) {
                    $scope.filterParams.OfficeTypeList = $scope.filterParams.OfficeTypeListMain.filter(o => o.Value == $rootScope.AssetConfig.OfficeType.Branch || o.Value == $rootScope.AssetConfig.OfficeType.Division || o.Value == $rootScope.AssetConfig.OfficeType.Central);
                }


                if ($rootScope.selectedBranchId < 1)
                    $scope.filterParams.OfficeType = 3; // Asa Central Office 
                else $scope.filterParams.OfficeType = $scope.filterParams.OfficeTypeList[0].Value;

                if ($scope.filterParams.OfficeType == "-100000") $scope.BranchList = $scope.BranchListMain;
                else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == $scope.filterParams.OfficeType);
                $("#loadingImage").css("display", "none");
            });

            
        }

        $scope.filterRollbackBy = function() {
            $scope.filterParams.RollbackByOptionsList = $scope.filterParams.RollbackByOptionsListMain.filter(r => r.RelationalValue == $scope.filterParams.RollbackBy);
            if ($scope.filterParams.RollbackBy == $rootScope.AssetConfig.RollbackDepreciation.RollbackBy.Selection)
                $scope.showRollbackByOptions = false;
            else $scope.showRollbackByOptions = true;
        }

        $scope.getAssetsOfBranch = function () {
            if ($scope.filterParams.RollbackBy == null) {
                swal("Please select a Rollback By option");
                return;
            }
            else if ($scope.filterParams.RollbackBy == $rootScope.AssetConfig.RollbackDepreciation.RollbackBy.BatchId || $scope.filterParams.RollbackBy == $rootScope.AssetConfig.RollbackDepreciation.RollbackBy.DepreciationPeriod) {
                if ($scope.filterParams.RollbackByOption == null) {
                    swal("Please select a BatchId/ Depreciation Period");
                    return;
                }
            }

            if ($scope.filterParams.Office) $scope.filterParams.OfficeId = $scope.filterParams.Office.Value;
            else { $("#loadingImage").css("display", "none");
                swal("Please select a branch");return; }

            if ($scope.filterParams.RollbackBy == $rootScope.AssetConfig.RollbackDepreciation.RollbackBy.Selection)
                $scope.filterParams.RollbackByOption = -1;
            $("#loadingImage").css("display", "block");
            assetDepreciationService.getRollbackdepreciation($scope.filterParams.OfficeId, $scope.filterParams.RollbackBy, $scope.filterParams.RollbackByOption).then(function (response) {
                $scope.assetList = response.data;
                if ($scope.assetList.length > 0) $scope.showRollback = true;
                $scope.assetList.forEach(function (a) {
                    a.IsChecked = false;
                    a.PurchaseWorkingDate = moment(a.PurchaseWorkingDate).format('DD-MM-YYYY');
                    if (a.LastDepreciationPeriod != null) a.LastDepreciationPeriod = moment(a.LastDepreciationPeriod).format('DD-MM-YYYY');
                    a.WrittenDownValue = Math.round(a.WrittenDownValue);
                    a.CurrentYearDepreciationAmount = Math.round(a.CurrentYearDepreciationAmount);
                    a.AccumulatedDepreciationAmount = Math.round(a.AccumulatedDepreciationAmount);
                    a.LastDepreciationAmount = Math.round(a.LastDepreciationAmount);
                    if (a.ThisRunDepreciation != null) a.ThisRunDepreciation = Math.round(a.ThisRunDepreciation);
                });
                $("#loadingImage").css("display", "none");
            });

        }
        $scope.ChangeAllCheck = function () {
            $scope.allAssets = !$scope.allAssets;
            if (!$scope.allAssets) {
                $scope.assetList.forEach(function (a) {
                    a.IsChecked = false;
                });
            }
            else if ($scope.allAssets) {
                $scope.assetList.forEach(function (a) {
                    a.IsChecked = true;
                });
            }
        }

        $scope.init();

        $scope.RollbackDepreciation = function () {
            if ($scope.filterParams.RollbackBy == $rootScope.AssetConfig.RollbackDepreciation.RollbackBy.Selection)
                $scope.filterParams.RollbackByOption = -1;
            if ($scope.assetList.filter(a => a.IsChecked).length < 1) {
                swal("Please select at least one asset");
                return;
            }

            swal({
                title: $rootScope.showMessage($rootScope.RollbackDepreciationConfirm, $rootScope.Depreciation),
                showCancelButton: true,
                confirmButtonText: "Yes, Rollback Depreciation!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function (isConfirmed) {
                    if (isConfirmed) {
                        assetDepreciationService.RollbackDepreciate($scope.assetList).then(function (response) {
                            if (response.data.Success) {
                                swal($rootScope.showMessage($rootScope.DepreciationSuccess, $rootScope.RollbackDepreciation), "Successful!", "success");
                                $scope.init();
                            } else swal($rootScope.showMessage($rootScope.addError, $rootScope.RollbackDepreciation), response.data.Message, "error");
                        });
                    } else {
                        swal("Cancelled", "something is wrong", "error");
                    }
                });
        }
    }]);