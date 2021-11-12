class Car{
    constructor(file, loader){
        this.model = null;
        this.refScene = false;
        this.loadDone = false;
        loader.load(file, function ( gltf ) {
            this.model = gltf.scene;
            if (this.refScene){
                this.refScene.add(this.model);
            }
        }.bind(this), undefined, function ( error ) {
            console.error( error );
        } );
        
        this.health = 100;
        this.fuel = 100;
        this.shocks = [];
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Vector3(0, 0, 0);
    }
    
    addToScene(scene){
        if (this.loadDone){
            scene.add(this.model)
        }else{
            this.refScene = scene;
        }
    }
}