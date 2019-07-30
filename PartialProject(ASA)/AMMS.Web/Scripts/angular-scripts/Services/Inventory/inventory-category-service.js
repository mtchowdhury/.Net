ammsAng.service('inventoryCategoryService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.getInventoryCategoryFilterData = function () {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'category/getfilterData/',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.addCategory = function (category) {
        return $http({
            method: 'POST',
            url: $rootScope.inventoryApiBaseUrl + 'category/add',
            data: category,
            headers: $rootScope.headersWithLog

        });
    };
    this.edit = function (category) {
        return $http({
            method: 'POST',
            url: $rootScope.inventoryApiBaseUrl + 'category/edit',
            data: category,
            headers: $rootScope.headersWithLog
        });
    };
    this.getAll = function () {
        console.log($rootScope.headersWithoutLog);
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'category/',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getCategoryInfo=function(id) {
        return $http({
            method: 'GET',
            params: {
                categoryId: Encrypt.encrypt(id)
            },
            url: $rootScope.inventoryApiBaseUrl + 'category/getCategoryInfo/',
            headers: $rootScope.headersWithoutLog
        });
    }

    this.delete = function (id) {
        return $http({
            method: 'DELETE',
            url: $rootScope.inventoryApiBaseUrl + 'category/delete',
            params: {
                categoryId: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithLog
        });
    };


    this.ifItemExistForCategory = function (id) {
        return $http({
            method: 'GET',
            params: {
                id: Encrypt.encrypt(id)
            },
            url: $rootScope.inventoryApiBaseUrl + 'category/getItemTypeByCategoryId/',
            headers: $rootScope.headersWithoutLog
        });
    }
}]);