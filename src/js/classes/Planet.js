import SpaceObject from './SpaceObject.js';

class Planet extends SpaceObject {
  constructor(data, parentObject = null) {
    super(data, parentObject);
  }

  createMesh() {
    super.createMesh();
  }
}

export default Planet;
