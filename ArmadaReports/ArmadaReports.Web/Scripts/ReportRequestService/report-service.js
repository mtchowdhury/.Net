var reportService = {
    reportDataTable:null,
    getReportRequest: function () {
        $('#loading-rr').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Details/GetReportRequest",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (reportService.reportDataTable) reportService.reportDataTable.destroy();

                $('#table-report-request tbody').html('');
                if (result && result.length > 0) {
                    $.each(result, function (index, item) {
                        if (item.Status === 1)//Requested
                        {
                            $('#table-report-request tbody').append('<tr>' +
                                '<td>' + item.RequestedReport + '</td>' +
                                '<td>' + item.ProgramName + '</td>' +
                                '<td>' + item.RequestedOn + '</td>' +
                                '<td>' + item.GeneratedOn + '</td>' +
                                '<td>' + item.DownloadedOn + '</td>' +
                                '<td></td>' +
                                '<td>..<i class="fa fa-reply rr-icon" title="Requested"></i></td>' + '</tr>');
                        }
                        else if (item.Status >= 3 && item.Status!==5)//Processed. 5 for delete
                        {
                            $('#table-report-request tbody').append('<tr>' +
                                '<td>' + item.RequestedReport + '</td>' +
                                '<td>' + item.ProgramName + '</td>' +
                                '<td>' + item.RequestedOn + '</td>' +
                                '<td>' + item.GeneratedOn + '</td>' +
                                '<td>' + item.DownloadedOn + '</td>' +
                                '<td>' + (item.FileSize / 1024).toFixed(2) + 'KB</td>' +
                                 '<td>'
                                + '<i style="cursor:pointer" class="fa fa-file-excel-o rr-icon rr-icon-excel" title="Download Excel" onclick="reportService.downLoadReport(' + item.Id + ',' +'\'xlsx'+'\')"> </i>'
                                    + '&nbsp &nbsp'
                                + '<i style="cursor:pointer" class="fa fa-file-pdf-o rr-icon rr-icon-pdf" title="Download PDF" onclick="reportService.downLoadReport(' + item.Id + ',' + '\'pdf' +'\')"> </i>'
                                    + '&nbsp &nbsp'
                                + '<i class="fa fa-trash rr-icon rr-icon-delete" title="Delete" onclick="reportService.deleteFile(' + item.Id + ')"></i>' +
                                '</td></tr>');
                        }
                        else if (item.Status === 2)//Processing
                        {
                            $('#table-report-request tbody').append('<tr>' +
                                '<td>' + item.RequestedReport + '</td>' +
                                '<td>' + item.ProgramName + '</td>' +
                                '<td>' + item.RequestedOn + '</td>' +
                                '<td>' + item.GeneratedOn + '</td>' +
                                '<td>' + item.DownloadedOn + '</td>' +
                                '<td></td>' +
                                '<td>..<i class="fa fa-clock-o rr-icon" title="Processing"></i></td>' + '</tr>');
                        }
                    });
                }

                reportService.reportDataTable = $('#table-report-request').DataTable({
                    'bDestroy': true,
                    'searching': false,
                    'ordering': false,
                    "aaSorting": [],
                    "iDisplayLength": 15,
                    "lengthMenu": [[5, 10, 15, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 15, 25, 50, 100, 200, 500, 1000, "All"]],
                    //"sDom": '<"top"flp>rt<"bottom"i><"clear">'
                });
                $('#loading-rr').hide();
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
                $('#loading-rr').hide();
            }
        });
    },
    downLoadReport: function (reportId, reportType) {
        window.open(service.getRootUrl() + "/Details/DownloadReportByReportIdAndType?reportId=" + reportId + "&reportType=" + reportType);
        reportService.getReportRequest();
    },
    deleteFile: function (reportId) {
        if (confirm("Are you sure?")) {
            $.ajax({
                type: "GET",
                data: {
                    reportId: reportId
                },
                url: service.getRootUrl() + "/Details/DeleteReportFile",
                success: function (result) {
                    alert("File deleted successfully");
                    reportService.getReportRequest();
                },
                error: function (xhr, status, exception) {
                    alert("Error!");
                }
            });
        }
    },
    initReportDataDetails: function () {
        

        
    }
};

