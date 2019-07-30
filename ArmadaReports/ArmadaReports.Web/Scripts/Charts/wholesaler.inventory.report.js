var wholesalerInventoryReport = (function () {
	var init = function () {
	    $(document).on('table_wholesalerInventoryReportOnRefresh', function (event) {
	        $('#table_wholesalerInventoryReport td a').on('click', function () {
	            window.open(service.getRootUrl() + '/Inventory/WholesalerInventoryDetail?wholesaler='
                    + $(this).data('name').replace('#', '%23')
                    + '&drugName=' + $(this).data('drug').replace('#', '%23')
                    + '&week=' + $(this).data('week'), true);
			});
		});
	}

	return {
        init: init
	}
})();