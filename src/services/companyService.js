import http from "./httpService";
import { getKey } from "./authService";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + '/company';

http.setBasicAuth(getKey());

export async function getCompanies(data){
    return http.post(apiEndpoint+'/filter', data)
}

export async function saveCompanies(data){
    return http.post(apiEndpoint+'/add', data);
}

export async function filterValue(){
    return http.post(apiEndpoint+'/value');
}