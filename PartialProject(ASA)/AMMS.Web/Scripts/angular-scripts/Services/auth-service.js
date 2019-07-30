(function () {
    'use strict';

    ammsAng.factory('authService', authService);

    authService.$inject = ['$http', '$rootScope'];

    function authService($http,$rootScope) {
        var service = {
            get: get
        };

        return service;

        function get() {
            return $http({
                method: 'Post',
                url: $rootScope.locationStr+'/Auth/Get'
            });
        }
    }
})();