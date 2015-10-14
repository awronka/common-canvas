app.config(function($stateProvider){
	    $stateProvider.state('library', {
        url: '/library/library',
        templateUrl: '/pre-build/library/library.html',
        controller: 'LibraryCtrl'
    })
});