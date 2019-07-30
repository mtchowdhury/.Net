ammsAng.controller('chartOfAccountListController', ['$scope', '$rootScope', 'commonService', '$timeout', 'employeeService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'chartOfAccountService',
    function ($scope, $rootScope, commonService, $timeout, employeeService, DTOptionsBuilder, DTColumnDefBuilder, chartOfAccountService) {
        $scope.listSelectedIndex = -1;
        $scope.treeViewSearchQuery = '';
        $scope.currentTreeViewSearchNode = null;
        $scope.searchedNodes = [];
        $scope.searchResultIndex = 0;
        $scope.treeViewLoaded = false;
        $scope.listViewLoaded = false;
        $scope.isNodeSelected = false;
        

        $scope.Init = function () {
            
            commonService.getCommands(($scope.tab.PropertyId==null)?0:$scope.tab.PropertyId).then(function (responseCommand) {
                $scope.commandList = responseCommand.data;
                $scope.customCommandList = [];
                $scope.customCommandList.push($scope.commandList[1]);
                console.log($scope.commandList);
                if ($scope.commandList.find(c=> !c.IsGeneral))
                    $scope.hasNonGeneralCommands = true;
            }, AMMS.handleServiceError);

            if ($rootScope.coAModule === -1) {
                $rootScope.officeType = $rootScope.selectedBranchId === -1 ? 2 : 3;
            }

            $scope.getChartOfAccounts($rootScope.onlyChildSelectable, $rootScope.forAdd, $rootScope.officeType);

        };
        $scope.getChartOfAccounts = function (onlyChildSelectable, forAdd, officeType) {
            $scope.isNodeSelected = false;
            $("#loadingImage").css("display", "block");
            //chartOfAccountService.getChartOfAccount(false, false, -1).then(function (response) {
            chartOfAccountService.getChartOfAccount($rootScope.selectedBranchId, onlyChildSelectable, forAdd, officeType).then(function (response) {
                $scope.treeViewList = response.data.Data.treeList;
                console.log($scope.treeViewList);
                $("#loadingImage").css("display", "none");
                $scope.treeViewLoaded = true;
            }, AMMS.handleServiceError);
        }

        $scope.getChartOfAccountsForListView = function () {
            $scope.isNodeSelected = false;
            $("#loadingImage").css("display", "block");
            chartOfAccountService.getChartOfAccountForListView($rootScope.selectedBranchId).then(function (response) {
                $scope.listView = response.data;
                console.log($scope.listView);
                $("#loadingImage").css("display", "none");
                $scope.listViewLoaded = true;
                $timeout(function () {
                    $(".dataTables_filter label").css("margin-left", "10px");
                    $(".dataTables_filter input").css(dataTable_css);
                }, 100);
            }, AMMS.handleServiceError);
        }

        $scope.checkSelected = function (coAList) {
            angular.forEach(coAList, function (element, key) {
                if (!$scope.treeSearchQuery) {
                    element.selected = undefined;
                    element.expanded = false;
                }
                else if (element.Name.indexOf($scope.treeSearchQuery) > -1) {
                    console.log(element.Name);
                    element.selected = 'selected';
                    element.expanded = true;
                }

                $scope.checkSelected(element.Childrens);
            });
        }

        $scope.searchQueryOnChange = function () {
            $scope.checkSelected($scope.treeViewList);
        }

        $scope.searchOnTreeBranch = function (parent, branch, treeViewSearchQuery) {
            angular.forEach(branch, function (value, key) {
                if (parent) {
                    if (value.Name.toLowerCase().indexOf(treeViewSearchQuery.toLowerCase()) > -1) {
                        //parent.expanded = true;
                        value.searched = 'searched';
                        $scope.currentTreeViewSearchNode = value;
                        $scope.searchedNodes.push(value);
                        //return;
                    }
                }
                $scope.searchOnTreeBranch(value, value.Childrens, treeViewSearchQuery);
            });
        }

        $scope.expandSearchedNodeParent = function(list, parentId) {
            angular.forEach(list, function (value, key) {
                if (value.Id === parentId) {
                    console.log(value);
                    value.expanded = true;
                    $scope.expandSearchedNodeParent($scope.treeViewList, value.ParentId);
                } else {
                    $scope.expandSearchedNodeParent(value.Childrens, parentId);
                }
            });
        }

        $scope.clearTreeViewSearch = function (list) {
            $scope.searchedNodes = [];
            $scope.searchResultIndex = 0;
            angular.forEach(list, function (value, key) {
                value.expanded = false;
                value.searched = undefined;
                value.selected = undefined;
                $scope.clearTreeViewSearch(value.Childrens);
            });
        }

        $scope.collapseAll = function(list) {
            angular.forEach(list, function (value, key) {
                value.expanded = false;
                value.selected = undefined;
                $scope.collapseAll(value.Childrens);
            });
        }

        $scope.searchTreeView = function (treeViewSearchQuery) {
            $timeout(function () { $("#search-icon").css("display", "block"); }, 100);
            if (!treeViewSearchQuery) {
                $scope.clearTreeViewSearch($scope.treeViewList);
                $timeout(function () { $("#search-icon").css("display", "none"); }, 1000);
                return;
            }
            $scope.clearTreeViewSearch($scope.treeViewList);
            $scope.searchOnTreeBranch(null, $scope.treeViewList, treeViewSearchQuery);
            console.log($scope.currentTreeViewSearchNode);

            if ($scope.searchedNodes[$scope.searchResultIndex]) {
                $scope.searchedNodes[$scope.searchResultIndex].selected = 'selected';
                $scope.searchedNodes[$scope.searchResultIndex].expanded = true;
                $scope.expandSearchedNodeParent($scope.treeViewList, $scope.searchedNodes[$scope.searchResultIndex].ParentId);
                $scope.searchResultIndex++;
            }

            $timeout(function() { $("#search-icon").css("display", "none"); }, 1000);
        }

        $scope.nextSearchResult = function () {
            if ($scope.searchResultIndex === 0) return; //first search will be with debounce not with enter key
            if (event.keyCode === 13 && $scope.searchedNodes[$scope.searchResultIndex]) {
                $scope.collapseAll($scope.treeViewList);
                $scope.searchedNodes[$scope.searchResultIndex].selected = 'selected';
                $scope.searchedNodes[$scope.searchResultIndex].expanded = true;
                $scope.expandSearchedNodeParent($scope.treeViewList, $scope.searchedNodes[$scope.searchResultIndex].ParentId);
                $scope.searchResultIndex++;
            }
        }

        $scope.onChange = function (value) {
            $scope.coaView = value;
            if (value === 'lView') {
                if (!$scope.listViewLoaded) {
                    $scope.getChartOfAccountsForListView();
                    $scope.onClick();
                }
            }
            if (value === 'tView') {
                if (!$scope.treeViewLoaded) {
                    $scope.getChartOfAccounts($rootScope.onlyChildSelectable, $rootScope.forAdd, $rootScope.officeType);
                } else {
                    $scope.clearTreeViewSearch($scope.treeViewList);
                }
            }
        }


        $scope.onClick = function (index, fullNodeName) {
            $scope.NodeName = fullNodeName;
            $scope.listSelectedIndex = index;
        }

        $scope.resetLeafSelectable = function (list) {
            angular.forEach(list, function (value, key) {
                if(value.Childrens && value.Childrens.length > 0)
                    value.Selectable = false;
                else
                    value.Selectable = true;
                $scope.resetLeafSelectable(value.Childrens);
            });
        }

        $scope.resetAllSelectable = function (list) {
            angular.forEach(list, function (value, key) {
                value.Selectable = true;
                $scope.resetAllSelectable(value.Childrens);
            });
        }

        $scope.selectedClass = function(index) {
            return index === $scope.listSelectedIndex ? 'list-item-selected' : '';
        }

        $scope.$on('coa-popup-opened', function () {
            $scope.getChartOfAccounts($rootScope.onlyChildSelectable, $rootScope.forAdd, $rootScope.officeType);
           // $scope.resetLeafSelectable($scope.treeViewList);
        });

        $scope.$on('coa-popup-closed', function () {
            //$scope.getChartOfAccounts($rootScope.onlyChildSelectable, $rootScope.forAdd, $rootScope.officeType);
            $scope.resetAllSelectable($scope.treeViewList);
            //$scope.treeViewSearchQuery = '';
            //$scope.currentTreeViewSearchNode = null;
        });

        $scope.$on('coa-node-label-double-clicked', function() {
            //alert('boradcasted!');
        });

        $scope.$on('coa-node-label-single-clicked', function () {
            $scope.isNodeSelected = true;
        });
       
        $scope.Init();
    }]);