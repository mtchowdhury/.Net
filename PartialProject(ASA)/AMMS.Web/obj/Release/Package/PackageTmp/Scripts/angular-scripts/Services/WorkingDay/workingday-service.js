ammsAng.service('workingDayService', ['$http', '$rootScope', function ($http, $rootScope) {

    this.getWorkingDays = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'configuration/workingday',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.getDateOfBranch = function (branchId) {
        return $http({
            method: 'GET',
            url: $rootScope.programsApiBaseUrl + 'configuration/workingday/getdate',
            params: {
                branchId: Encrypt.encrypt(branchId)
            },
            headers: $rootScope.headersWithoutLog
        });
    };

    this.closeWorkingDate = function (closeDateInfo) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'configuration/workingday/closedate',
            headers: $rootScope.headersWithLog,
            data: closeDateInfo
        });
    };
    
    this.checkIfClosable = function (closeDateInfo) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'configuration/workingday/check',
            headers: $rootScope.headersWithLog,
            data: closeDateInfo
        });
    };

    this.fetchClosingDateInfo = function (closeDateInfo) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'configuration/workingday/closingdateinfo',
            headers: $rootScope.headersWithLog,
            data: closeDateInfo
        });
    };

    this.openWorkingDate = function (openDate) {
        return $http({
            method: 'POST',
            url: $rootScope.programsApiBaseUrl + 'configuration/workingday/opendate',
            headers: $rootScope.headersWithLog,
            data: openDate
        });
    };

    //this.getProd = function (productId) {
    //    return $http({
    //        method: 'GET',
    //        url: $rootScope.programsApiBaseUrl + 'configuration/savingsproduct/productdetails',
    //        params: {
    //            productId: Encrypt.encrypt(productId)
    //        },
    //        headers: $rootScope.headersWithoutLog
    //    });
    //};

    //this.getAll = function () {
    //    return $http({
    //        method: 'GET',
    //        url: $rootScope.programsApiBaseUrl + 'configuration/savingsproduct',
    //        headers: $rootScope.headersWithLog
    //    });
    //};

    //this.AddSavings = function () {
    //    console.log("saving account service");
    //    var ammsSavingsAccount = {
    //        Id: 25,
    //        ProductId: 70,
    //        MemberId: 11016,
    //        OriginatingBranchId: 219,
    //        OriginatingGroupId: 1079,
    //        OriginatingProgramOfficerId: 65,
    //        InstallmentFrequencyId: 2,
    //        MinimumDepositAmount: 100,
    //        IsSyncWithMeetingDay: false,
    //        Status : 2,
    //        Flag: 1,
    //        UpdatedBy : "asd",
    //        //InterestToBePosted : 10,
    //        //TotalDeposit: 100,
    //        //TotalWithdrawl: 100,
    //        //TotalInterestEarned: 100,
    //        //NoOfMissedDeposit: 100,
    //        //SavingBalance: 100,
    //        //AdjustedAmount: 100,
    //        Nominee: [
    //            {
    //                Name: "asd",
    //                Relation: "asd",
    //                ContactNo: "01564",
    //                Percentage: "2%",
    //                CreatedBy: "asd ",
    //                UpdatedBy : "asd"
    //            }, {
    //                Name: 10,
    //                Relation: "qewqw",
    //                ContactNo: " 1541",
    //                Percentage: "23% ",
    //                CreatedBy: "qwe ",
    //                UpdatedBy: "qwe"
    //            }
    //        ]            
    //    }
    //    return $http({
    //        method: 'POST',
    //        url: $rootScope.programsApiBaseUrl + 'account/savings/add',
    //        data: ammsSavingsAccount,
    //        headers: $rootScope.headersWithLog
    //    });
    //}
}]);