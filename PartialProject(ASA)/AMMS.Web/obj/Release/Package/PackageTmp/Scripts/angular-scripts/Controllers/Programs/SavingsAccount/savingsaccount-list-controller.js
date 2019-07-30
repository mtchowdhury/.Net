ammsAng.controller('savingsAccountListController', [
    '$scope', '$rootScope', '$timeout', 'savingsAccountService', 'commonService', 'transferService',
    function ($scope, $rootScope, $timeout, savingsAccountService, commonService, transferService) {

        //$scope.memberId = $scope.selectedMenu.Id;
        $scope.commandList = [];
        $scope.loanAccounts = [];
        $scope.roleId = $rootScope.user.Role;
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
        $scope.memberId = $scope.selectedMenu.Id;
        $scope.currentType = angular.copy($rootScope.clickedPropertyName);
        console.log($scope.memberId);

        $scope.getSavingsAccounts = function (memberId) {
            $("#loadingImage").css("display", "block");

            savingsAccountService.getSavingsAccounts(memberId).then(function (response) {
                $scope.savingsAccounts = response.data;
                $scope.savingsAccounts.forEach(function (account) {
                   // account.OpeningDate = moment(account.OpeningDate).format('DD-MM-YYYY');
                    account.OpeningDateStr = moment(account.OpeningDate).format('DD-MM-YYYY');
                    account.ClosingDateStr = account.ClosingDate != null ? moment(account.ClosingDate).format('DD-MM-YYYY') : null;
                });
                if ($scope.currentType === "Savings Account") {
                    $scope.savingsAccounts = $scope.savingsAccounts.filter(e => e.SavingsTypeName === "General" || e.SavingsTypeName === "LTS");
                } else {
                    $scope.savingsAccounts = $scope.savingsAccounts.filter(e => e.SavingsTypeName === "CBS");
                }
                console.log($scope.savingsAccounts);
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);
        }

        $scope.Init = function () {
            $scope.getSavingsAccounts($scope.memberId);
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                console.log(responseCommand.data);
                $scope.commandList = responseCommand.data;

                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            }, AMMS.handleServiceError);
        };

        $scope.handleNonGeneralActions = function (actionName, loanAccount) {
            transferService.IsMemberInTransferTransitState($scope.memberId, $rootScope.selectedBranchId).then(function(response) {
                if (response.data) {
                    swal("The Member is in Transfer Transit State");
                    return;
                }
                $scope.actionedAccountId = loanAccount.Id;
                if (actionName === "DELETE") {
                    $scope.deleteAccount();
                }
            });
        }


        $scope.$on('savingsAccount-add-finished', function () {
            $scope.getSavingsAccounts($scope.memberId);
        });

        $scope.$on('savingsAccount-edit-finished', function () {
            $scope.getSavingsAccounts($scope.memberId);
        });

        $scope.$on('savingsAccount-delete-finished', function () {
            $scope.getSavingsAccounts($scope.memberId);
        });

        $scope.deleteValidation=function() {
            var savingsAccount = $scope.savingsAccounts.find(s => s.Id == $scope.actionedAccountId);
            if (savingsAccount) {
                if ($scope.roleId == $rootScope.UserRole.LO || $scope.roleId == $rootScope.UserRole.ABM) {
                    if (moment(savingsAccount.OpeningDate).format('YYYY-MM-DD') != moment($rootScope.workingdate).format('YYYY-MM-DD'))
                        return false;
                }
                else if ($scope.roleId == $rootScope.UserRole.RM) {
                    if (moment(savingsAccount.OpeningDate).format('YYYY-MM-DD') < moment($rootScope.workingdate).add(-30, 'days').format('YYYY-MM-DD'))
                        return false;
                }
                else if ($scope.roleId == $rootScope.UserRole.DM) {
                    if (moment(savingsAccount.OpeningDate).format('YYYY-MM-DD') < moment($rootScope.workingdate).add(-90, 'days').format('YYYY-MM-DD'))
                        return false;
                }
            }
            return true;
        }
        $scope.deleteAccount = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            if (!$scope.deleteValidation()) {
                swal("You are not allowed to delete account on " + moment($rootScope.workingdate).format('YYYY-MM-DD'));
                return;
            }
            swal(
                commonService.swalHeaders($rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.savingsAccount), "warning"),
                function () {
                    savingsAccountService.deleteSavingsAccount($scope.actionedAccountId, $scope.memberId).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.savingsAccount), "Successful!", "success");
                            $rootScope.$broadcast('savingsAccount-delete-finished');
                            $scope.loanAccounts.splice($scope.loanAccounts.findIndex(e => e.Id === $scope.actionedAccountId), 1);
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.savingsAccount), response.data.Message, "error");
                        }

                    }, AMMS.handleServiceError);
                });
        };

        $scope.Init();


    }
]);