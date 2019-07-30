ammsAng.service('inventoryTypeService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.GetAll = function () {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'itemtype/',
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getFiltersData=function() {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'itemtype/getfilterdata',
            headers: $rootScope.headersWithoutLog
        });
    }
    this.addInventoryType = function (itemType) {
        return $http({
            method: 'POST',
            url: $rootScope.inventoryApiBaseUrl + 'itemtype/add',
            headers: this.headers,
            data: itemType
        });
    };

    this.editInventoryType = function (itemType) {
        return $http({
            method: 'POST',
            url: $rootScope.inventoryApiBaseUrl + 'itemtype/edit',
            headers: this.headers,
            data: itemType
        });
    };

    this.getInventoryItem = function (itemId) {
        return $http({
            method: 'GET',
            url: $rootScope.inventoryApiBaseUrl + 'itemtype/getbyid',
            params: {
                itemTypeId: Encrypt.encrypt(itemId)
            },
            headers: this.noLogHeaders
        });
    };

    this.delete = function (itemId) {
        return $http({
            method: 'DELETE',
            url: $rootScope.inventoryApiBaseUrl + 'itemtype/delete',
            params: {
                itemId: Encrypt.encrypt(itemId)
            },
            headers: this.headers
        });
    };
}]);