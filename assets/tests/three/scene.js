



                                 //
/////////////////////////////////// SCENE
                                 //


var scene = new THREE.Scene()
scene.background = new THREE.Color(0x505050);




                                 //
/////////////////////////////////// CAMERAS
                                 //


var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.up = new THREE.Vector3(0,0,1);
camera.position.z = 1;
camera.position.y = -3
camera.rotation.x = 75 * Math.PI / 180;
scene.add(camera)

var cameraHelper = new THREE.CameraHelper( camera );
scene.add( cameraHelper );

var debugCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
debugCamera.up = new THREE.Vector3(0,0,1);
debugCamera.position.z = 1;
debugCamera.position.y = -3
debugCamera.rotation.x = 75 * Math.PI / 180;
scene.add(debugCamera)

// var cameraHelper = new THREE.CameraHelper( camera );
// scene.add( cameraHelper );




                                 //
/////////////////////////////////// RENDERER
                                 //


var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)



                                 //
/////////////////////////////////// GEOMETRY
                                 //

var geometry = new THREE.BoxGeometry(1, 1, 1)
var cubes = []




                                 //
/////////////////////////////////// LIGHTING & SHADOWS
                                 //


scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );
// var light = new THREE.DirectionalLight( 0xffffff, 2);
// light.name = 'Directional light'
// light.position.set( 0, 5, 10 );
// light.shadowCameraNear	= 0.1;		
// light.castShadow		= true;
// light.shadowDarkness	= 1;
// light.shadowCameraVisible	= true;
// scene.add( light );

var spotLight	= new THREE.SpotLight( 0xffffff );
spotLight.name = 'Spotlight'
spotLight.position.set( 0, 0, 25 );
spotLight.shadow.camera.near = 0.01;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024 * 4;
spotLight.shadow.mapSize.height = 1024 * 4;
scene.add( spotLight );	

var shadowHelper = new THREE.CameraHelper( spotLight.shadow.camera );
scene.add( shadowHelper );




                                 //
/////////////////////////////////// ROOM
                                 //


room = new THREE.Mesh(
    new THREE.BoxBufferGeometry( cubeLanes * 2, (cubeGrid.height - cubeSpacing) * 1.5, 1, cubeLanes, cubeAmount - 1, 1 ),
    new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe: false } )
);
room.name = 'Room'
room.position.y = (cubeGrid.height + cubeSpacing) / 3;
room.position.z = -2
room.receiveShadow = true
scene.add( room );




                                 //
/////////////////////////////////// PLAYER
                                 //


var playerMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
})
var player = new THREE.Mesh(geometry, playerMaterial)
player.name = "Player"
scene.add(player)