ammsAng.controller('gradeListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder','gradeAndDesignationService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, gradeAndDesignationService) {

        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];

        $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10);

        $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(1)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(2)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(3)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(4)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(5)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(6)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(7)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(8)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(9)
            .withOption("bSearchable", true)
        ];

        $scope.$on('grade-add-finished', function () {
            $scope.getAllGrades();
        });

        $scope.$on('grade-edit-finished', function () {
            $scope.getAllGrades();
        });


        $scope.$on('grade-delete-finished', function () {
            $scope.getAllGrades();
        });



        $scope.getAllGrades = function () {
            $("#loadingImage").css("display", "block");
            gradeAndDesignationService.getAllGrades().then(function (response) {
                $scope.gradeList = response.data;
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }



        $scope.Init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
                $scope.getAllGrades();
            }, AMMS.handleServiceError);

        };


        $scope.handleNonGeneralActions = function (actionName, grade) {
            $scope.gradeToDelete = grade;
            if (actionName === "DELETE") {
                $scope.deleteGrade();
            }
        }
        $scope.deleteGrade = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.grade),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    gradeAndDesignationService.deleteGradeById($scope.gradeToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.grade), "Successful!", "success");
                            $rootScope.$broadcast('grade-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.grade), response.data.Message, "error");
                        }

                    });
                });
        };


        $scope.Init();
    }]);