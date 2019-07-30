var epipenPieWrapper = {
    renderProductMixChart: function (data) {
        $('#product-mix-chart-title').html($('#product-mix-bg button.btn-selected').text() + '  - 0 Units');
        if (!data) return;

        if (utility.chechDataAvailibility('product-mix-no-data', 'product-mix-chart', 'product-mix-chart-title', data[0].TotalSelectedState)) {
            var dataPlots = [];
            dataPlots.push({
                y: data[0].RegFreePrcnt, label: 'Reg Free', color: colorSchema.brandColors[0],
                legendText: 'Product: Reg Free<br\>Qty: ' + numeral(data[0].RegFree).format('0,0') + '<br\>' + $('#product-mix-bg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].ReqReplPrcnt, label: 'Req Repl', color: colorSchema.brandColors[1],
                legendText: 'Product: Req Repl<br\>Qty: ' + numeral(data[0].ReqRepl).format('0,0') + '<br\>' + $('#product-mix-bg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].ReqDiscPrcnt, label: 'Req Disc', color: colorSchema.brandColors[2],
                legendText: 'Product: Req Disc<br\>Qty: ' + numeral(data[0].ReqDisc).format('0,0') + '<br\>' + $('#product-mix-bg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].OtherFreePrcnt, label: 'Other Free', color: colorSchema.brandColors[3],
                legendText: 'Product: Other Free<br\>Qty: ' + numeral(data[0].OtherFree).format('0,0') + '<br\>' + $('#product-mix-bg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].JrFreePrcnt, label: 'Jr Free', color: colorSchema.brandColors[4],
                legendText: 'Product: Jr Free<br\>Qty: ' + numeral(data[0].JrFree).format('0,0') + '<br\>' + $('#product-mix-bg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].JrReplPrcnt, label: 'Jr Repl', color: colorSchema.brandColors[5],
                legendText: 'Product: Jr Repl<br\>Qty: ' + numeral(data[0].JrRepl).format('0,0') + '<br\>' + $('#product-mix-bg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].JrDiscPrcnt, label: 'Jr Disc', color: colorSchema.brandColors[6],
                legendText: 'Product: Jr Disc<br\>Qty: ' + numeral(data[0].JrDisc).format('0,0') + '<br\>' + $('#product-mix-bg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].BoxPrcnt, label: 'Box', color: colorSchema.brandColors[7],
                legendText: 'Product: Box<br\>Qty: ' + numeral(data[0].Box).format('0,0') + '<br\>' + $('#product-mix-bg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].VideosPrcnt, label: 'Videos', color: colorSchema.brandColors[8],
                legendText: 'Product: Videos<br\>Qty: ' + numeral(data[0].Videos).format('0,0') + '<br\>' + $('#product-mix-bg button.btn-selected').text() + ' ' + data[0].DateString
            });
            var productMixPie = new CanvasJS.Chart("product-mix-chart",
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
                        //window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' + $('#bg-tm button.btn-selected').attr('data-date') + '&programStatus=' + e.dataPoint.label, '_blank');
                    }
                }
                ]
            });
            productMixPie.render();
            var url = service.getRootUrl() + '/EpipenDetails/EpipenOrderDetails?dateType=' + $('#product-mix-bg button.btn-selected').attr('data-date') + '&begDate=na&endDate=na&orderBegDate=' + data[0].OrderDateBeg + '&orderEndDate=' + data[0].OrderDateEnd +
                '&inpCustomerCategory=' + $('#product-mix-inpCustomerCategory').val() + '&disneySchoolId=All&state=All&schoolZip=All&schoolId=All&schoolName=All&orderId=-1&batchId=-1&inpPharmacy=All&inpDoctor=All&inpContactName=All&inpSearchOrderId=All&releaseDate=ReleaseDate';
            $('#product-mix-chart-title').html('<a href="' + url + '" target="_blank">' + $('#product-mix-bg button.btn-selected').text() + ' ' + data[0].DateString + " - " + numeral(data[0].TotalUnits).format('0,0') + ' Units</a>');
            $('.canvasjs-chart-credit').hide();
        }
    },

    renderLgProductMixChart: function (data) {
        $('#product-mix-lg-chart-title').html($('#product-mix-bg-lg button.btn-selected').text() + '  - 0 Units');
        if (!data) return;

        if (utility.chechDataAvailibility('product-mix-no-data-d', 'product-mix-lg-chart', 'product-mix-lg-chart-title', data[0].TotalSelectedState)) {
            var dataPlots = [];
            dataPlots.push({
                y: data[0].RegFreePrcnt, label: 'Reg Free', color: colorSchema.brandColors[0],
                legendText: 'Product: Reg Free<br\>Qty: ' + numeral(data[0].RegFree).format('0,0') + '<br\>' + $('#product-mix-bg-lg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].ReqReplPrcnt, label: 'Req Repl', color: colorSchema.brandColors[1],
                legendText: 'Product: Req Repl<br\>Qty: ' + numeral(data[0].ReqRepl).format('0,0') + '<br\>' + $('#product-mix-bg-lg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].ReqDiscPrcnt, label: 'Req Disc', color: colorSchema.brandColors[2],
                legendText: 'Product: Req Disc<br\>Qty: ' + numeral(data[0].ReqDisc).format('0,0') + '<br\>' + $('#product-mix-bg-lg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].OtherFreePrcnt, label: 'Other Free', color: colorSchema.brandColors[3],
                legendText: 'Product: Other Free<br\>Qty: ' + numeral(data[0].OtherFree).format('0,0') + '<br\>' + $('#product-mix-bg-lg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].JrFreePrcnt, label: 'Jr Free', color: colorSchema.brandColors[4],
                legendText: 'Product: Jr Free<br\>Qty: ' + numeral(data[0].JrFree).format('0,0') + '<br\>' + $('#product-mix-bg-lg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].JrReplPrcnt, label: 'Jr Repl', color: colorSchema.brandColors[5],
                legendText: 'Product: Jr Repl<br\>Qty: ' + numeral(data[0].JrRepl).format('0,0') + '<br\>' + $('#product-mix-bg-lg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].JrDiscPrcnt, label: 'Jr Disc', color: colorSchema.brandColors[6],
                legendText: 'Product: Jr Disc<br\>Qty: ' + numeral(data[0].JrDisc).format('0,0') + '<br\>' + $('#product-mix-bg-lg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].BoxPrcnt, label: 'Box', color: colorSchema.brandColors[7],
                legendText: 'Product: Box<br\>Qty: ' + numeral(data[0].Box).format('0,0') + '<br\>' + $('#product-mix-bg-lg button.btn-selected').text() + ' ' + data[0].DateString
            });
            dataPlots.push({
                y: data[0].VideosPrcnt, label: 'Videos', color: colorSchema.brandColors[8],
                legendText: 'Product: Videos<br\>Qty: ' + numeral(data[0].Videos).format('0,0') + '<br\>' + $('#product-mix-bg-lg button.btn-selected').text() + ' ' + data[0].DateString
            });
            var productMixLgPie = new CanvasJS.Chart("product-mix-lg-chart",
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
                        //window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' + $('#bg-tm button.btn-selected').attr('data-date') + '&programStatus=' + e.dataPoint.label, '_blank');
                    }
                }
                ]
            });
            productMixLgPie.render();
            var url = service.getRootUrl() + '/EpipenDetails/EpipenOrderDetails?dateType=' + $('#product-mix-bg-lg button.btn-selected').attr('data-date') + '&begDate=na&endDate=na&orderBegDate=' + data[0].OrderDateBeg + '&orderEndDate=' + data[0].OrderDateEnd +
                '&inpCustomerCategory=' + $('#product-mix-lg-inpCustomerCategory').val() + '&disneySchoolId=All&state=All&schoolZip=All&schoolId=All&schoolName=All&orderId=-1&batchId=-1&inpPharmacy=All&inpDoctor=All&inpContactName=All&inpSearchOrderId=All&releaseDate=ReleaseDate';
            $('#product-mix-lg-chart-title').html('<a href="' + url + '" target="_blank">' + $('#product-mix-bg-lg button.btn-selected').text() + ' ' + data[0].DateString + " - " + numeral(data[0].TotalUnits).format('0,0') + ' Units</a>');
            $('.canvasjs-chart-credit').hide();
        }
    },
};