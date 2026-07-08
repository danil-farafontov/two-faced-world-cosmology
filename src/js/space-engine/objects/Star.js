import SpaceObject from './SpaceObject.js';

class Star extends SpaceObject {
  constructor(data, parentObject = null) {
    super(data, parentObject);
  }

  build() {
    super.build();
  }
}

export default Star;
