ammsAng.service('inventorySupplierService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.getSuppliers = function (role,branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'supplier/',
            headers: this.noLogHeaders,
            params: {
                roleId: Encrypt.encrypt(role),
                branchId: Encrypt.encrypt(branchId)
            }
        });
    };

    this.getCountries = function () {
        return $http({
            method: 'GET',
            url: $rootScope.locationStr+"/Utilities/countries.json"
           
        });

        //$.getJSON("/translations/bn.json", function (json) {
        //    console.log(json); // this will show the info it in firebug console
        //});
        //alert("d");
    };
   
    this.generateSupplierId = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'supplier/generateSupplierId',
            headers: this.noLogHeaders,
            params: {
                branchId: Encrypt.encrypt(branchId)
            }
        });
    };

    this.getSupplier = function (supplierId) {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'supplier/getbyid',
            headers: this.noLogHeaders,
            params: {
                supplierId: Encrypt.encrypt(supplierId)
            }
        });
    };

   
    
    this.getFilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'supplier/getfilterdata',
            headers: this.noLogHeaders
        });
    };

    this.addSupplier = function (supplier) {
        console.log(supplier);
        return $http({
            method: 'POST',
            url: $rootScope.inventoryApiBaseUrl + 'supplier/add',
            data : supplier,
            headers: this.headers
        });
    }

    this.editSupplier = function (supplier) {
        return $http({
            method: 'POST',
            url: $rootScope.inventoryApiBaseUrl + 'supplier/edit',
            data: supplier,
            headers: this.headers
        });
    }
    
    this.deleteSupplier = function (supplierId,isManufacturer) {
        return $http({
            method: 'DELETE',
            url: $rootScope.inventoryApiBaseUrl + 'supplier/delete',
            params: {
                inventorySupplierId: Encrypt.encrypt(supplierId),
                isManufacturer: Encrypt.encrypt(isManufacturer)
            },
            headers: $rootScope.headersWithLog
        });
    }
}]);