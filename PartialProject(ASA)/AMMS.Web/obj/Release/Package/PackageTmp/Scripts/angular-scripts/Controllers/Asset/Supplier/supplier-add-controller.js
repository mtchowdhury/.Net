ammsAng.controller('supplierAddController', ['$scope', '$rootScope', 'assetSupplierService', '$timeout', 'DTOptionsBuilder','commonService',
function ($scope, $rootScope, assetSupplierService, $timeout, DTOptionsBuilder,commonService) {
        var contactPerson = { Name: "", Designation: "", MobileNumber: "", Email: "" };
        var init = function() {
            $scope.Supplier = {};
            $scope.filters = {};
            $scope.SupplierEnlistmentDate = new Date($rootScope.workingdate);//workingdate
            $scope.Supplier.CreateBranchWorkingDate = moment($rootScope.workingdate).format();//workingdate
            $scope.Supplier.BranchId = $rootScope.selectedBranchId;
            $scope.Supplier.BranchName = $rootScope.selectedBranchTitle;
            $scope.Supplier.IsSupplier = true;
            $scope.Supplier.IsManufacturer = true;
            //$scope.GenerateSupplierId();

            $("#loadingImage").css("display", "block");
            assetSupplierService.getCountries().then(function (response) {
                var countries = response.data;
                $scope.filters.CountryList = $.map(countries, function (el) { return el });
                $scope.Supplier.Country = $scope.filters.CountryList[0];
            });

            assetSupplierService.getFilters().then(function (response) {
                //response.data.filter(s => s.Value === '1');
                if (response.data) {
                    $scope.filters.StatusList = response.data[0];
                    $scope.filters.BranchList = response.data[1];
                    $scope.filters.vatCategoryList = response.data[2];
                    $scope.filters.taxCategoryList = response.data[3];
                    $scope.Supplier.BranchId = $rootScope.selectedBranchId.toString();
                }

                $scope.filters.StatusList = $scope.filters.StatusList.filter(s => s.Value === '1')
                if ($scope.filters.StatusList)
                    $scope.Supplier.Status = $scope.filters.StatusList[0].Value;
                $("#loadingImage").css("display", "none");
            });
            console.log($scope.Supplier);
            
        }
        $scope.openEnlistmentDatePopup = function () {
            $scope.popupEnlistmentDate.opened = true;
        }
        $scope.popupEnlistmentDate = {
            opened: false
        };
       //$scope.GenerateSupplierId = function () {
       //     assetSupplierService.generateSupplierId($scope.Supplier.BranchId).then(function (response) {
       //     console.log(response.data);
       //     $scope.Supplier.SupplierId = response.data;
       //     });
            
       // }

        $scope.clearModelData = function () {
            init();
        }

        $scope.validateEmail = function (email) {
            if (!email)return true;
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
            minDate: new Date(1991,1,1),
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
                   assetSupplierService.postSupplier($scope.Supplier).then(function (response) {
                       if (response.data.Success) {
                           $rootScope.$broadcast('supplier-add-finished');
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
                                       $scope.addSupplierForm.reset();
                                       $scope.addSupplierForm.$dirty = false;
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