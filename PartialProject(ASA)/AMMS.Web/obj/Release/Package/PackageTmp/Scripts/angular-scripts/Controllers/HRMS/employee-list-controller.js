ammsAng.controller('employeeListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.employeeListFull = [];
        $scope.employeeList = [];
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
        $scope.employeeToDelete = null;
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


        $scope.getEmployees = function () {
            $("#loadingImage").css("display", "block");
            //employeeService.getEmployeesWithBranchId($scope.selectedBranchId).then(function (responseEmployee) {
            //    console.log(responseEmployee.data);
            //    $scope.employeeList = responseEmployee.data;//.filter(emp=>emp.BranchId == $scope.selectedBranchId);
            //    $scope.employeeListFull = responseEmployee.data;

            //    $scope.employeeList.forEach(function(e) {
            //        e.BloodGroup = parseInt(e.BloodGroup);
            //       if (isNaN(e.BloodGroup)) {
            //            e.BloodGroup=111;
            //        }
            //       e.MobilePhoneNo = '+880'.concat( e.MobilePhoneNo);

            //    });
            $scope.employeeList = [];
            $scope.filterParams.fromInit = 1;
            employeeService.employeeAdvanceSearch("B.Name",
                "=",
                $rootScope.selectedBranchId.toString(),
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                1
            ).then(function (response) {
                $scope.employeeList = response.data;
                $scope.employeeList.forEach(function (e) {
                    e.BloodGroup = parseInt(e.BloodGroup);
                    if (isNaN(e.BloodGroup)) {
                        e.BloodGroup = 111;
                    }
                    e.MobilePhoneNo = '+880'.concat(e.MobilePhoneNo);
                });
               
            

                //if ($rootScope.user.Role != "0" && $rootScope.user.Role != "1" && $rootScope.user.Role != "12") {
                //    $scope.employeeList = responseEmployee.data.filter(emp=>emp.BranchId == $scope.selectedBranchId);
                //    $scope.employeeListFull = responseEmployee.data.filter(emp=>emp.BranchId == $scope.selectedBranchId);
                //}
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);
        }

        $scope.handleNonGeneralActions = function (actionName, employee) {
            $scope.employeeToDelete = employee;
            if (actionName === "DELETE") {
                $scope.deleteEmployee();
            }
        }

        $scope.$on('employee-add-finished', function () {
            $scope.getEmployees();
        });

        $scope.$on('employee-edit-finished', function () {
            $scope.getEmployees();
        });


        $scope.$on('employee-delete-finished', function () {
            $scope.getEmployees();
        });

        $scope.deleteEmployee = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.employee),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    employeeService.deleteEmployee($scope.employeeToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.employee), "Successful!", "success");
                            $rootScope.$broadcast('employee-delete-finished');
                        } else {
                            swal($rootScope.showMessage(response.data.Message, $rootScope.employee), "", "error");
                        }

                    }, AMMS.handleServiceError);
                });
        };

        $scope.searchEmployee = function () {
            $scope.filterParams.fromInit = -1;
            
            $scope.employeeList = [];
            employeeService.employeeAdvanceSearch($scope.searchArr[0].filterColumnName,
                $scope.searchArr[0].comparison,
                $scope.searchArr[0].searchValue,
                $scope.searchArr[1].filterColumnName,
                $scope.searchArr[1].comparison,
                $scope.searchArr[1].searchValue,
                $scope.searchArr[2].filterColumnName,
                $scope.searchArr[2].comparison,
                $scope.searchArr[2].searchValue,
                $scope.searchArr[0].radioOption,
                $scope.searchArr[1].radioOption
            ).then(function(response) {
                $scope.employeeList = response.data;
                $scope.employeeList.forEach(function(e)
                {
                      e.BloodGroup = parseInt(e.BloodGroup);
                   if (isNaN(e.BloodGroup)) {
                        e.BloodGroup=111;
        }
                   e.MobilePhoneNo = '+880'.concat(e.MobilePhoneNo);
                });
        }, AMMS.handleServiceError);
            //var k = -1;
            //if ($scope.searchArr[0].filterColumnName &&
            //    $scope.searchArr[0].comparison) {
            //    k = 0;
            //}
            //if ($scope.searchArr[0].filterColumnName &&
            //    $scope.searchArr[0].comparison &&
            //    $scope.searchArr[1].filterColumnName &&
            //    $scope.searchArr[1].comparison) {
            //    k = 1;
            //}
            //if ($scope.searchArr[0].filterColumnName &&
            //    $scope.searchArr[0].comparison &&
            //    $scope.searchArr[1].filterColumnName &&
            //    $scope.searchArr[1].comparison &&
            //    $scope.searchArr[2].filterColumnName &&
            //    $scope.searchArr[2].comparison) {
            //    k = 2;
            //}

            //if (k === 0) {
            //    var response = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 0);
            //    $scope.employeeList = response;
            //}

            //if (k === 1) {
            //    var firstQueryResult = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 0);
            //    if ($scope.searchArr[0].radioOption === "or") {
            //        var secondQuertResult1 = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 1);
            //        for (var j = 0; j < secondQuertResult1.length; j++) {
            //            if (!firstQueryResult.includes(secondQuertResult1[j])) {
            //                firstQueryResult.push(secondQuertResult1[j]);
            //            }
            //        }
            //        $scope.employeeList = firstQueryResult;
            //    }
            //    if ($scope.searchArr[0].radioOption === "and") {
            //        var secondQuertResult = employeeService.searchEmployee(firstQueryResult, $scope.searchArr, 1);
            //        $scope.employeeList = secondQuertResult;
            //    }
            //}

            //if (k === 2) {
            //    var firstQueryResult = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 0);

            //    if ($scope.searchArr[0].radioOption === "or") {
            //        var secondQuertResult = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 1);
            //        var thirdQuertResult = employeeService.searchEmployee($scope.employeeListFull, $scope.searchArr, 1);
            //        for (var j = 0; j < secondQuertResult.length; j++) {
            //            if (!firstQueryResult.includes(secondQuertResult[j])) {
            //                firstQueryResult.push(secondQuertResult[j]);
            //            }
            //        }
            //        for (var j = 0; j < thirdQuertResult.length; j++) {
            //            if (!firstQueryResult.includes(thirdQuertResult[j])) {
            //                firstQueryResult.push(thirdQuertResult[j]);
            //            }
            //        }
            //        $scope.employeeList = firstQueryResult;
            //    }

            //    if ($scope.searchArr[0].radioOption === "and") {

            //        var secondQuertResult = employeeService.searchEmployee(firstQueryResult, $scope.searchArr, 1);
            //        var thirdQueryResult = employeeService.searchEmployee(secondQuertResult, $scope.searchArr, 2);
            //        $scope.employeeList = thirdQueryResult;
            //    }
            //}
        };


        $scope.Init = function () {
            $scope.filterParams = {};
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;

                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
                $scope.getEmployees();
            }, AMMS.handleServiceError);

        };
        $scope.reloadPage = function () {
            $scope.employeeList = $scope.employeeListFull.filter(emp=>emp.BranchId == $scope.selectedBranchId);
            //if ($rootScope.user.Role != "0" && $rootScope.user.Role != "1" && $rootScope.user.Role != "12") {
            //    $scope.employeeList = $scope.employeeListFull.filter(emp=>emp.BranchId == $scope.selectedBranchId);
            //}
        }

        //$scope.exportData = function () {
        //    employeeService.getExportReportResult($scope.tab.PropertyId).then(function (responseResult) {
        //        $scope.exportResult = responseResult.data;fromInit
        //    }, AMMS.handleServiceError);
        //    window.open($rootScope.apiBaseUrl + "Export/GetEmployees?reportName=" + Encrypt.encrypt($scope.exportResult[0].Name), "_blank");
        //}

        $scope.exportData = function () {
            //$scope.filterParams = {};
                $scope.filterParams.filterColumn1 = $scope.searchArr[0].filterColumnName;
                $scope.filterParams.filterComparator1 = $scope.searchArr[0].comparison;
                $scope.filterParams.filterValue1 = $scope.searchArr[0].searchValue;
                $scope.filterParams.filterColumn2 = $scope.searchArr[1].filterColumnName;
                $scope.filterParams.filterComparator2 = $scope.searchArr[1].comparison;
                $scope.filterParams.filterValue2 = $scope.searchArr[1].searchValue;
                $scope.filterParams.filterColumn3 = $scope.searchArr[2].filterColumnName;
                $scope.filterParams.filterComparator3 = $scope.searchArr[2].comparison;
                $scope.filterParams.filterValue3 = $scope.searchArr[2].searchValue;
                $scope.filterParams.andOr1 = $scope.searchArr[0].radioOption;
                $scope.filterParams.andOr2 = $scope.searchArr[1].radioOption;

                var filterString = "";

                if ($scope.filterParams.fromInit == 1) {
                    $scope.filterParams.filterColumn1 = "B.Name";
                    $scope.filterParams.filterComparator1 = "=";
                    $scope.filterParams.filterValue1 = $rootScope.selectedBranchId.toString();
                }
                for (var property in $scope.filterParams) {
                    if ($scope.filterParams.hasOwnProperty(property)) {
                        if (property != "AssetTypeList" && property != "BranchList" && property != "CategoryList" &&
                            property != "DistrictList" && property != "Office" && property != "OfficeTypeList" && property != "OfficeTypeListMain"
                            && property != "StatusList" && property != "SubStatusList" && property != "ZoneList" && property != "RegionList")
                            filterString += property + "|" + $scope.filterParams[property] + "#";
                    }
                }
                
                var url = commonService.getExportUrl($rootScope.hrmsApiBaseUrl + 'employee/employee/advancedsearchexport', filterString, 'HRMS-Employee');
            window.open(url, '_blank');
        }
        $scope.Init();
    }]);