import ApiService from "./ApiService";

class Product extends ApiService {
  constructor() {
    super();
    this.path = "api/v1";
    this.pathProduct = "api/v1/product";
  }
  async getParentCategory() {
    try {
      let { response } = await this.get(`${this.path}/getAll/PG`, null, null);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getChildCategory() {
    try {
      let { response } = await this.get(`${this.path}/getAll/CG`, null, null);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getGrandChildCategory() {
    try {
      let { response } = await this.get(`${this.path}/getAll/GCG`, null, null);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getProduct(id) {
    try {
      let response = await this.get(`${this.path}/product/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getProductByCategory(G, C, P) {
    try {
      let params = { G: G, C: C, P: P };
      let response = await this.get(
        `${this.path}/productsByCategories`,
        params,
        null
      );

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async productsSearch(params) {
    try {
      let results = await this.get(`${this.path}/products/search`, params);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getProductsByStore(id, data) {
    try {
      let results = await this.get(`${this.path}/product/store/id/${id}`, data);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addProductReview(data) {
    try {
      let results = await this.post(`${this.pathProduct}/review`, data);
      return results;
    } catch (error) {
      return error;
    }
  }
  async getProductReviews(id, query) {
    try {
      let results = await this.get(`${this.pathProduct}/reviews/${id}`, query);
      return results;
    } catch (error) {
      return error;
    }
  }
}

const productService = new Product();
export default productService;
