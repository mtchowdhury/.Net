ammsAng.service('badDebtTransactionService', ['$rootScope', '$http', function ($rootScope, $http) {

    this.getTransactionsOfGroup = function (groupId, date, workingDate,branchId) {
        console.log("asd");
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'badDebtTransaction/getBadDebtGroupTransaction',
            params: {
                groupId: Encrypt.encrypt(groupId),
                date: Encrypt.encrypt(date),
                branchWorkingDate: Encrypt.encrypt(workingDate),
                branchId : Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    

    this.SaveTransaction = function (postTransaction) {
        console.log(postTransaction);
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'badDebtTransaction/saveGroupTransaction',
            data:postTransaction,
            headers: $rootScope.headersWithLog
        });
    };


    this.getMemberDailyTransaction = function (memberId, date, branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'badDebtTransaction/getBadDebtDailyTransaction',
            params: {
                memberId: Encrypt.encrypt(memberId),
                date: Encrypt.encrypt(date),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }


    this.saveBadDebtDailyTransaction = function (postTransaction) {
        console.log(postTransaction);
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'badDebtTransaction/saveDailyTransaction',
            data:postTransaction,
            headers: $rootScope.headersWithLog
        });
    };

   
    

    
   
}]);