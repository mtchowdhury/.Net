ammsAng.service('documentService', ['$http', '$rootScope', 'Upload', function ($http, $rootScope, Upload) {

    this.uploadFiles = function (files, entityId, entityType, userId, photo, signature) {
        console.log(photo);
        console.log(signature);
        
        var p = photo ? '&photoName=' + photo : '&photoName=****';
        var s = signature ? '&signatureName=' + signature : '&signatureName=****';
        console.log($rootScope.commonApiBaseUrl + 'document/fileupload/add?entityId=' + entityId + '&entityType=' + entityType
            + '&userId=' + userId + p + s);
        return Upload.upload({
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/add?entityId=' + entityId + '&entityType=' + entityType
                + '&userId=' + userId + p + s,
            data: { file: files }
        });
    }

    this.uploadAsset = function (files, userId, assetImageName, invoiceImageName, poImageName, payChequeImageName) {
        //console.log(photo);
        //console.log(signature);

        var p = assetImageName ? '&assetImageName=' + assetImageName : '&assetImageName=****';
        var s = invoiceImageName ? '&invoiceImageName=' + invoiceImageName : '&invoiceImageName=****';
        var r = poImageName ? '&poImageName=' + poImageName : '&poImageName=****';
        var q = payChequeImageName ? '&payChequeImageName=' + payChequeImageName : '&payChequeImageName=****';
        //console.log($rootScope.commonApiBaseUrl + 'document/fileupload/add?entityId=' + entityId + '&entityType=' + entityType
        //    + '&userId=' + userId + p + s);
        return Upload.upload({
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/addasset?userId=' + userId + p + s + r + q,
            data: { file: files }
        });
    }


    this.uploadLocal = function(files, branchId, workingDate,fileName) {
        return Upload.upload({
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/addlocal',
            params: {
                branchId: branchId,
                workingDate: workingDate,
                fileName: fileName
               
            },
            data: { file: files },
            headers: $rootScope.headersWithoutLog
    });
    }
    this.updateLocalFileUploadTime=function(branchToOnline) {
        return $http({
            method: 'POST',
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/updateLocalTime',
            data: branchToOnline,
            headers: $rootScope.headersWithoutJson
        });
    }
    this.updateUniversalFileUploadTime = function (timeObject) {
        return $http({
            method: 'POST',
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/updateUniversalTime',
            data: timeObject,
            headers: $rootScope.headersWithoutJson
        });
    }

    this.getFilesbyEntity = function (entityId, entityType) {
        return $http({
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/get?id=' + entityId + '&entityType=' + entityType
        });
    }

    this.getAssetFilesbyEntity = function (entityId) {
        return $http({
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/getasset?id=' + entityId
        });
    }

    this.deleteDocument = function (entityId) {
        return $http({
            method: 'DELETE',
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/delete?id=' + entityId,
            params: {
                entityId: Encrypt.encrypt(entityId)
            },
            headers: $rootScope.headersWithLog
        });
    }
    this.getLocalBranchData = function (branchId,roleId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/getfilterdata?branchId=' + branchId+'&roleId='+roleId,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getUniversalBranchData = function (branchId,roleId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/getuniversalfilterdata?branchId=' + branchId+'&roleId='+roleId,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.getBranchCode=function(branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/getBranchCode?branchId=' + branchId,
            headers: $rootScope.headersWithoutLog
        });
    }

    this.deleteLocalDocument = function (hash) {
        return $http({
            method: 'POST',
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/deleteLocal?hash=' + hash,
            headers: $rootScope.headersWithoutLog
        });
    }
    this.uploadUniversal = function (files, branchId, workingDate, fileName) {
        return Upload.upload({
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/addUniversal',
            params: {
                fileName: fileName,
                branchId: branchId,
                workingDate: workingDate
            },
            data: { file: files },
            headers: $rootScope.headersWithoutLog
        });
    }
    this.uploadBranchData = function (files, branchId, workingDate, fileName) {
        return Upload.upload({
            url: $rootScope.commonApiBaseUrl + 'document/fileupload/addBranchData',
            params: {
                fileName: fileName,
                branchId: branchId,
                workingDate: workingDate
            },
            data: { file: files },
            headers: $rootScope.headersWithoutLog
        });
    }
}]);