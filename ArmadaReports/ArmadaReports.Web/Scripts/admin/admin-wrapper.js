var adminWrapper = {
    afrezzaProgram: '77',
    allPanels: [],
    initPanelInfo: function (data) {
        adminWrapper.allPanels = data;
        $('#panel-select').multiSelect('destroy');
        $('#panel-select').html('');
        $('#panel-dmgr-select').multiSelect('destroy');
        $('#panel-dmgr-select').html('');
        $('#panel-pmgr-select').multiSelect('destroy');
        $('#panel-pmgr-select').html('');
        $('#panel-srep-select').multiSelect('destroy');
        $('#panel-srep-select').html('');
        var nonSelectedItems = [];
        var selectedItems = [];
        $.each(data, function (index, item) {
            if (item.Order === 0 || item.Order === -1)
                nonSelectedItems.push(item);
            else {
                selectedItems.push(item);
            }
        });
        nonSelectedItems.sort(function (a, b) { return a.Name > b.Name ? 1 : (a.Name < b.Name ? -1 : 0) });
        selectedItems.sort(function (a, b) { return a.Order > b.Order ? 1 : (a.Order < b.Order ? -1 : 0) });
        $.each(nonSelectedItems, function (index, item) {
            $('#panel-select').append('<option value="' + item.Id + '">' + item.Name + '</option>');
        });
        $.each(selectedItems, function (index, item) {
            $('#panel-select').append('<option value="' + item.Id + '" selected>' + item.Name + '</option>');
            $('#panel-pmgr-select').append('<option value="' + item.Id + '" ' + (item.AllowProgramMgr ? 'selected' : '') + '>' + item.Name + '</option>');
            $('#panel-dmgr-select').append('<option value="' + item.Id + '" ' + (item.AllowDistirctMgr ? 'selected' : '') + '>' + item.Name + '</option>');
            $('#panel-srep-select').append('<option value="' + item.Id + '" ' + (item.AllowSalesRep ? 'selected' : '') + '>' + item.Name + '</option>');
        });
        $('#panel-select').multiSelect({
            keepOrder: true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available Panels</div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned Panels</div>",
            afterSelect: function (values) {
                $.each(values, function (index, value) {
                    var item = adminWrapper.allPanels.find(x => x.Id == value);
                    if (item) {
                        $('#panel-pmgr-select').multiSelect('addOption', { value: item.Id, text: item.Name });
                        $('#panel-dmgr-select').multiSelect('addOption', { value: item.Id, text: item.Name });
                        $('#panel-srep-select').multiSelect('addOption', { value: item.Id, text: item.Name });
                    }
                });
                setTimeout(function () {
                    $('.ms-list').sortable();
                }, 200);
            },
            afterDeselect: function (values) {
                $.each(values, function (index, value) {
                    var item = adminWrapper.allPanels.find(x => x.Id == value);
                    if (item) {
                        $("#panel-pmgr-select option[value=\"" + item.Id + "\"]").remove();
                        $('#panel-pmgr-select').multiSelect('refresh');
                        $("#panel-dmgr-select option[value=\"" + item.Id + "\"]").remove();
                        $('#panel-dmgr-select').multiSelect('refresh');
                        $("#panel-srep-select option[value=\"" + item.Id + "\"]").remove();
                        $('#panel-srep-select').multiSelect('refresh');
                    }
                });
                setTimeout(function () {
                    $('.ms-list').sortable();
                }, 200);
            }
        });
        $('#panel-pmgr-select').multiSelect({
            keepOrder: true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available Panels for <strong>Program Manager</strong></div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned Panels for <strong>Program Manager</strong></div>"
        });
        $('#panel-dmgr-select').multiSelect({
            keepOrder: true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available Panels for <strong>District Manager</strong></div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned Panels for <strong>District Manager</strong></div>"
        });
        $('#panel-srep-select').multiSelect({
            keepOrder: true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available Panels for <strong>Sales Rep</strong></div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned Panels for <strong>Sales Rep</strong></div>"
        });

        setTimeout(function () {
            $('.ms-list').sortable();
        }, 200);
    },

    initReportInfo: function (data) {
        adminWrapper.allreports = data;
        $('#report-select').multiSelect('destroy');
        $('#report-select').html('');
        $('#report-dmgr-select').multiSelect('destroy');
        $('#report-dmgr-select').html('');
        $('#report-pmgr-select').multiSelect('destroy');
        $('#report-pmgr-select').html('');
        $('#report-srep-select').multiSelect('destroy');
        $('#report-srep-select').html('');
        var nonSelectedItems = [];
        var selectedItems = [];
        $.each(data, function (index, item) {
            if (item.Order === 0 || item.Order === -1)
                nonSelectedItems.push(item);
            else {
                selectedItems.push(item);
            }
        });
        nonSelectedItems.sort(function (a, b) { return a.Name > b.Name ? 1 : (a.Name < b.Name ? -1 : 0) });
        selectedItems.sort(function (a, b) { return a.Order > b.Order ? 1 : (a.Order < b.Order ? -1 : 0) });
        $.each(nonSelectedItems, function (index, item) {
            $('#report-select').append('<option value="' + item.Id + '">' + item.Name + '</option>');
        });
        $.each(selectedItems, function (index, item) {
            $('#report-select').append('<option value="' + item.Id + '" selected>' + item.Name + '</option>');
            $('#report-pmgr-select').append('<option value="' + item.Id + '" ' + (item.AllowProgramMgr ? 'selected' : '') + '>' + item.Name + '</option>');
            $('#report-dmgr-select').append('<option value="' + item.Id + '" ' + (item.AllowDistirctMgr ? 'selected' : '') + '>' + item.Name + '</option>');
            $('#report-srep-select').append('<option value="' + item.Id + '" ' + (item.AllowSalesRep ? 'selected' : '') + '>' + item.Name + '</option>');
        });
        $('#report-select').multiSelect({
            keepOrder: true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available reports</div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned reports</div>",
            afterSelect: function (values) {
                $.each(values, function (index, value) {
                    var item = adminWrapper.allreports.find(x => x.Id == value);
                    if (item) {
                        $('#report-pmgr-select').multiSelect('addOption', { value: item.Id, text: item.Name });
                        $('#report-dmgr-select').multiSelect('addOption', { value: item.Id, text: item.Name });
                        $('#report-srep-select').multiSelect('addOption', { value: item.Id, text: item.Name });
                    }
                });
                setTimeout(function () {
                    $('.ms-list').sortable();
                }, 200);
            },
            afterDeselect: function (values) {
                $.each(values, function (index, value) {
                    var item = adminWrapper.allreports.find(x => x.Id == value);
                    if (item) {
                        $("#report-pmgr-select option[value=\"" + item.Id + "\"]").remove();
                        $('#report-pmgr-select').multiSelect('refresh');
                        $("#report-dmgr-select option[value=\"" + item.Id + "\"]").remove();
                        $('#report-dmgr-select').multiSelect('refresh');
                        $("#report-srep-select option[value=\"" + item.Id + "\"]").remove();
                        $('#report-srep-select').multiSelect('refresh');
                    }
                });
                setTimeout(function () {
                    $('.ms-list').sortable();
                }, 200);
            }
        });
        $('#report-pmgr-select').multiSelect({
            keepOrder: true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available reports for <strong>Program Manager</strong></div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned reports for <strong>Program Manager</strong></div>"
        });
        $('#report-dmgr-select').multiSelect({
            keepOrder: true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available reports for <strong>District Manager</strong></div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned reports for <strong>District Manager</strong></div>"
        });
        $('#report-srep-select').multiSelect({
            keepOrder: true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available reports for <strong>Sales Rep</strong></div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned reports for <strong>Sales Rep</strong></div>"
        });

        setTimeout(function () {
            $('.ms-list').sortable();
        }, 200);
    },

    initDetailsFieldInfo: function (data) {
        adminWrapper.allfields = data;
        $('#field-select').multiSelect('destroy');
        $('#field-select').html('');
        $('#field-dmgr-select').multiSelect('destroy');
        $('#field-dmgr-select').html('');
        $('#field-pmgr-select').multiSelect('destroy');
        $('#field-pmgr-select').html('');
        $('#field-srep-select').multiSelect('destroy');
        $('#field-srep-select').html('');
        var nonSelectedItems = [];
        var selectedItems = [];
        $.each(data, function (index, item) {
            if (item.Order === 0 || item.Order === -1)
                nonSelectedItems.push(item);
            else {
                selectedItems.push(item);
            }
        });
        nonSelectedItems.sort(function (a, b) { return a.Name > b.Name ? 1 : (a.Name < b.Name ? -1 : 0) });
        selectedItems.sort(function (a, b) { return a.Order > b.Order ? 1 : (a.Order < b.Order ? -1 : 0) });
        $.each(nonSelectedItems, function (index, item) {
            $('#field-select').append('<option custom-name="' + adminWrapper.getCustomName(item) + '" value="' + item.Id + '">' + item.Name + '</option>');
        });
        $.each(selectedItems, function (index, item) {
            $('#field-select').append('<option custom-name="' + adminWrapper.getCustomName(item) + '" value="' + item.Id + '" selected>' + item.Name + '</option>');
            $('#field-pmgr-select').append('<option value="' + item.Id + '" ' + (item.AllowProgramMgr ? 'selected' : '') + '>' + item.Name + '</option>');
            $('#field-dmgr-select').append('<option value="' + item.Id + '" ' + (item.AllowDistirctMgr ? 'selected' : '') + '>' + item.Name + '</option>');
            $('#field-srep-select').append('<option value="' + item.Id + '" ' + (item.AllowSalesRep ? 'selected' : '') + '>' + item.Name + '</option>');
        });
        $('#field-select').multiSelect({
            keepOrder: true,
            dblClick:true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available fields</div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned fields</div>",
            afterInit: function (ms) {
                var that = this;
                $.each($("#ms-field-select .ms-selection ul.ms-list .ms-elem-selection"), function (i, v) {
                    $(v).append('<span><input type="text" class="field-edit form-control-inline" value="' + $(v).attr('custom-name') + '"></span>');
                })
            },
            afterSelect: function (values) {
                $.each(values, function (index, value) {
                    var item = adminWrapper.allfields.find(x => x.Id == value);
                    if (item) {
                        $('#field-pmgr-select').multiSelect('addOption', { value: item.Id, text: item.Name });
                        $('#field-dmgr-select').multiSelect('addOption', { value: item.Id, text: item.Name });
                        $('#field-srep-select').multiSelect('addOption', { value: item.Id, text: item.Name });
                    }
                });
                setTimeout(function () {
                    $('.ms-list').sortable();
                }, 200);
            },
            afterDeselect: function (values) {
                $.each(values, function (index, value) {
                    var item = adminWrapper.allfields.find(x => x.Id == value);
                    if (item) {
                        $("#field-pmgr-select option[value=\"" + item.Id + "\"]").remove();
                        $('#field-pmgr-select').multiSelect('refresh');
                        $("#field-dmgr-select option[value=\"" + item.Id + "\"]").remove();
                        $('#field-dmgr-select').multiSelect('refresh');
                        $("#field-srep-select option[value=\"" + item.Id + "\"]").remove();
                        $('#field-srep-select').multiSelect('refresh');
                    }
                });
                setTimeout(function () {
                    $('.ms-list').sortable();
                }, 200);
            }
        });
        $('#field-pmgr-select').multiSelect({
            keepOrder: true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available fields for <strong>Program Manager</strong></div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned fields for <strong>Program Manager</strong></div>"
        });
        $('#field-dmgr-select').multiSelect({
            keepOrder: true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available fields for <strong>District Manager</strong></div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned fields for <strong>District Manager</strong></div>"
        });
        $('#field-srep-select').multiSelect({
            keepOrder: true,
            selectableHeader: "<div class='list-group-item list-group-item-info'>Available fields for <strong>Sales Rep</strong></div>",
            selectionHeader: "<div class='list-group-item list-group-item-info'>Assigned fields for <strong>Sales Rep</strong></div>"
        });

        setTimeout(function () {
            $('.ms-list').sortable();
        }, 200);
    },

    getCustomName: function (item) {
        return (item.CustomName != '' && item.CustomName != ' ' && item.CustomName != null) ? item.CustomName : item.Name;
    },

    selectAll: function (id) {
        $('#' + id).multiSelect('select_all');
    },

    deselectAll: function (id) {
        $('#' + id).multiSelect('deselect_all');
    },

    refreshPanels: function () {
        adminService.getPanelInfo($('#admin-program').val());
    },

    refreshFileds: function () {
        adminService.getDetailsFieldInfo($('#admin-program').val());
    },

    refreshReports: function () {
        adminService.getReportInfo($('#admin-program').val());
    },

    showHideMenuLinks: function (result, privilege) {

        console.log(result);
        $("[id^=link-]").hide();
        $("[id^=parent-]").hide();

        $.each(result, function (index, item) {
            $('#link-' + item.LinkId).show();
            $('#parent-' + item.ParentId).show();
        });

        if (privilege === 'VUMP EpiPen') {
            $("[id^=link-]").hide();
            $("[id^=parent-]").hide();
            $('#link-6').show();
        } else {
            $('#link-6').hide();
        }

        adminService.getMailConfig(privilege);

        utility.toggleDdlOnClick();
    },

    preparePanelData: function () {
        var vals = adminWrapper.getOrderedData('panel-select');
        var dVals = adminWrapper.getOrderedData('panel-dmgr-select');
        var pVals = adminWrapper.getOrderedData('panel-pmgr-select');
        var sVals = adminWrapper.getOrderedData('panel-srep-select');
        //console.log(vals);
        //console.log(dVals);
        //console.log(pVals);
        //console.log(sVals);
        var panels = [];
        var programId = $('#admin-program').val();
        $.each(vals, function (index, item) {
            var p = {
                ProgramId: programId, PanelId: item, PanelOrder: (index + 1),
                AllowDmgr: dVals.indexOf(item) > -1, AllowPmgr: pVals.indexOf(item) > -1,
                AllowSrep: sVals.indexOf(item) > -1
            };
            panels.push(p);
        });
        return panels;
    },

    prepareReportData: function () {
        var vals = adminWrapper.getOrderedData('report-select');
        var dVals = adminWrapper.getOrderedData('report-dmgr-select');
        var pVals = adminWrapper.getOrderedData('report-pmgr-select');
        var sVals = adminWrapper.getOrderedData('report-srep-select');
        console.log(vals);
        console.log(dVals);
        console.log(pVals);
        console.log(sVals);
        var reports = [];
        var programId = $('#admin-program').val();
        $.each(vals, function (index, item) {
            var p = {
                ProgramId: programId, ReportId: item, ReportOrder: (index + 1),
                AllowDmgr: dVals.indexOf(item) > -1, AllowPmgr: pVals.indexOf(item) > -1,
                AllowSrep: sVals.indexOf(item) > -1
            };
            reports.push(p);
        });
        console.log('reports data: ', reports);
        return reports;
    },

    prepareFieldData: function () {
        var vals = adminWrapper.getOrderedData('field-select');
        var customVals = adminWrapper.getFieldOrderedData('field-select');
        var dVals = adminWrapper.getOrderedData('field-dmgr-select');
        var pVals = adminWrapper.getOrderedData('field-pmgr-select');
        var sVals = adminWrapper.getOrderedData('field-srep-select');
        var fileds = [];
        var programId = $('#admin-program').val();
        $.each(vals, function (index, item) {
            var f = {
                ProgramId: programId, FieldId: item, Order: (index + 1),
                CustomName: customVals[index] ? customVals[index] : ' ',
                AllowDmgr: dVals.indexOf(item) > -1, AllowPmgr: pVals.indexOf(item) > -1,
                AllowSrep: sVals.indexOf(item) > -1
            };
            fileds.push(f);
        });
        console.log(fileds);
        return fileds;
    },

    getOrderedData: function (id) {
        var selectedData = [];
        var selectedSpans = $('#ms-' + id + ' .ms-selection ul.ms-list li.ms-selected span');
        var selectedOptions = $('#' + id + ' option:selected');
        $.each(selectedSpans, function (index, item) {
            $.each(selectedOptions, function (index2, item2) {
                if ($(item).text() === $(item2).text())
                    selectedData.push($(item2).attr('value'));
            });
        });
        return selectedData;
    },

    getFieldOrderedData: function (id) {
        var selectedData = [];
        var selectedSpans = $('#ms-' + id + ' .ms-selection ul.ms-list li.ms-selected');
        var selectedOptions = $('#' + id + ' option:selected');
        $.each(selectedSpans, function (index, item) {
            $.each(selectedOptions, function (index2, item2) {
                if ($(item).find('span').text() === $(item2).text())
                    selectedData.push($(item).find('.field-edit').val());
            });
        });
        return selectedData;
    },

    prepareMailTemplateData: function () {
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var phoneRegex = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;

        //afrezza
        if ($('#program').val() === adminWrapper.afrezzaProgram && !$('#mc-a-manager-name option:selected').text()) {
            alert('Please enter manager name!');
            return false;
        }
        if ($('#program').val() === adminWrapper.afrezzaProgram && !$('#mc-a-manager-email').val()) {
            alert('Please enter manager email address!');
            return false;
        }
        if ($('#program').val() === adminWrapper.afrezzaProgram && !emailRegex.test($('#mc-a-manager-email').val())) {
            alert('Please enter valid manager email address!');
            return false;
        }
        if ($('#program').val() === adminWrapper.afrezzaProgram && !$('#mc-a-manager-name option:selected').text()) {
            alert('Please enter manager name!');
            return false;
        }

        //not afrezza
        if ($('#program').val() !== adminWrapper.afrezzaProgram && !$('#mc-first-name').val()) {
            alert('Please enter first name!');
            return false;
        }
        if ($('#program').val() !== adminWrapper.afrezzaProgram && !$('#mc-last-name').val()) {
            alert('Please enter last name!');
            return false;
        }

        //common
        if (!$('#mc-aspnid').val() && !$('#reset-password').is(':checked')) {
            alert('Please enter ASPN ID!');
            return false;
        }
        if (!$('#mc-email').val()) {
            alert('Please enter email address!');
            return false;
        }
        if (!emailRegex.test($('#mc-email').val())) {
            alert('Please enter valid email address!');
            return false;
        }
        if (!$('#mc-subject').val()) {
            alert('Please enter subject!');
            return false;
        }
        if (!$('#mc-description').val()) {
            alert('Please enter a short description!');
            return false;
        }
        if ($('#mc-description').val().length > 250) {
            alert('Description must be limitt to 250 characters!');
            return false;
        }
        if (!$('#mc-hcp-first-name').val() && !$('#reset-password').is(':checked')) {
            alert('Please enter HCP forst name!');
            return false;
        }
        if (!$('#mc-hcp-last-name').val() && !$('#reset-password').is(':checked')) {
            alert('Please enter HCP last name!');
            return false;
        }
        if (!$('#mc-hcp-phone').val() && !$('#reset-password').is(':checked')) {
            alert('Please enter HCP phone number!');
            return false;
        }
        if (!phoneRegex.test($('#mc-hcp-phone').val()) && !$('#reset-password').is(':checked')) {
            alert('Please enter valid HCP phone number!');
            return false;
        }
        if (!$('#mc-address').val() && !$('#reset-password').is(':checked')) {
            alert('Please enter address!');
            return false;
        }
        if (!$('#mc-city').val() && !$('#reset-password').is(':checked')) {
            alert('Please enter city name!');
            return false;
        }
        if (!$('#mc-state').val() && !$('#reset-password').is(':checked')) {
            alert('Please enter state name!');
            return false;
        }
        if (!$('#mc-zip').val() && !$('#reset-password').is(':checked')) {
            alert('Please enter zip code!');
            return false;
        }

        //not afrezza
        if ($('#program').val() !== adminWrapper.afrezzaProgram && !$('#mc-manager-name option:selected').text()) {
            alert('Please enter manager name!');
            return false;
        }
        if ($('#program').val() !== adminWrapper.afrezzaProgram && !$('#mc-manager-email').val()) {
            alert('Please enter manager email address!');
            return false;
        }
        if ($('#program').val() !== adminWrapper.afrezzaProgram && !emailRegex.test($('#mc-manager-email').val())) {
            alert('Please enter valid manager email address!');
            return false;
        }

        var mailConfig = {
            ProgramId: $('#program').val(),
            FirstName: $('#program').val() !== adminWrapper.afrezzaProgram ? $('#mc-first-name').val() : $('#mc-a-rep-name').val(),
            LastName: $('#program').val() !== adminWrapper.afrezzaProgram ? $('#mc-last-name').val() : '',
            AspnId: $('#mc-aspnid').val() ? $('#mc-aspnid').val() : '',
            Email: $('#mc-email').val(),
            Subject: $('#mc-subject').val(),
            Description: $('#mc-description').val(),
            HcpFirstName: $('#mc-hcp-first-name').val() ? $('#mc-hcp-first-name').val() : '',
            HcpLastName: $('#mc-hcp-last-name').val() ? $('#mc-hcp-last-name').val() : '',
            HcpPhone: $('#mc-hcp-phone').val() ? $('#mc-hcp-phone').val() : '',
            ManagerName: $('#program').val() !== adminWrapper.afrezzaProgram ? $('#mc-manager-name option:selected').text() : $('#mc-a-manager-name option:selected').text(),
            ManagerEmail: $('#program').val() !== adminWrapper.afrezzaProgram ? $('#mc-manager-email').val() : $('#mc-a-manager-email').val(),
            Address: $('#mc-address').val() ? $('#mc-address').val() : '',
            City: $('#mc-city').val() ? $('#mc-city').val() : '',
            State: $('#mc-state').val() ? $('#mc-state').val() : '',
            Zip: $('#mc-zip').val() ? $('#mc-zip').val() : '',
            HcpOfficialContact: $('#mc-hcp-official-contact').val() ? $('#mc-hcp-official-contact').val() : ''
        };
        return mailConfig;
    },

    clearMailTemplateData: function () {
        $('#mc-first-name').val('');
        $('#mc-last-name').val('');
        $('#mc-email').val('');
        $('#mc-aspnid').val('');
        $('#mc-description').val('');
        $('#mc-subject').val('');
        $('#mc-hcp-first-name').val('');
        $('#mc-hcp-last-name').val('');
        $('#mc-hcp-official-contact').val('');
        $('#mc-hcp-phone').val('');
        $('#mc-manager-name').val('');
        $('#mc-manager-email').val('');
        $('#mc-a-manager-name').val('');
        $('#mc-a-manager-email').val('');
        $('#mc-a-rep-name').val('');
        $('#mc-address').val('');
        $('#mc-city').val('');
        $('#mc-state').val('');
        $('#mc-zip').val('');
        $('#reset-password').prop('checked', false);
    },

    onResetPassword: function () {
        if ($('#reset-password').is(':checked')) {
            $('label[for="mc-aspnid"]').text('ASPN ID:');
            $('label[for="mc-hcp-first-name"]').text('HCP First Name:');
            $('label[for="mc-hcp-last-name"]').text('HCP Last Name:');
            $('label[for="mc-hcp-official-contact"]').text('Best Office Contact:');
            $('label[for="mc-hcp-phone"]').text('Phone:');
            $('label[for="mc-address"]').text('Address:');
            $('label[for="mc-city"]').text('City:');
            $('label[for="mc-state"]').text('State:');
            $('label[for="mc-zip"]').text('Zip:');
        } else {
            $('label[for="mc-aspnid"]').text('* ASPN ID:');
            $('label[for="mc-hcp-first-name"]').text('* HCP First Name:');
            $('label[for="mc-hcp-last-name"]').text('* HCP Last Name:');
            $('label[for="mc-hcp-official-contact"]').text('* Best Office Contact:');
            $('label[for="mc-hcp-phone"]').text('* Phone:');
            $('label[for="mc-address"]').text('* Address:');
            $('label[for="mc-city"]').text('* City:');
            $('label[for="mc-state"]').text('* State:');
            $('label[for="mc-zip"]').text('* Zip:');
        }
    },

    preparePopupMail: function () {
        if ($('#program').val() === adminWrapper.afrezzaProgram) {
            $('#n-manager-email-div').hide();
            $('#n-manager-name-div').hide();
            $('#mc-manager-email-div').hide();
            $('#mc-manager-name-div').hide();
            $('#a-manager-email-div').show();
            $('#a-manager-name-div').show();
            $('#a-rep-name-div').show();
        } else {
            $('#n-manager-email-div').show();
            $('#n-manager-name-div').show();
            $('#mc-manager-email-div').show();
            $('#mc-manager-name-div').show();
            $('#a-manager-email-div').hide();
            $('#a-manager-name-div').hide();
            $('#a-rep-name-div').hide();
        }
    }
};