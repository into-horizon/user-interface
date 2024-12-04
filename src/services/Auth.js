import ApiService from './ApiService';
class Auth extends ApiService {
  constructor() {
    super();
    this.path = 'auth';
    this.path2 = 'api/v1';
  }
  async register(data) {
    return await this.post(`${this.path}/signup`, data);
  }
  async getProfile() {
    return await this.get(`${this.path}/profile`);
  }
  async updateProfileInfo(data) {
    return await this.update(`${this.path}/update/profile`, data);
  }
  async updateEmail(data) {
    return await this.update(`${this.path}/user/email`, data);
  }
  async updateMobile(data) {
    return await this.update(`${this.path}/user/mobile`, data);
  }
  async insertAddress(data) {
    return await this.post(`${this.path2}/add/address`, data);
  }
  async getAddress(data) {
    return await this.get(`${this.path2}/get/address`, data);
  }
  async updateAddress(data) {
    return await this.update(`${this.path2}/update/address`, data);
  }
  async removeAddress(data) {
    return await this.update(`${this.path2}/remove/address`, data);
  }
  async updatePicture(data) {
    return await this.update(`${this.path2}/profile/picture`, data);
  }
  async removePicture(data) {
    return await this.delete(`${this.path2}/profile/picture`, data);
  }
  async deactivate() {
    return await this.update(`${this.path}/deactivate`, null);
  }
  async verification() {
    return await this.post(`${this.path}/user/verification`, null);
  }
  async verify(data) {
    return await this.post(`${this.path}/user/verify`, data);
  }
  async login(data) {
    return await this.post(`${this.path}/signin`, null, this.basic(data));
  }
  async logout() {
    return await this.post(`${this.path}/signout`, null);
  }
  async changePassword(data) {
    return await this.update(`${this.path}/user/password`, data);
  }
  async checkAPI() {
    try {
      return await this.get('');
    } catch (error) {
      throw error;
    }
  }
  async verifyCode(code) {
    try {
      return this.post(`${this.path}/verify-code`, { code });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async requestVerificationCode() {
    try {
      return this.update(`${this.path}/verify-code`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async resetPasswordProvideReference(reference) {
    try {
      return this.post(`${this.path}/user/password/generateToken`, {
        reference,
        userType: 'user',
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async resetPassword(data) {
    try {
      return this.post(`${this.path}/user/password/resetByToken`, data);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async validateResetToken(token) {
    try {
      return this.post(`${this.path}/user/password/validateToken`, { token });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async signupWithGoogle(data) {
    try {
      return await this.get(`${this.path}/google/callback${data}`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async signupWithFacebook(data) {
    try {
      return await this.get(`${this.path}/facebook/callback${data}`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

let AuthService = new Auth();
export default AuthService;
