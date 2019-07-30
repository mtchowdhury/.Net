ammsAng.service('baddebtaccountService', [
    '$http', '$rootScope', function ($http, $rootScope) {
        this.headers = $rootScope.headersWithLog;
        this.noLogHeaders = $rootScope.headersWithoutLog;

        this.getAccounts = function (memberId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/baddebt/baddebtaccountsofmember',
                params: {
                    memberId: Encrypt.encrypt(memberId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getFrequency = function (programId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/baddebt/freqOfProduct',
                params: {
                    productId: Encrypt.encrypt(programId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.editAccount = function (badDebtAccount) {
            console.log(badDebtAccount);
            return $http({
                method: 'POST',
                url: $rootScope.programsApiBaseUrl + 'account/baddebt/edit',
                data: badDebtAccount,
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getTransactions = function (accountId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/baddebt/transactions',
                params: {
                    accountId: Encrypt.encrypt(accountId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.deleteBadDebtAccount = function (accountId) {
            return $http({
                method: 'DELETE',
                url: $rootScope.programsApiBaseUrl + 'account/baddebt/delete',
                params: {
                    id: Encrypt.encrypt(accountId)
                },
                headers: $rootScope.headersWithLog
            });
        }
    }
]);