ammsAng.controller('paySalaryListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'salaryStructureService', 'paySalaryService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, salaryStructureService, paySalaryService) {

        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];
        $scope.paySalaryToDelete = null;

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
            .withOption("bSearchable", true)
        //DTColumnDefBuilder.newColumnDef(8)
        //    .withOption("bSearchable", true),
        //DTColumnDefBuilder.newColumnDef(9)
        //    .withOption("bSearchable", true)
        ];


        $scope.$on('pay-salary-delete-finished', function () {
            $scope.getPaySalaryList();
        });

        $scope.$on('pay-salary-add-finished', function () {
            $scope.getPaySalaryList();
        });

        $scope.handleNonGeneralActions = function (actionName, paySalary) {
            $scope.paySalaryToDelete = paySalary;
            if (actionName === "DELETE") {
                $scope.deletePaySalary();
            }
        }


        $scope.deletePaySalary = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.employeePaySalary),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    salaryStructureService.deleteEmployeeSalaryStructure($scope.paySalaryToDelete).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.employeePaySalary), "Successful!", "success");
                            $rootScope.$broadcast('pay-salary-delete-finished');
                        } else {
                            swal($rootScope.showMessage(response.data.Message, $rootScope.employeePaySalary), "", "error");
                        }

                    }, AMMS.handleServiceError);
                });
        };


        $scope.Init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                console.log($scope.commandList);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;

                $scope.getPaySalaryList();

            }, AMMS.handleServiceError);

        };
        $scope.getPaySalaryList = function () {
            paySalaryService.getEmployeePaidSalaryListByOfficeCode($rootScope.selectedBranchId).then(function (response) {
                $scope.paySalaryList = response.data;
                console.log($scope.paySalaryList);
            }, AMMS.handleServiceError);
        }
        $scope.Init();
    }]);