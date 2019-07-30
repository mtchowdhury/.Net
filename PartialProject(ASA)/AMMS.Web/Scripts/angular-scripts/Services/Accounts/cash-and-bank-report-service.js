ammsAng.service('cashAndBanReportService', ['$http', '$rootScope', function ($http, $rootScope) {


    this.getCashAndBankReportDataForVerticalView = function (filter) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'cashAndBanReport/getCashAndBankReportDataForVerticalView',
            data: filter,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getCashAndBankReportDataForHorizontalView = function (filter) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'cashAndBanReport/getCashAndBankReportDataForHorizontalView',
            data: filter,
            headers: $rootScope.headersWithoutLog
        });
    }
}]);