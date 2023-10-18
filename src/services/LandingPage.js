import ApiService from "./ApiService";

class LandingPage extends ApiService {
  constructor() {
    super()
    this.path = "api/v1";
  }
 async getTopStores() {
    try {
      return await this.get(`${this.path}/stores/count`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}


export default new LandingPage()
