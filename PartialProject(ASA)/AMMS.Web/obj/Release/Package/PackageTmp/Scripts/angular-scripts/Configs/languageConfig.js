ammsAng.config(['$translateProvider', function($translateProvider) {

    function getSecondaryPath () {
        var url = '';
        var paths = window.location.pathname.substring(1, window.location.pathname.length).split('/');
        for (var i = 0; i < paths.length - 2; i++) {
            url += '/' + paths[i];
        }
        return url;
    }

        
		var env = "dev";
		var location;
		switch(env){
		case "dev":
			location = '';
			break;
		case "test":
			location = '/amms-web';
			break;
		case "demo":
			location = '/ammsdemo-web';
			break;
		case "stg":
			location = '/amms-web';
			break;
		case "prd":
			location = '/amms-web';
			break;
		default :
			location = '/amms-web';
		}
        //var location = (env === "dev") ? '' : '/amms-web';
    $translateProvider.useStaticFilesLoader(
        {
            prefix:  location+'/translations/',
            suffix: '.json'
        }
    );
   

    





    }
]);