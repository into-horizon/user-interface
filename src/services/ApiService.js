import axios from 'axios';
import { isJwtExpired } from 'jwt-check-expiration';
import cookie from 'react-cookies';
let api = process.env.REACT_APP_API;
const apiAxios = axios.create();
apiAxios.defaults.baseURL = api;
export default class ApiService {
  constructor() {
    apiAxios.interceptors.request.use(async (config) => {
      const token = await this.token();
      const sessionId = this.session();
      const lang = localStorage.getItem('i18nextLng') || 'en';
      if (token && sessionId) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.session_id = sessionId;
      }
      config.headers.locale = lang;
      return config;
    });
  }

  // static headers(token) {
  //   return token
  //     ? {
  //         session_id: cookie.load('session_id'),
  //         Authorization: `Bearer ${token}`,
  //         locale: localStorage.getItem('i18nextLng'),
  //       }
  //     : { locale: localStorage.getItem('i18nextLng') };
  // }
  basic(data) {
    return {
      Authorization: ` Basic ${btoa(`${data.email}:${data.password}`)}`,
    };
  }

  async token() {
    const token = cookie.load('access_token');
    const _refresh_token = cookie.load('refresh_token');
    const _session_id = cookie.load('session_id');
    if (!token) return;
    else if (!isJwtExpired(token)) {
      return token;
    } else {
      apiAxios.defaults.headers.common['Authorization'] = _refresh_token;
      apiAxios.defaults.headers.common['session_id'] = _session_id;
      let { refresh_token, access_token, status, session_id } =
        await new ApiService().post('auth/refresh');
      if (status === 200) {
        apiAxios.defaults.headers.common['Authorization'] = access_token;
        cookie.remove('access_token', { path: '/' });
        cookie.remove('refresh_token', { path: '/' });
        cookie.remove('session_id', { path: '/' });
        cookie.save('access_token', access_token, { path: '/' });
        cookie.save('session_id', session_id, { path: '/' });
        cookie.save('refresh_token', refresh_token, { path: '/' });

        return access_token;
      } else return;
    }
  }
  async get(endpoint, params) {
    try {
      let res = await apiAxios({
        method: 'get',
        url: `/${endpoint}`,
        params: params,
      });

      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  async post(endpoint, data, headers, params = null) {
    try {
      let res = await apiAxios({
        method: 'post',
        url: `/${endpoint}`,
        data,
        params,
        headers,
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  async put(endpoint, data, params = null) {
    try {
      let res = await apiAxios({
        method: 'put',
        url: `/${endpoint}`,
        params: params,
        data: data,
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  async delete(endpoint, data, params) {
    try {
      let res = await apiAxios({
        method: 'delete',
        url: `/${endpoint}`,
        params: params,
        data: data,
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
  session() {
    let session_id = cookie.load('session_id');
    return session_id;
  }
}
