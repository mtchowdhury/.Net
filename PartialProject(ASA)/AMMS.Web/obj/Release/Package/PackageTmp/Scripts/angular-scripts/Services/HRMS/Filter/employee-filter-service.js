ammsAng.service('employeeFilterService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.user = $rootScope.user;
    this.headers = $rootScope.headersWithLog;
    this.noLogHeaders = $rootScope.headersWithoutLog;

    this.getEmployeeAddfilters = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/employee',
            headers: this.noLogHeaders
        });
    }

    this.getThanasOfDistrict = function (districtId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/thanasofdistrict',
            params: {
                districtId: Encrypt.encrypt(districtId)
            },
            headers: this.noLogHeaders
        });
    }

    this.getDesignationsByGradeId = function (gradeId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/programs/designationsbygradeid',
            params: {
                gradeId: Encrypt.encrypt(gradeId)
            },
            headers: this.noLogHeaders
        });
    }

    this.getAsaDistrictsOfZone = function (zoneId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/asadistrictsofzone',
            params: {
                zoneId: Encrypt.encrypt(zoneId)
            },
            headers: this.noLogHeaders
        });
    }

    this.getRegionsOfAsaDistrict = function (asaDistrictId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/regionsofasadistrict',
            params: {
                asaDistrictId: Encrypt.encrypt(asaDistrictId)
            },
            headers: this.noLogHeaders
        });
    }

    this.getBranchesOfRegion = function (regionId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/branchesofregion',
            params: {
                regionId: Encrypt.encrypt(regionId)
            },
            headers: this.noLogHeaders
        });
    }
    this.getAllDistricts = function () {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/allDistricts',
            headers: this.noLogHeaders
        });
    }
    
    this.getBranchesOfDistrict = function (districtId) {
        return $http({
            method: 'GET',
            url: $rootScope.commonApiBaseUrl + 'filters/administrative/branchesOfDistrict',
            params: {
                districtId: Encrypt.encrypt(districtId)
            },
            headers: this.noLogHeaders
        });
    }
}]);