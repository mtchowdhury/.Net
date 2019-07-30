ammsAng.controller('feeListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'feeService',
    function ($scope, $rootScope, commonService, $timeout, feeService) {
        $scope.commandList = [];
        $scope.type = null;
        $scope.typeList = null;
        $scope.appliesTo = null;
        $scope.appliesToList = null;
        $scope.timeOfCharge = null;
        $scope.timeOfChargeList = null;
        $scope.feeCalculationMethod = null;
        $scope.feeCalculationMethodList = null;
        $scope.feePolicy = null;
        $scope.feePolicyList = null;
        $scope.fees = [];
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
		
		
        $scope.Init = function () {
            $scope.getFees();
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c => !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            });
            feeService.getFeeConfig("FeeType").then(function (response) {
                $scope.type = angular.copy(response.data);
                $scope.typeList = angular.copy(response.data);

            });
            feeService.getFeeConfig("FeeAppliesTo").then(function (response) {
                $scope.appliesTo = angular.copy(response.data);
                $scope.appliesToList = angular.copy(response.data);

            });
            feeService.getFeeConfig("TimeOfCharge").then(function (response) {
                $scope.timeOfCharge = angular.copy(response.data);
                $scope.timeOfChargeList = angular.copy(response.data);

            });
            feeService.getFeeConfig("FeeCalculationMethod").then(function (response) {
                $scope.feeCalculationMethod = angular.copy(response.data);
                $scope.feeCalculationMethodList = angular.copy(response.data);

            });
            feeService.getFeeConfig("PolicyType").then(function (response) {
                $scope.feePolicy = angular.copy(response.data);
                $scope.feePolicyList = angular.copy(response.data);

            });
            
        };

        $scope.$on('fee-add-finished', function () {
            $scope.getFees();
        });

        $scope.$on('fee-edit-finished', function () {
            $scope.getFees();
        });

        $scope.getFees = function () {
            $("#loadingImage").css("display", "block");
            feeService.getAll().then(function (response) {
                $scope.fees = response.data;
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            });
            

        }

        $scope.$on('fee-delete-finished', function () {
            $scope.getFees();
        });

        $scope.handleNonGeneralActions = function (actionName, fee) {
            if (actionName === "DELETE") {
                $scope.productToDelete = fee;
                $scope.deleteFee();
            }
        }

        $scope.deleteFee = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.fee),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    feeService.delete($scope.productToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.fee), "Successful!", "success");
                            $rootScope.$broadcast('fee-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.fee), response.data.Message, "error");
                        }

                    });
                });
        }

        $scope.Init();
    } 
]);