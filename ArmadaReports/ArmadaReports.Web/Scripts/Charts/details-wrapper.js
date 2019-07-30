var detailsWrapper = {
    detailsTable: null,
    analysisTable: null,
    orderDetailsTable: null,
    upDetailsTable: null,
    sraTable: null,
    rttpTable: null,
    init: function () {
        detailsWrapper.showHideFiltersOnProgram();

        if (detailsWrapper.detailsTable) detailsWrapper.detailsTable.destroy();

        detailsWrapper.detailsTable = $('#details-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': true,
            "aaSorting": [],
            "iDisplayLength": 50,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
            //"aoColumns": [{ "sWidth": "5%" }, { "sWidth": "5%" }, { "sWidth": "8%" }, { "sWidth": "9%" }, { "sWidth": "8%" },
            //{ "sWidth": "10%" }, { "sWidth": "10%" }, { "sWidth": "5%" }, { "sWidth": "5%" }, { "sWidth": "5%" }, { "sWidth": "5%" },
            //{ "sWidth": "5%" }, { "sWidth": "5%" }, { "sWidth": "5%" }, { "sWidth": "5%" }, { "sWidth": "5%" }]
        });

        detailsWrapper.putPrevNextButton();
        detailsWrapper.putPageInfo();

        //$('#details-table_info').hide();
        $('#history-status-contains').keyup(function(e) {
            if (e.keyCode === 13) {
                service.getAspnHistory($('#popup-history-aspnid').text());
            }
        });
    },

    initAnalysis: function () {
        if (detailsWrapper.analysisTable) detailsWrapper.analysisTable.destroy();

        detailsWrapper.analysisTable = $('#analysis-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 50,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    initOrderDetails: function () {
        if (detailsWrapper.orderDetailsTable) detailsWrapper.orderDetailsTable.destroy();

        detailsWrapper.orderDetailsTable = $('#order-details-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': true,
            "aaSorting": [],
            "iDisplayLength": 10,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    initUpDetails: function () {
        if (detailsWrapper.upDetailsTable) detailsWrapper.upDetailsTable.destroy();

        detailsWrapper.upDetailsTable = $('#up-details-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': true,
            "aaSorting": [],
            "iDisplayLength": 10,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    showFilterSelection: function() {
        $('#filter-modal').modal('show');
    },

    showOdFilterSelection: function () {
        $('#od-filter-modal').modal('show');
    },

    showUpFilterSelection: function () {
        $('#up-filter-modal').modal('show');
    },

    showHistory: function (aspnid) {
        $('#history-status-contains').val('');
        $('#popup-history-aspnid').text('');
        $('#details-history-modal').modal('show');
        service.getAspnHistory(aspnid);
    },

    showStatusNotes: function (aspnid) {
        $('#history-statusnotes-contains').val('');
        $('#popup-statusnotes-aspnid').text('');
        $('#details-statusnotes-modal').modal('show');
        service.getAspnStatusNotes(aspnid);
    },
    showPAActivity: function (aspnrxid) {
        $('#pa-activity-modal').modal('show');
        service.getPAActivity(aspnrxid);
    },

    showDates: function (element) {
        $('#popup-aspnid').text('');
        $('#date-created').text($(element).attr('data-created') + '  ' + $(element).attr('data-createdon'));
        $('#date-received').text($(element).attr('data-received'));
        $('#date-assigned').text($(element).attr('data-assigned'));
        //$('#date-completed').text($(element).attr('data-completed'));
        $('#date-canceled').text($(element).attr('data-canceled'));
        $('#date-filled').text($(element).attr('data-filled'));
        $('#date-shipped').text($(element).attr('data-shipped'));
        $('#details-dates-modal').modal('show');
    },

    showNotes: function (aspnid) {
        $('#popup-notes-aspnid').text('');
        $('#details-notes-modal').modal('show');
        service.getAspnNotes(aspnid);
    },

    showAddress: function (element) {
        $('#popup-physician-ad').text($(element).attr('data-physician'));
        $('#address-part1').text($(element).attr('data-address1'));
        $('#address-part2').text($(element).attr('data-address2'));
        $('#address-city').text($(element).attr('data-city'));
        $('#address-state').text($(element).attr('data-state'));
        $('#address-zip').text($(element).attr('data-zip'));
        $('#address-phone').text($(element).attr('data-phone'));
        $('#details-address-modal').modal('show');
    },

    onFilterSelected: function() {
        var queryString = '?programId=' + $('#program-hidden').val();
        if ($('#fs-aspnid').val()) queryString += '&aspnxId=' + $('#fs-aspnid').val();
        if ($('#fs-state').val()) queryString += '&state=' + $('#fs-state').val();
        if ($('#fs-status').val()) queryString += '&programStatus=' + $('#fs-status').val();
        if ($('#fs-substatus').val()) queryString += '&programSubStatus=' + $('#fs-substatus').val();
        if ($('#fs-reportsto').val()) queryString += '&reportsTo=' + $('#fs-reportsto').val();
        if ($('#fs-salesreferral').val()) queryString += '&salesReferralUser=' + $('#fs-salesreferral').val();
        if ($('#fs-to').val()) queryString += '&to=' + $('#fs-to').val();
        if ($('#fs-from').val()) queryString += '&from=' + $('#fs-from').val();
        if ($('#fs-insurance-type').val()) queryString += '&insType=' + $('#fs-insurance-type').val();
        if ($('#fs-priorauth-div').is(':visible')) queryString += '&priorAuth=' + $('#fs-priorauth').val();
        //if ($('#fs-hubsubhub-div').is(':visible')) queryString += '&hubsubhub=' + $('#fs-hubsubhub').val();
        if ($('#fs-treatment-div').is(':visible')) queryString += '&inpTreatment=' + $('#fs-treatment').val();
        if ($('#fs-tubesqty-div').is(':visible') && $('#fs-tubesqty').val()) queryString += '&regranexTubeQty=' + $('#fs-tubesqty').val();

        var physicianLastNameSrcQry = '';
        if ($('#fs-plastname').val() === 'beginswith') physicianLastNameSrcQry = $('#fs-plastnamestr').val() + '%';
        else if ($('#fs-plastname').val() === 'contains') physicianLastNameSrcQry = '%' + $('#fs-plastnamestr').val() + '%';
        else if ($('#fs-plastname').val() === 'endswith') physicianLastNameSrcQry = '%' + $('#fs-plastnamestr').val();
        if ($('#fs-plastnamestr').val()) {
            queryString += '&physicianLastName=' + $('#fs-plastnamestr').val();
            queryString += '&physicianLastNameSrcQry=' + physicianLastNameSrcQry;
        }
        queryString += '&dateRangeType=allreferrals';

        if ($('#fs-registry').val()) queryString += '&registry=' + $('#fs-registry').val();
        if ($('#fs-on-label').val()) queryString += '&onLabel=' + $('#fs-on-label').val();
        if ($('#fs-source').val()) queryString += '&source=' + $('#fs-source').val();
        if ($('#fs-ndc').val()) queryString += '&ndc=' + $('#fs-ndc').val();
        if ($('#fs-referral-type').val()) queryString += '&referralType=' + $('#fs-referral-type').val();

        window.location = service.getRootUrl() + '/Details/Index' + queryString;
    },

    onTodayFilterSelected: function () {
        var queryString = '?programId=' + $('#program-hidden').val();
        if ($('#fs-aspnid').val()) queryString += '&aspnxId=' + $('#fs-aspnid').val();
        if ($('#fs-state').val()) queryString += '&state=' + $('#fs-state').val();
        if ($('#fs-status').val()) queryString += '&programStatus=' + $('#fs-status').val();
        if ($('#fs-substatus').val()) queryString += '&programSubStatus=' + $('#fs-substatus').val();
        if ($('#fs-reportsto').val()) queryString += '&reportsTo=' + $('#fs-reportsto').val();
        if ($('#fs-salesreferral').val()) queryString += '&salesReferralUser=' + $('#fs-salesreferral').val();
        if ($('#fs-insurance-type').val()) queryString += '&insType=' + $('#fs-insurance-type').val();
        if ($('#fs-priorauth-div').is(':visible')) queryString += '&priorAuth=' + $('#fs-priorauth').val();
        if ($('#fs-treatment-div').is(':visible')) queryString += '&inpTreatment=' + $('#fs-treatment').val();
        if ($('#fs-tubesqty-div').is(':visible') && $('#fs-tubesqty').val()) queryString += '&regranexTubeQty=' + $('#fs-tubesqty').val();

        var physicianLastNameSrcQry = '';
        if ($('#fs-plastname').val() === 'beginswith') physicianLastNameSrcQry = $('#fs-plastnamestr').val() + '%';
        else if ($('#fs-plastname').val() === 'contains') physicianLastNameSrcQry = '%' + $('#fs-plastnamestr').val() + '%';
        else if ($('#fs-plastname').val() === 'endswith') physicianLastNameSrcQry = '%' + $('#fs-plastnamestr').val();
        if ($('#fs-plastnamestr').val()) {
            queryString += '&physicianLastName=' + $('#fs-plastnamestr').val();
            queryString += '&physicianLastNameSrcQry=' + physicianLastNameSrcQry;
        }
        queryString += '&dateRangeType=today';
        queryString += '&dateToUse=ModifiedOn';

        if ($('#fs-registry').val()) queryString += '&registry=' + $('#fs-registry').val();
        if ($('#fs-on-label').val()) queryString += '&onLabel=' + $('#fs-on-label').val();
        if ($('#fs-source').val()) queryString += '&source=' + $('#fs-source').val();
        if ($('#fs-ndc').val()) queryString += '&ndc=' + $('#fs-ndc').val();
        if ($('#fs-referral-type').val()) queryString += '&referralType=' + $('#fs-referral-type').val();

        window.location = service.getRootUrl() + '/Details/Index' + queryString;
    },

    onOdFilterSelected: function () {
        var queryString = '?programId=' + $('#program-hidden').val();
        queryString += '&divReport=' + $('#divreport-hidden').val();
        if ($('#odfs-aspnid').val()) queryString += '&aspnxId=' + $('#odfs-aspnid').val();
        if ($('#odfs-state').val()) queryString += '&doctorState=' + $('#odfs-state').val();
        if ($('#odfs-status').val()) queryString += '&programStatus=' + $('#ofs-status').val();
        if ($('#odfs-to').val()) queryString += '&to=' + $('#odfs-to').val();
        if ($('#odfs-from').val()) queryString += '&from=' + $('#odfs-from').val();
        if ($('#odfs-shipto').val()) queryString += '&shipTo=' + $('#odfs-shipto').val();
        if ($('#odfs-shipfrom').val()) queryString += '&shipFrom=' + $('#odfs-shipfrom').val();

        if ($('#odfs-patientid').val()) queryString += '&patientId=' + $('#odfs-patientid').val();
        if ($('#odfs-ndc').val()) queryString += '&ndc=' + $('#odfs-ndc').val();
        if ($('#odfs-fillingpharmacy').val()) queryString += '&fillingPharmacyId=' + $('#odfs-fillingpharmacy').val();

        var physicianLastNameSrcQry = '';
        if ($('#odfs-plastname').val() === 'beginswith') physicianLastNameSrcQry = $('#odfs-plastnamestr').val() + '%';
        else if ($('#odfs-plastname').val() === 'contains') physicianLastNameSrcQry = '%' + $('#odfs-plastnamestr').val() + '%';
        else if ($('#odfs-plastname').val() === 'endswith') physicianLastNameSrcQry = '%' + $('#odfs-plastnamestr').val();
        if ($('#odfs-plastnamestr').val())
            queryString += '&physicianLastNameSrcQry=' + physicianLastNameSrcQry;

        window.location = service.getRootUrl() + '/Details/OrderDetails' + queryString;
    },

    onUpFilterSelected: function () {
        var queryString = '?programId=' + $('#program-hidden').val();
        if ($('#upfs-state').val()) queryString += '&doctorState=' + $('#upfs-state').val();
        if ($('#upfs-status').val()) queryString += '&programStatus=' + $('#upfs-status').val();
        if ($('#upfs-to').val()) queryString += '&to=' + $('#upfs-to').val();
        if ($('#upfs-from').val()) queryString += '&from=' + $('#upfs-from').val();

        if ($('#upfs-patientid').val()) queryString += '&patientId=' + $('#upfs-patientid').val();
        if ($('#upfs-ndc').val()) queryString += '&ndc=' + $('#upfs-ndc').val();
        if ($('#upfs-fillingpharmacy').val()) queryString += '&fillingPharmacyId=' + $('#upfs-fillingpharmacy').val();

        var physicianLastNameSrcQry = '';
        if ($('#upfs-plastname').val() === 'beginswith') physicianLastNameSrcQry = $('#upfs-plastnamestr').val() + '%';
        else if ($('#upfs-plastname').val() === 'contains') physicianLastNameSrcQry = '%' + $('#upfs-plastnamestr').val() + '%';
        else if ($('#upfs-plastname').val() === 'endswith') physicianLastNameSrcQry = '%' + $('#upfs-plastnamestr').val();
        if ($('#upfs-plastnamestr').val())
            queryString += '&physicianLastNameSrcQry=' + physicianLastNameSrcQry;

        window.location = service.getRootUrl() + '/Details/UniquePatientDetails' + queryString;
    },

    gotoAnalysis: function () {
        var id = !$('#no-drilldown').is(':hidden') ? 'bg-tr' : 'bg-tr-dd';
        var dateTypeStr = $('#' + id + ' button.btn-selected').text() === 'QTD'
            ? $('#' + id + ' button.btn-selected').attr('data-date').toUpperCase() : $('#' + id + ' button.btn-selected').text();
        window.open(service.getRootUrl() + '/Details/Analysis?programId=' + $('#program').val() + '&dateType=' + $('#' + id + ' button.btn-selected').attr('data-date') +
            '&inpTreatment=All&dateTypeStr=' + dateTypeStr + '&strength=' + $('#strength-tr').val(), '_blank');
    },

    gotoNewReferralAnalysis: function () {
        var id = !$('#no-drilldown').is(':hidden') ? 'bg-tr' : 'bg-tr-dd';
        var dateTypeStr = $('#' + id + ' button.btn-selected').text() === 'QTD'
            ? $('#' + id + ' button.btn-selected').attr('data-date').toUpperCase() : $('#' + id + ' button.btn-selected').text();
        window.open(service.getRootUrl() + '/Details/Analysis?programId=' + $('#program').val() + '&dateType=' + $('#' + id + ' button.btn-selected').attr('data-date') +
            '&inpTreatment=All&dateTypeStr=' + dateTypeStr + '&referralType=New Rx' + '&strength=' + $('#strength-tr').val(), '_blank');
    },

    gotoDetailsAnalysis: function () {
        var id = !$('#no-drilldown').is(':hidden') ? 'bg-tr-d' : 'bg-tr-dd-d';
        var dateTypeStr = $('#' + id + ' button.btn-selected').text() === 'QTD'
            ? $('#' + id + ' button.btn-selected').attr('data-date').toUpperCase() : $('#' + id + ' button.btn-selected').text();
        window.open(service.getRootUrl() + '/Details/Analysis?programId=' + $('#program').val() + '&dateType=' + $('#' + id + ' button.btn-selected').attr('data-date') +
            '&inpTreatment=All&dateTypeStr=' + dateTypeStr + '&strength=' + $('#strength-tr-d').val(), '_blank');
    },

    gotoNewReferralDetailsAnalysis: function () {
        var id = !$('#no-drilldown').is(':hidden') ? 'bg-tr-d' : 'bg-tr-dd-d';
        var dateTypeStr = $('#' + id + ' button.btn-selected').text() === 'QTD'
            ? $('#' + id + ' button.btn-selected').attr('data-date').toUpperCase() : $('#' + id + ' button.btn-selected').text();
        window.open(service.getRootUrl() + '/Details/Analysis?programId=' + $('#program').val() + '&dateType=' + $('#' + id + ' button.btn-selected').attr('data-date') +
            '&inpTreatment=All&dateTypeStr=' + dateTypeStr + '&referralType=New Rx' + '&strength=' + $('#strength-tr-d').val(), '_blank');
    },

    selectDateBtn: function(attr) {
        $('#bg-analysis button[data-date="' + attr + '"]').addClass('btn-selected');
    },

    onDateBtnPress: function (element) {
        var date = $(element).attr('data-date').toLowerCase().indexOf('qtd') > -1 ? 'qtd' : $(element).attr('data-date');
        $('#bg-analysis button').removeClass('btn-selected');
        $('#bg-analysis button[data-date="' + date + '"]').addClass('btn-selected');

        var referralType = $('#referralType-hidden').val() ? '&referralType=' + $('#referralType-hidden').val() : '';
        window.location = service.getRootUrl() + '/Details/Analysis?programId=' + $('#program-hidden').val() + '&dateType=' + $(element).attr('data-date') +
            '&inpTreatment=All&dateTypeStr=' + $(element).text() + referralType;
    },

    showHideFiltersOnProgram: function() {
        var programId = $('#program-hidden').val();
        var avgDays = $('#avgDays-hidden').val();
        $('#fs-treatment-div').hide();
        $('#fs-hubsubhub-div').hide();
        $('#fs-tubesqty-div').hide();
        $('#fs-priorauth-div').hide();
        if (programId === '53') $('#fs-treatment-div').show();
        if (programId === '13') $('#fs-tubesqty-div').show();
        if (programId === '24' && avgDays === 'DTFAvg') $('#fs-priorauth-div').show();
        if (programId === '24' && avgDays !== 'DTFAvg') $('#fs-hubsubhub-div').show();
    },

    initSraTable: function () {
        if (detailsWrapper.sraTable) detailsWrapper.sraTable.destroy();

        detailsWrapper.sraTable = $('#sra-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': true,
            "aaSorting": [],
            "iDisplayLength": 10,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    initRttpTable: function () {
        if (detailsWrapper.rttpTable) detailsWrapper.rttpTable.destroy();

        detailsWrapper.rttpTable = $('#rttp-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': true,
            "aaSorting": [],
            "iDisplayLength": 20,
            "lengthMenu": [[10, 20, 50, 100, 200, 500, 1000, -1], [10, 20, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    getSalesRepActivityReport: function () {
        window.location = service.getRootUrl() + '/Report/GetSalesRepActivityReport?programName=' + $('#sra-program-name').val();
    },

    onNextClick: function () {
        var url = window.location.href.indexOf('offset=') > -1
                        ? window.location.href.replace(/(offset=)[^\&]+/, '$1' + $('#nextoffset').val())
                        : window.location.href + '&offset=' + $('#nextoffset').val();

        window.location = url;
    },

    onPreviousClick: function () {
        var url = window.location.href.indexOf('offset=') > -1
                        ? window.location.href.replace(/(offset=)[^\&]+/, '$1' + $('#prevoffset').val())
                        : window.location.href + '&offset=' + $('#prevoffset').val();

        window.location = url;
    },

    putPrevNextButton: function () {
        $('#details-table_next').hide();
        $('ul.pagination').html('');
        if (parseInt($('#prevoffset').val()) > -1)
            $('ul.pagination').append('<li class="paginate_button" title="fetch previous 50 result" onclick="detailsWrapper.onPreviousClick()"><i class="fa fa-fast-backward"></i></li>');
        if (parseInt($('#nextoffset').val()) > -1)
            $('ul.pagination').append('<li class="paginate_button" title="fetch next 50 result" onclick="detailsWrapper.onNextClick()"><i class="fa fa-fast-forward"></i></li>');
    },

    putPageInfo: function () {
        var rowCount = parseInt($('#rowcount').val());
        var offset = parseInt($('#offset').val());
        var from = offset + 1;
        var to = offset + 50 > rowCount ? rowCount : offset + 50;
        $('#details-table_info').text('Showing ' + from + ' to ' + to + ' of ' + numeral(rowCount).format('0,0') + ' entries');
    }
};