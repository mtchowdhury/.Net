ammsAng.service('userAdminService', ['$http', '$rootScope', function ($http, $rootScope) {

    this.getUsers = function (roleId,employeeId,branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/useradmin/getall',
            params: {
                roleId: Encrypt.encrypt(roleId),
                employeeId: Encrypt.encrypt(employeeId),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getAllBranch = function() {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/useradmin/getallbranch',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getUser = function (id) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/useradmin/get',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.deleteUser = function (id) {
        return $http({
            method: 'DELETE',
            url: $rootScope.masterdataApiBaseUrl + 'administration/useradmin/delete',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithLog
        });
    };

    this.addUser = function (user) {
        return $http({
            method: 'POST',
            url: $rootScope.masterdataApiBaseUrl + 'administration/useradmin/add',
            headers: $rootScope.headersWithLog,
            data: user
        });
    };

    this.editUser = function (user) {
        return $http({
            method: 'POST',
            url: $rootScope.masterdataApiBaseUrl + 'administration/useradmin/edit',
            headers: $rootScope.headersWithLog,
            data: user
        });
    };

    this.getUserPasswords = function (userName, password) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'authorization/user/getPasswordHistory',
            params: {
                userName: Encrypt.encrypt(userName),
                password: Encrypt.encrypt(password)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
}]);