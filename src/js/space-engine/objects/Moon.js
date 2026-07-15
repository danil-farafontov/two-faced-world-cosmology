import SpaceObject from './SpaceObject.js';
import { Z_POSITIONING } from '../constants/constants.js';

class Moon extends SpaceObject {
  constructor(data, parentObject = null) {
    super(data, parentObject);
  }

  build() {
    this.position.z = Z_POSITIONING.MOON;
    if (this.castShadow === undefined) {
      this.castShadow = true;
    }
    if (this.receiveShadow === undefined) {
      this.receiveShadow = true;
    }

    super.build();
  }
}

export default Moon;
