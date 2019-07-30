ammsAng.service('transactionSummaryService', ['$http', '$rootScope', function ($http, $rootScope) {


    this.getCashBookReceiveReportData = function (filter) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'cashbookReport/getCashBookReceiveReport',
            data: filter,
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
    this.getTransactionSummaryData = function (branchId, transactionDate, loanOfficerId, groupId, memberId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'reports/transactionsummary/gettransactionsummarydata',
            params: {
                branchId: Encrypt.encrypt(branchId),
                transactionDate: Encrypt.encrypt(transactionDate),
                loanOfficerId: Encrypt.encrypt(loanOfficerId),
                groupId: Encrypt.encrypt(groupId),
                memberId: Encrypt.encrypt(memberId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
}]);