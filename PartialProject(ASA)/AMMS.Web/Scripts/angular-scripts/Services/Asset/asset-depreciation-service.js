ammsAng.service('assetDepreciationService', [
    '$http', '$rootScope', function ($http, $rootScope) {
        this.headers = $rootScope.headersWithLog;
        this.noLogHeaders = $rootScope.headersWithoutLog;

        this.getAllAssetsOfBranch = function (branchId, roleId) {
            return $http({
                method: 'GET',
                url: $rootScope.assetApiBaseUrl + 'assetdepreciation/assets',
                params: {
                    branchId: Encrypt.encrypt(branchId),
                    roleId: Encrypt.encrypt(roleId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };
        
        this.getRollbackdepreciation = function (branchId, rollbackBy, rollbackOption) {
            return $http({
                method: 'GET',
                url: $rootScope.assetApiBaseUrl + 'assetdepreciation/rollback',
                params: {
                    branchId: Encrypt.encrypt(branchId),
                    rollbackBy: Encrypt.encrypt(rollbackBy),
                    rollbackOption: Encrypt.encrypt(rollbackOption)
                },
                headers: $rootScope.headersWithoutLog
            });
        };
        
        this.Depreciate = function (assetList) {
            return $http({
                method: 'POST',
                url: $rootScope.assetApiBaseUrl + 'assetdepreciation/rundepreciation',
                headers: this.headers,
                data: assetList
            });
        };

        this.RollbackDepreciate = function (assetList) {
            return $http({
                method: 'POST',
                url: $rootScope.assetApiBaseUrl + 'assetdepreciation/rollbackdepreciation',
                headers: this.headers,
                data: assetList
            });
        };

        this.GetFilters = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.assetApiBaseUrl + 'assetdepreciation/getfilters',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };
    }
]);