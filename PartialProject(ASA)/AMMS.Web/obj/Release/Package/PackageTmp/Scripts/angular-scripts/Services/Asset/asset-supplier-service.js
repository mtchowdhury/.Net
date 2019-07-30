ammsAng.service('assetSupplierService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.getSuppliers = function (role,branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiUrl + 'supplier',
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
            url: $rootScope.assetApiUrl + 'supplier/generateSupplierId',
            headers: this.noLogHeaders,
            params: {
                branchId: Encrypt.encrypt(branchId)
            }
        });
    };

    this.getSupplier = function (supplierId) {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiUrl + 'supplier/get',
            headers: this.noLogHeaders,
            params: {
                supplierId: Encrypt.encrypt(supplierId)
            }
        });
    };

   
    
    this.getFilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiUrl + 'supplier/filters',
            headers: this.noLogHeaders
        });
    };

    this.postSupplier = function (supplier) {
        console.log(supplier);
        return $http({
            method: 'POST',
            url: $rootScope.assetApiUrl + 'supplier/add',
            data : supplier,
            headers: this.headers
        });
    }

    this.editSupplier = function (supplier) {
        console.log(supplier);
        return $http({
            method: 'POST',
            url: $rootScope.assetApiUrl + 'supplier/edit',
            data: supplier,
            headers: this.headers
        });
    }
    
    this.deleteSupplier = function (supplierId) {
        return $http({
            method: 'DELETE',
            url: $rootScope.assetApiUrl + 'supplier/delete',
            params: {
                supplierId: Encrypt.encrypt(supplierId)
            },
            headers: $rootScope.headersWithLog
        });
    }
    

    //this.deleteloanGroup = function (groupId) {
    //    return $http({
    //        method: 'DELETE',
    //        url: $rootScope.programsApiBaseUrl + 'group/group/delete',
    //        params: {
    //            groupId: Encrypt.encrypt(groupId)
    //        },
    //        headers: this.headers
    //    });
    //}

    
}]);