ammsAng.service('trialBalanceService', ['$http', '$rootScope', function ($http, $rootScope) {

    this.getTrialBalanceList = function (filter) {
        return $http({
            method: 'POST',
            //params: {
            //    filterValues: Encrypt.encrypt(filter)
            //},
            url: $rootScope.accountsApiBaseUrl + 'trialBalance/getTrialBalanceList',
            data: filter,
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getExportUrl = function (url, filterparams) {
        return url +='filterparams=' + Encrypt.encrypt(filterparams);
        //+

        // '&fileName=' + Encrypt.encrypt(fileName) + '&apiKey=' + Encrypt.encrypt($rootScope.user.SecretKey) + '&user=' + Encrypt.encrypt($rootScope.user.UserId);
    }
}]);