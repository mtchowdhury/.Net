ammsAng.controller('bankaccountDetailsListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'bankAccountDetailsService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'generalJournalService',
    function ($scope, $rootScope, commonService, $timeout, bankAccountDetailsService, DTOptionsBuilder, DTColumnDefBuilder, generalJournalService) {

        ///$rootScope.onlyChildSelectable = false;
       // $rootScope.$broadcast('coa-popup-opened');
        $scope.bankAccountList = [];

        $scope.dtOptions = DTOptionsBuilder.newOptions()
               .withPaginationType('full_numbers')
               .withDisplayLength(20);
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

        $scope.init = function () {
            $("#loadingImage").css("display", "block");
            $scope.getCommandList();
            $scope.getBankAccountList();
        }

        $scope.setBankObjectAtRoot=function(bank) {
            $rootScope.bankObject = bank;
        }

        $scope.getBankAccountList = function () {
            bankAccountDetailsService.getBankAccountListByBranchId($rootScope.selectedBranchId).then(function (response) {//to be changed to $rootScope.selectedBranchId
                $scope.bankAccountList = response.data;
                $("#loadingImage").css("display", "none");
             });
        }

        $scope.getCommandList=function() {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
              
            }, AMMS.handleServiceError);
        }
        //$scope.saveVoucher=function() {
            
        //        swal({
        //            title: "confirm?",
        //            text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.GeneralJournal),
        //            showCancelButton: true,
        //            confirmButtonText: "yes,Create it!",
        //            cancelButtonText: "No,Cancel!",
        //            type: 'info',
        //            closeOnConfirm: false,
        //            showLoaderOnConfirm: true
        //        }, function (isConfirmed) {
        //            if (isConfirmed) {
        //                $scope.voucher.TransactionDate = moment($rootScope.branchWorkingDay).format();
        //                $scope.voucher.BranchCode = $rootScope.selectedBranchId;
        //                $scope.voucher.PostedBranchCode = $rootScope.selectedBranchId;
        //                $scope.voucher.BranchWorkingDate = moment($rootScope.branchWorkingDay).format();

        //                generalJournalService.addGeneralJournal($scope.voucher).then(function (response) {
        //                    if (response.data.Success) {
        //                        $rootScope.$broadcast('voucher-add-finished');
        //                        swal({
        //                            title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.GeneralJournal),
        //                            text: "What do you want to do next?",
        //                            type: "success",
        //                            showCancelButton: true,
        //                            confirmButtonColor: "#008000",
        //                            confirmButtonText: "Add New",
        //                            cancelButtonText: "Close and Exit",
        //                            closeOnConfirm: true,
        //                            closeOnCancel: true
        //                        },
        //                            function (isConfirmed) {
        //                                if (isConfirmed) {
        //                                    $timeout(function () { $scope.clearModelData(); }, 300);
        //                                } else {
        //                                    $timeout(function () { $scope.clearAndCloseTab(); }, 300);
        //                                }
        //                            });
        //                    } else {
                                
        //                        swal($rootScope.showMessage($rootScope.addError, $rootScope.GeneralJournal), response.data.Message, "error");
        //                    }
        //                });
        //            }
        //        });
        //}
        $scope.$on('bankAccount-add-finished', function () {
            $scope.getBankAccountList();
        });
        $scope.clearModelData = function () {
            $scope.Bank = {};
            
            $scope.Bank.TransactionDate = moment($rootScope.branchWorkingDay).format('DD-MM-YYYY');
            
        }
        $scope.clearAndCloseTab = function () {
            $scope.Bank = {};
            
            $timeout(function () {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };

        $scope.init();

    }]);