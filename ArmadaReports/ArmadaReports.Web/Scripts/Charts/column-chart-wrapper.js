var columnChartWrapper = {
    renderTopLeftChart: function (data) {
        $('#tl-chart-title').html('Avg Program Days To Fill: 0 Days');
        //if (!data || data.length == 0) {
        //    new CanvasJS.Chart("top-left-column-chart").render();
        //    $('.canvasjs-chart-credit').hide();
        //    return;
        //}

        if (utility.chechDataAvailibility('top-left-no-data', 'top-left-column-chart', 'tl-chart-title', data)) {
            var dataPlots = [];
            var avgF = 0;
            var avgWf = 0;
            var avgPc = 0;
            var max = 0;
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.PrescriptionCount, label: item.Fill, x: item.Fill,
                    legendText: 'Scripts Filled: ' + item.PrescriptionCount + '<br\>Days To Fill: ' + item.Fill + '<br\>' + $('#program option:selected').text() +
                        '<br\>Prior Auth Required: ' + $('#prior-auth option:selected').text()
                });
                max = parseInt(item.PrescriptionCount) > max ? parseInt(item.PrescriptionCount) : max;
                avgF += parseFloat(item.Fill);
                avgWf += parseFloat(item.WeightedFill);
                avgPc += parseFloat(item.PrescriptionCount);
            });
            var tlColumn = new CanvasJS.Chart("top-left-column-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "# of Rx Filled",
                    titleFontSize: 12,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "# of Days To Fill (in last 30 days)",
                    titleFontSize: 12,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont"
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [

                {
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: data.length > 40 ? "" : "{y}",
                    dataPoints: dataPlots,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {
                        var priorAuth = $('#prior-auth').val() === '-1' ? '' : $('#prior-auth').val() === '1' ? '&priorAuth=true' : '&priorAuth=false';
                        var fillingCompanyId = $('#pharmacy').val() === '-1' ? '' : $('#pharmacy').val();
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=lastthirtyday' + priorAuth
                            + '&fillingCompanyId=' + fillingCompanyId + '&daysToFill=' + e.dataPoint.label + '&avgDays=DTFAvg&rowCount=' + e.dataPoint.y + '&reportName=DaysToFill', '_blank');
                    }
                }
                ]
            });

            tlColumn.render();
            var priorAuth = $('#prior-auth').val() === '-1' ? '' : $('#prior-auth').val() === '1' ? '&priorAuth=true' : '&priorAuth=false';
            var fillingCompanyId = $('#pharmacy').val() === '-1' ? '' : $('#pharmacy').val();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=lastthirtyday' + priorAuth
                            + '&fillingCompanyId=' + fillingCompanyId + '&avgDays=DTFAvg' + '&reportName=DaysToFill';
            $('#tl-chart-title').html('<a href="' + url + '" target="_blank">Avg Program Days To Fill: ' + (isNaN(avgWf / avgPc) ? 0 : (parseFloat(avgWf / avgPc)).toFixed(2)) + ' Days</a>' +
                (data[0].IsAllPharmacy ? '' : '<br\>Avg Pharmacy Days To Fill: ' + (isNaN(avgPc / data.length) ? 0 : (parseFloat(avgPc / data.length)).toFixed(2)) + ' Days'));
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderTopLeftDetailsChart: function (data) {
        $('#tl-d-chart-title').html('Avg Program Days To Fill: 0 Days');
        //if (!data || data.length == 0) {
        //    new CanvasJS.Chart("top-left-column-chart-details").render();
        //    $('.canvasjs-chart-credit').hide();
        //    return;
        //}

        if (utility.chechDataAvailibility('top-left-no-data-d', 'top-left-column-chart-details', 'tl-d-chart-title', data)) {
            var dataPlots = [];
            var avgF = 0;
            var avgWf = 0;
            var avgPc = 0;
            var max = 0;
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.PrescriptionCount, label: item.Fill, x: item.Fill,
                    legendText: 'Scripts Filled: ' + item.PrescriptionCount + '<br\>Days To Fill: ' + item.Fill + '<br\>' + $('#program option:selected').text() +
                        '<br\>Prior Auth Required: ' + $('#prior-auth-details option:selected').text()
                });
                max = parseInt(item.PrescriptionCount) > max ? parseInt(item.PrescriptionCount) : max;
                avgF += parseFloat(item.Fill);
                avgWf += parseFloat(item.WeightedFill);
                avgPc += parseFloat(item.PrescriptionCount);
            });
            var tldColumn = new CanvasJS.Chart("top-left-column-chart-details",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "# of Rx Filled",
                    titleFontSize: 12,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "# of Days To Fill (in last 30 days)",
                    titleFontSize: 12,
                    titleFontColor: '#282828',
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont"
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [

                {
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    indexLabel: data.length > 40 ? "" : "{y}",
                    dataPoints: dataPlots,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {
                        var priorAuth = $('#prior-auth-details').val() === '-1' ? '' : $('#prior-auth-details').val() === '1' ? '&priorAuth=true' : '&priorAuth=false';
                        var fillingCompanyId = $('#pharmacy-details').val() === '-1' ? '' : $('#pharmacy-details').val();
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=lastthirtyday' + priorAuth
                            + '&fillingCompanyId=' + fillingCompanyId + '&daysToFill=' + e.dataPoint.label + '&avgDays=DTFAvg' + '&reportName=DaysToFill', '_blank');
                    }
                }
                ]
            });

            tldColumn.render();
            var priorAuth = $('#prior-auth-details').val() === '-1' ? '' : $('#prior-auth-details').val() === '1' ? '&priorAuth=true' : '&priorAuth=false';
            var fillingCompanyId = $('#pharmacy-details').val() === '-1' ? '' : $('#pharmacy-details').val();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=lastthirtyday' + priorAuth
                            + '&fillingCompanyId=' + fillingCompanyId + '&avgDays=DTFAvg' + '&reportName=DaysToFill';
            $('#tl-d-chart-title').html('<a href="' + url + '" target="_blank">Avg Program Days To Fill: ' + (isNaN(avgWf / avgPc) ? 0 : (parseFloat(avgWf / avgPc)).toFixed(2)) + ' Days</a>' +
                (data[0].IsAllPharmacy ? '' : '<br\>Avg Pharmacy Days To Fill: ' + (isNaN(avgPc / data.length) ? 0 : (parseFloat(avgPc / data.length)).toFixed(2)) + ' Days'));
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderBr1Chart: function (data) {
        if (!data) return;

        if (utility.chechBothDataAvailibility('bottom-right1-no-data', 'bottom-right1-column-chart', 'title', data.Current, data.Previous)) {
            var dataPlots1 = [], dataPlots2 = [];
            var max = 0;
            $.each(data.Current, function (index, item) {
                dataPlots1.push({
                    y: item.PatientCount, label: item.MonthName, endDate: item.EndDate, chartDate: item.ChartDate,
                    legendText: 'Patients: ' + item.PatientCount + '<br\>Chart Date: ' + item.MonthName + ', ' + item.Year + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PatientCount) > max ? parseInt(item.PatientCount) : max;
            });
            $.each(data.Previous, function (index, item) {
                dataPlots2.push({
                    y: item.PatientCount, label: item.MonthName, endDate: item.EndDate, chartDate: item.ChartDate,
                    legendText: 'Patients: ' + item.PatientCount + '<br\>Chart Date: ' + item.MonthName + ', ' + item.Year + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PatientCount) > max ? parseInt(item.PatientCount) : max;
            });
            var br1Column = new CanvasJS.Chart("bottom-right1-column-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "Unique Patients",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "Months",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: 315,
                    interval: 1
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Previous && data.Previous.length > 0 ? data.Previous[0].Year + '' : '',
                        dataPoints: dataPlots2,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/UniquePatientDetails?programId=' + $('#program').val() + '&chartDate=' + e.dataPoint.chartDate, '_blank');
                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Current && data.Current.length > 0 ? data.Current[0].Year + '' : '',
                        dataPoints: dataPlots1,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/UniquePatientDetails?programId=' + $('#program').val() + '&chartDate=' + e.dataPoint.chartDate, '_blank');
                        }
                    }
                ]
            });

            br1Column.render();
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderBr1DetailsChart: function (data) {
        if (!data) return;

        if (utility.chechBothDataAvailibility('bottom-right1-no-data-d', 'bottom-right1-column-chart-details', 'title', data.Current, data.Previous)) {
            var dataPlots1 = [], dataPlots2 = [];
            var max = 0;
            $.each(data.Current, function (index, item) {
                dataPlots1.push({
                    y: item.PatientCount, label: item.MonthName, endDate: item.EndDate, chartDate: item.ChartDate,
                    legendText: 'Patients: ' + item.PatientCount + '<br\>Chart Date: ' + item.MonthName + ', ' + item.Year + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PatientCount) > max ? parseInt(item.PatientCount) : max;
            });
            $.each(data.Previous, function (index, item) {
                dataPlots2.push({
                    y: item.PatientCount, label: item.MonthName, endDate: item.EndDate, chartDate: item.ChartDate,
                    legendText: 'Patients: ' + item.PatientCount + '<br\>Chart Date: ' + item.MonthName + ', ' + item.Year + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PatientCount) > max ? parseInt(item.PatientCount) : max;
            });
            var br1dColumn = new CanvasJS.Chart("bottom-right1-column-chart-details",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "Unique Patients",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "Months",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: 315,
                    interval: 1
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Previous && data.Previous.length > 0 ? data.Previous[0].Year + '' : '',
                        dataPoints: dataPlots2,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/UniquePatientDetails?programId=' + $('#program').val() + '&chartDate=' + e.dataPoint.chartDate, '_blank');
                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Current && data.Current.length > 0 ? data.Current[0].Year + '' : '',
                        dataPoints: dataPlots1,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/UniquePatientDetails?programId=' + $('#program').val() + '&chartDate=' + e.dataPoint.chartDate, '_blank');
                        }
                    }
                ]
            });

            br1dColumn.render();
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderBr2Chart: function (data) {
        if (!data) return;

        if (utility.chechBothDataAvailibility('bottom-right2-no-data', 'bottom-right2-column-chart', 'title', data.Current, data.Previous)) {
            var dataPlots1 = [], dataPlots2 = [];
            var max = 0;
            $.each(data.Current, function (index, item) {
                dataPlots1.push({
                    y: item.PrescriptionCount, label: item.MonthName, begDate: item.BegDate, endDate: item.CreatedOnDate, shipEndDate: item.ShipEndDate,
                    legendText: 'Orders Total Count: ' + item.PrescriptionCount + '<br\>Enrollment Date: ' + item.EnrollmentDate + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PrescriptionCount) > max ? parseInt(item.PrescriptionCount) : max;
            });
            $.each(data.Previous, function (index, item) {
                dataPlots2.push({
                    y: item.PrescriptionCount, label: item.MonthName, begDate: item.BegDate, endDate: item.CreatedOnDate, shipEndDate: item.ShipEndDate,
                    legendText: 'Orders Total Count : ' + item.PrescriptionCount + '<br\>Enrollment Date: ' + item.EnrollmentDate + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PrescriptionCount) > max ? parseInt(item.PrescriptionCount) : max;
            });
            var br2Column = new CanvasJS.Chart("bottom-right2-column-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "Unique Patients",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "Months",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: 315,
                    interval: 1
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Previous && data.Previous.length > 0 ? data.Previous[0].Year + '' : ' ',
                        dataPoints: dataPlots2,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&from=' + e.dataPoint.begDate + '&to=' + e.dataPoint.endDate +
                                '&shipFrom=' + e.dataPoint.begDate + '&shipTo=' + e.dataPoint.shipEndDate + '&divReport=OrderCount', '_blank');
                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Current && data.Current.length > 0 ? data.Current[0].Year + '' : ' ',
                        dataPoints: dataPlots1,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&from=' + e.dataPoint.begDate + '&to=' + e.dataPoint.endDate +
                                '&shipFrom=' + e.dataPoint.begDate + '&shipTo=' + e.dataPoint.shipEndDate + '&divReport=OrderCount', '_blank');
                        }
                    }
                ]
            });

            br2Column.render();
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderBr2DetailsChart: function (data) {
        if (!data) return;

        if (utility.chechBothDataAvailibility('bottom-right2-no-data-d', 'bottom-right2-column-chart-details', 'title', data.Current, data.Previous)) {
            var dataPlots1 = [], dataPlots2 = [];
            var max = 0;
            $.each(data.Current, function (index, item) {
                dataPlots1.push({
                    y: item.PrescriptionCount, label: item.MonthName, begDate: item.BegDate, endDate: item.CreatedOnDate, shipEndDate: item.ShipEndDate,
                    legendText: 'Orders Total Count: ' + item.PrescriptionCount + '<br\>Enrollment Date: ' + item.EnrollmentDate + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PrescriptionCount) > max ? parseInt(item.PrescriptionCount) : max;
            });
            $.each(data.Previous, function (index, item) {
                dataPlots2.push({
                    y: item.PrescriptionCount, label: item.MonthName, begDate: item.BegDate, endDate: item.CreatedOnDate, shipEndDate: item.ShipEndDate,
                    legendText: 'Orders Total Count : ' + item.PrescriptionCount + '<br\>Enrollment Date: ' + item.EnrollmentDate + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PrescriptionCount) > max ? parseInt(item.PrescriptionCount) : max;
            });
            var br2dColumn = new CanvasJS.Chart("bottom-right2-column-chart-details",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "Unique Patients",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "Months",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: 315,
                    interval: 1
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Previous && data.Previous.length > 0 ? data.Previous[0].Year + '' : ' ',
                        dataPoints: dataPlots2,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&from=' + e.dataPoint.begDate + '&to=' + e.dataPoint.endDate +
                                '&shipFrom=' + e.dataPoint.begDate + '&shipTo=' + e.dataPoint.shipEndDate + '&divReport=OrderCount', '_blank');
                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Current && data.Current.length > 0 ? data.Current[0].Year + '' : ' ',
                        dataPoints: dataPlots1,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&from=' + e.dataPoint.begDate + '&to=' + e.dataPoint.endDate +
                                '&shipFrom=' + e.dataPoint.begDate + '&shipTo=' + e.dataPoint.shipEndDate + '&divReport=OrderCount', '_blank');
                        }
                    }
                ]
            });

            br2dColumn.render();
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderBr6Chart: function (data) {
        if (!data) return;

        if (utility.chechBothDataAvailibility('bottom-right6-no-data', 'bottom-right6-column-chart', 'title', data.Current, data.Previous)) {
            var dataPlots1 = [], dataPlots2 = [];
            var max = 0;
            $.each(data.Current, function (index, item) {
                dataPlots1.push({
                    y: item.PrescriptionCount, label: item.MonthName,
                    legendText: 'Patients: ' + item.PrescriptionCount + '<br\>Chart Date: ' + item.MonthName + ', ' + item.Year + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PrescriptionCount) > max ? parseInt(item.PrescriptionCount) : max;
            });
            $.each(data.Previous, function (index, item) {
                dataPlots2.push({
                    y: item.PrescriptionCount, label: item.MonthName,
                    legendText: 'Patients: ' + item.PrescriptionCount + '<br\>Chart Date: ' + item.MonthName + ', ' + item.Year + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PrescriptionCount) > max ? parseInt(item.PrescriptionCount) : max;
            });
            var br6Column = new CanvasJS.Chart("bottom-right6-column-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "Unique Patients",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "Months",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: 315,
                    interval: 1
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Previous && data.Previous.length > 0 ? data.Previous[0].Year + '' : '',
                        dataPoints: dataPlots2,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {

                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Current && data.Current.length > 0 ? data.Current[0].Year + '' : '',
                        dataPoints: dataPlots1,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {

                        }
                    }
                ]
            });

            br6Column.render();
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderDetailsBr6Chart: function (data) {
        if (!data) return;

        if (utility.chechBothDataAvailibility('bottom-right6-no-data-d', 'bottom-right6-column-chart-details', 'title', data.Current, data.Previous)) {
            var dataPlots1 = [], dataPlots2 = [];
            var max = 0;
            $.each(data.Current, function (index, item) {
                dataPlots1.push({
                    y: item.PrescriptionCount, label: item.MonthName,
                    legendText: 'Patients: ' + item.PrescriptionCount + '<br\>Chart Date: ' + item.MonthName + ', ' + item.Year + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PrescriptionCount) > max ? parseInt(item.PrescriptionCount) : max;
            });
            $.each(data.Previous, function (index, item) {
                dataPlots2.push({
                    y: item.PrescriptionCount, label: item.MonthName,
                    legendText: 'Patients: ' + item.PrescriptionCount + '<br\>Chart Date: ' + item.MonthName + ', ' + item.Year + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.PrescriptionCount) > max ? parseInt(item.PrescriptionCount) : max;
            });
            var br6dColumn = new CanvasJS.Chart("bottom-right6-column-chart-details",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "Unique Patients",
                    titleFontSize: 12,
                    titleFontFamily: "AsembiaFont",
                    labelFontColor: '#282828',
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "Months",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: 315,
                    interval: 1
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Previous && data.Previous.length > 0 ? data.Previous[0].Year + '' : '',
                        dataPoints: dataPlots2,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {

                        }
                    },
                    {
                        type: "column",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: data.Current && data.Current.length > 0 ? data.Current[0].Year + '' : '',
                        dataPoints: dataPlots1,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {

                        }
                    }
                ]
            });

            br6dColumn.render();
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderCallCenterStatAsaChart: function (data) {

        var callType = $('input[name=calls1-overview-radio]:checked').val();
        if (utility.chechDataAvailibility('ccs-asa-no-data', 'ccs-asa-chart', 'ccs-asa-title', data.AvgSpeedAnswer)) {
            var dataPlots1 = [], dataPlots2 = [];
            $.each(data.AvgSpeedAnswer, function (index, item) {
                dataPlots1.push({
                    y: item.Y,
                    label: item.X,
                    x: index + 1,
                    legendText: 'Avg Speed Answer: ' + columnChartWrapper.getTime(item.Y) + '<br\>' +
                        //(callType === 'all' ? 'Auto Dial Avg Speed Answer: ' + columnChartWrapper.getTime(item.AdY) + '<br\>' : '') +
                        //(callType === 'all' ? 'Manual Dial Avg Speed Answer: ' + columnChartWrapper.getTime(item.HlY) + '<br\>' : '') +
                        item.X + '<br\>' + $('#program option:selected').text()
                });
            });
            var ccsChart = new CanvasJS.Chart("ccs-asa-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    stripLines: [
                        {
                            startValue: 29,
                            endValue: 30,
                            color: "#ff0000"
                        }
                    ]
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: -30
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [{
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {

                    }
                }]
            });

            ccsChart.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderCallCenterStatAhtChart: function (data) {
        var callType = $('input[name=calls1-overview-radio]:checked').val();
        if (utility.chechDataAvailibility('ccs-aht-no-data', 'ccs-aht-chart', 'ccs-aht-title', data.AvgHandleTime)) {
            var dataPlots1 = [], dataPlots2 = [];
            $.each(data.AvgHandleTime, function (index, item) {
                dataPlots1.push({
                    y: item.Y,
                    label: item.X,
                    x: index + 1,
                    legendText: 'Avg Handle Time: ' + columnChartWrapper.getTime(item.Y) + '<br\>' +
                        //(callType === 'all' ? 'Auto Dial Avg Handle Time: ' + columnChartWrapper.getTime(item.AdY) + '<br\>' : '') +
                        //(callType === 'all' ? 'Manual Dial Avg Handle Time: ' + columnChartWrapper.getTime(item.HlY) + '<br\>' : '') +
                        item.X + '<br\>' + $('#program option:selected').text()
                });
            });
            var ccsChart = new CanvasJS.Chart("ccs-aht-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont"
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: -30
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [{
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {

                    }
                }]
            });

            ccsChart.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderCallCenterStatArChart: function (data) {
        var callType = $('input[name=calls2-overview-radio]:checked').val();
        if (utility.chechDataAvailibility('ccs-ar-no-data', 'ccs-ar-chart', 'ccs-ar-title', data.AbandonmentRate)) {
            var dataPlots1 = [], dataPlots2 = [];
            $.each(data.AbandonmentRate, function (index, item) {
                dataPlots1.push({
                    y: parseFloat((item.Y * 100).toFixed(2)),
                    label: item.X,
                    x: index + 1,
                    legendText: 'Calls Handled: ' + (item.AdHandled + item.HlHandled) + '<br\>Calls Abandoned:' + (item.AdAbandoned + item.HlAbandoned) +
                        //(callType === 'all' ? '<br\>Auto Dial Calls Handled: ' + (item.AdHandled) + '<br\>Auto Dial Calls Abandoned:' + (item.AdAbandoned) : '') +
                        //(callType === 'all' ? '<br\>Manual Dial Calls Handled: ' + (item.HlHandled) + '<br\>Manual Dial Calls Abandoned:' + (item.HlAbandoned) : '') +
                        '<br\>Abandonment Rate: ' + (item.Y * 100).toFixed(2) + '%<br\>' +
                        //(callType === 'all' ? 'Auto Dial Abandonment Rate: ' + (item.AdY * 100).toFixed(2) + '%<br\>' : '') +
                        //(callType === 'all' ? 'Manual Dial Abandonment Rate: ' + (item.HlY * 100).toFixed(2) + '%<br\>' : '') +
                        item.X + '<br\>' + $('#program option:selected').text()
                });
            });
            var ccsChart = new CanvasJS.Chart("ccs-ar-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    suffix: '%',
                    stripLines: [
                        {
                            startValue: 4.9,
                            endValue: 5.1,
                            color: "#ff0000"
                        }
                    ]
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: -30
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [{
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {

                    }
                }]
            });

            ccsChart.render();
            $('.canvasjs-chart-credit').hide();
        }
    },


    renderCallCenterStatAchChart: function (data) {
        var callType = $('input[name=calls2-overview-radio]:checked').val();
        if (utility.chechDataAvailibility('ccs-ach-no-data', 'ccs-ach-chart', 'ccs-ach-title', data.CallsHandled)) {
            var dataPlots1 = [], dataPlots2 = [];
            $.each(data.CallsHandled, function (index, item) {
                dataPlots1.push({
                    y: (item.Y),
                    label: item.X,
                    x: index + 1,
                    legendText: 'Avg # of Calls handled: ' + (item.Y) + '<br\>' +
                        //(callType === 'all' ? '# of Auto Dial Calls handled: ' + item.AdY + '<br\>' : '') +
                        //(callType === 'all' ? '# of Manual Calls handled: ' + item.HlY + '<br\>' : '') +
                        item.X + '<br\>' + $('#program option:selected').text()
                });
            });
            var ccsChart = new CanvasJS.Chart("ccs-ach-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont"
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: -30
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [{
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {

                    }
                }]
            });

            ccsChart.render();
            $('.canvasjs-chart-credit').hide();
        }
    },


    renderCallCenterStatAsaChartDetails: function (data) {

        var callType = $('input[name=calls1-overview-d-radio]:checked').val();
        if (utility.chechDataAvailibility('ccs-asa-no-data-d', 'ccs-asa-chart-d', 'ccs-asa-title-d', data.AvgSpeedAnswer)) {
            var dataPlots1 = [], dataPlots2 = [];
            $.each(data.AvgSpeedAnswer, function (index, item) {
                dataPlots1.push({
                    y: item.Y,
                    label: item.X,
                    x: index + 1,
                    legendText: 'Avg Speed Answer: ' + columnChartWrapper.getTime(item.Y) + '<br\>' +
                        //(callType === 'all' ? 'Auto Dial Avg Speed Answer: ' + columnChartWrapper.getTime(item.AdY) + '<br\>' : '') +
                        //(callType === 'all' ? 'Manual Dial Avg Speed Answer: ' + columnChartWrapper.getTime(item.HlY) + '<br\>' : '') +
                        item.X + '<br\>' + $('#program option:selected').text()
                });
            });
            var ccsChart = new CanvasJS.Chart("ccs-asa-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    stripLines: [
                        {
                            startValue: 29,
                            endValue: 30,
                            color: "#ff0000"
                        }
                    ]
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: -30
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [{
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {

                    }
                }]
            });

            ccsChart.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderCallCenterStatAhtChartDetails: function (data) {
        var callType = $('input[name=calls1-overview-d-radio]:checked').val();
        if (utility.chechDataAvailibility('ccs-aht-no-data-d', 'ccs-aht-chart-d', 'ccs-aht-title-d', data.AvgHandleTime)) {
            var dataPlots1 = [], dataPlots2 = [];
            $.each(data.AvgHandleTime, function (index, item) {
                dataPlots1.push({
                    y: item.Y,
                    label: item.X,
                    x: index + 1,
                    legendText: 'Avg Handle Time: ' + columnChartWrapper.getTime(item.Y) + '<br\>' +
                        //(callType === 'all' ? 'Auto Dial Avg Handle Time: ' + columnChartWrapper.getTime(item.AdY) + '<br\>' : '') +
                        //(callType === 'all' ? 'Manual Dial Avg Handle Time: ' + columnChartWrapper.getTime(item.HlY) + '<br\>' : '') +
                        item.X + '<br\>' + $('#program option:selected').text()
                });
            });
            var ccsChart = new CanvasJS.Chart("ccs-aht-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont"
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: -30
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [{
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {

                    }
                }]
            });

            ccsChart.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderCallCenterStatArChartDetails: function (data) {
        var callType = $('input[name=calls2-overview-d-radio]:checked').val();
        if (utility.chechDataAvailibility('ccs-ar-no-data-d', 'ccs-ar-chart-d', 'ccs-ar-title-d', data.AbandonmentRate)) {
            var dataPlots1 = [], dataPlots2 = [];
            $.each(data.AbandonmentRate, function (index, item) {
                dataPlots1.push({
                    y: parseFloat((item.Y * 100).toFixed(2)),
                    label: item.X,
                    x: index + 1,
                    legendText: 'Calls Handled: ' + (item.AdHandled + item.HlHandled) + '<br\>Calls Abandoned:' + (item.AdAbandoned + item.HlAbandoned) +
                        //(callType === 'all' ? '<br\>Auto Dial Calls Handled: ' + (item.AdHandled) + '<br\>Auto Dial Calls Abandoned:' + (item.AdAbandoned) : '') +
                        //(callType === 'all' ? '<br\>Manual Dial Calls Handled: ' + (item.HlHandled) + '<br\>Manual Dial Calls Abandoned:' + (item.HlAbandoned) : '') +
                        '<br\>Abandonment Rate: ' + (item.Y * 100).toFixed(2) + '%<br\>' +
                        //(callType === 'all' ? 'Auto Dial Abandonment Rate: ' + (item.AdY * 100).toFixed(2) + '%<br\>' : '') +
                        //(callType === 'all' ? 'Manual Dial Abandonment Rate: ' + (item.HlY * 100).toFixed(2) + '%<br\>' : '') +
                        item.X + '<br\>' + $('#program option:selected').text()
                });
            });
            var ccsChart = new CanvasJS.Chart("ccs-ar-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    suffix: '%',
                    stripLines: [
                        {
                            startValue: 4.9,
                            endValue: 5.1,
                            color: "#ff0000"
                        }
                    ]
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: -30
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [{
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {

                    }
                }]
            });

            ccsChart.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderCallCenterStatAchChartDetails: function (data) {
        var callType = $('input[name=calls2-overview-d-radio]:checked').val();
        if (utility.chechDataAvailibility('ccs-ach-no-data-d', 'ccs-ach-chart-d', 'ccs-ach-title-d', data.CallsHandled)) {
            var dataPlots1 = [], dataPlots2 = [];
            $.each(data.CallsHandled, function (index, item) {
                dataPlots1.push({
                    y: (item.AdY + item.HlY),
                    label: item.X,
                    x: index + 1,
                    legendText: 'Avg # of Calls handled: ' + (item.AdY + item.HlY) + '<br\>' +
                        //(callType === 'all' ? '# of Auto Dial Calls handled: ' + item.AdY + '<br\>' : '') +
                        //(callType === 'all' ? '# of Manual Calls handled: ' + item.HlY + '<br\>' : '') +
                        item.X + '<br\>' + $('#program option:selected').text()
                });
            });
            var ccsChart = new CanvasJS.Chart("ccs-ach-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont"
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: -30
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [{
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {

                    }
                }]
            });

            ccsChart.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderNetworkCapacityChart: function (data) {
        if (utility.chechDataAvailibility('nc-no-data', 'nc-chart', 'nc-title', data.Chart)) {
            var assignedDataPlots = [];
            var remainingDataPlots = [];
            var totalDataPlots = [];
            $.each(data.Chart, function (index, item) {
                assignedDataPlots.push({
                    y: item.AssignedCapacity, label: item.Date, x: index + 1,
                    legendText: 'Assigned Capacity: ' + numeral(item.AssignedCapacity).format('0,0') + '<br\>' + item.Date + '<br\>' + $('#program option:selected').text()
                });
                remainingDataPlots.push({
                    y: item.RemainingCapacity, label: item.Date, x: index + 1,
                    legendText: 'Remaining Capacity: ' + numeral(item.RemainingCapacity).format('0,0') + '<br\>' + item.Date + '<br\>' + $('#program option:selected').text()
                });
                totalDataPlots.push({
                    y: item.TotalCapacity, label: item.Date, x: index + 1,
                    legendText: 'Total Capacity: ' + numeral(item.TotalCapacity).format('0,0') + '<br\>' + item.Date + '<br\>' + $('#program option:selected').text()
                });
            });
            var ncChart = new CanvasJS.Chart("nc-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "",
                    titleFontSize: 14,
                    labelFontSize: 13,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont"
                },
                axisX: {
                    title: "",
                    titleFontSize: 14,
                    labelFontSize: 13,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: -30
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "stackedColumn",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        dataPoints: assignedDataPlots,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 14,
                        legendText: 'Assigned Capacity',
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=NetworkCapacity', '_blank');
                        }
                    },
                    {
                        type: "stackedColumn",
                        color: '#29abe2',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        dataPoints: remainingDataPlots,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 14,
                        legendText: 'Remaining Capacity',
                        click: function (e) {

                        }
                    }
                    //{
                    //    type: "line",
                    //    color: '#ff0000',
                    //    showInLegend: false,
                    //    toolTipContent: "{legendText}",
                    //    dataPoints: totalDataPlots,
                    //    indexLabelFontColor: "#000",
                    //    indexLabelFontFamily: "Arial",
                    //    indexLabelFontSize: 12,
                    //    click: function (e) {

                    //    }
                    //}
                ]
            });

            ncChart.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderNetworkCapacityDetailsChart: function (data) {
        if (utility.chechDataAvailibility('nc-no-data-d', 'nc-chart-d', 'nc-title-d', data.Chart)) {
            var assignedDataPlots = [];
            var remainingDataPlots = [];
            var totalDataPlots = [];
            $.each(data.Chart, function (index, item) {
                assignedDataPlots.push({
                    y: item.AssignedCapacity, label: item.Date, x: index + 1,
                    legendText: 'Assigned Capacity: ' + numeral(item.AssignedCapacity).format('0,0') + '<br\>' + item.Date + '<br\>' + $('#program option:selected').text()
                });
                remainingDataPlots.push({
                    y: item.RemainingCapacity, label: item.Date, x: index + 1,
                    legendText: 'Remaining Capacity: ' + numeral(item.RemainingCapacity).format('0,0') + '<br\>' + item.Date + '<br\>' + $('#program option:selected').text()
                });
                totalDataPlots.push({
                    y: item.TotalCapacity, label: item.Date, x: index + 1,
                    legendText: 'Total Capacity: ' + numeral(item.TotalCapacity).format('0,0') + '<br\>' + item.Date + '<br\>' + $('#program option:selected').text()
                });
            });
            var ncChart = new CanvasJS.Chart("nc-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "",
                    titleFontSize: 14,
                    labelFontSize: 13,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont"
                },
                axisX: {
                    title: "",
                    titleFontSize: 14,
                    labelFontSize: 13,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: -30
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "stackedColumn",
                        color: '#0071bc',
                        showInLegend: false,
                        toolTipContent: "{legendText}",
                        dataPoints: assignedDataPlots,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 14,
                        legendText: 'Assigned Capacity',
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=NetworkCapacity', '_blank');
                        }
                    },
                    {
                        type: "stackedColumn",
                        color: '#29abe2',
                        showInLegend: false,
                        toolTipContent: "{legendText}",
                        dataPoints: remainingDataPlots,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 14,
                        legendText: 'Remaining Capacity',
                        click: function (e) {

                        }
                    }
                    //{
                    //    type: "line",
                    //    color: '#ff0000',
                    //    showInLegend: false,
                    //    toolTipContent: "{legendText}",
                    //    dataPoints: totalDataPlots,
                    //    indexLabelFontColor: "#000",
                    //    indexLabelFontFamily: "Arial",
                    //    indexLabelFontSize: 12,
                    //    click: function (e) {

                    //    }
                    //}
                ]
            });

            ncChart.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderIncomingReferralsByHourChart: function(data) {
        $('#irbh-chart-title').html($('#bg-irbh button.btn-selected').text() + ': 0 Referrals');

        if (utility.chechDataAvailibility('irbh-no-data', 'irbh-column-chart', 'irbh-chart-title', data)) {
            var dataPlots = [];
            $.each(data, function(index, item) {
                dataPlots.push({
                    y: item.ReferralCountPercent,
                    label: item.HourStr,
                    x: item.Hour,
                    legendText: 'Referrals: ' + item.ReferralCount + '<br\>Referrals Percentage: ' + item.ReferralCountPercent + '%<br\>Physician Search Term: ' + $('#irbh-physician-fname').val() + ' ' + $('#irbh-physician-lname').val() + '<br\>' + $('#program option:selected').text()
                });
            });
            var tlColumn = new CanvasJS.Chart("irbh-column-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "% of Total Referrals Count",
                    titleFontSize: 12,
                    labelFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    suffix: '%',
                    interval: 20,
                    minimum: 0,
                    maximum: 100
                },
                axisX: {
                    title: "Hours",
                    titleFontSize: 12,
                    labelFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    interval: 2,
                    //labelAngle: -30
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: false,
                        toolTipContent: "{legendText}",
                        indexLabel: "",
                        dataPoints: dataPlots,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 8,
                        click: function(e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=IncomingReferralsByHour', '_blank');
                        }
                    }
                ]
            });

            tlColumn.render();
            $('#irbh-chart-title').html(service.getDateText('bg-irbh') + ' ' + data[0].DateString + ' - ' + numeral(data[0].TotalReferralCount).format('0,0') + ' Referrals');
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderIncomingReferralsByHourChartDetails: function (data) {
        $('#irbh-chart-title-d').html($('#bg-irbh-d button.btn-selected').text() + ': 0 Referrals');

        if (utility.chechDataAvailibility('irbh-no-data-d', 'irbh-column-chart-d', 'irbh-chart-title-d', data)) {
            var dataPlots = [];
            $.each(data, function (index, item) {
                dataPlots.push({
                    y: item.ReferralCountPercent,
                    label: item.HourStr,
                    x: item.Hour,
                    legendText: 'Referrals: ' + item.ReferralCount + '<br\>Referrals Percentage: ' + item.ReferralCountPercent + '%<br\>Physician Search Term: ' + $('#irbh-physician-fname-d').val() + ' ' + $('#irbh-physician-lname-d').val() + '<br\>' + $('#program option:selected').text()
                });
            });
            var tlColumn = new CanvasJS.Chart("irbh-column-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "% of Total Referrals Count",
                    titleFontSize: 12,
                    labelFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    suffix: '%',
                    interval: 20,
                    minimum: 0,
                    maximum: 100
                },
                axisX: {
                    title: "Hours",
                    titleFontSize: 12,
                    labelFontSize: 12,
                    labelFontColor: '#282828',
                    titleFontFamily: "AsembiaFont",
                    interval: 1
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: false,
                        toolTipContent: "{legendText}",
                        indexLabel: "{y}%",
                        dataPoints: dataPlots,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 10,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=IncomingReferralsByHour', '_blank');
                        }
                    }
                ]
            });

            tlColumn.render();
            $('#irbh-chart-title-d').html(service.getDateText('bg-irbh-d') + ' ' + data[0].DateString + ' - ' + numeral(data[0].TotalReferralCount).format('0,0') + ' Referrals');
            $('.canvasjs-chart-credit').hide();
        }
    },

    render2HourCallVolume: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('2hcv-no-data', '2hcv-column-chart', 'title', data)) {
            var dataPlots1 = [], dataPlots2 = [];
            var max = 0;
            $.each(data, function (index, item) {
                dataPlots1.push({
                    y: item.Successful, label: item.DateStr, x: (index + 1),
                    legendText: 'Within KPI Range: ' + item.Successful + '<br\>Date: ' + item.DateStr + '<br\>Program: ' + $('#program option:selected').text()
                });
                dataPlots2.push({
                    y: item.Unsuccessful, label: item.DateStr, x: (index + 1),
                    legendText: 'Outside KPI Range: ' + item.Unsuccessful + '<br\>Date: ' + item.DateStr + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.Successful + item.Unsuccessful) > max ? parseInt(item.Successful + item.Unsuccessful) : max;
            });
            var hck2Column = new CanvasJS.Chart("2hcv-column-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "Rx Count",
                    titleFontSize: 12,
                    titleFontFamily: "AsembiaFont",
                    labelFontColor: '#282828',
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: 315,
                    labelFontColor: '#282828',
                    interval: data.length > 20 ? parseInt(data.length / 20) : 1
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "stackedColumn",
                        color: '#29abe2',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: 'Within KPI Range',
                        dataPoints: dataPlots1,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=2HourCallVolume', '_blank');
                        }
                    },
                    {
                        type: "stackedColumn",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: 'Outside KPI Range',
                        dataPoints: dataPlots2,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=2HourCallVolume', '_blank');
                        }
                    }
                ]
            });

            hck2Column.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    render2HourCallVolumeDetails: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('2hcv-no-data-d', '2hcv-column-chart-d', 'title', data)) {
            var dataPlots1 = [], dataPlots2 = [];
            var max = 0;
            $.each(data, function (index, item) {
                dataPlots1.push({
                    y: item.Successful, label: item.DateStr, x: (index + 1),
                    legendText: 'Within KPI Range: ' + item.Successful + '<br\>Date: ' + item.DateStr + '<br\>Program: ' + $('#program option:selected').text()
                });
                dataPlots2.push({
                    y: item.Unsuccessful, label: item.DateStr, x: (index + 1),
                    legendText: 'Outside KPI Range: ' + item.Unsuccessful + '<br\>Date: ' + item.DateStr + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.Successful + item.Unsuccessful) > max ? parseInt(item.Successful + item.Unsuccessful) : max;
            });
            var hck2dColumn = new CanvasJS.Chart("2hcv-column-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "Rx Count",
                    titleFontSize: 12,
                    titleFontFamily: "AsembiaFont",
                    labelFontColor: '#282828',
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    titleFontFamily: "AsembiaFont",
                    labelFontColor: '#282828',
                    //labelAngle: 315,
                    interval: data.length > 30 ? parseInt(data.length / 30) : 1
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "stackedColumn",
                        color: '#29abe2',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: 'Within KPI Range',
                        dataPoints: dataPlots1,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=2HourCallVolume', '_blank');
                        }
                    },
                    {
                        type: "stackedColumn",
                        color: '#0071bc',
                        showInLegend: true,
                        toolTipContent: "{legendText}",
                        legendText: 'Outside KPI Range',
                        dataPoints: dataPlots2,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=2HourCallVolume', '_blank');
                        }
                    }
                ]
            });

            hck2dColumn.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    render2HourCallKpiPercent: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('2hckp-no-data', '2hckp-column-chart', 'title', data)) {
            var dataPlots1 = [];
            var max = 0;
            $.each(data, function (index, item) {
                dataPlots1.push({
                    y: item.KpiPercent, label: item.DateStr, x: (index + 1),
                    legendText: 'KPI: ' + item.KpiPercent + '%<br\>Date: ' + item.DateStr + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.KpiPercent) > max ? parseInt(item.KpiPercent) : max;
            });
            var hck2pColumn = new CanvasJS.Chart("2hckp-column-chart",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "Rx Percent",
                    titleFontSize: 12,
                    titleFontFamily: "AsembiaFont",
                    labelFontColor: '#282828',
                    suffix: '%',
                    maximum: 100,
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: 315,
                    labelFontColor: '#282828',
                    interval: data.length > 20 ? parseInt(data.length / 20) : 1
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: true,
                        legendText: 'KPI Percent',
                        toolTipContent: "{legendText}",
                        dataPoints: dataPlots1,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=2HourCallKPISuccessRate', '_blank');
                        }
                    }
                ]
            });

            hck2pColumn.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    render2HourCallKpiPercentDetails: function (data) {
        if (!data) return;

        if (utility.chechDataAvailibility('2hckp-no-data-d', '2hckp-column-chart-d', 'title', data)) {
            var dataPlots1 = [];
            var max = 0;
            $.each(data, function (index, item) {
                dataPlots1.push({
                    y: item.KpiPercent, label: item.DateStr, x: (index + 1),
                    legendText: 'KPI: ' + item.KpiPercent + '%<br\>Date: ' + item.DateStr + '<br\>Program: ' + $('#program option:selected').text()
                });
                max = parseInt(item.KpiPercent) > max ? parseInt(item.KpiPercent) : max;
            });
            var hck2pdColumn = new CanvasJS.Chart("2hckp-column-chart-d",
            {
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    horizontalAlign: 'left',
                    fontColor: "#2b91d5",
                    fontSize: 14,
                    fontFamily: "AsembiaFont"
                },
                animationEnabled: true,
                axisY: {
                    title: "Rx Percent",
                    titleFontSize: 12,
                    titleFontFamily: "AsembiaFont",
                    labelFontColor: '#282828',
                    suffix: '%',
                    maximum: 100,
                    interval: max <= 3 ? 1 : parseInt(max / 3)
                },
                axisX: {
                    title: "",
                    titleFontSize: 12,
                    titleFontFamily: "AsembiaFont",
                    //labelAngle: 315,
                    labelFontColor: '#282828',
                    interval: data.length > 20 ? parseInt(data.length / 20) : 1
                },
                legend: {
                    verticalAlign: "bottom",
                    horizontalAlign: "center",
                    fontSize: 12,
                    fontColor: '#000',
                    fontFamily: "AsembiaFont"
                },
                theme: "theme2",
                data: [
                    {
                        type: "column",
                        color: '#29abe2',
                        showInLegend: true,
                        legendText: 'KPI Percent',
                        toolTipContent: "{legendText}",
                        dataPoints: dataPlots1,
                        indexLabelFontColor: "#000",
                        indexLabelFontFamily: "AsembiaFont",
                        indexLabelFontSize: 12,
                        click: function (e) {
                            window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType='
                                + $('#bg-bm button.btn-selected').attr('data-date') + '&fillingPharmacyId=' + e.dataPoint.pharmacyId
                                + '&pharmacyReferral=' + $('input[name=p-referrals]:checked').val()
                                + '&rowCount=' + e.dataPoint.rowCount + '&reportName=2HourCallKPISuccessRate', '_blank');
                        }
                    }
                ]
            });

            hck2pdColumn.render();
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderHubStatisticsOutboundTotalCallsChart: function (data) {
        if (!data || data.length === 0) {
            $('#obc-tc-no-data').show();
            $('#obc-tc-chart').hide();
            //new CanvasJS.Chart("obc-tc-chart").render();
            //$('.canvasjs-chart-credit').hide();
            return;
        }
        var callType = $('input[name=callso-overview-radio]:checked').val();
        $('#obc-tc-no-data').hide();
        $('#obc-tc-chart').show();
        var dataPlots1 = [], dataPlots2 = [];
        $.each(data, function (index, item) {
            dataPlots1.push({
                y: parseInt(item.AcTotalCalls + item.McTotalCalls),
                x: (index + 1),
                label: item.Date,
                legendText: 'Total Calls: ' + (item.AcTotalCalls + item.McTotalCalls) +
                    //(callType === 'all' ? '<br/>Auto Dial Calls: ' + item.AcTotalCalls : '') +
                    //(callType === 'all' ? '<br/>Manual Dial Calls: ' + item.McTotalCalls : '') +
                    '<br/>Date: ' + item.Date
            });
        });

        var hubStatisticsObcTc = new CanvasJS.Chart("obc-tc-chart",
        {
            title: {
                text: '',
                verticalAlign: 'bottom',
                horizontalAlign: 'left',
                fontColor: "#2b91d5",
                fontSize: 14,
                fontFamily: "AsembiaFont"
            },
            animationEnabled: true,
            axisY: {
                title: "",
                titleFontSize: 10,
                titleFontFamily: "AsembiaFont",
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                gridThickness: 1,
                labelFontSize: 10,
                tickThickness: 0
            },
            axisX: {
                title: "",
                titleFontSize: 12,
                labelFontColor: '#282828',
                titleFontFamily: "AsembiaFont",
                //labelAngle: -30,
                interval: 1
            },
            legend: {
                fontFamily: "AsembiaFont"
            },
            theme: "theme2",
            data: [
            {
                type: "column",
                color: '#29abe2',
                showInLegend: false,
                toolTipContent: "{legendText}",
                dataPoints: dataPlots1,
                indexLabelFontColor: "#000",
                indexLabelFontFamily: "AsembiaFont",
                indexLabelFontSize: 10,
            }]
        });
        hubStatisticsObcTc.render();

        $('.canvasjs-chart-credit').hide();
    },

    renderHubStatisticsOutboundAvgCallLengthChart: function (data) {
        if (!data || data.length === 0) {
            $('#obc-alc-no-data').show();
            $('#obc-alc-chart').hide();
            return;
        }
        var callType = $('input[name=callso-overview-radio]:checked').val();
        $('#obc-alc-no-data').hide();
        $('#obc-alc-chart').show();
        var dataPlots1 = [], dataPlots2 = [];
        $.each(data, function (index, item) {
            dataPlots1.push({
                y: parseInt(item.AvgCallLength),
                x: (index + 1),
                label: item.Date,
                legendText: 'Avg length of call: ' + item.AvgCallLength + ' secs' +
                    //(callType === 'all' ? '<br/>Auto dial avg length of call: ' + item.AcAvgCallLength + ' secs' : '') +
                    //(callType === 'all' ? '<br/>Manual dial avg length of call: ' + item.McAvgCallLength + ' secs' : '') +
                    '<br/>Date: ' + item.Date
            });
        });

        var hubStatisticsObcAlc = new CanvasJS.Chart("obc-alc-chart",
        {
            title: {
                text: '',
                verticalAlign: 'bottom',
                horizontalAlign: 'left',
                fontColor: "#2b91d5",
                fontSize: 14,
                fontFamily: "AsembiaFont"
            },
            animationEnabled: true,
            axisY: {
                title: "",
                titleFontSize: 10,
                titleFontFamily: "AsembiaFont",
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                gridThickness: 1,
                labelFontSize: 10,
                tickThickness: 0
            },
            axisX: {
                title: "",
                titleFontSize: 12,
                labelFontColor: '#282828',
                titleFontFamily: "AsembiaFont",
                //labelAngle: -30,
                interval: 1
            },
            legend: {
                fontFamily: "AsembiaFont"
            },
            theme: "theme2",
            data: [
                {
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 10,
                }
            ]
        });
        hubStatisticsObcAlc.render();

        $('.canvasjs-chart-credit').hide();
    },











    renderHubStatisticsOutboundTotalCallsChartDetails: function (data) {
        if (!data || data.length === 0) {
            $('#obc-tc-no-data-d').show();
            $('#obc-tc-chart-d').hide();
            //new CanvasJS.Chart("obc-tc-chart").render();
            //$('.canvasjs-chart-credit').hide();
            return;
        }
        var callType = $('input[name=callso-overview-d-radio]:checked').val();
        $('#obc-tc-no-data-d').hide();
        $('#obc-tc-chart-d').show();
        var dataPlots1 = [], dataPlots2 = [];
        $.each(data, function (index, item) {
            dataPlots1.push({
                y: parseInt(item.AcTotalCalls + item.McTotalCalls),
                x: (index + 1),
                label: item.Date,
                legendText: 'Total Calls: ' + (item.AcTotalCalls + item.McTotalCalls) +
                    //(callType === 'all' ? '<br/>Auto Dial Calls: ' + item.AcTotalCalls : '') +
                    //(callType === 'all' ? '<br/>Manual Dial Calls: ' + item.McTotalCalls : '') +
                    '<br/>Date: ' + item.Date
            });
        });

        var hubStatisticsObcTc = new CanvasJS.Chart("obc-tc-chart-d",
        {
            title: {
                text: '',
                verticalAlign: 'bottom',
                horizontalAlign: 'left',
                fontColor: "#2b91d5",
                fontSize: 14,
                fontFamily: "AsembiaFont"
            },
            animationEnabled: true,
            axisY: {
                title: "",
                titleFontSize: 10,
                titleFontFamily: "AsembiaFont",
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                gridThickness: 1,
                labelFontSize: 10,
                tickThickness: 0
            },
            axisX: {
                title: "",
                titleFontSize: 12,
                labelFontColor: '#282828',
                titleFontFamily: "AsembiaFont",
                //labelAngle: -30,
                interval: 1
            },
            theme: "theme2",
            legend: {
                fontFamily: "AsembiaFont"
            },
            data: [
            {
                type: "column",
                color: '#29abe2',
                showInLegend: false,
                toolTipContent: "{legendText}",
                dataPoints: dataPlots1,
                indexLabelFontColor: "#000",
                indexLabelFontFamily: "AsembiaFont",
                indexLabelFontSize: 10,
            }]
        });
        hubStatisticsObcTc.render();

        $('.canvasjs-chart-credit').hide();
    },

    renderHubStatisticsOutboundAvgCallLengthChartDetails: function (data) {
        if (!data || data.length === 0) {
            $('#obc-alc-no-data-d').show();
            $('#obc-alc-chart-d').hide();
            return;
        }
        var callType = $('input[name=callso-overview-d-radio]:checked').val();
        $('#obc-alc-no-data-d').hide();
        $('#obc-alc-chart-d').show();
        var dataPlots1 = [], dataPlots2 = [];
        $.each(data, function (index, item) {
            dataPlots1.push({
                y: parseInt(item.AvgCallLength),
                x: (index + 1),
                label: item.Date,
                legendText: 'Avg length of call: ' + item.AvgCallLength + ' secs' +
                    //(callType === 'all' ? '<br/>Auto dial avg length of call: ' + item.AcAvgCallLength + ' secs' : '') +
                    //(callType === 'all' ? '<br/>Manual dial avg length of call: ' + item.McAvgCallLength + ' secs' : '') +
                    '<br/>Date: ' + item.Date
            });
        });

        var hubStatisticsObcAlc = new CanvasJS.Chart("obc-alc-chart-d",
        {
            title: {
                text: '',
                verticalAlign: 'bottom',
                horizontalAlign: 'left',
                fontColor: "#2b91d5",
                fontSize: 14,
                fontFamily: "AsembiaFont"
            },
            animationEnabled: true,
            axisY: {
                title: "",
                titleFontSize: 10,
                titleFontFamily: "AsembiaFont",
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                gridThickness: 1,
                labelFontSize: 10,
                tickThickness: 0
            },
            axisX: {
                title: "",
                titleFontSize: 12,
                labelFontColor: '#282828',
                titleFontFamily: "AsembiaFont",
                //labelAngle: -30,
                interval: 1
            },
            theme: "theme2",
            legend: {
                fontFamily: "AsembiaFont"
            },
            data: [
                {
                    type: "column",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 10,
                }
            ]
        });
        hubStatisticsObcAlc.render();

        $('.canvasjs-chart-credit').hide();
    },

    renderQaByQuestionTypeColumnChart: function (id, data, type) {
        if (!data || data.length === 0) {
            new CanvasJS.Chart(id).render();
            $('.canvasjs-chart-credit').hide();
            return;
        }
        var dataPlots = [];
        $.each(data, function (index, item) {
            dataPlots.push({
                y: parseFloat(item.AVGAnswerValue), x: (index + 1), label: item.WeekFormatted,
                legendText: 'Average Answers: ' + numeral(item.AVGAnswerValue).format('0,0.00') + '<br/>Week: ' + item.WeekFormatted
            });

        });

        var chart = new CanvasJS.Chart(id,
        {
            title: {
                text: '',
                verticalAlign: 'bottom',
                horizontalAlign: 'left',
                fontColor: "#2b91d5",
                fontSize: 14,
                fontFamily: "AsembiaFont"
            },
            animationEnabled: true,
            axisY: {
                title: "Average Answers",
                titleFontSize: 12,
                titleFontFamily: "AsembiaFont",
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                gridThickness: 1,
                labelFontSize: 10,
                tickThickness: 0,
                maximum: columnChartWrapper.getSurveyMonkeyYMax(type)
            },
            axisX: {
                title: "",
                titleFontSize: 12,
                titleFontFamily: "AsembiaFont",
                labelFontSize: 10,
                //labelAngle: 145,
                labelMaxWidth: 50,
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                labelWrap: true,
                interval: 1,
                tickThickness: 0
            },
            theme: "theme2",
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 11,
                fontColor: '#000',
                fontFamily: "AsembiaFont"
            },
            data: [
                {
                    type: "stackedColumn",
                    color: '#29abe2',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    legendText: 'Average Answers',
                    dataPoints: dataPlots,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12
                }
            ]
        });

        chart.render();
        $('.canvasjs-chart-credit').hide();
    },

    renderAnswerStatsStackedColumnChart: function (id, data) {
        if (!data || data.length == 0) {
            new CanvasJS.Chart(id).render();
            $('.canvasjs-chart-credit').hide();
            return;
        }
        //var colors = ['#29abe2', '#c0504e', '#9bbb58', '#23bfaa', '#8064a1', '#4aacc5', '#a8a8aa', '#a471c1', '#EEC900', '#FF4500'];
        var dataP = [];
        $.each(data, function (index, item) {
            dataP.push({
                type: "stackedColumn",
                color: columnChartWrapper.getSurveyMonkeyColor(index, item.Title),
                showInLegend: true,
                toolTipContent: "{legendText}",
                legendText: item.Title,
                dataPoints: item.Points,
                indexLabelFontColor: "#000",
                indexLabelFontFamily: "AsembiaFont",
                indexLabelFontSize: 12,
            });
        });
        var optoutStackedColumn = new CanvasJS.Chart(id,
        {
            title: {
                text: '',
                verticalAlign: 'bottom',
                horizontalAlign: 'left',
                fontColor: "#2b91d5",
                fontSize: 14,
                fontFamily: "AsembiaFont"
            },
            animationEnabled: true,
            axisY: {
                title: "",
                titleFontSize: 12,
                titleFontFamily: "AsembiaFont",
                labelFontColor: '#282828',
                suffix: '%',
                maximum: 100,
                interval: 25
            },
            axisX: {
                title: "",
                titleFontSize: 12,
                titleFontFamily: "AsembiaFont",
                //labelAngle: 315,
                labelFontColor: '#282828',
                interval: data.length > 20 ? parseInt(data.length / 20) : 1
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 10,
                fontColor: '#000',
                //maxWidth: 400,
                fontFamily: "AsembiaFont"
            },
            theme: "theme2",
            data: dataP
        });

        optoutStackedColumn.render();
        $('.canvasjs-chart-credit').hide();
    },

    renderMedvantxDeliveredVsExceptionOrderVolume: function (data) {
        if (!data || data.length == 0) {
            new CanvasJS.Chart("mdeov-column-chart").render();
            $('.canvasjs-chart-credit').hide();
            return;
        }
        var chartData = [];
        var max = 0;
        $.each(data, function (index, item) {
            var dataPoints = [];
            $.each(item.DataPoints, function (ind, itm) {
                dataPoints.push({
                    y: itm.Y,
                    label: itm.Label,
                    indexLabel: itm.IndexLabel,
                    x: (ind + 1),
                    legendText: 'Total Volume: ' + (itm.CustomDecimalValue2 ? numeral(itm.CustomDecimalValue2).format('0,0') : 0) + '<br/>Delivered vol: ' + (itm.Y ? numeral(itm.Y).format('0,0') : 0) + '<br/>Exceptions vol: ' + (itm.CustomDecimalValue1 ? numeral(itm.CustomDecimalValue1).format('0,0') : 0) +
                        '<br/>Delivered %: ' + (itm.CustomStringValue1 ? itm.CustomStringValue1 : '0.00%') + '<br/>Exception %: ' + (itm.CustomStringValue2 ? itm.CustomStringValue2 : '0.00%')
                });
                max = itm.Y > max ? itm.Y : max;
            });
            chartData.push({
                type: item.Type,
                color: colorSchema.brandColors[index],
                showInLegend: true,
                legendText: item.LegendText,
                dataPoints: dataPoints,
                toolTipContent: "{legendText}",
                indexLabelFontColor: "#000",
                indexLabelFontFamily: "AsembiaFont",
                indexLabelFontSize: 10,
            });
        });

        var qasrChart = new CanvasJS.Chart("mdeov-column-chart",
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
                labelFontColor: '#282828'
            },
            axisY: {
                title: $('input[name=mdeov-radio]:checked').val() === 'All' ? 'Volume (Delivered + Exeptions)' : '',
                includeZero: true,
                gridThickness: 1,
                tickThickness: 0,
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                labelFontSize: 10,
                lineThickness: 0,
                interval: max >= 1000 ? 10000 : parseInt(max / 2) - parseInt(max / 2) % 10
                //interval: max <= 1000 ? parseInt(max / 2) - parseInt(max / 2) % 10 : max <= 10000 ? parseInt(max / 2) - parseInt(max / 2) % 100 : parseInt(max / 2) - parseInt(max / 2) % 1000
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 12,
                fontColor: '#000',
                fontFamily: "AsembiaFont"
            },
            data: chartData
        });

        qasrChart.render();

        $('.canvasjs-chart-credit').hide();
    },

    renderMedvantxUPS48hrDeliveryOrderVolume: function (data) {
        if (!data || data.length == 0) {
            new CanvasJS.Chart("mudov-column-chart").render();
            $('.canvasjs-chart-credit').hide();
            return;
        }
        var chartData = [];
        var max = 0;
        $.each(data, function (index, item) {
            var dataPoints = [];
            $.each(item.DataPoints, function (ind, itm) {
                dataPoints.push({
                    y: itm.Y,
                    label: itm.Label,
                    indexLabel: itm.IndexLabel,
                    x: (ind + 1),
                    legendText: 'Delivery Order Volume: ' + numeral(itm.Y).format('0,0') + '<br/>Period: ' + itm.Label
                });
                max = itm.Y > max ? itm.Y : max;
            });
            chartData.push({
                type: item.Type,
                color: colorSchema.brandColors[index],
                showInLegend: true,
                legendText: item.LegendText,
                dataPoints: dataPoints,
                toolTipContent: "{legendText}",
                indexLabelFontColor: "#000",
                indexLabelFontFamily: "AsembiaFont",
                indexLabelFontSize: 10,
            });
        });

        var qasrChart = new CanvasJS.Chart("mudov-column-chart",
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
                labelFontColor: '#282828'
            },
            axisY: {
                includeZero: true,
                gridThickness: 1,
                tickThickness: 0,
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                labelFontSize: 10,
                lineThickness: 0,
                //interval: parseInt(max / 5)
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 12,
                fontColor: '#000',
                fontFamily: "AsembiaFont"
            },
            data: chartData
        });

        qasrChart.render();

        $('.canvasjs-chart-credit').hide();
    },

    renderMedvantxUPS48hrDeliverySuccessRate: function (data) {
        if (!data || data.length == 0) {
            new CanvasJS.Chart("mudsr-line-chart").render();
            $('.canvasjs-chart-credit').hide();
            return;
        }
        var chartData = [];
        $.each(data, function (index, item) {
            var dataPoints = [];
            $.each(item.DataPoints, function (ind, itm) {
                dataPoints.push({
                    y: itm.Y,
                    label: itm.Label,
                    indexLabel: itm.IndexLabel,
                    x: (ind + 1),
                    legendText: 'Success Rate: ' + numeral(itm.Y).format('0,0') + '%<br/>Period: ' + itm.Label
                });
            });
            chartData.push({
                type: item.Type,
                color: colorSchema.brandColors[index],
                showInLegend: false,
                legendText: item.LegendText,
                dataPoints: dataPoints,
                toolTipContent: "{legendText}",
                indexLabelFontColor: "#000",
                indexLabelFontFamily: "AsembiaFont",
                indexLabelFontSize: 10,
            });
        });

        var qasrChart = new CanvasJS.Chart("mudsr-line-chart",
        {
            theme: "theme3",
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
                labelFontColor: '#282828'
            },
            axisY: {
                includeZero: true,
                gridThickness: 1,
                tickThickness: 0,
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                labelFontSize: 10,
                lineThickness: 0,
                interval: 50,
                suffix: '%',
                maximum: 150
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 12,
                fontColor: '#000',
                fontFamily: "AsembiaFont"
            },
            data: chartData
        });

        qasrChart.render();

        $('.canvasjs-chart-credit').hide();
    },

    renderCleanPathFromBVDirectlyIntoScheduleDelivery: function (data) {
        if (!data || data.length == 0) {
            new CanvasJS.Chart("cp-column-chart").render();
            $('.canvasjs-chart-credit').hide();
            return;
        }
        var chartData = [];
        var max = 0;
        $.each(data, function (index, item) {
            var dataPoints = [];
            $.each(item.DataPoints, function (ind, itm) {
                dataPoints.push({
                    y: itm.Y,
                    label: itm.Label,
                    indexLabel: itm.IndexLabel,
                    x: (ind + 1),
                    legendText: $('input[name=cp-radio]:checked').val() + ': ' + itm.Y + '<br/>Period: ' + itm.Label
                });
                max = itm.Y > max ? itm.Y : max;
            });
            chartData.push({
                type: item.Type,
                color: colorSchema.brandColors[index],
                showInLegend: true,
                legendText: item.LegendText,
                dataPoints: dataPoints,
                toolTipContent: "{legendText}",
                indexLabelFontColor: "#000",
                indexLabelFontFamily: "AsembiaFont",
                indexLabelFontSize: 10,
            });
        });

        var qasrChart = new CanvasJS.Chart("cp-column-chart",
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
                labelFontColor: '#282828'
            },
            axisY: {
                title: 'Day',
                includeZero: true,
                gridThickness: 1,
                tickThickness: 0,
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                labelFontSize: 10,
                lineThickness: 0,
                //interval: parseInt(max / 5)
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 12,
                fontColor: '#000',
                fontFamily: "AsembiaFont"
            },
            data: chartData
        });

        qasrChart.render();

        $('.canvasjs-chart-credit').hide();
    },

    renderIndirectPathFromBVDirectlyIntoAnyStatus: function (data) {
        if (!data || data.length == 0) {
            new CanvasJS.Chart("ip-column-chart").render();
            $('.canvasjs-chart-credit').hide();
            return;
        }
        var chartData = [];
        var max = 0;
        $.each(data, function (index, item) {
            var dataPoints = [];
            $.each(item.DataPoints, function (ind, itm) {
                dataPoints.push({
                    y: itm.Y,
                    label: itm.Label,
                    indexLabel: itm.IndexLabel,
                    x: (ind + 1),
                    legendText: $('input[name=ip-radio]:checked').val() + ': ' + itm.Y + '<br/>Period: ' + itm.Label
                });
                max = itm.Y > max ? itm.Y : max;
            });
            chartData.push({
                type: item.Type,
                color: colorSchema.brandColors[index],
                showInLegend: true,
                legendText: item.LegendText,
                dataPoints: dataPoints,
                toolTipContent: "{legendText}",
                indexLabelFontColor: "#000",
                indexLabelFontFamily: "AsembiaFont",
                indexLabelFontSize: 10,
            });
        });

        var qasrChart = new CanvasJS.Chart("ip-column-chart",
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
                labelFontColor: '#282828'
            },
            axisY: {
                title: 'Day',
                includeZero: true,
                gridThickness: 1,
                tickThickness: 0,
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                labelFontSize: 10,
                lineThickness: 0,
                //interval: parseInt(max / 5)
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 12,
                fontColor: '#000',
                fontFamily: "AsembiaFont"
            },
            data: chartData
        });

        qasrChart.render();

        $('.canvasjs-chart-credit').hide();
    },

    renderVolumePercentOfCleanPathVSIndirectPath: function (data) {
        if (!data || data.length == 0) {
            new CanvasJS.Chart("vcpip-column-chart").render();
            $('.canvasjs-chart-credit').hide();
            return;
        }
        var chartData = [];
        var max = 0;
        $.each(data, function (index, item) {
            var dataPoints = [];
            $.each(item.DataPoints, function (ind, itm) {
                dataPoints.push({
                    y: itm.Y,
                    label: itm.Label,
                    indexLabel: itm.IndexLabel,
                    x: (ind + 1),
                    legendText: 'Volume: ' + itm.Y + '<br/>Percentage:' + itm.IndexLabel + '<br/>Period: ' + itm.Label
                });
                max = itm.Y > max ? itm.Y : max;
            });
            chartData.push({
                type: item.Type,
                color: colorSchema.brandColors[index],
                showInLegend: true,
                legendText: item.LegendText,
                dataPoints: dataPoints,
                toolTipContent: "{legendText}",
                indexLabelFontColor: "#000",
                indexLabelFontFamily: "AsembiaFont",
                indexLabelFontSize: 10,
            });
        });

        var qasrChart = new CanvasJS.Chart("vcpip-column-chart",
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
                labelFontColor: '#282828'
            },
            axisY: {
                title: 'Volume',
                includeZero: true,
                gridThickness: 1,
                tickThickness: 0,
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                labelFontSize: 10,
                lineThickness: 0,
                //interval: parseInt(max / 5)
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 12,
                fontColor: '#000',
                fontFamily: "AsembiaFont"
            },
            data: chartData
        });

        qasrChart.render();

        $('.canvasjs-chart-credit').hide();
    },

    renderConsignmentStackedColumnChart: function (data) {
        if (!data || data.length == 0) {
            new CanvasJS.Chart('consignment-stacked-column-chart').render();
            $('.canvasjs-chart-credit').hide();
            return;
        }

        //if (utility.chechDataAvailibility('consignment-stacked-no-data', 'consignment-stacked-column-chart', 'title', data)) {
        var dataPlots1 = [], dataPlots2 = [];
        var max = 0;
        $.each(data, function (index, item) {
            dataPlots1.push({
                y: item.Consignment,
                label: item.DateStr,
                x: (index + 1),
                startDate: item.StartDate,
                endDate: item.EndDate,
                isConsignment: 'Yes',
                legendText: 'Consignment: ' + item.Consignment + '<br\>Date: ' + item.DateStr + '<br\>'
            });
            dataPlots2.push({
                y: item.NoConsignment,
                label: item.DateStr,
                x: (index + 1),
                startDate: item.StartDate,
                endDate: item.EndDate,
                isConsignment: 'No',
                legendText: 'Traditional: ' + item.NoConsignment + '<br\>Date: ' + item.DateStr + '<br\>'
            });
            max = parseInt(item.Consignment + item.NoConsignment) > max ? parseInt(item.Consignment + item.NoConsignment) : max;
        });
        var consignmentStackedColumn = new CanvasJS.Chart("consignment-stacked-column-chart",
        {
            title: {
                text: '',
                verticalAlign: 'bottom',
                horizontalAlign: 'left',
                fontColor: "#2b91d5",
                fontSize: 14,
                fontFamily: "AsembiaFont"
            },
            animationEnabled: true,
            axisY: {
                title: "",
                titleFontSize: 12,
                titleFontFamily: "AsembiaFont",
                labelFontColor: '#282828',
                interval: max <= 3 ? 1 : parseInt(max / 3)
            },
            axisX: {
                title: "",
                titleFontSize: 14,
                titleFontFamily: "AsembiaFont",
                //labelAngle: 315,
                labelFontColor: '#282828',
                interval: data.length > 20 ? parseInt(data.length / 20) : 1
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 11,
                fontColor: '#000',
                fontFamily: "AsembiaFont"
            },
            theme: "theme2",
            data: [
                {
                    type: "stackedColumn",
                    color: '#29abe2',
                    showInLegend: true,
                    toolTipContent: "{legendText}",
                    legendText: 'Consignment',
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&from=' +
                            e.dataPoint.startDate + '&to=' + e.dataPoint.endDate + '&measureId=10' + '&excludeNonWorkDays=' +
                            ($('#bg-consignment button.btn-selected').attr('data-date') === 'daily') + '&consignment=' + e.dataPoint.isConsignment +
                            '&rowCount=' + e.dataPoint.y + '&reportName=Consignment–Traditional', '_blank');
                    }
                },
                {
                    type: "stackedColumn",
                    color: '#0071bc',
                    showInLegend: true,
                    toolTipContent: "{legendText}",
                    legendText: 'Traditional',
                    dataPoints: dataPlots2,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&from=' +
                            e.dataPoint.startDate + '&to=' + e.dataPoint.endDate + '&measureId=10' + '&excludeNonWorkDays=' +
                            ($('#bg-consignment button.btn-selected').attr('data-date') === 'daily') + '&consignment=' + e.dataPoint.isConsignment +
                            '&rowCount=' + e.dataPoint.y + '&reportName=Consignment–Traditional', '_blank');
                    }
                },
                {
                    type: "stackedColumn",
                    color: '#00d075',
                    showInLegend: true,
                    legendText: 'Traditional percent',
                    dataPoints: []
                }
            ]
        });

        consignmentStackedColumn.render();
        $('.canvasjs-chart-credit').hide();
        //}
    },

    renderConsignmentStackedColumnDetailsChart: function (data) {
        if (!data || data.length == 0) {
            new CanvasJS.Chart('consignment-stacked-column-chart-d').render();
            $('.canvasjs-chart-credit').hide();
            return;
        }

        //if (utility.chechDataAvailibility('consignment-stacked-no-data', 'consignment-stacked-column-chart', 'title', data)) {
        var dataPlots1 = [], dataPlots2 = [];
        var max = 0;
        $.each(data, function (index, item) {
            dataPlots1.push({
                y: item.Consignment,
                label: item.DateStr,
                x: (index + 1),
                startDate: item.StartDate,
                endDate: item.EndDate,
                isConsignment: true,
                legendText: 'Consignment: ' + item.Consignment + '<br\>Date: ' + item.DateStr + '<br\>'
            });
            dataPlots2.push({
                y: item.NoConsignment,
                label: item.DateStr,
                x: (index + 1),
                startDate: item.StartDate,
                endDate: item.EndDate,
                isConsignment: false,
                legendText: 'Traditional: ' + item.NoConsignment + '<br\>Date: ' + item.DateStr + '<br\>'
            });
            max = parseInt(item.Consignment + item.NoConsignment) > max ? parseInt(item.Consignment + item.NoConsignment) : max;
        });
        var consignmentStackedColumn = new CanvasJS.Chart("consignment-stacked-column-chart-d",
        {
            title: {
                text: '',
                verticalAlign: 'bottom',
                horizontalAlign: 'left',
                fontColor: "#2b91d5",
                fontSize: 14,
                fontFamily: "AsembiaFont"
            },
            animationEnabled: true,
            axisY: {
                title: "",
                titleFontSize: 12,
                titleFontFamily: "AsembiaFont",
                labelFontColor: '#282828',
                interval: max <= 3 ? 1 : parseInt(max / 3)
            },
            axisX: {
                title: "",
                titleFontSize: 14,
                titleFontFamily: "AsembiaFont",
                //labelAngle: 315,
                labelFontColor: '#282828',
                interval: data.length > 20 ? parseInt(data.length / 20) : 1
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 11,
                fontColor: '#000',
                fontFamily: "AsembiaFont"
            },
            theme: "theme2",
            data: [
                {
                    type: "stackedColumn",
                    color: '#29abe2',
                    showInLegend: true,
                    toolTipContent: "{legendText}",
                    legendText: 'Consignment',
                    dataPoints: dataPlots1,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&from=' +
                            e.dataPoint.startDate + '&to=' + e.dataPoint.endDate + '&measureId=10' + '&excludeNonWorkDays=' +
                            ($('#bg-consignment-d button.btn-selected').attr('data-date') === 'daily') + '&consignment=' + e.dataPoint.isConsignment +
                            '&rowCount=' + e.dataPoint.y + '&reportName=Consignment–Traditional', '_blank');
                    }
                },
                {
                    type: "stackedColumn",
                    color: '#0071bc',
                    showInLegend: true,
                    toolTipContent: "{legendText}",
                    legendText: 'Traditional',
                    dataPoints: dataPlots2,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&from=' +
                            e.dataPoint.startDate + '&to=' + e.dataPoint.endDate + '&measureId=10' + '&excludeNonWorkDays=' +
                            ($('#bg-consignment-d button.btn-selected').attr('data-date') === 'daily') + '&consignment=' + e.dataPoint.isConsignment +
                            '&rowCount=' + e.dataPoint.y + '&reportName=Consignment–Traditional', '_blank');
                    }
                },
                {
                    type: "stackedColumn",
                    color: '#00d075',
                    showInLegend: true,
                    legendText: 'Traditional percent',
                    dataPoints: []
                }
            ]
        });

        consignmentStackedColumn.render();
        $('.canvasjs-chart-credit').hide();
        //}
    },

    renderConsignmentRollingLineChart: function (data) {
        if (!data || data.length === 0) {
            new CanvasJS.Chart('consignment-rolling-line-chart').render();
            $('.canvasjs-chart-credit').hide();
            return;
        }
        var dataPlots = [];
        var max = 0;
        $.each(data, function (index, item) {
            dataPlots.push({
                y: parseInt(item.ConsignmentPercent),
                label: item.DateStr,
                legendText: 'Traditional Percent: ' + item.ConsignmentPercent + ' %<br/>Date: ' + item.DateStr
            });
            max = item.ConsignmentPercent > max ? item.ConsignmentPercent : max;
        });

        var consignmentRollingLineChart = new CanvasJS.Chart("consignment-rolling-line-chart",
        {
            theme: "theme3",
            title: {
                text: ""
            },
            animationEnabled: true,
            axisX: {
                interval: 1,
                tickThickness: 0,
                lineColor: "#FFF",
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                labelFormatter: function (e) {
                    return '';
                }
            },
            axisY: {
                includeZero: true,
                gridThickness: 0,
                tickThickness: 0,
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                labelFontSize: 10,
                lineThickness: 1,
                minimum: -10,
                maximum: 100,
                labelFormatter: function (e) {
                    return e.value + '%';
                }
            },
            legend: {
                fontFamily: "AsembiaFont"
            },
            data: [
                {
                    type: "line",
                    color: '#00d075',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12
                }
            ]
        });

        consignmentRollingLineChart.render();

        $('.canvasjs-chart-credit').hide();
    },

    renderConsignmentRollingLineDetailsChart: function (data) {
        if (!data || data.length === 0) {
            new CanvasJS.Chart('consignment-rolling-line-chart-d').render();
            $('.canvasjs-chart-credit').hide();
            return;
        }
        var dataPlots = [];
        $.each(data, function (index, item) {
            dataPlots.push({
                y: parseInt(item.ConsignmentPercent),
                label: item.DateStr,
                legendText: 'Traditional Percent: ' + item.ConsignmentPercent + ' %<br/>Date: ' + item.DateStr
            });

        });

        var consignmentRollingLineChart = new CanvasJS.Chart("consignment-rolling-line-chart-d",
        {
            theme: "theme3",
            title: {
                text: ""
            },
            animationEnabled: true,
            axisX: {
                interval: 1,
                tickThickness: 0,
                lineColor: "#FFF",
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                labelFormatter: function (e) {
                    return '';
                }
            },
            axisY: {
                includeZero: true,
                gridThickness: 0,
                tickThickness: 0,
                titleFontColor: '#282828',
                labelFontColor: '#282828',
                labelFontSize: 10,
                lineThickness: 1,
                minimum: -10,
                maximum: 100,
                labelFormatter: function (e) {
                    return e.value + '%';
                }
            },
            legend: {
                fontFamily: "AsembiaFont"
            },
            data: [
                {
                    type: "line",
                    color: '#00d075',
                    showInLegend: false,
                    toolTipContent: "{legendText}",
                    dataPoints: dataPlots,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12
                }
            ]
        });

        consignmentRollingLineChart.render();

        $('.canvasjs-chart-credit').hide();
    },

    getSurveyMonkeyColor: function (index, title) {
        //var colors = ['#ff0000', '#ffff00', '#32CD32', '#006400', '#388e8e', '#555555'];
        var colors = ['#29abe2', '#0071bc', '#00d075', '#009245', '#ed1e79', '#93278f', '#f15a24', '#f7931e', '#545575', '#dddde3', '#2a2b3e', '#0099ff'];
        if (title.toLowerCase().indexOf('= not compliant') > -1)
            return '#29abe2';
        if (title.toLowerCase().indexOf('= compliant') > -1)
            return '#00d075';
        if (title.indexOf('1 =') > -1)
            return '#29abe2';
        if (title.indexOf('2 =') > -1)
            return '#0071bc';
        if (title.indexOf('3 =') > -1)
            return '#00d075';
        if (title.indexOf('4 =') > -1)
            return '#009245';
        if (title.indexOf('5 =') > -1)
            return '#ed1e79';
        if (title.indexOf('6 =') > -1)
            return '#93278f';
        return colors[index];
    },

    getSurveyMonkeyYMax: function (type) {
        if (type.toLowerCase() === 'compliance')
            return 4;
        return 4;
    },

    getTime: function (sec) {
        var hours = parseInt(sec / 3600);
        var rem = sec % 3600;
        var minutes = parseInt(rem / 60);
        var seconds = rem % 60;
        return (hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + parseInt(seconds) : parseInt(seconds));
    },
};