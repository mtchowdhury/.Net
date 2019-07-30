ammsAng.service('paySalaryService', [
    '$http', '$rootScope', function ($http, $rootScope) {


        this.getEmployeePaidSalaryListByOfficeCode = function (officeCode) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeePaySalary/',
                params: {
                    officeCode: Encrypt.encrypt(officeCode)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getAllFilters = function () {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeePaySalary/getAllFilters',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getBankFilters = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeePaySalary/getBankFilters',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };
        this.getEmployerBankAccountFilters = function (officeCode) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeePaySalary/getEmployerBankAccountFilters',
                params: {
                    officeCode: Encrypt.encrypt(officeCode)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getRoleWiseBranchInfo = function (roleId, employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeePaySalary/getRoleWiseBranchInfo',
                params: {
                    roleId: Encrypt.encrypt(roleId),
                    employeeId: Encrypt.encrypt(employeeId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getEmployeeSalaryStructureInfo = function (transactionDate,employeeId, year, month, day) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeePaySalary/getEmployeeSalaryStructureInfo',
                params: {
                    transactionDate: Encrypt.encrypt(transactionDate),
                    employeeId: Encrypt.encrypt(employeeId),
                    year: Encrypt.encrypt(year),
                    month: Encrypt.encrypt(month),
                    day: Encrypt.encrypt(day)
                    },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getEmployeeBankAccountById = function (id) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeePaySalary/bankAccountNumberById',
                params: {
                    id: Encrypt.encrypt(id)
                },

                headers: $rootScope.headersWithoutLog
            });
        };


        this.getEmployeeTransferStatus = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employee/employeeTransfer/getEmployeeTransferStatus',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };



        this.addEmployeePaySalary = function (empPaySalary) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'employeePaySalary/add',
                headers: $rootScope.headersWithoutLog,
                data: empPaySalary
            });
        };

        this.editEmployeePaySalary = function (paySalary) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'employeePaySalary/edit',
                headers: $rootScope.headersWithoutLog,
                data: paySalary
            });
        };

        this.deleteEmployeePaySalary = function (paySalary) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'employeePaySalary/delete',
                headers: $rootScope.headersWithoutLog,
                data: paySalary
            });
        };

        this.deleteEmployeePaySalaryById = function (paySalary) {
            return $http({
                method: 'DELETE',
                url: $rootScope.hrmsApiBaseUrl + 'employeePaySalary/delete',
                params: {
                    paySalary: Encrypt.encrypt(paySalary)

                },
                headers: $rootScope.headersWithoutLog

            });
        };

    }
]);