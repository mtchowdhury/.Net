ammsAng.controller('employeeReceiveController', ['$scope', '$rootScope', '$timeout', 'employeeTransferService', 'commonService', 'DTOptionsBuilder',
    function ($scope, $rootScope, $timeout, employeeTransferService,  commonService, DTOptionsBuilder) {
        $scope.commandList = [];
        $scope.hasNonGeneralCommands = false;
        $scope.OpenTransferDate = false;
        $scope.format = $rootScope.formats[4];
        $scope.receiveEmployeeObj = angular.copy($rootScope.receiveEmployeeTransfer);
       
       
       
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
        

        

        $scope.getFilters = function () {
            employeeTransferService.getFilters().then(function (response) {
                $scope.filters = response.data;
               // $scope.getTransferEmployees();
                $timeout(function() {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);                
            }, AMMS.handleServiceError);
        }


        //$scope.getTransferEmployees = function() {
        //    employeeTransferService.getReceiveEmployees($rootScope.selectedBranchId).then(function (response) {
        //        $scope.transferEmployees = response.data;
        //        console.log($scope.filters);
        //        $scope.transferEmployees.forEach(function(employee) {
        //            employee.formattedTransferDate = moment(employee.TransferDate).format("DD-MM-YYYY");
        //            employee.toDisId = $scope.filters.branches.filter(b => b.Value === employee.ToBranchId)[0].RelationalValue;
        //            employee.toDistrictName = $scope.filters.districts.filter(d => d.Value === employee.toDisId)[0].Name;
        //            employee.StatusName = $scope.filters.employeeTransferStatuses.filter(s => s.Value === employee.Status.toString())[0].Name;
        //        });
        //        console.log($scope.transferEmployees);
        //        $timeout(function () {
        //            $(".dataTables_filter label").css("margin-left", "10px");
        //            $(".dataTables_filter input").css(dataTable_css);
        //        }, 100);
        //    }, AMMS.handleServiceError);
        //}


        $scope.$on('tab-switched', function () {
            if ($scope.receiveEmployeeObj.Id !== $rootScope.receiveEmployeeTransfer.Id) {
                $scope.receiveEmployeeObj = angular.copy($rootScope.receiveEmployeeTransfer);
            }
        });


       


        function disabled(data) {
            var date = data.date,
              mode = data.mode;
             return (mode === 'day') || (moment(date) > moment(new Date()).add(30, 'days'));
        }

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            startingDay: 1
        };

        
       


        $scope.handleNonGeneralActions = function (actionName, member) {
            //$scope.memberToDelete = member;
            //if (actionName === "DELETE") {
            //    $scope.cancelTransfer();
            //}
        }

        //$scope.$on('employee-transfer-finished', function () {
        //    $scope.getTransferEmployees();
        //   // $scope.EmployeeTransfer = {}
        //});

        

       

        
        $scope.Init = function () {
        };
      

       
        $scope.Init();

        $scope.clearAndCloseTab = function () {
            $scope.receiveEmployeeObj = {};
            $scope.execRemoveTab($scope.tab);
        };


        $scope.receiveEmployee = function () {
            
            swal(
                    commonService.swalHeaders($rootScope.showMessage($rootScope.receiveConfirmation, $rootScope.employee), "warning"),
                    function () {
                        employeeTransferService.ReceiveEmployeeTransfer($scope.receiveEmployeeObj.Id,$rootScope.selectedBranchId).then(function (response) {
                            if (response.data.Success) {
                                swal($rootScope.showMessage($rootScope.receiveSuccess, $rootScope.employeeTransfer), "Successful!", "success");
                                $rootScope.$broadcast('employee-transfer-finished');
                                $scope.clearAndCloseTab();
                            } else {
                                swal(response.data.Message);
                            }

                        }, AMMS.handleServiceError);
                    });
           

        };


    }]);