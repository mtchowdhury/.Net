
ammsAng.controller('memberEditController', ['$scope', '$rootScope', 'memberService', 'transferService', 'filterService', 'validatorService', 'documentService', 'memberDailyTransactionService', 'loanGroupService',
    function ($scope, $rootScope, memberService, transferService, filterService, validatorService, documentService, memberDailyTransactionService, loanGroupService) {
        $scope.editMember = {};
        $scope.filters = {};
        $scope.uploadedFiles = [];
        $scope.files = [];
        $scope.memberId = '';
        $scope.test = 'testing';
        $scope.branchHolidayAndOffDay = null;
        $scope.roleId = $rootScope.user.Role;
        $scope.member = {};
        $scope.entityId = '';
        $scope.Relatives = [];
        console.log($scope.selectedMenu);
        $scope.memberGroup = [];
        $scope.memberImage = null;
        $scope.memberPhoto = {};
        $scope.memberSignature = {};
        $scope.member.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
        $scope.meetingDayList = null;
        //   $scope.nickNameRegex = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./1-9]*$/;
        $scope.nickNameRegex = /^[^']*$/;

        $scope.$on('tab-switched', function () {
            if (true) {
                $scope.getMemberInfo();
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
        $scope.updateMember = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            console.log($scope.editMember.AdmissionDate);
            if (!$scope.editMember.AdmissionDate) {
                swal("Please select valid admission date");
                return;
            }
            if (!$scope.editMember.NID) {
                if (!$scope.editMember.BirthRegistrationNumber) {
                    swal("When member NID is blank then birth registration number can't be blank");
                    return;
                }
            }
            if (!$scope.editMember.BirthRegistrationNumber) {
                if (!$scope.editMember.NID) {
                    swal("When member birth registration number is blank then NID can't be blank");
                    return;
                }
            }
            if (($scope.editMember.NID != undefined && $scope.editMember.NID != null) && !($scope.editMember.NID.toString().length == 10 || $scope.editMember.NID.toString().length == 13 || $scope.editMember.NID.toString().length == 17)) {
                swal("Invalid NID!");
                return;
            }

            if ($scope.docError) {
                swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');

                return;
            }

            transferService.IsMemberInTransferTransitState($scope.memberId, $rootScope.selectedBranchId).then(function (response) {
                if (response.data) {
                    swal("The Member is in Transfer Transit State");
                    return;
                }
                memberService.memberNIDExistingValidation($scope.editMember.Id, $scope.editMember.NID).then(function (response) {
                    $scope.duplicateNIDMember = angular.copy(response.data);
                    if ($scope.duplicateNIDMember) {
                        swal({
                            title: "NID is duplicated with member " + $scope.duplicateNIDMember.NickName,
                            text: "Are you sure to add with this NID?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, Add it!",
                            cancelButtonText: "No, cancel please!",
                            closeOnConfirm: false,
                            closeOnCancel: true
                        },
     function (isConfirm) {
         if (isConfirm) {
             $scope.editMember.Relatives = angular.copy($scope.Relatives);
             $scope.editMember.AdmissionDate = $rootScope.toServerSideDate(new Date($scope.editMember.AdmissionDate));
             $scope.editMember.DateOfBirth = $rootScope.toServerSideDate(new Date($scope.editMember.DateOfBirth));
             // $scope.editMember.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
             $scope.editMember.BranchWorkingDate = $rootScope.toServerSideDate(new Date($rootScope.workingdate));
             $scope.editMember.CurrentProgramOfficer = $scope.selectedMenu.ProgramOfficerId;
             $scope.editMember.CurrentBranchId = $scope.selectedBranchId;

             if ($scope.editMember.ClosingDate != null)
                 $scope.editMember.ClosingDate = $rootScope.toServerSideDate(new Date($scope.editMember.ClosingDate));

             $scope.files.forEach(function (file) {
                 file.Category = $rootScope.FileCategory.GENERAL;
             });
             if ($scope.memberPhoto.size != undefined) {
                 $scope.files.push($scope.memberPhoto);

             }
             if ($scope.memberSignature.size != undefined) {
                 $scope.files.push($scope.memberSignature);

             }
             $scope.detectFeeChange();


             memberService.updateMember($scope.editMember).then(function (response) {
                 if (response.data.Success) {
                     if (response.data.Entity.Id && $scope.files.length > 0) {
                         documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.Member, $rootScope.user.UserId, $scope.memberPhoto.name, $scope.memberSignature.name)
                             .then(function (res) {
                                 if (res.data.Success) {
                                     $rootScope.$broadcast('member-edit-finished');
                                     if ($scope.proPictureFile !== undefined && $scope.memberPhoto.size != undefined) documentService.deleteDocument($scope.proPictureFile.Id);
                                     if ($scope.signPictureFile !== undefined && $scope.memberSignature.size != undefined) documentService.deleteDocument($scope.signPictureFile.Id);
                                     $scope.removeLocalFile($rootScope.memberFileHash);
                                     swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.member), "success");
                                     $scope.clearAndCloseTab();
                                 } else {
                                     swal($rootScope.docAddError, res.data.Message, "error");
                                 }
                             }, AMMS.handleServiceError);
                     } else {
                         $rootScope.$broadcast('member-edit-finished');
                         $scope.removeLocalFile($rootScope.memberFileHash);
                         swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.member), 'Successful', "success");
                         $scope.clearAndCloseTab();
                     }


                 } else {
                     swal($rootScope.showMessage($rootScope.editError, $rootScope.member), response.data.Message, "error");
                     $scope.editMember.MemberFees = angular.copy($scope.oldMemberFees);
                 }
             }, AMMS.handleServiceError);

         } else {
             return;
         }
     });
                    } else {
                        swal({
                            title: 'Confirm',
                            text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.member),
                            type: "info",
                            showCancelButton: true,
                            closeOnConfirm: false,
                            showLoaderOnConfirm: true
                        },
                    function (isConfirm) {
                        if (isConfirm) {
                            $scope.editMember.Relatives = angular.copy($scope.Relatives);
                            $scope.editMember.AdmissionDate = $rootScope.toServerSideDate(new Date($scope.editMember.AdmissionDate));
                            $scope.editMember.DateOfBirth = $rootScope.toServerSideDate(new Date($scope.editMember.DateOfBirth));
                            // $scope.editMember.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                            $scope.editMember.BranchWorkingDate = $rootScope.toServerSideDate(new Date($rootScope.workingdate));
                            $scope.editMember.CurrentProgramOfficer = $scope.selectedMenu.ProgramOfficerId;
                            $scope.editMember.CurrentBranchId = $scope.selectedBranchId;

                            if ($scope.editMember.ClosingDate != null)
                                $scope.editMember.ClosingDate = $rootScope.toServerSideDate(new Date($scope.editMember.ClosingDate));

                            $scope.files.forEach(function (file) {
                                file.Category = $rootScope.FileCategory.GENERAL;
                            });
                            if ($scope.memberPhoto.size != undefined) {
                                $scope.files.push($scope.memberPhoto);

                            }
                            if ($scope.memberSignature.size != undefined) {
                                $scope.files.push($scope.memberSignature);

                            }
                            $scope.detectFeeChange();


                            memberService.updateMember($scope.editMember).then(function (response) {
                                if (response.data.Success) {
                                    if (response.data.Entity.Id && $scope.files.length > 0) {
                                        documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.Member, $rootScope.user.UserId, $scope.memberPhoto.name, $scope.memberSignature.name)
                                            .then(function (res) {
                                                if (res.data.Success) {
                                                    $rootScope.$broadcast('member-edit-finished');
                                                    if ($scope.proPictureFile !== undefined && $scope.memberPhoto.size != undefined) documentService.deleteDocument($scope.proPictureFile.Id);
                                                    if ($scope.signPictureFile !== undefined && $scope.memberSignature.size != undefined) documentService.deleteDocument($scope.signPictureFile.Id);
                                                    $scope.removeLocalFile($rootScope.memberFileHash);
                                                    swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.member), "success");
                                                    $scope.clearAndCloseTab();
                                                } else {
                                                    swal($rootScope.docAddError, res.data.Message, "error");
                                                }
                                            }, AMMS.handleServiceError);
                                    } else {
                                        $rootScope.$broadcast('member-edit-finished');
                                        $scope.removeLocalFile($rootScope.memberFileHash);
                                        swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.member), 'Successful', "success");
                                        $scope.clearAndCloseTab();
                                    }


                                } else {
                                    swal($rootScope.showMessage($rootScope.editError, $rootScope.member), response.data.Message, "error");
                                    $scope.editMember.MemberFees = angular.copy($scope.oldMemberFees);
                                }
                            }, AMMS.handleServiceError);
                        }
                    });
                    }
                });
            });
        };

        var init = function () {
            $scope.getGroupMeetingDay();
            $scope.getMemberInfo();
            $scope.editMemberFilterData();
            //  $scope.getMemberFees();
            //$scope.addRelatives();
            $scope.initialDefaultValues();

        }

        $scope.isHolidayOrOffDay = function (d) {
            if ($scope.branchHolidayAndOffDay) {
                $scope.branchHolidayAndOffDay.forEach(function(h) {
                    if (moment(h).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
                        swal('Selected date is holiday or Offday');
                        $scope.member.AdmissionDate = $rootScope.workingdate;
                    }
                });
            }

        }
        $scope.getGroupMeetingDay = function () {
            loanGroupService.getloanGroup($scope.selectedMenu.Id).then(function (res) {
                console.log(res.data);
                $scope.member.MeetingDayId = res.data.MeetingDay.toString();
                $scope.groupMeetingdayStr = res.data.MeetingDayName;
            });
        }
        $scope.getHolidays = function () {
            memberDailyTransactionService.getBranchOffDayAndHolidays($scope.selectedBranchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }
        $scope.beforeDateRender = function ($dates) {
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

        $scope.editMemberFilterData = function () {
            filterService.getAllAdministrativeDistricts().then(function (response) {
                var data = response.data;
                $scope.filters.administrativeDistricts = data;

            }, AMMS.handleServiceError);
            filterService.getAllPrograms().then(function (response) {
                var data = response.data;
                $scope.filters.programList = data;

            }, AMMS.handleServiceError);

            $scope.getOrganizonalFilterData('MaritalStatus', 'maritalStatusList', 'MaritalStatus');
            $scope.getOrganizonalFilterData('Sex', 'sexList', 'Sex');
            $scope.getOrganizonalFilterData('Religion', 'religionList', 'Religion');
            $scope.getOrganizonalFilterData('MemberStatus', 'memberStatusList', 'MemberStatus');
            $scope.getOrganizonalFilterData('Ethnicity', 'ethnicityList', 'Ethnicity');
            $scope.getOrganizonalFilterData('Nationality', 'nationalityList', 'Nationality');
            $scope.getOrganizonalFilterData('ResidenceType', 'residenceTypeList', 'ResidenceType');
            $scope.getOrganizonalFilterData('MemberRelativeRelation', 'memberRelativeRelationList', 'MemberRelativeRelation');
            $scope.getOrganizonalFilterData('MeberRelativeLivingStatus', 'memberRelativeLivingStatusList', 'MemberRelativeRelation');
            $scope.getOrganizonalFilterData('Education', 'memberEducationList', 'Education');
            $scope.getOrganizonalFilterData('Profession', 'memberProfessionList', 'Profession');
            $scope.getOrganizonalFilterData('Handicapped', 'memberHandicappedList', 'Handicapped');
            $scope.getOrganizonalFilterData('PovertyStatus', 'memberPovertyStatusList', 'PovertyStatus');
            $scope.getOrganizonalFilterData('MemberEntryStatus', 'memberEntryStatusList', 'MemberEntryStatus');
            $scope.getOrganizonalFilterData('BadDebtStatus', 'memberBadDebtStatusList', 'BadDebtStatus');
            $scope.getOrganizonalFilterData('MemberSubStatus', 'memberSubStatusList', 'MemberSubStatus');
        }

        $scope.getOrganizonalFilterData = function (type, listToSet) {
            filterService.getOrganizationalFilterDataByType(type)
                .then(function (response) {
                    $scope[listToSet] = response.data;
                    if (type === "Sex") {
                        $scope[listToSet] = response.data.filter(s => s.value != -100000);
                        console.log($scope[listToSet]);
                    }
                }, AMMS.handleServiceError);
        }

        $scope.getMemberInfo = function () {
            var memberId = $rootScope.editMember.Id;
            $scope.editMemberId = angular.copy($rootScope.editMember.Id);
            memberService.getMember(memberId).then(function (response) {
                console.log(response.data);
                $scope.editMember = response.data;
                if ($scope.editMember.ReceiveTransfer) {
                    $scope.editMember.ReceiveTransfer.ReceiveDate = $scope.editMember.ReceiveTransfer.ReceiveDate != null ? moment($scope.editMember.ReceiveTransfer.ReceiveDate).format("YYYY-MM-DD") : "";
                }

                $scope.oldMemberFees = angular.copy($scope.editMember.MemberFees);

                $scope.Relatives = angular.copy($scope.editMember.Relatives);
                $scope.Relatives.forEach(function (relative) {
                    relative.LivingStatus = relative.LivingStatus.toString();
                    relative.Relation = relative.Relation.toString();
                    if (relative.IsGuardian === true) relative.IsGuardian = 1;
                    if (relative.IsGuardian === false) relative.IsGuardian = 0;
                    if (relative.Relation == '1' || relative.Relation == '2' || relative.Relation == '5')
                        relative.Hide = true;
                    else {
                        relative.Hide = false;
                    }
                });

                $scope.editMember.Status = response.data.Status.toString();
                //$scope.editMember.PermanentThanaId = $scope.editMember.PermanentThanaId.toString();
                //$scope.editMember.PresentThanaId = $scope.editMember.PresentThanaId.toString();
                $scope.editMember.ProgramId = $scope.editMember.ProgramId.toString();
                $scope.editMember.MaritalStatus = $scope.editMember.MaritalStatus.toString();
                $scope.editMember.Education = $scope.editMember.Education ? $scope.editMember.Education.toString() : '';
                $scope.editMember.MainProfession = $scope.editMember.MainProfession.toString();
                $scope.editMember.Religion = $scope.editMember.Religion.toString();
                $scope.editMember.Ethnicity = $scope.editMember.Ethnicity.toString();
                $scope.editMember.Handicapped = $scope.editMember.Handicapped.toString();
                $scope.editMember.PovertyStatus = $scope.editMember.PovertyStatus.toString();
                $scope.editMember.BadDebtStatus = $scope.editMember.BadDebtStatus.toString();
                $scope.editMember.MemberSubStatus = $scope.editMember.MemberSubStatus.toString();
                $scope.editMember.MemberEntryStatus = $scope.editMember.MemberEntryStatus.toString();
                if ($scope.editMember.CurrentLoanType === 0) $scope.editMember.CurrentLoanType = undefined;



                $scope.getThanas($scope.editMember.PermanentGovtDistrict, 'permanent', 'true');
                $scope.getThanas($scope.editMember.PresentGovtDistrict, 'present', 'true');
                $scope.getAge();
                $scope.editMember.NID = parseInt($scope.editMember.NID);
                $scope.editMember.BirthRegistrationNumber = parseInt($scope.editMember.BirthRegistrationNumber);


               

                $scope.empOriginalInfo = angular.copy($scope.editMember);
                $scope.editMember.AdmissionDate = new Date($scope.empOriginalInfo.AdmissionDate);
                $scope.editMember.DateOfBirth = new Date($scope.empOriginalInfo.DateOfBirth);
                $scope.memberId = memberId;
                documentService.getFilesbyEntity(memberId, $rootScope.FileUploadEntities.Member).then(function (response) {
                    $scope.uploadedFiles = response.data;
                    $rootScope.memberFileHash = response.data && response.data.length > 0 ? response.data[0].Hash : '';
                    $scope.segregateFile();


                }, AMMS.handleServiceError);

            }, AMMS.handleServiceError);
        }

        $scope.formatDate = function (dateString) {
            var formattedDate = dateString.substring(5, 7) + "/" + dateString.substring(8, 10) + "/" + dateString.substring(0, 4);
            return formattedDate;
        }

        $scope.getThanas = function (districtId, type, onload) {
            if (!districtId) return;
            if (type === 'permanent') {
                $scope.thanasOfPermanentAdministrativeDistrict = null;
                if ($scope.sameAddress == "YES") {
                    $scope.thanasOfPresentAdministrativeDistrict = null;
                    $scope.editMember.PresentGovtDistrict = $scope.editMember.PermanentGovtDistrict;
                }
            }
            else {
                $scope.thanasOfPresentAdministrativeDistrict = null;
            }
            $scope.pthanas = filterService.getThanasOfDistrict(districtId).then(function (response) {
                if (type === 'permanent') {
                    $scope.thanasOfPermanentAdministrativeDistrict = response.data;
                    //if ($scope.thanasOfPermanentAdministrativeDistrict.length > 0 && !onload)
                    //    $scope.editMember.PermanentThanaId = $scope.thanasOfPermanentAdministrativeDistrict[0].Value;
                    if ($scope.sameAddress == "YES") {
                        $scope.thanasOfPresentAdministrativeDistrict = response.data;
                        //if ($scope.thanasOfPresentAdministrativeDistrict.length > 0)
                        //    $scope.editMember.PresentThanaId = $scope.editMember.PermanentThanaId;
                    }
                }
                else {
                    $scope.thanasOfPresentAdministrativeDistrict = response.data;
                    //if ($scope.thanasOfPresentAdministrativeDistrict.length > 0 && !onload)
                    //    $scope.editMember.PresentThanaId = $scope.thanasOfPresentAdministrativeDistrict[0].Value;
                    if ($scope.sameAddress == "YES") {
                        $scope.thanasOfPresentAdministrativeDistrict = $scope.thanasOfPermanentAdministrativeDistrict;
                        //if ($scope.thanasOfPresentAdministrativeDistrict.length > 0)
                        //    $scope.editMember.PresentThanaId = $scope.editMember.PermanentThanaId;
                    }
                }
                $scope.editMember.PermanentThanaId = $scope.editMember.PermanentThanaId.toString();
                $scope.editMember.PresentThanaId = $scope.editMember.PresentThanaId.toString();
            }, AMMS.handleServiceError);
        }


        $scope.memberMobileValidator = function () {
            if ($scope.editMember.MobileNo)
                $scope.editMember.MobileNo = $scope.editMember.MobileNo.replace(/[^0-9]/g, '');
            return validatorService.MobileValidator($scope.editMember.MobileNo);
        }

        $scope.memberPhoneNoValidator = function () {
            if ($scope.editMember.AlternateMobileNo)
                $scope.editMember.AlternateMobileNo = $scope.editMember.AlternateMobileNo.replace(/[^0-9]/g, '');
            return validatorService.PhoneNoValidator($scope.editMember.AlternateMobileNo);
        }

        $scope.memberNIDValidator = function (nid) {
            if (!nid) return true;
            return validatorService.NIDValidator(nid);
        }

        //$scope.memberAgeValidator = function (age) {
        //    if (age != undefined || age != null) {
        //        if (age.toString().length >= 1) {
        //            if (age < 18 || age > 70) {
        //                return "Member age should be between 18 and 70";
        //            }
        //        } else {
        //            return "Member age should be between 18 and 70";
        //        }
        //    } else {
        //        return "Member age should be between 18 and 70";
        //    }
        //    return true;
        //}
        $scope.memberAgeValidator = function (age) {
            if (age != undefined || age != null) {
                if (age.toString().length >= 1) {
                    if (age < 18) {
                        return "Member age should be minimum 18";
                    }
                } else {
                    return "Member age should be minimum 18";
                }
            } else {
                return "Member age should be minimum 18";
            }
            return true;
        }

        $scope.getAge = function () {
            var today = new Date();
            var birthDate = new Date($scope.editMember.DateOfBirth);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && moment(today.getDate()).format("dd") !== moment(birthDate.getDate()).format("dd") && today.getDate() < birthDate.getDate())) {
                age--;
            }
            $scope.editMember.Age = age;
        }

        $scope.$watch('editMember.DateOfBirth', function () {
            $scope.getAge();
        });

        $scope.getDateFromAge = function (age) {
            if (age != undefined && age.toString().length >= 2) {
                if (age < 18) {
                    $scope.editMember.Age = 18;
                }
                if (!$scope.editMember.DateOfBirth) {
                    var now = new Date();
                    $scope.editMember.DateOfBirth = memberService.getDateStrFromAge(now, $scope.editMember.Age);
                } else {
                    var birthDate = new Date($scope.editMember.DateOfBirth);
                    $scope.editMember.DateOfBirth = memberService.getDateStrFromAge(birthDate, $scope.editMember.Age);

                }
            }

        }

        $scope.sameAddressToggle = function () {
            if ($scope.sameAddress === 'YES') {
                $scope.makePresentAddressNull();
                $scope.editMember.PresentVillage = $scope.editMember.PermanentVillage;
                $scope.editMember.PresentPostOffice = $scope.editMember.PermanentPostOffice;
                $scope.editMember.PresentPostCode = $scope.editMember.PermanentPostCode;
                $scope.editMember.PresentGovtDistrict = $scope.editMember.PermanentGovtDistrict;
                $scope.editMember.PresentThanaId = $scope.editMember.PermanentThanaId;
                $scope.thanasOfPresentAdministrativeDistrict = $scope.thanasOfPermanentAdministrativeDistrict;
                $scope.editMember.PresentVillageInBangla = $scope.editMember.PermanentVillageInBangla;
                $scope.editMember.PresentPostOfficeInBangla = $scope.editMember.PermanentPostOfficeInBangla;
                $scope.editMember.PresentThanaId = $scope.editMember.PermanentThanaId;
                $scope.editMember.ResidencePhoneNo = $scope.editMember.WorkPhoneNo;
                $scope.editMember.PresentHouse = $scope.editMember.PermanentHouse;
                $scope.editMember.PresentRoad = $scope.editMember.PermanentRoad;
                $scope.editMember.PresentUnion = $scope.editMember.PermanentUnion;
            } else {
                $scope.makePresentAddressNull();
            }
        }

        $scope.sameAddressToggleWatch = function () {
            if ($scope.sameAddress === 'YES') {
                $scope.makePresentAddressNull();
                $scope.editMember.PresentGovtDistrict = $scope.editMember.PermanentGovtDistrict;

                filterService.getThanasOfDistrict($scope.editMember.PresentGovtDistrict).then(function (response) {
                    $scope.thanasOfPresentAdministrativeDistrict = response.data;
                    if ($scope.thanasOfPresentAdministrativeDistrict.length > 0) {
                        $scope.editMember.PresentThanaId = $scope.editMember.PermanentThanaId;
                        $scope.editMember.PresentUnion = $scope.editMember.PermanentUnion;
                        $scope.editMember.PresentPostOffice = $scope.editMember.PermanentPostOffice;
                        $scope.editMember.PresentVillage = $scope.editMember.PermanentVillage;
                        $scope.editMember.PresentHouse = $scope.editMember.PermanentHouse;
                        $scope.editMember.PresentRoad = $scope.editMember.PermanentRoad;
                    }
                });


                //  $scope.getThanas($scope.member.PresentGovtDistrict, 'present');


                $scope.member.PresentThanaId = $scope.member.PermanentThanaId;
                $scope.member.PresentUnion = $scope.member.PermanentUnion;
                $scope.member.PresentPostOffice = $scope.member.PermanentPostOffice;
                $scope.member.PresentVillage = $scope.member.PermanentVillage;
                $scope.member.PresentHouse = $scope.member.PermanentHouse;
                $scope.member.PresentRoad = $scope.member.PermanentRoad;
            }
        }

        $scope.makePresentAddressNull = function () {
            $scope.editMember.PresentVillage = null;
            $scope.editMember.PresentPostOffice = null;
            $scope.editMember.PresentPostCode = null;
            $scope.editMember.PresentGovtDistrict = null;
            $scope.editMember.PresentVillageInBangla = null;
            $scope.editMember.PresentPostOfficeInBangla = null;
            $scope.editMember.PresentThanaId = null;
            $scope.editMember.ResidencePhoneNo = null;
            $scope.editMember.PresentHouse = null;
            $scope.editMember.PresentRoad = null;
            $scope.editMember.PresentUnion = null;
        }

        $scope.clearAndCloseTab = function () {
            $scope.member = {};
            $scope.execRemoveTab($scope.tab);
        };



        $scope.initialDefaultValues = function () {
            
            //$scope.member.AdmissionDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            $scope.memberGroup.push({ value: $scope.selectedMenu.Id, text: $scope.selectedMenu.Name });
            //$scope.member.GroupId = $scope.selectedMenu.Id;
            //$scope.member.Age = 18;
            // $scope.member.DateOfBirth = moment().add(-18, "years").format("YYYY-MM-DD");
        }

        $scope.gurdianCheckOneAllow = function (index) {
            $scope.Relatives.forEach(function (relavite, i) {
                if (index !== i) {
                    relavite.IsGuardian = 0;
                }

            });
            var gurdian = $scope.Relatives.find(g => g.IsGuardian === 1);
            if (gurdian != undefined) {
                $scope.editMember.GuardianName = gurdian.NickName;
                $scope.editMember.GuardianRelation = gurdian.Relation;
            } else {
                $scope.editMember.GuardianName = undefined;
                $scope.editMember.GuardianRelation = undefined;
            }
        }

        $scope.addRelatives = function () {
            var relative = {
                Relation: null,
                NickName: null,
                FullName: null,
                Age: 1,
                NID: null,
                MonthlyIncome: 0,
                LivingStatus: '1',//1 for Together
                IsGurdian: 0,
                Hide: false
            }
            $scope.Relatives.push(relative);
            //console.log($scope.Relatives);
        }
        $scope.maritialStatusChange = function () {
            if ($scope.editMember.MaritalStatus == '1') {//1 for married
                var spouse = $scope.editMember.Relatives.find(r => r.Relation == 5);
                console.log(spouse);
                if (spouse) {
                    spouse.Relation = spouse.Relation.toString();
                    spouse.LivingStatus = spouse.LivingStatus.toString();
                    spouse.Hide = true;
                    $scope.Relatives.push(spouse);
                } else {
                    var relativeSpouse = {
                        Relation: '5',//5 for spouse
                        NickName: "",
                        FullName: null,
                        Age: 1,
                        NID: null,
                        MonthlyIncome: 0,
                        LivingStatus: '1',//1 for Together
                        IsGurdian: 0,
                        Hide: true
                    }
                    $scope.Relatives.push(relativeSpouse);
                }
                
            } else {
                $scope.Relatives = $scope.Relatives.filter(r => r.Relation != '5');
            }
        }
        $scope.relativeRelationChange = function (relative) {
            if (relative.Relation == 1 || relative.Relation == 2 || relative.Relation == 5) {
                relative.Hide = true;
                var relativeIndex = $scope.Relatives.indexOf(relative);
                if (relativeIndex != -1) {
                    if (relative.Relation == 1) {
                        var relativeFather = $scope.Relatives.filter(r => r.Relation == 1);
                        if (relativeFather.length > 1) {
                            $scope.Relatives.splice(relativeIndex, 1);
                        }
                    } else if (relative.Relation == 2) {
                        var relativeMother = $scope.Relatives.filter(r => r.Relation == 2);
                        if (relativeMother.length > 1) {
                            $scope.Relatives.splice(relativeIndex, 1);
                        }
                    } else if (relative.Relation == 5) {
                        if ($scope.editMember.MaritalStatus != 1) {
                            $scope.Relatives = $scope.Relatives.filter(r => r.Relation != 5);
                        }
                        var relativeSpouse = $scope.Relatives.filter(r => r.Relation == 5);
                        if (relativeSpouse.length > 1) {
                            $scope.Relatives.splice(relativeIndex, 1);
                        }
                    }
                }
            } else {
                relative.Hide = false;
            }
        }
        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.memberImage = e.target.result;
            });
        }

        $scope.imageUpload = function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file.type.split('/')[0] != "image") {
                    swal("Only Image is allowed");
                    return;
                }
                if (file.size > (1024 * 100)) {
                    swal("Image size is greater than 100 kb is not allowed");
                    return;
                }
                $scope.memberPhoto = file;
                $scope.memberPhoto.Category = $rootScope.FileCategory.PROFILE_PHOTO;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }

        $scope.signatureUpload = function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file.type.split('/')[0] != "image") {
                    swal("Only Image is allowed");
                    return;
                }
                if (file.size > (1024 * 100)) {
                    swal("Image size is greater than 100 kb is not allowed");
                    return;
                }
                $scope.memberSignature = file;
                $scope.memberSignature.Category = $rootScope.FileCategory.SIGNATURE;
                var reader = new FileReader();
                reader.onload = $scope.signatureIsLoaded;
                reader.readAsDataURL(file);
            }
        }
        $scope.signatureIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.memberSignatureImage = e.target.result;
            });
        }

        $scope.segregateFile = function () {



            $scope.proPictureFile = $scope.uploadedFiles.filter(f => f.Category === $rootScope.FileCategory.PROFILE_PHOTO)[0];
            $scope.signPictureFile = $scope.uploadedFiles.filter(f => f.Category === $rootScope.FileCategory.SIGNATURE)[0];


            if ($scope.proPictureFile !== undefined) {
                $scope.memberImage = $scope.commonDownloadUrl + $scope.proPictureFile.DocumentUrl;
                $scope.removefile($scope.proPictureFile, $scope.uploadedFiles, 'Name');
            }
            if ($scope.signPictureFile !== undefined) {
                $scope.memberSignatureImage = $scope.commonDownloadUrl + $scope.signPictureFile.DocumentUrl;
                $scope.removefile($scope.signPictureFile, $scope.uploadedFiles, 'Name');
            }

            console.log($scope.memberImage);

        }

        $scope.removeRelatives = function (index) {
            if ($scope.Relatives[index].IsGuardian) {
                $scope.editMember.GuardianName = undefined;
                $scope.editMember.GuardianRelation = undefined;
            }
            $scope.Relatives.splice(index, 1);
        }
        $scope.relativeAge = function (age, index) {
            if (age && age.toString().length >= 2) {
                if ((index === 0 || index === 1 || index === 2) && age < 18) {
                    swal("please enter valid age(minimum 18)!");
                    $scope.Relatives[index].Age = 18;
                }
            }
        }
        $scope.nidIsValid = function (nid, type, index) {
            if (type == "m") {
                if (nid !== null && nid.toString().length > 0) {
                    if (!(nid.toString().length === 10 || nid.toString().length === 13 || nid.toString().length === 17)) {
                        $scope.nidInvalidMessage = "NID must be 10 or 13 or 17 characters long";
                    } else {
                        $scope.nidInvalidMessage = "";
                    }
                } else {
                    $scope.nidInvalidMessage = "";
                }
            } else {
                if (nid !== null && nid.toString().length > 0) {
                    if (!(nid.toString().length === 10 || nid.toString().length === 13 || nid.toString().length === 17)) {
                        $("#relativeNIDError" + index).text("NID must be 10 or 13 or 17 characters long");
                    } else {
                        $("#relativeNIDError" + index).text("");
                    }
                } else {
                    $("#relativeNIDError" + index).text("");
                }
            }

        }
        //$scope.getMemberFees = function () {
        //    memberService.getMemberFees().then(function (response) {
        //        $scope.MemberFees = response.data;
        //    });
        //}

        $scope.memberNickNameChange = function (nickName, index) {
            if ($scope.Relatives[index].IsGuardian) {
                $scope.editMember.GuardianName = nickName;
                if (nickName == null || nickName.length <= 0) {
                    $scope.Relatives[index].IsGuardian = false;
                }
            }
        }

        $scope.detectFeeChange = function () {
            $scope.updatedFees = [];
            $scope.editMember.MemberFees.forEach(function (fee) {
                $scope.oldMemberFees.forEach(function (oldFee) {
                    if (fee.FeeId === oldFee.FeeId && fee.IsExempt !== oldFee.IsExempt) {
                        $scope.updatedFees.push(fee);
                    }
                });
            });
            $scope.editMember.MemberFees = angular.copy($scope.updatedFees);
        }
        $scope.removeProfilePicture = function () {
            $scope.memberPhoto = {};
            $scope.memberImage = null;
            $('#memberPhoto').attr('src', '');
            $("#memberPhotoFile").val("");
        }
        $scope.removeSignature = function () {
            $scope.memberSignature = {};
            $scope.memberSignatureImage = null;
            $('#memberSignature').attr('src', '');
            $("#memberSignatureFile").val("");
        }

        $scope.closingDateSetter = function () {
            if ($scope.editMember.Status === '0') {
                $scope.editMember.ClosingDate = moment($rootScope.workingdate).format();
            } else {
                $scope.editMember.ClosingDate = undefined;
            }
        }




        //upload document
        $scope.removefile = function (file, files, propertyName) {
            var value = file.Name;
            var i = AMMS.findWithAttr(files, propertyName, value);
            files.splice(i, 1);
            $scope.docSizeBoolChecker();

        }

        $scope.removefileDB = function (file, pporsign) {
            if (file === undefined) {
                //if (pporsign === 'pp') {
                //    $scope.removeProfilePicture();
                //    swal("Deleted!", "file has been deleted.", "success");
                //    return;
                //} else if (pporsign === 'sign') {
                //    $scope.removeSignature();
                //    swal("Deleted!", "file has been deleted.", "success");
                //    return;
                //}

                if (pporsign === 'pp' && $scope.memberImage !== null) {
                    $scope.removeProfilePicture();
                    return;
                }
                if (pporsign === 'sign' && $scope.memberSignatureImage !== null) {
                    $scope.removeSignature();
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
                                } else if (pporsign === 'sign') {
                                    $scope.removeSignature();
                                    $scope.signPictureFile = undefined;


                                } else {
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
                $scope.docSizeBoolChecker();
            }
        }




        //new datepicker
        $scope.today = function () {
            $scope.editMember.AdmissionDate = new Date($rootScope.workingdate);


        };
       

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($rootScope.workingdate),
            showWeeks: true
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
          return (mode === 'day' && (date.getDay() === 5));
        }
        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            //minDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            startingDay: 1
        };
        $scope.dateOptionsDOB = {
            // dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date($rootScope.workingdate),
            //minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate.getDate() + 1);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.openAdmission = function () {
            $scope.popupAdmission.opened = true;
        };
        $scope.openDOB = function () {
            $scope.popupDOB.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popupAdmission = {
            opened: false
        };
        $scope.popupDOB = {
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
        $scope.admissionValidator = function () {


            if ($scope.editMember.AdmissionDate === undefined || $scope.editMember.AdmissionDate === null) {
                swal("This field is mandatory and can not be cleared!");
                $scope.editMember.AdmissionDate = new Date($scope.empOriginalInfo.AdmissionDate);
                return;
            }


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
            if (moment($scope.editMember.AdmissionDate).valueOf() < moment($scope.editMember.DateOfBirth).valueOf()) {
                swal('please select valid admission date!');
                $scope.editMember.AdmissionDate = new Date($scope.empOriginalInfo.AdmissionDate);
                return;
            }
            if (moment($scope.editMember.AdmissionDate).valueOf() > maxDate || moment($scope.editMember.AdmissionDate).valueOf() < minDate) {
                swal('please select valid date!');
                $scope.editMember.AdmissionDate = new Date($scope.empOriginalInfo.AdmissionDate);
                return;
            }


            if (moment($scope.editMember.AdmissionDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
                swal("unable to select future date!");
                $scope.editMember.AdmissionDate = new Date($scope.empOriginalInfo.AdmissionDate);
                return;
            }

            $scope.isHolidayOrOffDay($scope.editMember.AdmissionDate);
        }
        $scope.dobValidator = function () {
            if (moment($scope.editMember.DateOfBirth) > moment(new Date($scope.branchWorkingDay) + 1)) {
                swal("unable to select future date!");
                $scope.getDateFromAge(18);
                return;
            }

        }

        init();
    }]);