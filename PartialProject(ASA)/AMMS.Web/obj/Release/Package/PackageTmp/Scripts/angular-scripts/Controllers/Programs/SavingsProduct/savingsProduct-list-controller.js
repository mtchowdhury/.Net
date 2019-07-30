ammsAng.controller('savingsProductListController', ['$scope', '$rootScope', '$timeout', 'savingsProductService','commonService',
    function ($scope, $rootScope, $timeout, savingsProductService,commonService) {
        $scope.commandList = [];
        $scope.products = [];
        $scope.hasNonGeneralCommands = false;
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
		
		
        
		
        $scope.Init = function () {
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;

                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
                $scope.getProducts();
            });
            
        };

        $scope.$on('savingsproduct-add-finished', function () {
            $scope.getProducts();
        });

        $scope.$on('savingsproduct-edit-finished', function () {
            $scope.getProducts();
        });

        $scope.getProducts = function () {
            $("#loadingImage").css("display", "block");
            savingsProductService.getAll().then(function (response) {
                $scope.products = response.data;
                console.log($scope.products);
                $scope.products.forEach(function (p) {
                    p.StartDate = moment(p.StartDate).format('ddd, DD/MM/YYYY');
                    if(p.EndDate) p.EndDate = moment(p.EndDate).format('ddd, DD/MM/YYYY');
                });
                console.log(response);
                $("#loadingImage").css("display", "none");
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            });
            

        }

        $scope.$on('product-delete-finished', function () {
            $scope.getProducts();
        });

        $scope.handleNonGeneralActions = function (actionName, product) {
            if (actionName === "DELETE") {
                $scope.productToDelete = product;
                $scope.deleteProduct();
            }
        }

        $scope.deleteProduct = function () {
            swal({
                title: "Confirm?",
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.savingProduct),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    savingsProductService.delete($scope.productToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.savingProduct), "Successful!", "success");
                            $rootScope.$broadcast('product-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.savingProduct), response.data.Message, "error");
                        }

                    });
                });
        }

        $scope.Init();
    } 
]);