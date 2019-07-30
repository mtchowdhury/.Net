ammsAng.service('onlineToTabService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.exportThisBranchData = function (branchId, workingDate) {
        return $http({
            method: 'GET',
            url: $rootScope.onlineToTabdataApiBaseUrl + 'tab/onlineToTab/getDataForThisBranch',
            params: {
                branchId: Encrypt.encrypt(branchId),
                workingDate: Encrypt.encrypt(workingDate)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    
}]);