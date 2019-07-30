ammsAng.controller('productListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'productService',
    function ($scope, $rootScope, commonService, $timeout, productService) {
        $scope.commandList = [];
        $scope.products = [];
        var dataTable_css = {
            "margin-left": "30px",
            "border-color": "#000"
        }
		
		
        $scope.Init = function () {
            $scope.getProducts();
            commonService.getCommands($scope.tab.PropertyId).then(function (responseCommand) {
               // console.log(responseCommand.data);
                $scope.commandList = responseCommand.data;

                $scope.customCommandList = [];

                $scope.customCommandList.push($scope.commandList[1]);

                if ($scope.commandList.find(c => !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            });
            
        };

        $scope.$on('product-add-finished', function () {
            $scope.getProducts();
        });

        $scope.$on('product-edit-finished', function () {
            $scope.getProducts();
        });

        $scope.getProducts = function () {
            $("#loadingImage").css("display", "block");
            productService.getAll().then(function (response) {
                $scope.products = response.data;
                angular.forEach($scope.products, function (value, key) {
                    value.StartDate = !value.StartDate ? '' : moment(value.StartDate).format('DD/MM/YYYY');
                    value.EndDate = !value.EndDate ? '' : moment(value.EndDate).format('DD/MM/YYYY');
                });
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
                text: $rootScope.showMessage($rootScope.deleteConfirmation, $rootScope.product),
                type: "info",
                closeOnConfirm: false,
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
                function () {
                    productService.delete($scope.productToDelete.Id).then(function (response) {
                        if (response.data.Success) {
                            swal($rootScope.showMessage($rootScope.deleteSuccess, $rootScope.product), "Successful!", "success");
                            $rootScope.$broadcast('product-delete-finished');
                        } else {
                            swal($rootScope.showMessage($rootScope.deleteError, $rootScope.product), response.data.Message, "error");
                        }

                    });
                });
        }

        $scope.Init();
    } 
]);