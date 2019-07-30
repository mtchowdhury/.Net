ammsAng.controller('savingsProductAddController', [
'$scope', '$rootScope', '$timeout', 'savingsProductService', 'filterService', 'commonService', 'documentService','feeService',
function ($scope, $rootScope, $timeout, savingsProductService, filterService, commonService, documentService, feeService) {
    var declareVariable = function () {
        $scope.allowAllValue = -100000;
        $scope.allowNone = -999999;
        $scope.product = { MultiplesOf: 10, MaxCountPerMember: 1, IsVaryingAmountFrequencyOverriden: true };
        $scope.statusList = [];
        $scope.product.AmmsSavingProductAmountFrequencies = [];
        $scope.InterestRates = [];
        $scope.interestRate = {};
        $scope.product.typeName = "Savings";
        //$scope.product.StartDate = {}
        //$scope.product.EndDate = {}
        $scope.ProductType = "";
        $scope.loanOrDeposit = 'Loan';
        $scope.editIndex = -1;
        $scope.range = "Range";
        $scope.bool = true;
        $scope.IsVersionChanged = false;
        $scope.IsStatusChanged = false;
        $scope.maturityAmounts = [];
        $scope.isEdit = false;
        $scope.product.DefaultInstallmentFrequency = 1;
        $scope.product.DefaultInstallmentFrequencyMonthly = 2;
        $scope.product.InterestCalculationPeriod = 4;
        $scope.savingsFee = 2;
        $scope.savingsFeeList = [];
        $scope.MaturityTotalPrincipal = 0;
       
       
        $scope.product.OneTimeFeeIds = [];
        $scope.product.PeriodicFeeIds = [];
        $scope.product.LateFeeObject = '';
        $scope.files = [];
        $scope.serverDateTimeToday = undefined;
        $scope.periodDisabler = true;
        $scope.validationBool = false;

    }
    $scope.dropdownSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        displayProp: 'Name',
        idProp: 'Value',
        buttonClasses: 'custom-button-sprod'
    }


    $scope.$watch('files', function () {
        $scope.docSizeBoolChecker();
    });

    $scope.docSizeBoolChecker = function () {
        $scope.fileSize = 0;
        $scope.files.forEach(function (file) {
            $scope.fileSize += file.size;
            if ($scope.fileSize > (1024 * 1024) * ($rootScope.documentSize)) {
                $scope.docError = true;
                return;

            } else {
                $scope.docError = false;
            }

        });
    }

    $scope.checkMultipleOfAmountForDSAW = function (amount) {
        if (!amount)
            return "Field is Required";
        if (amount % $scope.product.MultiplesOf!=0)
            return "Value should be multiple of " + $scope.product.MultiplesOf;
        return true;
    }
    $scope.checkMultipleOfAmountDMSAW = function (amount) {
        if (!amount)
            return "Field is Required";
        if (amount % $scope.product.MultiplesOf != 0)
            return "Value should be multiple of " + $scope.product.MultiplesOf;
        return true;
    }
    $scope.checkMultipleOfAmountDMXSAW = function (amount) {
        if (!amount)
            return "Field is Required";
        if (amount % $scope.product.MultiplesOf != 0)
            return "Value should be multiple of " + $scope.product.MultiplesOf;
        return true;
    }
    $scope.checkMultipleOfAmountDSAM = function (amount) {
        if (!amount)
            return "Field is Required";
        if (amount % $scope.product.MultiplesOf != 0)
            return "Value should be multiple of " + $scope.product.MultiplesOf;
        return true;
    }
    $scope.checkMultipleOfAmountDMSM = function (amount) {
        if (!amount)
            return "Field is Required";
        if (amount % $scope.product.MultiplesOf != 0)
            return "Value should be multiple of " + $scope.product.MultiplesOf;
        return true;
    }
    $scope.checkMultipleOfAmountDMXSAM = function (amount) {
        if (!amount)
            return "Field is Required";
        if (amount % $scope.product.MultiplesOf != 0)
            return "Value should be multiple of " + $scope.product.MultiplesOf;
        return true;
    }
    $scope.checkMultipleOfAmountCBS = function (index) {
        if ($scope.product.AmmsSavingProductAmountFrequencies==null || !$scope.product.AmmsSavingProductAmountFrequencies[index].MandatorySavingsAmount)
            return "Field is Required";
        if ($scope.product.AmmsSavingProductAmountFrequencies[index].MandatorySavingsAmount % $scope.product.MultiplesOf!=0)
            return "Value should be multiple of " + $scope.product.MultiplesOf;
        return true;
    }
    
    $scope.frequencywiseStepChanger = function () {
       

        if ($scope.InterestRates.length > 0 ) {
            
                $scope.interestRate.MinPeriodOrInstallment = $scope.InterestRates[$scope.InterestRates.length - 1].MaxPeriodOrInstallment ? $scope.InterestRates[$scope.InterestRates.length - 1].MaxPeriodOrInstallment + 1 :
              undefined;
            
                if ($scope.interestRate.AtMaturity !== undefined) {
                    if ($scope.interestRate.AtMaturity) {
                        $scope.interestRate.MinPeriodOrInstallment = undefined;
                    }
                }


                if ($scope.InterestRates.length > 1 && $scope.InterestRates[$scope.InterestRates.length - 2].MaxPeriodOrInstallment === undefined) {
                    if ($scope.InterestRates[$scope.InterestRates.length - 1].AtMaturity) return;
                $scope.InterestRates[$scope.InterestRates.length - 2].MaxPeriodOrInstallment = $scope.InterestRates[$scope.InterestRates.length - 1].MinPeriodOrInstallment - 1;
            }
               
        }
         

     }

    $scope.initiateRate = function () {
        
        if ($scope.ProductType === "CBS" || $scope.ProductType === "LTS" || $scope.ProductType === undefined) {
            $scope.interestRate = {};
         //   $scope.interestRate.MaxPeriodOrInstallment === undefined ? $scope.interestRate.MinPeriodOrInstallment = 1 : $scope.interestRate.MinPeriodOrInstallment = $scope.interestRate.MaxPeriodOrInstallment+1;
            if ($scope.InterestRates.length < 1) $scope.interestRate.MinPeriodOrInstallment = 1;
            //$scope.interestRate.MaxPeriodOrInstallment = '';
            // $scope.interestRate.IsDependentOnDurationNotInstallment                
            $scope.interestRate.MinLoanAmount = $scope.interestRate.MaxLoanAmount;

            $scope.interestRate.MaxLoanAmount = 0;
            // $scope.interestRate.InterestRate = 0;
            if ($scope.ProductType === "CBS"){ $scope.interestRate.IsDependentOnDurationNotInstallment = true;
                $scope.interestRate.InstallmentFrequencyId = 2;
            }
            if ($scope.ProductType === "LTS") { $scope.interestRate.IsDependentOnDurationNotInstallment = false;
                $scope.interestRate.InstallmentFrequencyId = 2;
            }
            if ($scope.InterestRates.length > 0) {
                $scope.interestRate.StartDate = angular.copy($scope.InterestRates[0].StartDate);
                    //moment($scope.InterestRates[$scope.InterestRates.length - 1].StartDate).format('DD-MM-YYYY');
                //$scope.InterestRates[$scope.InterestRates.length - 1].EndDate !=
                //   undefined ? $scope.interestRate.EndDate = moment($scope.InterestRates[$scope.InterestRates.length - 1].EndDate) :$scope.interestRate.EndDate= undefined;

                if ($scope.InterestRates[0].EndDate !== undefined) {
                    $scope.interestRate.EndDate = angular.copy($scope.InterestRates[0].EndDate);
                }

              //  $scope.InterestRates[$scope.InterestRates.length - 1].fEndDate ? $scope.interestRate.StartDate = moment($scope.InterestRates[$scope.InterestRates.length - 1].EndDate).add('days', 1) : $scope.interestRate.StartDate = undefined;
            }
            if($scope.ProductType === "CBS" ) {
                $scope.changeAtmaturity();
            }
            
        }
        else {
           
           
             $scope.interestRate = {};
                if ($scope.InterestRates.length > 0) {
                    $scope.InterestRates[$scope.InterestRates.length - 1].fEndDate ? $scope.interestRate.StartDate = moment($scope.InterestRates[$scope.InterestRates.length - 1].EndDate).add('days', 1) : $scope.interestRate.StartDate = undefined;
                }

             //   if ($scope.ProductType === 'LTS' || $scope.ProductType === "CBS") $scope.frequencywiseStepChanger();


        }

        //$scope.interestRate.MinPeriodOrInstallment = 0;
        //$scope.interestRate.MinLoanAmount = 0;
        ////console.log($scope.interestRate);
        //$scope.interestRate.StartDate = '';
        //$scope.interestRate.EndDate = '';
        if ($scope.InterestRates.length < 1) {
            $scope.interestRate.StartDate = angular.copy($scope.product.StartDate);
            $scope.interestRate.fStartDate = moment(angular.copy($scope.product.StartDate)).format("DD-MM-YYYY");

        }

        if ($scope.ProductType === 'LTS' || $scope.ProductType === "CBS") $scope.frequencywiseStepChanger();

        if ($scope.ProductType === 'General' && $scope.InterestRates.length < 1) {
            $scope.IRSBool = true;
        } else {
            $scope.IRSBool = false;
        }
    }
    $scope.changeAtmaturity=function() {
        if ($scope.interestRate.AtMaturity !== undefined && $scope.interestRate.AtMaturity) {
            
            $scope.periodDisabler = false;
            $scope.interestRate.MinPeriodOrInstallment = undefined;
            $scope.interestRate.MaxPeriodOrInstallment = undefined;
        } else {
            $scope.periodDisabler = true;
           
        }
        
    }

    $scope.changeBool = function (bool) {
        $scope.bool = bool;

    }


    $scope.dropdownSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        displayProp: 'Name',
        idProp: 'Value'
    }

    $scope.dropdownSetting_2 = {
        scrollable: true,
        scrollableHeight: '200px',
        displayProp: 'Name',
        idProp: 'value'
    }

    $scope.dropdownSetting_3 = {
        scrollable: true,
        scrollableHeight: '200px',
        displayProp: 'BranchName',
        idProp: 'BranchId',
        enableSearch: true,
        searchField: 'BranchName',
        showCheckAll: false,
        showUncheckAll: false
    }



    $scope.alphanumericValidator = function (name) {
        if (name === undefined)
            return "invalid";
        if (!/^[\w\-\s]+$/.test(name)) {
            return "Only AlphaNumeric is allowed";
        }
        return true;
    }


    $scope.getFilters = function () {
        savingsProductService.getSavingsProductFilterData().then(function (response) {
            $scope.statusList = response.data.Statuses;
            var today = moment($scope.serverDateTimeToday).format('YYYY-MM-DD');
            var startDate = moment($scope.product.StartDate).format('YYYY-MM-DD');
            $scope.product.StartDate = new Date($scope.product.StartDate);
            $scope.product.EndDate = moment($scope.serverDateTimeToday).format('YYYY-MM-DD');
            $scope.product.EndDate = new Date($scope.product.EndDate);
            if (today === startDate) {
                $scope.product.Status = $scope.statusList[0].Value;
            } else {
                $scope.product.Status = $scope.statusList[1].Value;
            }
            $scope.calculationPeriods = response.data.calculationPeriods;
            $scope.compoundingPeriods = response.data.compoundingPeriods;
            $scope.savingsInstallmentFrequencies = response.data.savingInstallmentFrequencies;

            $scope.savingsInstallmentFrequenciesLTS = $scope.savingsInstallmentFrequencies.filter(f => f.Name === 'Monthly');

            $scope.interestCalculationMethods = response.data.interestCalculatedUsingBalance;
            $scope.interestPostingPeriods = response.data.interestPostingPeriods;
            $scope.savingsProductCategories = response.data.savingsProductCategories;
            $scope.savingsDurantionInYears = response.data.savingsDurantionInYears;
            $scope.cbsIntallmentFrequency = response.data.cbsIntallmentFrequency;
            $scope.activeLoanProducts = response.data.activeLoanProducts;
            console.log($scope.activeLoanProducts);
            //console.log(response.data);
        });
    }

    
    $scope.dropdownSetting_4 = {
        scrollable: true,
        scrollableHeight: '200px',
        displayProp: 'Name',
        idProp: 'Id'
    }


    $scope.getFees = function () {
        feeService.getByAppliesTo($scope.savingsFee).then(function (response) {
            $scope.savingsFeeList = response.data;
            $scope.LateFees = $scope.savingsFeeList.filter(e => e.ChargeType === 2);
            $scope.oneTimeFees = $scope.savingsFeeList.filter(e => e.ChargeType === 3);
            $scope.periodicFees = $scope.savingsFeeList.filter(e => e.ChargeType === 4);
            console.log($scope.savingsFeeList);
            
        });
    }



    $scope.productCategoryChange = function () {
        if ($scope.product.SavingsType === 2) {
            $scope.ProductType = "General";
            $scope.loanOrDeposit = 'Loan';

            $scope.product.InterestCalculationMethod = $rootScope.SavingsConfig.InterestCalculatedUsingBalance.AverageMonthly;
            $scope.product.InterestCompoundingPeriod = 7;
            $scope.product.MaxCountPerMember = 1;
           
        }
        if ($scope.product.SavingsType === 4) {
            $scope.ProductType = "LTS";
            $scope.loanOrDeposit = 'Deposit';

            $scope.product.MaxCountPerMember = 5;
            $scope.product.InterestCompoundingPeriod = 7;
            $scope.product.InterestPostingPeriod = 8;
            $scope.product.InterestCalculationMethod = $rootScope.SavingsConfig.InterestCalculatedUsingBalance.AverageMonthly;

        }
        if ($scope.product.SavingsType === 3) {
            $scope.ProductType = "CBS";
            $scope.loanOrDeposit = 'Loan';
            $scope.product.InterestCalculationMethod = $rootScope.SavingsConfig.InterestCalculatedUsingBalance.AverageMonthly;
            $scope.product.MaxCountPerMember = 1;
        }

        $scope.InterestRates = [];
        $scope.InterestRatesCopy = [];
        $scope.product.AmmsSavingProductAmountFrequencies = [];

        $scope.interestRate = {};
        $scope.validationBool = false;

    }

    $scope.deleteIrateTable= function() {
        $scope.InterestRates = [];
        $scope.InterestRatesCopy = [];
    }


    $scope.addAmountFrequency = function () {
        
        // console.log($scope.product.AmmsSavingProductAmountFrequencies);
        //$scope.count++;
        // console.log($scope.count);
        var freq = {};
        freq.MinLoanAmount = 0;
        freq.MaxLoanAmount = 0;
        $scope.ProductType === "LTS" ? freq.InstallmentFrequencyId = $scope.savingsInstallmentFrequencies[1].Value : freq.InstallmentFrequencyId = $scope.savingsInstallmentFrequencies[0].Value;
        //freq.MandatorySavingsAmount = 1;
        $scope.ProductType === "LTS" ? freq.Duration = 5 : freq.Duration = 0;
        freq.installmentAmounts = [];

        freq.maturityTotalAmount = 1;
        freq.AutoRenewCount = 0;
        freq.TotalNumberOfInstallment = 1;
        
        if ($scope.ProductType === "General") {
            freq.AllowedLoanProducts = $scope.product.AmmsSavingProductAmountFrequencies.length > 0 ?
              angular.copy($scope.product.AmmsSavingProductAmountFrequencies[$scope.product.AmmsSavingProductAmountFrequencies.length - 1].AllowedLoanProducts) : [];
        }

        $scope.product.AmmsSavingProductAmountFrequencies.push(freq);
        $scope.addInstallmentAmount(freq.installmentAmounts);
        console.log($scope.product.AmmsSavingProductAmountFrequencies);



        // $scope.addInstallmentAmount($scope.product.AmmsSavingProductAmountFrequencies[$scope.count].installmentAmounts);
        //console.log($scope.product.AmmsSavingProductAmountFrequencies);
    }
    $scope.checkTotalNumberOfInstallMentIsZeroAndCalculateInstallmentAmount = function (number, index) {
        if (number == undefined) {
            $scope.product.AmmsSavingProductAmountFrequencies[index].TotalNumberOfInstallment = 1;
            
        }
        $scope.product.AmmsSavingProductAmountFrequencies[index].maturityTotalAmount = $scope.product.AmmsSavingProductAmountFrequencies[index].TotalNumberOfInstallment * $scope.product.AmmsSavingProductAmountFrequencies[index].MandatorySavingsAmount;
    }
    $scope.checkMandatorySavingsAmountIsZeroAndCalculateInstallmentAmount = function (amount, index) {
        if (amount == undefined) {
            $scope.product.AmmsSavingProductAmountFrequencies[index].MandatorySavingsAmount = 1;

        }
        $scope.product.AmmsSavingProductAmountFrequencies[index].maturityTotalAmount = $scope.product.AmmsSavingProductAmountFrequencies[index].TotalNumberOfInstallment * $scope.product.AmmsSavingProductAmountFrequencies[index].MandatorySavingsAmount;
    }
    $scope.checkMultipleOfIsZero = function (value) {
        if (value == undefined) {
            $scope.product.MultiplesOf = 1;
        }
    }
    $scope.checkMaxCountPerMemberIsZero = function (value) {
        if (value == undefined) {
            $scope.product.MaxCountPerMember = 1;
        }
    }



    $scope.addInstallmentAmount = function (installmentAmounts) {
        var index = {};
        index.amount = 0;
        installmentAmounts.push(index);
        //console.log(installmentAmounts);
        if ($scope.ProductType === 'LTS') {
            $scope.installmentAmountValidator(installmentAmounts);
        }
       

    }
   
    $scope.amountConditionChecker = function (items,amountBools) {

       items.forEach(function (amountobj) {
           if (amountobj.amount % $scope.product.MultiplesOf !== 0 || amountobj.amount === 0) {
               $scope.amountBool = true;
           } else { $scope.amountBool = false; }
           amountBools.push($scope.amountBool);
       });
    }

    $scope.singleBoolChecker = function (item, amountBools) {

        
            if (item % $scope.product.MultiplesOf !== 0 || item === 0 || item === undefined) {
                $scope.amountBool = true;
            } else {
                $scope.amountBool = false;
            } amountBools.push($scope.amountBool);
       }


    $scope.installmentAmountValidator = function (amounts) {




        //if ($scope.ProductType !== 'CBS') {
        //    var tempList = [];
        //    amounts.forEach(function (amountObjs) {
        //        if (amountObjs.amounts !== undefined)
        //            amountObjs.amounts.forEach(function (amount) {
        //                tempList.push(amount);
        //            });

        //    });
        //    amounts = angular.copy(tempList);
        //}

        

        var amountBools = [];
        if ($scope.ProductType === 'LTS') {
            var tempList = [];
            amounts.forEach(function(amountObjs) {
                if (amountObjs.installmentAmounts !== undefined)
                    amountObjs.installmentAmounts.forEach(function(amount) {
                        tempList.push(amount);
                    });
            });
            amounts = angular.copy(tempList);


            $scope.amountConditionChecker(amounts, amountBools);
            $scope.boolListChecker(amountBools);

        }
        if ($scope.ProductType === 'CBS') {
            $scope.product.AmmsSavingProductAmountFrequencies.forEach(function (item) {
                if (item.MandatorySavingsAmount % $scope.product.MultiplesOf !== 0 || item.MandatorySavingsAmount === 0) {
                    $scope.amountBool = true;
                } else { $scope.amountBool = false; }
                amountBools.push($scope.amountBool);
            });
            $scope.boolListChecker(amountBools);
        }


        if ($scope.ProductType === 'General') {
            if ($scope.product.AmmsSavingProductAmountFrequencies.length > 0) {
                $scope.product.AmmsSavingProductAmountFrequencies.forEach(function (item) {
                    if (item.MandatorySavingsAmount % $scope.product.MultiplesOf !== 0 || item.MandatorySavingsAmount === 0) {
                        $scope.amountBool = true;
                    } else { $scope.amountBool = false; }
                    amountBools.push($scope.amountBool);
                });

            }
            $scope.singleBoolChecker($scope.product.DefaultSavingAmount, amountBools);
            $scope.singleBoolChecker($scope.product.MinSavingAmount, amountBools);
            $scope.singleBoolChecker($scope.product.MaxSavingAmount, amountBools);
            $scope.singleBoolChecker($scope.product.DefaultSavingAmountMonthly, amountBools);
            $scope.singleBoolChecker($scope.product.MinSavingAmountMonthly, amountBools);
            $scope.singleBoolChecker($scope.product.MaxSavingAmountMonthly, amountBools);
            $scope.boolListChecker(amountBools);

        }
    }

    $scope.boolListChecker=function(amountBools) {
        amountBools.forEach(function (item) {
            if (item === true) $scope.amountBool = true;
        });
    }

  
   

    $scope.initinstamont = function () {
        $scope.product.AmmsSavingProductAmountFrequencies = [];
        $scope.product.MaturityTotalPrincipal = 0;
        // $scope.clearModelData();
        // $timeout(function() {  }, 1000);
          $scope.initiateRate();
        // $timeout(function () { $scope.addAmountFrequency(); $scope.addInstallmentAmount($scope.product.AmmsSavingProductAmountFrequencies[0].installmentAmounts); }, 900);

    }

    $scope.addInterestRateCopy=function() {
        // $scope.InterestRatesCopy = angular.copy($scope.InterestRates);
       
        if ($scope.InterestRates.length > 0 && $scope.ProductType !== 'General' && $scope.interestRate.StartDate !== undefined) {
            $scope.InterestRates.forEach(function(ir) {

                ir.StartDate = angular.copy($scope.interestRate.StartDate);
                ir.fStartDate = moment(ir.StartDate).format('DD-MM-YYYY');
                ir.EndDate = angular.copy($scope.interestRate.EndDate);
                ir.fEndDate = $scope.interestRate.EndDate !== undefined ? moment(ir.EndDate).format('DD-MM-YYYY') : '';


            });
            $scope.InterestRatesCopy = angular.copy($scope.InterestRates);
        } else {
            $scope.InterestRatesCopy = angular.copy($scope.InterestRates);
        }
       if ($scope.InterestRates.length > 0) {
           $scope.IRSBool = false;
       }
    }
    //$scope.arrayCompare=function() {
    //    if (!$scope.InterestRatesCopy.length == $scope.InterestRates.length && $scope.InterestRatesCopy.every(function (element, index) {
    //        return element === $scope.InterestRates[index];
    //    })) {
            
    //    }
    //}


    $scope.addInterestRate = function () {

        $scope.validRate = true;


        var reqfields1 = [
              ["MinPeriodOrInstallment", "Minimum Installment or period"],
              ["InterestRate", "Service Charge Rate"],
              ["StartDate", "Start Date"],
              ["InstallmentFrequencyId", "Installment Frequency"]
        ];




        var reqfields2 = [
                ["InterestRate", "Interest Rate"],
                ["StartDate", "Start Date"]
        ];

        var reqfields3 = [
          ["InterestRate", "Service Charge Rate"],
           ["StartDate", "Start Date"],
            ["MinPeriodOrInstallment", "Minimum Installment or period"]
        ];
        var reqfields4 = [
          ["InterestRate", "Service Charge Rate"],
           ["StartDate", "Start Date"]
           ];

        //  var reqfields = ($scope.ProductType === "General") ? reqfields2 : reqfields1;
        var reqfields = [];

        if ($scope.ProductType === "General") {
            reqfields = reqfields2;
        } else if ($scope.ProductType === "LTS") {
            reqfields = reqfields1;
        } else if (!$scope.interestRate.AtMaturity && $scope.ProductType==='CBS') {
            reqfields = reqfields3;
        }
        else if ($scope.interestRate.AtMaturity && $scope.ProductType === 'CBS') {
            reqfields = reqfields4;
        }


        reqfields.forEach(function (field) {
           if (!$scope.interestRate[field[0]]&& $scope.interestRate[field[0]] !== 0) {
               // if ($scope.interestRate.AtMaturity)return;
                swal(field[1] + " is Required ");
                $scope.validRate = false;

            }
        });

        if ($scope.ProductType === 'CBS' && $scope.InterestRates.length > 0) {
            var retBool = false;
            $scope.InterestRates.forEach(function (rate) {
                if (rate.AtMaturity ) {
                    swal('Interest period range is already difned till account maturity. Please remove that row before adding any other range!');
                    retBool = true;
                }
            });
            if (retBool)return;
            //if ($scope.InterestRates[$scope.InterestRates.length - 1].AtMaturity) {

            //}
        }

        if (!$scope.validRate) return;
        if ($scope.validationBool) { swal('please select valid period or installment range'); return; }
        //ammsw - 329
        if ($scope.InterestRates.length > 0 && $scope.ProductType === 'General') {
            $scope.InterestRates[$scope.InterestRates.length - 1].fEndDate = moment($scope.interestRate.StartDate).add('days', -1).format('DD-MM-YYYY');
            $scope.InterestRates[$scope.InterestRates.length - 1].EndDate =moment((moment($scope.interestRate.StartDate).add('days', -1)));
        } else {
            if ($scope.InterestRates.length > 0 && ($scope.ProductType === 'LTS' || $scope.ProductType === 'CBS')) {
                if ($scope.interestRate != undefined &&
                    ($scope.interestRate.StartDate !== $scope.InterestRates[0].StartDate || $scope.interestRate.EndDate !== $scope.InterestRates[0].EndDate)) {

                    $scope.InterestRates.forEach(function (rate) {
                        rate.StartDate = angular.copy($scope.interestRate.StartDate);
                        rate.fStartDate = moment(rate.StartDate).format('DD-MM-YYYY');
                        rate.EndDate = angular.copy($scope.interestRate.EndDate);
                        rate.fEndDate =   rate.EndDate !== undefined? rate.fEndDate = moment(rate.EndDate).format('DD-MM-YYYY'):'';
                       
                    });
                }
               
            }
           
            
        }

        if (($scope.ProductType === 'CBS' || $scope.ProductType === 'LTS') && $scope.InterestRates.length < 1) {
           
            $scope.interestRate.MinPeriodOrInstallment = 1;
        }

        if ($scope.interestRate.AtMaturity !== undefined) {
            if ($scope.interestRate.AtMaturity) {
                $scope.interestRate.MinPeriodOrInstallment = undefined;
            }
        }


        $scope.addMap();
        // console.log($scope.isEdit);
        if ($scope.isEdit) {
            $scope.InterestRates[$scope.editIndex] = angular.copy($scope.interestRate);
            $scope.editIndex = -1;
            $scope.isEdit = false;

        } else {

            $scope.InterestRates.push(angular.copy($scope.interestRate));

        }
        //console.log($scope.InterestRates);

        // $scope.initiateRate();
        $scope.initiateRate();
      //  if ($scope.ProductType === 'LTS' || $scope.ProductType === "CBS") $scope.frequencywiseStepChanger();
        return;

    }


    //$scope.IRdateValidation = function ($dates) {

    //    if ($scope.InterestRates.length > 0) {
           
    //        var minD = new Date($scope.InterestRates[0].StartDate).setHours(0, 0, 0, 0);
    //        var maxD = $scope.InterestRates[$scope.InterestRates.length - 1].EndDate ? new Date($scope.InterestRates[$scope.InterestRates.length - 1].EndDate).setHours(0, 0, 0, 0) : moment($scope.interestRate.StartDate);
    //            maxD = moment(maxD).add('days', 1);
    //            if ($dates.length > 27) {
    //                for (d in $dates) {
    //                    if ($dates.hasOwnProperty(d)) {
    //                        if ($dates[d].utcDateValue >= minD && $dates[d].utcDateValue <= maxD) {
    //                            $dates[d].selectable = false;
    //                        }
    //                    }
    //                }
    //            }
            
    //    }

    //    if ($scope.interestRate.EndDate !=undefined && moment($scope.interestRate.StartDate) > moment($scope.interestRate.EndDate)) {
    //        swal('End date can not greater than start date!');
    //        $scope.interestRate.EndDate = undefined;
    //    }
    //}


    $scope.getServerDateTime = function ($date) {
        commonService.getServerDateTime().then(function (response) {
            $scope.serverDateTimeToday = response.data;
            $scope.product.StartDate = moment(angular.copy($scope.serverDateTimeToday)).format();
            $scope.interestRate.StartDate = moment(angular.copy($scope.serverDateTimeToday)).format();
            $scope.startDateRender($date);
        });
    }
    $scope.beforeStartDateRender = function ($dates) {
        if ($scope.serverDateTimeToday) {
            $scope.startDateRender($dates);
        } else {
            $scope.getServerDateTime($dates);
        }
    }
    $scope.startDateRender = function ($dates) {
        var minDate = new Date($scope.serverDateTimeToday).setUTCHours(0, 0, 0, 0);
        if ($dates.length > 27) {
            var nextThreeMonthsDate = new Date(minDate);
            nextThreeMonthsDate.setMonth(nextThreeMonthsDate.getMonth() + 3);
            var maxDate = new Date(nextThreeMonthsDate).setUTCHours(0, 0, 0, 0);
            for (d in $dates) {
                if ($dates.hasOwnProperty(d)) {
                    if ($dates[d].utcDateValue < minDate || $dates[d].utcDateValue > maxDate) {
                        $dates[d].selectable = false;
                    }
                }
            }
        }
        $scope.changeStatusOption();

    }
    $scope.beforeEndDateRender = function ($dates) {
        //console.log($scope.product.StartDate);
        var minDate = new Date($scope.product.StartDate).setHours(0, 0, 0, 0);
        minDate = new Date(minDate);
        minDate.setDate(minDate.getDate() + 1);
        minDate = minDate.setHours(0, 0, 0, 0);
        if ($scope.product.EndDate != null && $scope.product.EndDate < minDate) {
            swal('End date can not be less than start date');
            $scope.product.EndDate = new Date(minDate);
        }
        if ($dates.length > 27) {
            for (d in $dates) {
                if ($dates.hasOwnProperty(d)) {
                    if ($dates[d].utcDateValue <= minDate) {
                        $dates[d].selectable = false;
                    }
                }
            }
        }
        //AMMSW-221
        //console.log($scope.product.EndDate);
        //if ($scope.product.EndDate !== undefined) {
        //    $scope.product.Status = 3;
        //}

    }
    $scope.changeStatusOption = function () {
        if ($scope.statusList.length > 0) {
            var today = moment($scope.serverDateTimeToday).format('YYYY-MM-DD');
            var startDate = moment($scope.product.StartDate).format('YYYY-MM-DD');
            if (today === startDate) {
                $scope.product.Status = $scope.statusList[0].Value;
            } else {
                $scope.product.Status = $scope.statusList[1].Value;
            }
        }

    }
    $scope.removeEndDate = function () {
        $scope.product.EndDate = undefined;
    }
    $scope.removeinterestRateEndDate = function () {

        $scope.interestRate.EndDate = undefined;

    }

    $scope.serviceChargeCalcPeriodChange = function () {
        if ($scope.product.InterestCalculationPeriod === 1) {
            $scope.product.InterestCalculationMethod = 1;
            $scope.ServiceChargeCalculationMethoddisabled = true;
        } else {
            $scope.product.InterestCalculationMethod = 2;
            $scope.ServiceChargeCalculationMethoddisabled = false;
        }
    }

    $scope.addMap = function () {
        //console.log($scope.interestRate);
        $scope.interestRate.fStartDate = moment($scope.interestRate.StartDate).format('DD-MM-YYYY');
        $scope.interestRate.fEndDate = (angular.isDefined($scope.interestRate.EndDate)) ? moment($scope.interestRate.EndDate).format('DD-MM-YYYY') : "";
        $scope.interestRate.StartDate = moment($scope.interestRate.StartDate).format();
        $scope.interestRate.EndDate = (angular.isDefined($scope.interestRate.EndDate)) ? moment($scope.interestRate.EndDate).format() : undefined;
        if ($scope.interestRate.InstallmentFrequencyId) $scope.interestRate.frequencyName = $scope.savingsInstallmentFrequencies.filter(e => e.Value === $scope.interestRate.InstallmentFrequencyId)[0].Name;
        $scope.range = ($scope.interestRate.IsDependentOnDurationNotInstallment) ? "Duration Range" : "Installment Range";


    }
    $scope.beforeInterestRateStartDateRender = function ($dates) {
        if (!$scope.serverDateTimeToday) {
            $scope.getServerDateTime($dates);
        }
        var minDate = new Date($scope.serverDateTimeToday).setHours(0, 0, 0, 0);
        if ($dates.length > 27) {
            for (d in $dates) {
                if ($dates.hasOwnProperty(d)) {
                    if ($dates[d].utcDateValue < minDate) {
                        $dates[d].selectable = false;
                    }
                }
            }
        }
       
        // if ($scope.ProductType === 'General') $scope.IRdateValidation($dates);
        if ($scope.InterestRates.length > 0 && $scope.ProductType === 'General') {
            var minD = new Date($scope.InterestRates[0].StartDate).setHours(0, 0, 0, 0);
            var maxD = new Date($scope.InterestRates[$scope.InterestRates.length - 1].EndDate).setHours(0, 0, 0, 0);

            if ($scope.InterestRates[$scope.InterestRates.length - 1].EndDate != undefined) {
                 maxD = new Date($scope.InterestRates[$scope.InterestRates.length - 1].EndDate).setHours(0, 0, 0, 0);
            } else if ($scope.InterestRates.length > 1) {
                var temp = $scope.InterestRates[$scope.InterestRates.length - 1].StartDate;
                maxD = new Date(temp).setHours(0, 0, 0, 0);
            } else {
                maxD = new Date($scope.InterestRates[0].StartDate).setHours(0,0,0,0);
            }

            var selectedDate = new Date($scope.interestRate.StartDate).setHours(0,0,0,0);
            
            if (selectedDate >= minD && selectedDate <= maxD) {
                    swal('Date range is already selected once!');
                    $scope.interestRate.StartDate = moment(maxD).add('days', 1);
                    return;
                }
             }
        
    }

    $scope.beforeInterestRateEndDateRender = function ($dates) {
      
        var minDate = new Date($scope.serverDateTimeToday);
      
        if ($scope.InterestRates.length > 0) {
            if ($scope.InterestRates[$scope.InterestRates.length - 1].EndDate != undefined) minDate = new Date($scope.InterestRates[$scope.InterestRates.length - 1].EndDate).setHours(0, 0, 0, 0);
            
            if ($scope.InterestRates[$scope.InterestRates.length-1].StartDate!=undefined) minDate=new Date($scope.InterestRates[$scope.InterestRates.length-1].StartDate).setHours(0, 0, 0, 0);
           
        }
        if ($scope.interestRate.StartDate != undefined) minDate = new Date($scope.interestRate.StartDate).setHours(0, 0, 0, 0);

       if ($dates.length > 27) {
            for (d in $dates) {
                if ($dates.hasOwnProperty(d)) {
                    if ($dates[d].utcDateValue < minDate) {
                        $dates[d].selectable = false;
                    }
                }
            }
        }
        if ($scope.interestRate.EndDate != undefined && new Date($scope.interestRate.EndDate).setHours(0,0,0,0) < minDate) {
            swal('End date can not be less than start date');
            $scope.interestRate.EndDate = undefined;
            return;
            
        }

      
    }

    $scope.init = function () {
        $scope.getFilters();
        declareVariable();
        $scope.initinstamont();
        $scope.initiateRate();
        $scope.getFees();

        //$timeout(function() { $scope.addAmountFrequency(); },1000);
        //console.log($scope.InterestRate);

    }

    $scope.removeWithIndex = function (listName, index) {
        
        listName.splice(index, listName.length);

        if (listName.length === 0 && $scope.ProductType === 'General') {
            listName = [];
            if ($scope.InterestRates.length < 1) {
                $scope.IRSBool = true;
            }
            $scope.initiateRate();
            return;
        }
        $scope.initiateRate();
    }

    $scope.removeFromList = function (listName, item) {
        $scope.product[listName].splice($scope.product[listName].indexOf(item), 1);
    }



    $scope.removeFromListAttr = function (rate, rates, propertyName) {
        var value = rate.hashKey;
        var i = AMMS.findWithAttr(rates, propertyName, value);
        if(rates.length>1)
        rates.splice(i, 1);
    }

    $scope.editInterestRate = function (rate, index, bool) {

        $scope.isEdit = true;

        $scope.editIndex = index;
        $scope.interestRate = rate;
        $("#myModalHorizontal").modal();
    }

    

    $('#myModalHorizontal').on('hidden.bs.modal', function (e) {
        $scope.isEdit = false;
    });


    $scope.clearModelData = function () {
        declareVariable();
    }

    $scope.clearAndCloseTab = function () {
        $scope.product = {};
        $timeout(function () {
            $('#saveComplete').modal('hide');
            $('.modal-backdrop').remove();
        }, 500);
        $scope.execRemoveTab($scope.tab);
    };


    $scope.assignVarValsLTS = function () {
        var allFrequencies = [];
        $scope.product.AmmsSavingProductAmountFrequencies.forEach(function (freq) {
            if (!freq.installmentAmounts)return;
            freq.installmentAmounts.forEach(function (fr) {

                $scope.product.EndDate = ($scope.product.EndDate !== undefined) ? moment($scope.product.EndDate).format() : undefined;
                $scope.product.StartDate = moment($scope.product.StartDate).format();
                // console.log(fr);
                var freqs = {};
                freqs.MandatorySavingsAmount = fr.amount;
                freqs.InstallmentFrequencyId = freq.InstallmentFrequencyId;
                freqs.Duration = freq.Duration;
                freqs.AutoRenewCount = freq.AutoRenewCount;
                freqs.MinLoanAmount = 0;
                freqs.MaxLoanAmount = 0;
                freqs.TotalNumberOfInstallment = freq.TotalNumberOfInstallment;
                allFrequencies.push(angular.copy(freqs));

                $scope.finProduct = $scope.product;
                $scope.backupFrequencies = angular.copy($scope.product.AmmsSavingProductAmountFrequencies);
                $scope.finProduct.AmmsSavingProductAmountFrequencies = allFrequencies;
                // console.log($scope.finProduct.AmmsSavingProductAmountFrequencies);
            });
        });
    }
    $scope.assignVarValsGeneral = function () {
        var allFrequencies = [];
        if ($scope.product.AmmsSavingProductAmountFrequencies.length<1 )return;
        $scope.product.AmmsSavingProductAmountFrequencies.forEach(function (freq) {
          
            freq.AllowedLoanProducts.forEach(function (fr) {

              // console.log(fr);
                var freqs = {};
                freqs.LoanProductId = fr.id;
                freqs.MandatorySavingsAmount = freq.MandatorySavingsAmount;
                freqs.InstallmentFrequencyId = freq.InstallmentFrequencyId;
                freqs.MinAmount = freq.MinAmount;
                freqs.MaxAmount = freq.MaxAmount;
                allFrequencies.push(angular.copy(freqs));

                
                // console.log($scope.finProduct.AmmsSavingProductAmountFrequencies);
            });
        });
        $scope.finProduct = $scope.product;
        $scope.backupFrequencies = angular.copy($scope.product.AmmsSavingProductAmountFrequencies);
        $scope.finProduct.AmmsSavingProductAmountFrequencies = allFrequencies;
        console.log($scope.finProduct.AmmsSavingProductAmountFrequencies);
    }

    $scope.IRValidationCheck = function () {

        

        if ($scope.interestRate.MaxPeriodOrInstallment!==undefined && $scope.interestRate.MinPeriodOrInstallment > $scope.interestRate.MaxPeriodOrInstallment) {
            $scope.validationBool = true;
            $scope.validationText = 'please select valid period or installment range';
            }
        //} else if ($scope.InterestRates.length > 0 && $scope.interestRate.MinPeriodOrInstallment !== undefined) {
        //    if ($scope.InterestRates[0].MinPeriodOrInstallment < $scope.interestRate.MinPeriodOrInstallment && $scope.InterestRates[$scope.InterestRates.length - 1].MaxPeriodOrInstallment < $scope.interestRate.MinPeriodOrInstallment) {
        //        $scope.validationBool = true;
        //        $scope.validationText = 'please select valid period or installment range';
        //    }
            //}

        else if ($scope.InterestRates.length > 0 &&
            $scope.interestRate.MinPeriodOrInstallment <= $scope.InterestRates[$scope.InterestRates.length - 1].MaxPeriodOrInstallment) {
            $scope.validationBool = true;
            $scope.validationText = 'please select valid period or installment range';
        }
        else if ($scope.InterestRates.length > 0 && $scope.InterestRates[$scope.InterestRates.length - 1].MaxPeriodOrInstallment === undefined &&
       $scope.interestRate.MinPeriodOrInstallment <= $scope.InterestRates[$scope.InterestRates.length - 1].MinPeriodOrInstallment) {
            $scope.validationBool = true;
            $scope.validationText = 'please select valid period or installment range';
        }
            else if ( $scope.InterestRates.length>0 ) {
                var minParray = $scope.InterestRates.map(function (a) { return a.MinPeriodOrInstallment });
                var counter = 0;
                minParray.forEach(function (nm) {
                   
                    if (nm === undefined) {
                        minParray[counter] = 0;
                        counter = 0;
                       
                    }
                    counter++;
                });
                var minPmax = Math.max.apply(Math, minParray);
                var maxParray = $scope.InterestRates.map(function (a) { return a.MaxPeriodOrInstallment });
                counter = 0;
                maxParray.forEach(function (nm) {

                    if (nm === undefined) {
                        maxParray[counter] = 0;
                        counter = 0;
                       
                    }
                    counter++;
                });
                var maxPmax = Math.max.apply(Math, maxParray);
                var realMax = maxPmax;
                if (minPmax > maxPmax) realMax = minPmax;
           if ($scope.interestRate.MinPeriodOrInstallment <= realMax) {
               $scope.validationBool = true;
               $scope.validationText = 'please select valid period or installment range';
           } else {
               $scope.validationBool = false;
               $scope.validationText = '';
           }

        }

        else {
            $scope.validationBool = false;
            $scope.validationText = '';
        }
    }

    $scope.maxAccountValidator = function () {
        //validator deactivated on 17 oct 2k17
        //validator="maxAccountValidator() === true"
        //invalid-message="maxAccountValidator()"
        //ng-change="checkMaxCountPerMemberIsZero(product.MaxCountPerMember);"
       // validate-on="dirty"

        if ($scope.ProductType === 'LTS' && $scope.product.MaxCountPerMember >5) {
            return 'max 5 account is allowed for this product type!';
        }
        else if (($scope.ProductType === 'General' || $scope.ProductType === 'CBS') && $scope.product.MaxCountPerMember > 1) {
            return 'max 1 account is allowed for this product type! ';
       }
        return true;
    }

    $scope.maxIRateValidator=function() {
        if ($scope.interestRate.InterestRate > 100 || $scope.interestRate.InterestRate < 0)
            $scope.interestRate.InterestRate = undefined;
    }

   


    $scope.onSubmitForm = function () {
        if (!$scope.addSavingsProductForm.$valid) {
            $scope.addSavingsProductForm.$dirty = true;
        } else {
            $scope.addSavingsProductForm.$dirty = false;
        }
    }

    $scope.checkforDuplicatcbsValues=function() {
        $scope.cbsfrequencyKeyGenerator();
        $scope.cbsfrequencyhasduplicatevalue();
        return $scope.foundDuplicatecbsFrequency;
    }

    $scope.cbsfrequencyKeyGenerator = function () {
        $scope.cbskeys = [];
        $scope.product.AmmsSavingProductAmountFrequencies.forEach(function(frequency) {
            var key = frequency.InstallmentFrequencyId + '_' + frequency.TotalNumberOfInstallment + '_' + frequency.MandatorySavingsAmount;
            $scope.cbskeys.push(key);
        });
    }
    $scope.cbsfrequencyhasduplicatevalue = function () {
        $scope.foundDuplicatecbsFrequency = false;
        $scope.cbskeys.forEach(function (key) {
            var value = $scope.cbskeys.reduce((a, e, i) => (e === key) ? a.concat(i) : a, []);
            if (value.length > 1) {$scope.foundDuplicatecbsFrequency = true; return;}
           
        });
    }


    $scope.addSavingsProduct = function () {
       

        if ($scope.ProductType === "CBS") {
            console.log();
            if ($scope.checkforDuplicatcbsValues()) {
                swal('Warning', "one or more duplicate frequency settings found in 'Installment Amount & Frequency Information' !", 'warning');
                return;
            }
            $scope.product.AmmsSavingProductAmountFrequencies.forEach(function (f) {
                if (f.InstallmentFrequencyId === 1) {
                    $scope.product.MinSavingAmount = f.MandatorySavingsAmount;
                    $scope.product.MaxSavingAmount = f.MandatorySavingsAmount;
                    $scope.product.DefaultSavingAmount = f.MandatorySavingsAmount;
                }
                if (f.InstallmentFrequencyId === 2) {
                    $scope.product.MinSavingAmountMonthly = f.MandatorySavingsAmount;
                    $scope.product.MaxSavingAmountMonthly = f.MandatorySavingsAmount;
                    $scope.product.DefaultSavingAmountMonthly = f.MandatorySavingsAmount;
                }
            });
        }

        //if ($scope.amountBool) {
        //    swal("please input valid Installment Amounts in 'Installment Amount & Frequency Information' Block");
        //    return;
        //}

        if ($scope.amountBool) {
            swal("please input valid Installment Amounts in 'Installment Amount & Frequency Information' Block");
            return;
        }

        $scope.product.StartDate = moment($scope.product.StartDate).format();
        $scope.product.EndDate = $scope.product.EndDate !== undefined ? moment($scope.product.EndDate).format() : undefined;

       


        if ($scope.product.StartDate >= $scope.product.EndDate) {
            swal("End date can not be less than or equal to Start date");
            return;
        }
        if ($scope.InterestRatesCopy.length < 1) {
            swal("Interest Table can't be empty ");
            return;
        }
        if ($scope.product.IsVaryingAmountFrequency && $scope.product.AmmsSavingProductAmountFrequencies.length < 1) {
            swal("product have varying amount and frequency but no data is added");
            return;
        }

        if (($scope.ProductType === "LTS" || $scope.ProductType === "CBS") && $scope.product.AmmsSavingProductAmountFrequencies.length < 1) {
            swal("product have varying amount and frequency but no data is added");
            return;
        }
     //   $scope.product.MaturityTotalPrincipal = $scope.product.AmmsSavingProductAmountFrequencies[0].maturityTotalAmount;

        $scope.product.AmmsRateMatrices = $scope.InterestRatesCopy;
        console.log($scope.product);



        if ($scope.docError) {
            swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');
            // $scope.docError = false;
            return;
        }

       
       

        swal({
            title: "Confirm?",
            text: $rootScope.showMessage($rootScope.addConfirmation, $rootScope.savingProduct),
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
            cancelButtonText: 'Cancel'
        },
       function (isConfirm) {
           if (isConfirm) {
               { $scope.product.OneTimeFeeIds = $scope.product.OneTimeFeeIds.map(function (a) { return a.id }); }

               { $scope.product.PeriodicFeeIds = $scope.product.PeriodicFeeIds.map(function (a) { return a.id }); }


               if ($scope.ProductType === 'LTS') {
                   $scope.assignVarValsLTS();
               }
               if ($scope.ProductType === 'General') {
                   $scope.assignVarValsGeneral();
               }

               var sentProduct = {};
               if ($scope.ProductType === 'LTS' || ($scope.ProductType === 'General' && $scope.product.AmmsSavingProductAmountFrequencies.length > 0)) {
                   sentProduct = $scope.finProduct;
               } else {
                   sentProduct = $scope.product;
               }

               if (sentProduct !== undefined && sentProduct !== null) {
                   sentProduct.AmmsRateMatrices.forEach(function (rate) {

                       if (rate.EndDate != undefined)
                           rate.EndDate = moment(rate.EndDate).format();
                   });
               }
             
               //$scope.sentProduct.AmmsRateMatrices.forEach(function (rate) {

               //    rate.EndDate = moment(rate.EndDate.setHours(12,0,0,0)).format();
               //});
               //$scope.fetchFeeObjectfromFeeId();
               console.log(sentProduct);
               savingsProductService.add(sentProduct).then(function (response) {
                   if (response.data.Success) {
                       //console.log(response.data);
                       if (response.data.Entity.Id && $scope.files.length > 0) {
                           documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.SavingsProduct, $rootScope.user.UserId)
                               .then(function (res) {
                                   if (res.data.Success) {
                                       $rootScope.$broadcast('savingsproduct-add-finished', $scope.product);
                                       swal({
                                           title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.savingProduct),
                                           text: "What do you want to do next?",
                                           type: "success",
                                           showCancelButton: true,
                                           confirmButtonColor: "#008000",
                                           confirmButtonText: "Add New",
                                           cancelButtonText: "Close and Exit",
                                           closeOnConfirm: true,
                                           closeOnCancel: true
                                       },
                                           function (isConfirm) {
                                               if (isConfirm) {
                                                   $scope.addSavingsProductForm.reset();
                                                   $scope.addSavingsProductForm.$dirty = false;
                                                   $scope.clearModelData();
                                                   $scope.init();
                                               } else {
                                                   $scope.clearAndCloseTab();
                                               }
                                           });

                                   } else {
                                      
                                       swal($rootScope.docAddError, res.data.Message, "error");
                                   }

                               });

                       } else {
                           $rootScope.$broadcast('savingsproduct-add-finished', $scope.product);
                           swal({
                               title: $rootScope.showMessage($rootScope.addSuccess, $rootScope.savingProduct),
                               text: "What do you want to do next?",
                               type: "success",
                               showCancelButton: true,
                               confirmButtonColor: "#008000",
                               confirmButtonText: "Add New",
                               cancelButtonText: "Close and Exit",
                               closeOnConfirm: true,
                               closeOnCancel: true
                           },
                            function (isConfirm) {
                                if (isConfirm) {
                                    $scope.addSavingsProductForm.reset();
                                    $scope.addSavingsProductForm.$dirty = false;
                                    $scope.clearModelData();
                                    $scope.init();
                                } else {
                                    $scope.clearAndCloseTab();
                                }
                            });

                       }

                   } else {
                       $scope.product.AmmsSavingProductAmountFrequencies = $scope.backupFrequencies;
                       swal($rootScope.showMessage($rootScope.addError, $rootScope.savingProduct), response.data.Message, "error");
                   }
               });
           }

            
       });
    }


    //upload document
    $scope.removefile = function (file, files, propertyName) {
        var value = file.name;
        var i = AMMS.findWithAttr(files, propertyName, value);
        files.splice(i, 1);
        $scope.docSizeBoolChecker();
    }


    //new datepicker
    $scope.today = function () {
        $scope.product.StartDate = new Date();
        $scope.product.EndDate = new Date();

    };
    $scope.today();


    //$scope.clear = function () {
    //    $scope.member.AdmissionDate = null;
    //};

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date($scope.serverDateTimeToday),
        showWeeks: true
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
          mode = data.mode;
        //console.log((new Date($rootScope.workingdate)).getDate);
        return (mode === 'day' && (date.getDay() === 5))
            || (moment(date) > moment(new Date($scope.serverDateTimeToday)).add(1, 'days'));
    }
    function disabled2(data) {
        var date = data.date,
          mode = data.mode;
        //console.log((new Date($rootScope.workingdate)).getDate);
        return (mode === 'day' && (date.getDay() === 5)
            );
    }
    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2040, 5, 22),
        minDate: new Date($scope.serverDateTimeToday),
        startingDay: 1
    };

    $scope.dateOptions2 = {
        dateDisabled: disabled2,
        formatYear: 'yy',
        maxDate: new Date(2040, 5, 22),
        minDate: new Date($rootScope.workingdate),
        startingDay: 1
    };

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($scope.serverDateTimeToday.getDate() + 1);
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.openStartDate = function () {
        $scope.popupStartDate.opened = true;
    };
    $scope.openEndDate = function () {
        $scope.popupEndDate.opened = true;
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $rootScope.formats[4];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popupStartDate = {
        opened: false
    };
    $scope.popupEndDate = {
        opened: false
    };


    function getDayClass(data) {
        console.log(data);
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
    $scope.startDateValidator = function () {
        var maxDate = moment($scope.serverDateTimeToday).format("YYYY-MM-DD");
        var minDate = moment($scope.serverDateTimeToday).format("YYYY-MM-DD");
        if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM) {
            maxDate = moment($scope.serverDateTimeToday).add(1, 'days').valueOf();
            minDate = moment($scope.serverDateTimeToday).add(1, 'days').valueOf();
        }
        else if ($scope.roleId == $rootScope.rootLevel.RM) {
            maxDate = moment($scope.serverDateTimeToday).add(1, 'days').valueOf();
            minDate = moment($scope.serverDateTimeToday).add(-1, 'months').valueOf();
        }
        else if ($scope.roleId == $rootScope.rootLevel.DM) {
            maxDate = moment($scope.serverDateTimeToday).add(1, 'days').valueOf();
            minDate = moment($scope.serverDateTimeToday).add(-3, 'months').valueOf();
        } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
            maxDate = moment($scope.serverDateTimeToday).add(1, 'days').valueOf();
            minDate = moment($scope.serverDateTimeToday).add(-50, 'years').valueOf();
        }
        //if (moment($scope.product.StartDate).valueOf() < moment($scope.product.EndDate).valueOf()) {
        //    swal('please select valid admission date!');
        //    $scope.today();
        //    return;
        //}
        if (moment($scope.product.StartDate).valueOf() > maxDate || moment($scope.product.StartDate).valueOf() < minDate) {
            swal('please select valid date!');
            $scope.today();
            return;
        }


        if (moment($scope.product.StartDate) > moment(new Date($scope.serverDateTimeToday) + 1)) {
            swal("unable to select future date!");
            $scope.today();
            return;
        }

        //$scope.isHolidayOrOffDay($scope.product.StartDate);
    }
    $scope.endDateValidator = function () {
        if (moment($scope.product.EndDate) < moment(new Date($scope.product.StartDate))) {
            swal("unable to select past date!");
            $scope.today();
            return ;
        }

    }
    $scope.init();
}
]);