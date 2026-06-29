import * as THREE from 'three';

let cameraAnimState = null;

export function declension(n, forms) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n100 >= 11 && n100 <= 19) return forms[2];
  if (n10 === 1) return forms[0];
  if (n10 >= 2 && n10 <= 4) return forms[1];
  return forms[2];
}

export function setCursorMode(cursorMode) {
  if (cursorMode === 'moon-select') {
    document.body.classList.remove('point-select-mode');
    document.body.classList.add('moon-select-mode');
  } else if (cursorMode === 'point-select') {
    document.body.classList.add('point-select-mode');
    document.body.classList.remove('moon-select-mode');
  }
}

export function moveCameraAndZoomIn(camera, controls, position, zoom = 3) {
  controls.target.x = position.x;
  controls.target.y = position.y;
  camera.position.x = position.x;
  camera.position.y = position.y;
  camera.zoom = zoom;
  camera.updateProjectionMatrix();
}

export function startCameraAnimation(camera, controls, position, zoom = 3, duration = 1000) {
  if (cameraAnimState && cameraAnimState.active) {
    cameraAnimState.active = false;
  }

  cameraAnimState = {
    startPos: camera.position.clone(),
    endPos: new THREE.Vector3(position.x, position.y, camera.position.z),
    startTarget: controls.target.clone(),
    endTarget: new THREE.Vector3(position.x, position.y, 0),
    startZoom: camera.zoom,
    endZoom: zoom,
    duration,
    startTime: performance.now(),
    active: true
  };
}

export function updateCameraAnimation(camera, controls) {
  if (!cameraAnimState || !cameraAnimState.active) return false;

  const now = performance.now();
  const elapsed = now - cameraAnimState.startTime;
  let t = Math.min(elapsed / cameraAnimState.duration, 1);

  t = 1 - Math.pow(1 - t, 3);

  camera.position.x = cameraAnimState.startPos.x + (cameraAnimState.endPos.x - cameraAnimState.startPos.x) * t;
  camera.position.y = cameraAnimState.startPos.y + (cameraAnimState.endPos.y - cameraAnimState.startPos.y) * t;
  controls.target.x = cameraAnimState.startTarget.x + (cameraAnimState.endTarget.x - cameraAnimState.startTarget.x) * t;
  controls.target.y = cameraAnimState.startTarget.y + (cameraAnimState.endTarget.y - cameraAnimState.startTarget.y) * t;
  camera.zoom = cameraAnimState.startZoom + (cameraAnimState.endZoom - cameraAnimState.startZoom) * t;
  camera.updateProjectionMatrix();

  if (t >= 1) {
    cameraAnimState.active = false;
  }

  return cameraAnimState.active;
}