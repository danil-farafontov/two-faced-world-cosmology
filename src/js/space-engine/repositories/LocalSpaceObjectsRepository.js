import { ISpaceRepository } from './ISpaceRepository.js';
import { SPACE_OBJECTS } from '../constants/space-objects-data.js';

/**
 * Local repository implementation that serves space objects
 * from the embedded SPACE_OBJECTS data with simulated network delay.
 */
export class LocalSpaceObjectsRepository extends ISpaceRepository {
  /**
   * Simulated network delay in milliseconds.
   */
  constructor(delayMs) {
    super();
    this.delayMs = delayMs || 350;
  }

  /**
   * Simulate async network delay.
   * @returns {Promise<void>}
   */
  _simulateDelay() {
    return new Promise((resolve) => setTimeout(resolve, this.delayMs));
  }

  /**
   * @inheritdoc
   */
  getSpaceObjects() {
    return this._simulateDelay().then(() => [...SPACE_OBJECTS]);
  }

  /**
   * @inheritdoc
   */
  getSpaceObjectById(id) {
    return this._simulateDelay().then(() => {
      // Search in top-level objects
      let obj = SPACE_OBJECTS.find((item) => item.id === id);
      if (obj) return obj;

      // Search in nested moons
      for (const parent of SPACE_OBJECTS) {
        if (Array.isArray(parent.moons)) {
          obj = parent.moons.find((moon) => moon.id === id);
          if (obj) return obj;
        }
      }

      return null;
    });
  }
}
