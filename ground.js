class Ground extends RidgidBody{
    constructor(file, loader){
        super();
        this.mass = 0;
        this.width = 50
        this.height = 50;
        this.thickness = 0.1
        {
        this.geometry = new THREE.BoxGeometry(this.width, this.height, this.thickness);
        //const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        this.material = new THREE.MeshStandardMaterial( {color: 0x888890});//, roughness: 0.3, metalness: 0.5} ); MeshStandardMaterial
        this.model = new THREE.Mesh( this.geometry, this.material );
        this.model.receiveShadow = true;
        this.model.rotation.x=Math.PI*0.5
        this.rotation.set(Math.PI/2, 0, 0);
        }
        
        {
            
            this.build(new Ammo.btBoxShape(new Ammo.btVector3(this.width, this.height, this.thickness)));
        }
    }
}