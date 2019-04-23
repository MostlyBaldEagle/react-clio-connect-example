import axios from 'axios';
import { ClioConstants } from '../constants/clio.constants'

const createInstance = (token) => {
    return axios.create({
        baseURL: "",
        headers: {
            Authentication: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
}

const APIService = {

    authenticateWithClio: () => {
        const instance = axios.create({
            baseURL: "http://localhost:2000/oauth/authorize",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return instance.get(`?response_type=code&client_id=${ClioConstants.CLIENT_ID}&redirect_uri=http%3A%2F%2F${ClioConstants.HOST}`);
    },
    get: () => {
        const instance = createInstance("test");
        console.log(instance);
    },
}

export { APIService };
