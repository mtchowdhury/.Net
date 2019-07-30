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
    this.getTransactionSummaryData = function (branchId, transactionDate, loanOfficerId, groupId, memberId, groupBy, reportType) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'reports/transactionsummary/gettransactionsummarydata',
            params: {
                branchId: Encrypt.encrypt(branchId),
                transactionDate: Encrypt.encrypt(transactionDate),
                loanOfficerId: Encrypt.encrypt(loanOfficerId),
                groupId: Encrypt.encrypt(groupId),
                memberId: Encrypt.encrypt(memberId),
                groupBy: Encrypt.encrypt(groupBy),
                reportType: Encrypt.encrypt(reportType)
            },
            headers: $rootScope.headersWithoutLog
        });
    }


    
    this.getMasterRollReportData = function (branchId, loanType, fromdate, toDate, loanOfficerId, groupId, memberId, meetingDayId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'reports/transactionsummary/getmasterrolldata',
            params: {
                branchId: Encrypt.encrypt(branchId),
                loanType: Encrypt.encrypt(loanType),
                fromDate: Encrypt.encrypt(fromdate),
                toDate: Encrypt.encrypt(toDate),
                loanOfficerId: Encrypt.encrypt(loanOfficerId),
                groupId: Encrypt.encrypt(groupId),
                memberId: Encrypt.encrypt(memberId),  
                meetingDayId: Encrypt.encrypt(meetingDayId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
}]);