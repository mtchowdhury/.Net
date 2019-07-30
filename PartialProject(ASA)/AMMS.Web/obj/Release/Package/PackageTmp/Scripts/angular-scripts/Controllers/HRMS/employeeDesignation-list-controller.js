ammsAng.controller('employeeDesignationListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeDesignationService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, commonService, $timeout, employeeDesignationService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.employeeDesignationListFull = [];
        $scope.employeeDesignationList = [];
        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];
        $scope.emdDesBranch = $rootScope.selectedBranchId;
        $rootScope.selectedBranchIdForEmployeeDesignation = $scope.emdDesBranch;
        $scope.employeeDesignationSearchParams = {};
        $scope.employeeDesignationSearchParams.OfficeId = $scope.selectedBranchId;
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
        $scope.employeeDesignationToDelete = null;
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
        $scope.searchArr = [
           {
               filterColumnName: "",
               comparison: "",
               searchValue: "",
               radioOption: "and"
           },
           {
               filterColumnName: "",
               comparison: "",
               searchValue: "",
               radioOption: "and"
           },
           {
               filterColumnName: "",
               comparison: "",
               searchValue: "",
               radioOption: "and"
           }
        ];
        
        $scope.intersect = function (arr1, arr2) {
            var intersect = [];
            _.each(arr1, function (a) {
                _.each(arr2, function (b) {
                    if (compare(a, b))
                        intersect.push(a);
                });
            });

            return intersect;
        };
        $scope.number = 3;
        $scope.getNumber = function (num) {
            return new Array(num);
        }


        $scope.getemployeeDesignations = function () {
            $("#loadingImage").css("display", "block");
                employeeDesignationService.getemployeeDesignations($scope.employeeDesignationSearchParams).then(function (responseemployeeDesignation) {
                console.log(responseemployeeDesignation.data);
                $scope.employeeDesignationList = responseemployeeDesignation.data;
                $scope.employeeDesignationList.forEach(function(empd) {
                    empd.StartDateStr = moment(empd.StartDate).format('DD/MM/YYYY');
                    var endYear = moment(empd.EndDate).year();
                    empd.EndDateStr = endYear < 1900 ? "" : moment(empd.EndDate).format('DD/MM/YYYY');
                    empd.Status = endYear < 1900 ? 1 : 0;


                });
                



                $("#loadingImage").css("display", "none");
                $timeout(function() { 
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);                
            }, AMMS.handleServiceError);
        }

        $scope.changeBranch = function() {
            $scope.employeeDesignationSearchParams.OfficeId = $scope.emdDesBranch;
            $scope.Init();
            $rootScope.selectedBranchIdForEmployeeDesignation = $scope.emdDesBranch;
        }



        $scope.handleNonGeneralActions = function (actionName, employeeDesignation) {
            $scope.employeeDesignationToDelete = employeeDesignation;
            if (actionName === "DELETE") {
                $scope.deleteemployeeDesignation();
            }
        }
       
        $scope.$on('employeeDesignation-add-finished', function () {
            $scope.getemployeeDesignations();
            });

        $scope.$on('employeeDesignation-edit-finished', function () {
            $scope.getemployeeDesignations();
        });


        $scope.$on('employeeDesignation-delete-finished', function () {
            $scope.getemployeeDesignations();
        });

        $scope.deleteemployeeDesignation = function() {
            swal({
                    title: "Confirm?",
                    text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.employeeDesignation),
                    type: "info",
                    closeOnConfirm: false,
                    showCancelButton: true,
                    showLoaderOnConfirm: true
                },
                function() {
                    employeeDesignationService.deleteemployeeDesignation($scope.employeeDesignationToDelete.Id).then(function(response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.employeeDesignation), "Successful!", "success");
                            $rootScope.$broadcast('employeeDesignation-delete-finished');
                        } else {
                            swal($rootScope.showMessage(response.data.Message, $rootScope.employeeDesignation), "", "error");
                        }
                        
                    }, AMMS.handleServiceError);
                });
            };

        $scope.searchemployeeDesignation = function () {
            $scope.employeeDesignationList = [];
            var k = -1;
            if ($scope.searchArr[0].filterColumnName &&
                $scope.searchArr[0].comparison) {
                k = 0;
            }
            if ($scope.searchArr[0].filterColumnName &&
                $scope.searchArr[0].comparison &&
                $scope.searchArr[1].filterColumnName &&
                $scope.searchArr[1].comparison) {
                k = 1;
            }
            if ($scope.searchArr[0].filterColumnName &&
                $scope.searchArr[0].comparison &&
                $scope.searchArr[1].filterColumnName &&
                $scope.searchArr[1].comparison &&
                $scope.searchArr[2].filterColumnName &&
                $scope.searchArr[2].comparison) {
                k = 2;
            }

            if (k === 0) {
                var response = employeeDesignationService.searchemployeeDesignation($scope.employeeDesignationListFull, $scope.searchArr, 0);
                $scope.employeeDesignationList = response;
            }

            if (k === 1) {
                var firstQueryResult = employeeDesignationService.searchemployeeDesignation($scope.employeeDesignationListFull, $scope.searchArr, 0);
                if ($scope.searchArr[0].radioOption === "or") {
                    var secondQuertResult1 = employeeDesignationService.searchemployeeDesignation($scope.employeeDesignationListFull, $scope.searchArr, 1);                    
                            for (var j = 0; j < secondQuertResult1.length; j++) {
                                if (!firstQueryResult.includes(secondQuertResult1[j])) {
                                    firstQueryResult.push(secondQuertResult1[j]);
                                }
                            }
                    $scope.employeeDesignationList = firstQueryResult;                    
                }
                if ($scope.searchArr[0].radioOption === "and") {
                    var secondQuertResult = employeeDesignationService.searchemployeeDesignation(firstQueryResult, $scope.searchArr, 1);
                    $scope.employeeDesignationList = secondQuertResult;                    
                }
            }

            if (k === 2) {
                var firstQueryResult = employeeDesignationService.searchemployeeDesignation($scope.employeeDesignationListFull, $scope.searchArr, 0);
                  
                    if ($scope.searchArr[0].radioOption === "or") {
                        var secondQuertResult = employeeDesignationService.searchemployeeDesignation($scope.employeeDesignationListFull, $scope.searchArr, 1);
                        var thirdQuertResult = employeeDesignationService.searchemployeeDesignation($scope.employeeDesignationListFull, $scope.searchArr, 1);
                        for (var j = 0; j < secondQuertResult.length; j++) {
                            if (!firstQueryResult.includes(secondQuertResult[j])) {
                                firstQueryResult.push(secondQuertResult[j]);
                            }
                        }
                        for (var j = 0; j < thirdQuertResult.length; j++) {
                            if (!firstQueryResult.includes(thirdQuertResult[j])) {
                                firstQueryResult.push(thirdQuertResult[j]);
                            }
                        }
                        $scope.employeeDesignationList = firstQueryResult;
                    }                    

                    if ($scope.searchArr[0].radioOption === "and") {
                    
                        var secondQuertResult = employeeDesignationService.searchemployeeDesignation(firstQueryResult, $scope.searchArr, 1);
                        var thirdQueryResult = employeeDesignationService.searchemployeeDesignation(secondQuertResult, $scope.searchArr, 2);
                        $scope.employeeDesignationList = thirdQueryResult;                                        
                }
            }   
        };
        

        $scope.Init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;

                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
              
                $scope.getemployeeDesignations();
                $scope.getBranchesByRoleAndBranch();
            }, AMMS.handleServiceError);
            
        };
        $scope.reloadPage = function () {
            $scope.employeeDesignationList = $scope.employeeDesignationListFull.filter(emp=>emp.BranchId == $scope.selectedBranchId);
            //if ($rootScope.user.Role != "0" && $rootScope.user.Role != "1" && $rootScope.user.Role != "12") {
            //    $scope.employeeDesignationList = $scope.employeeDesignationListFull.filter(emp=>emp.BranchId == $scope.selectedBranchId);
            //}
        }

        $scope.exportData = function () {
            employeeDesignationService.getExportReportResult($scope.tab.PropertyId).then(function (responseResult) {
                $scope.exportResult = responseResult.data;
            }, AMMS.handleServiceError);
            window.open($rootScope.apiBaseUrl + "Export/GetemployeeDesignations?reportName=" + Encrypt.encrypt($scope.exportResult[0].Name), "_blank");
        }

        
        $scope.getBranchesByRoleAndBranch = function () {
            commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, $rootScope.user.Role).then(function (response) {
                $scope.BranchListMain = angular.copy(response.data);
                $scope.BranchListMain = $scope.BranchListMain.filter(function (el) {
                    return el.Value !== -100000;
                });
            }, AMMS.handleServiceError);
        }

        $scope.Init();
    }]);