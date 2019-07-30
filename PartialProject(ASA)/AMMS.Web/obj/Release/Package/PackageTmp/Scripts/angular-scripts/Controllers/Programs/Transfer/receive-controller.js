ammsAng.controller('receiveController', [
    '$scope', '$rootScope', '$timeout', 'loanaccountService', 'branchService', 'filterService', 'loanGroupService', 'productService', 'workingDayService', 'commonService',
    'savingsAccountService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'feeService', 'receiveService',
    function ($scope, $rootScope, $timeout, loanaccountService, branchService, filterService, loanGroupService, productService, workingDayService, commonService,
        savingsAccountService, DTOptionsBuilder, DTColumnDefBuilder, feeService, receiveService) {

        $scope.GroupList = [];
        $scope.LAccounts = [];
        $scope.SAccounts = [];
        $scope.Members = [];
        $scope.selectedGroup = {};
        $scope.selectedMember = {};
        $scope.acceptButtonShow = false;
        $scope.ProgramOfficerList = [];
        $scope.pOfficerId = {};
        $scope.GeneralSettingForAllmember = [];
        $scope.checkAll = false;
        $scope.TotalNoOfLoans = 0;
        $scope.TotalDisburseAmount = 0;
        $scope.TotalOutstandingAmount = 0;
        $scope.TotalOverdueAmount = 0;
        $scope.TotalSavingsBalance = 0;
        $scope.TotalCbsBalance = 0;
        $scope.TotalLtsBalance = 0;
        $scope.TotalNoofLts = 0;

        $scope.changeBool = function () {
            $scope.selected = !$scope.selected;
            if ($scope.selected !== undefined && $scope.selected) {
                $scope.booler = false;
            } else {
                $scope.booler = true;
            }
        }

        $scope.setMeetingDayModel = function ($index) {
            if ($scope.GeneralSettingForAllmember.GroupListFiltered.length > 0) $scope.GeneralSettingForAllmember.MeetingDayName = $scope.GeneralSettingForAllmember.GroupListFiltered.filter(word => word.Id === $scope.GeneralSettingForAllmember.TransferredToGroupId)[0].MeetingDayName;

            //$scope.GeneralSettingForAllmember.GroupListFiltered[$scope.GeneralSettingForAllmember.TransferredToGroupId].MeetingDayName;


            console.log($scope.GeneralSettingForAllmember, $index);
        }

        $scope.init = function () {
            $("#loadingImage").css("display", "block");
            receiveService.getGroups($scope.selectedBranchId).then(function (response) {
                $scope.Groups = response.data;
                console.log(response.data);
                $scope.memberUpdate(1);

                branchService.getGroups($scope.selectedBranchId).then(function (response) {
                    $scope.GroupList = JSON.parse(response.data);
                    console.log(JSON.parse(response.data));

                    receiveService.getMembers($scope.selectedBranchId).then(function (response) {
                        $scope.Members = response.data;
                        console.log(response.data);
                        $scope.memberUpdate(0);

                        branchService.getLoanfficersOfBrnach($scope.selectedBranchId).then(function (response) {
                            $scope.ProgramOfficerList = response.data;
                            console.log(response.data);
                            $("#loadingImage").css("display", "none");
                        });
                    });
                });
            });






        }

        $scope.detailsModal = function ($parent, $index) {
            $scope.LAccounts = [];
            $scope.SAccounts = [];
            $scope.acceptButtonShow = false;
            console.log($parent, $index, $scope.Groups[$parent].AmmsTransferReceiveMembers[$index]);
            $scope.selectedMember = $scope.Groups[$parent].AmmsTransferReceiveMembers[$index];
            $scope.selectedMember.AmmsTransferReceiveAccounts.forEach(function (element) {
                if (element.AccountTypeId == 1) $scope.LAccounts.push(element);
                else $scope.SAccounts.push(element);
            });
        }

        $scope.detailsModalMember = function ($index) {
            $scope.LAccounts = [];
            $scope.SAccounts = [];
            $scope.acceptButtonShow = false;
            $scope.selectedMember = $scope.Members[$index];
            //if ($scope.selectedMember.ReceivingOrRejectNote == null ||
            //    $scope.selectedMember.ReceivingOrRejectNote == "") {
            //    alert("Note required");
            //    return;
            //}
            $scope.selectedMember.AmmsTransferReceiveAccounts.forEach(function (element) {
                //console.log(element);
                if (element.AccountTypeId == 1) $scope.LAccounts.push(element);
                else $scope.SAccounts.push(element);
            });
        }

        $scope.detailsModalMemberButton = function ($index) {
            $scope.LAccounts = [];
            $scope.SAccounts = [];
            $scope.acceptButtonShow = true;
            $scope.selectedMember = $scope.Members[$index];
            //if ($scope.selectedMember.ReceivingOrRejectNote == null ||
            //    $scope.selectedMember.ReceivingOrRejectNote == "") {
            //    alert("Note required");
            //    return;
            //}
            $scope.selectedMember.AmmsTransferReceiveAccounts.forEach(function (element) {
                console.log(element);
                if (element.AccountTypeId == 1) $scope.LAccounts.push(element);
                else $scope.SAccounts.push(element);
            });
        }

        $scope.detailsModalForGroup = function ($index) {
            $scope.selectedGroup = $scope.Groups[$index];
            console.log($index, $scope.Groups[$index]);
            $scope.Groups[$index].AmmsTransferReceiveMembers.forEach(function (member) {
                member.LAccounts = [];
                member.SAccounts = [];
                member.AmmsTransferReceiveAccounts.forEach(function (element) {
                    if (element.AccountTypeId == 1) member.LAccounts.push(element);
                    else member.SAccounts.push(element);
                });
            });
        }

        $scope.memberUpdate = function ($fromGroup) {
            if ($fromGroup) {
                $scope.Groups.forEach(function (group) {
                    group.TransferDate = moment(group.TransferDate).format("MM-DD-YYYY");
                    group.AmmsTransferReceiveMembers.forEach(function (member) {
                        member.TransferDate = moment(member.TransferDate).format("MM-DD-YYYY");
                        member.NoofLts = 0;
                        member.LtsBalance = 0;
                        member.NoOfLoans = 0;
                        member.TotalDisburseAmount = 0;
                        member.TotalOutstandingAmount = 0;
                        member.TotalOverdueAmount = 0;
                        member.SavingsBalance = 0;
                        member.CbsBalance = 0;
                        member.AmmsTransferReceiveAccounts.forEach(function (account) {
                            account.DisburseDate = moment(account.DisburseDate).format("MM-DD-YYYY");
                            account.SavingsOpeningDate = moment(account.SavingsOpeningDate).format("MM-DD-YYYY");
                            if (account.AccountTypeId == 4) {
                                member.NoofLts = member.NoofLts + 1;
                                member.LtsBalance += account.SavingsBalance;
                            }
                            if (account.AccountTypeId == 1) {
                                member.NoOfLoans = member.NoOfLoans + 1;
                                member.TotalDisburseAmount = parseFloat(member.TotalDisburseAmount + account.DisburseAmount).toFixed(2);
                                member.TotalOutstandingAmount =
                                parseFloat(member.TotalOutstandingAmount + account.OutstandingAmount).toFixed(2);
                                member.TotalOverdueAmount =
                                parseFloat(member.TotalOverdueAmount + account.OverDueAmount).toFixed(2);
                            } if (account.AccountTypeId == 2) {
                                member.SavingsBalance = member.SavingsBalance + account.SavingsBalance;

                            } if (account.AccountTypeId == 3) {
                                //console.log(account, member.CbsBalance, account.SavingsBalance);
                                member.CbsBalance = member.CbsBalance + account.SavingsBalance;
                            }
                        });
                    });
                });
            } else {
                $scope.Members.forEach(function (member) {
                    member.TransferDate = moment(member.TransferDate).format("MM-DD-YYYY");
                    member.GroupListFiltered = angular.copy($scope.GroupList);
                    member.NoofLts = 0;
                    member.NoofLts = 0;
                    member.LtsBalance = 0;
                    member.NoOfLoans = 0;
                    member.TotalDisburseAmount = 0;
                    member.TotalOutstandingAmount = 0;
                    member.TotalOverdueAmount = 0;
                    member.SavingsBalance = 0;
                    member.CbsBalance = 0;
                    member.AmmsTransferReceiveAccounts.forEach(function (account) {
                        account.DisburseDate = moment(account.DisburseDate).format("MM-DD-YYYY");
                        account.SavingsOpeningDate = moment(account.SavingsOpeningDate).format("MM-DD-YYYY");
                        if (account.AccountTypeId == 4) {
                            member.NoofLts = member.NoofLts + 1;
                            member.LtsBalance += account.SavingsBalance;
                        }
                        if (account.AccountTypeId == 1) {
                            member.NoOfLoans = member.NoOfLoans + 1;
                            member.TotalDisburseAmount = member.TotalDisburseAmount + account.DisburseAmount;
                            member.TotalOutstandingAmount = member.TotalOutstandingAmount + account.OutstandingAmount;
                            member.TotalOverdueAmount = member.TotalOverdueAmount + account.OverDueAmount;
                        } if (account.AccountTypeId == 2) {
                            member.SavingsBalance = member.SavingsBalance + account.SavingsBalance;

                        } if (account.AccountTypeId == 3) {
                            member.CbsBalance = member.CbsBalance + account.SavingsBalance;
                        }
                    });
                    member.TotalDisburseAmount = Math.round(member.TotalDisburseAmount);
                    member.TotalOutstandingAmount = Math.round(member.TotalOutstandingAmount);
                    member.TotalOverdueAmount = Math.round(member.TotalOverdueAmount);
                });
            }
        }

        $scope.acceptOrRejectMember = function (status) {
            if (status == 1) {
                $scope.selectedMember.IsAccepted = 1;
            } else {
                $scope.selectedMember.IsAccepted = 0;
            }
            $scope.selectedMember.ReceivingBranchWorkingDate = moment($rootScope.workingdate).format("MM-DD-YYYY");
            $scope.StatusChangedMemberList = [];
            $scope.StatusChangedMemberList.push($scope.selectedMember);

            $scope.postMembers($scope.StatusChangedMemberList);
        }

        $scope.postMembers = function (memberList) {
            console.log(memberList);
            receiveService.postMembers(memberList).then(function (response) {
                console.log(response);
                if (response.data.Success) {
                    $rootScope.$broadcast('transfer-finished');
                    $rootScope.dataLoadedFirstTime = false;
                    $scope.getMenus();
                    swal("Congrats!", "All Member recieve-transfer-reject operations completed successfully", "success");
                    $scope.init();
                } else {
                    swal(
                    'Oops...',
                    'member was not transferred because of ' + response.data.Message,
                    'error'
                );
                    $scope.init();
                }
            });
        }

        $scope.acceptRejectGroup = function (status) {
            if (status == 1) {
                $scope.selectedGroup.IsAccepted = 1;
            } else {
                $scope.selectedGroup.IsAccepted = 0;
            }
            $scope.selectedGroup.ReceivingBranchWorkingDate = moment($rootScope.workingdate).format("MM-DD-YYYY");
            console.log($scope.selectedGroup);
            receiveService.postGroups($scope.selectedGroup).then(function (response) {
                console.log(response);
                if (response.data.Success) {
                    $rootScope.$broadcast('transfer-finished');
                    console.log("broadcasted");
                    swal("Congrats!", "All Group recieve-transfer-reject operations completed successfully", "success");
                    console.log("group tranfer success");
                    $scope.init();
                } else {
                    swal(
                    'Oops...',
                    'group was not transferred because of ' + response.data.message,
                    'error'
                );
                    $scope.init();
                }
            });
        }

        $scope.changeGroup = function ($index) {
            if ($index != -1) {
                var thisMember = $scope.Members[$index];
                console.log(thisMember.ProgramOfficerId);
                thisMember.GroupListFiltered = [];
                $scope.GroupList.forEach(function (element) {
                    if (element.ProgramOfficerId == thisMember.ProgramOfficerId) {
                        thisMember.GroupListFiltered.push(element);
                    }
                });
                if (thisMember.GroupListFiltered.length > 0) thisMember.TransferredToGroupId = thisMember.GroupListFiltered[0].Id;
            } else {
                $scope.GeneralSettingForAllmember.GroupListFiltered = [];
                $scope.GroupList.forEach(function (element) {
                    if (element.ProgramOfficerId == $scope.GeneralSettingForAllmember.ProgramOfficerId) {
                        $scope.GeneralSettingForAllmember.GroupListFiltered.push(element);
                    }
                });
                if ($scope.GeneralSettingForAllmember.GroupListFiltered.length > 0) $scope.GeneralSettingForAllmember.TransferredToGroupId = $scope.GeneralSettingForAllmember.GroupListFiltered[0].Id;
            }
        }

        $scope.applyToAll = function () {
            if ($scope.GeneralSettingForAllmember.checked == true) {
                $scope.Members.forEach(function (element) {
                    element.checked = true;
                    element.ProgramOfficerId = $scope.GeneralSettingForAllmember.ProgramOfficerId;
                    element.GroupListFiltered = [];
                    $scope.GeneralSettingForAllmember.GroupListFiltered.forEach(function (el) {
                        element.GroupListFiltered.push(el);
                    });
                    element.TransferredToGroupId = $scope.GeneralSettingForAllmember.TransferredToGroupId;
                    element.ReceivingOrRejectNote = $scope.GeneralSettingForAllmember.Notes;
                });
                $scope.UpdateTotalPrice();
            } else {
                $scope.Members.forEach(function (element) {
                    element.checked = false;
                    $scope.TotalNoOfLoans = 0;
                    $scope.TotalDisburseAmount = 0;
                    $scope.TotalOutstandingAmount = 0;
                    $scope.TotalOverdueAmount = 0;
                    $scope.TotalSavingsBalance = 0;
                    $scope.TotalCbsBalance = 0;
                    $scope.TotalLtsBalance = 0;
                    $scope.TotalNoofLts = 0;
                });
            }

        }

        $scope.UpdateTotalPrice = function () {
            $scope.TotalNoOfLoans = 0;
            $scope.TotalDisburseAmount = 0;
            $scope.TotalOutstandingAmount = 0;
            $scope.TotalOverdueAmount = 0;
            $scope.TotalSavingsBalance = 0;
            $scope.TotalCbsBalance = 0;
            $scope.TotalLtsBalance = 0;
            $scope.TotalNoofLts = 0;
            $scope.Members.forEach(function (m) {
                if (m.checked) {
                    $scope.TotalNoOfLoans += m.NoOfLoans;
                    $scope.TotalDisburseAmount += m.TotalDisburseAmount;
                    $scope.TotalOutstandingAmount += m.TotalOutstandingAmount;
                    $scope.TotalOverdueAmount += m.TotalOverdueAmount;
                    $scope.TotalSavingsBalance += m.SavingsBalance;
                    $scope.TotalCbsBalance += m.CbsBalance;
                    $scope.TotalLtsBalance += m.LtsBalance;
                    $scope.TotalNoofLts += m.NoofLts;

                }
            });
        }

        $scope.checkAllCheckBox = function () {
            if ($scope.checkAll == true) {
                $scope.Members.forEach(function (element) {
                    element.checked = true;
                });
            } else {
                $scope.Members.forEach(function (element) {
                    element.checked = false;
                });
            }

            $scope.UpdateTotalPrice();
        }

        $scope.submitMembers = function () {
            var memberList = [];
            $scope.Members.forEach(function (element) {
                if (element.checked == true) {
                    if (!$scope.ProgramOfficerList.some(e => e.Value == element.ProgramOfficerId)) return;
                    if (element.ProgramOfficerId == null || element.ProgramOfficerId <= 0) return;
                    element.IsAccepted = true;
                    element.ReceivingBranchWorkingDate = moment($rootScope.workingdate).format("MM-DD-YYYY");
                    if ($scope.GeneralSettingForAllmember.checked == true) element.ReceivingOrRejectNote = $scope.GeneralSettingForAllmember.Notes;
                    memberList.push(element);
                }
            });
            if (memberList.length <= 0)
                swal(
                    'Oops...',
                    'you have not selected any member',
                    'error'
                );
            else {

                $scope.postMembers(memberList);
            }
        }
        $scope.init();
    }
]);