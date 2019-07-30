ammsAng.service('employeeDesignationService', ['$http', '$rootScope', function ($http, $rootScope) {

    this.getemployeeDesignations = function (empDesignation) {
        return $http({
            method: 'post',
            url: $rootScope.hrmsApiBaseUrl + 'employeeDesignation/',
            headers: $rootScope.headersWithoutLog,
            data: empDesignation
        });
    };

    this.getemployeeDesignationFilters = function (roleId , branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employeeDesignation/filters',
            params: {
                roleId: Encrypt.encrypt(roleId),
                branchId: Encrypt.encrypt(branchId)
                    },
            headers: $rootScope.headersWithoutLog
        });
    };


    this.addEmployeeDesignation = function (employeeDesignation) {
        console.log(employeeDesignation); 

        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'employeeDesignation/add',
            headers: $rootScope.headersWithLog,
            data: employeeDesignation
        });
    };

    this.deleteemployeeDesignation = function (employeeDesignationId) {
        return $http({
            method: 'DELETE',
            url: $rootScope.hrmsApiBaseUrl + 'employeeDesignation/delete',
            params: {
                employeeDesignationId: Encrypt.encrypt(employeeDesignationId)
            },
            headers: $rootScope.headersWithLog
        });
    }

    this.editEmployeeDesignation = function (employeeDesignation) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'employeeDesignation/update',
            headers: $rootScope.headersWithLog,
            data: employeeDesignation
        });
    };

    //this.getemployeeDesignationByUserId = function (userId) {
    //    return $http({
    //        method: 'GET',
    //        url: $rootScope.hrmsApiBaseUrl + 'employeeDesignation/employeeDesignation/detailsbyuserid',
    //        params: {
    //            userId: Encrypt.encrypt(userId)
    //        },
    //        headers: $rootScope.headersWithoutLog
    //    });
    //};

   

   


    
    
}]);