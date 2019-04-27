import axios from 'axios';

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
            baseURL: "/auth",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return instance.get();
    },
    get: () => {
        const instance = createInstance("test");
        console.log(instance);
    },
}

export { APIService };
