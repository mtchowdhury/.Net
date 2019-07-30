ammsAng.service('employeeTransferService', ['$rootScope', '$http', function ($rootScope, $http) {
    //this.getMembersOfGroup = function (groupId) {
    //    return $http({
    //        method: 'GET',
    //        url: $rootScope.programsApiBaseUrl + 'member/member/get',
    //        params: {
    //            groupId: Encrypt.encrypt(groupId)
    //        },
    //        headers: $rootScope.headersWithoutLog
    //    });
    //};

    this.getEmployeeListByBranchId = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/getEmployeelist',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };



    this.getFilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employeeTransfer/getAllFilters',
            headers: $rootScope.headersWithoutLog
        });
    };

    

    this.cancelTransfer = function (transferId) {
        return $http({
            method: 'DELETE',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employeeTransfer/delete',
            params: {
                transferId: Encrypt.encrypt(transferId)
                },
            headers: $rootScope.headersWithLog
        });
    }

    this.getCommands = function (propertyId) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'configuration/command/get',
            params: {
                propertyId: Encrypt.encrypt(propertyId),
                userId: Encrypt.encrypt($rootScope.user.UserId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.AddEmployeeTransfer = function (employeeTransfer) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employeeTransfer/add',
            headers: $rootScope.headersWithLog,
            data: employeeTransfer
        });
    };

    this.EditEmployeeTransfer = function (employeeTransfer) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employeeTransfer/edit',
            headers: $rootScope.headersWithLog,
            data: employeeTransfer
        });
    };

    this.getTransferEmployees = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employeeTransfer/getAllEmployeeTransfer',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getReceiveEmployees = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employeeTransfer/getAllEmployeeReceive',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.ReceiveEmployeeTransfer = function (id,branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employeeTransfer/receive',
            params: {
                employeeTransferid: Encrypt.encrypt(id),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.RejectEmployeeTransfer = function (id) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employeeTransfer/reject',
            params: {
                employeeTransferid: Encrypt.encrypt(id)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
}]);