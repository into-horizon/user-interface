import ApiService from "./ApiService";

class Follower extends ApiService {
  constructor() {
    super();
    this.path = "api/v1/store/follower";
  }

  async followStore(id) {
    try {
      let response = await this.post(this.path, { store_id: id });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async unfollowStore(id) {
    try {
      let response = await this.delete(this.path, { store_id: id });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getFollowingStore() {
    try {
      let result = await this.get("api/v1/store/following");
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
const followerService = new Follower();
export default followerService;
