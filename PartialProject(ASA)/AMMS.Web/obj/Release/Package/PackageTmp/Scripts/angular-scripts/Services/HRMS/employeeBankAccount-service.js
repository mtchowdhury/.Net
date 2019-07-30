ammsAng.service('employeeBankAccountService', [
    '$http', '$rootScope', function ($http, $rootScope) {


        this.getEmployeeBankAccountsByOfficeCode = function (officeCode) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeBankAccount/',
                params: {
                    officeCode: Encrypt.encrypt(officeCode)
                },
                headers: $rootScope.headersWithoutLog
            });
        };


        this.getEmployeeBankAccountsById = function (id) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeBankAccount/accountById',
                params: {
                    id: Encrypt.encrypt(id)
                },
                
                headers: $rootScope.headersWithoutLog
            });
        };


        this.getEmployeeBankAccountsFilters = function (roleId,branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeBankAccount/filters',
                params: {
                    roleId: Encrypt.encrypt(roleId),
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };


        //this.getEmployeeBankAccounts = function(empBankAccount) {
        //    return $http({
        //        method: 'POST',
        //        url: $rootScope.hrmsApiBaseUrl + 'employeeBankAccount/',
        //        headers: $rootScope.headersWithoutLog,
        //        data: empBankAccount
        //    });
        //};

        this.addEmployeeBankAccounts = function(empBankAccount) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'employeeBankAccount/add',
                headers: $rootScope.headersWithoutLog,
                data: empBankAccount
            });
        };

        this.editEmployeeBankAccounts = function(empBankAccount) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'employeeBankAccount/edit',
                headers: $rootScope.headersWithoutLog,
                data: empBankAccount
            });
        };

        this.deleteEmployeeBankAccounts = function(empBankAccount) {
            return $http({
                method: 'DELETE',
                url: $rootScope.hrmsApiBaseUrl + 'employeeBankAccount/delete',
                headers: $rootScope.headersWithoutLog,
                data: empBankAccount
            });
        };

        this.deleteEmployeeBankAccountById = function (employeeBankAccount) {
            return $http({
                method: 'DELETE',
                url: $rootScope.hrmsApiBaseUrl + 'employeeBankAccount/delete',
                params: {
                    employeeBankAccount: Encrypt.encrypt(employeeBankAccount)
                    
                },
                headers: $rootScope.headersWithoutLog,
                
            });
        };


        this.getEmployeeOfficeCodeAndOfficeTypeByEmployeeId = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeBankAccount/employeeOfficeCodeAndType',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

    }
]);