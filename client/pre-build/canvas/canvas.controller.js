
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
  // console.log("my user id is: ", $scope.userID);
  usersObject[$scope.userID] = {xArray: [], yArray:[]};
  // gets the room
  function activate(){
  socket.emit('join room', {room: $stateParams.room});
  }
  activate();

  // Initialize the basic context variables
  context.lineWidth = ($scope.brushSize/2)+1;
  context.shadowBlur = 2;
  context.lineJoin = context.lineCap = "round";

  console.log("stateParams are: ",$stateParams);


  //get a room via the form
  $scope.roomName = null;
  $scope.goToRoom = function(room){
    $stateParams.room = room;
    console.log($stateParams);
    $state.go('canvas', $stateParams,{ reload: true });
  };

  // HANDLE THE BRUSH CIRCLE
  $scope.openColorPicker = function() {
    var picker = document.getElementById("color-picker-element");
    picker.click();
  };


  // Here we send out an http request as soon as the page loads
  // We are returned a unique user number.
  
  //   $http({
  //   method: 'GET',
  //   url: 'api/modules'
  // }).then(function successCallback(response) {
  //   $scope.userID = response.data.userID;
  //   usersObject[$scope.userID] = {xArray: [], yArray:[]};
  //   socket.emit('join room', {room: $stateParams.room});
  // }, function errorCallback(response) {
  //   // called asynchronously if an error occurs
  //   // or server returns response with an error status.
  // });

  // Detect mousedown
  canvas.addEventListener("mousedown", function(evt) {
    mouseDown = true;
    context.beginPath();
    context.strokeStyle = $scope.brushColor;
    context.shadowColor = $scope.brushColor;
    context.lineWidth = ($scope.brushSize/2)+1;

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
    context.beginPath();
    context.strokeStyle = $scope.brushColor;
    context.shadowColor = $scope.brushColor;
    context.lineWidth = ($scope.brushSize/2)+1;
    var user = usersObject[$scope.userID];
    user.xArray.push(evt.changedTouches[0].pageX);
    user.yArray.push(evt.changedTouches[0].pageY);

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
   var usersObject2 = {};
  socket.on('newLine', function(data) {
    console.log("in newLine");
    var user2;
 
    if (usersObject2[data.userID]) {
    context.strokeStyle = data.color;
    context.shadowColor = data.color;
    context.lineWidth = data.lineWidth;
    context.shadowBlur = 2;
    context.lineJoin = context.lineCap = "round";
    context.beginPath();
    console.log("1 the color is ", context.strokeStyle);
      user2 = usersObject2[data.userID];
      user2.xArray.push(data.x);
      user2.yArray.push(data.y);
      if (user2.xArray.length > 1) {
        context.moveTo(user2.xArray[user2.xArray.length -2],user2.yArray[user2.yArray.length -2]);
         console.log("2 the color is ", context.strokeStyle);
        context.lineTo(user2.xArray[user2.xArray.length-1],user2.yArray[user2.yArray.length-1]);
        console.log("3 the color is ", context.strokeStyle);
        context.stroke();
      } else {
        //context.moveTo(data.x,data.y);
        //context.lineTo(data.x+0.5, data.y+0.5);
        //context.stroke();
      }
    } else {
      usersObject2[data.userID] = {xArray: [], yArray:[]};
      user2 = usersObject2[data.userID];
      user2.xArray.push(data.x);
      user2.yArray.push(data.y);
      context.moveTo(data.x,data.y);
       console.log("4 the color is ", context.strokeStyle);
      context.lineTo(data.x+0.5, data.y+0.5);
       console.log("5 the color is ", context.strokeStyle);
      context.stroke();
    }
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
    console.log("we are recieving the message on this end")
    CanvasFactory.clear(context,canvas);
  });
  
  //sends the current image to new users
  socket.on('get the current image', function(data){
      var imageForEmit = canvas.toDataURL();
      socket.emit('current image to new user', {image: imageForEmit, room:$stateParams.room})
  });
  
  // renders the new image
  socket.on('image to start', function(data){
    console.log("the image to start is running");
    CanvasFactory.drawCanvasOffSentImage(context, canvas, data.image)
  });

});