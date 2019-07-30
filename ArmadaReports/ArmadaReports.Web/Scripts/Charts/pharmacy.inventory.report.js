var pharmacyInventoryReport = (function () {
	var init = function (columnsCount) {
	    $(document).on('table_pharmacyInventoryReportOnRefresh', function (event) {
	        var rowContent =
	            '<td><div></div>Grand Total:</td><td class="total total1"></td><td class="total total2"></td><td class="total total3"></td><td class="total total4"></td><td class="total total5 total-border"></td><td class="total total6"></td><td class="total total7"></td><td class="total total8"></td>';
	        if (columnsCount === 3) {
	            rowContent += '<td class="total total9 total-border"></td><td class="total total10"></td><td class="total total11"></td><td class="total total12"></td>';	            
	        }
		    $('#table_pharmacyInventoryReport').append('<tr class="total-row">' + rowContent + '</tr>');
			var getSum = function (colNumber, totalCell) {
				var sum = 0;
				var selector = '.col' + colNumber + ' a';
				$('#table_pharmacyInventoryReport').find(selector).each(function (index, element) {
					if ($(element).text() != '-' && $(element).text() != '') {
						var intVal = parseInt($(element).text());
						if ((selector == '.col1 a' || selector == '.col5 a') && intVal > 0)
							$(element).parent().attr('style', 'background-color:#D3D3D3');
						//if ((selector == '.col3 a' || selector == '.col7 a') && intVal > 0)
						//	$(element).parent().attr('style', 'background-color:yellow');
						sum += intVal;						
						$(totalCell).attr('data-drug', $(element).data('drug'));
						$(totalCell).attr('data-week', $(element).data('week'));
						$(totalCell).attr('data-name', '');
					}
				});
				return sum;
			};
			$('#table_pharmacyInventoryReport').find('.total').each(function (index, element) {
			    var selector = '.col' + (index + 1);			    
				var a = $('<a>');
				a.attr('href', 'javascript:;');
				var sum = getSum(index + 1, a);			    
				//if ((selector == '.col1' || selector == '.col5') && sum > 0)
				//	$(element).attr('style', 'background-color:#D3D3D3');				

			    //if ([1, 2, 3, 4, 5, 6, 7, 8].indexOf(index + 1) > -1 && sum > 0) {
			    if (sum > 0) {
				    $(a).text(sum);
				    $(this).append($('<span>').append(a));
				}
				else
				    $(this).html('<span>' + sum + '</span>');

			    //if ((selector == '.col3' || selector == '.col7') && sum > 0)
			    //    $(element).find('span').attr('style', 'background-color:yellow');
			});
			$('#table_pharmacyInventoryReport td a').on('click', function () {
			    window.open(service.getRootUrl() + '/Inventory/PharmacyInventoryDetail?pharmacy='
			        + $(this).data('name').replace('#', '%23')
			        + '&drugName=' + $(this).data('drug').replace('#', '%23')
			        + '&week=' + $(this).data('week')
			        + '&inventorytype=' + $('#filterContainerpharmacyInventoryReport input[name=inventoryType]:checked').val(), true);
			});
		});
	}

	return {
        init: init
	}
})();