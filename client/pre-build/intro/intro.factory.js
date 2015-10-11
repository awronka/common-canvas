app.factory('IntroLogic', function(){
	var introComplete = false;
	return {
		
		getIntroLogic: function(){
			return introComplete;
		},
		setIntroLogic: function(val){
			introComplete = val;
		}
		
	}
})