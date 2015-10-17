app.config(function($stateProvider){
	    $stateProvider.state('library', {
        url: '/library/library',
        templateUrl: '/pre-build/library/library.html',
        controller: 'LibraryCtrl',
		resolve: {
			imageURLS: function($http){
                return $http.get("api/modules/images").then(function(imageUrls){
                    var rainDropLogic = [];
                    for(var i = 0; i< imageUrls.data.length; i++){
                        rainDropLogic.push(false)
                    }
                    imageUrls.data.rainDropLogic = rainDropLogic;
                    return imageUrls.data;
                })
            }
		}
    })
});