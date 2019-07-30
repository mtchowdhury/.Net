ammsAng.controller('workingdayController', ['$scope', '$rootScope', '$timeout', 'workingDayService', 'commonService',
    function ($scope, $rootScope, $timeout, workingDayService, commonService) {
        $scope.displayDate = "../../..";
        $scope.isOpened = null;
        $scope.openDateInfo = {};
        $scope.info = [];
        $scope.IsHeadOffice = false;



        $scope.init = function () {
            //$scope.getMenus();
            $scope.closeDateInfo = {};
            $scope.getWorkingDay = workingDayService.getDateOfBranch($scope.selectedBranchId).then(function (response) {
                console.log(response);
                $scope.displayDate = commonService.intToDate(response.data.date);
                $scope.dateName = " (" + moment($scope.displayDate, 'DD/MM/YYYY').format('ddd') + ")";
                $scope.displayDate += $scope.dateName;
                $rootScope.workingdate = moment(response.data.date.toString().slice(0, 8)).toDate();
                $scope.date = response.data.date;
                $scope.isOpened = response.data.status;
                if ($rootScope.selectedBranchId < 1) $scope.isOpened = true;
                $rootScope.workingdateIsOpened = response.data.status;
                $scope.role = $rootScope.user.Role;
                //if ($scope.role !== $rootScope.UserRole.LO)
                if ($rootScope.selectedBranchId > 1) $scope.showOpenButton = true;
                else $scope.showOpenButton = false;
                $scope.closeDateInfo.branchId = $scope.selectedBranchId;
                if ($rootScope.selectedBranchId == 1) $rootScope.IsHeadOffice = true;
                $scope.closeDateInfo.date = $scope.date;
//                workingDayService.fetchClosingDateInfo($scope.closeDateInfo).then(function (response) {
//                    $scope.info = response.data;
//                });
            });
        }

        $scope.$on('working-day-fetched', function () {
            $scope.closeDateInfo = {};
            $scope.displayDate = $rootScope.displayDate;
            //$scope.displayDate = "moja moja";
            $scope.isOpened = $rootScope.workingdateIsOpened;
            if ($rootScope.selectedBranchId < 1) $scope.isOpened = true;
            $scope.role = $rootScope.user.Role;
            //if ($scope.role !== $rootScope.UserRole.LO)
            if ($rootScope.selectedBranchId > 1) $scope.showOpenButton = true;
            else $scope.showOpenButton = false;
            $scope.closeDateInfo.branchId = $scope.selectedBranchId;
            $scope.closeDateInfo.date = $rootScope.workingdateInt;
            //workingDayService.fetchClosingDateInfo($scope.closeDateInfo).then(function (response) {
            //    $scope.info = response.data;
            //});
        });

        //$scope.$on('day-close-finished', function () {
        //    $scope.getMenus();
        //}); 

        

        

        $scope.$on('program-officer-fetched', function (event, args, branchId) {
            $scope.selectedBranchId = branchId;
            $scope.init();

        });

        $scope.openDate = function () {
            $scope.openDateInfo.branchId = $scope.selectedBranchId;
            $scope.openDateInfo.date = $scope.date;
            swal({
                title: "Open date?",
                showCancelButton: true,
                confirmButtonText: "Yes, Open This Day!",
                cancelButtonText: "No, Cancel Please!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function (isConfirmed) {
                    if (isConfirmed) {
                        $scope.DateOpen = workingDayService.openWorkingDate($scope.openDateInfo).then(function (response) {
                            if (response.data.Success) {
                                $scope.init();
                                swal("Day opened", "Successfully!", "success");
                                $rootScope.workingdateInt = parseInt(response.data.Message);
                                //$scope.removeAllTabinDayOpenClose();
                                //$scope.getMenus();
                                $rootScope.$broadcast('day-open-finished');

                            } else {
                                swal(response.data.Message, "Plesae fix it !", "error");
                            }
                        });
                    } else {
                        swal("Cancelled", "Current Day is not Opened :)", "error");
                    }
                });

        }
        $scope.classSelector = function (value) {
            console.log(value);
            return value === "False" ? "success" : "danger";
        }

        //// ********************* close date without any validation check ************************************/////////////


        $scope.closeDate = function () {

            if ($rootScope.user.Role == $rootScope.UserRole.LO || $rootScope.user.Role == $rootScope.UserRole.ASE) {
                swal("LO & ASE cannot close date");
                return;
            }

            if ($rootScope.selectedBranchId < 1) return;
            $timeout(function () { $("#workingdayloadingImage").css("display", "block"); }, 100);
            
                $scope.closeDateInfo.branchId = $scope.selectedBranchId;
                $scope.closeDateInfo.date = $scope.date;
                
                    swal({
                        html: true,
                        title: "Close Date ?",
                        //text: errStr,
                        text: 'Day will be closed',
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Yes, Close it!",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false,
                    },
                        function (isConfirmed) {
                            if (isConfirmed) {
                                $scope.dateClose = workingDayService.closeWorkingDate($scope.closeDateInfo).then(function (response) {
                                    if (response.data.Success) {
                                        $scope.init();
                                        swal("Day Closed", "Successfully!", "success");
                                        //$scope.removeAllTabinDayOpenClose();
                                        //$scope.getMenus();
                                        $rootScope.$broadcast('day-close-finished');
                                        
                                        //$("#workingdayloadingImage").css("display", "none");
                                    } else {
                                        var messages = response.data.Message;
                                        swal(
                                            {
                                                html: true,
                                                title: "Day <b>not</b> closed !",
                                                text: '<table><tr><td>' + messages + '</tr></td></table>'
                                            }
                                        );
                                        if (response.data.Message.indexOf(",") > -1) {
                                            messages = response.data.Message.split(',');
                                            swal(
                                                {
                                                    html: true,
                                                    title: "Day <b>not</b> closed !",
                                                    text: '<table class="table table-striped table-bordered table-hover table-asa danger"><tr><td>' + messages[0] + '</td></tr>' + '<tr><td>' + messages[1] + '</tr></td></table>'
                                                }
                                            );
                                        } else
                                            swal(
                                                {
                                                    html: true,
                                                    title: "Day <b>closed</br> !",
                                                    text: 'successfully'
                                                }
                                            );
                                    }
                                    $timeout(function () { $("#workingdayloadingImage").css("display", "none"); }, 100);
                                });

                            } else {
                                swal("Cancelled", "Current Day is not Closed :)", "error");
                                $timeout(function () { $("#workingdayloadingImage").css("display", "none"); }, 100);
                            }
                        });


                $("#workingdayloadingImage").css("display", "none");
            //});


        }



        ///////////////////************************************************************************************/////////////





        ////////////////************close day with checking all the preconditions******************************//////////////

        
        $scope.closeDate = function () {

            if ($rootScope.user.Role == $rootScope.UserRole.LO || $rootScope.user.Role == $rootScope.UserRole.ASE) {
                swal("LO & ASE cannot close date");
                return;
            }

            if ($rootScope.selectedBranchId < 1) return;
            $timeout(function () { $("#workingdayloadingImage").css("display", "block"); }, 100);
            workingDayService.checkIfClosable($scope.closeDateInfo).then(function (response) {
                var errStr = response.data;


                $scope.closeDateInfo.branchId = $scope.selectedBranchId;
                $scope.closeDateInfo.date = $scope.date;
                if (errStr !== null) {
                    swal({
                        html: true,
                        title: "Day cannot be closed. All preconditions are not met!",

                        text: errStr,
                        text: '<div class="panel panel-default" style="max-height: 400px;overflow-y: scroll;"><div class="panel-body"><table class="table table-striped table-bordered table-hover table-asa danger"><thead><tr>' +
                            '<th style="font-size: 14px; color: #5e1594;">Checklist</th>' +
                            '<th>Current State</th>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            errStr +
                            '</tbody>' +
                            '</table></div><div>' +
                            '<div class="panel-footer"></div>',
                        showConfirmButton: false,
                        showCancelButton: true,
                        confirmButtonText: "Yes, Close it!",
                        cancelButtonText: "Ok",
                        closeOnConfirm: false,
                    });
                    $timeout(function () { $("#workingdayloadingImage").css("display", "none"); }, 100);
                }
                else {
                    swal({
                        html: true,
                        title: "Close Date ?",
                        text: errStr,
                        text: 'Day will be closed',
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Yes, Close it!",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    },
                        function (isConfirmed) {
                            if (isConfirmed) {
                                $scope.dateClose = workingDayService.closeWorkingDate($scope.closeDateInfo).then(function (response) {
                                    if (response.data.Success) {
                                        $scope.init();
                                        swal("Day Closed", "Successfully!", "success");
                                        //$scope.removeAllTabinDayOpenClose();
                                        //$scope.getMenus();
                                        $rootScope.$broadcast('day-close-finished');
                                        $("#workingdayloadingImage").css("display", "none");
                                    } else {
                                        var messages = response.data.Message;
                                        swal(
                                            {
                                                html: true,
                                                title: "Day <b>not</b> closed !",
                                                text: '<table><tr><td>' + messages + '</tr></td></table>'
                                            }
                                        );
                                        if (response.data.Message.indexOf(",") > -1) {
                                            messages = response.data.Message.split(',');
                                            swal(
                                                {
                                                    html: true,
                                                    title: "Day <b>not</b> closed !",
                                                    text: '<table class="table table-striped table-bordered table-hover table-asa danger"><tr><td>' + messages[0] + '</td></tr>' + '<tr><td>' + messages[1] + '</tr></td></table>'
                                                }
                                            );
                                        } else
                                            swal(
                                                {
                                                    html: true,
                                                    title: "Day <b>closed</br> !",
                                                    text: 'successfully'
                                                }
                                            );
                                    }
                                    $timeout(function () { $("#workingdayloadingImage").css("display", "none"); }, 100);
                                });

                            } else {
                                swal("Cancelled", "Current Day is not Closed :)", "error");
                                $timeout(function () { $("#workingdayloadingImage").css("display", "none"); }, 100);
                            }
                        });
                }

                $("#workingdayloadingImage").css("display", "none");
            });


        }
        


        ///////////////***************************************************************************************///////////////


        $scope.formatDate = function (dateString) {
            var formattedDate = dateString.toString().substring(6, 8) + "/" + dateString.toString().substring(4, 6) + "/" + dateString.toString().substring(0, 4);
            return formattedDate;
        }


    }]);