app.controller("LibraryCtrl", function($state,$scope,$http,imageURLS){
	$scope.data = imageURLS;
	$scope.showdata = function(){
		console.log($scope.data)
	}
})