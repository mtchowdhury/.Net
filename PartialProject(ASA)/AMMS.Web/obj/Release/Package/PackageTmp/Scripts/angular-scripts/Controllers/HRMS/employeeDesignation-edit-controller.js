ammsAng.controller('employeeDesignationEditController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'employeeDesignationService',
    function ($scope, $rootScope, $timeout, $q, filterService, employeeDesignationService) {
        $scope.isDirty = false;
        $scope.filters = {};
        
        $scope.OpenLetterDate = false;
        $scope.OpenStartDate = false;
        $scope.OpenEndDate = false;
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        //$scope.format = $scope.formats[0];
        $scope.format = $rootScope.formats[4];
        
        
        $scope.getAllFilters = function () {
            employeeDesignationService.getemployeeDesignationFilters($rootScope.user.Role, $rootScope.selectedBranchIdForEmployeeDesignation).then(function (filterdata) {
                console.log($rootScope.editemployeeDesignation);
                
                $scope.employeeDesignationToEdit = angular.copy($rootScope.editemployeeDesignation);
                $scope.filters.Grades = $scope.filters.GradesListMain =filterdata.data.grades;
                $scope.filters.Designations = $scope.filters.DesignationListmain = filterdata.data.designations;
                $scope.filters.Employees = filterdata.data.employees;
                $scope.filters.EmployeeDesignations = filterdata.data.employeeDesignations;
                $scope.filters.DesignationChangePurposes = filterdata.data.designationChangePurposes.filter(e=>e.Value!==1);
                $scope.filters.statuses = filterdata.data.designationStatuses;
                $scope.filters.inactiveReasons = filterdata.data.inactiveReasons.filter(e=>e.Value !== 4);//release show kora jabe na 
                $scope.modifyEmployee();
                $scope.updateEmployeeDesignation();
                $scope.UpdateDesignationList($scope.employeeDesignationToEdit.GradeId);
                console.log($scope.employeeDesignationToEdit);
                $scope.employeeDesignationToEdit.StartDate = new Date($scope.employeeDesignationToEdit.StartDate);
                $scope.employeeDesignationToEdit.LetterDate =$scope.employeeDesignationToEdit.LetterDate!==null? new Date($scope.employeeDesignationToEdit.LetterDate):null;
                if ($scope.employeeDesignationToEdit.EndDate != null) {
                    $scope.employeeDesignationToEdit.EndDate = new Date($scope.employeeDesignationToEdit.EndDate);
                    $scope.employeeDesignationToEdit.StatusId = 2;
                } else {
                    $scope.employeeDesignationToEdit.StatusId = 1
                }

            });
        };

        $scope.modifyEmployee = function() {
            var endYear = moment($scope.employeeDesignationToEdit.EndDate).year();
            if (endYear < 1900) $scope.employeeDesignationToEdit.EndDate = null;
            $scope.employeeDesignationToEdit.PurposeId = 4;
            if ($scope.employeeDesignationToEdit.InactiveReasonId == null || $scope.employeeDesignationToEdit.InactiveReasonId === -1) $scope.employeeDesignationToEdit.StatusId = 1;


        };

        $scope.updateEmployeeDesignation = function() {
            $scope.currentDesignation = $scope.filters.EmployeeDesignations.filter(e => e.Value == $scope.employeeDesignationToEdit.EmployeeId)[0].RelationalValue;
            $scope.currentGrade = $scope.filters.DesignationListmain.filter(d => d.Value == $scope.currentDesignation)[0].RelationalValue;
            $scope.currentGradeOrder = $scope.filters.GradesListMain.filter(d => d.Value == $scope.currentGrade)[0].Order;
            $scope.employeeDesignationToEdit.CurrentDesignation = $scope.filters.DesignationListmain.filter(d => d.Value == $scope.currentDesignation)[0].Name;
            $scope.employeeDesignationToEdit.CurrentGrade = $scope.filters.GradesListMain.filter(g => g.Value == $scope.currentGrade)[0].Name;
            $scope.updateGradeDesignations($scope.employeeDesignationToEdit.PurposeId);
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

        //$scope.resetEndDate = function() {
        //    $scope.employeeDesignationToEdit.EndDate = null;
        //    $scope.employeeDesignationToEdit.StatusId = 1;
        //    $scope.employeeDesignationToEdit.InactiveReasonId = null;
        //    $scope.employeeDesignationToEdit.InactiveReasonRemark = null;
        //}

        $scope.checkStartDate = function() {
            if ($scope.employeeDesignationToEdit.EndDate < $scope.employeeDesignationToEdit.StartDate) {
                swal("Start date cant be greater then end date");
                return true;
            }
            return false;
        }

        $scope.checkEndDate = function() {
            if ($scope.employeeDesignationToEdit.EndDate != null) $scope.employeeDesignationToEdit.StatusId = 2;
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

        $scope.editEmployeeDesignation = function () {

            $scope.employeeDesignationToSend = angular.copy($scope.employeeDesignationToEdit);
            if ($scope.employeeDesignationToEdit.EndDate != null) {
                if($scope.checkStartDate())return;
                
            }



            if ($scope.employeeDesignationToEdit.StatusId === 2 && $scope.employeeDesignationToEdit.EndDate == null) {
                swal("please Select an EndDate");
                return;
            } 



            $scope.checkEndDate();
            if ($scope.employeeDesignationToEdit.StatusId === 2 && ($scope.employeeDesignationToEdit.InactiveReasonId === -1 || $scope.employeeDesignationToEdit.InactiveReasonId ==null)) {
                swal("please select an Inactive reason");

            
                return;
            }


            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.employeeDesignation),
                showCancelButton: true,
                confirmButtonText: "Yes, Edit it!",
                cancelButtonText: "No, cancel!",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function (isConfirmed) {
                if (isConfirmed) {
                    $scope.employeeDesignationToSend.StartDate = moment($scope.employeeDesignationToSend.StartDate).format();
                    if ($scope.employeeDesignationToEdit.EndDate != null) {
                        
                        $scope.employeeDesignationToSend.EndDate = moment($scope.employeeDesignationToSend.EndDate).format();
                    }
                    $scope.employeeDesignationToSend.LetterDate = moment($scope.employeeDesignationToSend.LetterDate).format();
                    $scope.employeeDesignationToSend.UpdatedBy = $rootScope.user.UserId;
                    $scope.employeeDesignationToSend.StartDate = moment($scope.employeeDesignationToSend.StartDate).format();
                   
                    
                    
                    employeeDesignationService.editEmployeeDesignation($scope.employeeDesignationToSend)
                        .then(function (response) {

                            if (response.data.Success) {
                                $rootScope.$broadcast('employeeDesignation-edit-finished');
                                swal({
                                    title: $rootScope.showMessage($rootScope.editSuccess, $rootScope.employeeDesignation),
                                    closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                    function (isConfirm) {
                                          $scope.clearAndCloseTab();
                                        
                                    });
                            } else {
                                swal($rootScope.showMessage($rootScope.addError, $rootScope.employeeDesignation), response.data.Message, "error");
                            }

                        });

                }
            });
        }

        $scope.statusChanged = function () {
            if ($scope.employeeDesignationToEdit.StatusId == 1) {
                $scope.employeeDesignationToEdit.EndDate = null;
            }
        }

        $scope.clearModelData = function () {
           
        }

        $scope.clearAndCloseTab = function () {
            $scope.employeeDesignationToEdit = {};
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