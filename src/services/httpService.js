import axios from "axios";

axios.interceptors.response.use((response) => response, error => {
    const expectedError = error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;
    
    if(!expectedError){
        console.log(error);
    }

    return Promise.reject(error);
})

function setBasicAuth(key){
    console.log(key);
    axios.defaults.headers.common["Authorization"] = key;
    console.log(axios.defaults.headers);
} 

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setBasicAuth
};