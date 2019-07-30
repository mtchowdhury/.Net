ammsAng.controller('designationListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder','gradeAndDesignationService',
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

        $scope.$on('designation-add-finished', function () {
            $scope.getAllDesignation();
        });

        $scope.$on('designation-edit-finished', function () {
            $scope.getAllDesignation();
        });


        $scope.$on('designation-delete-finished', function () {
            $scope.getAllDesignation();
        });


        $scope.Init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                $scope.hasNonGeneralCommands = true;
                $scope.getAllDesignation();
            }, AMMS.handleServiceError);

        };
        $scope.getAllDesignation = function () {
            $("#loadingImage").css("display", "block");
            gradeAndDesignationService.getAllDesignations().then(function(response) {
                $scope.designationList = response.data;
                $scope.designationList.forEach(function(dl) {
                    dl.Startdate = moment(dl.Startdate).format('ddd, DD/MM/YYYY');
                    if (dl.EndDate) dl.EndDate = moment(dl.EndDate).format('ddd, DD/MM/YYYY');
                });
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }

        $scope.handleNonGeneralActions = function (actionName, designation) {
            $scope.designationToDelete = designation;
            if (actionName === "DELETE") {
                $scope.deleteDesignation();
            }
        }
        $scope.deleteDesignation = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.designation),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    gradeAndDesignationService.deleteDesignationById($scope.designationToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.designation), "Successful!", "success");
                            $rootScope.$broadcast('designation-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.designation), response.data.Message, "error");
                        }

                    });
                });
        };
        $scope.Init();
    }]);