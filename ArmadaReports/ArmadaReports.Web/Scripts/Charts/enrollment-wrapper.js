var enrollmentWrapper = {
    enrollmentTable: null,

    init: function () {
        if (enrollmentWrapper.aspnPatientTable) enrollmentWrapper.aspnPatientTable.destroy();

        enrollmentWrapper.enrollmentTable = $('#physician-enrollment-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': true,
            "aaSorting": [],
            "iDisplayLength": 20,
            "lengthMenu": [[5, 10, 20, 50, 100, 200, 500, 1000, -1], [5, 10, 20, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
        $('#physician-enrollment-table_info').hide();
    },

    onFilterChange: function () {
        var queryString = '?programId=' + $('#program-id').val();
        queryString += '&programName=' + $('#program-name').val();
        queryString += '&begYear=' + $('#year').val();
        window.location = service.getRootUrl() + '/Enrollment/PhysicianEnrollment' + queryString;
    },

    gotoPhysicianEnrollment: function (year) {
        var queryString = '?programId=' + ($('#program-id').val() ? $('#program-id').val() : localStorage.getItem('enrollment-program-id'));
        queryString += '&programName=' + ($('#program-name').val() ? $('#program-name').val() : localStorage.getItem('enrollment-program-name'));
        queryString += '&begYear=' + year;
        window.open(service.getRootUrl() + '/Enrollment/PhysicianEnrollment' + queryString, '_blank');
    },

    showFilterModal: function() {
        $('#enrollment-filter-modal').modal('show');
    }
};