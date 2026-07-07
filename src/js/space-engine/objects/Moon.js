import SpaceObject from './SpaceObject.js';

class Moon extends SpaceObject {
  constructor(data, parentObject = null) {
    super(data, parentObject);
  }

  createMesh() {
    super.createMesh();
  }
}

export default Moon;
