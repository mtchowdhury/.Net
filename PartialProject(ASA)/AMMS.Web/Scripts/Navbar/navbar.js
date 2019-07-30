var AMMS = {
    navbarUtility: function () {
        $("#menu-toggle").unbind("click");

        $("#menu-toggle").click(function (e) {
            $("#wrapper").toggleClass("active");
            $("#main-container").toggleClass("row-asa-expand");
            $("#padding").toggleClass("padding-class");
            e.preventDefault();
        });
        $(".sidebar-toggle").unbind("click");
        $(".sidebar-toggle").click(function (e) {
            console.log($(".sidebar-toggle"));
            $("#wrapper").toggleClass("active");
            $("#main-container").toggleClass("row-asa-expand");
            e.preventDefault();


        });
        $(".allMenus >a > i").unbind("click");
        $(".allMenus >a > i").on("click", function (e) {
            if (!$(this).hasClass('fa-plus') && !$(this).hasClass('fa-minus')) {
                //angular.element(document.getElementById('mainDivForSlowLoad')).scope().loadData();
                e.preventDefault();
                return;
            }
            $(this).toggleClass('fa-plus');
            $(this).toggleClass('fa-minus');
            $(this).parent().siblings().toggle('fast');
            //angular.element(document.getElementById('mainDivForSlowLoad')).scope().loadData();
            e.preventDefault();
        });

        $('[data-toggle="tooltip"]').tooltip();
       // $("#branchloadingImage").css("display", "none");
       // $("#loadingImage").css("display", "none");
    },
    tooltipUtility: function () {
        $('[data-toggle="tooltip"]').tooltip();
    },
    findWithAttr: function (array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    },

    handleServiceError: function (response) {
        if (response.status === 403) window.location = 'account/keyexpired';
    }

}

$(function () {
    $(".datepick-asa").datepicker();
});

function onContainerClick(event) {
    if (event.classList.contains('off')) {
        event.classList.remove('off');
    } else {
        event.classList.add('off');
    }
}



