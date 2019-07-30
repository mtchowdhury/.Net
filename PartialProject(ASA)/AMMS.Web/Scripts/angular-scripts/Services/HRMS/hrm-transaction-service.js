ammsAng.service('hrmTransactionService', [
    '$http', '$rootScope', function ($http, $rootScope) {


        this.getAllFilters = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };


        this.getAllEmployeeBankAccounts = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/employeeBankAccounts',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.employeeDetails = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/employeeDetails',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },
                headers: $rootScope.headersWithoutLog
                
            });
        };


        this.accountDetails = function (accountId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/employeeAccountDetails',
                params: {
                    accountId: Encrypt.encrypt(accountId)
                },
                headers: $rootScope.headersWithoutLog

            });
        };

        this.getEmployeeTransferStatus = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employee/employeeTransfer/getEmployeeTransferStatus',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };


        this.checkIfAccountIsActive = function (accountId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getAccountStatus',
                params: {
                    accountId: Encrypt.encrypt(accountId)
                },

                headers: $rootScope.headersWithoutLog
            });
        };


        this.getBranchName = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getBranchName',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getEmployeeAccountById = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getEmployeeAccounts',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };


        this.getAllHrmTransactions = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getAllHrmTransactions',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getOfficeType = function () {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getOfficeType',
                
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getOffices = function (branchId, roleId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getBranchesByRole',
                params: {
                    branchId: Encrypt.encrypt(branchId),
                    roleId: Encrypt.encrypt(roleId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getEmployeesByBranch = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getEmployeesbyBranch',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };


        this.getOfficeTypeFromBranchId = function (branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getOfficeTypeFromBranchId',
                params: {
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getEmployeeAccount = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getEmployeesAccount',
                params: {
                    employeeId: Encrypt.encrypt(employeeId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };



        this.getHrmTransactionByTransactionId = function (transactionId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getHrmTransaction',
                params: {
                    transactionId: Encrypt.encrypt(transactionId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getHrmsTransactionByFilter = function ( brachId, employeeId, employeeAccountId,accountTypeId, transactionTypeId,fromDate, toDate) { 
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getHrmsTransactionsByFilter',
                params: {
                    brachId: Encrypt.encrypt(brachId),
                    employeeId: Encrypt.encrypt(employeeId),
                    employeeAccountId: Encrypt.encrypt(employeeAccountId),
                    accountTypeId: Encrypt.encrypt(accountTypeId),
                    transactionTypeId: Encrypt.encrypt(transactionTypeId),
                    fromDate: Encrypt.encrypt(fromDate),
                    toDate: Encrypt.encrypt(toDate)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getHrmTransactionsForDefaultView = function (branchId,from,to) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getHrmTransactionForDefaultView',
                params: {
                    branchId: Encrypt.encrypt(branchId),
                    from: Encrypt.encrypt(from),
                    to: Encrypt.encrypt(to)
                },
                headers: $rootScope.headersWithoutLog
            });
        };


        this.getHrmTransactionCreatedFrom = function () {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getTransactionCreatedFrom',
                headers: $rootScope.headersWithoutLog
            });
        };


        this.hrmTransaction = function (hrmTransaction,isAdd,isEdit,roleId) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/transact',
                params: {
                    isAdd: Encrypt.encrypt(isAdd),
                    isEdit: Encrypt.encrypt(isEdit),
                    roleId: Encrypt.encrypt(roleId)
                },
                headers: $rootScope.headersWithoutLog,
                data: hrmTransaction
            });
        };

        this.bulkHrmTransaction = function (hrmTransaction, isAdd, isEdit) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/bulkTransact',
                params: {
                    isAdd: Encrypt.encrypt(isAdd),
                    isEdit: Encrypt.encrypt(isEdit)
                },
                headers: $rootScope.headersWithoutLog,
                data: hrmTransaction
            });
        };


        this.deleteHrmsTransaction = function (id, workingdate, roleId) {
            return $http({
                method: 'POST',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/delete',
                params: {
                    id: Encrypt.encrypt(id),
                    workingdate: Encrypt.encrypt(workingdate),
                    roleId: Encrypt.encrypt(roleId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };
        this.getTransactionTypeAndAccountByAccountType = function (accountTypeId, employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getTransactionTypeAndAccountByAccountType',
                params: {
                    accountTypeId: Encrypt.encrypt(accountTypeId),
                    employeeId: Encrypt.encrypt(employeeId)
                    
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getTransactionTypesByAccountId = function (accountId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/getTransactionTypesByAccountId',
                params: {
                    accountId: Encrypt.encrypt(accountId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.getBranchesByOfficeTypeId = function (officeTypeId, roleId, branchId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'employeeAccount/getBranchelist',
                params: {
                    officeTypeId: Encrypt.encrypt(officeTypeId),
                    roleId: Encrypt.encrypt(roleId),
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.isEmployeeActive = function (employeeId) {
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/isemployeeactive',
                params: {
                    employeeId: Encrypt.encrypt(employeeId),
                },
                headers: $rootScope.headersWithoutLog
            });
        };

        this.IsEmployeeIsInTransferReceiveState = function (employeeId,branchId) {
            
            return $http({
                method: 'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/isemployeeintransferreceivestate',
                params: {
                    employeeId: Encrypt.encrypt(employeeId),
                    branchId: Encrypt.encrypt(branchId)
                },
                headers: $rootScope.headersWithoutLog
            });

        };
        this.checkEmployeeTransferReceiveValidation = function (employeeId, branchId, transactionDate) {
            
            return $http({
                method:'GET',
                url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/checkemployeetransferreceivevalidation',
                params: {
                    employeeId: Encrypt.encrypt(employeeId),
                    branchId: Encrypt.encrypt(branchId),
                    transactionDate: Encrypt.encrypt(transactionDate)
                },
                headers:$rootScope.headersWithoutLog
            
            });
        
        };

        //this.CheckIfEmployeeSubsidyAmountIsLessThanTotalCollectedAmount = function (branchId, employeeId, accountTypeId,transactionTypeId, amount) {
        //    return $http({
               
        //        method:'GET',
        //        url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/checkifemployeesubsidyamountislessthantotalcollectedamount',
        //        params: {
        //            branchId: Encrypt.encrypt(branchId),
        //            employeeId: Encrypt.encrypt(employeeId),
        //            accountTypeId: Encrypt.encrypt(accountTypeId),
        //            transactionTypeId: Encrypt.encrypt(transactionTypeId),
        //            amount: Encrypt.encrypt(amount)
        //        },
        //    headers: $rootScope.headersWithoutLog
        //    });

        //};

        //this.CheckIfEmployeeHasServiceChargeOrCollectedAmountGreaterThanServiceCharge = function (employeeId, accountTypeId, transactionTypeId, amount) {
        //    return $http({

        //        method: 'GET',
        //        url: $rootScope.hrmsApiBaseUrl + 'hrmTransaction/checkifemployeehasservicechargeorcollectedamountgreaterthanservicecharge',
        //        params: {
        //            employeeId: Encrypt.encrypt(employeeId),
        //            accountTypeId: Encrypt.encrypt(accountTypeId),
        //            transactionTypeId: Encrypt.encrypt(transactionTypeId),
        //            amount: Encrypt.encrypt(amount)
        //        },
        //        headers: $rootScope.headersWithoutLog
        //    });

        //};



    }]);