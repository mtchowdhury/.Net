ammsAng.controller('gradeAddController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'gradeAndDesignationService',
    function ($scope, $rootScope, $timeout, $q, filterService, gradeAndDesignationService) {
        $scope.grade = {};
       

        $scope.init = function () {
            $scope.getFilterData();
           
        }
        $scope.getFilterData = function () {
            gradeAndDesignationService.getAllGradesFilterData().then(function (response) {
                $scope.filters = response.data;
                $scope.setDefualts();
            });
        }
        $scope.setDefualts=function() {
            $scope.grade.Status = $scope.filters.Status[0].Value;
        }

        $scope.addGrade = function () {
           
            swal({
                title: "confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.grade),
                showCancelButton: true,
                confirmButtonText: "yes,Create it!",
                cancelButtonText: "No,Cancel!",
                type: 'info',
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                   
                    gradeAndDesignationService.addGrade($scope.grade).then(function (response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('grade-add-finished');
                            swal({
                                title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.grade),
                                text: "What do you want to do next?",
                                type: "success",
                                showCancelButton: true,
                                confirmButtonColor: "#008000",
                                confirmButtonText: "Add New",
                                cancelButtonText: "Close and Exit",
                                closeOnConfirm: true,
                                closeOnCancel: true
                            },
                                function (isConfirmed) {
                                    if (isConfirmed) {
                                        $scope.gradeAddForm.reset();
                                        $scope.gradeAddForm.$dirty = false;
                                        $timeout(function () { $scope.clearModelData(); }, 300);
                                    } else {
                                        $timeout(function () { $scope.clearAndCloseTab(); }, 300);
                                    }
                                });
                        } else {
                            swal($rootScope.showMessage($rootScope.addError, $rootScope.grade), response.data.Message, "error");
                        }
                    });
                }
            });
        }


        $scope.init();

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