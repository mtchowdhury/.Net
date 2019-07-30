ammsAng.service('assetTransferReceiveService', [
    '$http', '$rootScope', function ($http, $rootScope) {
        this.headers = $rootScope.headersWithLog;
        this.noLogHeaders = $rootScope.headersWithoutLog;
        this.getTransferReceiveHistory = function (assetId) {
            return $http({
                method: 'GET',
                url: $rootScope.assetApiBaseUrl + 'transferreceive/gethistory',
                params: {
                    assetId: Encrypt.encrypt(assetId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };
        this.GetAdditinalFilters = function () {
            return $http({
                method: 'GET',
                url: $rootScope.assetApiBaseUrl + 'transferreceive/getadditionalfilters',
                //params: {
                //    assetId: Encrypt.encrypt(assetId)
                //},
                headers: $rootScope.headersWithoutLog
            });
        };
        this.transferAsset = function (asset) {
            return $http({
                method: 'POST',
                url: $rootScope.assetApiBaseUrl + 'transferreceive/transferasset',
                data: asset,
                headers: $rootScope.headersWithLog

            });
        }
        this.updateAssetTransfer = function (asset) {
            return $http({
                method: 'POST',
                url: $rootScope.assetApiBaseUrl + 'transferreceive/updateassettransfer',
                data: asset,
                headers: $rootScope.headersWithLog

            });
        }
        
        this.cancelTransferAsset = function (asset) {
            return $http({
                method: 'POST',
                url: $rootScope.assetApiBaseUrl + 'transferreceive/canceltransferasset',
                data: asset,
                headers: $rootScope.headersWithLog

            });
        }
        this.getReceivableAssetListOfTheBranch=function(branchId,workingDate) {
            return $http({
                method: 'GET',
                url: $rootScope.assetApiBaseUrl + 'transferreceive/getreceivableassetlistbybranch',
                params: {
                    branchId: Encrypt.encrypt(branchId),
                    workingDate: Encrypt.encrypt(workingDate)
                },
                headers: $rootScope.headersWithoutLog
            });
        }
        this.receiveAsset=function(asset) {
            return $http({
                method: 'POST',
                url: $rootScope.assetApiBaseUrl + 'transferreceive/receiveasset',
                data: asset,
                headers: $rootScope.headersWithLog

            });
        }
        this.rejectReceiveAsset=function(asset) {
            return $http({
                method: 'POST',
                url: $rootScope.assetApiBaseUrl + 'transferreceive/rejectreceiveasset',
                data: asset,
                headers: $rootScope.headersWithLog

            });
        }
        
    }
]);