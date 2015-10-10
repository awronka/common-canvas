app.directive("introcard", function($rootScope, $state, $http){
	    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/pre-build/intro/intro.html',
		controller: 'IntroCtrl'
    };
})