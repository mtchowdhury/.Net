(function () {

    "use strict";

    // Service to do CRUD operations on photos
    
      ammsAng.service("fileService", [
        "$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

            //Get all photos saved on the server  
            function getAll() {

                var deferred = $q.defer();

                $http.get($rootScope.commonApiBaseUrl + 'document/fileupload/add')
                  .success(function (result) {
                      deferred.resolve(result);
                  })
                  .error(function (error) {
                      deferred.reject(error);
                  });

                return deferred.promise;
            }

            //Get photo from server with given file name        
            function getPhoto(fileName) {

                var deferred = $q.defer();

                $http.get($rootScope.commonApiBaseUrl + 'document/fileupload/add' + fileName)
                  .success(function (result) {
                      deferred.resolve(result);
                  })
                  .error(function (error) {
                      deferred.reject(error);
                  });

                return deferred.promise;
            }

            // Delete photo on the server with given file name      
            function deletePhoto(fileName) {

                var deferred = $q.defer();
               $http.delete( $rootScope.commonApiBaseUrl + 'document/fileupload/add', { params: { fileName: fileName } })
                  .success(function (result) {
                      deferred.resolve(result);
                  }).error(function (error) {
                      deferred.reject(error);
                  });

                return deferred.promise;
            }

            return {
                getAll: getAll,
                getPhoto: getPhoto,
                deletePhoto: deletePhoto
            };
        }
      ]);


})();