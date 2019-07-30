ammsAng.controller('inventorySupplierListController', [
    '$scope', '$rootScope', 'inventorySupplierService', 'commonService', '$timeout', 'DTOptionsBuilder',
    function ($scope, $rootScope, inventorySupplierService, commonService, $timeout, DTOptionsBuilder) {

        commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
            $scope.commandList = responseCommand.data;
            $scope.customCommandList = [];
            $scope.searchOptions = {};
            $scope.searchFilters = {};
            $scope.customCommandList.push($scope.commandList[1]);
            $scope.searchFilters.SupplierTypes = [
               { Name: "ALL", Value: "0" },
               { Name: "Supplier", Value: "1" },
               { Name: "Manufacturer", Value: "2" },
               { Name: "Both Supplier & Manufacturer", Value: "3" }
            ];
            if ($scope.commandList.find(c => !c.IsGeneral))
                $scope.hasNonGeneralCommands = true;
        }, AMMS.handleServiceError);


        $scope.loadSupplier = function () {
            inventorySupplierService.getSuppliers($rootScope.user.Role, $rootScope.selectedBranchId).then(function (response) {
                $scope.supplierList = response.data;
                var i = 1;
                $scope.supplierList.forEach(function (supplier) {
                    supplier.serial = i++;
                    supplier.EnlistmentDateShow = moment(supplier.EnlistmentDate).format("DD-MM-YYYY");
                    var branch = $scope.BranchList.find(e => e.Value === supplier.BranchId);
                    if (branch)
                        supplier.BranchName = branch.Name;
                    supplier.IsSupplierShow = supplier.IsSupplier ? "Yes" : "No";
                    supplier.IsManufacturerShow = supplier.IsManufacturer ? "Yes" : "No";
                });
                $scope.supplierListMain = angular.copy($scope.supplierList);
                $scope.searchOptionsValuesInitialize();
                
            }, AMMS.handleServiceError);
        }
        $scope.searchOptionsValuesInitialize = function () {
            $scope.searchOptions.Branch = { title: $rootScope.selectedBranchTitle, originalObject: { Name: $rootScope.selectedBranchTitle, Value: $rootScope.selectedBranchId } };
            var branch = $scope.BranchList.find(b=>b.Value == $rootScope.selectedBranchId);
            $scope.searchOptions.officeType = branch ? branch.RelationalValue : null;
            $scope.searchOptions.enlistDayFrom = new Date(moment($rootScope.workingdate).add(-1, "months"));
            $scope.searchOptions.enlistDayTo = new Date(moment($rootScope.workingdate).format("YYYY-MM-DD"));
            $scope.searchOptions.supplierType = "0";
            $scope.searchOptions.Status = "-1";
            $scope.$broadcast('angucomplete-alt:changeInput', 'inventoryoffcename', $scope.searchOptions.Branch.title);
            $scope.searchSupplier();
        }

        $scope.openEnlistDayFromPopup = function () {
            $scope.popupEnlistDayFrom.opened = true;
        }
        $scope.popupEnlistDayFrom = {
            opened: false
        };
        $scope.openEnlistDayToPopup = function () {
            $scope.popupEnlistDayTo.opened = true;
        }
        $scope.popupEnlistDayTo = {
            opened: false
        };
        $scope.dateOptionsEnlistDayFrom = {
           // dateDisabled: false,
            formatYear: 'yyyy',
            maxDate: new Date($rootScope.workingdate),
            minDate: new Date(1,1,1991),
            startingDay: 1
        };
        $scope.dateOptionsEnlistDayTo = {
           //dateDisabled: true,
            formatYear: 'yyyy',
            maxDate: new Date($rootScope.workingdate),
            minDate: new Date(1, 1, 1991),
            startingDay: 1
        };
        $scope.getFilterData = function () {
            inventorySupplierService.getFilters().then(function (response) {
                $scope.officeTypeList = response.data.OfficeTypeList;
                $scope.statusList = response.data.StatusList;
                var temp = {};
                temp.Name = "All";
                temp.Value = "-1";
                $scope.statusList.unshift(temp);
                $scope.loadSupplier();
            });}

        $scope.searchSupplier = function () {
            console.log($scope.searchOptions);
            $scope.supplierList = $scope.supplierListMain;
            //if ($scope.searchOptions.officeType) $scope.supplierList = $scope.supplierListMain.filter(e => e.OfficeType.toString() === $scope.searchOptions.officeType);
            
            if ($scope.searchOptions.Status != "-1" && $scope.searchOptions.Status!=undefined) $scope.supplierList = $scope.supplierListMain.filter(e => e.Status == $scope.searchOptions.Status);
            else $scope.supplierList = $scope.supplierListMain;
           // if ($scope.searchOptions.Status == undefined) $scope.supplierList = $scope.supplierListMain;
            if ($scope.searchOptions.enlistDayFrom) $scope.supplierList = $scope.supplierList.filter(e => moment(e.EnlistmentDate).startOf('date').format() >= moment($scope.searchOptions.enlistDayFrom).format());
            if ($scope.searchOptions.enlistDayTo) $scope.supplierList = $scope.supplierList.filter(e => moment(e.EnlistmentDate).startOf('date').format() <= moment($scope.searchOptions.enlistDayTo).format());
            if ($scope.searchOptions.Branch) $scope.supplierList = $scope.supplierList.filter(e => e.BranchId == $scope.searchOptions.Branch.originalObject.Value);
            //if ($scope.searchOptions.Branch) $scope.supplierList = $scope.supplierList.filter(e => e.BranchId == $scope.searchOptions.Branch.originalObject.Value);
            

            if ($scope.searchOptions.supplierType !== "0") {
                if ($scope.searchOptions.supplierType === "1") $scope.supplierList = $scope.supplierList.filter(e => e.IsSupplier);
                if ($scope.searchOptions.supplierType === "2") $scope.supplierList = $scope.supplierList.filter(e => e.IsManufacturer);
                if ($scope.searchOptions.supplierType === "3") $scope.supplierList = $scope.supplierList.filter(e => e.IsManufacturer && e.IsSupplier);
            }

        }
        $scope.entryDateFromChange=function() {
            if ($scope.searchOptions.enlistDayTo) {
                if ($scope.searchOptions.enlistDayTo < $scope.searchOptions.enlistDayFrom) {
                    swal({ title:"", text:"From date is greater than to date",type:"error" });
                    return;
                }
            }
        }
        $scope.entryDateToChange = function () {
            if ($scope.searchOptions.enlistDayFrom) {
                if ($scope.searchOptions.enlistDayTo < $scope.searchOptions.enlistDayFrom) {
                    swal({title:"", text: "From date is greater than to date", type: "error" });
                    return;
                }
            }
        }
        $scope.deleteSupplier = function (supplier) {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.supplier),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    inventorySupplierService.deleteSupplier(supplier.Id, supplier.IsManufacturer).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.supplier), "Successful!", "success");
                            $rootScope.$broadcast('inventory-supplier-delete-finished');
                        } else {
                            swal($rootScope.showMessage(response.data.Message, $rootScope.supplier), "", "error");
                        }

                    }, AMMS.handleServiceError);
                });
        };

        $scope.getBranchesByRoleAndBranch = function () {
            $("#loadingImage").css("display", "block");
            commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, parseInt($rootScope.user.Role)).then(function (response) {
                $scope.BranchList = response.data;
                $scope.branchListMain = angular.copy(response.data);
                $scope.getFilterData();
                $("#loadingImage").css("display", "none");
            });
            //$scope.BranchList = $rootScope.branchList;
            //$scope.getFilterData();
            
        }
        $scope.officeTypeChange = function () {
            $scope.$broadcast('angucomplete-alt:clearInput', 'inventoryoffcename');
            //if ($scope.searchOptions.officeType == 10000) {
            //    $scope.BranchList = $scope.branchListMain.filter(x=>x.RelationalValue == 3); // 3 is office type for  asa tower,Central office and allow all 
            //    console.log($scope.BranchList);
            //}
            //else
                $scope.BranchList = $scope.branchListMain.filter(b => b.RelationalValue == $scope.searchOptions.officeType);
        }
        $scope.handleNonGeneralActions = function (actionName, supplier) {
            if (actionName === "DELETE") {
                $scope.deleteSupplier(supplier);
            }
        }

        $scope.$on('inventory-supplier-add-finished', function () {
            $scope.loadSupplier();

        });
        $scope.$on('inventory-supplier-edit-finished', function () {
            $scope.loadSupplier();

        });

        $scope.$on('inventory-supplier-delete-finished', function () {
            $scope.loadSupplier();

        });


        var init = function () {
            $scope.commandList = [];
            $scope.BranchList = [];
            $scope.hasNonGeneralCommands = false;
            $scope.searchOptions = {};
            $scope.supplierList = [];
            $scope.getBranchesByRoleAndBranch();
            //$scope.searchOptions.Branch = { title: $rootScope.selectedBranchTitle, originalObject: { Name: $rootScope.selectedBranchTitle, Value: $rootScope.selectedBranchId } };
        }
        init();
        
    }]);