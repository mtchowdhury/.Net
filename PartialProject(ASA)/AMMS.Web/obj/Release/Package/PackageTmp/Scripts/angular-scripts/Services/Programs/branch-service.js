ammsAng.service('branchService', ['$http', '$rootScope', function ($http, $rootScope) {


    this.getAllBranch = function () {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/branch',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getGroupTypes = function () {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/branch/grouptypes',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getGroups = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/branch/groups',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getMembersWithScheduleColor = function (groupIds, workingdate, branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/branch/membersWithScheduleColor',
            params: {
                groupIds: Encrypt.encrypt(JSON.stringify(groupIds)),
                workingDate: Encrypt.encrypt(workingdate),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getMembers = function (groupIds, workingdate, branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/branch/members',
            params: {
                groupIds: Encrypt.encrypt(JSON.stringify(groupIds)),
                workingDate: Encrypt.encrypt(workingdate),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getLoanfficersOfBrnach = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/branch/loanofficer',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
}]);