import axios from 'axios';

const createInstance = (token) => {
    return axios.create({
        baseURL : "",
        headers :{
            Authentication: `Bearer ${token}`,
            "Content-Type":"application/json"
        }
    });
}

const APIService = {

    authenticateWithClio : () => {
        const instance = axios.create({
            baseURL : "https://app.clio.com/oauth/authorize",
            headers : {
                "Access-Control-Allow-Origin": "localhost:3000",
                "Content-Type":"application/json"
            }
        });
      return instance.get("?response_type=code&client_id=QvTCUKgfKZVCfapywEpqOJ5wReAKM9RYDS7Ko9Tq&redirect_uri=http%3A%2F%2Flocalhost:3000");
    },
    get: () => {
      const instance = createInstance("test");
      console.log(instance);
    },
}

export { APIService};