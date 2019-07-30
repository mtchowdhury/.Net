ammsAng.controller('excessRealizedServiceChargeController', ['$scope', '$rootScope', 'loanaccountService', 'commonService', '$timeout', 'DTOptionsBuilder',
    function ($scope, $rootScope, loanaccountService, commonService, $timeout, DTOptionsBuilder) {
        $scope.getCommands = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            }, AMMS.handleServiceError);
        }
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.GetAll = function () {
            $scope.memberList = [];
            $scope.memberList.push({ Name: "All", Value: -100000 });
            $("#loadingImage").css("display", "block");
            loanaccountService.getApplicableListOfExcessRealizedServiceChargeByBranch($scope.selectedBranchId).then(function (response) {
                response.data.forEach(function (d) {
                    d.PaidDateStr = d.PaidDate == null ? "" : moment(d.PaidDate).format("YYYY-MM-DD");
                    d.MemberAdmissionDateStr = moment(d.MemberAdmissionDate).format("YYYY-MM-DD");
                    if (!$scope.memberList.find(m=>m.Value === d.MemberId))
                        $scope.memberList.push({ Name: d.MemberName, Value: d.MemberId });
                });
                $scope.applicableListMain = angular.copy(response.data);
                $scope.applicableList = angular.copy(response.data);
                $scope.setDefaultValues();
                $("#loadingImage").css("display", "none");
            });
        }
        $scope.setDefaultValues=function() {
            $scope.serach.MemberId = $scope.memberList[0].Value;
            $scope.serach.PaymentStatus = $scope.paymentStatusList[0].Value;
            $scope.serach.PaidDate = new Date($rootScope.workingdate);
        }
        //$scope.getMemberList=function() {
        //    commonService.getMemberListByBranch($scope.selectedBranchId).then(function (response) {
        //        $scope.memberList = response.data;
        //        console.log($scope.memberList);
        //    });
        //}
        $scope.paymentStatusChanged=function() {
            if ($scope.search.PaymentStatus) {
                if ($scope.search.PaymentStatus === $rootScope.ExcessRealizedPaymentStatus.Unpaid)
                    $scope.search.PaidDate =null;
            }
        }
        $scope.searchData = function () {
            $scope.applicableList = $scope.applicableListMain;
            if ($scope.search.MemberId) {
                if ($scope.search.MemberId !== -100000) {
                    $scope.applicableList = $scope.applicableList.filter(a => a.MemberId === $scope.search.MemberId);
                } else {
                    $scope.applicableList = $scope.applicableListMain;
                }
            }
            if ($scope.search.PaymentStatus) {
                if ($scope.search.MemberId && $scope.search.MemberId !== -100000) {
                    if ($scope.search.PaymentStatus === $rootScope.ExcessRealizedPaymentStatus.Unpaid)
                        $scope.applicableList = $scope.applicableList.filter(a => a.PaymentStatus === $rootScope.ExcessRealizedPaymentStatus.Unpaid);
                    else
                        $scope.applicableList = $scope.applicableList.filter(a => a.PaymentStatus !== $rootScope.ExcessRealizedPaymentStatus.Unpaid);
                } else {
                    if ($scope.search.PaymentStatus === $rootScope.ExcessRealizedPaymentStatus.Unpaid)
                        $scope.applicableList = $scope.applicableListMain.filter(a => a.PaymentStatus === $rootScope.ExcessRealizedPaymentStatus.Unpaid);
                    else
                        $scope.applicableList = $scope.applicableListMain.filter(a => a.PaymentStatus !== $rootScope.ExcessRealizedPaymentStatus.Unpaid);
                }
                
            }
            if ($scope.search.PaidDate) {
                $scope.applicableList = $scope.applicableList.filter(a => moment(a.PaidDate).format("YYYY-MM-DD") === moment($scope.search.PaidDate).format("YYYY-MM-DD"));
            }

        }

        $scope.confirmPayment=function(item) {
            if (!$rootScope.isDayOpenOrNot()) return;
            if ($rootScope.user.Role == $rootScope.UserRole.BM) {
                if (item.ExcessInterestAmount > 100) {
                    swal("BM is not allowed to pay more than 100");
                    return;
                }
            }
            swal({
                title: "Are you sure to pay?",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false
            },
                function (isConfirmed) {
                    if (isConfirmed) {
                        item.BranchWorkingDate = moment().format("YYYY-MM-DD");
                        loanaccountService.excessRealizedServiceChargePayment(item).then(function (response) {
                            if (response.data.Success) {
                                swal("Payment done", "Successful!", "success");
                                $scope.GetAll();
                            } else {
                                swal("Error", response.data.Message, "error");
                            }
                        }, AMMS.handleServiceError);
                    } else {
                        swal("Cancelled", "something is wrong", "error");
                    }
                });
        };
        

        $scope.init = function () {
            $scope.commandList = [];
            $scope.applicableList = [];
            $scope.applicableListMain = [];
            $scope.paymentStatusList = [];
            
            $scope.paymentStatusList.push({ Name: "Unpaid", Value: 3 });
            $scope.paymentStatusList.push({ Name: "Paid", Value: 1 });
            

            $scope.serach = {};
            

            //$scope.getMemberList();
            $scope.hasNonGeneralCommands = false;
            $scope.getCommands();
            $scope.GetAll();
        }

        $scope.init();

    }]);