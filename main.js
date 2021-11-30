'use strict';

window.loaders['ammo'] = false;
Ammo().then(function(ammo){window.Ammo = ammo;window.loaders['ammo'] = true;} )
let rigidBodies = []
let tmpTrans;
var loading = true
var physicsWorld;

function load(callback){
    window.loadCanvas = document.querySelector('#loadC');
    loadCanvas.width = loadCanvas.clientWidth;
    loadCanvas.height =  loadCanvas.clientHeight;
    window.loadCtx = loadCanvas.getContext("2d");
    
    let barStartX = loadCanvas.clientWidth/4;
    let barStartY = loadCanvas.clientHeight/2
    let barEndX = 3*loadCanvas.clientWidth/4;
    let cut = 15;
    let barHeight = 40;
    let loadedPct = 0;
    let loadedPctTarget = 0;
    let loaded = 0;
    let current = "";
    
    loadCtx.font = "30px Arial";
    //loadCtx.measureText(txt).width
    let loadingInterval = setInterval(()=>{
        loading = false
        loaded = 0;
        current = ""
        for (var _key in loaders){
            //console.log("loading:", _key, ":", loaders[_key]);
            if (!loaders[_key]){
                loading = true
                if(current == ""){
                    current = _key.split("/").at(-1);
                    console.log(current)
                }
            }else{
                loaded+=1;
            }
        }
        loadedPctTarget = loaded/Object.keys(loaders).length;
        if (loadedPct < loadedPctTarget){
            loadedPct+=1;//0.05
        }
        if (loadedPct > loadedPctTarget){
            loadedPct = loadedPctTarget;
        }
        
        //console.log(loadedPct, loadedPctTarget);
        if (loadedPct ==1){//!loading
            //setTimeout(()=>{
            clearInterval(loadingInterval)
            callback();
            //}, 500);
        }
        loadCtx.fillStyle = "#111133";
        loadCtx.fillRect(0, 0, loadCanvas.clientWidth, loadCanvas.clientHeight);
        loadCtx.fillStyle = "#33ccbb";
        loadCtx.fillText("Loading "+current, loadCanvas.clientWidth/4, loadCanvas.clientHeight/2-10);
        
        
        loadCtx.strokeStyle = "#555555";
        loadCtx.beginPath();
        loadCtx.moveTo(barStartX, barStartY+barHeight);
        loadCtx.lineTo(barStartX, barStartY+cut);
        loadCtx.lineTo(barStartX+cut, barStartY);
        loadCtx.lineTo(barEndX, barStartY);
        loadCtx.lineTo(barEndX, barStartY+barHeight-cut);
        loadCtx.lineTo(barEndX-cut, barStartY+barHeight);
        loadCtx.closePath();
        loadCtx.stroke();
        
        if((barEndX-barStartX)*loadedPct > cut){
            let endX = barStartX+(barEndX-barStartX)*loadedPct
            loadCtx.beginPath();
            loadCtx.moveTo(barStartX, barStartY+barHeight);
            loadCtx.lineTo(barStartX, barStartY+cut);
            loadCtx.lineTo(barStartX+cut, barStartY);
            loadCtx.lineTo(endX, barStartY);
            loadCtx.lineTo(endX, barStartY+barHeight-cut);
            loadCtx.lineTo(endX-cut, barStartY+barHeight);
            loadCtx.closePath();
            loadCtx.fill()
        }
        

    }, 1000/25)
}
function main() {
    const canvas = document.querySelector('#threeC');
    tmpTrans = new Ammo.btTransform();
    setupPhysicsWorld()
    const loader = new THREE.GLTFLoader();
    var raycaster = new THREE.Raycaster();
    var clock = new THREE.Clock();
    var mouse = new THREE.Vector2();
    //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    
    const renderer = new THREE.WebGLRenderer({'canvas':canvas});
    renderer.shadowMap.enabled = true;
    
    const cameraTarget = new THREE.Vector3(0, 0, 0)
    const camera = new FollowCamera(cameraTarget)
    console.log(camera)
    
    var controls = new THREE.OrbitControls( camera.camera );
    controls.target.y = 1;
    controls.enablePan = true;
    
    const scene = new THREE.Scene();
    
    
    //const helper = new THREE.CameraHelper( camera.camera );
//scene.add( helper );
    
    /* lights */
    {
        const color = 0xFFFFFF;
        const intensity = 2;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-5, 8, 3);
        light.castShadow = true;
        light.shadow.radius = 2;
        light.shadow.bias = - 0.0001
        light.shadow.mapSize.x = 1024; // default
        light.shadow.mapSize.y = 1024; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 1000;
        
        var d = 5;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;
        
        scene.add(light);
        const Lhelper = new THREE.DirectionalLightHelper( light, 5 );
        scene.add( Lhelper );
        
        const Hlight = new THREE.HemisphereLight( 0xffffdd, 0x080820, 0.8 );
        Hlight.position.set(0, 15, 0);
        scene.add( Hlight );
        scene.add(new THREE.AmbientLight(0x333333));
    }
    
    const player = new Car(window.gitPath+'models/mazda-sportv2.glb', loader)
    //player.position.z = 0.6
    
    const ground = new Ground()
    
    
    {
        const sphereGeometry = new THREE.BoxGeometry( 2, 2, 2, 1, 1, 1 );
const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.castShadow = true; //default is false
sphere.receiveShadow = true; //default
        sphere.position.set( -2, 3, 0 );
scene.add( sphere );
        
        /*const boxGeometry = new THREE.BoxGeometry( 15, 2, 10, 1, 1, 1 );
        const box = new THREE.Mesh( boxGeometry, sphereMaterial );
box.castShadow = true; //default is false
box.receiveShadow = true; //default
        sphere.position.set( -3, 3, 0 );
scene.add( box );*/
        
    }
    
    
    
    function addBodies(){
    ground.addToScene(scene)
    ground.addToPhysics(physicsWorld, rigidBodies)
    player.addToScene(scene);
    player.addToPhysics(physicsWorld, rigidBodies)
    window.loadCanvas.style.display = 'none';
    requestAnimationFrame(render);
    }


    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    
    function updatePhysics( deltaTime ){

        // Step world
        physicsWorld.stepSimulation( deltaTime, 10 );

        // Update rigid bodies
        for ( let i = 0; i < rigidBodies.length; i++ ) {
            let obj = rigidBodies[ i ];
            //console.log(obj)
            let objAmmo = obj.physicsBody;
            let ms = objAmmo.getMotionState();
            if ( ms ) {

                ms.getWorldTransform( tmpTrans );
                //console.log(tmpTrans);
                let p = tmpTrans.getOrigin();
                let q = tmpTrans.getRotation();
                //console.log(p.x(), p.y(), p.z())
                obj.position.set( p.x(), p.y(), p.z() );
                obj.quaternion.set( q.x(), q.y(), q.z(), q.w() );

            }
        }

    }

    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.camera.updateProjectionMatrix();
        }
        let deltaTime = clock.getDelta();
        updatePhysics( deltaTime );
        
        //cameraTarget.add(new THREE.Vector3(-0.01, 0, 0.01))
        //console.log(player.model)
        //player.model.rotation.y+=0.01;
        player.wheelMeshes.backLeft.rotateY(0.1);
        //player.model.position.set(cameraTarget.x, cameraTarget.y, cameraTarget.z)
        //console.log(camera.rotation.y)
        //const yaw = camera.rotation.y
        //const f = new THREE.Vector3(0.05, 0.1, 0.1)// Math.sin(yaw) Math.cos(yaw)
        //camera.applyForce(f.normalize().multiplyScalar(0.1))
        //camera.update();
        controls.update( deltaTime )
        
        renderer.render(scene, camera.camera);
        requestAnimationFrame(render);
    }
    
    load(addBodies);
    

    function onDocumentMouseMove( event ) {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        mouse.x = ( x / canvas.clientWidth ) * 2 - 1;
        mouse.y = - ( y / canvas.clientHeight ) * 2 + 1;
        
    }
    
    function setupPhysicsWorld(){
        console.log(Ammo)
        var collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
            dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
            overlappingPairCache    = new Ammo.btDbvtBroadphase(),
            solver                  = new Ammo.btSequentialImpulseConstraintSolver();
        physicsWorld           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

}   


}



