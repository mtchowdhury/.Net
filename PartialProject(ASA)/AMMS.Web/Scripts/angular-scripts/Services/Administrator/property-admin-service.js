ammsAng.service('propertyAdminService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.getProperties = function () {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/propertyadmin/getallproperty',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.addProperty = function (property) {
        return $http({
            method: 'POST',
            url: $rootScope.masterdataApiBaseUrl + 'administration/propertyadmin/addproperty',
            headers: $rootScope.headersWithoutLog,
            data: property
        });
    }
    this.getPropertyById=function(id) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/propertyadmin/getpropertybyid',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.editProperty = function(property) {
        return $http({
            method: 'POST',
            url: $rootScope.masterdataApiBaseUrl + 'administration/propertyadmin/editproperty',
            headers: $rootScope.headersWithLog,
            data: property
        });
    };

    this.deleteProperty = function(id) {
        return $http({
            method: 'DELETE',
            url: $rootScope.masterdataApiBaseUrl + 'administration/propertyadmin/deleteproperty',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithLog
        });
    };

}]);