ammsAng.service('validatorService', [function() {

        this.MobileValidator = function (mobile) {
			if (!mobile) return "Mobile Phone No. field required";
            if (!(mobile.toString().length === 11)) {
                return "Mobile Phone No must be 11 characters long";
            }
            return true;
        };

        this.PhoneNoValidator = function (phone) {            
            if (!phone) return true;
            var pattern = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
            if (pattern.test(phone)) {
                return true;
            } else {
                return "invalid Phone Number";
            }
        }
        
        this.NIDValidator = function (nid) {
            if (!nid) return "NID field is required";
            if (!(nid.toString().length === 10 || nid.toString().length === 13 || nid.toString().length === 17)) {
                return "NID must be 10 or 13 or 17 characters long";
            }
            return true;
        }       
    }
]);


