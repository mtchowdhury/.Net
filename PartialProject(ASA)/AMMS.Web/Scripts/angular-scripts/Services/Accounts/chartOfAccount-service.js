ammsAng.service('chartOfAccountService', ['$http', '$rootScope', function ($http, $rootScope) {

    this.getChartOfAccount = function (branchId, onlyChildSelectable, forAdd, officeType) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'chartOfAccount/get',
            params: {
                onlyChildSelectable: Encrypt.encrypt(onlyChildSelectable),
                forAdd: Encrypt.encrypt(forAdd),
                officeType: Encrypt.encrypt(officeType),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getChartOfAccountForListView = function (roleId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'chartOfAccount/getForListView',
            params: {branchId: Encrypt.encrypt(roleId)},
            headers: $rootScope.headersWithoutLog
        });
    };
    
}]);