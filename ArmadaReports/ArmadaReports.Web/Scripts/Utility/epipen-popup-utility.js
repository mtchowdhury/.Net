var epipenPopup = {
    showSchoolCountPopup: function() {
        $('#school-count-modal').modal('show');
        setTimeout(function () {
            epipenService.getLgSchoolCounts('na');
        }, 500);
    },

    showNewRepeatPopup: function () {
        $('#new-repeat-modal').modal('show');
        setTimeout(function () {
            epipenService.getLgNewRepeatCustomers();
        }, 500);
    },

    showProductMixPopup: function () {
        $('#product-mix-modal').modal('show');
        setTimeout(function () {
            epipenService.getLgProductMix();
        }, 500);
    },

    showOrderQtyPopup: function () {
        $('#order-qty-modal').modal('show');
        setTimeout(function () {
            epipenService.getLgOrderQtys('na');
        }, 500);
    },

    showOrderMapPopup: function () {
        $('#order-map-modal').modal('show');
        setTimeout(function () {
            epipenService.getLgOrderMap('na');
        }, 500);
    },
};