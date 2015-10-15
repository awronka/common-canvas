
app.controller('CanvasController', function($scope, $rootScope, CanvasFactory, $state, socket, UserId, $http, $stateParams) {
  var canvasWindow = document.getElementById("canvas-window");
  var canvas = CanvasFactory.generateCanvas(canvasWindow.clientWidth,canvasWindow.clientHeight);
  var context = canvas.getContext("2d");
  var mouseDown = false;
  $scope.brushColor = "#000000";
  $scope.brushSize = 50;
  $scope.showOptions = false;
  $scope.userID = 0;
  var usersObject = {};
  
  $scope.userID = UserId;
  usersObject[$scope.userID] = {xArray: [], yArray:[]};
  // gets the room
  function activate(){
    if ($stateParams.room) {
      socket.emit('join room', {room: $stateParams.room, user:$scope.userID});
    } else {
      $stateParams.room = "general/general";
      socket.emit('join room', {room: $stateParams.room, user:$scope.userID});
    }
  }
  activate();

  // Initialize the basic context variables
  context.lineWidth = ($scope.brushSize/2)+1;
  context.shadowBlur = 2;
  context.lineJoin = context.lineCap = "round";

  //get a room via the form
  $scope.roomName = null;
  $scope.goToRoom = function(room){
    socket.emit('leave room', {room: $stateParams.room});
    socket.disconnect();
    $stateParams.room = room;
    $state.go('canvas', $stateParams,{ reload: true });
  };

  // HANDLE THE BRUSH CIRCLE
  $scope.openColorPicker = function() {
    var picker = document.getElementById("color-picker-element");
    picker.click();
  };


  // Detect mousedown
  canvas.addEventListener("mousedown", function(evt) {
    mouseDown = true;
    context.strokeStyle = $scope.brushColor;
    context.shadowColor = $scope.brushColor;
    context.lineWidth = ($scope.brushSize/2)+1;
    context.beginPath();
    context.moveTo(evt.layerX,evt.layerY);
    context.lineTo(evt.layerX+0.5, evt.layerY+0.5);
    context.stroke();

    // Now emit the drawing to everyone else
    socket.emit('draw',{
      x: (evt.layerX + 1),
      y: (evt.layerY + 1),
      color: $scope.brushColor,
      lineWidth: ($scope.brushSize/2)+1,
      userID: $scope.userID,
      room: $stateParams.room
    });
  }, false);


  // Detect mouseup
  canvas.addEventListener("mouseup", function(evt) {
    mouseDown = false;
    socket.emit('mouseUp',{userID: $scope.userID, room: $stateParams.room});
    usersObject[$scope.userID] = {xArray: [], yArray:[]};
  }, false);

  // Draw, if mouse button is pressed
  canvas.addEventListener("mousemove", function(evt) {
    if (mouseDown) {
      // first, draw on your own canvas
      context.strokeStyle = $scope.brushColor;
      context.shadowColor = $scope.brushColor;
      context.lineWidth = ($scope.brushSize/2)+1;
      var user = usersObject[$scope.userID];
      user.xArray.push(evt.layerX+1);
      user.yArray.push(evt.layerY+1);
      if (user.xArray.length > 1) {
        context.beginPath();
        context.moveTo(user.xArray[user.xArray.length -2],user.yArray[user.yArray.length -2]);
        context.lineTo(user.xArray[user.xArray.length-1],user.yArray[user.yArray.length-1]);
        context.stroke();
      }

      // Now emit the drawing to everyone else
      socket.emit('draw',{
        x: (evt.layerX + 1),
        y: (evt.layerY + 1),
        color: $scope.brushColor,
        lineWidth: ($scope.brushSize/2)+1,
        userID: $scope.userID,
        room: $stateParams.room
      });
    }
  }, false);

  canvas.addEventListener("touchstart", function(evt) {
    context.strokeStyle = $scope.brushColor;
    context.shadowColor = $scope.brushColor;
    context.lineWidth = ($scope.brushSize/2)+1;
    var user = usersObject[$scope.userID];
    user.xArray.push(evt.changedTouches[0].pageX);
    user.yArray.push(evt.changedTouches[0].pageY);

    context.beginPath();
    context.moveTo(evt.changedTouches[0].pageX,evt.changedTouches[0].pageY);
    context.lineTo(evt.changedTouches[0].pageX+0.5, evt.changedTouches[0].pageY+0.5);
    context.stroke();
  });

  canvas.addEventListener("touchend", function(evt) {
    socket.emit('mouseUp',{userID: $scope.userID, room: $stateParams.room});
    usersObject[$scope.userID] = {xArray: [], yArray:[]};
  });

  canvas.addEventListener("touchmove", function(evt) {
    // first, draw on your own canvas
    evt.preventDefault();
    context.strokeStyle = $scope.brushColor;
    context.shadowColor = $scope.brushColor;
    context.lineWidth = ($scope.brushSize/2)+1;
    var user = usersObject[$scope.userID];
    user.xArray.push(evt.changedTouches[0].pageX);
    user.yArray.push(evt.changedTouches[0].pageY);
    if (user.xArray.length > 1) {
      context.beginPath();
      context.moveTo(user.xArray[user.xArray.length -2],user.yArray[user.yArray.length -2]);
      context.lineTo(user.xArray[user.xArray.length-1],user.yArray[user.yArray.length-1]);
      context.stroke();
    }
    // Now emit the drawing to everyone else
    socket.emit('draw',{
      x: evt.changedTouches[0].pageX,
      y: evt.changedTouches[0].pageY,
      color: $scope.brushColor,
      lineWidth: ($scope.brushSize/2)+1,
      userID: $scope.userID,
      room: $stateParams.room
    });
  });
  
  //added a second user object in an attempt to debug the color/brush size error.
   var usersObject2 = {};
  socket.on('newLine', function(data) {
    CanvasFactory.drawLineData(data, usersObject2, context, mouseDown);
  });

  socket.on('endLine', function(data) {
    console.log("recieiving end line");
    if (usersObject2[data.userID]) {
      usersObject2[data.userID] = {xArray: [], yArray:[]};
    }
  });

  var parent = document.getElementById("canvas-window");
  parent.appendChild(canvas);

  var slider = angular.element('#slider');
  console.log(slider);
  
  //clears the canvas
  $scope.clearCanvas = function(){
    CanvasFactory.clear(context, canvas);
    socket.emit('delete canvas',{room: $stateParams.room});
  };
  
  //clears on other users end
  socket.on('clear canvas', function(){
    console.log("we are recieving the message on this end");
    CanvasFactory.clear(context,canvas);
  });
  
  //sends the current image to new users
  socket.on('get the current image', function(data){
    console.log("we have recieved a get image request");
    console.log("the room is: ", $stateParams.room);
    console.log("the user is: ", data.user);
    var imageForEmit = canvas.toDataURL();
    socket.emit('current image to new user', {image: imageForEmit, room:$stateParams.room, user:data.user, provider: $scope.userID})
  });
  
  // renders the new image
  socket.on('image to start', function(data){
    console.log("the image to start is running");
    CanvasFactory.drawCanvasOffSentImage(context, canvas, data.image)
  });
  
  //save image 
  $scope.saveCanvas = function(){
    var imagetoSave = canvas.toDataURL("image/png");
    imagetoSave = imagetoSave.replace("data:image/png;base64,", "");
    var saveObject = {};
    var imageNum = Math.floor(Math.random()*100)
    console.log(imageNum);
    saveObject.room = $stateParams.room;
    saveObject.imageUrl = "/"+$stateParams.room+ imageNum + "Image.png";
    socket.emit("image to save", {image: imagetoSave, room: $stateParams.room, num:imageNum});
    $http.post('api/modules/images', saveObject).then(function (res) {
			console.log(res.data);
			return res.data;
		});
  }
  
  // //allow tool bar to fade in 
  $scope.toolBarLogic = false;
  $rootScope.$on("tool bar show", function(evt, data){
    $scope.toolBarLogic = data.logic;
  })

});