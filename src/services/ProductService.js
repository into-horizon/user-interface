import ApiService from "./ApiService";

export default class ProductService extends ApiService{
    constructor(){
        super();
        this.path = "product";
    }

    async getAllProducts(endpoint = 'list', limit = 10, offset= 0){
       
        try { 
            let res = await this.get(`${this.path}/${endpoint}`, {offset: offset, limit:limit}); 
            return res.data;
        } catch (error) {
            throw new Error(error.message); 
        }
    }

    async getProduct(endpoint =null , id){
        try { 
            let res = await this.get(`${this.path}/${id}/${endpoint}`);  
            return res;
        } catch (error) {
            throw new Error(error.message); 
        }
    }
    async deleteProduct(id){
        try { 
            let res = await this.delete(`${this.path}/${id}`); 
            return res.data;
        } catch (error) {
            throw new Error(error.message); 
        }
    }
    async updateProduct(data){
        try { 
            let res = await this.put(`${this.path}`, data); 
            return res.data;
        } catch (error) {
            throw new Error(error.message); 
        }
    }
    async addProduct(data){
        try { 
            let res = await this.post(`${this.path}`, data); 
            return res.data;
        } catch (error) {
            throw new Error(error.message); 
        }
    }
}