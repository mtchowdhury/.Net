ammsAng.service('tabService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.getMenus = function (user) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'configuration/module/get',
            params: {
                userId: Encrypt.encrypt(user.UserId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getProperties = function (userId, moduleId) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'configuration/property/get',
            params: {
                userId: Encrypt.encrypt(userId),
                moduleId: Encrypt.encrypt(moduleId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
}]);