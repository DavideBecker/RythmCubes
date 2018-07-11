var trackX = 0
var trackY = 0

function onColorMove(event) {
    if (event.data.length === 0) {
        return;
    }

    var maxRect;
    var maxRectArea = 0;

    event.data.forEach(function (rect) {
        if (rect.width * rect.height > maxRectArea) {
            maxRectArea = rect.width * rect.height;
            maxRect = rect;
        }
    });

    if (maxRectArea > 0) {
        var rectCenterX = maxRect.x + (maxRect.width / 2);
        var rectCenterY = maxRect.y + (maxRect.height / 2);
        // mouseX = (rectCenterX - 160) * (window.innerWidth / 320) * 10;
        // mouseY = (rectCenterY - 120) * (window.innerHeight / 240) * 10;

        trackX = -rectCenterX / window.innerWidth * 20 + 2;

        console.log(trackX)
    
        trackY = rectCenterY / window.innerHeight * 10;

        console.log(trackX, trackY)
    }
}

var tracker = new tracking.ColorTracker(['yellow']);
tracker.setMinDimension(5);
tracker.setMinGroupSize(10);

tracking.track('#video', tracker, {
    camera: true
});

tracker.on('track', onColorMove);