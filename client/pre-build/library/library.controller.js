app.controller("LibraryCtrl", function($state,$scope,$http,$timeout, imageURLS){
	$scope.images = imageURLS;
	$scope.imageLogic = $scope.images.rainDropLogic;
	var randomNum = $scope.imageLogic.length;
	$scope.getInfo = function(){
		console.log($scope.randomNum)
	}
	
	$timeout(function(){
		var i = 0;
		makeVisible(i);
	}, 100)
	
	var makeVisible = function(num){
		$timeout(function(){ 
			$scope.imageLogic[num]= true;
			console.log("the")
			if(num<randomNum)makeVisible(num +1);
			
		}, 50);
		

	}
})