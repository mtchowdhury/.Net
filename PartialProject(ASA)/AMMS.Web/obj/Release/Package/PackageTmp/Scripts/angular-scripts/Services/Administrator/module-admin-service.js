ammsAng.service('moduleAdminService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.getModules = function () {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/moduleadmin/getallmodules',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.addModule = function (module) {
        return $http({
            method: 'POST',
            url: $rootScope.masterdataApiBaseUrl + 'administration/moduleadmin/addmodule',
            headers: $rootScope.headersWithoutLog,
            data: module
        });
    }
    this.getModuleById = function (id) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/moduleadmin/getmodulebyid',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.deleteModule = function(id) {
        return $http({
            method: 'DELETE',
            url: $rootScope.masterdataApiBaseUrl + 'administration/moduleadmin/deletemodule',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithLog
        });
    };

    this.editModule = function (module) {
        return $http({
            method: 'POST',
            url: $rootScope.masterdataApiBaseUrl + 'administration/moduleadmin/editmodule',
            headers: $rootScope.headersWithLog,
            data: module
        });
    };
}]);