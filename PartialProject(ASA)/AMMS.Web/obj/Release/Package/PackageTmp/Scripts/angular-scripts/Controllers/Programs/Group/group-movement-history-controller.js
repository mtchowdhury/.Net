ammsAng.controller('groupMovementHistoryController', ['$scope', '$rootScope', 'filterService', 'loanGroupService', 'loanGroupFilterService', 'validatorService', '$timeout',
    function ($scope, $rootScope, filterService, loanGroupService, loanGroupFilterService, validatorService, $timeout) {
        $scope.group = {};

        $scope.loId = $scope.selectedMenu.programOfficerId;
        console.log($scope.loId);
        $scope.GroupList = angular.copy($scope.selectedMenu.SubModules.filter(g=>g.Status === 1));

        $scope.getGroupMovementLogs =function()
        {
            loanGroupService.getGroupMovementHistoryByGroupId($scope.group.Id).then(function (response) {
                $scope.moveData = response.data;
                $scope.moveData.forEach(function(data) {
                   // data.MoveDate = moment(data.MoveDate).format('DD-MM-YYYY');
                    data.EndDate = null;
                });
                $scope.endDateSetter();
                console.log($scope.moveData);
            });
        }
        
        $scope.endDateSetter = function () {
            if ($scope.moveData === undefined || $scope.moveData === null) return;

            if ($scope.moveData.length > 1) {
                for (var i = 0; i < $scope.moveData.length - 1; i++) {
                    $scope.moveData[i].EndDate = $scope.moveData[i + 1].MoveDate ? moment($scope.moveData[i + 1].MoveDate).add('days', -1).format('DD-MM-YYYY') : null;
                }
                
            }
            $scope.moveData.forEach(function (data) {
                data.MoveDate = moment(data.MoveDate).format('DD-MM-YYYY');
            });
               
        }
       
    }]);