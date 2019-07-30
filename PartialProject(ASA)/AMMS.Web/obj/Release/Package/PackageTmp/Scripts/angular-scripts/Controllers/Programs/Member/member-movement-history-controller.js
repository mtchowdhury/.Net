ammsAng.controller('memberMovementHistoryController', ['$scope', '$rootScope', 'filterService', 'memberService', 'loanGroupFilterService', 'validatorService', '$timeout',
    function ($scope, $rootScope, filterService, memberService, loanGroupFilterService, validatorService, $timeout) {
        $scope.member = {};

        $scope.loId = $scope.selectedMenu.programOfficerId;
        console.log($scope.loId);
        $scope.memberList = angular.copy($rootScope.memberListStoreForMHistory.filter(g=>g.Status === 1));

        $scope.getMemberMovementLogs = function () {
            memberService.getMemberMovementHistoryByMemberId($scope.member.Id).then(function (response) {
                $scope.moveData = response.data;
                $scope.moveData.forEach(function (data) {
                    //data.MoveDate = moment(data.MoveDate).format('DD-MM-YYYY');
                    data.EndDate = null;
                });
                $scope.endDateSetter();
                console.log($scope.moveData);
            });
        }
        //$scope.endDateSetter = function () {
        //    if ($scope.moveData === undefined || $scope.moveData === null) return;
        //    if ($scope.moveData.length > 1)
        //        $scope.moveData[$scope.moveData.length - 2].EndDate = $scope.moveData[$scope.moveData.length - 1].MoveDate ?
        //           moment($scope.moveData[$scope.moveData.length - 1].MoveDate).add('days', -1).format('DD-MM-YYYY') : null;
        //}
        $scope.endDateSetter = function () {
            if ($scope.moveData === undefined || $scope.moveData === null) return;

            if ($scope.moveData.length > 1) {
                for (var i = 0; i < $scope.moveData.length - 1; i++) {
                    $scope.moveData[i].EndDate = $scope.moveData[i + 1].StartDate ? moment($scope.moveData[i + 1].StartDate).add('days', -1).format('DD-MM-YYYY') : null;
                }
                
            }
            $scope.moveData.forEach(function (data) {
                data.StartDate = moment(data.StartDate).format('DD-MM-YYYY');
            });

        }

    }]);