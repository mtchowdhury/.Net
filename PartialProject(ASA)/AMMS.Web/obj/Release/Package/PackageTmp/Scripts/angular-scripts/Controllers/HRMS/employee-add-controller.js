ammsAng.controller('employeeAddController', ['$scope', '$rootScope', '$timeout', 'filterService', 'employeeFilterService', 'employeeService', "fileService", "Upload", 'documentService', 'commonService',
    function($scope, $rootScope, $timeout, filterService, employeeFilterService, employeeService, fileService, Upload, documentService, commonService) {
        $scope.employee = {};
        $scope.filters = {};
        $scope.files = [];
        $scope.entityId = '';
        $scope.employee.AcademicQualification = [];
        $scope.employee.ProfessionalQualification = [];
        $scope.employee.Training = [];
        $scope.employee.Experience = [];
        $scope.employeeImage = null;
        $scope.employeePhoto = null;
        $scope.selectedDistrictObject = $rootScope.selectedDistricObject;
        

        
        $scope.$watch('files', function() {
            $scope.docSizeBoolChecker();
        });

        $scope.docSizeBoolChecker = function() {
            $scope.fileSize = 0;
            $scope.files.forEach(function(file) {
                $scope.fileSize += file.size;
                if ($scope.fileSize > (1024 * 1024) * ($rootScope.documentSize)) {
                    $scope.docError = true;
                    return;

                } else {
                    $scope.docError = false;
                }

            });
        }

        $scope.addEmployee = function() {
            if ($scope.docError) {
                swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');
                // $scope.docError = false;
                return;
            }
            if ($scope.employee.AcademicQualification.length < 1) {
                swal('At least one Academic-Qualification is required!');
                return;
            }
            if ($scope.aqvalidator()) {
                swal('please define all the required information in selected academic qualification rows!');
                return;
            }

            if ($scope.employee.AppLetterDate === undefined || $scope.employee.AppLetterDate === null) {
                swal('Appointment letter date can not be left empty!');
                return;
            }
            if ($scope.requiredNullDateChecker()) return;

            if ($scope.employee.PermanentThanaId === undefined || $scope.employee.PermanentThanaId === null) {
                swal('please select thana for permanent address!');
                return;
            }
            if ($scope.employee.PresentThanaId === undefined || $scope.employee.PresentThanaId === null) {
                swal('please select thana for present address!');
                return;
            }
            //pq date validation
            if ($scope.employee.ProfessionalQualification.length > 0) {
                $scope.pqInvalid = false;
                $scope.pqdobInvalid = false;

                $scope.employee.ProfessionalQualification.forEach(function(pq) {
                    if (pq.StartDate === undefined || pq.StartDate === null || pq.EndDate === undefined || pq.EndDate === null) {
                        $scope.pqInvalid = true;
                        return;
                    }
                    if (moment(pq.StartDate).valueOf() > moment(pq.EndDate).valueOf()) {
                        $scope.pqInvalid = true;
                        return;
                    }
                    if (moment(pq.StartDate).valueOf() < moment($scope.employee.DateOfBirth).valueOf()) {
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
            if ($scope.employee.Experience.length > 0) {
                $scope.expInvalid = false;
                $scope.expdobInvalid = false;
                $scope.employee.Experience.forEach(function(ex) {
                    if (ex.StartDate === undefined || ex.StartDate === null || ex.EndDate === undefined || ex.EndDate === null) {
                        $scope.expInvalid = true;
                        return;
                    }
                    if (moment(ex.StartDate).valueOf() > moment(ex.EndDate).valueOf()) {
                        $scope.expInvalid = true;
                        return;
                    }
                    if (moment(ex.StartDate).valueOf() < moment($scope.employee.DateOfBirth).valueOf()) {
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

            if (moment($scope.employee.AppLetterDate).valueOf() < moment($scope.employee.DateOfBirth).valueOf()) {
                swal('appointment letter date can not be less than employee birth date!');
                return;
            }
            if (($scope.employee.JoiningLetterDate !== undefined && $scope.employee.JoiningLetterDate !== null) && (moment($scope.employee.JoiningLetterDate).valueOf() < moment($scope.employee.AppLetterDate).valueOf())) {
                swal('ASA joining  letter date can not be less than employee appointment letter date!');
                return;
            }
            if (($scope.employee.JoiningLetterDate === undefined || $scope.employee.JoiningLetterDate === null) && (moment($scope.employee.JoiningDate).valueOf() < moment($scope.employee.AppLetterDate).valueOf())) {
                swal('ASA joining  date can not be less than employee appointment letter date!');
                return;
            }

            if (($scope.employee.JoiningLetterDate !== undefined && $scope.employee.JoiningLetterDate !== null) && (moment($scope.employee.JoiningDate).valueOf() < moment($scope.employee.JoiningLetterDate).valueOf())) {
                swal('ASA joining date can not be less than employee ASA joining letter date!');
                return;
            }
            //if (moment($scope.employee.CurrentBranchJoiningDate).valueOf() < moment($scope.employee.JoiningDate).valueOf()) {
            //    swal('Current joining date can not be less than employee joining date!');
            //    return;
            //}
            if (($scope.employee.ReleaseDate !== null && $scope.employee.ReleaseDate !== undefined) && (moment($scope.employee.ReleaseDate).valueOf() < moment($scope.employee.CurrentBranchJoiningDate).valueOf())) {
                swal('Employee release date can not be less than employee Current joining date!');
                return;
            }
            if ($scope.employee.PermanentLetterDate !== null && $scope.employee.PermanentLetterDate !== undefined) {
                if ($scope.employee.JoiningEmploymentType === 2) {
                    if (moment($scope.employee.PermanentLetterDate).valueOf() < moment($scope.employee.JoiningDate).valueOf()) {
                        swal('permanent letter date can not be less than ASA joining date!');
                        return;
                    }
                }
                if ($scope.employee.CurrentEmploymentType === 2) {
                    if (moment($scope.employee.PermanentLetterDate).valueOf() > moment($scope.employee.CurrentBranchJoiningDate).valueOf()) {
                        swal('permanent letter date can not be greater than Current joining date!');
                        return;
                    }

                }
                if ($scope.employee.JoiningEmploymentType !== 2 && $scope.employee.CurrentEmploymentType !== 2) {
                    swal("please select permanent employement type before setting permanent letter date!");
                    $scope.employee.PermanentLetterDate = null;
                    return;
                }
            }
            if ($scope.employee.PermanentDate !== null && $scope.employee.PermanentDate !== undefined) {
                if ($scope.employee.JoiningEmploymentType === 2) {
                    if (moment($scope.employee.PermanentDate).valueOf() < moment($scope.employee.JoiningDate).valueOf()) {
                        swal('permanent  date can not be less than ASA joining date!');
                        return;
                    }
                }
                if ($scope.employee.CurrentEmploymentType === 2) {
                    if (moment($scope.employee.PermanentDate).valueOf() > moment($scope.employee.CurrentBranchJoiningDate).valueOf()) {
                        swal('permanent  date can not be greater than Current joining date!');
                        return;
                    }

                }
                if ($scope.employee.JoiningEmploymentType !== 2 && $scope.employee.CurrentEmploymentType !== 2) {
                    swal("please select permanent employement type before setting permanent  date!");
                    $scope.employee.PermanentDate = null;
                    return;
                }
            }
            if ($scope.employee.PermanentLetterDate !== null && $scope.employee.PermanentLetterDate !== undefined && $scope.employee.PermanentDate !== null && $scope.employee.PermanentDate !== undefined
                && moment($scope.employee.PermanentLetterDate).valueOf() > moment($scope.employee.PermanentDate).valueOf()) {
                swal('permanent letter date can not be greater than permanent date!');
                return;
            }

            


            swal(commonService.swalHeaders($rootScope.showMessage($rootScope.addConfirmation, $rootScope.employee), "warning"),
                function() {
                    //if ($scope.employee.Training.length > 0) {
                    //    $scope.employee.Training.forEach(function (training) {
                    //        training.StartDate = moment(training.StartDate).format();
                    //        training.EndDate = moment(training.EndDate).format();
                    //    });

                    //}
                    //if ($scope.employee.Experience.lenth > 0) {
                    //    $scope.employee.Experience.forEach(function (experience) {
                    //        experience.StartDate = moment(experience.StartDate).format();
                    //        experience.EndDate = moment(experience.EndDate).format();
                    //    });
                    //}
                    //if ($scope.employee.ProfessionalQualification.lenth > 0) {
                    //    $scope.employee.ProfessionalQualification.forEach(function (pq) {
                    //        pq.StartDate = moment(pq.StartDate).format();
                    //        pq.EndDate = moment(pq.EndDate).format();
                    //    });
                    //}
                    $scope.employee.DateOfBirth = moment($scope.employee.DateOfBirth).format();
                    $scope.employee.AppLetterDate = moment($scope.employee.AppLetterDate).format();
                    $scope.employee.JoiningLetterDate = $scope.employee.JoiningLetterDate!==undefined? moment($scope.employee.JoiningLetterDate).format():undefined;
                    $scope.employee.JoiningDate = moment($scope.employee.JoiningDate).format();
                    $scope.employee.CurrentBranchJoiningDate = moment($scope.employee.CurrentBranchJoiningDate).format();
                    $scope.employee.PermanentLetterDate = $scope.employee.PermanentLetterDate!==undefined? moment($scope.employee.PermanentLetterDate).format():undefined;
                    $scope.employee.PermanentDate =$scope.employee.PermanentDate!==undefined? moment($scope.employee.PermanentDate).format():undefined;
                    $scope.employee.MobilePhoneNo = $scope.MobilePhoneNo.toString();


                    $scope.formatAllDates();

                   


                    //if ($scope.employee.ReleaseDate !== null || $scope.employee.ReleaseDate !== undefined) $scope.employee.ReleaseDate = $rootScope.toServerSideDate($scope.employee.ReleaseDate);
                    $scope.files.forEach(function(file) {
                        file.Category = $rootScope.FileCategory.GENERAL;
                    });
                    if ($scope.employeePhoto != null) {
                        $scope.files.push($scope.employeePhoto);
                    }
                    // $scope.employee.Sex = $scope.sexList.filter(e => e.value == $scope.employee.Sex)[0].text;
                    employeeService.postEmployee($scope.employee).then(function(response) {
                        if (response.data.Success) {
                            if (response.data.Entity.Id && $scope.files.length > 0) {
                                documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.Employee, $rootScope.user.UserId, $scope.employeePhoto != null ? $scope.employeePhoto.name : '')
                                    .then(function(res) {
                                        if (res.data.Success) {
                                            $rootScope.$broadcast('employee-add-finished');
                                            swal({
                                                    title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.employee),
                                                    text: "What do you want to do next?",
                                                    type: "success",
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#008000",
                                                    confirmButtonText: "Add New",
                                                    cancelButtonText: "Close and Exit",
                                                    closeOnConfirm: true,
                                                    closeOnCancel: true
                                                },
                                                function(isConfirm) {
                                                    if (isConfirm) {
                                                        $scope.clearModelData();
                                                        $scope.addEmployeeForm.reset();
                                                        $scope.addEmployeeForm.$dirty = false;
                                                        
                                                    } else {
                                                        $scope.clearAndCloseTab();
                                                    }
                                                });
                                        } else {
                                            swal($rootScope.docAddError, response.data.Message, "error");
                                            // $scope.today();
                                            $scope.restoreAllDatesOnPostFailure();
                                            $scope.employee.Sex = $scope.sexList.filter(e => e.text == $scope.employee.Sex)[0].value;
                                        }
                                    });
                            } else {
                                $rootScope.$broadcast('employee-add-finished');
                                swal({
                                        title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.employee),
                                        text: "What do you want to do next?",
                                        type: "success",
                                        showCancelButton: true,
                                        confirmButtonColor: "#008000",
                                        confirmButtonText: "Add New",
                                        cancelButtonText: "Close and Exit",
                                        closeOnConfirm: true,
                                        closeOnCancel: true
                                    },
                                    function(isConfirm) {
                                        if (isConfirm) {
                                            $scope.clearModelData();
                                            $scope.addEmployeeForm.reset();
                                            $scope.addEmployeeForm.$dirty = false;
                                            
                                        } else {
                                            $scope.clearAndCloseTab();
                                        }
                                    });
                            }

                        } else {
                            swal($rootScope.showMessage($rootScope.addError, $rootScope.employee), response.data.Message, "error");
                            $scope.restoreAllDatesOnPostFailure();
                        }
                    }, AMMS.handleServiceError);
                });
        }

        $scope.restoreAllDatesOnPostFailure = function () {
            $scope.employee.DateOfBirth = new Date($scope.employee.DateOfBirth);
            $scope.employee.AppLetterDate = new Date($scope.employee.AppLetterDate);
            $scope.employee.JoiningLetterDate = $scope.employee.JoiningLetterDate !== undefined ? new Date($scope.employee.JoiningLetterDate) : undefined;
            $scope.employee.JoiningDate = new Date($scope.employee.JoiningDate);
            $scope.employee.CurrentBranchJoiningDate = new Date($scope.employee.CurrentBranchJoiningDate);
            $scope.employee.PermanentLetterDate = $scope.employee.PermanentLetterDate !== undefined ? new Date($scope.employee.PermanentLetterDate) : undefined;
            $scope.employee.PermanentDate = $scope.employee.PermanentDate !== undefined ? new Date($scope.employee.PermanentDate) : undefined;


            $scope.employee.ProfessionalQualification.forEach(function(pq) {
                pq.StartDate = new Date(pq.StartDate);
                pq.EndDate = new Date(pq.EndDate);
            });
            $scope.employee.Experience.forEach(function (ex) {
                ex.StartDate = new Date(ex.StartDate);
                ex.EndDate = new Date(ex.EndDate);
            });
        }

        $scope.NIDValidator = function(nid) {
            if (!nid) return "NID field is required";
            if (!(nid.toString().length === 13 || nid.toString().length === 17 || nid.toString().length === 10)) {
                return "NID must be 10,13 or 17  characters long";
            }
            return true;
        }

        $scope.MobileValidator = function(mobile) {
            if (!mobile) return "Mobile Phone No field required";
            if (!(mobile.toString().length === 10)) {
                return "Mobile Phone No must be 10 characters long";
            }
            return true;
        }

        $scope.PhoneNoValidator = function(phone) {
            if (!phone) return true;
            var pattern = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
            if (pattern.test(phone)) {
                return true;
            } else {
                return "invalid Phone Number";
            }
        }
        $scope.validateEmail = function(email) {
            //if (!email) return "Email field is required";
            if (!email)return true;
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(email) || email.split('@')[1]!=='asabd.org')
                return "Invalid Email";
            return true;
        }

        $scope.addEmployeeFilterData = function () {
            $("#loadingImage").css("display", "block");
            $scope.filtersservice = employeeFilterService.getEmployeeAddfilters().then(function(response) {
                $scope.filters = response.data;
                $scope.filters.Districts = $scope.filters.Districts.filter(d => d.Value !== 65);//splice secp
                console.log(response.data);

                $scope.getYearFilterData();
                $("#loadingImage").css("display", "none");
                //$scope.filters.administrativeDistricts = $scope.filter.Districts;
                //$scope.filters.Grades = $scope.filter.Grades;
                //$scope.filters.Zones = $scope.filter.Zones;
                //$scope.filters.Departments = $scope.filter.Departments;
                //$scope.filters.TaxCircleZones = $scope.filter.TaxCircleZones;
                //$scope.filters.BloodGroup = data.BloodGroup;
                //$scope.filters.EmployeeSex = data.EmployeeSex;
                //$scope.filters.MaritalStatus = data.MaritalStatus;
                //$scope.filters.Religion = data.Religion;
                //$scope.filters.Status = data.Status;
                //$scope.filters.SubStatus = data.SubStatus;
                var i = 0;
                //$scope.filters.ExamType.forEach(function(et) {
                //    et.SortOrder = i;
                //    i++;
                //});
                // console.lgo($scope.filters.ExamType);
                $scope.filters.Restype = [];
                $scope.filters.Restype.push({
                    Name: 'Grade',
                    Value:1
                });
                $scope.filters.Restype.push({
                    Name: 'Class',
                    Value: 2
                });

                $scope.assignDefaultValue();
                $scope.getRelatedDataForDefaultValue();
            }, AMMS.handleServiceError);
            //$scope.getOrganizonalFilterData('MaritalStatus', 'maritalStatusList', 'MaritalStatus');
            //$scope.getOrganizonalFilterData('BloodGroup', 'bloodGroupList', 'BloodGroup');
            //$scope.getOrganizonalFilterData('EmployeeSex', 'sexList', 'Sex');
            //$scope.getOrganizonalFilterData('Religion', 'religionList', 'Religion');
            //$scope.getOrganizonalFilterData('EmploymentType', 'typeList', 'EmploymentType');
            //$scope.getOrganizonalFilterData('EmploymentStatus', 'statusList', 'Status');
            if ($rootScope.user.Role === $rootScope.rootLevel.BM.toString() || $rootScope.user.Role === $rootScope.rootLevel.DM.toString() || $rootScope.user.Role === $rootScope.rootLevel.RM.toString()) {
                $scope.employee.JoiningOfficeType = 1;
            }
        }

        $scope.getOrganizonalFilterData = function (type, listToSet, model) {
            $("#loadingImage").css("display", "block");
            filterService.getOrganizationalFilterDataByType(type)
                .then(function(response) {
                    $scope[listToSet] = response.data;
                    //console.log(response.data);
                    if ($scope[listToSet][0]) {
                        $scope.employee[model] = $scope[listToSet][0].value;
                        $("#loadingImage").css("display", "none");
                    }
                }, AMMS.handleServiceError);
        }

        $scope.assignDefaultValue = function() {
            var matchedPermDisttrict = $scope.filters.Districts.length > 0 ?$scope.filters.Districts.filter(d => d.Name === $scope.selectedDistrictObject.DistrictName.split('-')[0])[0]:undefined;
            var matchedPresDisttrict = $scope.filters.Districts.length > 0 ? $scope.filters.Districts.filter(d => d.Name === $scope.selectedDistrictObject.DistrictName.split('-')[0])[0] : undefined;
            $scope.employee.PermanentGovtDistrict = matchedPermDisttrict !== undefined ? matchedPermDisttrict.Value : 1;
            $scope.employee.PresentGovtDistrict = matchedPresDisttrict !== undefined ? matchedPresDisttrict.Value : 1;
            //for two very special cases :
            if ($scope.selectedDistrictObject.DistrictName.split('-')[0] === 'Barisal' && $scope.filters.Districts.length > 0) {
                $scope.employee.PermanentGovtDistrict = 4;
                $scope.employee.PresentGovtDistrict = 4;
            }
            if ($scope.selectedDistrictObject.DistrictName.split('-')[0] === 'Moulavibazar' && $scope.filters.Districts.length > 0) {
                $scope.employee.PermanentGovtDistrict = 38;
                $scope.employee.PresentGovtDistrict = 38;
            }
            // $scope.employee.PresentGovtDistrict = $scope.filters.Districts.length > 0 ? $scope.filters.Districts[0].Value : 0;

            //  $scope.employee.ZoneId = $scope.filters.Zones.length ? $scope.filters.Zones[0].Value : 0;
            $scope.employee.ZoneId = $scope.filters.locationObject[3].Value;
            $scope.employee.JoiningFaOffice = $scope.employee.ZoneId;
            $scope.employee.GradeId = $scope.filters.Grades.length > 0 ? $scope.filters.Grades[0].Value : 0;
            // $scope.employee.TaxCircleZoneId = $scope.filters.TaxCircleZones.length > 0 ? $scope.filters.TaxCircleZones[0].Value : 0;
            $scope.employee.DepartmentId = $scope.filters.Departments.length > 0 ? $scope.filters.Departments[0].Value : 0;
            $scope.setDepartment();
            $scope.getDesignationsByGradeId($scope.employee.GradeId);
            $scope.getAsaDistricts($scope.employee.ZoneId);

            //$scope.employee.DateOfBirth = moment($rootScope.workingdate).format();
            //$scope.employee.JoiningDate = moment($rootScope.workingdate).format();
            //$scope.employee.CurrentBranchJoiningDate = moment($rootScope.workingdate).format();
            $scope.employee.Sex = 1;
            $scope.employee.MaritalStatus = 1;
            $scope.employee.Religion = 1;
            $scope.employee.Nationality = 1;
            $scope.employee.Status = 1;
            $scope.employee.BloodGroup = 1;

            $scope.getfilteredSubStatus();
            $scope.employee.SubStatus = 1;
            //$scope.employee.DateOfBirth = $rootScope.selectedBranchId;
            $scope.setOfficeDisabler();

        }
        $scope.setOfficeDisabler=function() {
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
            }else if ($rootScope.user.Role === $rootScope.UserRole.RM) {
                $scope.zonedisabled = true;
                $scope.districtdisabled = true;
                $scope.regiondisabled = true;
                $scope.branchdisabled = false;
            }else if ($rootScope.user.Role === $rootScope.UserRole.BM) {
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

        $scope.getRelatedDataForDefaultValue = function () {
            $("#loadingImage").css("display", "block");
            $scope.getThanas($scope.employee.PermanentGovtDistrict, 'permanent');
            $scope.getThanas($scope.employee.PresentGovtDistrict, 'present');
            $("#loadingImage").css("display", "none");
        }

        $scope.addEmployeeFilterData();

        $scope.getThanas = function(districtId, type) {
            if (type === 'permanent') {
                $scope.thanasOfPermanentAdministrativeDistrict = null;
            } else {
                $scope.thanasOfPresentAdministrativeDistrict = null;
            }
            $("#loadingImage").css("display", "block");
            $scope.pthanas = employeeFilterService.getThanasOfDistrict(districtId).then(function(response) {
                if (type === 'permanent') {
                    $scope.thanasOfPermanentAdministrativeDistrict = response.data;
                    //if ($scope.thanasOfPermanentAdministrativeDistrict.length > 0)
                    //    $scope.employee.PermanentThanaId = $scope.thanasOfPermanentAdministrativeDistrict[0].Value;
                } else {
                    $scope.thanasOfPresentAdministrativeDistrict = response.data;
                    //if ($scope.thanasOfPresentAdministrativeDistrict.length > 0)
                    //    $scope.employee.PresentThanaId = $scope.thanasOfPresentAdministrativeDistrict[0].Value;
                } $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }

        $scope.getAsaDistricts = function (zoneId) {
            $("#loadingImage").css("display", "block");
            $scope.employee.asadistrictId = null;
            $scope.employee.RegionId = null;
            $scope.employee.BranchId = null;
            if (!zoneId) {
                $scope.asaDistrictsOfZone = null;
                $scope.regionsOfDistrict = null;
                $scope.branchesOfRegion = null;
                return;
            }
            employeeFilterService.getAsaDistrictsOfZone(zoneId).then(function(response) {
                $scope.asaDistrictsOfZone = response.data;
                if ($scope.asaDistrictsOfZone.length > 0) {
                    $scope.asaDistrictsOfZone.forEach(function(d) {
                        d.Value = parseInt(d.Value);
                    });
                    //  $scope.employee.asadistrictId = $scope.asaDistrictsOfZone[0].Value;
                    $scope.employee.DistrictId = $scope.filters.locationObject[2].Value;
                    $scope.getRegionsOfDistrict($scope.employee.DistrictId);
                } else {
                    $scope.asaDistrictsOfZone = null;
                    $scope.regionsOfDistrict = null;
                    $scope.branchesOfRegion = null;

                    return;
                }
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }
        $scope.getAsaDistrictsCurrent = function (zoneId) {
            $("#loadingImage").css("display", "block");
            $scope.employee.CurrentDistrict = null;
            $scope.employee.CurrentRegion = null;
            $scope.employee.CBranchId = null;
            if (!zoneId) {
                $scope.asaDistrictsOfZoneCurrent = null;
                $scope.regionsOfDistrictCurrent = null;
                $scope.branchesOfRegionCurrent = null;
                return;
            }
            employeeFilterService.getAsaDistrictsOfZone(zoneId).then(function(response) {
                $scope.asaDistrictsOfZoneCurrent = response.data;
                if ($scope.asaDistrictsOfZoneCurrent.length > 0) {
                    $scope.employee.CurrentDistrict = $scope.asaDistrictsOfZoneCurrent[0].Value;
                    $scope.getRegionsOfDistrictCurrent($scope.employee.CurrentDistrict);
                } else {
                    $scope.asaDistrictsOfZoneCurrent = null;
                    $scope.regionsOfDistrictCurrent = null;
                    $scope.branchesOfRegionCurrent = null;
                    return;
                }
            }, AMMS.handleServiceError);
            $("#loadingImage").css("display", "none");
        }

        $scope.getRegionsOfDistrictCurrent = function (districtId) {
            $("#loadingImage").css("display", "block");
            $scope.employee.CurrentRegion = null;
            $scope.employee.CBranchId = null;
            console.log(districtId);
            if (!districtId) {
                $scope.regionsOfDistrictCurrent = null;
                $scope.branchesOfRegionCurrent = null;
                return;
            }
            employeeFilterService.getRegionsOfAsaDistrict(districtId).then(function(response) {
                $scope.regionsOfDistrictCurrent = response.data;
                if ($scope.regionsOfDistrictCurrent.length > 0) {
                    $scope.employee.CurrentRegion = $scope.regionsOfDistrictCurrent[0].Value;
                    $scope.getBranchesOfRegionCurrent($scope.employee.CurrentRegion);
                } else {
                    $scope.regionsOfDistrictCurrent = null;
                    $scope.branchesOfRegionCurrent = null;
                    return;
                }
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }
        $scope.getRegionsOfDistrict = function (districtId) {
            $("#loadingImage").css("display", "block");
            $scope.employee.RegionId = null;
            $scope.employee.BranchId = null;
            console.log(districtId);
            if (!districtId) {
                $scope.regionsOfDistrict = null;
                $scope.branchesOfRegion = null;
                return;
            }
            employeeFilterService.getRegionsOfAsaDistrict(districtId).then(function(response) {
                $scope.regionsOfDistrict = response.data;
                if ($scope.regionsOfDistrict.length > 0) {
                    $scope.regionsOfDistrict.forEach(function (r) {
                        r.Value = parseInt(r.Value);
                    });
                   // $scope.employee.RegionId = $scope.regionsOfDistrict[0].Value;
                    $scope.employee.RegionId = $scope.filters.locationObject[1].Value;
                    $scope.getBranchesOfRegion($scope.employee.RegionId);
                } else {
                    $scope.regionsOfDistrict = null;
                    $scope.branchesOfRegion = null;
                    return;
                }
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
           
        }

        $scope.getBranchesOfRegion = function (regionId) {
            $("#loadingImage").css("display", "block");
            $scope.employee.BranchId = null;
            $scope.branchesOfRegion = null;
            console.log(regionId);
            if (!regionId) return;
            employeeFilterService.getBranchesOfRegion(regionId).then(function(response) {
                $scope.branchesOfRegion = response.data;
                if ($scope.branchesOfRegion.length > 0) {
                    $scope.branchesOfRegion.forEach(function (b) {
                        b.Value = parseInt(b.Value);
                    });
                    $scope.employee.JoiningBranchId = $scope.filters.locationObject[0].Value;
                }
                   
                else
                    $scope.branchesOfRegion = null;
                $("#loadingImage").css("display", "none");
            }, AMMS.handleServiceError);
        }
        $scope.getBranchesOfRegionCurrent = function (regionId) {
            $("#loadingImage").css("display", "block");
            $scope.employee.CBranchId = null;
            $scope.branchesOfRegionCurrent = null;
            console.log(regionId);
            if (!regionId) return;
            employeeFilterService.getBranchesOfRegion(regionId).then(function(response) {
                $scope.branchesOfRegionCurrent = response.data;
                if ($scope.branchesOfRegionCurrent.length > 0)
                    $scope.employee.CBranchId = $scope.branchesOfRegionCurrent[0].Value;
                else
                    $scope.branchesOfRegionCurrent = null;
            }, AMMS.handleServiceError);
            $("#loadingImage").css("display", "none");
        }
        $scope.getDesignationsByGradeId = function (gradeId) {
           
            if (gradeId != null) {
                $("#loadingImage").css("display", "block");
                employeeFilterService.getDesignationsByGradeId(gradeId).then(function(response) {
                    $scope.designationOfGrade = response.data;
                    if ($scope.designationOfGrade.length > 1) $scope.employee.JoiningDesignation = $scope.designationOfGrade[1].Value;
                    $("#loadingImage").css("display", "none");
                }, AMMS.handleServiceError);
            }
        }
        $scope.getDesignationsByGradeIdCurrent = function(gradeId) {
            if (gradeId != null) {
                $("#loadingImage").css("display", "block");
                employeeFilterService.getDesignationsByGradeId(gradeId).then(function(response) {
                    $scope.designationOfGradeCurrent = response.data;
                    if ($scope.designationOfGrade.length > 1) $scope.employee.DesignationId = $scope.designationOfGrade[1].Value;
                    $("#loadingImage").css("display", "none");
                }, AMMS.handleServiceError);
            }
        }


        $scope.sameAddressToggledWatch=function ()
        {
            if ($scope.sameAddress === 'YES') {
                //$scope.sameadd = true;
                $scope.makePresentAddressNull();
                $scope.employee.PresentVillage = $scope.employee.PermanentVillage;
                $scope.employee.PresentPostOffice = $scope.employee.PermanentPostOffice;
                $scope.employee.PresentPostCode = $scope.employee.PermanentPostCode;
                $scope.employee.PresentGovtDistrict = $scope.employee.PermanentGovtDistrict;
                employeeFilterService.getThanasOfDistrict($scope.employee.PresentGovtDistrict).then(function (response) {
                    $scope.thanasOfPresentAdministrativeDistrict = response.data;
                    $scope.employee.PresentThanaId = $scope.employee.PermanentThanaId;
                });
                // $scope.getThanas($scope.employee.PresentGovtDistrict, 'present');
                $scope.employee.PresentVillageInBangla = $scope.employee.PermanentVillageInBangla;
                $scope.employee.PresentPostOfficeInBangla = $scope.employee.PermanentPostOfficeInBangla;
                
                //$scope.employee.ResidencePhoneNo = $scope.employee.WorkPhoneNo;
            }
        }

        $scope.sameAddressToggle = function() {
            if ($scope.sameAddress === 'YES') {
                $scope.sameadd = true;
                $scope.makePresentAddressNull();
                $scope.employee.PresentVillage = $scope.employee.PermanentVillage;
                $scope.employee.PresentPostOffice = $scope.employee.PermanentPostOffice;
                $scope.employee.PresentPostCode = $scope.employee.PermanentPostCode;
                $scope.employee.PresentGovtDistrict = $scope.employee.PermanentGovtDistrict;
                employeeFilterService.getThanasOfDistrict($scope.employee.PresentGovtDistrict).then(function(response) {
                    $scope.thanasOfPresentAdministrativeDistrict = response.data;

                    $scope.employee.PresentThanaId = $scope.employee.PermanentThanaId;
                });
                // $scope.getThanas($scope.employee.PresentGovtDistrict, 'present');
                $scope.employee.PresentVillageInBangla = $scope.employee.PermanentVillageInBangla;
                $scope.employee.PresentPostOfficeInBangla = $scope.employee.PermanentPostOfficeInBangla;
                
                $scope.employee.ResidencePhoneNo = $scope.employee.WorkPhoneNo;
            } else {
                $scope.sameadd = false;
                $scope.makePresentAddressNull();
            }
        }
        $scope.makePresentAddressNull = function() {
            $scope.employee.PresentVillage = null;
            $scope.employee.PresentPostOffice = null;
            $scope.employee.PresentPostCode = null;
            $scope.employee.PresentGovtDistrict = null;
            $scope.employee.PresentVillageInBangla = null;
            $scope.employee.PresentPostOfficeInBangla = null;
            $scope.employee.PresentThanaId = null;
            $scope.employee.ResidencePhoneNo = null;
        }


//new mod 
        $scope.employeeAgeValidator = function(age) {
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
        $scope.getDateFromAge = function(age) {
            if (age != undefined && age.toString().length >= 2) {
                if (age < 18) {
                    $scope.employee.Age = 18;
                }
                if (!$scope.employee.DateOfBirth) {
                    var now = new Date();
                    $scope.employee.DateOfBirth = $scope.getDateStrFromAge(now, $scope.employee.Age);
                } else {
                    var birthDate = new Date($scope.employee.DateOfBirth);
                    $scope.employee.DateOfBirth = $scope.getDateStrFromAge(birthDate, $scope.employee.Age);

                }
            }
        }
        $scope.getDateStrFromAge = function(date, age) {
            return new Date(date.setFullYear(new Date().getFullYear() - age));
        }

        $scope.removeProfilePicture = function() {
            $scope.employeePhoto = null;
            $scope.employeeImage = null;
            $('#employeePhoto').attr('src', '');
            $("#employeePhotoFile").val("");
        }

        $scope.addQualification = function() {
            $scope.employee.AcademicQualification.push({
                Restype: 1,
                UniversityNameOrOthers: [],
                exams:[]
            });
        }

        $scope.aqvalidator = function () {
            var invalid = false;
            $scope.employee.AcademicQualification.forEach(function (aq) {
                if (aq.Restype===1) {
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

        $scope.setDepartment=function() {
            if ($scope.employee.JoiningOfficeType!==3) {
                $scope.employee.DepartmentId = 5;
            }
        }

        $scope.clearAQModelData=function(index) {
            $scope.employee.AcademicQualification[index].Class = null;
            $scope.employee.AcademicQualification[index].Grade = null;
            $scope.employee.AcademicQualification[index].CgpaScale = null;
            $scope.employee.AcademicQualification[index].Cgpa = null;
        }

        $scope.removeAQualificaiton = function(index) {
            $scope.employee.AcademicQualification.splice(index, 1);
        }
        $scope.addPQualification = function() {
            $scope.employee.ProfessionalQualification.push({
                //Certification: '',
                //Institute:'',
                //Location: ''
                sdopened: false,
                edopened:false

        });
        }

        
        

        

        $scope.removePQualificaiton = function(index) {
            $scope.employee.ProfessionalQualification.splice(index, 1);
            
        }
        $scope.addTraining = function() {
            $scope.employee.Training.push({
                //TrainingTitle: '',
                //TopicsCovered: '',
                //InstituteName: '',
                //Country: '',
                //Location: '',
                //Duration: ''
            
            });
        }
        $scope.removeTraining = function(index) {
            $scope.employee.Training.splice(index, 1);
        }

        $scope.addExperience = function() {
            $scope.employee.Experience.push({
                sdopened: false,
                edopened: false

            });
        }
        $scope.removeExperience = function(index) {
            $scope.employee.Experience.splice(index, 1);
        }

        $scope.getAge = function() {
            var today = new Date();
            var birthDate = new Date($scope.employee.DateOfBirth);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && moment(today.getDate()).format("dd") !== moment(birthDate.getDate()).format("dd") && today.getDate() < birthDate.getDate())) {
                age--;
            }
            $scope.employee.Age = age;
        }

        $scope.nidNullifier = function () {
            if ($scope.employee.Nationality!==1) {
                $scope.employee.NationalId = null;
            }
        }


        $scope.$watch('employee.DateOfBirth', function() {
            $scope.getAge();
        });
        $scope.clearImageFiles = function() {
            $scope.employeeImage = null;
            $scope.employeePhoto = null;
            $('#employeePhoto').attr('src', '');
            $("#employeePhotoFile").val("");
        }
        $scope.removeImagesFromFiles = function() {
            $scope.files = $scope.files.filter(f => f.Category !== $rootScope.FileCategory.PROFILE_PHOTO);
        }


        $scope.imageUpload = function(event) {
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
        $scope.imageIsLoaded = function(e) {
            $scope.$apply(function() {
                $scope.employeeImage = e.target.result;
            });
        }
        $scope.getYearFilterData = function() {
            $scope.filters.PassingYear = [];
            for (var i = 1950; i <= new Date($rootScope.workingdate).getFullYear(); i++) {
                $scope.filters.PassingYear.push({
                    Name: i.toString(),
                    //Value: i - 1950 + 1,
                    Value: i,
                    DependencyValue: -1
                });
            }
        }
        $scope.getfilteredSubStatus = function() {
            $scope.filteredSubStatus = $scope.filters.SubStatus.filter(s => s.DependencyValue === $scope.employee.Status);
        }

        $scope.formatAllDates = function() {
            if ($scope.employee.DateOfBirth !== null && $scope.employee.DateOfBirth !== undefined) $scope.employee.DateOfBirth = moment($scope.employee.DateOfBirth).format();
            if ($scope.employee.AppLetterDate !== null && $scope.employee.AppLetterDate !== undefined) $scope.employee.AppLetterDate = moment($scope.employee.AppLetterDate).format();
            if ($scope.employee.JoiningLetterDate !== null && $scope.employee.JoiningLetterDate !== undefined) $scope.employee.JoiningLetterDate = moment($scope.employee.JoiningLetterDate).format();
            if ($scope.employee.JoiningDate !== null && $scope.employee.JoiningDate !== undefined) $scope.employee.JoiningDate = moment($scope.employee.JoiningDate).format();
            if ($scope.employee.CurrentBranchJoiningDate !== null && $scope.employee.CurrentBranchJoiningDate !== undefined) $scope.employee.CurrentBranchJoiningDate = moment($scope.employee.CurrentBranchJoiningDate).format();
            if ($scope.employee.ReleaseDate !== null && $scope.employee.ReleaseDate !== undefined) $scope.employee.ReleaseDate = moment($scope.employee.ReleaseDate).format();
            if ($scope.employee.PermanentDate !== null && $scope.employee.PermanentDate !== undefined) $scope.employee.PermanentDate = moment($scope.employee.PermanentDate).format();
            if ($scope.employee.PermanentLetterDate !== null && $scope.employee.PermanentLetterDate !== undefined) $scope.employee.PermanentLetterDate = moment($scope.employee.PermanentLetterDate).format();
            if ($scope.employee.ProfessionalQualification.length > 0) {

            }
            if ($scope.employee.ProfessionalQualification.length > 0) {
                $scope.employee.ProfessionalQualification.forEach(function(pq) {
                    pq.StartDate = moment(pq.StartDate).format();
                    pq.EndDate = moment(pq.EndDate).format();
                });
            }
            if ($scope.employee.Experience.length > 0) {
                $scope.employee.Experience.forEach(function(ex) {
                    ex.StartDate = moment(ex.StartDate).format();
                    ex.EndDate = moment(ex.EndDate).format();
                });
            }
        }
        $scope.getServerDateTime = function($date) {
            commonService.getServerDateTime().then(function(response) {
                $scope.serverDateTimeToday = response.data;
                // $scope.product.StartDate = moment(angular.copy($scope.serverDateTimeToday)).format();
                // $scope.interestRate.StartDate = moment(angular.copy($scope.serverDateTimeToday)).format();
                //$scope.startDateRender($date);
            });
        }

        $scope.beforeJoiningDateRender = function($dates) {
            //$scope.employee.JoiningDate = moment().format();
            if (($scope.employee.CurrentBranchJoiningDate !== undefined && $scope.employee.CurrentBranchJoiningDate !== null)
                && ($scope.employee.JoiningDate !== undefined && $scope.employee.JoiningDate !== null)
                && ($scope.employee.JoiningDate > $scope.employee.CurrentBranchJoiningDate)) {
                swal('Joining Date can not be greater than Current branch joining date! ');
                $scope.employee.JoiningDate = null;
                return;
            }

        }
        $scope.beforeCurrentJoiningDateRender = function($dates) {
            //$scope.employee.JoiningDate = moment().format();
            if (($scope.employee.CurrentBranchJoiningDate !== undefined && $scope.employee.CurrentBranchJoiningDate !== null)
                && ($scope.employee.JoiningDate !== undefined && $scope.employee.JoiningDate !== null)
                && ($scope.employee.JoiningDate > $scope.employee.CurrentBranchJoiningDate)) {
                swal('Current branch Joining Date can not be less than joining date! ');
                $scope.employee.CurrentBranchJoiningDate = null;
                return;
            }

        }
        //$scope.requiredNullDateChecker=function() {
        //    if ($scope.employee.ProfessionalQualification.length > 0) {
        //        $scope.employee.ProfessionalQualification.forEach(function(pq) {
        //            if (pq.StartDate === null || pq.StartDate === undefined) {
        //                swal('please define professional qualification start date!');
        //                return;
        //            }
        //            if (pq.EndDate === null || pq.EndDate === undefined) {
        //                swal('please define professional qualification end date!');
        //                return;
        //            }
        //        });
        //    }
        //    if ($scope.employee.Experience.length > 0) {
        //        $scope.employee.Experience.forEach(function (ex) {
        //            if (ex.StartDate === null || ex.StartDate === undefined) {
        //                swal('please define Experience start date!');
        //                return;
        //            }
        //            if (ex.EndDate === null || ex.EndDate === undefined) {
        //                swal('please define Experience end date!');
        //                return;
        //            }
        //        });
        //    }
        //    if ($scope.employee.AppLetterDate === null || $scope.employee.AppLetterDate === undefined) {
        //        swal('please select appointment letter date!'); return;
        //    }
        //    if ($scope.employee.JoiningDate === null || $scope.employee.JoiningDate === undefined) {
        //        swal('please select joining date!');return; }
        //    if ($scope.employee.CurrentBranchJoiningDate === null || $scope.employee.CurrentBranchJoiningDate === undefined) {
        //        swal('please select current branch joining date!'); return;
        //    }
        //    if ($scope.employee.Status === 2 && ($scope.employee.AppLetterDate === null || $scope.employee.AppLetterDate === undefined)) {
        //        swal('please select release date!'); return;
        //    }

        //}
        $scope.requiredNullDateChecker = function() {
            var invalid = false;
            if ($scope.employee.ProfessionalQualification.length > 0) {
                $scope.employee.ProfessionalQualification.forEach(function(pq) {
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

            if ($scope.employee.Experience.length > 0) {
                $scope.employee.Experience.forEach(function(ex) {
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

            if ($scope.employee.AppLetterDate === null || $scope.employee.AppLetterDate === undefined) {
                swal('please select appointment letter date!');
                invalid = true;
                return invalid;;
            }
            if ($scope.employee.JoiningDate === null || $scope.employee.JoiningDate === undefined) {
                swal('please select joining date!');
                invalid = true;
                return invalid;;
            }
            if ($scope.employee.CurrentBranchJoiningDate === null || $scope.employee.CurrentBranchJoiningDate === undefined) {
                swal('please select current branch joining date!');
                invalid = true;
                return invalid;;
            }
            if ($scope.employee.Status === 2 && ($scope.employee.AppLetterDate === null || $scope.employee.AppLetterDate === undefined)) {
                swal('please select release date!');
                invalid = true;
                return invalid;;
            }
            return invalid;

        }


        $scope.clearModelData = function() {
            $scope.employee = {};
            $scope.employee.AcademicQualification = [];
            $scope.employee.ProfessionalQualification = [];
            $scope.employee.Training = [];
            $scope.employee.Experience = [];
            $scope.addEmployeeFilterData();
        }

        $scope.clearAndCloseTab = function() {
            $scope.employee = {};
            $timeout(function() {
                $('#saveComplete').modal('hide');
                $('.modal-backdrop').remove();
            }, 500);
            $scope.execRemoveTab($scope.tab);
        };


        $scope.checkExamOrder = function(index) {
            if (index > 0) {
                if ($scope.filters.EducationLevel.filter(et => et.Value === $scope.employee.AcademicQualification[index - 1].ExamType)[0].DependencyValue <= $scope.filters.EducationLevel.filter(et => et.Value === $scope.employee.AcademicQualification[index].ExamType)[0].DependencyValue) {
                    swal('please select Exam type In descending order!');
                    $scope.employee.AcademicQualification[index].ExamType = null;
                    return;
                }
            }
        }
        $scope.setExamNames = function (index) {
            //$scope.employee.AcademicQualification[index].ExamTitle = $scope.employee.AcademicQualification[index].ExamType;
            $scope.employee.AcademicQualification[index].exams = $scope.filters.ExamName.filter(x=>x.DependencyValue === $scope.employee.AcademicQualification[index].ExamType);
        }
        $scope.checkCGConsistancy = function(index) {
            if ($scope.employee.AcademicQualification[index].CgpaScale !== undefined && $scope.employee.AcademicQualification[index].CgpaScale !== null
                && $scope.employee.AcademicQualification[index].Cgpa !== undefined && $scope.employee.AcademicQualification[index].Cgpa !== null) {
                var cgscalevalue = parseInt($scope.filters.CGScale.filter(cg => cg.Value === $scope.employee.AcademicQualification[index].CgpaScale)[0].Name);
                if (cgscalevalue < $scope.employee.AcademicQualification[index].Cgpa) {
                    swal('cgpa can not be greater than cgpa scale!');
                    $scope.employee.AcademicQualification[index].Cgpa = null;
                    return;
                }
            }
        }
        $scope.cgpavalidator = function(index) {
            if ($scope.employee.AcademicQualification[index].Cgpa > 5 || $scope.employee.AcademicQualification[index].Cgpa<1) {
                swal('invalid cgpa!');
                $scope.employee.AcademicQualification[index].Cgpa = null;
                return;
            }
         // $scope.employee.AcademicQualification[index].Cgpa = parseFloat(Math.round($scope.employee.AcademicQualification[index].Cgpa * 100) / 100).toFixed(2);
        }

        $scope.cgformatter=function(index) {
           // $scope.employee.AcademicQualification[index].Cgpa = parseInt($scope.employee.AcademicQualification[index].Cgpa.toFixed(2));
        }

        $scope.setInstitutionList = function (index) {
            if ($scope.employee.AcademicQualification[index].ExamType > 3) {
                $scope.employee.AcademicQualification[index].Institution = null;
                $scope.employee.AcademicQualification[index].UniversityNameOrOthers = [];
                 $scope. employee.AcademicQualification[index].UniversityNameOrOthers = $scope.filters.UniversityName;
            } else {
                $scope.employee.AcademicQualification[index].UniversityNameOrOthers = [];
                $scope.employee.AcademicQualification[index].Institution = null;
                $scope.employee.AcademicQualification[index].UniversityNameOrOthers.push({
                    Name: 'Others',
                    Value:99
                });
            }
        }

        $scope.validatePassingYear = function(index) {
            if ($scope.employee.DateOfBirth !== undefined && $scope.employee.DateOfBirth !== null && $scope.employee.AcademicQualification[index].PassingYear < new Date($scope.employee.DateOfBirth).getFullYear()) {
                swal('exam passing year can not be less than date of birth year!');
                $scope.employee.AcademicQualification[index].PassingYear = null;
                return;
            }

            if ($scope.employee.AcademicQualification.length > 1 ) {
                if ($scope.employee.AcademicQualification[index - 1].PassingYear === undefined) {
                    swal("please select previous row's passing year first!");
                    $scope.employee.AcademicQualification[index].PassingYear = undefined;
                    return;
                }
                if ($scope.employee.AcademicQualification[index].PassingYear > $scope.employee.AcademicQualification[index - 1].PassingYear) {
                    swal('Invalid passing year!');
                    $scope.employee.AcademicQualification[index].PassingYear = null;
                    return;
                }
            }
        }

       // $scope.getFilterdExamName
    


        //upload document
        $scope.removefile = function (file, files, propertyName) {
            var value = file.name;
            var i = AMMS.findWithAttr(files, propertyName, value);
            files.splice(i, 1);
            $scope.docSizeBoolChecker();
        }





        //new date picker 
        $scope.today = function () {
            $scope.employee.DateOfBirth = new Date($rootScope.workingdate);
            $scope.employee.JoiningDate = new Date($rootScope.workingdate);
            $scope.employee.CurrentBranchJoiningDate = new Date($rootScope.workingdate);
            $scope.employee.AppLetterDate = new Date($rootScope.workingdate);
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
            $scope.employee.ProfessionalQualification[index].sdopened = true;
        }
        $scope.openPQEDpop = function (index) {
            $scope.employee.ProfessionalQualification[index].edopened = true;
        }
        $scope.openEXSDpop = function (index) {
            $scope.employee.Experience[index].sdopened = true;
        }
        $scope.openEXEDpop = function (index) {
            $scope.employee.Experience[index].edopened = true;
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