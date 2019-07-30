ammsAng.service('employeeAccountService', ['$http', '$rootScope', function ($http, $rootScope) {

    this.getListpageFilterData = function () {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/getlistpagefilterdata',
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getBranchesByOfficeTypeId = function (officeTypeId,roleId,branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/getBranchelist',
            params: {
                officeTypeId: Encrypt.encrypt(officeTypeId),
                roleId: Encrypt.encrypt(roleId),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
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
    this.getAccountList = function (branchId,employeeId, accountTypeId, statusId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/getAccountList',
            params: {
                branchId: Encrypt.encrypt(branchId),
                employeeId: Encrypt.encrypt(employeeId),
                accountTypeId: Encrypt.encrypt(accountTypeId),
                statusId: Encrypt.encrypt(statusId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
    this.deleteAccountById = function (employeeAccountId,workingDate,roleId) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/delete',
            params: {
                employeeAccountId: Encrypt.encrypt(employeeAccountId),
                workingDate: Encrypt.encrypt(workingDate),
                roleId: Encrypt.encrypt(roleId)
    },
            headers: $rootScope.headersWithLog
        });
    }
    this.getFilterData = function (employeeId, roleId, branchId, isEdit) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/getFilterData',
            params: {
                employeeId: Encrypt.encrypt(employeeId),
                roleId: Encrypt.encrypt(roleId),
                branchId: Encrypt.encrypt(branchId),
                isEdit: Encrypt.encrypt(isEdit)
               },
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getEmployeeAccountCycleCount = function (employeeId,accountTypeId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/getAccountCycleCount',
            params: {
                employeeId: Encrypt.encrypt(employeeId),
                accountTypeId: Encrypt.encrypt(accountTypeId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
    this.addEmployeeAccount = function (eaccount) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/addEmployeeAccount',
            headers: $rootScope.headersWithLog,
            data: eaccount
        });
    };
    this.editEmployeeAccount = function (eaccount) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/editEmployeeAccount',
            headers: $rootScope.headersWithLog,
            data: eaccount
        });
    };
    this.getEmployeeAccountById = function (eaccountId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/getEmployeeAccountById',
            params: {
                eaccountId: Encrypt.encrypt(eaccountId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getEmployeeIdByEmployeeId = function (employeeId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/getEmployeeIdByEmployeeId',
            params: {
                employeeId: Encrypt.encrypt(employeeId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getEmployeeBankcAccounts = function (employeeId,fromEdit) {
       return $http({
           method: 'GET',
           url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/getEmployeeBankAccounts',
           params: {
               employeeId: Encrypt.encrypt(employeeId),
               fromEdit: Encrypt.encrypt(fromEdit)
           },
           headers: $rootScope.headersWithoutLog
       });
    }

    this.getSelectedOfficeTypeIdByBranchId = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/getSelectedOfficeTypeIdByBranchId',
            params: {
                branchId: Encrypt.encrypt(branchId)
               
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    

    
}]);