import * as THREE from 'three';

export class InteractionManager {

  #selectedSpaceObject = null;
  #mode = "select-space-object";  // select-space-object | select-cone-vertex

  constructor(camera, container, spaceObjects) {
    this.camera = camera;
    this.container = container;
    this.spaceObjects = spaceObjects;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.currentMouseWorldPosition = new THREE.Vector2();

    this.initEvents();
  }

  initEvents() {
    // Add event listener directly on container (canvas). Not on window!
    this.container.addEventListener('click', (event) => this.onClick(event));
    this.container.addEventListener('mousemove', (event) => this.onMouseMove(event));
  }

  onClick(event) {
    // 1. Get percise click position relating to the canvas
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.#mode == "select-cone-vertex") {
      this.#selectedSpaceObject.addFirmamentConeEffect();
      this.#mode = "select-space-object";
      return;
    }

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
        if (clickedObject == this.#selectedSpaceObject) {
          // Clicked the same Space Object. Do nothing.
        } else {
          if (this.#selectedSpaceObject != null) {
            this.#selectedSpaceObject.selected = false; // This setter will initiate Selected Effect destroy also
          }
          this.#selectedSpaceObject = clickedObject;
          clickedObject.onClick(); // call object's onClick. It will add Selected Effect too
        }
      } else {
        if (this.#selectedSpaceObject != null) {
          this.#selectedSpaceObject.selected = false; // This setter will initiate Selected Effect destroy also
        }
        window.dispatchEvent(new CustomEvent('space-object-unselected'));
      }
    } else {
      if (this.#selectedSpaceObject != null) {
        this.#selectedSpaceObject.selected = false; // This setter will initiate Selected Effect destroy also
      }
      window.dispatchEvent(new CustomEvent('space-object-unselected'));
    }
  }

  onMouseMove(event) {
    if (this.#mode === 'select-cone-vertex' && this.#selectedSpaceObject) {
      const rect = this.container.getBoundingClientRect();

      // save NDC coordinates
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      return;
    }
  }

  updateMouseWorldPosition() {
    if (this.#mode === 'select-cone-vertex' && this.#selectedSpaceObject) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const mousePosition = this.raycaster.ray.at(0, new THREE.Vector3());
      // Convert NDC mouse coordinates to World coordinates
      this.currentMouseWorldPosition.x = mousePosition.x;
      this.currentMouseWorldPosition.y = mousePosition.y;
    }
  }

  startAddingFirmamentCone() {
    this.#selectedSpaceObject.addFirmamentConePlacementEffect();
    this.#mode = "select-cone-vertex";
  }

}
