var tableWrapper = {
    raTable: null,
    radTable: null,
    ncTable: null,
    ncDetailsTable: null,
    consignmentDetailsTable: null,
    newRxTable: null,
    notesStatusTable: null,
    renderReferralSummaryTable: function (data) {
        var fourWeek = $('#hid-cipher').val() === "1" ? "fourweek" : "fourormoreweek";
        $('table#m-m-table tbody').html('');
        var html = '';
        $.each(data, function (index, item) {
            if (index < data.length - 1) {
                html += '<tr>' +
                            '<td> <a href="javascript:void(0)" onclick="tableWrapper.showDetails(\'show-row-' + index + '\')">' + item.ProgramStatus + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=allreferrals&rowCount=' + item.GrandTotalCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.GrandTotalCount).format('0,0') + '</a></td>' +
                            '<td class="number">' + item.GrandTotalCountPercent + '%</td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=thisweek&rowCount=' + item.ThisWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.ThisWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=lastweek&rowCount=' + item.LastWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.LastWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus)  + '&programId=' + $('#program').val() + '&dateRangeType=twoweek&rowCount=' + item.TwoWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.TwoWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus)  + '&programId=' + $('#program').val() + '&dateRangeType=threeweek&rowCount=' + item.ThreeWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.ThreeWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=' + fourWeek + '&rowCount=' + item.FourWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.FourWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=qtd&rowCount=' + item.QtdCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.QtdCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=ytd&rowCount=' + item.YtdCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.YtdCount).format('0,0') + '</a></td>' +
                            '<td class="number">' + item.ThisWeekCountPercent + '%</td>' +
                            '<td class="number">' + item.LastWeekCountPercent + '%</td>' +
                            '<td class="number">' + item.TwoWeekCountPercent + '%</td>' +
                            '<td class="number">' + item.ThreeWeekCountPercent + '%</td>' +
                            '<td class="number">' + item.FourWeekCountPercent + '%</td>' +
                            '<td class="number">' + item.QtdCountPercent + '%</td>' +
                            '<td class="number">' + item.YtdCountPercent + '%</td>' +
                        '</tr>' +
                        '<tr class="details-row hide-row show-row-' + index + '" data-hidden="yes"><td colspan="17">' +
                            '<table class="table inner-table">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<td>(' + item.ProgramStatus + ') - Program Status</td>' +
                                        '<td>Total HUB Referrals</td>' +
                                        '<td>This Week</td>' +
                                        '<td>Last Week</td>' +
                                        '<td>Two Weeks Ago</td>' +
                                        '<td>Three Weeks Ago</td>' +
                                        '<td>Four or More Weeks Ago</td>' +
                                        '<td>QTD</td>' +
                                        '<td>YTD</td>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>';
                
                $.each(item.SubSummary, function (indx, itm) {
                    html += '<tr>' +
                                '<td>' + itm.ProgramStatus + '</td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=allreferrals&rowCount=' + itm.GrandTotalCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.GrandTotalCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=thisweek&rowCount=' + itm.ThisWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.ThisWeekCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=lastweek&rowCount=' + itm.LastWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.LastWeekCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=twoweek&rowCount=' + itm.TwoWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.TwoWeekCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=threeweek&rowCount=' + itm.ThreeWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.ThreeWeekCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=' + fourWeek + '&rowCount=' + itm.FourWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.FourWeekCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=qtd&rowCount=' + itm.QtdCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.QtdCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus))+ '&programId=' + $('#program').val() + '&dateRangeType=ytd&rowCount=' + itm.YtdCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.YtdCount).format('0,0') + '</a></td>' +
                            '</tr>';
                });

                html += '</tbody>' +
                    '</table>' +
                    '</td>' +
                    '</tr>';
            } else {
                html += '<tr class="total-row">' +
                            '<td>' + item.ProgramStatus + '</td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=allreferrals&rowCount=' + item.GrandTotalCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.GrandTotalCount).format('0,0') + '</a></td>' +
                            '<td></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=thisweek&rowCount=' + item.ThisWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.ThisWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=lastweek&rowCount=' + item.LastWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.LastWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=twoweek&rowCount=' + item.TwoWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.TwoWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=threeweek&rowCount=' + item.ThreeWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.ThreeWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' + fourWeek + '&rowCount=' + item.FourWeekCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.FourWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=qtd&rowCount=' + item.QtdCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.QtdCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=ytd&rowCount=' + item.YtdCount + '&insType=' + $('#select-filter-insurance-type').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.YtdCount).format('0,0') + '</a></td>' +
                            '<td colspan="7"></td>' +
                        '</tr>';
            }
            

        });
        $('table#m-m-table tbody').html(html);
        if (data.length > 0 && data[0].CancelledCopayCard && data[0].CancelledCopayCard !== 'null') {
            $('#ccc').text(data[0].CancelledCopayCard);
        } else {
            $('#ccc').text('');
        }
        if (data.length > 0 && data[0].ProductBridge && data[0].CancelledProductBridgeCopayCard !== 'null') {
            $('#pb').text(data[0].ProductBridge);
        } else {
            $('#pb').text('');
        }
    },

    renderDetailsReferralSummaryTable: function (data) {
        var fourWeek = $('#hid-cipher').val() === "1" ? "fourweek" : "fourormoreweek";
        $('table#m-m-d-table tbody').html('');
        var html = '';
        $.each(data, function (index, item) {
            if (index < data.length - 1) {
                html += '<tr>' +
                            '<td> <a href="javascript:void(0)" onclick="tableWrapper.showDetails(\'show-row-details-' + index + '\')">' + item.ProgramStatus + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=allreferrals&rowCount=' + item.GrandTotalCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.GrandTotalCount).format('0,0') + '</a></td>' +
                            '<td class="number">' + item.GrandTotalCountPercent + '%</td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus)  + '&programId=' + $('#program').val() + '&dateRangeType=thisweek&rowCount=' + item.ThisWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.ThisWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=lastweek&rowCount=' + item.LastWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.LastWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=twoweek&rowCount=' + item.TwoWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.TwoWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=threeweek&rowCount=' + item.ThreeWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.ThreeWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=' + fourWeek + '&rowCount=' + item.FourWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.FourWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=qtd&rowCount=' + item.QtdCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.QtdCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + '&programId=' + $('#program').val() + '&dateRangeType=ytd&rowCount=' + item.YtdCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.YtdCount).format('0,0') + '</a></td>' +
                            '<td class="number">' + item.ThisWeekCountPercent + '%</td>' +
                            '<td class="number">' + item.LastWeekCountPercent + '%</td>' +
                            '<td class="number">' + item.TwoWeekCountPercent + '%</td>' +
                            '<td class="number">' + item.ThreeWeekCountPercent + '%</td>' +
                            '<td class="number">' + item.FourWeekCountPercent + '%</td>' +
                            '<td class="number">' + item.QtdCountPercent + '%</td>' +
                            '<td class="number">' + item.YtdCountPercent + '%</td>' +
                        '</tr>' +
                        '<tr class="details-row hide-row show-row-details-' + index + '" data-hidden="yes"><td colspan="17">' +
                            '<table class="table inner-table">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<td>(' + item.ProgramStatus + ') - Program Status</td>' +
                                        '<td>Total HUB Referrals</td>' +
                                        '<td>This Week</td>' +
                                        '<td>Last Week</td>' +
                                        '<td>Two Weeks Ago</td>' +
                                        '<td>Three Weeks Ago</td>' +
                                        '<td>Four or More Weeks Ago</td>' +
                                        '<td>QTD</td>' +
                                        '<td>YTD</td>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>';

                $.each(item.SubSummary, function (indx, itm) {
                    html += '<tr>' +
                                '<td>' + itm.ProgramStatus + '</td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=allreferrals&rowCount=' + itm.GrandTotalCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.GrandTotalCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=thisweek&rowCount=' + itm.ThisWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.ThisWeekCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=lastweek&rowCount=' + itm.LastWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.LastWeekCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=twoweek&rowCount=' + itm.TwoWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.TwoWeekCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=threeweek&rowCount=' + itm.ThreeWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.ThreeWeekCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=' + fourWeek + '&rowCount=' + itm.FourWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.FourWeekCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus)) + '&programId=' + $('#program').val() + '&dateRangeType=qtd&rowCount=' + itm.QtdCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.QtdCount).format('0,0') + '</a></td>' +
                        '<td class="number"><a class="substatus" href="' + service.getRootUrl() + '/Details/Index?programStatus=' + tableWrapper.encodeUrl(item.ProgramStatus) + (itm.ProgramStatus == null || itm.ProgramStatus === '' ? '' : '&programSubStatus=' + tableWrapper.encodeUrl(itm.ProgramStatus))+ '&programId=' + $('#program').val() + '&dateRangeType=ytd&rowCount=' + itm.YtdCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(itm.YtdCount).format('0,0') + '</a></td>' +
                            '</tr>';
                });

                html += '</tbody>' +
                    '</table>' +
                    '</td>' +
                    '</tr>';
            } else {
                html += '<tr class="total-row">' +
                            '<td>' + item.ProgramStatus + '</td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=allreferrals&rowCount=' + item.GrandTotalCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.GrandTotalCount).format('0,0') + '</a></td>' +
                            '<td></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=thisweek&rowCount=' + item.ThisWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.ThisWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=lastweek&rowCount=' + item.LastWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.LastWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=twoweek&rowCount=' + item.TwoWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.TwoWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=threeweek&rowCount=' + item.ThreeWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.ThreeWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=' + fourWeek + '&rowCount=' + item.FourWeekCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.FourWeekCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=qtd&rowCount=' + item.QtdCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.QtdCount).format('0,0') + '</a></td>' +
                    '<td class="number"><a href="' + service.getRootUrl() + '/Details/Index?programId=' + $('#program').val() + '&dateRangeType=ytd&rowCount=' + item.YtdCount + '&insType=' + $('#select-filter-insurance-type-dv').val() + '&reportName=ReferralByWeek&measureId=17" target="_blank">' + numeral(item.YtdCount).format('0,0') + '</a></td>' +
                            '<td colspan="7"></td>' +
                        '</tr>';
            }


        });
        $('table#m-m-d-table tbody').html(html);
        if (data.length > 0 && data[0].CancelledCopayCard && data[0].CancelledCopayCard !== 'null') {
            $('#ccc-d').text(data[0].CancelledCopayCard);
        } else {
            $('#ccc-d').text('');
        }
        if (data.length > 0 && data[0].ProductBridge && data[0].CancelledProductBridgeCopayCard !== 'null') {
            $('#pb-d').text(data[0].ProductBridge);
        } else {
            $('#pb-d').text('');
        }
    },

    renderRankAndAddress: function (data) {
        if (tableWrapper.raTable) tableWrapper.raTable.destroy();
        $('table#br3-table tbody').html('');
        $.each(data, function (index, item) {
            $('table#br3-table tbody').append('<tr>' +
                    '<td>' + item.Practitioner + '</td>' +
                    '<td>' + item.ProductName + '</td>' +
                    '<td>' + item.Ndc + '</td>' +
                    '<td><a href="' + service.getRootUrl() + '/Details/OrderDetails?doctorState=' + item.State + '&doctorId=' + item.DoctorId + '&programId=' + $('#program').val() + '&dateType=' + $('#bg-br3 button.btn-selected').attr('data-date') + '&divReport=PractitionerRank" target="_blank">' + item.PrescriptionCount + '</a></td>' +
                    '<td>' + item.PatientCount + '</td>' +
                    '<td>' + item.Dea + '</td>' +
                    '<td>' + item.LicenseNumber + '</td>' +
                    '<td>' + item.Address1 + '</td>' +
                    '<td>' + item.City + '</td>' +
                    '<td>' + item.State + '</td>' +
                    '<td>' + item.PostalCode + '</td>' +
                '</tr>');
        });
        tableWrapper.raTable = $('#br3-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 5,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    renderDetailsRankAndAddress: function (data) {
        if (tableWrapper.radTable) tableWrapper.radTable.destroy();
        $('table#br3-d-table tbody').html('');
        $.each(data, function (index, item) {
            $('table#br3-d-table tbody').append('<tr>' +
                    '<td>' + item.Practitioner + '</td>' +
                    '<td>' + item.ProductName + '</td>' +
                    '<td>' + item.Ndc + '</td>' +
                    '<td><a href="' + service.getRootUrl() + '/Details/OrderDetails?doctorState=' + item.State + '&doctorId=' + item.DoctorId + '&programId=' + $('#program').val() + '&dateType=' + $('#bg-br3 button.btn-selected').attr('data-date') + '&divReport=PractitionerRank" target="_blank">' + item.PrescriptionCount + '</a></td>' +
                    '<td>' + item.PatientCount + '</td>' +
                    '<td>' + item.Dea + '</td>' +
                    '<td>' + item.LicenseNumber + '</td>' +
                    '<td>' + item.Address1 + '</td>' +
                    '<td>' + item.City + '</td>' +
                    '<td>' + item.State + '</td>' +
                    '<td>' + item.PostalCode + '</td>' +
                '</tr>');
        });
        tableWrapper.radTable = $('#br3-d-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 5,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    showDetails: function (classAttr) {
        $('.details-row').addClass('hide-row');
        if ($('.' + classAttr).attr('data-hidden') === 'yes') {
            $('.' + classAttr).removeClass('hide-row');
            $('.' + classAttr).attr('data-hidden', 'no');
        } else {
            $('.' + classAttr).addClass('hide-row');
            $('.' + classAttr).attr('data-hidden', 'yes');
        }        
    },

    renderNetworkCapacityTable: function (data) {
        if (tableWrapper.ncTable) tableWrapper.ncTable.destroy();
        $('table#nc-table thead').html('');
        $('table#nc-table tbody').html('');
        var head = '<tr>';
        $.each(data.Table.Columns, function (index, item) {
            head += '<td>' + item + '</td>';
        });
        head += '</tr>';
        $('table#nc-table thead').append(head);
        $.each(data.Table.Data, function (index, item) {
            var tr = '<tr>';
            $.each(item, function (indx, itm) {
                tr += '<td>' + itm + '</td>';
            });
            tr += '</tr>';
            $('table#nc-table tbody').append(tr);
        }); 
        tableWrapper.ncTable = $('#nc-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 5,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    renderNetworkCapacityDetailsTable: function (data) {
        if (tableWrapper.ncDetailsTable) tableWrapper.ncDetailsTable.destroy();
        $('table#nc-table-d thead').html('');
        $('table#nc-table-d tbody').html('');
        var head = '<tr>';
        $.each(data.Table.Columns, function (index, item) {
            head += '<td>' + item + '</td>';
        });
        head += '</tr>';
        $('table#nc-table-d thead').append(head);
        $.each(data.Table.Data, function (index, item) {
            var tr = '<tr>';
            $.each(item, function (indx, itm) {
                tr += '<td>' + itm + '</td>';
            });
            tr += '</tr>';
            $('table#nc-table-d tbody').append(tr);
        });
        tableWrapper.ncDetailsTable = $('#nc-table-d').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': false,
            "aaSorting": [],
            "iDisplayLength": 5,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    initConsignmentDetails: function () {
        if (tableWrapper.consignmentDetailsTable) tableWrapper.consignmentDetailsTable.destroy();

        tableWrapper.consignmentDetailsTable = $('#consignment-details-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': true,
            "aaSorting": [],
            "iDisplayLength": 10,
            "lengthMenu": [[5, 10, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">'
        });
    },

    getNewRxPrograms: function (programId) {
        $.ajax({
            type: "GET",
            url: service.getRootUrl() + "/Filter/GetPrograms",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                service.checkTimeout(result);
                if (result && result.programs.length > 0) {
                    $.each(result.programs, function (index, item) {
                        $('#newrx-program').append($('<option>', {
                            value: item.Id,
                            text: item.Name
                        }));
                    });
                    $('#newrx-program').val(programId);
                }
            },
            error: function (xhr, status, exception) {
                service.checkTimeout(xhr);
                console.log("Error: " + exception + ", Status: " + status);
            }
        });
    },

    initNewRxReport: function () {
        if (tableWrapper.newRxTable) tableWrapper.newRxTable.destroy();

        tableWrapper.newRxTable = $('#newrx-table').DataTable({
            'bDestroy': true,
            'searching': false,
            'ordering': true,
            //'autoWidth': false,
            "aaSorting": [],
            "iDisplayLength": 20,
            "lengthMenu": [[5, 10, 20, 25, 50, 100, 200, 500, 1000, -1], [5, 10, 20, 25, 50, 100, 200, 500, 1000, "All"]],
            "sDom": '<"top"flp>rt<"bottom"i><"clear">',
            //'columnDefs': [
            //    { "width": "400px", 'targets': [0, 4]},
            //    { "width": "200px", 'targets': [5, 24]}
            //]
        });
    },

    getNewRxReport: function (fromMenu) {
        //console.log(localStorage.getItem('newrx-program-id'));
        var url = service.getRootUrl() + '/Report/GetNewRxByPhysician?programId=' +
        ($('#newrx-program').val() ? $('#newrx-program').val() : localStorage.getItem('newrx-program-id'));
        //console.log(url);
        if (fromMenu)
            window.open(url, '_blank');
        else
            window.location = url;
    },

    encodeUrl: function(urlString) {
        return urlString
            .replace(/%/g, '%25')
            .replace(/!/g, '%21')
            .replace(/"/g, '%22')
            .replace(/#/g, '%23')
            .replace(/[$]/g, '%24')
            .replace(/&/g, '%26')
            .replace(/'/g, '%27')
            .replace(/[*]/g, '%2A')
            .replace(/[+]/g, '%2B')
            .replace(/[/]/g, '%2F')
            .replace(/=/g, '%3D')
            .replace(/[?]/g, '%3F');
    }
};