ammsAng.controller('inventoryCategoryEditController', ['$scope', '$rootScope', 'inventoryCategoryService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder',
    function ($scope, $rootScope, inventoryCategoryService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder) {

        $scope.category = {};
        $scope.permittedOfficeLevels = [];
        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value',
            buttonClasses: 'custom-multi-select '
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
        $scope.categoryNameValidator = function () {
            if (!$scope.category.Name)
                return 'Name is required';
            if ($scope.category.Name == $scope.previousCategory.Name) return true;
            if ($scope.existingNames.find(n=>n.Name == $scope.category.Name) != undefined)
                return 'Name already existed';
            return true;
        }
        $scope.categoryShortNameValidator = function () {
            if (!$scope.category.ShortName)
                return 'Short name is required';
            if ($scope.category.ShortName == $scope.previousCategory.ShortName)return true;
            if ($scope.existingShortNames.find(sn=>sn.Name == $scope.category.ShortName) != undefined)
                return 'Short name already existed';
            return true;
        }

        $scope.getFilterData = function () {
            inventoryCategoryService.getInventoryCategoryFilterData().then(function (response) {
                $scope.filterData = response.data;
                $scope.statusList = response.data.Statuses;
                $scope.permittedOfficeLevels = response.data.PermittedOfficeLevel;
                $scope.inventoryTypes = response.data.InventoryTypes;
                $scope.existingNames = response.data.CategoryName;
                $scope.existingShortNames = response.data.CategoryShortName;
                $scope.getCategoryInfo();
            });
        }

        $scope.getCategoryInfo=function() {
            inventoryCategoryService.getCategoryInfo($rootScope.editcategoryId).then(function (response) {
                $scope.previousCategory = angular.copy(response.data);
                $scope.category = response.data;
                $scope.previousCategory = angular.copy(response.data);
                $scope.category.UpdatedBy = $rootScope.user.EmployeeId;
                if (response.data) {
                    $scope.category.PermittedOfficeLevelsId = [];
                    response.data.PermittedOfficeLevel.split(',').forEach(function(po) {
                        $scope.PermittedOfficeName += $scope.permittedOfficeLevels.find(p => p.Value == po).Name+", ";
                    });
                    $scope.PermittedOfficeName = $scope.PermittedOfficeName.substring(0, $scope.PermittedOfficeName.length - 2);
                    $scope.getpermittedlevelobjectlistfromstring();
                }
            });
        }
        $scope.init = function () {
            $scope.PermittedOfficeName = "";
            $scope.getFilterData();
        }
        
        $scope.getpermittedlevelobjectlistfromstring = function () {
            var permittedOfficeLevel = $scope.category.PermittedOfficeLevel.split(",");
            permittedOfficeLevel.forEach(function (pl) {
                var v = {};
                v.id = parseInt(pl);
                $scope.category.PermittedOfficeLevelsId.push(v);
            });
        }
        $scope.editInventoryCategory = function () {
            $scope.getPermittedOfficeLevels();
            
            if ($scope.category.PermittedOfficeLevelsId.length <1) {
                swal("Please select at least one permitted office level");
                return;
            }
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.editConfirmation, 'Inventory Category'),
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                cancelButtonText: 'Cancel'
            },
           function (isConfirm) {
               if (isConfirm) {
                   inventoryCategoryService.edit($scope.category).then(function (response) {
                       if (response.data.Success) {
                           $rootScope.$broadcast('inventoryCategory-edit-finished', $scope.category);
                           swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.InventoryCategory), "Successful!", "success");
                           $scope.clearAndCloseTab();
                       }
                       else {
                           swal($rootScope.showMessage($rootScope.editError, $rootScope.InventoryCategory), response.data.Message, "error");
                       }
                   }, AMMS.handleServiceError);
               } 
               
           });
        }
        $scope.init();
    }]);