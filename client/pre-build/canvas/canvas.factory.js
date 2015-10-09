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
        }
    };
});