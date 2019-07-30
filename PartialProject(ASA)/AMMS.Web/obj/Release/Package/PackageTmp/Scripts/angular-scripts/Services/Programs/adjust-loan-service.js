ammsAng.service('adjustloanservice', ['$rootScope', '$http', function ($rootScope, $http) {


    this.getMemberAccounts = function (memberId, date) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'transaction/loanadjust/get',
            params: {
                memberId: Encrypt.encrypt(memberId),
                date: Encrypt.encrypt(date)
            },
            headers: $rootScope.headersWithoutLog
        });
    };


    this.save = function (accountDetails) {
        console.log($rootScope.headersWithLog);
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'transaction/loanadjust/save',
            data: accountDetails,
            headers: $rootScope.headersWithLog

        });
    };
    
    this.getSavingAccountAdjustedAmount = function (savingAccountId,loanAccountId,date) {
        console.log($rootScope.headersWithLog);
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'transaction/loanadjust/getAdjustedAmount',
            params: {
                savingAccountId: Encrypt.encrypt(savingAccountId),
                loanAccountId: Encrypt.encrypt(loanAccountId),
                date: Encrypt.encrypt(date)
            },
            headers: $rootScope.headersWithLog

        });
    };

}]);