//No longer used
var syncService = {
    refresh: function() {
        $('#start-time').text('00:00:00');
        $('#completed-time').text('00:00:00');
        $('#uploaded').text('0');
        $('#downloaded').text('0');
        $('#message').text('Ready');
    },

    setRemoteProvision: function (db) {
        $('#btn-sync').text('Provisioning is in progress..');
        syncService.refresh();
        $.ajax({
            type: 'GET',
            url: '/Sync/SetRemoteProvision',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                console.log(result);
                $('#start-time').text(result.StartTime);
                $('#completed-time').text(result.CompletedTime);
                $('#uploaded').text(result.Uploaded);
                $('#downloaded').text(result.Downloaded);
                $('#message').text(result.Message);
                $('#btn-sync').text('START');
            },
            error: function (xhr, status, exception) {
                console.log('Error: ' + exception + ', Status: ' + status);
                $('#btn-sync').text('START');
            }
        });
    },

    setLocalProvision: function (db) {
        $('#btn-sync').text('Provisioning is in progress..');
        syncService.refresh();
        $.ajax({
            type: 'GET',
            url: '/Sync/SetLocalProvision?db=' + db,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                console.log(result);
                $('#start-time').text(result.StartTime);
                $('#completed-time').text(result.CompletedTime);
                $('#uploaded').text(result.Uploaded);
                $('#downloaded').text(result.Downloaded);
                $('#message').text(result.Message);
                $('#btn-sync').text('START');
            },
            error: function (xhr, status, exception) {
                console.log('Error: ' + exception + ', Status: ' + status);
                $('#btn-sync').text('START');
            }
        });
    },

    sync: function (db) {
        $('#btn-sync').text('Synchronization is in progress..');
        syncService.refresh();
        $.ajax({
            type: 'GET',
            url: '/Sync/Start?db=' + db + '&direction=' + $('#direction').val(),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                console.log(result);
                $('#start-time').text(result.StartTime);
                $('#completed-time').text(result.CompletedTime);
                $('#uploaded').text(result.Uploaded);
                $('#downloaded').text(result.Downloaded);
                $('#message').text(result.Message);
                $('#btn-sync').text('START');
            },
            error: function (xhr, status, exception) {
                console.log('Error: ' + exception + ', Status: ' + status);
                $('#btn-sync').text('START');
            }
        });
    },

    syncAll: function() {
        syncService.sync('LOCALDB1');
        syncService.sync('LOCALDB2');
    }
};