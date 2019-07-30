ammsAng.controller('supplierEditController', ['$scope', '$rootScope', 'assetSupplierService', '$timeout', 'DTOptionsBuilder', 'commonService',
function ($scope, $rootScope, assetSupplierService, $timeout, DTOptionsBuilder, commonService) {
   
    var init = function () {
        $scope.filters = {};
        $scope.hasNonGeneralCommands = false;
        $scope.Supplier = {};
        
    }

    init();
    console.log($rootScope.editSupplierId);
    $("#loadingImage").css("display", "block");
    assetSupplierService.getSupplier($rootScope.editSupplierId).then(function (response) {
        
        console.log(response.data);
        $scope.Supplier = response.data;
        $scope.SupplierEnlistmentDate = new Date($scope.Supplier.EnlistmentDate);
        $scope.Supplier.BranchId = $scope.Supplier.BranchId.toString();
        $scope.Supplier.Status = $scope.Supplier.Status.toString();
        var branch = $rootScope.branchList.find(e => e.BranchId === $scope.Supplier.BranchId);
        if(branch)
            $scope.Supplier.BranchName = $rootScope.branchList.find(e => e.BranchId === $scope.Supplier.BranchId).BranchName;
        $("#loadingImage").css("display", "none");
    });

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
    assetSupplierService.getCountries().then(function (response) {
        console.log(response);
        var countries = response.data;
        $scope.filters.CountryList = $.map(countries, function (el) { return el });
        console.log($scope.filters.CountryList);
    });

    assetSupplierService.getFilters().then(function (response) {
        console.log(response.data);
        if (response.data) {
            $scope.filters.StatusList = response.data[0].filter(s=>s.Value != $rootScope.AssetConfig.SupplierStatus.Deleted);
            $scope.filters.BranchList = response.data[1];
            $scope.filters.vatCategoryList = response.data[2];
            $scope.filters.taxCategoryList = response.data[3];
        }
    });

    //$scope.EnlistmentDateRange = function ($dates) {
    //    for (d in $dates) {
    //        if ($dates[d].utcDateValue >= moment($rootScope.workingdate).add(1, 'days').valueOf()) {
    //            $dates[d].selectable = false;
    //        }
    //    }
    //}
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


    var validateSupplier = function () {
     //   if ($scope.editSupplierForm.$valid === false && $scope.editSupplierForm.$dirty === true)return false;

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

    
    $scope.editSupplier = function () {
        if (validateSupplier()) {
            $scope.Supplier.User = $rootScope.user.UserId;
            swal(commonService.swalHeaders($rootScope.showMessage($rootScope.editConfirmation, $rootScope.supplier), "warning"),
           function () {
               $scope.Supplier.EnlistmentDate = moment($scope.SupplierEnlistmentDate).format("YYYY-MM-DD");
               $scope.Supplier.LastModifiedBranchDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
               assetSupplierService.editSupplier($scope.Supplier).then(function (response) {
                   if (response.data.Success) {
                       $rootScope.$broadcast('supplier-edit-finished');
                       swal("Edited!", "Supplier has been edited.", "success");
                       commonService.clearAndCloseTab();
                       $scope.execRemoveTab($scope.tab);
                   } else {
                       //if (response.data.Message.split('!')[0]) {
                       //    if (response.data.Message.split('!')[0].toLowerCase() == 'warning')
                       //      swal($rootScope.showMessage("Supplier can't be edited", ""), response.data.Message.split('!')[1], "warning");
                       //}
                       //else
                            swal($rootScope.showMessage($rootScope.editError, $rootScope.supplier), response.data.Message, "error");
                   }
               }, AMMS.handleServiceError);
           });
        }
    }






























}]);