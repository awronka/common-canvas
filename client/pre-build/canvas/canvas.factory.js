app.factory('CanvasFactory', function() {

    var PIXEL_RATIO = (function() {
        var ctx = document.createElement("canvas").getContext("2d"),
            dpr = window.devicePixelRatio || 1,
            bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;

        return dpr / bsr;
    })();


    return {
        generateCanvas: function(width, height) {
            var canvas = document.createElement("canvas");
            canvas.setAttribute("class", "screen-canvas");
            canvas.width = width * PIXEL_RATIO;
            canvas.height = height * PIXEL_RATIO;
            console.log("the canvas width is: ", canvas.width);
            console.log("the canvas height is: ", canvas.height);
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            canvas.getContext("2d").setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
            return canvas;
        },

        Trig: {
            distanceBetween2Points: function (point1, point2) {

                var dx = point2.x - point1.x;
                var dy = point2.y - point1.y;
                return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            },

            angleBetween2Points: function (point1, point2) {

                var dx = point2.x - point1.x;
                var dy = point2.y - point1.y;
                return Math.atan2(dx, dy);
            }
        },
        clear: function(context, canvas){
            context.clearRect(0, 0, canvas.width, canvas.height)
        },
        drawCanvasOffSentImage: function(context, canvas, data){
            if (!data) return;
            var image = new Image();
            image.src = data;
            // console.log("the image width is: ", image.width);
            // console.log("the image height is: ", image.height);
            image.onload = function() {
                //context.drawImage(image, 0, 0, image.width, image.height);
                context.drawImage(image,0,0,image.width/PIXEL_RATIO,image.height/PIXEL_RATIO);
            };
        },
        drawLineData: function(data, usersObject2, context){
                var user2;
                if (usersObject2[data.userID]) {
                context.strokeStyle = data.color;
                context.shadowColor = data.color;
                context.lineWidth = data.lineWidth;
                context.shadowBlur = 2;
                context.lineJoin = context.lineCap = "round";
                context.beginPath();
                user2 = usersObject2[data.userID];
                user2.xArray.push(data.x);
                user2.yArray.push(data.y);
                if (user2.xArray.length > 1) {
                    context.moveTo(user2.xArray[user2.xArray.length -2],user2.yArray[user2.yArray.length -2]);
                    context.lineTo(user2.xArray[user2.xArray.length-1],user2.yArray[user2.yArray.length-1]);

                    context.stroke();

                } else {
                    context.moveTo(data.x,data.y);
                    context.lineTo(data.x+0.5, data.y+0.5);

                    context.stroke();

                }
                } else {
                usersObject2[data.userID] = {xArray: [], yArray:[]};
                user2 = usersObject2[data.userID];
                user2.xArray.push(data.x);
                user2.yArray.push(data.y);
                context.moveTo(data.x,data.y);

                context.lineTo(data.x+0.5, data.y+0.5);

                context.stroke();
                }
            
        }
    };
});