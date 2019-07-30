ammsAng.service('staticDataService', ['$rootScope', function ($rootScope) {
    this.getMaritalStatusOptions = function () {
        return [
            { value: 'Married', text: 'Married' },
            { value: 'Unmarried', text: 'Unmarried' }
        ];
    }

    this.getBloodGroupOptions = function() {
        return [
            { value: 'A+', text: 'A+' },
            { value: 'B+', text: 'B+' },
            { value: 'AB+', text: 'AB+' },
            { value: 'O+', text: 'O+' },
            { value: 'AB-', text: 'AB-' }
        ];
    }

    this.getDaysOfWeek = function() {
        return [
            { value: 'Friday', text: 'FRI' },
            { value: 'Saturday', text: 'SAT' },
            {value: 'Sunday', text: 'SUN'},
            {value: 'Monday', text: 'MON'},
            {value: 'Tuesday', text: 'TUE'},
            {value: 'Wednesday', text: 'WED'},
            {value: 'Thursday', text: 'THU'}
        ];
    }

    this.getDefaultPrograms = function () {
        return [
            { value: 'Primary Loan', text: 'Primary Loan' },
            { value: 'Special Loan', text: 'Special Loan' }
        ];
    }

    this.getSexOptions = function () {
        return [
            { value: 'Male', text: 'Male' },
            { value: 'Female', text: 'Female' }
        ];
    }

    this.getReligionOptions = function () {
        return [
            { value: 'Islam', text: 'Islam' },
            { value: 'Hinduism', text: 'Hinduism' }
        ];
    }

    this.getEmploymentTypeOptions = function () {
        return [
            { value: '1', text: 'Contractual' },
            { value: '2', text: 'Provisional' }
        ];
    }

    this.getEmploymentStatusOptions = function () {
        return [
            { value: '1', text: 'Working' },
            { value: '2', text: 'In Leave' }
        ];
    }
    
    this.getGroupStatusOptions = function () {
        return [
            { value: 1, text: 'Active' },
            { value: -1, text: 'Inactive' }
        ];
    }

    this.getNationalityOptions = function() {
        return [
            { value: 'Bangladeshi', text: 'Bangladeshi' },
            { value: 'Bhindeshi', text: 'Bhindeshi' }
        ];
    }

    this.getMemberStatusOptions = function () {
        return [
            { value: 0, text: 'active' },
            { value: 1, text: 'temporary closed' },
            { value: -1, text: 'Inactive' }
        ];
    }

    this.getLoanStatusOptions = function () {
        return [
            { value: 0, text: 'active' },
            { value: 1, text: 'pending' },
            { value: -1, text: 'Inactive' }
        ];
    }

    this.getEthnicityOptions = function () {
        return [
            { value:'non-tribal', text: 'Non Tribal' },
            { value: 'tribal', text: 'Tribal' }
        ];
    }
    this.getResidenceOptions = function () {
        return [
            { value: 'permanent', text: 'Permanent' },
            { value: 'temporary', text: 'Temporary' },
            { value: 'stable', text: 'Stable' },
        ];
    }

}]);