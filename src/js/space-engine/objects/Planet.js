import * as THREE from 'three';
import SpaceObject from './SpaceObject.js';

class Planet extends SpaceObject {
  constructor(data, parentObject = null) {
    super(data, parentObject);
  }

  build() {
    super.build();
  }
}

export default Planet;
