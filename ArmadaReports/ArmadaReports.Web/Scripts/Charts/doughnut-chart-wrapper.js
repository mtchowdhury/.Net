var doughnutChartWrapper = {
    renderBottomRightChart: function (data) {
        $('#br-chart-title').html($('#bg-br button.btn-selected').text() + ' ' + data.DateString);
        if (!data) return;

        if (utility.chechDataAvailibility('bottom-right-no-data', 'bottom-right-doughnut-chart', 'br-chart-title', data.Tubes)) {
            var dataPlots = [];
            var total = 0;
            $.each(data.Tubes, function (index, item) {
                dataPlots.push({
                    y: item.TubeQtyCount, label: item.TubeQty + ' tubes ', labelVal: item.TubeQty,
                    legendText: item.TubeQty + ' Tube(s)<br\>Tubes Filled: ' + numeral(item.TubeQtyCount).format('0,0') + ' of ' + numeral(data.TotalCount).format('0,0') +
                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + ((item.TubeQtyCount / data.TotalCount) * 100).toFixed(2) + '%' +
                        '<br\>' + $('#bg-br button.btn-selected').text() + ' ' + data.DateString + '<br\>Program: ' + $('#program option:selected').text(),
                    color: colorSchema.brandColors[index]
                });
                total += item.TubeQtyCount;
            });
            var brDoughnut = new CanvasJS.Chart("bottom-right-doughnut-chart",
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
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    startAngle: 20,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    dataPoints: dataPlots,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                            $('#bg-br button.btn-selected').attr('data-date') + '&regranexTubeQty=' + e.dataPoint.labelVal +
                            '&rowCount=' + e.dataPoint.y + '&reportName=TubesFilled', '_blank');
                    }
                }
                ]
            });
            brDoughnut.render();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' + $('#bg-br button.btn-selected').attr('data-date') + '&rowCount=' + total + '&reportName=TubesFilled';
            $('#br-chart-title').html('<a href="' + url + '" target="_blank">' + service.getDateText('bg-br') + ' ' + data.DateString + '</a>');
            $('.canvasjs-chart-credit').hide();
        }        
    },

    renderBottomRightDetailsChart: function (data) {
        $('#br-d-chart-title').html($('#bg-br button.btn-selected').text() + ' ' + data.DateString);
        if (!data) return;

        if (utility.chechDataAvailibility('bottom-right-no-data-d', 'bottom-right-doughnut-chart-details', 'br-d-chart-title', data.Tubes)) {
            var dataPlots = [];
            var total = 0;
            $.each(data.Tubes, function (index, item) {
                dataPlots.push({
                    y: item.TubeQtyCount, label: item.TubeQty + ' tubes ', labelVal: item.TubeQty,
                    legendText: item.TubeQty + ' Tube(s)<br\>Tubes Filled: ' + numeral(item.TubeQtyCount).format('0,0') + ' of ' + numeral(data.TotalCount).format('0,0') +
                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + ((item.TubeQtyCount / data.TotalCount) * 100).toFixed(2) + '%' +
                        '<br\>' + $('#bg-br-d button.btn-selected').text() + ' ' + data.DateString + '<br\>Program: ' + $('#program option:selected').text()
                });
                total += item.TubeQtyCount;
            });
            var brdDoughnut = new CanvasJS.Chart("bottom-right-doughnut-chart-details",
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
                    fontFamily: "AsembiaFont"
                },
                data: [
                {
                    type: "doughnut",
                    startAngle: 20,
                    toolTipContent: "{legendText}",
                    indexLabel: "{label}",
                    dataPoints: dataPlots,
                    indexLabelFontColor: "#000",
                    indexLabelFontFamily: "AsembiaFont",
                    indexLabelFontSize: 12,
                    click: function (e) {
                        window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                            $('#bg-br-d button.btn-selected').attr('data-date') + '&regranexTubeQty=' + e.dataPoint.labelVal +
                            '&rowCount=' + e.dataPoint.y + '&reportName=TubesFilled', '_blank');
                    }
                }
                ]
            });
            brdDoughnut.render();
            var url = service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' + $('#bg-br-d button.btn-selected').attr('data-date') + '&rowCount=' + total + '&reportName=TubesFilled';
            $('#br-d-chart-title').html('<a href="' + url + '" target="_blank">' + service.getDateText('bg-br-d') + ' ' + data.DateString + '</a>');
            $('.canvasjs-chart-credit').hide();
        }        
    }
};