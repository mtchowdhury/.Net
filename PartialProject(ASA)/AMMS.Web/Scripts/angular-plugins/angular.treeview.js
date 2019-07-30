/*
	@license Angular Treeview version 0.1.6
	ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
	License: MIT
*/

//(function(f){f.module("angularTreeview",[]).directive("treeModel",function($compile){return{restrict:"A",link:function(b,h,c){var a=c.treeId,g=c.treeModel,e=c.nodeLabel||"label",d=c.nodeChildren||"children",e='<ul><li data-ng-repeat="node in '+g+'"><i class="collapsed" data-ng-show="node.'+d+'.length && node.collapsed" data-ng-click="'+a+'.selectNodeHead(node)"></i><i class="expanded" data-ng-show="node.'+d+'.length && !node.collapsed" data-ng-click="'+a+'.selectNodeHead(node)"></i><i class="normal" data-ng-hide="node.'+
//d+'.length"></i> <span data-ng-class="node.selected" data-ng-click="'+a+'.selectNodeLabel(node)">{{node.'+e+'}}</span><div data-ng-hide="node.collapsed" data-tree-id="'+a+'" data-tree-model="node.'+d+'" data-node-id='+(c.nodeId||"id")+" data-node-label="+e+" data-node-children="+d+"></div></li></ul>";a&&g&&(c.angularTreeview&&(b[a]=b[a]||{},b[a].selectNodeHead=b[a].selectNodeHead||function(a){a.collapsed=!a.collapsed},b[a].selectNodeLabel=b[a].selectNodeLabel||function(c){b[a].currentNode&&b[a].currentNode.selected&&
//(b[a].currentNode.selected=void 0);c.selected="selected";b[a].currentNode=c}),h.html('').append($compile(e)(b)))}}})})(angular);


//(function (angular) {
//    'use strict'; angular.module('angularTreeview', []).directive('treeModel', ['$compile', function ($compile) {
//        return {
//            restrict: 'A', link: function (scope, element, attrs) {
//                var treeId = attrs.treeId; var treeModel = attrs.treeModel; var nodeId = attrs.nodeId; var nodeLabel = attrs.nodeLabel; var nodeChildren = attrs.nodeChildren; var searchQuery = attrs.searchQuery; var template = '<ul>' + '<li data-ng-repeat="node in ' + treeModel + ' | filter:' + searchQuery + ' ">' + '<i class="collapsed" data-ng-class="{nopointer: !node.' + nodeChildren + '.length}"' + 'data-ng-show="!node.expanded && !node.fileicon" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' + '<i class="expanded" data-ng-show="node.expanded && !node.fileicon" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' + '<i class="normal" data-ng-show="node.fileicon"></i> ' + '<span title="{{node.' + nodeLabel + '}}" data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' + '<div data-ng-show="node.expanded" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + ' data-search-query=' + searchQuery + '></div>' + '</li>' + '</ul>'; if (treeId && treeModel) {
//                    if (attrs.angularTreeview) {
//                        scope[treeId] = scope[treeId] || {}; scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function (selectedNode) { if (selectedNode[nodeChildren] !== undefined) { selectedNode.expanded = !selectedNode.expanded; } }; scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode) {
//                            if (scope[treeId].currentNode && scope[treeId].currentNode.selected) { scope[treeId].currentNode.selected = undefined; }
//                            selectedNode.selected = 'selected'; scope[treeId].currentNode = selectedNode;
//                        };
//                    }
//                    element.html('').append($compile(template)(scope));
//                }
//            }
//        };
//    }]);
//})(angular);


(function (angular) {
    'use strict'; angular.module('angularTreeview', []).directive('treeModel', ['$compile', function ($compile) {
        return {
            restrict: 'A', link: function (scope, element, attrs) {
                var treeId = attrs.treeId;
                var treeModel = attrs.treeModel;
                var nodeId = attrs.nodeId; 
                var nodeLabel = attrs.nodeLabel;
                var nodeChildren = attrs.nodeChildren;
                var searchQuery = attrs.searchQuery;
                var template =
                    '<ul>' +
                        '<li data-ng-repeat="node in ' + treeModel + ' | filter:' + searchQuery + ' ">' +
                            '<i class="node-icon fa fa-plus" data-ng-class="{nopointer: !node.' + nodeChildren + '.length}"' + 'data-ng-show="!node.expanded && node.' + nodeChildren + '.length > 0" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="node-icon fa fa-minus" data-ng-show="node.expanded && node.' + nodeChildren + '.length > 0" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="node-icon fa fa-arrow-right" data-ng-show="node.' + nodeChildren + '.length === 0"></i> ' +
                            '<span title="{{node.' + nodeLabel + '}}" class="node-label" data-ng-class="' + treeId + '.selectSearchClass(node)" data-ng-click="' + treeId + '.selectNodeLabel(node)" data-ng-dblclick="' + treeId + '.selectAndBroadcastNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
                            '<div data-ng-show="node.expanded" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + ' data-search-query=' + searchQuery + '></div>' +
                        '</li>' +
                    '</ul>';
                if (treeId && treeModel) {
                    if (attrs.angularTreeview) {
                        scope[treeId] = scope[treeId] || {};

                        scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function(selectedNode) {
                             if (selectedNode[nodeChildren] !== undefined) {
                                 selectedNode.expanded = !selectedNode.expanded; 
                             }
                        };
                        scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode) {
                            if (!selectedNode.Selectable)
                                return;
                            if (scope[treeId].currentNode && scope[treeId].currentNode.selected) {
                                 scope[treeId].currentNode.selected = undefined;
                            }
                            selectedNode.selected = 'selected'; scope[treeId].currentNode = selectedNode;
                            scope.$root.$broadcast('coa-node-label-single-clicked');
                        };
                        scope[treeId].selectAndBroadcastNodeLabel = scope[treeId].selectAndBroadcastNodeLabel || function (selectedNode) {
                            if (!selectedNode.Selectable)
                                return;
                            selectedNode.selected = 'selected'; scope[treeId].currentNode = selectedNode;
                            scope.$root.$broadcast('coa-node-label-double-clicked');
                        };
                        scope[treeId].selectSearchClass = scope[treeId].selectSearchClass || function (node) {
                            return (node && node.searched ? node.searched + '' : '') + ' ' + (node && node.selected ? node.selected + '' : '');
                        };
                    }
                    element.html('').append($compile(template)(scope));
                }
            }
        };
    }]);
})(angular);