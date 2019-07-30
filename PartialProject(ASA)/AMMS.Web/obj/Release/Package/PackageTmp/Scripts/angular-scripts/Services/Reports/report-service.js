ammsAng.service('reportService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.getReports = function () {
        return $http({
            method: 'GET',
            url: $rootScope.reportApiUrl + 'report',
            headers: $rootScope.headersWithoutLog
        });
    },
      this.getReportsByType = function (typeId) {
          return $http({
              method: 'GET',
              url: $rootScope.reportApiUrl + 'report',
              headers: $rootScope.headersWithoutLog,
              params: {
                  typeId:Encrypt.encrypt(typeId)
              }
          });
      },

    this.getFilters = function (reportId,roleId,employeeId,branchId,startDate,endDate) {
        return $http({
            method: 'GET',
            url: $rootScope.reportApiUrl + 'report/filters',
            headers: $rootScope.headersWithoutLog,
            params: {
                reportId: Encrypt.encrypt(reportId),
                roleId: Encrypt.encrypt(roleId),
                employeeId: Encrypt.encrypt(employeeId),
                branchId: Encrypt.encrypt(branchId),
                startDate: Encrypt.encrypt(startDate),
                endDate: Encrypt.encrypt(endDate)

                
            }
        });
    },

    this.getFilter = function (filterId, parameters) {
        var params = parameters ? {
            filterId: Encrypt.encrypt(filterId),
            parameters: Encrypt.encrypt(parameters)
        } : {
            filterId: Encrypt.encrypt(filterId)
        };
        return $http({
            method: 'GET',
            url: $rootScope.reportApiUrl + 'report/filter',
            headers: $rootScope.headersWithoutLog,
            params: params
        });
    },

    this.getData = function (reportId, params) {
        return $http({
            method: 'GET',
            url: $rootScope.reportApiUrl + 'report/data',
            headers: $rootScope.headersWithoutLog,
            params: {
                reportId: Encrypt.encrypt(reportId),
                parameters: Encrypt.encrypt(params)
            }
        });
    }

    this.getExportData = function (reportId, params) {
        return $http({
            method: 'GET',
            url: $rootScope.reportApiUrl + 'report/exportdata',
            headers: $rootScope.headersWithoutLog,
            params: {
                reportId: Encrypt.encrypt(reportId),
                parameters: Encrypt.encrypt(params)
            }
        });
    }

    this.getExportUrl = function (reportId, params) {
        return $rootScope.reportApiUrl + 'report/exportdata?reportId=' + Encrypt.encrypt(reportId) + '&parameters=' + Encrypt.encrypt(params);
    }
}]);