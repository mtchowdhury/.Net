var adminService = {
    getPrograms: function () {
        $('#program-loadidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Admin/GetPrograms",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $.each(result, function (index, item) {
                        $('#admin-program').append($('<option>', {
                            value: item.Id,
                            text: item.Name
                        }));
                        $('#admin-t-program').append($('<option>', {
                            value: item.Id,
                            text: item.Name
                        }));
                    });
                    adminService.reload();
                    $('#program-loadidng').hide();
                }
            },
            error: function (xhr, status, exception) {
                $('#program-loadidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPanelInfo: function (programId) {
        $('#panel-loadidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Admin/GetPanelInfo?programId=" + programId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#panel-loadidng').hide();
                service.checkTimeout(result);
                adminWrapper.initPanelInfo(result);
            },
            error: function (xhr, status, exception) {
                $('#panel-loadidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getReportInfo: function (programId) {
        $('#report-loadidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Admin/GetReportInfo?programId=" + programId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#report-loadidng').hide();
                service.checkTimeout(result);
                adminWrapper.initReportInfo(result);
            },
            error: function (xhr, status, exception) {
                $('#report-loadidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsFieldInfo: function (programId) {
        $('#field-loading').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Admin/GetDetailsFieldInfo?programId=" + programId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#field-loading').hide();
                service.checkTimeout(result);
                adminWrapper.initDetailsFieldInfo(result);
            },
            error: function (xhr, status, exception) {
                $('#field-loading').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    reload: function () {
        adminService.getPanelInfo($('#admin-program').val());
        adminService.getDetailsFieldInfo($('#admin-program').val());
        adminService.getReportInfo($('#admin-program').val());
    },

    savePanels: function () {
        $('#panel-loadidng').show();
        $.ajax({
            type: "POST",
            url: service.getRootUrl() + "/Admin/SavePanels",
            data: JSON.stringify({ panels: adminWrapper.preparePanelData() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#panel-loadidng').hide();
                if (result)
                    $('#panel-message').show();
                else
                    alert('Error while saving panel configuration!');
                setTimeout(function () {
                    $('#panel-message').hide();
                }, 3000);
            },
            error: function (xhr, status, exception) {
                $('#panel-loadidng').hide();
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    saveReports: function () {
        $('#report-loadidng').show();
        $.ajax({
            type: "POST",
            url: service.getRootUrl() + "/Admin/SaveReports",
            data: JSON.stringify({ reports: adminWrapper.prepareReportData() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#report-loadidng').hide();
                if (result)
                    $('#report-message').show();
                else
                    alert('Error while saving report configuration!');
                setTimeout(function () {
                    $('#report-message').hide();
                }, 3000);
            },
            error: function (xhr, status, exception) {
                $('#report-loadidng').hide();
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    saveFields: function () {
        $('#field-loading').show();
        $.ajax({
            type: "POST",
            url: service.getRootUrl() + "/Admin/SaveFields",
            data: JSON.stringify({ fields: adminWrapper.prepareFieldData() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result)
                    $('#field-message').show();
                else
                    alert('Error while saving field configuration!');
                $('#field-loading').hide();

                setTimeout(function () {
                    $('#field-message').hide();
                }, 3000);
            },
            error: function (xhr, status, exception) {
                $('#field-loading').hide();
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    refreshPrograms: function () {
        $('#program-loadidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Admin/RefreshPrograms",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result)
                    alert('Program refreshed!');
                else
                    alert('Error while refreshing programs!');
                $('#program-loadidng').hide();
            },
            error: function (xhr, status, exception) {
                $('#program-loadidng').hide();
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    copyProgramPreference: function () {
        $('#c-program-loadidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Config/CopyProgramPreference?sourceProgramId=' + $('#admin-program').val() + '&targetProgramId=' + $('#admin-t-program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result)
                    alert('Program configuration copied successfully!');
                else
                    alert('Error while copying program configration!');
                $('#c-program-loadidng').hide();
            },
            error: function (xhr, status, exception) {
                $('#c-program-loadidng').hide();
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getMailConfig: function (privilege) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Config/GetMailConfig?programId=" + service.getProgramId(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                console.log(result);
                if (privilege !== 'VUMP EpiPen' && result && result.Enabled)
                    $('#send-mail-id').show();
                else
                    $('#send-mail-id').hide();
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    sendEmail: function () {
        var mailConfig = adminWrapper.prepareMailTemplateData();
        if (!mailConfig) return;
        $('#se-loading').show();
        $.ajax({
            type: "POST",
            url: service.getRootUrl() + "/Config/SendEmail",
            data: JSON.stringify({ mailTemplate: mailConfig }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result && result.Success)
                    $('#se-message').text(result.Message);
                else
                    $('#se-message').text(result.Message);
                $('#se-loading').hide();

                setTimeout(function () {
                    $('#se-message').text('');
                    $('#send-email-modal').modal('hide');
                }, 3000);
            },
            error: function (xhr, status, exception) {
                $('#se-loading').hide();
                console.log(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },
};