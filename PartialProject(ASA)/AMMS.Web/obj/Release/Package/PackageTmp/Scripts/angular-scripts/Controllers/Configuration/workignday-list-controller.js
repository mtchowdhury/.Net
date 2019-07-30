ammsAng.controller('workingdayListController', ['$scope', '$rootScope', 'workingDayService',
    function ($scope, $rootScope, workingDayService) {
        $scope.workingDayList = [];

        $scope.init = function () {
            //$scope.closeDateInfo = {};
            $scope.getWorkingDayList = workingDayService.getWorkingDays($scope.selectedBranchId).then(function (response) {
                console.log(response.data);
                $scope.workingDayList = response.data;
                for (var i = 0; i < $scope.workingDayList.length; i++) {
                    $scope.workingDayList[i].date = $scope.formatDate($scope.workingDayList[i].date);
                }


                //$scope.displayDate = $scope.formatDate(response.data.date);

                //console.log(response.data);
                //$scope.date = response.data.date;
                //$scope.isOpened = response.data.status;
            });
        }
        $scope.init();
        $scope.formatDate = function (dateString) {
            var formattedDate = dateString.toString().substring(6, 8) + "/" + dateString.toString().substring(4, 6) + "/" + dateString.toString().substring(0, 4);
            return formattedDate;
        }


        //TODO
        $scope.$on('program-officer-fetched', function (event, args, branchId) {
            $scope.selectedBranchId = branchId;
            $scope.init();

        });

        


    }]);