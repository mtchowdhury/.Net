ammsAng.controller('designationAddController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'gradeAndDesignationService',
    function($scope, $rootScope, $timeout, $q, filterService, gradeAndDesignationService) {
        $scope.designation = {};
        $scope.filters = {};

        //$scope.beforeStartDateRender = function ($dates) {
        //    //$scope.employee.JoiningDate = moment().format();
        //    if (($scope.designation.StartDate !== undefined && $scope.designation.StartDate !== null)
        //        && ($scope.designation.EndDate !== undefined && $scope.designation.EndDate !== null)
        //        && ($scope.designation.StartDate > $scope.designation.EndDate)) {
        //        swal('Start Date can not be greater than End date! ');
        //        $scope.designation.StartDate = null;
        //        return;
        //    }

        //}
        //$scope.beforeEndDateRender = function ($dates) {
        //    //$scope.employee.JoiningDate = moment().format();
        //    if (($scope.designation.StartDate !== undefined && $scope.designation.StartDate !== null)
        //        && ($scope.designation.EndDate !== undefined && $scope.designation.EndDate !== null)
        //        && ($scope.designation.StartDate > $scope.designation.EndDate)) {
        //        swal('Start Date can not be greater than End date! ');
        //        $scope.designation.EndDate = null;
        //        return;
        //    }

        //}


        $scope.getFilterData = function() {
            gradeAndDesignationService.getAllDesignationFilterData().then(function(response) {
                $scope.filters = response.data;
                $scope.designation.Status = 1;
            });
        }
        $scope.addDesignation = function() {
            if ($scope.designation.Startdate === null || $scope.designation.Startdate === undefined) {
                swal("please select a start date!");
                return;
            }


            swal({
                title: "confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.designation),
                showCancelButton: true,
                confirmButtonText: "yes,Create it!",
                cancelButtonText: "No,Cancel!",
                type: 'info',
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function(isConfirmed) {
                if (isConfirmed) {
                    if ($scope.designation.Startdate !== null && $scope.designation.Startdate !== undefined) $scope.designation.Startdate = moment($scope.designation.Startdate).format();
                    if ($scope.designation.EndDate !== null && $scope.designation.EndDate !== undefined) $scope.designation.EndDate = moment($scope.designation.EndDate).format();
                    gradeAndDesignationService.addDesignation($scope.designation).then(function(response) {
                        if (response.data.Success) {
                            $rootScope.$broadcast('designation-add-finished');
                            swal({
                                    title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.designation),
                                    text: "What do you want to do next?",
                                    type: "success",
                                    showCancelButton: true,
                                    confirmButtonColor: "#008000",
                                    confirmButtonText: "Add New",
                                    cancelButtonText: "Close and Exit",
                                    closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                function(isConfirmed) {
                                    if (isConfirmed) {
                                        $scope.designationAddForm.reset();
                                        $scope.designationAddForm.$dirty = false;
                                        $timeout(function() { $scope.clearModelData(); }, 300);
                                    } else {
                                        $timeout(function() { $scope.clearAndCloseTab(); }, 300);
                                    }
                                });
                        } else {
                            swal($rootScope.showMessage($rootScope.addError, $rootScope.designation), response.data.Message, "error");
                        }
                    });
                }
            });
        }

        $scope.init = function() {
            $scope.getFilterData();
        }
        $scope.init();



//new date picker 
        $scope.today = function() {
            //$scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
            //$scope.eaccount.DisburseDate = new Date($rootScope.workingdate);
            $scope.designation.Startdate = new Date($rootScope.workingdate);
        };
        $scope.today();


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
            return (mode === 'day' && (date.getDay() === 5));
            //            || (moment(date) > moment(new Date($rootScope.workingdate)));
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate.getDate() + 1);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.openSDPop = function() {
            $scope.openingSDPop.opened = true;
        };

        $scope.openEDPop = function() {
            $scope.openingEDPop.opened = true;
        };

        // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','dd/MM/yyyy'];
        $scope.format = $rootScope.formats[4];
        //$scope.format = $scope.altInputFormats;
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.openingSDPop = {
            opened: false
        };

        $scope.openingEDPop = {
            opened: false
        };


        function getDayClass(data) {
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

        $scope.sdValidator = function() {
            if (($scope.designation.Startdate !== undefined && $scope.designation.Startdate !== null)
                && ($scope.designation.EndDate !== undefined && $scope.designation.EndDate !== null)
                && (moment($scope.designation.Startdate).valueOf() > moment($scope.designation.EndDate).valueOf())) {
                swal('Start Date can not be greater than End date! ');
                $scope.designation.Startdate = null;
                return;
            }
        }
            $scope.edValidator = function() {
                if (($scope.designation.Startdate !== undefined && $scope.designation.Startdate !== null)
                    && ($scope.designation.EndDate !== undefined && $scope.designation.EndDate !== null)
                    && (moment($scope.designation.Startdate).valueOf() > moment($scope.designation.EndDate).valueOf())) {
                    swal('Start Date can not be greater than End date! ');
                    $scope.designation.EndDate = null;
                    return;
                }
            }
        


        $scope.clearModelData = function() {
                $scope.designation = {};
                $scope.filters();
            }

            $scope.clearAndCloseTab = function() {
                $scope.designation = {};
                $timeout(function() {
                    $('#saveComplete').modal('hide');
                    $('.modal-backdrop').remove();
                }, 500);
                $scope.execRemoveTab($scope.tab);
            };

        
    }
]);