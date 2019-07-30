﻿ammsAng.controller('employeeAccountTypeEditController', ['$scope', '$rootScope', 'employeeService',
    function ($scope, $rootScope, employeeService) {
        $scope.accountType = {};
        $scope.TypeList = [];
        $scope.CategoryList = [];
        $scope.OfficeLevelList = [];
        $scope.accountType.PermittedOfficeLevel = [];
        $scope.accountType.DurationInMonth = [];
        $scope.accountType.RecurringInPayroll = false;
        $scope.accountType.RecurringInSalaryStructure = false;
        $scope.accountType.CreateBlankAccount = false;
        $scope.accountType.IsBallanceCarryforward = false;
        $scope.accountType.IsMultiple = false;

        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value'
        };

        $scope.getFilterData = function () {
            employeeService.getEmployeeAccountTypeConfig().then(function (response) {
                console.log(response.data);
                console.log(response.data.TypeList);
                $scope.TypeList = angular.copy(response.data.TypeList);
               // if ($scope.TypeList.length > 0) $scope.accountType.Type = $scope.TypeList[0].Value;
                $scope.CategoryList = angular.copy(response.data.CategoryList);
               // if ($scope.CategoryList.length > 0) $scope.accountType.Category = $scope.CategoryList[0].Value;
                $scope.OfficeLevelList = angular.copy(response.data.OfficeLevelList);
              //  $scope.DurationList = angular.copy(response.data.DurationList);
                $scope.StatusList = angular.copy(response.data.StatusList);

                $scope.DurationList = [];

                for (var i = 1; i <= 120; i = i + 6) {

                    $scope.DurationList.push({
                        Name: i.toString(),
                        Value: i
                    });
                    if (i === 1) i = 0;
                }

            });
        }
        $scope.init=function() {
            $scope.getFilterData();
            $scope.getAccountTypeInfo();
        }


        $scope.getAccountTypeInfo = function () {
            var accountTypeId = $rootScope.editemployeeAccountType.Id;
            employeeService.getAccountTypeById(accountTypeId).then(function (response) {
                $scope.accountType = response.data;

                $scope.accountType.EffectiveDateFrom = $scope.accountType.EffectiveDateFrom !== null ? new Date($scope.accountType.EffectiveDateFrom) : null;
                $scope.accountType.EffectiveDateTo = $scope.accountType.EffectiveDateTo !== null ? new Date($scope.accountType.EffectiveDateTo) : null;

                $scope.accountType.PermittedOfficeLevel = angular.copy($scope.accountType.PermittedOfficeLevel.split(',').map(function (e) { return { id: parseInt(e)}}));
                $scope.accountType.DurationInMonth = angular.copy($scope.accountType.DurationInMonth.split(',').map(function(e) {return {id:parseInt(e)}}));
            });
        }
        

        $scope.editAccountType = function () {

            if ($scope.accountType.Category === 1 && $scope.accountType.DurationInMonth.length < 1) {
                swal('please select at least one duration!');
                return;
            }
            if ($scope.accountType.PermittedOfficeLevel.length < 1) {
                swal('please select at least one Permitted Office Level!');
                return;
            }
            if ($scope.accountType.EffectiveDateFrom == undefined) {
                swal('please select an effective from date!');
                return;
            }
            if ($scope.accountType.Status === 2 && ($scope.accountType.EffectiveDateTo === undefined || $scope.accountType.EffectiveDateTo === null)) {
                swal('please select an end-date for inactive account type!');
                return;
            }

            console.log($scope.accountType);
           
            $scope.accountType.User = $rootScope.UserId;
            if (moment($scope.accountType.EffectiveDateFrom) >= moment($scope.accountType.EffectiveDateTo)) {
                swal({
                    title: "Error!",
                    text: "End date can not be less than or equal to Start date",
                    type: "error",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                });
                return;
            }

            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.employeeAccountType),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function (isConfirmed) {
                if (isConfirmed) {
                    console.log($scope.accountType);
                    $scope.accountType.EffectiveDateFrom = moment($scope.accountType.EffectiveDateFrom).format();
                    $scope.accountType.EffectiveDateTo = $scope.accountType.EffectiveDateTo !== undefined ? moment($scope.accountType.EffectiveDateTo).format() : undefined;
                    if ($scope.accountType.Category !== 1) {
                        $scope.accountType.InterestRate = undefined;
                        $scope.accountType.DurationInMonth = [];
                    }
                    $scope.accountType.PermittedOfficeLevel =
                Object.keys($scope.accountType.PermittedOfficeLevel).map(function (k) { return $scope.accountType.PermittedOfficeLevel[k].id }).join(",");
                   $scope.accountType.DurationInMonth =
                Object.keys($scope.accountType.DurationInMonth).map(function (k) { return $scope.accountType.DurationInMonth[k].id }).join(",");
                    employeeService.editAccountType($scope.accountType).
                        then(function (response) {

                            if (response.data.Success) {
                                $rootScope.$broadcast('employeeAccountType-edit-finished');
                                swal(
                                    {
                                        title: $rootScope.showMessage($rootScope.editSuccess, $rootScope.employeeAccountType),
                                        text: "Close?",
                                        type: "success",
                                        confirmButtonColor: "#008000",
                                        confirmButtonText: "Ok",
                                        closeOnConfirm: true
                                    },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            $scope.clearAndCloseTab();
                                            $scope.init();
                                        }
                                    });
                            }

                            else {
                                swal($rootScope.showMessage($rootScope.editError, $rootScope.employeeAccountType), response.data.Message, "error");
                                //$scope.accountType.EffectiveDateFrom = $scope.accountType.EffectiveDateFrom !== null ? new Date($scope.accountType.EffectiveDateFrom) : null;
                                //$scope.accountType.EffectiveDateTo = $scope.accountType.EffectiveDateTo !== null ? new Date($scope.accountType.EffectiveDateTo) : undefined;

                                //$scope.accountType.PermittedOfficeLevel = angular.copy($scope.accountType.PermittedOfficeLevel.split(',').map(function (e) { return { id: parseInt(e) } }));
                                //$scope.accountType.DurationInMonth = angular.copy($scope.accountType.DurationInMonth.split(',').map(function (e) { return { id: parseInt(e) } }));

                               // $scope.editAccountTypeForm.$valid = true;
                                //  $scope.editAccountTypeForm.$dirty = false;
                                $scope.getAccountTypeInfo();
                            }
                        });
                }
            });
        }

        $scope.init();



        $scope.$on('tab-switched', function () {
            if ($rootScope.hasOwnProperty("editemployeeAccountType")) {
                $scope.getAccountTypeInfo();
            }
        });

        $scope.clearModelData = function () {
              $scope.accountType = {};
        }

        $scope.clearAndCloseTab = function () {
            $scope.accountType = {};
            $scope.accountType.PermittedOfficeLevel = [];
            $scope.accountType.DurationInMonth = [];
            $scope.accountType.RecurringInPayroll = false;
            $scope.accountType.RecurringInSalaryStructure = false;
            $scope.accountType.CreateBlankAccount = false;
            $scope.accountType.IsBallanceCarryforward = false;
            $scope.accountType.IsMultiple = false;
            $scope.removeTab($scope.tab);
        };


        //new datepicker
        $scope.today = function () {
            $scope.accountType.EffectiveDateFrom = new Date($rootScope.workingdate);


        };
       // $scope.today();


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
            return (mode === 'day' && (date.getDay() === 5));
            //|| (moment(date) > moment(new Date($rootScope.workingdate)).add(1, 'days'));
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

        $scope.openFpop = function () {
            $scope.openingFPop.opened = true;
        };
        $scope.openTpop = function () {
            $scope.openingTPop.opened = true;
        };
        
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.openingFPop = {
            opened: false
        };
        $scope.openingTPop = {
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
        $scope.efdValidator = function () {
            if (($scope.accountType.EffectiveDateTo !== undefined && $scope.accountType.EffectiveDateTo !== null) && (moment($scope.accountType.EffectiveDateTo) < moment($scope.accountType.EffectiveDateFrom))) {
                swal("Effective From Date Can not be less than effective to date!");
                $scope.accountType.EffectiveDateFrom = new Date($rootScope.workingdate);
                return;
            }
        }
        $scope.etdValidator = function () {
            if (($scope.accountType.EffectiveDateFrom !== undefined && $scope.accountType.EffectiveDateFrom !== null) && (moment($scope.accountType.EffectiveDateTo) < moment($scope.accountType.EffectiveDateFrom))) {
                swal("Effective To Date Can not be greater than effective from date!");
                $scope.accountType.EffectiveDateTo = null;
                return;
            }

        }
    }
]);