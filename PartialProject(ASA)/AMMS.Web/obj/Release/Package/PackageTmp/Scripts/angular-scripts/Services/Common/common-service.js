ammsAng.service('commonService', ['$http', '$timeout', '$rootScope', function ($http, $timeout, $rootScope) {
    this.user = $rootScope.user;

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

    this.swalHeaders = function (text, type) {
        return {
            title: "Confirm?",
            text: text,
            type: type,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
            showCancelButton: true
        }
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
    }

    this.intToDate = function(dateInInt) {
        var a = moment(dateInInt.toString().slice(0, 8)).format('DD-MM-YYYY');

        return a;
    }
    this.dateToInt = function (date) {
        var dateInDate = new Date(date);
        var day = dateInDate.getDate();
        var month = dateInDate.getMonth() + 1;
        var year = dateInDate.getFullYear();
        if (day.toString().length === 1) {
            day = '0' + day;
        }
        if (month.toString().length === 1) {
            month = '0' + month;
        }
        var dateInInt = year.toString().concat(month.toString());
        dateInInt = dateInInt.concat(day.toString());
        dateInInt = dateInInt.concat('000000');
        var intDate = parseInt(dateInInt);
        return intDate;
    }
    this.getServerDateTime=function() {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/organizational/serverDateTime',
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getBranchCurrentWorkingDateById=function(branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/organizational/branchworkingdatebyid',
            params: {
                branchId:Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.IsMemberInTransferTransitState = function (memberId, branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'transfergroup/IsMemberInTransferTransitState',
            params: {
                memberId: Encrypt.encrypt(memberId),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: this.noLogHeaders
        });
    }

    this.clearAndCloseTab = function () {
       
        $timeout(function () {
            $('#saveComplete').modal('hide');
            $('.modal-backdrop').remove();
        }, 500);
       
    };
    this.getBranchesByRoleAndBranch = function (branchId, roleId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/branchesbyrole',
            params: {
                branchId: Encrypt.encrypt(branchId),
                roleId: Encrypt.encrypt(roleId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getEmployeeFilterFromSP = function (branchId, roleId, employeeId, onlyActive, startDate, endDate) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/hrms/employees/getemployeefilter',
            params: {
                branchId: Encrypt.encrypt(branchId),
                roleId: Encrypt.encrypt(roleId),
                employeeId: Encrypt.encrypt(employeeId),
                onlyActive: Encrypt.encrypt(onlyActive),
                startDate: Encrypt.encrypt(startDate),
                endDate: Encrypt.encrypt(endDate)

            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getEmployeeFilterFromReportGeneralSP = function (branchId,employeeId,startDate,endDate) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/hrms/employees/getemployeefilterForReport',
            params: {
                branchId: Encrypt.encrypt(branchId),
                employeeId: Encrypt.encrypt(employeeId),
                startDate: Encrypt.encrypt(startDate),
                endDate: Encrypt.encrypt(endDate)

            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getPOFilter = function (branchId, roleId, employeeId, onlyActive) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/pobybranch',
            params: {
                branchId: Encrypt.encrypt(branchId),
                roleId: Encrypt.encrypt(roleId),
                employeeId: Encrypt.encrypt(employeeId),
                onlyActive: Encrypt.encrypt(onlyActive)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getGroupsByProgramOfficer=function(lo,onlyActive) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/groupsbylo',
            params: {
                lo: Encrypt.encrypt(lo),
                onlyActive: Encrypt.encrypt(onlyActive)
            },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getMembersByGroup = function (groupId,onlyActive) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/membersbygroup',
            params: {
                groupId: Encrypt.encrypt(groupId),
                onlyActive: Encrypt.encrypt(onlyActive)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.getExportUrl = function (url, filterparams, fileName) {
        console.log($rootScope.user);
        return $rootScope.reportApiUrl + 'report/exportdatalist?url=' + Encrypt.encrypt(url) + '&filterparams=' + Encrypt.encrypt(filterparams) +
            '&fileName=' + Encrypt.encrypt(fileName) + '&apiKey=' + Encrypt.encrypt($rootScope.user.SecretKey) + '&user=' + Encrypt.encrypt($rootScope.user.UserId);
    }
    this.getMemberListByBranch = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/membersbybranch',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

}]);

