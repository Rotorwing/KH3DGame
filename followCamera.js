class FollowCamera{
    constructor(followPoint){
        this.fov = 75;
        this.aspect = 2;  // the canvas default
        this.near = 0.1;
        this.far = 15;
        this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        const start = followPoint.clone().add(new THREE.Vector3(0, 2, -5));
        this.camera.position.set(start.x, start.y, start.z);
        this.camera.lookAt(followPoint)
        
        this.followPoint = followPoint;
        this.happyPoint = 8
        this.kindofHappy = [6, 9]
        this.kindofHappyForce = 0.04;
        this.unhappyForce = 0.15;
        this.velocity = new THREE.Vector3(0, 0, 0)
        this.drag = 0.97;
    }
    
    applyForce(force){
        this.velocity.add(force);
    }
    update(){
        var distance = this.camera.position.distanceTo(this.followPoint);
        var direction = this.followPoint.clone().sub(this.camera.position).normalize();
        this.applyForce(direction.multiply(this.calcPull(distance)));
        
        this.camera.position.add(this.velocity);
        this.velocity.multiply(this.drag);
        
        this.camera.lookAt(this.followPoint)
    }
    
    calcPull(distance){
         if (distance > this.kindofHappy[0] && distance < this.kindofHappy[1]){
             return distance*this.kindofHappyForce;
         }
         return distance*this.unhappyForce;
     }
}