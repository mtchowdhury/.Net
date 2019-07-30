ammsAng.service('feeService', ['$rootScope', '$http', function ($rootScope, $http) {
    this.getFeeConfig = function (type) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'fee/fee/databytype',
            params: {
                type: Encrypt.encrypt(type)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getAll = function () {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'fee/fee/getAll',
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getByAppliesTo = function (type) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'fee/fee/getFeesByChargeType',
            params: {
                type: Encrypt.encrypt(type)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getByProduct = function (product) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'fee/fee/getFeesForLoanProduct',
            params: {
                productId: Encrypt.encrypt(product)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getBySavingsProduct = function (product) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'fee/fee/getFeesForSavingsProduct',
            params: {
                productId: Encrypt.encrypt(product)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.addFee = function (fee) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'fee/fee/add',
            data: fee,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.editFee = function (fee) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'fee/fee/edit',
            data: fee,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.delete = function (id) {
        return $http({
            method: 'DELETE',
            url: $rootScope.programsApiBaseUrl + 'fee/fee/delete',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithLog
        });
    };
    this.getFeeById = function (id) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'fee/fee/getbyid',
            params: {
                id: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithLog
        });
    };
}]);