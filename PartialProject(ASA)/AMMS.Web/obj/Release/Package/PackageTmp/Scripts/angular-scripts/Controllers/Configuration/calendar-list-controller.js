ammsAng.controller('calendarController', ['$scope', '$rootScope','commonService','calendarService',
    function ($scope, $rootScope, commonService,calendarService) {

        $scope.Init = function () {
            
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c => !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            });

            calendarService.getCalendarYears().then(function(response) {
                $scope.calenders = response.data;

            });

        };

        $scope.deleteCalendar = function (year) {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.calendar),
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
                function () {
                    calendarService.deleteCalendarYear(year).then(function(response){
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.calendar), "Successful!", "success");
                            $rootScope.$broadcast('calendar-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.calendar), response.data.Message, "error");
                        }

                    });
                });
        };


        $scope.handleNonGeneralActions = function (actionName, year) {
            if (actionName === "DELETE") {
                $scope.deleteCalendar(year);
            }
        }

        $scope.$on('calendar-add-finished', function () {
            calendarService.getCalendarYears().then(function (response) {
                $scope.calenders = response.data;
            });
        });

        $scope.$on('calendar-delete-finished', function () {
            calendarService.getCalendarYears().then(function (response) {
                $scope.calenders = response.data;
            });
        });


        $scope.Init();


    }]);