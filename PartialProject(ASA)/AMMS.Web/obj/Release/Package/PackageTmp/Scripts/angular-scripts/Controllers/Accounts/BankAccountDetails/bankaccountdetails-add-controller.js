ammsAng.controller('bankaccountDetailsAddController', ['$scope', '$rootScope', 'commonService', '$timeout', 'bankAccountDetailsService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'generalJournalService',
    function ($scope, $rootScope, commonService, $timeout, bankAccountDetailsService, DTOptionsBuilder, DTColumnDefBuilder, generalJournalService) {

        
        $scope.init = function () {

            //$scope.getFilterData();
            // $scope.addHrmTransaction();
            //console.log($scope.voucher);
        }

        $scope.saveVoucher = function () {

            swal({
                title: "confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.GeneralJournal),
                showCancelButton: true,
                confirmButtonText: "yes,Create it!",
                cancelButtonText: "No,Cancel!",
                type: 'info',
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.voucher.TransactionDate = moment($rootScope.branchWorkingDay).format();
                    $scope.voucher.BranchCode = $rootScope.selectedBranchId;
                    $scope.voucher.PostedBranchCode = $rootScope.selectedBranchId;
                    $scope.voucher.BranchWorkingDate = moment($rootScope.branchWorkingDay).format();

                    generalJournalService.addGeneralJournal($scope.voucher).then(function (response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('voucher-add-finished');
                            swal({
                                title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.GeneralJournal),
                                text: "What do you want to do next?",
                                type: "success",
                                showCancelButton: true,
                                confirmButtonColor: "#008000",
                                confirmButtonText: "Add New",
                                cancelButtonText: "Close and Exit",
                                closeOnConfirm: true,
                                closeOnCancel: true
                            },
                                function (isConfirmed) {
                                    if (isConfirmed) {
                                        $timeout(function () { $scope.clearModelData(); }, 300);
                                    } else {
                                        $timeout(function () { $scope.clearAndCloseTab(); }, 300);
                                    }
                                });
                        } else {

                            swal($rootScope.showMessage($rootScope.addError, $rootScope.GeneralJournal), response.data.Message, "error");
                        }
                    });
                }
            });
        }

        $scope.clearModelData = function () {
            $scope.voucher = {};
            $scope.voucher.GlTransactions = [];
            $scope.filters = {};
            $scope.debitSum = 0;
            $scope.creditSum = 0;
            $scope.voucher.Paytochecked = 'NO';
            $scope.voucher.TransactionDate = moment($rootScope.branchWorkingDay).format('DD-MM-YYYY');
            $scope.addHrmTransaction();
        }
        $scope.clearAndCloseTab = function () {
            $scope.voucher = {};

            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };


        

        $scope.init();

    }]);