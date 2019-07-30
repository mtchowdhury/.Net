var utility = {
    dateBtnClick: function (id, self, reloadFunc) {
        $('#' + id + ' button').removeClass('btn-selected');
        $('#' + id + '-d button').removeClass('btn-selected');
        $('#' + id + '-lg button').removeClass('btn-selected'); // for epipen dashboard

        $('#' + id + '-dd button').removeClass('btn-selected'); // only for tr pie chart
        $('#' + id + '-dd-d button').removeClass('btn-selected'); // only for tr pie chart

        $(self).addClass('btn-selected');
        var date = $(self).attr('data-date');
        $('#' + id + '-dd button[data-date="' + date + '"]').addClass('btn-selected'); // only for tr pie chart
        $('#' + id + '-d button[data-date="' + date + '"]').addClass('btn-selected');
        $('#' + id + '-dd-d button[data-date="' + date + '"]').addClass('btn-selected'); // only for tr pie chart
        $('#' + id + '-lg button[data-date="' + date + '"]').addClass('btn-selected'); // for epipen dashboard
        reloadFunc();
    },

    qtdDateBtnClick: function (id, parentId, dateType, reloadFunc, elm) {
        $('#' + id + ' button').removeClass('btn-selected');
        $('#' + id + '-d button').removeClass('btn-selected');
        $('#' + id + '-lg button').removeClass('btn-selected'); // for epipen dashboard

        $('#' + id + '-dd button').removeClass('btn-selected'); // only for tr pie chart
        $('#' + id + '-dd-d button').removeClass('btn-selected'); // only for tr pie chart

        $('#' + parentId).addClass('btn-selected');
        $('#' + parentId + '-d').addClass('btn-selected');
        $('#' + parentId + '-dd').addClass('btn-selected');
        $('#' + parentId + '-dd-d').addClass('btn-selected');
        $('#' + parentId).attr('data-date', dateType);
        $('#' + parentId + '-d').attr('data-date', dateType);
        $('#' + parentId + '-dd').attr('data-date', dateType);
        $('#' + parentId + '-dd-d').attr('data-date', dateType);

        // for QTD5
        if (elm) {
            var qtrText = elm.text.split(' ')[0].trim();
            $('#' + parentId).attr('data-qtr-text', qtrText);
            $('#' + parentId + '-d').attr('data-qtr-text', qtrText);
            $('#' + parentId + '-dd').attr('data-qtr-text', qtrText);
            $('#' + parentId + '-dd-d').attr('data-qtr-text', qtrText);
        }

        reloadFunc();
    },

    hidePanels: function (result) {
        $("[id^=widget-panel-]").hide();
        var showedPanels = [];
        $.each(result, function (index, item) {
            if (utility.isHiddenPanel(item))
                $('#widget-panel-' + item.PanelId).hide();
            else {
                $('#widget-panel-' + item.PanelId).show();
                showedPanels.push(item.PanelId);
            }
            utility.showHideApproved(item);
        });
        //if (($('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP') && $('#hid-user-rolename').val() !== 'Armada employee') // for district manager panel only
        //    $('#widget-panel-3').hide();

        //if ($('#hid-is-auviq').val() === '0') {
        //    $('#widget-panel-16').hide();
        //    $('#widget-panel-17').hide();
        //    $('#widget-panel-18').hide();
        //    $('#widget-panel-19').hide();
        //    $('#widget-panel-20').hide();
        //	$('#widget-panel-21').hide();
        //	$('#widget-panel-22').hide();
        //}

        for (var i = 1; i < showedPanels.length; i++) {
            $('#widget-panel-' + showedPanels[i]).insertAfter('#widget-panel-' + showedPanels[i - 1]);
        }
    },

    isHiddenPanel: function (item) {
        //kaleo user type: 1 = super user, 2 = approved user, 3 = normal user
        if (item.PanelOrder === 0 || item.PanelOrder === -1)
            return true;
        if ($('#hid-is-kaleo').val() === '0' && item.IsKaleo)
            return true;
        if ($('#hid-is-kaleo').val() === '1' && $('#hid-kaleo-user-type').val() === '3' && item.IsKaleo)
            return true;
        if ($('#hid-is-kaleo').val() === '1' && $('#hid-kaleo-user-type').val() === '2' && item.IsKaleo && !item.IsApproved)
            return true;

        return false;
    },

    showHideApproved: function (item) {
        if ($('#hid-is-kaleo').val() === '1' && item.IsApproved) {
            $('#widget-panel-' + item.PanelId)
                .prepend('<i id="widget-panel-' + item.PanelId + '-approve" class="fa fa-check-circle approved-icon" title="Approved"></i>');
        } else {
            $('#widget-panel-' + item.PanelId + '-approve').remove();
        }
    },

    adjustGroupBtnFont: function () {
        var size = $('#widget-panel-1').width() / 63;
        size = size > 12 ? 12 : size;
        size = size < 4 ? 4 : size;
        $('.custom-btn-group').css('font-size', (parseInt(size) + 2) + 'px');

        $(window).resize(function () {
            var size = $('#widget-panel-1').width() / 63;
            size = size > 12 ? 12 : size;
            size = size < 4 ? 4 : size;
            $('.custom-btn-group').css('font-size', (parseInt(size) + 2) + 'px');
        });
    },

    resetDateButtons: function () {
        $('.custom-btn-group').removeClass('btn-selected');
        $('.custom-btn-group[data-date="today"]').addClass('btn-selected');
        $('.custom-btn-group[data-date="Day"]').addClass('btn-selected');
        $('.custom-btn-group[data-date="daily"]').addClass('btn-selected');
        $('#bg-mudov .custom-btn-group[data-date="Week"]').addClass('btn-selected');
        $('#bg-mudsr .custom-btn-group[data-date="Week"]').addClass('btn-selected');
        $('#bg-cp .custom-btn-group[data-date="Week"]').addClass('btn-selected');
        $('#bg-ip .custom-btn-group[data-date="Week"]').addClass('btn-selected');
        $('#bg-vcpip .custom-btn-group[data-date="Week"]').addClass('btn-selected');
    },

    onSchoolCountSubmit: function () {
        $('#school-count-lg-inpCustomerCategory').val($('#school-count-inpCustomerCategory').val());
        $('#school-count-lg-begin-date').val($('#school-count-begin-date').val());
        $('#school-count-lg-end-date').val($('#school-count-end-date').val());
        if ($('input[name=screleasedate]:checked').val() === '')
            $('#school-count-lg-by-state').prop("checked", true);
        else
            $('#school-count-lg-by-date').prop("checked", true);
        epipenService.getSchoolCounts($('input[name=screleasedate]:checked').val() === '' ? null : 'na');
    },

    onNewRepeatSubmit: function () {
        $('#new-repeat-lg-inpCustomerCategory').val($('#new-repeat-inpCustomerCategory').val());
        $('#new-repeat-lg-state').val($('#new-repeat-state').val());
        $('#new-repeat-lg-year').val($('#new-repeat-year').val());
        epipenService.getNewRepeatCustomers();
    },

    onProductMixSubmit: function () {
        $('#product-mix-lg-inpCustomerCategory').val($('#product-mix-inpCustomerCategory').val());
        epipenService.getProductMix();
    },

    onOrderQtySubmit: function () {
        $('#order-qty-lg-inpCustomerCategory').val($('#order-qty-inpCustomerCategory').val());
        $('#order-qty-lg-begin-date').val($('#order-qty-begin-date').val());
        $('#order-qty-lg-end-date').val($('#order-qty-end-date').val());
        if ($('input[name=oqreleasedate]:checked').val() === '')
            $('#order-qty-lg-by-state').prop("checked", true);
        else
            $('#order-qty-lg-by-date').prop("checked", true);
        epipenService.getOrderQtys($('input[name=oqreleasedate]:checked').val() === '' ? null : 'na');
    },

    onOrderMapSubmit: function () {
        $('#order-map-lg-inpCustomerCategory').val($('#order-map-inpCustomerCategory').val());
        $('#order-map-lg-begin-date').val($('#order-map-begin-date').val());
        $('#order-map-lg-end-date').val($('#order-map-end-date').val());
        if ($('input[name=omreleasedate]:checked').val() === '')
            $('#order-map-lg-by-state').prop("checked", true);
        else
            $('#order-map-lg-by-date').prop("checked", true);
        epipenService.getOrderMap('na');
    },

    chechDataAvailibility: function (noDataDivId, dataDivId, dataTitleDiv, data) {
        if (data && data.length > 0) {
            $('#' + noDataDivId).hide();
            $('#' + dataDivId).show();
            $('#' + dataTitleDiv).show();
            return true;
        }
        $('#' + noDataDivId).show();
        $('#' + dataDivId).hide();
        $('#' + dataTitleDiv).hide();
        return false;
    },

    chechDataAvailibilityWithTable: function (noDataDivId, dataDivId, dataTitleDiv, data, tableId) {
        if (data && data.length > 0) {
            $('#' + noDataDivId).hide();
            $('#' + dataDivId).show();
            $('#' + dataTitleDiv).show();
            $('#' + tableId).show();
            return true;
        }
        $('#' + noDataDivId).show();
        $('#' + dataDivId).hide();
        $('#' + dataTitleDiv).hide();
        $('#' + tableId).hide();
        return false;
    },

    chechBothDataAvailibility: function (noDataDivId, dataDivId, dataTitleDiv, data1, data2) {
        if (data1 && data1.length > 0 || data2 && data2.length > 0) {
            $('#' + noDataDivId).hide();
            $('#' + dataDivId).show();
            $('#' + dataTitleDiv).show();
            return true;
        }
        $('#' + noDataDivId).show();
        $('#' + dataDivId).hide();
        $('#' + dataTitleDiv).hide();
        return false;
    },

    onMozAndMs: function () {
        if ($.browser.mozilla) {
            $('.table-cotainer').css('margin-right', '-33px');
            $('.details-table-cotainer').css('overflow', 'hidden');
        }
        if ($.browser.msedge || $.browser.msie) {
            $('.table-cotainer').css('margin-right', '-28px');
            $('.details-table-cotainer').css('overflow', 'hidden');
        }
    },

    toggleDdlOnClick: function() {
        $('#data-login').on('show.bs.dropdown', function () {
            $('#asembia-ddl-login img').removeClass('toggle-caret-open');
            $('#asembia-ddl-login img').addClass('toggle-caret-close');
        });

        $('#data-login').on('hide.bs.dropdown', function () {
            $('#asembia-ddl-login img').removeClass('toggle-caret-close');
            $('#asembia-ddl-login img').addClass('toggle-caret-open');
        });

        $('#parent-1').on('show.bs.dropdown', function () {
            $('#asembia-ddl-reports img').removeClass('toggle-caret-open');
            $('#asembia-ddl-reports img').addClass('toggle-caret-close');
        });

        $('#parent-1').on('hide.bs.dropdown', function () {
            $('#asembia-ddl-reports img').removeClass('toggle-caret-close');
            $('#asembia-ddl-reports img').addClass('toggle-caret-open');
        });
    }
};