ammsAng.controller('loanAccountListController', [
    '$scope', '$rootScope', '$timeout', 'loanaccountService', 'commonService', 'transferService',
function ($scope, $rootScope, $timeout, loanaccountService, commonService, transferService) {

    $scope.memberId = $scope.selectedMenu.Id;
    $scope.commandList = [];
    $scope.hasNonGeneralCommands = false;
    $scope.loanAccounts = [];
    var dataTable_css = {
        "margin-left": "30px",
        "border-color": "#000"
    }
    console.log($scope.selectedMenu);
    $scope.memberId = $scope.selectedMenu.Id;
    //$scope.$on('tab-switched', function () {
    //    console.log($scope.selectedMenu.Id);
    //    $scope.getLoanAccounts($scope.selectedMenu.Id);
    //});

    $scope.getLoanAccounts = function (memberId) {
        $("#loadingImage").css("display", "block");
        loanaccountService.getLoanAccounts(memberId).then(function (response) {
            $scope.loanAccounts = response.data;
            console.log(response.data);
            $scope.loanAccounts.forEach(function (key) {
                key.OpeningDate = commonService.intToDate(key.OpeningDate);
				key.MemberId = memberId;
				key.ClosingDate =key.ClosingDate!=0? commonService.intToDate(key.ClosingDate):"";

            });

            $("#loadingImage").css("display", "none");
            $timeout(function () {
                $(".dataTables_filter label").css("margin-left", "10px");
                $(".dataTables_filter input").css(dataTable_css);
            }, 100);
        }, AMMS.handleServiceError);
    }

    $scope.Init = function () {
        $scope.savedLoanAccount = {};
        commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
            $scope.commandList = responseCommand.data;
            if ($scope.commandList.find(c=> !c.IsGeneral))
                $scope.hasNonGeneralCommands = true;
            $scope.getLoanAccounts($scope.memberId);
        }, AMMS.handleServiceError);
        $scope.getAccountDetails();

    };

    $scope.getAccountDetails = function() {
        loanaccountService.getLoanAccount($scope.editLoanAccountId).then(function(response) {
            $scope.savedLoanAccount = angular.copy(response.data);
        });
    }

    $scope.handleNonGeneralActions = function (actionName, loanAccount) {
        transferService.IsMemberInTransferTransitState($scope.memberId, $rootScope.selectedBranchId).then(function (response) {
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


    $scope.$on('loanAccount-add-finished', function () {
        $scope.getLoanAccounts($scope.memberId);
    });
    $scope.$on('loanAccount-edit-finished', function () {
        $scope.getLoanAccounts($scope.memberId);
    });
    $scope.$on('loanAccount-delete-finished', function () {
        $scope.getLoanAccounts($scope.memberId);
    });
    

    $scope.deleteAccount = function () {
        // LO cannot delete
        if ($rootScope.user.Role == $rootScope.UserRole.LO
            &&
            moment($scope.savedLoanAccount.CreateWorkingDate).format('YYYY-MM-DD') != moment($rootScope.workingdate).format('YYYY-MM-DD')) {
            swal("LO user doesn't have permission to delete loan account.");
            return;
        }
        if (!$rootScope.isDayOpenOrNot()) return;
        swal(
            commonService.swalHeaders($rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.loanAccount), "warning"),
            function () {
                loanaccountService.deleteLoanAccount($scope.actionedAccountId).then(function (response) {
                    if (response.data.Success) {
                        swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.loanAccount), "Successful!", "success");
                        $rootScope.$broadcast('loanAccount-delete-finished');
                        $scope.loanAccounts.splice($scope.loanAccounts.findIndex(e => e.Id === $scope.actionedAccountId), 1);
                    } else {
                        swal($rootScope.showMessage($rootScope.deleteError, $rootScope.loanAccount), response.data.Message, "error");
                    }

                }, AMMS.handleServiceError);
            });
    };

    $scope.Init();


}
]);