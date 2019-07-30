ammsAng.controller('depreciationController', ['$scope', '$rootScope', 'assetDepreciationService', '$timeout', 'DTOptionsBuilder', 'commonService', 'assetEntryService',
    function ($scope, $rootScope, assetDepreciationService, $timeout, DTOptionsBuilder, commonService, assetEntryService) {
        $scope.testValue = "testvalue";
        $scope.assetList = null;

        $scope.init = function () {
            $scope.filterParams = {};
            $scope.getBranchesByRoleAndBranch();
            $scope.GetFilters();
            $scope.allAssets = false;
            $scope.showRunDep = false;
            $scope.filterParams.Office = { title: $rootScope.selectedBranchTitle, originalObject: { Name: $rootScope.selectedBranchTitle, Value: $rootScope.selectedBranchId } };

            //if ($rootScope.selectedBranchId < 1)
            //        $scope.filterParams.OfficeType = 3; // Asa Central Office 
            //    else $scope.filterParams.OfficeType = $scope.filterParams.OfficeTypeList[0].Value;
            //$scope.filterParams.OfficeId = $rootScope.selectedBranchId;
        }

        $scope.getBranchesByRoleAndBranch = function () {
            commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, $rootScope.user.Role).then(function (response) {
                $scope.BranchList = response.data;
                $scope.BranchListMain = angular.copy(response.data);
            }, AMMS.handleServiceError);
        }

        $scope.filterOfficeList = function (officeLevel) {
            $scope.$broadcast('angucomplete-alt:clearInput');
            
            if (officeLevel == "-100000") $scope.BranchList = $scope.BranchListMain;
            else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == officeLevel);
        }

        $scope.UpdateOfficeType = function () {
            $scope.filterParams.OfficeType = $scope.BranchList.filter(br => br.Value == $scope.filterParams.OfficeId)[0].RelationalValue;
        }

        $scope.GetFilters = function () {
            //$("#loadingImage").css("display", "block");
            assetEntryService.GetAdditionalFilters($rootScope.selectedBranchId,-100000).then(function(response) {

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
                $scope.filterParams.OfficeId = $rootScope.selectedBranchId;


                if ($scope.filterParams.OfficeType == "-100000") $scope.BranchList = $scope.BranchListMain;
                else $scope.BranchList = $scope.BranchListMain.filter(b => b.RelationalValue == $scope.filterParams.OfficeType);
            });
        }

        $scope.getAssetsOfBranch = function () {
            $("#loadingImage").css("display", "block");
            if ($scope.filterParams.Office) $scope.filterParams.OfficeId = $scope.filterParams.Office.originalObject.Value;
            else { $("#loadingImage").css("display", "none"); swal("Please select a branch"); return; }
            assetDepreciationService.getAllAssetsOfBranch($scope.filterParams.OfficeId, $rootScope.user.Role).then(function (response) {
                $scope.assetList = response.data;
                if ($scope.assetList.length > 0) $scope.showRunDep = true;
                $scope.assetList.forEach(function(a) {
                    a.IsChecked = false;
                    a.PurchaseWorkingDate = moment(a.PurchaseWorkingDate).format('DD-MM-YYYY');
                    if (a.LastDepreciationPeriod != null) {
                        a.LastDepreciationPeriod = moment(a.LastDepreciationPeriod).format('MMMM-YYYY');
                        if (moment(a.LastDepreciationPeriod).format('DD-MM-YYYY') == '01-01-1901') a.LastDepreciationPeriod = '';
                    }
                    a.WrittenDownValue = Math.round(a.WrittenDownValue);
                    a.CurrentYearDepreciationAmount = Math.round(a.CurrentYearDepreciationAmount);
                    a.AccumulatedDepreciationAmount = Math.round(a.AccumulatedDepreciationAmount);
                    if (a.ThisRunDepreciation != null) a.ThisRunDepreciation = Math.round(a.ThisRunDepreciation);
                    //a.LastDepreciationPeriod = moment(a.LastDepreciationPeriod).format('ddd, DD/MM/YYYY');
                });
                if ($scope.assetList.length > 0) {
                    $scope.WorkingDate = moment($scope.assetList[0].WorkingDate).format('DD-MM-YYYY');
                    $scope.LastDepreciationbatch = $scope.assetList[0].LastDepreciationbatch;
                    $scope.LastDepreciationBatchPeriod = $scope.assetList[0].LastDepreciationBatchPeriod;
                }
                $("#loadingImage").css("display", "none");
            });
            
        }
        $scope.ChangeAllCheck = function () {
            $scope.allAssets = !$scope.allAssets;
            if (!$scope.allAssets) {
                $scope.assetList.forEach(function(a) {
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

        $scope.RunDepreciation = function () {

            if ($scope.assetList.filter(a => a.IsChecked).length < 1) {
                swal("Please select at least one asset");
                return;
            }
            
            swal({
                title: $rootScope.showMessage($rootScope.RunDepreciationConfirm, $rootScope.Depreciation),
                showCancelButton: true,
                confirmButtonText: "Yes, Run Depreciation!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function (isConfirmed) {
                    if (isConfirmed) {
                        assetDepreciationService.Depreciate($scope.assetList).then(function (response) {
                            if (response.data.Success) {
                                swal($rootScope.showMessage($rootScope.DepreciationSuccess, $rootScope.Depreciation), "Successful!", "success");
                                $scope.init();
                                $scope.removeTab($scope.tab);
                                $scope.getAssetsOfBranch();
                            } else swal($rootScope.showMessage($rootScope.addError, $rootScope.AssetEntry), response.data.Message, "error");
                        });
                    } else {
                        swal("Cancelled", "something is wrong", "error");
                    }
                });
        }


    }]);