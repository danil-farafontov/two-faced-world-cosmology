import SpaceObject from './SpaceObject.js';

class Moon extends SpaceObject {
  constructor(data, parentObject = null) {
    super(data, parentObject);
  }

  build() {
    super.build();
  }
}

export default Moon;
