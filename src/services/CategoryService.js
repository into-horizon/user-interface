import ApiService from "./ApiService";

class CategoryService extends ApiService {
  constructor() {
    super();
    this.path = "api/v1/user/category";
  }

  async getAllCategories() {
    try {
      let res = await this.get(this.path);
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getChildWithProducts(){
    try {
      return await this.get(`api/v1/category/child-with-products`)
    } catch (error) {
      throw new Error(error.message);
      
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;
