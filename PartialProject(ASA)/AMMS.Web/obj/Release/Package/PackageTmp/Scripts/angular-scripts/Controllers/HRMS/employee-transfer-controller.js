ammsAng.controller('employeeTransferController', ['$scope', '$rootScope', '$timeout', 'employeeTransferService', 'commonService', 'DTOptionsBuilder', 'employeeReleaseService',
    function ($scope, $rootScope, $timeout, employeeTransferService, commonService, DTOptionsBuilder, employeeReleaseService) {
        $scope.commandList = [];
        $scope.hasNonGeneralCommands = false;
        $scope.EmployeeTransfer = {};
        $scope.EmployeeTransfer.FromDistrictId = $rootScope.selectedDistrictId;
        $scope.EmployeeTransfer.TransferDate = $rootScope.workingdate;
        $scope.OpenTransferDate = false;
        $scope.OpenJoiningDate = false;
        $scope.format = $rootScope.formats[4];

       
        
        
       
       
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
        

        $scope.changeDistrict = function(str) {
            if (str === 'from') {
                $scope.filters.FilteredFromBranches = $scope.filters.fbranches.filter(e => e.RelationalValue === $scope.EmployeeTransfer.FromDistrictId);
                if ($scope.EmployeeTransfer.FromDistrictId === $rootScope.selectedDistrictId) {
                    $scope.EmployeeTransfer.FromBranchId = $scope.filters.FilteredFromBranches.filter(e => e.Value === $rootScope.selectedBranchId)[0].Value;
                } else {
                    $scope.EmployeeTransfer.FromBranchId = $scope.filters.FilteredFromBranches[0].Value;
                }
            }
            if (str === 'to')
            {
                $scope.filters.FilteredToBranches = $scope.filters.branches.filter(e => e.RelationalValue === $scope.EmployeeTransfer.ToDistrictId);
                $scope.EmployeeTransfer.ToBranchId = $scope.filters.FilteredToBranches[0].Value;
            }
        }

        $scope.getFilters = function () {
            $scope.EmployeeTransfer.FromDistrictId = $rootScope.selectedDistrictId;
            employeeTransferService.getFilters().then(function (response) {
                $scope.filters = response.data;
                $scope.filters.FilteredBranches = [];
                console.log($scope.filters);
                var branchList = [];
                var districtList = [];
                $rootScope.supervisedBranches.forEach(function (e) {branchList.push(e.Value);});
                $scope.filters.fbranches = $scope.filters.branches.filter(e => branchList.indexOf(e.Value) !== -1);
                $scope.filters.fbranches.forEach(function (e) { districtList.push(e.RelationalValue); });
                $scope.filters.FilteredDistricts = $scope.filters.districts.filter(e => districtList.indexOf(e.Value) !== -1);



                $scope.changeDistrict('from');
                $scope.getTransferEmployees();
                $timeout(function() {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);                
            }, AMMS.handleServiceError);
        }


        $scope.getEmployeeDetailsReport = function () {
            $scope.employeeDetails = null;
            $scope.EmployeeName = $scope.branchEmployees.filter(e => e.Value == $scope.EmployeeTransfer.EmployeeId)[0].Name;
            employeeReleaseService.getEmployeeDetailsReport($scope.EmployeeTransfer.EmployeeId, $scope.EmployeeTransfer.ToBranchId, $scope.EmployeeTransfer.FromBranchId, $rootScope.workingdateInt).then(function (response) {
                $scope.employeeDetails = response.data;
                console.log($scope.employeeDetails);
            });
        }


        $scope.getTransferEmployees = function() {
            employeeTransferService.getTransferEmployees($rootScope.selectedBranchId).then(function (response) {
                $scope.transferEmployees = response.data;
               
                $scope.transferEmployees.forEach(function(employee) {
                    employee.formattedTransferDate = moment(employee.TransferDate).format("DD-MM-YYYY");
                    employee.formattedJoiningDate = moment(employee.JoiningDate).format("DD-MM-YYYY");
                    employee.toDisId = $scope.filters.branches.filter(b => b.Value === employee.ToBranchId)[0].RelationalValue;
                    employee.toDistrictName = $scope.filters.districts.filter(d => d.Value === employee.toDisId)[0].Name;
                    employee.StatusName = $scope.filters.employeeTransferStatuses.filter(s => s.Value === employee.Status.toString())[0].Name;
                });
                console.log($scope.transferEmployees);
                $scope.getEmployee();

                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);
        }





        $scope.getEmployee = function() {
            commonService.getEmployeeFilterFromSP($scope.EmployeeTransfer.FromBranchId, $rootScope.user.Role, $rootScope.user.EmployeeId, true, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                $scope.branchEmployees = response.data;
                console.log($scope.branchEmployees);
                var dataArray = Object.keys($scope.transferEmployees).map(function (k) { return $scope.transferEmployees[k].EmployeeId });
                $scope.branchEmployees = $scope.branchEmployees.filter(a => dataArray.indexOf(a.Value) === -1).filter(b=>b.Name.includes("*"));
               
            });


            //employeeTransferService.getEmployeeListByBranchId($scope.EmployeeTransfer.FromBranchId).then(function (response) {
            //    $scope.branchEmployees = response.data.filter(e=>e.RelationalValue ===1);

            //    var dataArray = Object.keys($scope.transferEmployees).map(function (k) { return $scope.transferEmployees[k].EmployeeId });
            //    console.log(dataArray);
            //    $scope.branchEmployees = $scope.branchEmployees.filter(a => dataArray.indexOf(a.Value)===-1);
            //    console.log($scope.branchEmployees);

            //}, AMMS.handleServiceError);
        }


        function disabled(data) {
            
            var date = data.date,
             mode = data.mode;
            //return (mode === 'day' && (date.getDay() === 5))
            //    || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.RM
            //    && (
            //     (moment(date) < moment(new Date($rootScope.workingdate)).add(29, 'days')))
            //    || (moment(date) > moment(new Date($rootScope.workingdate))))

            //    || ($rootScope.selectedBranchId > 0 && ($rootScope.user.Role == $rootScope.UserRole.BM || $rootScope.user.Role == $rootScope.UserRole.ABM )
            //    && (
            //    (moment(date) < moment(new Date($rootScope.workingdate)).add(29, 'days')))
            //    || (moment(date) > moment(new Date($rootScope.workingdate))))

            //    || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.DM
            //    && (
            //     (moment(date) < moment(new Date($rootScope.workingdate)).add(89, 'days')))
            //    || (moment(date) > moment(new Date($rootScope.workingdate))))

            //    || ($rootScope.selectedBranchId > 0 && $rootScope.user.Role == $rootScope.UserRole.Admin
            //    && (moment(date) > moment(new Date($rootScope.workingdate))))
            //;

            return (mode === 'day' && (date.getDay() === 5) || (moment(date) < moment(new Date($rootScope.workingdate))))
        }

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            startingDay: 1
        };

        
       


        $scope.handleNonGeneralActions = function (actionName, employeeTransfer) {
            $scope.employeeTransferDeleteId = employeeTransfer.Id;
            if (actionName === "DELETE") {
                $scope.cancelTransfer();
            }
        }

        $scope.$on('employee-transfer-finished', function () {
            $scope.getTransferEmployees();
          
        });

        $scope.$on('employee-transfer-edit-finished', function () {
            $scope.getTransferEmployees();
            
        });

        $scope.$on('employee-transfer-delete-finished', function () {
            $scope.getTransferEmployees();

        });
        
        



        $scope.cancelTransfer = function () {
            swal(
                 commonService.swalHeaders($rootScope.showMessage($rootScope.addConfirmation, $rootScope.employeeTransfer), "warning"),
                 function () {
                     employeeTransferService.cancelTransfer($scope.employeeTransferDeleteId).then(function (response) {
                         if (response.data.Success) {
                             swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.employeeTransfer), "Successful!", "warning");
                             $rootScope.$broadcast('employee-transfer-delete-finished');
                         } else {
                             swal(response.Data.Message);
                         }

                     }, AMMS.handleServiceError);
                 });
        };

       

        
        $scope.Init = function () {
            
            commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, $rootScope.user.Role).then(function (response) {
                $rootScope.supervisedBranches = angular.copy(response.data);
                $rootScope.supervisedBranches = $scope.supervisedBranches.filter(function (el) {
                    return el.Value !== -100000;
                });
                $scope.getCommands();
                $scope.getFilters();
                
            }, AMMS.handleServiceError);
            
            
            
            
        };
        
        $scope.getCommands = function() {
            employeeTransferService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            }, AMMS.handleServiceError);
            console.log($scope.commandList);
        }

        //$scope.exportData = function () {
        //    commonService.getExportReportResult($scope.tab.PropertyId).then(function (responseResult) {
        //        $scope.exportResult = responseResult.data;
        //        var methodName = "GetMembersByGroup";
        //        otherParam = JSON.stringify(otherParam);
        //        window.open($rootScope.apiBaseUrl + "Export/GetExportData?reportName=" + Encrypt.encrypt($scope.exportResult[0].Name) + "&methodName=" + Encrypt.encrypt(methodName) + "&otherParam=" + Encrypt.encrypt($scope.groupId), "_blank");
        //    }, AMMS.handleServiceError);
        //    }
        $scope.Init();


        $scope.transferEmployee = function () {
            if ($scope.EmployeeTransfer.FromDistrictId == null || $scope.EmployeeTransfer.ToDistrictId == null || $scope.EmployeeTransfer.EmployeeId == null || $scope.EmployeeTransfer.FromBranchId == null || $scope.EmployeeTransfer.TransferDate == null || $scope.EmployeeTransfer.FromBranchId == null) {
                swal("Please fill all the fields");
                return;
            }
            if ($scope.EmployeeTransfer.FromBranchId === $scope.EmployeeTransfer.ToBranchId) {
                swal("You shouldn't try transferring your own employee to your own branch,bruh!");
                return;
            }

            console.log($scope.EmployeeTransfer);
            
            swal(
                commonService.swalHeaders($rootScope.showMessage($rootScope.addConfirmation, $rootScope.employeeTransfer), "warning"),
                function () {
                    $scope.EmployeeTransfer.TransferDate = moment($scope.EmployeeTransfer.TransferDate).format();
                    var tempDate = $scope.EmployeeTransfer.JoiningDate;
                    $scope.EmployeeTransfer.JoiningDate = moment($scope.EmployeeTransfer.JoiningDate).format();
                    $scope.EmployeeTransfer.BranchWorkingDate = moment($rootScope.workingdate).format();
                    $scope.EmployeeTransfer.CreatedBy = $rootScope.user.UserId;


                    employeeTransferService.AddEmployeeTransfer($scope.EmployeeTransfer).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.employeeTransfer), "Successful!", "success");
                            $rootScope.$broadcast('employee-transfer-finished');
                        } else {
                            swal(response.data.Message);
                            $scope.EmployeeTransfer.TransferDate = $rootScope.workingdate;
                            $scope.EmployeeTransfer.JoiningDate = tempDate;
                        }

                }, AMMS.handleServiceError);
            });
            
        };


    }]);