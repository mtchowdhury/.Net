ammsAng.controller('assetCategoryAddController', ['$scope', '$rootScope', 'assetCategoryService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder',
    function ($scope, $rootScope, assetCategoryService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder) {
        $scope.category = {};
        $scope.permittedOfficeLevels = [];
        $scope.category = {};
        $scope.CategoryDepreciations = [];
        $scope.category.PermittedOfficeLevelsId = [];
        $scope.popupEffectiveDateFrom = [];

        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value',
            buttonClasses: 'custom-multi-select'
        }
        $scope.setDefaults = function () {
            $scope.category.AssetType = 0;

            var branchIndex = $scope.permittedOfficeLevels.find(p => p.Order == 40);//40 for Branch
            if (branchIndex) {
                branchIndex.id = branchIndex.Value;
                $scope.category.PermittedOfficeLevelsId.push(branchIndex);
            }
            var centralIndex = $scope.permittedOfficeLevels.find(p => p.Order == 0);//0 for Central Office
            if (centralIndex) {
                centralIndex.id = centralIndex.Value;
                $scope.category.PermittedOfficeLevelsId.push(centralIndex);
            }

            //$scope.CategoryDepreciations.forEach(function (dep) {
            //    dep.disabler = false;
            //});
            $scope.category.Status = $rootScope.AssetConfig.CategoryStatus.Active;
            $scope.addDepriciationRow();
        }

        $scope.addDepriciationRow = function () {
            var index = {};
            index.DepreciationMethod = 1;

            if ($scope.CategoryDepreciations.length < 1) {
                index.EffectiveDateFrom = moment().format();
            }
            if ($scope.CategoryDepreciations.length >= 1) {
                index.EffectiveDateFrom = moment($scope.CategoryDepreciations[$scope.CategoryDepreciations.length - 1].EffectiveDateFrom).add('days', 1);
            }
            $scope.CategoryDepreciations.push(index);
            $scope.setEffectiveDateFromDatePickerOptions();
        }
        $scope.setEffectiveDateFromDatePickerOptions = function () {
            //$scope.dateOptionsEffectiveDateFrom = [];
            //$scope.popupEffectiveDateFrom = [];
            //$scope.CategoryDepreciations.forEach(function(item,index) {
            //    $scope.dateOptionsEffectiveDateFrom.push({
            //        formatYear: 'yyyy',
            //        minDate: new Date(1, 1, 1991),
            //        maxDate: new Date(31,12,2030),
            //        startingDay: 1,
            //        showWeeks: false
            //    });
            //});
            $scope.popupEffectiveDateFrom.push({ opened: false });
        }
        $scope.dateOptionsEffectiveDateFrom={
            formatYear: 'yyyy',
            minDate: new Date(1, 1, 1991),
            //maxDate: new Date(12, 12, 2099),
            startingDay: 1,
            showWeeks: false
        };
        $scope.openEffectiveDateFrom=function(index) {
            $scope.popupEffectiveDateFrom[index].opened = true;
        }
        $scope.effectiveDateFromChanged = function (index) {
            if (index === 0) return;
            var depriciationCurrentRow = $scope.CategoryDepreciations[index];
            if (!depriciationCurrentRow) return;
            var lastDepriciationOfThisRow = $scope.CategoryDepreciations[index - 1];
            if (!lastDepriciationOfThisRow) return;
            if (depriciationCurrentRow.EffectiveDateFrom && lastDepriciationOfThisRow.EffectiveDateFrom) {
                if (moment(depriciationCurrentRow.EffectiveDateFrom).format("YYYY-MM-DD") == moment(lastDepriciationOfThisRow.EffectiveDateFrom).format("YYYY-MM-DD"))
                    lastDepriciationOfThisRow.EffectiveDateTo = moment(depriciationCurrentRow.EffectiveDateFrom).format("YYYY-MM-DD");
                else if (moment(depriciationCurrentRow.EffectiveDateFrom).format("YYYY-MM-DD") < moment(lastDepriciationOfThisRow.EffectiveDateFrom).format("YYYY-MM-DD")) {
                    depriciationCurrentRow.EffectiveDateFrom = new Date(moment(lastDepriciationOfThisRow.EffectiveDateFrom).format("YYYY-MM-DD"));
                    lastDepriciationOfThisRow.EffectiveDateTo = new Date(moment(lastDepriciationOfThisRow.EffectiveDateFrom).format("YYYY-MM-DD"));
                    swal("Effective date from can't be less than previous row effective date");
                    return;
                } else {
                    lastDepriciationOfThisRow.EffectiveDateTo = moment(depriciationCurrentRow.EffectiveDateFrom).add(-1,"days").format("YYYY-MM-DD");
                }
            }
        }


        $scope.removeDepriciationRow = function (index) {
            if (index === 0) {
                swal('sorry!the first row can not be removed!');
                return;
            }
            $scope.CategoryDepreciations.splice(index, 1);
            $scope.EffectiveDateToSetter();
        }

        $scope.getFilterData = function () {
            assetCategoryService.getAssetCategoryFilterData().then(function (response) {
                $scope.filterData = response.data;
                $scope.statusList = response.data.Statuses.filter(s=>s.Value==$rootScope.AssetConfig.CategoryStatus.Active);
                $scope.permittedOfficeLevels = response.data.PermittedOfficeLevel;
                $scope.assetTypes = response.data.AssetTypes;
                $scope.depriciationMethods = response.data.DepriciationMethods;
                $scope.existingNames = response.data.CategoryName;
                $scope.existingShortNames = response.data.CategoryShortName;
                console.log($scope.filterData);
                $scope.setDefaults();
               
            });
        }


        

        $scope.beforeDateRender = function ($dates) {
            var maxDay = null;
            if ($scope.CategoryDepreciations.length > 1)
                maxDay = new Date($scope.CategoryDepreciations[$scope.CategoryDepreciations.length - 1].EffectiveDateFrom).setUTCHours(0, 0, 0, 0);
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        if ($dates[d].utcDateValue <= maxDay) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }
            if ($scope.CategoryDepreciations.length > 0) {


                //$scope.EffectiveDateToSetter();
            }

        }
        $scope.EffectiveDateToSetter = function () {
            if ($scope.CategoryDepreciations.length > 1) {
                for (var i = $scope.CategoryDepreciations.length - 1; i >= 0; i--) {
                    if (i > 0)
                        $scope.CategoryDepreciations[i - 1].EffectiveDateTo = moment($scope.CategoryDepreciations[i].EffectiveDateFrom).add('days', -1);
                }
            }

            $scope.CategoryDepreciations[$scope.CategoryDepreciations.length - 1].EffectiveDateTo = null;

        }
        $scope.getPermittedOfficeLevels = function () {
            $scope.category.PermittedOfficeLevel = '';
            $scope.category.PermittedOfficeLevelsId.forEach(function (obj) {
                $scope.category.PermittedOfficeLevel += obj.id + ',';
            });
            $scope.category.PermittedOfficeLevel = $scope.category.PermittedOfficeLevel.substring(0, $scope.category.PermittedOfficeLevel.length - 1);

        }
        $scope.clearAndCloseTab = function () {
            $scope.product = {};
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

        $scope.checkNameNshortName = function () {
            $scope.validationbool = false;
            $scope.existingNames.forEach(function (name) {
                if ($scope.category.Name === name.Name) {
                    swal('Category Name already exists! please choose a different name.');
                    $scope.validationbool = true;
                    return;
                }
            });
            if ($scope.validationbool) return $scope.validationbool;
            $scope.existingShortNames.forEach(function (name) {
                if ($scope.category.ShortName === name.Name) {
                    swal('Category Short Name already exists! please choose a different name.');
                    $scope.validationbool = true;
                    return;
                }
            });

            return $scope.validationbool;
        }
        $scope.disabler = function (index) {

            $scope.CategoryDepreciations[index].disabler
                = $scope.CategoryDepreciations[index].DepreciationMethod === $rootScope.DepreciationMethods.None ? true : false;

            if ($scope.CategoryDepreciations[index].disabler === true) {
                $scope.CategoryDepreciations[index].DefaultDepreciationRate = 0;
                $scope.CategoryDepreciations[index].MaxDepreciationRate = 0;
                $scope.CategoryDepreciations[index].MinDepreciationRate = 0;
            }
        }
        $scope.minimumUsefulLifeValidatorAdd = function () {
            if ($scope.category.MaximumUsefulLife) {
                if ($scope.category.MaximumUsefulLife < $scope.category.MinimumUsefulLife) {
                    return 'Min useful life should be less than or equal to ' + $scope.category.MaximumUsefulLife;
                }
            }
            return true;
        }
        $scope.maximumUsefulLifeValidatorAdd = function () {
            if ($scope.category.MinimumUsefulLife) {
                if ($scope.category.MaximumUsefulLife < $scope.category.MinimumUsefulLife) {
                    return 'Max useful life should be greater than or equal to ' + $scope.category.MinimumUsefulLife;
                }
            }
            return true;
        }
        $scope.defaultUsefulLifeValidatorAdd = function () {
            if ($scope.category.MinimumUsefulLife) {
                if ($scope.category.DefaultUsefulLife < $scope.category.MinimumUsefulLife) {
                    return 'Default useful life should be greater than or equal to ' + $scope.category.MinimumUsefulLife;
                }
            }
            if ($scope.category.MaximumUsefulLife) {
                if ($scope.category.DefaultUsefulLife > $scope.category.MaximumUsefulLife) {
                    return 'Default useful life should be less than or equal to ' + $scope.category.MaximumUsefulLife;
                }
            }
            return true;
        }
        $scope.addAssetCategory = function () {
            console.log($scope.category);

            $scope.getPermittedOfficeLevels();
            if ($scope.checkNameNshortName()) return;
            $scope.invalid = false;
            $scope.CategoryDepreciations.forEach(function (dep) {
                if (dep.MinDepreciationRate > dep.MaxDepreciationRate || dep.MinDepreciationRate > dep.DefaultDepreciationRate || dep.MaxDepreciationRate < dep.DefaultDepreciationRate) {
                    $scope.invalid = true;
                    return;
                }
            }); if ($scope.invalid) {
                swal('One or more invalid depreciation rate range detected!please make correction before submitting!');
                return;
            }
            if ($scope.category.PermittedOfficeLevelsId.length==0) {
                swal("Please select at least one permitted office level");
                return;
            }

            swal({
                title: $rootScope.showMessage($rootScope.addConfirmation, 'Asset Category'),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true

            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.category.CategoryDepreciations = angular.copy($scope.CategoryDepreciations);
                    $scope.category.CategoryDepreciations.forEach(function (depriciation) {
                        depriciation.EffectiveDateFrom = depriciation.EffectiveDateFrom ? new Date(moment(depriciation.EffectiveDateFrom).format("YYYY-MM-DD")) : null;
                        depriciation.EffectiveDateTo = depriciation.EffectiveDateTo ? new Date(moment(depriciation.EffectiveDateTo).format("YYYY-MM-DD")) : null;
                    });

                    assetCategoryService.addCategory($scope.category).then(function (response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('assetCategory-add-finished', $scope.category);
                            swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.AssetCategory), "Successful!", "success");
                            $scope.clearAndCloseTab();

                        } else {
                            swal($rootScope.showMessage($rootScope.addError, $rootScope.AssetCategory), response.data.Message, "error");
                        }
                    }, AMMS.handleServiceError);
                }
            });
        }


        $scope.init = function () {
            $scope.getFilterData();
        }
         $scope.init();
    }]);