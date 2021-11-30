class FollowCamera{
    constructor(followPoint){
        this.fov = 75;
        this.aspect = 2;  // the canvas default
        this.near = 0.1;
        this.far = 1000;
        this.position = followPoint.clone();
        this.position.add(new THREE.Vector3(0, 2, -5));
        
        this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.camera.position.set(this.position.x, this.position.y, this.position.z);
        this.camera.lookAt(followPoint)
        this.camera.updateMatrixWorld();
        this.rotation = this.camera.rotation;
        
        this.followPoint = followPoint;
        this.happyPoint = 55//4
        this.kindofHappy = [54, 56];//[3, 5]
        this.kindofHappyForce = 0.05;
        this.unhappyForce = 0.015;
        this.velocity = new THREE.Vector3(0, 0, 0)
        this.drag = 0.95;
        
    }
    
    applyForce(force){
        this.velocity.add(force);
    }
    update(){
        
        var distance = this.position.distanceTo(this.followPoint);
        var direction = this.followPoint.clone().sub(this.camera.position).normalize();
        const strength = this.calcPull(distance);
        const force = direction.clone();
        force.multiplyScalar(strength)
        
        
        this.applyForce(force);
        
        
        this.position.add(this.velocity);
        this.velocity.multiplyScalar(this.drag);
        
        
        this.camera.position.set(this.position.x, this.position.y, this.position.z);
        this.camera.lookAt(this.followPoint);
        //this.camera.updateMatrixWorld();
        
    }
    
    calcPull(distance){
         if (distance > this.kindofHappy[0] && distance < this.kindofHappy[1]){
             return (distance-this.happyPoint)*this.kindofHappyForce;
         }
         return (distance-this.happyPoint)*this.unhappyForce;
     }
}