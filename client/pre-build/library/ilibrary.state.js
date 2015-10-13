app.config(function($stateProvider){
	    $stateProvider.state('library', {
        url: '/library',
        templateUrl: '/pre-build/library/library.html',
        controller: 'LibraryCtrl'
    })
});