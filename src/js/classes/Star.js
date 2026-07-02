import CelestialBody from './CelestialBody.js';

class Star extends CelestialBody {
  constructor(data, parentBody = null) {
    super(data, parentBody);
  }

  createMesh() {
    super.createMesh();
  }
}

export default Star;
