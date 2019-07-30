ammsAng.service('assetCategoryService', ['$http', '$rootScope', function($http, $rootScope) {
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.getAssetCategoryFilterData = function () {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'category/getfilterData/',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.addCategory = function (category) {
        return $http({
            method: 'POST',
            url: $rootScope.assetApiBaseUrl + 'category/add',
            data: category,
            headers: $rootScope.headersWithLog

        });
    };
    this.edit = function (category) {
        return $http({
            method: 'POST',
            url: $rootScope.assetApiBaseUrl + 'category/edit',
            data: category,
            headers: $rootScope.headersWithLog
        });
    };
    this.getAll = function () {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'category/',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getCategoryInfo=function(id) {
        return $http({
            method: 'GET',
            params: {
                categoryId:Encrypt.encrypt(id)
            },
            url: $rootScope.assetApiBaseUrl + 'category/getCategoryInfo/',
            headers: $rootScope.headersWithoutLog
        });
    }

    this.delete = function (id) {
        return $http({
            method: 'DELETE',
            url: $rootScope.assetApiBaseUrl + 'category/delete',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithLog
        });
    };
}]);