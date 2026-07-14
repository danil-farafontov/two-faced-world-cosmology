import * as THREE from 'three';

class CameraManager {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls; // OrbitControls

    this.targetObject = null;
    this.targetZoom = camera.zoom;

    this.lerpSpeedPosition = 0.08;
    this.lerpSpeedZoom = 0.05;

    this._setupGlobalListeners();
  }

  _setupGlobalListeners() {
    window.addEventListener('space-object-selected', (event) => {
      const { objectInstance } = event.detail;

      if (objectInstance) {
        if (objectInstance.type == "Moon") {
          this.focusOn(objectInstance, 5);
        } else {
          this.focusOn(objectInstance);
        }
      }
    });

    window.addEventListener('space-object-unselected', () => {
      this.clearFocus();
    });
  }

  focusOn(spaceObject, customZoom = 3) {
    this.targetObject = spaceObject;
    this.targetZoom = customZoom;

    if (this.controls) {
      this.controls.enabled = false;
    }
  }

  clearFocus() {
    this.targetObject = null;
    if (this.controls) {
      this.controls.enabled = true;
    }
  }

  update() {
    if (this.targetObject == null) {
      this.controls.update();
      return;
    }
    if (Math.abs(this.camera.zoom - this.targetZoom) > 0.001) {
      this.camera.zoom = THREE.MathUtils.lerp(this.camera.zoom, this.targetZoom, this.lerpSpeedZoom);
      this.camera.updateProjectionMatrix();
    }

    if (this.targetObject && this.targetObject.container) {
      const objectPos = new THREE.Vector3();
      this.targetObject.container.getWorldPosition(objectPos);
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, objectPos.x, this.lerpSpeedPosition);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, objectPos.y, this.lerpSpeedPosition);
      this.controls.target.x = THREE.MathUtils.lerp(this.controls.target.x, objectPos.x, this.lerpSpeedPosition);
      this.controls.target.y = THREE.MathUtils.lerp(this.controls.target.y, objectPos.y, this.lerpSpeedPosition);
      this.controls.update();
    }
  }
}

export default CameraManager;