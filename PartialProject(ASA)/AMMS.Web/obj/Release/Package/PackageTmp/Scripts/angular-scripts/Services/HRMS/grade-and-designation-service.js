ammsAng.service('gradeAndDesignationService', ['$http', '$rootScope', function ($http, $rootScope) {

    this.getAllDesignations = function () {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/getDesignations',
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getAllGrades = function () {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/getGrades',
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getAllDesignationFilterData = function () {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/getDesignationsfilterdata',
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getAllGradesFilterData = function () {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/getGradesfilterdata',
            headers: $rootScope.headersWithoutLog
        });
    };
    this.getDesignationById = function (designationId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/getDesignationById',
            headers: $rootScope.headersWithoutLog,
            params: {
                designationId: Encrypt.encrypt(designationId)
            }
        });
    };
    this.addDesignation = function (designation) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/addDesignation',
            headers: $rootScope.headersWithoutLog,
            data: designation
        });
    };
    this.editDesignation = function (designation) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/editDesignation',
            headers: $rootScope.headersWithoutLog,
            data: designation
        });
    };
    this.deleteDesignationById = function (designationId) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/deleteDesignationById',
            headers: $rootScope.headersWithoutLog,
            params: {
                designationId: Encrypt.encrypt(designationId)
            }
        });
    };
    this.addGrade = function (grade) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/addGrade',
            headers: $rootScope.headersWithoutLog,
            data: grade
        });
    };
    this.editGrade = function (grade) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/editGrade',
            headers: $rootScope.headersWithoutLog,
            data: grade
        });
    };
    this.deleteGradeById = function (gradeId) {
        return $http({
            method: 'POST',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/deleteGradeById',
            headers: $rootScope.headersWithoutLog,
            params: {
                gradeId: Encrypt.encrypt(gradeId)
            }
        });
    };
    this.getGradeById = function (gradeId) {
        return $http({
            method: 'GET',
            url: $rootScope.hrmsApiBaseUrl + 'gradeNDesignation/getGradeById',
            headers: $rootScope.headersWithoutLog,
            params: {
                gradeId: Encrypt.encrypt(gradeId)
            }
        });
    };
}]);