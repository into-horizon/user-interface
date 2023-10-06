import axios from "axios";
import { isJwtExpired } from "jwt-check-expiration";
import cookie from "react-cookies";
let api = process.env.REACT_APP_API;

axios.defaults.baseURL = api;
export default class ApiService {
  static headers(token) {
    return token
      ? {
          session_id: cookie.load("session_id"),
          Authorization: `Bearer ${token}`,
          locale: localStorage.getItem("i18nextLng"),
        }
      : { locale: localStorage.getItem("i18nextLng") };
  }
  basic(data) {
    return {
      Authorization: ` Basic ${btoa(`${data.email}:${data.password}`)}`,
    };
  }

  static async token() {
    const token = cookie.load("access_token");

    if (!token) return;
    else if (!isJwtExpired(token)) {
      return token;
    } else {
      let { refresh_token, access_token, status, session_id } =
        await new ApiService().post("auth/refresh", undefined, {
          Authentication: `Bearer ${cookie.load("refresh_token")}`,
        });
      if (status === 200) {
        cookie.remove("access_token", { path: "/" });
        cookie.remove("refresh_token", { path: "/" });
        cookie.save("access_token", access_token, { path: "/" });
        cookie.save("refresh_token", refresh_token, { path: "/" });

        return access_token;
      } else console.log("expired session");
    }
  }
  async get(endpoint, params) {
    let res = await axios({
      method: "get",
      url: `/${endpoint}`,
      params: params,
      // headers: this.bearer(await this.token()),
    });

    return res.data;
  }

  async post(endpoint, data, headers, params = null) {
    let res = await axios({
      method: "post",
      url: `/${endpoint}`,
      data: data,
      params: params,
      headers: headers,
    });
    return res.data;
  }

  async update(endpoint, data, params = null) {
    let res = await axios({
      method: "put",
      url: `/${endpoint}`,
      params: params,
      data: data,
      // headers: this.bearer(await this.token()),
    });
    return res.data;
  }

  async delete(endpoint, data, params) {
    let res = await axios({
      method: "delete",
      url: `/${endpoint}`,
      params: params,
      data: data,
      // headers: this.bearer(await this.token()),
    });
    return res.data;
  }
  session() {
    let session_id = cookie.load("session_id");
    return session_id;
  }
  static async setDefaultHeaders() {
    console.log("setDefaultHeaders");
    axios.defaults.headers.common = ApiService.headers(
      await ApiService.token()
    );
    console.log(
      "🚀 ~ file: ApiService.js:96 ~ ApiService ~ setDefaultHeaders ~ axios.defaults.headers.common:",
      axios.defaults.headers.common
    );
  }
}
(async () => await ApiService.setDefaultHeaders())();
