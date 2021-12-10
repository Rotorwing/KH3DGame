class Car extends RidgidBody{
    constructor(file, loader){
        super();
        this.model = new THREE.Group();;
        this.refScene = false;
        this.loadDone = false;
        this.quat = new THREE.Vector4(0, 0, 0, 1);
        this.mass = 1;
        
        this.bodyMesh = new THREE.Group();
        this.wheelMeshes = {
            frontRight: new THREE.Group(),
            frontLeft: new THREE.Group(),
            backRight: new THREE.Group(),
            backLeft: new THREE.Group()
        };
        this.extraMeshes = new THREE.Group();
        this.meshes = [];
        window.loaders[file] = false;
        if (window.isKhan){}
            fileNameParts = file.split('.')
            if (fileEtension.length > 1 && fileNameParts.at(-1) != "js"){
                file = fileNameParts.slice(0, -1).join('.')+".js";

            }
        }
        this.finishLoad = function(gltf){
            {
            //this.model = gltf.scene;
            console.log(gltf);
            //this.model.scale.set(0.5, 0.5, 0.5);
            //this.model.castShadow = true;
            //this.model.receiveShadow = true;
            gltf.scene.traverse( function ( child ) {
                console.log(child);
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                }else if (child.isGroup){
                    switch(child.name){
                    case "Body":
                        this.bodyMesh = child;
                            console.log(child.name)
                    case "Wheel_FR":
                        this.wheelMeshes.frontRight = child;
                            console.log(child.name)
                    case "Wheel_FL":
                        this.wheelMeshes.frontLeft = child;
                            console.log(child.name)
                    case "Wheel_BR":
                        this.wheelMeshes.backRight = child;
                            console.log(child.name)
                    case "Wheel_BL":
                        this.wheelMeshes.backLeft = child;
                            console.log(child.name)
                    default:
                        this.extraMeshes = child;
                    };
                }

            }.bind(this) );
            this.model.add(this.bodyMesh);
            this.model.add(this.wheelMeshes.frontRigh);
            this.model.add(this.wheelMeshes.frontLeft);
            this.model.add(this.wheelMeshes.backRight);
            this.model.add(this.wheelMeshes.backLeft);
            this.model.add(this.extraMeshes);
            //this.model.computeBoundingBox();
            //console.log(mesh.geometry.boundingBox )
            if (this.refScene){
                this.refScene.add(this.model);
            }
            }
            this.position.set(0, 2, 0);
            this.build(new Ammo.btBoxShape( new Ammo.btVector3(1, 0.2, 2.4) ));
            
            this.rotation.set(0, Math.PI/2, 0);
            
            this.vehicle = new Ammo.btRaycastVehicle(this.tuning, this.body, this.rayCaster);
            this.vehicle.setCoordinateSystem(0, 1, 2);
            
            /*addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT);
            addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT);
            addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT);
            addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT);*/
            
            /* Flag as loaded */
            {
            //setTimeout(()=>{
            this.loadDone = true;
            window.loaders[file] = true;
                //}, 5000)
            }
        }
        /* Start Load */
        {
        loader.load(file, function ( gltf ) {
            this.finishLoad(gltf);
        }.bind(this), undefined, function ( error ) {
            console.error( error );
        } );
        }
        
        
        this.chassisWidth = 1.8;
        this.chassisHeight = .6;
        this.chassisLength = 4;
        this.massVehicle = 800;

        this.wheelAxisPositionBack = -1;
        this.wheelRadiusBack = .4;
        this.wheelWidthBack = .3;
        this.wheelHalfTrackBack = 1;
        this.wheelAxisHeightBack = .3;

        this.wheelAxisFrontPosition = 1.7;
        this.wheelHalfTrackFront = 1;
        this.wheelAxisHeightFront = .3;
        this.wheelRadiusFront = .35;
        this.wheelWidthFront = .2;

        this.friction = 1000;
        this.suspensionStiffness = 20.0;
        this.suspensionDamping = 2.3;
        this.suspensionCompression = 4.4;
        this.suspensionRestLength = 0.6;
        this.rollInfluence = 0.2;

        this.steeringIncrement = .04;
        this.steeringClamp = .5;
        this.maxEngineForce = 2000;
        this.maxBreakingForce = 100;
        
        this.health = 100;
        this.fuel = 100;
        this.shocks = [];
        
        this.engineForce = 0;
        this.vehicleSteering = 0;
        this.breakingForce = 0;
        this.tuning = new Ammo.btVehicleTuning();
        this.rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
        this.vehicle = null;
        
        function addWheel(isFront, pos, radius, width, index) {

            var wheelInfo = vehicle.addWheel(
                    pos,
                    wheelDirectionCS0,
                    wheelAxleCS,
                    suspensionRestLength,
                    radius,
                    tuning,
                    isFront);

            wheelInfo.set_m_suspensionStiffness(this.suspensionStiffness);
            wheelInfo.set_m_wheelsDampingRelaxation(this.suspensionDamping);
            wheelInfo.set_m_wheelsDampingCompression(this.suspensionCompression);
            wheelInfo.set_m_frictionSlip(this.friction);
            wheelInfo.set_m_rollInfluence(this.rollInfluence);

            wheelMeshes[index] = createWheelMesh(radius, width);
        }
        
        
    }
    /*addToScene(scene){
        for (var mesh in this.meshes){
            scene.add(this.meshes[mesh]);
        }
    }*/
    
    addToPhysics(world, bodyList){
        super.addToPhysics(world, bodyList);
        world.addAction(this.vehicle);
    }
    
}