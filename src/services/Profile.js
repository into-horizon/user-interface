// import ApiService from "./ApiService";
// import cookie from 'react-cookies';
// class Profile extends ApiService {
//     constructor(){
//         super();
//         this.path='auth';
//         this.token=cookie.load('access_token');
//     }
//     async getProfile(){
//         try {
//             let response = await this.get(`${this.path}/profile`,null,this.bearer(this.token));
//             return response;
//         } catch (error) {
//             return error;
//         }
//     }
//     async updateProfileInfo(data){
//         try {
//             let response =await this.put(`${this.path}/update/profile`,data,this.bearer(this.token));
//             return response;
//         } catch (error) {
//             return error;
//         }
//     }
//     async updateEmail(data){
//         try {
//             let response =await this.put(`${this.path}/user/email`,data,this.bearer(this.token));
//             return response;
//         } catch (error) {
//             return error;
//         }
//     }
//     async updatePicture(data){
//         try {
//             let response =await this.put(`${this.path}/profile/picture`,data,this.bearer(this.token));
//             return response;
//         } catch (error) {
//             return error;
//         }
//     }
//     async deactivate(){
//         try {
//             let response =await this.put(`${this.path}/deactivate`,null,this.bearer(this.token));
//             return response;
//         } catch (error) {
//             return error;
//         }
//     }
// }
// let ProfileService = new Profile();
// export default ProfileService;