ammsAng.controller('groupAddController', ['$scope', '$rootScope', 'filterService', 'loanGroupService', 'loanGroupFilterService', 'validatorService','memberDailyTransactionService',
    function ($scope, $rootScope, filterService, loanGroupService, loanGroupFilterService, validatorService, memberDailyTransactionService) {
        $scope.filters = {};
        $scope.group = {};
        $scope.group.ProgramOfficerId = $scope.selectedMenu.ProgramOfficerId;
        $scope.group.GroupTypeId = $scope.selectedMenu.Id;
        $scope.group.ClosingDate = null;
        $scope.GroupSubStatusList = null;
        $scope.group.FormationDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
        $scope.group.CreateBranchDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
        $scope.group.OriginatingBranchId = $rootScope.selectedBranchId;
        $scope.group.CurrentBranchId = $rootScope.selectedBranchId;
        $scope.group.OriginatingLoId = $scope.selectedMenu.ProgramOfficerId;
        $scope.group.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
        $scope.depositableSavingsAmountList = null;
        $scope.depositableSecurityAmountList = null;
        $scope.allGroupsOfLO = null;
        $scope.roleId = $rootScope.user.Role;
        $scope.branchHolidayAndOffDay = null;

        //$scope.getGroupOfProgramOfficer = function () {
        //    loanGroupService.getGroupsWithType($scope.group.ProgramOfficerId).then(function (response) {
        //        $scope.allGroupsOfLO = response.data;
        //    });
        //}
        //$scope.groupNameChange = function () {
        //    if ($scope.group.Name === undefined || $scope.allGroupsOfLO === null) return true;
        //    var i = $scope.allGroupsOfLO.findIndex(gn => gn.Name.toLowerCase() === $scope.group.Name.toLowerCase());
        //    if (i !== -1) {
        //        return "Group name already exist. Try another name";
        //    }
        //    return true;
        //}
        $scope.getDepositableAmounts = function () {
            loanGroupService.getDepositableAmounts($rootScope.SavingsConfig.SavingsType.General).then(function (response) {
                $scope.depositableSavingsAmountList = response.data;
            });
            loanGroupService.getDepositableAmounts($rootScope.SavingsConfig.SavingsType.CBS).then(function (response) {
                $scope.depositableSecurityAmountList = response.data;
            });
        }
        $scope.minimumDepositCheck = function (amount) {
            if (amount === undefined) return true;
            var isAvailableAmount = $scope.depositableSavingsAmountList.indexOf(amount);
            if (isAvailableAmount === -1) {
                return "This amount is not applicable for this field. Enter any one of this amount " + $scope.depositableSavingsAmountList;
            }
            return true;
        }
        $scope.minimumDepositCheckSecurity = function (amount) {
            if (amount === undefined) return true;
            var isAvailableAmount = $scope.depositableSecurityAmountList.indexOf(amount);
            if (isAvailableAmount === -1) {
                return "This amount is not applicable for this field. Enter any one of this amount " + $scope.depositableSecurityAmountList;
            }
            return true;
        }

        $scope.DepositValidator = function (depositAmount) {
            if (depositAmount === undefined) return true;
            return depositAmount >= 1 || "Minimum Deposit Amount Must be greater than zero";
        }

        $scope.beforeStartDateRender = function ($dates) {
            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.BM) {
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
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        if ($dates[d].utcDateValue < minDate.valueOf() || $dates[d].utcDateValue > maxDate.valueOf()) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }
        }
        $scope.getHolidays = function (branchId) {
            memberDailyTransactionService.getBranchOffDayAndHolidays(branchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }
        $scope.isHolidayOrOffDay = function (date) {
            $scope.selectedDate = moment(date).format("YYYY-MM-DD");
            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    $scope.group.FormationDate = new Date($rootScope.workingdate);
                    return;
                }
            });

        }

        $scope.MobileValidator = function () {
            if ($scope.group.GroupLeaderPhone === undefined || $scope.group.GroupLeaderPhone === null || !$scope.group.GroupLeaderPhone) return true;
            if ($scope.group.GroupLeaderPhone) {

                $scope.group.GroupLeaderPhone = $scope.group.GroupLeaderPhone.replace(/[^0-9]/g, '');
            }
            if (!($scope.group.GroupLeaderPhone.toString().length === 11)) {
                return "Mobile Phone No must be 11 characters long";
            }
            return true;
        }
        $scope.ClosingDate = function (closingDate) {
            if (!closingDate) return true;
            if (moment(closingDate).isBefore($scope.group.FormationDate)) {
                return "Closing date must be Greater than Formation date";
            }
            return true;
        }

        $scope.clearAndCloseTab = function () {
            $scope.group = {};
            $scope.execRemoveTab($scope.tab);
        };

        $scope.addLoanGroup = function () {
            if (!$rootScope.isDayOpenOrNot()) return;

            console.log($scope.group);
            swal({
                title: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.group),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
                function (isConfirmed) {
                    if (isConfirmed) {
                        if ($scope.group.GroupLeaderPhone) $scope.group.GroupLeaderPhone = $scope.group.GroupLeaderPhone.toString();
                        $scope.group.FormationDate = moment($scope.group.FormationDate).format("YYYY-MM-DD");
                        loanGroupService.postLoanGroup($scope.group).then(function (response) {
                            if (response.data.Success) {
                                $rootScope.$broadcast('loanGroup-add-finished', $scope.group);
                                swal($rootScope.showMessage($rootScope.addSuccess, $rootScope.group), "Successful!", "success");
                                $scope.clearAndCloseTab();
                            } else {
                                swal($rootScope.showMessage($rootScope.addError, $rootScope.group), response.data.Message, "error");
                            }
                        }, AMMS.handleServiceError);
                    } else {
                        swal("Cancelled", "something is wrong", "error");
                    }
                });
        };

        $scope.addLoanGroupFilterData = function () {
            if ($scope.roleId == $rootScope.rootLevel.LO) {
                swal("LO cannot add/Edit Group");
                return;
            }
            $scope.filtersservice = loanGroupFilterService.getLoanGroupAddfilters().then(function (response) {
                var data = response.data;
                console.log(data.MeetingDay);
                $scope.filters.MeetingDay = data.MeetingDay;
                $scope.filters.DefaultPrograms = data.DefaultPrograms;
                console.log($scope.filters.MeetingDay);
                //$scope.group.DefaultProgram = $scope.filters.DefaultPrograms[0].Value;
                $scope.group.MeetingDay = ($scope.filters.MeetingDay.filter(md => md.Name.substring(0, 3) === moment($rootScope.workingdate).format("ddd")))[0].Value;
                //$scope.group.FormationDate = new Date();
                $scope.getWeeklyHolidayListOfTheYear();
            }, AMMS.handleServiceError);

            filterService.getOrganizationalFilterDataByType('GroupStatus')
                .then(function (response) {
                    $scope.GroupStatusList = response.data;
                    $scope.GroupStatusList = $scope.GroupStatusList.filter(g => g.value === $rootScope.GroupStatus.Active);
                    $scope.group.GroupStatus = $scope.GroupStatusList[0].value;
                }, AMMS.handleServiceError);
            filterService.getOrganizationalFilterDataByType('GroupSubStatus')
                .then(function (response) {
                    $scope.GroupSubStatusList = response.data;
                    $scope.GroupSubStatusList = $scope.GroupSubStatusList.filter(g => g.value === $rootScope.GroupSubStatus.New);
                    $scope.group.SubStaus = $scope.GroupSubStatusList[0].value;
                }, AMMS.handleServiceError);
           
        }
        $scope.getWeeklyHolidayListOfTheYear=function() {
            $scope.weeklyHolidayListOfTheYear = null;
            loanGroupService.getWeeklyHolidayListOfTheYear(parseInt(moment($rootScope.workingdate).format("YYYY"))).then(function (response) {
                console.log(response.data);
                //console.log($scope.filters.MeetingDay);
                if (response.data) {
                    $scope.weeklyHolidayListOfTheYear = response.data.split(",");
                    //console.log($scope.weeklyHolidayListOfTheYear);
                    $scope.weeklyHolidayListOfTheYear.forEach(function(holiday) {
                        var i = $scope.filters.MeetingDay.find(m => m.Name == holiday);
                        if (i != undefined)
                            i.DisabledState = true;
                    });
                }
            });
        }
        $scope.init = function () {
            $scope.getHolidays($rootScope.selectedBranchId);
            $scope.addLoanGroupFilterData();
            $scope.getDepositableAmounts();
           // $scope.getGroupOfProgramOfficer();
            
        }
        $scope.init();





        //new datepicker
        $rootScope.today = function () {
            $scope.group.FormationDate = new Date($rootScope.workingdate);
            //$scope.account.OpeningDate = null;

        };
        $scope.today();


        $scope.clear = function () {
            $scope.group.FormationDate = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($rootScope.workingdate),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(2040, 5, 22),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5)) || (moment(date) > moment(new Date($rootScope.workingdate) + 1));
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
            if ($scope.group.FormationDate === undefined || $scope.group.FormationDate === null) {
                swal("Formation date can not be cleared!");
                $scope.group.FormationDate = new Date($rootScope.workingdate);
                return;
            }
            if (moment($scope.group.FormationDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
                swal("unable to select future date!");
                $scope.today();
                return;
            }
            $scope.isHolidayOrOffDay($scope.group.FormationDate);
        }
    }]);