ammsAng.controller('employeeEditController', ['$scope', '$rootScope', 'filterService', 'employeeFilterService', 'employeeService', 'documentService',
    function ($scope, $rootScope, filterService, employeeFilterService, employeeService, documentService) {
        $scope.employee = {};
        $scope.filters = {};
        $scope.uploadedFiles = [];
        $scope.AddressEqual = false;
        $scope.employeeId = '';
        $scope.files = [];
        $scope.editEmployee = {};

        $scope.employee.AcademicQualification = [];
        $scope.employee.ProfessionalQualification = [];
        $scope.employee.Training = [];
        $scope.employee.Experience = [];


        $scope.employeeImage = null;
        $scope.employeePhoto = {};

        $scope.$on('tab-switched', function () {
            if ($rootScope.hasOwnProperty("editEmployeeId")) {
                $scope.getEmployeeInfo();
            }
        });



        $scope.$watch('files', function () {
            $scope.docSizeBoolChecker();
        });
        $scope.$watch('uploadedFiles', function () {
            $scope.docSizeBoolChecker();
        });

        $scope.docSizeBoolChecker = function () {
            $scope.fileSize = 0;
            $scope.uploadedFiles.forEach(function (file) {
                $scope.fileSize += file.Size;
                if ($scope.fileSize > (1024 * 1024) * ($rootScope.documentSize)) {
                    $scope.docError = true;
                    return;
                }
            });
            $scope.files.forEach(function (file) {
                $scope.fileSize += file.size;
                if ($scope.fileSize > (1024 * 1024) * ($rootScope.documentSize)) {
                    $scope.docError = true;
                    return;

                } else {
                    $scope.docError = false;
                }

            });
        }
        $scope.nidNullifier = function () {
            if ($scope.editEmployee.Nationality !== 1) {
                $scope.editEmployee.NationalId = null;
            }
        }
       
        $scope.getEmployeeInfo = function () {
            $("#loadingImage").css("display", "block");
            var employeeId = $rootScope.editEmployeeId;
            employeeService.getEmployee(employeeId).then(function (response) {
                console.log(response.data);
                $scope.editEmployee = response.data;

                $scope.employeeOldData = angular.copy(response.data);
                $scope.getDesignationsByGradeId($scope.editEmployee.JoiningGrade);
                $scope.getDesignationsByGradeIdCurrent($scope.editEmployee.CurrentGrade);
                $scope.getAsaDistricts($scope.editEmployee.JoiningFaOffice);
                $scope.getAsaDistrictsCurrent($scope.editEmployee.CurrentFaOffice);
                $scope.getfilteredSubStatus();
                $scope.MobilePhoneNo = parseInt($scope.editEmployee.MobilePhoneNo);
                $scope.editEmployee.PermanentThanaId = $scope.editEmployee.PermanentThanaId.toString();
                $scope.editEmployee.PresentThanaId = $scope.editEmployee.PresentThanaId.toString();
                $scope.editEmployee.GradeId = $scope.editEmployee.GradeId.toString();
                // $scope.editEmployee.DesignationId = $scope.editEmployee.DesignationId.toString();
                $scope.editEmployee.JoiningDesignation = $scope.editEmployee.JoiningDesignation.toString();
                $scope.editEmployee.CurrentDesignation = $scope.editEmployee.CurrentDesignation.toString();
                $scope.editEmployee.CurrentDistrict = $scope.editEmployee.CurrentDistrict.toString();
                $scope.editEmployee.CurrentRegion = $scope.editEmployee.CurrentRegion.toString();
                $scope.editEmployee.CurrentBranchId = $scope.editEmployee.CurrentBranchId.toString();
                $scope.editEmployee.NationalId =$scope.editEmployee.NationalId!==null? Number($scope.editEmployee.NationalId):null;
               // $scope.editEmployee.DepartmentId = $scope.editEmployee.DepartmentId;
                $scope.editEmployee.RegionId = $scope.editEmployee.RegionId.toString();
                $scope.editEmployee.JoiningBranchId = $scope.editEmployee.JoiningBranchId.toString();
                $scope.editEmployee.DistrictId = $scope.editEmployee.DistrictId.toString();
                $scope.editEmployee.ZoneId = $scope.editEmployee.ZoneId.toString();
               // $scope.editEmployee.EmploymentType = $scope.editEmployee.EmploymentType.toString();
               // $scope.editEmployee.Status = $scope.editEmployee.Status.toString();
               // $scope.editEmployee.TaxCircleZoneId = $scope.editEmployee.TaxCircleZoneId;
                $scope.getThanas($scope.editEmployee.PermanentGovtDistrict, 'permanent');
                $scope.getThanas($scope.editEmployee.PresentGovtDistrict, 'present');

                $scope.editEmployee.DateOfBirth = new Date($scope.editEmployee.DateOfBirth);
                $scope.editEmployee.AppLetterDate = new Date($scope.editEmployee.AppLetterDate);
                $scope.editEmployee.JoiningLetterDate =$scope.editEmployee.JoiningLetterDate!==null? new Date($scope.editEmployee.JoiningLetterDate):null;
                $scope.editEmployee.JoiningDate = new Date($scope.editEmployee.JoiningDate);
                $scope.editEmployee.CurrentBranchJoiningDate = new Date($scope.editEmployee.CurrentBranchJoiningDate);
                $scope.editEmployee.PermanentLetterDate =$scope.editEmployee.PermanentLetterDate!==null? new Date($scope.editEmployee.PermanentLetterDate):null;
                $scope.editEmployee.PermanentDate =$scope.editEmployee.PermanentDate!==null? new Date($scope.editEmployee.PermanentDate):null;
                $scope.editEmployee.ReleaseDate = $scope.editEmployee.ReleaseDate !== null ? new Date($scope.editEmployee.ReleaseDate) : null;

                if ($scope.editEmployee.ProfessionalQualification.length > 0) {
                    $scope.editEmployee.ProfessionalQualification.forEach(function (pq) {
                        pq.StartDate = new Date(pq.StartDate);
                        pq.EndDate = new Date(pq.EndDate);
                    });
                }
                if ($scope.editEmployee.Experience.length > 0) {
                    $scope.editEmployee.Experience.forEach(function (ex) {
                        ex.StartDate = new Date(ex.StartDate);
                        ex.EndDate = new Date(ex.EndDate);
                    });
                }


                $scope.empOriginalInfo = $scope.editEmployee;

                $scope.editEmployee.AcademicQualification.forEach(function(aq) {
                    if (aq.Class === null) {
                        aq.Restype = 1;
                    } else {
                        aq.Restype = 2;
                    }
                });

                $scope.initUniversityOrOthersList();
                $scope.reassignAQValuesfornonselectionbug();

                $scope.employeeId = employeeId;
                delete $rootScope.editEmployeeId;

                if (
                    $scope.editEmployee.PresentVillage === $scope.editEmployee.PermanentVillage &&
                    $scope.editEmployee.PresentPostOffice === $scope.editEmployee.PermanentPostOffice &&
                    $scope.editEmployee.PresentPostCode === $scope.editEmployee.PermanentPostCode &&
                    $scope.editEmployee.PresentGovtDistrict === $scope.editEmployee.PermanentGovtDistrict &&
                    $scope.editEmployee.PresentThanaId === $scope.editEmployee.PermanentThanaId
                )
                    $scope.AddressEqual = true;

                $scope.checkSameAddress();
                documentService.getFilesbyEntity(employeeId, $rootScope.FileUploadEntities.Employee).then(function (response) {
                    $scope.uploadedFiles = response.data;
                    $rootScope.employeeFileHash = response.data && response.data.length > 0 ? response.data[0].Hash : '';
                    $scope.segregateFile();
                });
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }


        $scope.setOfficeDisabler = function () {
            if ($rootScope.user.Role === $rootScope.UserRole.ZM) {
                $scope.zonedisabled = true;
                $scope.districtdisabled = false;
                $scope.regiondisabled = false;
                $scope.branchdisabled = false;
            } else if ($rootScope.user.Role === $rootScope.UserRole.DM) {
                $scope.zonedisabled = true;
                $scope.districtdisabled = true;
                $scope.regiondisabled = false;
                $scope.branchdisabled = false;
            } else if ($rootScope.user.Role === $rootScope.UserRole.RM) {
                $scope.zonedisabled = true;
                $scope.districtdisabled = true;
                $scope.regiondisabled = true;
                $scope.branchdisabled = false;
            } else if ($rootScope.user.Role === $rootScope.UserRole.BM) {
                $scope.zonedisabled = true;
                $scope.districtdisabled = true;
                $scope.regiondisabled = true;
                $scope.branchdisabled = true;
            } else {
                $scope.zonedisabled = false;
                $scope.districtdisabled = false;
                $scope.regiondisabled = false;
                $scope.branchdisabled = false;
            }
        }
        $scope.setOfficeDisabler();

        $scope.restoreAllDatesOnPostFailure = function () {
            $scope.editEmployee.DateOfBirth = new Date($scope.editEmployee.DateOfBirth);
            $scope.editEmployee.AppLetterDate = new Date($scope.editEmployee.AppLetterDate);
            $scope.editEmployee.JoiningLetterDate = ($scope.editEmployee.JoiningLetterDate !== undefined && $scope.editEmployee.JoiningLetterDate !== null) ? new Date($scope.editEmployee.JoiningLetterDate) : undefined;
            $scope.editEmployee.JoiningDate = new Date($scope.editEmployee.JoiningDate);
            $scope.editEmployee.CurrentBranchJoiningDate = new Date($scope.editEmployee.CurrentBranchJoiningDate);
            $scope.editEmployee.PermanentLetterDate = ($scope.editEmployee.PermanentLetterDate !== undefined && $scope.editEmployee.PermanentLetterDate !== null) ? new Date($scope.editEmployee.PermanentLetterDate) : undefined;
            $scope.editEmployee.PermanentDate = ($scope.editEmployee.PermanentDate !== undefined && $scope.editEmployee.PermanentDate !== null) ? new Date($scope.editEmployee.PermanentDate) : undefined;


            $scope.editEmployee.ProfessionalQualification.forEach(function (pq) {
                pq.StartDate = new Date(pq.StartDate);
                pq.EndDate = new Date(pq.EndDate);
            });
            $scope.editEmployee.Experience.forEach(function (ex) {
                ex.StartDate = new Date(ex.StartDate);
                ex.EndDate = new Date(ex.EndDate);
            });
        }

        $scope.updateEmployee = function () {
            //console.log($scope.editEmployee);

            if ($scope.docError) {
                swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');
                // $scope.docError = false;
                return;
            }
            if ($scope.editEmployee.AppLetterDate === undefined || $scope.employee.AppLetterDate === null) {
                swal('Appointment letter date can not be left empty!');
                return;
            }
            if ($scope.requiredNullDateChecker()) return;
            if ($scope.editEmployee.PermanentThanaId === undefined || $scope.editEmployee.PermanentThanaId === null) {
                swal('please select thana for permanent address!');
                return;
            }
            if ($scope.editEmployee.PresentThanaId === undefined || $scope.editEmployee.PresentThanaId === null) {
                swal('please select thana for present address!');
                return;
            }
            if ($scope.editEmployee.AcademicQualification.length < 1) {
                swal('At least one Academic-Qualification is required!');
                return;
            }
            if ($scope.aqvalidator()) {
                swal('please define all the required information in selected academic qualification rows!');
                return;
            }

            //pq date validation
            if ($scope.editEmployee.ProfessionalQualification.length > 0) {
                $scope.pqInvalid = false;
                $scope.pqdobInvalid = false;
                $scope.editEmployee.ProfessionalQualification.forEach(function (pq) {
                    if (pq.StartDate === undefined || pq.StartDate === null || pq.EndDate === undefined || pq.EndDate === null) {
                        $scope.pqInvalid = true;
                        return;
                    }
                    if (moment(pq.StartDate).valueOf() > moment(pq.EndDate).valueOf()) {
                        $scope.pqInvalid = true;
                        return;
                    }
                    if (moment(pq.StartDate).valueOf() < moment($scope.editEmployee.DateOfBirth).valueOf()) {
                        $scope.pqdobInvalid = true;
                        return;
                    }

                });
                if ($scope.pqInvalid) {
                    swal('Professional qualification end date can not be greater than start date!');
                    return;
                }
                if ($scope.pqdobInvalid) {
                    swal('Professional qualification start date can not be greater than employee birth date!');
                    return;
                }
            }
            //exp date validation
            if ($scope.editEmployee.Experience.length > 0) {
                $scope.expInvalid = false;
                $scope.expdobInvalid = false;
                $scope.editEmployee.Experience.forEach(function (ex) {
                    if (ex.StartDate === undefined || ex.StartDate === null || ex.EndDate === undefined || ex.EndDate === null) {
                        $scope.expInvalid = true;
                        return;
                    }
                    if (moment(ex.StartDate).valueOf() > moment(ex.EndDate).valueOf()) {
                        $scope.expInvalid = true;
                        return;
                    }
                    if (moment(ex.StartDate).valueOf() < moment($scope.editEmployee.DateOfBirth).valueOf()) {
                        $scope.expdobInvalid = true;
                        return;
                    }

                });
                if ($scope.expInvalid) {
                    swal('Experience From date can not be less than To date!');
                    return;
                }
                if ($scope.expdobInvalid) {
                    swal('Experience start date can not be less than employee birth date!');
                    return;
                }
            }

            if (moment($scope.editEmployee.AppLetterDate).valueOf() < moment($scope.editEmployee.DateOfBirth).valueOf()) {
                swal('appointment letter date can not be less than employee birth date!');
                return;
            }
            if (($scope.editEmployee.JoiningLetterDate !== undefined && $scope.editEmployee.JoiningLetterDate !== null) && (moment($scope.editEmployee.JoiningLetterDate).valueOf() < moment($scope.editEmployee.AppLetterDate).valueOf())) {
                swal('ASA joining  letter date can not be less than employee appointment letter date!');
                return;
            }
            if (($scope.editEmployee.JoiningLetterDate === undefined || $scope.editEmployee.JoiningLetterDate === null) && (moment($scope.editEmployee.JoiningDate).valueOf() < moment($scope.editEmployee.AppLetterDate).valueOf())) {
                swal('ASA joining  date can not be less than employee appointment letter date!');
                return;
            }

            if (($scope.editEmployee.JoiningLetterDate !== undefined && $scope.editEmployee.JoiningLetterDate !== null) && (moment($scope.editEmployee.JoiningDate).valueOf() < moment($scope.editEmployee.JoiningLetterDate).valueOf())) {
                swal('ASA joining date can not be less than employee joining letter date!');
                return;
            }
            if (moment($scope.editEmployee.CurrentBranchJoiningDate).valueOf() < moment($scope.editEmployee.JoiningDate).valueOf()) {
                swal('Current joining date can not be less than ASA joining date!');
                return;
            }
            if (($scope.editEmployee.ReleaseDate !== null && $scope.editEmployee.ReleaseDate !== undefined) && (moment($scope.editEmployee.ReleaseDate).valueOf() < moment($scope.editEmployee.CurrentBranchJoiningDate).valueOf())) {
                swal('Employee release date can not be less than employee Current joining date!');
                return;
            }
            if ($scope.editEmployee.PermanentLetterDate !== null && $scope.editEmployee.PermanentLetterDate !== undefined) {
                if ($scope.editEmployee.JoiningEmploymentType === 2) {
                    if (moment($scope.editEmployee.PermanentLetterDate).valueOf() < moment($scope.editEmployee.JoiningDate).valueOf()) {
                        swal('permanent letter date can not be less than ASA joining date!');
                        return;
                    }
                }
                if ($scope.editEmployee.CurrentEmploymentType === 2) {
                    if (moment($scope.editEmployee.PermanentLetterDate).valueOf() > moment($scope.editEmployee.CurrentBranchJoiningDate).valueOf()) {
                        swal('permanent letter date can not greater than Current joining date!');
                        return;
                    }

                }
                if ($scope.editEmployee.JoiningEmploymentType !== 2 && $scope.editEmployee.CurrentEmploymentType !== 2) {
                    swal("please select permanent employement type before setting permanent letter date!");
                    $scope.editEmployee.PermanentLetterDate = null;
                    return;
                }
            }
            if ($scope.editEmployee.PermanentDate !== null && $scope.editEmployee.PermanentDate !== undefined) {
                if ($scope.editEmployee.JoiningEmploymentType === 2) {
                    if (moment($scope.editEmployee.PermanentDate).valueOf() < moment($scope.editEmployee.JoiningDate).valueOf()) {
                        swal('permanent  date can not be less than ASA joining date!');
                        return;
                    }
                }
                if ($scope.editEmployee.CurrentEmploymentType === 2) {
                    if (moment($scope.editEmployee.PermanentDate).valueOf() > moment($scope.editEmployee.CurrentBranchJoiningDate).valueOf()) {
                        swal('permanent  date can not greater than permanent Current joining date!');
                        return;
                    }

                }
                if ($scope.editEmployee.JoiningEmploymentType !== 2 && $scope.editEmployee.CurrentEmploymentType !== 2) {
                    swal("please select permanent employement type before setting permanent  date!");
                    $scope.editEmployee.PermanentDate = null;
                    return;
                }
            }
            if ($scope.editEmployee.PermanentLetterDate !== null && $scope.editEmployee.PermanentLetterDate !== undefined && $scope.editEmployee.PermanentDate !== null && $scope.editEmployee.PermanentDate !== undefined
                && moment($scope.editEmployee.PermanentLetterDate).valueOf() > moment($scope.editEmployee.PermanentDate).valueOf()) {
                swal('permanent letter date can not be greater than permanent date!');
                return;
            }

            if ($rootScope.command == 'Close') {
                swal({
                        title: "Confirm?",
                        text: $rootScope.showMessage($rootScope.closeConfirmation, $rootScope.employee),
                        type: "info",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true
                    },
                    function() {

                        $scope.formatAllDates();
                        $scope.files.forEach(function(file) {
                            file.Category = $rootScope.FileCategory.GENERAL;
                        });
                        // if ($scope.employeePhoto!== null ||$scope.employeePhoto!==undefined) {
                        if ($scope.employeePhoto.size !== undefined) {
                            $scope.files.push($scope.employeePhoto);

                        }
                        $scope.editEmployee.MobilePhoneNo = $scope.MobilePhoneNo.toString();
                        //$scope.editEmployee.DateOfBirth = $rootScope.toServerSideDate(new Date($scope.editEmployee.DateOfBirth));
                        //$scope.editEmployee.AppLetterDate = $rootScope.toServerSideDate(new Date($scope.editEmployee.AppLetterDate));
                        //$scope.editEmployee.JoinLetterDate = $rootScope.toServerSideDate(new Date($scope.editEmployee.JoinLetterDate));
                        //$scope.editEmployee.PermanentLetterDate = $rootScope.toServerSideDate(new Date($scope.editEmployee.PermanentLetterDate));
                        //$scope.editEmployee.PermanentDate = $rootScope.toServerSideDate(new Date($scope.editEmployee.PermanentDate));

                        employeeService.updateEmployee($scope.editEmployee).then(function(response) {
                            if (response.data.Success) {
                                if (response.data.Entity.Id && $scope.files.length > 0) {
                                    documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.Employee, $rootScope.user.UserId, $scope.employeePhoto.name)
                                        .then(function(res) {
                                            if (res.data.Success) {
                                                $rootScope.$broadcast('employee-edit-finished');
                                                if ($scope.proPictureFile !== undefined && $scope.employeePhoto.size != undefined) documentService.deleteDocument($scope.proPictureFile.Id);
                                                $scope.removeLocalFile($rootScope.employeeFileHash);
                                                swal($rootScope.showMessage($rootScope.closeSuccess, $rootScope.employee), "Successful!", "success");
                                                $scope.clearAndCloseTab();
                                            } else {
                                                swal($rootScope.docAddError, res.data.Message, "error");
                                                $scope.restoreAllDatesOnPostFailure();
                                            }

                                        });


                                } else {
                                    $rootScope.$broadcast('employee-edit-finished');
                                    $rootScope.$broadcast('emplyee-user-edit-finished');
                                    $scope.removeLocalFile($rootScope.employeeFileHash);
                                    swal($rootScope.showMessage($rootScope.closeSuccess, $rootScope.employee), "Successful!", "success");
                                    $scope.clearAndCloseTab();
                                }

                            } else {
                                swal($rootScope.showMessage($rootScope.closeError, $rootScope.employee), response.data.Message, "error");
                                $scope.restoreAllDatesOnPostFailure();
                            }
                        }, AMMS.handleServiceError);
                    });
            } else {
                swal({
                    title: "Confirm?",
                    text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.employee),
                    type: "info",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                },
                    function () {

                        $scope.formatAllDates();
                        $scope.files.forEach(function (file) {
                            file.Category = $rootScope.FileCategory.GENERAL;
                        });
                        // if ($scope.employeePhoto!== null ||$scope.employeePhoto!==undefined) {
                        if ($scope.employeePhoto.size !== undefined) {
                            $scope.files.push($scope.employeePhoto);

                        }
                        $scope.editEmployee.MobilePhoneNo = $scope.MobilePhoneNo.toString();
                        //$scope.editEmployee.DateOfBirth = $rootScope.toServerSideDate(new Date($scope.editEmployee.DateOfBirth));
                        //$scope.editEmployee.AppLetterDate = $rootScope.toServerSideDate(new Date($scope.editEmployee.AppLetterDate));
                        //$scope.editEmployee.JoinLetterDate = $rootScope.toServerSideDate(new Date($scope.editEmployee.JoinLetterDate));
                        //$scope.editEmployee.PermanentLetterDate = $rootScope.toServerSideDate(new Date($scope.editEmployee.PermanentLetterDate));
                        //$scope.editEmployee.PermanentDate = $rootScope.toServerSideDate(new Date($scope.editEmployee.PermanentDate));

                        employeeService.updateEmployee($scope.editEmployee).then(function (response) {
                            if (response.data.Success) {
                                if (response.data.Entity.Id && $scope.files.length > 0) {
                                    documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.Employee, $rootScope.user.UserId, $scope.employeePhoto.name)
                                        .then(function (res) {
                                            if (res.data.Success) {
                                                $rootScope.$broadcast('employee-edit-finished');
                                                if ($scope.proPictureFile !== undefined && $scope.employeePhoto.size != undefined) documentService.deleteDocument($scope.proPictureFile.Id);
                                                $scope.removeLocalFile($rootScope.employeeFileHash);
                                                swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.employee), "Successful!", "success");
                                                $scope.clearAndCloseTab();
                                            } else {
                                                swal($rootScope.docAddError, res.data.Message, "error");
                                                $scope.restoreAllDatesOnPostFailure();
                                            }

                                        });


                                } else {
                                    $rootScope.$broadcast('employee-edit-finished');
                                    $rootScope.$broadcast('emplyee-user-edit-finished');
                                    $scope.removeLocalFile($rootScope.employeeFileHash);
                                    swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.employee), "Successful!", "success");
                                    $scope.clearAndCloseTab();
                                }

                            } else {
                                swal($rootScope.showMessage($rootScope.editError, $rootScope.employee), response.data.Message, "error");
                                $scope.restoreAllDatesOnPostFailure();
                            }
                        }, AMMS.handleServiceError);
                    });
            }
            
        };

        $scope.NIDValidator = function (nid) {
            if (!nid) return "NID field is required";
            if (!(nid.toString().length === 13 || nid.toString().length === 17 || nid.toString().length === 10)) {
                return "NID must be 10,13 or 17 characters long";
            }
            return true;
        }

        $scope.MobileValidator = function (mobile) {
            if (!mobile) return "Mobile Phone No field required";
            if (!(mobile.toString().length === 10)) {
                return "Mobile Phone No must be 10 characters long";
            }
            return true;
        }

        $scope.PhoneNoValidator = function (phone) {
            if (!phone) return true;
            var pattern = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
            if (pattern.test(phone)) {
                return true;
            } else {
                return "invalid Phone Number";
            }
        }
        //$scope.validateEmail = function (email) {
        //    if (!email) return "Email field is required";
        //    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //    if (!re.test(email))
        //        return "Invalid Email";
        //    return true;
        //}

        $scope.validateEmail = function (email) {
            //if (!email) return "Email field is required";
            if (!email) return true;
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(email) || email.split('@')[1] !== 'asabd.org')
                return "Invalid Email";
            return true;
        }
        $scope.addEmployeeFilterData = function () {
            $scope.filtersservice = employeeFilterService.getEmployeeAddfilters().then(function (response) {
                $scope.filters = response.data;
                $scope.filters.Districts = $scope.filters.Districts.filter(d => d.Value !== 65);//splice secp
                $scope.filters.Status = $scope.filters.Status.filter(x => x.Value != 2);
                console.log(response.data);
                $scope.getYearFilterData();

                var i = 0;
                $scope.filters.ExamType.forEach(function (et) {
                    et.SortOrder = i;
                    i++;
                });

                $scope.filters.Restype = [];
                $scope.filters.Restype.push({
                    Name: 'Grade',
                    Value: 1
                });
                $scope.filters.Restype.push({
                    Name: 'Class',
                    Value: 2
                });
                $scope.filters.Class = [];
                $scope.filters.Class.push({
                    Name: '1st',
                    Value:1
                });
                $scope.filters.Class.push({
                    Name: '2nd',
                    Value: 2
                });
                $scope.filters.Class.push({
                    Name: '3rd',
                    Value: 3
                });

                


                $scope.getEmployeeInfo();

                // $scope.assignDefaultValue();
                // $scope.getRelatedDataForDefaultValue();
            }, AMMS.handleServiceError);

          
        }

      


        $scope.getOrganizonalFilterData = function (type, listToSet) {
            $("#loadingImage").css("display", "block");
            filterService.getOrganizationalFilterDataByType(type)
                .then(function (response) {
                    $scope[listToSet] = response.data;
                    $("#loadingImage").css("display", "none");
                }, AMMS.handleServiceError);
        }


        
        $scope.addEmployeeFilterData();


        $scope.setExamNames = function (index) {
            //$scope.employee.AcademicQualification[index].ExamTitle = $scope.employee.AcademicQualification[index].ExamType;
            $scope.editEmployee.AcademicQualification[index].exams = $scope.filters.ExamName.filter(x=>x.DependencyValue === $scope.editEmployee.AcademicQualification[index].ExamType);
        }
        $scope.setInstitutionList = function (index) {
            if ($scope.editEmployee.AcademicQualification[index].ExamType > 3) {
                $scope.editEmployee.AcademicQualification[index].Institution = null;
                $scope.editEmployee.AcademicQualification[index].UniversityNameOrOthers = [];
                $scope.editEmployee.AcademicQualification[index].UniversityNameOrOthers = $scope.filters.UniversityName;
            } else {
                $scope.editEmployee.AcademicQualification[index].UniversityNameOrOthers = [];
                $scope.editEmployee.AcademicQualification[index].Institution = null;
                $scope.editEmployee.AcademicQualification[index].UniversityNameOrOthers.push({
                    Name: 'Others',
                    Value: 99
                });
            }
        }
        $scope.initUniversityOrOthersList = function () {
            if ($scope.editEmployee.AcademicQualification === undefined || $scope.editEmployee.AcademicQualification === null)return;
            $scope.editEmployee.AcademicQualification.forEach(function(aq) {
                if (aq.ExamType>3) {
                    aq.UniversityNameOrOthers = [];
                    aq.UniversityNameOrOthers = $scope.filters.UniversityName;

                } else {
                    aq.UniversityNameOrOthers = [];
                    aq.UniversityNameOrOthers.push({
                        Name: 'Others',
                        Value: 99
                    });
                }

                aq.exams = $scope.filters.ExamName.filter(x=>x.DependencyValue ===aq.ExamType);
            });
        }
        $scope.reassignAQValuesfornonselectionbug=function() {
            if ($scope.editEmployee.AcademicQualification === undefined || $scope.editEmployee.AcademicQualification === null) return;
            $scope.editEmployee.AcademicQualification.forEach(function(aq) {
                aq.Institution = parseInt(aq.Institution);
                aq.Class = aq.Class !== null && aq.Class !== undefined ? aq.Class.toString() : null;
            });
        }
       

        $scope.formatDate = function (dateString) {
            var formattedDate = dateString.substring(5, 7) + "/" + dateString.substring(8, 10) + "/" + dateString.substring(0, 4);
            return formattedDate;
        }


        $scope.getThanas = function (districtId, type) {
            $("#loadingImage").css("display", "block");
            if (type === 'permanent') {
                $scope.thanasOfPermanentAdministrativeDistrict = {};
            }
            else {
                $scope.thanasOfPresentAdministrativeDistrict = {};
            }
            $scope.pthanas = employeeFilterService.getThanasOfDistrict(districtId).then(function (response) {
                if (type === 'permanent') {
                    $scope.thanasOfPermanentAdministrativeDistrict = response.data;
                }
                else {
                    $scope.thanasOfPresentAdministrativeDistrict = response.data;
                }
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }

        $scope.getDesignationsByGradeId = function (gradeId) {
            $("#loadingImage").css("display", "block");
            $scope.designationOfGrade = {};
            employeeFilterService.getDesignationsByGradeId(gradeId).then(function (response) {
                $scope.designationOfGrade = response.data;

                if ($scope.empOriginalInfo.JoiningGrade !== gradeId && $scope.designationOfGrade.length > 0) {
                    $scope.editEmployee.JoiningDesignation = $scope.designationOfGrade[0].Value;
                }
                else {
                    $scope.editEmployee.JoiningDesignation = $scope.empOriginalInfo.JoiningDesignation;
                }
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }
        $scope.getDesignationsByGradeIdCurrent = function (gradeId) {
            $("#loadingImage").css("display", "block");
            $scope.designationOfGradeCurrent = {};
            employeeFilterService.getDesignationsByGradeId(gradeId).then(function (response) {
                $scope.designationOfGradeCurrent = response.data;

                if ($scope.empOriginalInfo.CurrentGrade !== gradeId && $scope.designationOfGradeCurrent.length > 0) {
                    $scope.editEmployee.CurrentDesignation = $scope.designationOfGradeCurrent[0].Value;
                }
                else {
                    $scope.editEmployee.CurrentDesignation = $scope.empOriginalInfo.CurrentDesignation;
                }
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }

        $scope.getAsaDistricts = function (zoneId) {
            $("#loadingImage").css("display", "block");
            console.log(zoneId);
            $scope.asaDistrictsOfZone = {};
            employeeFilterService.getAsaDistrictsOfZone(zoneId).then(function (response) {
                $scope.asaDistrictsOfZone = response.data;
                if ($scope.empOriginalInfo.JoiningFaOffice !== zoneId) {
                    $scope.editEmployee.DistrictId = $scope.asaDistrictsOfZone.length > 0 ? $scope.asaDistrictsOfZone[0].Value : null;
                }
                else {
                    $scope.editEmployee.DistrictId = $scope.empOriginalInfo.DistrictId;
                }
                $scope.getRegionsOfDistrict($scope.editEmployee.DistrictId);
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }
        $scope.getAsaDistrictsCurrent = function (zoneId) {
            $("#loadingImage").css("display", "block");
            console.log(zoneId);
            $scope.asaDistrictsOfZoneCurrent = {};
            employeeFilterService.getAsaDistrictsOfZone(zoneId).then(function (response) {
                $scope.asaDistrictsOfZoneCurrent = response.data;
                if ($scope.empOriginalInfo.CurrentFaOffice !== zoneId) {
                    $scope.editEmployee.CurrentDistrict = $scope.asaDistrictsOfZone.length > 0 ? $scope.asaDistrictsOfZone[0].Value : null;
                }
                else {
                    $scope.editEmployee.CurrentDistrict = $scope.empOriginalInfo.CurrentDistrict;
                }
                $scope.getRegionsOfDistrictCurrent($scope.editEmployee.CurrentDistrict);
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }

        $scope.getRegionsOfDistrict = function (districtId) {
            $("#loadingImage").css("display", "block");
            $scope.regionsOfDistrict = {};
            if (!districtId) return;
            employeeFilterService.getRegionsOfAsaDistrict(districtId).then(function (response) {
                $scope.regionsOfDistrict = response.data;
                if ($scope.empOriginalInfo.DistrictId !== districtId.toString()) {
                    $scope.editEmployee.RegionId = $scope.regionsOfDistrict.length > 0 ? $scope.regionsOfDistrict[0].Value : null;
                }
                else {
                    $scope.editEmployee.RegionId = $scope.empOriginalInfo.RegionId;
                }
                $scope.getBranchesOfRegion($scope.editEmployee.RegionId);
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }
        $scope.getRegionsOfDistrictCurrent = function (districtId) {
            $("#loadingImage").css("display", "block");
            $scope.regionsOfDistrictCurrent = {};
            if (!districtId) return;
            employeeFilterService.getRegionsOfAsaDistrict(districtId).then(function (response) {
                $scope.regionsOfDistrictCurrent = response.data;
                if ($scope.empOriginalInfo.CurrentDistrict !== districtId.toString()) {
                    $scope.editEmployee.CurrentRegion = $scope.regionsOfDistrictCurrent.length > 0 ? $scope.regionsOfDistrictCurrent[0].Value : null;
                }
                else {
                    $scope.editEmployee.CurrentRegion = $scope.empOriginalInfo.CurrentRegion;
                }
                $scope.getBranchesOfRegionCurrent($scope.editEmployee.CurrentRegion);
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }

        $scope.getBranchesOfRegion = function (regionId) {
            $("#loadingImage").css("display", "block");
            $scope.branchesOfRegion = {};
            if (!regionId) return;
            employeeFilterService.getBranchesOfRegion(regionId).then(function (response) {
                $scope.branchesOfRegion = response.data;
                if ($scope.empOriginalInfo.RegionId !== regionId.toString()) {
                    $scope.editEmployee.BranchId = $scope.branchesOfRegion.length > 0 ? $scope.branchesOfRegion[0].Value : null;
                }
                else {
                    $scope.editEmployee.BranchId = $scope.empOriginalInfo.BranchId;
                }
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }
        $scope.getBranchesOfRegionCurrent = function (regionId) {
            $("#loadingImage").css("display", "block");
            $scope.branchesOfRegionCurrent = {};
            if (!regionId) return;
            employeeFilterService.getBranchesOfRegion(regionId).then(function (response) {
                $scope.branchesOfRegionCurrent = response.data;
                if ($scope.empOriginalInfo.CurrentRegion !== regionId.toString()) {
                    $scope.editEmployee.CurrentBranchId = $scope.branchesOfRegionCurrent.length > 0 ? $scope.branchesOfRegionCurrent[0].Value : null;
                }
                else {
                    $scope.editEmployee.CurrentBranchId = $scope.empOriginalInfo.CurrentBranchId;
                }
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }

        //$scope.sameAddressToggle = function () {
        //    if ($scope.sameAddressEdit === 'YES') {
        //        //$scope.makePresentAddressNull();
        //        $scope.editEmployee.PresentVillage = $scope.editEmployee.PermanentVillage;
        //        $scope.editEmployee.PresentPostOffice = $scope.editEmployee.PermanentPostOffice;
        //        $scope.editEmployee.PresentPostCode = $scope.editEmployee.PermanentPostCode;
        //        $scope.editEmployee.PresentGovtDistrict = $scope.editEmployee.PermanentGovtDistrict;
        //        $scope.editEmployee.PresentThanaId = $scope.editEmployee.PermanentThanaId;
        //        $scope.thanasOfPresentAdministrativeDistrict = $scope.thanasOfPermanentAdministrativeDistrict;
        //        $scope.editEmployee.PresentVillageInBangla = $scope.editEmployee.PermanentVillageInBangla;
        //        $scope.editEmployee.PresentPostOfficeInBangla = $scope.editEmployee.PermanentPostOfficeInBangla;
        //        $scope.editEmployee.PresentThanaId = $scope.editEmployee.PermanentThanaId;
        //        $scope.editEmployee.ResidencePhoneNo = $scope.editEmployee.WorkPhoneNo;
        //    } else {
        //        $scope.makePresentAddressNull();
        //    }

        //}
        $scope.sameAddressToggledWatch = function () {
            if ($scope.sameAddress === 'YES') {
                $scope.makePresentAddressNull();
                $scope.editEmployee.PresentVillage = $scope.editEmployee.PermanentVillage;
                $scope.editEmployee.PresentPostOffice = $scope.editEmployee.PermanentPostOffice;
                $scope.editEmployee.PresentPostCode = $scope.editEmployee.PermanentPostCode;
                $scope.editEmployee.PresentGovtDistrict = $scope.editEmployee.PermanentGovtDistrict;
                employeeFilterService.getThanasOfDistrict($scope.editEmployee.PresentGovtDistrict).then(function (response) {
                    $scope.thanasOfPresentAdministrativeDistrict = response.data;
                    $scope.editEmployee.PresentThanaId = $scope.editEmployee.PermanentThanaId;
                });
                // $scope.getThanas($scope.employee.PresentGovtDistrict, 'present');
                $scope.editEmployee.PresentVillageInBangla = $scope.editEmployee.PermanentVillageInBangla;
                $scope.editEmployee.PresentPostOfficeInBangla = $scope.editEmployee.PermanentPostOfficeInBangla;
                $scope.editEmployee.PresentThanaId = $scope.editEmployee.PermanentThanaId;
            }
        }

        $scope.sameAddressToggle = function () {
            if ($scope.sameAddress === 'YES') {
                $scope.sameadd = true;
                $scope.makePresentAddressNull();
                $scope.editEmployee.PresentVillage = $scope.editEmployee.PermanentVillage;
                $scope.editEmployee.PresentPostOffice = $scope.editEmployee.PermanentPostOffice;
                $scope.editEmployee.PresentPostCode = $scope.editEmployee.PermanentPostCode;
                $scope.editEmployee.PresentGovtDistrict = $scope.editEmployee.PermanentGovtDistrict;
                employeeFilterService.getThanasOfDistrict($scope.editEmployee.PresentGovtDistrict).then(function (response) {
                    $scope.thanasOfPresentAdministrativeDistrict = response.data;
                    $scope.editEmployee.PresentThanaId = $scope.editEmployee.PermanentThanaId;
                });
                // $scope.getThanas($scope.employee.PresentGovtDistrict, 'present');
                $scope.editEmployee.PresentVillageInBangla = $scope.editEmployee.PermanentVillageInBangla;
                $scope.editEmployee.PresentPostOfficeInBangla = $scope.editEmployee.PermanentPostOfficeInBangla;
                //$scope.editEmployee.PresentThanaId = $scope.editEmployee.PermanentThanaId;
                $scope.editEmployee.ResidencePhoneNo = $scope.editEmployee.WorkPhoneNo;
            } else {
                $scope.sameadd = false;
                $scope.makePresentAddressNull();
            }
        }
        $scope.makePresentAddressNull = function () {
            $scope.editEmployee.PresentVillage = $scope.employeeOldData.PresentVillage;
            $scope.editEmployee.PresentPostOffice = $scope.employeeOldData.PresentPostOffice;
            $scope.editEmployee.PresentPostCode = $scope.employeeOldData.PresentPostCode;
            $scope.editEmployee.PresentGovtDistrict = $scope.employeeOldData.PresentGovtDistrict;
            $scope.editEmployee.PresentVillageInBangla = $scope.employeeOldData.PresentVillageInBangla;
            $scope.editEmployee.PresentPostOfficeInBangla = $scope.employeeOldData.PresentPostOfficeInBangla;
            $scope.editEmployee.PresentThanaId = $scope.employeeOldData.PresentThanaId.toString();
            $scope.editEmployee.ResidencePhoneNo = $scope.employeeOldData.ResidencePhoneNo;
            $scope.getThanas($scope.editEmployee.PresentGovtDistrict, 'present');
        }

        $scope.checkSameAddress=function() {
            if (
            $scope.editEmployee.PresentVillage === $scope.editEmployee.PermanentVillage &&
            $scope.editEmployee.PresentPostOffice === $scope.editEmployee.PermanentPostOffice &&
            $scope.editEmployee.PresentPostCode === $scope.editEmployee.PermanentPostCode &&
            $scope.editEmployee.PresentGovtDistrict === $scope.editEmployee.PermanentGovtDistrict &&
            $scope.editEmployee.PresentThanaId === $scope.editEmployee.PermanentThanaId &&
            $scope.editEmployee.PresentVillageInBangla === $scope.editEmployee.PermanentVillageInBangla &&
            $scope.editEmployee.PresentPostOfficeInBangla === $scope.editEmployee.PermanentPostOfficeInBangla) {
                $scope.sameAddress = 'YES';
                $scope.sameadd = true;
            }
        }

        //new mod 
        $scope.employeeAgeValidator = function (age) {
            if (age != undefined || age != null) {
                if (age.toString().length >= 1) {
                    if (age < 18 || age > 70) {
                        return "Employee age should be between 18 and 70";
                    }
                } else {
                    return "Employee age should be between 18 and 70";
                }
            } else {
                return "Employee age should be between 18 and 70";
            }
            return true;
        }
        $scope.getDateFromAge = function (age) {
            if (age != undefined && age.toString().length >= 2) {
                if (age < 18) {
                    $scope.editEmployee.Age = 18;
                }
                if (!$scope.editEmployee.DateOfBirth) {
                    var now = new Date();
                    $scope.editEmployee.DateOfBirth = $scope.getDateStrFromAge(now, $scope.editEmployee.Age);
                } else {
                    var birthDate = new Date($scope.editEmployee.DateOfBirth);
                    $scope.editEmployee.DateOfBirth = $scope.getDateStrFromAge(birthDate, $scope.editEmployee.Age);

                }
            }
        }
        $scope.getDateStrFromAge = function (date, age) {
            return new Date(date.setFullYear(new Date().getFullYear() - age));
        }

        

        $scope.addQualification = function () {
            if ($scope.editEmployee.AcademicQualification === null) $scope.editEmployee.AcademicQualification = [];
            $scope.editEmployee.AcademicQualification.push({
                Restype: 1,
                UniversityNameOrOthers: [],
                exams: []
            });
        }

        $scope.aqvalidator = function () {
            var invalid = false;
            $scope.editEmployee.AcademicQualification.forEach(function (aq) {
                if (aq.Restype === 1) {
                    if (aq.Grade === undefined || aq.Grade === null || aq.Cgpa === undefined || aq.Cgpa === null || aq.CgpaScale === undefined || aq.CgpaScale === null) {
                        invalid = true;
                        return;
                    }
                } else {
                    if (aq.Class === undefined || aq.Class === null) {
                        invalid = true;
                        return;
                    }
                }

            });
            return invalid;
        }

        $scope.clearAQModelData = function (index) {
            $scope.editEmployee.AcademicQualification[index].Class = null;
            $scope.editEmployee.AcademicQualification[index].Grade = null;
            $scope.editEmployee.AcademicQualification[index].CgpaScale = null;
            $scope.editEmployee.AcademicQualification[index].Cgpa = null;
        }

        $scope.removeAQualificaiton = function (index) {
            $scope.editEmployee.AcademicQualification.splice(index, 1);
        }
        $scope.addPQualification = function () {
            if ($scope.editEmployee.ProfessionalQualification === null) $scope.editEmployee.ProfessionalQualification = [];
            $scope.editEmployee.ProfessionalQualification.push({
                //Certification: '',
                //Institute:'',
                //Location: ''
                sdopened: false,
                edopened: false
            });
        }
        $scope.removePQualificaiton = function (index) {
            $scope.editEmployee.ProfessionalQualification.splice(index, 1);
        }
        $scope.addTraining = function () {
            if ($scope.editEmployee.Training === null) $scope.editEmployee.Training = [];
            $scope.editEmployee.Training.push({
                //TrainingTitle: '',
                //TopicsCovered: '',
                //InstituteName: '',
                //Country: '',
                //Location: '',
                //Duration: ''
            });
        }
        $scope.removeTraining = function (index) {
            $scope.editEmployee.Training.splice(index, 1);
        }

        $scope.addExperience = function () {
            if ($scope.editEmployee.Experience === null) $scope.editEmployee.Experience = [];
            $scope.editEmployee.Experience.push({
                sdopened: false,
                edopened: false

            });
        }
        $scope.removeExperience = function (index) {
            $scope.editEmployee.Experience.splice(index, 1);
        }

        $scope.getAge = function () {
            var today = new Date();
            var birthDate = new Date($scope.editEmployee.DateOfBirth);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && moment(today.getDate()).format("dd") !== moment(birthDate.getDate()).format("dd") && today.getDate() < birthDate.getDate())) {
                age--;
            }
            $scope.editEmployee.Age = age;
        }
        $scope.$watch('editEmployee.DateOfBirth', function () {
            $scope.getAge();
        });
        $scope.clearImageFiles = function () {
            $scope.employeeImage = null;
            $scope.employeePhoto = null;
            $('#employeePhoto').attr('src', '');
            $("#employeePhotoFile").val("");
        }
        $scope.removeImagesFromFiles = function () {
            $scope.files = $scope.files.filter(f => f.Category !== $rootScope.FileCategory.PROFILE_PHOTO);
        }


        $scope.imageUpload = function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageType = file.type.split('/')[1];
                if (imageType !== 'jpeg' && imageType !== 'jpg') {
                    swal("Image format jpg and jpeg are allowed");
                    return;
                }
                if (file.size > (1024 * 100)) {
                    swal("Image size is greater than 100 kb is not allowed");
                    return;
                }
                $scope.employeePhoto = file;
                $scope.employeePhoto.Category = $rootScope.FileCategory.PROFILE_PHOTO;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }
        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.employeeImage = e.target.result;
            });
        }

        $scope.segregateFile = function () {
            $scope.proPictureFile = $scope.uploadedFiles.filter(f => f.Category === $rootScope.FileCategory.PROFILE_PHOTO)[0];
            //$scope.signPictureFile = $scope.uploadedFiles.filter(f => f.Category === $rootScope.FileCategory.SIGNATURE)[0];
            if ($scope.proPictureFile !== undefined) {
                $scope.employeeImage = $scope.commonDownloadUrl + $scope.proPictureFile.DocumentUrl;
                $scope.removefile($scope.proPictureFile, $scope.uploadedFiles, 'Name');
            }
           console.log($scope.memberImage);
        }


        $scope.getYearFilterData = function () {
            $scope.filters.PassingYear = [];
            for (var i = 1950; i <= new Date($rootScope.workingdate).getFullYear() ; i++) {
                $scope.filters.PassingYear.push({
                    Name: i.toString(),
                    //Value: i - 1950 + 1,
                    Value: i,
                    DependencyValue: -1
                });
            }
        }
        $scope.getfilteredSubStatus = function () {
            $scope.filteredSubStatus = $scope.filters.SubStatus.filter(s => s.DependencyValue === $scope.editEmployee.Status);
        }

        $scope.setDepartment = function () {
            if ($scope.editEmployee.JoiningOfficeType !== 3) {
                $scope.editEmployee.DepartmentId = 5;
            }
        }
        $scope.setCurrentDepartment = function () {
            if ($scope.editEmployee.CurrentOfficeType !== 1) {
                $scope.editEmployee.CurrentDepartment = 5;
            }
        }


        $scope.clearAndCloseTab = function () {
            $scope.editEmployee = {};
            $scope.execRemoveTab($scope.tab);
        };
        $scope.formatAllDates=function() {
            if ($scope.editEmployee.DateOfBirth !== null && $scope.editEmployee.DateOfBirth !== undefined) $scope.editEmployee.DateOfBirth = moment($scope.editEmployee.DateOfBirth).format();
            if ($scope.editEmployee.AppLetterDate !== null && $scope.editEmployee.AppLetterDate !== undefined) $scope.editEmployee.AppLetterDate = moment($scope.editEmployee.AppLetterDate).format();
            if ($scope.editEmployee.JoiningLetterDate !== null && $scope.editEmployee.JoiningLetterDate !== undefined) $scope.editEmployee.JoiningLetterDate = moment($scope.editEmployee.JoiningLetterDate).format();
            if ($scope.editEmployee.JoiningDate !== null && $scope.editEmployee.JoiningDate !== undefined) $scope.editEmployee.JoiningDate = moment($scope.editEmployee.JoiningDate).format();
            if ($scope.editEmployee.CurrentBranchJoiningDate !== null && $scope.editEmployee.CurrentBranchJoiningDate !== undefined) $scope.editEmployee.CurrentBranchJoiningDate = moment($scope.editEmployee.CurrentBranchJoiningDate).format();
            if ($scope.editEmployee.ReleaseDate !== null && $scope.editEmployee.ReleaseDate !== undefined) $scope.editEmployee.ReleaseDate = moment($scope.editEmployee.ReleaseDate).format();
            if ($scope.editEmployee.PermanentDate !== null && $scope.editEmployee.PermanentDate !== undefined) $scope.editEmployee.PermanentDate = moment($scope.editEmployee.PermanentDate).format();
            if ($scope.editEmployee.PermanentLetterDate !== null && $scope.editEmployee.PermanentLetterDate !== undefined) $scope.editEmployee.PermanentLetterDate = moment($scope.editEmployee.PermanentLetterDate).format();
            if ($scope.editEmployee.ProfessionalQualification.length > 0) {
                
            }
            if ($scope.editEmployee.ProfessionalQualification.length > 0) {
                $scope.editEmployee.ProfessionalQualification.forEach(function(pq) {
                    pq.StartDate = moment(pq.StartDate).format();
                    pq.EndDate = moment(pq.EndDate).format();
                });
            }
            if ($scope.editEmployee.Experience.length > 0) {
                $scope.editEmployee.Experience.forEach(function (ex) {
                    ex.StartDate = moment(ex.StartDate).format();
                    ex.EndDate = moment(ex.EndDate).format();
                });
            }
        }
        $scope.beforeJoiningDateRender = function ($dates) {
            //$scope.employee.JoiningDate = moment().format();
            if (($scope.editEmployee.CurrentBranchJoiningDate !== undefined && $scope.editEmployee.CurrentBranchJoiningDate !== null)
                && ($scope.editEmployee.JoiningDate !== undefined && $scope.editEmployee.JoiningDate !== null)
                && ($scope.editEmployee.JoiningDate > $scope.editEmployee.CurrentBranchJoiningDate)) {
                swal('Joining Date can not be greater than Current branch joining date! ');
                $scope.editEmployee.JoiningDate = null;
                return;
            }

        }
        $scope.beforeCurrentJoiningDateRender = function ($dates) {
            //$scope.employee.JoiningDate = moment().format();
            if (($scope.editEmployee.CurrentBranchJoiningDate !== undefined && $scope.editEmployee.CurrentBranchJoiningDate !== null)
                && ($scope.editEmployee.JoiningDate !== undefined && $scope.editEmployee.JoiningDate !== null)
                && ($scope.editEmployee.JoiningDate > $scope.editEmployee.CurrentBranchJoiningDate)) {
                swal('Current branch Joining Date can not be less than joining date! ');
                $scope.editEmployee.CurrentBranchJoiningDate = null;
                return;
            }

        }
        $scope.requiredNullDateChecker = function () {
            var invalid = false;
            if ($scope.editEmployee.ProfessionalQualification.length > 0) {
                $scope.editEmployee.ProfessionalQualification.forEach(function (pq) {
                    if (pq.StartDate === null || pq.StartDate === undefined) {
                        swal('please specify professional qualification start date!');
                        invalid = true;
                        return invalid;
                    }
                    if (pq.EndDate === null || pq.EndDate === undefined) {
                        swal('please specify professional qualification end date!');
                        invalid = true;
                        return invalid;
                    }
                });
                if (invalid) return invalid;
            }
           
            if ($scope.editEmployee.Experience.length > 0) {
                $scope.editEmployee.Experience.forEach(function (ex) {
                    if (ex.StartDate === null || ex.StartDate === undefined) {
                        swal('please specify Experience start date!');
                        invalid = true;
                        return invalid;


                    }
                    if (ex.EndDate === null || ex.EndDate === undefined) {
                        swal('please specify Experience end date!');
                        invalid = true;
                        return invalid;;
                    }
                });
                if (invalid) return invalid;
            }
           
            if ($scope.editEmployee.AppLetterDate === null || $scope.editEmployee.AppLetterDate === undefined) {
                swal('please select appointment letter date!');
                invalid = true;
                return invalid;;
            }
            if ($scope.editEmployee.JoiningDate === null || $scope.editEmployee.JoiningDate === undefined) {
                swal('please select joining date!');
                invalid = true;
                return invalid;;
            }
            if ($scope.editEmployee.CurrentBranchJoiningDate === null || $scope.editEmployee.CurrentBranchJoiningDate === undefined) {
                swal('please select current branch joining date!');
                invalid = true;
                return invalid;;
            }
            if ($scope.editEmployee.Status === 2 && ($scope.editEmployee.AppLetterDate === null || $scope.editEmployee.AppLetterDate === undefined)) {
                swal('please select release date!');
                invalid = true;
                return invalid;;
            }
            return invalid;

        }


        $scope.checkExamOrder = function (index) {
            if (index > 0) {
                if ($scope.filters.EducationLevel.filter(et => et.Value === $scope.editEmployee.AcademicQualification[index - 1].ExamType)[0].DependencyValue <= $scope.filters.EducationLevel.filter(et => et.Value === $scope.editEmployee.AcademicQualification[index].ExamType)[0].DependencyValue) {
                    swal('please select Exam type In descending order!');
                    $scope.editEmployee.AcademicQualification[index].ExamType = null;
                    return;
                }
            }
        }
        $scope.setExamTitle = function (index) {
            $scope.editEmployee.AcademicQualification[index].ExamTitle = $scope.editEmployee.AcademicQualification[index].ExamType;
        }
        $scope.checkCGConsistancy = function (index) {
            if ($scope.editEmployee.AcademicQualification[index].CgpaScale !== undefined && $scope.editEmployee.AcademicQualification[index].CgpaScale !== null
                && $scope.editEmployee.AcademicQualification[index].Cgpa !== undefined && $scope.editEmployee.AcademicQualification[index].Cgpa !== null) {
                var cgscalevalue = parseInt($scope.filters.CGScale.filter(cg => cg.Value === $scope.editEmployee.AcademicQualification[index].CgpaScale)[0].Name);
                if (cgscalevalue < $scope.editEmployee.AcademicQualification[index].Cgpa) {
                    swal('cgpa can not be greater than cgpa scale!');
                    $scope.editEmployee.AcademicQualification[index].Cgpa = null;
                    return;
                }
            }
        }
        $scope.cgpavalidator = function (index) {
            if ($scope.editEmployee.AcademicQualification[index].Cgpa > 5 || $scope.editEmployee.AcademicQualification[index].Cgpa<1) {
                swal('invalid cgpa!');
                $scope.editEmployee.AcademicQualification[index].Cgpa = null;
                return;
            }
        }
        $scope.validatePassingYear = function (index) {
            if ($scope.editEmployee.DateOfBirth !== undefined && $scope.editEmployee.DateOfBirth !== null && $scope.editEmployee.AcademicQualification[index].PassingYear < $scope.editEmployee.DateOfBirth.getFullYear()) {
                swal('exam passing year can not be less than date of birth year!');
                $scope.editEmployee.AcademicQualification[index].PassingYear = null;
                return;
            }

            if ($scope.editEmployee.AcademicQualification.length > 1) {

                if ($scope.editEmployee.AcademicQualification[index - 1].PassingYear === undefined) {
                    swal("please select previous row's passing year first!");
                    $scope.editEmployee.AcademicQualification[index].PassingYear = undefined;
                    return;
                }

                if ($scope.editEmployee.AcademicQualification[index].PassingYear > $scope.editEmployee.AcademicQualification[index - 1].PassingYear) {
                    swal('Invalid passing year!');
                    $scope.editEmployee.AcademicQualification[index].PassingYear = null;
                    return;
                }
            }
        }

        //upload document
        $scope.removefile = function (file, files, propertyName) {
            var value = file.name;
            var i = AMMS.findWithAttr(files, propertyName, value);
            files.splice(i, 1);
            $scope.docSizeBoolChecker();

        }

        //$scope.removefileDB = function (file) {
        //    swal({
        //        title: "Are you sure?",
        //        text: "You will not be able to recover this file!",
        //        type: "warning",
        //        showCancelButton: true,
        //        confirmButtonColor: "#DD6B55",
        //        confirmButtonText: "Yes, delete it!",
        //        closeOnConfirm: false
        //    },
        //        function () {
        //            documentService.deleteDocument(file.Id).then(function (response) {
        //                if (response.data.Success) {
        //                    $scope.removefile(file, $scope.uploadedFiles, 'Name');
        //                }
        //            }, AMMS.handleServiceError);

        //            swal("Deleted!", "file has been deleted.", "success");
        //        });
        //}
        $scope.removeProfilePicture = function () {
            $scope.employeePhoto = {};
            $scope.employeeImage = null;
            $('#employeePhoto').attr('src', '');
            $("#employeePhotoFile").val("");
        }

        $scope.removefileDB = function (file, pporsign) {
            if (file === undefined) {
              if (pporsign === 'pp' && $scope.employeeImage !== null) {
                    $scope.removeProfilePicture();
                    return;
                }
                

                swal("Nothing to delete!", 'Error', 'error');
                return;

            }
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        documentService.deleteDocument(file.Id).then(function (response) {
                            if (response.data.Success) {

                                if (pporsign === 'pp') {
                                    $scope.removeProfilePicture();
                                    $scope.proPictureFile = undefined;
                                }else {
                                    $scope.removefile(file, $scope.uploadedFiles, 'Name');
                                }
                                swal("Deleted!", "file has been deleted.", "success");

                            } else {
                                swal("Something went wrong!", response.data.Message, "error");
                            }
                        }, AMMS.handleServiceError);
                    } else {
                        return;
                    }
                });
        }



        $scope.removeLocalFile = function (hash) {
            if (hash) {
                documentService.deleteLocalDocument(hash);
            }
            $scope.docSizeBoolChecker();
        }


        //new date picker 
        $scope.today = function () {
            $scope.editEmployee.DateOfBirth = new Date($rootScope.workingdate);
            $scope.editEmployee.JoiningDate = new Date($rootScope.workingdate);
            $scope.editEmployee.CurrentBranchJoiningDate = new Date($rootScope.workingdate);
            $scope.editEmployee.AppLetterDate = new Date($rootScope.workingdate);
        };
        //$scope.today();



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
        $scope.dateOptionsDOB = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date($rootScope.workingdate),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };

        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5));
        }

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate.getDate() + 1);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.openBdayPop = function () {
            $scope.bdayPop.opened = true;
        };
        $scope.openAPLpop = function () {
            $scope.openingAPLPop.opened = true;
        };
        $scope.openJLpop = function () {
            $scope.openingJLPop.opened = true;
        };
        $scope.openJpop = function () {
            $scope.openingJPop.opened = true;
        };
        $scope.openPLpop = function () {
            $scope.openingPLPop.opened = true;
        };
        $scope.openPpop = function () {
            $scope.openingPPop.opened = true;
        };
        $scope.openCJpop = function () {
            $scope.openingCJPop.opened = true;
        };
        $scope.openRLpop = function () {
            $scope.openingRLPop.opened = true;
        };

        $scope.openPQSDpop = function (index) {
            $scope.editEmployee.ProfessionalQualification[index].sdopened = true;
        }
        $scope.openPQEDpop = function (index) {
            $scope.editEmployee.ProfessionalQualification[index].edopened = true;
        }
        $scope.openEXSDpop = function (index) {
            $scope.editEmployee.Experience[index].sdopened = true;
        }
        $scope.openEXEDpop = function (index) {
            $scope.editEmployee.Experience[index].edopened = true;
        }
        $scope.syncCJDate=function() {
            if ($scope.editEmployee.EmpbranchCount < 2) {
                $scope.editEmployee.CurrentBranchJoiningDate = $scope.editEmployee.JoiningDate;
            }
        }

       // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.bdayPop = {
            opened: false
        };

        $scope.openingAPLPop = {
            opened: false
        };
        $scope.openingJLPop = {
            opened: false
        };
        $scope.openingJPop = {
            opened: false
        };
        $scope.openingPLPop = {
            opened: false
        };
        $scope.openingPPop = {
            opened: false
        };
        $scope.openingCJPop = {
            opened: false
        };
        $scope.openRLpop = {
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
        $scope.rlValidator = function () {
            //if (($scope.selectedAccountType.Category !== 1 && $scope.selectedAccountType.Category !== 5) &&
            //     (moment($scope.eaccount.OpeningDate).valueOf() > maxDate || moment($scope.eaccount.OpeningDate).valueOf() < minDate)) {
            //     swal("please select valid date!");
            //     $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
            //     return;
            // }
        }
        $scope.cjValidator = function () {

        }
        $scope.pValidator = function () {

        }
        $scope.plValidator = function () {

        }
        $scope.jValidator = function () {

        }
        $scope.jldValidator = function () {

        }
        $scope.apldValidator = function () {

        }
        $scope.bdayValidator = function () {

        }

    }]);