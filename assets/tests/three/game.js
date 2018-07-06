function drawCubes() {
    player.position.x = mouse.x * 4

    for (var i = 0; i < cubes.length; i++) {
        var c = cubes[i]

        c.mesh.position.y -= cubeSpeed * delta

        if (c.mesh.position.y < 0) {
            if (c.mesh.visible) {
                synth.triggerAttackRelease(tones[c.lane], "8n");
                score++;
                // synth.triggerAttackRelease(c.pitch * 5 + 500, c.duration / 100 );
            }
            c.spawn(cubeGrid.height);
        }
    }
}

function pushNotes(sequence) {
    patternBacklog = patternBacklog.concat(sequence.notes)
    console.log(patternBacklog)
    // for(var note of sequence.notes) {

    // }
}

function updateScore() {
    scoreElement.innerHTML = 'Score: ' + score
}

function handleKeys() {
    if (keysPressed.KeyW) {
        debugCamera.position.y += 0.5
    }

    if (keysPressed.KeyS) {
        debugCamera.position.y -= 0.5
    }

    if (keysPressed.Space) {
        debugCamera.position.z += 0.25
    }

    if (keysPressed.ShiftLeft) {
        debugCamera.position.z -= 0.25
    }

    if (keysPressed.KeyQ) {
        debugCamera.rotation.x += Math.PI / 360
    }

    if (keysPressed.KeyE) {
        debugCamera.rotation.x -= Math.PI / 360
    }

    // debugCamera.rotation.x = Math.PI * mouse.y / 2 + Math.PI / 2
}

var keysPressed = {}

document.addEventListener('keydown', function (event) {
    if (!event.repeat) {
        keysPressed[event.code] = true
    }
})

document.addEventListener('keyup', function (event) {
    if (!event.repeat) {
        keysPressed[event.code] = false
    }
})

document.addEventListener('mousemove', function (event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
})

function update(d) {
    delta = d
    handleKeys()
    drawCubes()

    // if (patternBacklog.length < 10 && !generatingNotes) {
    //     generateNotes().then(function (sequence) {
    //         pushNotes(sequence)
    //     })
    // }

    cubeProbability = Math.min(cubeProbability + 0.00002, 0.5)
    cubeSpeed = Math.min(cubeSpeed +  0.0000025, 0.04)

    updateScore()
}

function draw() {
    renderer.render(scene, debugCamera)
}

function init() {
    // prepareNotes().then(function() {
    //     generateNotes().then(function(sequence) {
    //         pushNotes(sequence)

    //         for (var i = 0; i < cubeAmount; i++) {
    //             var c = new Cube()
    //             c.addToScene()
    //         }
    //     })
    // })

    for (var i = 0; i < cubeAmount; i++) {
        var c = new Cube()
        c.addToScene()
    }
}

init()

MainLoop.setUpdate(update).setDraw(draw).start()