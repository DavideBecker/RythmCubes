function handleCollision(c) {
    if (c.type == 0) {
        synth.triggerAttackRelease(tones[c.lane], "8n")
        score++;
        highScore = Math.max(score, highScore)
    } else if (c.type == 1) {
        backgroundSynth.triggerAttackRelease(50)
        currentHealth--;
    } else if (c.type == 2) {
        synth.triggerAttackRelease(500)
        currentHealth = Math.min(currentHealth + 1, 5)
    }
}

function resetCube(c) {
    if (c.mesh.visible) {
        if (Math.abs(c.mesh.position.x - player.position.x) <= 1) {
            handleCollision(c)
        } else {
            if (c.type == 0) {
                score = Math.max(score - 1, 0);
            }
        }
        updateScore()
        // synth.triggerAttackRelease(c.pitch * 5 + 500, c.duration / 100 );
    }
    c.spawn(cubeGrid.height);
}

function drawCubes() {
    // player.position.x = mouse.x * 4
    player.position.x = trackX

    for (var i = 0; i < cubes.length; i++) {
        var c = cubes[i]

        c.mesh.position.y -= cubeSpeed * delta

        if (c.mesh.position.y < 0) {
            resetCube(c)
        }
    }
}

function pushNotes(sequence) {
    patternBacklog = patternBacklog.concat(sequence.notes)
    // for(var note of sequence.notes) {

    // }
}

function updateScore() {
    if (currentHealth == 0) {
        isRunning = false
        gameOverElement.style.display = 'block'
    }
    localStorage.setItem('rythmCubesScore', highScore)
    scoreElement.innerHTML = '♥ '.repeat(currentHealth) + '<br>' +
        'Score: ' + score + ' - ' + 'High Score: ' + highScore + '<br>'
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

document.addEventListener('keydown', function(event) {
    if (!event.repeat) {
        keysPressed[event.code] = true
    }
})

document.addEventListener('keyup', function(event) {
    if (!event.repeat) {
        keysPressed[event.code] = false
    }
})

// document.addEventListener('mousemove', function (event) {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// })

function populateStarfield() {
    for (var z = -500; z < 500; z += 20) {

        // Make a sphere (exactly the same as before). 
        var geo = new THREE.SphereGeometry(0.5, 32, 32)
        var mat = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        var star = new THREE.Mesh(geo, mat)

        // This time we give the star random x and y positions between -500 and 500
        star.position.x = Math.random() * 1000 - 500;
        star.position.y = Math.random() * 1000 - 500;

        // Then set the z position to where it is in the loop (distance of camera)
        star.position.z = z;

        // scale it up a bit
        star.scale.x = star.scale.y = 2;

        //add the star to the scene
        scene.add(star);

        //finally push it to the stars array 
        stars.push(star);
    }
}

function drawStarfield() {
    // loop through each star
    for (var i = 0; i < stars.length; i++) {

        star = stars[i];
        // and move it forward dependent on the mouseY position. 
        star.position.y -= i / 2;

        // if the particle is too close move it to the back
        if (star.position.y < 0) star.position.y += 1000;

    }
}

function update(d) {
    if (d > 5000)
        d = 0

    if (!isRunning)
        return

    delta = d
    if (debugging) {
        handleKeys()
    }
    drawStarfield()
    drawCubes()

    // if (patternBacklog.length < 10 && !generatingNotes) {
    //     generateNotes().then(function (sequence) {
    //         pushNotes(sequence)
    //     })
    // }

    healthModifierProbablility = Math.min(healthModifierProbablility + 0.00004,
        0.7)
    cubeProbability = Math.min(cubeProbability + 0.00002, 0.5)
    cubeSpeed = Math.min(cubeSpeed + 0.0000025, 0.04)
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

    score = 0
    currentHealth = health
    updateScore()
    populateStarfield()

    for (var cube of cubes) {
        scene.remove(cube.mesh)
    }
    cubes = []

    for (var i = 0; i < cubeAmount; i++) {
        var c = new Cube()
        c.addToScene()
    }
}

init()

MainLoop.setUpdate(update).setDraw(draw).start()

gameOverElement.addEventListener('click', function() {
    this.style.display = 'none'
    init()
    isRunning = true
})

document.getElementById('intro').addEventListener('click', function() {
    this.remove()
    isRunning = true
})