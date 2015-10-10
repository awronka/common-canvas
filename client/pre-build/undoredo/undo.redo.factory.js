app.factory("UndoRedo", function(){
	var undoCache = [];
	var redoCache = [];
	// picCache close over array to save image values
	return {
		saveImageState : function(img){
			// console.log(img);
			if(redoCache.length){
				redoCache = [];
			}
			
			undoCache.push(img)
			// console.log(undoCache)
			if(undoCache.length > 10){
				undoCache.shift();
			}
		},
		redo : function(img){
			if(!redoCache.length) return;
			var redoMove = redoCache.pop();
			undoCache.push(redoMove);
			return redoMove;
			
		},
		undo : function(){
			if(!undoCache.length) return;
			redoCache.push(undoCache.pop())
			return undoCache[undoCache.length-1];
		}
	}
	
	
})