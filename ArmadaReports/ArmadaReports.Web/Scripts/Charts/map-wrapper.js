var mapWrapper = {
    map: null,
    statesData: {},
    detailsStatesData: {},
    br5StatesData: {},
    br5DetailsStatesData: {},
    render: function (data) {
        $('#usmap').empty();
        if (!data) return;
        var states = {};
        mapWrapper.statesData = {};
        var total = 0;
        $.each(data, function (index, item) {
            if(item.State){
                states[item.State.toLowerCase()] = item.Color;
                mapWrapper.statesData[item.State.toLowerCase()] = isNaN(item.TotalCount) ? 0 : parseInt(item.TotalCount);
            }
            total += (isNaN(item.TotalCount) ? 0 : parseInt(item.TotalCount));
        });
        $('#usmap').vectorMap({
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
                window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                    $('#bg-mr button.btn-selected').attr('data-date') + '&state=' + code + '&rowCount=' + mapWrapper.statesData[code]
                     + '&reportName=ReferralByPhysicianState', '_blank');
                event.preventDefault();
            },
            onLabelShow: function (event, label, code) {
                if (mapWrapper.statesData[code])
                    label.html('<div class="map-tooltip">' + mapWrapper.statesData[code] + ' referrals in ' + code.toUpperCase() + '</div>');
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

            $('#mr-tr-limit-1 td div').removeClass('bg0');
            $('#mr-tr-limit-1 td div').addClass('bg1-5');

            $('#mr-tr-limit-1').show();
            $('#mr-limit-1').text(limit1);

            if (limit1 === limit2) {
                $('#mr-tr-limit-2').hide();
            } else {
                $('#mr-tr-limit-2').show();
                $('#mr-limit-2').text(limit2);
            }

            if (limit2 === limit3) {
                $('#mr-tr-limit-3').hide();
            } else {
                $('#mr-tr-limit-3').show();
                $('#mr-limit-3').text(limit3);
            }

            if (limit3 === limit4) {
                $('#mr-tr-limit-4').hide();
            } else {
                $('#mr-tr-limit-4').show();
                $('#mr-limit-4').text(limit4);
            }

            if (limit4 === limit5) {
                $('#mr-tr-limit-5').hide();
            } else {
                $('#mr-tr-limit-5').show();
                $('#mr-limit-5').text(limit5);
            }

            if (limit5 === limit6) {
                $('#mr-tr-limit-6').hide();
            } else {
                $('#mr-tr-limit-6').show();
                $('#mr-limit-6').text(limit6);
            }
        } else {
            $('#mr-tr-limit-1').show();
            $('#mr-tr-limit-1 td div').removeClass('bg1-5');
            $('#mr-tr-limit-1 td div').addClass('bg0');
            $('#mr-limit-1').text('0 - 0');
            $('#mr-tr-limit-2').hide();
            $('#mr-tr-limit-3').hide();
            $('#mr-tr-limit-4').hide();
            $('#mr-tr-limit-5').hide();
            $('#mr-tr-limit-6').hide();
        }
        $('#mr-map-title').html('<a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
            $('#bg-mr button.btn-selected').attr('data-date') + '&rowCount=' + total + '&reportName=ReferralByPhysicianState' +
            '" target="_blank">' + service.getDateText('bg-mr') + ' - ' + total + ' Referrals</a>');
    },

    renderDetails: function (data) {
        $('#usmap-details').empty();
        if (!data) return;
        var states = {};
        mapWrapper.detailsStatesData = {};
        var total = 0;
        $.each(data, function (index, item) {
            if (item.State){
                states[item.State.toLowerCase()] = item.Color;
                mapWrapper.detailsStatesData[item.State.toLowerCase()] = isNaN(item.TotalCount) ? 0 : parseInt(item.TotalCount);
            }
            total += (isNaN(item.TotalCount) ? 0 : parseInt(item.TotalCount));
        });
        $('#usmap-details').vectorMap({
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
                window.open(service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
                    $('#bg-mr-d button.btn-selected').attr('data-date') + '&state=' + code + '&rowCount=' + mapWrapper.statesData[code] +
                    '&reportName=ReferralByPhysicianState', '_blank');
                event.preventDefault();
            },
            onLabelShow: function (event, label, code) {
                if (mapWrapper.detailsStatesData[code])
                    label.html('<div class="map-tooltip">' + mapWrapper.detailsStatesData[code] + ' referrals in ' + code.toUpperCase() + '</div>');
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

            $('#mr-d-tr-limit-1 td div').removeClass('bg0');
            $('#mr-d-tr-limit-1 td div').addClass('bg1-5');

            $('#mr-d-tr-limit-1').show();
            $('#mr-d-limit-1').text(limit1);

            if (limit1 === limit2) {
                $('#mr-d-tr-limit-2').hide();
            } else {
                $('#mr-d-tr-limit-2').show();
                $('#mr-d-limit-2').text(limit2);
            }

            if (limit2 === limit3) {
                $('#mr-d-tr-limit-3').hide();
            } else {
                $('#mr-d-tr-limit-3').show();
                $('#mr-d-limit-3').text(limit3);
            }

            if (limit3 === limit4) {
                $('#mr-d-tr-limit-4').hide();
            } else {
                $('#mr-d-tr-limit-4').show();
                $('#mr-d-limit-4').text(limit4);
            }

            if (limit4 === limit5) {
                $('#mr-d-tr-limit-5').hide();
            } else {
                $('#mr-d-tr-limit-5').show();
                $('#mr-d-limit-5').text(limit5);
            }

            if (limit5 === limit6) {
                $('#mr-d-tr-limit-6').hide();
            } else {
                $('#mr-d-tr-limit-6').show();
                $('#mr-d-limit-6').text(limit6);
            }
        } else {
            $('#mr-d-tr-limit-1').show();
            $('#mr-d-tr-limit-1 td div').removeClass('bg1-5');
            $('#mr-d-tr-limit-1 td div').addClass('bg0');
            $('#mr-d-limit-1').text('0 - 0');
            $('#mr-d-tr-limit-2').hide();
            $('#mr-d-tr-limit-3').hide();
            $('#mr-d-tr-limit-4').hide();
            $('#mr-d-tr-limit-5').hide();
            $('#mr-d-tr-limit-6').hide();
        }
        $('#mr-map-details-title').html('<a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' +
            $('#bg-mr-d button.btn-selected').attr('data-date') + '&rowCount=' + total + '&reportName=ReferralByPhysicianState' +
            '" target="_blank">' + service.getDateText('bg-mr-d') + ' - ' + total + ' Referrals</a>');
    },

    renderBr5: function (data) {
        $('#usmapbr5').empty();
        if (!data) return;
        var states = {};
        mapWrapper.br5StatesData = {};
        var total = 0;
        $.each(data, function (index, item) {
            if (item.State) {
                states[item.State.toLowerCase()] = item.Color;
                mapWrapper.br5StatesData[item.State.toLowerCase()] = isNaN(item.TotalCount) ? 0 : parseInt(item.TotalCount);
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_ip'] = isNaN(item.InProcess) ? 0 : parseInt(item.InProcess);
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_d'] = isNaN(item.Denied) ? 0 : parseInt(item.Denied);
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_a'] = isNaN(item.Approved) ? 0 : parseInt(item.Approved);
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_ipp'] = isNaN(item.InProcessPercent) ? '0%' : parseFloat(item.InProcessPercent).toFixed(1) + '%';
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_dp'] = isNaN(item.DeniedPercent) ? '0%' : parseFloat(item.DeniedPercent).toFixed(1) + '%';
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_ap'] = isNaN(item.ApprovedPercent) ? '0%' : parseFloat(item.ApprovedPercent).toFixed(1) + '%';
            }
            total += (isNaN(item.TotalCount) ? 0 : parseInt(item.TotalCount));
        });
        console.log(states);
        $('#usmapbr5').vectorMap({
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
                window.open(service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&dateType=' + $('#bg-br5 button.btn-selected').attr('data-date') + '&doctorState=' + code + '&divReport=MapOrderCount', '_blank');
                event.preventDefault();
            },
            onLabelShow: function (event, label, code) {
                if (mapWrapper.br5StatesData[code])
                    label.html('<div class="map-tooltip">' + code.toUpperCase() +
                        ': Approved: ' + mapWrapper.br5StatesData[code + '_a'] + '-' + mapWrapper.br5StatesData[code + '_ap'] +
                        ': Denied: ' + mapWrapper.br5StatesData[code + '_d'] + '-' + mapWrapper.br5StatesData[code + '_dp'] +
                        ': InProcess: ' + mapWrapper.br5StatesData[code + '_ip'] + '-' + mapWrapper.br5StatesData[code + '_ipp'] + '</div>');
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

            $('#br5-tr-limit-1 td div').removeClass('bg0');
            $('#br5-tr-limit-1 td div').addClass('bg1-5');

            $('#br5-tr-limit-1').show();
            $('#br5-limit-1').text(limit1);

            if (limit1 === limit2) {
                $('#br5-tr-limit-2').hide();
            } else {
                $('#br5-tr-limit-2').show();
                $('#br5-limit-2').text(limit2);
            }

            if (limit2 === limit3) {
                $('#br5-tr-limit-3').hide();
            } else {
                $('#br5-tr-limit-3').show();
                $('#br5-limit-3').text(limit3);
            }

            if (limit3 === limit4) {
                $('#br5-tr-limit-4').hide();
            } else {
                $('#br5-tr-limit-4').show();
                $('#br5-limit-4').text(limit4);
            }

            if (limit4 === limit5) {
                $('#br5-tr-limit-5').hide();
            } else {
                $('#br5-tr-limit-5').show();
                $('#br5-limit-5').text(limit5);
            }

            if (limit5 === limit6) {
                $('#br5-tr-limit-6').hide();
            } else {
                $('#br5-tr-limit-6').show();
                $('#br5-limit-6').text(limit6);
            }
        } else {
            $('#br5-tr-limit-1').show();
            $('#br5-limit-1').text('0 - 0');
            $('#br5-tr-limit-1 td div').removeClass('bg1-5');
            $('#br5-tr-limit-1 td div').addClass('bg0');
            $('#br5-tr-limit-2').hide();
            $('#br5-tr-limit-3').hide();
            $('#br5-tr-limit-4').hide();
            $('#br5-tr-limit-5').hide();
            $('#br5-tr-limit-6').hide();
        }
        $('#br5-map-title').html('<a href="' + service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&dateType=' + $('#bg-br5 button.btn-selected').attr('data-date') + '&divReport=MapOrderCount' +
            '" target="_blank">' + service.getDateText('bg-br5') + ' - ' + total + ' Orders</a>');
    },

    renderDetailsBr5: function (data) {
        $('#usmapbr5-d').empty();
        if (!data) return;
        var states = {};
        mapWrapper.br5StatesData = {};
        var total = 0;
        $.each(data, function (index, item) {
            if (item.State) {
                states[item.State.toLowerCase()] = item.Color;
                mapWrapper.br5StatesData[item.State.toLowerCase()] = isNaN(item.TotalCount) ? 0 : parseInt(item.TotalCount);
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_ip'] = isNaN(item.InProcess) ? 0 : parseInt(item.InProcess);
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_d'] = isNaN(item.Denied) ? 0 : parseInt(item.Denied);
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_a'] = isNaN(item.Approved) ? 0 : parseInt(item.Approved);
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_ipp'] = isNaN(item.InProcessPercent) ? '0%' : parseFloat(item.InProcessPercent).toFixed(1) + '%';
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_dp'] = isNaN(item.DeniedPercent) ? '0%' : parseFloat(item.DeniedPercent).toFixed(1) + '%';
                mapWrapper.br5StatesData[item.State.toLowerCase() + '_ap'] = isNaN(item.ApprovedPercent) ? '0%' : parseFloat(item.ApprovedPercent).toFixed(1) + '%';
            }
            total += (isNaN(item.TotalCount) ? 0 : parseInt(item.TotalCount));
        });
        $('#usmapbr5-d').vectorMap({
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
                window.open(service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&dateType=' + $('#bg-br5-d button.btn-selected').attr('data-date') + '&doctorState=' + code + '&divReport=MapOrderCount', '_blank');
                event.preventDefault();
            },
            onLabelShow: function (event, label, code) {
                if (mapWrapper.br5StatesData[code])
                    label.html('<div class="map-tooltip">' + code.toUpperCase() +
                        ': Approved: ' + mapWrapper.br5StatesData[code + '_a'] + '-' + mapWrapper.br5StatesData[code + '_ap'] +
                        ': Denied: ' + mapWrapper.br5StatesData[code + '_d'] + '-' + mapWrapper.br5StatesData[code + '_dp'] +
                        ': InProcess: ' + mapWrapper.br5StatesData[code + '_ip'] + '-' + mapWrapper.br5StatesData[code + '_ipp'] + '</div>');
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

            $('#br5-d-tr-limit-1 td div').removeClass('bg0');
            $('#br5-d-tr-limit-1 td div').addClass('bg1-5');

            $('#br5-d-tr-limit-1').show();
            $('#br5-d-limit-1').text(limit1);

            if (limit1 === limit2) {
                $('#br5-d-tr-limit-2').hide();
            } else {
                $('#br5-d-tr-limit-2').show();
                $('#br5-d-limit-2').text(limit2);
            }

            if (limit2 === limit3) {
                $('#br5-d-tr-limit-3').hide();
            } else {
                $('#br5-d-tr-limit-3').show();
                $('#br5-d-limit-3').text(limit3);
            }

            if (limit3 === limit4) {
                $('#br5-d-tr-limit-4').hide();
            } else {
                $('#br5-d-tr-limit-4').show();
                $('#br5-d-limit-4').text(limit4);
            }

            if (limit4 === limit5) {
                $('#br5-d-tr-limit-5').hide();
            } else {
                $('#br5-d-tr-limit-5').show();
                $('#br5-d-limit-5').text(limit5);
            }

            if (limit5 === limit6) {
                $('#br5-d-tr-limit-6').hide();
            } else {
                $('#br5-d-tr-limit-6').show();
                $('#br5-d-limit-6').text(limit6);
            }
        } else {
            $('#br5-d-tr-limit-1').show();
            $('#br5-d-limit-1').text('0 - 0');
            $('#br5-d-tr-limit-1 td div').removeClass('bg1-5');
            $('#br5-d-tr-limit-1 td div').addClass('bg0');
            $('#br5-d-tr-limit-2').hide();
            $('#br5-d-tr-limit-3').hide();
            $('#br5-d-tr-limit-4').hide();
            $('#br5-d-tr-limit-5').hide();
            $('#br5-d-tr-limit-6').hide();
        }
        $('#br5-d-map-title').html('<a href="' + service.getRootUrl() + '/Details/OrderDetails?programId=' + $('#program').val() + '&dateType=' + $('#bg-br5-d button.btn-selected').attr('data-date') + '&divReport=MapOrderCount' +
            '" target="_blank">' + service.getDateText('bg-br5-d') + ' - ' + total + ' Orders</a>');
    },
};