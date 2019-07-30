ammsAng.controller('memberGroupTypeChangeController', ['$scope', '$rootScope', 'loanGroupFilterService', 'loanGroupService', 'memberService', 'loanaccountService', 'commonService', 'savingsAccountService',
    function ($scope, $rootScope, loanGroupFilterService, loanGroupService, memberService, loanaccountService, commonService, savingsAccountService) {

        $scope.member = {};
        $scope.targetGroupList = [];
        $scope.groupDetails = {};
        $scope.loanAccounts = [];
        $scope.SavingsAccounts = [];
        $scope.NewGroupTypeDropdownList = [];
        $scope.PrimaryAccountName = null;
        $scope.newGroupTypeId = null;
        $scope.programOfficerId = null;
        $scope.newGroupId = null;
        $scope.submitButtonEnable = true;
        $scope.roleId = $rootScope.user.Role;
        $scope.getGroups = function () {
            loanGroupService.getGroupsB($scope.programOfficerId, $scope.newGroupTypeId).then(function (rr) {
                console.log(rr.data);
                $scope.targetGroupList = rr.data.filter(p => p.GroupStatus == 1);
                if ($scope.targetGroupList.length > 0) $scope.newGroupId = $scope.targetGroupList[0].Id;
            });
        }


        $scope.beforeStartDateRender = function ($dates) {

            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");

            for (d in $dates) {
                if ($dates.hasOwnProperty(d)) {
                    if (

                        $dates[d].utcDateValue > maxDate.valueOf()

                        ) {
                        $dates[d].selectable = false;
                        console.log($dates[d].utcDateValue, $dates[d].selectable);
                    }
                }
            }


        }

        $scope.init = function () {
            memberService.getMember($scope.selectedMenu.Id).then(function (response) {
                console.log(response.data);
                $scope.member = response.data;
                $scope.member.MoveDate = new Date($rootScope.workingdate);


                savingsAccountService.getSavingsAccounts($scope.member.Id).then(function (resSavings) {
                    console.log(resSavings.data);
                    $scope.SavingsAccounts = resSavings.data;
                });

                loanaccountService.getLoanAccounts($scope.member.Id).then(function (resLoan) {
                    $scope.loanAccounts = resLoan.data.filter(e => e.Status == "1");
                    console.log(resLoan.data);
                    $scope.PrimaryAccountName = $scope.loanAccounts.filter(lo => lo.IsPrimary === true).length > 0 ? $scope.loanAccounts.filter(lo => lo.IsPrimary === true)[0].ProductName : null;
                    $scope.submitButtonEnable = $scope.loanAccounts.filter(lo => lo.IsPrimary === true && lo.Status === "1" && lo.RemainingTotal > 0).length > 0 ? false : true;
                    $scope.loanAccounts.forEach(function (key) {
                        key.OpeningDate = commonService.intToDate(key.OpeningDate);
                        //key.RemainingTotal = Math.floor(key.RemainingTotal);
                        //if(key.RemainingTotal)
                        if (key.RemainingTotal < 0) key.RemainingTotal *= (-1);
                        var ceil = Math.ceil(key.RemainingTotal);
                        var floor = Math.floor(key.RemainingTotal);
                        if (key.RemainingTotal !== ceil && (ceil - key.RemainingTotal) < 0.05) {
                            key.RemainingTotal = ceil;
                        }
                        if (key.RemainingTotal !== floor && (key.RemainingTotal - floor) < 0.05) {
                            key.RemainingTotal = floor;
                        }
                    });
                });


                loanGroupService.getloanGroup(response.data.GroupId).then(function (res) {
                    $scope.groupDetails = res.data;
                    console.log(res.data);
                    if ($scope.groupDetails.GroupTypeId == 3) {
                        // bad debt group work start



                        loanaccountService.getBadDebtAccounts($scope.member.Id).then(function (resLoan) {
                            $scope.loanAccounts = resLoan.data.filter(e => e.Status == "1");
                            console.log(resLoan.data);
                            //$scope.PrimaryAccountName = $scope.loanAccounts.filter(lo => lo.IsPrimary === true).length > 0 ? $scope.loanAccounts.filter(lo => lo.IsPrimary === true)[0].ProductName : null;
                            $scope.submitButtonEnable = $scope.loanAccounts.filter(lo => lo.IsPrimary === true && lo.Status === "1" && lo.RemainingTotal > 0).length > 0 ? false : true;
                            $scope.loanAccounts.forEach(function (key) {
                                key.OpeningDate = commonService.intToDate(key.OpeningDate);
                                //key.RemainingTotal = Math.floor(key.RemainingTotal);
                                //if(key.RemainingTotal)
                                if (key.RemainingTotal < 0) key.RemainingTotal *= (-1);
                                var ceil = Math.ceil(key.RemainingTotal);
                                var floor = Math.floor(key.RemainingTotal);
                                if (key.RemainingTotal !== ceil && (ceil - key.RemainingTotal) < 0.05) {
                                    key.RemainingTotal = ceil;
                                }
                                if (key.RemainingTotal !== floor && (key.RemainingTotal - floor) < 0.05) {
                                    key.RemainingTotal = floor;
                                }
                            });
                        });


                        // bad debt group work end
                    }
                    $scope.programOfficerId = res.data.ProgramOfficerId;
                    for (var key in $rootScope.GroupTypes) {
                        if ($rootScope.GroupTypes.hasOwnProperty(key)) {
                            console.log(key, $rootScope.GroupTypes[key]);
                            if ($rootScope.GroupTypes[key] !== res.data.GroupTypeId && $rootScope.GroupTypes[key] !== 3) $scope.NewGroupTypeDropdownList.push({ value: $rootScope.GroupTypes[key], text: key });
                        }
                    }
                    if ($scope.NewGroupTypeDropdownList.length > 0) {
                        $scope.newGroupTypeId = $scope.NewGroupTypeDropdownList[0].value;
                        $scope.getGroups();
                    }
                    console.log($scope.NewGroupTypeDropdownList, typeof ($scope.NewGroupTypeDropdownList));
                });
            });
        };


        $scope.init();

        $scope.changeGroupType = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            if ($scope.newGroupId == null) {
                swal("Something Went Wrong", "Please Select a Group", "error");
                return;
            }
            console.log($scope.member);
            swal({
                title: "Confirm?",
                text: "The Member will be Moved",
                type: "warning",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                showCancelButton: true
            },
            function () {
                memberService.changeGroupTypeOfMember($scope.member.Id, $scope.newGroupId).then(function (response) {
                    console.log(response);
                    if (response.data.Success) {

                        swal({
                            title: "Changed Group Type Successfully",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#008000",
                            confirmButtonText: "Close",
                            closeOnConfirm: true
                        },
                            function () {
                                $scope.clearAndCloseTab();
                            });
                        $scope.getMenus();
                    } else {
                        swal("Something Went Wrong", response.data.Message, "error");
                    }
                }, AMMS.handleServiceError);
            });
        }
        $scope.clearAndCloseTab = function () {
            $scope.member = {};
            $scope.removeTab($scope.tab);
        };



        $rootScope.today = function () {
            $scope.member.MoveDate = new Date($rootScope.workingdate);


        };
        $scope.today();


        $scope.clear = function () {
            $scope.member.MoveDate = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($rootScope.workingdate),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2040, 5, 22),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };


        function disabled(data) {
            var date = data.date,
              mode = data.mode;


            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.BM || $scope.roleId == $rootScope.rootLevel.ABM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }



            return (mode === 'day' && (date.getDay() === 5)) || (moment(date) > moment(new Date($rootScope.workingdate) + 1) || (moment(date) < moment(minDate) || moment(date) > moment(maxDate)));
        }

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate + 1);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };


        function getDayClass(data) {
            console.log(data);
            var date = data.date,
              mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
        $scope.validator = function () {


            if (moment($scope.member.MoveDate) > moment(new Date($scope.branchWorkingDay) + 1)) {

                swal("unable to select future date!");
                $scope.today();
                return;
            }

        }
    }]);