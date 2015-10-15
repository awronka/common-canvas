app.directive("colorpickersub", function($rootScope, $state, $http){
	    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/pre-build/color.picker.directive/color.picker.sub.html',
		controller: 'ColorPickerCtrl'
    };
})