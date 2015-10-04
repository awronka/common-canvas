app.config(function($stateProvider) {
    $stateProvider.state('canvas', {
        url: '/',
        templateUrl: '/pre-build/canvas/canvas.html',
        controller: 'CanvasController'
    });
});