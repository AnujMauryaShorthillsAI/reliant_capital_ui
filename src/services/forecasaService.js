import http from './httpService';
import { getKey } from './authService';

http.setBasicAuth(getKey());

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + '/forecasa';

export async function getStates(){
    return http.get(apiEndpoint+'/states');
}

export async function getCompanies(data){
    return http.post(apiEndpoint+'/companies', data);
}