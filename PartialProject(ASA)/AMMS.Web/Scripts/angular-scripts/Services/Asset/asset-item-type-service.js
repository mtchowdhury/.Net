ammsAng.service('assetTypeService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.GetAll = function () {
        return $http({
            method: 'GET',
            //url: 'http://localhost:54990/asset/itemtype/getall',
            url: $rootScope.assetApiBaseUrl + 'itemtype/getall',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getAssetCategoryDepriciation = function () {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'itemtype/getAssetCategoryDepriciation',
            headers: this.noLogHeaders
        });
    };

    this.getAssetItemDepriciation = function () {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'itemtype/getAssetItemDepriciation',
            headers: this.noLogHeaders
        });
    };

    this.getCategorynStatusList = function () {
        return $http({
            method: 'GET',
            //url: 'http://localhost:54990/asset/itemtype/getCategorynStatusList',
            url: $rootScope.assetApiBaseUrl + 'itemtype/getCategoryStatusList',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.addItemType = function (itemType) {
        return $http({
            method: 'POST',
            url: $rootScope.assetApiBaseUrl + 'itemtype/addassetitem',
            headers: this.headers,
            data: itemType
        });
    };

    this.editItemType = function (itemType) {
        return $http({
            method: 'POST',
            url: $rootScope.assetApiBaseUrl + 'itemtype/editassetitem',
            headers: this.headers,
            data: itemType
        });
    };

    this.getAssetItem = function (itemId) {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'itemtype/getAssetItem',
            params: {
                itemId: Encrypt.encrypt(itemId)
            },
            headers: this.noLogHeaders
        });
    };

    this.delete = function (itemId) {
        return $http({
            method: 'DELETE',
            url: $rootScope.assetApiBaseUrl + 'itemtype/deleteassetitem',
            params: {
                itemId: Encrypt.encrypt(itemId)
            },
            headers: this.headers
        });
    };
}]);