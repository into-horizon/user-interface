import ApiService from "./ApiService";
class Auth extends ApiService {
  constructor() {
    super();
    this.path = "auth";
    this.path2 = "api/v1";
    //    this.token=cookie.load('access_token');
  }
  async register(data) {
    try {
      let response = await this.post(`${this.path}/signup`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getProfile() {
    try {
      let response = await this.get(`${this.path}/profile`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async updateProfileInfo(data) {
    try {
      let response = await this.update(`${this.path}/update/profile`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async updateEmail(data) {
    try {
      let response = await this.update(`${this.path}/user/email`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async updateMobile(data) {
    try {
      let response = await this.update(`${this.path}/user/mobile`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async insertAddress(data) {
    try {
      let response = await this.post(`${this.path2}/add/address`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getAddress(data) {
    try {
      let response = await this.get(`${this.path2}/get/address`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async updateAddress(data) {
    try {
      let response = await this.update(`${this.path2}/update/address`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async removeAddress(data) {
    try {
      let response = await this.update(`${this.path2}/remove/address`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async updatePicture(data) {
    try {
      let response = await this.update(`${this.path2}/profile/picture`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async removePicture(data) {
    try {
      let response = await this.delete(`${this.path2}/profile/picture`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async deactivate() {
    try {
      let response = await this.update(`${this.path}/deactivate`, null);
      return response;
    } catch (error) {
      return error;
    }
  }
  async verification() {
    try {
      let response = await this.post(`${this.path}/user/verification`, null);
      return response;
    } catch (error) {
      return error;
    }
  }
  async verify(data) {
    try {
      let response = await this.post(`${this.path}/user/verify`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async login(data) {
    try {
      let response = await this.post(
        `${this.path}/signin`,
        null,
        this.basic(data)
      );
      return response;
    } catch (error) {
      return error;
    }
  }
  async logout() {
    try {
      let response = await this.post(`${this.path}/signout`, null);
      return response;
    } catch (error) {
      return error;
    }
  }
  async changePassword(data) {
    try {
      let response = await this.update(`${this.path}/user/password`, data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async checkAPI() {
    try {
      return await this.get("");
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
        userType: "user",
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
