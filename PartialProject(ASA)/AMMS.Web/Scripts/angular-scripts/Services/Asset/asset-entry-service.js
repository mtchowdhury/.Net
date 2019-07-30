ammsAng.service('assetEntryService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.GetAll = function () {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/',
            headers: this.noLogHeaders
        });
    };
    this.Search = function (filterParams) {
        return $http({
            method: 'POST',
            url: $rootScope.assetApiBaseUrl + 'asset/getSearchResultFromSp',
            headers: this.headers,
            data: filterParams
        });
    };

    this.SearchTransaction = function (filterParams) {
        return $http({
            method: 'POST',
            url: $rootScope.assetApiBaseUrl + 'asset/getSearchTransaction',
            headers: this.headers,
            data: filterParams
        });
    };
    
    this.GetFilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/filters',
            headers: this.headers
        });
    };
        
    this.getAssettag = function (branchId, branchWorkingDate, itemId) {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/generateAssetId',
            params: {
                branchId: Encrypt.encrypt(branchId),
                branchWorkingDate: Encrypt.encrypt(branchWorkingDate),
                itemId: Encrypt.encrypt(itemId)
            },
            headers: this.headers
        });
    };

    this.categoryFilters = function (itemId) {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/categoryFiltersForEdit',
            params: {
                itemId: Encrypt.encrypt(itemId)
            },
            headers: this.headers
        });
    };

    this.categoryFilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/categoryFilters',
            headers: this.headers
        });
    };

    

    this.getVattaxInfo = function (itemtypeId, purchasingLevel, officeTypeId, fiscalYear, totalBillingPrice) {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/getVattaxInfo',
            params: {
                itemtypeId: Encrypt.encrypt(itemtypeId),
                purchasingLevel: Encrypt.encrypt(purchasingLevel),
                officeTypeId: Encrypt.encrypt(officeTypeId),
                fiscalYear: Encrypt.encrypt(fiscalYear),
                totalBillingPrice: Encrypt.encrypt(totalBillingPrice)
            },
            headers: this.headers
        });
    };
    
    this.GetAdditionalFilters = function (branchId,assetId) {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/getAdditionalFilters',
            params: {
                branchId: Encrypt.encrypt(branchId),
                assetId: Encrypt.encrypt(assetId)
            },
            headers: this.headers,
        });
    };

    this.GetAssetsOfBranch = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/branchasset',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: this.headers,
        });
    };

    this.add = function (ammsAssetItem) {
        return $http({
            method: 'POST',
            url: $rootScope.assetApiBaseUrl + 'asset/add',
            headers: this.headers,
            data: ammsAssetItem
        });
    };
    
    this.addAssetDocuments = function (assetDocuments) {
        return $http({
            method: 'POST',
            url: $rootScope.assetApiBaseUrl + 'asset/addassetdocuments',
            headers: this.headers,
            data: assetDocuments
        });
    }

    this.edit = function (ammsAssetItem) {
        return $http({
            method: 'POST',
            url: $rootScope.assetApiBaseUrl + 'asset/edit',
            headers: this.headers,
            data: ammsAssetItem
        });
    };

    this.getEmployeeByOfficeCode = function (officeCode) {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/employeebyofficecode',
            params: {
                officeCode: Encrypt.encrypt(officeCode)
            },
            headers: this.headers
        });
    };
    


    //this.getAssetCategoryDepriciation = function () {
    //    return $http({
    //        method: 'GET',
    //        url: 'http://localhost:54990/asset/itemtype/getAssetCategoryDepriciation',
    //        //url: $rootScope.assetApiBaseUrl + 'itemtype/getAssetCategoryDepriciation',
    //        headers: this.noLogHeaders
    //    });
    //};

    //this.getCategorynStatusList = function () {
    //    return $http({
    //        method: 'GET',
    //        url: 'http://localhost:54990/asset/itemtype/getCategorynStatusList',
    //        //url: $rootScope.assetApiBaseUrl + 'itemtype/getAssetCategoryDepriciation',
    //        headers: this.noLogHeaders
    //    });
    //};

    this.addItemType = function (itemType) {
        return $http({
            method: 'POST',
            url: $rootScope.assetApiBaseUrl + 'itemtype/addassetitem',
            headers: this.headers,
            data: itemType
        });
    };



    //this.getAssetItem = function (itemId) {
    //    return $http({
    //        method: 'GET',
    //        url: $rootScope.assetApiBaseUrl + 'itemtype/getAssetItem',
    //        params: {
    //            itemId: Encrypt.encrypt(itemId)
    //        },
    //        headers: this.noLogHeaders
    //    });
    //};

    //this.delete = function (itemId) {
    //    return $http({
    //        method: 'DELETE',
    //        url: $rootScope.assetApiBaseUrl + 'itemtype/deleteassetitem',
    //        params: {
    //            itemId: Encrypt.encrypt(itemId)
    //        },
    //        headers: this.headers
    //    });
    //};
    
    this.SearchAsset = function (data) {
        return $http({
            method: 'POST',
            url: $rootScope.assetApiBaseUrl + 'itemtype/addassetitem',
            headers: this.headers,
            data: data
        });
    };
    this.getAssetById = function (assetId) {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/getassetbyid',
            params: {
                assetId: Encrypt.encrypt(assetId)
            },
            headers: this.noLogHeaders
        });
    };

    this.delete = function (id) {
        return $http({
            method: 'DELETE',
            url: $rootScope.assetApiBaseUrl + 'asset/delete',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithLog
        });
    };

    
    this.GetOfficeList = function (roleId, employeeId) {
        return $http({
            method: 'GET',
            url: $rootScope.assetApiBaseUrl + 'asset/getOfficeList',
            params: {
                roleId: Encrypt.encrypt(roleId),
                employeeId: Encrypt.encrypt(employeeId)
            },
            headers: this.noLogHeaders
        });
    };

    this.getExportUrlForList = function (url, filterparams, fileName, apiKey, user) {
        return $rootScope.reportApiUrl + 'report/exportdatalist?url=' + Encrypt.encrypt(url) + '&filterparams=' + Encrypt.encrypt(filterparams) +
            '&fileName=' + Encrypt.encrypt(fileName) + '&apiKey=' + Encrypt.encrypt(apiKey) + '&user=' + Encrypt.encrypt(user);
    }

}]);