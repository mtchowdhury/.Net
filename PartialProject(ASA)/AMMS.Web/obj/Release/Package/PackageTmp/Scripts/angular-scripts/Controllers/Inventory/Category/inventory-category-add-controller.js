ammsAng.controller('inventoryCategoryAddController', ['$scope', '$rootScope', 'inventoryCategoryService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder',
    function ($scope, $rootScope, inventoryCategoryService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder) {
        $scope.category = {};
        $scope.permittedOfficeLevels = [];
        $scope.category = {};
        $scope.category.PermittedOfficeLevelsId = [];

        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value',
            buttonClasses: 'custom-multi-select'
        }
        $scope.getFilterData = function () {
            inventoryCategoryService.getInventoryCategoryFilterData().then(function (response) {
                $scope.filterData = response.data;
                $scope.statusList = response.data.Statuses.filter(s=>s.Value == $rootScope.InventoryConfig.CategoryStatus.Active);
                $scope.permittedOfficeLevels = response.data.PermittedOfficeLevel;
                $scope.inventoryTypes = response.data.InventoryTypes;
                $scope.existingNames = response.data.CategoryName;
                $scope.existingShortNames = response.data.CategoryShortName;
                $scope.setDefaultValues();
            });
        }
        $scope.setDefaultValues=function() {
            $scope.category.Status = $rootScope.InventoryConfig.CategoryStatus.Active;
            $scope.category.CreatedBy = $rootScope.user.EmployeeId;
        }
        $scope.categoryNameValidator=function() {
            if (!$scope.category.Name)
                return 'Name is required';
            if ($scope.existingNames.find(n=>n.Name.toLowerCase() == $scope.category.Name.toLowerCase()) != undefined)
                return 'Name already existed';
            return true;
        }
        $scope.categoryShortNameValidator=function() {
            if (!$scope.category.ShortName)
                return 'Short name is required';
            if ($scope.existingShortNames.find(sn=>sn.Name.toLowerCase() == $scope.category.ShortName.toLowerCase()) != undefined)
                return 'Short name already existed';
            return true;
        }

        var init = function () {
            $scope.getFilterData();
        }
       
        $scope.getPermittedOfficeLevels = function () {
            $scope.category.PermittedOfficeLevel = '';
            $scope.category.PermittedOfficeLevelsId.forEach(function (obj) {
                $scope.category.PermittedOfficeLevel += obj.id + ',';
            });
            $scope.category.PermittedOfficeLevel = $scope.category.PermittedOfficeLevel.substring(0, $scope.category.PermittedOfficeLevel.length - 1);

        }
        $scope.clearAndCloseTab = function () {
            $scope.category = {};
            $scope.execRemoveTab($scope.tab);
        };
        $scope.addAssetCategory = function () {
            console.log($scope.category);

            $scope.getPermittedOfficeLevels();
           
            if ($scope.category.PermittedOfficeLevelsId.length<1) {
                swal("Please select at least one permitted office level");
                return;
            }

            swal({
                title: $rootScope.showMessage($rootScope.addConfirmation, 'Inventory Category'),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true

            }, function (isConfirmed) {
                if (isConfirmed) {
                    inventoryCategoryService.addCategory($scope.category).then(function (response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('inventoryCategory-add-finished', $scope.category);
                            swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.InventoryCategory), "Successful!", "success");
                            $scope.clearAndCloseTab();
                        } else {
                            swal($rootScope.showMessage($rootScope.addError, $rootScope.InventoryCategory), response.data.Message, "error");
                        }
                    }, AMMS.handleServiceError);
                }
            });
        }
        init();
    }]);