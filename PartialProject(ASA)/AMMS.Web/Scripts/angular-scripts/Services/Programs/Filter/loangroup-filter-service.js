ammsAng.service('loanGroupFilterService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.user = $rootScope.user;
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.getLoanGroupAddfilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/loangroups',
            headers: this.noLogHeaders
        });
    };

    this.getLoanGroupMergefilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/loanofficers',
            headers: this.noLogHeaders
        });
    }

    this.getGroups = function (programOfficerId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/groups',
            params: {
                programOfficerId: Encrypt.encrypt(programOfficerId)
            },
            headers: this.noLogHeaders
        });
    }

    this.getGroupTypesOfLoanOfficer = function (groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/grouptypes',
            params: {
                groupId: Encrypt.encrypt(groupId)
            },
            headers: this.noLogHeaders
        });
    }
    this.getAllGroupTypes = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/allgrouptypes',
            headers: this.noLogHeaders
        });
    }


    this.getGroupsByProgramOfficerAndGroupType = function (programOfficerId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/groupsbyprogramofficer',
            params: {
                programOfficerId: Encrypt.encrypt(programOfficerId)
            },
            headers: this.noLogHeaders
        });
    }
    this.getGroupsByProgramOfficerAndGroupTypeForReal = function (programOfficerId,groupType) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/groupsbyprogramofficerandgrouptype',
            params: {
                programOfficerId: Encrypt.encrypt(programOfficerId),
                groupTypeId: Encrypt.encrypt(groupType)
            },
            headers: this.noLogHeaders
        });
    }

    this.getMembersByGroupId = function (groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'member/member/memberwithprogramnamebygroup',
            params: {
                groupId: Encrypt.encrypt(groupId)
            },
            headers: this.noLogHeaders
        });
    }
}]);

