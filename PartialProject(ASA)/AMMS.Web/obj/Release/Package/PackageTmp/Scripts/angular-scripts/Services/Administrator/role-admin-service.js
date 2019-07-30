ammsAng.service('roleAdminService', ['$http', '$rootScope', function ($http, $rootScope) {

    this.getRoles = function () {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/roleadmin/roles',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getRoleLevels = function () {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/roleadmin/rolelevel',
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getRoleById = function (id) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/roleadmin/rolebyid',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
    this.deleteRole = function (id) {
        return $http({
            method: 'DELETE',
            url: $rootScope.masterdataApiBaseUrl + 'administration/roleadmin/delete',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithLog
        });
    };

    this.addRole = function (role) {
        return $http({
            method: 'POST',
            url: $rootScope.masterdataApiBaseUrl + 'administration/roleadmin/add',
            headers: $rootScope.headersWithLog,
            data: role
        });
    };


    this.editRole = function (role) {
        return $http({
            method: 'POST',
            url: $rootScope.masterdataApiBaseUrl + 'administration/roleadmin/edit',
            headers: $rootScope.headersWithLog,
            data: role
        });
    }

}]);