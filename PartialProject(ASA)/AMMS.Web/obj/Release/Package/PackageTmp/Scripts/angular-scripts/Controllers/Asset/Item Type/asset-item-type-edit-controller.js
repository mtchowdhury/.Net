ammsAng.controller('assetItemTypeEditController', ['$scope', '$rootScope', 'assetTypeService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder',
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
               // $scope.filterItemDepriciation();
            });
        }
        $scope.fixedChange=function() {
            if ($scope.itemType.IsFixedStatus) {
                if ($scope.AssetItemDepriciationsAll) {
                    $scope.AssetItemDepriciations = $scope.AssetItemDepriciationsAll.filter(i => i.CategoryId === $scope.itemType.CategoryId);
                }
            }
        }
        $scope.filterItemDepriciation = function () {
            $scope.PermittedOfficeLevelListByCategory = [];
            if ($scope.AssetItemDepriciationsAll) {
                if ($scope.itemType.ItemDepriciations && $scope.savedItemType.CategoryId == $scope.itemType.CategoryId) {
                    $scope.AssetItemDepriciations = $scope.itemType.ItemDepriciations.filter(i => i.AssetItemId === $scope.itemType.Id);
                }
                else
                    $scope.AssetItemDepriciations = $scope.AssetItemDepriciationsAll.filter(i => i.CategoryId === $scope.itemType.CategoryId);
            }

            var permittedOfficeListByCategory = $scope.PermittedOfficeLevelList.filter(p => p.categoryId == $scope.itemType.CategoryId);
            permittedOfficeListByCategory.forEach(function (permittedOffice) {
                $scope.PermittedOfficeLevelListByCategory.push({ id: permittedOffice.id, label: permittedOffice.label });
            });
            $scope.itemType.PermittedOfficeLevel = [];
            if ($scope.itemType.CategoryId === $scope.savedItemType.CategoryId) {
                var offileLevel = $scope.savedItemType.PermittedOfficeLevel.split(",");
                offileLevel.forEach(function (ol) {
                    var v = {};
                    v.id = parseInt(ol);
                    $scope.itemType.PermittedOfficeLevel.push(v);
                    $scope.PermittedOfficeName += $scope.PermittedOfficeLevelListByCategory.find(po => po.id == ol).label + ", ";
                });
                //$scope.AssetItemDepriciations = $scope.savedItemType.ItemDepriciations;
                $scope.PermittedOfficeName = $scope.PermittedOfficeName.substring(0, $scope.PermittedOfficeName.length - 2);
                return;
            }
            $scope.itemType.ItemDepriciations = $scope.AssetItemDepriciationsAll.filter(i => i.CategoryId === $scope.itemType.CategoryId);
            
        }
        $scope.itemTypeDepriciationRateChange = function (index) {
            if ($scope.AssetItemDepriciations != null) {
                if ($scope.AssetItemDepriciations[index]) {
                    if ($scope.AssetItemDepriciations[index].DepreciationRate) {
                        if ($scope.AssetItemDepriciations[index].DepreciationRate < $scope.AssetItemDepriciations[index].DepreciationRateMin || $scope.AssetItemDepriciations[index].DepreciationRate > $scope.AssetItemDepriciations[index].DepreciationRateMax)
                            return "Enter between " + $scope.AssetItemDepriciations[index].DepreciationRateMin + " & " + $scope.AssetItemDepriciations[index].DepreciationRateMax;
                    } else {
                        if ($scope.AssetItemDepriciations[index].DepreciationRateMin == 0 && $scope.AssetItemDepriciations[index].DepreciationRate == 0) return true;
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
        $scope.itemTypeNameValidator = function () {
           
            if (!$scope.itemType.Name)
                return "Name is required";
            if ($scope.itemType.Name == $scope.savedItemType.Name)
                return true;
            if ($scope.filters.ItemNameList.find(i => i.Name.toLowerCase() == $scope.itemType.Name.toLowerCase()))
                return "Name already exist";
            return true;
        }
        $scope.itemTypeShortNameValidator = function () {
            if (!$scope.itemType.ShortName)
                return "Short Name is required";
            if ($scope.itemType.ShortName == $scope.savedItemType.ShortName)
                return true;
            if ($scope.filters.ItemShortNameList.find(i => i.Name.toLowerCase() == $scope.itemType.ShortName.toLowerCase()))
                return "Short Name already exist";
            return true;
        }
        $scope.getAssetItem = function() {
            assetTypeService.getAssetItem($scope.editID).then(function (response) {
                $scope.itemType = response.data;
                $scope.savedItemType = angular.copy(response.data);
                $scope.AssetItemDepriciations = response.data.ItemDepriciations;
                $scope.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.split(",");
                $scope.itemType.PermittedOfficeLevel = [];
                $scope.PermittedOfficeLevel.forEach(function(p) {
                    $scope.itemType.PermittedOfficeLevel.push(p);
                });
                $scope.itemType.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.map(function (a) { return { id: Number(a) } });
                $scope.AssetItemDepriciations.forEach(function (e) {

                    if (moment(e.EffectiveDateFrom).year() > 1971)
                        e.EffectiveDateFrom = moment(e.EffectiveDateFrom).format('DD-MM-YYYY');
                    else e.EffectiveDateFrom = null;


                    if (moment(e.EffectiveDateTo).year() > 1971)
                        e.EffectiveDateTo = moment(e.EffectiveDateTo).format('DD-MM-YYYY');
                    else e.EffectiveDateTo = null;
                });
                //$scope.AssetItemDepriciations.forEach(function (e) {
                //    e.EffectiveDateFrom = moment(e.EffectiveDateFrom).format('DD-MM-YYYY');
                //    e.EffectiveDateTo = moment(e.EffectiveDateTo).format('DD-MM-YYYY');
                //});
                console.log($scope.itemType);
                $scope.filterItemDepriciation();
            });
        }

        $scope.getCategorynStatusList = function () {
            assetTypeService.getCategorynStatusList().then(function (response) {
                $scope.filters = response.data;
                $scope.filters.PermittedOfficeLevelList.forEach(function (r) {
                        $scope.PermittedOfficeLevelList.push({ id: r.Value, label: r.Name,categoryId:r.Order });
                });
                
                $scope.getAssetItem($scope.editID);
            });
        }

        $scope.clearAndCloseTab = function () {
            $scope.transfer = {};
            $scope.tab.FormType = 'View';
            $scope.removeTab($scope.tab);
        };


        $scope.editAssetItem = function () {
            $scope.itemType.ItemDepriciations = angular.copy($scope.AssetItemDepriciations);
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
                delete iDep.$id;
                iDep.EffectiveDateFrom = moment(iDep.EffectiveDateFrom, 'DD-MM-YYYY').format();
                iDep.EffectiveDateTo = moment(iDep.EffectiveDateTo, 'DD-MM-YYYY').format();
            });

            var permittedOffceStr = "";
            $scope.itemType.PermittedOfficeLevel.forEach(function (b) {
                permittedOffceStr += b.id.toString() + ",";
            });
            $scope.itemType.PermittedOfficeLevel = permittedOffceStr.slice(0, -1);

            swal({
                title: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.AssetItemType),
                showCancelButton: true,
                confirmButtonText: "Yes, Edit it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function (isConfirmed) {
                    if (isConfirmed) {
                        //$scope.itemType.ItemDepriciations=
                        assetTypeService.editItemType($scope.itemType).then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('itemtype-edit-finished', $scope.itemType);
                                swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.AssetItemType), "Successful!", "success");
                                //$scope.editAssetItemForm.$dirty = true;
                                //$scope.editAssetItemForm.$valid = false;
                                //$scope.resetValues();
                                $scope.clearAndCloseTab();

                            } else {
                                $scope.getAssetCategoryDepriciation();
                                $scope.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.split(",");
                                $scope.itemType.PermittedOfficeLevel = [];
                                $scope.PermittedOfficeLevel.forEach(function (p) {
                                    $scope.itemType.PermittedOfficeLevel.push(p);
                                });
                                $scope.itemType.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.map(function (a) { return { id: Number(a) } });

                                swal($rootScope.showMessage($rootScope.editError, $rootScope.AssetItemType), response.data.Message, "error");
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

        //$scope.$on('tab-switched', function () {
        //    if ($scope.editID !== $rootScope.editItemTypeId) {
        //        this.init();
        //    }
        //});
        $scope.resetValues = function () {
            $scope.itemType = {};
        }
        var init = function () {

            $scope.itemType = {};
            $scope.itemType.PermittedOfficeLevel = [];
            $scope.PermittedOfficeLevelList = [];
            $scope.PermittedOfficeName = "";
            $scope.editID = angular.copy($rootScope.editItemTypeId);
            $scope.getCategorynStatusList();
            $scope.getAssetCategoryDepriciation();
        }

        init();


    }]);