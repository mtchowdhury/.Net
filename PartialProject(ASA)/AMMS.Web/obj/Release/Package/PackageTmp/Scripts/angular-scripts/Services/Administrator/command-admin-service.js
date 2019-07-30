ammsAng.service('commandAdminService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.getCommands = function () {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/commandadmin/getallcommands',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.addCommand = function (command) {
        return $http({
            method: 'POST',
            url: $rootScope.masterdataApiBaseUrl + 'administration/commandadmin/addcommand',
            headers: $rootScope.headersWithoutLog,
            data: command
        });
    }
    this.getCommandById=function(id) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/commandadmin/getcommandbyid',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.editCommand = function(command) {
        return $http({
            method: 'POST',
            url: $rootScope.masterdataApiBaseUrl + 'administration/commandadmin/editcommand',
            headers: $rootScope.headersWithLog,
            data: command
        });
    };

    this.deleteCommand = function(id) {
        return $http({
            method: 'DELETE',
            url: $rootScope.masterdataApiBaseUrl + 'administration/commandadmin/deletecommand',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithLog
        });
    };

}]);