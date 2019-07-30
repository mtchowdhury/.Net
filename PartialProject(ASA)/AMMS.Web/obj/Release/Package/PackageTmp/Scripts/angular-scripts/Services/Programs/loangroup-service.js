ammsAng.service('loanGroupService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.getloanGroups = function () {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'group/group',
            headers: this.noLogHeaders
        });
    };

    this.getGroupsB = function (programOfficerId, groupTypeId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'group/group/getgroups',
            params: {
                programOfficerId: Encrypt.encrypt(programOfficerId),
                groupTypeId: Encrypt.encrypt(groupTypeId)
            },
            headers: this.noLogHeaders
        });
    };

    this.getloanGroup = function (groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'group/group/groupdetails',
            params: {
                groupId: Encrypt.encrypt(groupId)
            },
            headers: this.noLogHeaders
        });
    };

    this.getDetails = function (groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'group/group/details',
            params: {
                groupId: Encrypt.encrypt(groupId)
            },
            headers: this.noLogHeaders
        });
    };
    this.getGroupsWithType = function (programOfficerId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'group/group/groupwithtype',
            params: {
                programOfficerId: Encrypt.encrypt(programOfficerId)
            },
            headers: this.noLogHeaders
        });
    };
    
    this.getGroupsByProgamOfficerAndGroupType = function (programOfficerId, fromGroup) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'group/group/groupbyloandtype',
            params: {
                programOfficerId: Encrypt.encrypt(programOfficerId),
                fromGroupId: Encrypt.encrypt(fromGroup)
            },
            headers: this.noLogHeaders
        });
    };

    this.postLoanGroup = function (group) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'group/group/add',
            headers: this.headers,
            data: group
        });
    };

    this.updateloanGroup = function (group) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'group/group/update',
            headers: this.headers,
            data: group
        });
    };

    this.mergeloanGroup = function (data1) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'group/group/merge',
            headers: this.headers,
            data: data1
        });
    };

    this.splitloanGroup = function (data1) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'group/group/split',
            headers: this.headers,
            data: data1
        });
    };

    this.MoveloanGroup = function (moveGroup) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'group/group/move',
            headers: this.headers,
            data: moveGroup
        });
    };

    this.deleteloanGroup = function (groupId) {
        return $http({
            method: 'DELETE',
            url: $rootScope.programsApiBaseUrl + 'group/group/delete',
            params: {
                groupId: Encrypt.encrypt(groupId)
            },
            headers: this.headers
        });
    }

    this.getExistingGroupNonEditableOptions = function (groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'group/group/GetExistingGroupNonEditableOptions',
            params: {
                groupId: Encrypt.encrypt(groupId)
            },
            headers: this.noLogHeaders
        });
    }

    this.interchangeGroups = function (interchangeGroup) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'group/group/interchange',
            headers: this.headers,
            data: interchangeGroup
        });
    }
    this.getDepositableAmounts = function (savingsType) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'group/group/getdepositableamount',
            params: {
                savingsType: Encrypt.encrypt(savingsType)
            },
            headers: this.noLogHeaders
        });
    }
    this.getGroupMeetingDayChangeLogs = function (groupIds) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'group/group/getmeetingdaychangelog',
            data: groupIds,
            headers: this.noLogHeaders
        });
    }
    this.changeMeetingDay = function (logObject) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'group/group/changemeetingday',
            data: logObject,
            headers: this.noLogHeaders
        });
    }
    this.getWeeklyHolidayListOfTheYear=function(year) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'group/group/weeklyholidaylistOftheyear',
            params: {
                year: Encrypt.encrypt(year)
            },
            headers: this.noLogHeaders
        });
    }
    this.getGroupMovementHistoryByGroupId=function(groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'group/group/getMovementHistory',
            params: {
                groupId: Encrypt.encrypt(groupId)
            },
            headers:this.noLogHeaders
        });
    }
    
}]);