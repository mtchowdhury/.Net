ammsAng.controller('employeeDesignationAddController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService','commonService', 'employeeDesignationService',
    function ($scope, $rootScope, $timeout, $q, filterService, commonService, employeeDesignationService) {
        $scope.isDirty = false;
        $scope.filters = {};
        $scope.employeeDesignationToAdd = {};
        $scope.OpenLetterDate = false;
        $scope.OpenStartDate = false;
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
       // $scope.format = $scope.formats[0];
        $scope.format = $rootScope.formats[4];
        $scope.getAllFilters = function () {
            employeeDesignationService.getemployeeDesignationFilters($rootScope.user.Role, $rootScope.selectedBranchId).then(function (filterdata) {
                console.log(filterdata.data);
                $scope.filters.Grades = $scope.filters.GradesListMain =filterdata.data.grades;
                $scope.filters.Designations = $scope.filters.DesignationListmain = filterdata.data.designations;
               // $scope.filters.Employees = filterdata.data.employees;
                $scope.filters.EmployeeDesignations = filterdata.data.employeeDesignations;
                $scope.filters.DesignationChangePurposes = filterdata.data.designationChangePurposes.filter(e=>e.Value!==1);
                $scope.filters.statuses = filterdata.data.designationStatuses.filter(e=>e.Value!==2);
                $scope.filters.inactiveReasons = filterdata.data.inactiveReasons;
                $scope.employeeDesignationToAdd.StatusId = $scope.filters.statuses[0].Value;
                $scope.getEmployees();
            });
        };
        $scope.getEmployees= function() {
            commonService.getEmployeeFilterFromSP($rootScope.selectedBranchId, $rootScope.user.Role, $rootScope.user.EmployeeId, false,moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function(response) {
                $scope.filters.Employees = response.data;
            });
        }
        $scope.updateEmployeeDesignation = function() {
            var employeeDesignationCurrent = $scope.filters.EmployeeDesignations.filter(e => e.Value == $scope.employeeDesignationToAdd.EmployeeId)[0];
            $scope.currentDesignation = employeeDesignationCurrent.RelationalValue;
            $scope.currentGrade = $scope.filters.DesignationListmain.filter(d => d.Value == $scope.currentDesignation)[0].RelationalValue;
            $scope.currentGradeOrder = $scope.filters.GradesListMain.filter(d => d.Value == $scope.currentGrade)[0].Order;
            $scope.employeeDesignationToAdd.CurrentDesignation = $scope.filters.DesignationListmain.filter(d => d.Value == $scope.currentDesignation)[0].Name;
            $scope.employeeDesignationToAdd.CurrentGrade = $scope.filters.GradesListMain.filter(g => g.Value == $scope.currentGrade)[0].Name;
            $scope.updateGradeDesignations($scope.employeeDesignationToAdd.PurposeId);
            if (moment(employeeDesignationCurrent.Date).year() > 1970) {
                $scope.employeeDesignationToAdd.StartDate = new Date(moment(employeeDesignationCurrent.Date).add(1, 'days'));
            } else delete $scope.employeeDesignationToAdd.StartDate;

        }
        
        $scope.UpdateDesignationList = function(gradeId) {
            $scope.filters.filteredDesignations = $scope.filters.Designations.filter(e => e.RelationalValue == gradeId);
        }

       
        $scope. updateGradeDesignations = function(purposeId) {
            if (purposeId == 2) {
                $scope.filters.Grades = $scope.filters.GradesListMain.filter(g => g.Order < $scope.currentGradeOrder);
            }
            if (purposeId == 3) {
                $scope.filters.Grades = $scope.filters.GradesListMain.filter(g => g.Order > $scope.currentGradeOrder);
            }
            if (purposeId == 4) {
                $scope.filters.Grades = $scope.filters.GradesListMain.filter(g => g.Order == $scope.currentGradeOrder);
            }
        }

        $scope.resetEndDate = function() {
            $scope.employeeDesignationToAdd.EndDate = null;
        }

        $scope.checkStartDate = function() {
            if ($scope.employeeDesignationToAdd.EndDate < $scope.employeeDesignationToAdd.StartDate) {
                swal("Start date cant be greater then end date");
                return true;
            }
            return false;
        }

        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5) || (moment(date) > moment(new Date($rootScope.workingdate)).add(1, 'days'))); //ekhane workig date boshabo 
        }

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.addEmployeeDesignation = function () {
            if ($scope.employeeDesignationToAdd.EndDate != null) {
                if($scope.checkStartDate())return;
                
            }


            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.employeeDesignation),
                showCancelButton: true,
                confirmButtonText: "Yes, Create it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.employeeDesignationToAdd.StartDate = moment($scope.employeeDesignationToAdd.StartDate).format();
                    if ($scope.employeeDesignationToAdd.EndDate != null) {
                        
                        $scope.employeeDesignationToAdd.EndDate = moment($scope.employeeDesignationToAdd.EndDate).format();
                    }
                    $scope.employeeDesignationToAdd.LetterDate = moment($scope.employeeDesignationToAdd.LetterDate).format();
                    $scope.employeeDesignationToAdd.CreatedBy = $rootScope.user.UserId;
                    
                    employeeDesignationService.addEmployeeDesignation($scope.employeeDesignationToAdd)
                        .then(function (response) {

                            if (response.data.Success) {
                                $rootScope.$broadcast('employeeDesignation-add-finished');
                                swal({
                                    title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.employeeDesignation),
                                    text: "What do you want to do next?",
                                    type: "success",
                                    showCancelButton: true,
                                    confirmButtonColor: "#008000",
                                    confirmButtonText: "Add New",
                                    cancelButtonText: "Close and Exit",
                                    closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            $scope.employeeDesignationAddForm.reset();
                                            $scope.employeeDesignationAddForm.$dirty = false;
                                            $scope.clearModelData();
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                            } else {
                                swal($rootScope.showMessage($rootScope.addError, $rootScope.employeeDesignation), response.data.Message, "error");
                            }

                        });

                }
            });
        }

        $scope.clearModelData = function () {
            $scope.employeeDesignationToAdd = {};
        }

        $scope.clearAndCloseTab = function () {
            $scope.employeeDesignationToAdd = {};
            $scope.execRemoveTab($scope.tab);
        };

        $scope.$on('tab-switched', function () {

        });

        $scope.init = function () {
            $scope.getAllFilters();

        }

        $scope.init();
    }
]);