ammsAng.service('savingsAccountService', ['$http', '$rootScope', function($http, $rootScope) {
        this.headers = $rootScope.headersWithLog;
        this.noLogHeaders = $rootScope.headersWithoutLog;

        this.getMemberInfo = function (memberId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/member',
                params: {
                    memberId: Encrypt.encrypt(memberId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }


        this.getProductInfo = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/savingsproduct/productdetails',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getCategories = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/savings/categories',
                headers: $rootScope.headersWithoutLog
            });
        };


        this.getAllPrograms = function (categoryId) {
            return $http({
                method: 'GET',
                params: {
                    categoryId: Encrypt.encrypt(categoryId)
                    } ,
                url: $rootScope.programsApiBaseUrl + 'account/savings/products',
                headers: $rootScope.headersWithoutLog
            });
        };
        
        
        this.getAllowedProduct = function (memberId) {
            return $http({
                method: 'GET',
                params: {
                    memberId: Encrypt.encrypt(memberId)
                },
                url: $rootScope.programsApiBaseUrl + 'account/savings/allowedproduct',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getFilters = function (memberId) {
            return $http({
                method: 'GET',
                params: {
                    memberId: Encrypt.encrypt(memberId)
                },
                url: $rootScope.programsApiBaseUrl + 'account/savings/filters',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getSavingsAccounts = function (memberId) {
            return $http({
                method: 'GET',
                params: {
                    memberId : Encrypt.encrypt(memberId)
                },
                url: $rootScope.programsApiBaseUrl + 'account/savings/savingsaccounts',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.AddSavingsAccount = function (ammsSavingsAccount) {
            console.log(ammsSavingsAccount);
            return $http({
                method: 'POST',
                data: ammsSavingsAccount,
                url: $rootScope.programsApiBaseUrl + 'account/savings/add',
                headers: $rootScope.headersWithLog
            });
        };

        this.editSavingsAccount = function (ammsSavingsAccount) {
            return $http({
                method: 'POST',
                data: ammsSavingsAccount,
                url: $rootScope.programsApiBaseUrl + 'account/savings/edit',
                headers: $rootScope.headersWithLog
            });
        };

        this.deleteSavingsAccount = function (accountId, memberId) {
            return $http({
                method: 'DELETE',
                params: {
                    accountId: Encrypt.encrypt(accountId),
                    memberId: Encrypt.encrypt(memberId)
                },
                url: $rootScope.programsApiBaseUrl + 'account/savings/delete',
                headers: $rootScope.headersWithLog
            });
        };

        this.getAccountDetails = function (accountId) {
            return $http({
                method: 'GET',
                params: {
                    accountId: Encrypt.encrypt(accountId)
                },
                url: $rootScope.programsApiBaseUrl + 'account/savings/accountdetails',
                headers: $rootScope.headersWithoutLog
            });
        };
        this.getInterestAmountByClosingDate = function (accountId, closingDate) {
            return $http({
                method: 'GET',
                params: {
                    accountId: Encrypt.encrypt(accountId),
                    closingDate: Encrypt.encrypt(closingDate)
                },
                url: $rootScope.programsApiBaseUrl + 'account/savings/interestamount',
                headers: $rootScope.headersWithoutLog
            });
        }
        this.getTransactionSummary = function (accountId) {
            return $http({
                method: 'GET',
                params: {
                    accountId: Encrypt.encrypt(accountId)
                },
                url: $rootScope.programsApiBaseUrl + 'account/savings/transactionsummary',
                headers: $rootScope.headersWithoutLog
            });
        };
    }
]);