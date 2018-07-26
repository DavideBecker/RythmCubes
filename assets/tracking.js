var trackX = 0
var trackY = 0

function onColorMove(event) {
    if (event.data.length === 0) {
        return;
    }

    var maxRect;
    var maxRectArea = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    event.data.forEach(function(rect) {
        if (rect.width * rect.height > maxRectArea) {
            maxRectArea = rect.width * rect.height;
            maxRect = rect;
        }

        if (rect.color === 'custom') {
            rect.color = tracker.customColor;
        }

        context.strokeStyle = rect.color;
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        context.font = '11px Helvetica';
        context.fillStyle = "#fff";
        context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5,
            rect.y + 11);
        context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5,
            rect.y + 22);
    });

    if (maxRectArea > 0) {
        var rectCenterX = maxRect.x + (maxRect.width / 2);
        var rectCenterY = maxRect.y + (maxRect.height / 2);
        // mouseX = (rectCenterX - 160) * (window.innerWidth / 320) * 10;
        // mouseY = (rectCenterY - 120) * (window.innerHeight / 240) * 10;

        trackX = -rectCenterX / window.innerWidth * 20 + 2;
        trackY = rectCenterY / window.innerHeight * 10;
    }
}

var tracker = new tracking.ColorTracker(['magenta']);
tracker.setMinDimension(5);
tracker.setMinGroupSize(10);

tracking.track('#video', tracker, {
    camera: true
});

tracker.on('track', onColorMove);