ammsAng.controller('inventorySupplierAddController', ['$scope', '$rootScope', 'inventorySupplierService', '$timeout', 'DTOptionsBuilder', 'commonService',
function ($scope, $rootScope, inventorySupplierService, $timeout, DTOptionsBuilder, commonService) {
    var contactPerson = { Name: "", Designation: "", MobileNumber: "", Email: "" };
    var init = function () {
        $scope.Supplier = {};
        $scope.SupplierEnlistmentDate = new Date($rootScope.workingdate);//workingdate
        $scope.Supplier.CreateBranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");//workingdate
        $scope.Supplier.BranchId = $rootScope.selectedBranchId;
        $scope.Supplier.BranchName = $rootScope.selectedBranchTitle;
        $scope.Supplier.CreatedBy = $rootScope.user.EmployeeId;
        $scope.Supplier.IsSupplier = true;
        $scope.Supplier.IsManufacturer = true;
        
        console.log($scope.Supplier);
        $scope.getFilterData();
        $scope.getCountries();
    }
    $scope.getFilterData = function () {
        inventorySupplierService.getFilters().then(function (response) {
            if (response.data) {
                $scope.statusList = response.data.StatusList.filter(s=>s.Value==$rootScope.InventoryConfig.SupplierStatus.Active);
                $scope.branchList = response.data.BranchList;
                $scope.officeTypeList = response.data.OfficeTypeList;
                $scope.Supplier.BranchId = $rootScope.selectedBranchId;
                if ($scope.statusList)
                    $scope.Supplier.Status = $scope.statusList[0].Value;
                console.log(response.data);
                //$scope.GenerateSupplierId();
            }
        });
    }
    $scope.getCountries = function () {
        inventorySupplierService.getCountries().then(function (response) {
            var countries = response.data;
            $scope.countryList = $.map(countries, function (el) { return el });
            $scope.Supplier.Country = $scope.countryList[0];
        });
    }
    $scope.openEnlistmentDatePopup = function () {
        $scope.popupEnlistmentDate.opened = true;
    }
    $scope.popupEnlistmentDate = {
        opened: false
    };
    //$scope.GenerateSupplierId = function () {
    //    inventorySupplierService.generateSupplierId($scope.Supplier.BranchId).then(function (response) {
    //        console.log(response.data);
    //        $scope.Supplier.SupplierId = response.data;
    //    });

    //}

    $scope.clearModelData = function () {
        init();
    }

    $scope.validateEmail = function (email) {
        if (!email) return true;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email))
            return "Invalid Email";
        return true;
    }

    //$scope.PhoneNoValidator = function (phone) {
    //    if (!phone) return true;
    //    var pattern = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
    //    if (!pattern.test(phone)) 
    //        return "Invalid Phone number";
    //    return true;
    //}
    //$scope.EnlistmentDateRange = function ($dates) {
    //    for (d in $dates) {
    //        if ($dates[d].utcDateValue >= moment($rootScope.workingdate).add(1, 'days').valueOf()) {
    //            $dates[d].selectable = false;
    //        }
    //    }
    //}
    $scope.dateOptions = {
        formatYear: 'yyyy',
        maxDate: new Date($rootScope.workingdate),
        minDate: new Date(1991, 1, 1),
        startingDay: 1
    };

    var validateSupplier = function () {
        console.log($scope.Supplier);
        if (!$scope.validateEmail($scope.Supplier.OfficeMail)) {
            swal("please Provide a valid office mail");
            return false;
        }
        //if (!$scope.PhoneNoValidator($scope.Supplier.OfficeContatctNumber)) {
        //    swal("please Provide a valid Contact number");
        //    return false;
        //}

        if ($scope.Supplier.PrimaryContactEmail && !$scope.validateEmail($scope.Supplier.PrimaryContactEmail)) {
            swal("please Provide valid primary contact mail");
            return false;
        }
        if ($scope.Supplier.SecondaryContactEmail && !$scope.validateEmail($scope.Supplier.SecondaryContactEmail)) {
            swal("please Provide  valid secondary contact mail");
            return false;
        }
        if (!$scope.Supplier.IsSupplier && !$scope.Supplier.IsManufacturer) {
            swal("please check at least one field of  Is Manufacturer and Is Suplier");
            return false;
        }
        if (!($scope.Supplier.PrimaryContactName && $scope.Supplier.PrimaryContactDesignation && $scope.Supplier.PrimaryContactNumber) && $scope.Supplier.IsSupplier) {
            swal("please provide primary contact details");
            return false;
        }
        return true;
    }

    init();

    $scope.addSupplier = function () {
        $scope.Supplier.User = $rootScope.user.UserId;
        if (validateSupplier()) {
            swal(commonService.swalHeaders($rootScope.showMessage($rootScope.addConfirmation, $rootScope.supplier), "warning"),
           function () {
               $scope.Supplier.EnlistmentDate = moment($scope.SupplierEnlistmentDate).format("YYYY-MM-DD");
               inventorySupplierService.addSupplier($scope.Supplier).then(function (response) {
                   if (response.data.Success) {
                       $rootScope.$broadcast('inventory-supplier-add-finished');
                       swal({
                           title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.Supplier),
                           text: "What do you want to do next?",
                           type: "success",
                           showCancelButton: true,
                           confirmButtonColor: "#008000",
                           confirmButtonText: "Add New",
                           cancelButtonText: "Close and Exit",
                           closeOnConfirm: true,
                           closeOnCancel: true
                       },
                           function (isConfirm) {
                               $scope.Supplier = {};
                               if (isConfirm) {
                                   $scope.addInventorySupplierForm.reset();
                                   $scope.addInventorySupplierForm.$dirty = false;
                                   $scope.clearModelData();
                               } else {
                                   commonService.clearAndCloseTab();
                                   $scope.execRemoveTab($scope.tab);
                               }
                           });
                   } else {
                       swal($rootScope.showMessage($rootScope.addError, $rootScope.supplier), response.data.Message, "error");
                   }
               }, AMMS.handleServiceError);
           });
        }

    }
}]);