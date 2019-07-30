ammsAng.controller('uploadController', [
    '$scope', '$rootScope', 'commonService', 'documentService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, commonService, documentService,DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.files = [];
        $scope.fileValidityCheck = true;
        $scope.roleId = $rootScope.user.Role;

        $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('order',[])
                .withPaginationType('full_numbers')
                .withDisplayLength(10);

        $scope.dtColumnDefs = [
          
       DTColumnDefBuilder.newColumnDef(0).notSortable(),
       DTColumnDefBuilder.newColumnDef(1).notSortable(),
       DTColumnDefBuilder.newColumnDef(2).notSortable(),
       DTColumnDefBuilder.newColumnDef(3).notSortable(),
       DTColumnDefBuilder.newColumnDef(4).notSortable()
           
     
        ];

        $scope.fileformatChecker = function () {
            $scope.valid = true;
            $scope.file = $scope.files[$scope.files.length - 1];
            if ($scope.fileValidityCheck === false)return;
             var splittedFileName = $scope.file.name.split('_');
             var intDate = parseInt(splittedFileName[splittedFileName.length - 1].split('.')[0]);
             var fileExtension = splittedFileName[splittedFileName.length - 1].split('.')[1];
             //var sdf = parseInt(splittedFileName[splittedFileName.length - 2]);
                if (fileExtension !== '001') {
                    swal('invalid file extension!');
                    $scope.valid = false;
                    return;
                }
                if (isNaN(intDate) || intDate.toString().length<6) {
                    swal('invalid name format!');
                    $scope.valid = false;
                    return;
                }
           
                //if ($scope.intToDate(intDate) > moment($rootScope.workingdate).format()) {
                //    swal('unable to upload future date file!');
                //    $scope.valid = false;
                //    return;
                //}
                if (isNaN(parseInt(splittedFileName[splittedFileName.length - 2]))) {
                    swal('invalid branch code!');
                    $scope.valid = false;
                    return;
                }
            
                if (parseInt(splittedFileName[splittedFileName.length - 2]) !== $scope.branchCode) {
                    swal('Selected file branch Code doesnt match the logged in branch code!');
                    $scope.valid = false;
                    return;
                }
            
        }
        $scope.upload = function () {
            $scope.uploadStartTime = moment().format();
            $scope.file = $scope.files[$scope.files.length - 1];
            if ($scope.file === null || $scope.file === undefined) {
                swal('No File Selected!');
                return;
            }
            $scope.fileformatChecker();
            if (!$scope.valid)return;
            // $scope.files[0].type = 'application/zip';
            swal({
                title: 'Upload selected file?',
                showCancelButton: true,
                confirmButtonText: "Yes, Upload!",
                cancelButtonText: "No, cancel !",
                type: "info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
            function (isConfirmed) {
                if (isConfirmed) {
                    $scope.file = $scope.files[$scope.files.length - 1];
                    $scope.uploadStartTime = moment().format();
                    documentService.uploadLocal($scope.file, $scope.selectedBranchId, $rootScope.workingdate,$scope.file.name).then(function (response) {
                        if (response.data.Success) {
                            swal('Uploaded', 'Successful', 'success');
                            var timeobject = $scope.getLocalTimes();
                            console.log(timeobject);
                            console.log($scope.dataRows[0]);

                            documentService.updateLocalFileUploadTime(timeobject).then(function(res) {
                                if (!res.data.Success) {
                                    swal('Error', 'failed to update upload time!', res.data.Message);
                                }
                            });
                            $scope.getLocalBranchData();
                            $scope.files = [];
                        } else {
                            swal('Error', response.data.Message, 'error');
                        }
                    });
                }else {
                    swal("Cancelled", "something is wrong", "error");
                }
            });
        }

        $scope.getLocalTimes=function() {
            var branchToOnlineObject = {};
            branchToOnlineObject.FIleName = $scope.file.name;
            branchToOnlineObject.LastBranchWorkingDate = moment($rootScope.workingdate).format();
            branchToOnlineObject.BranchCode = $scope.selectedBranchId;
            branchToOnlineObject.UploadStartTime = $scope.uploadStartTime;
            branchToOnlineObject.UploadEndTime = moment().format();
            return branchToOnlineObject;
        }

        $scope.intToDate = function (intDate){
            var dateString = intDate.toString();
            var year = dateString.length >= 4 ? parseInt(dateString.substring(0, 4)) < 1901 ? 1901 : parseInt(dateString.substring(0, 4)) : 1901;
            var month = dateString.length >= 6 ? parseInt(dateString.substring(4, 6)) < 1 ? 1 : parseInt(dateString.substring(4, 6)) : 1;
            var day = dateString.length >= 8 ? parseInt(dateString.substring(6, 8)) < 1 ? 1 : parseInt(dateString.substring(6, 8)) : 1;
            return  moment(new Date(year, month-1, day)).format();
        }
        $scope.getLocalBranchData = function () {
            $("#loadingImage").css("display", "block");
            documentService.getLocalBranchData($scope.selectedBranchId, $scope.roleId).then(function (response) {
                $scope.dataRows = response.data;
                $scope.dataRows.forEach(function(row) {
                    row.LastUploadedDate = moment(row.LastUploadedDate).format('DD-MM-YYYY');
                    row.LastBranchWorkingDate = moment(row.LastBranchWorkingDate).format('DD-MM-YYYY');
                    
                });
                //$scope.dataRows.reverse();
                $("#loadingImage").css("display", "none");
            });
        }
        $scope.getBranchCode=function(branchId) {
           documentService.getBranchCode(branchId).then(function(response) {
               $scope.branchCode = response.data;
           });
        }

        $scope.removefile=function() {
            $scope.files = [];
        }
       
        $scope.init=function() {
            $scope.getLocalBranchData();
            $scope.getBranchCode($scope.selectedBranchId);
        }
        $scope.init();


    }
]);