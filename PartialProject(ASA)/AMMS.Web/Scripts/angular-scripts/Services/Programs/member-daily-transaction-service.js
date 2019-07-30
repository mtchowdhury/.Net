ammsAng.service('memberDailyTransactionService', ['$rootScope', '$http', function ($rootScope, $http) {

    this.getMemberDailyTransaction = function (memberId, date) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'memberTransaction/getMemberDailyTransactions',
            params: {
                memberId: Encrypt.encrypt(memberId),
                branchId: Encrypt.encrypt($rootScope.selectedBranchId),
                date: Encrypt.encrypt(date)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getBankAccount = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'memberTransaction/getBankAccounts',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getBranchOffDayAndHolidays = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'memberTransaction/getOffDays',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.saveDailyTransaction = function (dailyTransaction) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'memberTransaction/save',
            data: dailyTransaction,
            headers: $rootScope.headersWithoutLog
        });
    }
}]);