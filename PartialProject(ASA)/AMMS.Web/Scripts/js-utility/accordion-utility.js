var accordionUtility = {
    setCaret: function(id) {
        $("i[id*='-down']").each(function (i, element) {
            if ($(element).attr('id') !== id + '-down') {
                $(element).removeClass('hide-caret');
            }
        });
        $("i[id*='-up']").each(function (i, element) {
            if ($(element).attr('id') !== id + '-up') {
                $(element).addClass('hide-caret');
            }
        });
        $('#' + id + '-down').toggleClass('hide-caret');
        $('#' + id + '-up').toggleClass('hide-caret');
    }
};