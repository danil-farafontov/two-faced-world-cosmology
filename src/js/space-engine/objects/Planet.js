import SpaceObject from './SpaceObject.js';
import { Z_POSITIONING } from '../constants/constants.js';

class Planet extends SpaceObject {
  constructor(data, parentObject = null) {
    super(data, parentObject);
  }

  build() {
    this.position.z = Z_POSITIONING.PLANET;
    if (this.castShadow === undefined) {
      this.castShadow = false;
    }
    if (this.receiveShadow === undefined) {
      this.receiveShadow = false;
    }

    super.build();
  }
}

export default Planet;
