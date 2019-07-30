ammsAng.controller('employeeReceiveListController', ['$scope', '$rootScope', '$timeout', 'employeeTransferService', 'commonService', 'DTOptionsBuilder',
    function ($scope, $rootScope, $timeout, employeeTransferService,  commonService, DTOptionsBuilder) {
        $scope.commandList = [];
        $scope.hasNonGeneralCommands = false;
        $scope.OpenTransferDate = false;
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
       
       
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
        
        $scope.getFilters = function () {
            employeeTransferService.getFilters().then(function (response) {
                $scope.filters = response.data;
                console.log($scope.filters);
                $scope.getTransferEmployees();
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);
        }


        $scope.getTransferEmployees = function() {
            employeeTransferService.getReceiveEmployees($rootScope.selectedBranchId).then(function (response) {
                $scope.transferEmployees = response.data;
                console.log($scope.filters);
                $scope.transferEmployees.forEach(function(employee) {
                    employee.formattedTransferDate = moment(employee.TransferDate).format("DD-MM-YYYY");
                    employee.formattedJoiningDate = moment(employee.JoiningDate).format("DD-MM-YYYY");
                    employee.fromDisId = $scope.filters.branches.filter(b => b.Value === employee.FromBranchId)[0].RelationalValue;
                    employee.FromDistrictName = $scope.filters.districts.filter(d => d.Value === employee.fromDisId)[0].Name;
                    employee.FromBranchName = $scope.filters.branches.filter(d => d.Value === employee.FromBranchId)[0].Name;
                    employee.StatusName = $scope.filters.employeeTransferStatuses.filter(s => s.Value === employee.Status.toString())[0].Name;
                    
                });
                console.log($scope.transferEmployees);
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);
        }


        $scope.handleNonGeneralActions = function (actionName, employeeTransfer) {
            $scope.employeeTranferId = employeeTransfer.Id;
            if (actionName === "Reject") {
                $scope.rejectTransfer();
            }
        }


        $scope.rejectTransfer= function() {
            swal(
                    commonService.swalHeaders($rootScope.showMessage($rootScope.rejectConfirmation, $rootScope.employeeTransfer), "warning"),
                    function () {
                        employeeTransferService.RejectEmployeeTransfer($scope.employeeTranferId).then(function (response) {
                            if (response.data.Success) {
                                swal($rootScope.showMessage($rootScope.rejectSucess, $rootScope.employeeTransfer), "Successful!", "success");
                                $rootScope.$broadcast('employee-reject-finished');
                            } else {
                                swal(response.data.Message);
                            }

                        }, AMMS.handleServiceError);
                    });




            
        }

        $scope.$on('employee-reject-finished', function () {
            $scope.Init();
           
        });

        $scope.$on('employee-transfer-finished', function () {
            $scope.Init();

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
            $scope.getCommands();
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

        
        $scope.Init();


        $scope.transferEmployee = function () {
            if ($scope.EmployeeTransfer.FromDistrictId == null || $scope.EmployeeTransfer.ToDistrictId == null || $scope.EmployeeTransfer.EmployeeId == null || $scope.EmployeeTransfer.FromBranchId == null || $scope.EmployeeTransfer.TransferDate == null || $scope.EmployeeTransfer.FromBranchId == null) {
                swal("Please fill all the fields");
                return;
            }
            console.log($scope.EmployeeTransfer);
            $scope.EmployeeTransfer.TransferDate = moment($scope.EmployeeTransfer.TransferDate).format();
            $scope.EmployeeTransfer.BranchWorkingDate = moment($rootScope.workingdate).format();
            $scope.EmployeeTransfer.CreatedBy = $rootScope.user.UserId;
            swal(
                    commonService.swalHeaders($rootScope.showMessage($rootScope.addConfirmation, $rootScope.employeeTransfer), "warning"),
                    function () {
                        employeeTransferService.AddEmployeeTransfer($scope.EmployeeTransfer).then(function (response) {
                            if (response.data.Success) {
                                swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.employeeTransfer), "Successful!", "success");
                                $rootScope.$broadcast('employee-transfer-finished');
                            } else {
                                swal(response.Data.Message);
                            }

                        }, AMMS.handleServiceError);
                    });
            
        };


    }]);