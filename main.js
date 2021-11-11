function main() {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    const canvas = document.querySelector('#threeC');
    const renderer = new THREE.WebGLRenderer({'canvas':canvas});
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    
    const hilightMat = new THREE.MeshPhongMaterial({'color':0xee1111});
    const normalMat = new THREE.MeshPhongMaterial({'color':0xaa8844});
    const lineMat = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    const scene = new THREE.Scene();

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    
    const points = [];
    const src = camera.position.clone()
    src.y -= 0.1;
    points.push( src );
    points.push( new THREE.Vector3( 2, 0, 0 ) );
    const Lgeometry = new THREE.BufferGeometry().setFromPoints( points );
    const rayLine = new THREE.Line( Lgeometry, lineMat );
    scene.add(rayLine);
    console.log(rayLine)

    function makeInstance(geometry, color, x) {
        const material = normalMat; //new THREE.MeshPhongMaterial({'color':color});

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;

        return cube;
    }

    const cubes = [
        makeInstance(geometry, 0x44aa88,  0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844,  2),
    ];

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
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cubes.forEach(function(cube, ndx) {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
            cube.material = normalMat;
        });
        camera.updateMatrixWorld();
        raycaster.setFromCamera( mouse.clone(), camera ); 
        
        var objects = raycaster.intersectObjects(scene.children);
        if (objects.length > 0){
            //console.log(objects)
            if (cubes.includes(objects[0].object)){
                objects[0].object.material = hilightMat
            }
            
        }
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    function onDocumentMouseMove( event ) {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
    }

}


