ammsAng.controller('assetCategoryEditController', ['$scope', '$rootScope', 'assetCategoryService', 'commonService', '$timeout', 'employeeService', 'loanGroupService', 'DTOptionsBuilder',
    function ($scope, $rootScope, assetCategoryService, commonService, $timeout, employeeService, loanGroupService, DTOptionsBuilder) {

        $scope.category = {};
        $scope.permittedOfficeLevels = [];
        $scope.category.CategoryDepreciations = [];
        $scope.popupEffectiveDateFrom = [];

     //   $scope.beforeDateRender = function ($dates) {
     //       var maxDate = null;

     //       if ( $scope.category.CategoryDepreciations.length > 1)
     //           maxDate = new Date($scope.category.CategoryDepreciations[$scope.category.CategoryDepreciations.length - 1].EffectiveDateFrom).setUTCHours(0, 0, 0, 0);
     //       if ($dates.length > 27) {
     //           for (d in $dates) {
     //               if ($dates.hasOwnProperty(d)) {
     //                   if ($dates[d].utcDateValue <= maxDate) {
     //                       $dates[d].selectable = false;
     //                   }
     //               }
     //           }
     //       }
     //      $scope.EffectiveDateToSetter();
     //}
     //   $scope.EffectiveDateToSetter = function () {
     //       if ($scope.category.CategoryDepreciations.length > 1) {
     //           for (var i = $scope.category.CategoryDepreciations.length - 1; i >= 0; i--) {
     //               if (i > 0) {
     //                   $scope.category.CategoryDepreciations[i - 1].EffectiveDateTo = moment($scope.category.CategoryDepreciations[i].EffectiveDateFrom).add('days', -1).format();

     //               }
     //           }
     //       }

     //      $scope.category.CategoryDepreciations[$scope.category.CategoryDepreciations.length - 1].EffectiveDateTo = null;

     //   }

        $scope.dateOptionsEffectiveDateFrom = {
            formatYear: 'yyyy',
            minDate: new Date(1, 1, 1991),
            //maxDate: new Date(12, 12, 2099),
            startingDay: 1,
            showWeeks: false
        };
        $scope.openEffectiveDateFrom = function (index) {
            $scope.popupEffectiveDateFrom[index].opened = true;
        }
        $scope.effectiveDateFromChanged = function (index) {
            if (index === 0) return;
            var depriciationCurrentRow = $scope.category.CategoryDepreciations[index];
            if (!depriciationCurrentRow) return;
            var lastDepriciationOfThisRow = $scope.category.CategoryDepreciations[index - 1];
            if (!lastDepriciationOfThisRow) return;
            if (depriciationCurrentRow.EffectiveDateFrom && lastDepriciationOfThisRow.EffectiveDateFrom) {
                if (moment(depriciationCurrentRow.EffectiveDateFrom).format("YYYY-MM-DD") == moment(lastDepriciationOfThisRow.EffectiveDateFrom).format("YYYY-MM-DD"))
                    lastDepriciationOfThisRow.EffectiveDateTo = moment(depriciationCurrentRow.EffectiveDateFrom).format("YYYY-MM-DD");
                else if (moment(depriciationCurrentRow.EffectiveDateFrom).format("YYYY-MM-DD") < moment(lastDepriciationOfThisRow.EffectiveDateFrom).format("YYYY-MM-DD")) {
                    depriciationCurrentRow.EffectiveDateFrom = new Date(moment(lastDepriciationOfThisRow.EffectiveDateFrom).format("YYYY-MM-DD"));
                    lastDepriciationOfThisRow.EffectiveDateTo = new Date(moment(lastDepriciationOfThisRow.EffectiveDateFrom).format("YYYY-MM-DD"));
                    if (depriciationCurrentRow.EffectiveDateTo) depriciationCurrentRow.EffectiveDateTo = new Date(moment(lastDepriciationOfThisRow.EffectiveDateFrom).format("YYYY-MM-DD"));
                    swal("Effective date from can't be less than previous row effective date");
                    return;
                } else {
                    lastDepriciationOfThisRow.EffectiveDateTo = moment(depriciationCurrentRow.EffectiveDateFrom).add(-1, "days").format("YYYY-MM-DD");
                }
            }
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
        

        $scope.getFilterData = function () {
            assetCategoryService.getAssetCategoryFilterData().then(function (response) {
                $scope.filterData = response.data;
                $scope.statusList = response.data.Statuses;
                $scope.permittedOfficeLevels = response.data.PermittedOfficeLevel;
                $scope.assetTypes = response.data.AssetTypes;
                $scope.depriciationMethods = response.data.DepriciationMethods;
                $scope.getCategoryInfo();
                console.log($scope.filterData);
            });
        }

        $scope.getCategoryInfo=function() {
            assetCategoryService.getCategoryInfo($rootScope.editcategoryId).then(function(response) {
                $scope.category = response.data;
                if (response.data) {
                    if ($scope.category.CategoryDepreciations.length > 0) {
                        $scope.category.CategoryDepreciations.forEach(function (item) {
                            item.EffectiveDateFrom = new Date(moment(item.EffectiveDateFrom).format("YYYY-MM-DD"));
                            if (item.EffectiveDateTo) item.EffectiveDateTo = new Date(moment(item.EffectiveDateTo).format("YYYY-MM-DD"));
                            $scope.popupEffectiveDateFrom.push({ opened: false });
                        });
                    }
                    $scope.category.PermittedOfficeLevelsId = [];
                    response.data.PermittedOfficeLevel.split(',').forEach(function(po) {
                        $scope.PermittedOfficeName += $scope.permittedOfficeLevels.find(p => p.Value == po).Name+", ";
                    });
                    $scope.PermittedOfficeName = $scope.PermittedOfficeName.substring(0, $scope.PermittedOfficeName.length - 2);
                    $scope.getpermittedlevelobjectlistfromstring();
                    $scope.disableOnFetch();
                    if ($scope.category.HasChildItem) $scope.disarmer();
                }
            });
        }

        $scope.disarmer=function() {
            $scope.category.CategoryDepreciations.forEach(function(dep) {
                dep.disarmed = true;
            });
        }
        $scope.init = function () {
            $scope.PermittedOfficeName = "";
            $scope.getFilterData();
        }
        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value',
            buttonClasses: 'custom-multi-select '
        }
        $scope.getpermittedlevelobjectlistfromstring = function () {
            var permittedOfficeLevel = $scope.category.PermittedOfficeLevel.split(",");
            permittedOfficeLevel.forEach(function (pl) {
                var v = {};
                v.id = parseInt(pl);
                $scope.category.PermittedOfficeLevelsId.push(v);
            });
        }
      $scope.addDepriciationRow = function () {
            var index = {};
            index.DepreciationMethod = 1;
            if ($scope.category.CategoryDepreciations.length < 1) {
                index.EffectiveDateFrom = moment().format();
            }
            if ($scope.category.CategoryDepreciations.length >= 1) {
                index.EffectiveDateFrom = moment($scope.category.CategoryDepreciations[$scope.category.CategoryDepreciations.length - 1].EffectiveDateFrom).add('days', 1);
            }
            $scope.category.CategoryDepreciations.push(index);
            $scope.popupEffectiveDateFrom.push({ opened: false });
        }
       
        $scope.removeDepriciationRow = function (index) {
            if (index===0) {
                swal('sorry!the first row can not be removed!');
                return;
            }
            $scope.category.CategoryDepreciations.splice(index, 1);
            $scope.popupEffectiveDateFrom.splice(index, 1);
            $scope.EffectiveDateToSetter();
        }

        $scope.disabler = function (index) {

            $scope.category.CategoryDepreciations[index].disabler
                = $scope.category.CategoryDepreciations[index].DepreciationMethod === $rootScope.DepreciationMethods.None ? true : false;
            if ($scope.category.CategoryDepreciations[index].disabler === true)
            {
                $scope.category.CategoryDepreciations[index].MinDepreciationRate = 0;
                $scope.category.CategoryDepreciations[index].DefaultDepreciationRate = 0;
                $scope.category.CategoryDepreciations[index].MaxDepreciationRate = 0;
            }
        }
        $scope.disableOnFetch=function() {
            $scope.category.CategoryDepreciations.forEach(function(dep) {
                dep.disabler = dep.DepreciationMethod === $rootScope.DepreciationMethods.None ? true :
                false;
            });
        }

        //$scope.minimumDepreciationRateValidator = function (index) {
        //    if ($scope.category.CategoryDepreciations[index].MinDepreciationRate) {
        //        if ($scope.category.CategoryDepreciations[index].MinDepreciationRate > 100 || $scope.category.CategoryDepreciations[index].MinDepreciationRate < 0) $scope.category.CategoryDepreciations[index].MinDepreciationRate = 0;
        //        if ($scope.category.CategoryDepreciations[index].MaxDepreciationRate) {
        //            if ($scope.category.CategoryDepreciations[index].MaxDepreciationRate == 0 || $scope.category.CategoryDepreciations[index].MaxDepreciationRate) {
        //                if ($scope.category.CategoryDepreciations[index].MinDepreciationRate > $scope.category.CategoryDepreciations[index].MaxDepreciationRate) {
        //                    return 'Value should be less than or equal to ' + $scope.category.CategoryDepreciations[index].MaxDepreciationRate;
        //                }
        //            }
        //        }
        //    }
        //    return true;
        //}
        //$scope.maximumDepreciationRateValidator = function (index) {
        //    if ($scope.category.CategoryDepreciations[index].MaxDepreciationRate) {
        //        if ($scope.category.CategoryDepreciations[index].MaxDepreciationRate > 100 || $scope.category.CategoryDepreciations[index].MaxDepreciationRate < 0) $scope.category.CategoryDepreciations[index].MaxDepreciationRate = 0;
        //        if ($scope.category.CategoryDepreciations[index].MinDepreciationRate) {
        //            if ($scope.category.CategoryDepreciations[index].MinDepreciationRate == 0 || $scope.category.CategoryDepreciations[index].MinDepreciationRate) {
        //                if ($scope.category.CategoryDepreciations[index].MaxDepreciationRate < $scope.category.CategoryDepreciations[index].MinDepreciationRate) {
        //                    return 'Value should be greater than or equal to ' + $scope.category.CategoryDepreciations[index].MinDepreciationRate;
        //                }
        //            }
        //        }
        //    }
        //    return true;
        //}
        //$scope.defaultDepreciationRateValidator = function (index) {
        //    if ($scope.category.CategoryDepreciations[index].DefaultDepreciationRate) {
        //        if ($scope.category.CategoryDepreciations[index].MinDepreciationRate) {
        //            if ($scope.category.CategoryDepreciations[index].DefaultDepreciationRate > 100 || $scope.category.CategoryDepreciations[index].DefaultDepreciationRate < 0) $scope.category.CategoryDepreciations[index].DefaultDepreciationRate = 0;
        //            if ($scope.category.CategoryDepreciations[index].MinDepreciationRate == 0 || $scope.category.CategoryDepreciations[index].MinDepreciationRate) {
        //                if ($scope.category.CategoryDepreciations[index].DefaultDepreciationRate < $scope.category.CategoryDepreciations[index].MinDepreciationRate) {
        //                    return 'Value should be greater than or equal to ' + $scope.category.CategoryDepreciations[index].MinDepreciationRate;
        //                }
        //            }
        //        }
        //        if ($scope.category.CategoryDepreciations[index].MaxDepreciationRate) {
        //            if ($scope.category.CategoryDepreciations[index].MaxDepreciationRate == 0 || $scope.category.CategoryDepreciations[index].MaxDepreciationRate) {
        //                if ($scope.category.CategoryDepreciations[index].DefaultDepreciationRate > $scope.category.CategoryDepreciations[index].MaxDepreciationRate) {
        //                    return 'Value should be less than or equal to ' + $scope.category.CategoryDepreciations[index].MaxDepreciationRate;
        //                }
        //            }
        //        }
        //    }

        //    return true;
        //}
        $scope.minimumUsefulLifeValidator = function () {
            if ($scope.category.MaximumUsefulLife) {
                if ($scope.category.MaximumUsefulLife < $scope.category.MinimumUsefulLife) {
                    return 'Min useful life should be less than or equal to ' + $scope.category.MaximumUsefulLife;
                }
            }
            return true;
        }
        $scope.maximumUsefulLifeValidator = function () {
            if ($scope.category.MinimumUsefulLife) {
                if ($scope.category.MaximumUsefulLife < $scope.category.MinimumUsefulLife) {
                    return 'Max useful life should be greater than or equal to ' + $scope.category.MinimumUsefulLife;
                }
            }
            return true;
        }
        $scope.defaultUsefulLifeValidator = function () {
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

        $scope.editAssetCategory = function () {
            console.log($scope.category);
            $scope.getPermittedOfficeLevels();
            $scope.invalid = false;
            $scope.category.CategoryDepreciations.forEach(function (dep) {
                if (dep.MinDepreciationRate > dep.MaxDepreciationRate || dep.MinDepreciationRate > dep.DefaultDepreciationRate || dep.MaxDepreciationRate < dep.DefaultDepreciationRate) {
                    $scope.invalid = true;
                    return;
                }
            }); if ($scope.invalid) {
                swal('One or more invalid depreciation rate range detected!please make correction before submitting!');
                return;
            }
            if ($scope.category.PermittedOfficeLevelsId.length == 0) {
                swal("Please select at least one permitted office level");
                return;
            }
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.editConfirmation, 'Asset Category'),
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                cancelButtonText: 'Cancel'
            },
           function (isConfirm) {
               if (isConfirm) {
                   $scope.category.CategoryDepreciations.forEach(function (depriciation) {
                       depriciation.EffectiveDateFrom = depriciation.EffectiveDateFrom ? new Date(moment(depriciation.EffectiveDateFrom).format("YYYY-MM-DD")) : null;
                       depriciation.EffectiveDateTo = depriciation.EffectiveDateTo ? new Date(moment(depriciation.EffectiveDateTo).format("YYYY-MM-DD")) : null;
                   });

                   assetCategoryService.edit($scope.category).then(function(response) {
                       if (response.data.Success) {
                           $rootScope.$broadcast('assetCategory-edit-finished', $scope.category);
                           swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.AssetCategory), "Successful!", "success");
                           $scope.clearAndCloseTab();
                       }
                       else {
                           swal($rootScope.showMessage($rootScope.editError, $rootScope.AssetCategory), response.data.Message, "error");
                       }
                   }, AMMS.handleServiceError);
               } 
               
           });
        }


        $scope.init();


    }]);