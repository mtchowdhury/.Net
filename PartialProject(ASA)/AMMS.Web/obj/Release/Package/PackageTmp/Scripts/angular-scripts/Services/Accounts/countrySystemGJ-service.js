ammsAng.service('countrySystemGJService', ['$http', '$rootScope', function ($http, $rootScope) {


    this.getGJFilterData = function () {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/getListPageFilterData',
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getDistrictsByZoneId = function (zoneId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/getDistrictsByZoneId',
            params: {
                zoneId: Encrypt.encrypt(zoneId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getRegionsByDistrictId = function (districtId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/getRegionsByDistrictId',
            params: {
                districtId: Encrypt.encrypt(districtId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getBranchesByRegionId = function (regionId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/getBranchesByRegionId',
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
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/getVouchers',
            data: filter,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getAddPageFilterData = function () {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/getAddPageFilterData',
            headers: $rootScope.headersWithoutLog
        });
    }
    this.loadDistrictwiseBranches = function (districtId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/loadDistrictwiseBranches',
            params: {
                districtId: Encrypt.encrypt(districtId)
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
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/add',
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
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/edit',
            data: voucher,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getVoucherById = function (voucherId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/getvoucherbyid',
            params: {
                voucherId: Encrypt.encrypt(voucherId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.deleteVoucher = function (voucherId, workingDate) {
        return $http({
            method: 'DELETE',
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/deleteVoucherById',
            params: {
                voucherId: Encrypt.encrypt(voucherId),
                workingDate: Encrypt.encrypt(workingDate)
            },
            headers: $rootScope.headersWithoutLog

        });
    }
    this.getGlAccountById = function (glAccountId, branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/getGlAccountByGlAccountId',
            params: {
                accountId: Encrypt.encrypt(glAccountId),
                branchId: Encrypt.encrypt(branchId)

            },
            headers: $rootScope.headersWithoutLog

        });
    }
    this.getGlAccountByCode = function (glAccountCode) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/getGlAccountByGlAccountCode',
            params: {
                accountCode: Encrypt.encrypt(glAccountCode)

            },
            headers: $rootScope.headersWithoutLog

        });
    }
    this.getAdministrativeDistrictIdByBranchId = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.accountsApiBaseUrl + 'generalJournalCountry/getAdministrativeDistrictIdByBranchId',
            params: {
                branchId: Encrypt.encrypt(branchId)

            },
            headers: $rootScope.headersWithoutLog

        });
    }

}]);