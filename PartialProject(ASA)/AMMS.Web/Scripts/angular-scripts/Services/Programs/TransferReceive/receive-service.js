ammsAng.service('receiveService', [
    '$rootScope', '$http', function ($rootScope, $http) {
        this.getGroups = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'transfer/receive/getGroup',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getMembers = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'transfer/receive/getMember',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.postGroups = function (group) {
            return $http({
                method: 'POST',
                url: $rootScope.programsApiBaseUrl + 'transfer/receive/recieveGroup',
                data: group,
                headers: $rootScope.headersWithoutLog
            });
        };

        this.postMembers = function (memberList) {
            return $http({
                method: 'POST',
                url: $rootScope.programsApiBaseUrl + 'transfer/receive/recieveMember',
                data: memberList,
                headers: $rootScope.headersWithoutLog
            });
        };
    }]);