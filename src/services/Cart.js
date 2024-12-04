import ApiService from './ApiService';

class Cart extends ApiService {
  constructor() {
    super();
    this.path = 'api/v1/cart_item';
    this.cartPath = 'api/v1/cart';
  }

  async addCartItem(data) {
    return await this.post(`${this.path}/add`, data);
  }
  async removeCartItem(data) {
    return await this.delete(`${this.path}/remove`, data);
  }
  async getCartItems() {
    return await this.get(`${this.path}/getAll`);
  }
  async updateCartItem(data) {
    return await await this.put(`${this.path}/update`, data);
  }
  async updateCart(data) {
    return await this.put(`${this.cartPath}/update`, data);
  }
}
const NewCart = new Cart();
export default NewCart;
