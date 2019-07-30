ammsAng.service('assetDisposalService', [
    '$http', '$rootScope', function ($http, $rootScope) {
        this.headers = $rootScope.headersWithLog;
        this.noLogHeaders = $rootScope.headersWithoutLog;
        this.GetAdditinalFilters = function (assetId) {
            return $http({
                method: 'GET',
                url: $rootScope.assetApiBaseUrl + 'disposal/getadditionalfilters',
                params: {
                    assetId:Encrypt.encrypt(assetId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };
        
        this.disposeAsset = function (asset) {
            return $http({
                method: 'POST',
                url: $rootScope.assetApiBaseUrl + 'disposal/dispose',
                data: asset,
                headers: $rootScope.headersWithLog
            });
        }
        this.reverseDisposalAsset=function(asset) {
            return $http({
                method: 'POST',
                url: $rootScope.assetApiBaseUrl + 'disposal/reversedispose',
                data: asset,
                headers: $rootScope.headersWithLog
            });
        }
        this.getWrittenDownValueByDisposalDate = function (assetId,disposalDate, currentWorkingDate) {
            return $http({
                method: 'GET',
                url: $rootScope.assetApiBaseUrl + 'disposal/writtendownvalue',
                params: {
                    assetId:Encrypt.encrypt(assetId),
                    disposalDate: Encrypt.encrypt(disposalDate),
                    currentWorkingDate:Encrypt.encrypt(currentWorkingDate)
                },
                headers: $rootScope.headersWithoutLog
            });
        }
        this.getDisposalByAssetId = function (assetId) {
            return $http({
                method: 'GET',
                url: $rootScope.assetApiBaseUrl + 'disposal/disposalbyassetid',
                params: {
                    assetId: Encrypt.encrypt(assetId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }
        
    }
]);