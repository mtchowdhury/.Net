ammsAng.controller('balanceSheetReportController', ['$scope', '$rootScope', 'filterService', '$timeout', 'reportService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $rootScope, filterService, $timeout, reportService, DTOptionsBuilder, DTColumnDefBuilder) {
        var temp = new Date($rootScope.workingdate);
        $scope.startDate = $rootScope.workingdate;
        $scope.endDate = $rootScope.workingdate;
        $scope.reportId = 0;
        $scope.roleId = $rootScope.user.Role;
        $scope.employeeId = parseInt($rootScope.user.EmployeeId);
        // $scope.employeeId = $scope.officer.length>0?$scope.officer[0].EmployeeId:0;
        //$scope.employeeId = $scope.officer[0].EmployeeId;
        $scope.branchId = $scope.selectedBranchId;
        $scope.reportTypeId = 3;


        $scope.dtOptions = DTOptionsBuilder.newOptions()
               .withOption('order', [])
               .withPaginationType('full_numbers')
               .withDisplayLength(20);

        $scope.dtColumnDefs = [

       DTColumnDefBuilder.newColumnDef(0).notSortable(),
       DTColumnDefBuilder.newColumnDef(1).notSortable(),
       DTColumnDefBuilder.newColumnDef(2).notSortable(),
       DTColumnDefBuilder.newColumnDef(3).notSortable(),
       DTColumnDefBuilder.newColumnDef(4).notSortable()


        ];
        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px',
            displayProp: 'Name',
            idProp: 'Value'
        }
        $scope.beforeStartDateRender = function ($dates) {
            if (($scope.startDate !== undefined || $scope.startDate !== null) && ($scope.endDate !== undefined || $scope.endDate !== null))
                if (moment($scope.startDate) > moment($scope.endDate) && !$scope.selectedReport.AsOfDate) {
                    swal('start date can not be greater than end date!');
                    $scope.startDate = new Date($scope.endDate - 30);
                }
        }
        $scope.beforeEndDateRender = function ($dates) {
            if (($scope.startDate !== undefined || $scope.startDate !== null) && ($scope.endDate !== undefined || $scope.endDate !== null))
                if (moment($scope.startDate) > moment($scope.endDate) && !$scope.selectedReport.AsOfDate) {
                    swal('end date can not be less than start date!');
                    $scope.endDate = new Date($scope.startDate + 30);
                }
        }

        $scope.getReports = function () {
            $("#loadingImage").css("display", "block");
            reportService.getReportsByType($scope.reportTypeId).then(function (response) {
                $scope.reports = angular.copy(response.data);
                //$scope.getFilters($scope.reports[0].Value);
                $("#loadingImage").css("display", "none");
            });
        }

        $scope.getFilters = function (reportId) {
            if (!$scope.reportId) return;
            $scope.tableData = {};
            $("#loadingImage").css("display", "block");
            var reports = $scope.reports.filter(r => r.Value === $scope.reportId);
            if (reports && reports.length > 0)
                $scope.selectedReport = reports[0];
            //Date filter new param
            reportService.getFilters(reportId, $scope.roleId, $scope.employeeId, $scope.branchId, "1975-10-03", moment($rootScope.workingdate).format()).then(function (response) {
                $scope.filters = angular.copy(response.data);
                $scope.filters.forEach(function (filterValue) {
                    if (filterValue.FilterType === "DropDown") {
                        var hasAll = filterValue.Dropdowns.filter(f => f.Value === '-1');
                        filterValue.Param = hasAll.length > 0 ? '-1' : filterValue.Dropdowns.length > 0 ? filterValue.Dropdowns[0].Value : '';
                    } else if (filterValue.FilterType === "MultiSelectDropDown") {
                        filterValue.Param = [];

                    }

                    else
                        filterValue.Param = false;
                });
                $scope.selectDefaultValues($scope.filters);
                console.log($scope.filters);
                $("#loadingImage").css("display", "none");
            });
        }
        $scope.selectDefaultValues = function () {
            $scope.filters.forEach(function (filterValue) {
                if (filterValue.FilterType === 'DropDown') {
                    if (filterValue.Name === 'LoanOfficer' && filterValue.Dropdowns.filter(f => f.Value === $scope.employeeId.toString()).length > 0) filterValue.Param = filterValue.Dropdowns.filter(f => f.Value === $scope.employeeId.toString())[0].Value;
                    if (filterValue.Name === 'Year' && filterValue.Dropdowns.filter(f => f.Value === moment($rootScope.workingdate).year().toString()).length > 0) filterValue.Param = filterValue.Dropdowns.filter(f => f.Value === moment($rootScope.workingdate).year().toString())[0].Value;
                    if (filterValue.Name === 'Month') filterValue.Param = filterValue.Dropdowns.filter(f => f.Value === (moment($rootScope.workingdate).month() + 1).toString())[0].Value;
                    if (filterValue.Name === 'Branches') filterValue.Param = $rootScope.selectedBranchId.toString();
                }
            });
        }

        $scope.getFilterString = function () {

            var filterString = '';
            var reports = $scope.reports.filter(r => r.Value === $scope.reportId);
            if (reports && reports.length > 0)
                $scope.selectedReport = reports[0];
            var nullpassed = false;
            if ($scope.filters.filter(f => f.FilterType === "MultiSelectDropDown").length > 0) {
                $scope.filters.filter(f => f.FilterType === "MultiSelectDropDown").forEach(function (filter) {
                    if (filter.Param.length < 1) filter.Param.push({ id: -1 });
                });
            }
            if ($scope.selectedReport && $scope.selectedReport.HasDateFilter && $scope.selectedReport.AsOfDate) {
                filterString = '@endDate|' + moment($('input[name="tDate"]').val(), 'DD-MM-YYYY').format('YYYYMMDD') + '000000#';
            } else if ($scope.selectedReport && $scope.selectedReport.HasDateFilter && !$scope.selectedReport.AsOfDate) {
                filterString = '@startDate|' + moment($('input[name="fDate"]').val(), 'DD-MM-YYYY').format('YYYYMMDD') + '000000#@endDate|' + moment($('input[name="tDate"]').val(), 'DD-MM-YYYY').format('YYYYMMDD') + '000000#';
            }
            filterString += '@employee' + '|' + $scope.employeeId + '#' + '@role' + '|' + $scope.roleId + '#';
            $scope.filters.forEach(function (filter) {
                if (filter.Param === undefined) {
                    nullpassed = true;
                    return;
                }
                if (filter.FilterType !== 'MultiSelectDropDown') {
                    filterString += filter.ParamName + '|' + filter.Param + '#';
                } else {
                    var multiParams = '';
                    filter.Param.forEach(function (pr) {
                        multiParams += pr.id + ',';
                    });
                    multiParams = multiParams.substring(0, multiParams.length - 1);
                    filterString += filter.ParamName + '|' + multiParams + '#';
                    if (filter.Param[0].id === -1) filter.Param = [];
                }
            });

            filterString = filterString.substring(0, filterString.length - 1);
            if (nullpassed) {
                swal('Please select all required filters!'); return '!invalid!';
            }
            return filterString;
        }

        $scope.onFilterChange = function (filters) {
            if (!filters) return;
            var filterIds = filters.split(',');

            angular.forEach(filterIds, function (value, key) {
                $("#loadingImage").css("display", "block");
                var filterList = $scope.filters.filter(f => f.Id == value);
                if (filterList && filterList.length > 0) {
                    var filter = filterList[0];
                    if (!filter.DependentParams) {
                        reportService.getFilter(filter.Id)
                            .then(function (response) {
                                filter.Dropdowns = response.data;
                                console.log(response.data);
                                filter.Param = '-1';
                                if (filter.DependentFilters) {
                                    $scope.onFilterChange(filter.DependentFilters);
                                } else {
                                    $("#loadingImage").css("display", "none");
                                }
                            });
                    } else {
                        var dependentParamList = filter.DependentParams.split(',');
                        var dFilter = [];


                        dependentParamList.forEach(function (dp) {
                            var items = $scope.filters.filter(f => f.ParamName == dp);
                            if (items.length < 1) {
                                if (dp === '@role') items = [{ ParamName: '@role', Param: $scope.roleId }];
                                if (dp === '@employee') items = [{ ParamName: '@employee', Param: $scope.employeeId }];



                                if ((dp === '@startDate'||dp === '@endDate') && $scope.selectedReport.HasDateFilter && $scope.selectedReport.AsOfDate) {
                                    if (dp === '@startDate') items = [{ ParamName: '@startDate', Param: '19010101000000' }];
                                    if (dp === '@endDate') items = [{ ParamName: '@endDate', Param: moment($scope.startDate).format('YYYYMMDD') + '000000' }];
                              } else {
                                    if (dp === '@startDate') items = [{ ParamName: '@startDate', Param: moment($scope.startDate).format('YYYYMMDD') + '000000' }];
                                    if (dp === '@endDate') items = [{ ParamName: '@endDate', Param: moment($scope.endDate).format('YYYYMMDD') + '000000' }];
                              }

                                
                            }
                            dFilter.push(items);
                        });
                        var paramList = $scope.dependentParamStringFilter(dFilter);
                        if (dFilter.length > 0) {
                            reportService.getFilter(filter.Id, paramList)
                            .then(function (response) {
                                filter.Dropdowns = response.data;
                                filter.Param = filter.Dropdowns.filter(f=>f.Value === '-1').length > 0 ? '-1' : filter.Dropdowns[0].Value;
                                if (filter.DependentFilters) {
                                    $scope.onFilterChange(filter.DependentFilters);
                                } else {
                                    $("#loadingImage").css("display", "none");
                                }
                            });
                        }
                    }
                }
            });
        }
        $scope.dependentParamStringFilter = function (dependentParamList) {
            var str = "";
            dependentParamList.forEach(function (dpl) {
                dpl.forEach(function (d) {
                    str += d.ParamName + '|' + d.Param + '#';
                });
            });
            str = str.substring(0, str.length - 1);
            return str;
        }

        $scope.formatCellValue = function (cell, column) {
            //if ((column.toLowerCase().indexOf('_date') > -1 || column.toLowerCase().indexOf('_int date') > -1
            //    || column.toLowerCase().indexOf('_intdate') > -1) && cell)
            //    return moment(cell).format('DD-MM-YYYY');
            //if ((column.toLowerCase().indexOf('_datetime') > -1 || column.toLowerCase().indexOf('_int datetime') > -1
            //    || column.toLowerCase().indexOf('_intdatetime') > -1) && cell)
            //    return moment(cell).format('DD-MM-YYYY hh:mm:ss');
            //if ((column.toLowerCase().indexOf('_double') > -1 || column.toLowerCase().indexOf('_float') > -1) && cell)
            //    return numeral(cell).format('0,0.00');
            //if ((column.toLowerCase().indexOf('_int') > -1) && cell)
            //    return numeral(cell).format('0,0');
            return cell;
        }

        $scope.loadReport = function () {
            if (!$scope.reportId || $scope.reportId === 0) return;
            $("#loadingImage").css("display", "block");
            var filterString = $scope.getFilterString();
            if (filterString === '!invalid!')
                return;
            if ($scope.dtInstance)
                $scope.dtInstance.DataTable.destroy();
            reportService.getData($scope.reportId, filterString).then(function (response) {
                $scope.tableData = response.data;
                console.log($scope.tableData);
                $("#loadingImage").css("display", "none");
            });
        }

        $scope.getActiveTab = function (index) {
            return index === 0 ? 'active' : '';
        }

        $scope.getTabName = function (index) {
            return 'Report' + index;
        }

        $scope.styleTotalRow = function (cells) {
            var cls = '';
            angular.forEach(cells, function (cell, key) {
                if ((cell + '').indexOf('Total') > -1 || (cell + '').indexOf('Summary') > -1)
                    cls = "total-row";
            });
            return cls;
        }

        $scope.setPageLength = function (rows) {
            return rows.length <= 10 ? 10 : rows.length <= 20 ? 20 : 50;
        }

        $scope.setHeaderStyle = function (colSpan, rowSpan, layer) {
            var style = {};
            if (colSpan > 1) style['text-align'] = 'center';
            if (rowSpan > 1) style['vertical-align'] = 'middle';
            if (layer === 0) style["background-color"] = '#77b4f3';
            else if (layer === 1) style["background-color"] = '#8abbe0';
            else if (layer === 2) style["background-color"] = '#a7cae4';
            else style["background-color"] = '#cbddea';
            return style;
        }

        $scope.export = function () {
            if (!$scope.reportId || $scope.reportId === 0) return;
            var filterString = $scope.getFilterString();
            if (filterString === '!invalid!') {
                swal('Please select all required filters!');
                return;
            }
            var url = reportService.getExportUrl($scope.reportId, filterString);
            window.open(url, '_blank');
        }

        $scope.Init = function () {
            $scope.getReports();
        }
        $scope.Init();


        //new date picker 
        //$scope.today = function () {
        //    $scope.eaccount.OpeningDate = new Date($rootScope.workingdate);
        //    $scope.eaccount.DisburseDate = new Date($rootScope.workingdate);
        //};
        //$scope.today();



        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date($rootScope.workingdate),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2040, 5, 22),
            minDate: new Date($rootScope.workingdate),
            startingDay: 1
        };

        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (mode === 'day' && (date.getDay() === 5))
                        || (moment(date) > moment(new Date($rootScope.workingdate)));
        }

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

        // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','dd/MM/yyyy'];
        $scope.format = $rootScope.formats[4];
        //$scope.format = $scope.altInputFormats;
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.fromPop = {
            opened: false
        };

        $scope.toPop = {
            opened: false
        };



        function getDayClass(data) {
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
        //$scope.fromValidator = function () {

        //    $scope.onFilterChange($scope.filter.DependentFilters);
        //}
        //$scope.toValidator = function () {

        //    $scope.onFilterChange($scope.filter.DependentFilters);
        //}


    }]);