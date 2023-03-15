import axios from "axios";

export default class LoginService {
    static async getAccountData(phone,password) {
        //const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
        const response = Math.random() > 0.5 ? 'manager' : 'cashier'
        return response;
    }
}
