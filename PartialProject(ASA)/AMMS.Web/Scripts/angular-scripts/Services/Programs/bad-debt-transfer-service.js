ammsAng.service('badDebtService', ['$http', '$rootScope', function ($http, $rootScope) {


    this.getBadDebtData = function (memberId, branchWorkingDate, branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'transfer/baddebt',
            params: {
                memberId: Encrypt.encrypt(memberId),
                branchWorkingDate: Encrypt.encrypt(branchWorkingDate),
                branchId: Encrypt.encrypt(branchId)
    },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getBadDebtGroup = function (programOfficerId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'transfer/baddebtgroups',
            params: {
                programOfficerId: Encrypt.encrypt(programOfficerId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.transferMember = function (transferData) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'transfer/transfermember',
            data: transferData,
            headers: $rootScope.headersWithLog
        });
    };

}]);