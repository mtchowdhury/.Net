ammsAng.service('calendarService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.user = $rootScope.user;
    this.headers = function () {
        return {
            "Access-Control-Allow-Origin": "*",
            "ApiKey": "Some-key",
            "User": $rootScope.user.UserId,
            "Log": true
        }
    }



    this.getCalendarYears = function () {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'configuration/calendar',
            headers: $rootScope.headersWithoutLog
        });
    };


    this.addCalendatYear = function (calendarData) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'configuration/calendar/add',
            headers: $rootScope.headersWithLog,
            data: calendarData
        });
    };

    this.getHolidays = function (year, branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'configuration/calendar/holidays',
            params: {
                calendarYear: Encrypt.encrypt(year),
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });

    };
    this.getFilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'configuration/calendar/filters',
            headers: $rootScope.headersWithoutLog
        });

    };

    

    this.deleteCalendarYear = function (year) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'configuration/calendar/delete',
            params: {
                calendarYear: Encrypt.encrypt(year)
            },
            headers: $rootScope.headersWithLog
        });

    };

    this.editCalendatYear = function (calendarData) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'configuration/calendar/edit',
            data: calendarData,
            headers: $rootScope.headersWithLog
        });

    };
}]);

