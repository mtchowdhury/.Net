ammsAng.controller('inventoryItemTypeEditController', ['$scope', '$rootScope', 'inventoryTypeService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder',
    function ($scope, $rootScope, inventoryTypeService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder) {

        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value',
            buttonClasses: 'custom-multi-select'
        }
        $scope.getFilterData = function () {
            inventoryTypeService.getFiltersData().then(function (response) {
                console.log(response.data);
                $scope.itemTypeStatusList = response.data.StatusList;
                $scope.categoryListWithPermittedValues = response.data.CategoryListWithPerimittedOffice;
                $scope.categoryList = response.data.CategoryList;
                $scope.existingItemTypeNameList = response.data.NameList;
                $scope.existingItemTypeShortNameList = response.data.ShortNameList;
                $scope.officeTypeList = response.data.OfficeTypeList;
                $scope.getInventoryItem($scope.editID);
            });
        }
        $scope.getInventoryItem = function () {
            inventoryTypeService.getInventoryItem($scope.editID).then(function (response) {
                $scope.itemType = response.data;
                if ($scope.itemType.CategoryId != $rootScope.InventoryConfig.CategoryStatus.Active) {
                    $scope.itemTypeCategoryFromCategoryList = $scope.categoryList.filter(c => c.Value == $scope.itemType.CategoryId);
                    $scope.categoryList = $scope.categoryList.filter(c => c.RelationalValue == $rootScope.InventoryConfig.CategoryStatus.Active);
                    $scope.categoryList.push($scope.itemTypeCategoryFromCategoryList[0]);
                    console.log($scope.categoryList);
                }
                
                $scope.itemType.UpdatedBy = $rootScope.user.EmployeeId;
                $scope.savedItemType = angular.copy(response.data);
                $scope.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.split(",");
                $scope.itemType.PermittedOfficeLevel = [];
                $scope.PermittedOfficeLevel.forEach(function (p) {
                    $scope.itemType.PermittedOfficeLevel.push(p);
                });
                $scope.itemType.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.map(function (a) { return { id: Number(a) } });
                $scope.PermittedOfficeLevelListByCategory = [];
                var category = $scope.categoryListWithPermittedValues.find(c => c.Value == $scope.itemType.CategoryId);
                if (category) {
                    var permittedOfficeLevels = category.Name.split(',');
                    permittedOfficeLevels.forEach(function (p) {
                        var officeType = $scope.officeTypeList.find(ot => ot.Value == p);
                        if (officeType) {
                            $scope.PermittedOfficeLevelListByCategory.push({ Name: officeType.Name, Value: officeType.Value });
                            // $scope.itemType.PermittedOfficeLevel.push({ id: officeType.Value });
                        }
                    });
                }
                console.log($scope.itemType);
            });
        }
        $scope.categoryChanged = function () {
            $scope.PermittedOfficeLevelListByCategory = [];
            $scope.itemType.PermittedOfficeLevel = [];
            var category = $scope.categoryListWithPermittedValues.find(c => c.Value == $scope.itemType.CategoryId);
            if (category) {
                var permittedOfficeLevels = category.Name.split(',');
                permittedOfficeLevels.forEach(function (p) {
                    var officeType = $scope.officeTypeList.find(ot => ot.Value == p);
                    if (officeType) {
                        $scope.PermittedOfficeLevelListByCategory.push({ Name: officeType.Name, Value: officeType.Value });
                        $scope.itemType.PermittedOfficeLevel.push({ id: officeType.Value });
                    }
                });
            }
        }

        $scope.clearAndCloseTab = function () {
            $scope.transfer = {};
            $scope.tab.FormType = 'View';
            $scope.removeTab($scope.tab);
        };
        $scope.itemTypeNameValidator = function () {
            if (!$scope.itemType.Name)
                return "Name is required";
            if ($scope.itemType.Name.toLowerCase() != $scope.savedItemType.Name.toLowerCase() && $scope.existingItemTypeNameList.find(i => i.Name.toLowerCase() == $scope.itemType.Name.toLowerCase()))
                return "Name already exist";
            return true;
        }
        $scope.itemTypeShortNameValidator = function () {
            if (!$scope.itemType.ShortName)
                return "Short Name is required";
            if ($scope.itemType.ShortName.toLowerCase() != $scope.savedItemType.ShortName.toLowerCase() && $scope.existingItemTypeShortNameList.find(i => i.Name.toLowerCase() == $scope.itemType.ShortName.toLowerCase()))
                return "Short Name already exist";
            return true;
        }

        $scope.editInventoryItem = function () {
            if ($scope.itemType.PermittedOfficeLevel.length < 1) {
                swal("Please select permitted office level");
                return;
            }
            var permittedOffceStr = "";
            $scope.itemType.PermittedOfficeLevel.forEach(function (b) {
                permittedOffceStr += b.id.toString() + ",";
            });
            $scope.itemType.PermittedOfficeLevel = permittedOffceStr.slice(0, -1);

            swal({
                title: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.InventoryItemType),
                showCancelButton: true,
                confirmButtonText: "Yes, Edit it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function (isConfirmed) {
                    if (isConfirmed) {
                        inventoryTypeService.editInventoryType($scope.itemType).then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('inventory-item-type-edit-finished', $scope.itemType);
                                swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.InventoryItemType), "Successful!", "success");
                                $scope.clearAndCloseTab();

                            } else {
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
            $scope.getFilterData();
        }

        init();


    }]);