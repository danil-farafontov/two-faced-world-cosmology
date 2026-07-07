import * as THREE from 'three';

export class InteractionManager {
  constructor(camera, container, spaceObjects) {
    this.camera = camera;
    this.container = container;
    this.spaceObjects = spaceObjects;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initEvents();
  }

  initEvents() {
    // Add event listener directly on container (canvas). Not on window!
    this.container.addEventListener('click', (event) => this.onClick(event));
  }

  onClick(event) {
    // 1. Get percise click position relating to the canvas
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // 2. Update ray
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 3. Collect all 3D-meshes from objects to check if it is crossed by the ray
    const meshes = this.spaceObjects.map(obj => obj.mesh);

    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;

      // find object SpaceObject which owns this mesh
      const clickedObject = this.spaceObjects.find(obj => obj.mesh === clickedMesh);

      if (clickedObject) {
        clickedObject.onClick(); // call object's onClick
      }
    }
  }
}
