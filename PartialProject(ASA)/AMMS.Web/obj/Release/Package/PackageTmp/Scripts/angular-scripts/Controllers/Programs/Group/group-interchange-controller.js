ammsAng.controller('loanGroupInterchangeController', ['$scope', '$rootScope', 'validatorService', 'branchService', 'loanGroupService',
    function ($scope, $rootScope, validatorService, branchService, loanGroupService) {
        $scope.interchange = {};
        $scope.cycleComplete = true;
        $scope.interchange.fromOfficerList = [];
        $scope.interchange.toOfficerList = [];
        $scope.interchagedGroups = {};
        $scope.interchagedGroups.InterchangeDate = moment($rootScope.workingdate).format();
        $scope.isThirtyFirstToday = moment($rootScope.workingdate).format('DD-MM')==='31-12';
        
        $scope.getDetails = function (branchId) {
            if (branchId != null) {
                branchService.getLoanfficersOfBrnach(branchId).then(function (response) {
                    response.data = $scope.menus[0].SubModules;
                    for (var i = 0; i < $scope.menus[0].SubModules.length; i++) {
                        //response.data[i].Name = $scope.menus[0].SubModules[i].DisplayName;
                        //response.data[i].Name = $scope.menus[0].SubModules[i].ToolTip;
                        response.data[i].Value = $scope.menus[0].SubModules[i].Id.toString();
                    }
                    response.data.forEach(function (officer) { officer.disabled = false });
                    $scope.toLoanOfficers = angular.copy(response.data);
                    $scope.toLoanOfficers.forEach(function (officer) {
                       // officer.fullName = officer.ToolTip.substring(0, officer.ToolTip.indexOf('('));
                        officer.fullName = officer.Name;
                    });
                    $scope.fromLoanOfficers = angular.copy(response.data);
                    $scope.fromLoanOfficers.forEach(function(officer) {
                       // officer.fullName = officer.ToolTip.substring(0, officer.ToolTip.indexOf('('));
                        officer.fullName = officer.Name;
                    });
                    $scope.originalData = response.data;
                }, AMMS.handleServiceError);
            }
        }

        $scope.interchangeGroups = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
           
            if ($scope.interchange.fromOfficerList.length > 0) {


                $scope.interchagedGroups.fromOfficerList = [];
                $scope.interchagedGroups.toOfficerList = [];


                $scope.interchange.fromOfficerList.forEach(function(fOfficer) {
                    $scope.interchagedGroups.fromOfficerList.push(fOfficer.Value);
                });
                $scope.interchange.toOfficerList.forEach(function(tOfficer) {
                    $scope.interchagedGroups.toOfficerList.push(tOfficer.Value);
                });

                $scope.interchagedGroups.CreatedBy = $rootScope.user.UserId;
                swal({
                        title: "Confirm?",
                        text: "groups will be Interchanged !",
                        type: "info",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true,
                    },
                    function() {
                        loanGroupService.interchangeGroups($scope.interchagedGroups).then(function(response) {
                            if (response.data.Success) {
                                swal("Groups Interchanged", "Successfully!", "success");
                                $rootScope.$broadcast('group-interchange-finished');
                                $scope.getMenus();
                                $scope.interchange.fromOfficerList = [];
                                $scope.interchange.toOfficerList = [];
                                $scope.toLoanOfficers = angular.copy($scope.originalData);
                                $scope.toLoanOfficers.forEach(function(officer) {
                                    officer.fullName = officer.ToolTip.substring(0, officer.ToolTip.length - 5);
                                });
                                $scope.fromLoanOfficers = angular.copy($scope.originalData);
                                $scope.fromLoanOfficers.forEach(function(officer) {
                                    officer.fullName = officer.ToolTip.substring(0, officer.ToolTip.length - 5);
                                    $scope.interchagedGroups.Notes = '';
                                });

                            } else {
                                swal("Something went wrong", "", "error");
                            }
                        }, AMMS.handleServiceError);
                    });
            } else {
                swal('please assign some interchange data before submitting!');
                return;
            }

        }

        

        $scope.disableSameId=function(type)
        {   
            if (type === 'from' && $scope.fromOfficer) {
                if ($scope.selectedFromOfficer && $scope.interchange.toOfficerList.findIndex(x => x.Value === $scope.selectedFromOfficer.Value) === -1) {
                    $scope.toLoanOfficers[$scope.fromLoanOfficers.findIndex(x => x.Value === $scope.selectedFromOfficer.Value)].disabled = false;
                }
                $scope.toLoanOfficers[$scope.toLoanOfficers.findIndex(x => x.Value === $scope.fromOfficer.Value)].disabled = true;
                $scope.selectedFromOfficer = $scope.fromOfficer;
            }
            if (type === 'to' && $scope.toOfficer) {
                if ($scope.selectedtoOfficer && $scope.interchange.fromOfficerList.findIndex(x => x.Value === $scope.selectedtoOfficer.Value) === -1) {
                    $scope.fromLoanOfficers[$scope.toLoanOfficers.findIndex(x => x.Value === $scope.selectedtoOfficer.Value)].disabled = false;
                }
                $scope.fromLoanOfficers[$scope.fromLoanOfficers.findIndex(x => x.Value === $scope.toOfficer.Value)].disabled = true;
                $scope.selectedtoOfficer = $scope.toOfficer;
            
            }
            
        }

        
        $scope.getDetails(184);
        var checkycleCompleted = function () {
            $scope.cycleComplete = true;
            $scope.interchange.toOfficerList.forEach(function (toOfficer) {
               var found = $scope.interchange.fromOfficerList.findIndex(x => x.Value === toOfficer.Value);
               if (found === -1) {
                    $scope.cycleComplete = false;
                }
            });
        }


        $scope.insertIntoChangeList = function () {
            var duplicate = false;
            if ($scope.fromOfficer === undefined) {
                swal('please select from loan officer field');
                return;
            }
            if ($scope.toOfficer === undefined) {
                swal('please select to loan officer field');
                return;
            }
            if ($scope.fromOfficer && $scope.toOfficer) {
                if ($scope.fromOfficer.EmployeeId === $scope.toOfficer.EmployeeId) {
                    swal('Please select different officers to interchange group!');
                    return;
                }
                $scope.interchange.fromOfficerList.forEach(function (officer) {
                    if ($scope.fromOfficer === officer)
                       duplicate = true;
                    return;
                });
                $scope.interchange.toOfficerList.forEach(function (officer) {
                    if ($scope.toOfficer === officer)
                      duplicate = true;
                    return;
                });
                if (duplicate) { swal('selected officers are already assigned!');
                    return;
                }
                $scope.fromOfficer.DisplayName = $scope.fromOfficer.Name;
                //+ '(' + $scope.fromOfficer.Value + ')';
                $scope.toOfficer.DisplayName = $scope.toOfficer.Name;
                //+ '(' + $scope.toOfficer.Value + ')';
                $scope.interchange.fromOfficerList.push($scope.fromOfficer);
                $scope.interchange.toOfficerList.push($scope.toOfficer);

                $scope.toLoanOfficers[$scope.toLoanOfficers.indexOf($scope.toOfficer)].disabled = true;
                $scope.fromLoanOfficers[$scope.fromLoanOfficers.indexOf($scope.fromOfficer)].disabled = true;


                if ($scope.interchange.toOfficerList.findIndex(x=>x.Value === $scope.selectedFromOfficer.Value)===-1)
                    $scope.toLoanOfficers[$scope.toLoanOfficers.findIndex(x => x.Value === $scope.selectedFromOfficer.Value)].disabled = false;
                if ($scope.interchange.fromOfficerList.findIndex(x=>x.Value === $scope.selectedtoOfficer.Value) === -1)
                    $scope.fromLoanOfficers[$scope.fromLoanOfficers.findIndex(x => x.Value === $scope.selectedtoOfficer.Value)].disabled = false;
                checkycleCompleted();
            }
        }

        $scope.remove = function(fromId) {
            var position= $scope.interchange.fromOfficerList.findIndex(x => x.Value === fromId);
            $scope.interchange.fromOfficerList.splice(position, 1);
            var toPosition=$scope.interchange.toOfficerList.splice(position, 1);
            $scope.toLoanOfficers[$scope.toLoanOfficers.findIndex(x => x.Value === toPosition[0].Value)].disabled = false;
            $scope.fromLoanOfficers[$scope.toLoanOfficers.findIndex(x => x.Value === fromId)].disabled = false;
            checkycleCompleted();
        }

        

    }]);