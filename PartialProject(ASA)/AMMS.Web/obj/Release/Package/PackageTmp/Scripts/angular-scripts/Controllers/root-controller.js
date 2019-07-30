ammsAng.controller('rootController', ['$scope', '$rootScope', '$translate', '$timeout', 'commonService', function ($scope, $rootScope, $translate, $timeout, commonService) {
    $rootScope.user = null;
    $rootScope.selectedBranchTitle = null;
    $rootScope.notificationData = null;

    $rootScope.listViewShown = true;
    //Accounts coa conf init 
    $rootScope.onlyChildSelectable = false;
    $rootScope.forAdd = false;
    $rootScope.officeType = -1;
    $rootScope.coAModule = -1;


    $rootScope.addConfirmation = ' ### will be added, are you sure? ';
    $rootScope.receiveConfirmation = '### will be recieved, are you sure ?';
    $rootScope.saveConfirmation = ' ### will be saved, are you sure? ';
    $rootScope.rejectConfirmation = ' ### will be rejected, are you sure? ';
    $rootScope.transferConfirmation = ' ### will be transferred, are you sure? ';
    $rootScope.transferCancleConfirmation = ' ### Transfer will be cancelled, are you sure? ';
    $rootScope.CancelReleaseConfirmation = '### will be Performed, are you sure?';
    $rootScope.RunDepreciationConfirm = '### will be Performed, are you sure?';
    $rootScope.RollbackDepreciationConfirm = '### will be Rolled Back, are you sure?';
    $rootScope.DepreciationSuccess = '### Performed successfully';
    $rootScope.addSuccess = '### added successfully';
    $rootScope.transferSuccess = '### transferred successfully';
    $rootScope.receiveSuccess = '### Received successfully';
    $rootScope.transferCancelSuccess = '### transfer cancelled successfully';
    $rootScope.saveSuccess = '### saved successfully';
    $rootScope.addError = 'Error while adding ###: ';
    $rootScope.transferError = 'Error while transferring ###: ';
    $rootScope.saveError = 'Error while saving';
    $rootScope.docAddError = 'Entity not added. Error while uploading documents.Please try again!';
    $rootScope.ReleaseSuccess = '### Performed Successfully';
    $rootScope.releaseError = 'Error while Releasing ###: ';
    $rootScope.CancelReleaseSuccess = '### Release Cancelled Successfully';
    $rootScope.CancelReleaseError = '### Error While Cancel Release';
    $rootScope.paidSuccess = '### paid successfully';


    $rootScope.editConfirmation = '### will be edited, are you sure?';
    $rootScope.closeConfirmation = '### will be closed, are you sure?';
    $rootScope.editSuccess = '### edited successfully';
    $rootScope.closeSuccess = '### closed successfully';
    $rootScope.editError = 'Issue while editing ###: ';
    $rootScope.closeError = 'Issue while closing ###: ';
    $rootScope.rejectSucess = '### rejected successfully';

    $rootScope.deleteConfirmation = '### will be deleted, are you sure?';
    $rootScope.deleteSuccess = '### deleted successfully';
    $rootScope.deleteError = 'Issue while deleting ###: ';
    $rootScope.closeConfirmation = 'Are You Sure?';


    $rootScope.group = 'Group';
    $rootScope.loanAccount = 'Loan Account';
    $rootScope.savingProduct = 'Saving Product';
    $rootScope.badDebtAccount = 'Bad Debt Account';
    $rootScope.employee = 'Employee';
    $rootScope.employeeTransfer = 'Employee Transfer';

    $rootScope.editEmployeeTransferMsg = 'Employee Transfer Edit';
    $rootScope.member = 'Member';
    $rootScope.calendar = 'Calendar';
    $rootScope.command = 'Command';
    $rootScope.module = 'Module';
    $rootScope.property = 'Property';
    $rootScope.role = 'Role';
    $rootScope.userT = 'User';
    $rootScope.product = 'Product';
    $rootScope.savingsAccount = 'Savings Account';
    $rootScope.cbsAccount = 'CBS Account';
    $rootScope.groupTransactions = 'Group Transaction';
    $rootScope.fee = 'Fee';
    $rootScope.groupMemberTransfer = 'Group/Member';
    $rootScope.supplier = 'Supplier';
    $rootScope.AssetItemType = 'Asset Item Type';
    $rootScope.InventoryItemType = 'Inventory Item Type';
    $rootScope.AssetEntry = 'Asset';
    $rootScope.InventoryEntry = 'Inventory';
    $rootScope.AssetCategory = 'Asset Category';
    $rootScope.InventoryCategory = 'Inventory Category';
    $rootScope.groupMeetingDayChange = 'Group Meeting Day Change';
    $rootScope.memberMeetingDayChange = 'Member Meeting Day Change';
    $rootScope.transaction = 'Transaction';
    $rootScope.memberReplace = 'Member Replace';
    $rootScope.Supplier = 'Supplier';
    $rootScope.employeeDesignationToAdd = 'Employee Designation';
    $rootScope.employeeDesignation = 'Employee Designation';
    $rootScope.designation = 'Designation';
    $rootScope.grade = 'Grade'; $rootScope.employeeBankAccountToAdd = 'Employee Bank Account';
    $rootScope.employeeBankAccount = 'Employee Bank Account';
    $rootScope.employeeReleaseFromActiveService = 'Employee Release';
    $rootScope.employeeAccount = 'Employee Account';
    $rootScope.employeeAccountType = 'Employee Account Type';
    $rootScope.documentSize = 3;
    $rootScope.hrmTransactions = 'HRM Transaction';
    $rootScope.employeeSalaryStructure = 'Employee Salary Structure';
    $rootScope.employeePaySalary = 'Employee Salary';
    $rootScope.Depreciation = 'Depreciation';
    $rootScope.RollbackDepreciation = 'Rollback Depreciation';
    $rootScope.GeneralJournal = 'Voucher';
    $rootScope.BankAccount = 'Bank Account';
    $rootScope.employeeCancelRelease = 'Employee Cancel Release';
    $rootScope.employeePassbook = 'Member Passbook';
    $rootScope.env = "dev";//release e change hobe

      $rootScope.enableAsifBetaCode = true;//its fixed for you tawhid. 
    if ($rootScope.env === "dev") {
        $rootScope.accountsApiBaseUrl = 'http://localhost:64395/accounts/',
        $rootScope.commonApiBaseUrl = 'http://localhost:9627/common/';
        $rootScope.hrmsApiBaseUrl = 'http://localhost:24726/hrms/';
        $rootScope.masterdataApiBaseUrl = 'http://localhost:16530/masterdata/';
        $rootScope.programsApiBaseUrl = 'http://localhost:26462/programs/';
        $rootScope.assetApiBaseUrl = 'http://localhost:54990/asset/';
        $rootScope.inventoryApiBaseUrl = 'http://localhost:34624/inventory/';
        $rootScope.commonDownloadUrl = 'http://localhost:9627/';
        $rootScope.assetApiUrl = 'http://localhost:54990/asset/';
        $rootScope.reportApiUrl = 'http://localhost:56772/reports/';
        $rootScope.locationStr = "";
    } else if ($rootScope.env === "demo") {
        $rootScope.accountsApiBaseUrl = 'http://192.168.0.13/ammsdemo-accounts-service/accounts/';
        $rootScope.commonApiBaseUrl = 'http://192.168.0.13/ammsdemo-common-service/common/';
        $rootScope.hrmsApiBaseUrl = 'http://192.168.0.13/ammsdemo-hrms-service/hrms/';
        $rootScope.masterdataApiBaseUrl = 'http://192.168.0.13/ammsdemo-masterdata-service/masterdata/';
        $rootScope.programsApiBaseUrl = 'http://192.168.0.13/ammsdemo-program-service/programs/';
        $rootScope.assetApiBaseUrl = 'http://192.168.0.13/ammsdemo-asset-service/asset/';
        $rootScope.inventoryApiBaseUrl = 'http://192.168.0.13/ammsdemo-inventory-service/';
        $rootScope.commonDownloadUrl = 'http://192.168.0.13/ammsdemo-common-service/';
        $rootScope.assetApiUrl = 'http://192.168.0.13/ammsdemo-asset-service/asset/';
        $rootScope.reportApiUrl = 'http://192.168.0.13/ammsdemo-reports-service/reports/';
        $rootScope.inventoryApiBaseUrl = 'http://192.168.0.13/ammsdemo-inventory-service/inventory/';//
        $rootScope.locationStr = "/ammsdemo-web";
    } else if ($rootScope.env === "test") {
        console.log = function () { }
        $rootScope.accountsApiBaseUrl = 'http://192.168.0.13/amms-accounts-service/accounts/';
        $rootScope.commonApiBaseUrl = 'http://192.168.0.13/amms-common-service/common/';
        $rootScope.hrmsApiBaseUrl = 'http://192.168.0.13/amms-hrms-service/hrms/';
        $rootScope.masterdataApiBaseUrl = 'http://192.168.0.13/amms-masterdata-service/masterdata/';
        $rootScope.programsApiBaseUrl = 'http://192.168.0.13/amms-program-service/programs/';
        $rootScope.assetApiBaseUrl = 'http://192.168.0.13/amms-asset-service/asset/';
        $rootScope.inventoryApiBaseUrl = 'http://192.168.0.13/amms-inventory-service/inventory/';
        $rootScope.commonDownloadUrl = 'http://192.168.0.13/amms-common-service/';
        $rootScope.assetApiUrl = 'http://192.168.0.13/amms-asset-service/asset/';
        $rootScope.reportApiUrl = 'http://192.168.0.13/amms-reports-service/reports/';
        $rootScope.locationStr = "/amms-web";
    } else if ($rootScope.env === "stg") {
        console.log = function () { }
        $rootScope.accountsApiBaseUrl = 'http://192.168.0.31/amms-accounts-service/accounts/';
        $rootScope.commonApiBaseUrl = 'http://192.168.0.31/amms-common-service/common/';
        $rootScope.hrmsApiBaseUrl = 'http://192.168.0.31/amms-hrms-service/hrms/';
        $rootScope.masterdataApiBaseUrl = 'http://192.168.0.31/amms-masterdata-service/masterdata/';
        $rootScope.programsApiBaseUrl = 'http://192.168.0.31/amms-program-service/programs/';
        $rootScope.assetApiBaseUrl = 'http://192.168.0.31/amms-asset-service/asset/';
        $rootScope.inventoryApiBaseUrl = 'http://192.168.0.31/amms-inventory-service/';
        $rootScope.commonDownloadUrl = 'http://192.168.0.31/amms-common-service/';
        $rootScope.assetApiUrl = 'http://192.168.0.31/amms-asset-service/asset/';
        $rootScope.reportApiUrl = 'http://192.168.0.31/amms-reports-service/reports/';
        $rootScope.inventoryApiBaseUrl = 'http://192.168.0.31/amms-inventory-service/inventory/';
        $rootScope.locationStr = "/amms-web";

    } else if ($rootScope.env === "du") {
        console.log = function () { }
        $rootScope.commonApiBaseUrl = 'http://115.127.66.85/amms-common-service/common/';
        $rootScope.hrmsApiBaseUrl = 'http://115.127.66.85/amms-hrms-service/hrms/';
        $rootScope.masterdataApiBaseUrl = 'http://115.127.66.85/amms-masterdata-service/masterdata/';
        $rootScope.programsApiBaseUrl = 'http://115.127.66.85/amms-program-service/programs/';
        $rootScope.assetApiBaseUrl = 'http://115.127.66.85/ammsdemo-asset-service/asset/';
        $rootScope.inventoryApiBaseUrl = 'http://115.127.66.85/amms-inventory-service/inventory/';
        $rootScope.commonDownloadUrl = 'http://115.127.66.85/amms-common-service/';
        $rootScope.assetApiUrl = 'http://115.127.66.85/amms-asset-service/asset/';
        $rootScope.reportApiUrl = 'http://115.127.66.85/amms-reports-service/reports/';
        $rootScope.locationStr = "/amms-web";
    } else if ($rootScope.env === "prd") {
        console.log = function () { }
        $rootScope.accountsApiBaseUrl = 'https://amms-online.asabd.org/amms-accounts-service/accounts/';
        $rootScope.commonApiBaseUrl = 'https://amms-online.asabd.org/amms-common-service/common/';
        $rootScope.hrmsApiBaseUrl = 'https://amms-online1.asabd.org/amms-hrms-service/hrms/';
        $rootScope.masterdataApiBaseUrl = 'https://amms-online.asabd.org/amms-masterdata-service/masterdata/';
        $rootScope.programsApiBaseUrl = 'https://amms-online1.asabd.org/amms-program-service/programs/';
        $rootScope.assetApiBaseUrl = 'https://amms-online1.asabd.org/amms-asset-service/asset/';
        $rootScope.inventoryApiBaseUrl = 'https://amms-online1.asabd.org/amms-inventory-service/inventory/';
        $rootScope.commonDownloadUrl = 'https://amms-online.asabd.org/amms-common-service/';
        $rootScope.assetApiUrl = 'https://amms-online1.asabd.org/amms-asset-service/asset/';
        $rootScope.reportApiUrl = 'https://amms-online1.asabd.org/amms-reports-service/reports/';
        $rootScope.locationStr = "/amms-web";
    }



    $translate.use('en');
    $scope.changeLanguage = function () {
        if ($translate.use() === 'bn') {
            $translate.use('en');
        }
        else {
            $translate.use('bn');
        }

        $timeout(function () {
            $rootScope.addConfirmation = $translate.instant('addConfirmation');
            $rootScope.addSuccess = $translate.instant('addSuccess');
            $rootScope.addError = $translate.instant('addError');
            $rootScope.docAddError = $translate.instant('docAddError');
            $rootScope.editConfirmation = $translate.instant('editConfirmation');
            $rootScope.editSuccess = $translate.instant('editSuccess');
            $rootScope.editError = $translate.instant('editError');
            $rootScope.deleteConfirmation = $translate.instant('deleteConfirmation');
            $rootScope.deleteSuccess = $translate.instant('deleteSuccess');
            $rootScope.deleteError = $translate.instant('deleteError');

            $rootScope.member = $translate.instant("member");
            $rootScope.group = $translate.instant("assetItemType");
            $rootScope.assetItemType = $translate.instant("group");
            $rootScope.loanAccount = $translate.instant("loanAccount");
            $rootScope.savingProduct = $translate.instant("savingProduct");
            $rootScope.employee = $translate.instant("employee");
            $rootScope.calendar = $translate.instant("calendar");
            $rootScope.command = $translate.instant("command");
            $rootScope.module = $translate.instant("module");
            $rootScope.property = $translate.instant("property");
            $rootScope.role = $translate.instant("role");
            $rootScope.userT = $translate.instant("user");
            $rootScope.product = $translate.instant("product");
            $rootScope.closeConfirmation = $translate.instant("closeConfirmation");
        }, 100);
    }

    $rootScope.showMessage = function (message, entity) {
        return message.replace(/###/g, entity);
    }

    $scope.getRootUrl = function () {
        var url = window.location.origin;
        var paths = window.location.pathname.substring(1, window.location.pathname.length).split('/');
        for (var i = 0; i < paths.length - 2; i++) {
            url += '/' + paths[i];
        }
        return url;
    }

    $scope.getSecondaryPath = function () {
        var url = '';
        var paths = window.location.pathname.substring(1, window.location.pathname.length).split('/');
        for (var i = 0; i < paths.length - 2; i++) {
            url += '/' + paths[i];
        }
        return url;
    }

    $rootScope.toServerSideDate = function (date) {
        if (!date) return new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }

    $rootScope.setHeaders = function () {
        this.headersWithLog = {
            "Access-Control-Allow-Origin": "*",
            "ApiKey": $rootScope.user.SecretKey,
            "User": $rootScope.user.UserId,
            "EmId": $rootScope.user.EmployeeId,
            "Log": true
        };
        this.headersWithoutLog = {
            "Access-Control-Allow-Origin": "*",
            "ApiKey": $rootScope.user.SecretKey,
            "User": $rootScope.user.UserId,
            "EmId": $rootScope.user.EmployeeId,
            "Log": false
        };

        this.headersWithoutJson = {
            "Access-Control-Allow-Origin": "*",
            "ApiKey": $rootScope.user.SecretKey,
            "User": $rootScope.user.UserId,
            "Log": false,
            "content-type": "application/json"
        };


    }
    $rootScope.isDayOpenOrNot = function () {
        if (!$rootScope.workingdateIsOpened) {
            swal("Day is not open. Action Can't be performed");
            return false;
        }
        return true;
    }

    $rootScope.getBranchesByRoleAndBranch = function () {
        commonService.getBranchesByRoleAndBranch($rootScope.selectedBranchId, $rootScope.user.Role).then(function (response) {
            $rootScope.supervisedBranches = angular.copy(response.data);
            $rootScope.supervisedBranches = $scope.supervisedBranches.filter(function (el) {
                return el.Value !== -100000;
            });
            console.log($rootScope.supervisedBranches);
        }, AMMS.handleServiceError);
    }


    //upload document
    $rootScope.FileUploadEntities = { Product: 'PRODUCT', Employee: 'EMPLOYEE', Member: 'MEMBER', LoanAccount: 'LOAN_ACCOUNT', SavingsAccount: 'SAVINGS_ACCOUNT', SavingsProduct: 'SAVINGS_PRODUCT', Fee: "Fee", Asset: "Asset" };
    $rootScope.rootLevel = { SuperAdmin: 0, Admin: 1, LO: 2, BM: 3, RM: 4, DM: 5, ZM: 6, ASpE: 7, HRM: 8, Programs: 9, Accounts: 10, Finance: 11, OperationsAdmin: 13, ABM: 14, ASE: 15, StakeHolder: 100, Guest: 1000 };
    $rootScope.singleTransactionType = {
        All: 0,
        LoanDisburse: 1,
        LoanServiceCharge: 2,
        //LoanInsurance: 3,
        LoanCollection: 4,
        LoanExemption: 5,
        OtherFeesApplied: 6,
        TransferToBadDebt: 7,
        BadDebtTransfer: 8,
        BadDebtCollection: 9,
        AdjustWithSavings: 10,
        AdjustWithLTS: 11,
        AdjustWithCBS: 12,
        SavingsDeposit: 13,
        SavingsAdjustWIthLoan: 14,
        SavingsWithdraw: 15,
        SavingsReturn: 16,
        SavingsLapsed: 17,
        SavingsInterest: 18,
        CBSDeposit: 19,
        CBSAdjustWIthLoan: 20,
        CBSWithDraw: 21,
        CBSReturn: 22,
        CBSInterest: 23,
        CBSLapse: 24,
        CBSResolve: 25,
        SavingLateFee: 53,
        SavingPeriodicFee: 56,
        LoanLateFee: 49,
        LoanSecurityAndRiskFund: 47,
        LTSAdjustWithLoan: 33,
        CBSLateFee: 54,
        CBSPeriodicFee: 57,
        LTSInterest: 37,
        TransferLoan: 38,
        TransferSavings: 39,
        TransferLTS: 40,
        TransferCBS: 41,
        HonorariumForRetiredMember: 42,
        PaymentLSRF: 43,
        LTSDeposit: 44,
        LTSReturn: 45,
        LTSLapsed: 46,
        LoanProcessingFee: 48,
        PassBookFee: 50,
        AdmissionFee: 51,
        LoanAppraisalFee: 52,
        LTSLateFee: 55,
        GeneralSavingsperiodicFee: 56,
        LTSPeriodicFee: 58,
        MemberPeriodicFee: 59,
        InterestPaymentOnDeathCBSF: 60,
        AllowanceOnDeath: 61,
        LoanExcessServiceCharge: 62,
        RebateServiceCharge: 63
    };
    $rootScope.FeeConfig = {
        ChargeType: {
            Insurance: { text: "Insurance", value: 1 },
            LateFee: { text: "LateFee", value: 2 },
            OneTimeFee: { text: "OneTimeFee", value: 3 },
            PeriodicFee: { text: "PeriodicFee", value: 4 }
        },
        AppliesTo: { Loan: { text: "Loan", value: 1 }, Savings: { text: "Savings", value: 2 }, Member: { text: "Member", value: 3 } },
        TimeOfCharge: {
            LoanDisbursement: { text: "Loan Disbursement", value: 1 },
            Yearly: { text: "Yearly", value: 2 },
            SavingsAccountActivation: { text: "Savings Account Activation", value: 3 },
            MemberActivation: { text: "Member Activation", value: 4 },
            ChargeWhenOverdue: { text: "Charge When Overdue", value: 5 }

        },
        CalculationMethod: {
            Fixed: { text: "Fixed", value: 1 },
            PercentOfInitialLoanPrincipal: { text: "% Of Initial Loan Principal", value: 2 },
            PercentOfInitialLoanPrincipalPlusInterest: { text: "% of Initial Loan Principal+Interest", value: 3 },
            PercentOfInitialInterest: { text: "% of Initial Interest", value: 4 },
            PercentOfInstallmentAmount: { text: "% of Installment Amount", value: 5 }
        },
        PolicyType: {
            FemaleSinglePolicy: { text: "Female Single Policy", value: 1 },
            FemaleGroupPolicy: { text: "Female Group Policy", value: 2 },
            MaleOrOtherSinglePolicy: { text: "Male/Other Single Policy", value: 3 },
            MaleOrOtherGroupPolicy: { text: "Male/Other Group Policy", value: 4 }
        },
        Status: { Active: { text: "Active", value: 1 }, Inactive: { text: "Inactive", value: 2 } }
    };
    $rootScope.AccountType = { Loan: 1, GeneralSavings: 2, CBS: 3, LTS: 4 };
    $rootScope.ProductType = { Loan: 1, Savings: 2 };
    $rootScope.LoanStatus = { Active: 1, Inactive: 2 };
    $rootScope.LoanAccountStatus = { Active: "1", Close: "2" };
    $rootScope.TransactionProcess = { All: 0, Cash: 1, Cheque: 2, Transfer: 3, Adjust: 4, MemberFee: 5, Rebate: 6 };
    $rootScope.LoanConfig = {
        LoanProductCategory: { Primary: 1, Special: 2, MSME: 3, ProjectLoan: 4 },
        LoanAccountStatus: { Active: "1", Close: "2", DELETED: "-1" },
        BadDebtAccountStatus: { Disbursed: 1, Closed: 2 },
        BadDebtAccountReason: { New: 1, Receive: 2, Resolve: 3, FullPaid: 4 },
        LoanFlag: { Normal: 1, EarlySettlement: 2, BadDebt: 3, GoodStanding: 4, BadStanding: 5, FullPaid: 6, DeathResolve: 7, NewOrDisbursed: 8, Received: 9, DisabilityResolve: 10, ReOpened: 11 },
        ResolveFor:{Member:1,Guardian:2}
    };
    $rootScope.MemberConfig = { MemberStatus: { Active: 1, Inactive: 0,Deleted:-1 }, MemberSex: { Male: 1, Female: 0 } };
    $rootScope.EmployeeConfig = {
        EmploymentStatus: { Working: 1, Onleave: 2, Retired: 3, Inactive: 0 },
        Status: { Active: 1, Inactive: 0, Deleted: -1 },
        EmployeeAccountStatus: { Active: 1, Inactive: 0, Deleted: -1 },
        EmployeeBankAccountStatus: { Active: 1, Inactive: 0, Deleted: -1 },
        EmployeeSalaryStructureStatus: { Active: 1, Inactive: 0, Deleted: -1 }
    };
    $rootScope.SavingsConfig = {
        SavingsAccountStatus: { Pending: 1, Active: 2, Closed: 3, Deleted: -1 },
        SavingsAccountFlag: { Open: 1, Normal: 2, EarlySettlement: 3, Lapsed: 4, Return: 5, ReOpen: 6, Resolve: 7, Received: 8 },
        SavingsProductType: { General: 2, LTS: 4, CBS: 3 },
        SavingProductStatus: { Active: 1, Pending: 3, Inactive: 2 },
        SavingsType: {
            General: 2,
            LTS: 4,
            CBS: 3
        },
        GeneralSavings: {

        },
        LTSSavings: {

        },
        CBSSavings: {

        },
        InterestCalculatedUsingBalance: {
            AverageDaily: 1,
            AverageMonthly: 2
        },
        InstallmentFrequencyId: {
            Weekly:1,
            Monthly:2
        }
    }

    $rootScope.badDebtAccountStatus = {
        Disbursed: '1',
        Closed: '2'
    }

    $rootScope.badDebtAccountReason = {
        New: '1',
        Recieve: '2',
        Resloved: '3',
        FullPaid: '4'
    }

    $rootScope.UserRole = {
        SuperAdmin: '0',
        Admin: '1',
        LO: '2',
        BM: '3',
        RM: '4',
        DM: '5',
        ZM: '6',
        HR: '8',
        HRAdmin: '12',
        OperationsAdmin: '13',
        ABM: '14'
    }
    $rootScope.loanAccountInstallmentFrequency = { Weekly: 1, Monthly: 2, Quarterly: 3, OneShot: 4, EveryTwoWeek: 5 }
    $rootScope.meetingDayId = { None: 8 }
    $rootScope.LoanFlag = { Normal: "1", EarlySettlement: "2", BadDebt: "3", GoodStanding: "4", BadStanding: "5", Received : "9", ReOpened : "11" }
    $rootScope.LoanPaymentMethod = { Cash: "1", Cheque: "2" }
    $rootScope.PaymentMethod = { Cash: "1", Cheque: "2" }

    $rootScope.GroupStatus = {
        Active: '1',
        Inactive: '0',
        Deleted:'-1'
    }
    $rootScope.PermittedOfficeLevel = {
        Branch: "1",
        Region: "4",
        District: "5",
        Zone: "8",
        AdministrativeOffice: "6",
        CentralOffice: "7"
    }
    $rootScope.GroupSubStatus = {
        New: "1",
        InTransit: "2",
        Received: "3",
        Closed: "4",
        Dissolved: "5"
    }

    $rootScope.TransferStatus = {
        TransferIInitiated: '1',
        TransferAccept: '2',
        TransferCancel: '3',
        TransferReject: '4'
    }

    $rootScope.Properties = {
        LOAN_ACCOUNT: 1025,
        BAD_DEBT_ACCOUNT: 2049,
        BAD_DEBT_DAILY_TRANSACTION: 2050,
        DAILY_TRANSACTION: 2038,
        GROUP_TRANSACTION_1: 1043,
        GROUP_TRANSACTION_2: 1044,
        GROUP_TRANSACTION_BAD_1: 2047,
        GROUP_TRANSACTION_BAD_2: 2048,
        CHANGE_PROGRAM_GROUP_TYPE: 2108,
        ADJUST_LOAN: 2041,
        CHANGE_MEETING_DAY: 2109,
        BAD_DEBT_TRANSFER: 2043
    }

    $rootScope.GroupTypes = {
        GENERAL: 1,
        SPECIAL: 2,
        BAD_DEBT: 3
    }

    $rootScope.Modules = {
        PROGRAMS: 1,
        HRM: 2,
        PROGRAM_OFFICER: 10,
        GROUP_TYPE: 11,
        GROUP: 12,
        MEMBER: 13,
        CONFIGURATION: 15
    },

    $rootScope.FileCategory = {
        GENERAL: 1,
        PROFILE_PHOTO: 2,
        SIGNATURE: 3,
        ASSET_IMAGE: 4,
        INVOICE_IMAGE: 5,
        PO_IMAGE: 6,
        PAYCHEQUE_IMAGE: 7
    }
    //Asset
    $rootScope.DepreciationMethods = {
        None: 0,
        ReducingBalance: 1,
        StraightLine: 2
    }
    $rootScope.AssetType = {
        IT: 1,
        NonIT: 2
    }
    $rootScope.AssetConfig = {
        AssetStatus: { Active: 1, Inactive: 2, Deleted: -1 },
        AssetSubStatus: { Inuse: 1, Intransit: 2, InStock: 3, Reserved: 4, InMaintence: 5, Disposed: 6, Sold: 7, Donate: 8, Lost: 9, Stolen: 10, Deleted: 11, Scrapped: 12 },
        AssetPaymentMethod: { Cash: 1, Cheque: 2 },
        ItemTypeStatus: { Active: 1, Inactive: 2, Deleted: -1 },
        CategoryStatus: { Active: 1, Inactive: 2, Deleted: -1 },
        AssetType: { IT: 1, NonIT: 0 },
        SupplierStatus: { Active: 1, Inactive: 2, Deleted: -1 },
        DepriciationMethod: { ReducingBalance: 1, StraightLine: 2, None: 0 },
        AssetTransferStatus: { TransferInitiated: 1, TransferAccept: 2, TransferCancel: 3, TransferReject: 4 },
        AssetDisposalType: { Sold: 7, Scraped: 12, Lost: 9, Stolen: 10 },
        AssetDisposalStatus: { Disposed: 1, DisposedWithdrawal: 2},
        OfficeType: { Branch: 1, Division: 2, Central: 3 },
        RollbackDepreciation: {
            RollbackBy: {
                BatchId: 1, DepreciationPeriod: 2, Selection: 3
            }
        }
    }
    $rootScope.InventoryConfig = {
        Status: { Active: 1, Inactive: 0, Deleted: -1  },
        InventoryType: { IT: 1, NonIT: 0 },
        AssetSubStatus: { Inuse: 1, Intransit: 2, InStock: 3, Reserved: 4, InMaintence: 5, Disposed: 6, Sold: 7, Donate: 8, Lost: 9, Stolen: 10, Deleted: 11, Scrapped: 12 },
        AssetPaymentMethod: { Cash: 1, Cheque: 2 },
        ItemTypeStatus: { Active: 1, Inactive: 2 , Deleted: -1 },
        CategoryStatus: { Active: 1, Inactive: 0 , Deleted: -1 },
        SupplierStatus: { Active: 1, Inactive: 2, Deleted: -1 },
        OfficeType: { Branch: 1, Division: 2, Central: 3 },
        RollbackDepreciation: {
            RollbackBy: {
                BatchId: 1, DepreciationPeriod: 2, Selection: 3
            }
        }
    }
    $rootScope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'dd/MM/yyyy'];
    $rootScope.ExcessRealizedPaymentStatus = {
        Deposited: 1,
        Cash: 2,
        Unpaid: 3
    }
    $rootScope.formatNumber = function (number) {
        return number >= 0 ?  (number % 1 === 0 ?  number.toLocaleString() : number.toFixed(2).toLocaleString() )
        : ("(" + (number % 1 === 0 ? Math.abs(number).toLocaleString() : Math.abs(number.toFixed(2)).toLocaleString() )+ ")");
    }
}]);