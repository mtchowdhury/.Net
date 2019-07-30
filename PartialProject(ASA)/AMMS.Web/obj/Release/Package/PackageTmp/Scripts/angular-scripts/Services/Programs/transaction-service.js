ammsAng.service('transactionService', ['$rootScope', '$http', function ($rootScope, $http) {

    this.getTransactionsOfGroup = function (groupId, date, workingDate,branchId) {
        console.log("asd");
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'transaction/getMemberTransactions',
            params: {
                groupId: Encrypt.encrypt(groupId),
                date: Encrypt.encrypt(date),
                branchWorkingDate: Encrypt.encrypt(workingDate),
                branchId : Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getProductFilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'transaction/getProductFilters',
            params: {
                
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.SaveTransaction = function (postTransaction, branchId) {
        console.log(postTransaction);
        var data = { transaction: postTransaction, branchId: branchId };
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'transaction/saveTransaction',
            data: data,
            headers: $rootScope.headersWithLog
        });
    };

    
   
}]);