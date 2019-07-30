ammsAng.controller('gradeEditController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'gradeAndDesignationService',
    function ($scope, $rootScope, $timeout, $q, filterService, gradeAndDesignationService) {
        $scope.grade = {};
        $scope.filters = {};

        $scope.init = function () {
            $scope.getFilterData();
            $scope.getGradeInfo();
        }
        $scope.getFilterData=function() {
            gradeAndDesignationService.getAllGradesFilterData().then(function (response) {
                $scope.filters = response.data;
            });
        }

        $scope.getGradeInfo = function () {
            var gradeId = $rootScope.editGradeId;
            gradeAndDesignationService.getGradeById(gradeId).then(function (response) {
                $scope.grade = response.data;
            });
        }

        $scope.editGrade = function () {
        swal({
                title: "confirm?",
                text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.grade),
                showCancelButton: true,
                confirmButtonText: "yes,Create it!",
                cancelButtonText: "No,Cancel!",
                type: 'info',
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {

                    gradeAndDesignationService.editGrade($scope.grade).then(function (response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('grade-edit-finished');
                            swal({
                                title: "Successfull!",
                                text: $rootScope.showMessage($rootScope.editSuccess, $rootScope.grade),
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#008000",
                                confirmButtonText: "OK",
                                //cancelButtonText: "Close and Exit",
                                closeOnConfirm: true,
                                closeOnCancel: true
                            },
                                function (isConfirmed) {
                                    if (isConfirmed) {
                                        
                                        $timeout(function () { $scope.clearAndCloseTab(); }, 300);
                                    } else {
                                        $timeout(function () { $scope.clearAndCloseTab(); }, 300);
                                    }
                                });
                        } else {
                            swal($rootScope.showMessage($rootScope.editError, $rootScope.grade), response.data.Message, "error");
                        }
                    });
                }
            });
        }

       





        $scope.init();

        

        $scope.$on('tab-switched', function () {
            if ($rootScope.hasOwnProperty("editGradeId")) {
                $scope.getGradeInfo();
            }
        });

        $scope.clearModelData = function () {
            $scope.grade = {};
        }

        $scope.clearAndCloseTab = function () {
            $scope.grade = {};
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

    }
]);