ammsAng.controller('loanGroupEditController', ['$scope', '$rootScope', 'validatorService', 'loanGroupService', 'loanGroupFilterService', 'filterService', 'memberDailyTransactionService', 'commonService',
    function ($scope, $rootScope, validatorService, loanGroupService, loanGroupFilterService, filterService, memberDailyTransactionService, commonService) {
        $scope.loanGroup = {};
        $scope.GroupStatusList = {};
        $scope.filters = {};
        $scope.editloanGroup = {};
        $scope.roleId = $rootScope.user.Role;
        $scope.savedGroup = {};
        $scope.flagEditable = true;




        //$scope.getGroupOfProgramOfficer = function (lo) {
        //    loanGroupService.getGroupsWithType(lo).then(function (response) {
        //        $scope.allGroupsOfLO = response.data;
        //    });
        //}
        $scope.groupNameChange = function () {
            if ($scope.editloanGroup.Name === undefined || $scope.allGroupsOfLO === null || $scope.editloanGroup.Name.toLowerCase() === $scope.savedGroup.Name.toLowerCase()) return true;
            var i = $scope.allGroupsOfLO.findIndex(gn => gn.Name.toLowerCase() === $scope.editloanGroup.Name.toLowerCase());
            if (i !== -1) {
                return "Group name already exist. Try another name";
            }
            return true;
        }
        $scope.getDepositableAmounts = function () {
            loanGroupService.getDepositableAmounts($rootScope.SavingsConfig.SavingsType.General).then(function (response) {
                $scope.depositableSavingsAmountList = response.data;
            });
            loanGroupService.getDepositableAmounts($rootScope.SavingsConfig.SavingsType.CBS).then(function (response) {
                $scope.depositableSecurityAmountList = response.data;
            });
        }
        $scope.minimumDepositCheck = function (amount, savingsType) {
            if (amount !== undefined) {
                var isAvailableAmount;
                if (savingsType === $rootScope.SavingsConfig.SavingsType.General) {
                    if ($scope.depositableSavingsAmountList != null) {
                        isAvailableAmount = $scope.depositableSavingsAmountList.length > 0 ? $scope.depositableSavingsAmountList.indexOf(amount) : -1;
                        if (isAvailableAmount === -1)
                            return "This amount is not applicable for this field. Enter any one of this amount " + $scope.depositableSavingsAmountList;
                        else
                            return true;
                    }
                } else {
                    if ($scope.depositableSecurityAmountList != null) {
                        isAvailableAmount = $scope.depositableSecurityAmountList.length > 0 ? $scope.depositableSecurityAmountList.indexOf(amount) : -1;
                        if (isAvailableAmount === -1)
                            return "This amount is not applicable for this field. Enter any one of this amount " + $scope.depositableSecurityAmountList;
                        else
                            return true;
                    }

                }
            }
        }
        $scope.beforeStartDateRender = function ($dates) {
           // for (d in $dates) {
           //     if ($dates[d].utcDateValue > moment($rootScope.workingdate).add(1, 'days').valueOf()) {
           //         $dates[d].selectable = false;
           //     }
            //}
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
        $scope.beforeEndDateRender = function ($dates) {
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
        function stringToDate(_date, _format, _delimiter) {
            var formatLowerCase = _format.toLowerCase();
            var formatItems = formatLowerCase.split(_delimiter);
            var dateItems = _date.split(_delimiter);
            var monthIndex = formatItems.indexOf("mm");
            var dayIndex = formatItems.indexOf("dd");
            var yearIndex = formatItems.indexOf("yyyy");
            var month = parseInt(dateItems[monthIndex]);
            month -= 1;
            var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
            return formatedDate;
        }
        $scope.onStatusChange = function (groupStatus) {
            if (groupStatus == 0 && ($scope.editloanGroup.ClosingDate == null)) {
                $scope.editloanGroup.ClosingDate = $rootScope.workingdateInt;
                $scope.editloanGroup.ClosingDate = commonService.intToDate($scope.editloanGroup.ClosingDate);
                var endDate = stringToDate($scope.editloanGroup.ClosingDate, "dd-MM-yyyy", "-");//startDate.setDate(startDate.getDate() + 1); 
                $scope.editloanGroup.ClosingDate = endDate;//.setDate(endDate.getDate());
                //$scope.editloanGroup.ClosingDate = endDate;//.setDate(endDate.getDate());
                //editloanGroup.GroupStatus = groupStatus;
                return false;
            } else {
                $scope.editloanGroup.ClosingDate = null;
                return true;
            }
        }

        $scope.isHolidayOrOffDay = function (date,t) {
            $scope.selectedDate = moment(date).format("YYYY-MM-DD");
            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    if (t == 'o') {
                       // $scope.editloanGroup.FormationDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                        $scope.editloanGroup.FormationDate = new Date($rootScope.workingdate);
                    } else {
                        $scope.editloanGroup.ClosingDate = new Date($rootScope.workingdate);
                       // $scope.editloanGroup.ClosingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                    }
                    return;
                }
            });

        }

        $scope.DepositValidator = function (depositAmoount) {
            if (depositAmoount < 1) return "Minimum Deposit Amount Must be greater than zero";
            return true;
        }

        //$scope.MobileValidator = function () {
        //    if ($scope.editloanGroup.GroupLeaderPhone) {

        //        $scope.editloanGroup.GroupLeaderPhone = $scope.editloanGroup.GroupLeaderPhone.replace(/[^0-9]/g, '');
        //    }
        //    return validatorService.MobileValidator($scope.editloanGroup.GroupLeaderPhone);
        //}
        $scope.MobileValidator = function () {
            if (!$scope.editloanGroup.GroupLeaderPhone) return true;
            if ($scope.editloanGroup.GroupLeaderPhone) {

                $scope.editloanGroup.GroupLeaderPhone = $scope.editloanGroup.GroupLeaderPhone.replace(/[^0-9]/g, '');
            }
            if (!($scope.editloanGroup.GroupLeaderPhone.toString().length === 11)) {
                return "Mobile Phone No must be 11 characters long";
            }
            return true;
        }

        // TODO
        $scope.ClosingDate = function (closingDate) {
            if (!closingDate) return true;
            if (moment(closingDate).format('DD-MM-YYYY') < (moment($scope.editloanGroup.FormationDate).format('DD-MM-YYYY'))) {
                return "Closing date must be Greater than Formation date";
            }
            return true;
        }

        $scope.$on('tab-switched', function () {
            if ($rootScope.hasOwnProperty("editloanGroupId")) {
                $scope.getloanGroupInfo();
            }
        });

        $scope.updateLoanGroupFilterData = function () {
            $scope.filtersservice = loanGroupFilterService.getLoanGroupAddfilters().then(function (response) {
                var data = response.data;
                $scope.filters.MeetingDay = data.MeetingDay;
                $scope.filters.MeetingDay.forEach(function (m) {
                    if (m.Name === "Fri") m.DisabledState = true;
                    else m.DisabledState = false;
                });
                $scope.filters.DefaultPrograms = data.DefaultPrograms;
                
            }, AMMS.handleServiceError);

        }
        $scope.updateLoanGroupFilterData();

        $scope.clearAndCloseTab = function () {
            $scope.editloanGroup = {};
            $scope.execRemoveTab($scope.tab);
        };

        $scope.updateloanGroup = function () {
            if ($scope.roleId == $rootScope.rootLevel.LO) {
                swal("LO cannot add/Edit Group");
                return;
            }
            if (!$rootScope.isDayOpenOrNot()) return;
            if ($scope.editloanGroup.GroupStatus === $rootScope.GroupStatus.Inactive && $scope.editloanGroup.SubStaus === $rootScope.GroupSubStatus.Closed) {
                if (moment($scope.editloanGroup.ClosingDate).format("YYYY-MM-DD") < moment($scope.editloanGroup.FormationDate).format("YYYY-MM-DD")) {
                    swal("Group closing day can not be less than of it's opening day");
                    return;
                }
            }
            console.log($scope.editloanGroup);
            $scope.editloanGroup.GroupTypeId = $scope.selectedMenu.Id;
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.group),
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
            function () {
                $scope.editloanGroup.FormationDate = moment($scope.editloanGroup.FormationDate).format("YYYY-MM-DD");
                $scope.editloanGroup.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                $scope.editloanGroup.CurrentBranchId = $rootScope.selectedBranchId;
                if ($scope.editloanGroup.ClosingDate != null)
                    $scope.editloanGroup.ClosingDate = moment($scope.editloanGroup.ClosingDate).format("YYYY-MM-DD");

                loanGroupService.updateloanGroup($scope.editloanGroup).then(function (response) {
                    if (response.data.Success) {
                        swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.group), "Successful!", "success");
                        $rootScope.$broadcast('loanGroup-edit-finished');
                        $scope.clearAndCloseTab();
                    } else {
                        swal($rootScope.showMessage($rootScope.editError, $rootScope.group), response.data.Message, "error");
                    }
                }, AMMS.handleServiceError);
            });
        };

        $scope.groupStatusChange = function () {
            $scope.flagEditable = false;
            if ($scope.editloanGroup.GroupStatus === $rootScope.GroupStatus.Inactive) {
                $scope.GroupSubStatusList.forEach(function(st) {
                    if (st.value !== $rootScope.GroupSubStatus.Closed) {
                        st.DisabledState = true;
                    } else {
                        st.DisabledState = false;
                    }
                });
                $scope.editloanGroup.SubStaus = $rootScope.GroupSubStatus.Closed;
                $scope.editloanGroup.ClosingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            } else {
                console.log($scope.GroupSubStatusList);
                $scope.editloanGroup.SubStaus = $rootScope.GroupSubStatus.New;
                $scope.GroupSubStatusList.forEach(function (st) {
                    if (st.value !== $rootScope.GroupSubStatus.New) {
                        st.DisabledState = true;
                    } else {
                        st.DisabledState = false;
                    }
                });
                
                $scope.editloanGroup.ClosingDate = null;
            }
        }

        $scope.getloanGroupInfo = function(){
            var loanGroupId = $rootScope.editloanGroupId;
            filterService.getOrganizationalFilterDataByType('GroupSubStatus')
                .then(function (response) {
                    $scope.GroupSubStatusList = response.data;
                }, AMMS.handleServiceError);
            filterService.getOrganizationalFilterDataByType('GroupStatus')
                .then(function (response) {
                    $scope.GroupStatusList = response.data.filter(s=>s.value === $rootScope.GroupStatus.Active || s.value === $rootScope.GroupStatus.Inactive);
                    loanGroupService.getloanGroup(loanGroupId).then(function (response) {
                        $scope.editloanGroup = response.data;
                        $scope.savedGroup = angular.copy(response.data);
                        console.log($scope.editloanGroup);
                        $scope.editloanGroup.SubStaus = $scope.editloanGroup.SubStaus.toString();
                        $scope.editloanGroup.MeetingDay = $scope.editloanGroup.MeetingDay.toString();
                        $scope.editloanGroup.DefaultProgram = $scope.editloanGroup.DefaultProgram.toString();
                        $scope.editloanGroup.FormationDate = new Date($scope.editloanGroup.FormationDate);
                        if ($scope.editloanGroup.ClosingDate == null) {
                            $scope.editloanGroup.ClosingDate = null;
                        } else {
                            $scope.editloanGroup.ClosingDate = new Date($scope.editloanGroup.ClosingDate);
                        }
                        


                        //$scope.editloanGroup.ClosingDate = $scope.editloanGroup.ClosingDate;
                        $scope.editloanGroup.GroupStatus = $scope.editloanGroup.GroupStatus.toString();
                       // $scope.getGroupOfProgramOfficer($scope.editloanGroup.ProgramOfficerId);

                    }, AMMS.handleServiceError);
                }, AMMS.handleServiceError);
            
        }
        
        
        $scope.formatDate = function (dateString) {
            if (dateString == null) return null;
            var formattedDate = dateString.substring(5,7)+"/"+dateString.substring(8,10)+"/"+dateString.substring(0,4);
            return formattedDate;
        }
        $scope.clearModelData = function () {
            $scope.loanGroup = {};
        }
        $scope.init = function () {
            $scope.getHolidays($rootScope.selectedBranchId);
            
            $scope.getDepositableAmounts();
            $scope.getloanGroupInfo();
        }
        $scope.init();



        //new datepicker
        $rootScope.today = function () {
            $scope.editloanGroup.FormationDate = new Date($rootScope.workingdate);
            //$scope.account.OpeningDate = null;

        };
        $scope.today();

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
        $scope.clear = function () {
            $scope.editloanGroup.FormationDate = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($rootScope.workingdate),
            showWeeks: true
        };
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            //return (mode === 'day' && (date.getDay() === 5)) || (moment(date) > moment(new Date($rootScope.workingdate) + 1));
            return (mode === 'day' && (date.getDay() === 5));
        }
        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
           // minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };

        // Disable weekend selection
       

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate + 1);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.openC = function () {
            $scope.popupC.opened = true;
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };
        $scope.popupC = {
            opened: false
        };

        
        $scope.validator = function () {
            //if (moment($scope.editloanGroup.FormationDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
            //    swal("unable to select future date!");
            //    $scope.today();
            //    return;
            //}

            if ($scope.editloanGroup.FormationDate === undefined || $scope.editloanGroup.FormationDate === null) {
                swal("Formation date can not be cleared!");
                $scope.editloanGroup.FormationDate = new Date(angular.copy($scope.savedGroup.FormationDate));
                return;
            }

            //var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            //var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            //if ($scope.roleId == $rootScope.rootLevel.BM) {
            //    maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //    minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //}
            //else if ($scope.roleId == $rootScope.rootLevel.RM) {
            //    maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //    minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
            //}
            //else if ($scope.roleId == $rootScope.rootLevel.DM) {
            //    maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //    minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            //} else if ($scope.roleId == $rootScope.rootLevel.Admin) {
            //    maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            //    minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            //}
            //if (moment($scope.editloanGroup.FormationDate) > moment(new Date(maxDate)) || moment($scope.editloanGroup.FormationDate) < moment(new Date(minDate))) {
            //    swal("invalid Formation date!");
            //    $scope.editloanGroup.FormationDate = new Date($rootScope.workingdate);
            //    return;
            //}


            
            $scope.isHolidayOrOffDay($scope.editloanGroup.FormationDate,'o');
        }
        $scope.cDateValidator = function () {
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

            if (moment($scope.editloanGroup.ClosingDate) > moment(new Date(maxDate)) || moment($scope.editloanGroup.ClosingDate) < moment(new Date(minDate))  || moment($scope.editloanGroup.ClosingDate) < moment(new Date($scope.editloanGroup.FormationDate))) {
                swal("invalid closing date!");
                $scope.editloanGroup.ClosingDate = new Date($rootScope.workingdate);
                return;
            }
            $scope.isHolidayOrOffDay($scope.editloanGroup.ClosingDate, 'c');
        }

       

    }]);