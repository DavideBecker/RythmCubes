class Cube {
    constructor() {
        this.material = new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff
        })
        this.mesh = new THREE.Mesh(geometry, this.material)
        this.mesh.castShadow = true
        this.order = cubes.push(this)
        this.mesh.name = 'Box #' + this.order
        this.pitch = 0
        this.spawn()
    }

    switchLane(lane = rand(cubeLanes - 1)) {
        console.log('Switching lane to', lane)
        this.lane = lane
        this.mesh.position.x = this.lane - cubeLanes / 2
        console.log('this.lane =', this.lane, this.mesh.position.x)
    }

    spawn(offset) {
        offset = offset || this.order * cubeSpacing + 50
        this.mesh.position.y += offset

        console.log('Cube #' + this.order, this);

        if(skippedNotes) {
            this.mesh.visible = false
            skippedNotes--
        } else if(patternBacklog.length) {
            var patternBit = patternBacklog.shift()
            console.log('Something is in the pattern backlog', patternBit)
            this.pitch = patternBit.pitch
            this.duration = patternBit.quantizedEndStep - patternBit.quantizedStartStep
            skippedNotes = patternBit.quantizedEndStep - patternBit.quantizedStartStep
            this.switchLane(patternBit.pitch % 5)
            this.mesh.visible = true
        } else {
            console.log('Nothing in the pattern backlog')
            this.switchLane()
            this.mesh.visible = Math.random() < cubeProbability
        }
    }

    addToScene() {
        scene.add(this.mesh)
    }
}