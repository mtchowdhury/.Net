ammsAng.service('transferService', ['$rootScope', '$http', function ($rootScope, $http) {

    this.user = $rootScope.user;
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.GetTransferData = function (branchId, groupId, transferDate) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'transfergroup/transferdata',
            params: {
                branchId: Encrypt.encrypt(branchId),
                groupId: Encrypt.encrypt(groupId),
                transferDate: Encrypt.encrypt(transferDate)
            },
            headers: this.noLogHeaders
        });
    }

    this.transferGroup = function (ammstransfer) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'transfergroup/transfergroup',
            data: ammstransfer,
            headers: $rootScope.headersWithLog
        });
    }
    this.cancelTransfer = function (ammsMember) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'transfergroup/canceltransfer',
            data: ammsMember,
            headers: $rootScope.headersWithLog
        });
    }

    


    this.IsMemberInTransferTransitState = function (memberId, branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'transfergroup/IsMemberInTransferTransitState',
            params: {
                memberId: Encrypt.encrypt(memberId),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: this.noLogHeaders
        });
    }
    
}]);