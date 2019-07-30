ammsAng.service('cashBookReceivePaymentService', ['$http', '$rootScope', function ($http, $rootScope) {

   
    this.getCashBookReceiveReportData = function (filter) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'cashbookReport/getCashBookReceiveReport',
            data:filter,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getCashBookPaymentReportData = function (filter) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'cashbookReport/getCashBookPaymentReport',
            data: filter,
            headers: $rootScope.headersWithoutLog
        });
    }
}]);