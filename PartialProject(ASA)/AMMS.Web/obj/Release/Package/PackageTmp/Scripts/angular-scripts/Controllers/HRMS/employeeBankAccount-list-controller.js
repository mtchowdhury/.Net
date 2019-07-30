ammsAng.controller('bankAccountListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'employeeBankAccountService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, employeeBankAccountService) {

        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];
        $scope.employeeBankAccountToDelete = null;

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


        $scope.$on('employee-bank-account-delete-finished', function () {
            $scope.getEmployeeBankAccounts();
        });
        $scope.$on('BankAccount-edit-finished', function () {
            $scope.getEmployeeBankAccounts();
        });
        $scope.$on('BankAccount-add-finished', function () {
            $scope.getEmployeeBankAccounts();
        });

        $scope.handleNonGeneralActions = function (actionName, employeeBankAccount) {
            $scope.employeeBankAccountToDelete = employeeBankAccount;
            if (actionName === "DELETE") {
                $scope.deleteEmployeeBankAccount();
            }
        }


        $scope.deleteEmployeeBankAccount = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.employeeBankAccount),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    employeeBankAccountService.deleteEmployeeBankAccountById($scope.employeeBankAccountToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.employeeBankAccount), "Successful!", "success");
                            $rootScope.$broadcast('employee-bank-account-delete-finished');
                        } else {
                            swal($rootScope.showMessage(response.data.Message, $rootScope.employeeBankAccount), "", "error");
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
                
                $scope.getEmployeeBankAccounts();
                
            }, AMMS.handleServiceError);

        };
        $scope.getEmployeeBankAccounts = function () {
            employeeBankAccountService.getEmployeeBankAccountsByOfficeCode($rootScope.selectedBranchId).then(function (response) {
                $scope.bankAccountList = response.data;
                $scope.bankAccountList.forEach(function (bankAccount) {
                    bankAccount.StartDate = moment(bankAccount.StartDate).format('DD/MM/YYYY');
                    //var endYear = moment(salaryStructure.EndDate).year();
                    bankAccount.EndDate = bankAccount.EndDate == null || bankAccount.EndDate == "0001-01-01T00:00:00" || bankAccount.EndDate == "1901-01-01T00:00:00" ? "" : moment(bankAccount.EndDate).format('DD/MM/YYYY');


                });
                console.log($scope.bankAccountList);
            }, AMMS.handleServiceError);
        }
        $scope.Init();
    }]);