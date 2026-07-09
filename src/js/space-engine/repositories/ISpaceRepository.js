/**
 * Base interface for space object repositories.
 * All implementations must extend this class and implement
 * abstract methods for data retrieval.
 */
export class ISpaceRepository {
  /**
   * Retrieve all space objects.
   * @returns {Promise<Array>} Array of space objects.
   */
  async getSpaceObjects() {
    throw new Error("Method getSpaceObjects() must be implemented");
  }

  /**
   * Retrieve a space object by its ID.
   * @param {number|string} id — Object identifier.
   * @returns {Promise<Object|null>} Space object or null if not found.
   */
  async getSpaceObjectById(id) {
    throw new Error("Method getSpaceObjectById() must be implemented");
  }
}
