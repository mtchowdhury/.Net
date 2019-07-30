ammsAng.controller('memberAddController', ['$scope', '$rootScope', '$timeout', 'memberService', 'filterService', 'validatorService', 'commonService', 'documentService', 'memberDailyTransactionService', 'loanGroupService',
    function ($scope, $rootScope, $timeout, memberService, filterService, validatorService, commonService, documentService, memberDailyTransactionService, loanGroupService) {
        $scope.member = {};
        $scope.filters = {};
        $scope.files = [];
        $scope.entityId = '';
        $scope.Relatives = [];
        $scope.groupId = $rootScope.groupIdForMemberAdd;
        $scope.groupName = $rootScope.groupNameForMemberAdd;
       // $scope.nickNameRegex = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./1-9]*$/;
        $scope.nickNameRegex = /^[^']*$/;
        //console.log($scope.groupId);

        //console.log($scope.groupName);
        //console.log($scope.selectedMenu.ProgramOfficerId);
        $scope.memberGroup = [];
        $scope.memberImage = null;
        $scope.memberPhoto = null;
        $scope.roleId = $rootScope.user.Role;
        $scope.branchHolidayAndOffDay = null;
        $scope.MemberFees = [];
        $scope.member.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
        $scope.guardianRequiredMessage = "For Gurdian Name select one Relative as Guardian from Relative info";
        $scope.meetingDayList = null;
        $scope.groupMeetingdayStr = "";
        $scope.administrativeDistrictOfTheBranch = null;
        console.log($rootScope.selectedBranchId);

        $scope.getMemberFees = function () {
            memberService.getMemberFees().then(function (response) {
                $scope.MemberFees = [];
                $scope.MemberFees = response.data;
            });
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
                $scope.memberPhoto = file;
                $scope.memberPhoto.Category = $rootScope.FileCategory.PROFILE_PHOTO;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }
        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.memberImage = e.target.result;
            });
        }
        $scope.signatureUpload = function (event) {
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
        $scope.removeProfilePicture = function () {
            $scope.memberPhoto = null;
            $scope.memberImage = null;
            $('#memberPhoto').attr('src', '');
            $("#memberPhotoFile").val("");
        }
        $scope.removeSignature = function () {
            $scope.memberSignature = null;
            $scope.memberSignatureImage = null;
            $('#memberSignature').attr('src', '');
            $("#memberSignatureFile").val("");
        }
        $scope.addRelatives = function () {
            var relative = {
                Relation: null,
                NickName: "",
                FullName: null,
                Age: 1,
                NID: null,
                MonthlyIncome: 0,
                LivingStatus: '1',//1 for Together
                IsGurdian: 0,
                Hide: false,
                disable: false
            }
            $scope.Relatives.push(relative);
        }
        $scope.addRelativesDefault = function () {
            //console.log($scope.memberRelativeLivingStatusList);
            var relativeFather = {
                Relation: '1', //1 for Father
                NickName: "",
                FullName: null,
                Age: 18,
                NID: null,
                MonthlyIncome: 0,
                LivingStatus: '1',//1 for Together
                IsGurdian: 0,
                Hide: true,
                disable: true
            }
            $scope.Relatives.push(relativeFather);
            var relativeMother = {
                Relation: '2',//2 for Mother
                NickName: "",
                FullName: null,
                Age: 18,
                NID: null,
                MonthlyIncome: 0,
                LivingStatus: '1',//1 for Together
                IsGurdian: 0,
                Hide: true,
                disable: true
            }
            $scope.Relatives.push(relativeMother);
            $scope.maritialStatusChange();
        }
        $scope.maritialStatusChange = function () {
            if ($scope.member.MaritalStatus == '1') {//1 for married
                var relativeSpouse = {
                    Relation: '5',//5 for spouse
                    NickName: "",
                    FullName: null,
                    Age: 18,
                    NID: null,
                    MonthlyIncome: 0,
                    LivingStatus: '1',//1 for Together
                    IsGurdian: 0,
                    Hide: true,
                    disable: true
                }
                $scope.Relatives.push(relativeSpouse);

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
                        if ($scope.member.MaritalStatus != 1) {
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
        $scope.relativeAge = function (age, index) {
            if (age && age.toString().length >= 2) {
                if ((index === 0 || index === 1 || index === 2) && age < 18) {
                    swal("please enter valid age(minimum 18)!");
                    $scope.Relatives[index].Age = 18;
                }
            }
        }
        $scope.removeRelatives = function (index) {
            if ($scope.Relatives[index].IsGuardian) {
                $scope.member.GuardianName = undefined;
                $scope.member.GuardianRelation = undefined;
            }
            $scope.Relatives.splice(index, 1);
        }
        $scope.memberNickNameChange = function (nickName, index) {
            if ($scope.Relatives[index].IsGuardian) {
                $scope.member.GuardianName = nickName;
                if (nickName == null || nickName.length <= 0) {
                    $scope.Relatives[index].IsGuardian = false;
                }
            }
        }
        $scope.gurdianCheckOneAllow = function (index) {
            if ($scope.Relatives[index].NickName == null || $scope.Relatives[index].NickName.length <= 0) {
                swal("Please select Relative nick name first");
                $scope.Relatives[index].IsGuardian = 0;
                return;
            }
            $scope.Relatives.forEach(function (relavite, i) {
                if (index !== i) {
                    relavite.IsGuardian = 0;
                }
            });
            var gurdian = $scope.Relatives.find(g => g.IsGuardian === 1);
            if (gurdian != undefined) {
                $scope.member.GuardianName = gurdian.NickName;
                $scope.member.GuardianRelation = gurdian.Relation;
                $scope.guardianRequiredMessage = "";
            } else {
                $scope.member.GuardianName = undefined;
                $scope.member.GuardianRelation = undefined;
                $scope.guardianRequiredMessage = "For Gurdian Name select one Relative as Guardian from Relative info";
            }
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
        $scope.isHolidayOrOffDay = function (d) {
            $scope.branchHolidayAndOffDay.forEach(function (h) {
                if (moment(h).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
                    swal('Selected date is holiday or Offday');
                    $scope.member.AdmissionDate = new Date($rootScope.workingdate);
                    return;
                }
            });

        }
        $scope.getHolidays = function () {
            memberDailyTransactionService.getBranchOffDayAndHolidays($scope.selectedBranchId).then(function (response) {
                $scope.branchHolidayAndOffDay = response.data;
            });
        }


       

        $scope.$watch('files', function () {
            $scope.docSizeBoolChecker();
        });

        $scope.docSizeBoolChecker = function () {
            $scope.fileSize = 0;
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
        $scope.memberNIDExistingValidation = function () {
            $scope.duplicateNIDMember = {};
            memberService.memberNIDExistingValidation($scope.member).then(function (response) {
                $scope.duplicateNIDMember = angular.copy(response.data);
            });
        }

        $scope.addMember = function () {
            if (!$rootScope.isDayOpenOrNot()) return;
            if (!$scope.member.AdmissionDate) {
                swal("Please select valid admission date");
                return;
            }
            if (!$scope.member.NID) {
                if (!$scope.member.BirthRegistrationNumber) {
                    swal("When member NID is blank then birth registration number can't be blank");
                    return;
                }
            }
            if (!$scope.member.BirthRegistrationNumber) {
                if (!$scope.member.NID) {
                    swal("When member birth registration number is blank then NID can't be blank");
                    return;
                }
            }
            if (($scope.member.NID != undefined && $scope.member.NID != null) && !($scope.member.NID.toString().length == 10 || $scope.member.NID.toString().length == 13 || $scope.member.NID.toString().length == 17)) {
                swal("Invalid NID!");
                return;
            }
            $scope.member.MemberFees = $scope.MemberFees.filter(m => m.IsExempt);
            if ($scope.docError) {
                swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');
                // $scope.docError = false;
                return;
            }

            $scope.duplicateNIDMember = {};
            memberService.memberNIDExistingValidation(0,$scope.member.NID).then(function (response) {
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
                $scope.member.Relatives = $scope.Relatives;
                $scope.member.CreatedBy = $rootScope.user.UserId;

                $scope.member.GroupId = $rootScope.groupIdOfMemberList;
                $scope.member.OriginatingGroupId = $rootScope.groupIdOfMemberList;

                $scope.member.CurrentBranchId = $scope.selectedBranchId;
                $scope.member.OriginatingBranchId = $scope.selectedBranchId;

                $scope.member.CurrentProgramOfficer = $scope.selectedMenu.ProgramOfficerId;
                $scope.member.OriginatingProgramOfficerId = $scope.selectedMenu.ProgramOfficerId;

                $scope.member.AdmissionDate = new Date(moment($scope.member.AdmissionDate).format("YYYY-MM-DD"));


                if ($scope.member.ClosingDate != null)
                    $scope.member.ClosingDate = new Date(moment($scope.member.ClosingDate).format("YYYY-MM-DD"));
                $scope.files.forEach(function (file) {
                    file.Category = $rootScope.FileCategory.GENERAL;
                });
                if ($scope.memberPhoto != null) {
                    $scope.files.push($scope.memberPhoto);
                }
                if ($scope.memberSignature != null) {
                    $scope.files.push($scope.memberSignature);
                }

                console.log($scope.files);
                $scope.member.MemberFees = $scope.MemberFees.filter(m => !m.IsExempt);
                $scope.member.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                memberService.postMember($scope.member).then(function (response) {

                    if (response.data.Success) {

                        if (response.data.Entity.Id && $scope.files.length > 0) {
                            documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.Member, $rootScope.user.UserId, $scope.memberPhoto != null ? $scope.memberPhoto.name : "", $scope.memberSignature != null ? $scope.memberSignature.name : "")
                                .then(function (res) {
                                    if (res.data.Success) {
                                        $rootScope.$broadcast('member-add-finished');
                                        swal({
                                            title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.member),
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
                                                    $scope.addMemberForm.reset();
                                                    $scope.addMemberForm.$dirty = false;
                                                    $scope.clearModelData();

                                                } else {
                                                    $scope.clearAndCloseTab();
                                                }
                                            });
                                    } else {
                                        //$scope.files = [];
                                        $scope.removeImagesFromFiles();
                                        $scope.getMemberFees();
                                        swal($rootScope.docAddError, res.data.Message, "error");
                                    }
                                }, AMMS.handleServiceError);
                        } else {
                            $rootScope.$broadcast('member-add-finished');
                            swal({
                                title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.member),
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
                                     $scope.addMemberForm.reset();
                                     $scope.addMemberForm.$dirty = false;
                                     $scope.clearModelData();

                                 } else {
                                     $scope.clearAndCloseTab();
                                 }
                             });

                        }

                    } else {
                        // $scope.files = [];
                        $scope.removeImagesFromFiles();
                        $scope.getMemberFees();
                        swal($rootScope.showMessage($rootScope.addError, $rootScope.member), response.data.Message, "error");
                    }
                }, AMMS.handleServiceError);
            
     } else {
         return;
     }
 });
                } else {
                    swal(

            commonService.swalHeaders($rootScope.showMessage($rootScope.addConfirmation, $rootScope.member), "warning"),
            function () {
                $scope.member.Relatives = $scope.Relatives;
                $scope.member.CreatedBy = $rootScope.user.UserId;

                $scope.member.GroupId = $rootScope.groupIdOfMemberList;
                $scope.member.OriginatingGroupId = $rootScope.groupIdOfMemberList;

                $scope.member.CurrentBranchId = $scope.selectedBranchId;
                $scope.member.OriginatingBranchId = $scope.selectedBranchId;

                $scope.member.CurrentProgramOfficer = $scope.selectedMenu.ProgramOfficerId;
                $scope.member.OriginatingProgramOfficerId = $scope.selectedMenu.ProgramOfficerId;

                $scope.member.AdmissionDate = new Date(moment($scope.member.AdmissionDate).format("YYYY-MM-DD"));


                if ($scope.member.ClosingDate != null)
                    $scope.member.ClosingDate = new Date(moment($scope.member.ClosingDate).format("YYYY-MM-DD"));

                //$scope.member.DateOfBirth = moment($scope.member.DateOfBirth).format("YYYY-MM-DD");

                $scope.files.forEach(function (file) {
                    file.Category = $rootScope.FileCategory.GENERAL;
                });
                if ($scope.memberPhoto != null) {
                    $scope.files.push($scope.memberPhoto);
                }
                if ($scope.memberSignature != null) {
                    $scope.files.push($scope.memberSignature);
                }

                console.log($scope.files);
                $scope.member.MemberFees = $scope.MemberFees.filter(m => !m.IsExempt);
                $scope.member.BranchWorkingDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
                memberService.postMember($scope.member).then(function (response) {

                    if (response.data.Success) {

                        if (response.data.Entity.Id && $scope.files.length > 0) {
                            documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.Member, $rootScope.user.UserId, $scope.memberPhoto != null ? $scope.memberPhoto.name : "", $scope.memberSignature != null ? $scope.memberSignature.name : "")
                                .then(function (res) {
                                    if (res.data.Success) {
                                        $rootScope.$broadcast('member-add-finished');
                                        swal({
                                            title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.member),
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
                                                    $scope.addMemberForm.reset();
                                                    $scope.addMemberForm.$dirty = false;
                                                    $scope.clearModelData();

                                                } else {
                                                    $scope.clearAndCloseTab();
                                                }
                                            });
                                    } else {
                                        //$scope.files = [];
                                        $scope.removeImagesFromFiles();
                                        $scope.getMemberFees();
                                        swal($rootScope.docAddError, res.data.Message, "error");
                                    }
                                }, AMMS.handleServiceError);
                        } else {
                            $rootScope.$broadcast('member-add-finished');
                            swal({
                                title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.member),
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
                                     $scope.addMemberForm.reset();
                                     $scope.addMemberForm.$dirty = false;
                                     $scope.clearModelData();

                                 } else {
                                     $scope.clearAndCloseTab();
                                 }
                             });

                        }

                    } else {
                        // $scope.files = [];
                        $scope.removeImagesFromFiles();
                        $scope.getMemberFees();
                        swal($rootScope.showMessage($rootScope.addError, $rootScope.member), response.data.Message, "error");
                    }
                }, AMMS.handleServiceError);
            });
                }
            });
        }


        $scope.fileCheck = function () {

        }
        $scope.getGroupMeetingDay = function () {
            loanGroupService.getloanGroup($scope.groupId).then(function (res) {
                $scope.member.MeetingDayId = res.data.MeetingDay.toString();
                $scope.groupMeetingdayStr = res.data.MeetingDayName;

            });
        }
        $scope.AdministrativeDistrictByBranchId = function () {
            memberService.getAdministrativeDistrictByBranchId($rootScope.selectedBranchId).then(function (response) {
                $scope.administrativeDistrictOfTheBranch = response.data;
                console.log($scope.administrativeDistrictOfTheBranch);
                $scope.addMemberFilterData();
            });
        }
        var init = function () {
            $scope.getMemberFees();
            $scope.getHolidays();
            $scope.AdministrativeDistrictByBranchId();
            $scope.getGroupMeetingDay();
            $scope.initialDefaultValues();

        }
        $scope.initialDefaultValues = function () {
            //  $scope.member.AdmissionDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            $scope.memberGroup = [];
            $scope.memberGroup.push({ value: $scope.groupId, text: $scope.groupName });
            $scope.member.GroupId = $scope.groupId;
            $scope.member.Age = 18;
            $scope.member.DateOfBirth = new Date(moment().add(-18, "years"));
        }
        $scope.addMemberFilterData = function () {
            filterService.getAllAdministrativeDistricts().then(function (response) {
                var data = response.data;
                $scope.filters.administrativeDistricts = data;
                console.log($scope.filters.administrativeDistricts);
                $scope.member.PermanentGovtDistrict = $scope.administrativeDistrictOfTheBranch.toString();
                $scope.member.PresentGovtDistrict = $scope.administrativeDistrictOfTheBranch.toString();
                $scope.getRelatedDataForDefaultValue();


            }, AMMS.handleServiceError);
            filterService.getAllPrograms().then(function (response) {
                var data = response.data;
                $scope.filters.programList = data;
                //$scope.member.ProgramId = data[0].Value;
            }, AMMS.handleServiceError);

            memberService.getNewPassbookId($rootScope.groupIdOfMemberList).then(function (response) {
                $scope.member.PassbookNumber = response.data;
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

        $scope.getOrganizonalFilterData = function (type, listToSet, model) {
            filterService.getOrganizationalFilterDataByType(type)
                .then(function (response) {
                    $scope[listToSet] = response.data;
                    // $scope.member[model] = $scope[listToSet][0].value;
                    if (type == "Sex") {
                        $scope[listToSet] = response.data.filter(s => s.value != -100000);
                        $scope.member.Sex = $scope[listToSet][1].value;
                    }
                    else if (type == "Nationality") {
                        $scope.member.Nationality = $scope[listToSet][0].text;
                    }
                    else if (type == "MemberEntryStatus") {
                        $scope.member.MemberEntryStatus = $scope[listToSet][0].value;
                    }
                    else if (type == "MemberSubStatus") {
                        $scope.member.MemberSubStatus = $scope[listToSet][0].value;
                    }
                    else if (type == "MemberStatus") {
                        $scope.member.Status = $scope[listToSet][0].value;
                    }
                    else if (type == "Ethnicity") {
                        $scope.member.Ethnicity = $scope[listToSet][0].value;
                    }
                    else if (type == "Handicapped") {
                        $scope.member.Handicapped = $scope[listToSet][0].value;
                    }
                    else if (type == "BadDebtStatus") {
                        $scope.member.BadDebtStatus = $scope[listToSet][2].value;
                    }
                    else if (type == "MaritalStatus") {
                        $scope.member.MaritalStatus = $scope[listToSet][0].value;
                        $scope.addRelativesDefault();
                    }
                    else if (type == "Religion") {
                        $scope.member.Religion = $scope[listToSet][0].value;
                    }
                    else if (type == "PovertyStatus") {
                        $scope.member.PovertyStatus = $scope[listToSet][1].value;
                    }
                }, AMMS.handleServiceError);
        }





        $scope.memberMobileValidator = function () {
            if ($scope.member.MobileNo) {

                $scope.member.MobileNo = $scope.member.MobileNo.replace(/[^0-9]/g, '');
            }
            return validatorService.MobileValidator($scope.member.MobileNo);
        }

        $scope.memberPhoneNoValidator = function () {
            if ($scope.member.AlternateMobileNo) {
                $scope.member.AlternateMobileNo = $scope.member.AlternateMobileNo.replace(/[^0-9]/g, '');
            }
            return validatorService.PhoneNoValidator($scope.member.AlternateMobileNo);
        }
        $scope.memberNIDValidator = function (nid) {
            if (!nid) return true;
            return validatorService.NIDValidator(nid);
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
                    }
                    else {
                        $("#relativeNIDError" + index).text("");
                    }
                } else {
                    $("#relativeNIDError" + index).text("");
                }
            }

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
        $scope.getRelatedDataForDefaultValue = function () {
            $scope.getThanas($scope.member.PermanentGovtDistrict, 'permanent');
            $scope.getThanas($scope.member.PresentGovtDistrict, 'present');

        }
        $scope.PresentThanaToggle = function () {
            var presentThana = $scope.member.PresentThanaId;
            if ($scope.sameAddress == "YES") {
                $scope.member.PresentThanaId = $scope.member.PermanentThanaId;
            } else {
                $scope.member.PresentThanaId = presentThana;
            }
        }
        $scope.getThanas = function (districtId, type) {

            if (type === 'permanent') {
                if (!districtId) {
                    $scope.thanasOfPermanentAdministrativeDistrict = null;
                    return;
                }
                $scope.thanasOfPermanentAdministrativeDistrict = null;
                if ($scope.sameAddress == "YES") {
                    $scope.thanasOfPresentAdministrativeDistrict = null;
                    $scope.member.PresentGovtDistrict = $scope.member.PermanentGovtDistrict;
                }
            }
            else {
                if (!districtId) {
                    $scope.thanasOfPresentAdministrativeDistrict = null;
                    return;
                }
            }
            $scope.pthanas = filterService.getThanasOfDistrict(districtId).then(function (response) {
                if (type === 'permanent') {
                    $scope.thanasOfPermanentAdministrativeDistrict = response.data;
                    if ($scope.thanasOfPermanentAdministrativeDistrict.length > 0)
                        $scope.member.PermanentThanaId = $scope.thanasOfPermanentAdministrativeDistrict[0].Value;
                    if ($scope.sameAddress == "YES") {
                        $scope.thanasOfPresentAdministrativeDistrict = response.data;
                        if ($scope.thanasOfPresentAdministrativeDistrict.length > 0)
                            $scope.member.PresentThanaId = $scope.member.PermanentThanaId;
                    }
                }
                else {
                    $scope.thanasOfPresentAdministrativeDistrict = response.data;
                    if ($scope.thanasOfPresentAdministrativeDistrict.length > 0)
                        $scope.member.PresentThanaId = $scope.thanasOfPresentAdministrativeDistrict[0].Value;
                    if ($scope.sameAddress == "YES") {
                        $scope.thanasOfPresentAdministrativeDistrict = $scope.thanasOfPermanentAdministrativeDistrict;
                        if ($scope.thanasOfPresentAdministrativeDistrict.length > 0)
                            $scope.member.PresentThanaId = $scope.member.PermanentThanaId;
                    }
                }
            }, AMMS.handleServiceError);
        }

        $scope.sameAddressToggleWatch = function () {
            if ($scope.sameAddress === 'YES') {
                $scope.makePresentAddressNull();
                $scope.member.PresentGovtDistrict = $scope.member.PermanentGovtDistrict;

                filterService.getThanasOfDistrict($scope.member.PresentGovtDistrict).then(function (response) {
                    $scope.thanasOfPresentAdministrativeDistrict = response.data;
                    if ($scope.thanasOfPresentAdministrativeDistrict.length>0) {
                    $scope.member.PresentThanaId = $scope.member.PermanentThanaId;
                    $scope.member.PresentUnion = $scope.member.PermanentUnion;
                    $scope.member.PresentPostOffice = $scope.member.PermanentPostOffice;
                    $scope.member.PresentVillage = $scope.member.PermanentVillage;
                    $scope.member.PresentHouse = $scope.member.PermanentHouse;
                    $scope.member.PresentRoad = $scope.member.PermanentRoad;
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

        $scope.sameAddressToggle = function () {
            if ($scope.sameAddress === 'YES') {
                $scope.makePresentAddressNull();
                $scope.member.PresentGovtDistrict = $scope.member.PermanentGovtDistrict;
                $scope.getThanas($scope.member.PresentGovtDistrict, 'present');
                $scope.member.PresentThanaId = $scope.member.PermanentThanaId;
                $scope.member.PresentUnion = $scope.member.PermanentUnion;
                $scope.member.PresentPostOffice = $scope.member.PermanentPostOffice;
                $scope.member.PresentVillage = $scope.member.PermanentVillage;
                $scope.member.PresentHouse = $scope.member.PermanentHouse;
                $scope.member.PresentRoad = $scope.member.PermanentRoad;
            } else {
                $scope.makePresentAddressNull();
            }
        }

        $scope.makePresentAddressNull = function () {
            $scope.member.PresentGovtDistrict = null;
            $scope.member.PresentThanaId = null;
            $scope.member.PresentUnion = null;
            $scope.member.PresentPostOffice = null;
            $scope.member.PresentVillage = null;
            $scope.member.PresentHouse = null;
            $scope.member.PresentRoad = null;
        }

        $scope.getAge = function () {
            var today = new Date();
            var birthDate = new Date($scope.member.DateOfBirth);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && moment(today.getDate()).format("dd") !== moment(birthDate.getDate()).format("dd") && today.getDate() < birthDate.getDate())) {
                age--;
            }
            $scope.member.Age = age;
        }

        $scope.$watch('member.DateOfBirth', function () {
            $scope.getAge();
        });

        $scope.getDateFromAge = function (age) {
            if (age != undefined && age.toString().length >= 2) {
                if (age < 18) {
                    $scope.member.Age = 18;
                }
                if (!$scope.member.DateOfBirth) {
                    var now = new Date();
                    $scope.member.DateOfBirth = memberService.getDateStrFromAge(now, $scope.member.Age);
                } else {
                    var birthDate = new Date($scope.member.DateOfBirth);
                    $scope.member.DateOfBirth = memberService.getDateStrFromAge(birthDate, $scope.member.Age);

                }
            }

        }


        $scope.clearModelData = function () {
            $scope.member = {};
            $scope.getMemberFees();
            $scope.member.MemberFees = [];
            $scope.AdministrativeDistrictByBranchId();
            $scope.Relatives = [];
            $scope.files = [];
            $scope.sameAddress = null;
            $scope.addRelativesDefault();
            $scope.initialDefaultValues();
            $scope.member.Age = 18;
            $scope.member.GroupId = $scope.groupId;
            $scope.getAge();
            $scope.clearImageFiles();
            $scope.Relatives = [];
        }
        $scope.clearImageFiles = function () {
            $scope.memberImage = null;
            $scope.memberPhoto = null;
            $scope.memberSignature = null;
            $scope.memberSignatureImage = null;
            $('#memberPhoto').attr('src', '');
            $('#memberSignature').attr('src', '');
            $("#memberPhotoFile").val("");
            $("#memberSignatureFile").val("");
        }
        $scope.clearAndCloseTab = function () {
            $scope.member = {};
            $scope.execRemoveTab($scope.tab);
        };

        $scope.removeImagesFromFiles = function () {
            $scope.files = $scope.files.filter(f => f.Category !== $rootScope.FileCategory.PROFILE_PHOTO && f.Category !== $rootScope.FileCategory.SIGNATURE);
        }
        //upload document
        $scope.removefile = function (file, files, propertyName) {
            var value = file.name;
            var i = AMMS.findWithAttr(files, propertyName, value);
            files.splice(i, 1);
            $scope.docSizeBoolChecker();

        }

        //new datepicker
        $scope.today = function () {
            $scope.member.AdmissionDate = new Date($rootScope.workingdate);


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
            return (mode === 'day' && (date.getDay() === 5));
        }
        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            minDate: new Date($rootScope.workingdate),
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

            if ($scope.member.AdmissionDate === undefined || $scope.member.AdmissionDate === null) {
                swal("This field is mandatory and can not be cleared!");
                $scope.member.AdmissionDate = new Date($rootScope.workingdate);
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
            if (moment($scope.member.AdmissionDate).valueOf() < moment($scope.member.DateOfBirth).valueOf()) {
                swal('please select valid admission date!');
                $scope.today();
                return;
            }
            if (moment($scope.member.AdmissionDate).valueOf() > maxDate || moment($scope.member.AdmissionDate).valueOf() < minDate) {
                swal('please select valid date!');
                $scope.today();
                return;
            }


            if (moment($scope.member.AdmissionDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
                swal("unable to select future date!");
                $scope.today();
                return;
            }

            $scope.isHolidayOrOffDay($scope.member.AdmissionDate);
        }
        $scope.dobValidator = function () {
            if (moment($scope.member.DateOfBirth) > moment(new Date($scope.branchWorkingDay) + 1)) {
                swal("unable to select future date!");
                $scope.getDateFromAge(18);
                return;
            }

        }




        init();
    }]);