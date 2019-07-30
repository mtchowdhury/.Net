var epipenService = {
    init: function() {
        epipenService.getSchoolCounts('na');
        epipenService.getOrderQtys('na');
        epipenService.getNewRepeatCustomers();
        epipenService.getProductMix();
        epipenService.getOrderMap('na');
    },

    getSchoolCounts: function(date) {
        var dateType = date && date === 'na' ? date : $('#school-count-bg button.btn-selected').attr('data-date');
        $('#school-count-loading').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenChart/GetSchoolCounts?begDate=" + $('#school-count-begin-date').val() + '&endDate=' + $('#school-count-end-date').val() +
                '&dateType=' + dateType + '&inpCustomerCategory=' + $('#school-count-inpCustomerCategory').val() + '&disneySchoolId=All&inpStateReleaseDate=' + $('input[name=screleasedate]:checked').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
                $('#school-count-loading').hide();
                service.checkTimeout(result);
                epipenTableWrapper.renderSchoolCountTable(result);
            },
            error: function(xhr, status, exception) {
                $('#school-count-loading').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getLgSchoolCounts: function(date) {
        var dateType = date && date === 'na' ? date : $('#school-count-bg-lg button.btn-selected').attr('data-date');
        $('#school-count-lg-loading').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenChart/GetSchoolCounts?begDate=" + $('#school-count-lg-begin-date').val() + '&endDate=' + $('#school-count-lg-end-date').val() +
                '&dateType=' + dateType + '&inpCustomerCategory=' + $('#school-count-lg-inpCustomerCategory').val() + '&disneySchoolId=All&inpStateReleaseDate=' + $('input[name=sclgreleasedate]:checked').val() + '&totalAt=10',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
                $('#school-count-lg-loading').hide();
                service.checkTimeout(result);
                epipenTableWrapper.renderSchoolCountLgTable(result);
            },
            error: function(xhr, status, exception) {
                $('#school-count-lg-loading').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsSchoolCounts: function(beginDate, endDate, dateType, category, disneyId, releaseDate, date, state) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenChart/GetDetailsSchoolCounts?begDate=" + beginDate + '&endDate=' + endDate + '&dateType=' + dateType +
                '&inpCustomerCategory=' + category + '&disneySchoolId=' + disneyId + '&inpStateReleaseDate=' + releaseDate + '&date=' + date + '&state=' + state,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
                service.checkTimeout(result);
                epipenTableWrapper.renderDetailsSchoolCountTable(result);
            },
            error: function(xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getNewRepeatCustomers: function() {
        $('#new-repeat-loading').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenChart/GetNewRepeatCustomers?year=" + $('#new-repeat-year').val() + '&inpCustomerCategory=' + $('#new-repeat-inpCustomerCategory').val() +
                '&disneySchoolId=All&state=' + $('#new-repeat-state').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
                $('#new-repeat-loading').hide();
                service.checkTimeout(result);
                epipenTableWrapper.renderNewRepeatTable(result);
            },
            error: function(xhr, status, exception) {
                $('#new-repeat-loading').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getLgNewRepeatCustomers: function() {
        $('#new-repeat-lg-loading').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenChart/GetNewRepeatCustomers?year=" + $('#new-repeat-lg-year').val() + '&inpCustomerCategory=' + $('#new-repeat-lg-inpCustomerCategory').val() +
                '&disneySchoolId=All&state=' + $('#new-repeat-lg-state').val() + '&totalAt=10',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
                $('#new-repeat-lg-loading').hide();
                service.checkTimeout(result);
                epipenTableWrapper.renderLgNewRepeatTable(result);
            },
            error: function(xhr, status, exception) {
                $('#new-repeat-lg-loading').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getOrderQtys: function(date) {
        var dateType = date && date === 'na' ? date : $('#order-qty-bg button.btn-selected').attr('data-date');
        $('#order-qty-loading').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenChart/GetOrderQtys?begDate=" + $('#order-qty-begin-date').val() + '&endDate=' + $('#order-qty-end-date').val() +
                '&dateType=' + dateType + '&inpCustomerCategory=' + $('#order-qty-inpCustomerCategory').val() + '&disneySchoolId=All&inpStateReleaseDate=' + $('input[name=oqreleasedate]:checked').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
                $('#order-qty-loading').hide();
                service.checkTimeout(result);
                epipenTableWrapper.renderOrderQtyTable(result);
            },
            error: function(xhr, status, exception) {
                $('#order-qty-loading').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getLgOrderQtys: function(date) {
        var dateType = date && date === 'na' ? date : $('#order-qty-bg-lg button.btn-selected').attr('data-date');
        $('#order-qty-lg-loading').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenChart/GetOrderQtys?begDate=" + $('#order-qty-lg-begin-date').val() + '&endDate=' + $('#order-qty-lg-end-date').val() +
                '&dateType=' + dateType + '&inpCustomerCategory=' + $('#order-qty-lg-inpCustomerCategory').val() + '&disneySchoolId=All&inpStateReleaseDate=' + $('input[name=oqlgreleasedate]:checked').val() + '&totalAt=10',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
                $('#order-qty-lg-loading').hide();
                service.checkTimeout(result);
                epipenTableWrapper.renderOrderQtyLgTable(result);
            },
            error: function(xhr, status, exception) {
                $('#order-qty-lg-loading').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getDetailsOrderQtys: function (begDate, endDate, category, disneyId, releaseDate, date, state) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenChart/GetDetailsOrderQtys?begDate=" + begDate + '&endDate=' + endDate + '&dateType=na&inpCustomerCategory=' + category + '&disneySchoolId=' + disneyId + '&inpStateReleaseDate=' + releaseDate + '&state=' + state + '&date=' + date,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                epipenTableWrapper.renderDetailsOrderQtyTable(result);
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getProductMix: function() {
        var dateType = $('#product-mix-bg button.btn-selected').attr('data-date');
        $('#product-mix-loading').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/EpipenChart/GetProductMix?dateType=' + dateType + '&inpCustomerCategory=' + $('#product-mix-inpCustomerCategory').val() + '&disneySchoolId=All',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
                $('#product-mix-loading').hide();
                service.checkTimeout(result);
                epipenPieWrapper.renderProductMixChart(result);
            },
            error: function(xhr, status, exception) {
                $('#product-mix-loading').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getLgProductMix: function() {
        var dateType = $('#product-mix-bg-lg button.btn-selected').attr('data-date');
        $('#product-mix-lg-loading').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/EpipenChart/GetProductMix?dateType=' + dateType + '&inpCustomerCategory=' + $('#product-mix-lg-inpCustomerCategory').val() + '&disneySchoolId=All',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
                $('#product-mix-lg-loading').hide();
                service.checkTimeout(result);
                epipenPieWrapper.renderLgProductMixChart(result);
            },
            error: function(xhr, status, exception) {
                $('#product-mix-lg-loading').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getOrderMap: function(date) {
        var dateType = date && date === 'na' ? date : $('#order-map-bg button.btn-selected').attr('data-date');
        $('#order-map-loading').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenChart/GetOrderMaps?begDate=" + $('#order-map-begin-date').val() + '&endDate=' + $('#order-map-end-date').val() +
                '&dateType=' + dateType + '&inpCustomerCategory=' + $('#order-map-inpCustomerCategory').val() + '&disneySchoolId=All',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
                $('#order-map-loading').hide();
                service.checkTimeout(result);
                epipenMapWrapper.renderOrderMap(result);
            },
            error: function(xhr, status, exception) {
                $('#order-map-loading').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getLgOrderMap: function(date) {
        var dateType = date && date === 'na' ? date : $('#order-map-bg-lg button.btn-selected').attr('data-date');
        $('#order-map-lg-loading').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenChart/GetOrderMaps?begDate=" + $('#order-map-lg-begin-date').val() + '&endDate=' + $('#order-map-lg-end-date').val() +
                '&dateType=' + dateType + '&inpCustomerCategory=' + $('#order-map-lg-inpCustomerCategory').val() + '&disneySchoolId=All',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result) {
                $('#order-map-lg-loading').hide();
                service.checkTimeout(result);
                epipenMapWrapper.renderLgOrderMap(result);
            },
            error: function(xhr, status, exception) {
                $('#order-map-lg-loading').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getSchoolZips: function (reloadOther) {
        $('#epipen-order-details-loaidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenFilter/GetSchoolZips?inpCustomerCategory=" + $('#inpCustomerCategory').val() + '&state=' + $('#state').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#inpSchoolZip').empty();
                    $.each(result, function(index, item) {
                        $('#inpSchoolZip').append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    $('#inpSchoolZip').val('All');
                    epipenService.getSchoolNames(reloadOther);
                }
            },
            error: function (xhr, status, exception) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getSchoolNames: function (reloadOther) {
        $('#inpSchoolIDSrc').val('');
        $('#epipen-order-details-loaidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenFilter/GetSchoolNames?inpCustomerCategory=" + $('#inpCustomerCategory').val() + '&state=' + $('#state').val() + '&zip=' + $('#inpSchoolZip').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#inpSchoolID').empty();
                    $.each(result, function(index, item) {
                        $('#inpSchoolID').append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    $('#inpSchoolID').val('All');
                    if(reloadOther)
                        epipenService.getBatchIds();
                }
            },
            error: function (xhr, status, exception) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getSchoolNamesStr: function (reloadOther) {
        $('#epipen-order-details-loaidng').show();
        var str = $('#inpSchoolIDSrc').val();
        if (!str) return;
        console.log(str);
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/EpipenFilter/GetSchoolNamesStr?inpCustomerCategory=" + $('#inpCustomerCategory').val() + '&state=' + $('#state').val() + '&zip=' + $('#inpSchoolZip').val() + '&schoolNameStr=' + str,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#inpSchoolID').empty();
                    $.each(result, function (index, item) {
                        $('#inpSchoolID').append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    $('#inpSchoolID').val('All');
                    if (reloadOther)
                        epipenService.getBatchIds();
                }
            },
            error: function (xhr, status, exception) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    onBatchIdChanged: function() {
        epipenService.getOrderIds();
        epipenService.getPharmacies();
    },

    getBatchIds: function () {
        $('#epipen-order-details-loaidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/EpipenFilter/GetBatchIds?state=' + $('#state').val() + '&zip=' + $('#inpSchoolZip').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#batchId').empty();
                    $.each(result, function (index, item) {
                        $('#batchId').append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    $('#batchId').val('All');
                    epipenService.getOrderIds();
                    epipenService.getPharmacies();
                }
            },
            error: function (xhr, status, exception) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    onOrderIdChanged: function () {
        epipenService.getFilterPharmacies();
        epipenService.getContacts();
    },

    getOrderIds: function () {
        $('#orderIdSrc').val('');
        $('#epipen-order-details-loaidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/EpipenFilter/GetOrderIds?state=' + $('#state').val() + '&zip=' + $('#inpSchoolZip').val() + '&batchId=' + $('#batchId').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#orderId').empty();
                    $.each(result, function (index, item) {
                        $('#orderId').append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    $('#orderId').val('All');
                    epipenService.getFilterPharmacies();
                    epipenService.getContacts();
                }
            },
            error: function (xhr, status, exception) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getOrderIdsStr: function () {
        $('#epipen-order-details-loaidng').show();
        var str = $('#orderIdSrc').val();
        if (!str) return;
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/EpipenFilter/GetOrderIds?state=' + $('#state').val() + '&zip=' + $('#inpSchoolZip').val() + '&batchId=' + $('#batchId').val() + '&orderId=' + str,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#orderId').empty();
                    $.each(result, function (index, item) {
                        $('#orderId').append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    $('#orderId').val('All');
                    epipenService.getFilterPharmacies();
                    epipenService.getContacts();
                }
            },
            error: function (xhr, status, exception) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getPharmacies: function () {
        $('#epipen-order-details-loaidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/EpipenFilter/GetPharmacies?batchId=' + $('#batchId').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#inpPharmacy').empty();
                    $.each(result, function (index, item) {
                        $('#inpPharmacy').append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    $('#inpPharmacy').val('All');
                }
            },
            error: function (xhr, status, exception) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getFilterPharmacies: function () {
        $('#epipen-order-details-loaidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/EpipenFilter/GetDoctors?orderId=' + $('#orderId').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#inpDoctor').empty();
                    $.each(result, function (index, item) {
                        $('#inpDoctor').append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    $('#inpDoctor').val('All');
                }
            },
            error: function (xhr, status, exception) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    getContacts: function () {
        $('#epipen-order-details-loaidng').show();
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + '/EpipenFilter/GetContacts?state=' + $('#state').val() + '&zip=' + $('#inpSchoolZip').val() + '&orderId=' + $('#orderId').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(result);
                if (result && result.length > 0) {
                    $('#inpContactName').empty();
                    $.each(result, function (index, item) {
                        $('#inpContactName').append($('<option>', {
                            value: item.Value,
                            text: item.Name
                        }));
                    });
                    $('#inpContactName').val('All');
                }
            },
            error: function (xhr, status, exception) {
                $('#epipen-order-details-loaidng').hide();
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },
};