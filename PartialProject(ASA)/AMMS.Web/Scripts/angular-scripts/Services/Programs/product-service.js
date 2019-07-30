ammsAng.service('productService', [
    '$http', '$rootScope', function($http, $rootScope) {
        this.headers = $rootScope.headersWithLog;
        this.noLogHeaders = $rootScope.headersWithoutLog;

        this.getRoles = function () {
            return $http({
                method: 'GET',
                url: $rootScope.commonApiBaseUrl + 'filters/organizational/roles',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getAll = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/',
                headers: $rootScope.headersWithoutLog
            });
        };
        this.getLatestProducts = function (pId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/latestproducts',
                params: {
                    productId: Encrypt.encrypt(pId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        

        this.add = function (ammsLoanProduct) {
            console.log(ammsLoanProduct);
            return $http({
                method: 'POST',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/add',
                data: ammsLoanProduct,
                headers: $rootScope.headersWithLog
            });
        };

        this.edit = function (ammsLoanProduct) {
            return $http({
                method: 'POST',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/edit',
                data: ammsLoanProduct,
                headers: $rootScope.headersWithLog
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

        this.getSavingsProducts=function() {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/getallsavingsproduct',
                headers: $rootScope.headersWithoutLog
            });
        }
        this.getProductInstallmentfrequency = function (productId) {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/productinstallmentfrequency',
                params: {
                    productId: Encrypt.encrypt(productId)
                },
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
        this.getAllBranch = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/getallbranch',
                headers: $rootScope.headersWithoutLog
            });
        };

        this.delete = function(id) {
            return $http({
                method: 'DELETE',
                url: $rootScope.programsApiBaseUrl + 'configuration/product/delete',
                params: {
                    id: Encrypt.encrypt(id)
                },
                headers: $rootScope.headersWithLog
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

        this.getFees = function () {
            return $http({
                method: 'GET',
                url: $rootScope.programsApiBaseUrl + 'fee/fee/getAll',
                headers: $rootScope.headersWithoutLog
            });
        }
        
    }
]);