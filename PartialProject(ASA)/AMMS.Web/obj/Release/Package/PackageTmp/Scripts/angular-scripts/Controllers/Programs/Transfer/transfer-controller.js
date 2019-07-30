ammsAng.controller('transferController', [
    '$scope', '$rootScope', '$timeout', 'loanaccountService', 'branchService', 'filterService', 'loanGroupService', 'productService', 'workingDayService', 'commonService',
    'savingsAccountService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'feeService', 'transferService', 'employeeFilterService',
    function ($scope, $rootScope, $timeout, loanaccountService, branchService, filterService, loanGroupService, productService, workingDayService, commonService,
        savingsAccountService, DTOptionsBuilder, DTColumnDefBuilder, feeService, transferService, employeeFilterService) {

        var declareVariable = function () {
            $scope.transfer = {};
            $scope.transfer.TransferDate = moment($rootScope.workingdate).format('DD-MM-YYYY');
            $scope.TransferringGroupId = $scope.selectedMenu.Id;
            $scope.TransferringBranchId = $rootScope.selectedBranchId;
            $scope.transferdate = null;
            $scope.FromGroup = true;
            $scope.IsAllMemberSelectable = true;
            $scope.NomemSelected = true;
            $scope.accounts = [];
            $scope.TotalDisburseAmount = 0;
            $scope.TotalOutstandingAmount = 0;
            $scope.TotalOverdueAmount = 0;
            $scope.TotalSavingsBalance = 0;
            $scope.TotalLTSBalance = 0;
            $scope.TotalCbsBalance = 0;

            console.log($rootScope.selectedDistrictId);
        }
        declareVariable();

        $scope.beforeStartDateRender = function ($dates) {
            for (d in $dates) {
                if ($dates[d].utcDateValue !== moment($scope.workingDay).add(1, 'days').valueOf()) {
                    $dates[d].selectable = false;
                }
            }
        }
        //$scope.getDistrictBranchName = function() {
        //    $scope.transfer.AmmsTransferReceiveMembers.forEach(function (m) {
        //        if (m.ReceivingDistrictId != null) {
        //            //$scope.transfer.ReceivingDistrictId = m.ReceivingDistrictId;
        //            var district = $scope.districtListList.filter(function (obj) {
        //                return obj.Value === m.ReceivingDistrictId;
        //            });
        //            m.ReceivingDistrictName = district[0].Name;
        //            employeeFilterService.getBranchesOfDistrict(m.ReceivingDistrictId).then(function(response) {
        //                $scope.branchListMain = response.data;
        //                var branch = $scope.branchListMain.filter(function (obj) {
        //                    return obj.Value === m.ReceivingBranchId;
        //                });
        //                m.ReceivingBranchName = branch[0].Name;
        //                //$scope.transfer.ReceivingBranchId = m.ReceivingBranchId;
        //            });
                    
        //        }
        //    });
        //}

        $scope.getDistricts = function () {
            employeeFilterService.getAllDistricts().then(function (response) {
                $scope.districtListList = response.data;
                $scope.districtListList = $scope.districtListList.sort(function (a, b) {
                    var textA = a.Name.toUpperCase();
                    var textB = b.Name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                if ($scope.transfer.ReceivingDistrictId == null) $scope.transfer.ReceivingDistrictId = $scope.districtListList[0].Value;
                //$scope.districtListList.forEach(function(d) {
                //    if(d.Value === $scope.transfer.ReceivingDistrictId)
                //});
                $scope.getBranchsByDistrict($scope.transfer.ReceivingDistrictId);
            });
            $("#loadingImage").css("display", "none");
        }

        $scope.getBranchsByDistrict = function () {
            employeeFilterService.getBranchesOfDistrict($scope.transfer.ReceivingDistrictId).then(function (response) {
                console.log(response);
                $scope.branchList = response.data;
                $scope.branchList = $scope.branchList.sort(function (a, b) {
                    var textA = a.Name.toUpperCase();
                    var textB = b.Name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                $scope.branchList = $scope.branchList.filter(b => b.Value !== $scope.selectedBranchId);
                if ($scope.transfer.ReceivingBranchId == null || $scope.transfer.ReceivingBranchId === 0) $scope.transfer.ReceivingBranchId = $scope.branchList[0].Value;

                //$scope.getDistrictBranchName();
            });            
        }

        $scope.getTransferData = function () {
            $("#loadingImage").css("display", "block");
            $scope.transferdate = moment($rootScope.workingdate).format();
            transferService.GetTransferData($scope.TransferringBranchId, $scope.TransferringGroupId, $scope.transferdate).then(function (response) {
                console.log(response.data);
                $scope.transfer = response.data;
                
                //$scope.transfer.ReceivingDistrictId = response.data.AmmsTransferReceiveMembers[0].ReceivingDistrictId;
                //$scope.transfer.ReceivingBranchId = response.data.AmmsTransferReceiveMembers[0].ReceivingBranchId;
                // to maintain the data structure 
                $scope.transfer.TransferDate = moment($rootScope.workingdate).format('DD-MM-YYYY');
                //to show in modal 
                $scope.transfer.AmmsTransferReceiveMembers.forEach(function (m) {
                    m.AmmsTransferReceiveAccounts.forEach(function (a) {
                        //a.TransferredAccountId = a.TransferredAccountId;
                        a.SavingsOpeningDate = moment(a.SavingsOpeningDate).format('DD-MM-YYYY');
                        a.DisburseDate = moment(a.DisburseDate).format('DD-MM-YYYY');

                    });
                });
                for (var i = 0; i < $scope.transfer.AmmsTransferReceiveMembers.length; i++) {
                    for (var j = 0; j < $scope.transfer.AmmsTransferReceiveMembers[i].AmmsTransferReceiveAccounts.length; j++) {
                        if ($scope.transfer.AmmsTransferReceiveMembers[i].AmmsTransferReceiveAccounts[j].AccountStatus === $rootScope.SavingsConfig.SavingsAccountStatus.Active &&
                            $scope.transfer.AmmsTransferReceiveMembers[i].AmmsTransferReceiveAccounts[j].AccountTypeId !== $rootScope.AccountType.Loan)
                            $scope.transfer.AmmsTransferReceiveMembers[i].AmmsTransferReceiveAccounts[j].noActiveAccounts = false;
                        else if ($scope.transfer.AmmsTransferReceiveMembers[i].AmmsTransferReceiveAccounts[j].AccountStatus === $rootScope.LoanAccountStatus.Active &&
                            $scope.transfer.AmmsTransferReceiveMembers[i].AmmsTransferReceiveAccounts[j].AccountTypeId === $rootScope.AccountType.Loan)
                            $scope.transfer.AmmsTransferReceiveMembers[i].AmmsTransferReceiveAccounts[j].noActiveAccounts = false;
                    }
                }



                $scope.getDistricts();
                $scope.checkAllMemberSelectable();
                $scope.UpdateTotalPrice();
            });
        }

        $scope.ChangeAllCheck = function () {
            if ($scope.allMembers) {
                $scope.transfer.AmmsTransferReceiveMembers.forEach(function (m) {
                    m.IsChecked = true;
                });
            }
            if (!$scope.allMembers) {
                $scope.transfer.AmmsTransferReceiveMembers.forEach(function (m) {
                    m.IsChecked = false;
                });
            }
            $scope.UpdateTotalPrice();
        }

        $scope.checkAllMemberSelectable = function () {
            for (var i = 0; i < $scope.transfer.AmmsTransferReceiveMembers.length; i++) {
                if ($scope.transfer.AmmsTransferReceiveMembers[i].TransferStatus === 1 || $scope.transfer.AmmsTransferReceiveMembers[i].noActiveAccounts ||
                    ($scope.transfer.AmmsTransferReceiveMembers[i].OutstandingAmount === 0 && $scope.transfer.AmmsTransferReceiveMembers[i].SavingsBalance === 0 &&
                    $scope.transfer.AmmsTransferReceiveMembers[i].SavingsBalance === 0 && $scope.transfer.AmmsTransferReceiveMembers[i].CbsBalance === 0)) {
                    $scope.IsAllMemberSelectable = false;
                    break;
                }
            }            
        }
        $scope.setModaldata = function (member) {
            $scope.MemberName = member.MemberName;
            $scope.accounts = member.AmmsTransferReceiveAccounts;
            $scope.accounts.forEach(function(a) {
                a.DisburseAmount = Math.round(a.DisburseAmount);
                a.OutstandingAmount = Math.round(a.OutstandingAmount);
                a.OverDueAmount = Math.round(a.OverDueAmount);

            });
            console.log($scope.accounts);
        }

        

        $scope.cancelMemberTransfer = function(ammsMember) {

            ammsMember.ProgramOfficerId = $scope.selectedMenu.ProgramOfficerId;
            ammsMember.TransferBranchWorkingDate = moment($rootScope.workingdate).format();
            ammsMember.TransferDate = moment($rootScope.workingdate).format();
            ammsMember.TransferStatus = $rootScope.TransferStatus.TransferIInitiated;
            ammsMember.TransferredFromBranchId = $rootScope.selectedBranchId;
            ammsMember.TransferredFromDistrictId = $rootScope.selectedDistrictId;
            ammsMember.TransferredFromGroupId = $scope.selectedMenu.Id;
            ammsMember.TransferredFromGroupName = $scope.selectedMenu.Name;
            ammsMember.TransferredMemberId = ammsMember.Id;
            
            swal({
                title: $rootScope.showMessage($rootScope.transferCancleConfirmation, $rootScope.member),
                    showCancelButton: true,
                    confirmButtonText: "Yes, Cancel it!",
                    cancelButtonText: "No!",
                    type: "info",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                },
                function(isConfirmed) {
                    if (isConfirmed) {
                        transferService.cancelTransfer(ammsMember).then(function(response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('groupmember-transfer-cancel-finished', $scope.transfer);
                                swal($rootScope.showMessage($rootScope.transferCancelSuccess, $rootScope.member), "Successful!", "success");
                                $scope.getTransferData();
                                //$scope.clearAndCloseTab();

                            } else {
                                swal($rootScope.showMessage(response.data.Message, $rootScope.member), "", "error");
                            }
                        }, AMMS.handleServiceError);
                    } else {
                        swal("Cancelled", "something is wrong", "error");
                    }
                });
        }
        //check to see if whole group transfer
        $scope.transferGroup = function () {

            if ($scope.transfer.ReceivingBranchId == null) {
                swal("please select receiving branch");
                return;
            }
            for (var i = 0; i < $scope.transfer.AmmsTransferReceiveMembers.length; i++) {
                if (!$scope.transfer.AmmsTransferReceiveMembers[i].IsChecked && $scope.transfer.AmmsTransferReceiveMembers[i].Status !== 1) {
                    $scope.FromGroup = false;
                    break;
                }
            }
            for (var i = 0; i < $scope.transfer.AmmsTransferReceiveMembers.length; i++) {
                if ($scope.transfer.AmmsTransferReceiveMembers[i].IsChecked) {
                    $scope.NomemSelected = false;
                    break;
                }
            }
            //$scope.transfer.AmmsTransferReceiveMembers.forEach(function(m) {
            //    if (!m.IsChecked) {
            //        $scope.transfer.AmmsTransferReceiveMembers.splice($scope.transfer.AmmsTransferReceiveMembers.indexOf(m), 1);
            //    }
            //});

            $scope.transfer.AmmsTransferReceiveMembers = $scope.transfer.AmmsTransferReceiveMembers.filter(function (member) {
                return member.IsChecked === true;
            });
            
            //$scope.transfer.AmmsTransferReceiveMembers.forEach(function(member) {
                //if (($scope.FromGroup && member.OutstandingAmount === 0 && member.SavingsBalance === 0 &&
                //    member.SavingsBalance === 0 && member.CbsBalance === 0) ||
                //    member.noActiveAccounts) {
            //        swal("Group Tansfer Cannot be done. One / more members have no active account or no savings balance or loan outstanding");
            //        return;
            //    }
            //});
            if ($scope.NomemSelected) {
                swal("No Member Selected");
                return;
            }


            $scope.transfer.ProgramOfficerId = $scope.selectedMenu.ProgramOfficerId;
            $scope.transfer.TransferBranchWorkingDate = moment($rootScope.workingdate).format();
            $scope.transfer.TransferDate = moment($rootScope.workingdate).format();
            //$scope.transfer.TransferStatus = $rootScope.TransferStatus.TransferIInitiated;
            $scope.transfer.TransferredFromBranchId = $rootScope.selectedBranchId;
            $scope.transfer.TransferredFromGroupId = $scope.selectedMenu.Id;
            $scope.transfer.TransferredFromDistrictId = $rootScope.selectedDistrictId;
            $scope.transfer.TransferredFromGroupName = $scope.selectedMenu.Name;
            $scope.transfer.AmmsTransferReceiveMembers.forEach(function (m) {
                //if (!m.IsChecked) {
                //    $scope.transfer.AmmsTransferReceiveMembers.splice($scope.transfer.AmmsTransferReceiveMembers.indexOf(m), 1);
                //}
                m.ProgramOfficerId = $scope.selectedMenu.ProgramOfficerId;
                    m.TransferBranchWorkingDate = moment($rootScope.workingdate).format();
                    m.TransferDate = moment($rootScope.workingdate).format();
                    //m.TransferStatus = $rootScope.TransferStatus.TransferIInitiated;
                    m.TransferredFromBranchId = $rootScope.selectedBranchId;
                    m.TransferredFromDistrictId = $rootScope.selectedDistrictId;
                    m.TransferredFromGroupId = $scope.selectedMenu.Id;
                    m.TransferredFromGroupName = $scope.selectedMenu.Name;
                    m.ReceivingDistrictId = $scope.transfer.ReceivingDistrictId;
                    m.ReceivingBranchId = $scope.transfer.ReceivingBranchId;
                    m.TransferredMemberId = m.Id;
                    m.FromGroup = $scope.FromGroup;
                    m.AmmsTransferReceiveAccounts.forEach(function(a) {
                        a.ReceivingBranchId = $scope.transfer.ReceivingBranchId;
                        a.ReceivingDistrictId = $scope.transfer.ReceivingDistrictId;
                        a.TransferBranchWorkingDate = moment($rootScope.workingdate).format();
                        a.TransferDate = moment($rootScope.workingdate).format();
                        //a.TransferStatus = $rootScope.TransferStatus.TransferIInitiated;
                        a.TransferredFromBranchId = $rootScope.selectedBranchId;
                        a.TransferredFromDistrictId = $rootScope.selectedDistrictId;
                        a.TransferredFromGroupId = $scope.selectedMenu.Id;
                        a.TransferredMemberId = m.Id;
                    });
                
            });
            console.log($scope.transfer);

            workingDayService.getDateOfBranch($scope.transfer.ReceivingBranchId).then(function (response) {
                var receivingBranchDate = moment(response.data.date.toString().slice(0, 8)).toDate();
                if (moment(receivingBranchDate).format('YYYY-MM-DD') !== moment($rootScope.workingdate).format('YYYY-MM-DD')) {
                    swal("Receiving Branch and Transferring Branch Working Date does not match" +
                        "\n Receiving Br : " + moment(receivingBranchDate).format('DD-MM-YYYY') +
                        "\n Transferring Br : " + moment($rootScope.workingdate).format('DD-MM-YYYY'));
                    return;
                }
                else 
                    swal({
                        title: $rootScope.showMessage($rootScope.transferConfirmation, $rootScope.groupMemberTransfer),
                        showCancelButton: true,
                        confirmButtonText: "Yes, transfer it!",
                        cancelButtonText: "No, cancel !",
                        type: "info",
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true,
                    },
                function (isConfirmed) {
                    if (isConfirmed) {
                        transferService.transferGroup($scope.transfer).then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('groupmember-transfer-finished', $scope.transfer);
                                swal($rootScope.showMessage($rootScope.transferSuccess, $rootScope.groupMemberTransfer), "Successful!", "success");
                                $scope.getTransferData();
                                //$scope.clearAndCloseTab();

                            } else {
                                swal($rootScope.showMessage($rootScope.transferError, $rootScope.loanAccount), "", "error");
                            }
                        }, AMMS.handleServiceError);
                    } else {
                        swal("Cancelled", "something is wrong", "error");
                    }
                });
            });          
        }

        $scope.UpdateTotalPrice = function () {
            $scope.TotalDisburseAmount = 0;
            $scope.TotalOutstandingAmount = 0;
            $scope.TotalOverdueAmount = 0;
            $scope.TotalSavingsBalance = 0;
            $scope.TotalLTSBalance = 0;
            $scope.TotalCbsBalance = 0;
            $scope.transfer.AmmsTransferReceiveMembers.forEach(function(m) {
                if (m.IsChecked) {
                    $scope.TotalDisburseAmount += m.DisburseAmount;
                    $scope.TotalOutstandingAmount += m.OutstandingAmount;
                    $scope.TotalOverdueAmount += m.OverdueAmount;
                    $scope.TotalSavingsBalance += m.SavingsBalance;
                    $scope.TotalLTSBalance += m.LTSBalance;
                    $scope.TotalCbsBalance += m.CbsBalance;
                }
            });
        }

        $scope.init = function () {
            $scope.getTransferData();
        }
        $scope.init();

    }
]);