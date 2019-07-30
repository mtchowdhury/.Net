ammsAng.controller('ProcessJournalController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'generalJournalService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, generalJournalService) {

        //$scope.treeSearchQuery = null;
        
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(100);
        
        $scope.hasNonGeneralCommands = false;
        $scope.commandList = [];
        $scope.exportResult = [];
        $scope.filter = {};
        $rootScope.NodeName = {};
        $scope.filter.AccountHead = {};

        $scope.Init = function () {
            $("#loadingImage").css("display", "block");
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                console.log($scope.commandList);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;


              //  $scope.getGJFilterData();

            }, AMMS.handleServiceError);

            generalJournalService.getAllJournalModules($rootScope.selectedBranchId, $rootScope.workingdateInt).then(function (response) {
                $scope.journalModules = response.data;
                $scope.journalModules.forEach(function (module) {
                    module.Status = 1;
                    module.TotalAmount = module.AnyAdditionalString;
                    $("#loadingImage").css("display", "none");
                });
                console.log($scope.journalModules);
            }, AMMS.handleServiceError);


        };

       
        $scope.iteration = 0;

        $scope.deletePreviousTransactionsAndProcessJournal = function () {
           
            if ($scope.iteration === 0) {
                $("#loadingImage").css("display", "block");
                generalJournalService.deletePreviousTransactions($rootScope.selectedBranchId, $rootScope.workingdateInt).then(function (response) {
                    if (response.data.Success) {
                        $scope.processJournal();
                    } else {
                        $("#loadingImage").css("display", "none");
                        return;
                    }
                });
                
            } else {
                $scope.processJournal();
            }
        }


        $scope.processJournal = function () {
            $scope.pleaseDo = true;
            $("#loadingImage").css("display", "block");
            
            //trying recursive
            if (
                // $scope.iteration === 10
                $scope.iteration === $scope.journalModules.length
            ) {
                $("#loadingImage").css("display", "none");
                $scope.pleaseDo = false;
                return;
            }
            else {
                $scope.journalModules[$scope.iteration].Status = 2;
                generalJournalService.postProcessJournal($rootScope.selectedBranchId, $rootScope.workingdateInt, $scope.journalModules[$scope.iteration].Value).then(function (response) {
                    //  $("#loadingImage").css("display", "none");
                    // swal($rootScope.showMessage("posted successfully", "Journal"), "Successful!", "success");

                    if (!response.data.Success) {
                        swal($rootScope.showMessage("Post error!", "Journal"), "!!", "error");
                        $scope.journalModules[$scope.iteration].Status = 4;
                        $scope.pleaseDo = false;
                        $("#loadingImage").css("display", "none");
                    } else {
                        $scope.journalModules[$scope.iteration].Status = 3;
                        $scope.journalModules[$scope.iteration].TotalAmount = response.data.Message;
                        $scope.iteration++;
                        $scope.processJournal();
                        

                    }
                   // $("#loadingImage").css("display", "none");
                }, AMMS.handleServiceError);
            }




            




           // swal($rootScope.showMessage("posted successfully", "Journal"), "Successful!", "success");
         };




        $scope.viewOptionModifier = function (bool, index) {
           // if (index === undefined || index === null) index = $scope.savedIndex;
            //$scope.savedIndex = index;
            $rootScope.listViewShown = bool;
            $scope.filter.AccountHead = document.getElementById("myid");
           // $scope.filter.AccountHead.Name = document.getElementById("myid").name;
           // $scope.filter.AccountHead.Title = document.getElementById("myid").title;
            bool ? $rootScope.$broadcast('coa-popup-closed') :
            $rootScope.$broadcast('coa-popup-opened');
            
           // $scope.voucher.GlTransactions[index].GlAccountId = document.getElementById("myid").value;
            
            //$scope.voucher.GlTransactions[index].AccountHeadCode = document.getElementById("myid").title;
           
        }
       
        


      
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($rootScope.workingdate),
            showWeeks: true
        };

      
        function disabled(data) {
            var date = data.date,
              mode = data.mode;
           
            return (mode === 'day' && (date.getDay() === 5));
        }
        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date(moment($rootScope.workingdate).format("YYYY-MM-DD")),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };
        $scope.dateOptionsDOB = {
             dateDisabled: disabled,
            formatYear: 'yyyy',
            maxDate: new Date($rootScope.workingdate),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date($rootScope.workingdate.getDate() + 1);
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.fromPopper = function () {
            $scope.fromPop.opened = true;
        };
        $scope.toPopper = function () {
            $scope.toPop.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        // $scope.format = $scope.formats[0];
        $scope.format = $rootScope.formats[4];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.fromPop = {
            opened: false
        };
        $scope.toPop = {
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
      
        
        $scope.$on('voucher-add-finished', function () {
            $scope.getVoucherList();
        });

        $scope.$on('voucher-edit-finished', function () {
            $scope.getVoucherList();
        });


        $scope.$on('voucher-delete-finished', function () {
            $scope.getVoucherList();
        });

        $scope.deleteVoucher = function () {
            if ($scope.vouchers.filter(v => v.checked).length < 1) {
                swal('please select a voucher first to delete it!');
                return;
            }
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.GeneralJournal),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    generalJournalService.deleteVoucher($scope.vouchers.filter(v => v.checked)[0].Id, moment($rootScope.workingdate).format()).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.GeneralJournal), "Successful!", "success");
                            $rootScope.$broadcast('voucher-delete-finished');
                        } else {
                            swal($rootScope.showMessage(response.data.Message, $rootScope.GeneralJournal), "", "error");
                        }

                    }, AMMS.handleServiceError);
                });
        };

        $scope.Init();
    }]);