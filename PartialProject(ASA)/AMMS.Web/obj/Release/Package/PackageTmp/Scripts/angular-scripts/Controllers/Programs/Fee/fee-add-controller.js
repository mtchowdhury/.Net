ammsAng.controller('feeAddController', [
    '$scope', '$rootScope', 'feeService', 'productService', 'commonService', 'documentService',
    function ($scope, $rootScope, feeService, productService, commonService, documentService) {
        $scope.fee = {};

        $scope.type = null;
        $scope.typeList = null;
        $scope.appliesTo = null;
        $scope.appliesToList = null;
        $scope.timeOfCharge = null;
        $scope.timeOfChargeList = null;
        $scope.feeCalculationMethod = null;
        $scope.feeCalculationMethodList = null;
        $scope.feePolicy = null;
        $scope.feePolicyList = null;
        $scope.RateFrequency = [];
        $scope.feeStatus = null;
        $scope.frequencyList = [];
        $scope.frequencyRate = [];
        $scope.frequencyRateValue = [];
        $scope.selectedFrequency = null;
        $scope.FeeFrequency = [];
        $scope.FeeRate = [];
        $scope.files = [];
        $scope.feeValue = null;
        $scope.durationArray = [];
        $scope.durationPrincipleRangeForMSMEInsurance = [];


        $scope.init = function () {
            feeService.getFeeConfig("FeeType").then(function (response) {
                $scope.type = angular.copy(response.data);
                $scope.typeList = angular.copy(response.data);

            });
            productService.getDuration().then(function (response) {
                $scope.durationArray = response.data.filter(duration => duration.Value !== "-100000");
                console.log(response.data);
            });
            feeService.getFeeConfig("FeeAppliesTo").then(function (response) {
                $scope.appliesTo = angular.copy(response.data);
                $scope.appliesToList = angular.copy(response.data);

            });
            feeService.getFeeConfig("TimeOfCharge").then(function (response) {
                $scope.timeOfCharge = angular.copy(response.data);
                $scope.timeOfChargeList = angular.copy(response.data);

            });
            feeService.getFeeConfig("FeeCalculationMethod").then(function (response) {
                $scope.feeCalculationMethod = angular.copy(response.data);
                $scope.feeCalculationMethodList = angular.copy(response.data);

            });
            feeService.getFeeConfig("PolicyType").then(function (response) {
                $scope.feePolicy = angular.copy(response.data);
                $scope.feePolicyList = angular.copy(response.data);

            });
            productService.getInstallmentfrequency().then(function (response) {
                $scope.RateFrequency = angular.copy(response.data.filter(freq => freq.Value !== -100000 && freq.Value !== -999999));
                $scope.frequencyList = angular.copy(response.data.filter(freq => freq.Value !== -100000 && freq.Value !== -999999));

            });
            feeService.getAll().then(function (response) {
            });
            feeService.getByAppliesTo(1).then(function (response) {
            });
        }
        $scope.frequencySelected = function (frequency) {
            $scope.selectedFrequency = null;
            $scope.selectedFrequency = $scope.RateFrequency.find(x=>x.Value === frequency);
        }
        $scope.addFrequencySelect = function (frequencyItem) {
            for (var i = 0; i < $scope.RateFrequency.length; i++) {
                var isExist = false;
                for (var j = 0; j < $scope.frequencyList.length; j++) {
                    if ($scope.RateFrequency[i].Value === $scope.frequencyList[j].Value) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    $scope.frequencyList.push($scope.RateFrequency[i]);
                    break;
                }
            }
        }


        $scope.addMsmeSetting = function () {
            var msme =
            {
                MinPrinciple: 0,
                MaxPrinciple: 0,
                Duration: 3,
                Value: 0
            }

            $scope.durationPrincipleRangeForMSMEInsurance.push(msme);
            console.log($scope.durationPrincipleRangeForMSMEInsurance);
        }

        $scope.removeFromList = function (msme) {
            $scope.durationPrincipleRangeForMSMEInsurance.splice($scope.durationPrincipleRangeForMSMEInsurance.indexOf(msme), 1);
        };

        $scope.removeFrequencySelect = function (index) {
            $scope.frequencyList.splice(index, 1);
            $scope.frequencyRate.splice(index, 1);
            $scope.frequencyRateValue.splice(index, 1);
        }
        $scope.feeRateFrequencyFilter = function (index) {
            return function (item) {
                for (var i = 0; i < $scope.RateFrequency.length; i++) {
                    if ($scope.frequencyRate[i] === item.Value && i != index) {
                        return false;
                    }
                }
                return true;
            }
        }

        $scope.chargeTypeChanged = function (chargeType) {
            $scope.appliesTo = angular.copy($scope.appliesToList);
            $scope.timeOfCharge = angular.copy($scope.timeOfChargeList);
            if (Number(chargeType) === $scope.FeeConfig.ChargeType.Insurance.value) {
                $scope.fee.TimeOfCharge = $scope.FeeConfig.TimeOfCharge.LoanDisbursement.value.toString();
                $scope.appliesTo.splice(1);
                $scope.fee.AppliedTo = $scope.FeeConfig.AppliesTo.Loan.value.toString();
                $scope.timeOfCharge.splice(1);
            }
            else if (Number(chargeType) === $scope.FeeConfig.ChargeType.LateFee.value) {
                $scope.appliesTo = angular.copy($scope.appliesToList);
                $scope.timeOfCharge = [];
                for (var i = 0; i < $scope.appliesTo.length; i++) {
                    if (Number($scope.appliesTo[i].value) === $scope.FeeConfig.AppliesTo.Member.value) {
                        $scope.appliesTo.splice(i, 1);
                    }
                }
                $scope.timeOfCharge.push($scope.FeeConfig.TimeOfCharge.ChargeWhenOverdue);
                $scope.fee.TimeOfCharge = $scope.FeeConfig.TimeOfCharge.ChargeWhenOverdue.value;
            }
            else if (Number(chargeType) === $scope.FeeConfig.ChargeType.PeriodicFee.value) {
                $scope.appliesTo = angular.copy($scope.appliesToList);
                for (var i = 0; i < $scope.appliesTo.length; i++) {
                    if (Number($scope.appliesTo[i].value) === $scope.FeeConfig.AppliesTo.Loan.value) {
                        $scope.appliesTo.splice(i, 1);
                    }
                }
                $scope.timeOfCharge = [];
                $scope.timeOfCharge.push($rootScope.FeeConfig.TimeOfCharge.Yearly);
                $scope.fee.TimeOfCharge = $rootScope.FeeConfig.TimeOfCharge.Yearly.value;
            } else {
                $scope.appliesTo = angular.copy($scope.appliesToList);
                $scope.timeOfCharge = angular.copy($scope.timeOfChargeList);
                $scope.fee.TimeOfCharge = null;
                $scope.fee.AppliedTo = null;
            }

        }
        $scope.feeApplyChange = function (applyItem) {
            if (!$scope.fee.ChargeType) {
                swal("First Select Charge Type");
                $scope.fee.AppliedTo = null;
                return;
            }
            $scope.fee.CalculationMethod = $scope.FeeConfig.CalculationMethod.Fixed.value;
            if (Number(applyItem) === $scope.FeeConfig.AppliesTo.Savings.value) {
                $scope.feeCalculationMethod = [];
                $scope.feeCalculationMethod.push($scope.FeeConfig.CalculationMethod.Fixed);
                $scope.feeCalculationMethod.push($scope.FeeConfig.CalculationMethod.PercentOfInstallmentAmount);
            } else if (Number(applyItem) === $scope.FeeConfig.AppliesTo.Member.value) {
                $scope.feeCalculationMethod = [];
                $scope.feeCalculationMethod.push($scope.FeeConfig.CalculationMethod.Fixed);
            } else {
                $scope.feeCalculationMethod = angular.copy($scope.feeCalculationMethodList);
            }

            if (Number(applyItem) === $scope.FeeConfig.AppliesTo.Loan.value && Number($scope.fee.ChargeType) === $scope.FeeConfig.ChargeType.OneTimeFee.value) {
                $scope.timeOfCharge = [];
                $scope.timeOfCharge.push($scope.FeeConfig.TimeOfCharge.LoanDisbursement);
                $scope.fee.TimeOfCharge = $scope.FeeConfig.TimeOfCharge.LoanDisbursement.value;
                return;
            }
            else {
                $scope.timeOfCharge = angular.copy($scope.timeOfChargeList);
            }

            if (Number(applyItem) === $scope.FeeConfig.AppliesTo.Savings.value && Number($scope.fee.ChargeType) === $scope.FeeConfig.ChargeType.OneTimeFee.value) {
                $scope.timeOfCharge = [];
                $scope.timeOfCharge.push($scope.FeeConfig.TimeOfCharge.SavingsAccountActivation);
                $scope.fee.TimeOfCharge = $scope.FeeConfig.TimeOfCharge.SavingsAccountActivation.value;
                return;
            }
            else if (Number(applyItem) === $scope.FeeConfig.AppliesTo.Savings.value && Number($scope.fee.ChargeType) === $scope.FeeConfig.ChargeType.PeriodicFee.value) {
                $scope.timeOfCharge = [];
                $scope.timeOfCharge.push($rootScope.FeeConfig.TimeOfCharge.Yearly);
                $scope.fee.TimeOfCharge = $rootScope.FeeConfig.TimeOfCharge.Yearly.value;
                return;
            }
            else {
                $scope.timeOfCharge = angular.copy($scope.timeOfChargeList);
            }

            if (Number(applyItem) === $scope.FeeConfig.AppliesTo.Member.value && Number($scope.fee.ChargeType) === $scope.FeeConfig.ChargeType.OneTimeFee.value) {
                $scope.timeOfCharge = [];
                $scope.timeOfCharge.push($scope.FeeConfig.TimeOfCharge.MemberActivation);
                $scope.fee.TimeOfCharge = $scope.FeeConfig.TimeOfCharge.MemberActivation.value;
                return;
            } else if (Number(applyItem) === $scope.FeeConfig.AppliesTo.Member.value && Number($scope.fee.ChargeType) === $scope.FeeConfig.ChargeType.PeriodicFee.value) {
                $scope.timeOfCharge = [];
                $scope.timeOfCharge.push($rootScope.FeeConfig.TimeOfCharge.Yearly);
                $scope.fee.TimeOfCharge = $rootScope.FeeConfig.TimeOfCharge.Yearly.value;
                return;
            }
            else {
                $scope.timeOfCharge = angular.copy($scope.timeOfChargeList);
            }


            if (Number(applyItem) === $scope.FeeConfig.AppliesTo.Loan && Number($scope.fee.ChargeType) === $scope.FeeConfig.ChargeType.Insurance.value) {
                $scope.fee.TimeOfCharge = $scope.FeeConfig.TimeOfCharge.LoanDisbursement.value;
                return;
            }
            if (Number($scope.fee.ChargeType) === $scope.FeeConfig.ChargeType.LateFee.value) {
                $scope.appliesTo = angular.copy($scope.appliesToList);
                $scope.timeOfCharge = [];
                for (var i = 0; i < $scope.appliesTo.length; i++) {
                    if (Number($scope.appliesTo[i].value) === $scope.FeeConfig.AppliesTo.Member.value) {
                        $scope.appliesTo.splice(i, 1);
                    }
                }
                $scope.timeOfCharge.push($scope.FeeConfig.TimeOfCharge.ChargeWhenOverdue);
                $scope.fee.TimeOfCharge = $scope.FeeConfig.TimeOfCharge.ChargeWhenOverdue.value;
            }
        }

        $scope.calculationMethodChange = function (calculationMethod) {
            if (Number(calculationMethod) === $scope.FeeConfig.CalculationMethod.Fixed.value) {
                $scope.amountRate = "Amount";
            } else {
                $scope.amountRate = "Rate";
            }
        }

        $scope.onSubmitForm = function () {
            if (!$scope.addFeeForm.$valid) {
                $scope.addFeeForm.$dirty = true;
            } else {
                $scope.addFeeForm.$dirty = false;
            }
        }
        $scope.removefile = function (file, files, propertyName) {
            var value = file.name;
            var i = AMMS.findWithAttr(files, propertyName, value);
            files.splice(i, 1);
            $scope.file = null;

        }

        $scope.FeeRateFrequency = function () {
            $scope.RateFrequency = [];
            if ($scope.fee.ChargeType == 1) {
                $scope.RateFrequency.push({
                    Frequency: 1,
                    Value: 15
                });
            }
        }
        $scope.getServerDateTime = function ($date) {
            commonService.getServerDateTime().then(function (response) {
                $scope.serverDateTimeToday = response.data;
                $scope.fee.StartDate = moment(angular.copy($scope.serverDateTimeToday)).format();
                $scope.startDateRender($date);
            });
        }

        $scope.beforeStartDateRender = function ($dates) {
            if ($scope.serverDateTimeToday) {
                $scope.startDateRender($dates);
            } else {
                $scope.getServerDateTime($dates);
            }
            $scope.getStatusOptions();
        }

        $scope.startDateRender = function ($dates) {
            var minDate = new Date($scope.serverDateTimeToday).setUTCHours(0, 0, 0, 0);
            if ($dates.length > 27) {
                var nextThreeMonthsDate = new Date(minDate);
                nextThreeMonthsDate.setMonth(nextThreeMonthsDate.getMonth() + 3);
                var maxDate = new Date(nextThreeMonthsDate).setUTCHours(0, 0, 0, 0);
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        if ($dates[d].utcDateValue < minDate || $dates[d].utcDateValue > maxDate) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }

        }
        $scope.beforeEndDateRender = function ($dates) {
            var minDate = new Date($scope.fee.StartDate).setHours(0, 0, 0, 0);
            minDate = new Date(minDate);
            minDate.setDate(minDate.getDate() + 1);
            minDate = minDate.setHours(0, 0, 0, 0);
            if ($scope.fee.EndDate < minDate && ($scope.fee.EndDate !== null)) {
                swal('End date can not be less than start date');
                $scope.fee.EndDate = moment(minDate).format();
            }
            for (d in $dates) {
                if ($dates.hasOwnProperty(d)) {
                    if ($dates.length > 27) {
                        if ($dates[d].utcDateValue <= minDate) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }
        }
        $scope.removeEndDate = function () {
            $scope.fee.EndDate = undefined;
        }
        $scope.getStatusOptions = function () {
            feeService.getFeeConfig("Status").then(function (response) {
                $scope.feeStatus = response.data;
                var today = moment($scope.serverDateTimeToday).format('YYYY-MM-DD');
                var startDate = moment($scope.fee.StartDate).format('YYYY-MM-DD');
                if (today === startDate) {
                    $scope.fee.Status = $scope.feeStatus[0].value;
                } else {
                    $scope.fee.Status = $scope.feeStatus[1].value;
                }
            });

        }


        $scope.init();
        $scope.addFee = function () {
            $scope.fee.StartDate = moment($scope.fee.StartDate).format();
            $scope.fee.EndDate = $scope.fee.EndDate !== undefined ? moment($scope.fee.EndDate).format() : undefined;
            if ($scope.fee.StartDate >= $scope.fee.EndDate) {
                swal({
                    title: "Error!",
                    text: "End date can not be less than or equal to Start date",
                    type: "error",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                });
                return;
            }



            if ($scope.files) {
                if ($scope.files.length > 5) {
                    swal("More than 5 files have been selected", 'WARNING', 'warning');
                    return;
                }
                $scope.files.forEach(function (file) {
                    if (file.size > (1024 * 1024) * ($rootScope.documentSize)) {
                        $scope.docError = true;
                    }

                });
            }

            if ($scope.docError) {
                swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');
                $scope.docError = false;
                return;
            }
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.fee),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.fee.FeeRateFrequency = [];
                    $scope.FeeRate = [];
                    $scope.fee.StartDate = moment($scope.fee.StartDate).format();
                    $scope.fee.EndDate = $scope.fee.EndDate !== undefined ? moment($scope.fee.EndDate).format() : null;
                    if (Number($scope.fee.ChargeType) === $scope.FeeConfig.ChargeType.Insurance.value) {
                        $scope.fee.FeeRateFrequency = angular.copy($scope.FeeFrequency);
                        $scope.durationPrincipleRangeForMSMEInsurance.forEach(function (item) {
                            $scope.fee.FeeRateFrequency.push(item);
                        });
                        $scope.fee.IsRateOrFrequency = 1;
                    } else if (Number($scope.fee.ChargeType) === $scope.FeeConfig.ChargeType.LateFee.value) {
                        $scope.frequencyRateValue.forEach(function (frequencyRate, index) {
                            $scope.FeeRate.push({ Frequency: $scope.frequencyRate[index], Value: frequencyRate });
                        });
                        $scope.fee.FeeRateFrequency = angular.copy($scope.FeeRate);
                        $scope.fee.IsRateOrFrequency = 0;
                    } else {
                        $scope.fee.FeeRateFrequency.push({
                            Value: $scope.feeValue, AmountOrRate: $scope.fee.CalculationMethod == $rootScope.FeeConfig.CalculationMethod.Fixed.value ? true : false
                        });
                    }
                    console.log($scope.fee);
                    feeService.addFee($scope.fee).
                        then(function (response) {
                            if (response.data.Success) {
                                if (response.data.Entity.Id && $scope.files.length > 0) {
                                    documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.Fee, $rootScope.user.UserId)
                                        .then(function (res) {

                                            if (res.data.Success) {
                                                swal(
                                                    {
                                                        title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.fee),
                                                        text: "Close?",
                                                        type: "success",
                                                        confirmButtonColor: "#008000",
                                                        confirmButtonText: "Ok",
                                                        closeOnConfirm: true
                                                    },
                                                    function (isConfirm) {
                                                        if (isConfirm) {
                                                            //$scope.addFeeForm.reset();
                                                            //$scope.addFeeForm.$dirty = false;
                                                            $scope.clearAndCloseTab();
                                                            //$scope.addFeeForm.$setPristine();
                                                            $scope.init();
                                                        }
                                                    });
                                            } else {
                                                $scope.uploadError = true;
                                                feeService.delete(response.data.Entity.Id);
                                                swal($rootScope.docAddError, "File is not Uploaded", "error");
                                            }
                                        });

                                } else {
                                    if (!$scope.uploadError) {
                                        $rootScope.$broadcast('fee-add-finished', $scope.fee);
                                        swal(
                                            {
                                                title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.fee),
                                                text: "Close?",
                                                type: "success",
                                                confirmButtonColor: "#008000",
                                                confirmButtonText: "Ok",
                                                closeOnConfirm: true
                                            },
                                            function (isConfirm) {
                                                if (isConfirm) {
                                                    //$scope.addFeeForm.reset();
                                                    //$scope.addFeeForm.$dirty = false;
                                                    $scope.clearAndCloseTab();
                                                    //$scope.addFeeForm.$setPristine();
                                                    $scope.init();
                                                } else {
                                                    $scope.clearAndCloseTab();
                                                }
                                            });
                                    }
                                    $scope.clearAndCloseTab();
                                }
                            } else {
                                swal($rootScope.showMessage($rootScope.addError, $rootScope.fee), response.data.Message, "error");
                            }
                        });
                }

            });

        }
        $scope.clearAndCloseTab = function () {
            $scope.fee = {};

            $scope.type = null;
            $scope.typeList = null;
            $scope.appliesTo = null;
            $scope.appliesToList = null;
            $scope.timeOfCharge = null;
            $scope.timeOfChargeList = null;
            $scope.feeCalculationMethod = null;
            $scope.feeCalculationMethodList = null;
            $scope.feePolicy = null;
            $scope.feePolicyList = null;
            $scope.RateFrequency = [];
            $scope.feeStatus = null;
            $scope.frequencyList = [];
            $scope.frequencyRate = [];
            $scope.frequencyRateValue = [];
            $scope.selectedFrequency = null;
            $scope.FeeFrequency = [];
            $scope.FeeRate = [];
            $scope.execRemoveTab($scope.tab);
        };

        //new datepicker
        $scope.today = function () {
            $scope.fee.StartDate = new Date($rootScope.workingdate);
            $scope.fee.EndDate = new Date($rootScope.workingdate);

        };
        $scope.today();


        //$scope.clear = function () {
        //    $scope.member.AdmissionDate = null;
        //};

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($rootScope.workingdate),
            showWeeks: true
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            //console.log((new Date($rootScope.workingdate)).getDate);
            return (mode === 'day' && (date.getDay() === 5))
                || (moment(date) > moment(new Date($rootScope.workingdate)).add(1, 'days'));
        }
        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2040, 5, 22),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate.getDate() + 1);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.openStartDate = function () {
            $scope.popupStartDate.opened = true;
        };
        $scope.openEndDate = function () {
            $scope.popupEndDate.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popupStartDate = {
            opened: false
        };
        $scope.popupEndDate = {
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
        $scope.startDateValidator = function () {
            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM) {
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
            //if (moment($scope.fee.StartDate).valueOf() < moment($scope.fee.EndDate).valueOf()) {
            //    swal('please select valid admission date!');
            //    $scope.today();
            //    return;
            //}
            if (moment($scope.fee.StartDate).valueOf() > maxDate || moment($scope.fee.StartDate).valueOf() < minDate) {
                swal('please select valid date!');
                $scope.today();
                return;
            }


            if (moment($scope.fee.StartDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
                swal("unable to select future date!");
                $scope.today();
                return;
            }

            //$scope.isHolidayOrOffDay($scope.fee.StartDate);
        }
        $scope.endDateValidator = function () {
            if (moment($scope.fee.EndDate) < moment(new Date($scope.fee.StartDate))) {
                swal("unable to select past date!");

                return;
            }

        }
    }
]);