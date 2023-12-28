import ApiService from "./ApiService";

class Wishlist extends ApiService {
  constructor() {
    super();
    this.path = "api/v1/wishlist";
  }

  async getItems(params) {
    try {
      let result = await this.get(`${this.path}`, params);
      return result;
    } catch (error) {
      return error.message;
    }
  }
  async getItemsIds() {
    try {
      const data = await this.get(`${this.path}/ids`);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addItem(data) {
    console.log("🚀 ~ file: Wishlist.js:26 ~ Wishlist ~ addItem ~ data:", data)
    try {
      let result = await this.post(`${this.path}`, data);
      return result;
    } catch (error) {
      return error.message;
    }
  }
  async deleteItem(item) {
    try {
      let result = await this.delete(`${this.path}`, item);
      return result;
    } catch (error) {
      return error.message;
    }
  }
}

const NewWishlist = new Wishlist();

export default NewWishlist;
