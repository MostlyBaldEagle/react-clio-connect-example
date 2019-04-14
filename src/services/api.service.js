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
            baseURL: "https://app.clio.com/oauth/authorize",
            crossdomain:true,
        });
        return instance.get("?response_type=code&client_id=fzaXZvrLWZX747wQQRNuASeVCBxaXpJaPMDi7F96&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&state=xyz HTTP/1.1");
    },
    get: () => {
        const instance = createInstance("token");
        console.log("instance: ",instance);
    }
}

export { APIService };