
app.controller('CanvasController', function($scope, CanvasFactory, socket, $http) {
  var canvasWindow = document.getElementById("canvas-window");
  var canvas = CanvasFactory.generateCanvas(canvasWindow.clientWidth,canvasWindow.clientHeight);
  var context = canvas.getContext("2d");
  var mouseDown = false;
  $scope.brushColor = "#000000";
  $scope.brushSize = 50;
  $scope.showOptions = false;
  var userID = 0;
  var usersObject = {};

  // Initialize the basic context variables
  context.lineWidth = ($scope.brushSize/2)+1;
  context.shadowBlur = 2;
  context.lineJoin = context.lineCap = "round";


  // HANDLE THE BRUSH CIRCLE
  $scope.openColorPicker = function() {
    var picker = document.getElementById("color-picker-element");
    picker.click();
  };


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
      userID: userID
    });
  }, false);

  // Here we send out an http request as soon as the page loads
  // We are returned a unique user number.

  $http({
    method: 'GET',
    url: 'api/modules'
  }).then(function successCallback(response) {
    userID = response.data.userID;
    usersObject[$scope.userID] = {xArray: [], yArray:[]};
    console.log("userId is: ", userID);
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });

  // Detect mouseup
  canvas.addEventListener("mouseup", function(evt) {
    mouseDown = false;
    socket.emit('mouseUp',{userID: userID});
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
        userID: userID
      });
    }
  }, false);

  canvas.addEventListener("touchstart", function(evt) {
    context.beginPath();
  });

  canvas.addEventListener("touchend", function(evt) {
    socket.emit('mouseUp',{userID: userID});
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
      userID: userID
    });
  });

  socket.on('newLine', function(data) {
    console.log("in newLine");
    context.strokeStyle = data.color;
    context.shadowColor = data.color;
    context.lineWidth = data.lineWidth;
    context.shadowBlur = 2;
    context.lineJoin = context.lineCap = "round";
    context.beginPath();
    var user;
    if (usersObject[data.userID]) {
      user = usersObject[data.userID];
      user.xArray.push(data.x);
      user.yArray.push(data.y);
      if (user.xArray.length > 1) {
        context.moveTo(user.xArray[user.xArray.length -2],user.yArray[user.yArray.length -2]);
        context.lineTo(user.xArray[user.xArray.length-1],user.yArray[user.yArray.length-1]);
        context.stroke();
      } else {
        context.moveTo(data.x,data.y);
        context.lineTo(data.x+0.5, data.y+0.5);
        context.stroke();
      }
    } else {
      usersObject[data.userID] = {xArray: [], yArray:[]};
      user = usersObject[data.userID];
      user.xArray.push(data.x);
      user.yArray.push(data.y);
      context.moveTo(data.x,data.y);
      context.lineTo(data.x+0.5, data.y+0.5);
      context.stroke();
    }
  });

  socket.on('endLine', function(data) {
    console.log("recieiving end line");
    if (usersObject[data.userID]) {
      usersObject[data.userID] = {xArray: [], yArray:[]};
    }
  });

  var parent = document.getElementById("canvas-window");
  parent.appendChild(canvas);

  var slider = angular.element('#slider');
  console.log(slider);
  
  //clears the canvas
  $scope.clearCanvas = function(){
    CanvasFactory.clear(context, canvas)
  }

});