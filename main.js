'use strict';
function main() {
    const loader = new THREE.GLTFLoader();
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    const canvas = document.querySelector('#threeC');
    const renderer = new THREE.WebGLRenderer({'canvas':canvas});
    
    const cameraTarget = new THREE.Vector3(0, 0, 0)
    const camera = new FollowCamera(cameraTarget)
    console.log(camera)
    
    const player = new Car('models/mazda-sport.glb', loader)
    

    const scene = new THREE.Scene();
    
    player.addToScene(scene);

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    
    const geometry = new THREE.PlaneGeometry( 25, 25 );
    const material = new THREE.MeshStandardMaterial( {color: 0x888890, side: THREE.DoubleSide, roughness: 0.4, metalness: 1} );
    const plane = new THREE.Mesh( geometry, material );

   scene.add(plane);


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

    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.camera.updateProjectionMatrix();
        }

        
        //camera.update();
        
        renderer.render(scene, camera.camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    function onDocumentMouseMove( event ) {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        mouse.x = ( x / canvas.clientWidth ) * 2 - 1;
        mouse.y = - ( y / canvas.clientHeight ) * 2 + 1;
        
    }

}


