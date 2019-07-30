ammsAng.controller('assetItemTypeAddController', ['$scope', '$rootScope', 'assetTypeService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder',
    function ($scope, $rootScope, assetTypeService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder) {



        $scope.dropdownSetting = {
            buttonClasses: 'custom-multi-select '
        }

        $scope.getAssetCategoryDepriciation = function () {
            assetTypeService.getAssetCategoryDepriciation().then(function (response) {
                $scope.AssetItemDepriciationsAll = response.data;

                $scope.AssetItemDepriciationsAll.forEach(function (e) {

                    if (moment(e.EffectiveDateFrom).year() > 1971)
                        e.EffectiveDateFrom = moment(e.EffectiveDateFrom).format('DD-MM-YYYY');
                    else e.EffectiveDateFrom = null;


                    if (moment(e.EffectiveDateTo).year() > 1971)
                        e.EffectiveDateTo = moment(e.EffectiveDateTo).format('DD-MM-YYYY');
                    else e.EffectiveDateTo = null;
                });
                console.log($scope.AssetItemDepriciationsAll);
                $scope.filterItemDepriciation();
            });
        }
        $scope.filterItemDepriciation = function () {
            $scope.AssetItemDepriciations = $scope.AssetItemDepriciationsAll.filter(i => i.CategoryId === $scope.itemType.CategoryId);
            $scope.itemType.ItemDepriciations = $scope.AssetItemDepriciationsAll.filter(i => i.CategoryId === $scope.itemType.CategoryId);
            $scope.PermittedOfficeLevelListByCategory = [];
            $scope.itemType.PermittedOfficeLevel = [];
            var permittedOfficeListByCategory = $scope.PermittedOfficeLevelList.filter(p => p.categoryId == $scope.itemType.CategoryId);
            permittedOfficeListByCategory.forEach(function(permittedOffice) {
                $scope.PermittedOfficeLevelListByCategory.push({ id: permittedOffice.id, label: permittedOffice.label });
                $scope.itemType.PermittedOfficeLevel.push({ id: permittedOffice.id});
            });
        }

        $scope.getCategorynStatusList = function () {
            assetTypeService.getCategorynStatusList().then(function (response) {
                $scope.filters = response.data;
                $scope.filters.CategoryList = response.data.CategoryList.filter(c => c.RelationalValue == $rootScope.AssetConfig.CategoryStatus.Active);
                $scope.filters.StatusList= $scope.filters.StatusList.filter(s => s.Value == $rootScope.AssetConfig.ItemTypeStatus.Active);
                console.log($scope.filters);
                $scope.itemType.Status = $scope.filters.StatusList[0].Value;
                $scope.filters.PermittedOfficeLevelList.forEach(function (r) {
                    $scope.PermittedOfficeLevelList.push({ id: r.Value, label: r.Name, categoryId: r.Order });
                });

                $scope.getAssetCategoryDepriciation();
            });
        }
        $scope.itemTypeDepriciationRateChange = function (index) {
            if ($scope.AssetItemDepriciations != null) {
                if ($scope.AssetItemDepriciations[index]) {
                    if ($scope.AssetItemDepriciations[index].DepreciationRate) {
                        if ($scope.AssetItemDepriciations[index].DepreciationRate < $scope.AssetItemDepriciations[index].DepreciationRateMin || $scope.AssetItemDepriciations[index].DepreciationRate > $scope.AssetItemDepriciations[index].DepreciationRateMax)
                            return "Enter between " + $scope.AssetItemDepriciations[index].DepreciationRateMin + " & " + $scope.AssetItemDepriciations[index].DepreciationRateMax;
                    } else {
                        if ($scope.AssetItemDepriciations[index].DepreciationRateMin == 0 && $scope.AssetItemDepriciations[index].DepreciationRate==0) return true;
                        return "Enter between " + $scope.AssetItemDepriciations[index].DepreciationRateMin + " & " + $scope.AssetItemDepriciations[index].DepreciationRateMax;
                    }
                } else {
                    return "Invalid";
                }
            }
            return true;
        }
        $scope.itemTypeUsefulLifeChange = function (index) {
            if ($scope.AssetItemDepriciations != null) {
                if ($scope.AssetItemDepriciations[index]) {
                    if ($scope.AssetItemDepriciations[index].UsefulLife) {
                        if ($scope.AssetItemDepriciations[index].UsefulLife < $scope.AssetItemDepriciations[index].UsefulLifeMin || $scope.AssetItemDepriciations[index].UsefulLife > $scope.AssetItemDepriciations[index].UsefulLifeMax)
                            return "Enter between " + $scope.AssetItemDepriciations[index].UsefulLifeMin + " & " + $scope.AssetItemDepriciations[index].UsefulLifeMax;
                    } else {
                        if ($scope.AssetItemDepriciations[index].UsefulLifeMin == 0 && $scope.AssetItemDepriciations[index].UsefulLife == 0) return true;
                        return "Enter between " + $scope.AssetItemDepriciations[index].UsefulLifeMin + " & " + $scope.AssetItemDepriciations[index].UsefulLifeMax;
                    }
                } else {
                    return "Invalid";
                }
            }
            return true;
        }
        $scope.clearAndCloseTab = function () {
            $scope.tab.FormType = 'View';
            $scope.removeTab($scope.tab);
        };
        $scope.itemTypeNameValidator=function() {
            if (!$scope.itemType.Name)
                return "Name is required";
            if ($scope.filters.ItemNameList.find(i => i.Name.toLowerCase() == $scope.itemType.Name.toLowerCase()))
                return "Name already exist";
            return true;
        }
        $scope.itemTypeShortNameValidator = function () {
            if (!$scope.itemType.ShortName)
                return "Short Name is required";
            if ($scope.filters.ItemShortNameList.find(i => i.Name.toLowerCase() == $scope.itemType.ShortName.toLowerCase()))
                return "Short Name already exist";
            return true;
        }

        $scope.addAssetItem = function () {
            var swalMessage = "";
            $scope.AssetItemDepriciations.forEach(function (m, index) {
                if (m.DepreciationRate < m.DepreciationRateMin || m.DepreciationRate > m.DepreciationRateMax) {
                    swalMessage += "[ Row - " + (index + 1) + "] " + "DepreciationRate Must be between " + m.DepreciationRateMin + " & " + m.DepreciationRateMax + " \n";

                }
            });
            if (swalMessage !== "") {
                swal(swalMessage);
                return;
            }
            if ($scope.itemType.PermittedOfficeLevel.length < 1) {
                swal("Please select permitted office level");
                return;
            }

            $scope.itemType.ItemDepriciations.forEach(function (iDep) {
                iDep.EffectiveDateFrom = moment(iDep.EffectiveDateFrom, 'DD-MM-YYYY').format();
                iDep.EffectiveDateTo = moment(iDep.EffectiveDateTo, 'DD-MM-YYYY').format();
            });

            var permittedOffceStr = "";
            $scope.itemType.PermittedOfficeLevel.forEach(function (b) {
                permittedOffceStr += b.id.toString() + ",";
            });
            $scope.itemType.PermittedOfficeLevel = permittedOffceStr.slice(0, -1);
            console.log($scope.itemType);

            swal({
                title: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.AssetItemType),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function (isConfirmed) {
                    if (isConfirmed) {
                        assetTypeService.addItemType($scope.itemType).then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('itemtype-add-finished', $scope.itemType);
                                swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.AssetItemType), "Successful!", "success");
                                $scope.addAssetItemForm.$dirty = true;
                                $scope.addAssetItemForm.$valid = false;
                                $scope.resetValues();
                                $scope.clearAndCloseTab();
                            } else {
                                $scope.getAssetCategoryDepriciation();
                                $scope.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.split(",");
                                $scope.itemType.PermittedOfficeLevel = [];
                                $scope.PermittedOfficeLevel.forEach(function (p) {
                                    $scope.itemType.PermittedOfficeLevel.push(p);
                                });
                                $scope.itemType.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.map(function (a) { return { id: Number(a) } });

                                swal($rootScope.showMessage($rootScope.addError, $rootScope.AssetItemType), response.data.Message, "error");
                            }
                        }, AMMS.handleServiceError);
                    } else {

                        $scope.getAssetCategoryDepriciation();
                        $scope.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.split(",");
                        $scope.itemType.PermittedOfficeLevel = [];
                        $scope.PermittedOfficeLevel.forEach(function (p) {
                            $scope.itemType.PermittedOfficeLevel.push(p);
                        });
                        $scope.itemType.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.map(function (a) { return { id: Number(a) } });

                        swal("Cancelled", "something is wrong", "error");
                    }
                });
        }
        $scope.resetValues=function() {
            $scope.itemType = {};
        }

        var init = function () {

            $scope.itemType = {};
            $scope.itemType.PermittedOfficeLevel = [];
            $scope.PermittedOfficeLevelList = [];

            $scope.getCategorynStatusList();
        }

        init();

    }]);