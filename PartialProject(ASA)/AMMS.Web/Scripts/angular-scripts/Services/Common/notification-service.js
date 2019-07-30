ammsAng.service('notificationService', ['$rootScope', '$http', function ($rootScope, $http) {
    //this.getNotifications = function (empId) {
    //    console.log(empId);
    //    return $http({
    //        method: 'GET',
    //        url: $rootScope.commonApiBaseUrl + 'Notification/getUserNotifications',
    //        params: {
    //            empId: 
    //        },
    //        headers: $rootScope.headersWithoutLog,
            
    //    });
    //}

    this.getNotifications = function (empId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'Notification/getUserNotifications',
            params: {
                empId: Encrypt.encrypt(empId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.NotificationReceived = function (empId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'Notification/notificationReceived',
            params: {
                empId: Encrypt.encrypt(empId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    this.NotificationClicked = function (notificationId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'Notification/notificationSeen',
            params: {
                notificationId: Encrypt.encrypt(notificationId)
            },
            headers: $rootScope.headersWithoutLog
        });
    }

    
}]);