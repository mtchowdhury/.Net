ammsAng.controller('tabController', ['$scope', '$rootScope', '$http', 'authService', 'tabService', 'branchService', 'documentService', '$timeout',
    function ($scope, $rootScope, $http, authService, tabService, branchService, documentService, $timeout) {
        (function () {
            $scope.tabs = [];
            $scope.menus = [];
            $scope.extraTabs = [];
            $scope.extraTabIds = [];
            $scope.showExtraTabList = false;
            $scope.openWindows = [];
            $scope.officer = [];
            $scope.selectedBranchId = null;
            $scope.groupIds = [];
            $scope.groupNames = [];
            $scope.tempVariableToKeepModules = [];
        })();
        $scope.$on('program-officer-fetched', function (event, args, branchId) {
            $scope.selectedBranchId = branchId;
            $scope.officer = args;
            $scope.getMenus();
        });
        $rootScope.$on('transfer-finished', function () {
            $scope.getMenus();
        });
        $scope.getMenus = function () {
            $("#branchloadingImage").css("display", "block");
            tabService.getMenus($rootScope.user).success(function (s) {
                $scope.menus = s;
                $scope.changeModule($scope.menus[0], null, $rootScope.Modules.PROGRAM_OFFICER, $scope.officer);
                branchService.getGroupTypes().then(function (response) {
                    $scope.changeModule($scope.menus[0], null, $rootScope.Modules.GROUP_TYPE, JSON.parse(response.data));
                    branchService.getGroups($rootScope.selectedBranchId).then(function (response) {
                        $scope.groupIds = [];
                        for (var j = 0; j < JSON.parse(response.data).length; j++) {
                            $scope.groupIds.push(JSON.parse(response.data)[j].Id);
                            $scope.groupNames.push({
                                Name: JSON.parse(response.data)[j].Name,
                                Value: JSON.parse(response.data)[j].Id,
                                ProgramOfficerId: JSON.parse(response.data)[j].ProgramOfficerId,
                                GroupTypeId: JSON.parse(response.data)[j].GroupTypeId
                            });
                        }
                        $scope.changeModule($scope.menus[0], null, $rootScope.Modules.GROUP, JSON.parse(response.data));
                        branchService.getMembers($scope.groupIds, $rootScope.workingdateInt, $rootScope.selectedBranchId).then(function (response) {
                            $scope.changeModule($scope.menus[0], null, $rootScope.Modules.MEMBER, JSON.parse(response.data));
                            $scope.setSubPageTitle("", $scope.menus);
                            AMMS.navbarUtility();
                            $("#branchloadingImage").css("display", "none");
                            $("#loadingImage").css("display", "none");
                            $rootScope.$broadcast('menu-loaded');
                            console.log($scope.menus);
                            $timeout(function() {
                                    branchService
                                        .getMembersWithScheduleColor($scope.groupIds,
                                            $rootScope.workingdateInt,
                                            $rootScope.selectedBranchId).then(function(response) {
                                            console.log(JSON.parse(response.data), $scope.menus);
                                            $scope.changeModule($scope.menus[0],
                                                null,
                                                $rootScope.Modules.MEMBER,
                                                JSON.parse(response.data));

                                        });
                                },
                                1000);
                        });
                    });
                }, AMMS.handleServiceError);
            }).error(function (response, data) {
                console.log(data, response);
            });
            
        };
        $scope.setSubPageTitle = function (parentTitle, modules) {
            modules.forEach(function (menu) {
                if (menu.Module === $rootScope.Modules.MEMBER) {
                    menu.pageTitle = parentTitle + menu.ToolTip.replace(" ", "").replace("/", "-") + "\\ ";
                    menu.color = "#f45642";
                } else menu.pageTitle = parentTitle + menu.Name + "\\ ";
                if (menu.SubModules != null) {
                    $scope.setSubPageTitle(menu.pageTitle, menu.SubModules);
                }
            });
        }
        $scope.changeModule = function (module, parent, targetModuleId, dataToBeInserted) {
            var changedData = [];
            if (module && module.Module === targetModuleId) {
                var flag = 0;
                for (let i = 0; i < dataToBeInserted.length; i++) {
                    if (targetModuleId === $rootScope.Modules.GROUP_TYPE) {
                        module.ProgramOfficerId = parent.Id;
                    }
                    if (targetModuleId === $rootScope.Modules.GROUP) {
                        module.GroupTypeId = parent.Id;
                        module.ProgramOfficerId = parent.ProgramOfficerId;
                        if ((parent.programOfficerId !== dataToBeInserted[i].ProgramOfficerId) || (parent.Id !== dataToBeInserted[i].GroupTypeId)) continue;
                    }
                    if (targetModuleId === $rootScope.Modules.MEMBER) {
                        module.GroupTypeId = parent.Id;
                        if (parent.Id !== dataToBeInserted[i].GroupId) continue;
                    }
                    flag = 1;
                    if (module.DisplayName != "Member" && module.ModuleId == 13 && module.Id != dataToBeInserted[i].Id) {
                        var tempModule = angular.copy($scope.tempVariableToKeepModules.filter(e => e.Id == dataToBeInserted[i].Id)[0]);
                        tempModule = angular.extend(tempModule, dataToBeInserted[i]);
                    } else {
                        var tempModule = angular.copy(module);
                        tempModule = angular.extend(tempModule, dataToBeInserted[i]);
                    }
                    if (targetModuleId === $rootScope.Modules.MEMBER) {
                        tempModule.MeetingDay = parent.MeetingDayName;
                        tempModule.Name = angular.copy((tempModule.DisplayName + tempModule.Id).replace('/', ''));
                        tempModule.ToolTip = angular.copy(tempModule.NickName + (tempModule.GuardianName ? ' / ' + tempModule.GuardianName.split(" ")[0] : '') + ' (' + tempModule.PassbookNumber + ')');
                        tempModule.DisplayName = $scope.formatDisplayName(tempModule.Level, tempModule.NickName + (tempModule.GuardianName ? ' / ' + tempModule.GuardianName.split(" ")[0] : '')) + ' (' + tempModule.PassbookNumber + ')';
                    } else if (targetModuleId === $rootScope.Modules.PROGRAM_OFFICER) {
                        tempModule.ToolTip = angular.copy(tempModule.Name + ' (' + tempModule.EmployeeId + ')');
                        tempModule.DisplayName = $scope.formatDisplayName(tempModule.Level, tempModule.Name) + ' (' + tempModule.EmployeeId + ')';
                    } else if (targetModuleId === $rootScope.Modules.GROUP) {
                        tempModule.ToolTip = angular.copy(tempModule.Name + ' (' + tempModule.MeetingDayName + '-' + tempModule.memberCount + ')');
                        tempModule.DisplayName = $scope.formatDisplayName(tempModule.Level, tempModule.Name) + ' (' + tempModule.MeetingDayName + '-' + tempModule.memberCount + ')';
                    } else {
                        tempModule.ToolTip = angular.copy(tempModule.Name);
                        tempModule.DisplayName = tempModule.Name;
                    }
                    if (targetModuleId === $rootScope.Modules.GROUP_TYPE) {
                        tempModule.programOfficerId = parent.Id;
                    }
                    changedData.push(tempModule);
                }
                if (flag === 1) parent.SubModules = angular.copy(changedData);
                else parent.SubModules = [];
                return;
            } else if (module && module.SubModules && module.SubModules.length > 0) {
                for (let i = 0; i < module.SubModules.length; i++) {
                    if (module.SubModules[i].ModuleId == 13) {
                        $scope.tempVariableToKeepModules = angular.copy(module.SubModules);
                    }
                    $scope.changeModule(module.SubModules[i], module, targetModuleId, dataToBeInserted);
                }
            } else {
                return;
            }
        }
        $scope.formatDisplayName = function (level, displayName) {
            switch (level) {
                case 1:
                    if (displayName.length > 24) displayName = displayName.substring(0, 24) + "...";
                    break;
                case 2:
                    if (displayName.length > 7) displayName = displayName.substring(0, 7) + "...";
                    break;
                case 3:
                    if (displayName.length > 15) displayName = displayName.substring(0, 15) + "...";
                    break;
                case 4:
                    if (displayName.length > 9) displayName = displayName.substring(0, 9) + "...";
                    break;
                case 5:
                    if (displayName.length > 12) displayName = displayName.substring(0, 12) + "...";
                    break;
            }
            return displayName;
        }
        $scope.execRemoveTab = function (tab) {
            var islast = (tab === $scope.tabs[$scope.tabs.length - 1]);
            $scope.tabs.splice($scope.tabs.indexOf(tab), 1);
            $scope.openWindows.splice($scope.openWindows.indexOf(tab.id), 1);
            if ($scope.tabs.length > 0) {
                var currentElement = $('#tab_' + tab.id);
                if (currentElement.hasClass('active')) {
                    if (islast) {
                        $scope.switchTab($(currentElement).prev().attr('id').replace('tab_', ''));
                    } else {
                        $scope.switchTab($(currentElement).next().attr('id').replace('tab_', ''));
                    }
                }
                if ($scope.extraTabs.length > 0) {
                    $scope.tabs.push($scope.extraTabs.shift());
                    $scope.extraTabIds.shift();
                }
                if ($scope.showExtraTabList === true) {
                    var temTab = $scope.tabs.pop();
                    $scope.extraTabs.unshift(temTab);
                    $scope.extraTabIds.unshift(temTab.id);
                }
                $scope.checkExtraTab();
            }
        }
        $scope.removeTab = function (tab) {
            if (tab.ConfirmPrompt && (tab.FormType.toLowerCase() !== 'view')) {
                swal({
                    title: $rootScope.closeConfirmation,
                    text: "All unsaved data will be lost!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "No, Cancel Please!",
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        $timeout(function () {
                            $scope.execRemoveTab(tab);
                            $scope.removeUploadedFilesFromServer(tab);
                        }, 100);
                    }
                });
            } else {
                $scope.execRemoveTab(tab);
                $scope.removeUploadedFilesFromServer(tab);
            }
        };
        $scope.removeUploadedFilesFromServer = function (tab) {
            if (tab.FormName) {
                if (tab.FormName.toLowerCase() === 'employee' && tab.FormType.toLowerCase() === 'edit' && $rootScope.employeeFileHash) {
                    documentService.deleteLocalDocument($rootScope.employeeFileHash);
                    $rootScope.employeeFileHash = null;
                } else if (tab.FormName.toLowerCase() === 'member' && tab.FormType.toLowerCase() === 'edit' && $rootScope.memberFileHash) {
                    documentService.deleteLocalDocument($rootScope.memberFileHash);
                    $rootScope.memberFileHash = null;
                } else if (tab.FormName.toLowerCase() === 'loan_account' && tab.FormType.toLowerCase() === 'edit' && $rootScope.loanAccountFileHash) {
                    documentService.deleteLocalDocument($rootScope.loanAccountFileHash);
                    $rootScope.loanAccountFileHash = null;
                } else if (tab.FormName.toLowerCase() === 'product' && tab.FormType.toLowerCase() === 'edit' && $rootScope.productFileHash) {
                    documentService.deleteLocalDocument($rootScope.productFileHash);
                    $rootScope.productFileHash = null;
                } else if (tab.FormName.toLowerCase() === 'savings_account' && tab.FormType.toLowerCase() === 'edit' && $rootScope.SavingsAccountFileHash) {
                    documentService.deleteLocalDocument($rootScope.SavingsAccountFileHash);
                    $rootScope.SavingsAccountFileHash = null;
                } else if (tab.FormName.toLowerCase() === 'savings_product' && tab.FormType.toLowerCase() === 'edit' && $rootScope.SavingsProductFileHash) {
                    documentService.deleteLocalDocument($rootScope.SavingsProductFileHash);
                    $rootScope.SavingsProductFileHash = null;
                }
            }
        }
        $scope.openNewTab = function (menu) {
            $rootScope.memberPassbookMenu = menu;
            $scope.selectedMenu = menu;
            $scope.propertyData = [];
            if (menu.Id) menu.id = menu.Module + '_' + menu.Id;
            else menu.id = menu.Module + '_' + menu.DisplayName.replace(/\./g, '_').replace(/ /g, '_').replace(/\//g, '_');
            if ([11, 12].indexOf(menu.ModuleId) !== -1) {
                menu.id += '_' + menu.ProgramOfficerId;
            }
            menu.id = menu.id.replace('...', '');
            if ($scope.openWindows.indexOf(menu.id) === -1) {
                $scope.propertyData[menu.id] = tabService.getProperties($rootScope.user.UserId, menu.ModuleId);
                $scope.propertyData[menu.id].success(function (data) {
                    console.log(data);
                    if (menu.ModuleId == $rootScope.Modules.MEMBER) {
                        console.log($rootScope.Properties);
                        if (menu.GroupTypeId == $rootScope.GroupTypes.BAD_DEBT) {
                            data = data.filter(function (item) {
                                return item.PropertyUniqueId !== $rootScope.Properties.DAILY_TRANSACTION;
                            });
                            data = data.filter(function (item) {
                                return item.PropertyUniqueId !== $rootScope.Properties.BAD_DEBT_TRANSFER;
                            });
                            data = data.filter(function (item) {
                                return item.PropertyUniqueId !== $rootScope.Properties.ADJUST_LOAN;
                            });
                        } else {
                            data = data.filter(function (item) {
                                return item.PropertyUniqueId !== $rootScope.Properties.BAD_DEBT_ACCOUNT && item.PropertyUniqueId !== $rootScope.Properties.BAD_DEBT_DAILY_TRANSACTION;
                            });
                        }
                    }
                    if (menu.ModuleId == $rootScope.Modules.GROUP) {
                        console.log($rootScope.Properties);
                        if (menu.GroupTypeId == $rootScope.GroupTypes.BAD_DEBT) {
                            data = data.filter(function (item) {
                                return item.PropertyUniqueId !== $rootScope.Properties.GROUP_TRANSACTION_1;
                            });
                            data = data.filter(function (item) {
                                return item.PropertyUniqueId !== $rootScope.Properties.GROUP_TRANSACTION_2;
                            });
                        } else {
                            data = data.filter(function (item) {
                                return item.PropertyUniqueId !== $rootScope.Properties.GROUP_TRANSACTION_BAD_1 && item.PropertyUniqueId !== $rootScope.Properties.GROUP_TRANSACTION_BAD_2;
                            });
                        }
                    }
                    if (menu.ModuleId == $rootScope.Modules.GROUP_TYPE) {
                        if (menu.title == 'Bad Debt') {
                            data = data.filter(function (item) {
                                return item.PropertyUniqueId !== $rootScope.Properties.CHANGE_MEETING_DAY;
                            });
                        }
                    }
                    console.log(menu, data);
                    data.forEach(e => e.pageTitle = menu.pageTitle + e.DisplayName);
                    $scope.tabs[$scope.openWindows.indexOf(menu.id)].properties = data;
                    setTimeout(function () {
                        AMMS.tooltipUtility();
                    }, 50);
                }, AMMS.handleServiceError).error(function () { });
                if (menu.DisplayName.length > 10) {
                    menu.title = menu.DisplayName.slice(0, 10) + '..';
                    menu.tooltipName = menu.DisplayName;
                } else {
                    menu.title = menu.DisplayName;
                    menu.tooltipName = "";
                }
                $scope.tabs.unshift(menu);
                $scope.openWindows.unshift(menu.id);
                this.switchTab(menu.id);
            }
            if ($scope.openWindows.indexOf(menu.id) > -1) {
                if ($scope.extraTabIds.indexOf(menu.id) > -1) {
                    var tab = $scope.extraTabs.splice($scope.extraTabIds.indexOf(menu.id), 1);
                    $scope.extraTabIds.splice($scope.extraTabIds.indexOf(menu.id), 1);
                    $scope.tabs.unshift(tab[0]);
                }
                this.switchTab(menu.id);
            }
            this.insertIntoExtraTabs();
        }
        $scope.openPropTab = function (prop, tabData) {
            $scope.selectedMenu = Object.assign({}, $scope.selectedMenu, prop, tabData);
            $rootScope.clickedPropertyName = prop.DisplayName ? prop.DisplayName : "";
            prop.id = tabData.id + "_prop_" + prop.PropertyId;
            console.log(prop, tabData);
            prop.title = prop.DisplayName;
            if (prop.DisplayName.length > 10) {
                prop.title = prop.DisplayName.slice(0, 10) + '..';
                prop.tooltipName = prop.DisplayName;
            } else {
                prop.title = prop.DisplayName;
                prop.tooltipName = "";
            }
            prop.isProperty = true;
            if ($scope.openWindows.indexOf(prop.id) === -1) {
                var currentTab = $scope.openWindows.indexOf(tabData.id);
                if (currentTab < 0) currentTab = 0;
                $scope.openWindows.splice(currentTab, 0, prop.id);
                $scope.tabs.splice(currentTab, 0, prop);
                $scope.tabs[$scope.openWindows.indexOf(prop.id)].typeOfForm = prop.LinkText;
            } else {
                if ($scope.extraTabs.indexOf(prop) > -1) {
                    var tab = $scope.extraTabs.splice($scope.extraTabIds.indexOf(prop.id), 1);
                    $scope.extraTabIds.splice($scope.extraTabIds.indexOf(prop.id), 1);
                    $scope.tabs.unshift(tab[0]);
                }
            }
            setTimeout(function () {
                AMMS.tooltipUtility();
            }, 50);
            this.switchTab(prop.id);
            this.insertIntoExtraTabs();
        }
        $scope.openCommandTab = function (command, tabId, prop, otherParams) {
            console.log(command, tabId, prop, otherParams);
            $scope.selectedMenu = Object.assign({}, $scope.selectedMenu, prop, otherParams);
            console.log(command, tabId, prop, otherParams);
            command.id = tabId + "_command_" + command.CommandId;
            command.title = command.DisplayName;
            if ((prop + " " + command.DisplayName).length > 10) {
                command.title = (command.DisplayName + " " + prop).slice(0, 10) + '..';
            } else {
                command.title = command.DisplayName + " " + prop;
            }
            command.tooltipName = command.DisplayName + " " + prop;
            command.isCommand = true;
            command.FormType = command.CommandName;
            command.FormName = prop;
            Object.keys(otherParams).forEach(function (key) {
                $rootScope[key] = otherParams[key];
            });
            if ($scope.openWindows.indexOf(command.id) === -1) {
                var currentTab = $scope.openWindows.indexOf(tabId);
                command.pageTitle = $scope.tabs[currentTab].pageTitle + "\\ " + command.DisplayName;
                $scope.openWindows.splice(currentTab, 0, command.id);
                $scope.tabs.splice(currentTab, 0, command);
                $scope.tabs[$scope.openWindows.indexOf(command.id)].typeOfForm = command.LinkText;
            } else {
                if ($scope.extraTabs.indexOf(command) > -1) {
                    var tab = $scope.extraTabs.splice($scope.extraTabIds.indexOf(command.id), 1);
                    $scope.extraTabIds.splice($scope.extraTabIds.indexOf(command.id), 1);
                    $scope.tabs.unshift(tab[0]);
                }
            }
            setTimeout(function () {
                AMMS.tooltipUtility();
            }, 50);
            this.switchTab(command.id);
            this.insertIntoExtraTabs();
            console.log($scope.tabs);
        }
        $scope.restoreTab = function (tab) {
            $scope.tabs.unshift(tab);
            $scope.extraTabs.splice($scope.extraTabs.indexOf(tab), 1);
            $scope.extraTabIds.splice($scope.extraTabs.indexOf(tab), 1);
            this.insertIntoExtraTabs();
            this.switchTab(tab.id);
            console.log($scope.tabs);
        }
        $scope.switchTab = function (id) {
            $rootScope.$broadcast('tab-switched');
            setTimeout(function () {
                $scope.$apply(function () {
                    $('#tab a[href="#tabContent_' + id + '"]').tab('show');
                });
            }, 25);
        }
        $scope.checkExtraTab = function () {
            var mainWidth;
            if (!$('#main-container').hasClass("row-asa-expand")) {
                mainWidth = $('#amms-tabs').width() - 117;
            } else {
                mainWidth = $('#amms-tabs').width();
            }
            var exTabWidth = $('.extra-tabs').width();
            mainWidth -= exTabWidth;
            var sum = 200;
            setTimeout(function () {
                $('#amms-tabs li').each(function () {
                    sum += $(this).width();
                });
                $scope.showExtraTabList = sum > mainWidth;
            }, 50);
        }
        $scope.removeTabFromExtra = function (tab) {
            $scope.openWindows.splice($scope.openWindows.indexOf(tab.id), 1);
            $scope.extraTabs.splice($scope.extraTabs.indexOf(tab), 1);
        }
        $scope.insertIntoExtraTabs = function () {
            this.checkExtraTab();
            setTimeout(function () {
                if ($scope.showExtraTabList === true) {
                    var tempTab = $scope.tabs.pop();
                    $scope.extraTabs.unshift(tempTab);
                    $scope.extraTabIds.unshift(tempTab.id);
                }
            }, 100);
        }
        $scope.putIndentation = function (level) {
            return {
                "padding-left": (level - 1) * (level === 5 ? 7 : 5) + 'px'
            }
        }
        $scope.labelStyle = function (level, hasMeetingDay, hasParentMeetingDay, hasSchedule) {
            var style = {
                "width": (150 - level * 4) + 'px',
                "height": (20 - level * 2) + 'px',
                "overflow-wrap": "normal",
                "font-weight": "normal"
            };
            if (hasMeetingDay && level === 4) style["color"] = "#0061FF";
            else if (hasMeetingDay && level === 5 && hasParentMeetingDay) style["color"] = "#0061FF";
            else if (level === 5 && hasSchedule) style["color"] = "#B12A54";
            return style;
        }
        $scope.showExpandCollapse = function (level) {
            return level === 5 ? '' : 'fa fa-plus expand-collapse-icon';
        }
        $scope.removeAllTab = function () {
            var k = $scope.tabs.length + $scope.extraTabs.length;
            $scope.tabs = $scope.tabs.concat($scope.extraTabs);
            $scope.extraTabs = [];
            $scope.extraTabIds = [];
            $scope.showExtraTabList = false;
            var p = 0;
            for (var i = 0; i < k; i++) {
                var tab = $scope.tabs[p];
                if (tab && tab.ConfirmPrompt && tab.FormType !== "VIEW") {
                    p++;
                    continue;
                }
                if (tab) {
                    $scope.tabs.splice($scope.tabs.indexOf(tab), 1);
                    $scope.openWindows.splice($scope.openWindows.indexOf(tab.id), 1);
                }
            }
        }
        $scope.removeAllTabinDayOpenClose = function () {
            var k = $scope.tabs.length + $scope.extraTabs.length;
            $scope.tabs = $scope.tabs.concat($scope.extraTabs);
            $scope.extraTabs = [];
            $scope.extraTabIds = [];
            $scope.showExtraTabList = false;
            var p = 0;
            for (var i = 0; i < k; i++) {
                var tab = $scope.tabs[p];
                if (tab) {
                    $scope.tabs.splice($scope.tabs.indexOf(tab), 1);
                    $scope.openWindows.splice($scope.openWindows.indexOf(tab.id), 1);
                }
            }
        }
        $scope.$on('day-close-finished', function () {
            $scope.removeAllTabinDayOpenClose();
        });
        $scope.$on('day-open-finished', function () {
            $scope.removeAllTabinDayOpenClose();
            $scope.getMenus();
        });
        $rootScope.$on('propertyNotificationClicked', function (args, newTabInfo) {
            tabService.getProperties($rootScope.user.UserId, newTabInfo.ModuleId).success(function (data) {
                var property = data.filter(e => e.PropertyUniqueId === newTabInfo.PropertyId)[0];
                var tabData = {
                    id: newTabInfo.ModuleId
                };
                $rootScope.notificationData = (newTabInfo.OtherInfoJson != null) ? JSON.parse(newTabInfo.OtherInfoJson) : {};
                $scope.openPropTab(property, tabData);
            });
        });
        $rootScope.$on('moduleNotificationClicked', function (args, newTabInfo) {
            $rootScope.notificationData = (newTabInfo.OtherInfoJson != null) ? JSON.parse(newTabInfo.OtherInfoJson) : {};
            var menu = $scope.menus.filter(e => e.ModuleId = newTabInfo.ModuleId)[0];
            $scope.openNewTab(menu);
        });
        $rootScope.$on('commandNotificationClicked', function (args, newTabInfo) {
            $rootScope.notificationData = (newTabInfo.OtherInfoJson != null) ? JSON.parse(newTabInfo.OtherInfoJson) : {};
        });
        $scope.$on('day-close-finished', function () {
            $scope.getMenus();
        });
    }
]);