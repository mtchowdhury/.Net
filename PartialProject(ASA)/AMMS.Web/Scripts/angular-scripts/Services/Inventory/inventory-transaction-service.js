ammsAng.service('inventoryTransactionService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.GetAll = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'inventoryTransaction/',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: this.noLogHeaders
        });
    };
    this.SearchInventory = function (searchParams) {
        return $http({
            method: 'POST',
            url: $rootScope.inventoryApiBaseUrl + 'inventory/getSearchResult',
            headers: this.headers,
            data: searchParams
        });
    };

    this.SearchTransaction = function (filterParams) {
        return $http({
            method: 'POST',
            url: $rootScope.inventoryApiBaseUrl + 'inventory/getSearchTransaction',
            headers: this.headers,
            data: filterParams
        });
    };

    this.getVattaxInfo = function (itemtypeId, purchasingLevel, officeTypeId, fiscalYear, totalBillingPrice) {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'inventory/getVattaxInfo',
            params: {
                itemtypeId: Encrypt.encrypt(itemtypeId),
                purchasingLevel: Encrypt.encrypt(purchasingLevel),
                officeTypeId: Encrypt.encrypt(officeTypeId),
                fiscalYear: Encrypt.encrypt(fiscalYear),
                totalBillingPrice: Encrypt.encrypt(totalBillingPrice)
            },
            headers: this.headers
        });
    };

    this.GetFilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/filters',
            headers: this.headers
        });
    };

    this.getAssettag = function (branchId, branchWorkingDate, itemId) {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'inventory/generateInventoryId',
            params: {
                branchId: Encrypt.encrypt(branchId),
                branchWorkingDate: Encrypt.encrypt(branchWorkingDate),
                itemId: Encrypt.encrypt(itemId)
            },
            headers: this.headers
        });
    };

    this.categoryFilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'inventory/categoryFilters',
            headers: this.headers
        });
    };

    this.GetAdditionalFilters = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'inventory/getAdditionalFilters',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: this.headers,
        });
    };

}]);