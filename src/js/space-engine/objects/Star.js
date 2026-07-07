import SpaceObject from './SpaceObject.js';

class Star extends SpaceObject {
  constructor(data, parentObject = null) {
    super(data, parentObject);
  }

  createMesh() {
    super.createMesh();
  }
}

export default Star;
