var epipenMapWrapper = {
    map: null,
    statesData: {},
    detailsStatesData: {},
    statesLgData: {},
    detailsStatesLgData: {},
    renderOrderMap: function (data) {
        $('#order-usmap').empty();
        if (!data) return;
        if (data.length > 0) {
            $('#order-map-begin-date').val(data[0].DdlBegDate);
            $('#order-map-end-date').val(data[0].DdlEndDate);
            $('#order-map-lg-begin-date').val(data[0].DdlBegDate);
            $('#order-map-lg-end-date').val(data[0].DdlEndDate);
        }
        var states = {};
        epipenMapWrapper.statesData = {};
        var total = 0;
        $.each(data, function (index, item) {
            if (item.State) {
                states[item.State.toLowerCase()] = item.Color;
                epipenMapWrapper.statesData[item.State.toLowerCase()] = isNaN(item.TotalUnits) ? 0 : parseInt(item.TotalUnits);
            }
            total += (isNaN(item.TotalUnits) ? 0 : parseInt(item.TotalUnits));
        });
        $('#order-usmap').vectorMap({
            map: 'usa_en',
            backgroundColor: null,
            color: '#E6ECF1',
            borderColor: '#000',
            borderOpacity: 0.80,
            borderWidth: 1,
            enableZoom: true,
            showTooltip: true,
            selectedColor: null,
            hoverColor: null,
            colors: states,
            onRegionClick: function (event, code, region) {
                var url = '/EpipenDetails/EpipenOrderDetails?dateType=na' + '&begDate=' + $('#order-map-begin-date').val() + '&endDate=' + $('#order-map-end-date').val() + '&orderBegDate=na&orderEndDate=na' +
                '&inpCustomerCategory=' + $('#order-map-inpCustomerCategory').val() + '&disneySchoolId=All&state=' + code.toUpperCase() +
                '&schoolZip=All&schoolId=All&schoolName=All&orderId=-1&batchId=-1&inpPharmacy=All&inpDoctor=All&inpContactName=All&inpSearchOrderId=All&releaseDate=';
                window.open(service.getRootUrl() + url, '_blank');
                event.preventDefault();
            },
            onLabelShow: function (event, label, code) {
                if (epipenMapWrapper.statesData[code])
                    label.html('<div class="map-tooltip">' + numeral(epipenMapWrapper.statesData[code]).format('0,0') + ' units in ' + code.toUpperCase() + '</div>');
                else
                    label.html('<div class="map-tooltip">' + code.toUpperCase() + '</div>');
            }
        });

        if (data.length > 0) {
            var limit1 = data[0].R1LLimit + ' - ' + data[0].R1ULimit;
            var limit2 = data[0].R2LLimit + ' - ' + data[0].R2ULimit;
            var limit3 = data[0].R3LLimit + ' - ' + data[0].R3ULimit;
            var limit4 = data[0].R4LLimit + ' - ' + data[0].R4ULimit;
            var limit5 = data[0].R5LLimit + ' - ' + data[0].R5ULimit;
            var limit6 = data[0].R6LLimit + ' and above';
            $('#order-mr-tr-limit-1').show();
            $('#order-mr-limit-1').text(limit1);

            if (limit1 === limit2) {
                $('#order-mr-tr-limit-2').hide();
            } else {
                $('#order-mr-tr-limit-2').show();
                $('#order-mr-limit-2').text(limit2);
            }

            if (limit2 === limit3) {
                $('#order-mr-tr-limit-3').hide();
            } else {
                $('#order-mr-tr-limit-3').show();
                $('#order-mr-limit-3').text(limit3);
            }

            if (limit3 === limit4) {
                $('#order-mr-tr-limit-4').hide();
            } else {
                $('#order-mr-tr-limit-4').show();
                $('#order-mr-limit-4').text(limit4);
            }

            if (limit4 === limit5) {
                $('#order-mr-tr-limit-5').hide();
            } else {
                $('#order-mr-tr-limit-5').show();
                $('#order-mr-limit-5').text(limit5);
            }

            if (limit5 === limit6) {
                $('#order-mr-tr-limit-6').hide();
            } else {
                $('#order-mr-tr-limit-6').show();
                $('#order-mr-limit-6').text(limit6);
            }
        } else {
            $('#order-mr-tr-limit-1').show();
            $('#order-mr-limit-1').text('0 - 0');
            $('#order-mr-tr-limit-2').hide();
            $('#order-mr-tr-limit-3').hide();
            $('#order-mr-tr-limit-4').hide();
            $('#order-mr-tr-limit-5').hide();
            $('#order-mr-tr-limit-6').hide();
        }
        var allUrl = '/EpipenDetails/EpipenOrderDetails?dateType=na' + '&begDate=' + $('#order-map-begin-date').val() + '&endDate=' + $('#order-map-end-date').val() + '&orderBegDate=na&orderEndDate=na' +
                '&inpCustomerCategory=' + $('#order-map-inpCustomerCategory').val() + '&disneySchoolId=All&state=All' +
                '&schoolZip=All&schoolId=All&schoolName=All&orderId=-1&batchId=-1&inpPharmacy=All&inpDoctor=All&inpContactName=All&inpSearchOrderId=All&releaseDate=';
        $('#order-usmap-title').html('<a href="' + service.getRootUrl() + allUrl + '" target="_blank">' + $('#order-map-bg button.btn-selected').text() + ' - ' + numeral(total).format('0,0') + ' Units</a>');
    },

    renderLgOrderMap: function (data) {
        $('#order-lg-usmap').empty();
        if (!data) return;
        if (data.length > 0) {
            $('#order-map-lg-begin-date').val(data[0].DdlBegDate);
            $('#order-map-lg-end-date').val(data[0].DdlEndDate);
        }
        var states = {};
        epipenMapWrapper.statesLgData = {};
        var total = 0;
        $.each(data, function (index, item) {
            if (item.State) {
                states[item.State.toLowerCase()] = item.Color;
                epipenMapWrapper.statesLgData[item.State.toLowerCase()] = isNaN(item.TotalUnits) ? 0 : parseInt(item.TotalUnits);
            }
            total += (isNaN(item.TotalUnits) ? 0 : parseInt(item.TotalUnits));
        });
        $('#order-lg-usmap').vectorMap({
            map: 'usa_en',
            backgroundColor: null,
            color: '#E6ECF1',
            borderColor: '#000',
            borderOpacity: 0.80,
            borderWidth: 1,
            enableZoom: true,
            showTooltip: true,
            selectedColor: null,
            hoverColor: null,
            colors: states,
            onRegionClick: function (event, code, region) {
                var url = '/EpipenDetails/EpipenOrderDetails?dateType=na' + '&begDate=' + $('#order-map-lg-begin-date').val() + '&endDate=' + $('#order-map-lg-end-date').val() + '&orderBegDate=na&orderEndDate=na' +
                '&inpCustomerCategory=' + $('#order-map-lg-inpCustomerCategory').val() + '&disneySchoolId=All&state=' + code.toUpperCase() +
                '&schoolZip=All&schoolId=All&schoolName=All&orderId=-1&batchId=-1&inpPharmacy=All&inpDoctor=All&inpContactName=All&inpSearchOrderId=All&releaseDate=';
                window.open(service.getRootUrl() + url, '_blank');
                event.preventDefault();
            },
            onLabelShow: function (event, label, code) {
                if (epipenMapWrapper.statesData[code])
                    label.html('<div class="map-tooltip">' + numeral(epipenMapWrapper.statesLgData[code]).format('0,0') + ' units in ' + code.toUpperCase() + '</div>');
                else
                    label.html('<div class="map-tooltip">' + code.toUpperCase() + '</div>');
            }
        });
        
        if (data.length > 0) {
            var limit1 = data[0].R1LLimit + ' - ' + data[0].R1ULimit;
            var limit2 = data[0].R2LLimit + ' - ' + data[0].R2ULimit;
            var limit3 = data[0].R3LLimit + ' - ' + data[0].R3ULimit;
            var limit4 = data[0].R4LLimit + ' - ' + data[0].R4ULimit;
            var limit5 = data[0].R5LLimit + ' - ' + data[0].R5ULimit;
            var limit6 = data[0].R6LLimit + ' and above';
            $('#order-lg-mr-tr-limit-1').show();
            $('#order-lg-mr-limit-1').text(limit1);

            if (limit1 === limit2) {
                $('#order-lg-mr-tr-limit-2').hide();
            } else {
                $('#order-lg-mr-tr-limit-2').show();
                $('#order-lg-mr-limit-2').text(limit2);
            }

            if (limit2 === limit3) {
                $('#order-lg-mr-tr-limit-3').hide();
            } else {
                $('#order-lg-mr-tr-limit-3').show();
                $('#order-lg-mr-limit-3').text(limit3);
            }

            if (limit3 === limit4) {
                $('#order-lg-mr-tr-limit-4').hide();
            } else {
                $('#order-lg-mr-tr-limit-4').show();
                $('#order-lg-mr-limit-4').text(limit4);
            }

            if (limit4 === limit5) {
                $('#order-lg-mr-tr-limit-5').hide();
            } else {
                $('#order-lg-mr-tr-limit-5').show();
                $('#order-lg-mr-limit-5').text(limit5);
            }

            if (limit5 === limit6) {
                $('#order-lg-mr-tr-limit-6').hide();
            } else {
                $('#order-lg-mr-tr-limit-6').show();
                $('#order-lg-mr-limit-6').text(limit6);
            }
        } else {
            $('#order-lg-mr-tr-limit-1').show();
            $('#order-lg-mr-limit-1').text('0 - 0');
            $('#order-lg-mr-tr-limit-2').hide();
            $('#order-lg-mr-tr-limit-3').hide();
            $('#order-lg-mr-tr-limit-4').hide();
            $('#order-lg-mr-tr-limit-5').hide();
            $('#order-lg-mr-tr-limit-6').hide();
        }
        var allUrl = '/EpipenDetails/EpipenOrderDetails?dateType=na' + '&begDate=' + $('#order-map-lg-begin-date').val() + '&endDate=' + $('#order-map-lg-end-date').val() + '&orderBegDate=na&orderEndDate=na' +
                '&inpCustomerCategory=' + $('#order-map-lg-inpCustomerCategory').val() + '&disneySchoolId=All&state=All' +
                '&schoolZip=All&schoolId=All&schoolName=All&orderId=-1&batchId=-1&inpPharmacy=All&inpDoctor=All&inpContactName=All&inpSearchOrderId=All&releaseDate=';
        $('#order-lg-usmap-title').html('<a href="' + service.getRootUrl() + allUrl + '" target="_blank">' + $('#order-map-bg-lg button.btn-selected').text() + ' - ' + numeral(total).format('0,0') + ' Units</a>');
    },
};