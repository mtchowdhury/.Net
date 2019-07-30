ammsAng.controller('employeeTransferEditController', ['$scope', '$rootScope', '$timeout', 'employeeTransferService','commonService', 'DTOptionsBuilder',
    function ($scope, $rootScope, $timeout, employeeTransferService,  commonService, DTOptionsBuilder) {
        $scope.commandList = [];
        $scope.hasNonGeneralCommands = false;
       // $scope.EmployeeTransfer = {};
       // $scope.EmployeeTransfer.FromDistrictId = $rootScope.selectedDistrictId;
        $scope.OpenTransferDate = false;
        $scope.OpenJoiningDate = false;
        $scope.format = $rootScope.formats[4];
        $scope.editEmployeeTransfer = angular.copy($rootScope.editEmployeeTransfer);
       
       
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
        

        $scope.changeDistrict = function(str) {
            if (str === 'from') {
                $scope.filters.FilteredFromBranches = $scope.filters.branches.filter(e => e.RelationalValue === $scope.editEmployeeTransfer.FromDistrictId);
            }
            if (str === 'to')
            {
                $scope.filters.FilteredToBranches = $scope.filters.branches.filter(e => e.RelationalValue === $scope.editEmployeeTransfer.ToDistrictId);
                $scope.editEmployeeTransfer.ToBranchId = $scope.filters.FilteredToBranches[0].Value;

            }
        }

        $scope.getFilters = function () {
            employeeTransferService.getFilters().then(function (response) {
                $scope.filters = response.data;
                console.log($scope.filters);
                $scope.filters.FilteredBranches = [];
                $scope.getEmployee();
                $scope.updateAccounts();
               // $scope.getTransferEmployees();
                $timeout(function() {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);                
            }, AMMS.handleServiceError);
        }

        $scope.updateAccounts = function() {
            $scope.editEmployeeTransfer.Accounts.forEach(function(account) {
                account.TypeName = $scope.filters.employeeAccountTypeType.filter(e => e.Value === account.Type.toString())[0].Name;

            });
        }



        $scope.getTransferEmployees = function() {
            employeeTransferService.getTransferEmployees($rootScope.selectedBranchId).then(function (response) {
                $scope.transferEmployees = response.data;
                console.log($scope.filters);
                $scope.transferEmployees.forEach(function(employee) {
                    employee.formattedTransferDate = moment(employee.TransferDate).format("DD-MM-YYYY");
                    employee.toDisId = $scope.filters.branches.filter(b => b.Value === employee.ToBranchId)[0].RelationalValue;
                    employee.toDistrictName = $scope.filters.districts.filter(d => d.Value === employee.toDisId)[0].Name;
                    employee.StatusName = $scope.filters.employeeTransferStatuses.filter(s => s.Value === employee.Status.toString())[0].Name;
                });
                console.log($scope.transferEmployees);
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);
        }


        //new code
        $scope.$on('tab-switched', function () {
            if ($scope.editEmployeeTransfer.Id !== $rootScope.editEmployeeTransfer.Id) {
                $scope.editEmployeeTransfer = $rootScope.editEmployeeTransfer;
                $scope.getFilters();
            }
        });






        $scope.getEmployee = function () {
            $scope.editEmployeeTransfer.FromDistrictId = $scope.filters.branches.filter(b => b.Value === $scope.editEmployeeTransfer.FromBranchId)[0].RelationalValue;
            $scope.editEmployeeTransfer.TransferDate = new Date($scope.editEmployeeTransfer.TransferDate);
            $scope.editEmployeeTransfer.JoiningDate = new Date($scope.editEmployeeTransfer.JoiningDate );

            var name = $scope.editEmployeeTransfer.EmployeeName + '(' + $scope.editEmployeeTransfer.EmployeeId + ')';
            $scope.branchEmployees = [{ Value: $scope.editEmployeeTransfer.EmployeeId, Name: name }];
            $scope.editEmployeeTransfer.ToDistrictId = $scope.filters.branches.filter(b => b.Value === $scope.editEmployeeTransfer.ToBranchId)[0].RelationalValue;
            $scope.changeDistrict('from');
            $scope.filters.FilteredToBranches = $scope.filters.branches.filter(e => e.RelationalValue === $scope.editEmployeeTransfer.ToDistrictId);
            console.log($scope.editEmployeeTransfer);
        }


        function disabled(data) {


            var date = data.date,
              mode = data.mode;

            return (mode === 'day') && (date.getDay() === 5) || (moment(date) <= moment(new Date($rootScope.workingdate)));
        }

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            startingDay: 1
        };

        
       


        $scope.handleNonGeneralActions = function (actionName, member) {
            $scope.memberToDelete = member;
            if (actionName === "DELETE") {
                $scope.cancelTransfer();
            }
        }

        $scope.$on('employee-transfer-finished', function () {
            //$scope.getTransferEmployees();
           // $scope.EmployeeTransfer = {}
        });

        //$scope.$on('member-edit-finished', function () {
        //    $scope.getMenus();
        //    $scope.getMembers($scope.groupId);
        //});

        //$scope.$on('member-delete-finished', function () {
        //    $scope.getMenus();
        //    $scope.getMembers($scope.groupId);
        //});

        //$scope.$on('tab-switched', function () {
        //    //if ($scope.groupId !== $rootScope.groupIdOfMemberList) {
        //    //    $scope.getMembers($rootScope.groupIdOfMemberList);
        //    //}
           
        //});
        //$scope.$on('member-replace-finished', function () {
        //    console.log("broadcast recieved");
        //    $scope.getMenus();
        //    $scope.getMembers($scope.groupId);
        //});



        //$scope.deleteMember = function () {
        //    if (!$rootScope.isDayOpenOrNot()) return;
        //    transferService.IsMemberInTransferTransitState($scope.memberToDelete.Id, $rootScope.selectedBranchId).then(function (response) {
        //        if (response.data) {
        //            swal("The Member is in Transfer Transit State");
        //            return;
        //        }
        //        swal(
        //            commonService.swalHeaders($rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.member), "warning"),
        //            function() {
        //                employeeTransferService.deleteMember($scope.memberToDelete.Id).then(function(response) {
        //                    if (response.data.Success) {
        //                        swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.member), "Successful!", "success");
        //                        $rootScope.$broadcast('member-delete-finished');
        //                    } else {
        //                        swal($rootScope.showMessage($rootScope.deleteError, $rootScope.member), response.data.Message, "error");
        //                    }

        //                }, AMMS.handleServiceError);
        //            });
        //    });
        //};

       

        
        $scope.Init = function () {
           // $scope.getCommands();
            $scope.getFilters();
            
            
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


        $scope.editTransferEmployee = function () {
            if ($scope.editEmployeeTransfer.FromDistrictId == null || $scope.editEmployeeTransfer.ToDistrictId == null || $scope.editEmployeeTransfer.EmployeeId == null || $scope.editEmployeeTransfer.FromBranchId == null || $scope.editEmployeeTransfer.TransferDate == null || $scope.editEmployeeTransfer.FromBranchId == null) {
                swal("Please fill all the fields");
                return;
            }
            console.log($scope.editEmployeeTransfer);
            
            swal(
                    commonService.swalHeaders($rootScope.showMessage($rootScope.addConfirmation, $rootScope.editEmployeeTransferMsg), "warning"),
                    function () {
                        $scope.editEmployeeTransfer.TransferDate = moment($scope.editEmployeeTransfer.TransferDate).format();
                        $scope.editEmployeeTransfer.JoiningDate = moment($scope.editEmployeeTransfer.JoiningDate).format();
                        $scope.editEmployeeTransfer.BranchWorkingDate = moment($rootScope.workingdate).format();
                        $scope.editEmployeeTransfer.UpdatedBy = $rootScope.user.UserId;



                        employeeTransferService.EditEmployeeTransfer($scope.editEmployeeTransfer).then(function (response) {
                            if (response.data.Success) {
                                swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.editEmployeeTransferMsg), "Successful!", "success");
                                $rootScope.$broadcast('employee-transfer-edit-finished');
                            } else {
                                swal(response.data.Message);
                            }

                        }, AMMS.handleServiceError);
                    });
            
        };


    }]);