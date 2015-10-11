app.config(function($stateProvider) {
    $stateProvider.state('canvas', {
        url: '/',
        templateUrl: '/pre-build/canvas/canvas.html',
        resolve: {
            UserId: function($http){
                   return $http({
                        method: 'GET',
                        url: 'api/modules'
                    }).then(function successCallback(response) {
                        console.log(response.data.userID)
                        return response.data.userID;
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        },
        controller: 'CanvasController'
        
    })
});