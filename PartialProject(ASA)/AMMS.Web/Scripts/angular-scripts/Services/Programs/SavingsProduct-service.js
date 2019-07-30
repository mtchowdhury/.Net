ammsAng.service('savingsProductService', [
    '$http', '$rootScope', function($http, $rootScope) {
        this.headers = $rootScope.headersWithLog;
        this.noLogHeaders = $rootScope.headersWithoutLog;

        this.getAll = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/savingsproduct/',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.add = function (ammsSavingsProduct) {
            console.log($rootScope.headersWithLog);
            return $http({
                method: 'POST',
                url: $rootScope.programsApiBaseUrl + 'configuration/savingsproduct/add',
                data: ammsSavingsProduct,
                headers: $rootScope.headersWithLog
                
            });
        };

        this.edit = function (ammsSavingsProduct) {
            return $http({
                method: 'POST',
                url: $rootScope.programsApiBaseUrl + 'configuration/savingsproduct/edit',
                data: ammsSavingsProduct,
                headers: $rootScope.headersWithLog
            });
        };

        this.delete = function(id) {
            return $http({
                method: 'DELETE',
                url: $rootScope.programsApiBaseUrl + 'configuration/savingsproduct/delete',
                params: {
                    id: Encrypt.encrypt(id)
                },
                headers: $rootScope.headersWithLog
            });
        };

        this.getSavingsProductFilterData = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/savingsproduct/filters',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getSavingsProductInfo = function(id) {
            return $http({
                method: 'GET',
                params : {
                    productId:Encrypt.encrypt(id)
                },
                url: $rootScope.programsApiBaseUrl + 'configuration/savingsproduct/productdetails',
                headers: $rootScope.headersWithoutLog
            });
        }


       
        //upor porjonto  new lagbei

        this.getRoles = function () {
            return $http({
                method: 'GET',
                url: $rootScope.commonApiBaseUrl + 'filters/organizational/roles',                
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getProductCategoryName = function (pcId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/productcategorybyid',
                params: {
                    productCategoryId: Encrypt.encrypt(pcId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };


        this.getProductTypes = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/loanproducttypes',
                headers: $rootScope.headersWithoutLog
            });
        };
        this.getProductCategoryByProductType=function(typeId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/productcategory',
                params: {
                    productTypeId: Encrypt.encrypt(typeId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }

        this.getInstallmentfrequency = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/installmentfrequency',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getProductScheme = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/scheme',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getDuration = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/duration',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getFunds = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/funds',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getConfigValuesByName = function (name) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/getConfigvaluesbyname',
                params: {
                    name: Encrypt.encrypt(name)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getRepaymentStrategy = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/repaymentstrategy', 
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getSubcodes = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/subcodes',
                headers: $rootScope.headersWithoutLog
            });
        };

        

        this.getProductInfo = function(productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/getProductDetails',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
                headers: $rootScope.headersWithoutLog
            });
        }
    }
]);