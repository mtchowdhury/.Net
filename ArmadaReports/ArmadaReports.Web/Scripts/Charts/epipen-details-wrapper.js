var epipenDetailsWrapper = {
    newReaptTable: null,
    schoolStateTable: null,
    orderDetailsTable: null,
    init: function () {
        if (epipenDetailsWrapper.newReaptTable) epipenDetailsWrapper.newReaptTable.destroy();

        epipenDetailsWrapper.newReaptTable = $('#new-repeat-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': true,
            "aaSorting": [],
            "iDisplayLength": 20,
            "lengthMenu": [[5, 10, 20, 50, 100, 200, 500, 1000, -1], [5, 10, 20, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
        $('#new-repeat-table_info').hide();
    },

    schoolStateInit: function () {
        if (epipenDetailsWrapper.schoolStateTable) epipenDetailsWrapper.schoolStateTable.destroy();

        epipenDetailsWrapper.schoolStateTable = $('#school-state-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': true,
            "aaSorting": [],
            "iDisplayLength": 20,
            "lengthMenu": [[5, 10, 20, 50, 100, 200, 500, 1000, -1], [5, 10, 20, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
        $('#new-repeat-table_info').hide();
    },

    orderDetailsInit: function () {
        if (epipenDetailsWrapper.orderDetailsTable) epipenDetailsWrapper.orderDetailsTable.destroy();

        epipenDetailsWrapper.orderDetailsTable = $('#order-details-details-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': true,
            "aaSorting": [],
            "iDisplayLength": 20,
            "lengthMenu": [[5, 10, 20, 50, 100, 200, 500, 1000, -1], [5, 10, 20, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
        $('#order-details-details-table_info').hide();
    },

    onNewRepeatSubmit: function () {
        var queryString = '?inpCustomerCategory=' + $('#inpCustomerCategory').val();
        queryString += '&disneySchoolId=All';
        queryString += '&state=' + $('#state').val();
        queryString += '&year=' + $('#inpYear').val();
        queryString += '&zip=' + $('#inpSchoolZip').val();
        queryString += '&schoolName=' + $('#inpSchoolID option:selected').text();
        queryString += '&schoolId=' + $('#inpSchoolID').val();
        queryString += '&releaseDate=SchoolState';

        window.location = service.getRootUrl() + '/EpipenDetails/NewRepeatCustomersDetail' + queryString;
    },

    onSchoolCountSubmit: function () {
        var queryString = '?inpCustomerCategory=' + $('#inpCustomerCategory').val();
        queryString += '&disneySchoolId=All';
        queryString += '&state=' + $('#state').val();
        queryString += '&begDate=' + $('#school-count-begin-date').val();
        queryString += '&endDate=' + $('#school-count-end-date').val();
        queryString += '&schoolZip=' + $('#inpSchoolZip').val();
        queryString += '&schoolId=' + $('#inpSchoolID').val();
        queryString += '&releaseDate=' + $('input[name=screleasedate]:checked').val();

        window.location = service.getRootUrl() + '/EpipenDetails/SchoolByStateDetails' + queryString;
    },

    onOrderDetailsSubmit: function () {
        var queryString = '?dateType=na&schoolName=All';
        queryString += '&inpCustomerCategory=' + $('#inpCustomerCategory').val();
        queryString += '&disneySchoolId=All';
        queryString += '&state=' + $('#state').val();
        queryString += '&begDate=' + $('#order-qty-begin-date').val();
        queryString += '&endDate=' + $('#order-qty-end-date').val();
        queryString += '&orderBegDate=' + $('#order-qty-order-begin-date').val();
        queryString += '&orderEndDate=' + $('#order-qty-order-end-date').val();
        queryString += '&schoolZip=' + $('#inpSchoolZip').val();
        queryString += '&schoolId=' + $('#inpSchoolID').val();
        queryString += '&releaseDate=' + $('input[name=oqreleasedate]:checked').val();
        queryString += '&orderId=' + ($('#orderId').val()[0] === 'All' ? '-1' : $('#orderId').val()[0]);
        queryString += '&batchId=' + ($('#batchId').val()[0] === 'All' ? '-1' : $('#batchId').val()[0]);
        queryString += '&inpPharmacy=' + $('#inpPharmacy').val();
        queryString += '&inpDoctor=' + $('#inpDoctor').val();
        queryString += '&inpContactName=' + $('#inpContactName').val();
        queryString += '&inpSearchOrderId=All';
        window.location = service.getRootUrl() + '/EpipenDetails/EpipenOrderDetails' + queryString;
    },
};