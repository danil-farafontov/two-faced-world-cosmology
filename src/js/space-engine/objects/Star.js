import SpaceObject from './SpaceObject.js';
import PointLightEffect from '../effects/PointLightEffect';
import { Z_POSITIONING } from '../constants/constants.js';

class Star extends SpaceObject {
  constructor(data, parentObject = null) {
    super(data, parentObject);
  }

  build() {
    this.position.z = Z_POSITIONING.STAR;
    if (this.castShadow === undefined) {
      this.castShadow = true;
    }
    if (this.receiveShadow === undefined) {
      this.receiveShadow = false;
    }

    super.build();

    const pointLightEffect = new PointLightEffect({
      color: this.color
    });
    pointLightEffect.build();
    this.addEffect(pointLightEffect);

  }
}

export default Star;
