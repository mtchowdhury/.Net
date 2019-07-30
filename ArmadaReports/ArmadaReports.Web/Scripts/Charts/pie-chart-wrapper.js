var pieChartWrapper = {
    searchableDdl: null,
    searchableSpDdl: null,
    searchableDetailsDdl: null,
    searchableSpDetailsDdl: null,
    renderTopMiddleChart: function (data) {
        $('#tm-chart-title').html($('#bg-tm button.btn-selected').text() + ' ' + data.DateString + " - 0 Referrals");
        if (!data) return;

        if (utility.chechDataAvailibility('top-middle-no-data', 'top-middle-pie-chart', 'tm-chart-title', data.Statuses)) {
            var dataPlots = [];
            data.Statuses.sort(function(a, b) { return b.TotalCount - a.TotalCount; });
            $.each(data.Statuses, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.ProgramStatus, rowCount: item.TotalCount, 
                    legendText: 'Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount +
                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (item.TotalCountPercent * 100).toFixed(2) + 
                        //'%<br\>New Rx: ' + item.NewRxCount + '<br\>Refills: ' + item.RefillCount +
                        '<br\>' + $('#bg-tm button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            console.log(dataPlots);
            var tmPie = new CanvasJS.Chart("top-middle-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                            '&dateRangeType=' + $('#bg-tm button.btn-selected').attr('data-date') + '&programStatus=' + e.dataPoint.label +
                            '&rowCount=' + e.dataPoint.rowCount + '&reportName=IntakeProgramStatus', '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' + $('#bg-tm button.btn-selected').attr('data-date') + '&rowCount=' + data.TotalCount + '&reportName=IntakeProgramStatus';
            $('#tm-chart-title').html('<a href="' + url + '" target="_blank">' + service.getDateText('bg-tm') + ' ' + data.DateString + " - " + numeral(data.TotalCount).format('0,0') +" Referrals</a> "
                //"(" + numeral(data.RxCount).format('0,0') + ' New Rx - ' + numeral(data.RefillCount).format('0,0') + ' Refills)'
                );
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderTopMiddleDetailsChart: function (data) {
        $('#tm-d-chart-title').html($('#bg-tm button.btn-selected').text() + ' ' + data.DateString + " - 0 Referrals");
        if (!data) return;

        if (utility.chechDataAvailibility('top-middle-no-data-d', 'top-middle-pie-chart-details', 'tm-d-chart-title', data.Statuses)) {
            var dataPlots = [];
            $.each(data.Statuses, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.ProgramStatus, rowCount: item.TotalCount,
                    legendText: 'Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount +
                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (item.TotalCountPercent * 100).toFixed(2) +
                        //'%<br\>New Rx: ' + item.NewRxCount + '<br\>Refills: ' + item.RefillCount +
                        '<br\>' + $('#bg-tm-d button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var tmDPie = new CanvasJS.Chart("top-middle-pie-chart-details",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                            '&dateRangeType=' + $('#bg-tm-d button.btn-selected').attr('data-date') + '&programStatus=' +
                            e.dataPoint.label + '&rowCount=' + e.dataPoint.rowCount + '&reportName=IntakeProgramStatus', '_blank');
                    }
                }
                ]
            });
            tmDPie.render();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' + $('#bg-tm-d button.btn-selected').attr('data-date') + '&rowCount=' + data.TotalCount + '&reportName=IntakeProgramStatus';
            $('#tm-d-chart-title').html('<a href="' + url + '" target="_blank">' + service.getDateText('bg-tm-d') + ' ' + data.DateString + " - " + numeral(data.TotalCount).format('0,0') + " Referrals</a> "
                //"(" + numeral(data.RxCount).format('0,0') + ' New Rx - ' + numeral(data.RefillCount).format('0,0') + ' Refills)'
                );
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderTopRightChart: function (data, name) {
        console.log(data);
        if (!data.IsDrilldown) {
            if (pieChartWrapper.searchableDdl)
                $("#managers-tr").select2("destroy");
            $('#managers-tr').empty();
        } else {
            if (pieChartWrapper.searchableSpDdl)
                $("#salesrep-tr").select2("destroy");
            $('#salesrep-tr').empty();
        }
        $('#tr-chart-title').html('0 Pharmacies - ' + $('#bg-tr button.btn-selected').text() + ' ' + data.DateString + ' - 0 Referrals');
        if (!data) return;
        if (utility.chechDataAvailibility('top-right-no-data', 'top-right-pie-chart', 'tr-chart-title', data.Districts)) {
            var dataPlots = [];
            $('#managers-tr').append($('<option>', {
                value: '-1',
                text: 'All'
            }));
            $('#salesrep-tr').append($('<option>', {
                value: '-1',
                text: 'All'
            }));
            $.each(data.Districts, function (index, item) {
                if (($('#hid-user-role').val() === 'PROGRAMMGR' || $('#hid-user-role').val() === 'DISTRICTMGR'
                     || $('#hid-user-role').val() === 'SALESREP' || $('#hid-user-role').val() === 'SALES REP') && index <= 19) {
                    dataPlots.push({
                        y: (item.TotalCountPercent * 100).toFixed(2), label: !data.IsDrilldown ? item.DisplayName : item.UserName, user: item.UserId, referralCode: item.ReferralCode, rowCount: item.TotalCount,
                        name: item.DisplayName, legendText: !data.IsDrilldown ? item.DisplayName + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            (item.TotalCountPercent * 100).toFixed(2) + '%<br\>District Manager: ' + item.UserName +
                            '<br\>Time Period: ' + $('#bg-tr button.btn-selected').text() + ' ' + data.DateString
                            : 'Sales Rep: ' + item.DisplayName + '<br\>Referral Code: ' + item.ReferralCode + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            (item.TotalCountPercent * 100).toFixed(2) +
                            '%<br\>Time Period: ' + $('#bg-tr-dd button.btn-selected').text() + ' ' + data.DateString,
                        color: colorSchema.brandColors[index]
                    });
                } else {
                    dataPlots.push({
                        y: (item.TotalCountPercent * 100).toFixed(2), label: !data.IsDrilldown ? item.DisplayName : item.UserName, user: item.UserId, referralCode: item.ReferralCode, rowCount: item.TotalCount,
                        name: item.DisplayName, legendText: !data.IsDrilldown ? item.DisplayName + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            (item.TotalCountPercent * 100).toFixed(2) + '%<br\>District Manager: ' + item.UserName +
                            '<br\>Time Period: ' + $('#bg-tr button.btn-selected').text() + ' ' + data.DateString
                            : 'Sales Rep: ' + item.DisplayName + '<br\>Referral Code: ' + item.ReferralCode + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            (item.TotalCountPercent * 100).toFixed(2) +
                            '%<br\>Time Period: ' + $('#bg-tr-dd button.btn-selected').text() + ' ' + data.DateString,
                        color: colorSchema.brandColors[index]
                    });
                }
                if (!data.IsDrilldown) {
                    $('#managers-tr').append($('<option>', {
                        value: data.Managers[index].UserId,
                        text: data.Managers[index].DisplayName
                    }));
                } else {
                    $('#salesrep-tr').append($('<option>', {
                        value: data.Managers[index].UserId + '|' + data.Managers[index].ReferralCode + '|' + data.Managers[index].TotalCount,
                        text: data.Managers[index].DisplayName + ' (' + data.Managers[index].ReferralCode + ')'
                    }));
                }
            });
            var trPie = new CanvasJS.Chart("top-right-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        if (data.IsDrilldown) {
                            var reportsTo = $('#reports-to').val() ? '&reportsTo=' + $('#reports-to').val() : '';
                            var salesRep = e.dataPoint.user ? '&salesReferralUser=' + e.dataPoint.user : '';
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                                $('#bg-tr-dd button.btn-selected').attr('data-date') + '&referralCode=' + e.dataPoint.referralCode +
                                reportsTo + salesRep + '&rowCount=' + e.dataPoint.rowCount + '&strength=' + $('#strength-tr').val() +
                                '&districtManager=dm' + '&reportName=DistrictManagersIntakes', '_blank');
                        } else {
                            service.getDrilldownDistrictManagers(e.dataPoint.user, e.dataPoint.name);
                        }
                    }
                }
                ]
            });
            trPie.render();
            

        }
        if (data.IsDrilldown) {
            if ($('#hid-user-role').val() === 'PROGRAMMGR' ||
                (($('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP') && $('#hid-user-rolename').val() === 'Armada employee'))
                $('#district-manager-btn').show();
            //if ($('#hid-user-role').val() === 'PROGRAMMGR' || ($('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP') && $('#hid-user-rolename').val() === 'Armada employee')
            //    $('#district-manager-btn').show();
            else
                $('#district-manager-btn').hide();
            $('#yes-drilldown').show();
            $('#no-drilldown').hide();
            $('#yes-drilldown-popup').show();
            $('#no-drilldown-popup').hide();
            $('#reports-to').val(data.ReportsTo);
            $('#reports-to-d').val(data.ReportsTo);
            $('#sales-rep').show();
            if ($('#reports-name').val())
                $('#sales-rep').text('Sales Reps for ' + $('#reports-name').val());
            $('#top-right-pie-chart').removeClass('pie-chart-container-withot-btn');

            $("#managers-tr-div").hide();
            if ($('#hid-user-role').val() === 'PROGRAMMGR' || $('#hid-user-role').val() === 'DISTRICTMGR' || $('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP')
                $('#salesrep-tr-div').show();
            else
                $('#salesrep-tr-div').hide();

            $("#salesrep-tr").val('-1');
            pieChartWrapper.searchableSpDdl = $("#salesrep-tr").select2();
        } else {
            
            $('#district-manager-btn').hide();
            $('#yes-drilldown').hide();
            $('#no-drilldown').show();
            $('#yes-drilldown-popup').hide();
            $('#no-drilldown-popup').show();
            $('#sales-rep').hide();
            $('#sales-rep').text('');
            $('#top-right-pie-chart').addClass('pie-chart-container-withot-btn');

            $('#salesrep-tr-div').hide();
            if ($('#hid-user-role').val() === 'PROGRAMMGR' || $('#hid-user-role').val() === 'DISTRICTMGR' || $('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP')
                $('#managers-tr-div').show();
            else
                $('#managers-tr-div').hide();

            $("#managers-tr").val('-1');
            pieChartWrapper.searchableDdl = $("#managers-tr").select2();
        }
        var url = !data.IsDrilldown ?service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&strength=' + $('#strength-tr').val() +
            '&dateRangeType=' + $('#bg-tr button.btn-selected').attr('data-date') + '&rowCount=' + data.TotalCount + '&districtManager=dm' + '&reportName=DistrictManagersIntakes'
            : service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&strength=' + $('#strength-tr').val() +
            '&dateRangeType=' + $('#bg-tr button.btn-selected').attr('data-date') + '&rowCount=' + data.TotalCount + '&districtManager=dm' + '&reportName=DistrictManagersIntakes' +( !$('#reports-to').val()?'': '&reportsTo=' + $('#reports-to').val());
        var dt = !data.IsDrilldown ? $('#bg-tr button.btn-selected:visible').text() === 'QTD' ? $('#bg-tr button.btn-selected:visible').attr('data-date').toUpperCase() : $('#bg-tr button.btn-selected:visible').text()
            : $('#bg-tr-dd button.btn-selected:visible').text() === 'QTD' ? $('#bg-tr-dd button.btn-selected:visible').attr('data-date').toUpperCase() : $('#bg-tr-dd button.btn-selected:visible').text();
        $('#tr-chart-title').html(!data.IsDrilldown ? '<a href="' + url + '" target="_blank">' + dt + ' ' + data.DateString + ' - '
            + numeral(data.TotalCount).format('0,0') + ' Referrals</a>'
            : '<a href="' + url + '" target="_blank">' + $('#bg-tr-dd button.btn-selected:visible').text() + ' ' + data.DateString + ', Total Count : ' + data.TotalCount);
        $('.canvasjs-chart-credit').hide();
        setTimeout(function () { $('span.select2').css('width', '180px'); }, 200);
    },

    onManagerSelected: function () {
        if ($("#managers-tr").val() === '-1') return;
        service.getDrilldownDistrictManagers($("#managers-tr").val(), $("#managers-tr option:selected").text());
    },

    onSalesrepSelected: function() {
        if ($("#salesrep-tr").val() === '-1') return;
        var reportsTo = $('#reports-to').val() ? '&reportsTo=' + $('#reports-to').val() : '';
        var salesRep = $('#salesrep-tr').val().split('|')[0] ? '&salesReferralUser=' + $('#salesrep-tr').val().split('|')[0] : '';
        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                                $('#bg-tr-dd button.btn-selected').attr('data-date') + '&referralCode=' + $('#salesrep-tr').val().split('|')[1] + reportsTo
                                + salesRep + '&rowCount=' + $('#salesrep-tr').val().split('|')[2] + '&districtManager=dm' + '&reportName=DistrictManagersIntakes', '_blank');
    },

    onDetailsManagerSelected: function () {
        if ($("#managers-tr-d").val() === '-1') return;
        service.getDetailsDrilldownDistrictManagers($("#managers-tr-d").val(), $("#managers-tr-d option:selected").text());
    },

    onDetailsSalesrepSelected: function () {
        if ($("#salesrep-tr-d").val() === '-1') return;
        var reportsTo = $('#reports-to-d').val() ? '&reportsTo=' + $('#reports-to-d').val() : '';
        var salesRep = $('#salesrep-tr-d').val().split('|')[0] ? '&salesReferralUser=' + $('#salesrep-tr-d').val().split('|')[0] : '';
        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                                $('#bg-tr-dd-d button.btn-selected').attr('data-date') + '&referralCode=' + $('#salesrep-tr-d').val().split('|')[1]
                                + reportsTo + salesRep + '&rowCount=' + $('#salesrep-tr-d').val().split('|')[2] + '&districtManager=dm' + '&reportName=DistrictManagersIntakes', '_blank');
    },

    renderTopRightDetailsChart: function (data, name) {
        if (!data.IsDrilldown) {
            if (pieChartWrapper.searchableDetailsDdl)
                $("#managers-tr-d").select2("destroy");
            $('#managers-tr-d').empty();
        } else {
            if (pieChartWrapper.searchableSpDetailsDdl)
                $("#salesrep-tr-d").select2("destroy");
            $('#salesrep-tr-d').empty();
        }
        $('#tr-d-chart-title').html('0 Pharmacies - ' + $('#bg-tr button.btn-selected').text() + ' ' + data.DateString + ' - 0 Referrals');
        if (!data) return;

        if (utility.chechDataAvailibility('top-right-no-data-d', 'top-right-pie-chart-details', 'tr-d-chart-title', data.Districts)) {
            var dataPlots = [];
            $('#managers-tr-d').append($('<option>', {
                value: '-1',
                text: 'All'
            }));
            $('#salesrep-tr-d').append($('<option>', {
                value: '-1',
                text: 'All'
            }));
            $.each(data.Districts, function (index, item) {
                if (($('#hid-user-role').val() === 'PROGRAMMGR' || $('#hid-user-role').val() === 'DISTRICTMGR'
                     || $('#hid-user-role').val() === 'SALESREP' || $('#hid-user-role').val() === 'SALES REP') && index <= 19) {
                    dataPlots.push({
                        y: (item.TotalCountPercent * 100).toFixed(2), label: !data.IsDrilldown ? item.DisplayName : item.UserName, user: item.UserId, referralCode: item.ReferralCode, rowCount: item.TotalCount,
                        name: item.DisplayName, legendText: !data.IsDrilldown ? item.DisplayName + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            (item.TotalCountPercent * 100).toFixed(2) + '%<br\>District Manager: ' + item.UserName +
                            '<br\>Time Period: ' + $('#bg-tr-d button.btn-selected').text() + ' ' + data.DateString
                            : 'Sales Rep: ' + item.DisplayName + '<br\>Referral Code: ' + item.ReferralCode + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            (item.TotalCountPercent * 100).toFixed(2) +
                            '%<br\>Time Period: ' + $('#bg-tr-dd-d button.btn-selected').text() + ' ' + data.DateString,
                        color: colorSchema.brandColors[index]
                    });
                } else {
                    dataPlots.push({
                        y: (item.TotalCountPercent * 100).toFixed(2), label: !data.IsDrilldown ? item.DisplayName : item.UserName, user: item.UserId, referralCode: item.ReferralCode, rowCount: item.TotalCount,
                        name: item.DisplayName, legendText: !data.IsDrilldown ? item.DisplayName + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            (item.TotalCountPercent * 100).toFixed(2) + '%<br\>District Manager: ' + item.UserName +
                            '<br\>Time Period: ' + $('#bg-tr-d button.btn-selected').text() + ' ' + data.DateString
                            : 'Sales Rep: ' + item.DisplayName + '<br\>Referral Code: ' + item.ReferralCode + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            (item.TotalCountPercent * 100).toFixed(2) +
                            '%<br\>Time Period: ' + $('#bg-tr-dd-d button.btn-selected').text() + ' ' + data.DateString,
                        color: colorSchema.brandColors[index]
                    });
                }
                if (!data.IsDrilldown) {
                    $('#managers-tr-d').append($('<option>', {
                        value: data.Managers[index].UserId,
                        text: data.Managers[index].DisplayName
                    }));
                } else {
                    $('#salesrep-tr-d').append($('<option>', {
                        value: data.Managers[index].UserId + '|' + data.Managers[index].ReferralCode + '|' + data.Managers[index].TotalCount,
                        text: data.Managers[index].DisplayName + ' (' + data.Managers[index].ReferralCode + ')'
                    }));
                }
                
            });
            var trdPie = new CanvasJS.Chart("top-right-pie-chart-details",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        if (data.IsDrilldown) {
                            var reportsTo = $('#reports-to-d').val() ? '&reportsTo=' + $('#reports-to-d').val() : '';
                            var salesRep = e.dataPoint.user ? '&salesReferralUser=' + e.dataPoint.user : '';
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-tr-dd-d button.btn-selected').attr('data-date') + '&referralCode=' + e.dataPoint.referralCode
                                + reportsTo + salesRep + '&rowCount=' + e.dataPoint.rowCount + '&strength=' + $('#strength-tr-d').val() +
                                '&districtManager=dm' + '&reportName=DistrictManagersIntakes', '_blank');
                        } else {
                            service.getDetailsDrilldownDistrictManagers(e.dataPoint.user, e.dataPoint.name);
                        }
                    }
                }
                ]
            });
            trdPie.render();
            
        }        
        if (data.IsDrilldown) {
            if ($('#hid-user-role').val() === 'PROGRAMMGR' ||
                (($('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP') && $('#hid-user-rolename').val() === 'Armada employee'))
            //if ($('#hid-user-role').val() === 'PROGRAMMGR' || ($('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP') && $('#hid-user-rolename').val() === 'Armada employee')
                    $('#district-manager-btn-d').show();
            else
                $('#district-manager-btn-d').hide();
            $('#yes-drilldown-d').show();
            $('#no-drilldown-d').hide();
            $('#reports-to-d').val(data.ReportsTo);
            $('#sales-rep-d').show();
            if ($('#reports-name-d').val())
                $('#sales-rep-d').text('Sales Reps for ' + $('#reports-name-d').val());
            $('#top-right-pie-chart-details').addClass('details-pie-chart-container-without-btn');
            
            $("#managers-tr-d-div").hide();
            if ($('#hid-user-role').val() === 'PROGRAMMGR' || $('#hid-user-role').val() === 'DISTRICTMGR' || $('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP')
                $('#salesrep-tr-d-div').show();
            else
                $('#salesrep-tr-d-div').hide();

            $("#salesrep-tr-d").val('-1');
            pieChartWrapper.searchableSpDetailsDdl = $("#salesrep-tr-d").select2();
        } else {
            $('#district-manager-btn-d').hide();
            $('#yes-drilldown-d').hide();
            $('#no-drilldown-d').show();
            $('#sales-rep-d').hide();
            $('#sales-rep-d').text('');
            $('#top-right-pie-chart-details').removeClass('details-pie-chart-container-without-btn');
            
            $('#salesrep-tr-d-div').hide();
            if ($('#hid-user-role').val() === 'PROGRAMMGR' || $('#hid-user-role').val() === 'DISTRICTMGR' || $('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP')
                $('#managers-tr-d-div').show();
            else
                $('#managers-tr-d-div').hide();

            $("#managers-tr-d").val('-1');
            pieChartWrapper.searchableDdl = $("#managers-tr-d").select2();
        }
        var url = !data.IsDrilldown ?service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&strength=' + $('#strength-tr-d').val() +
            '&dateRangeType=' + $('#bg-tr-d button.btn-selected').attr('data-date') + '&rowCount=' + data.TotalCount + '&districtManager=dm' + '&reportName=DistrictManagersIntakes'
            : service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&strength=' + $('#strength-tr-d').val() +
            '&dateRangeType=' + $('#bg-tr-d button.btn-selected').attr('data-date') + '&rowCount=' + data.TotalCount + '&districtManager=dm' + '&reportName=DistrictManagersIntakes' + (!$('#reports-to-d').val() ? '' : '&reportsTo=' + $('#reports-to-d').val());
        var dt = !data.IsDrilldown ? $('#bg-tr-d button.btn-selected:visible').text() === 'QTD' ? $('#bg-tr-d button.btn-selected:visible').attr('data-date').toUpperCase() : $('#bg-tr-d button.btn-selected:visible').text()
            : $('#bg-tr-dd-d button.btn-selected:visible').text() === 'QTD' ? $('#bg-tr-dd-d button.btn-selected:visible').attr('data-date').toUpperCase() : $('#bg-tr-dd-d button.btn-selected:visible').text();
        console.log($('#reports-to-d').val());
        console.log(url);
        $('#tr-d-chart-title').html(!data.IsDrilldown ? '<a href="' + url + '" target="_blank">' + dt + ' ' + data.DateString + ' - '
            + numeral(data.TotalCount).format('0,0') + ' Referrals</a>'
            : '<a href="' + url + '" target="_blank">' + $('#bg-tr-dd-d button.btn-selected:visible').text() + ' ' + data.DateString + ', Total Count : ' + data.TotalCount);
        $('.canvasjs-chart-credit').hide();
    },
    
    renderBottomMiddleChart: function (data) {
        $('#bm-chart-title').html('0 Pharmacies - ' + $('#bg-bm button.btn-selected').text() + ' ' + data.DateString + " - 0 Referrals");
        if (!data) return;

        if (utility.chechDataAvailibility('bottom-middle-no-data', 'bottom-middle-pie-chart', 'bm-chart-title', data.Referrals)) {
            var dataPlots = [];
            $.each(data.Referrals, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.PharmacyName, pharmacyId: item.PharmacyId, rowCount: item.TotalCount,
                    legendText: item.PharmacyName + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (item.TotalCountPercent * 100).toFixed(2)
                        + '%<br\>' + $('#bg-bm button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var bmPie = new CanvasJS.Chart("bottom-middle-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                            + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                            + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                            + '&rowCount=' + e.dataPoint.rowCount + '&reportName=PharmacyReferrals', '_blank');
                    }
                }
                ]
            });
            bmPie.render();
            var pharmacyGlobal = $('#pharmacy-bm').val() === '-1' ? '' : '&fillingPharmacyId=' + $('#pharmacy-bm').val();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                $('#bg-bm button.btn-selected').attr('data-date') + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val() +
                pharmacyGlobal + '&rowCount=' + data.TotalCount + '&reportName=PharmacyReferrals';
            $('#bm-chart-title').html('<a href="' + url + '" target="_blank">' + data.Referrals.length + ' Pharmacies - ' + service.getDateText('bg-bm') + ' ' + data.DateString + " - "
                + data.TotalCount + " Referrals</a>");
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderBottomMiddleDetailsChart: function (data) {
        $('#bm-d-chart-title').html('0 Pharmacies - ' + $('#bg-bm-d button.btn-selected').text() + ' ' + data.DateString + " - 0 Referrals");
        if (!data) return;

        if (utility.chechDataAvailibility('bottom-middle-no-data-d', 'bottom-middle-pie-chart-details', 'bm-d-chart-title', data.Referrals)) {
            var dataPlots = [];
            $.each(data.Referrals, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.PharmacyName, pharmacyId: item.PharmacyId, rowCount: item.TotalCount,
                    legendText: item.PharmacyName + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                        (item.TotalCountPercent * 100).toFixed(2) + '%<br\>' + $('#bg-bm-d button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var bmdPie = new CanvasJS.Chart("bottom-middle-pie-chart-details",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                            + $('#bg-bm-d button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                            + '&pharmacyReferral=' + $('input[name=p-referrals-d]:checked').val() + '&rowCount=' + e.dataPoint.rowCount + '&reportName=PharmacyReferrals', '_blank');
                    }
                }
                ]
            });
            bmdPie.render();
            var pharmacyGlobal = $('#pharmacy-bm').val() === '-1' ? '' : '&fillingPharmacyId=' + $('#pharmacy-bm').val();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                $('#bg-bm-d button.btn-selected').attr('data-date') + '&pharmacyReferral=' + $('input[name=p-referrals-d]:checked').val() +
                +pharmacyGlobal + '&rowCount=' + data.TotalCount + '&reportName=PharmacyReferrals';
            $('#bm-d-chart-title').html('<a href="' + url + '" target="_blank">' + data.Referrals.length + ' Pharmacies - ' + service.getDateText('bg-bm-d') + ' ' + data.DateString + " - "
                + data.TotalCount + " Referrals</a>");
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderBr4Chart: function (data) {
        $('#br4-chart-title').html($('#bg-br4 button.btn-selected').text() + ' ' + data.DateString + " - 0 Orders");
        if (!data) return;

        if (utility.chechDataAvailibility('bottom-middle4-no-data', 'bottom-middle4-pie-chart', 'br4-chart-title', data.Statuses)) {
            var dataPlots = [];
            $.each(data.Statuses, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.ProgramStatus, rowCount: item.TotalCount,
                    legendText: 'Orders: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (item.TotalCountPercent * 100).toFixed(2) + '%<br\>(' + item.ProgramStatus + ')<br\>' +
                        $('#bg-br4 button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var br4Pie = new CanvasJS.Chart("bottom-middle4-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    dataPoints: dataPlots,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&dateType=' +
                            $('#bg-br4 button.btn-selected').attr('data-date') + '&programStatus=' + e.dataPoint.label +
                            '&divReport=MapOrderCount&rowCount' + e.dataPoint.rowCount, '_blank');
                    }
                }
                ]
            });
            br4Pie.render();
            var url = service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&dateType=' +
                $('#bg-br4 button.btn-selected').attr('data-date') + '&divReport=MapOrderCount&rowCount=' + data.TotalCount;
            $('#br4-chart-title').html('<a href="' + url + '" target="_blank">' + service.getDateText('bg-br4') + ' ' + data.DateString + " - " + numeral(data.TotalCount).format('0,0') + " Orders</a>");
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderDetailsBr4Chart: function (data) {
        $('#br4-d-chart-title').html($('#bg-br4-d button.btn-selected').text() + ' ' + data.DateString + " - 0 Orders");
        if (!data) return;

        if (utility.chechDataAvailibility('bottom-middle4-no-data-d', 'bottom-middle4-pie-chart-details', 'br4-d-chart-title', data.Statuses)) {
            var dataPlots = [];
            $.each(data.Statuses, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.ProgramStatus, rowCount: item.TotalCount,
                    legendText: 'Orders: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (item.TotalCountPercent * 100).toFixed(2) +
                        '%<br\>(' + item.ProgramStatus + ')<br\>' +
                        $('#bg-br4-d button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var br4Pie = new CanvasJS.Chart("bottom-middle4-pie-chart-details",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label} {y}%",
                    dataPoints: dataPlots,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&dateType=' +
                            $('#bg-br4-d button.btn-selected').attr('data-date') + '&programStatus=' + e.dataPoint.label +
                            '&divReport=MapOrderCount&rowCount=' + e.dataPoint.rowCount, '_blank');
                    }
                }
                ]
            });
            br4Pie.render();
            var url = service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&dateType=' +
                $('#bg-br4-d button.btn-selected').attr('data-date') + '&divReport=MapOrderCount&rowCount=' + data.TotalCount;
            $('#br4-d-chart-title').html('<a href="' + url + '" target="_blank">' + service.getDateText('bg-br4') + ' ' + data.DateString + " - " + numeral(data.TotalCount).format('0,0') + " Orders</a>");
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderCipherPriorAuthChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('cipher-no-data', 'cipher-pie-chart', 'title', data)) {
            var dataPlots = [];
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.CtCategory, label: item.Category, status: item.ProgramStatus, begDate: item.BegDate, endDate: item.EndDate, priorAuth: item.PriorAuthRequired,
                    category: item.Category, substatus: item.ProgramSubStatus, legendText: item.Category + '<br\>' + numeral(item.CtCategory).format('0,0.00'),
                    yy: numeral(item.CtCategory).format('0,0.00'),
                    color: colorSchema.brandColors[index]
                });
            });
            var tmPie = new CanvasJS.Chart("cipher-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label} {yy}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        if ($('#cipher-chart-type').val() === 'INPROCESS') {
                            console.log(e.dataPoint.priorAuth);
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&programStatus=' + e.dataPoint.status +
                                '&statProc=' + $('#cipher-chart-type').val() + '&from=' + e.dataPoint.begDate + '&to=' + e.dataPoint.endDate + '&priorAuth=' + e.dataPoint.priorAuth +
                                '&programSubStatus=' + e.dataPoint.substatus + '&category=' + e.dataPoint.category + '&insType=3' +
                                '&rowCount=' + e.dataPoint.y + '&reportName=PriorAuthorization', '_blank');
                        } else {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&programStatus=' + e.dataPoint.status + '&programSubStatus=' + e.dataPoint.substatus +
                                '&statProc=' + $('#cipher-chart-type').val() + '&from=' + e.dataPoint.begDate + '&to=' + e.dataPoint.endDate + '&priorAuth=' + e.dataPoint.priorAuth +
                                '&category=' + e.dataPoint.category + '&insType=3' + '&rowCount=' + e.dataPoint.y + '&reportName=PriorAuthorization', '_blank');
                        }
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderDetailsCipherPriorAuthChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('cipher-no-data-d', 'cipher-pie-chart-d', 'title', data)) {
            var dataPlots = [];
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.CtCategory, label: item.Category, status: item.ProgramStatus, begDate: item.BegDate, endDate: item.EndDate, priorAuth: item.PriorAuthRequired,
                    category: item.Category, substatus: item.ProgramSubStatus, legendText: item.Category + '<br\>' + numeral(item.CtCategory).format('0,0.00'),
                    yy: numeral(item.CtCategory).format('0,0.00'),
                    color: colorSchema.brandColors[index]
                });
            });
            var tmPie = new CanvasJS.Chart("cipher-pie-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label} {yy}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        if ($('#cipher-chart-type-d').val() === 'INPROCESS') {
                            console.log(e.dataPoint.priorAuth);
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&programStatus=' + e.dataPoint.status +
                                '&statProc=' + $('#cipher-chart-type-d').val() + '&from=' + e.dataPoint.begDate + '&to=' + e.dataPoint.endDate + '&priorAuth=' + e.dataPoint.priorAuth +
                                '&programSubStatus=' + e.dataPoint.substatus + '&category=' + e.dataPoint.category + '&insType=3' +
                                + '&rowCount=' + e.dataPoint.y + '&reportName=PriorAuthorization', '_blank');
                        } else {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&programStatus=' + e.dataPoint.status + '&programSubStatus=' + e.dataPoint.substatus +
                                '&statProc=' + $('#cipher-chart-type-d').val() + '&from=' + e.dataPoint.begDate + '&to=' + e.dataPoint.endDate + '&priorAuth=' + e.dataPoint.priorAuth +
                                '&category=' + e.dataPoint.category + '&insType=3' + + '&rowCount=' + e.dataPoint.y + '&reportName=PriorAuthorization', '_blank');
                        }
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();
        }        
    },

    afrezzaColors: ['#369ead', '#c24642', '#7f6084', '#20b2aa', '#4169e1', '#468847', '#205081', '#c7edfc', '#d50ac6', '#f1e599'],

    renderAfrezzaProgramStatusChart: function (data) {
        $('#aps-chart-title').html($('#bg-aps button.btn-selected').text() + ' ' + data.DateString + " - 0 Referrals");
        if (!data) return;
        console.log(data);
        if (utility.chechDataAvailibilityWithTable('aps-no-data', 'aps-pie-chart', 'aps-chart-title', data.Statuses, 'aps-table')) {
            var dataPlots = [];
            $.each(data.Statuses, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.ProgramStatus, color: pieChartWrapper.afrezzaColors[index], rowCount: item.TotalCount,
                    legendText: 'Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                        (item.TotalCountPercent * 100).toFixed(2) + '%<br\>New Rx: ' + item.NewRxCount + '<br\>Refills: ' + item.RefillCount +
                        '<br\>' + $('#bg-aps button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var tmPie = new CanvasJS.Chart("aps-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                            $('#bg-aps button.btn-selected').attr('data-date') + '&programStatus=' + e.dataPoint.label + 
                            '&rowCount=' + e.dataPoint.rowCount + '&reportName=IntakeProgramStatus', '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                $('#bg-aps button.btn-selected').attr('data-date') + '&rowCount=' + data.TotalCount;
            $('#aps-chart-title').html('<a href="' + url + '" target="_blank">' + service.getDateText('bg-aps') + ' ' + data.DateString + " - " + numeral(data.TotalCount).format('0,0') + " Referrals</a> ("
                + numeral(data.RxCount).format('0,0') + ' New Rx - ' + numeral(data.RefillCount).format('0,0') + ' Refills)');
            $('.canvasjs-chart-credit').hide();

            $('table#aps-table tbody').html('');
            $.each(data.StatusStats, function (index, item) {
                var style = index === 0 || item.Type === 2 ? '' : item.Type == 3
                    ? 'style="color: ' + pieChartWrapper.afrezzaColors[index - 2] + '"'
                    : 'style="color: ' + pieChartWrapper.afrezzaColors[index - 1] + '"';
                if (item.Type === 2) {
                    $('table#aps-table tbody').append('<tr>' +
                        '<td colspan="2"><hr class="total-seperator" /></td>' +
                    '</tr>');
                }
                $('table#aps-table tbody').append('<tr>' +
                        '<td ' + style + '>' + item.Column1 + '</td>' +
                        '<td ' + style + '>' + item.Column2 + '</td>' +
                    '</tr>');
                if (item.Type === 0) {
                    $('table#aps-table tbody').append('<tr>' +
                        '<td></td>' +
                        '<td></td>' +
                    '</tr>');
                }
            });
        }
    },

    renderAfrezzaDetailsProgramStatusChart: function (data) {
        $('#aps-d-chart-title').html($('#bg-aps-d button.btn-selected').text() + ' ' + data.DateString + " - 0 Referrals");
        if (!data) return;

        if (utility.chechDataAvailibility('aps-no-data-d', 'aps-pie-chart-details', 'aps-d-chart-title', data.Statuses)) {
            var dataPlots = [];
            $.each(data.Statuses, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.ProgramStatus, color: pieChartWrapper.afrezzaColors[index], rowCount: item.TotalCount,
                    legendText: 'Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (item.TotalCountPercent * 100).toFixed(2) +
                        '%<br\>New Rx: ' + item.NewRxCount + '<br\>Refills: ' + item.RefillCount +
                        '<br\>' + $('#bg-aps-d button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var tmDPie = new CanvasJS.Chart("aps-pie-chart-details",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                            $('#bg-aps-d button.btn-selected').attr('data-date') + '&programStatus=' + e.dataPoint.label +
                            '&rowCount=' + e.dataPoint.rowCount + '&reportName=IntakeProgramStatus', '_blank');
                    }
                }
                ]
            });
            tmDPie.render();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                $('#bg-aps-d button.btn-selected').attr('data-date') + '&rowCount=' + data.TotalCount;
            $('#aps-d-chart-title').html('<a href="' + url + '" target="_blank">' + service.getDateText('bg-aps-d') + ' ' + data.DateString + " - " + numeral(data.TotalCount).format('0,0') + " Referrals</a> ("
                + numeral(data.RxCount).format('0,0') + ' New Rx - ' + numeral(data.RefillCount).format('0,0') + ' Refills)');
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderPharmacyReferralsCChart: function (data) {
        $('#prc-chart-title').html('0 Pharmacies - ' + $('#bg-prc button.btn-selected').text() + ' ' + data.DateString + " - 0 Referrals");
        if (!data) return;

        if (utility.chechDataAvailibility('prc-no-data', 'prc-pie-chart', 'prc-chart-title', data.Referrals)) {
            var dataPlots = [];
            $.each(data.Referrals, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.PharmacyName, pharmacyId: item.PharmacyId, rowCount: item.TotalCount,
                    legendText: item.PharmacyName + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (item.TotalCountPercent * 100).toFixed(2)
                        + '%<br\>' + $('#bg-prc button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var bmPie = new CanvasJS.Chart("prc-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                            + $('#bg-prc button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                            + '&pharmacyReferral=' + $('input[name=prc-referrals]:checked').val() + '&rowCount=' + e.dataPoint.rowCount + '&reportName=PharmacyCReferrals ','_blank');
                    }
                }
                ]
            });
            bmPie.render();
            var pharmacyGlobal = $('#pharmacy-prc').val() === '-1' ? '' : '&fillingPharmacyId=' + $('#pharmacy-prc').val();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                $('#bg-prc button.btn-selected').attr('data-date') + '&pharmacyReferral=' +
                $('input[name=prc-referrals]:checked').val() + '&rowCount=' + data.TotalCount + pharmacyGlobal + '&reportName=PharmacyCReferrals ';
            $('#prc-chart-title').html('<a href="' + url + '" target="_blank">' + data.Referrals.length + ' Pharmacies - ' + service.getDateText('bg-prc') + ' ' + data.DateString + " - "
                + data.TotalCount + " Referrals</a>");
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderPharmacyReferralsCDetailsChart: function (data) {
        $('#prc-d-chart-title').html('0 Pharmacies - ' + $('#bg-prc-d button.btn-selected').text() + ' ' + data.DateString + " - 0 Referrals");
        if (!data) return;

        if (utility.chechDataAvailibility('prc-no-data-d', 'prc-pie-chart-details', 'prc-d-chart-title', data.Referrals)) {
            var dataPlots = [];
            $.each(data.Referrals, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.PharmacyName, pharmacyId: item.PharmacyId, rowCount: item.TotalCount,
                    legendText: item.PharmacyName + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                        (item.TotalCountPercent * 100).toFixed(2) + '%<br\>' + $('#bg-prc-d button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var bmdPie = new CanvasJS.Chart("prc-pie-chart-details",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                            + $('#bg-prc-d button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                            + '&pharmacyReferral=' + $('input[name=prc-referrals-d]:checked').val() + '&rowCount=' + e.dataPoint.rowCount + '&reportName=PharmacyCReferrals ', '_blank');
                    }
                }
                ]
            });
            bmdPie.render();
            var pharmacyGlobal = $('#pharmacy-prc-d').val() === '-1' ? '' : '&fillingPharmacyId=' + $('#pharmacy-prc-d').val();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                $('#bg-prc-d button.btn-selected').attr('data-date') + '&pharmacyReferral=' +
                $('input[name=prc-referrals-d]:checked').val() + '&rowCount=' + data.TotalCount + pharmacyGlobal + '&reportName=PharmacyCReferrals ';
            $('#prc-d-chart-title').html('<a href="' + url + '" target="_blank">' + data.Referrals.length + ' Pharmacies - ' + service.getDateText('bg-prc-d') + ' ' + data.DateString + " - "
                + data.TotalCount + " Referrals</a>");
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderReferralTimeToProcessChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('rttp-no-data', 'rttp-column-chart', '', data)) {
            var dataPlots1 = [];
            var dataPlots2 = [];
            $.each(data, function (index, item) {
                dataPlots1.push({
                    y: item.ReferralCount, label: item.MonthYear, year: item.Year, month: item.Month,
                    legendText: $('#program option:selected').text() + '<br\>No. of Referrals: ' + numeral(item.ReferralCount).format('0,0')
                });
                dataPlots2.push({
                    y: item.AvgDays, label: item.MonthYear, year: item.Year, month: item.Month, rowCount: item.ReferralCount,
                    legendText: $('#program option:selected').text() + '<br\>Avg Time To Process (Days): ' + numeral(item.AvgDays).format('0,0')
                });
            });
            var bmdPie = new CanvasJS.Chart("rttp-column-chart",
            {
                //theme: "theme2",
                title: {
                    text: ""
                },
                animationEnabled: true,
                axisX: {
                    interval: 1,
                    tickThickness: 0,
                    labelAngle: 315,
                    lineThickness: 1,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828'
                },
                axisY: [
                    {
                        title: 'No. of Referrals',
                        titleFontSize: 10,
                        includeZero: true,
                        gridThickness: 1,
                        tickThickness: 0,
                        titleFontColor: '#282828',
                        labelFontColor: '#282828',
                        labelFontSize: 10,
                        lineThickness: 1,
                        lineColor: '#000'
                    },
                    {
                        title: 'Avg Time To Process',
                        titleFontSize: 10,
                        includeZero: true,
                        gridThickness: 1,
                        tickThickness: 0,
                        titleFontColor: '#282828',
                        labelFontColor: '#282828',
                        labelFontSize: 10,
                        lineThickness: 1,
                        lineColor: '#000'
                    }
                ],
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        axisYindex: 0,
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: "{y}",
                        legendText: 'No. of Referrals',
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        dataPoints: dataPlots1,
                        click: function (e) {
                            var pa = $('#rttp-pa').val() === 'All' ? '' : '&pa=' + ($('#rttp-pa').val() === 'Yes');
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                                '&dateType=' + $('input[name=rttp-datetype]:checked').val() + '&location=' + $('#rttp-location').val() +
                                pa + '&excludeNonWorkDays=' + !$('#rttp-weekends').is(':checked') + '&timeToProcess=' + e.dataPoint.label +
                                '&rowCount=' + e.dataPoint.y, '_blank');
                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        axisYType: "secondary",
                        axisYindex: 1,
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: "{y}",
                        legendText: 'Avg Time to Process (Days)',
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        dataPoints: dataPlots2,
                        click: function (e) {
                            var pa = $('#rttp-pa').val() === 'All' ? '' : '&pa=' + ($('#rttp-pa').val() === 'Yes');
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                                '&dateType=' + $('input[name=rttp-datetype]:checked').val() + '&location=' + $('#rttp-location').val() +
                                pa + '&excludeNonWorkDays=' + !$('#rttp-weekends').is(':checked') + '&timeToProcess=' + e.dataPoint.label +
                                '&rowCount=' + e.dataPoint.rowCount, '_blank');
                        }
                    }
                ]
            });
            bmdPie.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderDetailsReferralTimeToProcessChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('rttp-no-data-d', 'rttp-column-chart-d', '', data)) {
            var dataPlots1 = [];
            var dataPlots2 = [];
            $.each(data, function (index, item) {
                dataPlots1.push({
                    y: item.ReferralCount, label: item.MonthYear, year: item.Year, month: item.Month,
                    legendText: $('#program option:selected').text() + '<br\>No. of Referrals: ' + numeral(item.ReferralCount).format('0,0')
                });
                dataPlots2.push({
                    y: item.AvgDays, label: item.MonthYear, year: item.Year, month: item.Month, rowCount: item.TotalCount,
                    legendText: $('#program option:selected').text() + '<br\>Avg Time To Process (Days): ' + numeral(item.AvgDays).format('0,0.00')
                });
            });
            var bmdPie = new CanvasJS.Chart("rttp-column-chart-d",
            {
                //theme: "theme2",
                title: {
                    text: ""
                },
                animationEnabled: true,
                axisX: {
                    interval: 1,
                    tickThickness: 0,
                    labelAngle: 315,
                    lineThickness: 1,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828'
                },
                axisY: [
                    {
                        title: 'No. of Referrals',
                        titleFontSize: 10,
                        includeZero: true,
                        gridThickness: 1,
                        tickThickness: 0,
                        titleFontColor: '#282828',
                        labelFontColor: '#282828',
                        labelFontSize: 10,
                        lineThickness: 1,
                        lineColor: '#000'
                    },
                    {
                        title: 'Avg Time To Process',
                        titleFontSize: 10,
                        includeZero: true,
                        gridThickness: 1,
                        tickThickness: 0,
                        titleFontColor: '#282828',
                        labelFontColor: '#282828',
                        labelFontSize: 10,
                        lineThickness: 1,
                        lineColor: '#000'
                    }
                ],
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        axisYindex: 0,
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: "{y}",
                        legendText: 'No. of Referrals',
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        dataPoints: dataPlots1,
                        click: function (e) {
                            var pa = $('#rttp-pa-d').val() === 'All' ? '' : '&pa=' + ($('#rttp-pa-d').val() === 'Yes');
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                                '&dateType=' + $('input[name=rttp-datetype-d]:checked').val() + '&location=' + $('#rttp-location-d').val() +
                                pa + '&excludeNonWorkDays=' + !$('#rttp-weekends-d').is(':checked') + '&timeToProcess=' + e.dataPoint.label +
                                '&rowCount=' + e.dataPoint.y, '_blank');
                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        axisYType: "secondary",
                        axisYindex: 1,
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: "{y}",
                        legendText: 'Avg Time to Process (Days)',
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        dataPoints: dataPlots2,
                        click: function (e) {
                            var pa = $('#rttp-pa-d').val() === 'All' ? '' : '&pa=' + ($('#rttp-pa-d').val() === 'Yes');
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                                '&dateType=' + $('input[name=rttp-datetype-d]:checked').val() + '&location=' + $('#rttp-location-d').val() +
                                pa + '&excludeNonWorkDays=' + !$('#rttp-weekends-d').is(':checked') + '&timeToProcess=' + e.dataPoint.label + 
                                '&rowCount=' + e.dataPoint.rowCount, '_blank');
                        }
                    }
                ]
            });
            bmdPie.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    getRttpLaeblSuffix: function() {
        if ($('#rttp-location').val() === 'All' && $('input[name=rttp-datetype]:checked').val() === 'filldate')
            return ' (Created Date - Filldate)';
        if ($('#rttp-location').val() === 'All' && $('input[name=rttp-datetype]:checked').val() === 'shipdate')
            return ' (Created Date - Shipdate)';
        if ($('#rttp-location').val() === 'Pharmacy' && $('input[name=rttp-datetype]:checked').val() === 'filldate')
            return ' (Created Date - Filldate)';
        if ($('#rttp-location').val() === 'Pharmacy' && $('input[name=rttp-datetype]:checked').val() === 'shipdate')
            return ' (Created Date - Shipdate)';
        if ($('#rttp-location').val() === 'HUB')
            return ' (Created Date - Assigned Date)';
        return '';
    },

    getDetailsRttpLaeblSuffix: function () {
        if ($('#rttp-location-d').val() === 'All' && $('input[name=rttp-datetype-d]:checked').val() === 'filldate')
            return ' (Created Date - Filldate)';
        if ($('#rttp-location-d').val() === 'All' && $('input[name=rttp-datetype-d]:checked').val() === 'shipdate')
            return ' (Created Date - Shipdate)';
        if ($('#rttp-location-d').val() === 'Pharmacy' && $('input[name=rttp-datetype-d]:checked').val() === 'filldate')
            return ' (Created Date - Filldate)';
        if ($('#rttp-location-d').val() === 'Pharmacy' && $('input[name=rttp-datetype-d]:checked').val() === 'shipdate')
            return ' (Created Date - Shipdate)';
        if ($('#rttp-location-d').val() === 'HUB')
            return ' (Created Date - Assigned Date)';
        return '';
    },

    renderReferralTimeToProcessLineChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('rttp-no-data', 'rttp-line-chart', '', data)) {
            var dataPlots = [];
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.AvgDays, label: item.MonthYear, year: item.Year, month: item.Month, rowCount: item.ReferralCount,
                    legendText: $('#program option:selected').text() + '<br\>Avg Time To Process (Days): ' + numeral(item.AvgDays).format('0,0')
                });
            });
            var bmdPie = new CanvasJS.Chart("rttp-line-chart",
            {
                theme: "theme2",
                title: {
                    text: ""
                },
                animationEnabled: true,
                axisX: {
                    interval: 1,
                    tickThickness: 0,
                    lineColor: "#FFF",
                    labelAngle: 315,
                    lineThickness: 1,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    labelFormatter: function(e) {
                        return '';
                    }
                },
                axisY: {
                    title: '',
                    titleFontSize: 10,
                    includeZero: true,
                    minimum: -10,
                    gridThickness: 1,
                    tickThickness: 0,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    labelFontSize: 10,
                    lineThickness: 0
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                data: [
                    {
                        type: "line",
                        color: '#0071bc',
                        showInLegend: false,
                        toolTipContent: "{legendText}",
                        indexLabel: "{y}",
                        legendText: 'Avg Time to Process (Days)' + pieChartWrapper.getRttpLaeblSuffix(),
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 10,
                        dataPoints: dataPlots,
                        click: function (e) {
                            var pa = $('#rttp-pa').val() === 'All' ? '' : '&priorAuth=' + ($('#rttp-pa').val() === 'Yes');
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                                '&dateType=' + $('input[name=rttp-datetype]:checked').val() + '&location=' + $('#rttp-location').val() +
                                pa + '&excludeNonWorkDays=' + !$('#rttp-weekends').is(':checked') + '&timeToProcess=' + e.dataPoint.label +
                                '&rowCount=' + e.dataPoint.rowCount + '&reportName=ReferralTimeToProcess', '_blank');
                        }
                    }
                ]
            });
            bmdPie.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderReferralTimeToProcessColumnChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('rttp-no-data', 'rttp-column-chart', '', data)) {
            var dataPlots = [];
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.ReferralCount, label: item.MonthYear, year: item.Year, month: item.Month,
                    legendText: $('#program option:selected').text() + '<br\>No. of Referrals: ' + numeral(item.ReferralCount).format('0,0')
                });
            });
            var bmdPie = new CanvasJS.Chart("rttp-column-chart",
            {
                theme: "theme2",
                title: {
                    text: ""
                },
                animationEnabled: true,
                axisX: {
                    interval: 1,
                    tickThickness: 0,
                    //labelAngle: 315,
                    lineThickness: 1,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    labelFontSize: 10
                },
                axisY: {
                    title: '',
                    titleFontSize: 10,
                    includeZero: true,
                    gridThickness: 1,
                    tickThickness: 0,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    labelFontSize: 10,
                    lineThickness: 0
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        axisYindex: 0,
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: "{y}",
                        legendText: 'No. of Referrals' + pieChartWrapper.getRttpLaeblSuffix(),
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 10,
                        dataPoints: dataPlots,
                        click: function (e) {
                            var pa = $('#rttp-pa').val() === 'All' ? '' : '&priorAuth=' + ($('#rttp-pa').val() === 'Yes');
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                                '&dateType=' + $('input[name=rttp-datetype]:checked').val() + '&location=' + $('#rttp-location').val() +
                                pa + '&excludeNonWorkDays=' + !$('#rttp-weekends').is(':checked') + '&timeToProcess=' + e.dataPoint.label +
                                '&rowCount=' + e.dataPoint.y + '&reportName=ReferralTimeToProcess', '_blank');
                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: "{y}",
                        legendText: 'Avg Time to Process (Days)' + pieChartWrapper.getRttpLaeblSuffix(),
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 10,
                        dataPoints: []
                    }
                ]
            });
            bmdPie.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderDetailsReferralTimeToProcessLineChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('rttp-no-data-d', 'rttp-line-chart-d', '', data)) {
            var dataPlots = [];
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.AvgDays, label: item.MonthYear, year: item.Year, month: item.Month, rowCount: item.ReferralCount,
                    legendText: $('#program option:selected').text() + '<br\>Avg Time To Process (Days): ' + numeral(item.AvgDays).format('0,0')
                });
            });
            var bmdPie = new CanvasJS.Chart("rttp-line-chart-d",
            {
                theme: "theme2",
                title: {
                    text: ""
                },
                animationEnabled: true,
                axisX: {
                    interval: 1,
                    tickThickness: 0,
                    lineColor: "#FFF",
                    labelAngle: 315,
                    lineThickness: 1,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    labelFormatter: function (e) {
                        return '';
                    }
                },
                axisY: {
                    title: '',
                    titleFontSize: 10,
                    includeZero: true,
                    minimum: -10,
                    gridThickness: 1,
                    tickThickness: 0,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    labelFontSize: 10,
                    lineThickness: 0
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                data: [
                    {
                        type: "line",
                        color: '#0071bc',
                        showInLegend: false,
                        toolTipContent: "{legendText}",
                        indexLabel: "{y}",
                        legendText: 'Avg Time to Process (Days)' + pieChartWrapper.getDetailsRttpLaeblSuffix(),
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 10,
                        dataPoints: dataPlots,
                        click: function (e) {
                            var pa = $('#rttp-pa-d').val() === 'All' ? '' : '&priorAuth=' + ($('#rttp-pa-d').val() === 'Yes');
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                                '&dateType=' + $('input[name=rttp-datetype-d]:checked').val() + '&location=' + $('#rttp-location-d').val() +
                                pa + '&excludeNonWorkDays=' + !$('#rttp-weekends-d').is(':checked') + '&timeToProcess=' + e.dataPoint.label +
                                '&rowCount=' + e.dataPoint.rowCount + '&reportName=ReferralTimeToProcess', '_blank');
                        }
                    }
                ]
            });
            bmdPie.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderDetailsReferralTimeToProcessColumnChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('rttp-no-data-d', 'rttp-column-chart-d', '', data)) {
            var dataPlots = [];
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.ReferralCount, label: item.MonthYear, year: item.Year, month: item.Month,
                    legendText: $('#program option:selected').text() + '<br\>No. of Referrals: ' + numeral(item.ReferralCount).format('0,0')
                });
            });
            var bmdPie = new CanvasJS.Chart("rttp-column-chart-d",
            {
                theme: "theme2",
                title: {
                    text: ""
                },
                animationEnabled: true,
                axisX: {
                    interval: 1,
                    tickThickness: 0,
                    //labelAngle: 315,
                    lineThickness: 1,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    labelFontSize: 10
                },
                axisY: {
                    title: '',
                    titleFontSize: 10,
                    includeZero: true,
                    gridThickness: 1,
                    tickThickness: 0,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    labelFontSize: 10,
                    lineThickness: 0
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        axisYindex: 0,
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: "{y}",
                        legendText: 'No. of Referrals' + pieChartWrapper.getDetailsRttpLaeblSuffix(),
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 10,
                        dataPoints: dataPlots,
                        click: function (e) {
                            var pa = $('#rttp-pa').val() === 'All' ? '' : '&priorAuth=' + ($('#rttp-pa').val() === 'Yes');
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                                '&dateType=' + $('input[name=rttp-datetype-d]:checked').val() + '&location=' + $('#rttp-location-d').val() +
                                pa + '&excludeNonWorkDays=' + !$('#rttp-weekends-d').is(':checked') + '&timeToProcess=' + e.dataPoint.label +
                                '&rowCount=' + e.dataPoint.y + '&reportName=ReferralTimeToProcess', '_blank');
                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: "{y}",
                        legendText: 'Avg Time to Process (Days)' + pieChartWrapper.getDetailsRttpLaeblSuffix(),
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 10,
                        dataPoints: []
                    }
                ]
            });
            bmdPie.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderBenefitsInvestigationChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('bi-no-data', 'bi-column-chart', '', data)) {
            var dataPlots1 = [];
            var dataPlots2 = [];
            $.each(data, function (index, item) {
                dataPlots1.push({
                    y: item.BiStartCount, label: item.Date, x: (index),
                    legendText: $('#program option:selected').text() + '<br\>No. of Prescriptions (BI Start): ' + numeral(item.BiStartCount).format('0,0')
                });
                dataPlots2.push({
                    y: item.BiCompleteCount, label: item.Date, x: (index),
                    legendText: $('#program option:selected').text() + '<br\>No. of Prescriptions (BI Complete): ' + numeral(item.BiCompleteCount).format('0,0')
                });
            });
            console.log(dataPlots1);
            console.log(dataPlots2);
            var bmdPie = new CanvasJS.Chart("bi-column-chart",
            {
                theme: "theme2",
                title: {
                    text: ""
                },
                dataPointWidth: data.length <= 4 ? 30 : data.length <= 8 ? 25 : data.length <= 12 ? 15 : 12,
                animationEnabled: true,
                axisX: {
                    tickThickness: 0,
                    labelAngle: 315,
                    lineThickness: 1,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828'
                },
                axisY: {
                    title: 'No. of Prescriptions',
                    titleFontSize: 10,
                    includeZero: true,
                    gridThickness: 1,
                    tickThickness: 0,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    labelFontSize: 10,
                    lineThickness: 0
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: "",
                        legendText: 'BI Start',
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        dataPoints: dataPlots1,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=BenefitsInvestigation', '_blank');
                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: "",
                        legendText: 'BI Complete',
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        dataPoints: dataPlots2,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=BenefitsInvestigation', '_blank'); 
                        }
                    }
                ]
            });
            bmdPie.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderDetailsBenefitsInvestigationChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('bi-no-data-d', 'bi-column-chart-d', '', data)) {
            var dataPlots1 = [];
            var dataPlots2 = [];
            $.each(data, function (index, item) {
                dataPlots1.push({
                    y: item.BiStartCount, label: item.Date, x: (index),
                    legendText: $('#program option:selected').text() + '<br\>No. of Prescriptions (BI Start): ' + numeral(item.BiStartCount).format('0,0')
                });
                dataPlots2.push({
                    y: item.BiCompleteCount, label: item.Date, x: (index),
                    legendText: $('#program option:selected').text() + '<br\>No. of Prescriptions (BI Complete): ' + numeral(item.BiCompleteCount).format('0,0')
                });
            });
            console.log(dataPlots1);
            console.log(dataPlots2);
            var bmdPie = new CanvasJS.Chart("bi-column-chart-d",
            {
                theme: "theme2",
                title: {
                    text: ""
                },
                dataPointWidth: data.length <= 4 ? 50 : data.length <= 8 ? 45 : data.length <= 12 ? 40 : 25,
                animationEnabled: true,
                axisX: {
                    tickThickness: 0,
                    labelAngle: 315,
                    lineThickness: 1,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828'
                },
                axisY: {
                    title: 'No. of Prescriptions',
                    titleFontSize: 10,
                    includeZero: true,
                    gridThickness: 1,
                    tickThickness: 0,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    labelFontSize: 10,
                    lineThickness: 0
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: data.length > 12 ? "" : "{y}",
                        legendText: 'BI Start',
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        dataPoints: dataPlots1,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=BenefitsInvestigation', '_blank');
                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        indexLabel: data.length > 12 ? "" : "{y}",
                        legendText: 'BI Complete',
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        dataPoints: dataPlots2,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=BenefitsInvestigation', '_blank');
                        }
                    }
                ]
            });
            bmdPie.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderCashOptionsChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('cor-no-data', 'cor-pie-chart', 'cor-chart-title', data)) {
            var dataPlots = [];
            var total = 0;
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: (item.ReferralCountPercent * 100).toFixed(2), label: item.InsurnaceType, rowCount: item.ReferralCount,
                    legendText: 'Referrals: ' + item.ReferralCount + '<br\>Insurance Type: ' + item.InsurnaceType + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
                total += item.ReferralCount;
            });
            var tmPie = new CanvasJS.Chart("cor-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                            '&dateRangeType=' + $('#bg-cor button.btn-selected').attr('data-date') + '&insuranceType=' + e.dataPoint.label +
                            '&rowCount=' + e.dataPoint.rowCount + '&reportName=CashOptionReferrals', '_blank');
                    }
                }
                ]
            });

            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                $('#bg-cor button.btn-selected').attr('data-date') + '&insuranceType=all' + '&rowCount=' + total + '&reportName=CashOptionReferrals';
            $('#cor-chart-title').html('<a href="' + url + '" target="_blank">' + numeral(total).format('0,0') + " Referrals</a>");
            tmPie.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderDetailsCashOptionsChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('cor-no-data-d', 'cor-pie-chart-d', 'cor-chart-title-d', data)) {
            var dataPlots = [];
            var total = 0;
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: (item.ReferralCountPercent * 100).toFixed(2), label: item.InsurnaceType, rowCount: item.ReferralCount,
                    legendText: 'Referrals: ' + item.ReferralCount + '<br\>Insurance Type: ' + item.InsurnaceType + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
                total += item.ReferralCount;
            });
            var tmPie = new CanvasJS.Chart("cor-pie-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                            '&dateRangeType=' + $('#bg-cor-d button.btn-selected').attr('data-date') + '&insuranceType=' + e.dataPoint.label +
                            '&rowCount=' + e.dataPoint.rowCount + '&reportName=CashOptionReferrals', '_blank');
                    }
                }
                ]
            });
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                $('#bg-cor-d button.btn-selected').attr('data-date') + '&insuranceType=all' + '&rowCount=' + total + '&reportName=CashOptionReferrals';
            $('#cor-chart-title-d').html('<a href="' + url + '" target="_blank">' + numeral(total).format('0,0') + " Referrals</a>");
            tmPie.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderSantylChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('sntl-no-data', 'sntl-pie-chart', 'sntl-chart-title', data)) {
            var dataPlots = [];
            var total = 0;
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: (item.ReferralCountPercent * 100).toFixed(2), label: item.ProgramStatus, rowCount: item.ReferralCount,
                    legendText: 'Referrals: ' + item.ReferralCount + '<br\>Status: ' + item.ProgramStatus + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
                total += item.ReferralCount;
            });
            var tmPie = new CanvasJS.Chart("sntl-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=3-days' +
                            '&dateRangeType=allreferrals&programStatus=' + e.dataPoint.label +
                            '&rowCount=' + e.dataPoint.rowCount + "&reportName=ReferralsInProcess", '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=3-days' +
                '&dateRangeType=allreferrals&rowCount=' + total + "&reportName=ReferralsInProcess";
            $('#sntl-chart-title').html('<a href="' + url + '" target="_blank">Total Referrals ' + numeral(total).format('0,0') + '</a>');
        }
    },

    renderSantylDetailsChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('sntl-no-data-d', 'sntl-pie-chart-d', 'sntl-chart-title-d', data)) {
            var dataPlots = [];
            var total = 0;
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: (item.ReferralCountPercent * 100).toFixed(2), label: item.ProgramStatus, rowCount: item.ReferralCount,
                    legendText: 'Referrals: ' + item.ReferralCount + '<br\>Status: ' + item.ProgramStatus + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
                total += item.ReferralCount;
            });
            var tmPie = new CanvasJS.Chart("sntl-pie-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=3-days' +
                            '&dateRangeType=allreferrals&programStatus=' + e.dataPoint.label +
                            '&rowCount=' + e.dataPoint.rowCount + "&reportName=ReferralsInProcess", '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=3-days' +
                '&dateRangeType=allreferrals&rowCount=' + total + "&reportName=ReferralsInProcess";
            $('#sntl-chart-title-d').html('<a href="' + url + '" target="_blank">Total Referrals ' + numeral(total).format('0,0') + '</a>');
        }
    },

    renderRegranexChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('rgnx-no-data', 'rgnx-pie-chart', 'rgnx-chart-title', data)) {
            var dataPlots = [];
            var total = 0;
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: (item.ReferralCountPercent * 100).toFixed(2), label: item.PAProgramStatus, rowCount: item.ReferralCount,
                    status: item.ProgramStatus, pa: item.PARequired,
                    legendText: 'Referrals: ' + item.ReferralCount + '<br\>Status: ' + item.ProgramStatus + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
                total += item.ReferralCount;
            });
            var tmPie = new CanvasJS.Chart("rgnx-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=5-days' +
                            '&dateRangeType=allreferrals&programStatus=' + e.dataPoint.status + '&priorAuth=' + e.dataPoint.pa +
                            '&rowCount=' + e.dataPoint.rowCount + "&reportName=ReferralsInProcess", '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();

            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=5-days' +
                '&dateRangeType=allreferrals&rowCount=' + total + "&reportName=ReferralsInProcess";
            $('#rgnx-chart-title').html('<a href="' + url + '" target="_blank">Total Referrals ' + numeral(total).format('0,0') + '</a>');
        }
    },

    renderRegranexDetailsChart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('rgnx-no-data-d', 'rgnx-pie-chart-d', 'rgnx-chart-title-d', data)) {
            var dataPlots = [];
            var total = 0;
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: (item.ReferralCountPercent * 100).toFixed(2), label: item.PAProgramStatus, rowCount: item.ReferralCount,
                    status: item.ProgramStatus, pa: item.PARequired,
                    legendText: 'Referrals: ' + item.ReferralCount + '<br\>Status: ' + item.ProgramStatus + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
                total += item.ReferralCount;
            });
            var tmPie = new CanvasJS.Chart("rgnx-pie-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=5-days' +
                            '&dateRangeType=allreferrals&programStatus=' + e.dataPoint.status + '&priorAuth=' + e.dataPoint.pa +
                            '&rowCount=' + e.dataPoint.rowCount + "&reportName=ReferralsInProcess", '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=5-days' +
                '&dateRangeType=allreferrals&rowCount=' + total + "&reportName=ReferralsInProcess";
            $('#rgnx-chart-title-d').html('<a href="' + url + '" target="_blank">Total Referrals ' + numeral(total).format('0,0') + '</a>');
        }
    },

    renderReferralsCopayGt75Chart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('rc75-no-data', 'rc75-pie-chart', 'rc75-chart-title', data)) {
            var dataPlots = [];
            var total = 0;
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: (item.ReferralCountPercent * 100).toFixed(2), label: item.ProgramStatus, rowCount: item.ReferralCount,
                    programStatus: item.ProgramStatus,// programSubStatus: item.ProgramSubStatus,
                    legendText: 'Referrals: ' + item.ReferralCount + '<br\>Status: ' + item.ProgramStatus + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
                total += item.ReferralCount;
            });
            var tmPie = new CanvasJS.Chart("rc75-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=n-days' +
                            '&dateRangeType=allreferrals&programStatus=' + e.dataPoint.programStatus + //'&programSubStatus=' + e.dataPoint.programSubStatus +
                            '&rowCount=' + e.dataPoint.rowCount + "&reportName=ReferralsCopay", '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();

            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=n-days' +
                '&dateRangeType=allreferrals&rowCount=' + total + "&reportName=ReferralsCopay";
            $('#rc75-chart-title').html('<a href="' + url + '" target="_blank">Total Referrals ' + numeral(total).format('0,0') + '</a>');
        }
    },

    renderDetailsReferralsCopayGt75Chart: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('rc75-no-data-d', 'rc75-pie-chart-d', 'rc75-chart-title-d', data)) {
            var dataPlots = [];
            var total = 0;
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: (item.ReferralCountPercent * 100).toFixed(2), label: item.ProgramStatus, rowCount: item.ReferralCount,
                    programStatus: item.ProgramStatus,// programSubStatus: item.ProgramSubStatus,
                    legendText: 'Referrals: ' + item.ReferralCount + '<br\>Status: ' + item.Status + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
                total += item.ReferralCount;
            });
            var tmPie = new CanvasJS.Chart("rc75-pie-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=n-days' +
                            '&dateRangeType=allreferrals&programStatus=' + e.dataPoint.programStatus + //'&programSubStatus=' + e.dataPoint.programSubStatus +
                            '&rowCount=' + e.dataPoint.rowCount + "&reportName=ReferralsCopay", '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();

            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&refInProcess=n-days' +
                '&dateRangeType=allreferrals&rowCount=' + total + "&reportName=ReferralsCopay";
            $('#rc75-chart-title-d').html('<a href="' + url + '" target="_blank">Total Referrals ' + numeral(total).format('0,0') + '</a>');
        }
    },

    renderPaStatusUpdateChart: function (data) {
        if (!data) return;
        var check = data.TotalCount === 0 ? [] : [1, 2, 3];
        if (utility.chechDataAvailibility('pa-status-no-data', 'pa-status-pie-chart', 'pa-status-chart-title', check)) {
            var dataPlots = [];
            if (data.InProcessCount > 0)
                dataPlots.push({
                    y: data.InProcessCountPercent, label: 'In Process', rowCount: data.InProcessCount, measureid: 11,
                    legendText: 'In Process - Referrals: ' + data.InProcessCount + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[0]
                });
            if (data.DeniedCount > 0)
                dataPlots.push({
                    y: data.DeniedCountPercent, label: 'Denied', rowCount: data.DeniedCount, measureid: 12,
                    legendText: 'Denied - Referrals: ' + data.DeniedCount + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[1]
                });
            if (data.ApprovedPasCount > 0)
                dataPlots.push({
                    y: data.ApprovedPasCountPercent, label: 'Approved PA', rowCount: data.ApprovedPasCount, measureid: 14,
                    legendText: 'Approved PA - Referrals: ' + data.ApprovedPasCount + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[2]
                });
            var tmPie = new CanvasJS.Chart("pa-status-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + 
                            '&measureid=' + e.dataPoint.measureid + '&rowCount=' + e.dataPoint.rowCount + "&reportName=PAStatusUpdates", '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();

            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&measureid=15' + '&rowCount=' + data.TotalCount + "&reportName=PAStatusUpdates";
            $('#pa-status-chart-title').html('<a href="' + url + '" target="_blank">Total Referrals ' + numeral(data.TotalCount).format('0,0') + '</a>');
        }
    },

    renderDetailsPaStatusUpdateChart: function (data) {
        if (!data) return;
        var check = data.TotalCount === 0 ? [] : [1, 2, 3];
        if (utility.chechDataAvailibility('pa-status-no-data-d', 'pa-status-pie-chart-d', 'pa-status-chart-title-d', check)) {
            var dataPlots = [];
            if (data.InProcessCount > 0)
                dataPlots.push({
                    y: data.InProcessCountPercent, label: 'In Process', rowCount: data.InProcessCount, measureid: 11,
                    legendText: 'In Process - Referrals: ' + data.InProcessCount + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[0]
                });
            if (data.DeniedCount > 0)
                dataPlots.push({
                    y: data.DeniedCountPercent, label: 'Denied', rowCount: data.DeniedCount, measureid: 12,
                    legendText: 'Denied - Referrals: ' + data.DeniedCount + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[1]
                });
            if (data.ApprovedPasCount > 0)
                dataPlots.push({
                    y: data.ApprovedPasCountPercent, label: 'Approved PA', rowCount: data.ApprovedPasCount, measureid: 14,
                    legendText: 'Approved PA - Referrals: ' + data.ApprovedPasCount + '<br\>' +
                        $('#program option:selected').text(),
                    color: colorSchema.brandColors[2]
                });
            var tmPie = new CanvasJS.Chart("pa-status-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                            '&measureid=' + e.dataPoint.measureid + '&rowCount=' + e.dataPoint.rowCount + "&reportName=PAStatusUpdates", '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();

            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&measureid=15' + '&rowCount=' + data.TotalCount + "&reportName=PAStatusUpdates";
            $('#pa-status-chart-title-d').html('<a href="' + url + '" target="_blank">Total Referrals ' + numeral(data.TotalCount).format('0,0') + '</a>');
        }
    },

    renderReferralStatusChart: function (data) {
        if (!data) return;
        if (utility.chechDataAvailibility('referral-status-no-data', 'referral-status-pie-chart', 'referral-status-chart-title', data)) {
            var dataPlots = [];
            $.each(data, function(index, item) {
                dataPlots.push({
                    y: item.ReferralCount, label: item.ProgramSubstatus,
                    rowCount: item.ReferralCount,
                    legendText: item.ProgramSubstatus + ': ' + numeral(item.ReferralCount).format('0,0') + ' out of ' +
                        numeral(item.TotalReferralCount).format('0,0') + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var tmPie = new CanvasJS.Chart("referral-status-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                            '&measureid=16&programSubStatus=' + e.dataPoint.label + '&rowCount=' + e.dataPoint.rowCount + "&reportName=ReferralStatus", '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();

            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&measureid=16' + '&rowCount=' + data[0].TotalReferralCount + "&reportName=ReferralStatus";
            $('#referral-status-chart-title').html('<a href="' + url + '" target="_blank">Total Referrals ' + numeral(data[0].TotalReferralCount).format('0,0') + '</a>');
        }
    },

    renderDetailsReferralStatusChart: function (data) {
        if (!data) return;
        if (utility.chechDataAvailibility('referral-status-no-data-d', 'referral-status-pie-chart-d', 'referral-status-chart-title-d', data)) {
            var dataPlots = [];
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.ReferralCount, label: item.ProgramSubstatus,
                    rowCount: item.ReferralCount,
                    legendText: item.ProgramSubstatus + ': ' + numeral(item.ReferralCount).format('0,0') + ' out of ' +
                        numeral(item.TotalReferralCount).format('0,0') + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var tmPie = new CanvasJS.Chart("referral-status-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                            '&measureid=16&programSubStatus=' + e.dataPoint.label + '&rowCount=' + e.dataPoint.rowCount + "&reportName=ReferralStatus", '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();

            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&measureid=16' + '&rowCount=' + data[0].TotalReferralCount + "&reportName=ReferralStatus";
            $('#referral-status-chart-title-d').html('<a href="' + url + '" target="_blank">Total Referrals ' + numeral(data[0].TotalReferralCount).format('0,0') + '</a>');
        }
    },

    renderPhamracyReferralsByAssignedOnChart: function (data) {
        $('#prad-chart-title').html('0 Pharmacies - ' + $('#bg-prad button.btn-selected').text() + ' ' + data.DateString + " - 0 Referrals");
        if (!data) return;

        if (utility.chechDataAvailibility('prad-no-data', 'prad-pie-chart', 'prad-chart-title', data.Referrals)) {
            var dataPlots = [];
            $.each(data.Referrals, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.PharmacyName, pharmacyId: item.PharmacyId, rowCount: item.TotalCount,
                    legendText: item.PharmacyName + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (item.TotalCountPercent * 100).toFixed(2)
                        + '%<br\>' + $('#bg-prad button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var bmPie = new CanvasJS.Chart("prad-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                            + $('#bg-prad button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                            + '&pharmacyReferral=' + $('input[name=prad-referrals]:checked').val() + '&dateToUse=AssignedOn'
                            + '&rowCount=' + e.dataPoint.rowCount + '&reportName=PharmacyReferralsByAssignedDate', '_blank');
                    }
                }
                ]
            });
            bmPie.render();
            var pharmacyGlobal = $('#pharmacy-prad').val() === '-1' ? '' : '&fillingPharmacyId=' + $('#pharmacy-prad').val();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                $('#bg-prad button.btn-selected').attr('data-date') + '&pharmacyReferral=' + $('input[name=prad-referrals]:checked').val() +
                pharmacyGlobal + '&rowCount=' + data.TotalCount + '&reportName=PharmacyReferralsByAssignedDate' + '&dateToUse=AssignedOn';
            $('#prad-chart-title').html('<a href="' + url + '" target="_blank">' + data.Referrals.length + ' Pharmacies - ' + service.getDateText('bg-prad') + ' ' + data.DateString + " - "
                + data.TotalCount + " Referrals</a>");
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderDetailsPhamracyReferralsByAssignedOnChart: function (data) {
        $('#prad-d-chart-title').html('0 Pharmacies - ' + $('#bg-prad-d button.btn-selected').text() + ' ' + data.DateString + " - 0 Referrals");
        if (!data) return;

        if (utility.chechDataAvailibility('prad-no-data-d', 'prad-d-pie-chart', 'prad-d-chart-title', data.Referrals)) {
            var dataPlots = [];
            $.each(data.Referrals, function (index, item) {
                dataPlots.push({
                    y: (item.TotalCountPercent * 100).toFixed(2), label: item.PharmacyName, pharmacyId: item.PharmacyId, rowCount: item.TotalCount,
                    legendText: item.PharmacyName + '<br\>Referrals: ' + item.TotalCount + ' out of ' + data.TotalCount + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (item.TotalCountPercent * 100).toFixed(2)
                        + '%<br\>' + $('#bg-prad-d button.btn-selected').text() + ' ' + data.DateString + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var bmPie = new CanvasJS.Chart("prad-d-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                            + $('#bg-prad-d button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                            + '&pharmacyReferral=' + $('input[name=prad-referrals-d]:checked').val() + '&dateToUse=AssignedOn'
                            + '&rowCount=' + e.dataPoint.rowCount + '&reportName=PharmacyReferralsByAssignedDate', '_blank');
                    }
                }
                ]
            });
            bmPie.render();
            var pharmacyGlobal = $('#pharmacy-prad-d').val() === '-1' ? '' : '&fillingPharmacyId=' + $('#pharmacy-prad-d').val();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                $('#bg-prad-d button.btn-selected').attr('data-date') + '&pharmacyReferral=' + $('input[name=prad-referrals-d]:checked').val() +
                pharmacyGlobal + '&rowCount=' + data.TotalCount + '&reportName=PharmacyReferralsByAssignedDate' + '&dateToUse=AssignedOn';
            $('#prad-d-chart-title').html('<a href="' + url + '" target="_blank">' + data.Referrals.length + ' Pharmacies - ' + service.getDateText('bg-prad-d') + ' ' + data.DateString + " - "
                + data.TotalCount + " Referrals</a>");
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderRxcReasonByPrescriberChart: function (data) {
        if (!data) return;
        var plName = !$('#rxc-last-name').val() || $('#rxc-last-name').val() === '-1' ? '' : '&prescriberLastName=' + $('#rxc-last-name').val();
        var pfName = !$('#rxc-first-name').val() || $('#rxc-first-name').val() === '-1' ? '' : '&prescriberFirstName=' + $('#rxc-first-name').val();
        if (utility.chechDataAvailibility('rxc-no-data', 'rxc-pie-chart', 'rxc-chart-title', data)) {
            var dataPlots = [];
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.RxcReasonCountPercent, label: item.Reason,
                    rowCount: item.RxcReasonCount,
                    legendText: item.Reason + ': ' + numeral(item.RxcReasonCount).format('0,0') + ' out of ' +
                        numeral(item.TotalCount).format('0,0') + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var tmPie = new CanvasJS.Chart("rxc-pie-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label} {y}%",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                            '&measureid=18&reason=' + e.dataPoint.label + '&rowCount=' + e.dataPoint.rowCount +
                            plName + pfName + '&reportName=RXCReasonByPrescriber', '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();

            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                            '&measureid=18&rowCount=' + data[0].TotalCount +
                            plName + pfName + '&reportName=RXCReasonByPrescriber';
            $('#rxc-chart-title').html('<a href="' + url + '" target="_blank">Total Count ' + numeral(data[0].TotalCount).format('0,0') + '</a>');
        }
    },

    renderDetailsRxcReasonByPrescriberChart: function (data) {
        if (!data) return;
        var plName = !$('#rxc-last-name-d').val() || $('#rxc-last-name-d').val() === '-1' ? '' : '&prescriberLastName=' + $('#rxc-last-name-d').val();
        var pfName = !$('#rxc-first-name-d').val() || $('#rxc-first-name-d').val() === '-1' ? '' : '&prescriberFirstName=' + $('#rxc-first-name-d').val();
        if (utility.chechDataAvailibility('rxc-no-data-d', 'rxc-pie-chart-d', 'rxc-chart-title-d', data)) {
            var dataPlots = [];
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.RxcReasonCountPercent, label: item.Reason,
                    rowCount: item.RxcReasonCount,
                    legendText: item.Reason + ': ' + numeral(item.RxcReasonCount).format('0,0') + ' out of ' +
                        numeral(item.TotalCount).format('0,0') + '<br\>' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
            });
            var tmPie = new CanvasJS.Chart("rxc-pie-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont",
                    fontWeight: "normal"
                },
                animationEnabled: true,
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label} {y}%",
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    dataPoints: dataPlots,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                            '&measureid=18&reason=' + e.dataPoint.label + '&rowCount=' + e.dataPoint.rowCount +
                            plName + pfName + '&reportName=RXCReasonByPrescriber', '_blank');
                    }
                }
                ]
            });
            tmPie.render();
            $('.canvasjs-chart-credit').hide();

            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() +
                            '&measureid=18&rowCount=' + data[0].TotalCount +
                            plName + pfName + '&reportName=RXCReasonByPrescriber';
            $('#rxc-chart-title-d').html('<a href="' + url + '" target="_blank">Total Count ' + numeral(data[0].TotalCount).format('0,0') + '</a>');
        }
    },
};