app.controller('IntroCtrl', function($scope, $timeout, IntroLogic, $stateParams){
	$scope.introOver = true;
	$scope.titleShow = false;
	$scope.subTitleShow = false;
	$scope.clickStart = false;
	$scope.newRoomStart = false;
	$scope.roomName = $stateParams.room;
	
	if(IntroLogic.getIntroLogic()===false){
		$timeout(function(){ 
			$scope.titleShow = true;
		}, 1000);
		
		$timeout(function(){ 
			$scope.subTitleShow = true;
		}, 1500);
		
		$timeout(function(){ 
			$scope.titleShow = false;
		}, 3000);
		
		$timeout(function(){ 
			$scope.subTitleShow = false;
		}, 3000);
		
		$timeout(function(){ 
			$scope.clickStart = !($scope.clickStart);
			blink();
		}, 4000);
		
	 }
	 else{
		 
		$timeout(function(){ 
			$scope.newRoomStart = true;
		}, 1000);
		
		$timeout(function(){ 
			$scope.newRoomStart = false;
			blink();
		}, 3000);
		 
	 }
	 
	var blink = function(){
		if($scope.introOver === true){
			$timeout(function(){
				$scope.clickStart = !($scope.clickStart);
				blink();
			}, 750)
		}
	};	
	 
	 
	 $scope.hide = function(){
		 $scope.introOver = !($scope.introOver)
		 IntroLogic.setIntroLogic(true);
	 }
});