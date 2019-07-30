var expirationInventoryReport = (function () {

    var init = function () {
        setTimeout(reRenderPharmacyFilters, 0);

        $('#filterContainerexpirationReport input[name=expirationInventoryType]').on('change', function () {
            var value = $('input[name=expirationInventoryType]:checked').val();
            refreshPharmacyNamesFilter(value);
        });

        $(document).on('table_expirationReportOnRefresh', function (event) {
            $('#table_expirationReport').append('<tr><td>Total:</td><td class="total"></td><td class="total"></td><td class="total"></td></tr>');

            var applyColor = function (columnIndex) {
                $('#table_expirationReport').find('.col' + columnIndex).each(function (index, element) {
                    if ($(element).text() != '-' && $(element).text() != '') {
                        var intVal = parseInt($(element).text());
                        if (intVal > 0 && $(element).find('a').data('isless52weekdating') === true)
                            $(element).parent().attr('style', 'background-color:#D3D3D3');
                        if (intVal > 0 && $(element).find('a').data('isgreater52andless54weekdating') === true)
                            $(element).parent().attr('style', 'background-color:yellow');
                    }
                });
            };

            applyColor(1); //column 1
            applyColor(2); //column 2

            var getSum = function (colNumber, totalCell) {
                var sum = 0;
                var selector = '.col' + colNumber;
                $('#table_expirationReport').find(selector).each(function (index, element) {
                    if ($(element).text() != '') {
                        var intVal = parseInt($(element).text());                        
                        sum += intVal;
                        if ($(element).find('a').data('drug') != undefined) {
                            $(totalCell).attr('data-drug', $(element).find('a').data('drug'));
                        }
                        $(totalCell).attr('data-expiration', '');                        
                    }
                });
                return sum;
            };
            $('#table_expirationReport').find('.total').each(function (index, element) {
                var selector = '.col' + (index + 1);
                var a = $('<a>');
                a.attr('href', 'javascript:;');
                var sum = getSum(index + 1, a);                
                $(a).text(sum);
                if (index + 1 != 3)
                    $(this).append(a);
                else
                    $(this).text(sum);
            });

            $('#table_expirationReport td a').on('click', function () {
                window.open(service.getRootUrl() + '/Inventory/ExpirationDetail?pharmacy='
                    + $('#expirationPharmacyName select').val().replace('#', '%23')
                    + '&drugName=' + $(this).data('drug').replace('#', '%23')
                    + '&expirationDate=' + $(this).data('expiration')
                    + '&inventorytype=' + $('#filterContainerexpirationReport input[name=expirationInventoryType]:checked').val(), true);                
            });
        });        
    };

    var reRenderPharmacyFilters = function () {
        var element = $('#filterContainerexpirationReport input[name=expirationInventoryType]:first-child');
        element.attr('checked', false);
        element[0].click();
    }

    var refreshPharmacyNamesFilter = function (inventoryType) {
        $('#expirationPharmacyName select').val('All');
        $.getJSON(service.getRootUrl() + '/Inventory/GetPharmacyNames?inventoryType=' + inventoryType, fillPharmacyNamesFilter);
    };

    var fillPharmacyNamesFilter = function (data) {
        $('#expirationPharmacyName select').html('');        
        $.each(data, function (index, value) {
            $('#expirationPharmacyName select').append($("<option />").val(value.replace('#', '%23')).text(value));
        });
    };

    return {
        init: init
    }
})();