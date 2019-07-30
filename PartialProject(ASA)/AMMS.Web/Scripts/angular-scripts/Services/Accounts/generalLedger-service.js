ammsAng.service('generalLedgerService', ['$http', '$rootScope', function ($http, $rootScope) {

    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;
   
    this.getGeneralLedgerBranchLeafLevel = function (filterParams) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'generalLedger/branchleaflevel',
            headers: this.headers,
            data: filterParams
        });
    };
    
    this.getGeneralLedgerBranchLeafSplitMonthly = function (filterParams) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'generalLedger/branchleaflevelsplitmonthly',
            headers: this.headers,
            data: filterParams
        });
    };

    this.getGeneralLedgerBranchParentLevel = function (filterParams) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'generalLedger/branchparentlevel',
            headers: this.headers,
            data: filterParams
        });
    };
    
    this.getGeneralLedgerBranchParentLevelSplitMonthly = function (filterParams) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'generalLedger/branchparentlevelsplitmonthly',
            headers: this.headers,
            data: filterParams
        });
    };

    
    this.getIncomeExpenseReport = function (filterParams) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'generalLedger/incomeexpense',
            headers: this.headers,
            data: filterParams
        });
    };
    this.getExpenseReport = function (filterParams) {
        return $http({
            method: 'POST',
            url: $rootScope.accountsApiBaseUrl + 'generalLedger/expense',
            headers: this.headers,
            data: filterParams
        });
    };

    



    this.getGJFilterData = function () {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/getListPageFilterData',
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getDistrictsByZoneId = function (zoneId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/getDistrictsByZoneId',
            params: {
                zoneId:  Encrypt.encrypt(zoneId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getRegionsByDistrictId = function (districtId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/getRegionsByDistrictId',
            params: {
                districtId: Encrypt.encrypt(districtId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getBranchesByRegionId = function (regionId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/getBranchesByRegionId',
            params: {
                regionId: Encrypt.encrypt(regionId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getVoucherList = function (filter) {
        return $http({
            method: 'POST',
            //params: {
            //    filterValues: Encrypt.encrypt(filter)
            //},
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/getVouchers',
            data: filter,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getAddPageFilterData = function () {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/getAddPageFilterData',
            
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getCashBankFilterData = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/getCashBankFilterData',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.loadDistrictwiseBranches = function (districtId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/loadDistrictwiseBranches',
            params: {
                districtId: Encrypt.encrypt(districtId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getPreLoadedAccountHeads=function(type,branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/getPreLoadedAccountHeads',
            params: {
                type: Encrypt.encrypt(type),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }


    this.addGeneralJournal = function (voucher) {
        return $http({
            method: 'POST',
            //params: {
            //    filterValues: Encrypt.encrypt(filter)
            //},
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/add',
            data: voucher,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.editGeneralJournal = function (voucher) {
        return $http({
            method: 'POST',
            //params: {
            //    filterValues: Encrypt.encrypt(filter)
            //},
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/edit',
            data: voucher,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getVoucherById = function (voucherId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/getvoucherbyid',
            params: {
                voucherId: Encrypt.encrypt(voucherId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.deleteVoucher=function(voucherId,workingDate) {
        return $http({
            method: 'DELETE',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/deleteVoucherById',
            params: {
                voucherId: Encrypt.encrypt(voucherId),
                workingDate: Encrypt.encrypt(workingDate)
            },
            headers: $rootScope.headersWithoutLog

        });
    }
    this.getGlAccountById = function (glAccountId,branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/getGlAccountByGlAccountId',
            params: {
                accountId: Encrypt.encrypt(glAccountId),
                branchId: Encrypt.encrypt(branchId)
                
            },
            headers: $rootScope.headersWithoutLog

        });
    }
    this.getAdministrativeDistrictIdByBranchId = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/getAdministrativeDistrictIdByBranchId',
            params: {
                branchId: Encrypt.encrypt(branchId)

            },
            headers: $rootScope.headersWithoutLog

        });
    };

     this.postProcessJournal = function (branchId,workingDate, journamModule) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/processJournal',
            params: {
                branchId: Encrypt.encrypt(branchId),
                workingDate: Encrypt.encrypt(workingDate),
                journamModule: Encrypt.encrypt(journamModule)
            },
            headers: $rootScope.headersWithLog

        });
     };
     this.deletePreviousTransactions = function (branchId, workingDate) {
         return $http({
             method: 'Post',
             url: $rootScope.accountsApiBaseUrl + 'generalJournal/deleteJournals',
             params: {
                 branchId: Encrypt.encrypt(branchId),
                 workingDate: Encrypt.encrypt(workingDate)
                 
             },
             headers: $rootScope.headersWithLog

         });
     };

    this.getAllJournalModules = function (branchId, workingDate) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournal/processJournal/journalModules',
            params: {
                branchId: Encrypt.encrypt(branchId),
                workingDate: Encrypt.encrypt(workingDate)

            },
            headers: $rootScope.headersWithoutLog

        });
    };






}]);