$(document).ready(function() {
    function ajaxCallGet(urlString, editField) {
        $.ajax({
            type: 'GET',
            url: urlString,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "ApiKey": "Some-key",
                "User": "admin"
            },
            success: function(data) {
                console.log(data);
                $('#' + editField).val(JSON.stringify(data));
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
  
    $("#deleteCache").click(function () {
         
        var urlString = null;
        if ($("#cacheKey").val() === "") urlString = 'http://localhost:9627/api/InvalidateCache/Invalidate';
        else urlString = 'http://localhost:9627/api/InvalidateCache/Invalidate?cacheKey=' + $("#cacheKey").val();
        console.log(urlString);
        ajaxCallGet(urlString, "Details");
    });

    $("#branchDetailsButton").click(function() {
        var urlString = 'http://localhost:9627/api/Branch/get?id=' + Encrypt.encrypt('4');
        console.log(urlString);
        ajaxCallGet(urlString, "Details");
    });

    $("#allBranchButton").click(function() {
        var urlString = 'http://localhost:9627/api/Branch/getAll';
        console.log(urlString);
        ajaxCallGet(urlString, "Details");
    });

    $("#getModuleByUserButton").click(function () {
        var urlString = 'http://localhost:9627/api/Module/Get?userId=' + Encrypt.encrypt("admin");
        console.log(urlString);
        ajaxCallGet(urlString, "Details");
    });

    $("#getPropertiesByUserButton").click(function () {
        var urlString = 'http://localhost:9627/api/Property/Get?roleId=' + Encrypt.encrypt(6) + '&moduleId=' + Encrypt.encrypt(2);
        console.log(urlString);
        ajaxCallGet(urlString, "Details");
    });

    
    $("#getCommandsByRoleIdPropertyId").click(function () {
        var urlString = 'http://localhost:9627/api/Command/Get?roleId=' + Encrypt.encrypt(3) + '&propertyId=' + Encrypt.encrypt(10);
        console.log(urlString);
        ajaxCallGet(urlString, "Details");
    });
});
        

