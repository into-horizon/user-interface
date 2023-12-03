import ApiService from "./ApiService";

class Store extends ApiService {
  constructor() {
    super();
    this.path = "api/v1/store";
  }
  async getStore(id) {
    try {
      let result = await this.get(`${this.path}/id/${id}`);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const StoreService = new Store();
export default StoreService;
