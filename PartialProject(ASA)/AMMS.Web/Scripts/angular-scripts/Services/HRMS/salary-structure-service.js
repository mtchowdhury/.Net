ammsAng.service('salaryStructureService', [
    '$http', '$rootScope', function ($http, $rootScope) {


        this.getEmployeeSalaryStructureByOfficeCode = function (officeCode) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/',
                params: {
                    officeCode: Encrypt.encrypt(officeCode)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getEmployeeSalaryStructureByBranchId = function (officeCode) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/salaryStructures',
                params: {
                    officeCode: Encrypt.encrypt(officeCode)
                },
                headers: $rootScope.headersWithoutLog
            });
        };
        this.getBranchesByRole = function (officeCode,roleId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getBranchesByRoleAndBranch',
                params: {
                    officeCode: Encrypt.encrypt(officeCode),
                    roleId: Encrypt.encrypt(roleId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };


        //getEmployeeeSalaryStructureById




        this.getEmployeeSalaryStructureById = function (salaryStructureId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/getEmployeeeSalaryStructureById',
                params: {
                    salaryStructureId: Encrypt.encrypt(salaryStructureId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };

        this.getEmployeeByOfficeCode = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/employeeByBranch',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };

        this.getEmployeePermittedBranches = function (roleId, employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/permittedBranches',
                params: {
                    roleId: Encrypt.encrypt(roleId),
                    employeeId: Encrypt.encrypt(employeeId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };
        this.permittedBranchFilters = function (roleId, employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/permittedBranchFilters',
                params: {
                    roleId: Encrypt.encrypt(roleId),
                    employeeId: Encrypt.encrypt(employeeId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };


        this.getEmployeeAccountTypes = function (branchWorkingDate) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/employeeAccountTypes',
                params: {
                    branchWorkingDate: Encrypt.encrypt(branchWorkingDate)
                },

                headers: $rootScope.headersWithoutLog
            });
        };


        this.getEmployeeDeductionAccounttypes = function (branchWorkingDate) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/employeeDeductionAccountTypes',
                params: {
                    branchWorkingDate: Encrypt.encrypt(branchWorkingDate)
                },

                headers: $rootScope.headersWithoutLog
            });
        };

        this.getEmployeeDetails = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/employeeDetails',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };

        this.getAsaJoiningDate = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/getAsaJoiningDate',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };


        this.getEmployeeAccounts = function (salaryStructureId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/getEmployeeAccounts',
                params: {
                    salaryStructureId: Encrypt.encrypt(salaryStructureId),
                    employeeId: Encrypt.encrypt(employeeId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };



        this.getEmployeeActiveSalaryStructureId = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/getEmployeeActiveSalaryStructureId',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };

        this.hasActiveSalaryStructure = function (employeeId, today) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/isActiveSalaryStructureExist',
                params: {
                    employeeId: Encrypt.encrypt(employeeId),
                    today: Encrypt.encrypt(today)
                },

                headers: $rootScope.headersWithoutLog
            });
        };

        this.addEmployeeSalaryStructure = function (empSalaryStructure) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/add',
                headers: $rootScope.headersWithoutLog,
                data: empSalaryStructure
            });
        };

        this.editEmployeeSalaryStructure = function (salaryStructure) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/edit',
                headers: $rootScope.headersWithoutLog,
                data: salaryStructure
            });
        };

        this.deleteEmployeeSalaryStructure = function (empSalaryStructure) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/delete',
                headers: $rootScope.headersWithoutLog,
                data: empSalaryStructure
            });
        };

        this.deleteEmployeeSalaryStructureById = function (empSalaryStructure) {
            return $http({
                method: 'DELETE',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/delete',
                params: {
                    empSalaryStructure: Encrypt.encrypt(empSalaryStructure)

                },
                headers: $rootScope.headersWithoutLog

            });
        };

        this.getJoiningDate = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeSalaryStructure/getJoiningDate',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };

    }
]);