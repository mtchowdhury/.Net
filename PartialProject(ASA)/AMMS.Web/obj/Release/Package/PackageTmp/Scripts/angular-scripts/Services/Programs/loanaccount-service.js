ammsAng.service('loanaccountService', [
    '$http', '$rootScope', function ($http, $rootScope) {
        this.headers = $rootScope.headersWithLog;
        this.noLogHeaders = $rootScope.headersWithoutLog;

        this.getProducts = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/productsandcategories',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getProductsByMemberBranch = function (memberId, branchId, disburseDate, editId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/productsandcategoriesByMemberBranch',
                params: {
                    memberId: Encrypt.encrypt(memberId),
                    branchId: Encrypt.encrypt(branchId),
                    disburseDate: Encrypt.encrypt(disburseDate),
                    editId: Encrypt.encrypt(editId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getSubcodes = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/subcodesofproduct',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getFunds = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/fundsofproduct',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getDurations = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/durationsofproduct',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getInstallments = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/installmentsofproduct',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };


        this.getCycleOfMemberProduct = function (memberId, productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/member/loanCycle',
                params: {
                    memberId: Encrypt.encrypt(memberId),
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog

            });
        }
        
        this.getReceiveInfo = function (accountId, branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/member/getreceiveinfo',
                params: {
                    accountId: Encrypt.encrypt(accountId),
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog

            });
        }

        this.getGracePeriods = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/graceperiodsofproduct',
                params: {
                    productId: Encrypt.encrypt(productId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };


        this.getSchemes = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/schemesofproduct',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getBankAccounts = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/bankaccountsofbranch',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }


        this.getFiltersByProduct = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/loanaccountfilters',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getSupplimentaryAvailability = function (memberId, productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/getSupplimentaryAvailability',
                params: {
                    memberId: Encrypt.encrypt(memberId),
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getSpecificProductGracePeriods = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/productsecificgraceperiod',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getLoanAccounts = function (memberId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/loanaccountsofmember',
                params: {
                    memberId: Encrypt.encrypt(memberId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getBadDebtAccounts = function (memberId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/baddebtaccountsofmember',
                params: {
                    memberId: Encrypt.encrypt(memberId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }


        this.getPrimaryLoanAccountFromSavingsAccount = function (savingsAccountId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/primaryloanofmember',
                params: {
                    savingsAccountId: Encrypt.encrypt(savingsAccountId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getProductrates = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/product/rates',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getProductTenures = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/product/tenures',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getProductDurations = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/product/durations',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getProductGracePeriods = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/product/graceperiods',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

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
                url: $rootScope.programsApiBaseUrl + 'account/loan/product',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getSchedules = function (rate, principal, installmentAmount, numberOfIstallment, disburseDate, gracePeriod, installmentFrequencyId, groupId, branchId, isSync, productId, accountId, duration, memberId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/scheduleByDecline',
                params: {
                    rate: Encrypt.encrypt(rate),
                    principal: Encrypt.encrypt(principal),
                    installmentAmount: Encrypt.encrypt(installmentAmount),
                    numberOfIstallment: Encrypt.encrypt(numberOfIstallment),
                    disburseDate: Encrypt.encrypt(disburseDate),
                    gracePeriod: Encrypt.encrypt(gracePeriod),
                    installmentFrequency: Encrypt.encrypt(installmentFrequencyId),
                    GroupId: Encrypt.encrypt(groupId),
                    branchId: Encrypt.encrypt(branchId),
                    isSync: Encrypt.encrypt(isSync),
                    productId: Encrypt.encrypt(productId),
                    accountId: Encrypt.encrypt(accountId),
                    duration: Encrypt.encrypt(duration),
                    memberId: Encrypt.encrypt(memberId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getReSchedules = function (rate, principal, installmentAmount, numberOfIstallment, disburseDate, gracePeriod, installmentFrequencyId, groupId, branchId, isSync, productId, accountId, duration, memberId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/rescheduleByDecline',
                params: {
                    rate: Encrypt.encrypt(rate),
                    principal: Encrypt.encrypt(principal),
                    installmentAmount: Encrypt.encrypt(installmentAmount),
                    numberOfIstallment: Encrypt.encrypt(numberOfIstallment),
                    disburseDate: Encrypt.encrypt(disburseDate),
                    gracePeriod: Encrypt.encrypt(gracePeriod),
                    installmentFrequency: Encrypt.encrypt(installmentFrequencyId),
                    GroupId: Encrypt.encrypt(groupId),
                    branchId: Encrypt.encrypt(branchId),
                    isSync: Encrypt.encrypt(isSync),
                    productId: Encrypt.encrypt(productId),
                    accountId: Encrypt.encrypt(accountId),
                    duration: Encrypt.encrypt(duration),
                    memberId: Encrypt.encrypt(memberId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.addLoanAccount = function (ammsLoanAccount) {
            return $http({
                method: 'POST',
                url: $rootScope.programsApiBaseUrl + 'account/loan/add',
                data: ammsLoanAccount,
                headers: $rootScope.headersWithLog
            });
        };

        this.getLoanAccount = function (accountId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/getAccountDetails',
                params: {
                    accountId: Encrypt.encrypt(accountId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.editLoanAccount = function (ammsLoanAccount) {
            return $http({
                method: 'POST',
                url: $rootScope.programsApiBaseUrl + 'account/loan/edit',
                data: ammsLoanAccount,
                headers: $rootScope.headersWithLog
            });
        }

        this.deleteLoanAccount = function (accountId) {
            return $http({
                method: 'DELETE',
                url: $rootScope.programsApiBaseUrl + 'account/loan/delete',
                params: {
                    id: Encrypt.encrypt(accountId)
                },
                headers: $rootScope.headersWithLog
            });
        }
        this.getApplicableListOfExcessRealizedServiceChargeByBranch = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/excessrealizedservicecharge',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }
        this.GetAllowanceAmount = function (memberId, deathDate, closeDate) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'account/loan/getallowanceamount',
                params: {
                    memberId: Encrypt.encrypt(memberId),
                    deathDate: Encrypt.encrypt(deathDate),
                    closeDate: Encrypt.encrypt(closeDate)
                },
                headers: $rootScope.headersWithoutLog
            });
        }
        this.excessRealizedServiceChargePayment=function(data) {
            return $http({
                method: 'POST',
                url: $rootScope.programsApiBaseUrl + 'account/loan/excessrealizedservicechargepayment',
                data: data,
                headers: $rootScope.headersWithLog
            });
        }
    }
]);