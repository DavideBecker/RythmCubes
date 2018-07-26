var canvas = document.getElementById('debugCanvas');
var context = canvas.getContext('2d');

const RADIAN = Math.PI / 2

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,
    0.1, 100);
const renderer = new THREE.WebGLRenderer;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(50, 5, 25);
const material = new THREE.MeshBasicMaterial({
    color: 0x00a3b4,
    wireframe: false,
    vertexColors: THREE.FaceColors
});
const cube = new THREE.Mesh(geometry, material);
geometry.faces[4].color.setHex(0x000099)
geometry.faces[5].color.setHex(0x000099)

camera.position.z = 50;
camera.lookAt(0, 0, 0);
scene.add(cube);
const render = () => {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

socket = io();

window.onload = function() {
    tracking.ColorTracker.registerColor('green', function(r, g, b) {
        if (r < 40 && g > 120 /*&& b < 100*/) {
            return true;
        }
        return false;
    });

    var tracker = new tracking.ColorTracker(['magenta']);
    tracker.setMinDimension(5);
    tracker.setMinGroupSize(10);

    tracking.track('#video', tracker, {
        camera: true
    });

    tracker.on('track', onColorMove);

    render();
};

var quat = new THREE.Quaternion(0, 0, 0, 0)

socket.on('sensorData', function(data) {
    // console.log(cube.rotation.x, cube.rotation.y, cube.rotation.z)

    // madgwickAHRSupdate(data.gyro.x, data.gyro.y, data.gyro.z, data.acc.x, data.acc.y, data.acc.z, data.mag.x, data.mag.y, data.mag.z)
    // quat.set(q0, q1, q2, q3)
    quat.set(-data.quat.y, data.quat.z, -data.quat.x, data.quat.w)
    cube.quaternion.copy(quat)
})

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

        console.log(rect)

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
        mouseX = (rectCenterX - 160) * (window.innerWidth / 320) * 10;
        mouseY = (rectCenterY - 120) * (window.innerHeight / 240) * 10;

        cube.position.x = (320 / 2 - maxRect.x) / 2
        cube.position.y = (240 / 2 - maxRect.y) / 2

        cube.position.z = maxRectArea / 700
    }
}