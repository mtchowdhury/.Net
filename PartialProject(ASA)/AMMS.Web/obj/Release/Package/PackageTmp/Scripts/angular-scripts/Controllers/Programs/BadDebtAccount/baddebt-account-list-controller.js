ammsAng.controller('baddebtaccountListController', [
    '$scope', '$rootScope', 'baddebtaccountService', 'commonService', '$timeout',
    function ($scope, $rootScope, baddebtaccountService, commonService, $timeout) {
        $scope.memberId = $scope.selectedMenu.Id;
        $scope.accounts = null;
        $scope.commandList = [];
        $scope.hasNonGeneralCommands = false;
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
        $scope.init = function () {
            $scope.getAccounts();
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            }, AMMS.handleServiceError);
        }

        $scope.handleNonGeneralActions = function (actionName, baddebtAccount) {
            if (actionName === "DELETE") {

                if (!$rootScope.isDayOpenOrNot()) return;
                swal(
                    commonService.swalHeaders($rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.badDebtAccount), "warning"),
                    function () {
                        baddebtaccountService.deleteBadDebtAccount(baddebtAccount.Id).then(function (response) {
                            if (response.data.Success) {
                                swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.badDebtAccount), "Successful!", "success");
                                $rootScope.$broadcast('bad-debt-account-delete-finished');
                                $scope.accounts.splice($scope.accounts.findIndex(e => e.Id === baddebtAccount.Id), 1);
                            } else {
                                swal($rootScope.showMessage($rootScope.deleteError, $rootScope.badDebtAccount), response.data.Message, "error");
                            }

                        }, AMMS.handleServiceError);
                    });
            }
        }
        $scope.$on('baddebtaccount-edit-finished', function () {
            $scope.getAccounts($scope.memberId);
        });
        $scope.getAccounts = function () {
            $("#loadingImage").css("display", "block");
            baddebtaccountService.getAccounts($scope.memberId).then(function (response) {
                $scope.accounts = response.data;
                $scope.accounts.forEach(function (element) {
                    element.DisburseDateForShow = moment(element.DisburseDate).format('DD-MM-YYYY');
                    element.BadDebtTransferDateForShow = moment(element.BadDebtTransferDate).format('DD-MM-YYYY');
                    element.ClosingDateForShow =element.ClosingDate==null?null: moment(element.ClosingDate).format('DD-MM-YYYY');
                });
                console.log(response.data);
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);
        }

        $scope.init();
    }
]);