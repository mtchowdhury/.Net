ammsAng.service('fundTransferReportService', ['$http', '$rootScope', function ($http, $rootScope) {


    this.getFundTransferReportDataForVerticalView = function (filter) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'fundTransferReport/getFundTransferReportDataForVerticalView',
            data: filter,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getFundTransferReportDataForHorizontalView = function (filter) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'fundTransferReport/getFundTransferReportDataForHorizontalView',
            data: filter,
            headers: $rootScope.headersWithoutLog
        });
    }
}]);