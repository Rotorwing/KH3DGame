function CreateRidgid(){
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3(this.position.x, this.position.y, this.position.z) );
    transform.setRotation( new Ammo.btQuaternion( this.quat.x, this.quat.y, this.quat.z, this.quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    let colShape = new Ammo.btBoxShape( new Ammo.btVector3(1, 1, 1) );
    colShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia(this.mass, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( this.mass, motionState, colShape, localInertia );
    this.physicsBody = new Ammo.btRigidBody( rbInfo );
}

class RidgidBody{
    
    constructor(){
        this.loadDone = true
        this.model = null;
        this.mass = 1;
        
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Vector3(0, 0, 0);
        this.quaternion = new THREE.Vector4(0, 0, 0, 1)
        this.mmas = 1
        this.model = null;
        this.colShape = null;
        this.physicsBody = null;
        
        
    }
    build(shape){
        this.model.position.set(this.position.x, this.position.y, this.position.z)
        this.model.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z)
        this.position = this.model.position
        this.rotation = this.model.rotation
        this.quaternion = this.model.quaternion
        
        this.physicsBody = createRigidBody(shape, this.mass, this.position, this.quaternion)
        
        /*var localInertia = new Ammo.btVector3( 0, 0, 0 );
        shape.calculateLocalInertia( this.mass, localInertia );
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin( new Ammo.btVector3( this.position.x, this.position.y, this.position.z ) );
        transform.setRotation( new Ammo.btQuaternion( this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w ) );
        var motionState = new Ammo.btDefaultMotionState( transform );
        var rbInfo = new Ammo.btRigidBodyConstructionInfo( this.mass, motionState, this.colShape, localInertia );
        this.physicsBody = new Ammo.btRigidBody( rbInfo );*/

        //this.model.userData.physicsBody = body;
        
        console.log("built")
        
        
        /*var colShape        = new Ammo.btSphereShape(1),
          startTransform  = new Ammo.btTransform();

          startTransform.setIdentity();

          var mass          = 1,
              isDynamic     = (mass !== 0),
              localInertia  = new Ammo.btVector3(0, 0, 0);

          if (isDynamic)
            colShape.calculateLocalInertia(mass,localInertia);

          startTransform.setOrigin(new Ammo.btVector3(2, 10, 0));

          var myMotionState = new Ammo.btDefaultMotionState(startTransform),
              rbInfo        = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, colShape, localInertia),
              body          = new Ammo.btRigidBody(rbInfo);

          dynamicsWorld.addRigidBody(body);
          bodies.push(body);*/
        
        

    }
    
    addToScene(scene){
        if (this.loadDone){
            scene.add(this.model)
        }else{
            this.refScene = scene;
        }
    }
    
    addToPhysics(world, bodyList){
        world.addRigidBody( this.physicsBody );
        bodyList.push(this)
    }
}


function createRigidBody(physicsShape, mass, pos, quat ) { //threeObject

    //threeObject.position.copy( pos );
    //threeObject.quaternion.copy( quat );
    let tempbtVector3 = new Ammo.btVector3();;
    let tempbtQuat = new Ammo.btQuaternion();
    
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    tempbtVector3.setValue( pos.x, pos.y, pos.z );
    tempbtQuat.setValue( quat.x, quat.y, quat.z, quat.w );
    transform.setOrigin( tempbtVector3 );
    transform.setRotation( tempbtQuat );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    physicsShape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    //threeObject.userData.physicsBody = body;

    if ( mass > 0 ) {

        // Disable deactivation
        body.setActivationState( 4 );
    }

    return body; //physicsWorld.addRigidBody( body );

}