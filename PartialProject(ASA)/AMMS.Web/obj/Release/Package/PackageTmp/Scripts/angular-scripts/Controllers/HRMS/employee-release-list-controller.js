ammsAng.controller('releaseEmployeeListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeReleaseService', 'salaryStructureService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, commonService, $timeout, employeeReleaseService, salaryStructureService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.employeeListFull = [];
        $scope.employeeList = [];
        $scope.searchOptions = {};
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
            .withOption("bSearchable", true)
        ];
        $scope.employeeToDelete = null;
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
        
        $scope.getReleasableEmployees = function () {
            $("#loadingImage").css("display", "block");
            employeeReleaseService.getAllReleasableEmployee($rootScope.selectedBranchId).then(function (responseEmployee) {
                console.log(responseEmployee.data);
                $scope.employeeList = responseEmployee.data;
                $scope.employeeList.sort(function(a, b) {
                    return b.SubStatus - a.SubStatus;
                });
                $scope.employeeList.forEach(function (employee) {
                    employee.ReleaseDate = (employee.ReleaseDate == null || employee.ReleaseDate == "1901-01-01T00:00:00") ? "" : moment(employee.ReleaseDate).format('DD/MM/YYYY');
                });
                salaryStructureService.getBranchesByRole($rootScope.selectedBranchId, parseInt($rootScope.user.Role)).then(function (filterdata) {
                    $scope.AllBranch = angular.copy(filterdata.data);
                    var branch = $scope.AllBranch.find(e => e.Value === $scope.employeeList[0].OfficeCode);
                    if (branch)
                        $scope.employeeList[0].OfficeName = branch.Name;
                });
                console.log($scope.employeeList);
                $scope.employeeListFull = responseEmployee.data;
               
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);
        }


        $scope.$on('Employee-cancel-release-finished', function () {
            $scope.getReleasableEmployees();
        });

        $scope.$on('Employee-release-finished', function () {
            $scope.getReleasableEmployees();
        });

        $scope.searchReleaseEmployeeList = function () {
            //$scope.SalaryStructures = $scope.salaryStructureList;
            employeeReleaseService.getAllReleasableEmployee($scope.searchOptions.Branch.originalObject.Value).then(function (response) {
                $scope.employeeList = angular.copy(response.data);
                $rootScope.searchedBranchId = $scope.searchOptions.Branch.originalObject.Value;
                $scope.employeeList.sort(function (a, b) {
                    return b.SubStatus - a.SubStatus;
                });
                $scope.employeeList.forEach(function (employee) {
                    console.log($scope.AllBranch);
                    employee.StartDate = moment(employee.StartDate).format('DD/MM/YYYY');
                    //salaryStructureService.getBranchesByRole($rootScope.selectedBranchId, parseInt($rootScope.user.Role)).then(function (filterdata) {
                    //    $scope.AllBranch = angular.copy(filterdata.data);
                    //    var branch = $scope.AllBranch.find(e => e.Value === salaryStructure.OfficeCode);
                    //    if (branch)
                    //        salaryStructure.OfficeName = branch.Name;
                    //});

                    //var endYear = moment(salaryStructure.EndDate).year();
                    employee.EndDate = employee.EndDate == null ? "" : moment(employee.EndDate).format('DD/MM/YYYY');


                });
                console.log($scope.employeeList);
            }, AMMS.handleServiceError);

            //if ($scope.searchOptions.Branch) $scope.SalaryStructures = $scope.SalaryStructures.filter(e => e.OfficeName.toLowerCase().includes($scope.searchOptions.Branch.originalObject.Name.toLowerCase()));
            //$scope.salaryStructureList =  $scope.SalaryStructures;
        }

        $scope.Init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.getBranches();

                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
                $scope.getReleasableEmployees();
                $scope.searchOptions = {};
            }, AMMS.handleServiceError);

        };
        $scope.reloadPage = function () {
            $scope.employeeList = $scope.employeeListFull.filter(emp=>emp.BranchId == $scope.selectedBranchId);
            //if ($rootScope.user.Role != "0" && $rootScope.user.Role != "1" && $rootScope.user.Role != "12") {
            //    $scope.employeeList = $scope.employeeListFull.filter(emp=>emp.BranchId == $scope.selectedBranchId);
            //}
        }

        $scope.exportData = function () {
            employeeService.getExportReportResult($scope.tab.PropertyId).then(function (responseResult) {
                $scope.exportResult = responseResult.data;
            }, AMMS.handleServiceError);
            window.open($rootScope.apiBaseUrl + "Export/GetEmployees?reportName=" + Encrypt.encrypt($scope.exportResult[0].Name), "_blank");
        }
        $scope.getBranches = function () {
            salaryStructureService.getBranchesByRole($rootScope.selectedBranchId, parseInt($rootScope.user.Role)).then(function (filterdata) {
                $scope.AllBranch = angular.copy(filterdata.data);
            });
        }
        $scope.Init();
    }]);