ammsAng.service('employeeReleaseService', [
    '$http', '$rootScope', function($http, $rootScope) {


        this.getAllReleasableEmployee = function (officeCode) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'releaseEmployee/',
                params: {
                    officeCode: Encrypt.encrypt(officeCode)
                },
                headers: $rootScope.headersWithoutLog
            });
        };


        this.getEmployeeReleaseFilters = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'releaseEmployee/filters',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.releaseEmployee = function (rleasedEmployee) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'releaseEmployee/release',
                headers: $rootScope.headersWithoutLog,
                data:rleasedEmployee
            });
        };


        this.getEmployeeDetailsByEmployeeId = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'releaseEmployee/employeeDetails',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };


         this.getBranchName = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'releaseEmployee/branchName',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
         };

         this.cancelReleaseEmployee = function (releaseId, employeeId,cancelledBy) {
             return $http({
                 method: 'POST',
                 url: $rootScope.hrmsApiBaseUrl + 'releaseEmployee/cancelRelease',
                 params: {
                     releaseId: Encrypt.encrypt(releaseId),
                     employeeId: Encrypt.encrypt(employeeId),
                     cancelledBy: Encrypt.encrypt(cancelledBy)
                 },
                 headers: $rootScope.headersWithoutLog
             });
         };

         this.getEmployeeReleaseDetailsByEmployeeId = function (employeeId) {
             return $http({
                 method: 'GET',
                 url: $rootScope.hrmsApiBaseUrl + 'releaseEmployee/employeeReleaseDetails',
                 params: {
                     employeeId: Encrypt.encrypt(employeeId)
                 },
                 headers: $rootScope.headersWithoutLog
             });
         };


         this.getEmployeeReleaseIdByEmployeeId = function (employeeId) {
             return $http({
                 method: 'GET',
                 url: $rootScope.hrmsApiBaseUrl + 'releaseEmployee/employeeReleaseId',
                 params: {
                     employeeId: Encrypt.encrypt(employeeId)
                 },
                 headers: $rootScope.headersWithoutLog
             });
         };
         this.getEmployeeReleaseDateByEmployeeId = function (employeeId) {
             return $http({
                 method: 'GET',
                 url: $rootScope.hrmsApiBaseUrl + 'releaseEmployee/employeeReleaseDate',
                 params: {
                     employeeId: Encrypt.encrypt(employeeId)
                 },
                 headers: $rootScope.headersWithoutLog
             });
         };
         this.getEmployeeDetailsReport = function (empId,currentBranchId, branchId,currentWorkingDate) {
             return $http({
                 method: 'GET',
                 url: $rootScope.hrmsApiBaseUrl + 'releaseEmployee/employeedetailsreport',
                 params: {
                     empId: Encrypt.encrypt(empId),
                     currentBranchId: Encrypt.encrypt(currentBranchId),
                     branchId: Encrypt.encrypt(branchId),
                     currentWorkingDate: Encrypt.encrypt(currentWorkingDate)
                 },
                 headers: $rootScope.headersWithoutLog
             });
         }


    }]);