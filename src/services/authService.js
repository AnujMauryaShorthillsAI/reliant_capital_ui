const USERNAME = process.env.REACT_APP_API_USERNAME;
const PASSWORD = process.env.REACT_APP_API_PASSWORD;
const tokenKey = "token"

export function login(username, password) {
    if(username == USERNAME && password == PASSWORD){
        const auth_key = "Basic " + btoa(USERNAME+":"+PASSWORD);

        localStorage.setItem(tokenKey, auth_key)

        console.log('User Logged In Successfully!');
        return true;
    }

    return false;
}

export function getKey() {
    return localStorage.getItem(tokenKey);
}