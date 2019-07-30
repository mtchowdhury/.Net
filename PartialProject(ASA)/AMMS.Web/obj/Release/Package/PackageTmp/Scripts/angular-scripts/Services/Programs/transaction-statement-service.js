ammsAng.service('transactionStatementService', ['$http', '$rootScope', function($http, $rootScope) {
    this.getLoanOfficerByBranch = function (branchId, roleId, employeeId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/loanofficersbybranchandrole',
            headers: $rootScope.headersWithoutLog,
            params: {
                branchId: Encrypt.encrypt(branchId),
                roleId: Encrypt.encrypt(roleId),
                employeeId: Encrypt.encrypt(employeeId)
            }
        });
    }

    this.getTransactionStatement = function (transParams) {
        return $http({
            method: 'POST',
            url: $rootScope.reportApiUrl + 'report/transactionstatement',
            headers: $rootScope.headersWithoutLog,
            data: transParams
        });
    }

    this.getExportUrl = function (transParams) {
        return $rootScope.reportApiUrl + 'report/transactionstatementexportdata?' + transParams;
    }
}]);