class Cube {
    constructor() {
        this.material = new THREE.MeshLambertMaterial({
            color: 0xffffff
        })
        this.mesh = new THREE.Mesh(geometry, this.material)
        this.mesh.castShadow = true
        this.order = cubes.push(this)
        this.mesh.name = 'Box #' + this.order
        this.pitch = 0
        this.spawn()
    }

    switchLane(lane = rand(cubeLanes - 1)) {
        // console.log('Switching lane to', lane)
        this.lane = lane
        this.mesh.position.x = this.lane - cubeLanes / 2
        // console.log('this.lane =', this.lane, this.mesh.position.x)
    }

    setType() {
        this.type = 0
        var isSpecialCube = Math.random() < healthModifierProbablility

        if(isSpecialCube) {
            this.type = +(Math.random() > healthModifierProbablility + 0.1) + 1
        }

        if(this.type == 0) {
            this.material.color.setHex(0xFF007A)
        } else if(this.type == 1) {
            this.material.color.setHex(0x000000)
        } else if(this.type == 2) {
            this.material.color.setHex(0x00ff00)
        }
    }

    spawn(offset) {
        offset = offset || this.order * cubeSpacing + 50
        this.mesh.position.y += offset

        // console.log('Cube #' + this.order, this);

        // if(skippedNotes) {
        //     this.mesh.visible = false
        //     skippedNotes--
        // } else if(patternBacklog.length) {
        //     var patternBit = patternBacklog.shift()
        //     // console.log('Something is in the pattern backlog', patternBit)
        //     this.pitch = patternBit.pitch
        //     this.duration = patternBit.quantizedEndStep - patternBit.quantizedStartStep
        //     skippedNotes = patternBit.quantizedEndStep - patternBit.quantizedStartStep
        //     this.switchLane(patternBit.pitch % 5)
        //     this.mesh.visible = true
        // } else {
            // console.log('Nothing in the pattern backlog')
            this.switchLane()
            this.setType()
            this.mesh.visible = Math.random() < cubeProbability
        // }
    }

    addToScene() {
        scene.add(this.mesh)
    }
}