ammsAng.service('memberService', ['$rootScope', '$http', function ($rootScope, $http) {
    this.getMembersOfGroup = function (groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'member/member/get',
            params: {
                groupId: Encrypt.encrypt(groupId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getMembersOfGroupByGroupId = function (groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'member/member/getData',
            params: {
                groupId: Encrypt.encrypt(groupId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getReplacableMembersByGroupId = function(groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'member/member/getReplacableMembersByGroupId',
            params: {
                groupId: Encrypt.encrypt(groupId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getMember = function (memberId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'member/member/details',
            params: {
                memberId: Encrypt.encrypt(memberId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };


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

    this.postMember = function (member) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'member/member/add',
            headers: $rootScope.headersWithLog,
            data: member
        });
    };

    this.updateMember = function (member) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'member/member/update',
            headers: $rootScope.headersWithLog,
            data: member
        });
    };

    this.updatePassBookNumber = function (members) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'member/member/updatePassBook',
            headers: $rootScope.headersWithLog,
            data: members
        });
    };

    this.deleteMember = function (memberId) {
        return $http({
            method: 'DELETE',
            url: $rootScope.programsApiBaseUrl + 'member/member/delete',
            params: {
                memberId: Encrypt.encrypt(memberId)
            },
            headers: $rootScope.headersWithLog
        });
    };

    this.getExportReportResult = function (propertyId) {
        return $http({
            method: 'GET',
            url: $rootScope.apiBaseUrl + 'Export/GetExportReportResult',
            params: {
                propertyId: Encrypt.encrypt(propertyId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getNewPassbookId = function (groupId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'member/member/getmaxpassbook',
            params: {
                groupId: Encrypt.encrypt(groupId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getAdministrativeDistrictByBranchId = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'member/member/administrativedistrictbybranchId',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };
    

    this.moveMember = function (member) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'member/member/move',
            headers: $rootScope.headersWithLog,
            data: member
        });
    };

    this.changeGroupTypeOfMember = function (memberId, newGroupId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'member/member/changeGroupType',
            headers: $rootScope.headersWithLog,
            params: {
                memberId: Encrypt.encrypt(memberId),
                newGroupId: Encrypt.encrypt(newGroupId)
            }
        });
    }

    this.getDateFromInt = function (dateStr) {
        if (!dateStr) return "";
        dateStr = dateStr.toString();
        var year = dateStr.substring(0, 4);
        var month = dateStr.substring(4, 6);
        var date = dateStr.substring(6, 8);
        var dateString = date + "/" + month + "/" + year;

        return dateString;
    };

    this.getDateStrFromAge = function (date, age) {
        return new Date(date.setFullYear(new Date().getFullYear() - age));
    }
    this.getMemberFees = function () {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'fee/fee/getmemberfees',
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getMemberMeetingDayChangeLogs = function (memberIds) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'member/member/getmeetingdaychangelog',
            data: memberIds,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.changeMeetingDay = function (logObject) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'member/member/changemeetingday',
            data: logObject,
            headers: $rootScope.headersWithoutLog
        });
    }

    this.replaceMember = function (replaceObject) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'member/member/replaceMember',
            data: replaceObject,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getMemberMovementHistoryByMemberId = function (memberId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'member/member/getMovementHistory',
            params: {
                memberId: Encrypt.encrypt(memberId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.memberNIDExistingValidation = function (memberId,nId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'member/member/duplicatenidmember',
            params: {
                memberId: Encrypt.encrypt(memberId),
                nId: Encrypt.encrypt(nId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }


    this.searchMemberByBranchId = function (lo, group,member,memberId,fh,nid,mobile,branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'member/member/searchMemberByBranchId',
            params: {
                memberId: Encrypt.encrypt(memberId),
                nid: Encrypt.encrypt(nid),
                lo: Encrypt.encrypt(lo),
                group: Encrypt.encrypt(group),
                member: Encrypt.encrypt(member),
                fh: Encrypt.encrypt(fh),
                mobile: Encrypt.encrypt(mobile),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
}]);