var service = {
    getExportUrl: function (id, url) {
        url = service.getRootUrl() + url.replace(/&amp;/g, '&');
        $('#' + id).attr('href', url);
    },

    gotoBreadcrumbHome: function (privilege) {
        if (privilege === 'VUMP EpiPen') {
            service.getExportUrl('nav-portal', '/Home/Epipen');
        } else {
            service.getExportUrl('nav-portal', '/Home/Index');
        }
    },

    goToHome: function() {
        window.location = window.location.origin;
    },

    getRootUrl: function () {
        var url = window.location.origin;
        var paths = window.location.pathname.substring(1, window.location.pathname.length).split('/');
        for (var i = 0; i < paths.length - 2; i++) {
            url += '/' + paths[i];
        }
        return url;
    },

    checkTimeout: function (data) {
        if (data && data.Timeout && data.Timeout === '_TIMEOUT_')
            window.location = '/Account/Timeout';
        if (data && data.responseText && data.responseText.indexOf('unauth') > 0)
            window.location = '/Account/UnAuthorized';
        if (data && data.responseText && data.responseText.indexOf('Session Timeout!') > 0)
            window.location = '/Account/Timeout';
    },

    setEnrollmentParams: function () {
        localStorage.removeItem('enrollment-program-id');
        localStorage.removeItem('enrollment-program-name');
        localStorage.setItem('enrollment-program-id', $('#program').val());
        localStorage.setItem('enrollment-program-name', $('#program option:selected').text());
    },

    setNewRxParams: function () {
        localStorage.removeItem('newrx-program-id');
        localStorage.setItem('newrx-program-id', $('#program').val());
    },

    setReferralPharmacyCheckbox: function () {
        if ($('#program').val() === '13' || $('#program').val() === '82') {
            $('#p-referral-div').show();
            $('#p-referral-div-d').show();
        } else {
            $('#p-referral-div').hide();
            $('#p-referral-div-d').hide();
        }
    },

    hideShowAfrezzaPanelTable: function () {
        console.log($('#hid-user-role').val());
        if ($('#hid-user-role').val() === 'PROGRAMMGR') { // only pm can see this menu/report
            $('#aps-table-panel-div').show();
            $('#aps-chart-panel-div').removeClass('col-lg-12 col-md-12');
            $('#aps-chart-panel-div').addClass('col-lg-8 col-md-8');
        } else {
            $('#aps-table-panel-div').hide();
            $('#aps-chart-panel-div').removeClass('col-lg-8 col-md-8');
            $('#aps-chart-panel-div').addClass('col-lg-12 col-md-12');
        }
    },

    initDistrictManagersStrenthOnload: function () {
        $('#strength-tr').val('All');
        $('#strength-tr-d').val('All');
        if ($('#program').val() === '92' || $('#program').val() === '100') {
            $('#strength-tr-div').show();
            $('#strength-tr-div-d').show();
        } else {
            $('#strength-tr-div').hide();
            $('#strength-tr-div-d').hide();
        }
    },

    reload: function () {
        $("[id^=link-]").hide();
        $("[id^=parent-]").hide();
        service.initDistrictManagersStrenthOnload();
        service.getQtdYears();
        service.hideShowAfrezzaPanelTable();
        //service.setReferralPharmacyCheckbox();
        service.setEnrollmentParams();
        service.setNewRxParams();
        utility.resetDateButtons();
        service.setTitles();
        service.saveProgramPreference();
        service.getPanels(); // service.reloadPanels(); goes here
        service.getReportMenuLinks($('#program').val(), $('#hid-user-rolename').val());
        service.saveProgramIdOnLocalStorage();
    },

    saveProgramIdOnLocalStorage: function () {
        localStorage.setItem('programId', $('#program').val());
    },

    getProgramId: function () {
        return $('#program').val() ? $('#program').val() : localStorage.getItem('programId');
    },

    reloadPanels: function () {
        service.userWiseShowHidePanels();
        if ($('#widget-panel-1').is(':visible'))
            service.getPharmacies();
        if ($('#widget-panel-2').is(':visible'))
            service.getPorgramStatus();
        //if ($('#widget-panel-3').is(':visible'))
        //    service.getDistrictManagers();
        if ($('#widget-panel-4').is(':visible'))
            service.getReferralSummaryByWeek();
        if ($('#widget-panel-5').is(':visible'))
            service.getPorgramMaps();
        if ($('#widget-panel-6').is(':visible')) {
            service.getPatientWorkflows();
            service.getPhysicianWorkflows();
        }
        if ($('#widget-panel-7').is(':visible')) {
            service.getFilterValuesByIdWihtoutOrdering('[analytics].[GetPharmacyForReferrals]', $('#program').val(), 'pharmacy-bm');
            service.getFilterValuesByIdWihtoutOrdering('[analytics].[GetPharmacyForReferrals]', $('#program').val(), 'pharmacy-bm-d');
            service.getPharmacyReferrals();
        }
        if ($('#widget-panel-8').is(':visible'))
            service.getTubesFilled();
        if ($('#widget-panel-9').is(':visible'))
            service.getPROrderAnalysis();
        if ($('#widget-panel-10').is(':visible'))
            service.getUniquePatients();
        if ($('#widget-panel-11').is(':visible'))
            service.getOrderAnalysis();
        if ($('#widget-panel-12').is(':visible'))
            service.getRankAndAddress();
        if ($('#widget-panel-13').is(':visible'))
            service.getPAPorgramStatus();
        if ($('#widget-panel-14').is(':visible'))
            service.getPAPorgramMaps();
        if ($('#widget-panel-15').is(':visible'))
            service.getCipherPriorAuth();
        if ($('#widget-panel-16').is(':visible'))
            service.getCallCenterStatictics1();
        if ($('#widget-panel-17').is(':visible'))
            service.getNetworkCapacity();
        if ($('#widget-panel-18').is(':visible'))
            service.getIncomingReferralsByHour();
        if ($('#widget-panel-19').is(':visible'))
            service.get2HourCallKpiPercent();
        if ($('#widget-panel-20').is(':visible'))
            service.get2HourCallVolume();
        if ($('#widget-panel-21').is(':visible'))
            service.getCallCenterStatictics2();
        if ($('#widget-panel-22').is(':visible'))
            service.getHubStatisticsOutboundCalls();
        if ($('#widget-panel-23').is(':visible'))
            service.getQaByQuestionType('qa-compliance-column-chart', 'loading-qa-compliance', 'Compliance');
        if ($('#widget-panel-24').is(':visible'))
            service.getQaByQuestionType('qa-process-column-chart', 'loading-qa-process', 'Process');
        if ($('#widget-panel-25').is(':visible'))
            service.getQaByQuestionType('qa-quality-column-chart', 'loading-qa-quality', 'Quality');
        if ($('#widget-panel-26').is(':visible')) {
            service.getFilterValuesByParamWithCallbacks('[dbo].[rv_GetQuestionsByQuestionType]', 'Compliance', 'compliance-trending-question',
                service.getAnswerStatsByComplianceQuestion);
        }
        if ($('#widget-panel-27').is(':visible')) {
            service.getFilterValuesByParamWithCallbacks('[dbo].[rv_GetQuestionsByQuestionType]', 'Process', 'process-trending-question',
                service.getAnswerStatsByProcessQuestion);
        }
        if ($('#widget-panel-28').is(':visible')) {
            service.getFilterValuesByParamWithCallbacks('[dbo].[rv_GetQuestionsByQuestionType]', 'Quality', 'quality-trending-question',
                service.getAnswerStatsByQualityQuestion);
        }
        if ($('#widget-panel-30').is(':visible'))
            service.getAfrezzaPorgramStatus();
        if ($('#widget-panel-31').is(':visible'))
            service.getMedvantxDeliveredVsExceptionOrderVolume();
        if ($('#widget-panel-32').is(':visible'))
            service.getMedvantxUPS48hrDeliveryOrderVolume();
        if ($('#widget-panel-33').is(':visible'))
            service.getMedvantxUPS48hrDeliverySuccessRate();
        if ($('#widget-panel-34').is(':visible'))
            service.getCleanPathFromBVDirectlyIntoScheduleDelivery();
        if ($('#widget-panel-35').is(':visible'))
            service.getIndirectPathFromBVDirectlyIntoAnyStatus();
        if ($('#widget-panel-36').is(':visible'))
            service.getVolumePercentOfCleanPathVSIndirectPath();
        if ($('#widget-panel-37').is(':visible')) {
            service.getFilterValuesByIdWihtoutOrdering('[analytics].[GetPharmacyForReferrals]', $('#program').val(), 'pharmacy-prc');
            service.getFilterValuesByIdWihtoutOrdering('[analytics].[GetPharmacyForReferrals]', $('#program').val(), 'pharmacy-prc-d');
            service.getPharmacyCReferrals();
        }
        if ($('#widget-panel-38').is(':visible'))
            service.getReferralTimeToProcess();
        if ($('#widget-panel-39').is(':visible')) {
            service.getFilterValuesByIdWihtoutOrdering('[analytics].[GetInsuranceTypes]', $('#program').val(), 'bi-insurance-type', service.getBenfitsInvestigations);
            service.getFilterValuesByIdWihtoutOrdering('[analytics].[GetInsuranceTypes]', $('#program').val(), 'bi-insurance-type-d');
        }
        if ($('#widget-panel-40').is(':visible'))
            service.getCashOptions();
        if ($('#widget-panel-41').is(':visible'))
            service.getSantylData();
        if ($('#widget-panel-42').is(':visible'))
            service.getRegranexData();
        if ($('#widget-panel-43').is(':visible'))
            service.getReferralsWithCopayGt75();
        if ($('#widget-panel-44').is(':visible'))
            service.getHubStatisticsConsignmentChart();
        if ($('#widget-panel-45').is(':visible'))
            service.getPaStatusUpdates();
        if ($('#widget-panel-46').is(':visible'))
            service.getReferralStatus();
        if ($('#widget-panel-47').is(':visible')) {
            service.getFilterValuesByIdWihtoutOrdering('[analytics].[GetPharmacyForReferrals]', $('#program').val(), 'pharmacy-prad');
            service.getFilterValuesByIdWihtoutOrdering('[analytics].[GetPharmacyForReferrals]', $('#program').val(), 'pharmacy-prad-d');
            service.getPharmacyReferralsByAssignedOn();
        }
        if ($('#widget-panel-48').is(':visible')) {
            service.getFilterValuesById('[analytics].[GetPhysicianFirstNames]', $('#program').val(), 'rxc-first-name');
            service.getFilterValuesById('[analytics].[GetPhysicianLastNames]', $('#program').val(), 'rxc-last-name');
            service.getFilterValuesById('[analytics].[GetPhysicianFirstNames]', $('#program').val(), 'rxc-first-name-d');
            service.getFilterValuesById('[analytics].[GetPhysicianLastNames]', $('#program').val(), 'rxc-last-name-d');
            service.getRxcReasonByPrescriber();
        }

        service.getFilterValuesByIdWihtoutOrdering('[analytics].[GetDrugNames]', $('#program').val(), 'bi-drug-name');
        service.getFilterValuesByIdWihtoutOrdering('[analytics].[GetDrugNames]', $('#program').val(), 'bi-drug-name-d');
        service.getFilterValuesById('[analytics].[GetTradeNames]', $('#program').val(), 'strength-tr');
        service.getFilterValuesById('[analytics].[GetTradeNames]', $('#program').val(), 'strength-tr-d');
        service.getFilterValuesById('[analytics].[GetInsuranceTypes]', $('#program').val(), 'select-filter-insurance-type');
    },

    userWiseHideShowDateButtons: function () {
        if ($('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP') {
            $('button[data-date="qtd"]').hide();
            $('ul.qtd-dropdown').hide();
            $('button[data-date="ytd"]').hide();
        }
        //else {
        //    $('button[data-date="qtd"]').show();
        //    $('ul.qtd-dropdown').show();
        //    $('button[data-date="ytd"]').show();
        //}
    },

    userWiseShowHidePanels: function () {
        if ($('#hid-user-role').val() === 'PROGRAMMGR' ||
        (($('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP') && $('#hid-user-rolename').val() === 'Armada employee'))
            service.getDistrictManagers();
        else if ($('#hid-user-role').val() === 'DISTRICTMGR' || $('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP')
            service.getDrilldownDistrictManagers($('#hid-user-id').val());
        else {
            service.getDistrictManagers();
            $('#widget-panel-3').hide();
        }
        if ($('#hid-cipher').val() === "1" && $('#hid-user-role').val() !== 'PROGRAMMGR') {
            $('#pharmacy').hide();
            $('#pharmacy-details').hide();
        } else {
            $('#pharmacy').show();
            $('#pharmacy-details').show();
        }

        if ($('#program').val() === '77') {
            $('#nra').show();
            $('#nrad').show();
        } else {
            $('#nra').hide();
            $('#nrad').hide();
        }
    },

    setTitles: function () {
        $('#tl-title').text($('#program option:selected').text() + ' Days To Fill');
        $('#tm-title').text($('#program option:selected').text() + ' Intake Program Status');
        $('#aps-title').text($('#program option:selected').text() + ' Intake Program Status');
        $('#tr-title').text($('#program option:selected').text() + ' Regional/ District Managers');

        $('#ml-title').text($('#program option:selected').text() + ' Referral By Week');
        $('#mr-title').text($('#program option:selected').text() + ' Referral By Physician State');

        $('#bl-title').text($('#program option:selected').text() + ' Intake Workflow');
        $('#bm-title').text($('#program option:selected').text() + ' Pharmacy Referrals');
        $('#br-title').text($('#program option:selected').text() + ' Tubes Filled (Shipped)');
        $('#br1-title').text($('#program option:selected').text() + ' Unique Patients');
        $('#br2-title').text($('#program option:selected').text() + ' Order Counts (Shipped)');
        $('#br3-title').text($('#program option:selected').text() + ' Practitioner Rank and Address (Shipped)');
        $('#br4-title').text($('#program option:selected').text() + ' Orders by Status');
        $('#br5-title').text($('#program option:selected').text() + ' Orders by Physician State');
        $('#br6-title').text($('#program option:selected').text() + ' Patch Replacement Orders Analysis');
        $('#cipher-title').text($('#program option:selected').text() + ' Prior Authorization');
        $('#informix-panel-title1').text($('#program option:selected').text() + ' Inbound Call Center Data/Statistics');
        $('#informix-panel-title2').text($('#program option:selected').text() + ' Inbound Call Center Data/Statistics');
        $('#network-panel-title').text($('#program option:selected').text() + ' Network Capacity');
        $('#irbh-title').text($('#program option:selected').text() + ' Incoming Referrals By Hour');
        $('#2hck-title').text($('#program option:selected').text() + ' 2 Hour Call KPI Success Rate');
        $('#2hcv-title').text($('#program option:selected').text() + ' 2 Hour Call Volume');
        $('#obc-panel-title').text($('#program option:selected').text() + ' Outbound Call Center Data/Statistics');
        $('#qa-compliance-panel-title').text($('#program option:selected').text() + ' QA Compliance');
        $('#qa-process-panel-title').text($('#program option:selected').text() + ' QA Process');
        $('#qa-quality-panel-title').text($('#program option:selected').text() + ' QA Quality');
        $('#compliance-trending-panel-title').text($('#program option:selected').text() + ' Compliance Trending');
        $('#process-trending-panel-title').text($('#program option:selected').text() + ' Process Trending');
        $('#quality-trending-panel-title').text($('#program option:selected').text() + ' Quality Trending');
        $('#prc-title').text($('#program option:selected').text() + ' Pharmacy Referrals');
        $('#rttp-title').text($('#program option:selected').text() + ' Referral Time To Process');
        $('#bi-title').text($('#program option:selected').text() + ' Benefits Investigation');
        $('#cor-title').text($('#program option:selected').text() + ' Cash Option Referrals');
        $('#sntl-title').text($('#program option:selected').text() + ' Referrals In Process > 2 Days');
        $('#rgnx-title').text($('#program option:selected').text() + ' Referrals In Process > 4 Days');
        $('#rc75-title').text($('#program option:selected').text() + ' Referrals with Copay > 75');
        $('#consignment-panel-title').text($('#program option:selected').text() + ' Consignment – Traditional');
        $('#pa-status-panel-title').text($('#program option:selected').text() + ' PA Status Updates');
        $('#referral-status-panel-title').text($('#program option:selected').text() + ' Referral Status');
        $('#prad-title').text($('#program option:selected').text() + ' Pharmacy referrals by Assigned Date');
        $('#rxc-title').text($('#program option:selected').text() + ' RXC Reason by Prescriber');
    },

    getPanels: function () {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Config/GetPanels?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                utility.hidePanels(result);
                service.reloadPanels();
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getReportMenuLinks: function (programId, privilege) {
        if (programId) {
            $.ajax({
                type: "GET",
                url: service.getRootUrl() + "/Config/GetReportMenuLinks?programId=" + programId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    //console.log('GetReportMenuLinks: ', result);
                    adminWrapper.showHideMenuLinks(result, privilege);
                    //adminService.isExportUser();
                },
                error: function (xhr, status, exception) {
                    console.log(xhr);
                    console.log("Error: " + exception + ", Status: " + status);
                }
            });
        }
    },

    getQtdYears: function () {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetQtdYears",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                console.log(result);
                $('ul.qtd-dropdown li:nth-child(1)').children().text(result.QTD5);
                $('ul.qtd-dropdown li:nth-child(3)').children().text(result.QTD4);
                $('ul.qtd-dropdown li:nth-child(5)').children().text(result.QTD3);
                $('ul.qtd-dropdown li:nth-child(7)').children().text(result.QTD2);
                $('ul.qtd-dropdown li:nth-child(9)').children().text(result.QTD1);
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getFilterValues: function (sp, id) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetFilterValues?sp=" + sp,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#' + id).empty();
                    $.each(result, function (index, item) {
                        $('#' + id).append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getFilterValuesWihtoutOrdering: function (sp, id, callBack) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetFilterValuesWithoutOrdering?sp=" + sp,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#' + id).empty();
                    $.each(result, function (index, item) {
                        $('#' + id).append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    if (callBack) callBack();
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getFilterValuesByIdWihtoutOrdering: function (sp, spId, id, callBack) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetFilterValuesWithoutOrdering?sp=" + sp + (spId ? '&spId=' + spId : ""),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#' + id).empty();
                    $.each(result, function (index, item) {
                        $('#' + id).append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    if (callBack) callBack();
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getFilterValuesById: function (sp, spid, id) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetFilterValuesById?sp=" + sp + '&spid=' + spid,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#' + id).empty();
                    $.each(result, function (index, item) {
                        $('#' + id).append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getFilterValuesByStrIdWithoutRefresh: function (sp, spid, id) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetFilterValuesByStrId?sp=" + sp + '&spid=' + spid,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $.each(result, function (index, item) {
                        $('#' + id).append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getFilterValuesByStrId: function (sp, spid, id) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetFilterValuesByStrId?sp=" + sp + '&spid=' + spid,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#' + id).empty();
                    $.each(result, function (index, item) {
                        $('#' + id).append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },
    getFilterValuesWithoutRefresh: function (sp, id) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetFilterValues?sp=" + sp,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $.each(result, function (index, item) {
                        $('#' + id).append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getTopLeftColumnChartData: function () {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetTopLeftColumnChart",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                columnChartWrapper.renderTopLeftChart(result);
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPorgramStatus: function () {
        $('#loading-tm').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramStatus?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-tm').val() + '&dateType=' + $('#bg-tm button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-tm').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderTopMiddleChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-tm').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsPorgramStatus: function () {
        $('#loading-tm-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramStatus?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-tm-details').val() + '&dateType=' + $('#bg-tm-d button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-tm-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderTopMiddleDetailsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-tm-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPrograms: function () {
        if (($('#hid-user-role').val() === 'SALES REP' || $('#hid-user-role').val() === 'SALESREP') && $('#hid-user-rolename').val() !== 'Armada employee') // for district manager panel only
            $('#widget-panel-3').hide();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetPrograms",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.programs.length > 0) {
                    $.each(result.programs, function (index, item) {
                        $('#program').append($('<option>', {
                            value: item.Id,
                            text: item.Name
                        }));
                    });
                    if (result && result.prefProgram !== '-1')
                        $('#program').val(result.prefProgram);
                    service.saveProgramPreference();

                    service.showHideCipherDates();
                    //service.userWiseHideShowDateButtons();
                    service.searchPhysician('irbh-physician-fname', 'SearchPhysicianByFirstName', service.getIncomingReferralsByHour);
                    service.searchPhysician('irbh-physician-lname', 'SearchPhysicianByLastName', service.getIncomingReferralsByHour);
                    service.searchPhysician('irbh-physician-fname-d', 'SearchPhysicianByFirstName', service.getIncomingReferralsByHourDetails);
                    service.searchPhysician('irbh-physician-lname-d', 'SearchPhysicianByLastName', service.getIncomingReferralsByHourDetails);
                    service.reload();
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },
    getApplications: function () {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetPrograms",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.programs.length > 0) {
                    $.each(result.programs, function (index, item) {
                        $('#application').append($('<option>', {
                            value: item.Id,
                            text: item.Name
                        }));
                    });
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },
    saveProgramPreference: function () {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Config/SaveProgramPreference?programId=' + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    showHideCipherDates: function () {
        if ($('#hid-cipher').val() === "1") {
            $('.btn-group button.not-for-cipher').hide();
            $('.btn-group button.for-cipher').show();
        } else {
            $('.btn-group button.not-for-cipher').show();
            $('.btn-group button.for-cipher').hide();
        }
    },

    getPharmacies: function () {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetPharmacies?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#pharmacy, #pharmacy-details').empty();
                    $.each(result, function (index, item) {
                        $('#pharmacy, #pharmacy-details').append($('<option>', {
                            value: item.Id,
                            text: item.Name
                        }));
                    });
                    service.getDaysToFill();
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDaysToFill: function () {
        $('#loading-tl').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramDaysToFill?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-tl').val() + '&companyId=' + $('#pharmacy').val() + '&priorAuth=' + $('#prior-auth').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-tl').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderTopLeftChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-tl').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsDaysToFill: function () {
        $('#loading-tl-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramDaysToFill?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-tl-details').val() + '&companyId=' + $('#pharmacy-details').val() + '&priorAuth=' + $('#prior-auth-details').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-tl-d').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderTopLeftDetailsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-tl-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDistrictManagers: function () {
        $('#loading-tr').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramDistricts?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-tr').val() +
                '&dateType=' + $('#bg-tr button.btn-selected').attr('data-date') + '&strength=' + $('#strength-tr').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-tr').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderTopRightChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-tr').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsDistrictManagers: function () {
        $('#loading-tr-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramDistricts?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-tr-details').val() +
                '&dateType=' + $('#bg-tr-d button.btn-selected').attr('data-date') + "&strength=" + $('#strength-tr-d').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-tr-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderTopRightDetailsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-tr-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDrilldownDistrictManagers: function (reportsTo, name) {
        if (name) $('#reports-name').val(name);
        if (!reportsTo) reportsTo = $('#reports-to').val();
        $('#loading-tr').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramSalesRep?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-tr').val() + '&dateType=' +
                $('#bg-tr-dd button.btn-selected').attr('data-date') + '&reportTo=' + (reportsTo) + "&strength=" + $('#strength-tr').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-tr').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderTopRightChart(result, name);
            },
            error: function (xhr, status, exception) {
                $('#loading-tr').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsDrilldownDistrictManagers: function (reportsTo, name) {
        if (name) $('#reports-name-d').val(name);
        if (!reportsTo) reportsTo = $('#reports-to-d').val();
        $('#loading-tr-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramSalesRep?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-tr-details').val() +
                '&dateType=' + $('#bg-tr-dd-d button.btn-selected').attr('data-date') + '&reportTo=' + (reportsTo) + "&strength=" + $('#strength-tr-d').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-tr-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderTopRightDetailsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-tr-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPharmacyReferrals: function () {
        $('#loading-bm').show();
        var pharmacy = $('#pharmacy-bm').val() ? $('#pharmacy-bm').val() : '-1';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPharmacyReferrals?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-bm').val() +
                '&dateType=' + $('#bg-bm button.btn-selected').attr('data-date') + '&referral=' + $('input[name=p-referrals]:checked').val() +
                 '&pharmacy=' + pharmacy,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-bm').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderBottomMiddleChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-bm').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsPharmacyReferrals: function () {
        $('#loading-bm-d').show();
        var pharmacy = $('#pharmacy-bm-d').val() ? $('#pharmacy-bm-d').val() : '-1';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPharmacyReferrals?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-bm-details').val() +
                '&dateType=' + $('#bg-bm-d button.btn-selected').attr('data-date') + '&referral=' + $('input[name=p-referrals-d]:checked').val() +
                '&pharmacy=' + pharmacy,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-bm-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderBottomMiddleDetailsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-bm-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getTubesFilled: function () {
        $('#loading-br').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetTubesFilled?programId=" + $('#program').val() + '&dateType=' + $('#bg-br button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br').hide();
                service.checkTimeout(result);
                doughnutChartWrapper.renderBottomRightChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsTubesFilled: function () {
        $('#loading-br-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetTubesFilled?programId=" + $('#program').val() + '&dateType=' + $('#bg-br-d button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br-d').hide();
                service.checkTimeout(result);
                doughnutChartWrapper.renderBottomRightDetailsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPhysicianWorkflows: function () {
        $('#loading-bl').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Table/GetPhysicianWorkflows?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-bl').hide();
                service.checkTimeout(result);
                $('#bl-physican-workflow').html('');
                if (result && result.length > 0) {
                    $.each(result, function (index, item) {
                        $('#bl-physican-workflow').append('<tr>' +
                            '<td style="width: 20%;"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=allreferrals&measureId=' + item.Measure + '&rowCount=' + item.Value + '&reportName=IntakeWorkflow" target="_blank">' + item.Value + '</a></td>' +
                            '<td style="width: 80%;">' + item.Caption + '</td>' +
                            '</tr>');
                    });
                }
            },
            error: function (xhr, status, exception) {
                $('#loading-bl').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPatientWorkflows: function () {
        $('#loading-bl').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Table/GetPatientWorkflows?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-bl').hide();
                service.checkTimeout(result);
                $('#bl-patient-workflow').html('');
                if (result && result.length > 0) {
                    $.each(result, function (index, item) {
                        $('#bl-patient-workflow').append('<tr>' +
                            '<td style="width: 20%;"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=allreferrals&measureId=' + item.Measure + '&rowCount=' + item.Value + '&reportName=IntakeWorkflow" target="_blank">' + item.Value + '</a></td>' +
                            '<td style="width: 80%;">' + item.Caption + '</td>' +
                            '</tr>');
                    });
                }
            },
            error: function (xhr, status, exception) {
                $('#loading-bl').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPorgramMaps: function () {
        $('#loading-mr').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramMaps?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-mr').val() + '&dateType=' + $('#bg-mr button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-mr').hide();
                service.checkTimeout(result);
                mapWrapper.render(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-mr').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsPorgramMaps: function () {
        $('#loading-mr-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramMaps?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-mr-details').val() + '&dateType=' + $('#bg-mr-d button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-mr-d').hide();
                service.checkTimeout(result);
                mapWrapper.renderDetails(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-mr-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getReferralSummaryByWeek: function () {
        console.log($('#select-filter-insurance-type').val());
        $('#loading-ml').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Table/GetReferralSummaryByWeek?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-ml').val() + '&insuranceType=' + $('#select-filter-insurance-type').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-ml').hide();
                service.checkTimeout(result);
                tableWrapper.renderReferralSummaryTable(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-ml').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsReferralSummaryByWeek: function () {
        $('#loading-ml-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Table/GetReferralSummaryByWeek?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-ml-details').val() + '&insuranceType=' + $('#select-filter-insurance-type-dv').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-ml-d').hide();
                service.checkTimeout(result);
                tableWrapper.renderDetailsReferralSummaryTable(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-ml-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getAspnNotes: function (aspnId) {
        $('#loading-notes').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Details/GetAspnNotes?aspnrxId=" + aspnId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-notes').hide();
                service.checkTimeout(result);
                $('#details-aspn-notes tbody').html('');
                if (result && result.length > 0) {
                    $.each(result, function (index, item) {
                        $('#details-aspn-notes tbody').append('<tr>' +
                            '<td>' + item.CreatedOn + '</td>' +
                            '<td>' + item.Category + '</td>' +
                            '<td>' + item.CreatedBy + '</td>' +
                            '</tr>');
                    });
                }
            },
            error: function (xhr, status, exception) {
                $('#loading-notes').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getAspnHistory: function (aspnId) {
        $('#loading-hisory').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Details/GetAspnHistoy?aspnrxId=" + aspnId + '&programId=' + $('#program-hidden').val() + '&uiSearch=' + $('#history-status-contains').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-hisory').hide();
                service.checkTimeout(result);
                $('#details-aspn-history tbody').html('');
                if (result && result.length > 0) {
                    $.each(result, function (index, item) {
                        $('#details-aspn-history tbody').append('<tr>' +
                            '<td>' + (index + 1) + '</td>' +
                            '<td>' + item.CreateDate + '</td>' +
                            '<td>' + item.Status + '</td>' +
                            '<td>' + item.CreateUserName + '</td>' +
                            '</tr>');
                    });
                }
            },
            error: function (xhr, status, exception) {
                $('#loading-hisory').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getAspnStatusNotes: function (aspnId) {
        $('#loading-statusnotes').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Details/GetAspnStatusNotes?aspnrxId=" + (aspnId ? aspnId : $('#n-s-aspnrxid').val()) + '&programId=' + $('#program-hidden').val() + '&uiSearch=' + $('#history-statusnotes-contains').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if(aspnId)
                    $('#n-s-aspnrxid').val(aspnId);
                $('#loading-statusnotes').hide();
                service.checkTimeout(result);
                //if (tableWrapper.notesStatusTable) tableWrapper.notesStatusTable.destroy();
                $('#details-aspn-statusnotes tbody').html('');
                if (result && result.length > 0) {
                    $.each(result, function (index, item) {
                        $('#details-aspn-statusnotes tbody').append('<tr>' +
                            '<td>' + item.ChangedOn + '</td>' +
                            '<td>' + item.StatusNote + '</td>' +
                            '<td>' + item.Source + '</td>' +
                            //'<td>' + item.ChangedBy + '</td>' +
                            '</tr>');
                    });

                    //tableWrapper.notesStatusTable = $('#details-aspn-statusnotes').DataTable({
                    //    'bDestroy': true,
                    //    'searching': true,
                    //    'ordering': false,
                    //    "aaSorting": [],
                    //    "iDisplayLength": 5,
                    //    "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
                    //    "sDom": '<"top"flp>rt<"bottom"i><"clear">'
                    //});
                }
            },
            error: function (xhr, status, exception) {
                $('#loading-hisory').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getUniquePatients: function () {
        $('#loading-br1').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GteUniquePatients?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br1').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderBr1Chart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br1').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsUniquePatients: function () {
        $('#loading-br1-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GteUniquePatients?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br1-d').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderBr1DetailsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br1-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getOrderAnalysis: function () {
        $('#loading-br2').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetOrderAnalysis?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br2').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderBr2Chart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br2').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsOrderAnalysis: function () {
        $('#loading-br2-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetOrderAnalysis?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br2-d').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderBr2DetailsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br2-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getRankAndAddress: function () {
        $('#loading-br3').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Table/GetRankAndAddresss?programId=" + $('#program').val() + '&dateType=' + $('#bg-br3 button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br3').hide();
                service.checkTimeout(result);
                tableWrapper.renderRankAndAddress(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br3').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsRankAndAddress: function () {
        $('#loading-br3-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Table/GetRankAndAddresss?programId=" + $('#program').val() + '&dateType=' + $('#bg-br3-d button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br3-d').hide();
                service.checkTimeout(result);
                tableWrapper.renderDetailsRankAndAddress(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br3-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPAPorgramStatus: function () {
        $('#loading-br4').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPAProgramStatus?programId=" + $('#program').val() + '&dateType=' + $('#bg-br4 button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br4').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderBr4Chart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br4').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsPAPorgramStatus: function () {
        $('#loading-br4-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPAProgramStatus?programId=" + $('#program').val() + '&dateType=' + $('#bg-br4-d button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br4-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderDetailsBr4Chart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br4-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPAPorgramMaps: function () {
        $('#loading-br5').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPAProgramMaps?programId=" + $('#program').val() + '&dateType=' + $('#bg-br5 button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br5').hide();
                service.checkTimeout(result);
                mapWrapper.renderBr5(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br5').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsPAPorgramMaps: function () {
        $('#loading-br5-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPAProgramMaps?programId=" + $('#program').val() + '&dateType=' + $('#bg-br5-d button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br5-d').hide();
                service.checkTimeout(result);
                mapWrapper.renderDetailsBr5(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br5-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPROrderAnalysis: function () {
        $('#loading-br6').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPROrderAnalysis?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br6').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderBr6Chart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br6').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsPROrderAnalysis: function () {
        $('#loading-br2-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPROrderAnalysis?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-br6-d').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderDetailsBr6Chart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-br6-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getCipherPriorAuth: function () {
        $('#loading-cipher').show();
        //if ($('#cipher-chart-type').val() === 'COMPLETE')
        //    $('#cipher-date-container').show();
        //else
        //    $('#cipher-date-container').hide();
        $('#cipher-chart-type-d').val($('#cipher-chart-type').val());
        //var dateType = $('#cipher-chart-type').val() === 'COMPLETE' ? $('#bg-cipher button.btn-selected').attr('data-date') : 'today';
        var dateType = $('#bg-cipher button.btn-selected').attr('data-date');
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetCipherPriorAuth?programId=" + $('#program').val() + '&datetType=' + dateType + '&insType=3&statProcess=' + $('#cipher-chart-type').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-cipher').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderCipherPriorAuthChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-cipher').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsCipherPriorAuth: function () {
        $('#loading-cipher-d').show();
        //if ($('#cipher-chart-type-d').val() === 'COMPLETE')
        //    $('#cipher-date-container-d').show();
        //else
        //    $('#cipher-date-container-d').hide();
        //var dateType = $('#cipher-chart-type-d').val() === 'COMPLETE' ? $('#bg-cipher-d button.btn-selected').attr('data-date') : 'today';
        var dateType = $('#bg-cipher-d button.btn-selected').attr('data-date');
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetCipherPriorAuth?programId=" + $('#program').val() + '&datetType=' + dateType + '&insType=3&statProcess=' + $('#cipher-chart-type-d').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-cipher-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderDetailsCipherPriorAuthChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-cipher-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getInformix: function () {
        $('#loading-informix').show();
        $.ajax({
            type: "GET",

            url: service.getRootUrl() + "/Informix/GetInformixData?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (!result.Success) {
                    $('table#informix-panel-table').html('');
                    alert(result.Message);
                    $('#loading-informix').hide();
                }
                if (result && result.Data.length > 0) {
                    $('table#informix-panel-table').html('');
                    var html = '';
                    html += '<thead><tr>';
                    $.each(result.Config, function (index, item) {
                        html += '<td>' + item.Name + '</td>';
                    });
                    html += '</tr></thead><tbody>';
                    $.each(result.Data, function (index, item) {
                        html += '<tr>';
                        if (item.IdField !== '-9999999') html += '<td class="number">' + item.IdField + '</td>';
                        if (item.CsqName !== '-9999999') html += '<td>' + item.CsqName + '</td>';
                        if (item.CallSkills !== '-9999999') html += '<td>' + item.CallSkills + '</td>';
                        if (item.CallsPresented !== '-9999999') html += '<td class="number">' + item.CallsPresented + '</td>';
                        if (item.AvgQueueTime !== '-9999999') html += '<td class="number">' + item.AvgQueueTime + '</td>';
                        if (item.MaxQueueTime !== '-9999999') html += '<td class="number">' + item.MaxQueueTime + '</td>';
                        if (item.CallsHandled !== '-9999999') html += '<td class="number">' + item.CallsHandled + '</td>';
                        if (item.AvgSpeedAnswer !== '-9999999') html += '<td class="number">' + item.AvgSpeedAnswer + '</td>';
                        if (item.AvgHandleTime !== '-9999999') html += '<td class="number">' + item.AvgHandleTime + '</td>';
                        if (item.MaxHandleTime !== '-9999999') html += '<td class="number">' + item.MaxHandleTime + '</td>';
                        if (item.CallsAbandoned !== '-9999999') html += '<td class="number">' + item.CallsAbandoned + '</td>';
                        if (item.AvgTimeAbandon !== '-9999999') html += '<td class="number">' + item.AvgTimeAbandon + '</td>';
                        if (item.MaxTimeAbandon !== '-9999999') html += '<td class="number">' + item.MaxTimeAbandon + '</td>';
                        if (item.AvgCallsAbondoned !== '-9999999') html += '<td class="number">' + item.AvgCallsAbondoned + '</td>';
                        if (item.MaxCallsAbondoned !== '-9999999') html += '<td class="number">' + item.MaxCallsAbondoned + '</td>';
                        if (item.CallDequeued !== '-9999999') html += '<td class="number">' + item.CallDequeued + '</td>';
                        if (item.AvgTimeDequeue !== '-9999999') html += '<td class="number">' + item.AvgTimeDequeue + '</td>';
                        if (item.MaxTimeDequeue !== '-9999999') html += '<td class="number">' + item.MaxTimeDequeue + '</td>';
                        if (item.CallsHandledByOthers !== '-9999999') html += '<td class="number">' + item.CallsHandledByOthers + '</td>';
                        if (item.LatestSyncTime !== '-9999999') html += '<td class="number">' + item.LatestSyncTime + '</td>';
                        if (item.AbandonmentRate !== '-9999999') html += '<td class="number">' + item.AbandonmentRate + '</td>';
                        html += '</tr>';
                    });
                    html += '</tbody>';
                    $('table#informix-panel-table').html(html);
                    $('#loading-informix').hide();
                } else {
                    $('table#informix-panel-table').html('');
                    $('#informix-panel-no-data').show();
                }
                $('#loading-informix').hide();
            },
            error: function (xhr, status, exception) {
                $('#loading-informix').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getInformixDetails: function () {
        $('#loading-informix-d').show();
        $.ajax({
            type: "GET",

            url: service.getRootUrl() + "/Informix/GetInformixData?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (!result.Success) {
                    $('table#informix-panel-table-d').html('');
                    alert(result.Message);
                    $('#loading-informix-d').hide();
                }
                if (result && result.Data.length > 0) {
                    $('table#informix-panel-table-d').html('');
                    var html = '';
                    html += '<thead><tr>';
                    $.each(result.Config, function (index, item) {
                        html += '<td>' + item.Name + '</td>';
                    });
                    html += '</tr></thead><tbody>';
                    $.each(result.Data, function (index, item) {
                        html += '<tr>';
                        if (item.IdField !== '-9999999') html += '<td class="number">' + item.IdField + '</td>';
                        if (item.CsqName !== '-9999999') html += '<td>' + item.CsqName + '</td>';
                        if (item.CallSkills !== '-9999999') html += '<td>' + item.CallSkills + '</td>';
                        if (item.CallsPresented !== '-9999999') html += '<td class="number">' + item.CallsPresented + '</td>';
                        if (item.AvgQueueTime !== '-9999999') html += '<td class="number">' + item.AvgQueueTime + '</td>';
                        if (item.MaxQueueTime !== '-9999999') html += '<td class="number">' + item.MaxQueueTime + '</td>';
                        if (item.CallsHandled !== '-9999999') html += '<td class="number">' + item.CallsHandled + '</td>';
                        if (item.AvgSpeedAnswer !== '-9999999') html += '<td class="number">' + item.AvgSpeedAnswer + '</td>';
                        if (item.AvgHandleTime !== '-9999999') html += '<td class="number">' + item.AvgHandleTime + '</td>';
                        if (item.MaxHandleTime !== '-9999999') html += '<td class="number">' + item.MaxHandleTime + '</td>';
                        if (item.CallsAbandoned !== '-9999999') html += '<td class="number">' + item.CallsAbandoned + '</td>';
                        if (item.AvgTimeAbandon !== '-9999999') html += '<td class="number">' + item.AvgTimeAbandon + '</td>';
                        if (item.MaxTimeAbandon !== '-9999999') html += '<td class="number">' + item.MaxTimeAbandon + '</td>';
                        if (item.AvgCallsAbondoned !== '-9999999') html += '<td class="number">' + item.AvgCallsAbondoned + '</td>';
                        if (item.MaxCallsAbondoned !== '-9999999') html += '<td class="number">' + item.MaxCallsAbondoned + '</td>';
                        if (item.CallDequeued !== '-9999999') html += '<td class="number">' + item.CallDequeued + '</td>';
                        if (item.AvgTimeDequeue !== '-9999999') html += '<td class="number">' + item.AvgTimeDequeue + '</td>';
                        if (item.MaxTimeDequeue !== '-9999999') html += '<td class="number">' + item.MaxTimeDequeue + '</td>';
                        if (item.CallsHandledByOthers !== '-9999999') html += '<td class="number">' + item.CallsHandledByOthers + '</td>';
                        if (item.LatestSyncTime !== '-9999999') html += '<td class="number">' + item.LatestSyncTime + '</td>';
                        if (item.AbandonmentRate !== '-9999999') html += '<td class="number">' + item.AbandonmentRate + '</td>';
                        html += '</tr>';
                    });
                    html += '</tbody>';
                    $('table#informix-panel-table-d').html(html);
                    $('#loading-informix-d').hide();
                } else {
                    $('table#informix-panel-table-d').html('');
                    $('#informix-panel-no-data-d').show();
                }
                $('#loading-informix-d').hide();
            },
            error: function (xhr, status, exception) {
                $('#loading-informix-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getCallCenterStatictics1: function () {
        $('#loading-ccs1').show();
        var dateType = $('#bg-ccs1 button.btn-selected').attr('data-date');
        var isWorkingDays = dateType === 'Day' ? 'true' : 'false';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Informix/GetCallCenterStatictics?programId=" + $('#program').val() +
                "&programName=" + $('#program option:selected').text() + '&dateFrequency=' + dateType + '&isWorkingDays=' + isWorkingDays +
                '&callType=' + $('input[name=calls1-overview-radio]:checked').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-ccs1').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderCallCenterStatAsaChart(result);
                columnChartWrapper.renderCallCenterStatAhtChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-ccs1').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },
    getCallCenterStatictics2: function () {
        $('#loading-ccs2').show();
        var dateType = $('#bg-ccs2 button.btn-selected').attr('data-date');
        var isWorkingDays = dateType === 'Day' ? 'true' : 'false';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Informix/GetCallCenterStatictics?programId=" + $('#program').val() +
                "&programName=" + $('#program option:selected').text() + '&dateFrequency=' + dateType + '&isWorkingDays=' + isWorkingDays +
                '&callType=' + $('input[name=calls2-overview-radio]:checked').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-ccs2').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderCallCenterStatArChart(result);
                columnChartWrapper.renderCallCenterStatAchChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-ccs2').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getCallCenterStaticticsDetails1: function () {
        $('#loading-ccs1-d').show();
        var dateType = $('#bg-ccs1-d button.btn-selected').attr('data-date');
        var isWorkingDays = dateType === 'Day' ? 'true' : 'false';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Informix/GetCallCenterStatictics?programId=" + $('#program').val() +
                "&programName=" + $('#program option:selected').text() + '&dateFrequency=' + dateType + '&isWorkingDays=' + isWorkingDays +
                '&callType=' + $('input[name=calls1-overview-d-radio]:checked').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-ccs1-d').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderCallCenterStatAsaChartDetails(result);
                columnChartWrapper.renderCallCenterStatAhtChartDetails(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-ccs1-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getCallCenterStaticticsDetails2: function () {
        $('#loading-ccs2-d').show();
        var dateType = $('#bg-ccs2-d button.btn-selected').attr('data-date');
        var isWorkingDays = dateType === 'Day' ? 'true' : 'false';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Informix/GetCallCenterStatictics?programId=" + $('#program').val() +
                "&programName=" + $('#program option:selected').text() + '&dateFrequency=' + dateType + '&isWorkingDays=' + isWorkingDays +
                '&callType=' + $('input[name=calls2-overview-d-radio]:checked').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-ccs2-d').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderCallCenterStatArChartDetails(result);
                columnChartWrapper.renderCallCenterStatAchChartDetails(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-ccs2-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getNetworkCapacity: function () {
        $('#loading-nc').show();
        var dateType = $('#bg-nc button.btn-selected').attr('data-date');
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/NetworkCapacity/GetNetworkCapacity?programId=" + $('#program').val() +
                '&dateFrequency=' + dateType,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-nc').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderNetworkCapacityChart(result);
                tableWrapper.renderNetworkCapacityTable(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-nc').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getRegidtrationReport: function () {
        window.location = service.getRootUrl() + '/Report/GetRegistrationReport?appId=' + $('#application').val();
    },

    getRegistrationReportFromMenu: function () {
        var appId = window.location.pathname.indexOf('GetRegistrationReport') > -1
            ? $('#program option').length === 1 ? '?appId=' + $('#program').val() : ''
            : '?appId=' + localStorage.getItem('enrollment-program-id');
        window.location = service.getRootUrl() + '/Report/GetRegistrationReport' + appId;
    },

    getNetworkCapacityDetails: function () {
        $('#loading-nc-d').show();
        var dateType = $('#bg-nc-d button.btn-selected').attr('data-date');
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/NetworkCapacity/GetNetworkCapacity?programId=" + $('#program').val() +
                '&dateFrequency=' + dateType,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-nc-d').hide();
                service.checkTimeout(result);
                columnChartWrapper.renderNetworkCapacityDetailsChart(result);
                tableWrapper.renderNetworkCapacityDetailsTable(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-nc-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getIncomingReferralsByHour: function () {
        $('#loading-irbh').show();
        var physicianFName = $('#irbh-physician-fname').val() ? '&physicianFName=' + $('#irbh-physician-fname').val() : '';
        var physicianLName = $('#irbh-physician-lname').val() ? '&physicianLName=' + $('#irbh-physician-lname').val() : '';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetIncomingReferralsByHour?programId=" + $('#program').val() + '&dateType=' + $('#bg-irbh button.btn-selected').attr('data-date') + physicianFName + physicianLName,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-irbh').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderIncomingReferralsByHourChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-irbh').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getIncomingReferralsByHourDetails: function () {
        $('#loading-irbh-d').show();
        var physicianFName = $('#irbh-physician-fname-d').val() ? '&physicianFName=' + $('#irbh-physician-fname-d').val() : '';
        var physicianLName = $('#irbh-physician-lname-d').val() ? '&physicianLName=' + $('#irbh-physician-lname-d').val() : '';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetIncomingReferralsByHour?programId=" + $('#program').val() + '&dateType=' + $('#bg-irbh-d button.btn-selected').attr('data-date') + physicianFName + physicianLName,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-irbh-d').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderIncomingReferralsByHourChartDetails(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-irbh-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    searchPhysician: function (id, sp, onselectCall) {
        $('#' + id).autoComplete({
            minChars: 3,
            delay: 300,
            cache: false,
            source: function (term, response) {
                $.getJSON(service.getRootUrl() + '/Chart/SearchPhysician', { searchTerm: term, programId: $('#program').val(), sp: sp }, function (data) { response(data); });
            },
            onSelect: function (e, term, item) {
                onselectCall();
            }
        });
    },

    searchPhysicianDetails: function () {
        $('#irbh-physician-d').autoComplete({
            minChars: 3,
            delay: 300,
            cache: false,
            source: function (term, response) {
                $.getJSON(service.getRootUrl() + '/Chart/SearchPhysician', { searchTerm: term, programId: $('#program').val() }, function (data) { response(data); });
            },
            onSelect: function (e, term, item) {
                service.getIncomingReferralsByHourDetails();
            }
        });
    },

    get2HourCallKpiPercent: function () {
        $('#loading-2hck').show();
        var isWorkingDays = $('#bg-2hck button.btn-selected').attr('data-date') === 'daily' ? 'true' : 'false';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/CallKpi/Get2HoursCallKpi?programId=" + $('#program').val() + '&dateType=' + $('#bg-2hck button.btn-selected').attr('data-date') + '&fullDay=' + $("#full-day").is(":checked") + '&excludeNonWorkingDays=' + isWorkingDays,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-2hck').hide();
                service.checkTimeout(result);
                columnChartWrapper.render2HourCallKpiPercent(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-2hck').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    get2HourCallVolume: function () {
        $('#loading-2hcv').show();
        var isWorkingDays = $('#bg-2hcv button.btn-selected').attr('data-date') === 'daily' ? 'true' : 'false';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/CallKpi/Get2HoursCallVolume?programId=" + $('#program').val() + '&dateType=' + $('#bg-2hcv button.btn-selected').attr('data-date') + '&excludeNonWorkingDays=' + isWorkingDays,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-2hcv').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.render2HourCallVolume(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-2hcv').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    get2HourCallKpiPercentDetails: function () {
        $('#loading-2hck-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/CallKpi/Get2HoursCallKpi?programId=" + $('#program').val() + '&dateType=' + $('#bg-2hck-d button.btn-selected').attr('data-date') + '&fullDay=' + $("#full-day-d").is(":checked"),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-2hck-d').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.render2HourCallKpiPercentDetails(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-2hck-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    get2HourCallVolumeDetails: function () {
        $('#loading-2hcv-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/CallKpi/Get2HoursCallVolume?programId=" + $('#program').val() + '&dateType=' + $('#bg-2hcv-d button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-2hcv-d').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.render2HourCallVolumeDetails(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-2hcv-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getHubStatisticsOutboundCalls: function () {
        $('#loading-obc').show();
        var isWorkingDays = $('#bg-obc button.btn-selected').attr('data-date') === 'daily' ? 'true' : 'false';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Informix/GetHubStatisticsOutboundCalls?programId=' + $('#program').val() + '&dateType=' + $('#bg-obc button.btn-selected').attr('data-date') +
                '&excludeNonWorkingDays=' + isWorkingDays + '&callType=' + $('input[name=callso-overview-radio]:checked').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-obc').hide();
                service.checkTimeout(result);
                //console.log(result);
                columnChartWrapper.renderHubStatisticsOutboundTotalCallsChart(result.TotalCallsChart);
                columnChartWrapper.renderHubStatisticsOutboundAvgCallLengthChart(result.AvgCallLengthChart);
            },
            error: function (xhr, status, exception) {
                $('#loading-obc').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getHubStatisticsOutboundCallsDetails: function () {
        $('#loading-obc-d').show();
        var isWorkingDays = $('#bg-obc-d button.btn-selected').attr('data-date') === 'daily' ? 'true' : 'false';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Informix/GetHubStatisticsOutboundCalls?programId=' + $('#program').val() + '&dateType=' + $('#bg-obc-d button.btn-selected').attr('data-date') +
                '&excludeNonWorkingDays=' + isWorkingDays + '&callType=' + $('input[name=callso-overview-d-radio]:checked').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-obc-d').hide();
                service.checkTimeout(result);
                //console.log(result);
                columnChartWrapper.renderHubStatisticsOutboundTotalCallsChartDetails(result.TotalCallsChart);
                columnChartWrapper.renderHubStatisticsOutboundAvgCallLengthChartDetails(result.AvgCallLengthChart);
            },
            error: function (xhr, status, exception) {
                $('#loading-obc-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getQaByQuestionType: function (id, loadingId, questionType) {
        $('#' + loadingId).show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/SurveyMonkey/GetAvgAnswerByQuestionType?questionType=' + questionType + '&programId=' + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#' + loadingId).hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderQaByQuestionTypeColumnChart(id, result, questionType);
            },
            error: function (xhr, status, exception) {
                $('#' + loadingId).hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getAnswerStatsByComplianceQuestion: function () {
        $('#loading-compliance-trending').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/SurveyMonkey/GetAnswersStatsByQuestion?question=' + $('#compliance-trending-question').val() + '&programId=' + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-compliance-trending').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderAnswerStatsStackedColumnChart('compliance-trending-column-chart', result);
            },
            error: function (xhr, status, exception) {
                $('#loading-compliance-trending').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getAnswerStatsByProcessQuestion: function () {
        $('#loading-process-trending').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/SurveyMonkey/GetAnswersStatsByQuestion?question=' + $('#process-trending-question').val() + '&programId=' + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-process-trending').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderAnswerStatsStackedColumnChart('process-trending-column-chart', result);
            },
            error: function (xhr, status, exception) {
                $('#loading-process-trending').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getAnswerStatsByQualityQuestion: function () {
        $('#loading-quality-trending').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/SurveyMonkey/GetAnswersStatsByQuestion?question=' + $('#quality-trending-question').val() + '&programId=' + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-quality-trending').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderAnswerStatsStackedColumnChart('quality-trending-column-chart', result);
            },
            error: function (xhr, status, exception) {
                $('#loading-quality-trending').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getFilterValuesByParamWithCallbacks: function (sp, param, id, callbacks) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetFilterValuesByParam?sp=" + sp + '&param=' + param,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#' + id).empty();
                    $.each(result, function (index, item) {
                        $('#' + id).append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    if (callbacks)
                        callbacks();
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getAfrezzaPorgramStatus: function () {
        $('#loading-aps').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramStatus?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-aps').val() + '&dateType=' + $('#bg-aps button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-aps').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderAfrezzaProgramStatusChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-aps').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getAfrezzaDetailsPorgramStatus: function () {
        $('#loading-aps-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetProgramStatus?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-aps-details').val() + '&dateType=' + $('#bg-aps-d button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-aps-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderAfrezzaDetailsProgramStatusChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-aps-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getMedvantxDeliveredVsExceptionOrderVolume: function () {
        $('#loading-mdeov').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Madventx/GetMedvantxDeliveredVsExceptionOrderVolume?period=' + $('#bg-mdeov button.btn-selected').attr('data-date') + '&deliveryStatus=' + $('input[name=mdeov-radio]:checked').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-mdeov').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderMedvantxDeliveredVsExceptionOrderVolume(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-mdeov').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getMedvantxUPS48hrDeliveryOrderVolume: function () {
        $('#loading-mudov').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Madventx/GetMedvantxUPS48hrDeliveryOrderVolume?period=' + $('#bg-mudov button.btn-selected').attr('data-date') + '&hoursFilter=' + (($('input[name=mudov-radio]:checked').val() == '<= 48 hrs') ? 'l48' : 'g48'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-mudov').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderMedvantxUPS48hrDeliveryOrderVolume(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-mudov').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getMedvantxUPS48hrDeliverySuccessRate: function () {
        $('#loading-mudsr').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Madventx/GetMedvantxUPS48hrDeliverySuccessRate?period=' + $('#bg-mudsr button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-mudsr').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderMedvantxUPS48hrDeliverySuccessRate(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-mudsr').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getCleanPathFromBVDirectlyIntoScheduleDelivery: function () {
        $('#loading-cp').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Madventx/GetCleanPathFromBVDirectlyIntoScheduleDelivery?period=' + $('#bg-cp button.btn-selected').attr('data-date') + '&cleanBVFilter=' + $('input[name=cp-radio]:checked').val()
                        + '&excludeOnhold=' + $('input[name=cp-ex-checkbox-onhold]').is(':checked') + '&excludeCancelled=' + $('input[name=cp-ex-checkbox-cancelled]').is(':checked'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-cp').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderCleanPathFromBVDirectlyIntoScheduleDelivery(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-cp').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getIndirectPathFromBVDirectlyIntoAnyStatus: function () {
        $('#loading-ip').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Madventx/GetIndirectPathFromBVDirectlyIntoAnyStatus?period=' + $('#bg-ip button.btn-selected').attr('data-date') + '&indirectFilter=' + $('input[name=ip-radio]:checked').val()
                    + '&excludeOnhold=' + $('input[name=ip-ex-checkbox-onhold]').is(':checked') + '&excludeCancelled=' + $('input[name=ip-ex-checkbox-cancelled]').is(':checked'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-ip').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderIndirectPathFromBVDirectlyIntoAnyStatus(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-ip').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getVolumePercentOfCleanPathVSIndirectPath: function () {
        $('#loading-vcpip').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Madventx/GetVolumePercentOfCleanPathVSIndirectPath?period=' + $('#bg-vcpip button.btn-selected').attr('data-date')
                    + '&excludeOnhold=' + $('input[name=vcpip-ex-checkbox-onhold]').is(':checked') + '&excludeCancelled=' + $('input[name=vcpip-ex-checkbox-cancelled]').is(':checked'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-vcpip').hide();
                service.checkTimeout(result);
                console.log(result);
                columnChartWrapper.renderVolumePercentOfCleanPathVSIndirectPath(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-vcpip').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPharmacyCReferrals: function () {
        $('#loading-prc').show();
        var pharmacy = $('#pharmacy-prc').val() ? $('#pharmacy-prc').val() : -1;
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPharmacyReferrals?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-prc').val() +
                '&dateType=' + $('#bg-prc button.btn-selected').attr('data-date') + '&referral=' + $('input[name=prc-referrals]:checked').val() +
                '&pharmacy=' + pharmacy,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-prc').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderPharmacyReferralsCChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-prc').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsPharmacyCReferrals: function () {
        $('#loading-prc-d').show();
        var pharmacy = $('#pharmacy-prc-d').val() ? $('#pharmacy-prc-d').val() : -1;
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPharmacyReferrals?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-prc-details').val() +
                '&dateType=' + $('#bg-prc-d button.btn-selected').attr('data-date') + '&referral=' + $('input[name=prc-referrals-d]:checked').val() +
                '&pharmacy=' + pharmacy,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-prc-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderPharmacyReferralsCDetailsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-prc-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getReferralTimeToProcess: function () {
        if ($('#rttp-location').val() === 'HUB') {
            $('#rttp-datetype-div').hide();
        } else {
            $('#rttp-datetype-div').show();
        }
        $('#loading-rttp').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetReferralTimeToProcess?programId=" + $('#program').val() + '&location=' + $('#rttp-location').val() +
                '&pa=' + $('#rttp-pa').val() + '&dateType=' + $('input[name=rttp-datetype]:checked').val() + '&includeWeekends=' +
                $('#rttp-weekends').is(':checked'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-rttp').hide();
                service.checkTimeout(result);
                //pieChartWrapper.renderReferralTimeToProcessChart(result);
                pieChartWrapper.renderReferralTimeToProcessColumnChart(result);
                pieChartWrapper.renderReferralTimeToProcessLineChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-rttp').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsReferralTimeToProcess: function () {
        if ($('#rttp-location-d').val() === 'HUB') {
            $('#rttp-datetype-d-div').hide();
        } else {
            $('#rttp-datetype-d-div').show();
        }
        $('#loading-rttp-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetReferralTimeToProcess?programId=" + $('#program').val() + '&location=' + $('#rttp-location-d').val() +
                '&pa=' + $('#rttp-pa-d').val() + '&dateType=' + $('input[name=rttp-datetype-d]:checked').val() + '&includeWeekends=' +
                $('#rttp-weekends-d').is(':checked'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-rttp-d').hide();
                service.checkTimeout(result);
                //pieChartWrapper.renderDetailsReferralTimeToProcessChart(result);
                pieChartWrapper.renderDetailsReferralTimeToProcessColumnChart(result);
                pieChartWrapper.renderDetailsReferralTimeToProcessLineChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-rttp-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getBenfitsInvestigations: function () {
        $('#loading-bi').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetBenfitsInvestigations?programId=" + $('#program').val() + '&insuranceType=' + $('#bi-insurance-type').val() +
                '&ageRange=' + $('input[name=bi-agerange]:checked').val() + '&dateType=' + $('#bg-bi button.btn-selected').attr('data-date') +
                '&drugName=' + $('#bi-drug-name').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-bi').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderBenefitsInvestigationChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-bi').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsBenfitsInvestigations: function () {
        $('#loading-bi-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetBenfitsInvestigations?programId=" + $('#program').val() + '&insuranceType=' + $('#bi-insurance-type-d').val() +
                '&ageRange=' + $('input[name=bi-agerange-d]:checked').val() + '&dateType=' + $('#bg-bi-d button.btn-selected').attr('data-date') +
                '&drugName=' + $('#bi-drug-name-d').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-bi-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderDetailsBenefitsInvestigationChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-bi-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getCashOptions: function () {
        $('#loading-cor').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetCashOptions?programId=" + $('#program').val() + '&dateType=' + $('#bg-cor button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-cor').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderCashOptionsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-cor').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsCashOptions: function () {
        $('#loading-cor-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetCashOptions?programId=" + $('#program').val() + '&dateType=' + $('#bg-cor-d button.btn-selected').attr('data-date'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-cor-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderDetailsCashOptionsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-cor-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getSantylData: function () {
        $('#loading-sntl').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetSantylData?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-sntl').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderSantylChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-sntl').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getSantylDetailsData: function () {
        $('#loading-sntl-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetSantylData?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-sntl-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderSantylDetailsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-sntl-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getRegranexData: function () {
        $('#loading-rgnx').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetRegranexData?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-rgnx').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderRegranexChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-rgnx').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getRegranexDetailsData: function () {
        $('#loading-rgnx').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetRegranexData?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-rgnx').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderRegranexDetailsChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-rgnx').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getReferralsWithCopayGt75: function () {
        $('#loading-rc75').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetReferralsWithCopayGt75?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-rc75').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderReferralsCopayGt75Chart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-rc75').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsReferralsWithCopayGt75: function () {
        $('#loading-rc75-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetReferralsWithCopayGt75?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-rc75-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderDetailsReferralsCopayGt75Chart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-rc75-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getHubStatisticsConsignmentChart: function () {
        $('#loading-consginment').show();
        var isWorkingDays = $('#bg-consignment button.btn-selected').attr('data-date') === 'daily' ? 'true' : 'false';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Chart/GetHubStatisticsConsignmentReport?programId=' + $('#program').val() + '&dateType=' + $('#bg-consignment button.btn-selected').attr('data-date') + '&workingDays=' + isWorkingDays,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-consginment').hide();
                service.checkTimeout(result);
                //console.log(result);
                columnChartWrapper.renderConsignmentStackedColumnChart(result.referralData);
                columnChartWrapper.renderConsignmentRollingLineChart(result.rollingData);
            },
            error: function (xhr, status, exception) {
                $('#loading-consginment').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getHubStatisticsConsignmentChartDetails: function () {
        $('#loading-consginment-d').show();
        var isWorkingDays = $('#bg-consignment-d button.btn-selected').attr('data-date') === 'daily' ? 'true' : 'false';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/Chart/GetHubStatisticsConsignmentReport?programId=' + $('#program').val() + '&dateType=' + $('#bg-consignment-d button.btn-selected').attr('data-date') + '&workingDays=' + isWorkingDays,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-consginment-d').hide();
                service.checkTimeout(result);
                //console.log(result);
                columnChartWrapper.renderConsignmentStackedColumnDetailsChart(result.referralData);
                columnChartWrapper.renderConsignmentRollingLineDetailsChart(result.rollingData);
            },
            error: function (xhr, status, exception) {
                $('#loading-consginment-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPaStatusUpdates: function () {
        $('#loading-pa-status').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPaStatusUpdates?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-pa-status').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderPaStatusUpdateChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-pa-status').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsPaStatusUpdates: function () {
        $('#loading-pa-status-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPaStatusUpdates?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-pa-status-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderDetailsPaStatusUpdateChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-pa-status-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getReferralStatus: function () {
        $('#loading-referral-status').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetReferralStatus?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-referral-status').hide();
                console.log(result);
                service.checkTimeout(result);
                pieChartWrapper.renderReferralStatusChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-referral-status').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsReferralStatus: function () {
        $('#loading-referral-status-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetReferralStatus?programId=" + $('#program').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-referral-status-d').hide();
                console.log(result);
                service.checkTimeout(result);
                pieChartWrapper.renderDetailsReferralStatusChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-referral-status-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPharmacyReferralsByAssignedOn: function () {
        $('#loading-prad').show();
        var pharmacy = $('#pharmacy-prad').val() ? $('#pharmacy-prad').val() : '-1';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPharmacyReferralsByAssignedOn?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-prad').val() +
                '&dateType=' + $('#bg-prad button.btn-selected').attr('data-date') + '&referral=' + $('input[name=prad-referrals]:checked').val() +
                 '&pharmacy=' + pharmacy,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-prad').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderPhamracyReferralsByAssignedOnChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-prad').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsPharmacyReferralsByAssignedOn: function () {
        $('#loading-prad-d').show();
        var pharmacy = $('#pharmacy-prad-d').val() ? $('#pharmacy-prad-d').val() : '-1';
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetPharmacyReferralsByAssignedOn?programId=" + $('#program').val() + '&inpTreatment=' + $('#treatment-prad-d').val() +
                '&dateType=' + $('#bg-prad-d button.btn-selected').attr('data-date') + '&referral=' + $('input[name=prad-referrals-d]:checked').val() +
                '&pharmacy=' + pharmacy,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-prad-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderDetailsPhamracyReferralsByAssignedOnChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-prad-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getRxcReasonByPrescriber: function () {
        $('#loading-rxc').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetRxcReasonByPrescriber?programId=" + $('#program').val() + '&firstName=' + $('#rxc-first-name').val()
             + '&lastName=' + $('#rxc-last-name').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-rxc').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderRxcReasonByPrescriberChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-rxc').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsRxcReasonByPrescriber: function () {
        $('#loading-rxc-d').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Chart/GetRxcReasonByPrescriber?programId=" + $('#program').val() + '&firstName=' + $('#rxc-first-name-d').val()
             + '&lastName=' + $('#rxc-last-name-d').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#loading-rxc-d').hide();
                service.checkTimeout(result);
                pieChartWrapper.renderDetailsRxcReasonByPrescriberChart(result);
            },
            error: function (xhr, status, exception) {
                $('#loading-rxc-d').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDateText: function (id) {
        return $('#' + id + ' button.btn-selected').text().indexOf('QTD') > -1
            ? $('#' + id + ' button.btn-selected').attr('data-qtr-text').toUpperCase()
            : $('#' + id + ' button.btn-selected').text().trim();
    },
    getPAActivity: function (aspnrxId) {
        $('#table-pa-activity tbody').html('');
        $('#loading-pa-activity').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Details/GetPAActivity?aspnrxId=" + aspnrxId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                console.log(result);
                $('#loading-pa-activity').hide();
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $.each(result, function (index, item) {
                        $('#table-pa-activity tbody').append('<tr>' +
                            '<td>' + item.PAStatus + '</td>' +
                            '<td>' + item.InitiationDate + '</td>' +
                            '<td>' + item.ApprovalDate + '</td>' +
                            '<td>' + item.ExpirationDate + '</td>' +
                            '</tr>');
                    });
                }
            },
            error: function (xhr, status, exception) {
                $('#loading-pa-activity').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    IsExportDenied: function (programId, excelBtn, pdfBtn) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Config/IsExportDenied?programId=" + programId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result) {
                    $('#' + excelBtn).hide();
                    $('#' + pdfBtn).hide();
                } else {
                    $('#' + excelBtn).show();
                    $('#' + pdfBtn).show();
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },
};