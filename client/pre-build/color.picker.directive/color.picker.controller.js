app.controller("ColorPickerCtrl", function($scope, $stateParams, $rootScope){
	
	$scope.colorSelect =  function(color){
		$rootScope.$broadcast("get color", {newColor: color})
	}
})