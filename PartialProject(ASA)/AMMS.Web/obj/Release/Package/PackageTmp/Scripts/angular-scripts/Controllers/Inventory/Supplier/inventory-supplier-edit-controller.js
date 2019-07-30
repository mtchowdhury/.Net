ammsAng.controller('inventorySupplierEditController', ['$scope', '$rootScope', 'inventorySupplierService', '$timeout', 'DTOptionsBuilder', 'commonService',
function ($scope, $rootScope, inventorySupplierService, $timeout, DTOptionsBuilder, commonService) {
    $scope.getSupplier= function() {
        inventorySupplierService.getSupplier($rootScope.editSupplierId).then(function(response) {
            $scope.Supplier = response.data;
            $scope.Supplier.EnlistmentDate = new Date($scope.Supplier.EnlistmentDate);
            $scope.Supplier.UpdatedBy = $rootScope.user.EmployeeId;
            $scope.Supplier.LastModifiedBranchDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            $("#loadingImage").css("display", "none");
        });
    }

    $scope.openEnlistmentDatePopup = function () {
        $scope.popupEnlistmentDate.opened = true;
    }
    $scope.popupEnlistmentDate = {
        opened: false
    };
    $scope.dateOptions = {
        formatYear: 'yyyy',
        maxDate: new Date($rootScope.workingdate),
        minDate: new Date(1991, 1, 1),
        startingDay: 1
    };
    $scope.getCountries= function() {
        inventorySupplierService.getCountries().then(function(response) {
            console.log(response);
            var countries = response.data;
            $scope.countryList = $.map(countries, function(el) { return el });
        });
    }
    $scope.getFilterData = function () {
        $scope.getCountries();
        inventorySupplierService.getFilters().then(function (response) {
            if (response.data) {
                $scope.statusList = response.data.StatusList;
                $scope.branchList = response.data.BranchList;
                $scope.officeTypeList = response.data.OfficeTypeList;
                $scope.getSupplier();
            }
        });
    }
    $scope.validateEmail = function (email) {
        if (!email) return true;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email))
            return "Invalid Email";
        return true;
    }
    var validateSupplier = function () {
        if (!$scope.validateEmail($scope.Supplier.OfficeMail)) {
            swal("please Provide a valid office mail");
            return false;
        }
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

    
    $scope.editSupplier = function () {
        if (validateSupplier()) {
            $scope.Supplier.User = $rootScope.user.UserId;
            swal(commonService.swalHeaders($rootScope.showMessage($rootScope.editConfirmation, $rootScope.supplier), "warning"),
           function () {
               $scope.Supplier.EnlistmentDate = new Date(moment($scope.Supplier.EnlistmentDate).format("YYYY-MM-DD"));
               inventorySupplierService.editSupplier($scope.Supplier).then(function (response) {
                   if (response.data.Success) {
                       $rootScope.$broadcast('inventory-supplier-edit-finished');
                       swal("Edited!", "Supplier has been edited.", "success");
                       commonService.clearAndCloseTab();
                       $scope.execRemoveTab($scope.tab);
                   } else {
                       if (response.data.Message.split('!')[0]) {
                           if (response.data.Message.split('!')[0].toLowerCase() == 'warning')
                             swal($rootScope.showMessage("Supplier can't be edited", ""), response.data.Message.split('!')[1], "warning");
                       }
                       else
                           swal($rootScope.showMessage($rootScope.editError, $rootScope.supplier), response.data.Message, "error");
                   }
               }, AMMS.handleServiceError);
           });
        }
    }
    var init = function () {
        $("#loadingImage").css("display", "block");
        $scope.filters = {};
        $scope.hasNonGeneralCommands = false;
        $scope.Supplier = {};
        $scope.getFilterData();
    }
    init();
}]);