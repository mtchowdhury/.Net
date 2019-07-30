ammsAng.controller('savingsProductEditController', [
    '$scope', '$rootScope', '$timeout', 'savingsProductService','documentService', 'commonService','feeService',
    function ($scope, $rootScope, $timeout, savingsProductService, documentService, commonService, feeService) {
        var declareVariable = function () {
            $scope.allowAllValue = -100000;
            $scope.allowNone = -999999;
            $scope.product = {};
            $scope.statusList = [];
            $scope.product.AmmsSavingProductAmountFrequencies = [];
            $scope.InterestRates = [];
            $scope.interestRate = {};
            $scope.product.typeName = "Savings";
            $scope.ProductType = "";
            $scope.loanOrDeposit = 'Loan';
            $scope.editIndex = -1;
            $scope.range = "Range";
            $scope.IsVersionChanged = false;
            $scope.IsStatusChanged = false;
            $scope.maturityAmounts = [];
            $scope.property = '';
            $scope.keys = [];
            $scope.duplicateIndecies = [];
            $scope.product.DefaultInstallmentFrequency = 2;
            $scope.product.DefaultInstallmentFrequencyMonthly = 1;
            $scope.uploadedFiles = [];
            $scope.files = [];
            $scope.serverDateTimeToday = undefined;
            $scope.savedStartDay = undefined;
            $scope.interestRateSavedStartDate = undefined;
            $scope.periodDisabler = true;
            $scope.savingsFeeList = [];
            $scope.LateFees = [];
            $scope.oneTimeFees =[];
            $scope.periodicFees = [];
            $scope.savingsFee = 2;
            $scope.product.OneTimeFeeIds = [];
            $scope.product.PeriodicFeeIds = [];
            $scope.product.LateFeeObject = {};
            $scope.validationBool = false;
        }


        $scope.$watch('files', function () {
            $scope.docSizeBoolChecker();
        });
        $scope.$watch('uploadedFiles', function () {
            $scope.docSizeBoolChecker();
        });

        $scope.docSizeBoolChecker = function () {
            $scope.fileSize = 0;
            $scope.uploadedFiles.forEach(function (file) {
                $scope.fileSize += file.Size;
                if ($scope.fileSize > (1024 * 1024) * ($rootScope.documentSize)) {
                    $scope.docError = true;
                    return;
                }
            });
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
        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value',
            buttonClasses: 'custom-button-sprod'
        }

        $scope.checkMultipleOfAmountForDSAW = function (amount) {
            if (!amount)
                return "Field is Required";
            if (amount % $scope.product.MultiplesOf != 0)
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
            if (!$scope.product.AmmsSavingProductAmountFrequencies[index].MandatorySavingsAmount)
                return "Field is Required";
            if ($scope.product.AmmsSavingProductAmountFrequencies[index].MandatorySavingsAmount % $scope.product.MultiplesOf != 0)
                return "Value should be multiple of " + $scope.product.MultiplesOf;
            return true;
        }

        $scope.frequencywiseStepChanger = function () {


            if ($scope.InterestRates.length > 0) {

                $scope.interestRate.MinPeriodOrInstallment = $scope.InterestRates[$scope.InterestRates.length - 1].MaxPeriodOrInstallment ? $scope.InterestRates[$scope.InterestRates.length - 1].MaxPeriodOrInstallment + 1 :
              undefined;

                if ($scope.interestRate.AtMaturity !== undefined) {
                    if ($scope.interestRate.AtMaturity) {
                        $scope.interestRate.MinPeriodOrInstallment = undefined;
                    }
                }


                if ($scope.InterestRates.length > 1 && $scope.InterestRates[$scope.InterestRates.length - 2].MaxPeriodOrInstallment === undefined) {
                    $scope.InterestRates[$scope.InterestRates.length - 2].MaxPeriodOrInstallment = $scope.InterestRates[$scope.InterestRates.length - 1].MinPeriodOrInstallment - 1;
                }

            }


        }

        
        $scope.initiateRate = function () {

            if ($scope.ProductType === "CBS" || $scope.ProductType === "LTS" || $scope.ProductType === undefined) {
                $scope.interestRate = {};
               // $scope.interestRate.MaxPeriodOrInstallment === undefined ? $scope.interestRate.MinPeriodOrInstallment = 1 : $scope.interestRate.MinPeriodOrInstallment = $scope.interestRate.MaxPeriodOrInstallment + 1;
                if ($scope.InterestRates.length < 1) $scope.interestRate.MinPeriodOrInstallment = 1;
             //   $scope.interestRate.MaxPeriodOrInstallment = '';
                // $scope.interestRate.IsDependentOnDurationNotInstallment                
                $scope.interestRate.MinLoanAmount = $scope.interestRate.MaxLoanAmount;

                $scope.interestRate.MaxLoanAmount = 0;
                // $scope.interestRate.InterestRate = 0;
                if ($scope.ProductType === "CBS") {
                    $scope.interestRate.IsDependentOnDurationNotInstallment = true;
                    $scope.interestRate.InstallmentFrequencyId = 2;
                }
                if ($scope.ProductType === "LTS") {
                    $scope.interestRate.IsDependentOnDurationNotInstallment = false;
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
                    else if ($scope.InterestRates[0].fEndDate !== undefined) {
                        $scope.interestRate.EndDate = angular.copy($scope.InterestRates[0].fEndDate);
                    }

                    //  $scope.InterestRates[$scope.InterestRates.length - 1].fEndDate ? $scope.interestRate.StartDate = moment($scope.InterestRates[$scope.InterestRates.length - 1].EndDate).add('days', 1) : $scope.interestRate.StartDate = undefined;
                }
                if ($scope.ProductType === "CBS") {
                    $scope.changeAtmaturity();
                }

            }
            else {


                $scope.interestRate = {};
                if ($scope.InterestRates.length > 0) {
                    $scope.InterestRates[$scope.InterestRates.length - 1].fEndDate ? $scope.interestRate.StartDate = moment($scope.InterestRates[$scope.InterestRates.length - 1].EndDate).add('days', 1) : $scope.interestRate.StartDate = undefined;
                }



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
            delete $rootScope.editSavingsProductId;
        }
        $scope.addInterestRateCopy = function () {
             $scope.InterestRatesCopy = angular.copy($scope.InterestRates);
            if ($scope.InterestRates.length > 0 && $scope.ProductType !== 'General' && $scope.interestRate.StartDate!==undefined) {
                $scope.InterestRates.forEach(function (ir) {

                    //rate.StartDate = angular.copy($scope.interestRate.StartDate);
                    //rate.fStartDate = moment(new Date(rate.StartDate)).format('DD-MM-YYYY');
                    //rate.EndDate = angular.copy($scope.interestRate.EndDate);
                    //if (rate.EndDate !== null) rate.fEndDate = moment(rate.EndDate).format('DD-MM-YYYY');
                    ir.StartDate = angular.copy($scope.interestRate.StartDate);
                    ir.fStartDate = moment(ir.StartDate).format('DD-MM-YYYY');
                    ir.EndDate = angular.copy($scope.interestRate.EndDate);
                    ir.fEndDate = $scope.interestRate.EndDate !== null ? moment(ir.EndDate).format('DD-MM-YYYY') : '';

                });
                $scope.InterestRatesCopy = angular.copy($scope.InterestRates);
            }
           

        }

        $scope.changeAtmaturity = function () {
            if ($scope.interestRate.AtMaturity !== null && $scope.interestRate.AtMaturity) {
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

        $scope.dropdownSetting_4 = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: "Id"
        }


        $scope.alphanumericValidator = function (name) {
            if (!name) return "false";
            if (!/^[\w\-\s]+$/.test(name)) {
                return "Only AlphaNumeric is allowed";
            }
            return true;
        }


        $scope.getFilters = function () {
            savingsProductService.getSavingsProductFilterData().then(function (response) {

                $scope.statusList = response.data.Statuses;
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
                $scope.getProductInfo();
                
            });
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
            }
            if ($scope.product.SavingsType === 4) {
                $scope.ProductType = "LTS";
                $scope.loanOrDeposit = 'Deposit';

            }
            if ($scope.product.SavingsType === 3) {
                $scope.ProductType = "CBS";
                $scope.loanOrDeposit = 'Loan';

            }

            $scope.interestRate = {};
            $scope.validationBool = false;

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


        $scope.addAmountFrequency = function () {
           
            var freq = {};
            freq.MinLoanAmount = 0;
            freq.MaxLoanAmount = 0;
            freq.InstallmentFrequencyId = $scope.ProductType === "LTS" ? $scope.savingsInstallmentFrequencies[1].Value : $scope.savingsInstallmentFrequencies[0].Value;
            $scope.ProductType === "LTS" ? freq.Duration = 5 : freq.Duration = 0;
            freq.MandatorySavingsAmount = 1;
            freq.amounts = [];

            freq.maturityTotalAmount = 1;
            freq.AutoRenewCount = 0;
            freq.TotalNumberOfInstallment = 1;

            if ($scope.ProductType === "General") {
                freq.AllowedLoanProducts = $scope.product.AmmsSavingProductAmountFrequencies.length > 0 ?
                  angular.copy($scope.product.AmmsSavingProductAmountFrequencies[$scope.product.AmmsSavingProductAmountFrequencies.length - 1].AllowedLoanProducts) : [];
            }
            $scope.product.AmmsSavingProductAmountFrequencies.push(freq);
            $scope.addInstallmentAmount(freq.amounts);
           
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



        $scope.addInstallmentAmount = function (amounts) {
            var index = {};
            index.amount = 0;
            amounts.push(index);
            //console.log(amounts);
           // console.log($scope.product.AmmsSavingProductAmountFrequencies);
        }



        $scope.amountConditionChecker = function (items, amountBools) {

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
            if ($scope.ProductType !== 'CBS') {
                var tempList = [];
                amounts.forEach(function (amountObjs) {
                    if (amountObjs.amounts !== undefined)
                        amountObjs.amounts.forEach(function (amount) {
                            tempList.push(amount);
                        });

                });
                amounts = angular.copy(tempList);
            }
               
            
            var amountBools = [];
            if ($scope.ProductType === 'LTS') {
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

        $scope.boolListChecker = function (amountBools) {
            amountBools.forEach(function (item) {
                if (item === true) $scope.amountBool = true;
            });
        }





        $scope.initinstamont = function () {
            if ($scope.product.AmmsSavingProductAmountFrequencies.length < 1) {
                $scope.product.AmmsSavingProductAmountFrequencies = [];
                $scope.product.MaturityTotalPrincipal = 0;
            }
            
          

        }

        $scope.calculateMaturityAmount = function (installmentNo, amount, index) {
            if (isNaN(installmentNo)) return;
            if (isNaN(amount)) return;
          
            $scope.product.AmmsSavingProductAmountFrequencies[index].maturityTotalAmount = installmentNo * amount;
          
        }

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
                if (!$scope.interestRate[field[0]] && $scope.interestRate[field[0]] !== 0) {
                   // if ($scope.interestRate.AtMaturity) return;
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
                if (retBool) return;
                //if ($scope.InterestRates[$scope.InterestRates.length - 1].AtMaturity) {

                //}
            }

            if (!$scope.validRate) return;
            if ($scope.validationBool) { swal('please select valid period or installment range'); return; }
            //ammsw - 329
            if ($scope.InterestRates.length > 0 && $scope.ProductType === 'General') {
                $scope.InterestRates[$scope.InterestRates.length - 1].fEndDate = moment($scope.interestRate.StartDate).add('days', -1).format('DD-MM-YYYY');
                $scope.InterestRates[$scope.InterestRates.length - 1].EndDate = new Date(moment($scope.interestRate.StartDate).add('days', -1));
            } else {
                if ($scope.InterestRates.length > 0 && ($scope.ProductType === 'LTS' || $scope.ProductType === 'CBS')) {
                    if ($scope.interestRate != undefined &&
                        ($scope.interestRate.StartDate !== $scope.InterestRates[0].fStartDate || $scope.interestRate.EndDate !== $scope.InterestRates[0].fEndDate)) {

                        $scope.InterestRates.forEach(function (rate) {
                            rate.StartDate = angular.copy($scope.interestRate.StartDate);
                            rate.fStartDate = moment(rate.StartDate).format('DD-MM-YYYY');
                            rate.EndDate = angular.copy($scope.interestRate.EndDate);
                            rate.fEndDate = rate.EndDate !== null ? rate.fEndDate = moment(rate.EndDate).format('DD-MM-YYYY') : '';
                            
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
         //   if ($scope.ProductType === 'LTS' || $scope.ProductType === "CBS") $scope.frequencywiseStepChanger();
            return;

        }

        //$scope.IRValidationCheck = function () {
        //    if ($scope.interestRate.MinPeriodOrInstallment > $scope.interestRate.MaxPeriodOrInstallment) {
        //        $scope.validationBool = true;
        //        $scope.validationText = 'please select valid period or installment range';
        //    } else {
        //        $scope.validationBool = false;
        //        $scope.validationText = '';
        //    }
        //}


        $scope.IRValidationCheck = function () {



            if ($scope.interestRate.MaxPeriodOrInstallment !== undefined && $scope.interestRate.MinPeriodOrInstallment > $scope.interestRate.MaxPeriodOrInstallment) {
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
            else if ( $scope.InterestRates.length > 0) {
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



        $scope.addMap = function () {
            //console.log($scope.interestRate);
            $scope.interestRate.StartDate = moment($scope.interestRate.StartDate).format();
            $scope.interestRate.EndDate = ($scope.interestRate.EndDate!=null) ? moment($scope.interestRate.EndDate).format() : null;
            $scope.interestRate.fStartDate = moment($scope.interestRate.StartDate).format('DD-MM-YYYY');
            console.log($scope.interestRate.EndDate);
            $scope.interestRate.fEndDate = ($scope.interestRate.EndDate!== null) ? moment($scope.interestRate.EndDate).format('DD-MM-YYYY') : "";
            console.log($scope.interestRate.fEndDate);
            if ($scope.interestRate.InstallmentFrequencyId && $scope.interestRate.InstallmentFrequencyId !==$scope.allowAllValue) $scope.interestRate.frequencyName = $scope.savingsInstallmentFrequencies.filter(e => e.Value === $scope.interestRate.InstallmentFrequencyId)[0].Name;
            $scope.range = ($scope.interestRate.IsDependentOnDurationNotInstallment) ? "Duration Range" : "Installment Range";
           

        }

        $scope.assignVarVals = function () {
            $scope.product.AmmsRateMatrices = $scope.InterestRates;
            $scope.product.EndDate = ($scope.product.EndDate) ? moment($scope.product.EndDate).format() : null;
            $scope.product.StartDate = moment($scope.product.StartDate).format();
            var allFrequencies = [];
            $scope.product.AmmsSavingProductAmountFrequencies.forEach(function (freq) {
                if (!freq.amounts) return;
                freq.amounts.forEach(function (fr) {
                   // console.log(fr);
                    var freqs = angular.copy(freq);
                    delete freqs.$id;
                    freqs.MandatorySavingsAmount = fr.amount;
                    freqs.InstallmentFrequencyId = freq.InstallmentFrequencyId;
                    freqs.Duration = freq.Duration;
                    freqs.AutoRenewCount = freq.AutoRenewCount;
                    //freqs.MinLoanAmount = 0;
                    //freqs.MaxLoanAmount = 0;
                    freqs.TotalNumberOfInstallment = freq.TotalNumberOfInstallment;
                    allFrequencies.push(angular.copy(freqs));

                    $scope.finProduct = angular.copy($scope.product);
                    $scope.backupFrequencies = angular.copy($scope.product.AmmsSavingProductAmountFrequencies);

                    
                    //console.log($scope.finProduct.AmmsSavingProductAmountFrequencies);
                });
            });
            $scope.finProduct.AmmsSavingProductAmountFrequencies = allFrequencies;
        }
        $scope.assignVarValsGeneral = function () {
            var allFrequencies = [];
            if ($scope.product.AmmsSavingProductAmountFrequencies.length < 1) return;
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



        
        $scope.beforeStartDateRender = function ($dates) {
            if ($scope.serverDateTimeToday) {
                $scope.startDateRender($dates);
            } else {
                $scope.getServerDateTime($dates);
            }
            
        }
        $scope.getServerDateTime = function ($date) {
            commonService.getServerDateTime().then(function (response) {
                $scope.serverDateTimeToday = response.data;
                //$scope.product.StartDate = moment(angular.copy($scope.serverDateTimeToday)).format();
                $scope.startDateRender($date);
            });
        }
        $scope.startDateRender = function ($dates) {
            var startDate = new Date($scope.savedStartDay).setHours(0, 0, 0, 0);
            var systemDate = new Date($scope.serverDateTimeToday).setHours(0, 0, 0, 0);
            var selectedDate = startDate > systemDate ? systemDate : startDate;
            if ($dates.length > 27) {
                var nextThreeMonthsDate = new Date(selectedDate);
                nextThreeMonthsDate.setMonth(nextThreeMonthsDate.getMonth() + 3);
                var maxDate = new Date(nextThreeMonthsDate).setHours(0, 0, 0, 0);
                if (startDate < systemDate) {
                    for (d in $dates) {
                        if ($dates[d].utcDateValue < startDate || $dates[d].utcDateValue > maxDate) {
                            $dates[d].selectable = false;
                        }
                    }
                } else if (systemDate < startDate) {
                    for (d in $dates) {
                        if ($dates[d].utcDateValue < systemDate || $dates[d].utcDateValue > maxDate) {
                            $dates[d].selectable = false;
                        }
                    }
                } else {
                    for (d in $dates) {
                        if ($dates[d].utcDateValue < startDate || $dates[d].utcDateValue > maxDate) {
                            $dates[d].selectable = false;
                        }
                    }
                }

            }
            var newStartday = new Date($scope.product.StartDate).setHours(0, 0, 0, 0);
            var saveStartDay = new Date($scope.savedStartDay).setHours(0, 0, 0, 0);
            if (saveStartDay !== newStartday) {
                $scope.changeStatusOption();
            }
        }

        $scope.beforeEndDateRender = function ($dates) {
            var minDate = new Date($scope.product.StartDate).setHours(0, 0, 0, 0);
            minDate = new Date(minDate);
            minDate.setDate(minDate.getDate() + 1);
            minDate = minDate.setHours(0, 0, 0, 0);
            if ($scope.product.EndDate < minDate && $scope.product.EndDate!=undefined) {
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
            
        }


        $scope.changeStatusOption = function () {
            if ($scope.statusList.length > 0) {
                var today = new Date($scope.serverDateTimeToday).setHours(0,0,0,0);
                var startDate = new Date($scope.product.StartDate).setHours(0, 0, 0, 0);
                  if ( startDate <=today) {
               // if($scope.product.StartDate<=$scope.serverDateTimeToday){
                    $scope.product.Status = $scope.statusList[0].Value;
                } else {
                    $scope.product.Status = $scope.statusList[1].Value;
                }
            }

        }
        $scope.beforeInterestRateStartDateRender = function ($dates) {
            if (!$scope.serverDateTimeToday) {
                $scope.getServerDateTime($dates);
            }
            var minDate = new Date($scope.serverDateTimeToday);
            if($scope.InterestRates.length>0)
             minDate = new Date($scope.InterestRates[$scope.InterestRates.length-1].StartDate).setHours(0, 0, 0, 0);
            if ($dates.length > 27) {
                for (d in $dates) {
                    if ($dates.hasOwnProperty(d)) {
                        if ($dates[d].utcDateValue < minDate) {
                            $dates[d].selectable = false;
                        }
                    }
                }
            }

            
            if ($scope.InterestRates.length > 0 && $scope.ProductType === 'General') {
                var minD = new Date($scope.InterestRates[0].StartDate).setHours(0, 0, 0, 0);
                var maxD = new Date($scope.InterestRates[$scope.InterestRates.length - 1].EndDate).setHours(0, 0, 0, 0);

                if ($scope.InterestRates[$scope.InterestRates.length - 1].EndDate != undefined) {
                    maxD = new Date($scope.InterestRates[$scope.InterestRates.length - 1].EndDate).setHours(0, 0, 0, 0);
                } else if ($scope.InterestRates.length > 1) {
                    var temp = $scope.InterestRates[$scope.InterestRates.length - 1].StartDate;
                    maxD = new Date(temp).setHours(0, 0, 0, 0);
                } else {
                    maxD = new Date($scope.InterestRates[0].StartDate).setHours(0, 0, 0, 0);
                }


                if ($scope.interestRate.StartDate >= minD && $scope.interestRate.StartDate <= maxD) {
                    swal('Date range is already selected once!');
                    $scope.interestRate.StartDate = moment(maxD).add('days', 1);
                    return;
                }

            }

        }

        

        $scope.beforeInterestRateEndDateRender = function($dates) {
            var minDate = new Date($scope.serverDateTimeToday);
            if ($scope.ProductType === 'General') {


                if ($scope.InterestRates.length > 0) {
                    if ($scope.InterestRates[$scope.InterestRates.length - 1].EndDate != undefined) minDate = new Date($scope.InterestRates[$scope.InterestRates.length - 1].EndDate).setHours(0, 0, 0, 0);

                    if ($scope.InterestRates[$scope.InterestRates.length - 1].StartDate != undefined) minDate = new Date($scope.InterestRates[$scope.InterestRates.length - 1].StartDate).setHours(0, 0, 0, 0);

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
                if (($scope.interestRate.EndDate !== null || $scope.interestRate.EndDate !== undefined) && new Date($scope.interestRate.EndDate).setHours(0, 0, 0, 0) < minDate) {
                    swal('End date can not be less than start date');
                    $scope.interestRate.EndDate = undefined;
                    return;

                }
            }
            if ($scope.ProductType !== 'General') {
                minDate = new Date($scope.interestRate.StartDate).setHours(0, 0, 0, 0);
                if ($dates.length > 27) {
                    for (d in $dates) {
                        if ($dates.hasOwnProperty(d)) {
                            if ($dates[d].utcDateValue < minDate) {
                                $dates[d].selectable = false;
                            }
                        }
                    }
                }
                var formattedEndDate = moment($scope.interestRate.EndDate).format();
                var selectedDate = new Date(formattedEndDate).setHours(0, 0, 0, 0);

                if (( $scope.interestRate.EndDate !== undefined) && selectedDate < minDate) {
                    swal('End date can not be less than start date');
                    $scope.interestRate.EndDate = undefined;
                    return;
                }

            }
        }


        $scope.getProductInfo = function () {
            savingsProductService.getSavingsProductInfo($rootScope.editSavingsProductId).then(function (response) {
                $scope.product = response.data;
                $scope.product.StartDate = new Date($scope.product.StartDate);
                $scope.product.EndDate = new Date($scope.product.EndDate);
                $scope.savedStartDay = $scope.product.StartDate;
                console.log($scope.product);
                $scope.product.StartDate = new Date($scope.product.StartDate);
                $scope.product.EndDate = new Date($scope.product.EndDate);
                if ($scope.product.OneTimeFeeIds == null) {
                    $scope.product.OneTimeFeeIds = [];
                   
                  
                }
                if ($scope.product.PeriodicFeeIds == null) {
                    $scope.product.PeriodicFeeIds = [];
                }
                //console.log($scope.product.AmmsSavingProductAmountFrequencies);
               
               
                $scope.product.typeName = "Savings";
                $scope.InterestRates = $scope.product.AmmsRateMatrices;
                $scope.InterestRates.forEach(function (e) {
                    e.fStartDate = moment(e.StartDate).format('DD-MM-YYYY');
                    e.fEndDate = (e.EndDate !== null) ? moment(e.EndDate).format('DD-MM-YYYY') : "";
                    if ($scope.product.SavingsType !== 2) e.frequencyName = $scope.savingsInstallmentFrequencies.filter(x => x.Value === e.InstallmentFrequencyId)[0].Name;
                });
               
                $scope.productCategoryChange();
                $scope.oldProduct = angular.copy($scope.product);
             
                if ($scope.ProductType === "LTS") {
                     $scope.segregateAmountFrequency($scope.product.AmmsSavingProductAmountFrequencies);
                }
                if ($scope.ProductType === "General") {
                    $scope.segregatefrequenciesforGeneralProduct($scope.product.AmmsSavingProductAmountFrequencies);
                }

                documentService.getFilesbyEntity($scope.product.Id, $rootScope.FileUploadEntities.SavingsProduct).then(function (response) {
                    $scope.uploadedFiles = response.data;
                    $rootScope.SavingsProductFileHash = response.data && response.data.length > 0 ? response.data[0].Hash : '';
                });
               
                $scope.oldProduct.EndDate = ($scope.oldProduct.EndDate) ? moment($scope.oldProduct.EndDate).format() : null;
                $scope.oldProduct.StartDate = ($scope.oldProduct.StartDate) ? moment($scope.oldProduct.StartDate).format() : null;

                $scope.addInterestRateCopy();

                $timeout($scope.fetchFeeObjectfromFeeId(), 1000);
                $scope.initinstamont();
            });
            

           
        }


        $scope.fetchFeeObjectfromFeeId = function () {
            var idx = 0;
            if ($scope.product.OneTimeFeeIds.length > 0) {
               
                $scope.product.OneTimeFeeIds.forEach(function (item) {
                    var index = {};
                    index.id = item;
                    $scope.product.OneTimeFeeIds[idx] = angular.copy(index);
                    idx++;
                });
            }
            if ($scope.product.PeriodicFeeIds.length > 0) {
                idx = 0;
                $scope.product.PeriodicFeeIds.forEach(function(item) {
                    var index = {};
                    index.id = item;
                    $scope.product.PeriodicFeeIds[idx] = angular.copy(index);
                    idx++;
                });
            }
        }


        $scope.removeFromList = function (listName, item) {
            $scope.product[listName].splice($scope.product[listName].indexOf(item), 1);
        }

        $scope.removeItem = function (list, item) {
            if(list.length>1)
            list.splice( list.indexOf(item) ,1);
        }

        //$scope.removeWithIndex = function (listName, index) {
        //    listName.splice(index, 1);
        //}
        $scope.removeWithIndex = function (listName, index) {

            listName.splice(index, listName.length);
            //for only InterestRates splicing
            if (listName.length < 1) {
                $scope.interestRate = {};
                $scope.interestRate.EndDate = null;
            }

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

        $scope.removeEndDate = function () {
            $scope.product.EndDate = null;


        }
        $scope.removeinterestRateEndDate = function () {

            $scope.interestRate.EndDate = null;

        }




        $scope.generateKeys = function (frequencies) {

            frequencies.forEach(function (frequency) {
                var a = frequency.Duration;
                var b = frequency.AutoRenewCount;
                var c = frequency.InstallmentFrequencyId;
                var key = a + '-' + b + '-' + c;
                $scope.keys.push(key);

            });

        };

        $scope.findDuplicateKeys = function () {

            var duplicateValues = [];
            var sorted_arr = $scope.keys.slice().sort();
            var results = [];
            for (var i = 0; i < $scope.keys.length - 1; i++) {
                if (sorted_arr[i + 1] === sorted_arr[i]) {
                    results.push(sorted_arr[i]);
                }
            }
            $.each(results, function (i, el) {
                if ($.inArray(el, duplicateValues) === -1) duplicateValues.push(el);
            });
            return duplicateValues;
        }

        $scope.duplicateLoanProductObjectRemover=function() {
            $scope.product.AmmsSavingProductAmountFrequencies.forEach(function (fr) {
              //  var plainObjectList = fr.AllowedLoanProducts.map(function (a) { return a.id });
                var plainObjectList = angular.copy(fr.AllowedLoanProducts);
                plainObjectList.forEach(function(obj) {
                    while (plainObjectList.filter(o => o.id === obj.id).length > 1) {

                       plainObjectList.splice(plainObjectList.indexOf(obj),1);
                   }
                });
                fr.AllowedLoanProducts = angular.copy(plainObjectList);
                console.log(plainObjectList);
            });
          
        }

        $scope.segregateAmountFrequency = function (frequencies) {

            $scope.product.AmmsSavingProductAmountFrequencies.forEach(function (el) {
                var amounts = [];

                var index = {};

                index.amount = el.MandatorySavingsAmount;

                amounts.push(index);
                el.amounts = amounts;

            });

            $scope.generateKeys(frequencies);

            $scope.duplicateValues = $scope.findDuplicateKeys();

            do {

                var indecies = [];
                for (var j = 0; j < $scope.keys.length; j++) {
                    if ($scope.duplicateValues[0] === $scope.keys[j]) {
                        indecies.push(j);

                    }
                }

                if (indecies.length < 2) {
                    return;
                }

                var amounts = [];
                for (var j = indecies.length - 1; j >= 0 ; j--) {

                    var index = {};

                    index.amount = frequencies[indecies[j]].MandatorySavingsAmount;

                    
                    amounts.push(index);

                    if (j !== 0) {
                        $scope.product.AmmsSavingProductAmountFrequencies.splice(indecies[j], 1);

                    }

                }
                amounts.reverse();
                $scope.product.AmmsSavingProductAmountFrequencies[indecies[0]].amounts = amounts;
                //console.log($scope.product.AmmsSavingProductAmountFrequencies);
                $scope.keys = [];
                $scope.generateKeys(frequencies);
                $scope.duplicateValues = $scope.findDuplicateKeys();

            } while ($scope.duplicateValues.length > 0)
        }


        $scope.generateKeysGeneral = function (frequencies) {

            frequencies.forEach(function (frequency) {
                var key = frequency.InstallmentFrequencyId + '-' + frequency.MinAmount + '-' + frequency.MaxAmount + '-' + frequency.MandatorySavingsAmount;
                $scope.keys.push(key);

            });

        };
        $scope.segregatefrequenciesforGeneralProduct=function(frequencies) {
            $scope.generateKeysGeneral(frequencies);
            $scope.duplicateValues = $scope.findDuplicateKeys();
            console.log($scope.duplicateValues);
            do {

                var indecies = [];
                for (var j = 0; j < $scope.keys.length; j++) {
                    if ($scope.duplicateValues[0] === $scope.keys[j]) {
                        indecies.push(j);

                    }
                }

                if (indecies.length < 2) {

                    $scope.product.AmmsSavingProductAmountFrequencies.forEach(function(freq) {
                        var index = {};
                        index.id = angular.copy(freq.LoanProductId);
                        freq.AllowedLoanProducts = [];
                        freq.AllowedLoanProducts.push(index);

                    });

                    return;
                }

                //var amounts = [];
                var AllowedLoanProducts = [];

                for (var j = indecies.length - 1; j >= 0 ; j--) {

                    var index = {};

                    index.id = frequencies[indecies[j]].LoanProductId;


                    AllowedLoanProducts.push(index);

                    if (j !== 0) {
                        $scope.product.AmmsSavingProductAmountFrequencies.splice(indecies[j], 1);

                    }

                }
                AllowedLoanProducts.reverse();
                $scope.product.AmmsSavingProductAmountFrequencies[indecies[0]].AllowedLoanProducts = AllowedLoanProducts;
                //console.log($scope.product.AmmsSavingProductAmountFrequencies);
                $scope.keys = [];
                $scope.generateKeysGeneral(frequencies);
                $scope.duplicateValues = $scope.findDuplicateKeys();

            } while ($scope.duplicateValues.length > 0)
            console.log($scope.product.AmmsSavingProductAmountFrequencies);
            $scope.duplicateLoanProductObjectRemover();
        }


        $scope.maxAccountValidator = function () {
            if ($scope.ProductType === 'LTS' && $scope.product.MaxCountPerMember > 5) {
                return 'max 5 account is allowed for this product type!';
            }
            else if (($scope.ProductType === 'General' || $scope.ProductType === 'CBS') && $scope.product.MaxCountPerMember > 1) {
                return 'max 1 account is allowed for this product type! ';
            }
            return true;
        }





        $scope.init = function () {
            declareVariable();
            $scope.getFees();
            $scope.getFilters();
           // $scope.getProductInfo();
          //  $scope.initinstamont();
          //  $scope.initiateRate();
            
            $timeout($scope.serviceChargeCalcPeriodChange, 1000);
            //delete $rootScope.editSavingsProductId;
          }

        $scope.$on('tab-switched', function () {
            if ($rootScope.hasOwnProperty("editSavingsProductId")) {
                $scope.init();
            }
        });



        $scope.removeRate = function (rate, rates, propertyName) {
            var value = rate.hashKey;
            var i = AMMS.findWithAttr(rates, propertyName, value);
            rates.splice(i, 1);
        }

        $scope.editInterestRate = function (rate, index, bool) {

            $scope.isEdit = true;

            $scope.editIndex = index;
            $scope.interestRate = rate;
            $("#myModalHorizontalEdit").modal();
        }

        $scope.init();

        $('#myModalHorizontalEdit').on('hidden.bs.modal', function (e) {
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

        $scope.onSubmitForm = function () {
            if (!$scope.editSavingsProductForm.$valid) {
                $scope.editSavingsProductForm.$dirty = true;
            } else {
                $scope.editSavingsProductForm.$dirty = false;
            }
        }

        var checkArrayOfObjectChange = function (sources, targets)
        {
            if (sources.length !== targets.length) {
                $scope.IsVersionChanged = true;

            }
            else {
                targets.forEach(function(target) {
                    if (target.amounts)delete target.amounts;
                });


                sources.forEach(function (source) {
                    var found = false;
                    delete source.Id;
                    delete source.amounts;
                    delete source.maturityTotalAmount;
                    
                    targets.forEach(function (target) {
                        if (target.Id) delete target.Id;
                        if (angular.equals(source, target)) {
                            found = true;
                        }
                    });
                    if (!found) $scope.IsVersionChanged = true;
                });
            }

        };

       
        var detectChange = function () {
           
            var dontCareVariables = ["Description", "AmmsRateMatrices", "AmmsSavingProductAmountFrequencies", "MaxCountPerMember",
                "LockingPeriod", "IsEnforcedMinBalance", "MinBalanceAmount", "MinBalancePercentageOfActiveLoan", "MaxDepositInADay", "MaxWithdrawInADay"
                 , "DormantPeriod", "EndDate"];
           // console.log($scope.sentProduct);
           // console.log($scope.oldProduct);
            for (propertyName in $scope.sentProduct) {
                
                if (dontCareVariables.indexOf(propertyName) === -1) {
                    if (!angular.equals($scope.sentProduct[propertyName], $scope.oldProduct[propertyName])) {

                        $scope.IsVersionChanged = true;
                    }
                    //console.log(propertyName);
                    //console.log($scope.IsVersionChanged);
                    
                }
            }
            checkArrayOfObjectChange($scope.sentProduct.AmmsSavingProductAmountFrequencies, $scope.oldProduct.AmmsSavingProductAmountFrequencies);
            //console.log($scope.IsVersionChanged);

        }

        var detectStatusChange = function() {
            if ($scope.oldProduct.Status !== $scope.sentProduct.Status) {
                $scope.IsStatusChanged = true;
            }
        }


       $scope.deleteIrateTable=function() {
           $scope.InterestRates = [];
           $scope.InterestRatesCopy = [];
           $scope.interestRate = {};
           if ($scope.product.Status !== 3 && $scope.oldProduct.HasActiveAccount) $scope.IsVersionChanged = true;
          
       }
       $scope.maxIRateValidator = function () {
           if ($scope.interestRate.InterestRate > 100 || $scope.interestRate.InterestRate < 0)
               $scope.interestRate.InterestRate = undefined;
       }


       $scope.checkforDuplicatcbsValues = function () {
           $scope.cbsfrequencyKeyGenerator();
           $scope.cbsfrequencyhasduplicatevalue();
           return $scope.foundDuplicatecbsFrequency;
       }

       $scope.cbsfrequencyKeyGenerator = function () {
           $scope.cbskeys = [];
           $scope.product.AmmsSavingProductAmountFrequencies.forEach(function (frequency) {
               var key = frequency.InstallmentFrequencyId + '_' + frequency.TotalNumberOfInstallment + '_' + frequency.MandatorySavingsAmount;
               $scope.cbskeys.push(key);
           });
       }
       $scope.cbsfrequencyhasduplicatevalue = function () {
           $scope.foundDuplicatecbsFrequency = false;
           $scope.cbskeys.forEach(function (key) {
               var value = $scope.cbskeys.reduce((a, e, i) => (e === key) ? a.concat(i) : a, []);
               if (value.length > 1) { $scope.foundDuplicatecbsFrequency = true; return; }

           });
       }




        //upload document
       $scope.removefile = function (file, files, propertyName) {
           var value = file.name;
           var i = AMMS.findWithAttr(files, propertyName, value);
           files.splice(i, 1);
           $scope.docSizeBoolChecker();

       }

       $scope.removefileDB = function (file) {
           swal({
               title: "Are you sure?",
               text: "You will not be able to recover this file!",
               type: "warning",
               showCancelButton: true,
               confirmButtonColor: "#DD6B55",
               confirmButtonText: "Yes, delete it!",
               closeOnConfirm: false
           },
               function () {
                   documentService.deleteDocument(file.Id).then(function (response) {
                       if (response.data.Success) {
                           $scope.removefile(file, $scope.uploadedFiles, 'Name');
                       }
                   });

                   swal("Deleted!", "file has been deleted.", "success");
               });
       }

       $scope.removeLocalFile = function (hash) {
           if (hash) {
               documentService.deleteLocalDocument(hash);
               $scope.docSizeBoolChecker();
           }
       }




       $scope.editSavingsProduct = function () {

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
           if ($scope.amountBool) {
               swal("please input valid Installment Amounts in 'Installment Amount & Frequency Information' Block");
               return;
           }

           
           $scope.product.StartDate = moment($scope.product.StartDate).format();
           $scope.product.EndDate = ($scope.product.EndDate) ? moment($scope.product.EndDate).format() : null;

           //if ($scope.amountBool) {
           //    swal("please input valid Installment Amounts in 'Installment Amount & Frequency Information' Block");
           //    return;
           //}
          

           if ($scope.product.EndDate!==null && $scope.product.StartDate >= $scope.product.EndDate) {
                swal("End date can not be less than or equal to Start date");
                return;
            }
           if ($scope.InterestRatesCopy.length < 1) {
                swal("Interest Table can't be empty");
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
            //$scope.product.MaturityTotalPrincipal = $scope.product.AmmsSavingProductAmountFrequencies[0].maturityTotalAmount;

            $scope.product.AmmsRateMatrices = $scope.InterestRatesCopy;
            
            
            
            

            console.log($scope.product);

          

            if ($scope.docError) {
                swal("Please Select Files Below 3MB ! ", 'WARNING', 'warning');
                return;
            }

           


            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.editConfirmation, $rootScope.savingProduct),
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                cancelButtonText: 'Cancel'
            },
           function (isConfirm) {
               if (isConfirm) {

                   if ($scope.ProductType === 'LTS') {
                       $scope.assignVarVals();
                   }
                   if ($scope.ProductType === 'General') {
                       $scope.assignVarValsGeneral();
                   }


                   $scope.product.OneTimeFeeIds = $scope.product.OneTimeFeeIds.map(function (a) { return a.id });
                   $scope.product.PeriodicFeeIds = $scope.product.PeriodicFeeIds.map(function (a) { return a.id });
                   if ($scope.product.SavingsType === $rootScope.SavingsConfig.SavingsProductType.LTS) {
                       $scope.finProduct.OneTimeFeeIds = $scope.finProduct.OneTimeFeeIds.map(function (a) { return a.id });
                       $scope.finProduct.PeriodicFeeIds = $scope.finProduct.PeriodicFeeIds.map(function (a) { return a.id });
                   }
                   $scope.sentProduct = {};
                   if ($scope.ProductType === 'LTS' || ($scope.ProductType === 'General' && $scope.product.AmmsSavingProductAmountFrequencies.length > 0)) {
                       $scope.sentProduct = $scope.finProduct;
                   } else {
                       $scope.sentProduct = $scope.product;
                   }
                   //console.log($scope.sentProduct);

                   if ($scope.oldProduct.Status !== 3 && $scope.oldProduct.HasActiveAccount) {
                       detectChange();
                       detectStatusChange();
                   }


                   $scope.sentProduct.ChangeVersion = $scope.IsVersionChanged;
                   $scope.sentProduct.IsStatusChanged = $scope.IsStatusChanged;
                   $scope.sentProduct.OldStartDate = $scope.oldProduct.StartDate;
                 
                   // $scope.sentProduct.HasSameStartDate = ($scope.sentProduct.StartDate === $scope.oldProduct.StartDate);
                   //if ($scope.sentProduct.StartDate === $scope.oldProduct.StartDate) {
                   //    $scope.sentProduct.HasSameStartDate = 1;
                   //}
                      
                   
                   savingsProductService.edit($scope.sentProduct).then(function (response) {
                       //console.log(response.data);

                       var str = response.data.Message.split(" ");
                       var productId = str[0];
                       var versionNo = str[1];
                       if (response.data.Success) {
                           if (response.data.Entity.Id && $scope.files.length > 0) {
                               documentService.uploadFiles($scope.files, response.data.Entity.Id, $rootScope.FileUploadEntities.SavingsProduct, $rootScope.user.UserId)
                                   .then(function (res) {
                                       if (res.data.Success) {
                                           $rootScope.$broadcast('savingsproduct-edit-finished', $scope.product);
                                           $scope.removeLocalFile($rootScope.SavingsProductFileHash);
                                           if (!$scope.IsVersionChanged) swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.savingProduct), "Successful!", "success");
                                           if ($scope.IsVersionChanged) swal("Product (Id - " + productId + ") Added With New Version - " + versionNo, "Successfully!", "success");
                                           $scope.clearAndCloseTab();

                                       } else {
                                           swal($rootScope.docAddError, res.data.Message, "error");
                                       }
                                   });

                           } else {
                               $rootScope.$broadcast('savingsproduct-edit-finished', $scope.product);
                               $scope.removeLocalFile($rootScope.SavingsProductFileHash);
                               if (!$scope.IsVersionChanged) swal($rootScope.showMessage($rootScope.editSuccess, $rootScope.savingProduct), "Successful!", "success");
                               if ($scope.IsVersionChanged) swal("Product (Id - " + productId + ") Added With New Version - " + versionNo, "Successfully!", "success");
                               $scope.clearAndCloseTab();
                           }

                       } else {

                           $scope.product.AmmsSavingProductAmountFrequencies = $scope.backupFrequencies;
                           swal($rootScope.showMessage($rootScope.editError, $rootScope.savingProduct), response.data.Message, "error");
                       }
                   });

               }

               
           });
       }
        //new datepicker
       $scope.today = function () {
           $scope.product.StartDate = new Date($rootScope.workingdate);


       };
       $scope.interestRateToday = function () {
           $scope.interestRate.StartDate = new Date($rootScope.workingdate);


       };
       $scope.today();
       $scope.interestRateToday();

        //$scope.clear = function () {
        //    $scope.member.AdmissionDate = null;
        //};

       $scope.inlineOptions = {
           customClass: getDayClass,
           minDate: new Date($rootScope.workingdate),
           showWeeks: true
       };

        // Disable weekend selection
       function disabled(data) {
           var date = data.date,
             mode = data.mode;
           //console.log((new Date($rootScope.workingdate)).getDate);
           return (mode === 'day' && (date.getDay() === 5))
               || (moment(date) > moment(new Date($rootScope.workingdate)).add(1, 'days'));
       }
       $scope.dateOptions = {
           dateDisabled: disabled,
           formatYear: 'yy',
           maxDate: new Date(2040, 5, 22),
           minDate: new Date($rootScope.workingdate),
           startingDay: 1
       };

       $scope.toggleMin = function () {
           $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate.getDate() + 1);
           $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
       };

       $scope.toggleMin();

       $scope.openStartDate = function () {
           $scope.popupStartDate.opened = true;
       };
       $scope.openEndDate = function () {
           $scope.popupEndDate.opened = true;
       };
       $scope.openInterestStartDate = function () {
           $scope.popupInterestStartDate.opened = true;
       };
       $scope.openInterestEndDate = function () {
           $scope.popupInterestEndDate.opened = true;
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
       $scope.popupInterestStartDate = {
           opened: false
       };
       $scope.popupInterestEndDate = {
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
           var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
           var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
           if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM) {
               maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
               minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
           }
           else if ($scope.roleId == $rootScope.rootLevel.RM) {
               maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
               minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
           }
           else if ($scope.roleId == $rootScope.rootLevel.DM) {
               maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
               minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
           } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
               maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
               minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
           }
           if (moment($scope.product.EndDate).valueOf() < moment($scope.product.StartDate).valueOf()) {
               swal('please select valid End date!');
               $scope.today();
               return;
           }
           if (moment($scope.product.StartDate).valueOf() > maxDate || moment($scope.product.StartDate).valueOf() < minDate) {
               swal('please select valid date!');
               $scope.today();
               return;
           }


           if (moment($scope.product.StartDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
               swal("unable to select future date!");
               $scope.today();
               return;
           }

           $scope.isHolidayOrOffDay($scope.product.StartDate);
       }
       $scope.endDateValidator = function () {
           if (moment($scope.product.EndDate) < moment(new Date($scope.product.StartDate))) {
               swal("unable to select past date!");

               return;
           }

       }


        $scope.interestRateStartDateValidator = function() {
            var maxDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            var minDate = moment($rootScope.workingdate).format("YYYY-MM-DD");
            if ($scope.roleId == $rootScope.rootLevel.LO || $scope.roleId == $rootScope.rootLevel.ABM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.RM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-1, 'months').valueOf();
            }
            else if ($scope.roleId == $rootScope.rootLevel.DM) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-3, 'months').valueOf();
            } else if ($scope.roleId == $rootScope.rootLevel.Admin) {
                maxDate = moment($rootScope.workingdate).add(1, 'days').valueOf();
                minDate = moment($rootScope.workingdate).add(-50, 'years').valueOf();
            }
            if (moment($scope.interestRate.EndDate).valueOf() < moment($scope.interestRate.StartDate).valueOf()) {
                swal('please select valid End date!');
                $scope.interestRateToday();
                return;
            }
            if (moment($scope.interestRate.StartDate).valueOf() > maxDate || moment($scope.interestRate.StartDate).valueOf() < minDate) {
                swal('please select valid date!');
                $scope.interestRateToday();
                return;
            }


            if (moment($scope.interestRate.StartDate) > moment(new Date($scope.branchWorkingDay) + 1)) {
                swal("unable to select future date!");
                $scope.interestRateToday();
                return;
            }

            $scope.isHolidayOrOffDay($scope.interestRate.StartDate);
        }
       

        $scope.interestRateEndDateValidator = function () {
            if (moment($scope.interestRate.EndDate) < moment(new Date($scope.interestRate.StartDate))) {
                swal("unable to select past date!");

                return;
            }

        }
    }
]);