ammsAng.controller('inventoryItemTypeAddController', ['$scope', '$rootScope', 'inventoryTypeService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder',
    function ($scope, $rootScope, inventoryTypeService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder) {



        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value',
            buttonClasses: 'custom-multi-select'
        }

        
        $scope.getFiltersData = function () {
            inventoryTypeService.getFiltersData().then(function (response) {
                console.log(response.data);
                $scope.itemTypeStatusList = response.data.StatusList.filter(s=>s.Value == $rootScope.InventoryConfig.ItemTypeStatus.Active);
                $scope.itemType.Status = $rootScope.InventoryConfig.ItemTypeStatus.Active;
                $scope.categoryListWithPermittedValues = response.data.CategoryListWithPerimittedOffice;
                $scope.categoryList = response.data.CategoryList.filter(c=>c.RelationalValue==$rootScope.InventoryConfig.CategoryStatus.Active);
                $scope.existingItemTypeNameList = response.data.NameList;
                $scope.existingItemTypeShortNameList = response.data.ShortNameList;
                $scope.officeTypeList = response.data.OfficeTypeList;
                $scope.itemType.CreatedBy = $rootScope.user.EmployeeId;
            });
        }
       
        $scope.clearAndCloseTab = function () {
            $scope.tab.FormType = 'View';
            $scope.removeTab($scope.tab);
        };
        $scope.itemTypeNameValidator=function() {
            if (!$scope.itemType.Name)
                return "Name is required";
            if ($scope.existingItemTypeNameList.find(i => i.Name.toLowerCase() == $scope.itemType.Name.toLowerCase()))
                return "Name already exist";
            return true;
        }
        $scope.itemTypeShortNameValidator = function () {
            if (!$scope.itemType.ShortName)
                return "Short Name is required";
            if ($scope.existingItemTypeShortNameList.find(i => i.Name.toLowerCase() == $scope.itemType.ShortName.toLowerCase()))
                return "Short Name already exist";
            return true;
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
        $scope.addAssetItem = function () {
            if ($scope.itemType.PermittedOfficeLevel.length < 1) {
                swal("Please select permitted office level");
                return;
            }
            var permittedOffceStr = "";
            $scope.itemType.PermittedOfficeLevel.forEach(function (b) {
                permittedOffceStr += b.id.toString() + ",";
            });
            $scope.itemType.PermittedOfficeLevel = permittedOffceStr.slice(0, -1);
            console.log($scope.itemType);
            swal({
                title: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.InventoryItemType),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function (isConfirmed) {
                    if (isConfirmed) {
                        inventoryTypeService.addInventoryType($scope.itemType).then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('inventory-item-type-add-finished', $scope.itemType);
                                swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.InventoryItemType), "Successful!", "success");
                                $scope.addAssetItemForm.$dirty = true;
                                $scope.addAssetItemForm.$valid = false;
                                $scope.resetValues();
                                $scope.clearAndCloseTab();
                            } else {
                                $scope.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.split(",");
                                $scope.itemType.PermittedOfficeLevel = [];
                                $scope.PermittedOfficeLevel.forEach(function (p) {
                                    $scope.itemType.PermittedOfficeLevel.push(p);
                                });
                                $scope.itemType.PermittedOfficeLevel = $scope.itemType.PermittedOfficeLevel.map(function (a) { return { id: Number(a) } });
                                swal($rootScope.showMessage($rootScope.addError, $rootScope.InventoryItemType), response.data.Message, "error");
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
        $scope.resetValues=function() {
            $scope.itemType = {};
        }

        var init = function () {

            $scope.itemType = {};
            $scope.itemType.PermittedOfficeLevel = [];
            $scope.getFiltersData();
        }

        init();

    }]);