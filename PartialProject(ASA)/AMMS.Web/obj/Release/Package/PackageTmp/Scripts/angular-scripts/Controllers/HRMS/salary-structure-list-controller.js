ammsAng.controller('salaryStructureListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'salaryStructureService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, salaryStructureService) {

        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];
        $scope.searchOptions = {};
        $scope.salryStructureToDelete = null;
        //$scope.searchOptions.Branch.originalObject.Value = null;

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
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }

        $scope.$on('employee-salary-structure-delete-finished', function () {
            $scope.getEmployeeSalaryStructure();
        });

        $scope.$on('salary-structure-edit-finished', function () {
            $scope.getEmployeeSalaryStructure();
        });

        $scope.$on('salary-structure-add-finished', function () {
            $scope.getEmployeeSalaryStructure();
        });

        $scope.handleNonGeneralActions = function (actionName, salaryStructure) {
            $scope.salryStructureToDelete = salaryStructure;
            if (actionName === "DELETE") {
                $scope.deleteSalaryStructure();
            }
        }


        $scope.deleteSalaryStructure = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.employeeSalaryStructure),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    salaryStructureService.deleteEmployeeSalaryStructure($scope.salryStructureToDelete).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.employeeSalaryStructure), "Successful!", "success");
                            $rootScope.$broadcast('employee-salary-structure-delete-finished');
                        } else {
                            swal($rootScope.showMessage(response.data.Message, $rootScope.employeeSalaryStructure), "", "error");
                        }

                    }, AMMS.handleServiceError);
                });
        };


        $scope.Init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                //console.log($scope.commandList);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
               // $scope.AllBranch = [];
                $scope.getBranches();
                $scope.getEmployeeSalaryStructure();
                
                $scope.searchOptions = {};
            }, AMMS.handleServiceError);

        };
        $scope.searchSalaryStructures = function () {
            $("#loadingImage").css("display", "block");
            //$scope.SalaryStructures = $scope.salaryStructureList;
            salaryStructureService.getEmployeeSalaryStructureByBranchId($scope.searchOptions.Branch.originalObject.Value).then(function (response) {
                $scope.salaryStructureList = response.data;
                $rootScope.searchedBranchId = $scope.searchOptions.Branch.originalObject.Value;
                $scope.salaryStructureList.sort(function (a, b) {
                    return b.Status - a.Status;
                });
                $scope.salaryStructureList.forEach(function (salaryStructure) {
                    //console.log($scope.AllBranch);
                    salaryStructure.StartDate = moment(salaryStructure.StartDate).format('DD/MM/YYYY');
                    //salaryStructureService.getBranchesByRole($rootScope.selectedBranchId, parseInt($rootScope.user.Role)).then(function (filterdata) {
                    //    $scope.AllBranch = angular.copy(filterdata.data);
                    //    var branch = $scope.AllBranch.find(e => e.Value === salaryStructure.OfficeCode);
                    //    if (branch)
                    //        salaryStructure.OfficeName = branch.Name;
                    //});
                    
                    //var endYear = moment(salaryStructure.EndDate).year();
                    salaryStructure.EndDate = salaryStructure.EndDate == null ? "" : moment(salaryStructure.EndDate).format('DD/MM/YYYY');


                });
                //console.log($scope.salaryStructureList);
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);

            //if ($scope.searchOptions.Branch) $scope.SalaryStructures = $scope.SalaryStructures.filter(e => e.OfficeName.toLowerCase().includes($scope.searchOptions.Branch.originalObject.Name.toLowerCase()));
            //$scope.salaryStructureList =  $scope.SalaryStructures;
        }
        $scope.getEmployeeSalaryStructure = function () {
            $("#loadingImage").css("display", "block");
            salaryStructureService.getEmployeeSalaryStructureByBranchId($rootScope.selectedBranchId).then(function (response) {
                $scope.salaryStructureList = response.data;
                //$scope.salaryStructureList.sort(function(a, b) {
                //    return b.Status - a.Status;
                //});
                $scope.salaryStructureList.forEach(function (salaryStructure) {
                    //console.log($scope.AllBranch);
                    //salaryStructure.StartDate = moment(salaryStructure.StartDate).format('DD/MM/YYYY');
                    ////salaryStructureService.getBranchesByRole($rootScope.selectedBranchId, parseInt($rootScope.user.Role)).then(function (filterdata) {
                    ////    $scope.AllBranch = angular.copy(filterdata.data);
                    ////    var branch = $scope.AllBranch.find(e => e.Value === salaryStructure.OfficeCode);
                    ////    if (branch)
                    ////        salaryStructure.OfficeName = branch.Name;
                    ////});
                    ////var branch = $scope.AllBranch.find(e => e.Value === salaryStructure.OfficeCode);
                    ////if (branch)
                    ////    salaryStructure.OfficeName = branch.Name;
                    ////var endYear = moment(salaryStructure.EndDate).year();
                    //salaryStructure.EndDate = salaryStructure.EndDate == null ? "" : moment(salaryStructure.EndDate).format('DD/MM/YYYY');
                    
                    
                });
                salaryStructureService.getBranchesByRole($rootScope.selectedBranchId, parseInt($rootScope.user.Role)).then(function (filterdata) {
                    $scope.AllBranch = angular.copy(filterdata.data);
                    var branch = $scope.AllBranch.find(e => e.Value === $scope.salaryStructureList[0].OfficeCode);
                    if (branch)
                        $scope.salaryStructureList[0].OfficeName = branch.Name;
                });
                //console.log($scope.salaryStructureList);
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);
        }
        $scope.getBranches = function() {
            salaryStructureService.getBranchesByRole($rootScope.selectedBranchId, parseInt($rootScope.user.Role)).then(function(filterdata) {
                $scope.AllBranch = angular.copy(filterdata.data);
            });
        }
        $scope.Init();
    }]);