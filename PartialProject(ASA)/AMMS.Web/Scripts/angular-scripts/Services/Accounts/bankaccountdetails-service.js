ammsAng.service('bankAccountDetailsService', ['$http', '$rootScope', function ($http, $rootScope) {

   
   
    this.addBankAccount = function (bankAccount) {
        return $http({
            method: 'POST',
            //params: {
            //    filterValues: Encrypt.encrypt(filter)
            //},
            url: $rootScope.accountsApiBaseUrl + 'bankaccount/addBankAccount',
            data: bankAccount,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getBankAccountListByBranchId = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'bankaccount/getBankAccountDetails',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

}]);