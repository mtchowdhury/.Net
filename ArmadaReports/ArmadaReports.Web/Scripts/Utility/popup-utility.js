var popup = {
    showTl: function () {
        $('#tl-modal').modal('show');
        setTimeout(function () {
            $('#treatment-tl-details').unbind('onchange', service.getDetailsDaysToFill());
            $('#prior-auth-details').unbind('onchange', service.getDetailsDaysToFill());
            $('#pharmacy-details').unbind('onchange', service.getDetailsDaysToFill());

            $('#treatment-tl-details').val($('#treatment-tl').val());
            $('#prior-auth-details').val($('#prior-auth').val());
            $('#pharmacy-details').val($('#pharmacy').val());

            $('#treatment-tl-details').bind('onchange', service.getDetailsDaysToFill());
            $('#prior-auth-details').bind('onchange', service.getDetailsDaysToFill());
            $('#pharmacy-details').bind('onchange', service.getDetailsDaysToFill());

            service.getDetailsDaysToFill();
            $('.canvasjs-chart-credit').hide();
        }, 500);        
    },

    showTm: function () {
        $('#tm-modal').modal('show');
        setTimeout(function () {
            $('#treatment-tm-details').unbind('onchange', service.getDetailsPorgramStatus());
            $('#treatment-tm-details').val($('#treatment-tm').val());
            $('#treatment-tm-details').bind('onchange', service.getDetailsPorgramStatus());

            service.getDetailsPorgramStatus();
            $('.canvasjs-chart-credit').hide();
        }, 500);        
    },

    showAps: function () {
        $('#aps-modal').modal('show');
        setTimeout(function () {
            $('#treatment-aps-details').unbind('onchange', service.getDetailsPorgramStatus());
            $('#treatment-aps-details').val($('#treatment-aps').val());
            $('#treatment-aps-details').bind('onchange', service.getDetailsPorgramStatus());

            service.getAfrezzaDetailsPorgramStatus();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showTr: function () {
        $('#tr-modal').modal('show');
        setTimeout(function () {
            $('#treatment-tr-details').unbind('onchange', service.getDetailsDistrictManagers());
            $('#treatment-tr-details').val($('#treatment-tr').val());
            $('#treatment-tr-details').bind('onchange', service.getDetailsDistrictManagers());

            service.getDetailsDistrictManagers();
            service.getFilterValuesById('[analytics].[GetTradeNames]', $('#program').val(), 'strength-tr-d');
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showDrilldownTr: function () {
        $('#reports-to-d').val($('#reports-to').val());
        $('#tr-modal').modal('show');
        setTimeout(function () {
            $('#treatment-tr-details').unbind('onchange', service.getDetailsDrilldownDistrictManagers());
            $('#treatment-tr-details').val($('#treatment-tr').val());
            $('#treatment-tr-details').bind('onchange', service.getDetailsDrilldownDistrictManagers());

            service.getDetailsDrilldownDistrictManagers();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showMl: function () {
        console.log('pv' + $('#program').val());
        service.getFilterValuesById('[analytics].[GetInsuranceTypes]', $('#program').val(), 'select-filter-insurance-type-dv');
        $('#ml-modal').modal('show');
        setTimeout(function () {
            $('#treatment-ml-details').unbind('onchange', service.getDetailsReferralSummaryByWeek());
            $('#treatment-ml-details').val($('#treatment-ml').val());
            $('#treatment-ml-details').bind('onchange', service.getDetailsReferralSummaryByWeek());

            service.getDetailsReferralSummaryByWeek();
        }, 500);
    },

    showBm: function () {
        $('#bm-modal').modal('show');
        setTimeout(function () {
            $('#treatment-bm-details').unbind('onchange', service.getDetailsPharmacyReferrals());
            $('#treatment-bm-details').val($('#treatment-bm').val());
            $('#treatment-bm-details').bind('onchange', service.getDetailsPharmacyReferrals());

            service.getDetailsPharmacyReferrals();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showBr: function () {
        $('#br-modal').modal('show');
        setTimeout(function () {
            $('#treatment-br-details').unbind('onchange', service.getDetailsTubesFilled());
            $('#treatment-br-details').val($('#treatment-br').val());
            $('#treatment-br-details').bind('onchange', service.getDetailsTubesFilled());

            service.getDetailsTubesFilled();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showMr: function () {
        $('#mr-modal').modal('show');
        setTimeout(function () {
            $('#treatment-mr-details').unbind('onchange', service.getDetailsPorgramMaps());
            $('#treatment-mr-details').val($('#treatment-mr').val());
            $('#treatment-mr-details').bind('onchange', service.getDetailsPorgramMaps());

            service.getDetailsPorgramMaps();
        }, 500);
    },

    showBr1: function () {
        $('#br1-modal').modal('show');
        setTimeout(function () {
            service.getDetailsUniquePatients();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showBr2: function () {
        $('#br2-modal').modal('show');
        setTimeout(function () {
            service.getDetailsOrderAnalysis();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showBr3: function () {
        $('#br3-modal').modal('show');
        setTimeout(function () {
            service.getDetailsRankAndAddress();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showBr4: function () {
        $('#br4-modal').modal('show');
        setTimeout(function () {
            service.getDetailsPAPorgramStatus();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showBr5: function () {
        $('#br5-modal').modal('show');
        setTimeout(function () {
            service.getDetailsPAPorgramMaps();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showBr6: function () {
        $('#br6-modal').modal('show');
        setTimeout(function () {
            service.getDetailsPROrderAnalysis();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showCipherPriorAuth: function () {
        $('#cipher-modal').modal('show');
        setTimeout(function () {
            service.getDetailsCipherPriorAuth();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showInformix1: function () {
        $('#informix-modal1').modal('show');
        setTimeout(function () {
            service.getCallCenterStaticticsDetails1();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showInformix2: function () {
        $('#informix-modal2').modal('show');
        setTimeout(function () {
            service.getCallCenterStaticticsDetails2();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showNetworkCapacity: function () {
        $('#network-modal').modal('show');
        setTimeout(function () {
            service.getNetworkCapacityDetails();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showSendEmailPopup: function () {
        adminWrapper.clearMailTemplateData();
        adminWrapper.preparePopupMail();
        $('#send-email-modal').modal({ backdrop: 'static', keyboard: false });
    },

    showIncomingReferralsByHour: function () {
        $('#incoming-referral-modal').modal('show');
        setTimeout(function () {
            service.getIncomingReferralsByHourDetails();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    show2HourCallKpiPercent: function () {
        $('#2hck-modal').modal('show');
        setTimeout(function () {
            service.get2HourCallKpiPercentDetails();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    show2HourCallVolume: function () {
        $('#2hcv-modal').modal('show');
        setTimeout(function () {
            service.get2HourCallVolumeDetails();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showOutboundStatistics: function () {
        $('#outbound-modal').modal('show');
        setTimeout(function () {
            service.getHubStatisticsOutboundCallsDetails();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showPrc: function () {
        $('#prc-modal').modal('show');
        setTimeout(function () {
            service.getDetailsPharmacyCReferrals();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showRttp: function () {
        $('#referral-time-modal').modal('show');
        setTimeout(function () {
            service.getDetailsReferralTimeToProcess();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showBi: function () {
        $('#bi-modal').modal('show');
        setTimeout(function () {
            service.getDetailsBenfitsInvestigations();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showCor: function () {
        $('#cor-modal').modal('show');
        setTimeout(function () {
            service.getDetailsCashOptions();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showSantyl: function () {
        $('#sntl-modal').modal('show');
        setTimeout(function () {
            service.getSantylDetailsData();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showRegranex: function () {
        $('#rgnx-modal').modal('show');
        setTimeout(function () {
            service.getRegranexDetailsData();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showReferralsCopayGt75: function () {
        $('#rc75-modal').modal('show');
        setTimeout(function () {
            service.getDetailsReferralsWithCopayGt75();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showHubstatisticsConsignment: function () {
        $('#consginment-modal').modal('show');
        setTimeout(function () {
            service.getHubStatisticsConsignmentChartDetails();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showPaStatus: function () {
        $('#pa-status-modal').modal('show');
        setTimeout(function () {
            service.getDetailsPaStatusUpdates();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showReferralStatus: function () {
        $('#referral-status-modal').modal('show');
        setTimeout(function () {
            service.getDetailsReferralStatus();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showPharmacyReferralsByAssignedOn: function () {
        $('#prad-modal').modal('show');
        setTimeout(function () {
            $('#treatment-prad-d').unbind('onchange', service.getDetailsPharmacyReferralsByAssignedOn());
            $('#treatment-prad-d').val($('#treatment-prad').val());
            $('#treatment-prad-d').bind('onchange', service.getDetailsPharmacyReferralsByAssignedOn());

            service.getDetailsPharmacyReferralsByAssignedOn();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },

    showRxcReasonByPrescriber: function () {
        $('#rxc-modal').modal('show');
        setTimeout(function () {
            $('#rxc-first-name-d').unbind('onchange', service.getDetailsRxcReasonByPrescriber());
            $('#rxc-first-name-d').val($('#rxc-first-name').val());
            $('#rxc-first-name-d').bind('onchange', service.getDetailsRxcReasonByPrescriber());

            $('#rxc-last-name-d').unbind('onchange', service.getDetailsRxcReasonByPrescriber());
            $('#rxc-last-name-d').val($('#rxc-last-name').val());
            $('#rxc-last-name-d').bind('onchange', service.getDetailsRxcReasonByPrescriber());

            service.getDetailsRxcReasonByPrescriber();
            $('.canvasjs-chart-credit').hide();
        }, 500);
    },
};