ammsAng.controller('notificationController', ['$scope', '$rootScope',  '$timeout',"notificationService", function ($scope, $rootScope,$timeout,notificationService) {

    $scope.notificationCount = 0;
    $scope.isNotificationClicked = false;
    $scope.notifications = [];
    var notificationTypes = [{Name:"task",Value:1}, {Name:"news",Value:2}];

    $scope.$on('program-officer-fetched', function (event, args, branchId) {
       $scope.init();
    });
    

    $scope.init = function () {
        notificationService.getNotifications($rootScope.user.EmployeeId).then(function (response) {
            $scope.notifications = response.data;
            $scope.notificationCount = $scope.notifications.filter(e=>e.NewStatus).length;
            $scope.notifications.forEach(function(notification) {
                notification.Class = notificationTypes.filter(e => e.Value === notification.Type)[0].Name;
               // notification.SeenTick = notification.SeenStatus ? "&#252;" : '  ';
            });
            console.log($scope.notifications );
        });
    }

    $scope.notificationClicked = function() {
        
        if ($scope.isNotificationClicked === false && $scope.notificationCount >0) {
            notificationService.NotificationReceived($rootScope.user.EmployeeId).then(function (response) {
                $scope.isNotificationClicked = true;
            });
        }
        
    }


    $scope.OpenNotificationTab = function (notification) {

        console.log(notification);
        if (!Notification.SeenStatus) {
            notificationService.NotificationClicked(notification.Id).then(function (response) {

                console.log(response);
                notification.SeenStatus = true;
            });
        }
        if (notification.CommandId != null) {
            $rootScope.$broadcast('commandNotificationClicked', notification);
        } else {
            if (notification.PropertyId != null) {
                $rootScope.$broadcast('propertyNotificationClicked', notification);
            } else {
                $rootScope.$broadcast('moduleNotificationClicked', notification);
            }
        }
 }
   
    






























    $(document).ready(function () {
        $("#notificationLink").click(function () {
            $("#notificationContainer").fadeToggle(300);
            $("#notification_count").fadeOut("slow");
            return false;
        });

        //Document Click hiding the popup 
        $(document).click(function () {
            $("#notificationContainer").hide();
        });

        //Popup on click
        $("#notificationContainer").click(function () {
            return false;
        });

    });
}]);