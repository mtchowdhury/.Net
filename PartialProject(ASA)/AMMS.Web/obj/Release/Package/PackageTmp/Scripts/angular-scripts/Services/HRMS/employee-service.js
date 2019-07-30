ammsAng.service('employeeService', ['$http', '$rootScope', function ($http, $rootScope) {

    this.getEmployees = function () {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getEmployee = function (employeeId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/details',
            params: {
                employeeId: Encrypt.encrypt(employeeId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getEmployeeShort = function (employeeId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/detailsShort',
            params: {
                employeeId: Encrypt.encrypt(employeeId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getEmployeeAccountTypeConfig = function () {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/accountTypeConfig',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.addAccountType = function (accountType) {
        console.log(accountType);
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/addAccountType',
            headers: $rootScope.headersWithLog,
            data: accountType
        });
    }

    this.getEmployeesWithBranchId = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/getByBranchId',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getAccountTypes = function (role, branch) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/getAccountTypes',
            params: {
                role: Encrypt.encrypt(role),
                branch: Encrypt.encrypt(branch)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getAccountTypeById = function (accountTypeId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/getAccountTypeById',
            params: {
                accountTypeId: Encrypt.encrypt(accountTypeId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
    this.editAccountType = function (accountType) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/editAccountType',
            headers: $rootScope.headersWithLog,
            data: accountType
        });
    };
    this.deleteAccountTypeById = function (accounTypeId) {
        return $http({
            method: 'DELETE',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/deleteAccountType',
            params: {
                accounTypeId: Encrypt.encrypt(accounTypeId)
            },
            headers: $rootScope.headersWithLog
        });
    }

    this.getEmployeeByUserId = function (userId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/detailsbyuserid',
            params: {
                userId: Encrypt.encrypt(userId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.postEmployee = function (employee) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/add',
            headers: $rootScope.headersWithLog,
            data: employee
        });
    };

    this.updateEmployee = function (employee) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/update',
            headers: $rootScope.headersWithLog,
            data: employee
        });
    };


    this.deleteEmployee = function (employeeId) {
        return $http({
            method: 'DELETE',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/delete',
            params: {
                employeeId: Encrypt.encrypt(employeeId)
            },
            headers: $rootScope.headersWithLog
        });
    }
    this.getExportReportResult = function (propertyId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'Export/GetExportReportResult',
            params: {
                propertyId: Encrypt.encrypt(propertyId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getProgramOfficerOfBranch = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'administration/branch/programofficers',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.searchEmployee = function (employeeListFull, searchArr, k) {
        var employeeList = [];
        if (searchArr[k].comparison === "equals") {
            for (var i = 0; i < employeeListFull.length; i++) {
                if ((employeeListFull[i][searchArr[k].filterColumnName] + '').toLowerCase() === searchArr[k].searchValue.toLowerCase()) {
                    employeeList.push(employeeListFull[i]);
                }
            }
        }

        if (searchArr[k].comparison === "notEquals") {
            for (var j = 0; j < employeeListFull.length; j++) {
                if ((employeeListFull[j][searchArr[k].filterColumnName] + '').toLowerCase() != searchArr[k].searchValue.toLowerCase()) {
                    employeeList.push(employeeListFull[j]);
                }
            }
        }
        if (searchArr[k].comparison === "contains") {
            for (var j = 0; j < employeeListFull.length; j++) {
                if ((employeeListFull[j][searchArr[k].filterColumnName] + '').toLowerCase().includes(searchArr[k].searchValue.toLowerCase())) {
                    employeeList.push(employeeListFull[j]);
                }
            }
        }
        if (searchArr[k].comparison === "notContains") {
            for (var j = 0; j < employeeListFull.length; j++) {
                if (!((employeeListFull[j][searchArr[k].filterColumnName] + '').toLowerCase().includes(searchArr[k].searchValue.toLowerCase()))) {
                    employeeList.push(employeeListFull[j]);
                }
            }
        }
        if (searchArr[k].comparison === "greaterThan") {
            for (var j = 0; j < employeeListFull.length; j++) {
                if ((employeeListFull[j][searchArr[k].filterColumnName] + '').toLowerCase() > (searchArr[k].searchValue.toLowerCase())) {
                    employeeList.push(employeeListFull[j]);
                }
            }
        }
        if (searchArr[k].comparison === "lessThan") {
            for (var j = 0; j < employeeListFull.length; j++) {
                if ((employeeListFull[j][searchArr[k].filterColumnName] + '').toLowerCase() < (searchArr[k].searchValue.toLowerCase())) {
                    employeeList.push(employeeListFull[j]);
                }
            }
        }
        if (searchArr[k].comparison === "startsWith") {
            for (var j = 0; j < employeeListFull.length; j++) {
                if ((employeeListFull[j][searchArr[k].filterColumnName] + '').toLowerCase().startsWith(searchArr[k].searchValue.toLowerCase())) {
                    employeeList.push(employeeListFull[j]);
                }
            }
        }
        if (searchArr[k].comparison === "endsWith") {
            for (var j = 0; j < employeeListFull.length; j++) {
                if ((employeeListFull[j][searchArr[k].filterColumnName] + '').toLowerCase().endsWith(searchArr[k].searchValue.toLowerCase())) {
                    employeeList.push(employeeListFull[j]);
                }
            }
        }
        if (searchArr[k].comparison === "isNull") {
            for (var j = 0; j < employeeListFull.length; j++) {
                if (!(employeeListFull[j][searchArr[k].filterColumnName])) {
                    employeeList.push(employeeListFull[j]);
                }
            }
        }
        if (searchArr[k].comparison === "isNotNull") {
            for (var j = 0; j < employeeListFull.length; j++) {
                if (employeeListFull[j][searchArr[k].filterColumnName]) {
                    employeeList.push(employeeListFull[j]);
                }
            }
        }
        return employeeList;
    };

    this.employeeAdvanceSearch = function (filterColumn1,
                    filterComparator1, filterValue1, filterColumn2, filterComparator2,
                    filterValue2, filterColumn3, filterComparator3, filterValue3, andOr1,
                    andOr2,fromInit) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'employee/employee/advancedsearch',
            params: {
                filterColumn1: Encrypt.encrypt(filterColumn1),
                filterComparator1: Encrypt.encrypt(filterComparator1),
                filterValue1: Encrypt.encrypt(filterValue1),
                filterColumn2: Encrypt.encrypt(filterColumn2),
                filterComparator2: Encrypt.encrypt(filterComparator2),
                filterValue2: Encrypt.encrypt(filterValue2),
                filterColumn3: Encrypt.encrypt(filterColumn3),
                filterComparator3: Encrypt.encrypt(filterComparator3),
                filterValue3: Encrypt.encrypt(filterValue3),
                andOr1: Encrypt.encrypt(andOr1),
                andOr2: Encrypt.encrypt(andOr2),
                fromInit: Encrypt.encrypt(fromInit)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getEmployeeEmailInfo = function (employeeId) {
        return $http({
            method: 'GET',
            url: $rootScope.masterdataApiBaseUrl + 'masterdata/authorization/user/getEmailInfo',
            params: {
                employeeId: EncryptForSpecialPurpose.encrypt(employeeId)
            }
            //headers: $rootScope.headersWithoutLog
        });
    };
}]);