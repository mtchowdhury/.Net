var epipenTableWrapper = {
    schoolCountTable: null,
    schoolCountLgTable: null,
    orderQtyTable: null,
    orderQtyLgTable: null,
    newRepeatTable: null,
    newRepeatLgTable: null,

    renderDetailsSchoolCountTable: function (data) {
        if (epipenTableWrapper.schoolCountTable) epipenTableWrapper.schoolCountTable.destroy();
        $('table#school-count-table tbody').html('');
        var primaryCol = $('input[name=screleasedate]:checked').val();
        $('table#school-count-table thead tr').children().first().text(primaryCol === '' ? 'School State' : 'Processed Date');
        $.each(data, function (index, item) {
            var begDate = primaryCol === '' || item.SchoolState === 'Grand Total:' ? $('#school-count-begin-date').val() : item.SchoolState;
            var endDate = primaryCol === '' || item.SchoolState === 'Grand Total:' ? $('#school-count-end-date').val() : item.SchoolState;
            var state = primaryCol === '' ? item.SchoolState === 'Grand Total:' ? 'All' : item.SchoolState : 'All';
            $('table#school-count-table tbody').append('<tr>' +
                '<td><a href="' + service.getRootUrl() + '/EpipenDetails/SchoolByStateDetails?begDate=' + begDate + '&endDate=' + endDate +
                '&inpCustomerCategory=' + $('#inpCustomerCategory').val() + '&disneySchoolId=All&state=' + state +
                '&schoolZip=' + $('#inpSchoolZip').val() + '&schoolId=' + $('#inpSchoolID').val() + '&releaseDate=' + $('input[name=screleasedate]:checked').val() + '" target="_blank">' + item.SchoolState + '</a></td>' +
                '<td>' + numeral(item.DistinctSchoolCount).format('0,0') + '</td>' +
                '<td>' + numeral(item.TotalSchoolCount).format('0,0') + '</td>' +
                '<td>' + numeral(item.SchoolDiff).format('0,0') + '</td>' +
                '</tr>');
        });

        epipenTableWrapper.schoolCountTable = $('#school-count-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 5,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    renderSchoolCountTable: function (data) {
        console.log(data);
        if (data && data.length > 0) {
            $('#school-count-begin-date').val(data[0].DdlBegDate);
            $('#school-count-end-date').val(data[0].DdlEndDate);
            $('#school-count-lg-begin-date').val(data[0].DdlBegDate);
            $('#school-count-lg-end-date').val(data[0].DdlEndDate);
        }
        if (epipenTableWrapper.schoolCountTable) epipenTableWrapper.schoolCountTable.destroy();
        $('table#school-count-table tbody').html('');
        var primaryCol = $('input[name=screleasedate]:checked').val();
        $('table#school-count-table thead tr').children().first().text(primaryCol === '' ? 'School State' : 'Processed Date');
        $.each(data, function (index, item) {
            var begDate = primaryCol === '' || item.SchoolState === 'Grand Total:' ? $('#school-count-begin-date').val() : item.SchoolState;
            var endDate = primaryCol === '' || item.SchoolState === 'Grand Total:' ? $('#school-count-end-date').val() : item.SchoolState;
            var state = primaryCol === '' ? item.SchoolState === 'Grand Total:' ? 'All' : item.SchoolState : 'All';
            $('table#school-count-table tbody').append('<tr>' +
                '<td><a href="' + service.getRootUrl() + '/EpipenDetails/SchoolByStateDetails?begDate=' + begDate + '&endDate=' + endDate +
                '&inpCustomerCategory=' + $('#school-count-inpCustomerCategory').val() + '&disneySchoolId=All&state=' + state +
                '&schoolZip=All&schoolId=All&releaseDate=' + $('input[name=screleasedate]:checked').val() + '" target="_blank">' + item.SchoolState + '</a></td>' +
                '<td>' + numeral(item.DistinctSchoolCount).format('0,0') + '</td>' +
                '<td>' + numeral(item.TotalSchoolCount).format('0,0') + '</td>' +
                '<td>' + numeral(item.SchoolDiff).format('0,0') + '</td>' +
                '</tr>');
        });

        epipenTableWrapper.schoolCountTable = $('#school-count-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 5,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    renderSchoolCountLgTable: function (data) {
        if (data && data.length > 0) {
            $('#school-count-lg-begin-date').val(data[0].DdlBegDate);
            $('#school-count-lg-end-date').val(data[0].DdlEndDate);
        }
        if (epipenTableWrapper.schoolCountLgTable) epipenTableWrapper.schoolCountLgTable.destroy();
        $('table#school-count-lg-table tbody').html('');
        var primaryCol = $('input[name=sclgreleasedate]:checked').val();
        $('table#school-count-lg-table thead tr').children().first().text(primaryCol === '' ? 'School State' : 'Processed Date');
        $.each(data, function (index, item) {
            var begDate = primaryCol === '' || item.SchoolState === 'Grand Total:' ? $('#school-count-lg-begin-date').val() : item.SchoolState;
            var endDate = primaryCol === '' || item.SchoolState === 'Grand Total:' ? $('#school-count-lg-end-date').val() : item.SchoolState;
            var state = primaryCol === '' ? item.SchoolState === 'Grand Total:' ? 'All' : item.SchoolState : 'All';
            $('table#school-count-lg-table tbody').append('<tr>' +
                '<td><a href="' + service.getRootUrl() + '/EpipenDetails/SchoolByStateDetails?begDate=' + begDate + '&endDate=' + endDate +
                '&inpCustomerCategory=' + $('#school-count-lg-inpCustomerCategory').val() + '&disneySchoolId=All&state=' + state +
                '&schoolZip=All&schoolId=All&releaseDate=' + $('input[name=sclgreleasedate]:checked').val() + '" target="_blank">' + item.SchoolState + '</a></td>' +
                '<td>' + numeral(item.DistinctSchoolCount).format('0,0') + '</td>' +
                '<td>' + numeral(item.TotalSchoolCount).format('0,0') + '</td>' +
                '<td>' + numeral(item.SchoolDiff).format('0,0') + '</td>' +
                '</tr>');
        });

        epipenTableWrapper.schoolCountLgTable = $('#school-count-lg-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 10,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    renderOrderQtyTable: function (data) {
        if (data && data.length > 0) {
            $('#order-qty-begin-date').val(data[0].DdlBegDate);
            $('#order-qty-end-date').val(data[0].DdlEndDate);
            $('#order-qty-lg-begin-date').val(data[0].DdlBegDate);
            $('#order-qty-lg-end-date').val(data[0].DdlEndDate);
        }
        if (epipenTableWrapper.orderQtyTable) epipenTableWrapper.orderQtyTable.destroy();
        var primaryCol = $('input[name=oqreleasedate]:checked').val();
        $('table#order-qty-table thead tr').children().first().text(primaryCol === '' ? 'School State' : 'Processed Date');
        $('table#order-qty-table tbody').html('');
        $.each(data, function (index, item) {
            var begDate = primaryCol === '' || item.PrimaryColumn === 'Grand Total:' ? $('#order-qty-begin-date').val() : item.PrimaryColumn;
            var endDate = primaryCol === '' || item.PrimaryColumn === 'Grand Total:' ? $('#order-qty-end-date').val() : item.PrimaryColumn;
            var state = primaryCol === '' ? item.PrimaryColumn === 'Grand Total:' ? 'All' : item.PrimaryColumn : 'All';
            var url = service.getRootUrl() + '/EpipenDetails/EpipenOrderDetails?dateType=na' + '&begDate=' + begDate + '&endDate=' + endDate + '&orderBegDate=' + item.OrderDateBeg + '&orderEndDate=' +
                item.OrderDateEnd + '&inpCustomerCategory=' + $('#order-qty-inpCustomerCategory').val() + '&disneySchoolId=All&state=' + state +
                '&schoolZip=All&schoolId=All&schoolName=All&orderId=-1&batchId=-1&inpPharmacy=All&inpDoctor=All&inpContactName=All&inpSearchOrderId=All&releaseDate=' + primaryCol;
            $('table#order-qty-table tbody').append('<tr>' +
                '<td><a href="' + url +'" target="_blank">' + item.PrimaryColumn + '</a></td>' +
                '<td>' + numeral(item.DistinctSchoolCount).format('0,0') + '</td>' +
                '<td>' + numeral(item.RegFreeQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.RegReplQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.RegDiscQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.JrFreeQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.JrReplQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.JrDiscQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.OtherFreeQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.TotalUnits).format('0,0') + '</td>' +
                '<td style="background-color: #fff;"></td>' +
                '<td>' + numeral(item.BoxQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.VideosQty).format('0,0') + '</td>' +
                '</tr>');
        });

        epipenTableWrapper.orderQtyTable = $('#order-qty-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 5,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    renderOrderQtyLgTable: function (data) {
        if (data && data.length > 0) {
            $('#order-qty-lg-begin-date').val(data[0].DdlBegDate);
            $('#order-qty-lg-end-date').val(data[0].DdlEndDate);
        }
        if (epipenTableWrapper.orderQtyLgTable) epipenTableWrapper.orderQtyLgTable.destroy();
        var primaryCol = $('input[name=oqlgreleasedate]:checked').val();
        $('table#order-qty-lg-table thead tr').children().first().text(primaryCol === '' ? 'School State' : 'Processed Date');
        $('table#order-qty-lg-table tbody').html('');
        $.each(data, function (index, item) {
            var begDate = primaryCol === '' || item.PrimaryColumn === 'Grand Total:' ? $('#order-qty-lg-begin-date').val() : item.PrimaryColumn;
            var endDate = primaryCol === '' || item.PrimaryColumn === 'Grand Total:' ? $('#order-qty-lg-end-date').val() : item.PrimaryColumn;
            var state = primaryCol === '' ? item.PrimaryColumn === 'Grand Total:' ? 'All' : item.PrimaryColumn : 'All';
            var url = service.getRootUrl() + '/EpipenDetails/EpipenOrderDetails?dateType=na' + '&begDate=' + begDate + '&endDate=' + endDate + '&orderBegDate=' + item.OrderDateBeg + '&orderEndDate=' +
                item.OrderDateEnd + '&inpCustomerCategory=' + $('#order-qty-lg-inpCustomerCategory').val() + '&disneySchoolId=All&state=' + state +
                '&schoolZip=All&schoolId=All&schoolName=All&orderId=-1&batchId=-1&inpPharmacy=All&inpDoctor=All&inpContactName=All&inpSearchOrderId=All&releaseDate=' + primaryCol;
            $('table#order-qty-lg-table tbody').append('<tr>' +
                '<td><a href="' + url + '" target="_blank">' + item.PrimaryColumn + '</a></td>' +
                '<td>' + numeral(item.DistinctSchoolCount).format('0,0') + '</td>' +
                '<td>' + numeral(item.RegFreeQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.RegReplQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.RegDiscQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.JrFreeQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.JrReplQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.JrDiscQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.OtherFreeQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.TotalUnits).format('0,0') + '</td>' +
                '<td style="background-color: #fff;"></td>' +
                '<td>' + numeral(item.BoxQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.VideosQty).format('0,0') + '</td>' +
                '</tr>');
        });

        epipenTableWrapper.orderQtyLgTable = $('#order-qty-lg-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 10,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    renderDetailsOrderQtyTable: function (data) {
        if (epipenTableWrapper.orderQtyTable) epipenTableWrapper.orderQtyTable.destroy();
        var primaryCol = $('input[name=oqreleasedate]:checked').val();
        $('table#order-qty-table thead tr').children().first().text(primaryCol === '' ? 'School State' : 'Processed Date');
        $('table#order-qty-table tbody').html('');
        $.each(data, function (index, item) {
            var begDate = primaryCol === '' || item.PrimaryColumn === 'Grand Total:' ? $('#order-qty-begin-date').val() : item.PrimaryColumn;
            var endDate = primaryCol === '' || item.PrimaryColumn === 'Grand Total:' ? $('#order-qty-end-date').val() : item.PrimaryColumn;
            var state = primaryCol === '' ? item.PrimaryColumn === 'Grand Total:' ? 'All' : item.PrimaryColumn : 'All';
            var url = service.getRootUrl() + '/EpipenDetails/EpipenOrderDetails?dateType=na' + '&begDate=' + begDate + '&endDate=' + endDate + '&orderBegDate=' + item.OrderDateBeg + '&orderEndDate=' +
                item.OrderDateEnd + '&inpCustomerCategory=' + $('#inpCustomerCategory').val() + '&disneySchoolId=All&state=' + state +
                '&schoolZip=' + $('#inpSchoolZip').val() + '&schoolId=' + $('#inpSchoolID').val() + '&schoolName=All&orderId=' + ($('#orderId').val()[0] === 'All' ? '-1' : $('#orderId').val()[0]) + '&batchId=' + ($('#batchId').val()[0] === 'All' ? '-1' : $('#batchId').val()[0]) + '&inpPharmacy=' + $('#inpPharmacy').val() + '&inpDoctor=' + $('#inpDoctor').val() + '&inpContactName=' + $('#inpContactName').val() + '&inpSearchOrderId=All&releaseDate=' + primaryCol;
            $('table#order-qty-table tbody').append('<tr>' +
                '<td><a href="' + url + '" target="_blank">' + item.PrimaryColumn + '</a></td>' +
                '<td>' + numeral(item.RegFreeQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.RegReplQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.RegDiscQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.JrFreeQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.JrReplQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.JrDiscQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.OtherFreeQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.TotalUnits).format('0,0') + '</td>' +
                '<td style="background-color: #fff;"></td>' +
                '<td>' + numeral(item.BoxQty).format('0,0') + '</td>' +
                '<td>' + numeral(item.VideosQty).format('0,0') + '</td>' +
                '</tr>');
        });

        epipenTableWrapper.orderQtyTable = $('#order-qty-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 5,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    renderNewRepeatTable: function (data) {
        if (epipenTableWrapper.newRepeatTable) epipenTableWrapper.newRepeatTable.destroy();
        $('table#new-repeat-table thead tr').children(':nth-child(2)').text('New ' + $('#new-repeat-year').val());
        $('table#new-repeat-table thead tr').children(':nth-child(3)').text('Repeat ' + $('#new-repeat-year').val());
        $('table#new-repeat-table thead tr').children(':nth-child(4)').text('Customers ' + $('#new-repeat-year').val());
        $('table#new-repeat-table thead tr').children(':nth-child(7)').text( $('#new-repeat-year').val() + ' Enrollment %');
        $('table#new-repeat-table tbody').html('');
        var inpCustomerCategory = $('#new-repeat-inpCustomerCategory').val();
        var year = $('#new-repeat-year').val();
        $.each(data, function (index, item) {
            $('table#new-repeat-table tbody').append('<tr>' +
                '<td><a href="' + service.getRootUrl() + '/EpipenDetails/NewRepeatCustomersDetail?inpCustomerCategory=' + inpCustomerCategory + '&disneySchoolId=All&state=' +
                item.State + '&year=' + year + '&zip=All&schoolName=All&schoolId=All&releaseDate=SchoolState" target="_blank">' + item.State + '</a></td>' +
                '<td>' + numeral(item.New).format('0,0') + '</td>' +
                '<td>' + numeral(item.Repeat).format('0,0') + '</td>' +
                '<td>' + numeral(item.Customer).format('0,0') + '</td>' +
                '<td>' + numeral(item.TotalCustomer).format('0,0') + '</td>' +
                '<td>' + item.PerticipatedSchoolPecnt + '%(' + numeral(item.TotalCustomer).format('0,0') + ')</td>' +
                '<td>' + item.EnrollmentSchoolPecnt + '%(' + numeral(item.Enrollment).format('0,0') + ')</td>' +
                '<td>' + item.TotalEnrollmentSchoolPecnt + '%(' + numeral(item.Enrollment).format('0,0') + ')</td>' +
                '</tr>');
        });

        epipenTableWrapper.newRepeatTable = $('#new-repeat-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 5,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    renderLgNewRepeatTable: function (data) {
        if (epipenTableWrapper.newRepeatLgTable) epipenTableWrapper.newRepeatLgTable.destroy();
        $('table#new-repeat-lg-table thead tr').children(':nth-child(2)').text('New ' + $('#new-repeat-lg-year').val());
        $('table#new-repeat-lg-table thead tr').children(':nth-child(3)').text('Repeat ' + $('#new-repeat-lg-year').val());
        $('table#new-repeat-lg-table thead tr').children(':nth-child(4)').text('Customers ' + $('#new-repeat-lg-year').val());
        $('table#new-repeat-lg-table thead tr').children(':nth-child(7)').text($('#new-repeat-lg-year').val() + ' Enrollment %');
        $('table#new-repeat-lg-table tbody').html('');
        var inpCustomerCategory = $('#new-repeat-lg-inpCustomerCategory').val();
        var year = $('#new-repeat-lg-year').val();
        $.each(data, function (index, item) {
            $('table#new-repeat-lg-table tbody').append('<tr>' +
                '<td><a href="' + service.getRootUrl() + '/EpipenDetails/NewRepeatCustomersDetail?inpCustomerCategory=' + inpCustomerCategory + '&disneySchoolId=All&state=' +
                item.State + '&year=' + year + '&zip=All&schoolName=All&schoolId=All&releaseDate=SchoolState" target="_blank">' + item.State + '</a></td>' +
                '<td>' + numeral(item.New).format('0,0') + '</td>' +
                '<td>' + numeral(item.Repeat).format('0,0') + '</td>' +
                '<td>' + numeral(item.Customer).format('0,0') + '</td>' +
                '<td>' + numeral(item.TotalCustomer).format('0,0') + '</td>' +
                '<td>' + item.PerticipatedSchoolPecnt + '%(' + numeral(item.TotalCustomer).format('0,0') + ')</td>' +
                '<td>' + item.EnrollmentSchoolPecnt + '%(' + numeral(item.Enrollment).format('0,0') + ')</td>' +
                '<td>' + item.TotalEnrollmentSchoolPecnt + '%(' + numeral(item.Enrollment).format('0,0') + ')</td>' +
                '</tr>');
        });

        epipenTableWrapper.newRepeatLgTable = $('#new-repeat-lg-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 10,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    downloadNewRepeatSummary: function() {
        window.open(service.getRootUrl() + "/EpipenChart/GetNewRepeatCustomersExport?year=" + $('#new-repeat-year').val() + '&inpCustomerCategory=' + $('#new-repeat-inpCustomerCategory').val() +
            '&disneySchoolId=All&state=' + $('#new-repeat-state').val(), '_blank');
    },

    downloadNewRepeatSummaryAndDetails: function () {
        var result = confirm("It may take a longer time to download the report an excel. Do you want to continue?");
        if (result === true) {
            window.open(service.getRootUrl() + "/EpipenChart/NewRepeatCustomersDetailExport?year=" + $('#new-repeat-year').val() + '&inpCustomerCategory=' + $('#new-repeat-inpCustomerCategory').val() +
            '&disneySchoolId=All&state=' + $('#new-repeat-state').val() + '&zip=All&schoolName=All&schoolId=All&releaseDate=SchoolState', '_blank');
        }
    },

    downloadNewRepeatSummaryPopup: function () {
        window.open(service.getRootUrl() + "/EpipenChart/GetNewRepeatCustomersExport?year=" + $('#new-repeat-lg-year').val() + '&inpCustomerCategory=' + $('#new-repeat-lg-inpCustomerCategory').val() +
            '&disneySchoolId=All&state=' + $('#new-repeat-lg-state').val(), '_blank');
    },

    downloadNewRepeatSummaryAndDetailsPopup: function () {
        var result = confirm("It may take a longer time to download the report an excel. Do you want to continue?");
        if (result === true) {
            window.open(service.getRootUrl() + "/EpipenChart/NewRepeatCustomersDetailExport?year=" + $('#new-repeat-lg-year').val() + '&inpCustomerCategory=' + $('#new-repeat-lg-inpCustomerCategory').val() +
            '&disneySchoolId=All&state=' + $('#new-repeat-lg-state').val() + '&zip=All&schoolName=All&schoolId=All&releaseDate=SchoolState', '_blank');
        }
    },

    downloadSchoolCountSummary: function () {
        var dateType = $('#school-count-bg button.btn-selected').attr('data-date');
        window.open(service.getRootUrl() + "/EpipenChart/GetSchoolCountsExport?begDate=" + $('#school-count-begin-date').val() + '&endDate=' + $('#school-count-end-date').val() +
                '&dateType=na&inpCustomerCategory=' + $('#school-count-inpCustomerCategory').val() + '&disneySchoolId=All&inpStateReleaseDate=' + $('input[name=screleasedate]:checked').val(), '_blank');
    },

    downloadSchoolCountSummaryAndDetails: function () {
        var result = confirm("It may take a longer time to download the report an excel. Do you want to continue?");
        if (result === true) {
            var dateType = $('#school-count-bg button.btn-selected').attr('data-date');
            window.open(service.getRootUrl() + "/EpipenChart/SchoolByStateDetailsExport?begDate=" + $('#school-count-begin-date').val() + '&endDate=' + $('#school-count-end-date').val() +
                '&dateType=na&inpCustomerCategory=' + $('#school-count-inpCustomerCategory').val() + '&disneySchoolId=All&releaseDate=' + $('input[name=screleasedate]:checked').val() + 
                '&state=All&schoolZip=All&schoolId=All', '_blank');
        }
    },

    downloadSchoolCountSummaryPopup: function () {
        var dateType = $('#school-count-bg-lg button.btn-selected').attr('data-date');
        window.open(service.getRootUrl() + "/EpipenChart/GetSchoolCountsExport?begDate=" + $('#school-count-lg-begin-date').val() + '&endDate=' + $('#school-count-lg-end-date').val() +
                '&dateType=na&inpCustomerCategory=' + $('#school-count-lg-inpCustomerCategory').val() + '&disneySchoolId=All&inpStateReleaseDate=' + $('input[name=sclgreleasedate]:checked').val(), '_blank');
    },

    downloadSchoolCountSummaryAndDetailsPopup: function () {
        var result = confirm("It may take a longer time to download the report an excel. Do you want to continue?");
        if (result === true) {
            var dateType = $('#school-count-bg-lg button.btn-selected').attr('data-date');
            window.open(service.getRootUrl() + "/EpipenChart/SchoolByStateDetailsExport?begDate=" + $('#school-count-lg-begin-date').val() + '&endDate=' + $('#school-count-lg-end-date').val() +
                '&dateType=na&inpCustomerCategory=' + $('#school-count-lg-inpCustomerCategory').val() + '&disneySchoolId=All&releaseDate=' + $('input[name=sclgreleasedate]:checked').val() +
                '&state=All&schoolZip=All&schoolId=All', '_blank');
        }
    },

    downloadOrderQtySummary: function () {
        var dateType = $('#order-qty-bg button.btn-selected').attr('data-date');
        window.open(service.getRootUrl() + "/EpipenChart/GetOrderQtysExport?begDate=" + $('#order-qty-begin-date').val() + '&endDate=' + $('#order-qty-end-date').val() +
                '&dateType=na&inpCustomerCategory=' + $('#order-qty-inpCustomerCategory').val() + '&disneySchoolId=All&inpStateReleaseDate=' + $('input[name=oqreleasedate]:checked').val(), '_blank');
    },

    downloadOrderQtySummaryAndDetails: function () {
        var result = confirm("It may take a longer time to download the report an excel. Do you want to continue?");
        if (result === true) {
            var dateType = $('#order-qty-bg button.btn-selected').attr('data-date');
            window.open(service.getRootUrl() + "/EpipenChart/EpipenOrderDetailsExport?begDate=" + $('#order-qty-begin-date').val() + '&endDate=' + $('#order-qty-end-date').val() +
                    '&dateType=na&inpCustomerCategory=' + $('#order-qty-inpCustomerCategory').val() + '&disneySchoolId=All&releaseDate=' + $('input[name=oqreleasedate]:checked').val() +
                    '&state=All&schoolZip=All&schoolId=All&schoolName=All&orderId=-1&batchId=-1&inpPharmacy=All&inpDoctor=All&inpContactName=All&inpSearchOrderId=All', '_blank');
        }
    },

    downloadOrderQtySummaryPopup: function () {
        var dateType = $('#order-qty-bg-lg button.btn-selected').attr('data-date');
        window.open(service.getRootUrl() + "/EpipenChart/GetOrderQtysExport?begDate=" + $('#order-qty-lg-begin-date').val() + '&endDate=' + $('#order-qty-lg-end-date').val() +
                '&dateType=na&inpCustomerCategory=' + $('#order-qty-lg-inpCustomerCategory').val() + '&disneySchoolId=All&inpStateReleaseDate=' + $('input[name=oqlgreleasedate]:checked').val(), '_blank');
    },

    downloadOrderQtySummaryAndDetailsPopup: function () {
        var result = confirm("It may take a longer time to download the report an excel. Do you want to continue?");
        if (result === true) {
            var dateType = $('#order-qty-bg-lg button.btn-selected').attr('data-date');
            window.open(service.getRootUrl() + "/EpipenChart/EpipenOrderDetailsExport?begDate=" + $('#order-qty-lg-begin-date').val() + '&endDate=' + $('#order-qty-lg-end-date').val() +
                    '&dateType=na&inpCustomerCategory=' + $('#order-qty-lg-inpCustomerCategory').val() + '&disneySchoolId=All&releaseDate=' + $('input[name=oqlgreleasedate]:checked').val() +
                    '&state=All&schoolZip=All&schoolId=All&schoolName=All&orderId=-1&batchId=-1&inpPharmacy=All&inpDoctor=All&inpContactName=All&inpSearchOrderId=All', '_blank');
        }
    },
};