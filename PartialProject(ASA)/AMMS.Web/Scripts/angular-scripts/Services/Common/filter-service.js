ammsAng.service('filterService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.user = $rootScope.user;
    this.getThanasOfDistrict = function (districtId) {

        console.log(districtId);
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/thanasofdistrict',
            headers: $rootScope.headersWithoutLog,
            params: {
                districtId: Encrypt.encrypt(districtId)
            }
        });
    }

    this.getDesignationsByGradeId = function (gradeId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/designationsbygradeid',
            headers: $rootScope.headersWithoutLog,
            params: {
                gradeId: Encrypt.encrypt(gradeId)
            }
        });
    }

    this.getAsaDistrictsOfZone = function (zoneId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/asadistrictsofzone',
            headers: $rootScope.headersWithoutLog,
            params: {
                zoneId: Encrypt.encrypt(zoneId)
            }
        });
    }

    this.getRegionsOfAsaDistrict = function (asaDistrictId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/regionsofasadistrict',
            headers: $rootScope.headersWithoutLog,
            params: {
                asaDistrictId: Encrypt.encrypt(asaDistrictId)
            }
        });
    }

    this.getBranchesOfRegion = function (regionId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/branchesofregion',
            headers: $rootScope.headersWithoutLog,
            params: {
                regionId: Encrypt.encrypt(regionId)
            }
        });
    }

    this.getAllAdministrativeDistricts = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/administrativedistricts',
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getAllPrograms = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/programs',
            headers: $rootScope.headersWithoutLog
        });
    },

    this.getOrganizationalFilterDataByType = function (type) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/organizational/databytype',
            headers: $rootScope.headersWithoutLog,
            params: {
                type: Encrypt.encrypt(type)
            }
        });
    }

    this.getTransactionFilterDataByType = function (type) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/transaction/databytype',
            headers: $rootScope.headersWithoutLog,
            params: {
                type: Encrypt.encrypt(type)
            }
        });
    }

    this.getProgramFilterDataByType = function (type) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/loanconfig/databytype',
            headers: $rootScope.headersWithoutLog,
            params: {
                type: Encrypt.encrypt(type)
            }
        });
    }

    this.searchEmployees = function (query) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/hrms/employees/search',
            headers: $rootScope.headersWithoutLog,
            params: {
                query: Encrypt.encrypt(query)
            }
        });
    }
    this.getModules = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/organizational/modules',
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getRoles = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/organizational/roles',
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getFormType = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/organizational/propertyformtypes',
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getCommands = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/organizational/commands',
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getProductNameByType = function (type) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/productnamesbytype',
            headers: $rootScope.headersWithoutLog,
            params: {
                type: Encrypt.encrypt(type)
            }
        });
    }

    this.getGroupsByProgramOfficer = function (programOfficerId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/groups',
            headers: $rootScope.headersWithoutLog,
            params: {
                programOfficerId: Encrypt.encrypt(programOfficerId)
            }
        });
    }

    this.getMembersByGroupId = function (groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/members',
            headers: $rootScope.headersWithoutLog,
            params: {
                groupId: Encrypt.encrypt(groupId)
            }
        });
    }

    this.getGroupsByBranchAndProgramOfficer = function (branchId, programOfficerId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/groupsbybranchprogramofficer',
            headers: $rootScope.headersWithoutLog,
            params: {
                programOfficerId: Encrypt.encrypt(programOfficerId),
                branchId: Encrypt.encrypt(branchId)
            }
        });
    }

    this.getGroupsByBranchAndProgramOfficerAndRole = function (branchId, programOfficerId, roleId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/groupsbybranchprogramofficerandrole',
            headers: $rootScope.headersWithoutLog,
            params: {
                programOfficerId: Encrypt.encrypt(programOfficerId),
                branchId: Encrypt.encrypt(branchId),
                roleId: Encrypt.encrypt(roleId)
            }
        });
    }
    this.getGroupsByBranchAndProgramOfficerAndRoleAndDate = function (branchId, programOfficerId,startDate,endDate) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/groupsbybranchprogramofficerandroleAndDate',
            headers: $rootScope.headersWithoutLog,
            params: {
                programOfficerId: Encrypt.encrypt(programOfficerId),
                branchId: Encrypt.encrypt(branchId),
                startDate: Encrypt.encrypt(startDate),
                endDate: Encrypt.encrypt(endDate)
               
            }
        });
    }

    this.getMembersByLoanOfficerAndGroupId = function (branchId, loanOfficer, groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/membersbyloanofficergroup',
            headers: $rootScope.headersWithoutLog,
            params: {
                branchId: Encrypt.encrypt(branchId),
                groupId: Encrypt.encrypt(groupId),
                loanOfficer: Encrypt.encrypt(loanOfficer)
            }
        });
    }

    this.getMembersByLoanOfficerAndGroupIdAndRole = function (branchId, loanOfficer, groupId, roleId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/membersbyloanofficergroupandrole',
            headers: $rootScope.headersWithoutLog,
            params: {
                branchId: Encrypt.encrypt(branchId),
                groupId: Encrypt.encrypt(groupId),
                loanOfficer: Encrypt.encrypt(loanOfficer),
                roleId: Encrypt.encrypt(roleId)
            }
        });
    }
    this.getMembersByLoanOfficerAndGroupIdAndRoleAndDate = function (branchId, loanOfficer, groupId, startDate, endDate) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/membersbyloanofficergroupandroleandDate',
            headers: $rootScope.headersWithoutLog,
            params: {
                branchId: Encrypt.encrypt(branchId),
                loanOfficer: Encrypt.encrypt(loanOfficer),
                groupId: Encrypt.encrypt(groupId),
                startDate: Encrypt.encrypt(startDate),
                endDate: Encrypt.encrypt(endDate)
            }
        });
    }


    this.getTransactionProcess = function (transactionProcess) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/transactionprocess',
            headers: $rootScope.headersWithoutLog,
            params: {
                transactionProcess: Encrypt.encrypt(transactionProcess)
            }
        });
    }
    this.getAllMeetingDay = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/meetingday',
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getGroupMeetingDay = function (groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/members',
            headers: $rootScope.headersWithoutLog,
            params: {
                groupId: Encrypt.encrypt(groupId)
            }
        });
    }
    this.GetActiveBankAccountListByBranch=function(branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/hrms/bankaccount/getactivebankaccountbybranch',
            headers: $rootScope.headersWithoutLog,
            params: {
                branchId: Encrypt.encrypt(branchId)
            }
        });
    }
}]);

