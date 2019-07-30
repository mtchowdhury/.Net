ammsAng.controller('employeeAccountListController', ['$scope', '$rootScope', '$timeout', '$q', 'filterService', 'employeeAccountService','commonService','DTOptionsBuilder', 'DTColumnDefBuilder',
function ($scope, $rootScope, $timeout, $q, filterService,employeeAccountService,commonService,DTOptionsBuilder, DTColumnDefBuilder) {

        $scope.filters = {};
        $scope.filter = {};
        $scope.employeeAccount = {};
        $scope.BranchList = {};


        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];

        $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10);

        $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(1)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(2)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(3)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(4)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(5)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(6)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(7)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(8)
            .withOption("bSearchable", true),
        DTColumnDefBuilder.newColumnDef(9)
            .withOption("bSearchable", true)
        ];

        $scope.$on('employeeAccount-add-finished', function () {
           
            $scope.loadSelectedEmployeeAccounts($scope.filter.EmployeeId, $scope.filter.AccountTypeId, $scope.filter.Status);
        });

        $scope.$on('employeeAccount-edit-finished', function () {
            
            $scope.loadSelectedEmployeeAccounts($scope.filter.EmployeeId, $scope.filter.AccountTypeId, $scope.filter.Status);
        });


        $scope.$on('employeeAccount-delete-finished', function () {
            $scope.loadSelectedEmployeeAccounts($scope.filter.EmployeeId, $scope.filter.AccountTypeId, $scope.filter.Status);
            
        });
        $scope.init = function () {
            $scope.filterparams = {};
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
                // $scope.getAllDesignation();
                $scope.getFilters();

                $scope.getSelectedBranchTypeIdAndSetDefaultBranchForUser();
            }, AMMS.handleServiceError);

        };
        $scope.handleNonGeneralActions = function (actionName, account) {
            $scope.accountToDelete = account;
            if (actionName === "DELETE") {
                $scope.deleteAccount();
            }
        }

        $scope.deleteAccount = function () {
            swal({
                title: "Confirm?",
                // text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.employeeAccount),
                text:"Are you sure? There are existing transaction that will be deleted associated with this account!",
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    employeeAccountService.deleteAccountById($scope.accountToDelete.Id, moment($rootScope.workingdate).format(),$rootScope.user.Role).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.employeeAccount), "Successful!", "success");
                            $rootScope.$broadcast('employeeAccount-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.employeeAccount), response.data.Message, "error");
                        }

                    });
                });
        };
        
      
        $scope.getFilters = function () {
            $("#loadingImage").css("display", "block");
            employeeAccountService.getListpageFilterData().then(function(response) {
                $scope.filters = response.data;
                $scope.filters.Status.push({
                    Name: 'Both',
                    Value:-1
                });
                $scope.filters.AccountTypes.push({
                    Name: 'All',
                    Value:-1
                });

                for (var j = 0; j < $scope.filters.Status.length; j++) {
                    if ($scope.filters.Status[j].Name == 'Deleted') {
                        $scope.filters.Status.splice(j, 1);
                    }
                }

                if ($rootScope.user.Role === $rootScope.rootLevel.BM.toString()) {
                    $scope.filter.OfficeTypeId = 1;
                    employeeAccountService.getBranchesByOfficeTypeId(1, $rootScope.user.Role, $rootScope.selectedBranchId).then(function (response) {
                        $scope.BranchList = response.data;
                        $scope.filter.BranchId = $scope.BranchList[0];

                        // $scope.loadEmployees($scope.filter.BranchId);
                        $scope.loadEmployeesFromSp();
                    });
                }
            });
            $("#loadingImage").css("display", "none");
        }
        $scope.loadBranches=function(officeTypeId) {
            employeeAccountService.getBranchesByOfficeTypeId(officeTypeId, $rootScope.user.Role, $rootScope.selectedBranchId).then(function (response) {
                $scope.BranchList = response.data;
            });
        }
        $scope.loadEmployees = function (branchId) {
            employeeAccountService.getEmployeeListByBranchId(branchId).then(function (response) {
                $scope.EmployeeList = response.data;
                $scope.EmployeeList.push({
                    Name: 'All',
                    Value: -1000
                });
            });
        }
        $scope.loadEmployeesFromSp=function() {
            commonService.getEmployeeFilterFromSP($scope.filter.BranchId.Value, $rootScope.user.Role, $rootScope.user.EmployeeId, false, moment(new Date(1901, 00, 01)).format(), moment($rootScope.workingdate).format()).then(function (response) {
                $scope.EmployeeList = response.data;
                $scope.EmployeeList.push({
                    Name: 'All',
                    Value: -1000
                });
            });
        }

        $scope.loadSelectedEmployeeAccounts=function(employeeId,accountTypeId,statusId) {
            if ($scope.filter.OfficeTypeId === null || $scope.filter.OfficeTypeId === undefined) {
                swal("please select office type!");
                return;
            }
            if ($scope.filter.BranchId === null || $scope.filter.BranchId === undefined) {
                swal("please select office name!");
                return;
            }
            if ($scope.filter.EmployeeId === null || $scope.filter.EmployeeId === undefined) {
                swal("please select employee!");
                return;
            }
            if ($scope.filter.AccountTypeId === null || $scope.filter.AccountTypeId === undefined) {
                swal("please select account type!");
                return;
            }
            if ($scope.filter.Status === null || $scope.filter.Status === undefined) {
                swal("please select status!");
                return;
            }
            $("#loadingImage").css("display", "block");
            employeeAccountService.getAccountList($scope.filter.BranchId.Value, employeeId, accountTypeId, statusId).then(function (response) {
                $scope.AccountList = response.data;
                $scope.AccountList.forEach(function(account) {
                    account.OpeningDate = account.OpeningDate !== null ? moment(account.OpeningDate).format('DD/MM/YYYY'):null;
                    account.DisburseDate = account.DisburseDate !== null ? moment(account.DisburseDate).format('DD/MM/YYYY') : null;
                    account.ReceiveDate = account.ReceiveDate !== null ? moment(account.ReceiveDate).format('DD/MM/YYYY') : null;
                    account.ClosingDate = account.ClosingDate !== null ? moment(account.ClosingDate).format('DD/MM/YYYY') : null;
                    account.AccountOpeningType = account.AccountOpeningType == null ? -10000 : account.AccountOpeningType;
                   // account.Duration = account.Duration == null ? 'N/A' : account.Duration;
                  //  account.InstallmentType = account.InstallmentType == null ? -10000 : account.InstallmentType;
                  //  account.TotalInstallment = account.TotalInstallment == null ? 'N/A' : account.TotalInstallment;
                   // account.LifeCycle = account.LifeCycle == null ? -10000 : account.LifeCycle;
                  //  account.Cycle = account.Cycle == null ? 'N/A' : account.Cycle;
                });
                $("#loadingImage").css("display", "none");
            });

        }
        $scope.setAtRoot=function(employeeId) {
            $rootScope.eObjectForAccountAdd = $scope.EmployeeList.filter(e => e.Value === employeeId)[0];
            $rootScope.branchInfo = {
                branchCode: $scope.filter.BranchId, officeType: $scope.filter.OfficeTypeId
            }
        }

        $scope.setDefaults=function() {
            $scope.filter.AccountTypeId =-1 ;
            $scope.filter.Status =1 ;
        }

        $scope.checkfornullemployeeIdPassBeforeAdd = function (command) {
            //if ($rootScope.eObjectForAccountAdd === null || $rootScope.eObjectForAccountAdd === undefined) {
            //    swal("please select an employee to add account!");
            //    return;
            //}
            $scope.openCommandTab(command, $scope.tab.id, 'EmployeeAccount', {});
    }

    $scope.getSelectedBranchTypeIdAndSetDefaultBranchForUser=function() {
        employeeAccountService.getSelectedOfficeTypeIdByBranchId($rootScope.selectedBranchId).then(function(response) {
            $scope.selectedBranchTypeId = response.data;
            $scope.filter.OfficeTypeId = $scope.selectedBranchTypeId;
            employeeAccountService.getBranchesByOfficeTypeId($scope.filter.OfficeTypeId, $rootScope.user.Role, $rootScope.selectedBranchId).then(function (response) {
                $scope.BranchList = response.data;
                $scope.filter.BranchId = $scope.BranchList.filter(br => br.Value === $rootScope.selectedBranchId)[0];
                $scope.loadEmployeesFromSp();
            });
        });
    }

    $scope.exportData = function () {
        //$scope.filterParams = {};
       
        $scope.filterparams.EmployeeId = $scope.filter.EmployeeId;
        $scope.filterparams.AccountTypeId = $scope.filter.AccountTypeId;
        $scope.filterparams.StatusId = $scope.filter.Status;

        var filterString = "";

        
        for (var property in $scope.filterparams) {
            if ($scope.filterparams.hasOwnProperty(property)) {
                if (property != "AssetTypeList" && property != "BranchList" && property != "CategoryList" &&
                    property != "DistrictList" && property != "Office" && property != "OfficeTypeList" && property != "OfficeTypeListMain"
                    && property != "StatusList" && property != "SubStatusList" && property != "ZoneList" && property != "RegionList")
                    filterString += property + "|" + $scope.filterparams[property] + "#";
            }
        }
        
        //$scope.filterParams.fromInit = 
        var url = commonService.getExportUrl($rootScope.hrmsApiBaseUrl + 'employeeAccount/getAccountListExport', filterString, 'HRMS-EmployeeAccount');
        window.open(url, '_blank');
    }
        

       $scope.init();
    }
]);